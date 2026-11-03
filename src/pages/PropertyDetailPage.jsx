import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import PropertyGallery from "../components/PropertyGallery";
import { buildPropertyDetailPath } from "../utils/propertySearch";
import { getPropertyById, searchProperties } from "../api/properties";
import { normalizeProperty } from "../utils/normalizeProperty";
import EnquiryModal from "../components/EnquiryModal";
import GuestInterestModal from "../components/GuestInterestModal";
import { breadcrumbSchema, listingSchema, useSeo } from "../lib/seo";
import { track } from "../lib/tracker";
import ListerTrustCard from "../components/ListerTrustCard";
import PropertyReviews from "../components/PropertyReviews";
import { CustomFieldList } from "../components/DynamicFields";
import { useFavourites } from "../hooks/useFavourites";
import { useAuth } from "../context/AuthContext";
import { portal } from "../api/portal";
import AreaOutlook from "../components/AreaOutlook";
import MatchBadge from "../components/MatchBadge";

function LocationIcon({ className = "text-[#E51C23]" }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={`h-4 w-4 shrink-0 ${className}`} fill="none">
      <path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14Z" fill="currentColor" />
      <circle cx="8" cy="6.5" r="1.6" fill="white" />
    </svg>
  );
}

function BedIcon() {
  return <img src="/icons/bhk.png" alt="" aria-hidden="true" className="h-[14px] w-[14px] shrink-0 object-contain" />;
}

function AreaIcon() {
  return <img src="/icons/Vector.png" alt="" aria-hidden="true" className="h-[13px] w-[13px]  shrink-0 object-contain" />;
}

function RedBedIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-[14px] w-[14px] shrink-0 bg-[#E51C23] [mask-image:url('/icons/bhk.png')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-image:url('/icons/bhk.png')] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]"
    />
  );
}

function RedAreaIcon() {
  return (
    <span
      aria-hidden="true"
      className="inline-block h-[13px] w-[13px] shrink-0 bg-[#E51C23] [mask-image:url('/icons/Vector.png')] [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain] [-webkit-mask-image:url('/icons/Vector.png')] [-webkit-mask-position:center] [-webkit-mask-repeat:no-repeat] [-webkit-mask-size:contain]"
    />
  );
}

function StarIcon() {
  return <img src="/icons/star.png" alt="" aria-hidden="true" className="h-4 w-4 shrink-0 object-contain" />;
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#E51C23]" fill="none">
      <path d="m5.5 7.5 4.5 4.5 4.5-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PromiseIcon() {
  return <img src="/icons/promise.png" alt="" aria-hidden="true" className="h-8 w-8 shrink-0 object-contain" />;
}

function RedKeyIcon() {
  return (
    <svg
  aria-hidden="true"
  viewBox="0 0 24 24"
  className="h-[16px] w-[16px] shrink-0 text-[#ED1C24]"
  fill="none"
>
  <path
    fill="currentColor"
    fillRule="evenodd"
    clipRule="evenodd"
    d="
      M15.55 2
      C11.99 2 9.1 4.89 9.1 8.45
      C9.1 9.15 9.21 9.82 9.42 10.45

      L2.62 17.25
      C2.22 17.65 2 18.19 2 18.75
      V21.9
      C2 23.06 2.94 24 4.1 24
      H6.85
      C8.01 24 8.95 23.06 8.95 21.9
      V20.25
      H10.55
      C11.71 20.25 12.65 19.31 12.65 18.15
      V16.65
      H14.35
      C14.91 16.65 15.45 16.43 15.85 16.03
      L17.04 14.84

      C19.9 14.17 22 11.6 22 8.55
      C22 4.93 19.07 2 15.55 2
      Z

      M16.95 6.15
      C15.91 6.15 15.07 6.99 15.07 8.03
      C15.07 9.07 15.91 9.91 16.95 9.91
      C17.99 9.91 18.83 9.07 18.83 8.03
      C18.83 6.99 17.99 6.15 16.95 6.15
      Z
    "
  />
</svg>
  );
}

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
      <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function formatRupeeValue(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).replace(/^₹\s*/, "");
}

// Icons for common amenities; a listing shows only the amenities it has.
const AMENITY_ICONS = [
  {
    label: "Gymnasium",
    icon: <img src="/icons/gym.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain sm:h-7 sm:w-7" />,
  },
  {
    label: "Swimming Pool",
    icon: <img src="/icons/swimming.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain sm:h-7 sm:w-7" />,
  },
  {
    label: "Grand Lawn",
    icon: <img src="/icons/lawn.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain sm:h-7 sm:w-7" />,
  },
  {
    label: "24/7 Security",
    icon: <img src="/icons/security.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain sm:h-7 sm:w-7" />,
  },
  {
    label: "Visitor Parking",
    icon: <img src="/icons/car parking.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain brightness-0 invert-[46%] sepia-[7%] saturate-[363%] hue-rotate-[177deg] brightness-[94%] contrast-[92%] sm:h-7 sm:w-7" />,
  },
  {
    label: "Power Backup",
    icon: <img src="/icons/power.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain sm:h-7 sm:w-7" />,
  },
  {
    label: "Kids Play Area",
    icon: <img src="/icons/kids play.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain sm:h-7 sm:w-7" />,
  },
  {
    label: "Broadband",
    icon: <img src="/icons/wifi.png" alt="" aria-hidden="true" className="h-5 w-5 object-contain sm:h-7 sm:w-7" />,
  },
];
const titleWords = (v) => String(v || "").replace(/[_-]+/g, " ").replace(/^./, (c) => c.toUpperCase());
const amenityIcon = (name) => AMENITY_ICONS.find((a) => { const l = a.label.toLowerCase().split(" ")[0]; const n = String(name).toLowerCase(); return n.includes(l) || l.includes(n); })?.icon || <span className="text-[16px] font-bold text-[#E51C23]">✓</span>;

function SimilarPropertyCard({ item }) {
  const detailPath = buildPropertyDetailPath(item);

  return (
    <Link
      to={detailPath}
      state={{ property: item }}
      onClick={() => window.scrollTo(0, 0)}
            className="block h-[368px] w-[294px] min-w-[294px] shrink-0 overflow-hidden rounded-[16px] border border-[#1118271A] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] sm:h-auto sm:w-full sm:min-w-0 sm:border-[#E5E7EB] sm:shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
      aria-label={`${item.title} - ${item.location}`}
    >
      <div className="relative h-[195px] overflow-hidden sm:aspect-[1.18] sm:h-auto">
        {item.image ? <img src={item.image} alt={item.title} className="h-full w-full object-cover" /> : <div className="flex h-full w-full items-center justify-center bg-[#F3F4F6] text-[12px] text-[#9CA3AF]">No photos yet</div>}
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {item.sponsored ? (
            <span className="inline-flex h-[23px] items-center justify-center rounded-full bg-[#EF4444] px-3 text-[10px] font-bold leading-[15px] text-white">
              {item.sponsored.label}
            </span>
          ) : null}
          {item.verified ? (
            <span className="inline-flex h-[23px] items-center gap-1 rounded-full bg-white px-3 text-[10px] font-bold leading-[15px] text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.12)]">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E41C23]">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-[10px] w-[10px]" fill="none">
                  <path
                    d="M4 8.5 6.5 11 12 5.5"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>VERIFIED</span>
            </span>
          ) : null}
        </div>
      </div>

      <div className="px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-[22px] font-black leading-tight text-[#111827] sm:text-[24px]">{item.price}</div>
          <div className="whitespace-nowrap text-[12px] leading-tight text-[#6B7280]">{item.rate}</div>
        </div>

        <div className="mt-3 text-[16px] font-bold leading-tight text-[#111827]">{item.title}</div>
        <p className="mt-1 flex items-center gap-1.5 text-[13px] text-[#6B7280]">
          <LocationIcon className="text-[#6B7280]" />
          {item.location}
        </p>

        <div className="mt-4 flex items-center gap-2 border-t border-[#F3F4F6] pt-3 text-[13px] font-semibold text-[#111827]">
          <BedIcon />
          <span>{item.details}</span>
          {item.area && <AreaIcon />}
          {item.area && <span className="whitespace-nowrap">{item.area}</span>}
        </div>
      </div>
    </Link>
  );
}

function PropertyDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const { isFavourite, toggleFavourite } = useFavourites();
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const [shareNote, setShareNote] = useState("");
  const [fetchedProperty, setFetchedProperty] = useState(null);
  const [fetchFailed, setFetchFailed] = useState(false);
  // Sec. 7.3: the signed-in buyer's real match against their requirements.
  const { accessToken, user } = useAuth();
  const [match, setMatch] = useState(null);
  useEffect(() => {
    if (!accessToken || user?.role !== "customer" || !/^[0-9a-f-]{36}$/i.test(String(id))) return;
    portal.matchScores(accessToken, [id]).then((m) => setMatch(m?.[id] || null)).catch(() => setMatch(null));
  }, [accessToken, user?.role, id]);
  // The full listing always comes from the API; a card's route state only fills the gap while it loads.
  const property = (String(fetchedProperty?.id) === String(id) ? fetchedProperty : null) || (String(location.state?.property?.id) === String(id) ? location.state.property : null);
  const [similar, setSimilar] = useState([]);
  const isFavorite = property ? isFavourite(property.id) : false;
  const [guestOpen, setGuestOpen] = useState(false);
  const realListing = property && /^[0-9a-f-]{36}$/i.test(String(property.id));

  // Per-listing meta + RealEstateListing schema (area and locality only).
  useSeo(
    property
      ? {
          title: `${property.title}${property.location ? ` in ${property.location}` : ""}`,
          description: `${property.details || "Property"}${property.area ? `, ${property.area}` : ""}${property.location ? ` in ${property.location}` : ""}${property.price ? ` - ${property.price}` : ""}. ${String(property.description || "").slice(0, 140)}`,
          path: `/properties/${property.id}`,
          image: property.image || undefined,
          jsonLd: [
            listingSchema({ id: property.id, title: property.title, description: property.description, image: property.image, price: property.priceValue, city: property.city, locality: property.location, propertyType: property.propertyType, bedrooms: property.bedrooms, areaSqft: property.areaSqft, transactionType: property.transactionType }),
            breadcrumbSchema([["Home", "/"], ["Properties", "/properties"], [property.title, `/properties/${property.id}`]]),
          ],
        }
      : null,
    [property?.id, property?.title]
  );
  useEffect(() => {
    if (realListing) track("property_view", { property_id: property.id, city: property.city });
  }, [realListing, property?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Native share sheet where available (phones), otherwise copy the link.
  const shareListing = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: property?.title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareNote("Link copied");
    } catch {
      setShareNote("");
      return;
    }
    setTimeout(() => setShareNote(""), 2500);
  };

  useEffect(() => {
    setFetchFailed(false);
    if (!/^[0-9a-f-]{36}$/i.test(String(id))) {
      setFetchFailed(true);
      return undefined;
    }
    let cancelled = false;
    getPropertyById(id)
      .then((data) => {
        if (!cancelled) setFetchedProperty(normalizeProperty(data));
      })
      .catch(() => {
        if (!cancelled) setFetchFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Similar listings: live ones in the same city and type. Hidden when there are none.
  useEffect(() => {
    if (!realListing || !property?.city) return undefined;
    let cancelled = false;
    searchProperties({ city: property.city, propertyType: property.propertyType, limit: 5 })
      .then((data) => {
        if (!cancelled) setSimilar((data.items || []).map(normalizeProperty).filter((x) => x.id !== property.id).slice(0, 4));
      })
      .catch(() => {
        if (!cancelled) setSimilar([]);
      });
    return () => {
      cancelled = true;
    };
  }, [realListing, property?.id, property?.city, property?.propertyType]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!property && !fetchFailed) {
    return (
      <main className="min-h-screen w-full bg-white text-[#0F172A]">
        <SiteHeader />
        <div className="flex items-center justify-center px-4 py-24 text-sm text-slate-500">Loading listing…</div>
        <CompanyFooterSection />
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen w-full bg-white text-[#0F172A]">
        <SiteHeader />
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-red-500">PropertySerch</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            We couldn&apos;t find that listing
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            It may have been sold, taken down, or the link is incorrect.
          </p>
          <Link to="/properties" className="cta-red mt-8 inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-extrabold text-white">
            Browse all properties
          </Link>
        </section>
        <CompanyFooterSection />
      </main>
    );
  }

  // Everything below shows only what this listing actually has.
  const areaLabel = property.carpetAreaSqft ? `${property.carpetAreaSqft} sq.ft` : property.area || null;
  const keyFacts = [
    property.reraNumber && { label: "RERA number", value: property.reraNumber },
    property.builderName && { label: "Builder", value: property.builderName },
    property.listingCategory && property.listingCategory !== "residential" && { label: "Category", value: titleWords(property.listingCategory) },
  ].filter(Boolean);
  const facts = [
    property.details && { label: "Configuration", value: property.bedrooms != null && property.propertyType ? `${property.bedrooms} BHK ${titleWords(property.propertyType)}` : property.details, icon: <RedBedIcon /> },
    areaLabel && { label: property.carpetAreaSqft ? "Carpet Area" : "Area", value: areaLabel, icon: <RedAreaIcon /> },
    property.facing && { label: "Facing", value: titleWords(property.facing), icon: <img src="/icons/compass.png" alt="" aria-hidden="true" className="h-4 w-4 shrink-0 object-contain" /> },
    property.possessionStatus && { label: "Status", value: titleWords(property.possessionStatus), icon: <PromiseIcon /> },
  ].filter(Boolean);
  const details = [
    property.floorNumber != null && { label: "Floor", value: property.totalFloors != null ? `${property.floorNumber} of ${property.totalFloors}` : String(property.floorNumber) },
    property.bathrooms != null && { label: "Bathrooms", value: String(property.bathrooms) },
    property.furnishing && { label: "Furnishing", value: titleWords(property.furnishing) },
    property.parkingSpots != null && { label: "Parking", value: `${property.parkingSpots}${property.parkingType ? ` ${titleWords(property.parkingType)}` : ""}` },
    property.ageOfProperty && { label: "Age of Property", value: titleWords(property.ageOfProperty) },
    property.gatedCommunity === true && { label: "Gated Community", value: "Yes" },
  ].filter(Boolean);
  const marketFacts = [
    property.annualAppreciationPercent != null && { label: "Annual Appreciation (indicative)", value: `${Number(property.annualAppreciationPercent) > 0 ? "+" : ""}${Number(property.annualAppreciationPercent)}%` },
    property.estimatedRentMonthly != null && { label: "Estimated Rent (indicative)", value: `₹${Number(property.estimatedRentMonthly).toLocaleString("en-IN")} / mo` },
    property.localityRating != null && { label: "Locality Rating", value: `${Number(property.localityRating)} / 5` },
  ].filter(Boolean);

  return (
    <main className="min-h-screen w-full bg-white text-[#0F172A]">
      <SiteHeader />

      <section className="mx-auto hidden max-w-full px-4 pt-6 sm:block sm:px-6 lg:px-12">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] leading-[20px]">
          <Link to="/" className="font-normal text-[#9CA3AF] transition hover:text-[#111827]">
            Home
          </Link>
          <span aria-hidden="true" className="text-[#D1D5DB]">
            &gt;
          </span>
          {property.city && (
            <>
              <Link to={`/properties?city=${encodeURIComponent(property.city)}`} className="font-normal text-[#9CA3AF] transition hover:text-[#111827]">
                <span data-no-translate>{property.city}</span>
              </Link>
              <span aria-hidden="true" className="text-[#D1D5DB]">
                &gt;
              </span>
            </>
          )}
          <span className="font-semibold text-[#111827]">{property.title}</span>
        </nav>
      </section>

      <section className="mx-auto max-w-full px-0 py-0 sm:px-6 sm:py-6 lg:px-12 lg:py-10">
        <PropertyGallery
          images={property.images?.length ? property.images : property.image ? [property.image] : []}
          title={property.title}
          heroOverlay={
            <>
              <div className="absolute left-4 top-4 flex items-center gap-2">
                {property.badge && property.badge !== "VERIFIED" && (
                <span className="inline-flex h-[23px] items-center justify-center rounded-full bg-[#EF4444] px-3 text-[10px] font-bold leading-[15px] text-white">
                  {property.badge}
                </span>
                )}
                {property.verified && (
                <span className="inline-flex h-[23px] items-center gap-1 rounded-full bg-white px-3 text-[10px] font-bold leading-[15px] text-[#111827] shadow-sm">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E41C23]">
                    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-[10px] w-[10px]" fill="none">
                      <path
                        d="M4 8.5 6.5 11 12 5.5"
                        stroke="#FFFFFF"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span>VERIFIED</span>
                </span>
                )}
              </div>
              <button
                type="button"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={isFavorite}
                onClick={(event) => {
                  event.stopPropagation();
                  toggleFavourite(property.id);
                }}
                className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors sm:hidden ${
                  isFavorite ? "text-[#E51C23]" : "text-[#64748B]"
                }`}
              >
                <span className="text-[22px] leading-none">{isFavorite ? "♥" : "♡"}</span>
              </button>
              <span className="absolute bottom-3 right-3 rounded-[3px] bg-black/45 px-1.5 py-0.5 text-[11px] font-medium text-white sm:hidden">1/{(property.images || []).length} Images</span>
            </>
          }
        />
      </section>

      <section className="mx-auto max-w-full px-4 pb-8 sm:px-6 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* LEFT */}
          <div className="min-w-0">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <h1 className="mt-3 text-[14px] font-black leading-5 tracking-tight text-[#111827] sm:mt-0 sm:text-[32px]">
                    {property.title}
                  </h1>
                  {match && <MatchBadge className="mt-3 shrink-0 sm:mt-1" score={match.score} tier={match.tier} breakdown={match.breakdown} />}
                </div>
                {/* Sec. 9.1 verification level + sec. 9.5 Under Review banner */}
                <div className="mt-2 flex flex-wrap gap-2">
                  {property.verificationLevel > 0 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-3 py-1 text-[12px] font-bold text-[#065F46]">
                      ✓ {["", "Verified by System", "Seller Verified", "Legally Verified", "Site Verified"][property.verificationLevel]}
                    </span>
                  )}
                </div>
                {property.underReview && (
                  <p className="mt-2 rounded-[10px] bg-[#FFFBEB] px-3 py-2 text-[13px] font-semibold text-[#92400E]">
                    Under Review - our team is running a routine check on this listing. Details may change.
                  </p>
                )}

                <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[#6B7280] sm:text-[15px]">
                  <LocationIcon />
                  {property.location}
                </p>
              </div>

              <div className="flex items-baseline gap-3 text-left sm:block lg:text-right">
                <div className="text-[24px] font-black leading-none text-[#111827] sm:text-[30px]">
                  ₹{formatRupeeValue(property.price)}
                </div>
                {property.rate && (
                  <div className="mt-0 whitespace-nowrap text-[12px] leading-[18px] text-[#9CA3AF] sm:mt-1 sm:text-[13px]">
                    ₹{formatRupeeValue(property.rate)}
                  </div>
                )}
              </div>
            </div>

            {keyFacts.length > 0 && (
              <div className="mt-6 hidden flex-wrap gap-x-10 gap-y-3 border-y border-[#F3F4F6] py-5 sm:flex">
                {keyFacts.map((item) => (
                  <div key={item.label}>
                    <div className="whitespace-nowrap text-[14px] font-bold leading-tight text-[#111827]">{item.label}</div>
                    <div className="mt-1 whitespace-nowrap text-[13px] leading-tight text-[#6B7280]" data-no-translate>{item.value}</div>
                  </div>
                ))}
              </div>
            )}

            {facts.length > 0 && (
              <div className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5 border-y border-[#F3F4F6] py-4 sm:mt-8 sm:grid-cols-3 sm:gap-4 sm:border-0 sm:py-0">
                {facts.map((item) => (
                  <div key={item.label} className="rounded-none border-0 bg-transparent p-0 shadow-none sm:rounded-[14px] sm:border sm:border-[#F3F4F6] sm:bg-white sm:p-4">
                    <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF] sm:text-[12px]">{item.label}</div>
                    <div className="mt-2 flex items-center gap-2 text-[12px] font-bold text-[#111827] sm:text-[16px]">
                      {item.icon}
                      <span>{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {realListing && <AreaOutlook city={property.city} locality={property.locality} />}

            {(property.description || property.aboutExtended) && (
              <section className="mt-8 w-full lg:mt-10 lg:max-w-[1024px]">
                <h2 className="text-[20px] font-extrabold leading-tight text-[#111827] sm:text-[20px]">About this Property</h2>
                <div className="mt-4 space-y-4 whitespace-pre-line text-[14px] leading-6 text-[#4B5563] sm:text-[15px] sm:leading-8" data-no-translate>
                  {property.description && <p>{property.description}</p>}
                  {property.aboutExtended && <p>{property.aboutExtended}</p>}
                </div>
              </section>
            )}
            {details.length > 0 && (
              <div className="mt-8 rounded-[16px] bg-[#F9FAFB] px-6 py-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:mt-10 sm:px-8">
                <h2 className="text-[18px] font-extrabold leading-tight text-[#111827]">Property Details</h2>
                <div className="mt-4 grid grid-cols-1 gap-x-12 sm:grid-cols-2">
                  {details.map((item) => (
                    <div key={item.label} className="flex items-center justify-between border-b border-[#E5E7EB] py-3">
                      <div className="pr-4 text-[14px] leading-tight text-[#6B7280] sm:text-[16px]">{item.label}</div>
                      <div className="text-right text-[14px] font-bold leading-tight text-[#111827] sm:text-[16px]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {property.tags?.length > 0 && (
              <div className="mt-8 sm:rounded-[16px] sm:border sm:border-[#E5E7EB] sm:p-6">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="text-[20px] font-extrabold leading-[28px] text-[#111827]">Amenities</h2>
                  <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">{property.tags.length} Total</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 md:mt-6 md:grid-cols-4 md:gap-4">
                  {property.tags.map((name) => (
                    <div key={name} className="flex min-h-[86px] flex-col items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-white p-3 text-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F9FAFB] md:h-14 md:w-14">{amenityIcon(name)}</div>
                      <div className="mt-2 text-[14px] font-semibold leading-tight text-[#111827] md:mt-4 md:text-[16px]" data-no-translate>{titleWords(name)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {marketFacts.length > 0 && (
              <div className="mt-8 sm:rounded-[18px] sm:border sm:border-[#E5E7EB] sm:p-6">
                <h2 className="text-[20px] font-extrabold leading-tight text-[#111827]">From this listing</h2>
                <div className="mt-4 grid grid-cols-3 gap-3 sm:gap-4">
                  {marketFacts.map((m) => (
                    <div key={m.label} className="rounded-[14px] bg-[#F9FAFB] p-4">
                      <div className="text-[10px] font-semibold text-[#6B7280] sm:text-[12px]">{m.label}</div>
                      <div className="mt-2 text-[14px] font-black leading-tight text-[#111827] sm:text-[24px]">{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4">
              {property.faqs?.length > 0 && (
                <>
                  <h2 className="text-[20px] font-extrabold leading-tight text-[#111827] sm:text-[20px]">Frequently Asked Questions</h2>
                  <div className="mt-4 space-y-3">
                    {property.faqs.map((item, index) => {
                      const isOpen = openFaqIndex === index;
                      return (
                        <button
                          key={item.question}
                          type="button"
                          onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                          className="w-full rounded-[14px] border border-[#F3F4F6] bg-white px-4 py-4 text-left transition hover:border-[#E5E7EB]"
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span className="text-[14px] font-semibold text-[#111827] sm:text-[14px]" data-no-translate>{item.question}</span>
                            <span className="text-[18px] font-bold leading-none text-[#9CA3AF]">{isOpen ? "−" : "+"}</span>
                          </div>
                          {isOpen ? <p className="mt-3 text-[14px] leading-7 text-[#6B7280]" data-no-translate>{item.answer}</p> : null}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
              <p className="mt-6 w-[370px] max-w-full text-justify text-[8px] font-normal uppercase leading-[16.25px] tracking-[1px] text-[#9CA3AF] sm:w-auto sm:text-left sm:text-[11px] sm:leading-5 sm:tracking-[0.08em] sm:text-[#CBD5E1]">
                Disclaimer: The information provided on this page is based on data collected from the builder or primary
                source. PropertySerch.com does not guarantee the accuracy of this information. Buyers are advised to
                verify details with the developer before making any financial commitment.
              </p>
              {property.customFieldList?.length > 0 && (
                <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-5">
                  <h2 className="mb-3 font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#111827]">More about this property</h2>
                  <CustomFieldList list={property.customFieldList} />
                </div>
              )}
              <PropertyReviews propertyId={property.id} />
              <ListerTrustCard propertyId={property.id} />
              {/^[0-9a-f-]{36}$/i.test(String(property.id)) && (
                <p className="mt-4 text-[13px] text-[#6B7280]">
                  Something wrong with this listing?{" "}
                  <Link to={`/dashboard/disputes?new=1&property=${property.id}`} className="font-bold text-[#E51C23]">Report it</Link> - our team reviews every report within 48 hours.
                </p>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hidden lg:block">
            <div className="flex flex-col gap-4 lg:sticky lg:top-24">
              <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
              <h2 className="text-[24px] font-black leading-tight text-[#111827]">
                Interested in this property?
              </h2>
              <p className="mt-2 max-w-[280px] text-[14px] leading-6 text-[#6B7280]">
                Schedule a personalized site visit via platform or request an expert callback
              </p>

              <div className="mt-6 flex items-center gap-3">
                {/* Guests: mobile + OTP only (Guest Interest). Signed-in users: the usual enquiry. */}
                <button
                  type="button"
                  onClick={() => (!user && realListing ? setGuestOpen(true) : setEnquiryOpen(true))}
                  className="cta-red inline-flex h-[46px] flex-1 items-center justify-center rounded-[12px] px-5 text-[14px] font-bold text-white"
                >
                  {!user && realListing ? "I'm Interested" : "Enquire Now"}
                </button>
                <button
                  type="button"
                  onClick={() => setEnquiryOpen(true)}
                  aria-label="Request a call back"
                  className="inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[12px] border-2 border-[#E51C23] bg-white text-[#E51C23]"
                >
                  <img src="/icons/phone.png" alt="" aria-hidden="true" className="h-[16px] w-[16px] object-contain" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => toggleFavourite(property.id)}
                  aria-pressed={isFavorite}
                  className={`inline-flex h-[68px] items-center justify-center gap-3 rounded-[20px] border px-4 text-[18px] font-semibold ${
                    isFavorite ? "border-[#FECACA] bg-[#FEF2F2] text-[#E51C23]" : "border-[#E5E7EB] bg-[#F9FAFB] text-[#374151]"
                  }`}
                >
                  <img src="/icons/fav%20icon.png" alt="" aria-hidden="true" className="h-5 w-5 shrink-0 object-contain" />
                  {isFavorite ? "Saved" : "Save"}
                </button>

                <button
                  type="button"
                  onClick={shareListing}
                  className="inline-flex h-[68px] items-center justify-center gap-3 rounded-[20px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[18px] font-semibold text-[#374151]"
                >
                  <img src="/icons/share.png" alt="" aria-hidden="true" className="h-5 w-5 shrink-0 object-contain" />
                  {shareNote || "Share"}
                </button>
              </div>

              <div className="mt-6 border-t border-[#F3F4F6] pt-4 text-center text-[12px] text-[#6B7280]">
                Your A R Buildwel representative handles your enquiry
              </div>
            </div>

              <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
                {property.builderName && (
                  <div className="mb-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px] border border-[#F3F4F6] bg-[#F9FAFB] text-[18px] font-black text-[#111827]">
                        {property.builderName.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[18px] font-bold leading-tight text-[#111827]" data-no-translate>{property.builderName}</div>
                        {property.builderRating != null && (
                          <div className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7280]"><StarIcon /><span>{property.builderRating}/5</span></div>
                        )}
                      </div>
                    </div>
                    {(property.builderExperienceYears != null || property.builderProjectsCount != null) && (
                      <div className="mt-5 grid grid-cols-2 gap-3">
                        {property.builderExperienceYears != null && (
                          <div className="rounded-[12px] bg-[#F9FAFB] px-4 py-4 text-center">
                            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Exp.</div>
                            <div className="mt-1 text-[18px] font-black leading-tight text-[#111827]">{property.builderExperienceYears} Yrs</div>
                          </div>
                        )}
                        {property.builderProjectsCount != null && (
                          <div className="rounded-[12px] bg-[#F9FAFB] px-4 py-4 text-center">
                            <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Projects</div>
                            <div className="mt-1 text-[18px] font-black leading-tight text-[#111827]">{property.builderProjectsCount}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <Link
                  to={`/properties?purpose=all${property.city ? `&city=${encodeURIComponent(property.city)}` : ""}`}
                  className="inline-flex h-[42px] w-full items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] font-bold text-[#374151] transition hover:border-[#D1D5DB]"
                >
                  View more properties{property.city ? ` in ${property.city}` : ""}
                </Link>
              </div>

              <div className="rounded-[16px] border border-[#FFE4E4] bg-[#FFF9F9] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                    <PromiseIcon />
                  </div>
                  <div>
                    <div className="text-[16px] font-bold leading-tight text-[#111827]">PropertySerch Promise</div>
                    <p className="mt-1 text-[13px] leading-6 text-[#6B7280]">
                      Your contact details stay private. Every enquiry goes through your A R Buildwel representative, and any
                      professional fee is agreed with you in advance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {similar.length > 0 && (
      <section className="mx-auto max-w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-extrabold leading-tight text-[#111827] sm:text-[22px]">Similar Properties</h2>
            <p className="mt-1 text-[12px] text-[#6B7280] sm:text-[14px]">Live listings in the same city and type</p>
          </div>
          <Link to={`/properties?city=${encodeURIComponent(property.city || "")}`} className="mb-5 inline-flex items-center gap-2 text-[12px] font-semibold text-[#E51C23] sm:text-[14px]">
            View All
            <img src="/icons/Img%20(1).png" alt="" aria-hidden="true" className="h-[12px] w-[7.5px] shrink-0 object-contain" />
          </Link>
        </div>
        <div className="scrollbar-hide mt-5 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible xl:grid-cols-4">
          {similar.map((item, index) => (
            <SimilarPropertyCard key={`${item.title}-${item.location}-${index}`} item={item} />
          ))}
        </div>
      </section>
      )}

      <EnquiryModal
        open={enquiryOpen}
        onClose={() => setEnquiryOpen(false)}
        topic="Property enquiry"
        title="Enquire about this property"
        description={`${property.title}${property.location ? ` - ${property.location}` : ""}. Your A R Buildwel representative will call you back and can arrange a site visit.`}
        propertyId={/^[0-9a-f-]{36}$/i.test(String(property.id)) ? property.id : undefined}
      />
      <GuestInterestModal
        open={guestOpen}
        onClose={() => setGuestOpen(false)}
        propertyId={realListing ? property.id : undefined}
        subject={`${property.title}${property.location ? ` - ${property.location}` : ""}`}
      />
      <CompanyFooterSection />
    </main>
  );
}

export default PropertyDetailPage;


