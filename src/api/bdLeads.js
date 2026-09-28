import { API_BASE_URL } from "../config/api";
import { apiRequest } from "./client";

// "Get Involved" / "Advertise With Us" enquiries (backendapi's
// src/routes/bdLead.routes.js). Public - no login needed. Categories:
// city_addition, careers, broker, builder, franchisee, advertiser.
export async function submitBdLead(payload) {
  return apiRequest("/bd-leads", { method: "POST", body: payload });
}

// Careers applications may attach a resume, which needs multipart.
export async function submitCareersApplication(payload, resumeFile) {
  if (!resumeFile) return submitBdLead(payload);
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") form.append(key, value);
  });
  form.append("resume", resumeFile);
  const res = await fetch(`${API_BASE_URL}/bd-leads`, { method: "POST", body: form });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) {
    throw new Error(json?.errors?.[0]?.msg || json?.message || `Request failed with status ${res.status}`);
  }
  return json;
}
