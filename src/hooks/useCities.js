import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

// Live cities come from the master data (admin-added, no code change). One
// shared fetch per page load.
let pending = null;
function loadCities() {
  if (!pending) {
    pending = apiRequest("/geo/cities?status=active")
      .then((r) => (r.data || []).map((c) => c.city_name).filter(Boolean))
      .catch(() => {
        pending = null;
        return [];
      });
  }
  return pending;
}

export function useCities() {
  const [cities, setCities] = useState([]);
  useEffect(() => {
    let alive = true;
    loadCities().then((list) => alive && setCities(list));
    return () => {
      alive = false;
    };
  }, []);
  return cities;
}

// "Popular searches" built from the live cities.
const SEARCH_PATTERNS = ["Flats for sale in", "Rent in", "Plots for sale in", "Villas in", "Offices in", "Homes in"];
export function useCitySearchTags(count = 6) {
  const cities = useCities();
  return cities.slice(0, count).map((city, i) => ({ label: `${SEARCH_PATTERNS[i % SEARCH_PATTERNS.length]} ${city}`, city }));
}
