import { apiRequest } from "./client";

// Engine 7 - institutional assets (backend /api/institutional). Public
// calls return masked listings; the same listing call returns the full
// record once the signed-in buyer is qualified, has signed the NDA and has
// been approved.
const get = (path, token) => apiRequest(path, { token }).then((r) => r.data);

export const institutional = {
  meta: () => get("/institutional/meta"),
  list: (filters = {}) => {
    const q = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v !== undefined && v !== null && v !== "" && q.set(k, v));
    return get(`/institutional/listings${q.toString() ? `?${q}` : ""}`);
  },
  listing: (id, token) => get(`/institutional/listings/${id}`, token),
  createListing: (token, body) => apiRequest("/institutional/listings", { method: "POST", token, body }).then((r) => r.data),
  interest: (token, id, message) => apiRequest(`/institutional/listings/${id}/interest`, { method: "POST", token, body: { message: message || undefined } }).then((r) => r.data),
  myDeals: (token) => get("/institutional/my/deals", token),
  myListings: (token) => get("/institutional/my/listings", token),
  deal: (token, id) => get(`/institutional/deals/${id}`, token),
  offer: (token, id, body) => apiRequest(`/institutional/deals/${id}/offers`, { method: "POST", token, body }).then((r) => r.data),
  buyerProfile: (token) => get("/institutional/buyer-profile", token),
  saveBuyerProfile: (token, data, file) => {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      form.append(k, Array.isArray(v) ? JSON.stringify(v) : v);
    });
    if (file) form.append("capacityDocument", file);
    return apiRequest("/institutional/buyer-profile", { method: "PUT", token, body: form, isFormData: true }).then((r) => r.data);
  },
};

export const formatCr = (v) => (v === null || v === undefined ? "—" : `₹${Number(v).toLocaleString("en-IN", { maximumFractionDigits: 2 })} Cr`);
