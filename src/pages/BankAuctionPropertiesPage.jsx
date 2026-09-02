import React, { useEffect } from "react";
import PropertiesPage from "./PropertiesPage";

function BankAuctionPropertiesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PropertiesPage
      heroTitle="Bank Auction Opportunities"
      heroDescription="Exclusive access to high-yield distressed assets, foreclosed properties, and E-Auction opportunities from leading financial institutions for savvy investors"
      mobileHeroTitle
      hideMobileHeroDescription
      showTopSearchBar={false}
    />
  );
}

export default BankAuctionPropertiesPage;
