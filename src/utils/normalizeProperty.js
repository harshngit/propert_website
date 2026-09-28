const typeLabel = (t) =>
  t ? t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";

// Address/locality/city are entered as separate fields in the CRM, but
// often overlap (e.g. address = "Rajouri Garden, Delhi, India", locality =
// "Rajouri Garden") - drop any part that's already contained in an
// earlier, more-complete part instead of joining every part verbatim.
const buildLocation = (parts) => {
  const nonEmpty = parts.filter(Boolean);
  return nonEmpty
    .filter((part, index) =>
      !nonEmpty.some(
        (other, otherIndex) => otherIndex < index && other.toLowerCase().includes(part.toLowerCase())
      )
    )
    .join(", ");
};

// Maps a property object returned by the real backend (backendapi's
// /search/properties[/:id]) into the shape PropertyCard/PropertiesPage/
// PropertyDetailPage already render - same field names the site's static
// mock data (src/data/propertyResults.js) used, so no other UI code needs
// to change.
const formatInr = (value) => {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n >= 1e7) return `₹${Number((n / 1e7).toFixed(2))} Cr`;
  if (n >= 1e5) return `₹${Number((n / 1e5).toFixed(2))} Lakh`;
  return `₹${n.toLocaleString("en-IN")}`;
};

export function normalizeProperty(p) {
  if (!p) return null;

  const media = p.media || [];
  const primaryMedia = media.find((m) => m.is_primary) || media[0];
  const images = media.length
    ? media.map((m) => m.url).filter(Boolean)
    : p.primary_image
      ? [p.primary_image]
      : [];
  const image = primaryMedia?.url || p.primary_image || images[0] || null;

  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: formatInr(p.price_value) || p.price,
    // Backend stores rate as a plain number (₹/sqft) - format to match the
    // "22,400/sq.ft" string style the rest of the UI already expects.
    // Empty string (not undefined) so `${item.rate}` template interpolation
    // in PropertiesPage's cards never literally prints the word "undefined".
    rate: p.rate != null ? `${Number(p.rate).toLocaleString("en-IN")}/sq.ft` : "",
    // Public API responses carry locality/city only - full addresses stay private.
    location: buildLocation([p.locality, p.city]),
    city: p.city,
    details: p.bedrooms != null ? `${p.bedrooms} BHK` : typeLabel(p.property_type),
    area: p.area_sqft != null ? `${p.area_sqft} sq.ft` : undefined,
    image,
    images,
    tags: p.amenities || [],
    badge: p.badge || (p.is_verified ? "VERIFIED" : null),
    verified: !!p.is_verified,
    favorite: false,
    propertyType: p.property_type,
    transactionType: p.transaction_type,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    listingCategory: p.listing_category,
    builderName: p.builder_name,
    annualAppreciationPercent: p.annual_appreciation_percent,
    estimatedRentMonthly: p.estimated_rent_monthly,
    localityRating: p.locality_rating,
    auctionDate: p.auction_date,
    sourceBank: p.source_bank,
    occupancyPercent: p.occupancy_percent,
    yieldPercent: p.yield_percent,
    yieldQualifier: p.yield_qualifier,
  };
}
