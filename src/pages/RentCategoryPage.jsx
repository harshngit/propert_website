import React, { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import PropertiesPage from "./PropertiesPage";

// Rent menu pages - the standard listings page, filtered to rental listings
// of one kind. `filters` are sent to GET /search/properties; PG / co-living
// listings are identified by the "PG" tag set on the listing in the CRM.
export const RENT_CATEGORIES = {
  "family-homes": {
    label: "Family Homes",
    title: "Family Homes for Rent",
    description: "Spacious 2 BHK and larger apartments, independent floors and villas - verified, with a dedicated representative for every enquiry",
    noun: "Family Homes",
    filters: { bedrooms: 2 },
  },
  "studio-homes": {
    label: "Studio Homes",
    title: "Studio & 1 BHK Homes for Rent",
    description: "Compact, well-connected studio and 1 BHK homes for working professionals and students",
    noun: "Studio Homes",
    filters: { propertyType: "apartment", maxBedrooms: 1 },
  },
  "pg-co-living": {
    label: "PG & Co-living",
    title: "PG & Co-living Spaces",
    description: "Verified paying-guest and co-living spaces with the essentials sorted - move in, not set up",
    noun: "PG & Co-living Spaces",
    filters: { tag: "PG" },
  },
  "furnished-flats": {
    label: "Furnished Flats",
    title: "Furnished Flats for Rent",
    description: "Fully furnished apartments ready to move in - verified listings with transparent terms",
    noun: "Furnished Flats",
    filters: { propertyType: "apartment", furnishing: "Fully Furnished" },
  },
};

function RentCategoryPage() {
  const { category } = useParams();
  const config = RENT_CATEGORIES[category];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [category]);

  if (!config) return <Navigate to="/rent" replace />;

  return (
    <PropertiesPage
      key={category}
      heroTitle={config.title}
      heroDescription={config.description}
      mobileHeroTitle
      hideMobileHeroDescription
      showTopSearchBar={false}
      resultContext="residential"
      purpose="rent"
      presetFilters={config.filters}
      resultNoun={config.noun}
    />
  );
}

// /rent - every rental listing.
export function RentAllPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <PropertiesPage
      heroTitle="Properties for Rent"
      heroDescription="Verified homes, flats and offices for rent - every enquiry handled by a dedicated A R Buildwel representative"
      mobileHeroTitle
      hideMobileHeroDescription
      showTopSearchBar={false}
      resultContext="residential"
      purpose="rent"
      resultNoun="Rental Properties"
    />
  );
}

export default RentCategoryPage;
