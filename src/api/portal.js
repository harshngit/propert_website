import { API_BASE_URL } from "../config/api";
import { apiRequest } from "./client";

// Customer portal (backend /api/me/*) - the "My Dashboard" for buyers,
// tenants, sellers and owners. Every call needs the signed-in user's token.

const get = (path, token) => apiRequest(path, { token }).then((res) => res.data);
const send = (method, path, token, body) => apiRequest(path, { method, token, body }).then((res) => res.data);

export const portal = {
  profile: (token) => get("/me/profile", token),
  saveProfile: (token, body) => send("PUT", "/me/profile", token, body),
  overview: (token) => get("/me/overview", token),

  requirements: (token) => get("/me/requirements", token),
  createRequirement: (token, body) => send("POST", "/me/requirements", token, body),
  updateRequirement: (token, id, body) => send("PUT", `/me/requirements/${id}`, token, body),
  matches: (token) => get("/me/matches", token),
  renewRequirement: (token, id) => send("POST", `/me/requirements/${id}/renew`, token),
  matchScores: (token, ids) => get(`/me/match-scores?ids=${ids.join(",")}`, token),
  matchEvent: (token, body) => send("POST", "/me/match-events", token, body),
  recommendations: (token) => get("/me/recommendations", token),

  // Listing verification, duplicates & appeals (sec. 9)
  listingChecks: (token, id) => get(`/fraud/listings/${id}`, token),
  requestListingVerification: (token, id, { level, note, files = [] }) => {
    const form = new FormData();
    form.append("level", level);
    if (note) form.append("note", note);
    files.forEach((f) => form.append("files", f));
    return apiRequest(`/fraud/listings/${id}/verifications`, { method: "POST", token, body: form, isFormData: true }).then((res) => res.data);
  },
  resolveDuplicate: (token, id, action) => send("POST", `/fraud/listings/${id}/duplicate-resolution`, token, { action }),
  appealListing: (token, id, { reason, files = [] }) => {
    const form = new FormData();
    form.append("reason", reason);
    files.forEach((f) => form.append("files", f));
    return apiRequest(`/fraud/listings/${id}/appeal`, { method: "POST", token, body: form, isFormData: true }).then((res) => res.data);
  },

  // Documents & due diligence (Modules 20 / 21)
  ddReport: (token, id) => get(`/due-diligence/properties/${id}`, token),
  propertyDocuments: (token, id) => get(`/due-diligence/properties/${id}/documents`, token),
  addPropertyDocument: (token, id, { file, documentType, visibleTo = [] }) => {
    const form = new FormData();
    form.append("file", file);
    if (documentType) form.append("documentType", documentType);
    form.append("visibleTo", visibleTo.join(","));
    return apiRequest(`/due-diligence/properties/${id}/documents`, { method: "POST", token, body: form, isFormData: true }).then((res) => res.data);
  },

  // Deal progress + professional-fee invoices (Module 40)
  myDeals: (token) => get("/orchestration/my-deals", token),
  invoicePdf: async (token, id) => {
    const res = await fetch(`${API_BASE_URL}/orchestration/invoices/${id}/pdf`, { headers: { Authorization: `Bearer ${token}` } });
    if (!res.ok) throw new Error("Could not load the invoice");
    return res.blob();
  },

  // Disputes (Engine 5)
  disputes: (token) => get("/disputes", token),
  dispute: (token, id) => get(`/disputes/${id}`, token),
  openDispute: (token, { type, title, description, propertyId, files = [] }) => {
    const form = new FormData();
    form.append("type", type);
    form.append("title", title);
    form.append("description", description);
    if (propertyId) form.append("propertyId", propertyId);
    files.forEach((f) => form.append("files", f));
    return apiRequest("/disputes", { method: "POST", token, body: form, isFormData: true }).then((res) => res.data);
  },
  commentDispute: (token, id, { body, files = [] }) => {
    const form = new FormData();
    if (body) form.append("body", body);
    files.forEach((f) => form.append("files", f));
    return apiRequest(`/disputes/${id}/comments`, { method: "POST", token, body: form, isFormData: true }).then((res) => res.data);
  },

  // Trust & reviews (sec. 8)
  trust: (token) => get("/trust/me", token),
  reviewable: (token) => get("/trust/reviews/eligible", token),
  createReview: (token, body) => send("POST", "/trust/reviews", token, body),
  myReviews: (token) => get("/trust/reviews/mine", token),
  reviewsAboutMe: (token) => get("/trust/reviews/about-me", token),
  replyReview: (token, id, reply) => send("POST", `/trust/reviews/${id}/reply`, token, { reply }),
  reportReview: (token, id, reason) => send("POST", `/trust/reviews/${id}/report`, token, { reason }),
  submitVerification: (token, { kind, reference, file }) => {
    const form = new FormData();
    form.append("kind", kind);
    if (reference) form.append("reference", reference);
    if (file) form.append("file", file);
    return apiRequest("/trust/verifications", { method: "POST", token, body: form, isFormData: true }).then((res) => res.data);
  },

  favourites: (token) => get("/me/favourites", token),
  addFavourite: (token, propertyId) => send("POST", `/properties/${propertyId}/favorite`, token),
  removeFavourite: (token, propertyId) => send("DELETE", `/properties/${propertyId}/favorite`, token),

  savedSearches: (token) => get("/me/saved-searches", token),
  createSavedSearch: (token, body) => send("POST", "/me/saved-searches", token, body),
  updateSavedSearch: (token, id, body) => send("PUT", `/me/saved-searches/${id}`, token, body),
  deleteSavedSearch: (token, id) => send("DELETE", `/me/saved-searches/${id}`, token),

  enquiries: (token) => get("/me/enquiries", token),
  requestVisit: (token, leadId, body) => send("POST", `/me/enquiries/${leadId}/visit-request`, token, body),
  visits: (token) => get("/me/visits", token),

  listings: (token) => get("/me/listings", token),
  listing: (token, id) => get(`/properties/${id}`, token),
  createListing: (token, body) => send("POST", "/me/listings", token, body),
  updateListing: (token, id, body) => send("PUT", `/me/listings/${id}`, token, body),
  listingAction: (token, id, action) => send("POST", `/me/listings/${id}/${action}`, token),
  listingEnquiries: (token, id) => get(`/me/listings/${id}/enquiries`, token),
  // One file per request (the upload endpoint takes a single `file`); the
  // first photo of a listing with none yet becomes its cover.
  uploadListingPhotos: async (token, id, files, { hasCover = false } = {}) => {
    const uploaded = [];
    for (const [index, file] of files.entries()) {
      const form = new FormData();
      form.append("file", file);
      form.append("displayOrder", String(index));
      if (!hasCover && index === 0) form.append("isPrimary", "true");
      const res = await apiRequest(`/properties/${id}/media/upload`, { method: "POST", token, body: form, isFormData: true });
      uploaded.push(res.data);
    }
    return uploaded;
  },

  documents: (token) => get("/me/documents", token),
  uploadDocument: (token, file, documentType) => {
    const form = new FormData();
    form.append("file", file);
    form.append("documentType", documentType);
    return apiRequest("/me/documents", { method: "POST", token, body: form, isFormData: true }).then((res) => res.data);
  },

  rentals: (token) => get("/me/rentals", token),
  lease: (token, id) => get(`/me/rentals/${id}`, token),
  createLease: (token, body) => send("POST", "/me/rentals", token, body),
  updateLease: (token, id, body) => send("PUT", `/me/rentals/${id}`, token, body),
  confirmLease: (token, id) => send("POST", `/me/rentals/${id}/confirm`, token),
  reportRent: (token, id, paymentId, body) => send("POST", `/me/rentals/${id}/rent/${paymentId}/report`, token, body),
  reviewRent: (token, id, paymentId, body) => send("POST", `/me/rentals/${id}/rent/${paymentId}/review`, token, body),
  raiseMaintenance: (token, id, body) => send("POST", `/me/rentals/${id}/maintenance`, token, body),
  updateMaintenance: (token, id, requestId, body) => send("PUT", `/me/rentals/${id}/maintenance/${requestId}`, token, body),

  // NRI / HNI investor tools (backend /nri/*, /hni/*) - the caller's own
  // investor profile.
  investorProfile: (token) => get("/investors/me", token),
  saveInvestorProfile: (token, body) => send("PUT", "/investors/me", token, body),
  nriDashboard: (token) => get("/nri/dashboard", token),
  nriProperties: (token) => get("/nri/properties", token),
  nriProperty: (token, id) => get(`/nri/properties/${id}`, token),
  createNriProperty: (token, body) => send("POST", "/nri/properties", token, body),
  updateNriProperty: (token, id, body) => send("PUT", `/nri/properties/${id}`, token, body),
  deleteNriProperty: (token, id) => send("DELETE", `/nri/properties/${id}`, token),
  nriRent: (token, id) => get(`/nri/properties/${id}/rent`, token),
  addNriRent: (token, id, body) => send("POST", `/nri/properties/${id}/rent`, token, body),
  nriRequests: (token) => get("/nri/service-requests?limit=50", token),
  nriRequest: (token, id) => get(`/nri/service-requests/${id}`, token),
  createNriRequest: (token, body) => send("POST", "/nri/service-requests", token, body),
  addNriRequestUpdate: (token, id, message) => send("POST", `/nri/service-requests/${id}/updates`, token, { message }),
  cancelNriRequest: (token, id) => send("PUT", `/nri/service-requests/${id}/status`, token, { status: "cancelled" }),
  repatriation: (token) => get("/nri/repatriation", token),
  addRepatriation: (token, body) => send("POST", "/nri/repatriation", token, body),
  femaGuidance: () => get("/nri/guidance/fema"),
  tdsOnSale: (body) => send("POST", "/nri/guidance/tds-on-sale", undefined, body),
  rentTds: (body) => send("POST", "/nri/guidance/rent-tds", undefined, body),
  hniDashboard: (token) => get("/hni/dashboard", token),
  hniDeals: (token) => get("/hni/deals?limit=12", token),
  trackHniDeal: (token, propertyId, action) => send("POST", `/hni/deals/${propertyId}/track`, token, { action }),
  hniPortfolio: (token) => get("/hni/portfolio", token),
  createInvestment: (token, body) => send("POST", "/hni/portfolio", token, body),
  updateInvestment: (token, id, body) => send("PUT", `/hni/portfolio/${id}`, token, body),
  deleteInvestment: (token, id) => send("DELETE", `/hni/portfolio/${id}`, token),

  notifications: (token, page = 1) => get(`/notifications?page=${page}&limit=20`, token),
  markNotificationRead: (token, id) => send("PUT", `/notifications/${id}/read`, token),
  markAllNotificationsRead: (token) => send("PUT", "/notifications/read-all", token),
};
