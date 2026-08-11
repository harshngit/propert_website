import React from "react";
import { featurePills } from "../../data/homeContent";

function DealSupportSection() {
  return (
    <>
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
    </>
  );
}

export default DealSupportSection;
