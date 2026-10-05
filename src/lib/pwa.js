import { apiRequest } from "../api/client";

// PWA (Module 18): service worker registration, the "install app" prompt
// and web-push subscription. The service worker (public/sw.js) is only
// registered on a production build (or with VITE_ENABLE_SW=true) so it
// never caches a dev server.

const SW_ENABLED = import.meta.env.PROD || import.meta.env.VITE_ENABLE_SW === "true";
let installEvent = null;
const listeners = new Set();
const notify = () => listeners.forEach((fn) => fn(!!installEvent));

export function initPwa() {
  if (!("serviceWorker" in navigator)) return;
  if (SW_ENABLED) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    });
  }
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    installEvent = e;
    notify();
  });
  window.addEventListener("appinstalled", () => {
    installEvent = null;
    notify();
  });
}

export function onInstallAvailable(fn) {
  listeners.add(fn);
  fn(!!installEvent);
  return () => listeners.delete(fn);
}

export async function promptInstall() {
  if (!installEvent) return false;
  installEvent.prompt();
  const choice = await installEvent.userChoice.catch(() => null);
  installEvent = null;
  notify();
  return choice?.outcome === "accepted";
}

export const isStandalone = () => window.matchMedia?.("(display-mode: standalone)").matches || window.navigator.standalone === true;

// ------------------------------------------------------------ push

export const pushSupported = () => "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

const urlBase64ToUint8Array = (b64) => {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
};

async function registration() {
  const existing = await navigator.serviceWorker.getRegistration();
  return existing || navigator.serviceWorker.register("/sw.js");
}

// { supported, configured, permission, subscribed }
export async function pushState(token) {
  if (!pushSupported()) return { supported: false, configured: false, permission: "unsupported", subscribed: false };
  const server = await apiRequest("/notifications/push", { token }).then((r) => r.data).catch(() => ({ configured: false }));
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = reg ? await reg.pushManager.getSubscription() : null;
  return { supported: true, configured: !!server.configured, publicKey: server.publicKey, permission: Notification.permission, subscribed: !!sub };
}

export async function enablePush(token) {
  const state = await pushState(token);
  if (!state.supported) throw new Error("This browser does not support push notifications");
  if (!state.configured) throw new Error("Push notifications are not switched on yet");
  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("Notifications are blocked for this site - allow them in your browser settings");
  const reg = await registration();
  await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) || (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(state.publicKey) }));
  await apiRequest("/notifications/push", { method: "POST", token, body: { ...sub.toJSON(), app: "website" } });
  return true;
}

export async function disablePush(token) {
  const reg = await navigator.serviceWorker.getRegistration();
  const sub = reg ? await reg.pushManager.getSubscription() : null;
  if (!sub) return true;
  await apiRequest("/notifications/push", { method: "DELETE", token, body: { endpoint: sub.endpoint } }).catch(() => {});
  await sub.unsubscribe().catch(() => {});
  return true;
}

export const sendTestPush = (token) => apiRequest("/notifications/push/test", { method: "POST", token }).then((r) => r.data);
