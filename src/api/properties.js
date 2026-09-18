import { apiRequest } from "./client";

// Public, unauthenticated property search/detail endpoints - backed by
// backendapi's src/routes/search.routes.js. Only ever returns `approved`
// listings.

export async function searchProperties(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value);
  });
  const qs = query.toString();
  const res = await apiRequest(`/search/properties${qs ? `?${qs}` : ""}`);
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
