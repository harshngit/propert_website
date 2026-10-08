import { apiRequest } from "./client";
import { anonymousId } from "../lib/tracker";

// Module 17 - native ad slots (backend /api/ads). The API applies targeting,
// the per-day frequency cap and rotation, and returns [] when nothing is booked.
const device = () => (typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop");

export const serveAds = ({ placement, city, locality, propertyType, token, viewId } = {}) => {
  const q = new URLSearchParams({ placement, viewer: anonymousId(), device: device() });
  if (viewId) q.set("view", viewId);
  if (city) q.set("city", city);
  if (locality) q.set("locality", locality);
  if (propertyType) q.set("propertyType", propertyType);
  return apiRequest(`/ads/serve?${q}`, { token }).then((r) => r.data?.ads || []);
};

export const recordAdClick = (ad, { city, token } = {}) =>
  apiRequest(`/ads/click/${ad.campaignId}`, { method: "POST", token, body: { placement: ad.placement, variant: ad.variant, viewer: anonymousId(), city: city || undefined, device: device() } }).catch(() => null);
