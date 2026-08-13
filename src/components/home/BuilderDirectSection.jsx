import React from "react";

function BuilderDirectSection() {
  return (
    <>
      <div className="h-[60px]" />

      <div className="relative overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,rgba(9,20,40,0.45),rgba(9,20,40,0.75)),linear-gradient(135deg,#2b3d4f_0%,#0f172a_45%,#334155_100%)] px-9 py-9 shadow-[0_18px_36px_rgba(15,23,42,0.14)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.08),transparent_18%),radial-gradient(circle_at_75%_20%,rgba(255,255,255,0.06),transparent_14%),radial-gradient(circle_at_70%_80%,rgba(239,68,68,0.15),transparent_12%)]" />
        <div className="relative w-[544px] max-w-[544px] text-white">
          <div className="inline-flex h-[32px] w-[257px] items-center justify-center gap-[10px] rounded-full border border-[#FFFFFF33] bg-[#FFFFFF33] px-4 py-2 text-center backdrop-blur-[12px]">
            <span className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[12px] font-semibold uppercase leading-[16px] tracking-[0.1em] text-white">
              Sponsored · Zero Brokerage
            </span>
          </div>
          <h3 className="mt-6 h-[96px] w-[544px] font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-[48px] tracking-[0]">
            The West Delhi Collection,
            <span className="block text-[#E51C23]">by A R Buildwel</span>
          </h3>
          <p className="mt-4 h-[48px] w-[544px] font-['Lato'] text-[16px] font-normal leading-6 tracking-[0] text-[#E5E7EB]">
            RERA registered residences with construction progress you can track in real time.
            No middlemen, direct from the builder, backed end-to-end.
          </p>
          <button className="mt-5 inline-flex h-[48px] w-[153px] items-center justify-center rounded-[12px] bg-[#E51C23] px-8 py-3 text-white transition hover:bg-[#cc1820]">
            <span className="inline-flex h-[24px] w-[89px] items-center justify-center whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-6 tracking-[0.0068em] text-white">
              Know More
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default BuilderDirectSection;
