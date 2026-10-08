import { apiRequest } from "./client";
import { anonymousId } from "../lib/tracker";

// Public, unauthenticated property search/detail endpoints - backed by
// backendapi's src/routes/search.routes.js. Only ever returns `approved`
// listings.

// `token` (optional) lets the API rank by the signed-in buyer's own requirement matches;
// the anonymous visitor id is only used to count a sponsored listing's impression once.
export async function searchProperties(params = {}, token) {
  const query = new URLSearchParams();
  query.set("viewer", anonymousId());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value);
  });
  const qs = query.toString();
  const res = await apiRequest(`/search/properties${qs ? `?${qs}` : ""}`, { token: token || undefined });
  return res.data;
}

export async function getPropertyById(id) {
  const res = await apiRequest(`/search/properties/${id}`);
  return res.data;
}

export async function getFilterOptions() {
  const res = await apiRequest("/search/filters");
  return res.data;
}
