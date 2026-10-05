import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import PropertyCard from "../components/PropertyCard";
import EnquiryModal from "../components/EnquiryModal";
import { getCityPage } from "../api/content";
import { normalizeProperty } from "../utils/normalizeProperty";
import { applySeo, breadcrumbSchema, faqSchema } from "../lib/seo";

// SEO city routes (Annexure A sec. 21.4): /buy-property-in-<city>,
// /sell-property-in-<city>, /rent-property-in-<city>, /school-for-sale-<city>
// and so on. Copy comes from the CMS (CRM > Website Content > City pages);
// the numbers, localities and listings are live for that city. Unknown or
// unpublished slugs go to the home page.

const LISTINGS_LINK = {
  buy: (city) => `/properties?purpose=buy&city=${encodeURIComponent(city)}`,
  sell: () => "/sell/list-property",
  rent: (city) => `/rent?city=${encodeURIComponent(city)}`,
};
const INSTITUTIONAL = new Set(["school_for_sale", "acquire_college", "university_campus_for_sale"]);

function SeoCityPage() {
  const { seoSlug } = useParams();
  const [state, setState] = useState({ status: "loading", page: null });
  const [enquiry, setEnquiry] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading", page: null });
    window.scrollTo(0, 0);
    getCityPage(seoSlug)
      .then((page) => {
        if (cancelled) return;
        setState({ status: "ready", page });
        applySeo({
          title: page.seo_title || page.title,
          description: page.seo_description,
          path: `/${seoSlug}`,
          jsonLd: [
            breadcrumbSchema([["Home", "/"], [page.title || page.city_name || seoSlug, `/${seoSlug}`]]),
            ...(Array.isArray(page.faqs) && page.faqs.length ? [faqSchema(page.faqs.map((f) => [f.question || f.q, f.answer || f.a]).filter(([q, a]) => q && a))] : []),
          ],
        });
      })
      .catch(() => !cancelled && setState({ status: "missing", page: null }));
    return () => {
      cancelled = true;
    };
  }, [seoSlug]);

  if (state.status === "missing") return <Navigate to="/" replace />;
  if (state.status === "loading") {
    return (
      <main className="min-h-screen bg-white">
        <SiteHeader />
        <p className="py-24 text-center text-sm text-slate-500">Loading…</p>
      </main>
    );
  }

  const page = state.page;
  const city = page.city_name;
  const institutional = INSTITUTIONAL.has(page.page_type);
  const listings = (page.featuredListings || []).map(normalizeProperty);
  const stats = page.stats || {};
  const browseLink = institutional ? "/buy/institutional-properties" : (LISTINGS_LINK[page.page_type] || LISTINGS_LINK.buy)(city);

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <SiteHeader />

      <section className="bg-[#111827] px-4 py-12 text-white sm:px-6 lg:px-12 lg:py-16">
        <div className="mx-auto max-w-[1200px]">
          <nav className="mb-4 text-[12px] text-white/50">
            <Link to="/" className="hover:text-white">Home</Link> / <span>{city}</span>
          </nav>
          <h1 className="max-w-[820px] font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-tight sm:text-[42px]">{page.hero_heading || page.title}</h1>
          {page.hero_subheading && <p className="mt-4 max-w-[720px] text-[16px] leading-7 text-white/70">{page.hero_subheading}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
            {page.page_type === "sell" ? (
              <Link to="/post-property" className="cta-red inline-flex h-[48px] items-center rounded-[12px] px-6 text-[15px] font-bold text-white">
                Post your property in {city}
              </Link>
            ) : (
              <Link to={browseLink} className="cta-red inline-flex h-[48px] items-center rounded-[12px] px-6 text-[15px] font-bold text-white">
                Browse {institutional ? "opportunities" : "listings"} in {city}
              </Link>
            )}
            <button
              type="button"
              onClick={() => setEnquiry(true)}
              className="inline-flex h-[48px] items-center rounded-[12px] border border-white/20 px-6 text-[15px] font-bold text-white hover:bg-white/10"
            >
              Talk to a representative
            </button>
          </div>
          <div className="mt-10 grid max-w-[640px] grid-cols-3 gap-4">
            {[
              ["Live listings", stats.active_listings],
              ["Verified", stats.verified_listings],
              ["Avg. rate / sq.ft", stats.avg_rate_per_sqft ? `₹${Number(stats.avg_rate_per_sqft).toLocaleString("en-IN")}` : null],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[26px] font-black">{value ?? "—"}</p>
                <p className="text-[12px] uppercase tracking-[0.06em] text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6 lg:px-0">
        {listings.length > 0 && (
          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold">Latest in {city}</h2>
              <Link to={browseLink} className="text-[14px] font-bold text-[#E51C23]">View all →</Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {listings.map((item) => (
                <PropertyCard key={item.id} item={item} className="w-full" />
              ))}
            </div>
          </section>
        )}

        {(page.topLocalities || []).length > 0 && !institutional && (
          <section className="mt-10">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold">Popular localities</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {page.topLocalities.map((l) => (
                <Link
                  key={l.locality}
                  to={`/properties?purpose=${page.page_type === "rent" ? "rent" : "buy"}&city=${encodeURIComponent(city)}&q=${encodeURIComponent(l.locality)}`}
                  className="rounded-full border border-[#E5E7EB] px-4 py-2 text-[14px] font-semibold text-[#374151] hover:border-[#E51C23] hover:text-[#E51C23]"
                >
                  {l.locality} <span className="text-[#9CA3AF]">· {l.listings}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {page.content_html && (
          <section className="prose prose-slate mt-10 max-w-[820px] text-[16px] leading-7 text-[#374151]" dangerouslySetInnerHTML={{ __html: page.content_html }} />
        )}

        {(page.faqs || []).length > 0 && (
          <section className="mt-10 max-w-[820px]">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold">Frequently asked questions</h2>
            <div className="mt-4 divide-y divide-[#F3F4F6] rounded-[16px] border border-[#E5E7EB]">
              {page.faqs.map((f) => (
                <details key={f.question} className="group px-5 py-4">
                  <summary className="cursor-pointer list-none text-[15px] font-bold text-[#111827]">{f.question}</summary>
                  <p className="mt-2 text-[14px] leading-6 text-[#6B7280]">{f.answer}</p>
                </details>
              ))}
            </div>
          </section>
        )}

        {(page.relatedPages || []).length > 0 && (
          <section className="mt-10">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold">More in {city}</h2>
            <div className="mt-3 flex flex-wrap gap-3">
              {page.relatedPages.map((p) => (
                <Link key={p.slug} to={`/${p.slug}`} className="text-[14px] font-semibold text-[#E51C23] hover:underline">
                  {p.title}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <EnquiryModal
        open={enquiry}
        onClose={() => setEnquiry(false)}
        topic={`City page: ${page.title}`}
        description={`Tell us what you're looking for in ${city} - a representative will call you back.`}
      />
      <CompanyFooterSection />
    </main>
  );
}

export default SeoCityPage;
