import React from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import HomeHeroSection from "../components/home/HomeHeroSection";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import VerifiedListingsSection from "../components/home/VerifiedListingsSection";
import BuilderDirectSection from "../components/home/BuilderDirectSection";
import MarketInsightsSection from "../components/home/MarketInsightsSection";
import { CITY_OPTIONS, buildCityPath, fromCitySlug } from "../utils/city";

const IMAGE_POOL = ["/images/1st,4th.png", "/images/2nd.png", "/images/3rd.png"];

const CITY_PROFILES = {
  Mumbai: {
    heroTitle: "Real Estate in Mumbai",
    heroDescription:
      "Mumbai, India's financial capital, offers a dynamic real estate market with premium developments, strong appreciation, and exceptional investment opportunities across established and emerging locations.",
    subtitle: "Sea-facing towers, high-energy micro-markets, and some of the country's most premium residential corridors.",
    metrics: [
      { label: "Verified Listings", value: "1,245+" },
      { label: "Popular Localities", value: "48+" },
      { label: "Avg. Starting Price", value: "₹1.45 Cr" },
    ],
    areas: ["Bandra West", "Andheri West", "Powai", "Worli", "Juhu", "Borivali East"],
    highlights: ["Luxury apartments", "Coastal views", "Prime investment corridor"],
  },
  Delhi: {
    heroTitle: "Real Estate in Delhi",
    heroDescription:
      "Delhi's residential market spans premium family homes, strategic locations, and a diverse mix of neighborhoods with long-term lifestyle and investment value.",
    subtitle: "Wide roads, premium condominiums, and strong owner-occupier demand across South and West Delhi.",
    metrics: [
      { label: "Verified Listings", value: "980+" },
      { label: "Popular Localities", value: "36+" },
      { label: "Avg. Starting Price", value: "₹1.10 Cr" },
    ],
    areas: ["Saket", "Dwarka", "Rajouri Garden", "Vasant Kunj", "Janakpuri", "South Delhi"],
    highlights: ["Low-rise homes", "Family neighborhoods", "Elite builder inventory"],
  },
  Bengaluru: {
    heroTitle: "Real Estate in Bengaluru",
    heroDescription:
      "Bengaluru combines tech-led demand, high-quality gated communities, and a broad mix of homes suited for professionals, families, and investors.",
    subtitle: "Tech-driven demand, gated communities, and a strong preference for modern apartments and villas.",
    metrics: [
      { label: "Verified Listings", value: "860+" },
      { label: "Popular Localities", value: "40+" },
      { label: "Avg. Starting Price", value: "₹85 Lakh" },
    ],
    areas: ["Whitefield", "Indiranagar", "Sarjapur", "Electronic City", "Hebbal", "Jayanagar"],
    highlights: ["IT corridor homes", "Investor-friendly", "Gated communities"],
  },
  Pune: {
    heroTitle: "Real Estate in Pune",
    heroDescription:
      "Pune's market blends affordable premium housing, new-township growth, and strong end-user demand across the city's most active corridors.",
    subtitle: "Balanced price points, modern townships, and a healthy mix of end-user and investment demand.",
    metrics: [
      { label: "Verified Listings", value: "740+" },
      { label: "Popular Localities", value: "31+" },
      { label: "Avg. Starting Price", value: "₹72 Lakh" },
    ],
    areas: ["Hinjewadi", "Baner", "Kharadi", "Wakad", "Aundh", "Magarpatta"],
    highlights: ["Young professionals", "New launches", "Township living"],
  },
  Hyderabad: {
    heroTitle: "Real Estate in Hyderabad",
    heroDescription:
      "Hyderabad features fast-growing luxury neighborhoods, premium villa communities, and a market that continues to attract both buyers and investors.",
    subtitle: "Large-format homes, premium villa communities, and a fast-growing luxury market with excellent connectivity.",
    metrics: [
      { label: "Verified Listings", value: "620+" },
      { label: "Popular Localities", value: "28+" },
      { label: "Avg. Starting Price", value: "₹95 Lakh" },
    ],
    areas: ["Gachibowli", "Kondapur", "Madhapur", "Banjara Hills", "Kokapet", "Jubilee Hills"],
    highlights: ["Villa communities", "IT hub demand", "Premium gated projects"],
  },
};

function buildFeaturedListings(cityLabel, areas) {
  return [
    {
      title: `${cityLabel} Signature Heights`,
      location: `${areas[0] || cityLabel} • ${cityLabel}`,
      price: "₹2.1 Cr",
      rate: "₹22,400/sq.ft",
      details: "3 BHK",
      sqft: "1850 sq.ft",
      image: IMAGE_POOL[0],
      badge: "FEATURED",
      match: "95% Match",
    },
    {
      title: `${cityLabel} Palm Residency`,
      location: `${areas[1] || cityLabel} • ${cityLabel}`,
      price: "₹1.75 Cr",
      rate: "₹19,200/sq.ft",
      details: "2 BHK",
      sqft: "1245 sq.ft",
      image: IMAGE_POOL[1],
      badge: "NEW LAUNCH",
      match: "89% Match",
    },
    {
      title: `${cityLabel} Skyline Estate`,
      location: `${areas[2] || cityLabel} • ${cityLabel}`,
      price: "₹4.2 Cr",
      rate: "₹24,700/sq.ft",
      details: "4 BHK",
      sqft: "2600 sq.ft",
      image: IMAGE_POOL[2],
      badge: "VERIFIED",
      match: "92% Match",
    },
  ];
}

function buildVerifiedListings(cityLabel, areas) {
  const area1 = areas[0] || cityLabel;
  const area2 = areas[1] || cityLabel;
  const area3 = areas[2] || cityLabel;
  const area4 = areas[3] || cityLabel;

  return [
    {
      badge: "VERIFIED",
      image: "/images/1st,4th.png",
      price: "₹2.1 Cr",
      rate: "₹16,200/sq.ft",
      title: `3BHK Apartment in ${area1}`,
      location: `${area1}, ${cityLabel}`,
      details: "3 BHK",
      area: "1,720 sqft",
      tone: "linear-gradient(135deg, #eef2ff 0%, #c7d2fe 100%)",
    },
    {
      badge: "NEW LAUNCH",
      image: "/images/2nd.png",
      price: "₹95 Lakh",
      rate: "₹7,100/sq.ft",
      title: `2BHK Builder Flat in ${area2}`,
      location: `${area2}, ${cityLabel}`,
      details: "2 BHK",
      area: "1,340 sqft",
      tone: "linear-gradient(135deg, #dbeafe 0%, #93c5fd 100%)",
    },
    {
      badge: "VERIFIED",
      image: "/images/3rd.png",
      price: "₹4.6 Cr",
      rate: "₹19,800/sq.ft",
      title: `Commercial Office Space in ${area3}`,
      location: `${area3}, ${cityLabel}`,
      details: "2,320 sqft",
      area: "4th Floor",
      tone: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 100%)",
    },
    {
      badge: "VERIFIED",
      image: "/images/1st,4th.png",
      price: "₹1.75 Cr",
      rate: "₹14,500/sq.ft",
      title: `3BHK Apartment in ${area4}`,
      location: `${area4}, ${cityLabel}`,
      details: "3 BHK",
      area: "1,650 sqft",
      tone: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
    },
  ];
}

function CityListingCard({ item }) {
  return (
    <article className="overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
      <div className="relative aspect-[1.15] overflow-hidden">
        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          {item.badge === "FEATURED" ? (
            <span className="inline-flex h-[24px] items-center rounded-full bg-[#EF4444] px-3 text-[10px] font-bold uppercase tracking-[0.02em] text-white">
              FEATURED
            </span>
          ) : null}
          {item.badge === "NEW LAUNCH" ? (
            <span className="inline-flex h-[24px] items-center rounded-full bg-[#F04444] px-3 text-[10px] font-bold uppercase tracking-[0.02em] text-white">
              NEW LAUNCH
            </span>
          ) : null}
          {item.badge === "VERIFIED" ? (
            <span className="inline-flex h-[24px] items-center gap-1 rounded-full bg-white px-3 text-[10px] font-bold uppercase tracking-[0.02em] text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.12)]">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#E41C23] text-white">
                <svg aria-hidden="true" viewBox="0 0 16 16" className="h-[10px] w-[10px]" fill="none">
                  <path d="M4 8.5 6.5 11 12 5.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              VERIFIED
            </span>
          ) : null}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="whitespace-nowrap text-[24px] font-black leading-tight text-[#111827]">{item.price}</div>
            <div className="mt-1 whitespace-nowrap text-[12px] leading-tight text-[#6B7280]">{item.rate}</div>
          </div>
          <div className="whitespace-nowrap rounded-full bg-[#111827] px-3 py-2 text-[10px] font-bold text-white">
            {item.match}
          </div>
        </div>

        <h3 className="mt-3 text-[18px] font-bold leading-tight text-[#111827]">{item.title}</h3>
        <p className="mt-1 text-[13px] leading-[19px] text-[#6B7280]">{item.location}</p>

        <div className="mt-4 flex items-center gap-2 border-t border-[#F3F4F6] pt-3 text-[13px] font-semibold text-[#111827]">
          <span className="whitespace-nowrap">{item.details}</span>
          <span className="whitespace-nowrap">•</span>
          <span className="whitespace-nowrap">{item.sqft}</span>
        </div>
      </div>
    </article>
  );
}

function CityLandingPage() {
  const params = useParams();
  const cityLabel = fromCitySlug(params.citySlug);
  const profile = CITY_PROFILES[cityLabel] || {
    heroTitle: `Real Estate in ${cityLabel}`,
    heroDescription: `Browse curated residential listings, neighborhood insights, and investment opportunities tailored to ${cityLabel}.`,
    subtitle: `Browse curated residential inventory and market insights tailored to ${cityLabel}.`,
    metrics: [
      { label: "Verified Listings", value: "500+" },
      { label: "Popular Localities", value: "20+" },
      { label: "Avg. Starting Price", value: "₹75 Lakh" },
    ],
    areas: [cityLabel, `Central ${cityLabel}`, `${cityLabel} East`, `${cityLabel} West`],
    highlights: ["Curated inventory", "High-intent buyers", "Dynamic market snapshot"],
  };

  const featuredListings = buildFeaturedListings(cityLabel, profile.areas);
  const verifiedListings = buildVerifiedListings(cityLabel, profile.areas);
  const marketLabels = profile.areas.slice(0, 5);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <SiteHeader />
      <HomeHeroSection
        currentCity={cityLabel}
        showBadge={false}
        titlePrefix="Real Estate in"
        titleHighlight={cityLabel}
        descriptionLines={[profile.heroDescription]}
      />

      <section className="px-4 pb-7 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <VerifiedListingsSection
            title={`Exclusive Properties in ${cityLabel}`}
            subtitle="Curated properties with verified details in your city"
            items={verifiedListings}
            showMessage={false}
          />
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <BuilderDirectSection
            badgeText="Builder Direct · Zero Brokerage"
            titlePrefix={`The ${cityLabel} Collection,`}
            titleHighlight="by A R Buildwel"
            description={`RERA registered residences in ${cityLabel} with construction progress you can track in real time. No middlemen, direct from the builder, backed end-to-end.`}
            buttonText="Know More"
          />
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-12">
        <MarketInsightsSection
          cityLabel={cityLabel}
          subtitle={`Real-time data for informed investment decisions in ${cityLabel}`}
          trendTitle="Price Appreciation Trend (Past 5 Years)"
          comparisonTitle="Demand vs Supply Index (By Locality)"
          localityLabels={marketLabels}
        />
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-[28px] font-black leading-tight text-[#111827]">Featured properties in {cityLabel}</h2>
              <p className="mt-2 text-[15px] leading-7 text-[#6B7280]">
                A dynamic set of cards for the city page, ready to link into filtered property results.
              </p>
            </div>

            <div className="hidden sm:block">
              <Link to={`/properties?city=${encodeURIComponent(cityLabel)}&view=list`} className="text-[14px] font-bold text-[#E51C23]">
                View all
              </Link>
            </div>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredListings.map((item) => (
              <CityListingCard key={`${item.title}-${item.location}`} item={item} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[#F3F4F6] bg-[#FAFAFA] px-4 py-10 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {CITY_OPTIONS.map((city) => (
              <Link
                key={city}
                to={buildCityPath(city)}
                className={[
                  "rounded-[18px] border px-5 py-5 transition",
                  city === cityLabel ? "border-[#E51C23] bg-[#FFF9F9]" : "border-[#E5E7EB] bg-white hover:border-[#E51C23]",
                ].join(" ")}
              >
                <div className="text-[12px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">City</div>
                <div className="mt-2 text-[20px] font-black text-[#111827]">{city}</div>
                <div className="mt-2 text-[14px] leading-6 text-[#6B7280]">
                  Open a dynamic landing page for {city} with the same shared layout.
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CompanyFooterSection />
    </main>
  );
}

export default CityLandingPage;

