import React from "react";
import SectionHeading from "../SectionHeading";
import PropertyCard from "../PropertyCard";
import { verifiedListings } from "../../data/homeContent";

function ExclusiveCitySection() {
  return (
    <>
      <div className="mb-14 mt-14 overflow-hidden rounded-[4px] border border-[#1118271A]">
        <img
          src="\images\Untitled design.png"
          alt="The full service agency banner"
          className="block h-auto w-full"
        />
      </div>

      <SectionHeading
        title="Exclusive Properties in"
        accent="Mumbai"
        subtitle="Curated properties with verified details in your city"
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {verifiedListings.map((item) => (
          <PropertyCard key={item.title + item.rate} item={item} />
        ))}
      </div>
    </>
  );
}

export default ExclusiveCitySection;
