import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import { submitEnquiry } from "../api/leads";
import { apiRequest } from "../api/client";
import { getDisclaimers } from "../api/content";
import { useAuth } from "../context/AuthContext";

// Sell menu pages (List Property, Property Valuation, Owner Services,
// Broker Tools) on one template in the site's standard layout. Each form
// creates a website lead in the CRM tagged with the service, so an
// A R Buildwel representative follows up - owner contact details are never
// published.

const CONSOLE_URL = "https://property-dashboard-one-navy.vercel.app/";

export const SELL_PAGES = {
  "list-property": {
    label: "List Property",
    eyebrow: "Sell with PropertySerch",
    title: "List your property with a dedicated representative",
    subtitle:
      "Share your property details and an A R Buildwel representative will verify, photograph and list it - then handle every buyer enquiry, visit and negotiation for you.",
    formTitle: "Tell us about your property",
    topic: "List Property",
    submitLabel: "Request a listing call",
    askProperty: true,
    points: [
      ["Verified listing", "Geo-tagged, document-checked listings rank higher and earn buyer trust."],
      ["Your number stays private", "Buyers only ever see your representative - never your phone or address."],
      ["Matched buyers", "Your listing is matched against live buyer requirements the moment it goes live."],
    ],
    cards: [
      ["Exclusive Mandate", "Priority placement, free valuation by an empanelled valuer, legal due diligence and a 2-hour enquiry SLA."],
      ["Standard Engagement", "Your listing goes live with verification, matching and a representative for every enquiry."],
      ["Transparent fee", "One professional fee of 1% + GST on closure for every engagement - no hidden charges."],
    ],
    disclaimerTypes: ["mandate_valuation", "mandate_due_diligence"],
    promo: {
      title: "Are you a broker or builder?",
      text: "Post listings, manage leads and track every deal from your CRM workspace.",
      actions: [
        { label: "Open Broker CRM", href: CONSOLE_URL },
        { label: "Become a Partner", to: "/services/get-involved" },
      ],
    },
  },
  "property-valuation": {
    label: "Property Valuation",
    eyebrow: "Know what your property is worth",
    title: "Property valuation & saleability check",
    subtitle:
      "Get an indicative valuation from our team, and see right now how quickly properties like yours are selling in your area.",
    formTitle: "Request a valuation",
    topic: "Property Valuation",
    submitLabel: "Request valuation",
    askProperty: true,
    showLiquidity: true,
    points: [
      ["Market-backed", "Based on live listings, buyer demand and closed deals on the platform."],
      ["Registered valuers", "Formal valuations by empanelled registered valuers for Exclusive Mandate clients."],
      ["Exit-ready", "Know your liquidity band before you list - High, Moderate or Low."],
    ],
    cards: [
      ["Indicative valuation", "A quick, data-backed estimate from your representative."],
      ["Formal valuation", "A report by an empanelled registered valuer, free with an Exclusive Mandate."],
      ["Liquidity score", "How easily properties like yours sell, from platform demand and deal velocity."],
    ],
    disclaimerTypes: ["mandate_valuation", "liquidity_score"],
    promo: {
      title: "Ready to sell?",
      text: "List with a dedicated representative who handles every enquiry for you.",
      actions: [{ label: "List Property", to: "/sell/list-property" }],
    },
  },
  "owner-services": {
    label: "Owner Services",
    eyebrow: "For owners & landlords",
    title: "Property management, handled end to end",
    subtitle:
      "Tenant sourcing, rent collection, maintenance and paperwork - managed by your relationship manager, whether you live across town or abroad.",
    formTitle: "Talk to a relationship manager",
    topic: "Owner Services",
    submitLabel: "Request a call back",
    askProperty: false,
    points: [
      ["One point of contact", "A named relationship manager for every property you own."],
      ["Monthly visibility", "Rent, TDS and maintenance tracked with regular updates."],
      ["NRI ready", "FEMA-aware guidance and repatriation tracking for NRI owners."],
    ],
    cards: [
      ["Rental management", "Tenant sourcing, screening, agreements and renewals."],
      ["Rent collection", "Monthly rent tracking, receipts and TDS records."],
      ["Maintenance", "Repairs, inspections and property upkeep coordinated for you."],
      ["Documents & legal", "Coordination with your chosen advocate for agreements and registrations."],
      ["Tax guidance", "Indicative TDS and capital-gains guidance - with your CA's advice."],
      ["Resale support", "When you are ready to exit, we list and sell with a dedicated representative."],
    ],
    disclaimerTypes: ["tax_legal"],
    promo: {
      title: "NRI or HNI owner?",
      text: "Create your investor profile for a managed-property dashboard, service requests and curated deals.",
      actions: [{ label: "Create investor profile", to: "/account/investor-profile" }],
    },
  },
  "broker-tools": {
    label: "Broker Tools",
    eyebrow: "For brokers & agencies",
    title: "Run your entire brokerage on one system",
    subtitle:
      "From the first WhatsApp message to signed closure - listings, leads, matching and follow-ups in one CRM workspace.",
    formTitle: "Get a CRM walkthrough",
    topic: "Broker Tools",
    submitLabel: "Book a walkthrough",
    askProperty: false,
    points: [
      ["Free CRM workspace", "Your own private pipeline, isolated from every other agency."],
      ["Matched buyers", "Buyer requirements matched to your listings automatically."],
      ["Scored leads", "Every lead scored Hot, Warm or Cold so you call the right one first."],
    ],
    cards: [
      ["Lead pipeline", "Kanban pipeline from enquiry to closure with SLA tracking."],
      ["Requirement marketplace", "See live buyer requirements that match your inventory."],
      ["Property matching", "Match scores for every buyer against every listing."],
      ["Follow-ups & tasks", "Reminders so no lead goes cold."],
      ["Performance reports", "Conversion, response time and closures at a glance."],
      ["Deal documents", "Agreements and receipts stored against each deal."],
    ],
    disclaimerTypes: [],
    promo: {
      title: "Already a partner?",
      text: "Log in to your broker CRM, or apply to join the partner network.",
      actions: [
        { label: "Open Broker CRM", href: CONSOLE_URL },
        { label: "Become a Broker Partner", to: "/services/get-involved" },
      ],
    },
  },
};

const PROPERTY_TYPES = ["Apartment / Flat", "Independent House / Floor", "Villa", "Plot / Land", "Commercial", "Other"];

const inputClass =
  "h-[40px] w-full rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-[13px] font-['Plus_Jakarta_Sans'] text-[13px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#E51C23] focus:ring-1 focus:ring-[#E51C23]/20";
const labelClass = "mb-[6px] block font-['Plus_Jakarta_Sans'] text-[12px] font-bold text-[#111827]";

function ServiceForm({ config }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ fullName: "", mobile: "", email: "", city: "", locality: "", propertyType: "", price: "", note: "" });
  const [consent, setConsent] = useState(true);
  const [state, setState] = useState({ status: "idle", message: "" });

  useEffect(() => {
    if (user) setForm((f) => ({ ...f, fullName: f.fullName || user.fullName || "", mobile: f.mobile || user.mobile || "", email: f.email || user.email || "" }));
  }, [user]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.mobile.trim() && !form.email.trim()) {
      setState({ status: "error", message: "Please share a mobile number or email." });
      return;
    }
    const details = config.askProperty
      ? [form.propertyType, [form.locality, form.city].filter(Boolean).join(", "), form.price && `Expected: ${form.price}`].filter(Boolean).join(" | ")
      : [form.city].filter(Boolean).join("");
    setState({ status: "submitting", message: "" });
    try {
      await submitEnquiry({
        fullName: form.fullName,
        mobile: form.mobile,
        email: form.email,
        message: `[${config.topic}] ${details}${form.note ? ` - ${form.note}` : ""}`,
      });
      setState({ status: "done", message: "Thank you - your A R Buildwel representative will get in touch shortly." });
    } catch (err) {
      setState({ status: "error", message: err.message });
    }
  };

  if (state.status === "done") {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF1F1] text-[22px] text-[#E51C23]">✓</div>
        <p className="mt-4 font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Request received</p>
        <p className="mt-2 max-w-[300px] text-[13px] leading-5 text-[#6B7280]">{state.message}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-[14px]">
      <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold text-[#111827]">{config.formTitle}</h3>
      <label className="block">
        <span className={labelClass}>Full Name</span>
        <input required value={form.fullName} onChange={set("fullName")} placeholder="Enter your full name" className={inputClass} />
      </label>
      <div className="grid gap-[14px] sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Mobile Number</span>
          <input type="tel" value={form.mobile} onChange={set("mobile")} placeholder="Mobile number" className={inputClass} />
        </label>
        <label className="block">
          <span className={labelClass}>Email</span>
          <input type="email" value={form.email} onChange={set("email")} placeholder="Email address" className={inputClass} />
        </label>
      </div>
      {config.askProperty ? (
        <>
          <div className="grid gap-[14px] sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>City</span>
              <input required value={form.city} onChange={set("city")} placeholder="e.g. Delhi" className={inputClass} />
            </label>
            <label className="block">
              <span className={labelClass}>Locality</span>
              <input value={form.locality} onChange={set("locality")} placeholder="e.g. Rajouri Garden" className={inputClass} />
            </label>
          </div>
          <div className="grid gap-[14px] sm:grid-cols-2">
            <label className="block">
              <span className={labelClass}>Property Type</span>
              <select value={form.propertyType} onChange={set("propertyType")} className={inputClass}>
                <option value="">Select type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className={labelClass}>Expected Price</span>
              <input value={form.price} onChange={set("price")} placeholder="e.g. 2.1 Cr" className={inputClass} />
            </label>
          </div>
        </>
      ) : (
        <label className="block">
          <span className={labelClass}>City</span>
          <input value={form.city} onChange={set("city")} placeholder="e.g. Delhi" className={inputClass} />
        </label>
      )}
      <label className="block">
        <span className={labelClass}>Anything else? (optional)</span>
        <textarea rows={2} value={form.note} onChange={set("note")} className={`${inputClass} h-auto py-2`} />
      </label>
      <label className="flex cursor-pointer items-start gap-[10px]">
        <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-[1px] h-[16px] w-[16px] shrink-0 accent-[#E51C23]" />
        <span className="font-['Plus_Jakarta_Sans'] text-[10px] leading-[14px] text-[#374151]">
          I agree to be contacted by PropertySerch regarding this request and accept the Privacy Policy
        </span>
      </label>
      {state.status === "error" && <p className="text-[12px] text-red-600">{state.message}</p>}
      <button
        type="submit"
        disabled={!consent || state.status === "submitting"}
        className="cta-red inline-flex h-[40px] w-full items-center justify-center rounded-[8px] font-['Inter'] text-[14px] font-bold text-white disabled:opacity-60"
      >
        {state.status === "submitting" ? "Sending…" : config.submitLabel}
      </button>
    </form>
  );
}

const BAND_STYLE = {
  high: "bg-emerald-50 text-emerald-700 border-emerald-200",
  moderate: "bg-amber-50 text-amber-800 border-amber-200",
  low: "bg-red-50 text-red-700 border-red-200",
};

function LiquidityCheck() {
  const [city, setCity] = useState("");
  const [locality, setLocality] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const check = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ city: city.trim() });
      if (locality.trim()) params.set("locality", locality.trim());
      const res = await apiRequest(`/tools/liquidity-score?${params}`);
      setResult(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[22px] border border-[#E5E7EB] bg-white px-7 py-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#111827]">How fast do properties sell in your area?</h3>
      <p className="mt-2 text-[14px] leading-6 text-[#6B7280]">A live liquidity score from buyer demand, supply and closed deals on the platform.</p>
      <form onSubmit={check} className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input required value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className={inputClass} />
        <input value={locality} onChange={(e) => setLocality(e.target.value)} placeholder="Locality (optional)" className={inputClass} />
        <button type="submit" disabled={loading} className="cta-red h-[40px] shrink-0 rounded-[8px] px-6 text-[14px] font-bold text-white disabled:opacity-60">
          {loading ? "Checking…" : "Check"}
        </button>
      </form>
      {error && <p className="mt-3 text-[13px] text-red-600">{error}</p>}
      {result && (
        <div className="mt-5">
          {result.band ? (
            <div className={`inline-flex items-center gap-3 rounded-xl border px-4 py-3 ${BAND_STYLE[result.band]}`}>
              <span className="font-['Plus_Jakarta_Sans'] text-[26px] font-black">{result.score}</span>
              <span className="text-[14px] font-semibold">{result.label}</span>
            </div>
          ) : (
            <p className="text-[14px] text-[#6B7280]">{result.reason || "Not enough platform data for this area yet."}</p>
          )}
          {result.disclaimers?.map((d) => (
            <p key={d.key} className="mt-3 text-[11px] leading-4 text-[#9CA3AF]">{d.content_html}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function PromoAction({ action, dark }) {
  const className = dark
    ? "dark-hover-btn inline-flex h-[50px] items-center justify-center rounded-[14px] bg-[#E51C23] px-7 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white transition hover:bg-white hover:text-[#E51C23]"
    : "inline-flex h-[50px] items-center justify-center rounded-[14px] border border-white/15 px-7 font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-white transition hover:bg-white hover:text-[#E51C23]";
  return action.href ? (
    <a href={action.href} target="_blank" rel="noreferrer" className={className}>
      {action.label}
    </a>
  ) : (
    <Link to={action.to} className={className}>
      {action.label}
    </Link>
  );
}

function SellServicePage() {
  const { service } = useParams();
  const config = SELL_PAGES[service];
  const [disclaimers, setDisclaimers] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!config?.disclaimerTypes?.length) {
      setDisclaimers([]);
      return;
    }
    getDisclaimers(config.disclaimerTypes).then(setDisclaimers).catch(() => setDisclaimers([]));
  }, [service, config]);

  if (!config) return <Navigate to="/sell" replace />;

  return (
    <main className="flex min-h-screen w-full flex-col bg-white text-slate-900">
      <SiteHeader />

      <section className="w-full border-y border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-start px-[20px] pb-[18px] pt-[25px] text-left sm:items-center sm:px-6 sm:py-10 sm:text-center lg:px-8">
          <span className="mb-3 inline-flex h-[24px] items-center rounded-full bg-[#FFF1F1] px-3 font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase tracking-[0.12em] text-[#E51C23]">
            {config.eyebrow}
          </span>
          <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[32px] text-[#111827] sm:text-[38px] sm:leading-[46px] lg:text-[42px] lg:tracking-[-0.04em]">
            {config.title}
          </h1>
          <p className="mt-2 w-full max-w-[760px] font-['Plus_Jakarta_Sans'] text-[13px] leading-[20px] text-[#6B7280] sm:mt-3 sm:text-[18px] sm:leading-[30px]">
            {config.subtitle}
          </p>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto grid w-full max-w-[1270px] gap-8 px-5 py-10 lg:grid-cols-[minmax(0,1fr)_430px] lg:items-start lg:px-8">
          <div className="flex flex-col gap-6">
            {config.points.map(([title, body]) => (
              <div key={title} className="flex items-start gap-[16px]">
                <div className="mt-[3px] flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FFF1F1] font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#E51C23] lg:h-[45px] lg:w-[45px]">
                  ✓
                </div>
                <div>
                  <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-[24px] text-[#111827]">{title}</h3>
                  <p className="mt-[2px] font-['Plus_Jakarta_Sans'] text-[14px] leading-[20px] text-[#6B7280]">{body}</p>
                </div>
              </div>
            ))}
            {config.showLiquidity && <LiquidityCheck />}
            {service === "list-property" && (
              <div className="rounded-[16px] border border-[#FECACA] bg-[#FEF2F2] p-5">
                <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">Prefer to post it yourself?</p>
                <p className="mt-1 font-['Plus_Jakarta_Sans'] text-[14px] leading-[20px] text-[#6B7280]">
                  Add the details and photos from your dashboard in a few minutes - free. You'll see every enquiry, interested buyer and site
                  visit there, and renew or mark it sold when you're done.
                </p>
                <Link
                  to="/post-property"
                  className="cta-red mt-3 inline-flex h-[40px] items-center rounded-[12px] px-5 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white"
                >
                  Post Property from My Dashboard
                </Link>
              </div>
            )}
          </div>

          <div
            className="w-full rounded-[16.97px] px-[28px] py-[24px]"
            style={{ background: "#FFFFFF", border: "1px solid #1118271A", boxShadow: "0px 0.71px 1.41px 0px #0000000D" }}
          >
            <ServiceForm key={service} config={config} />
          </div>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-10 sm:px-6 lg:px-8 xl:px-[9px]">
          <h2 className="text-center font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[30px] text-[#111827] sm:text-[28px]">
            What&apos;s included
          </h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {config.cards.map(([title, body]) => (
              <article key={title} className="flex h-full flex-col rounded-[22px] border border-[#E5E7EB] bg-white px-7 py-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
                <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold leading-[25px] text-[#111827]">{title}</h3>
                <p className="mt-4 font-['Plus_Jakarta_Sans'] text-[14px] leading-[24px] text-[#6B7280]">{body}</p>
              </article>
            ))}
          </div>
          {disclaimers.length > 0 && (
            <div className="mt-8 rounded-xl bg-[#F9FAFB] px-5 py-4 text-[12px] leading-5 text-[#6B7280]">
              {disclaimers.map((d) => (
                <p key={d.key} className="mt-1 first:mt-0">
                  <span className="font-semibold text-[#4B5563]">{d.title}: </span>
                  {d.content_html}
                </p>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#111827] px-4 py-10 text-white sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto flex w-full max-w-[1270px] flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[640px]">
              <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[34px] sm:text-[32px] sm:leading-[40px]">{config.promo.title}</h2>
              <p className="mt-3 font-['Plus_Jakarta_Sans'] text-[14px] leading-6 text-[#9CA3AF] sm:text-[16px]">{config.promo.text}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              {config.promo.actions.map((action, i) => (
                <PromoAction key={action.label} action={action} dark={i === 0} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <SellHubLinks current={service} />
      <CompanyFooterSection />
    </main>
  );
}

// Cross-links between the Sell pages (also used as the /sell hub).
function SellHubLinks({ current }) {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto grid w-full max-w-[1270px] gap-4 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {Object.entries(SELL_PAGES)
          .filter(([slug]) => slug !== current)
          .map(([slug, page]) => (
            <Link
              key={slug}
              to={`/sell/${slug}`}
              className="group rounded-[18px] border border-[#E5E7EB] bg-white px-6 py-5 transition hover:border-[#FFD6D6] hover:bg-[#FFF9F9]"
            >
              <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">{page.label}</p>
              <p className="mt-1 line-clamp-2 text-[13px] leading-5 text-[#6B7280]">{page.eyebrow}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#E51C23]">
                Explore <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
      </div>
    </section>
  );
}

// /sell - hub page listing every Sell service.
export function SellHubPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main className="flex min-h-screen w-full flex-col bg-white text-slate-900">
      <SiteHeader />
      <section className="w-full border-y border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-start px-[20px] pb-[18px] pt-[25px] text-left sm:items-center sm:px-6 sm:py-10 sm:text-center lg:px-8">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[32px] text-[#111827] sm:text-[38px] lg:text-[42px] lg:tracking-[-0.04em]">
            Sell or manage your property
          </h1>
          <p className="mt-2 max-w-[720px] font-['Plus_Jakarta_Sans'] text-[13px] leading-[20px] text-[#6B7280] sm:mt-3 sm:text-[18px] sm:leading-[30px]">
            List with a dedicated representative, check what your property is worth, or hand over day-to-day management.
          </p>
        </div>
      </section>
      <SellHubLinks current={null} />
      <div className="flex-1" />
      <CompanyFooterSection />
    </main>
  );
}

export default SellServicePage;
