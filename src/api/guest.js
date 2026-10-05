import { apiRequest } from "./client";
import { anonymousId, attribution } from "../lib/tracker";

// Guest Interest - "I'm Interested" with only a mobile number + OTP, no
// account (backend /api/guest). The response is just a reference and the
// assigned representative's name and platform number.
export const requestGuestOtp = (mobile) => apiRequest("/guest/interest/otp", { method: "POST", body: { mobile } }).then((r) => r.data);

export const submitGuestInterest = ({ mobile, otp, fullName, propertyId, requirementId, message }) =>
  apiRequest("/guest/interest", {
    method: "POST",
    body: { mobile, otp, fullName: fullName || undefined, propertyId: propertyId || undefined, requirementId: requirementId || undefined, message: message || undefined, anonymousId: anonymousId(), attribution: attribution() },
  }).then((r) => r.data);

export const listGuestRequirements = ({ city, purpose } = {}) => {
  const q = new URLSearchParams();
  if (city) q.set("city", city);
  if (purpose) q.set("purpose", purpose);
  return apiRequest(`/guest/requirements${q.toString() ? `?${q}` : ""}`).then((r) => r.data);
};

export const getMarketBenchmark = ({ city, locality, propertyType, transactionType } = {}) => {
  const q = new URLSearchParams({ city });
  if (locality) q.set("locality", locality);
  if (propertyType) q.set("propertyType", propertyType);
  if (transactionType) q.set("transactionType", transactionType);
  return apiRequest(`/market/benchmarks?${q}`).then((r) => r.data);
};
