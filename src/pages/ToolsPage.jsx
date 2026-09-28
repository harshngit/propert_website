import React, { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import { apiRequest } from "../api/client";

// Investment calculators (backend /tools/* and /geo/stamp-duty): ROI,
// rental yield, appreciation and stamp duty. Every result carries the
// platform's disclaimers - these are indicative, not financial advice.
// Stamp duty rates come from the admin-maintained master data for each
// active state.

const inputClass =
  "mt-1 h-[42px] w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 font-['Plus_Jakarta_Sans'] text-[14px] text-[#111827] outline-none focus:border-[#E51C23]";
const labelClass = "block font-['Plus_Jakarta_Sans'] text-[13px] font-semibold text-[#374151]";
const inr = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) return "—";
  if (Math.abs(n) >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (Math.abs(n) >= 1e5) return `₹${(n / 1e5).toFixed(2)} L`;
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
};
const post = (path, body) => apiRequest(path, { method: "POST", body }).then((r) => r.data);

const TOOLS = [
  { key: "roi", label: "ROI" },
  { key: "yield", label: "Rental yield" },
  { key: "appreciation", label: "Appreciation" },
  { key: "stamp", label: "Stamp duty" },
];

function Result({ rows, disclaimers }) {
  return (
    <div className="mt-5 rounded-[16px] bg-[#F9FAFB] p-5">
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-[12px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">{k}</dt>
            <dd className="text-[20px] font-extrabold text-[#111827]">{v}</dd>
          </div>
        ))}
      </dl>
      {(disclaimers || []).map((d) => (
        <p key={d.key} className="mt-3 text-[11px] leading-4 text-[#9CA3AF]" dangerouslySetInnerHTML={{ __html: d.content_html }} />
      ))}
    </div>
  );
}

function useForm(initial) {
  const [f, setF] = useState(initial);
  return [f, (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }))];
}

function Field({ label, value, onChange, suffix, ...rest }) {
  return (
    <label className={labelClass}>
      {label}
      <input type="number" min="0" step="any" value={value} onChange={onChange} className={inputClass} {...rest} />
      {suffix && <span className="mt-1 block text-[11px] font-normal text-[#9CA3AF]">{suffix}</span>}
    </label>
  );
}

function RoiTool({ run }) {
  const [f, set] = useForm({ purchasePrice: "", monthlyRent: "", annualAppreciationPercent: "6", holdingYears: "5", acquisitionCosts: "", annualExpenses: "", loanAmount: "", loanInterestPercent: "" });
  const [r, setR] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    const body = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== "").map(([k, v]) => [k, Number(v)]));
    run(() => post("/tools/roi", body), setR);
  };
  return (
    <form onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Purchase price (₹) *" required value={f.purchasePrice} onChange={set("purchasePrice")} suffix={f.purchasePrice && inr(f.purchasePrice)} />
        <Field label="Monthly rent (₹)" value={f.monthlyRent} onChange={set("monthlyRent")} />
        <Field label="Appreciation (% / yr)" value={f.annualAppreciationPercent} onChange={set("annualAppreciationPercent")} min="-50" />
        <Field label="Holding period (years)" value={f.holdingYears} onChange={set("holdingYears")} />
        <Field label="Stamp duty & fees (₹)" value={f.acquisitionCosts} onChange={set("acquisitionCosts")} />
        <Field label="Annual expenses (₹)" value={f.annualExpenses} onChange={set("annualExpenses")} />
        <Field label="Loan amount (₹)" value={f.loanAmount} onChange={set("loanAmount")} />
        <Field label="Loan interest (% / yr)" value={f.loanInterestPercent} onChange={set("loanInterestPercent")} />
      </div>
      <button type="submit" className="cta-red mt-5 h-[44px] rounded-[12px] px-6 text-[14px] font-bold text-white">Calculate ROI</button>
      {r && (
        <Result
          rows={[
            ["Total profit", inr(r.totalProfit)],
            ["Absolute ROI", `${r.absoluteRoiPercent}%`],
            ["Annualised ROI", `${r.annualisedRoiPercent}%`],
            ["Equity multiple", `${r.equityMultiple}×`],
            ["Projected exit value", inr(r.projectedExitValue)],
            ["Net rental income", inr(r.netRentalIncome)],
          ]}
          disclaimers={r.disclaimers}
        />
      )}
    </form>
  );
}

function YieldTool({ run }) {
  const [f, set] = useForm({ propertyPrice: "", monthlyRent: "", annualExpenses: "", vacancyMonths: "" });
  const [r, setR] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    const body = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== "").map(([k, v]) => [k, Number(v)]));
    run(() => post("/tools/rental-yield", body), setR);
  };
  return (
    <form onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Field label="Property price (₹) *" required value={f.propertyPrice} onChange={set("propertyPrice")} suffix={f.propertyPrice && inr(f.propertyPrice)} />
        <Field label="Monthly rent (₹) *" required value={f.monthlyRent} onChange={set("monthlyRent")} />
        <Field label="Annual expenses (₹)" value={f.annualExpenses} onChange={set("annualExpenses")} suffix="Maintenance, property tax, insurance" />
        <Field label="Vacant months / yr" value={f.vacancyMonths} onChange={set("vacancyMonths")} max="12" />
      </div>
      <button type="submit" className="cta-red mt-5 h-[44px] rounded-[12px] px-6 text-[14px] font-bold text-white">Calculate yield</button>
      {r && (
        <Result
          rows={[
            ["Gross yield", `${r.grossYieldPercent}%`],
            ["Net yield", `${r.netYieldPercent}%`],
            ["Net annual income", inr(r.netAnnualIncome)],
            ["Payback period", r.paybackYears ? `${r.paybackYears} years` : "—"],
          ]}
          disclaimers={r.disclaimers}
        />
      )}
    </form>
  );
}

function AppreciationTool({ run }) {
  const [f, set] = useForm({ currentValue: "", annualAppreciationPercent: "6", years: "5" });
  const [r, setR] = useState(null);
  const submit = (e) => {
    e.preventDefault();
    run(() => post("/tools/appreciation", { currentValue: Number(f.currentValue), annualAppreciationPercent: Number(f.annualAppreciationPercent), years: Number(f.years) }), setR);
  };
  return (
    <form onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Current value (₹) *" required value={f.currentValue} onChange={set("currentValue")} suffix={f.currentValue && inr(f.currentValue)} />
        <Field label="Appreciation (% / yr) *" required value={f.annualAppreciationPercent} onChange={set("annualAppreciationPercent")} min="-50" />
        <Field label="Years" value={f.years} onChange={set("years")} max="30" />
      </div>
      <button type="submit" className="cta-red mt-5 h-[44px] rounded-[12px] px-6 text-[14px] font-bold text-white">Project value</button>
      {r && (
        <>
          <Result rows={[["Projected value", inr(r.projectedValue)], ["Projected gain", inr(r.projectedGain)]]} disclaimers={r.disclaimers} />
          <div className="mt-4 flex flex-wrap gap-2">
            {(r.schedule || []).map((y) => (
              <span key={y.year} className="rounded-full border border-[#E5E7EB] px-3 py-1 text-[13px] text-[#374151]">
                Year {y.year}: <b>{y.display}</b>
              </span>
            ))}
          </div>
        </>
      )}
    </form>
  );
}

function StampDutyTool({ run }) {
  const [states, setStates] = useState([]);
  const [f, set] = useForm({ stateCode: "", amount: "", buyerGender: "any" });
  const [r, setR] = useState(null);
  useEffect(() => {
    apiRequest("/geo/states").then((res) => setStates(res.data || [])).catch(() => {});
  }, []);
  const submit = (e) => {
    e.preventDefault();
    run(async () => {
      const res = await apiRequest(`/geo/stamp-duty?stateCode=${encodeURIComponent(f.stateCode)}&transactionType=sale`);
      const rules = res.data.rules || [];
      const rule = rules.find((x) => x.buyer_gender === f.buyerGender) || rules.find((x) => x.buyer_gender === "any") || rules[0];
      if (!rule) return { none: true, disclaimers: res.data.disclaimers };
      const amount = Number(f.amount);
      const duty = (amount * Number(rule.rate_percent)) / 100;
      let registration = (amount * Number(rule.registration_fee_percent || 0)) / 100;
      if (rule.registration_fee_cap != null) registration = Math.min(registration, Number(rule.registration_fee_cap));
      return { rule, duty, registration, total: duty + registration, disclaimers: res.data.disclaimers };
    }, setR);
  };
  return (
    <form onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-3">
        <label className={labelClass}>
          State *
          <select required value={f.stateCode} onChange={set("stateCode")} className={inputClass}>
            <option value="">Select state</option>
            {states.map((s) => (
              <option key={s.state_code} value={s.state_code}>{s.state_name}</option>
            ))}
          </select>
        </label>
        <Field label="Property value (₹) *" required value={f.amount} onChange={set("amount")} suffix={f.amount && inr(f.amount)} />
        <label className={labelClass}>
          Buyer
          <select value={f.buyerGender} onChange={set("buyerGender")} className={inputClass}>
            <option value="any">Any</option><option value="female">Woman</option><option value="male">Man</option><option value="joint">Joint</option>
          </select>
        </label>
      </div>
      <button type="submit" className="cta-red mt-5 h-[44px] rounded-[12px] px-6 text-[14px] font-bold text-white">Calculate stamp duty</button>
      {r?.none && <p className="mt-4 text-[14px] text-[#92400E]">Stamp duty rates for this state aren't published on the platform yet - your representative can confirm them.</p>}
      {r && !r.none && (
        <Result
          rows={[
            ["Stamp duty", `${inr(r.duty)} (${Number(r.rule.rate_percent)}%)`],
            ["Registration fee", `${inr(r.registration)}${r.rule.registration_fee_cap != null ? ` (capped at ${inr(r.rule.registration_fee_cap)})` : ""}`],
            ["Total", inr(r.total)],
            ["Rate effective from", r.rule.effective_from || "—"],
          ]}
          disclaimers={r.disclaimers}
        />
      )}
    </form>
  );
}

function ToolsPage() {
  const [tool, setTool] = useState("roi");
  const [error, setError] = useState(null);
  const run = async (fn, setter) => {
    setError(null);
    try {
      setter(await fn());
    } catch (err) {
      setError(err.message);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Property Investment Calculators | PropertySerch";
  }, []);
  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <SiteHeader />
      <section className="border-b border-[#E5E7EB] px-4 py-10 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold sm:text-[38px]">Property investment calculators</h1>
          <p className="mt-2 max-w-[640px] text-[16px] leading-7 text-[#6B7280]">Work out returns, rental yield, future value and stamp duty before you commit. Indicative figures - talk to your representative before deciding.</p>
        </div>
      </section>
      <section className="px-4 py-8 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="scrollbar-hide mb-6 flex gap-2 overflow-x-auto">
            {TOOLS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => { setTool(t.key); setError(null); }}
                className={`shrink-0 rounded-full px-5 py-2 text-[14px] font-bold ${tool === t.key ? "bg-[#111827] text-white" : "border border-[#E5E7EB] text-[#374151]"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="rounded-[20px] border border-[#E5E7EB] p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            {tool === "roi" && <RoiTool run={run} />}
            {tool === "yield" && <YieldTool run={run} />}
            {tool === "appreciation" && <AppreciationTool run={run} />}
            {tool === "stamp" && <StampDutyTool run={run} />}
            {error && <p className="mt-4 text-[14px] text-red-600">{error}</p>}
          </div>
        </div>
      </section>
      <CompanyFooterSection />
    </main>
  );
}

export default ToolsPage;
