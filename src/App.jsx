import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./pages/HomePage";
import CityLandingPage from "./pages/CityLandingPage";
import PropertiesPage from "./pages/PropertiesPage";
import PropertyDetailPage from "./pages/PropertyDetailPage";
import RoutePage from "./pages/RoutePage";
import InstitutionalPropertiesPage from "./pages/InstitutionalPropertiesPage";
import BankAuctionPropertiesPage from "./pages/BankAuctionPropertiesPage";
import SpecialSituationPropertiesPage from "./pages/SpecialSituationPropertiesPage";
import GetInvolvedPage from "./pages/GetInvolvedPage";
import InsightsGuidesPage from "./pages/InsightsGuidesPage";
import PublicLegalPage from "./pages/PublicLegalPage";
import BlogContentPage from "./pages/BlogContentPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import OpportunityDetailPage from "./pages/OpportunityDetailPage";
import InvestorProfilePage from "./pages/InvestorProfilePage";
import RentCategoryPage, { RentAllPage } from "./pages/RentCategoryPage";
import SellServicePage, { SellHubPage } from "./pages/SellServicePage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import SeoCityPage from "./pages/SeoCityPage";
import ToolsPage from "./pages/ToolsPage";
import InvestorLandingPage from "./pages/InvestorLandingPage";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/city/:citySlug" element={<CityLandingPage />} />
        <Route path="/properties" element={<PropertiesPage />} />
        <Route path="/properties/:id" element={<PropertyDetailPage />} />
        <Route
          path="/console"
          element={
            <RoutePage
              title="Console"
              description="Access your broker, agency, or admin console tools from one place."
            />
          }
        />
        <Route path="/buy/institutional-properties" element={<InstitutionalPropertiesPage />} />
        <Route path="/buy/bank-auction-properties" element={<BankAuctionPropertiesPage />} />
        <Route path="/buy/special-situation-properties" element={<SpecialSituationPropertiesPage />} />
        <Route path="/buy" element={<Navigate to="/properties?purpose=buy" replace />} />
        <Route path="/rent" element={<RentAllPage />} />
        <Route path="/rent/:category" element={<RentCategoryPage />} />
        <Route path="/sell" element={<SellHubPage />} />
        <Route path="/sell/:service" element={<SellServicePage />} />
        <Route path="/deals/:id" element={<OpportunityDetailPage />} />
        <Route path="/account/investor-profile" element={<InvestorProfilePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/:section" element={<DashboardPage />} />
        <Route path="/post-property" element={<Navigate to="/dashboard/listings?new=1" replace />} />
        <Route path="/post-requirement" element={<Navigate to="/dashboard/requirements?new=1" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/services/get-involved" element={<GetInvolvedPage />} />
        <Route path="/tools" element={<ToolsPage />} />
        <Route path="/for-nri" element={<InvestorLandingPage kind="nri" />} />
        <Route path="/for-hni" element={<InvestorLandingPage kind="hni" />} />
        <Route path="/legal" element={<PublicLegalPage />} />
        <Route path="/news-guide/insights-guides" element={<InsightsGuidesPage />} />
        <Route path="/news-guide/article/:slug" element={<BlogContentPage />} />
        {/* SEO city pages from the CMS, e.g. /buy-property-in-gurugram (unknown slugs go home) */}
        <Route path="/:seoSlug" element={<SeoCityPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
