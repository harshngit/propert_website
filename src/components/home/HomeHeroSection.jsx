import React from "react";

function HomeHeroSection() {
  return (
    <section className="flex h-[548px] max-w-full flex-col items-center justify-center lg:px-[48px] lg:py-[96px]">
      <div className="mx-auto flex h-[48px] w-full max-w-[1184px] items-center justify-center">
        <h1
          className="h-[48px] text-center font-['Plus_Jakarta_Sans'] text-[48px] font-extrabold leading-[48px] tracking-[0] text-[#111827]"
          style={{ width: "1020.3092041015625px" }}
        >
          Beyond listings. Built for the entire deal
        </h1>
      </div>

      <p className="mx-auto mt-3 max-w-4xl text-[16px] leading-6 text-slate-500">
        Verified properties, legal facilitation, financing, and closure tracked end-to-end on one platform
      </p>
      <p className="mt-2 text-lg text-slate-400 md:text-[20px]">
        Not a portal, an operating system for real estate transactions
      </p>

      <div className="mx-auto mt-12 max-w-[780px] rounded-[22px] border border-slate-200 bg-white p-[10px] shadow-[0_16px_28px_rgba(15,23,42,0.16)]">
        <div className="grid gap-2 md:grid-cols-[1.3fr_1fr_1fr_160px]">
          <div className="flex min-h-16 items-center justify-center rounded-[16px] bg-slate-50 px-4 text-center text-base font-medium text-slate-500">
            Search City, Locality or Landmark
          </div>
          <div className="flex min-h-16 items-center justify-center rounded-[16px] bg-slate-50 px-4 text-center text-base font-medium text-slate-500">
            Property Type
          </div>
          <div className="flex min-h-16 items-center justify-center rounded-[16px] bg-slate-50 px-4 text-center text-base font-medium text-slate-500">
            Budget
          </div>
          <button className="rounded-[16px] bg-red-500 px-4 py-4 text-[18px] font-extrabold text-white transition hover:bg-red-600">
            Search
          </button>
        </div>
      </div>

      <p className="mt-6 font-semibold text-slate-500">
        Are you a Property Owner? <span className="text-red-500">Post for FREE</span>
      </p>

      <div className="mt-14 inline-flex rounded-full bg-slate-100 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-600">
        Verified users - Secure contact - End-to-end tracking
      </div>
    </section>
  );
}

export default HomeHeroSection;
