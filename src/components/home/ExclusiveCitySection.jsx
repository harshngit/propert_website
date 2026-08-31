import React from "react";
import SectionHeading from "../SectionHeading";
import PropertyCard from "../PropertyCard";
import { exclusiveListings } from "../../data/homeContent";

function ExclusiveCitySection() {
  return (
    <>
      <div className="mb-12 mt-12 overflow-hidden rounded-[4px] border border-[#1118271A] sm:mb-14 sm:mt-14">
        <img
          src="\images\Untitled design.png"
          alt="The full service agency banner"
          className="block h-auto w-full"
        />
      </div>

      <SectionHeading
        title="Exclusive in"
        accent="Delhi NCR"
        subtitle="Curated properties with verified details in your city"
        mobileCompact
        mobileSmall
      />

      <div className="scrollbar-hide mt-3 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-4">
        {exclusiveListings.map((item) => (
          <PropertyCard
            key={item.title + item.rate}
            item={item}
            className="min-w-full shrink-0 snap-start md:min-w-0 md:w-full"
          />
        ))}
      </div>
    </>
  );
}

export default ExclusiveCitySection;
