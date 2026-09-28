const validViews = new Set(["list", "tile", "map"]);

export function normalizeView(view) {
  return validViews.has(view) ? view : "list";
}

// Auction / special situation / institutional cards open the deal page,
// which knows about masked teasers and access gating.
const DEAL_CONTEXTS = new Set(["auction", "special", "institutional"]);

export function buildPropertyDetailPath(item) {
  const detailId = item?.detailId ?? item?.id;
  if (DEAL_CONTEXTS.has(item?.context) && detailId) return `/deals/${detailId}`;
  const detailSlug =
    detailId !== undefined && detailId !== null && detailId !== ""
      ? detailId
      : encodeURIComponent(
          [item?.title, item?.location].filter(Boolean).join("-") || "property"
        );

  return `/properties/${detailSlug}`;
}

export function buildPropertiesPath(currentSearchParams, updates = {}) {
  const nextParams = new URLSearchParams(currentSearchParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      nextParams.delete(key);
      return;
    }

    nextParams.set(key, String(value));
  });

  nextParams.set("view", normalizeView(nextParams.get("view")));

  return `/properties?${nextParams.toString()}`;
}
