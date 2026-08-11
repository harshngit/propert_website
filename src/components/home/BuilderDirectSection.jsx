import React from "react";

function BuilderDirectSection() {
  return (
    <>
      <div className="h-10" />

      <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,rgba(9,20,40,0.45),rgba(9,20,40,0.75)),linear-gradient(135deg,#2b3d4f_0%,#0f172a_45%,#334155_100%)] px-9 py-9 shadow-[0_18px_36px_rgba(15,23,42,0.14)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.06),transparent_14%),radial-gradient(circle_at_70%_80%,rgba(239,68,68,0.15),transparent_12%)]" />
        <div className="relative max-w-[520px] text-white">
          <div className="inline-block rounded-full border border-white/10 bg-white/10 px-3.5 py-2 text-[12px] font-bold tracking-[0.08em] text-slate-200">
            BUILDER DIRECT - ZERO BROKERAGE
          </div>
          <h3 className="mt-6 text-[40px] font-black leading-[1.06]">
            The West Delhi Collection,
            <span className="block text-red-500">by A R Buildwel</span>
          </h3>
          <p className="mt-4 max-w-[460px] text-[16px] leading-7 text-white/85">
            RERA registered residences with construction progress you can track in real time.
            No middlemen, direct from the builder, backed end-to-end.
          </p>
          <button className="mt-5 rounded-[14px] bg-red-500 px-7 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-red-600">
            Know More
          </button>
        </div>
      </div>
    </>
  );
}

export default BuilderDirectSection;
