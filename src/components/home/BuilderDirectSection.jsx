import React from "react";

function BuilderDirectSection({
  badgeText = "Builder Direct · Zero Brokerage",
  titlePrefix = "The West Delhi Collection,",
  titleHighlight = "by A R Buildwel",
  description = "RERA registered residences with construction progress you can track in real time. No middlemen, direct from the builder, backed end-to-end.",
  buttonText = "Know More",
}) {
  const heroImage =
    "/images/super%20luxury%20contemporary%20waterfront%20mansion%20architectural%20visualization,%20cinematic%20lighting.png";

  return (
    <>
      <div className="h-[50px]" />

      <div className="relative mx-auto h-[380px] w-full max-w-[1440px] overflow-hidden rounded-[4px] bg-[#0f172a] px-9 py-9 shadow-[0_18px_36px_rgba(15,23,42,0.14)]">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute rounded-[50%] inset-0 bg-[linear-gradient(90deg,#111827_0%,rgba(17,24,39,0.5)_50%,rgba(17,24,39,0)_100%)]" />
        <div className="relative w-[544px] max-w-[544px] text-white">
          <div className="inline-flex h-[32px] w-[257px] items-center justify-center gap-[10px] rounded-full border border-[#FFFFFF33] bg-[#FFFFFF33] px-4 py-2 text-center backdrop-blur-[12px]">
            <span className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[11px] font-semibold uppercase leading-[16px] tracking-[0.1em] text-white">
              {badgeText}
            </span>
          </div>
          <h3 className="mt-6 h-[96px] w-[544px] font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-[48px] tracking-[0]">
            {titlePrefix}
            <span className="block text-[#E51C23]">{titleHighlight}</span>
          </h3>
          <p className="mt-4 h-[48px] w-[544px] font-['Lato'] text-[16px] font-normal leading-6 tracking-[0] text-[#E5E7EB]">
            {description}
          </p>
          <button className="cta-red mt-5 inline-flex h-[48px] w-[153px] items-center justify-center rounded-[12px] px-8 py-3 text-white">
            <span className="inline-flex h-[24px] w-[89px] items-center justify-center whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-6 tracking-[0.0068em] text-white">
              {buttonText}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default BuilderDirectSection;
