import { InstitutionalFeaturedAd } from "../components/AdSlot";
import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import EnquiryModal from "../components/EnquiryModal";
import { institutional } from "../api/institutional";
import { useSeo } from "../lib/seo";

// Institutional marketplace (Screen 9, public view): masked listings -
// type, locality, an enrollment range and a price range. The institution's
// name is confidential and is released only to a verified buyer under NDA.
// Filters: institution type, board / affiliation, transaction type, city,
// budget and campus size.

const selectClass = "h-[42px] w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-[14px] text-[#111827] outline-none focus:border-[#E51C23]";

function InstitutionalMarketPage() {
  const [params, setParams] = useSearchParams();
  const [meta, setMeta] = useState(null);
  const [state, setState] = useState({ status: "loading", items: [], disclaimer: "" });
  const [draft, setDraft] = useState(() => Object.fromEntries(params.entries()));
  const [advisor, setAdvisor] = useState(false);

  useSeo({
    title: "Institutional Properties - Schools, Colleges, Hospitals & Campuses",
    description: "Confidential sale, stake-sale, lease and joint-venture opportunities in schools, colleges, universities, hospitals, hotels and campuses - for verified institutional buyers under NDA.",
    path: "/buy/institutional-properties",
  }, []);

  useEffect(() => {
    institutional.meta().then(setMeta).catch(() => {});
  }, []);
  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading" }));
    institutional
      .list(Object.fromEntries(params.entries()))
      .then((d) => !cancelled && setState({ status: "ready", items: d.items || [], disclaimer: d.disclaimer, total: d.pagination?.total || 0 }))
      .catch((err) => !cancelled && setState({ status: "error", items: [], message: err.message }));
    return () => {
      cancelled = true;
    };
  }, [params]);

  const set = (k) => (e) => setDraft((d) => ({ ...d, [k]: e.target.value }));
  const apply = (e) => {
    e?.preventDefault();
    setParams(Object.fromEntries(Object.entries(draft).filter(([, v]) => v)), { replace: true });
  };
  const clear = () => {
    setDraft({});
    setParams({}, { replace: true });
  };

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <EnquiryModal open={advisor} onClose={() => setAdvisor(false)} topic="Institutional Advisor" description="Tell us the asset type, city and ticket size - an institutional advisor will call you back in confidence." />
      <section className="bg-[#FEF2F2]">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold uppercase tracking-[0.08em] text-[#E51C23]">Institutional</p>
          <h1 className="mt-2 font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-tight text-[#111827] sm:text-[40px]">Schools, colleges, hospitals and campuses</h1>
          <p className="mt-3 max-w-[680px] text-[15px] leading-7 text-[#4B5563]">
            Every listing here is confidential. You see the type, the locality and ranges; the institution's name and documents are shared after you are verified as a buyer and sign an NDA.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/dashboard/institutional" className="cta-red inline-flex h-[44px] items-center rounded-[12px] px-5 text-[14px] font-bold text-white">Become a verified buyer</Link>
            <Link to="/post-institutional" className="inline-flex h-[44px] items-center rounded-[12px] border border-[#E5E7EB] bg-white px-5 text-[14px] font-bold text-[#111827]">List an institution</Link>
            <button type="button" onClick={() => setAdvisor(true)} className="inline-flex h-[44px] items-center px-2 text-[14px] font-bold text-[#E51C23]">Talk to an advisor →</button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <form onSubmit={apply} className="grid gap-3 rounded-[16px] border border-[#E5E7EB] bg-[#F9FAFB] p-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-[12px] font-semibold text-[#6B7280]">Institution type
            <select id="if-class" className={`${selectClass} mt-1`} value={draft.assetClass || ""} onChange={set("assetClass")}>
              <option value="">All types</option>
              {(meta?.assetClasses || []).map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
            </select>
          </label>
          <label className="text-[12px] font-semibold text-[#6B7280]">Board / affiliation
            <input id="if-board" className={`${selectClass} mt-1`} placeholder="CBSE, ICSE, IB, UGC…" value={draft.board || ""} onChange={set("board")} />
          </label>
          <label className="text-[12px] font-semibold text-[#6B7280]">Transaction
            <select id="if-deal" className={`${selectClass} mt-1`} value={draft.dealType || ""} onChange={set("dealType")}>
              <option value="">Any</option>
              {(meta?.dealTypes || []).map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </label>
          <label className="text-[12px] font-semibold text-[#6B7280]">City
            <input id="if-city" className={`${selectClass} mt-1`} value={draft.city || ""} onChange={set("city")} />
          </label>
          <label className="text-[12px] font-semibold text-[#6B7280]">Budget from (₹ Cr)
            <input id="if-bmin" type="number" min="0" className={`${selectClass} mt-1`} value={draft.budgetMinCr || ""} onChange={set("budgetMinCr")} />
          </label>
          <label className="text-[12px] font-semibold text-[#6B7280]">Budget up to (₹ Cr)
            <input id="if-bmax" type="number" min="0" className={`${selectClass} mt-1`} value={draft.budgetMaxCr || ""} onChange={set("budgetMaxCr")} />
          </label>
          <label className="text-[12px] font-semibold text-[#6B7280]">Campus from (acres)
            <input id="if-cmin" type="number" min="0" className={`${selectClass} mt-1`} value={draft.campusMinAcres || ""} onChange={set("campusMinAcres")} />
          </label>
          <div className="flex items-end gap-2">
            <button type="submit" className="cta-red h-[42px] flex-1 rounded-[10px] text-[14px] font-bold text-white">Search</button>
            <button type="button" onClick={clear} className="h-[42px] rounded-[10px] border border-[#E5E7EB] bg-white px-4 text-[14px] font-semibold text-[#374151]">Clear</button>
          </div>
        </form>

        <p className="mt-5 text-[13px] text-[#6B7280]">{state.status === "ready" ? `${state.total} confidential listing${state.total === 1 ? "" : "s"}` : ""}</p>
        {state.status === "loading" && <p className="py-10 text-center text-[14px] text-[#6B7280]">Loading…</p>}
        {state.status === "error" && <p className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{state.message}</p>}
        {state.status === "ready" && !state.items.length && (
          <div className="mt-3 rounded-[18px] border border-dashed border-[#E5E7EB] bg-[#FAFAFA] px-6 py-12 text-center">
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">No institutional listings match</p>
            <p className="mx-auto mt-1 max-w-[460px] text-[14px] leading-6 text-[#6B7280]">Many institutional mandates are never listed. Tell an advisor what you are looking for and we will search privately.</p>
            <button type="button" onClick={() => setAdvisor(true)} className="cta-red mt-4 h-[42px] rounded-[10px] px-5 text-[14px] font-bold text-white">Talk to an advisor</button>
          </div>
        )}
        <InstitutionalFeaturedAd className="mt-3" />
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.items.map((l) => (
            <Link key={l.id} to={`/institutional/asset/${l.id}`} className="flex flex-col rounded-[16px] border border-[#E5E7EB] bg-white p-5 transition hover:border-[#FCA5A5]">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#E51C23]">{l.assetClassLabel}</p>
                <span className="rounded-full bg-[#F3F4F6] px-2 py-0.5 text-[11px] font-bold text-[#4B5563]">Confidential</span>
              </div>
              <h2 className="mt-1 font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">{l.title}</h2>
              <p className="mt-1 text-[13px] text-[#6B7280]">{[l.locality, l.city].filter(Boolean).join(", ")}{l.boardAffiliation ? ` · ${l.boardAffiliation}` : ""}</p>
              <dl className="mt-3 grid grid-cols-2 gap-2 text-[13px]">
                <div><dt className="text-[11px] text-[#9CA3AF]">{l.enrollmentRange ? "Students" : "Capacity"}</dt><dd className="font-semibold text-[#111827]">{l.enrollmentRange || l.capacityRange || "—"}</dd></div>
                <div><dt className="text-[11px] text-[#9CA3AF]">Asking</dt><dd className="font-semibold text-[#111827]">{l.priceRange || "On request"}</dd></div>
                <div><dt className="text-[11px] text-[#9CA3AF]">Campus</dt><dd className="font-semibold text-[#111827]">{l.campusRange || "—"}</dd></div>
                <div><dt className="text-[11px] text-[#9CA3AF]">Transaction</dt><dd className="font-semibold text-[#111827]">{l.dealTypeLabel}</dd></div>
              </dl>
              <span className="mt-4 text-[13px] font-bold text-[#E51C23]">View and request details →</span>
            </Link>
          ))}
        </div>
        {state.disclaimer && <p className="mt-8 rounded-xl bg-[#F9FAFB] px-5 py-4 text-[12px] leading-5 text-[#6B7280]">{state.disclaimer}</p>}
      </section>
      <CompanyFooterSection />
    </main>
  );
}

export default InstitutionalMarketPage;
