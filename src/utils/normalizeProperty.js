const typeLabel = (t) =>
  t ? t.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "";

// Maps a property object returned by the real backend (backendapi's
// /search/properties[/:id]) into the shape PropertyCard/PropertiesPage/
// PropertyDetailPage already render - same field names the site's static
// mock data (src/data/propertyResults.js) used, so no other UI code needs
// to change.
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
    price: p.price,
    // Backend stores rate as a plain number (₹/sqft) - format to match the
    // "22,400/sq.ft" string style the rest of the UI already expects.
    rate: p.rate != null ? `${Number(p.rate).toLocaleString("en-IN")}/sq.ft` : undefined,
    location: [p.address, p.locality, p.city].filter(Boolean).join(", "),
    city: p.city,
    details: p.bedrooms != null ? `${p.bedrooms} BHK` : typeLabel(p.property_type),
    area: p.area_sqft != null ? `${p.area_sqft} sq.ft` : undefined,
    image,
    images,
    tags: p.amenities || [],
    // No real backing field yet for trust badges - leave unset rather than
    // fabricate a "Verified"/"Featured" claim the backend doesn't make.
    badge: null,
    verified: false,
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
