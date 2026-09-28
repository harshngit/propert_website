import React from "react";
import SectionHeading from "../SectionHeading";
import PropertyCard from "../PropertyCard";

// City spotlight: the latest live listings in the visitor's city (chosen by
// HomePage). The banner always shows; the listing strip only when there is
// live data for a city.
function ExclusiveCitySection({ city, items = [], subtitle = "Latest listings in your city" }) {
  return (
    <>
      <div className="mb-12 mt-12 overflow-hidden rounded-[4px] border border-[#1118271A] sm:mb-14 sm:mt-14">
        <img
          src="\images\Untitled design.png"
          alt="The full service agency banner"
          className="block h-auto w-full"
        />
      </div>

      {city && items.length > 0 && (
      <>
      <SectionHeading
        title="Exclusive in"
        accent={city}
        subtitle={subtitle}
        viewAllTo={`/properties?purpose=all&city=${encodeURIComponent(city)}`}
        mobileCompact
        mobileSmall
      />

      <div className="scrollbar-hide mt-3 flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory md:grid md:grid-cols-2 md:gap-4 md:overflow-visible md:pb-0 xl:grid-cols-4">
        {items.map((item) => (
          <PropertyCard
            key={item.id}
            item={item}
            className="min-w-full shrink-0 snap-start md:min-w-0 md:w-full"
          />
        ))}
      </div>
      </>
      )}
    </>
  );
}

export default ExclusiveCitySection;
