import React from "react";

function DealSupportSection() {
  return (
    <>
      <div className="h-[50px]" />

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[18px] border border-slate-200 bg-white px-6 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
            Investment Score - 74/100 - Liquidity: Moderate
          </div>

          <h3 className="mt-4 text-[24px] font-black text-slate-900">Special Situation Properties</h3>
          <p className="mt-2 text-[14px] max-w-[650px] leading-6 text-slate-500">
            Curated bank auction, NBFC, and ARC-sourced deals, each carrying an Investment
            Score and clear risk indicators. Access limited to verified brokers, NRI, and HNI
            users.
          </p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {["Documentation: In progress", "Possession: Clear", "Legal complexity: Low"].map((pill) => (
              <span key={pill} className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.05em] text-slate-500">
                {pill}
              </span>
            ))}
          </div>
          <button className="mt-4 rounded-[14px] bg-[#E51C23] px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-[#cc1820]">
            View Curated Deals
          </button>
          <p className="mt-4 text-[14px] border-t border-slate-100 pt-4  leading-6 text-slate-500">
            Special situation property. Independent legal and financial due diligence required
            before proceeding.
          </p>
        </div>

        <div className="rounded-[18px] bg-[#E51C23] px-6 py-6 text-white shadow-[0_10px_24px_rgba(239,68,68,0.18)]">
          <h3 className="text-[28px] font-black">Need financing?</h3>
          <p className="mt-3 text-[14px] leading-6 text-white/90">
            Home loan, construction finance, loan against property, and NRI mortgage across
            leading banks and NBFCs.
          </p>
          <div className="mt-5 text-[28px] font-black leading-none">
            ₹10L - ₹100Cr
          </div>
          <button className="mt-6 w-full rounded-[14px] bg-white px-6 py-3.5 text-[16px] font-extrabold text-red-500 transition hover:bg-slate-50">
            Check Eligibility
          </button>
          <p className="mt-4 text-[14px] border-t border-white/20 pt-4 leading-6 text-white/85">
            Loan eligibility subject to lender assessment and applicable terms and conditions.
          </p>
        </div>
      </div>
    </>
  );
}

export default DealSupportSection;
