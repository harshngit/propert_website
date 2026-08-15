import React from "react";
import SectionHeading from "../SectionHeading";
import PropertyCard from "../PropertyCard";
import { verifiedListings } from "../../data/homeContent";

function VerifiedListingsSection() {
  return (
    <div className="w-full">
      <SectionHeading title="Verified Listings" subtitle="Curated properties with verified details" />

      <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 xl:grid-cols-4">
        {verifiedListings.map((item) => (
          <PropertyCard
            key={item.title + item.price}
            item={item}
            className="min-w-full shrink-0 snap-start md:min-w-0 md:w-full"
          />
        ))}
      </div>
    </div>
  );
}

export default VerifiedListingsSection;
