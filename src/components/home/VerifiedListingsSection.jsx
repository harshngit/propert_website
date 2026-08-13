import React from "react";
import SectionHeading from "../SectionHeading";
import PropertyCard from "../PropertyCard";
import { verifiedListings } from "../../data/homeContent";

function VerifiedListingsSection() {
  return (
    <div className="w-full">
      <SectionHeading title="Verified Listings" subtitle="Curated properties with verified details" />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {verifiedListings.map((item) => (
          <PropertyCard key={item.title + item.price} item={item} />
        ))}
      </div>
    </div>
  );
}

export default VerifiedListingsSection;
