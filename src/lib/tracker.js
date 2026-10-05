import { API_BASE_URL } from "../config/api";

// Browser side of Module 48 (dual-track events) + ad attribution:
//   - an anonymous id (device) and a session id, sent with every event to
//     POST /events/track; the id is linked to the person when they sign in
//     or enquire (identity_links) so their history is not lost;
//   - UTM / click-id capture: first touch is kept for good, last touch is
//     refreshed on every tagged visit - both ride on every event and on
//     enquiries, so the lead carries its campaign;
//   - GA4 and the Meta Pixel (only when VITE_GA4_MEASUREMENT_ID /
//     VITE_META_PIXEL_ID are set, and only after the visitor accepts
//     analytics cookies). Events carry the same event_id the server
//     forwards through the Measurement Protocol / Conversions API, so the
//     two tracks de-duplicate.
// Nothing here ever throws into the app.

const GA4_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID || "";
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID || "";
const K = { anon: "ps_anon_id", first: "ps_first_touch", last: "ps_last_touch", consent: "ps_analytics_consent", session: "ps_session" };
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const CLICK_IDS = ["gclid", "fbclid", "msclkid", "ad_id"];

const store = {
  get(key, session = false) {
    try {
      return (session ? sessionStorage : localStorage).getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value, session = false) {
    try {
      (session ? sessionStorage : localStorage).setItem(key, value);
    } catch {
      /* private mode */
    }
  },
};

const uuid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}-${Math.random().toString(16).slice(2)}`);
const json = (v) => {
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
};

export function anonymousId() {
  let id = store.get(K.anon);
  if (!id) {
    id = uuid();
    store.set(K.anon, id);
  }
  return id;
}

function sessionId() {
  let id = store.get(K.session, true);
  if (!id) {
    id = uuid();
    store.set(K.session, id, true);
  }
  return id;
}

// Read UTM / click ids from the landing URL. Runs on every navigation; only
// a tagged URL (or the very first visit) writes anything.
export function captureAttribution() {
  const params = new URLSearchParams(window.location.search);
  const touch = {};
  for (const k of [...UTM_KEYS, ...CLICK_IDS]) {
    const v = params.get(k);
    if (v) touch[k] = v.slice(0, 150);
  }
  const tagged = Object.keys(touch).length > 0;
  const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer.slice(0, 300) : "";
  if (!tagged && store.get(K.first)) return;
  const entry = {
    ...touch,
    source: touch.utm_source || (touch.gclid ? "google" : touch.fbclid ? "facebook" : ref ? new URL(ref).hostname : "direct"),
    medium: touch.utm_medium || (touch.gclid || touch.fbclid ? "cpc" : ref ? "referral" : "none"),
    campaign: touch.utm_campaign || undefined,
    keyword: touch.utm_term || undefined,
    ad_id: touch.ad_id || undefined,
    referrer: ref || undefined,
    landing_page: window.location.pathname,
    at: new Date().toISOString(),
  };
  if (!store.get(K.first)) store.set(K.first, JSON.stringify(entry));
  if (tagged || !store.get(K.last)) store.set(K.last, JSON.stringify(entry));
}

export function attribution() {
  const first = json(store.get(K.first));
  const last = json(store.get(K.last)) || first;
  if (!first) return {};
  return { first_touch: first, last_touch: last, utm_source: last?.utm_source, utm_medium: last?.utm_medium, utm_campaign: last?.utm_campaign, source: last?.source };
}

function device() {
  return { screen: `${window.screen?.width || 0}x${window.screen?.height || 0}`, lang: navigator.language, pwa: window.matchMedia?.("(display-mode: standalone)").matches || false };
}

// ------------------------------------------------------------ first-party

let queue = [];
let timer = null;
let authToken = null;

function flush(useBeacon = false) {
  if (!queue.length) return;
  const body = JSON.stringify({ anonymousId: anonymousId(), sessionId: sessionId(), attribution: attribution(), events: queue.splice(0, 50) });
  try {
    if (useBeacon && navigator.sendBeacon && !authToken) {
      navigator.sendBeacon(`${API_BASE_URL}/events/track`, new Blob([body], { type: "application/json" }));
      return;
    }
    fetch(`${API_BASE_URL}/events/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}) },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* never break the page */
  }
}

// GA4 / Pixel names for the events that matter to ad platforms.
const AD_EVENTS = {
  page_view: ["page_view", "PageView"],
  property_view: ["view_item", "ViewContent"],
  search_performed: ["search", "Search"],
  registration_completed: ["sign_up", "CompleteRegistration"],
  login: ["login", null],
  shortlist_added: ["add_to_wishlist", "AddToWishlist"],
  site_visit_requested: ["schedule", "Schedule"],
  lead_submitted: ["generate_lead", "Lead"],
  whatsapp_click: ["contact", "Contact"],
  call_click: ["contact", "Contact"],
};
// Sent to the API as well (the rest are ad-platform only).
const FIRST_PARTY = new Set(["page_view", "property_view", "search_performed", "button_click", "whatsapp_click", "call_click", "registration_started", "registration_completed", "login", "shortlist_added", "site_visit_requested"]);

export function track(type, properties = {}, { eventId } = {}) {
  try {
    const id = eventId || uuid();
    if (FIRST_PARTY.has(type)) {
      queue.push({ type, ts: new Date().toISOString(), properties: { ...properties, url: window.location.pathname + window.location.search }, device: device() });
      clearTimeout(timer);
      timer = setTimeout(() => flush(), type === "page_view" ? 1500 : 400);
    }
    if (hasConsent()) {
      const [ga, fb] = AD_EVENTS[type] || [type, null];
      if (GA4_ID && window.gtag && type !== "page_view") window.gtag("event", ga, { ...properties, event_id: id });
      if (PIXEL_ID && window.fbq && fb) window.fbq("track", fb, properties, { eventID: id });
    }
    return id;
  } catch {
    return null;
  }
}

export function trackPageView() {
  captureAttribution();
  track("page_view", { title: document.title, referrer: document.referrer || undefined });
  if (hasConsent() && GA4_ID && window.gtag) window.gtag("event", "page_view", { page_location: window.location.href, page_title: document.title });
}

// Link this browser to the signed-in person.
export function identify(token) {
  authToken = token || null;
  if (!token) return;
  fetch(`${API_BASE_URL}/events/identify`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ anonymousId: anonymousId() }),
  }).catch(() => {});
}

// ------------------------------------------------------------ GA4 + Pixel

export const analyticsConfigured = () => !!(GA4_ID || PIXEL_ID);
export const consentState = () => store.get(K.consent); // "granted" | "denied" | null
export const hasConsent = () => store.get(K.consent) === "granted";

let loaded = false;
function loadTags() {
  if (loaded || !hasConsent()) return;
  loaded = true;
  if (GA4_ID) {
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA4_ID)}`;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
    window.gtag("js", new Date());
    // SPA: page views are sent on route change, not automatically.
    window.gtag("config", GA4_ID, { send_page_view: false, anonymize_ip: true });
    window.gtag("event", "page_view", { page_location: window.location.href, page_title: document.title });
  }
  if (PIXEL_ID && !window.fbq) {
    /* Meta Pixel base code */
    const n = (window.fbq = function fbq() {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    });
    if (!window._fbq) window._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    const t = document.createElement("script");
    t.async = true;
    t.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(t);
    window.fbq("init", PIXEL_ID, { external_id: anonymousId() });
    window.fbq("track", "PageView");
  }
}

export function setConsent(granted) {
  store.set(K.consent, granted ? "granted" : "denied");
  if (granted) loadTags();
}

export function initTracker() {
  captureAttribution();
  anonymousId();
  loadTags();
  window.addEventListener("pagehide", () => flush(true));
  document.addEventListener("visibilitychange", () => document.visibilityState === "hidden" && flush(true));
  // Call / WhatsApp links anywhere on the site.
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target?.closest?.("a[href]");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (/^tel:/i.test(href)) track("call_click", { context: window.location.pathname });
      else if (/wa\.me|api\.whatsapp\.com|^whatsapp:/i.test(href)) track("whatsapp_click", { context: window.location.pathname });
    },
    true
  );
}
