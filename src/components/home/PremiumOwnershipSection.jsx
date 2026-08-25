import React from "react";

function PremiumOwnershipSection() {
  return (
    <section className="mt-12 w-[100vw] max-w-none bg-[#111827] text-white ml-[calc(50%-50vw)] overflow-hidden">
      <div className="mx-auto flex min-h-[428px] max-w-[1280px] items-center px-6 py-8 box-border md:px-8 md:py-10">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-12">
          <div className="max-w-[580px]">
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white/75">
              Exclusive Access · HNI &amp; NRI
            </div>

            <h2 className="mt-5 max-w-[540px] text-[34px] font-black leading-[1.08] tracking-tight text-white md:text-[36px] lg:text-[38px]">
              Own a share of premium real estate
              <span className="block">Not the whole property</span>
            </h2>

            <p className="mt-5 max-w-[540px] text-[16px] leading-7 text-white/65 md:text-[18px]">
              Exclusive SPV-backed investment opportunities for eligible investors,
              professionally managed with independent valuation and expert oversight.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="cta-red-on-dark rounded-[14px] bg-[#ef2d2d] px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-[#d92626]">
                Register Your Interest
              </button>
              <button className="rounded-[14px] border border-white/15 px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-white/5">
                Eligibility &amp; Investor Guide
              </button>
            </div>
          </div>

          <div className="w-full max-w-[548px] overflow-hidden rounded-[16px] shadow-[0_18px_36px_rgba(0,0,0,0.16)]">
            <img
              src="/images/buy%20or%20sell.png"
              alt="Buy or sell"
              className="h-[280px] w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PremiumOwnershipSection;
