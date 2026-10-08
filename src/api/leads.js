import { apiRequest } from "./client";
import { anonymousId, track } from "../lib/tracker";

// Public enquiry -> CRM lead (backendapi POST /leads/public-inquiry). No
// login needed; rate limited server-side. The lead is picked up by the
// A R Buildwel team - contact details are never passed to any other party.
export async function submitEnquiry({ fullName, mobile, email, message, propertyId, topic, details }) {
  const digits = (mobile || "").replace(/\D/g, "");
  track("lead_submitted", { channel: "enquiry", property_id: propertyId || undefined });
  return apiRequest("/leads/public-inquiry", {
    method: "POST",
    body: {
      fullName: fullName.trim(),
      mobile: digits ? digits.slice(-10) : undefined,
      email: email?.trim() || undefined,
      message: message || undefined,
      propertyId: propertyId || undefined,
      // The topic decides which CRM enquiry desk this lands in (home loan,
      // insurance, legal, valuation ...); details are that form's own answers.
      topic: topic || undefined,
      details: details && Object.keys(details).length ? details : undefined,
      source: "website",
      // Links this browser's history (and its campaign) to the lead.
      anonymousId: anonymousId(),
    },
  });
}

// "Your representative: Name (+91 ...)" - the only contact either party ever
// sees (Annexure A sec. 10 / 34).
export function representativeLine(rep, fallback = "your A R Buildwel representative") {
  if (!rep?.name) return fallback;
  return `${rep.name}${rep.platformNumber ? ` (${rep.platformNumber})` : ""}`;
}
