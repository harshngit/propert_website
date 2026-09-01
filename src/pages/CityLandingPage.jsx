import React from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import HomeHeroSection from "../components/home/HomeHeroSection";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import CityTickerSection from "../components/home/CityTickerSection";
import VerifiedListingsSection from "../components/home/VerifiedListingsSection";
import BuilderDirectSection from "../components/home/BuilderDirectSection";
import MarketInsightsSection from "../components/home/MarketInsightsSection";
import PopularNeighborhoodsSection from "../components/home/PopularNeighborhoodsSection";
import TrustSection from "../components/home/TrustSection";
import { fromCitySlug } from "../utils/city";
import { buildPropertyDetailPath } from "../utils/propertySearch";

const IMAGE_POOL = ["/images/1st,4th.png", "/images/2nd.png", "/images/3rd.png"];




const CITY_PROFILES = {
  Mumbai: {
    heroTitle: "Real Estate in Mumbai",
    heroDescription:
      "Mumbai, India's financial capital, offers a dynamic real estate market with premium developments, strong appreciation, and exceptional investment opportunities across established and emerging locations.",
    heroDescriptionLines: [
      "Mumbai, India's financial capital, offers a dynamic real estate market with premium developments, strong appreciation,",
      "and exceptional investment opportunities across established and emerging locations.",
    ],
    subtitle: "Sea-facing towers, high-energy micro-markets, and some of the country's most premium residential corridors.",
    metrics: [
      { label: "Verified Listings", value: "1,245+" },
      { label: "Popular Localities", value: "48+" },
      { label: "Avg. Starting Price", value: "₹1.45 Cr" },
    ],
    areas: ["Bandra West", "Andheri West", "Powai", "Worli", "Juhu", "Borivali East"],
    highlights: ["Luxury apartments", "Coastal views", "Prime investment corridor"],
    neighborhoods: [
      {
        title: "Worli",
        count: "842 Properties",
        description: "Sea-facing ultra-luxury towers and high connectivity.",
      },
      {
        title: "Andheri West",
        count: "1,245 Properties",
        description: "The vibrant heart of media, food, and high-street retail.",
      },
      {
        title: "Powai",
        count: "612 Properties",
        description: "Premium townships with an upscale European vibe.",
      },
      {
        title: "Bandra West",
        count: "428 Properties",
        description: "The Queen of Suburbs, high-end heritage luxury.",
      },
      {
        title: "Malad West",
        count: "915 Properties",
        description: "Growing IT hub with excellent lifestyle amenities.",
      },
      {
        title: "Goregaon East",
        count: "706 Properties",
        description: "Well-connected homes with modern amenities and strong rental demand.",
        mobileOnly: true,
      },
    ],
  },
  Delhi: {
    heroTitle: "Real Estate in Delhi",
    heroDescription:
      "Delhi's residential market spans premium family homes, strategic locations, and a diverse mix of neighborhoods with long-term lifestyle and investment value.",
    heroDescriptionLines: [
      "Delhi's residential market spans premium family homes, strategic locations,",
      "and a diverse mix of neighborhoods with long-term lifestyle and investment value.",
    ],
    subtitle: "Wide roads, premium condominiums, and strong owner-occupier demand across South and West Delhi.",
    metrics: [
      { label: "Verified Listings", value: "980+" },
      { label: "Popular Localities", value: "36+" },
      { label: "Avg. Starting Price", value: "₹1.10 Cr" },
    ],
    areas: ["Saket", "Dwarka", "Rajouri Garden", "Vasant Kunj", "Janakpuri", "South Delhi"],
    highlights: ["Low-rise homes", "Family neighborhoods", "Elite builder inventory"],
    neighborhoods: [
      {
        title: "Saket",
        count: "610 Properties",
        description: "Premium malls, arterial roads, and established residential pockets.",
      },
      {
        title: "Dwarka",
        count: "1,020 Properties",
        description: "Planned sectors, wide roads, and strong family demand.",
      },
      {
        title: "Rajouri Garden",
        count: "548 Properties",
        description: "A lively market with retail energy and mixed housing stock.",
      },
      {
        title: "Vasant Kunj",
        count: "482 Properties",
        description: "Low-density living with premium condominiums and green pockets.",
      },
      {
        title: "Janakpuri",
        count: "694 Properties",
        description: "Well-connected neighborhoods with strong end-user appeal.",
      },
    ],
  },
  Bengaluru: {
    heroTitle: "Real Estate in Bengaluru",
    heroDescription:
      "Bengaluru combines tech-led demand, high-quality gated communities, and a broad mix of homes suited for professionals, families, and investors.",
    heroDescriptionLines: [
      "Bengaluru combines tech-led demand, high-quality gated communities,",
      "and a broad mix of homes suited for professionals, families, and investors.",
    ],
    subtitle: "Tech-driven demand, gated communities, and a strong preference for modern apartments and villas.",
    metrics: [
      { label: "Verified Listings", value: "860+" },
      { label: "Popular Localities", value: "40+" },
      { label: "Avg. Starting Price", value: "₹85 Lakh" },
    ],
    areas: ["Whitefield", "Indiranagar", "Sarjapur", "Electronic City", "Hebbal", "Jayanagar"],
    highlights: ["IT corridor homes", "Investor-friendly", "Gated communities"],
    neighborhoods: [
      {
        title: "Whitefield",
        count: "735 Properties",
        description: "Tech-led demand with large gated communities and modern towers.",
      },
      {
        title: "Indiranagar",
        count: "418 Properties",
        description: "Premium lifestyle living with dining, retail, and urban convenience.",
      },
      {
        title: "Sarjapur",
        count: "580 Properties",
        description: "Fast-growing corridor with fresh launches and good commute access.",
      },
      {
        title: "Electronic City",
        count: "642 Properties",
        description: "Value-rich apartments popular with professionals and investors.",
      },
      {
        title: "Hebbal",
        count: "399 Properties",
        description: "Airport-linked growth pocket with premium high-rise options.",
      },
    ],
  },
  Pune: {
    heroTitle: "Real Estate in Pune",
    heroDescription:
      "Pune's market blends affordable premium housing, new-township growth, and strong end-user demand across the city's most active corridors.",
    heroDescriptionLines: [
      "Pune's market blends affordable premium housing, new-township growth,",
      "and strong end-user demand across the city's most active corridors.",
    ],
    subtitle: "Balanced price points, modern townships, and a healthy mix of end-user and investment demand.",
    metrics: [
      { label: "Verified Listings", value: "740+" },
      { label: "Popular Localities", value: "31+" },
      { label: "Avg. Starting Price", value: "₹72 Lakh" },
    ],
    areas: ["Hinjewadi", "Baner", "Kharadi", "Wakad", "Aundh", "Magarpatta"],
    highlights: ["Young professionals", "New launches", "Township living"],
    neighborhoods: [
      {
        title: "Hinjewadi",
        count: "690 Properties",
        description: "IT-driven demand with modern townships and strong rental interest.",
      },
      {
        title: "Baner",
        count: "520 Properties",
        description: "Popular for premium apartments and good social infrastructure.",
      },
      {
        title: "Kharadi",
        count: "610 Properties",
        description: "A fast-moving eastern corridor with new-age residential supply.",
      },
      {
        title: "Wakad",
        count: "570 Properties",
        description: "End-user friendly pocket with balanced connectivity and pricing.",
      },
      {
        title: "Aundh",
        count: "355 Properties",
        description: "Established urban housing with high livability and convenience.",
      },
    ],
  },
  Hyderabad: {
    heroTitle: "Real Estate in Hyderabad",
    heroDescription:
      "Hyderabad features fast-growing luxury neighborhoods, premium villa communities, and a market that continues to attract both buyers and investors.",
    heroDescriptionLines: [
      "Hyderabad features fast-growing luxury neighborhoods, premium villa communities,",
      "and a market that continues to attract both buyers and investors.",
    ],
    subtitle: "Large-format homes, premium villa communities, and a fast-growing luxury market with excellent connectivity.",
    metrics: [
      { label: "Verified Listings", value: "620+" },
      { label: "Popular Localities", value: "28+" },
      { label: "Avg. Starting Price", value: "₹95 Lakh" },
    ],
    areas: ["Gachibowli", "Kondapur", "Madhapur", "Banjara Hills", "Kokapet", "Jubilee Hills"],
    highlights: ["Villa communities", "IT hub demand", "Premium gated projects"],
    neighborhoods: [
      {
        title: "Gachibowli",
        count: "760 Properties",
        description: "Corporate corridor living with premium apartments and high demand.",
      },
      {
        title: "Kondapur",
        count: "620 Properties",
        description: "A balanced residential market with strong social infrastructure.",
      },
      {
        title: "Madhapur",
        count: "540 Properties",
        description: "Connected to the tech ecosystem with active buyer interest.",
      },
      {
        title: "Banjara Hills",
        count: "310 Properties",
        description: "Luxury low-density living in one of the city's prime addresses.",
      },
      {
        title: "Kokapet",
        count: "455 Properties",
        description: "A rapidly growing premium pocket with large-format homes.",
      },
    ],
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
  const detailPath = buildPropertyDetailPath(item);

  return (
    <Link
      to={detailPath}
      state={{ property: item }}
      onClick={() => window.scrollTo(0, 0)}
      className="block overflow-hidden rounded-[18px] border border-[#E5E7EB] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
      aria-label={`${item.title} - ${item.location}`}
    >
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
    </Link>
  );
}

function CityLandingPage() {
  const params = useParams();
  const cityLabel = fromCitySlug(params.citySlug);
  const profile = CITY_PROFILES[cityLabel] || {
    heroTitle: `Real Estate in ${cityLabel}`,
    heroDescription: `Browse curated residential listings, neighborhood insights, and investment opportunities tailored to ${cityLabel}.`,
    heroDescriptionLines: [
      `Browse curated residential listings, neighborhood insights,`,
      `and investment opportunities tailored to ${cityLabel}.`,
    ],
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
  const neighborhoodItems =
    profile.neighborhoods ||
    profile.areas.slice(0, 5).map((area, index) => ({
      title: area,
      count: "Properties",
      description: `${cityLabel}'s ${index + 1} most active residential pocket.`,
    }));

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [cityLabel]);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <SiteHeader />
      <HomeHeroSection
        currentCity={cityLabel}
        showBadge={false}
        cityLandingMobile
        titlePrefix="Real Estate in"
        titleHighlight={cityLabel}
        descriptionLines={profile.heroDescriptionLines || [profile.heroDescription]}
      />

      

      <section className="px-4 pb-7 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <VerifiedListingsSection
            title="Exclusive Properties in"
            accent={cityLabel}
            subtitle="Curated properties with verified details in your city"
            items={verifiedListings}
            showMessage={false}
          />
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          <BuilderDirectSection
            badgeText="Builder Direct"
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
          mobileCityLayout
          subtitle={`Real-time data for informed investment decisions in ${cityLabel}`}
          trendTitle="Price Appreciation Trend (Past 5 Years)"
          comparisonTitle="Demand vs Supply Index (By Locality)"
          localityLabels={marketLabels}
        />
      </section>

      <PopularNeighborhoodsSection
        cityLabel={cityLabel}
        subtitle="Discover the most sought-after residential hubs in the city"
        items={neighborhoodItems}
        viewAllHref={`/properties?city=${encodeURIComponent(cityLabel)}&view=list`}
      />

      <section className="px-4 sm:px-6 lg:px-12">
        <TrustSection
          title={`Testimonials in ${cityLabel}`}
          subtitle={`Trusted by owners, buyers and institutions in ${cityLabel}`}
        />
      </section>

      <CompanyFooterSection />
    </main>
  );
}

export default CityLandingPage;

