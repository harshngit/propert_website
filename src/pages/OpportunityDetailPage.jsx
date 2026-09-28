import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import { expressInterest, getOpportunity } from "../api/opportunities";
import { getPropertyById } from "../api/properties";
import { useAuth } from "../context/AuthContext";
import { formatAuctionDate, typeLabel } from "../utils/normalizeOpportunity";

// Deal page for bank auction / special situation / institutional listings.
// The API decides what the caller may see: a masked teaser (anonymous or
// unverified users) or full details (staff, brokers, verified NRI/HNI
// investors). Contact details are never shown - interest routes to the
// investor's A R Buildwel representative.

const CATEGORY_LABELS = {
  auction: "Bank Auction",
  special_situation: "Special Situation",
  institutional: "Institutional",
};

const LISTING_PAGES = {
  auction: "/buy/bank-auction-properties",
  special_situation: "/buy/special-situation-properties",
  institutional: "/buy/institutional-properties",
};

const RISK_LABELS = {
  documentation_pending: "Documentation pending",
  possession_unclear: "Possession unclear",
  legal_complexity: "Legal complexity",
  tenant_occupied: "Tenant occupied",
};

const STAGE_LABELS = {
  lead: "Interest received",
  deal_interest: "Deal interest confirmed",
  due_diligence: "Due diligence",
  negotiation: "Negotiation",
  closure: "Closure",
  dropped: "Closed without deal",
};

function inr(value) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  if (!Number.isFinite(n)) return String(value);
  if (n >= 1e7) return `₹${Number((n / 1e7).toFixed(2))} Cr`;
  if (n >= 1e5) return `₹${Number((n / 1e5).toFixed(2))} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

function Fact({ label, value }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="rounded-xl border border-[#F3F4F6] bg-[#F9FAFB] px-4 py-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#6B7280]">{label}</div>
      <div className="mt-1 text-[15px] font-bold text-[#111827]">{value}</div>
    </div>
  );
}

function ScoreBar({ label, value, max }) {
  const pct = max ? Math.round((Number(value) / Number(max)) * 100) : 0;
  return (
    <div>
      <div className="flex justify-between text-[12px] text-[#4B5563]">
        <span className="capitalize">{label}</span>
        <span className="font-semibold text-[#111827]">{value}</span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-[#F3F4F6]">
        <div className="h-full rounded-full bg-[#E51C23]" style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  );
}

function InterestPanel({ deal, onRegistered }) {
  const { accessToken, isAuthenticated } = useAuth();
  const location = useLocation();
  const [bid, setBid] = useState("");
  const [financing, setFinancing] = useState(false);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (deal.my_interest) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <p className="text-sm font-bold text-emerald-800">You have registered interest in this deal</p>
        <p className="mt-1 text-sm text-emerald-700">
          Current stage: <span className="font-semibold">{STAGE_LABELS[deal.my_interest.stage] || deal.my_interest.stage}</span>
        </p>
        <p className="mt-2 text-xs text-emerald-700">Your A R Buildwel representative will coordinate the next steps with you.</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] p-5">
        <p className="text-sm font-bold text-[#111827]">Unlock full deal details</p>
        <p className="mt-1 text-sm text-[#6B7280]">
          Source institution, reserve price details, EMD, inspection dates and documents are available to verified investors.
        </p>
        <Link
          to="/login"
          state={{ from: location }}
          className="cta-red mt-4 inline-flex h-[44px] w-full items-center justify-center rounded-[10px] text-sm font-bold text-white"
        >
          Sign in to continue
        </Link>
      </div>
    );
  }

  if (deal.access && deal.access.full === false) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <p className="text-sm font-bold text-amber-900">Verification needed</p>
        <p className="mt-1 text-sm text-amber-800">{deal.access.reason}</p>
        <Link
          to="/account/investor-profile"
          className="cta-red mt-4 inline-flex h-[44px] w-full items-center justify-center rounded-[10px] text-sm font-bold text-white"
        >
          Complete investor profile
        </Link>
      </div>
    );
  }

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await expressInterest(
        deal.id,
        {
          intendedBidAmount: bid ? Number(bid) : undefined,
          financingNeeded: financing,
          message: message || undefined,
        },
        accessToken
      );
      onRegistered(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl border border-[#E5E7EB] p-5">
      <p className="text-sm font-bold text-[#111827]">Express interest</p>
      <p className="mt-1 text-xs text-[#6B7280]">
        A dedicated A R Buildwel representative handles site inspection, due diligence and bidding support.
      </p>
      <label className="mt-4 block text-xs font-semibold text-[#374151]">
        Intended bid / offer (₹, optional)
        <input
          type="number"
          min="0"
          value={bid}
          onChange={(e) => setBid(e.target.value)}
          className="mt-1 h-[42px] w-full rounded-[10px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#E51C23]"
        />
      </label>
      <label className="mt-3 flex items-center gap-2 text-sm text-[#374151]">
        <input type="checkbox" checked={financing} onChange={(e) => setFinancing(e.target.checked)} />
        I will need loan / financing support
      </label>
      <label className="mt-3 block text-xs font-semibold text-[#374151]">
        Message (optional)
        <textarea
          rows={3}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-sm outline-none focus:border-[#E51C23]"
        />
      </label>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="cta-red mt-4 inline-flex h-[44px] w-full items-center justify-center rounded-[10px] text-sm font-bold text-white disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Register interest"}
      </button>
    </form>
  );
}

function OpportunityDetailPage() {
  const { id } = useParams();
  const { accessToken, isReady } = useAuth();
  const [deal, setDeal] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!isReady) return undefined;
    let cancelled = false;
    setStatus("loading");
    // Auction / special situation deals live under /opportunities;
    // institutional listings fall back to the public (masked) property view.
    getOpportunity(id, accessToken || undefined)
      .catch(() => getPropertyById(id))
      .then((data) => {
        if (cancelled) return;
        setDeal(data);
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("missing");
      });
    return () => {
      cancelled = true;
    };
  }, [id, accessToken, isReady]);

  if (status !== "ready") {
    return (
      <main className="min-h-screen w-full bg-white text-[#0F172A]">
        <SiteHeader />
        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          {status === "loading" ? (
            <p className="text-sm text-slate-500">Loading deal…</p>
          ) : (
            <>
              <h1 className="text-3xl font-black text-slate-950">We couldn&apos;t find that deal</h1>
              <p className="mt-3 text-slate-500">It may have closed or been withdrawn.</p>
              <Link to="/buy/bank-auction-properties" className="cta-red mt-8 inline-flex rounded-2xl px-6 py-3.5 text-sm font-extrabold text-white">
                Browse live opportunities
              </Link>
            </>
          )}
        </section>
        <CompanyFooterSection />
      </main>
    );
  }

  const category = deal.listing_category;
  const locked = deal.locked !== false && deal.access?.full !== true;
  const images = (deal.media || []).map((m) => m.url).filter(Boolean);
  const heroImage = images[0] || deal.primary_image || "/images/1st,4th.png";
  const breakdown = deal.score_breakdown?.components;
  const weights = deal.score_breakdown?.weights;
  const risks = deal.risk_indicators || [];
  const asking = deal.reserve_price ?? deal.price_value;

  return (
    <main className="min-h-screen w-full bg-white text-[#0F172A]">
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13px] text-[#9CA3AF]">
          <Link to="/" className="hover:text-[#111827]">Home</Link>
          <span>&gt;</span>
          <Link to={LISTING_PAGES[category] || "/buy/bank-auction-properties"} className="hover:text-[#111827]">
            {CATEGORY_LABELS[category] || "Opportunities"}
          </Link>
          <span>&gt;</span>
          <span className="font-semibold text-[#111827]">{deal.title}</span>
        </nav>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="relative overflow-hidden rounded-2xl">
            <img src={heroImage} alt={deal.title} className="h-[320px] w-full object-cover" />
            <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase text-[#111827] shadow-sm">
              {deal.source_label || CATEGORY_LABELS[category]}
            </span>
            {deal.investment_score != null && (
              <span className="absolute right-4 top-4 rounded-lg bg-[#111827] px-3 py-1.5 text-[12px] font-semibold text-white">
                Investment score {deal.investment_score}/100
              </span>
            )}
          </div>

          <h1 className="mt-6 text-[28px] font-extrabold leading-tight text-[#111827]">{deal.title}</h1>
          <p className="mt-1 text-[14px] text-[#6B7280]">{[deal.locality, deal.city].filter(Boolean).join(", ")}</p>

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-[30px] font-extrabold text-[#111827]">{deal.reserve_price_display || inr(asking) || deal.price}</span>
            {deal.discount_percent > 0 && (
              <span className="rounded-md bg-emerald-50 px-2 py-1 text-[13px] font-semibold text-emerald-700">
                {Number(deal.discount_percent)}% below estimated market value
              </span>
            )}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {category === "auction" && <Fact label="Auction" value={formatAuctionDate(deal.auction_date).replace("Auction: ", "")} />}
            <Fact label="Property type" value={typeLabel(deal.property_type)} />
            <Fact label="Area" value={deal.area_sqft ? `${Number(deal.area_sqft).toLocaleString("en-IN")} sq.ft` : null} />
            <Fact label="Possession" value={deal.possession_type ? typeLabel(deal.possession_type) : null} />
            <Fact label="Liquidity" value={deal.liquidity_band ? `${typeLabel(deal.liquidity_band)}` : null} />
            <Fact label="Est. yield" value={deal.yield_percent != null ? `${Number(deal.yield_percent)}%${deal.yield_qualifier ? ` ${deal.yield_qualifier}` : ""}` : null} />
            {!locked && (
              <>
                <Fact label="Source" value={deal.source_bank} />
                <Fact label="Reference" value={deal.auction_reference_id} />
                <Fact label="EMD" value={inr(deal.emd_amount)} />
                <Fact label="EMD deadline" value={deal.emd_deadline ? new Date(deal.emd_deadline).toLocaleDateString("en-IN") : null} />
                <Fact label="Inspection" value={deal.inspection_date ? new Date(deal.inspection_date).toLocaleDateString("en-IN") : null} />
                <Fact label="Est. market value" value={inr(deal.estimated_market_value)} />
              </>
            )}
          </div>

          {(deal.situation_tags?.length > 0 || risks.length > 0 || deal.risk_indicator_count > 0) && (
            <div className="mt-6">
              <h2 className="text-[16px] font-bold text-[#111827]">Situation &amp; risk indicators</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {(deal.situation_tags || []).map((t) => (
                  <span key={t} className="rounded-md bg-[#F3F4F6] px-2.5 py-1 text-[12px] font-semibold text-[#374151]">
                    {t === "financial_distress" ? "Financial restructuring" : typeLabel(t)}
                  </span>
                ))}
                {risks.map((r) => (
                  <span key={r} className="rounded-md bg-amber-50 px-2.5 py-1 text-[12px] font-semibold text-amber-800">
                    {RISK_LABELS[r] || typeLabel(r)}
                  </span>
                ))}
                {locked && deal.risk_indicator_count > 0 && (
                  <span className="rounded-md bg-amber-50 px-2.5 py-1 text-[12px] font-semibold text-amber-800">
                    {deal.risk_indicator_count} risk indicator(s) - visible to verified investors
                  </span>
                )}
              </div>
            </div>
          )}

          {!locked && deal.description && (
            <div className="mt-6">
              <h2 className="text-[16px] font-bold text-[#111827]">About this opportunity</h2>
              <p className="mt-2 whitespace-pre-line text-[14px] leading-6 text-[#4B5563]">{deal.description}</p>
            </div>
          )}

          {!locked && deal.legal_status_note && (
            <div className="mt-6 rounded-xl border border-[#E5E7EB] p-4">
              <h2 className="text-[14px] font-bold text-[#111827]">Legal status (indicative)</h2>
              <p className="mt-1 text-[13px] text-[#4B5563]">{deal.legal_status_note}</p>
            </div>
          )}

          {!locked && breakdown && (
            <div className="mt-6 rounded-xl border border-[#E5E7EB] p-5">
              <h2 className="text-[16px] font-bold text-[#111827]">How this deal is scored</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {Object.entries(breakdown).map(([key, value]) => (
                  <ScoreBar key={key} label={key} value={value} max={weights?.[key]} />
                ))}
              </div>
            </div>
          )}

          {(deal.disclaimers || []).length > 0 && (
            <div className="mt-8 rounded-xl bg-[#F9FAFB] px-5 py-4 text-[12px] leading-5 text-[#6B7280]">
              {deal.disclaimers.map((d) => (
                <p key={d.key} className="mt-1 first:mt-0">
                  <span className="font-semibold text-[#4B5563]">{d.title}: </span>
                  {d.content_html}
                </p>
              ))}
            </div>
          )}
        </div>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          {category === "institutional" ? (
            <div className="rounded-2xl border border-[#E5E7EB] p-5">
              <p className="text-sm font-bold text-[#111827]">Confidential institutional listing</p>
              <p className="mt-1 text-sm text-[#6B7280]">
                Institution identity and the data room unlock after buyer verification, NDA and admin approval.
              </p>
              <Link to="/services/get-involved" className="cta-red mt-4 inline-flex h-[44px] w-full items-center justify-center rounded-[10px] text-sm font-bold text-white">
                Request access
              </Link>
            </div>
          ) : (
            <InterestPanel deal={deal} onRegistered={(interest) => setDeal((d) => ({ ...d, my_interest: interest }))} />
          )}
        </aside>
      </section>

      <CompanyFooterSection />
    </main>
  );
}

export default OpportunityDetailPage;
