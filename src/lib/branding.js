// Sec. 14 franchise branding. On load the site asks the API what brand the
// host it was opened on belongs to and applies it:
//   - white label: the franchisee's name, logo, colours, font and texts
//   - A R Buildwel representative (default): nothing changes except the
//     firm's own name, shown small in the footer
// On propertyserch.com itself the API answers "no branding" and nothing happens.
import { useEffect, useState } from "react";

const state = { branding: null, listeners: new Set() };
const FONTS = ["Plus Jakarta Sans", "Inter", "Poppins", "Roboto", "Lato", "Open Sans", "Montserrat", "Noto Sans"];
const hex = (v) => (/^#[0-9a-fA-F]{6}$/.test(String(v || "")) ? v : null);

function applyTheme(b) {
  const primary = hex(b.primaryColor);
  const secondary = hex(b.secondaryColor);
  const root = document.documentElement;
  if (primary) root.style.setProperty("--primary-color", primary);
  if (secondary) root.style.setProperty("--secondary-color", secondary);
  // The site's brand red and ink are written as fixed colours in the
  // components, so they are re-pointed at the variables here.
  const rules = [];
  if (primary) {
    rules.push(
      `[class*="bg-[#E51C23]"], .cta-red { background-color: var(--primary-color) !important; background-image: none !important; }`,
      `[class*="text-[#E51C23]"] { color: var(--primary-color) !important; }`,
      `[class*="border-[#E51C23]"] { border-color: var(--primary-color) !important; }`
    );
  }
  if (secondary) rules.push(`[class*="bg-[#111827]"] { background-color: var(--secondary-color) !important; }`);
  if (b.fontFamily && FONTS.includes(b.fontFamily)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(b.fontFamily).replace(/%20/g, "+")}:wght@400;600;700;800&display=swap`;
    document.head.appendChild(link);
    rules.push(`body, [class*="font-['Plus_Jakarta_Sans']"] { font-family: "${b.fontFamily}", system-ui, sans-serif !important; }`);
  }
  if (rules.length) {
    const style = document.createElement("style");
    style.id = "franchise-brand";
    style.textContent = rules.join("\n");
    document.head.appendChild(style);
  }
  if (b.faviconUrl && /^https:\/\//.test(b.faviconUrl)) {
    let icon = document.querySelector('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement("link");
      icon.rel = "icon";
      document.head.appendChild(icon);
    }
    icon.href = b.faviconUrl;
  }
}

export async function initBranding({ apiBase }) {
  try {
    const here = window.location.hostname;
    // On a developer machine the host can be given in the address to check a franchisee's site.
    const local = here === "localhost" || here === "127.0.0.1";
    const host = (local && new URLSearchParams(window.location.search).get("brand_host")) || here;
    const res = await fetch(`${apiBase}/branding?host=${encodeURIComponent(host)}`).then((r) => r.json());
    const b = res?.data;
    if (!b) return;
    state.branding = b;
    if (b.brandMode === "white_label") applyTheme(b);
    state.listeners.forEach((fn) => fn(b));
  } catch {
    /* keep the platform's own look */
  }
}

export const getBranding = () => state.branding;

export function useBranding() {
  const [b, setB] = useState(state.branding);
  useEffect(() => {
    setB(state.branding);
    state.listeners.add(setB);
    return () => state.listeners.delete(setB);
  }, []);
  return b;
}
