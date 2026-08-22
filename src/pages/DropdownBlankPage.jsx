import React from "react";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0 text-[#6B7280]"
      fill="none"
    >
      <path
        d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14Z"
        fill="currentColor"
      />
      <circle cx="8" cy="6.5" r="1.6" fill="white" />
    </svg>
  );
}

function FiltersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 14 14" className="h-[14px] w-[14px] shrink-0" fill="none">
      <path
        d="M1.75 3h10.5M3.5 7h7M5.25 11h3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
      <path
        d="M7.25 12.5a5.25 5.25 0 1 1 0-10.5 5.25 5.25 0 0 1 0 10.5Zm3.9-.9L15 15.45"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Divider() {
  return <span className="h-6 w-px shrink-0 bg-slate-200" />;
}

function FilterField({ label, value }) {
  return (
    <div className="inline-flex items-center whitespace-nowrap text-[14px] leading-5 text-[#475569]">
      <span>{label}</span>
      <span className="ml-2 font-semibold text-[#0F172A]">{value}</span>
    </div>
  );
}

const PAGE_CONTENT = {
  "/buy/institutional-properties": {
    title: "Institutional Opportunities",
    description:
      "Exclusive access to high-value portfolios, commercial assets, and distressed debt opportunities for qualified institutional investors",
  },
  "/buy/bank-auction-properties": {
    title: "Bank Auction Opportunities",
    description:
      "Exclusive access to high-yield distressed assets, foreclosed properties, and E-Auction opportunities from leading financial institutions for savvy investors",
  },
  "/buy/special-situation-properties": {
    title: "Special Situation Opportunities",
    description:
      "Exclusive access to high-yield distressed assets, insolvency cases (NCLT), and structured exits for professional investors and funds",
  },
  "/services/get-involved": {
    title: "Get Involved",
    description:
      "Explore the ways to participate, contribute, and collaborate across the PropertySerch ecosystem.",
  },
  "/news-guide/insights-guides": {
    title: "Insights & Guides",
    description:
      "Read practical guides, market insights, and market-facing content to help you make better real estate decisions.",
  },
  "/news-guide/opened-through-the-blog-listing": {
    title: "Opened through the blog listing",
    description:
      "Discover featured stories, editorial listings, and articles that surface through the blog listing experience.",
  },
};

function DropdownBlankPage() {
  const pathname = typeof window !== "undefined" ? window.location.pathname : "/";
  const content = PAGE_CONTENT[pathname] || PAGE_CONTENT["/buy/institutional-properties"];

  return (
    <main className="flex min-h-screen w-full flex-col bg-white text-slate-900">
      <SiteHeader />

      <section className="w-full border-b border-[#E5E7EB] bg-[#111827] text-white">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-8 pt-8 sm:px-6 lg:px-8 xl:px-12">
          <div className="max-w-[1000px]">
            <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-[38px] tracking-[-0.03em] text-white sm:text-[34px] sm:leading-[42px]">
              {content.title}
            </h1>
            <p className="mt-2 max-w-[1040px] font-['Lato'] text-[15px] font-normal leading-6 text-white/85 sm:text-[16px]">
              {content.description}
            </p>
          </div>

          <div className="mt-8 flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-4">
            <div className="flex h-[41px] min-w-0 flex-1 items-center gap-4 overflow-x-auto rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-4">
              <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[14px] text-[#0F172A]">
                <LocationIcon />
                <span className="font-semibold">Mumbai, Andheri West</span>
              </div>

              <Divider />

              <FilterField label="Type:" value="Buy" />

              <Divider />

              <FilterField label="Property:" value="Flat" />

              <Divider />

              <FilterField label="Budget:" value="₹1 Cr - ₹5 Cr" />
            </div>

            <div className="flex shrink-0 items-center gap-3 md:gap-4">
              <button
                type="button"
                className="inline-flex h-[45px] w-[149px] shrink-0 items-center justify-center gap-2 rounded-[12px] bg-white px-5 text-[14px] font-bold text-[#111827]"
              >
                <FiltersIcon />
                <span>More Filters</span>
              </button>

              <button
                type="button"
                aria-label="Search"
                className="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#E51C23] text-white"
              >
                <SearchIcon />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1" aria-hidden="true" />
      <CompanyFooterSection />
    </main>
  );
}

export default DropdownBlankPage;
