// Maps an opportunity row from the backend (/opportunities/public teaser,
// /opportunities full row, or a /search/properties institutional teaser)
// into the card shape PropertiesPage's ResultCard / ResultTileCard already
// render for the auction / special / institutional contexts - the same
// field names the page's old static mock data used.

const typeLabel = (t) =>
  t ? String(t).replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";

const TAG_LABELS = {
  urgent_sale: "Urgent Sale",
  financial_distress: "Financial Restructuring",
  investor_exit: "Investor Exit",
  time_bound_sale: "Time-Bound Sale",
};

const POSSESSION_LABELS = {
  physical: "Physical Possession",
  symbolic: "Symbolic Possession",
  vacant: "Vacant",
  occupied: "Occupied",
  unknown: "Possession Unconfirmed",
};

function formatAuctionDate(value) {
  if (!value) return "Auction date to be announced";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Auction date to be announced";
  const date = d.toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric", timeZone: "Asia/Kolkata" });
  const time = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true, timeZone: "Asia/Kolkata" });
  return `Auction: ${date} | ${time.toUpperCase()}`;
}

function formatInr(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  if (n >= 1e7) return `₹${Number((n / 1e7).toFixed(2))} Cr`;
  if (n >= 1e5) return `₹${Number((n / 1e5).toFixed(2))} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function formatArea(value) {
  if (value === null || value === undefined || value === "") return "—";
  return `${Number(value).toLocaleString("en-IN")} sq.ft`;
}

function formatYield(item) {
  if (item.yield_percent === null || item.yield_percent === undefined) return "—";
  return `${Number(item.yield_percent)}%${item.yield_qualifier ? ` ${item.yield_qualifier}` : ""}`;
}

export function normalizeOpportunity(item, context) {
  if (!item) return null;
  const situationTags = (item.situation_tags || []).map((t) => (TAG_LABELS[t] || typeLabel(t)).toUpperCase());
  const discount = item.discount_percent !== null && item.discount_percent !== undefined ? Number(item.discount_percent) : null;
  const score = item.investment_score !== null && item.investment_score !== undefined ? Number(item.investment_score) : null;

  const tags = [...situationTags];
  if (item.is_verified) tags.push("VERIFIED");
  if (item.liquidity_band) tags.push(`${item.liquidity_band.toUpperCase()} LIQUIDITY`);
  if (context === "institutional" || item.listing_category === "institutional") tags.push("CONFIDENTIAL");

  return {
    id: item.id,
    detailId: item.id,
    context,
    locked: item.locked !== false,
    title: item.title,
    location: [item.locality, item.city].filter(Boolean).join(", "),
    city: item.city,
    image: item.primary_image || "/images/1st,4th.png",
    images: item.primary_image ? [item.primary_image] : [],
    price: item.reserve_price_display || item.price,
    priceDisplay:
      item.reserve_price_display || formatInr(item.reserve_price ?? item.price_value) || item.price || "Price on request",
    rateDisplay:
      context === "institutional"
        ? item.yield_percent != null
          ? `Est. Yield: ${formatYield(item)}`
          : ""
        : discount !== null && discount > 0
          ? `${discount}% below est. market value`
          : "",
    yieldDisplay: formatYield(item),
    details: typeLabel(item.property_type),
    area: formatArea(item.area_sqft),
    status:
      context === "special"
        ? situationTags[0] || item.source_label || "Special Situation"
        : POSSESSION_LABELS[item.possession_type] || item.source_label || "Details on request",
    match: score !== null ? `Score ${score}/100` : null,
    investmentScore: score,
    discountPercent: discount,
    auctionDate: formatAuctionDate(item.auction_date),
    // Teasers only carry the generic source label; the named bank is part
    // of the full details unlocked for verified investors.
    sourceBank: item.source_bank || item.source_label || "Bank auction",
    tags: tags.length ? tags.slice(0, 3) : [typeLabel(item.listing_category).toUpperCase()],
    badge: null,
    verified: !!item.is_verified,
    favorite: false,
    actionLabel: item.locked === false ? "View Details" : context === "auction" ? "Enquire Now" : "Verify & Request Access",
  };
}

export { formatAuctionDate, typeLabel };
