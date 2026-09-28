import { apiRequest } from "./client";

// Public enquiry -> CRM lead (backendapi POST /leads/public-inquiry). No
// login needed; rate limited server-side. The lead is picked up by the
// A R Buildwel team - contact details are never passed to any other party.
export async function submitEnquiry({ fullName, mobile, email, message, propertyId }) {
  const digits = (mobile || "").replace(/\D/g, "");
  return apiRequest("/leads/public-inquiry", {
    method: "POST",
    body: {
      fullName: fullName.trim(),
      mobile: digits ? digits.slice(-10) : undefined,
      email: email?.trim() || undefined,
      message: message || undefined,
      propertyId: propertyId || undefined,
      source: "website",
    },
  });
}
