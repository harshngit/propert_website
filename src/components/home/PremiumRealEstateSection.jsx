import React from "react";

function PremiumRealEstateSection() {
  const detailRows = [
    ["Access", "Invitation only"],
    ["Structure", "Dedicated SPV (Pvt Ltd)"],
    ["Managed by", "Empanelled CA/CS"],
    ["Eligible for", "Verified HNI & NRI investors"],
  ];

  const chips = [
    "By invitation, subject to eligibility",
    "Assets in the ₹10 Cr - ₹100 Cr range",
    "Independently valued & professionally managed",
  ];

  return (
  <div className="relative left-1/2 mt-12 w-screen -translate-x-1/2 overflow-hidden bg-[#111827] px-6 py-16 text-white md:px-10 md:py-16">
    <div className="mx-auto max-w-[1780px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[560px]">
          <div className="inline-flex rounded-full bg-[#FFFFFF1A] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
            Exclusive Access · HNI & NRI
          </div>

          <h2 className="mt-6 max-w-[560px] text-[32px] font-black leading-[1.06] tracking-tight text-white">
            Own a share of premium real estate.
            <span className="block">Not the whole property.</span>
          </h2>

          <p className="mt-5 max-w-[540px] text-[13px] leading-7  text-white/55 md:text-[18px]">
            An invite-only opportunity structured through a dedicated Private Limited SPV,
            managed with an empanelled CA/CS and independent valuer at every step. Details are
            shared only after eligibility is confirmed.
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {chips.map((chip) => (
              <span
                key={chip}
                className="rounded-[7px] border border-white/15 bg-white/6 px-3 py-1.5 text-[11px] font-medium tracking-[0.01em] text-white/82"
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3]">
            <button className="rounded-[12px] bg-[#E51C23] px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-[#b88b25]">
              Register Your Interest →
            </button>

            <button className="rounded-[12px] border border-white/15 px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-white/5">
              For NRI & HNI Investors
            </button>
          </div>

          <p className="mt-6 max-w-[540px] border-t border-white/10 pt-5 text-[13px] leading-6 text-white/55">
            Available only to verified, eligible investors - not a public offer or solicitation.
            Returns are not guaranteed. Investment involves risk; independent legal and financial
            due diligence is required before proceeding.
          </p>
        </div>

        <div className="w-full max-w-[548px] rounded-[20px] border border-white/10 bg-[#ffffff12] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-[2px]">
          <div className="space-y-0">
            {detailRows.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between border-b border-white/10 py-4 last:border-b-0"
              >
                <span className="text-[16px] font-normal text-[#94A3B8]">
                  {label}
                </span>

                <span className="text-[16px] font-semibold text-white">
                  {value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-1.5">
            {Array.from({ length: 10 }).map((_, index) => (
              <span
                key={index}
                className={[
                  "h-1.5 flex-1 rounded-full",
                  index < 4 ? "bg-[#23B5D0]" : "bg-white/15",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
}

export default PremiumRealEstateSection;
