import React from "react";
import SectionHeading from "../components/SectionHeading";
import PropertyCard from "../components/PropertyCard";
import TestimonialCard from "../components/TestimonialCard";
import GuideCard from "../components/GuideCard";
import SiteHeader from "../components/SiteHeader";
import {
  verifiedListings,
  featurePills,
  partnerCards,
  premiumPills,
  testimonialCards,
  guideItems,
  searchTags,
  whyItems,
  footerColumns,
} from "../data/homeContent";

function HomePage() {
  return (
    <main className="min-h-screen w-full bg-slate-50 text-slate-900">
      <div className="min-h-screen w-full bg-white">
        <SiteHeader />

        <section className="px-6 pb-14 pt-20 text-center md:px-10">
          <h1 className="mx-auto max-w-5xl text-4xl font-black leading-tight tracking-tight text-slate-950 md:text-[58px]">
            Beyond listings. Built for the entire deal
          </h1>
          <p className="mx-auto mt-5 max-w-4xl text-lg leading-8 text-slate-500 md:text-[20px]">
            Verified properties, legal facilitation, financing, and closure tracked end-to-end on one platform
          </p>
          <p className="mt-2 text-lg text-slate-400 md:text-[20px]">
            Not a portal, an operating system for real estate transactions
          </p>

          <div className="mx-auto mt-12 max-w-[780px] rounded-[22px] border border-slate-200 bg-white p-[10px] shadow-[0_16px_28px_rgba(15,23,42,0.16)]">
            <div className="grid gap-2 md:grid-cols-[1.3fr_1fr_1fr_160px]">
              <div className="flex min-h-16 items-center justify-center rounded-[16px] bg-slate-50 px-4 text-center text-base font-medium text-slate-500">
                Search City, Locality or Landmark
              </div>
              <div className="flex min-h-16 items-center justify-center rounded-[16px] bg-slate-50 px-4 text-center text-base font-medium text-slate-500">
                Property Type
              </div>
              <div className="flex min-h-16 items-center justify-center rounded-[16px] bg-slate-50 px-4 text-center text-base font-medium text-slate-500">
                Budget
              </div>
              <button className="rounded-[16px] bg-red-500 px-4 py-4 text-[18px] font-extrabold text-white transition hover:bg-red-600">
                Search
              </button>
            </div>
          </div>

          <p className="mt-6 font-semibold text-slate-500">
            Are you a Property Owner? <span className="text-red-500">Post for FREE</span>
          </p>

          <div className="mt-14 inline-flex rounded-full bg-slate-100 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-600">
            Verified users - Secure contact - End-to-end tracking
          </div>
        </section>

        <section className="bg-white px-6 pb-[68px] md:px-10">
          <SectionHeading title="Verified Listings" subtitle="Curated properties with verified details" />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {verifiedListings.map((item) => (
              <PropertyCard key={item.title + item.price} item={item} />
            ))}
          </div>

          <div className="h-10" />

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

          <div className="h-10" />

          <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,rgba(9,20,40,0.45),rgba(9,20,40,0.75)),linear-gradient(135deg,#2b3d4f_0%,#0f172a_45%,#334155_100%)] px-9 py-9 shadow-[0_18px_36px_rgba(15,23,42,0.14)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.06),transparent_14%),radial-gradient(circle_at_70%_80%,rgba(239,68,68,0.15),transparent_12%)]" />
            <div className="relative max-w-[520px] text-white">
              <div className="inline-block rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-[12px] font-bold tracking-[0.08em] text-slate-200">
                BUILDER DIRECT - ZERO BROKERAGE
              </div>
              <h3 className="mt-6 text-[40px] font-black leading-[1.06]">
                The West Delhi Collection,
                <span className="block text-red-500">by A R Buildwel</span>
              </h3>
              <p className="mt-4 max-w-[460px] text-[16px] leading-7 text-white/85">
                RERA registered residences with construction progress you can track in real time.
                No middlemen, direct from the builder, backed end-to-end.
              </p>
              <button className="mt-5 rounded-[14px] bg-red-500 px-7 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-red-600">
                Know More
              </button>
            </div>
          </div>

          <div className="h-8" />

          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <div className="rounded-[18px] border border-slate-200 bg-white px-6 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <h3 className="text-[26px] font-black text-slate-900">Special Situation Properties</h3>
              <p className="mt-2 max-w-[650px] leading-6 text-slate-500">
                Curated bank auction, NBFC, and ARC-sourced deals, each carrying an Investment Score
                and clear risk indicators. Access limited to verified brokers, NRI, and HNI users.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {featurePills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.05em] text-slate-500"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <button className="mt-4 rounded-[14px] bg-red-500 px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-red-600">
                View Curated Deals
              </button>
            </div>

            <div className="rounded-[18px] bg-red-500 px-6 py-6 text-white shadow-[0_10px_24px_rgba(239,68,68,0.18)]">
              <h3 className="text-[28px] font-black">Need financing?</h3>
              <p className="mt-3 leading-6 text-white/90">
                Home & Commercial Loans from 10L up to 100 Cr at competitive rates starting 8.35%*
              </p>
              <button className="mt-6 w-full rounded-[14px] bg-white px-6 py-3.5 text-[16px] font-extrabold text-red-500 transition hover:bg-slate-50">
                Check Eligibility
              </button>
            </div>
          </div>

          <div className="h-10" />

          <div className="rounded-[22px] bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(17,24,39,0.96)_100%)] px-9 py-9 text-white shadow-[0_18px_36px_rgba(15,23,42,0.16)]">
            <div className="flex flex-wrap items-center justify-between gap-8">
              <div className="max-w-[510px]">
                <div className="inline-block rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-[12px] font-bold tracking-[0.08em] text-slate-300">
                  {premiumPills.join(" • ")}
                </div>
                <h3 className="mt-5 text-[34px] font-black leading-tight">
                  Own a share of premium real estate
                  <span className="block">Not the whole property</span>
                </h3>
                <p className="mt-4 max-w-[460px] text-[17px] leading-7 text-slate-400">
                  Exclusive SPV-backed investment opportunities for eligible investors, professionally
                  managed with independent valuation and expert oversight.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button className="rounded-[14px] bg-red-500 px-5 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-red-600">
                    Register Your Interest
                  </button>
                  <button className="rounded-[14px] border border-white/15 px-5 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-white/5">
                    Eligibility & Investor Guide
                  </button>
                </div>
              </div>

              <div className="h-[220px] w-[430px] shrink-0 rounded-[20px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04)),linear-gradient(135deg,#c8d7e3_0%,#6b8ba4_42%,#e8d2b6_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
            </div>
          </div>

          <div className="h-10" />

          <div>
            <h3 className="text-[34px] font-black text-red-500">Testimonials</h3>
            <p className="mt-1 text-slate-500">Trusted by owners, buyers and institutions</p>
            <div className="mt-4 flex flex-wrap gap-4">
              {testimonialCards.map((item) => (
                <div key={item.name} className="min-w-[220px] flex-1">
                  <TestimonialCard item={item} />
                </div>
              ))}
            </div>
          </div>

          <div className="h-11" />

          <div className="border-t border-slate-100 pt-9">
            <div className="grid gap-9 xl:grid-cols-[1.1fr_1fr_1fr]">
              <div>
                <h3 className="text-[20px] font-black text-slate-900">Popular Real Estate Guides</h3>
                <div className="mt-5 grid gap-4">
                  {guideItems.map((item) => (
                    <GuideCard key={item.title} item={item} />
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[20px] font-black text-slate-900">Popular Searches</h3>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {searchTags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-[12px] text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[20px] font-black text-slate-900">Why PropertySerch</h3>
                <div className="mt-5 grid gap-3">
                  {whyItems.map((item) => (
                    <div
                      key={item}
                      className="rounded-full border border-slate-200 px-4 py-3 text-center font-bold text-slate-600"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-11 border-t border-slate-100 pt-8">
              <div className="grid gap-8 xl:grid-cols-[1.2fr_repeat(3,1fr)]">
                <div>
                  <div className="text-[28px] font-black text-red-500">PropertySerch</div>
                  <div className="mt-2 text-sm text-slate-500">Wholly owned by A R Buildwel</div>
                  <p className="mt-4 max-w-[340px] leading-7 text-slate-500">
                    Beyond Listings. Built for Deals. A Real Estate Transaction Operating System,
                    wholly owned by A R Buildwel, G-53, Vardhman Location Plaza-II, Rajouri Garden,
                    New Delhi - 110027
                  </p>
                </div>

                {footerColumns.map((column) => (
                  <div key={column.title}>
                    <div className="text-[18px] font-black text-slate-900">{column.title}</div>
                    <div className="mt-4 grid gap-3 text-slate-500">
                      {column.items.map((item) => (
                        <div key={item}>{item}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 text-xs tracking-[0.04em] text-slate-400">
                <div>© 2026 PROPERTYSERCH. ALL RIGHTS RESERVED.</div>
                <div className="flex flex-wrap gap-5">
                  <span>TERMS OF SERVICE</span>
                  <span>PRIVACY POLICY</span>
                  <span>RERA COMPLIANCE</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default HomePage;
