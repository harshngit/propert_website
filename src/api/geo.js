import { apiRequest } from "./client";

// Resolves coordinates to the nearest city and the nearest city with live
// listings (GET /geo/nearest-city). Coordinates are rounded to 2 decimals
// (~1 km) - enough to pick a city, without sending an exact position.
export async function findNearestCity(lat, lng) {
  const round = (v) => Math.round(v * 100) / 100;
  const res = await apiRequest(`/geo/nearest-city?lat=${round(lat)}&lng=${round(lng)}`);
  return res.data;
}
