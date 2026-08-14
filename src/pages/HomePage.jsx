import React from "react";
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
import PremiumOwnershipSection from "../components/home/PremiumOwnershipSection";
import DealSupportSection from "../components/home/DealSupportSection";
import TrustSection from "../components/home/TrustSection";
import CompanyFooterSection from "../components/home/CompanyFooterSection";

function HomePage() {
  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="min-h-screen w-full bg-white">
        <SiteHeader />

        <section className="bg-white px-4 sm:px-6 lg:px-12">
          <HomeHeroSection />
          <VerifiedListingsSection />
          <ExclusiveCitySection />
          <BuilderDirectSection />
          <DealSupportSection />
          <PremiumInvestmentSection />
          <PropertyManagementSection />
          <FractionalOwnershipSection />
          <PartnerGrowthSection />
          <PremiumRealEstateSection />
          <TrustSection />
          <CompanyFooterSection />
        </section>
      </div>
    </main>
  );
}

export default HomePage;
