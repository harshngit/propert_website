export const CITY_OPTIONS = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad"];

export function toCitySlug(city) {
  return String(city || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function fromCitySlug(slug) {
  const normalized = decodeURIComponent(String(slug || ""))
    .replace(/[-_]+/g, " ")
    .trim();

  if (!normalized) {
    return "Mumbai";
  }

  return normalized
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function buildCityPath(city) {
  return `/city/${toCitySlug(city)}`;
}
