import { useEffect, useState } from "react";
import { findNearestCity } from "../api/geo";

const CACHE_KEY = "ps_visitor_city";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;

function readCache() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) return cached.result;
  } catch {
    // storage unavailable - fall through and resolve again
  }
  return null;
}

function writeCache(result) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), result }));
  } catch {
    // storage unavailable - not needed for the page to work
  }
}

// The visitor's city from the browser's location (asks for permission).
// Returns { status, city, listingCity }: status is "pending" until resolved,
// then "resolved", or "unavailable" when location is denied / unsupported /
// fails. The resolved city is cached for a few hours so repeat visits don't
// wait on the location lookup again.
export function useVisitorCity() {
  const [state, setState] = useState(() => {
    const cached = readCache();
    return cached ? { status: "resolved", ...cached } : { status: "pending", city: null, listingCity: null };
  });

  useEffect(() => {
    if (state.status !== "pending") return undefined;
    if (!navigator.geolocation) {
      setState({ status: "unavailable", city: null, listingCity: null });
      return undefined;
    }
    let cancelled = false;
    const fail = () => !cancelled && setState({ status: "unavailable", city: null, listingCity: null });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        findNearestCity(position.coords.latitude, position.coords.longitude)
          .then((result) => {
            if (cancelled) return;
            const value = { city: result?.city || null, listingCity: result?.listingCity || null };
            writeCache(value);
            setState({ status: "resolved", ...value });
          })
          .catch(fail);
      },
      fail,
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60 * 60 * 1000 },
    );
    return () => {
      cancelled = true;
    };
  }, [state.status]);

  return state;
}
