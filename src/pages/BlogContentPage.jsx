import React from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import { blogArticles, buildBlogArticlePath } from "../data/blogArticles";

function LinkedInIcon() {
  return (
    <img
      src="/icons/linkdin.png"
      alt=""
      aria-hidden="true"
      className="h-[20px] w-[20px] object-contain"
    />
  );
}

function ChainIcon() {
  return (
    <img
      src="/icons/link icon.png"
      alt=""
      aria-hidden="true"
      className="h-[14px] w-[18.88px] object-contain"
    />
  );
}

function BlogContentPage() {
  const latestArticles = blogArticles.filter(
    (article) => article.slug !== "institutional-real-estate-outlook-private-equity-school-assets"
  );

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <SiteHeader />

      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-[1350px] flex-col gap-2 px-4 py-8 sm:px-6 lg:px-8 xl:px-0">
          <div className="flex items-center gap-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-[#0F172A]">
            <span className="inline-flex h-[24px] items-center rounded-[6px] bg-[#FDECEC] px-3 text-[12px] font-extrabold text-[#111827]">
              MARKET TRENDS
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#CBD5E1]" />
            <span className="font-medium normal-case tracking-normal text-[#475569]">8 min read</span>
          </div>

          <h1 className="mt-4 max-w-[1300px] font-['Plus_Jakarta_Sans'] text-[36px] font-extrabold leading-[1.12] tracking-[-0.04em] text-[#0F172A] sm:text-[36px]">
            Mumbai Real Estate Outlook 2024: Top Investment Hubs for High Returns
          </h1>

          <div className="mt-4 flex items-start justify-between gap-6 border-t border-[#EEF2F7] pt-6">
            <div className="flex items-start gap-4">
              <img
                src="/images/avatar-5.png"
                alt="Vikram Malhotra"
                className="h-[56px] w-[56px] rounded-full object-cover"
              />
              <div className="pt-1.5">
                <div className="text-[16px] font-bold leading-[22px] text-[#111827]">
                  Vikram Malhotra
                </div>
                <div className="mt-1 text-[13px] leading-[10px] text-[#94A3B8]">
                  Senior Market Analyst • May 14, 2026
                </div>
              </div>
            </div>

            <div className="pt-1.5 flex items-center gap-3">
              <button
                type="button"
                aria-label="Share on LinkedIn"
                className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#E2E8F0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition hover:border-[#CBD5E1]"
              >
                <LinkedInIcon />
              </button>
              <button
                type="button"
                aria-label="Copy link"
                className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#E2E8F0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition hover:border-[#CBD5E1]"
              >
                <ChainIcon />
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <img
              src="/images/blog content.png"
              alt="Blog content"
              className="h-[500px] w-[1350px] max-w-full rounded-[24px] object-cover"
            />
          </div>

          <div className="mt-4 w-[1350px] max-w-full text-[20px] font-['Lato'] text-[#334155]">
            <p>
              This Blog below is just a placeholder for design purpose, the Mumbai real estate
              landscape is undergoing a seismic shift in 2024. As infrastructural mega-projects
              reach completion, the definition of "prime location" is being rewritten across the
              city's vast geography.
            </p>
          </div>

          <div className="mt-8 w-full max-w-[1350px]">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-[1.2] tracking-[-0.03em] text-[#111827]">
              The Connectivity Catalyst
            </h2>
            <p className="mt-5 font-['Lato'] text-[18px] leading-[30px] text-[#475569]">
              The primary driver of value appreciation this year is the completion of phase 1 of
              the Mumbai Coastal Road and the expansion of the Metro network. These developments
              are not just shortening commute times; they are unlocking inventory in regions
              previously considered peripheral.
            </p>
          </div>

          <section className="mt-10 flex w-full max-w-[1350px] items-start gap-6">
            <div className="mt-2 h-[112px] w-[6px] shrink-0 rounded-full bg-[#E51C23]" />
            <div className="min-w-0">
              <p className="max-w-[1200px] font-['Lato'] text-[18px] italic leading-[34px] text-[#111827]">
                “Investors should stop looking at the traditional PIN codes. The real wealth
                creation in the next 36 months will happen in the 'Secondary Hubs' that are now
                becoming centrally connected.”
              </p>
              <div className="mt-4 font-['Lato'] text-[16px] font-semibold leading-[24px] text-[#64748B]">
                — Rajesh Singhania, Head of Research
              </div>
            </div>
          </section>

          <section className="mt-12 w-full max-w-[1350px]">
            <h3 className="font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-[1.2] tracking-[-0.03em] text-[#111827]">
              1. Wadala: The New BKC Alternative
            </h3>

            <p className="mt-6 max-w-[1180px] font-['Lato'] text-[18px] leading-[34px] text-[#475569]">
              Wadala has emerged as a strategic powerhouse due to its proximity to the Eastern
              Freeway and its evolving status as a business district. We’ve seen a 12%
              year-on-year increase in inquiries for premium 2BHK and 3BHK configurations in this
              micro-market.
            </p>

            <ul className="mt-7 space-y-5 font-['Lato'] text-[18px] leading-[30px] text-[#334155]">
              <li className="flex items-start gap-4">
                <span className="mt-[9px] inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#E51C23] text-[12px] font-black leading-none text-white">
                  ✓
                </span>
                <span>Highest rental yield potential in South Central Mumbai.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-[9px] inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#E51C23] text-[12px] font-black leading-none text-white">
                  ✓
                </span>
                <span>Upcoming Metro Line 4 connectivity.</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="mt-[9px] inline-flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full bg-[#E51C23] text-[12px] font-black leading-none text-white">
                  ✓
                </span>
                <span>Availability of luxury gated communities with modern amenities.</span>
              </li>
            </ul>

            <figure className="mt-10 flex flex-col items-center">
              <img
                src="/images/blog%20content%201.png"
                alt="New residential skylines emerging in Wadala"
                className="h-[500px] w-[1350px] max-w-full rounded-[24px] object-cover"
              />
              <figcaption className="mt-4 text-[15px] italic leading-[22px] text-[#64748B]">
                Fig 1.1: New residential skylines emerging in Wadala as part of the smart-city
                initiative.
              </figcaption>
            </figure>

            <div className="mt-10 w-full">
              <h4 className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-[1.2] tracking-[-0.03em] text-[#111827]">
                Strategic Investment Advice
              </h4>
              <p className="mt-4 max-w-[1280px] font-['Lato'] text-[18px] leading-[32px] text-[#475569]">
                For those looking to enter the market now, a 5-to-7-year horizon is recommended.
                While capital appreciation is guaranteed in established areas, the 'sweet spot'
                for ROI currently sits in the sub- ₹4Cr segment in emerging corridors.
              </p>

              <div className="relative mt-7 overflow-hidden rounded-[24px] bg-[#0A1128] px-10 py-12 text-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
                <div className="relative z-10 max-w-[620px]">
                  <h5 className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-white">
                    Find your next investment in Mumbai
                  </h5>
                  <p className="mt-5 max-w-[520px] font-['Lato'] text-[18px] leading-[32px] text-[#94A3B8]">
                    Get personalized property recommendations based on your investment profile
                    and budget from our expert advisors
                  </p>

                  <div className="mt-8 flex items-center gap-4">
                    <button
                      type="button"
                      className="inline-flex h-[54px] items-center justify-center rounded-[14px] bg-white px-9 text-[16px] font-semibold text-[#111827] transition hover:bg-[#F8FAFC]"
                    >
                      Post Your Requirement
                    </button>
                    <button
                      type="button"
                      className="inline-flex h-[54px] items-center justify-center rounded-[14px] border border-white/12 bg-white/5 px-9 text-[16px] font-semibold text-white transition hover:bg-white/10"
                    >
                      Search Properties
                    </button>
                  </div>
                </div>

              <div
                  className="pointer-events-none absolute bottom-0 right-0 h-[100%] w-[42%] overflow-hidden"
                  style={{
                    transform: "translate(10px, 14px)",
                    transformOrigin: "bottom right",
                  }}
                >
                  <img
                    src="/images/blog%20content%202.png"
                    alt="Investment advice illustration"
                    className="h-full w-full object-contain object-right-bottom opacity-90 mix-blend-multiply brightness-75 contrast-110 saturate-75"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="mt-14 w-full max-w-[1350px]">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#111827]">
                  Latest Articles
                </h2>
                <p className="mt-2 text-[16px] leading-[24px] text-[#64748B]">
                  Stay updated with the latest in real estate
                </p>
              </div>
              <a href="/news-guide" className="inline-flex items-center gap-1 text-[16px] font-semibold text-[#E51C23]">
                <span>View All</span>
                <span aria-hidden="true">›</span>
              </a>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={buildBlogArticlePath(article)}
                  state={article}
                  className="block"
                >
                  <article className="overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
                    <div className="h-[250px] w-full overflow-hidden">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>

                    <div className="px-5 pb-5 pt-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#E51C23]">
                          {article.category}
                        </span>
                        <span className="text-[12px] font-medium text-[#98A2B3]">
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="mt-3 min-h-[82px] font-['Plus_Jakarta_Sans'] text-[20px] font-bold leading-[1.35] tracking-[-0.02em] text-[#1E293B]">
                        {article.title}
                      </h3>

                      <p className="mt-3 min-h-[72px] text-[14px] leading-[22px] text-[#667085]">
                        {article.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-[#F1F5F9] pt-4">
                        <span className="text-[13px] text-[#98A2B3]">{article.date}</span>
                        <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#E51C23]">
                          <span>Read More</span>
                          <span aria-hidden="true">›</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      
      <CompanyFooterSection />
    </main>
  );
}

export default BlogContentPage;
