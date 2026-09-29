import React from "react";

// Filter drawer for the investment-deal pages (Bank Auction, Special
// Situation, Institutional). Every option maps to a real API filter -
// /opportunities(/public) for auction + special situation, /search/properties
// for institutional teasers - via dealFiltersToParams().

const TICKET_BANDS = [
  { key: "u50l", label: "Up to ₹50 Lakh", max: 5e6 },
  { key: "50l-1c", label: "₹50 Lakh - ₹1 Cr", min: 5e6, max: 1e7 },
  { key: "1c-5c", label: "₹1 Cr - ₹5 Cr", min: 1e7, max: 5e7 },
  { key: "5c-25c", label: "₹5 Cr - ₹25 Cr", min: 5e7, max: 2.5e8 },
  { key: "25c+", label: "Above ₹25 Cr", min: 2.5e8 },
];

const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment" },
  { value: "independent_house", label: "House" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot / Land" },
  { value: "commercial", label: "Commercial" },
  { value: "other", label: "Other" },
];

const INSTITUTIONAL_TYPES = [
  { value: "commercial", label: "Built campus / commercial" },
  { value: "plot", label: "Land" },
  { value: "other", label: "Other" },
];

// "Financial restructuring" - never "distressed" (Engine 4 positioning rule).
const SITUATIONS = [
  { value: "urgent_sale", label: "Urgent sale" },
  { value: "time_bound_sale", label: "Time-bound sale" },
  { value: "investor_exit", label: "Investor exit" },
  { value: "financial_distress", label: "Financial restructuring" },
];

const SOURCES = [
  { value: "sarfaesi_bank_auction", label: "Bank (SARFAESI)" },
  { value: "nbfc_repossession", label: "NBFC" },
  { value: "arc_asset", label: "ARC" },
  { value: "drt_auction", label: "DRT" },
  { value: "nclt_liquidation", label: "NCLT" },
  { value: "housing_board", label: "Housing board" },
];

const LIQUIDITY = [
  { value: "high", label: "High" },
  { value: "moderate", label: "Medium" },
  { value: "low", label: "Low" },
];

export function createDealFilterState() {
  return { ticket: "", propertyType: "", situationTag: "", sourceType: "", possessionType: "", liquidityBand: "", minScore: "", minDiscount: "", verifiedOnly: false };
}

export function dealFiltersToParams(state, context) {
  if (!state) return {};
  const band = TICKET_BANDS.find((b) => b.key === state.ticket);
  const params = {
    minPrice: band?.min,
    maxPrice: band?.max,
    propertyType: state.propertyType || undefined,
  };
  if (context === "institutional") return { ...params, verified: state.verifiedOnly ? "true" : undefined };
  return {
    ...params,
    situationTag: context === "special" ? state.situationTag || undefined : undefined,
    sourceType: context === "auction" ? state.sourceType || undefined : undefined,
    possessionType: context === "auction" ? state.possessionType || undefined : undefined,
    liquidityBand: state.liquidityBand || undefined,
    minScore: state.minScore || undefined,
    minDiscount: state.minDiscount || undefined,
  };
}

function Section({ title, children }) {
  return (
    <section className="border-b border-[#F3F4F6] pb-5">
      <h3 className="mb-3 text-[14px] font-bold text-[#111827]">{title}</h3>
      {children}
    </section>
  );
}

function Pills({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? "" : o.value)}
            className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition ${
              on ? "border-[#E51C23] bg-[#FEF2F2] text-[#E51C23]" : "border-[#E5E7EB] text-[#374151] hover:border-[#FCA5A5]"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function DealFiltersSidebar({ context, drawerState, setDrawerState, resetFilters, onClose, footer = null }) {
  const set = (key) => (value) => setDrawerState((s) => ({ ...s, [key]: value }));
  const s = drawerState || createDealFilterState();
  return (
    <>
      <div className="flex w-full shrink-0 items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
        <h2 id="results-filters-title" className="text-[16px] font-bold leading-[20px]">Filters</h2>
        <div className="flex items-center gap-4">
          <button type="button" onClick={resetFilters} className="text-[12px] font-medium text-[#E51C23]">Reset All</button>
          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <Section title={context === "auction" ? "Reserve price" : "Investment size"}>
          <Pills options={TICKET_BANDS.map((b) => ({ value: b.key, label: b.label }))} value={s.ticket} onChange={set("ticket")} />
        </Section>
        <Section title="Property type">
          <Pills options={context === "institutional" ? INSTITUTIONAL_TYPES : PROPERTY_TYPES} value={s.propertyType} onChange={set("propertyType")} />
        </Section>
        {context === "special" && (
          <Section title="Situation">
            <Pills options={SITUATIONS} value={s.situationTag} onChange={set("situationTag")} />
          </Section>
        )}
        {context === "auction" && (
          <>
            <Section title="Seller">
              <Pills options={SOURCES} value={s.sourceType} onChange={set("sourceType")} />
            </Section>
            <Section title="Possession">
              <Pills options={[{ value: "physical", label: "Physical" }, { value: "symbolic", label: "Symbolic" }]} value={s.possessionType} onChange={set("possessionType")} />
            </Section>
          </>
        )}
        {context !== "institutional" && (
          <>
            <Section title="Liquidity (exit ease)">
              <Pills options={LIQUIDITY} value={s.liquidityBand} onChange={set("liquidityBand")} />
            </Section>
            <Section title="Investment score">
              <Pills options={[{ value: "50", label: "50+" }, { value: "65", label: "65+" }, { value: "75", label: "75+" }]} value={s.minScore} onChange={set("minScore")} />
            </Section>
            <Section title="Below market value">
              <Pills options={[{ value: "10", label: "10%+" }, { value: "20", label: "20%+" }, { value: "30", label: "30%+" }]} value={s.minDiscount} onChange={set("minDiscount")} />
            </Section>
          </>
        )}
        {context === "institutional" && (
          <section className="flex items-center justify-between">
            <span className="text-[14px] font-bold text-[#111827]">Verified only</span>
            <button
              type="button"
              aria-pressed={s.verifiedOnly}
              onClick={() => set("verifiedOnly")(!s.verifiedOnly)}
              className={`relative inline-flex h-[18px] w-[32px] items-center rounded-full ${s.verifiedOnly ? "bg-[#E51C23]" : "bg-[#E5E7EB]"}`}
            >
              <span className={`inline-block h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform ${s.verifiedOnly ? "translate-x-[16px]" : "translate-x-[2px]"}`} />
            </button>
          </section>
        )}
        {footer}
      </div>
      <div className="shrink-0 border-t border-[#F3F4F6] px-5 py-4">
        <button type="button" onClick={onClose} className="cta-red h-[44px] w-full rounded-[12px] text-[14px] font-bold text-white">
          Show results
        </button>
      </div>
    </>
  );
}
