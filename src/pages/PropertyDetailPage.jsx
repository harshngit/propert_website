import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import PropertyGallery from "../components/PropertyGallery";
import { propertyResults } from "../data/propertyResults";
import { buildPropertyDetailPath } from "../utils/propertySearch";

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

const AMENITY_LIFESTYLE = [
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
const FAQS = [
  {
    question: "Is this project RERA registered?",
    answer:
      "Yes, the project includes RERA details in the listing and the number is shown in the Property Details section for quick reference.",
  },
  {
    question: "What are the maintenance charges?",
    answer:
      "Maintenance charges depend on the society and final handover terms. Please use the enquiry form to request the latest estimate.",
  },
  {
    question: "Are there any nearby schools?",
    answer:
      "Yes, the neighborhood has multiple schools, parks, and daily convenience options within easy driving distance.",
  },
];

const SIMILAR_PROPERTIES = [
  {
    title: "Emaar Palm Heights",
    location: "Sector 77, Gurgaon",
    price: "₹1.45 Cr",
    rate: "₹12,400/sq.ft",
    details: "3 BHK",
    sqft: "1850 sqft",
    image: "/images/1st,4th.png",
    featured: true,
    verified: true,
  },
  {
    title: "Godrej Woodscapes",
    location: "Whitefield, Bangalore",
    price: "₹85 Lakh",
    rate: "₹6,200/sq.ft",
    details: "2 BHK",
    sqft: "1245 sqft",
    image: "/images/2nd.png",
    badge: "NEW LAUNCH",
  },
  {
    title: "Oberoi Sky City",
    location: "Borivali East, Mumbai",
    price: "₹4.2 Cr",
    rate: "₹18,500/sq.ft",
    details: "4 BHK",
    sqft: "2600 sqft",
    image: "/images/3rd.png",
    verified: true,
  },
  {
    title: "Emaar Palm Heights",
    location: "Sector 77, Gurgaon",
    price: "₹1.45 Cr",
    rate: "₹12,400/sq.ft",
    details: "3 BHK",
    sqft: "1850 sqft",
    image: "/images/1st,4th.png",
    featured: true,
    verified: true,
  },
];

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
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {item.featured ? (
            <span className="inline-flex h-[23px] items-center justify-center rounded-full bg-[#EF4444] px-3 text-[10px] font-bold leading-[15px] text-white">
              FEATURED
            </span>
          ) : null}
          {item.badge === "NEW LAUNCH" ? (
            <span className="inline-flex h-[23px] items-center justify-center rounded-full bg-[#F04444] px-3 text-[10px] font-bold leading-[15px] text-white">
              NEW LAUNCH
            </span>
          ) : item.verified ? (
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
          <AreaIcon />
          <span className="whitespace-nowrap">{item.sqft}</span>
        </div>
      </div>
    </Link>
  );
}

function PropertyDetailPage() {
  const { id } = useParams();
  const location = useLocation();
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const routeProperty = propertyResults.find((item) => String(item.id) === id);
  const property = routeProperty || location.state?.property;

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
          <Link
            to="/properties?city=Mumbai"
            className="font-normal text-[#9CA3AF] transition hover:text-[#111827]"
          >
            Mumbai
          </Link>
          <span aria-hidden="true" className="text-[#D1D5DB]">
            &gt;
          </span>
          <Link
            to="/properties?city=Mumbai&type=Flat"
            className="font-normal text-[#9CA3AF] transition hover:text-[#111827]"
          >
            Flats
          </Link>
          <span aria-hidden="true" className="text-[#D1D5DB]">
            &gt;
          </span>
          <span className="font-semibold text-[#111827]">{property.title}</span>
        </nav>
      </section>

      <section className="mx-auto max-w-full px-0 py-0 sm:px-6 sm:py-6 lg:px-12 lg:py-10">
        <PropertyGallery
          images={[
            "/images/detail%201.png",
            ...(property.images && property.images.length ? property.images : [property.image]),
          ]}
          title={property.title}
          heroOverlay={
            <>
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <span className="inline-flex h-[23px] items-center justify-center rounded-full bg-[#EF4444] px-3 text-[10px] font-bold leading-[15px] text-white">
                  FEATURED
                </span>
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
              </div>
              <button
                type="button"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                aria-pressed={isFavorite}
                onClick={(event) => {
                  event.stopPropagation();
                  setIsFavorite((value) => !value);
                }}
                className={`absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition-colors sm:hidden ${
                  isFavorite ? "text-[#E51C23]" : "text-[#64748B]"
                }`}
              >
                <span className="text-[22px] leading-none">{isFavorite ? "♥" : "♡"}</span>
              </button>
              <span className="absolute bottom-3 right-3 rounded-[3px] bg-black/45 px-1.5 py-0.5 text-[11px] font-medium text-white sm:hidden">1/12 Images</span>
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
                    {property.title}, Borivali
                  </h1>
                  <span className="mt-3 inline-flex h-[28px] shrink-0 items-center rounded-[8px] bg-[#111827] px-3 text-[10px] font-bold text-white sm:hidden">
                    89% Match
                  </span>
                </div>

                <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[#6B7280] sm:text-[15px]">
                  <LocationIcon />
                  {property.location}
                </p>
              </div>

              <div className="flex items-baseline gap-3 text-left sm:block lg:text-right">
                <div className="text-[24px] font-black leading-none text-[#111827] sm:text-[30px]">
                  ₹{formatRupeeValue(property.price)}
                </div>
                <div className="mt-0 whitespace-nowrap text-[12px] leading-[18px] text-[#9CA3AF] sm:mt-1 sm:text-[13px]">
                  ₹{formatRupeeValue(property.rate)}
                </div>
              </div>
            </div>

            <div className="mt-6 hidden flex-col border-y border-[#F3F4F6] py-5 sm:flex sm:flex-row sm:items-stretch sm:gap-0">
              {[
                { label: "RERA Approved", value: "P51800003521" },
                { label: "Top Builder", value: "Oberoi Realty" },
                { label: "95% Match", value: "For your profile" },
              ].map((item) => (
                <div
                  key={item.label}
                  className={[
                    "flex items-center border-r border-[#F3F4F6] py-0",
                    item.label === "RERA Approved"
                      ? "w-[150px] pr-8 sm:pr-6"
                      : item.label === "Top Builder"
                        ? "w-[150px] px-8 sm:px-8"
                        : "w-[150px] px-8 sm:px-8 border-r-0",
                  ].join(" ")}
                >
                  <div className="w-full">
                    <div className="whitespace-nowrap text-[14px] font-bold leading-tight text-[#111827]">{item.label}</div>
                    <div className="mt-1 whitespace-nowrap text-[13px] leading-tight text-[#6B7280]">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 hidden grid-cols-2 gap-x-5 gap-y-6 sm:mt-8 sm:grid sm:grid-cols-3 sm:gap-4">
                {[
                  { label: "Configuration", value: "3 BHK Apartment", icon: <RedBedIcon /> },
                  { label: "Carpet Area", value: "1850 sqft", icon: <RedAreaIcon /> },
                  {
                    label: "Facing",
                    value: "East Facing",
                    icon: <img src="/icons/compass.png" alt="" aria-hidden="true" className="h-4 w-4 shrink-0 object-contain" />,
                  },
                  { label: "Status", value: "Ready to Move", icon: <PromiseIcon /> },
                ].map((item) => (
                <div key={item.label} className={["rounded-none border-0 bg-transparent p-0 shadow-none sm:rounded-[14px] sm:border sm:border-[#E5E7EB] sm:bg-white sm:p-4 sm:shadow-[0_1px_2px_rgba(15,23,42,0.04)]", item.label === "Status" ? "sm:hidden" : ""].join(" ")}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF] sm:text-[12px]">
                    {item.label}
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-[12px] font-bold text-[#111827] sm:text-[16px]">
                    {item.icon}
                    <span>{item.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-x-5 gap-y-5 border-y border-[#F3F4F6] py-4 sm:hidden">
              {[
                { label: "Bedrooms", value: "3 BHK", icon: <RedBedIcon /> },
                { label: "Super Area", value: "1850 sqft", icon: <RedAreaIcon /> },
                { label: "Orientation", value: "West Facing", icon: <img src="/icons/compass.png" alt="" aria-hidden="true" className="h-4 w-4 object-contain" /> },
                { label: "Status", value: "Ready to Move", icon: <RedKeyIcon /> },
              ].map((item) => (
                <div key={item.label} className="min-w-0">
                  <div className="flex items-center gap-2 text-[14px] font-bold leading-5 text-[#111827]">
                    {item.icon}
                    <span className="truncate">{item.value}</span>
                  </div>
                  <div className="ml-6 text-[11px] leading-4 text-[#6B7280]">{item.label}</div>
                </div>
              ))}
            </div>

            <section className="mt-8 w-full lg:mt-10 lg:max-w-[1024px]">
              <h2 className="text-[20px] font-extrabold leading-tight text-[#111827] sm:text-[20px]">About this Property</h2>
              <div className="mt-4 space-y-8 text-[14px] leading-6 text-[#4B5563] sm:text-[15px] sm:leading-8">
                <p className="w-full max-h-[144px] overflow-hidden sm:max-h-none">
                  {property.title} is a landmark residential development in {property.location.split(",")[0]},
                  thoughtfully spread across 25 acres of beautifully planned landscapes, open spaces, and world-class
                  lifestyle amenities. Designed for modern urban living, the project seamlessly blends luxury,
                  comfort, and convenience while offering breathtaking views of the surrounding cityscape.
                </p>
                <p className="hidden w-full sm:block">
                  This spacious {property.details.toLowerCase()} residence features intelligently planned interiors,
                  expansive living and dining areas, premium finishes, large windows for abundant natural light, and
                  well-appointed bedrooms that maximize comfort and functionality. Every detail has been carefully
                  crafted to deliver a refined living experience, from high-quality materials to thoughtfully designed
                  community spaces.
                </p>
                {isAboutExpanded ? (
                  <p className="w-full">
                    The project also benefits from curated amenities, a well-connected address, and a neighborhood
                    profile that makes day-to-day living practical for families and investors alike. With premium
                    planning, verified documentation, and strong builder credentials, this listing stands out as a
                    compelling long-term choice in the local market.
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => setIsAboutExpanded((value) => !value)}
                aria-expanded={isAboutExpanded}
                className="mt-4 inline-flex items-center gap-1 text-[14px] font-semibold text-[#E51C23]"
              >
                {isAboutExpanded ? 'Read less' : 'Read more'}
                <span className={isAboutExpanded ? 'rotate-180 transition-transform' : 'transition-transform'}>
                  <ChevronDownIcon />
                </span>
              </button>
            </section>
            <div className="relative left-1/2 mx-0 mt-8 h-[415px] w-[402px] max-w-none -translate-x-1/2 rounded-[16px] bg-[#F9FAFB] px-8 pt-6 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] sm:relative sm:left-auto sm:mx-0 sm:mt-10 sm:h-auto sm:w-full sm:max-w-none sm:translate-x-0 sm:p-8 sm:shadow-none">
              <h2 className="flex items-center gap-2 text-[18px] font-extrabold leading-tight text-[#111827]"><span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#E51C23] text-[12px] font-bold text-white">i</span>Property Details</h2>
              <div className="mt-6 grid grid-cols-1 gap-x-12 gap-y-2 sm:grid-cols-2 sm:gap-y-8">
                {[
                  { label: "Status", value: "Ready to Move" },
                  { label: "Floor", value: "24th of 60 Floors" },
                  { label: "Furnishing", value: "Semi-Furnished" },
                  { label: "Parking", value: "2 Covered" },
                  { label: "Age of Property", value: "New Construction" },
                  { label: "Gated Community", value: "Yes" },
                ].map((item) => (
                  <div key={item.label} className="mt-4 flex h-[33px] items-center justify-between border-b border-[#E5E7EB] first:mt-0 last:border-b-0 sm:h-auto sm:items-end sm:pb-4 sm:first:mt-4 sm:last:border-b">
                    <div className="pr-4 text-[14px] leading-tight text-[#6B7280] sm:text-[16px]">{item.label}</div>
                    <div className="whitespace-nowrap text-right text-[14px] font-bold leading-tight text-[#111827] sm:text-[16px]">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mx-0 mt-8 rounded-none border-0 bg-transparent p-0 sm:mx-0 sm:rounded-[16px] sm:border sm:border-[#E5E7EB] sm:bg-white sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-[20px] font-bold leading-[28px] tracking-[-0.0088em] text-[#111827] sm:text-[20px] sm:font-extrabold sm:leading-tight sm:tracking-normal">Amenities &amp; Lifestyle</h2>
                <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#9CA3AF]">
                  32 Total
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-1 md:mt-6 md:grid-cols-4 md:gap-4">
                {AMENITY_LIFESTYLE.map((amenity) => (
                  <div
                    key={amenity.label}
                    className="flex min-h-[86px] flex-col items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-white px-2 py-3 text-center shadow-[0_1px_2px_rgba(15,23,42,0.04)] md:min-h-[136px] md:rounded-[14px] md:px-3 md:py-5"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F9FAFB] md:h-14 md:w-14">
                      {amenity.icon}
                    </div>
                    <div className="mt-2 text-[14px] font-semibold leading-tight text-[#111827] md:mt-4 md:text-[16px]">{amenity.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative left-1/2 mt-8 h-[352.48px] w-[402px] -translate-x-1/2 rounded-none border-0 bg-transparent px-7 py-6 shadow-none sm:relative sm:left-auto sm:mt-10 sm:h-auto sm:w-auto sm:translate-x-0 sm:rounded-[18px] sm:border sm:border-[#E5E7EB] sm:bg-white sm:p-8 sm:shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
              <h2 className="text-[20px] font-extrabold leading-tight text-[#111827] sm:text-[20px]">Market Trends &amp; Insights</h2>
              <p className="mt-1 text-[12px] text-[#6B7280] sm:text-[14px]">
                How has {property.location.split(",")[0]} performed over the last 3 years?
              </p>

              <div className="mt-[12.68px] h-[135.8px] w-[337.086px] max-w-full overflow-hidden rounded-[12px] bg-white sm:mt-8 sm:h-auto sm:w-full">
                <svg viewBox="0 0 880 320" className="h-[135.8px] w-full sm:h-full" fill="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FDECEC" stopOpacity="0.7" />
                      <stop offset="100%" stopColor="#FDECEC" stopOpacity="0.08" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="880" height="320" rx="12" fill="#FFFFFF" />
                  <g stroke="#F3F4F6" strokeWidth="1">
                    <line x1="80" y1="40" x2="80" y2="250" />
                    <line x1="240" y1="40" x2="240" y2="250" />
                    <line x1="400" y1="40" x2="400" y2="250" />
                    <line x1="560" y1="40" x2="560" y2="250" />
                    <line x1="720" y1="40" x2="720" y2="250" />
                    <line x1="80" y1="250" x2="840" y2="250" />
                    <line x1="80" y1="200" x2="840" y2="200" />
                    <line x1="80" y1="150" x2="840" y2="150" />
                    <line x1="80" y1="100" x2="840" y2="100" />
                    <line x1="80" y1="50" x2="840" y2="50" />
                  </g>
                  <path
                    d="M80 188 L240 180 L400 164 L560 154 L720 138 L840 126 L840 250 L80 250 Z"
                    fill="url(#trendFill)"
                  />
                  <path
                    d="M80 188 L240 180 L400 164 L560 154 L720 138 L840 126"
                    stroke="#E51C23"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {[
                    [80, 188],
                    [240, 180],
                    [400, 164],
                    [560, 154],
                    [720, 138],
                    [840, 126],
                  ].map(([x, y]) => (
                    <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="#E51C23" />
                  ))}
                  {[
                    ["₹0", 40, 254],
                    ["₹5k", 40, 204],
                    ["₹10k", 34, 154],
                    ["₹15k", 34, 104],
                    ["₹20k", 34, 54],
                    ["Jan 2022", 80, 276],
                    ["Jul 2022", 240, 276],
                    ["Jan 2023", 400, 276],
                    ["Jul 2023", 560, 276],
                    ["Jan 2024", 720, 276],
                    ["Presents", 840, 276],
                  ].map(([label, x, y]) => (
                    <text
                      key={label}
                      x={x}
                      y={y}
                      fill="#6B7280"
                      fontSize="12"
                      fontFamily="Lato, sans-serif"
                      textAnchor={label.startsWith("Jan") || label.startsWith("Jul") || label === "Presents" ? "middle" : "start"}
                    >
                      {label}
                    </text>
                  ))}
                </svg>
              </div>

              <div className="mt-4 grid h-[96px] grid-cols-3 gap-6 sm:mt-8 sm:h-auto sm:gap-4">
                <div className="h-20 rounded-[14px] bg-[#F9FAFB] p-4 sm:h-auto">
                  <div className="text-[8px] font-semibold text-[#6B7280] sm:text-[12px]">Annual Appreciation</div>
                  <div className="mt-2 text-[13px] font-black leading-tight text-[#16A34A] sm:text-[26px]">+8.4%</div>
                </div>
                <div className="h-20 rounded-[14px] bg-[#F9FAFB] p-4 sm:h-auto">
                  <div className="text-[8px] font-semibold text-[#6B7280] sm:text-[12px]">Estimated Rent</div>
                  <div className="mt-2 text-[13px] font-black leading-tight text-[#111827] sm:text-[26px]">₹1.2L / mo</div>
                </div>
                <div className="h-20 rounded-[14px] bg-[#F9FAFB] p-4 sm:h-auto">
                  <div className="text-[8px] font-semibold text-[#6B7280] sm:text-[12px]">Locality Rating</div>
                  <div className="mt-2 flex items-center gap-1 text-[13px] font-black leading-tight text-[#111827] sm:text-[26px]">
                    <span>4.5</span>
                    <img src="/icons/star.png" alt="" aria-hidden="true" className="h-4 w-4 shrink-0 object-contain sm:h-5 sm:w-5" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-[20px] font-extrabold leading-tight text-[#111827] sm:text-[20px]">Frequently Asked Questions</h2>
              <div className="mt-4 space-y-3">
                {FAQS.map((item, index) => {
                  const isOpen = openFaqIndex === index;
                  return (
                    <button
                      key={item.question}
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full rounded-[14px] border border-[#F3F4F6] bg-white px-4 py-4 text-left transition hover:border-[#E5E7EB] sm:px-5"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <span className="text-[14px] font-semibold text-[#111827] sm:text-[14px]">{item.question}</span>
                        <span className="text-[18px] font-bold leading-none text-[#9CA3AF]">{isOpen ? "−" : "+"}</span>
                      </div>
                      {isOpen ? <p className="mt-3 text-[14px] leading-7 text-[#6B7280]">{item.answer}</p> : null}
                    </button>
                  );
                })}
              </div>
              <p className="mt-6 w-[370px] max-w-full text-justify text-[8px] font-normal uppercase leading-[16.25px] tracking-[1px] text-[#9CA3AF] sm:w-auto sm:text-left sm:text-[11px] sm:leading-5 sm:tracking-[0.08em] sm:text-[#CBD5E1]">
                Disclaimer: The information provided on this page is based on data collected from the builder or primary
                source. PropertySerch.com does not guarantee the accuracy of this information. Buyers are advised to
                verify details with the developer before making any financial commitment.
              </p>
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
                <button
                  type="button"
                  className="cta-red inline-flex h-[46px] flex-1 items-center justify-center rounded-[12px] px-5 text-[14px] font-bold text-white"
                >
                  Enquire Now
                </button>
                <button
                  type="button"
                  aria-label="Call"
                  className="inline-flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[12px] border-2 border-[#E51C23] bg-white text-[#E51C23]"
                >
                  <img src="/icons/phone.png" alt="" aria-hidden="true" className="h-[16px] w-[16px] object-contain" />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="inline-flex h-[68px] items-center justify-center gap-3 rounded-[20px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[18px] font-semibold text-[#374151]"
                >
                  <img src="/icons/fav%20icon.png" alt="" aria-hidden="true" className="h-5 w-5 shrink-0 object-contain" />
                  Save
                </button>

                <button
                  type="button"
                  className="inline-flex h-[68px] items-center justify-center gap-3 rounded-[20px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[18px] font-semibold text-[#374151]"
                >
                  <img src="/icons/share.png" alt="" aria-hidden="true" className="h-5 w-5 shrink-0 object-contain" />
                  Share
                </button>
              </div>

              <div className="mt-6 border-t border-[#F3F4F6] pt-4 text-center text-[12px] text-[#6B7280]">
                Secure &amp; Direct Verification
              </div>
            </div>

              <div className="rounded-[20px] border border-[#E5E7EB] bg-white p-5 shadow-[0_16px_32px_rgba(15,23,42,0.08)]">
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[12px] border border-[#F3F4F6] bg-[#FAFAFA] text-[11px] font-bold uppercase tracking-[0.14em] text-[#C4B5A5]">
                    OR
                  </div>
                  <div className="min-w-0">
                    <div className="text-[18px] font-bold leading-tight text-[#111827]">Oberoi Realty</div>
                    <div className="mt-1 flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7280]">
                      <div className="flex items-center gap-0.5">
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                        <StarIcon />
                      </div>
                      <span>4.9/5</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[12px] bg-[#F9FAFB] px-4 py-4 text-center">
                    <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Exp.</div>
                    <div className="mt-1 text-[18px] font-black leading-tight text-[#111827]">40 Yrs</div>
                  </div>
                  <div className="rounded-[12px] bg-[#F9FAFB] px-4 py-4 text-center">
                    <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Projects</div>
                    <div className="mt-1 text-[18px] font-black leading-tight text-[#111827]">32+</div>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-5 inline-flex h-[42px] w-full items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-white text-[14px] font-bold text-[#374151] transition hover:border-[#D1D5DB]"
                >
                  View All Projects
                </button>
              </div>

              <div className="rounded-[16px] border border-[#FFE4E4] bg-[#FFF9F9] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                    <PromiseIcon />
                  </div>
                  <div>
                    <div className="text-[16px] font-bold leading-tight text-[#111827]">PropertySerch Promise</div>
                    <p className="mt-1 text-[13px] leading-6 text-[#6B7280]">
                      We guarantee direct developer pricing and 100% verified documentation for this listing. No hidden
                      charges.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-full px-4 sm:px-6 lg:px-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-extrabold leading-tight text-[#111827] sm:text-[22px]">Similar Properties</h2>
            <p className="mt-1 text-[12px] text-[#6B7280] sm:text-[14px]">Curated listings matching your search criteria</p>
          </div>
          <Link to="/properties" className="mb-5 inline-flex items-center gap-2 text-[12px] font-semibold text-[#E51C23] sm:text-[14px]">
            View All
            <img src="/icons/Img%20(1).png" alt="" aria-hidden="true" className="h-[12px] w-[7.5px] shrink-0 object-contain" />
          </Link>
        </div>
        <div className="scrollbar-hide mt-5 flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible xl:grid-cols-4">
          {SIMILAR_PROPERTIES.map((item, index) => (
            <SimilarPropertyCard key={`${item.title}-${item.location}-${index}`} item={item} />
          ))}
        </div>
      </section>

      <CompanyFooterSection />
    </main>
  );
}

export default PropertyDetailPage;


