import React, { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import HomeHeroSection from "../components/home/HomeHeroSection";
import VerifiedListingsSection from "../components/home/VerifiedListingsSection";
import ExclusiveCitySection from "../components/home/ExclusiveCitySection";
import BuilderDirectSection from "../components/home/BuilderDirectSection";
import PremiumRealEstateSection from "../components/home/PremiumRealEstateSection";
import PremiumInvestmentSection from "../components/home/PremiumInvestmentSection";
import PropertyManagementSection from "../components/home/PropertyManagementSection";
import FractionalOwnershipSection from "../components/home/FractionalOwnershipSection";
import PartnerGrowthSection from "../components/home/PartnerGrowthSection";
import DealSupportSection from "../components/home/DealSupportSection";
import TrustSection from "../components/home/TrustSection";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import EnquiryModal from "../components/EnquiryModal";
import { apiRequest } from "../api/client";
import { searchProperties } from "../api/properties";
import { normalizeProperty } from "../utils/normalizeProperty";
import { useVisitorCity } from "../hooks/useVisitorCity";

// Home page data comes from GET /search/home (verified + latest listings,
// top cities, auction highlights, disclaimers). The "Exclusive in <city>"
// strip shows the latest listings in the visitor's city (browser location,
// resolved by GET /geo/nearest-city); if their city has no listings yet it
// uses the nearest city that does, and without location it falls back to
// the city with the most live listings. Sections with no live data are
// hidden rather than filled with sample listings.
//
// Service CTAs that have no dedicated page yet (relationship manager,
// institutional desk, financing, fractional / SPV interest) open one shared
// enquiry form, which creates a website lead in the CRM tagged with the topic.

const ENQUIRY_COPY = {
  "NRI Property Management": "Tell us about your property - a relationship manager will call you back.",
  "Institutional Desk": "Buying or selling a school, college, hospital or hotel? Our institutional desk handles it confidentially.",
  "Home Loan & Financing": "Share a few details and we will connect you with the right lender.",
  "Fractional Ownership": "Register your interest in professionally managed real estate from ₹1 Cr to ₹10 Cr.",
  "HNI / NRI SPV Opportunities": "Register your interest in curated ₹10 Cr - ₹100 Cr opportunities.",
};

function HomePage() {
  const [home, setHome] = useState(null);
  const [cityListings, setCityListings] = useState({ city: null, items: [], nearVisitor: false });
  const [enquiryTopic, setEnquiryTopic] = useState(null);
  const visitor = useVisitorCity();
  // A visitor may leave the location prompt unanswered; after a short wait
  // show the fallback city, and switch if their location arrives later.
  const [locationWaitOver, setLocationWaitOver] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setLocationWaitOver(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let cancelled = false;
    apiRequest("/search/home")
      .then((res) => !cancelled && setHome(res.data))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Which city the "Exclusive in" strip shows. Wait (briefly) for the
  // location lookup so the strip doesn't usually switch city after rendering.
  const topCity = home?.topCities?.[0]?.city || null;
  const visitorListingCity = visitor.listingCity;
  const spotlight =
    visitor.status === "pending" && !locationWaitOver
      ? null
      : visitorListingCity
        ? { city: visitorListingCity.name, searchName: visitorListingCity.searchName, nearVisitor: true }
        : topCity
          ? { city: topCity, searchName: topCity, nearVisitor: false }
          : null;
  const spotlightKey = spotlight ? `${spotlight.searchName}|${spotlight.nearVisitor}` : "";

  useEffect(() => {
    if (!spotlight) return undefined;
    let cancelled = false;
    searchProperties({ city: spotlight.searchName, limit: 4, sort: "newest" })
      .then((data) =>
        !cancelled &&
        setCityListings({ city: spotlight.city, items: (data.items || []).map(normalizeProperty), nearVisitor: spotlight.nearVisitor }),
      )
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [spotlightKey]);

  const verified = (home?.verifiedListings || []).map(normalizeProperty);
  const latest = (home?.latestListings || []).map(normalizeProperty);
  // Verified section only when it adds listings beyond the latest ones.
  const latestIds = new Set(latest.map((item) => item.id));
  const showVerified = verified.some((item) => !latestIds.has(item.id));
  const openEnquiry = (topic) => setEnquiryTopic(topic);

  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="min-h-screen w-full bg-white">
        <SiteHeader />

        <section className="bg-white px-4 sm:px-6 lg:px-12">
          <HomeHeroSection />
          {latest.length > 0 && (
            <VerifiedListingsSection
              title="Latest Listings"
              subtitle="Newly listed properties across our cities"
              items={latest}
              viewAllTo="/properties?purpose=all"
            />
          )}
          {showVerified && (
            <VerifiedListingsSection
              title="Verified Listings"
              subtitle="Curated properties with verified details"
              items={verified}
              viewAllTo="/properties?purpose=all&verified=true"
            />
          )}
          <ExclusiveCitySection
            city={cityListings.city}
            items={cityListings.items}
            subtitle={
              cityListings.nearVisitor
                ? visitor.city?.name === cityListings.city
                  ? "Latest listings in your city"
                  : visitor.city
                    ? `No listings in ${visitor.city.name} yet - these are the nearest to you`
                    : "Latest listings nearest to you"
                : "Latest listings in our most active city"
            }
          />
          <BuilderDirectSection />
          <DealSupportSection topDeal={home?.auctionHighlights?.[0]} onFinancing={() => openEnquiry("Home Loan & Financing")} />
          <PremiumInvestmentSection onContactDesk={() => openEnquiry("Institutional Desk")} />
          <PropertyManagementSection onTalkToManager={() => openEnquiry("NRI Property Management")} />
          <FractionalOwnershipSection onRegisterInterest={() => openEnquiry("Fractional Ownership")} />
          <PartnerGrowthSection />
          <PremiumRealEstateSection onRegisterInterest={() => openEnquiry("HNI / NRI SPV Opportunities")} />
          <TrustSection />
        </section>

        <CompanyFooterSection />
      </div>

      <EnquiryModal
        open={!!enquiryTopic}
        topic={enquiryTopic}
        description={ENQUIRY_COPY[enquiryTopic]}
        onClose={() => setEnquiryTopic(null)}
      />
    </main>
  );
}

export default HomePage;
