import React from "react";

function DealSupportSection({
  scoreText = "Investment Score - 74/100 - Liquidity: Moderate",
  title = "Special Situation Properties",
  description = "Curated bank auction, NBFC, and ARC-sourced deals, each carrying an Investment Score and clear risk indicators. Access limited to verified brokers, NRI, and HNI users.",
  pills = ["Documentation: In progress", "Possession: Clear", "Legal complexity: Low"],
  buttonText = "View Curated Deals",
  disclaimer = "Special situation property. Independent legal and financial due diligence required before proceeding.",
  financeTitle = "Need financing?",
  financeDescription = "Home loan, construction finance, loan against property, and NRI mortgage across leading banks and NBFCs.",
  financeRange = "₹10L - ₹100Cr",
  financeButtonText = "Check Eligibility",
  financeDisclaimer = "Loan eligibility subject to lender assessment and applicable terms and conditions.",
}) {
  return (
    <>
      <div className="h-[50px]" />

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[18px] border border-slate-200 bg-white px-6 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500">
            {scoreText}
          </div>

          <h3 className="mt-4 text-[24px] font-black text-slate-900">{title}</h3>
          <p className="mt-2 max-w-[650px] text-[14px] leading-6 text-slate-500">{description}</p>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {pills.map((pill) => (
              <span
                key={pill}
                className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.05em] text-slate-500"
              >
                {pill}
              </span>
            ))}
          </div>
          <button className="cta-red mt-4 rounded-[14px] px-6 py-3.5 text-[16px] font-extrabold text-white">
            {buttonText}
          </button>
          <p className="mt-4 border-t border-slate-100 pt-4 text-[14px] leading-6 text-slate-500">
            {disclaimer}
          </p>
        </div>

        <div className="rounded-[18px] bg-[#E51C23] px-6 py-6 text-white shadow-[0_10px_24px_rgba(239,68,68,0.18)]">
          <h3 className="text-[28px] font-black">{financeTitle}</h3>
          <p className="mt-3 text-[14px] leading-6 text-white/90">{financeDescription}</p>
          <div className="mt-5 text-[28px] font-black leading-none">{financeRange}</div>
          <button className="cta-white-on-red mt-6 w-full rounded-[14px] bg-white px-6 py-3.5 text-[16px] font-extrabold text-red-500 transition hover:bg-slate-50">
            {financeButtonText}
          </button>
          <p className="mt-4 border-t border-white/20 pt-4 text-[14px] leading-6 text-white/85">
            {financeDisclaimer}
          </p>
        </div>
      </div>
    </>
  );
}

export default DealSupportSection;
