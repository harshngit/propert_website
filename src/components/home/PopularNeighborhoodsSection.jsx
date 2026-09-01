import React from "react";
import { Link } from "react-router-dom";

function PopularNeighborhoodsSection({
  cityLabel,
  subtitle = "Discover the most sought-after residential hubs in the city",
  items = [],
  viewAllHref = "/properties",
}) {
  return (
    <section className="w-full bg-[#111827] py-12 text-white sm:py-14">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="whitespace-nowrap text-[24px] font-extrabold leading-9 text-white sm:text-[34px] sm:font-black sm:leading-tight">
              Popular Neighborhoods
            </h2>
            <p className="mt-1 text-[10px] leading-6 text-[#9CA3AF] sm:text-[16px]">{subtitle}</p>
          </div>

          <Link
            to={viewAllHref}
            className="mt-4 inline-flex shrink-0 items-center gap-1 whitespace-nowrap pt-0 text-[12px] font-bold leading-6 tracking-[0.0049em] text-[#E51C23] transition hover:text-[#F04444] sm:gap-2 sm:pt-3 sm:text-[14px] sm:tracking-normal"
          >
            View All
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-[15px] w-[11px] sm:h-4 sm:w-4" fill="none">
              <path
                d="M6 3.5L10.5 8L6 12.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-2 xl:grid-cols-5">
          {items.map((item) => (
            <article
              key={`${cityLabel}-${item.title}`}
              className={`min-h-[162px] rounded-[16px] border border-white/10 bg-[#1F2937] px-6 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.18)] sm:min-h-0 sm:px-5 sm:py-5 ${item.mobileOnly ? "sm:hidden" : ""}`}
            >
              <h3 className="text-[20px] font-black leading-tight text-white">{item.title}</h3>
              <div className="mt-1 text-[16px] font-bold leading-none text-[#E51C23] sm:text-[14px]">{item.count}</div>
              <p className="mt-4 text-[15px] leading-5 text-[#CBD5E1] sm:text-[14px] sm:leading-6">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularNeighborhoodsSection;
