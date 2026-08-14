import React from "react";
import SectionHeading from "../SectionHeading";
import PropertyCard from "../PropertyCard";
import { exclusiveListings } from "../../data/homeContent";

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
        title="Exclusive in Delhi NCR"
        
        subtitle="Curated properties, verified and matched to your requirement"
      />

      <div className="mt-3 flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-4">
        {exclusiveListings.map((item) => (
          <PropertyCard
            key={item.title + item.rate}
            item={item}
            className="min-w-[82vw] shrink-0 snap-start md:min-w-0 md:w-full"
          />
        ))}
      </div>
    </>
  );
}

export default ExclusiveCitySection;
