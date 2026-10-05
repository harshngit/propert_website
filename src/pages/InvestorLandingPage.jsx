import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import EnquiryModal from "../components/EnquiryModal";
import { listPublicOpportunities } from "../api/opportunities";
import { getDisclaimers } from "../api/content";
import { useAuth } from "../context/AuthContext";
import { applySeo } from "../lib/seo";
import { formatAuctionDate } from "../utils/normalizeOpportunity";

// Role landing pages from the SEO plan (/for-nri, /for-hni) - Engine 3.
// The CTA sends signed-out visitors to register and signed-in customers to
// their dashboard (onboarding picks up NRI / HNI and introduces the RM).
// Disclaimers come from the admin-editable disclaimers table.

const PAGES = {
  nri: {
    title: "NRI Property Services in India | PropertySerch",
    metaDescription:
      "Buy, sell, rent out and manage your property in India from abroad - a dedicated relationship manager, rent tracking, FEMA / TDS guidance and repatriation support.",
    eyebrow: "For NRIs & OCIs",
    heading: "Your property in India, handled while you're abroad",
    lead: "One dedicated relationship manager for buying, selling, renting out and looking after your property - with every request tracked online.",
    cta: "Get my relationship manager",
    enquiryTopic: "NRI Services",
    disclaimerTypes: ["nri", "tax_legal"],
    benefits: [
      ["Dedicated relationship manager", "A named A R Buildwel manager for everything in India - introduced the day you join."],
      ["Buy, sell or rent out remotely", "Your manager runs the process end to end; you never deal with buyers, tenants or sellers directly."],
      ["Property management", "Monitoring, rent collection, tenant and maintenance coordination, with a rent ledger you can check any time."],
      ["Every request tracked", "Service requests with a timeline of updates - from document coordination to repairs."],
      ["FEMA, TDS & repatriation basics", "Plain-language guidance, a rent TDS estimator and repatriation tracking against the annual limit."],
      ["Investment deals too", "Verified NRIs can unlock bank auction and special situation deals with full details."],
    ],
    steps: ["Create a free account and choose “I live outside India”", "Meet your relationship manager", "Add your properties or tell us what you need", "Track everything from your dashboard"],
    dealCategory: null,
  },
  hni: {
    title: "Property Investment Deals for HNIs | PropertySerch",
    metaDescription:
      "Curated bank auction, special situation and institutional property deals for HNI investors - investment scores, liquidity, secure deal rooms and portfolio tracking.",
    eyebrow: "For HNI investors",
    heading: "High-Opportunity Investment Deals, curated for you",
    lead: "Bank auctions, special situation properties and institutional assets - scored, matched to your ticket size and backed by a secure deal room.",
    cta: "Start investing",
    enquiryTopic: "HNI Investments",
    disclaimerTypes: ["investment_guidance", "special_situation", "auction"],
    benefits: [
      ["Curated deal flow", "Special situation, bank auction and institutional deals ranked by how well they fit you."],
      ["Investment score & liquidity", "Every deal carries a 0-100 investment score, discount to market and an exit-ease rating."],
      ["Priority alerts", "High-scoring matches reach you first - in your time zone, without the noise."],
      ["Secure deal rooms", "NDA-gated, watermarked documents for verified investors, with access you control."],
      ["Deal advisory", "Plain guidance on deal structure and risk-return for each opportunity (non-legal)."],
      ["Portfolio dashboard", "Track every investment with ROI, yield and Liquidity Score, and plan exits."],
    ],
    steps: ["Create a free account and choose “I invest in property”", "Set your ticket size and deal types", "Get verified to unlock full deal details", "Express interest - your relationship manager takes it from there"],
    dealCategory: "auction",
  },
};

function DealTeasers({ category }) {
  const [items, setItems] = useState(null);
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      listPublicOpportunities({ listingCategory: "auction", limit: 3, sort: "score" }).catch(() => ({ items: [] })),
      listPublicOpportunities({ listingCategory: "special_situation", limit: 3, sort: "score" }).catch(() => ({ items: [] })),
    ]).then(([a, s]) => {
      if (!cancelled) setItems([...(a.items || []), ...(s.items || [])].sort((x, y) => (y.investment_score || 0) - (x.investment_score || 0)).slice(0, 3));
    });
    return () => {
      cancelled = true;
    };
  }, [category]);
  if (!items || !items.length) return null;
  return (
    <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
      <div className="mb-4 flex items-end justify-between gap-3">
        <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold text-[#111827]">Live opportunities</h2>
        <Link to="/buy/special-situation-properties" className="text-[14px] font-bold text-[#E51C23]">See all →</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((d) => (
          <Link key={d.id} to={`/deals/${d.id}`} className="rounded-[16px] border border-[#E5E7EB] bg-white p-5 transition hover:border-[#FCA5A5]">
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#E51C23]">
              {d.listing_category === "auction" ? "Bank auction" : "Special situation"}
            </p>
            <p className="mt-1 font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">{d.title}</p>
            <p className="mt-1 text-[13px] text-[#6B7280]">{[d.locality, d.city].filter(Boolean).join(", ")}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-semibold">
              {d.investment_score != null && <span className="rounded-md bg-blue-50 px-2 py-1 text-blue-800">Score {Math.round(d.investment_score)}</span>}
              {d.discount_percent ? <span className="rounded-md bg-emerald-50 px-2 py-1 text-emerald-800">{Math.round(d.discount_percent)}% below market</span> : null}
              {d.auction_date && <span className="rounded-md bg-[#F3F4F6] px-2 py-1 text-[#374151]">Auction {formatAuctionDate(d.auction_date)}</span>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function InvestorLandingPage({ kind }) {
  const page = PAGES[kind];
  const { isAuthenticated, user } = useAuth();
  const [disclaimers, setDisclaimers] = useState([]);
  const [enquiry, setEnquiry] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    applySeo({ title: page.title, description: page.metaDescription, path: `/for-${kind}` });
    getDisclaimers(page.disclaimerTypes).then((d) => setDisclaimers(d || [])).catch(() => setDisclaimers([]));
  }, [page]);

  const ctaTo = !isAuthenticated ? "/register" : user?.role === "customer" ? "/dashboard" : "/account/investor-profile";

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} topic={page.enquiryTopic} description="Share a few details and a relationship manager will call you back at a time that suits your time zone." />

      <section className="bg-[#FEF2F2]">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-20">
          <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold uppercase tracking-[0.08em] text-[#E51C23]">{page.eyebrow}</p>
          <h1 className="mt-2 max-w-[760px] font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold leading-tight text-[#111827] sm:text-[44px]">{page.heading}</h1>
          <p className="mt-4 max-w-[640px] text-[16px] leading-7 text-[#4B5563]">{page.lead}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to={ctaTo} className="cta-red inline-flex h-[48px] items-center rounded-[12px] px-6 text-[15px] font-bold text-white">
              {page.cta}
            </Link>
            <button type="button" onClick={() => setEnquiry(true)} className="inline-flex h-[48px] items-center rounded-[12px] border border-[#E5E7EB] bg-white px-6 text-[15px] font-bold text-[#111827] hover:border-[#FCA5A5]">
              Request a call back
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {page.benefits.map(([title, body]) => (
            <div key={title} className="rounded-[16px] border border-[#E5E7EB] p-5">
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">{title}</p>
              <p className="mt-1 text-[14px] leading-6 text-[#6B7280]">{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F9FAFB]">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold text-[#111827]">How it works</h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {page.steps.map((step, i) => (
              <li key={step} className="rounded-[16px] bg-white p-5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E51C23] text-[14px] font-bold text-white">{i + 1}</span>
                <p className="mt-3 text-[14px] font-semibold leading-6 text-[#111827]">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {page.dealCategory && <DealTeasers category={page.dealCategory} />}

      {kind === "nri" && (
        <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
          <div className="rounded-[16px] border border-[#E5E7EB] p-6">
            <p className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#111827]">Also investing? </p>
            <p className="mt-1 text-[14px] text-[#6B7280]">
              Verified NRI investors can access bank auction and special situation deals too. <Link to="/for-hni" className="font-bold text-[#E51C23]">See investment deals →</Link>
            </p>
          </div>
        </section>
      )}

      {disclaimers.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 pb-12 sm:px-6">
          <div className="rounded-xl bg-[#F9FAFB] px-5 py-4 text-[12px] leading-5 text-[#6B7280]">
            {disclaimers.map((d) => (
              <p key={d.key} className="mt-1 first:mt-0">
                <span className="font-semibold text-[#4B5563]">{d.title}: </span>
                <span dangerouslySetInnerHTML={{ __html: d.content_html }} />
              </p>
            ))}
          </div>
        </section>
      )}

      <CompanyFooterSection />
    </main>
  );
}

export default InvestorLandingPage;
