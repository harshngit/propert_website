import React, { useEffect } from "react";
import PropertiesPage from "./PropertiesPage";

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
      />
    </div>
  );
}

export default BankAuctionPropertiesPage;
