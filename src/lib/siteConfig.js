// Dropdown lists and text the Super Admin sets in the dashboard's Site
// configuration (GET /site-config?app=website). Each caller passes its own
// built-in value as the fallback, so the site looks the same before the
// config loads or if the call fails.
import { useEffect, useState } from "react";

const state = { config: { options: {}, content: {} }, listeners: new Set() };

export async function initSiteConfig({ apiBase }) {
  try {
    const res = await fetch(`${apiBase}/site-config?app=website`).then((r) => r.json());
    if (!res?.data) return;
    state.config = { options: res.data.options || {}, content: res.data.content || {} };
    state.listeners.forEach((fn) => fn(state.config));
  } catch {
    /* keep the built-in lists and text */
  }
}

// Outside React (e.g. turning a filter into API params).
export function getOptions(key, fallback = []) {
  const remote = state.config.options[key];
  return remote?.length ? remote : fallback;
}

function useConfig() {
  const [config, setConfig] = useState(state.config);
  useEffect(() => {
    state.listeners.add(setConfig);
    setConfig(state.config);
    return () => state.listeners.delete(setConfig);
  }, []);
  return config;
}

export function useOptions(key, fallback = []) {
  const config = useConfig();
  const remote = config.options[key];
  return remote?.length ? remote : fallback;
}

// An empty value set by the Super Admin means hidden, so only a missing key falls back.
export function useSiteContent(key, fallback = "") {
  const config = useConfig();
  return config.content[key] ?? fallback;
}
