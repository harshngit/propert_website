import React from "react";

function PremiumRealEstateSection() {
  const chips = [
    "By invitation, subject to eligibility",
    "Assets in the Rs10 Cr - Rs100 Cr range",
    "Independently valued & professionally managed",
  ];

  return (
    <div className="relative left-1/2 mt-12 w-screen -translate-x-1/2 overflow-hidden bg-[#111827] px-16 py-16 text-white md:px-16 md:py-16">
      <div className="mx-auto max-w-[1780px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-[560px]">
            <div className="inline-flex rounded-full bg-[#FFFFFF1A] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
              Exclusive Access &middot; HNI &amp; NRI
            </div>

            <h2 className="mt-6 max-w-[560px] text-[32px] font-black leading-[1.06] tracking-tight text-white">
              Own a share of premium real estate.
              <span className="block">Not the whole property.</span>
            </h2>

            <p className="mt-5 max-w-[540px] text-[13px] leading-7 text-white/55 md:text-[18px]">
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

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button className="inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-[12px] bg-[#E51C23] px-4 py-3.5 text-[14px] font-extrabold text-white transition hover:bg-[#cc1820] sm:w-auto sm:px-6 sm:text-[16px]">
                <span>Register Your Interest</span>
                <span aria-hidden="true">&rarr;</span>
              </button>

              <button className="inline-flex w-full items-center justify-center whitespace-nowrap rounded-[12px] border border-white/15 px-4 py-3.5 text-[14px] font-extrabold text-white transition hover:bg-white/5 sm:w-auto sm:px-6 sm:text-[16px]">
                For NRI &amp; HNI Investors
              </button>
            </div>

            <p className="mt-6 max-w-[540px] border-t border-white/10 pt-5 text-[13px] leading-6 text-white/55">
              Available only to verified, eligible investors - not a public offer or solicitation.
              Returns are not guaranteed. Investment involves risk; independent legal and financial
              due diligence is required before proceeding.
            </p>
          </div>

          <div className="w-full max-w-[600px] overflow-hidden rounded-[16px] shadow-[0_18px_36px_rgba(0,0,0,0.16)]">
            <img
              src="\images\premium.png"
              alt="Buy or sell"
              className="h-[400px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumRealEstateSection;
