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
            <h2 className="text-[28px] font-black leading-tight text-white sm:text-[34px]">
              Popular Neighborhoods
            </h2>
            <p className="mt-1 text-[16px] leading-6 text-[#9CA3AF]">{subtitle}</p>
          </div>

          <Link
            to={viewAllHref}
            className="inline-flex items-center gap-2 pt-3 text-[14px] font-bold text-[#E51C23] transition hover:text-[#F04444]"
          >
            View All
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
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

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          {items.map((item) => (
            <article
              key={`${cityLabel}-${item.title}`}
              className="rounded-[16px] border border-white/10 bg-[#1F2937] px-5 py-5 shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
            >
              <h3 className="text-[20px] font-black leading-tight text-white">{item.title}</h3>
              <div className="mt-1 text-[14px] font-bold leading-none text-[#E51C23]">{item.count}</div>
              <p className="mt-4 text-[14px] leading-6 text-[#CBD5E1]">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularNeighborhoodsSection;
