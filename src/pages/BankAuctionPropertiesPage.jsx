import React, { useEffect } from "react";
import PropertiesPage from "./PropertiesPage";
import { DealFiltersSidebar, createDealFilterState, dealFiltersToParams } from "../components/DealFilters";

const renderDealSidebar = (props) => <DealFiltersSidebar context="auction" {...props} />;
const toParams = (state) => dealFiltersToParams(state, "auction");

function BankAuctionPropertiesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bank-auction-page">
      <PropertiesPage
        heroTitle="Bank Auction Opportunities"
        heroDescription="High-Opportunity Investment Deals from SARFAESI bank auctions, NBFC and ARC asset sales and E-Auctions by leading financial institutions"
        purpose="buy"
        mobileHeroTitle
        hideMobileHeroDescription
        resultContext="auction"
        showTopSearchBar={false}
        initialDrawerState={createDealFilterState}
        renderSidebar={renderDealSidebar}
        drawerToParams={toParams}
      />
    </div>
  );
}

export default BankAuctionPropertiesPage;
