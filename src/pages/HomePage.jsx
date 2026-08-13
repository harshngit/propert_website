import React from "react";
import SiteHeader from "../components/SiteHeader";
import HomeHeroSection from "../components/home/HomeHeroSection";
import VerifiedListingsSection from "../components/home/VerifiedListingsSection";
import ExclusiveCitySection from "../components/home/ExclusiveCitySection";
import BuilderDirectSection from "../components/home/BuilderDirectSection";
import DealSupportSection from "../components/home/DealSupportSection";
import BusinessGrowthSection from "../components/home/BusinessGrowthSection";
import PremiumInvestmentSection from "../components/home/PremiumInvestmentSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import ResourcesFooterSection from "../components/home/ResourcesFooterSection";

function HomePage() {
  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="min-h-screen w-full bg-white">
        <SiteHeader />

        <section className="bg-white px-12">
          <HomeHeroSection />
          <VerifiedListingsSection />
          <ExclusiveCitySection />
          <BuilderDirectSection />
          <PremiumInvestmentSection />
          <DealSupportSection />
          <BusinessGrowthSection />
          <TestimonialsSection />
          <ResourcesFooterSection />
        </section>
      </div>
    </main>
  );
}

export default HomePage;
