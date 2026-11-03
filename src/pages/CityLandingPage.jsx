import { BannerAd } from "../components/AdSlot";
import React from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import HomeHeroSection from "../components/home/HomeHeroSection";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import VerifiedListingsSection from "../components/home/VerifiedListingsSection";
import MarketInsightsSection from "../components/home/MarketInsightsSection";
import PopularNeighborhoodsSection from "../components/home/PopularNeighborhoodsSection";
import TrustSection from "../components/home/TrustSection";
import { fromCitySlug } from "../utils/city";
import { searchProperties } from "../api/properties";
import { apiRequest } from "../api/client";
import { normalizeProperty } from "../utils/normalizeProperty";

function CityLandingPage() {
  const params = useParams();
  const cityLabel = fromCitySlug(params.citySlug);
  const heroLines = [`Browse live listings, area trends and investment insights`, `for ${cityLabel}, with an A R Buildwel representative on every enquiry.`];

  // Live listings for this city (verified first); the strip is hidden when
  // the city has none yet rather than showing sample cards.
  const [cityListings, setCityListings] = React.useState({ items: [], total: 0 });
  React.useEffect(() => {
    let cancelled = false;
    searchProperties({ city: cityLabel, limit: 4, sort: "verified" })
      .then((data) => !cancelled && setCityListings({ items: (data.items || []).map(normalizeProperty), total: data.pagination?.total || 0 }))
      .catch(() => !cancelled && setCityListings({ items: [], total: 0 }));
    return () => {
      cancelled = true;
    };
  }, [cityLabel]);
  // Real area data (Engine 6). Both sections below hide when the city has none yet.
  const [marketReport, setMarketReport] = React.useState(null);
  React.useEffect(() => {
    let cancelled = false;
    setMarketReport(null);
    apiRequest(`/market-intel/areas?city=${encodeURIComponent(cityLabel)}`)
      .then((r) => !cancelled && setMarketReport(r.data))
      .catch(() => !cancelled && setMarketReport(null));
    return () => {
      cancelled = true;
    };
  }, [cityLabel]);
  const neighborhoodItems = (marketReport?.areas || []).slice(0, 5).map((a) => ({
    title: a.locality,
    count: `${a.liveListings} live listing${a.liveListings === 1 ? "" : "s"}`,
    description: a.summary,
  }));

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [cityLabel]);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <SiteHeader />
      <section className="bg-white px-4 sm:px-0">
        <HomeHeroSection
          currentCity={cityLabel}
          showBadge={false}
          cityLandingMobile
          titlePrefix="Real Estate in"
          titleHighlight={cityLabel}
          descriptionLines={heroLines}
        />
        <BannerAd placement="city_banner" city={cityLabel} className="mt-6 px-0 sm:px-6 lg:px-12" />
      </section>

      

      <section className="px-4 pb-7 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1440px]">
          {cityListings.items.length > 0 ? (
            <VerifiedListingsSection
              title="Exclusive Properties in"
              accent={cityLabel}
              cityLandingMobile
              subtitle={`${cityListings.total} live listing${cityListings.total === 1 ? "" : "s"} in ${cityLabel}`}
              items={cityListings.items}
              showMessage={false}
              viewAllTo={`/properties?purpose=all&city=${encodeURIComponent(cityLabel)}`}
            />
          ) : (
            <p className="mt-8 rounded-[16px] border border-dashed border-[#E5E7EB] px-6 py-8 text-center text-[14px] text-[#6B7280]">
              New listings in {cityLabel} are on their way.{" "}
              <Link to="/post-requirement" className="font-bold text-[#E51C23]">Post your requirement</Link> and we'll alert you first.
            </p>
          )}
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-12">
        <MarketInsightsSection cityLabel={cityLabel} report={marketReport} />
      </section>

      {neighborhoodItems.length > 0 && (
      <PopularNeighborhoodsSection
        cityLabel={cityLabel}
        subtitle="Areas with the strongest market scores right now"
        items={neighborhoodItems}
        viewAllHref={`/properties?city=${encodeURIComponent(cityLabel)}&view=list`}
      />
      )}

      <section className="px-4 sm:px-6 lg:px-12">
        <TrustSection
          title={`Testimonials in ${cityLabel}`}
          subtitle={`Trusted by owners, buyers and institutions in ${cityLabel}`}
          city={cityLabel}
        />
      </section>

      <CompanyFooterSection />
    </main>
  );
}

export default CityLandingPage;

