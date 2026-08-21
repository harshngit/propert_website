import React from "react";

function PremiumInvestmentSection() {
  return (
    <>
      <div className="h-10" />

      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[linear-gradient(180deg,rgba(9,20,40,0.45),rgba(9,20,40,0.75)),linear-gradient(135deg,#2b3d4f_0%,#0f172a_45%,#334155_100%)] px-16 py-12 text-white shadow-[0_18px_36px_rgba(15,23,42,0.14)]">
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

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button className="w-full rounded-[12px] bg-red-500 px-4 py-3.5 text-[14px] font-extrabold whitespace-nowrap text-white transition hover:bg-red-600 sm:w-auto sm:px-6 sm:text-[16px]">
                  Contact Institutional Desk
                </button>

                <button className="w-full rounded-[12px] border border-white/15 px-4 py-3.5 text-[14px] font-extrabold whitespace-nowrap text-white transition hover:bg-white/5 sm:w-auto sm:px-6 sm:text-[16px]">
                  Sample Data Room
                </button>
              </div>

              <p className="mt-6 max-w-[544px] border-t border-white/10 pt-5 font-['Lato'] text-[13px] leading-6 text-slate-400">
                Institution identity and financials stay masked until a signed NDA unlocks access.
              </p>
            </div>

            <div className="w-full mt-2 max-w-[600px] overflow-hidden rounded-[16px]">
              <img
                src="\images\buy or sell.png"
                alt="Buy or sell"
                className="h-[360px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PremiumInvestmentSection;
