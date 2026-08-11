import React from "react";
import { premiumPills } from "../../data/homeContent";

function PremiumInvestmentSection() {
  return (
    <>
      <div className="h-10" />

      <div className="rounded-[22px] bg-[linear-gradient(135deg,rgba(15,23,42,0.98)_0%,rgba(17,24,39,0.96)_100%)] px-9 py-9 text-white shadow-[0_18px_36px_rgba(15,23,42,0.16)]">
        <div className="flex flex-wrap items-center justify-between gap-8">
          <div className="max-w-[510px]">
            <div className="inline-block rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-[12px] font-bold tracking-[0.08em] text-slate-300">
              {premiumPills.join(" - ")}
            </div>
            <h3 className="mt-5 text-[34px] font-black leading-tight">
              Own a share of premium real estate
              <span className="block">Not the whole property</span>
            </h3>
            <p className="mt-4 max-w-[460px] text-[17px] leading-7 text-slate-400">
              Exclusive SPV-backed investment opportunities for eligible investors, professionally
              managed with independent valuation and expert oversight.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-[14px] bg-red-500 px-5 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-red-600">
                Register Your Interest
              </button>
              <button className="rounded-[14px] border border-white/15 px-5 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-white/5">
                Eligibility & Investor Guide
              </button>
            </div>
          </div>

          <div className="h-[220px] w-[430px] shrink-0 rounded-[20px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04)),linear-gradient(135deg,#c8d7e3_0%,#6b8ba4_42%,#e8d2b6_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" />
        </div>
      </div>
    </>
  );
}

export default PremiumInvestmentSection;
