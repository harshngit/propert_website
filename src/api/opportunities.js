import { apiRequest } from "./client";

// Bank auction / special situation deals - backed by backendapi's
// src/routes/opportunity.routes.js. Anonymous callers (and users without a
// verified investor profile) get masked teasers; staff, brokers and verified
// NRI/HNI investors get full details from the authenticated endpoints.

function toQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value);
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function listPublicOpportunities(params = {}, token) {
  const res = await apiRequest(`/opportunities/public${toQuery(params)}`, { token });
  return res.data;
}

export async function listOpportunities(params = {}, token) {
  const res = await apiRequest(`/opportunities${toQuery(params)}`, { token });
  return res.data;
}

export async function getOpportunityAccess(token) {
  const res = await apiRequest("/opportunities/access", { token });
  return res.data;
}

export async function getOpportunity(id, token) {
  const res = await apiRequest(`/opportunities/${id}`, { token });
  return res.data;
}

export async function expressInterest(id, body, token) {
  const res = await apiRequest(`/opportunities/${id}/interest`, { method: "POST", body, token });
  return res;
}
