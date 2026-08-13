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
              <button className="rounded-[14px] bg-[#ef2d2d] px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-[#d92626]">
                Register Your Interest
              </button>
              <button className="rounded-[14px] border border-white/15 px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-white/5">
                Eligibility &amp; Investor Guide
              </button>
            </div>
          </div>

          <div className="relative h-[232px] overflow-hidden rounded-[18px] shadow-[0_18px_36px_rgba(0,0,0,0.16)] md:h-[240px] lg:h-[230px]">
            <div className="absolute inset-0 bg-[linear-gradient(180deg,#a5c8e4_0%,#dbeaf4_32%,#f4f2e9_52%,#b67b55_52%,#5a392c_100%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.55),transparent_14%),radial-gradient(circle_at_80%_16%,rgba(255,255,255,0.34),transparent_13%),radial-gradient(circle_at_78%_80%,rgba(0,0,0,0.18),transparent_20%)]" />

            <div className="absolute left-5 right-5 bottom-0 h-[70px] rounded-t-[12px] bg-[#0f3440] shadow-[0_-10px_24px_rgba(0,0,0,0.1)]" />

            <div className="absolute left-[82px] bottom-[66px] h-[62px] w-[124px] rounded-t-[10px] bg-[#d8d2c7]" />
            <div className="absolute left-[186px] bottom-[66px] h-[52px] w-[108px] rounded-t-[10px] bg-[#b8a99d]" />
            <div className="absolute left-[276px] bottom-[66px] h-[70px] w-[170px] rounded-t-[10px] bg-[#f1e7d5]" />
            <div className="absolute left-[410px] bottom-[66px] h-[50px] w-[82px] rounded-t-[10px] bg-[#9b6a51]" />
            <div className="absolute left-[480px] bottom-[66px] h-[42px] w-[92px] rounded-t-[10px] bg-[#ccb89f]" />

            <div className="absolute left-[40px] bottom-[74px] h-[90px] w-[10px] rounded-full bg-[#5c3c24]">
              <div className="absolute left-[-18px] top-[-18px] h-9 w-9 rounded-full bg-[#537044]" />
              <div className="absolute left-[-28px] top-[2px] h-8 w-8 rounded-full bg-[#6a8d52]" />
              <div className="absolute left-[6px] top-[-4px] h-8 w-8 rounded-full bg-[#7c9d5b]" />
            </div>

            <div className="absolute right-[72px] bottom-[70px] h-[92px] w-[10px] rotate-[8deg] rounded-full bg-[#5c3c24]">
              <div className="absolute left-[-18px] top-[-18px] h-9 w-9 rounded-full bg-[#5f7d49]" />
              <div className="absolute left-[-30px] top-[0px] h-8 w-8 rounded-full bg-[#709555]" />
              <div className="absolute left-[5px] top-[-6px] h-8 w-8 rounded-full bg-[#86a965]" />
            </div>

            <div className="absolute left-[50%] top-[50%] h-[108px] w-[230px] -translate-x-1/2 -translate-y-[52%] rounded-t-[74px] bg-[#3f2b24]" />
            <div className="absolute left-[50%] top-[50%] h-[82px] w-[246px] -translate-x-1/2 -translate-y-[18%] rounded-[12px] bg-[#8d6650]" />
            <div className="absolute left-[50%] top-[50%] h-[14px] w-[250px] -translate-x-1/2 -translate-y-[73%] bg-[#564233]" />
            <div className="absolute left-[50%] top-[50%] h-[30px] w-[172px] -translate-x-1/2 -translate-y-[104%] rounded-t-[16px] bg-[#cb996c]" />

            <div className="absolute left-[50%] bottom-[16px] h-[68px] w-[182px] -translate-x-1/2 rounded-full bg-[#0e4759] blur-[2px]" />
            <div className="absolute inset-x-[26px] bottom-[18px] h-[52px] rounded-[20px] bg-[#083748]" />
            <div className="absolute left-[26px] right-[26px] bottom-[20px] h-[34px] rounded-full border border-white/10 bg-white/5" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default PremiumOwnershipSection;
