import React from "react";

function PremiumInvestmentSection() {
  const detailRows = [
    ["Institution", "Noble Prime School"],
    ["Asset type", "K-12 School"],
    ["EBITDA band", "₹8 Cr - ₹12 Cr"],
    ["Stage", "Data Room · 4 of 9"],
    ["Access", "NDA required"],
  ];

  return (
  <>
    <div className="h-10" />

    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[linear-gradient(180deg,rgba(9,20,40,0.45),rgba(9,20,40,0.75)),linear-gradient(135deg,#2b3d4f_0%,#0f172a_45%,#334155_100%)] px-9 py-16 text-white shadow-[0_18px_36px_rgba(15,23,42,0.14)]">
      <div className="mx-auto max-w-[1780px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[544px]">
            <div className="inline-flex h-[32px] items-center rounded-full border border-[#FFFFFF33] bg-[#FFFFFF33] px-4 backdrop-blur-[12px]">
              <span className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[12px] font-semibold uppercase leading-[16px] tracking-[0.1em] text-white">
                First in India
              </span>
            </div>

            <h3 className="mt-6 font-['Plus_Jakarta_Sans'] text-[36px] font-extrabold leading-[48px] tracking-[0] text-white">
              Buy or sell a school, college, or
              <span className="block">university. Confidentially.</span>
            </h3>

            <p className="mt-4 max-w-[544px] font-['Lato'] text-[18px] font-normal leading-6 tracking-[0] text-[#9CA3AF]">
              A nine-stage structured pipeline - Intent, Buyer Qualification, NDA, Data Room, Site
              Visit, Valuation, Legal Due Diligence, Offer, Closure. Institution identity and
              financials stay masked until a signed NDA unlocks access.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="rounded-[12px] bg-red-500 px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-red-600">
                Contact Institutional Desk
              </button>

              <button className="rounded-[12px] border border-white/15 px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-white/5">
                Sample Data Room
              </button>
            </div>

            <p className="mt-6 max-w-[544px] border-t border-white/10 pt-5 font-['Lato'] text-[13px] leading-6 text-slate-400">
              Institution identity and financials stay masked until a signed NDA unlocks access.
            </p>
          </div>

          <div className="w-full max-w-[548px] rounded-[20px] border border-white/10 bg-[#ffffff12] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-[2px]">
            <div className="space-y-0">
              {detailRows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between border-b border-white/10 py-4 last:border-b-0"
                >
                  <span className="font-['Plus_Jakarta_Sans'] text-[16px] font-normal text-[#94A3B8]">
                    {label}
                  </span>

                  <span className="font-['Plus_Jakarta_Sans'] text-[16px] font-semibold text-white">
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
  </>
);
}

export default PremiumInvestmentSection;
