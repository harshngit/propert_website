import React from "react";

function BuilderDirectSection({
  badgeText = "Builder Direct",
  titlePrefix = "The West Delhi Collection,",
  titleHighlight = "by A R Buildwel",
  description = "RERA registered residences with construction progress tracking. No middlemen, direct from builder.",
  buttonText = "Know More",
}) {
  const heroImage =
    "/images/super%20luxury%20contemporary%20waterfront%20mansion%20architectural%20visualization,%20cinematic%20lighting.png";

  return (
    <>
      <div className="h-[50px]" />

      <div className="relative mx-auto flex h-[450px] w-[362px] max-w-full items-end overflow-hidden rounded-[16px] bg-[#FFFFFF01] px-6 py-8 shadow-[0px_8px_10px_-6px_rgba(0,0,0,0.1),0px_20px_25px_-5px_rgba(0,0,0,0.1)] sm:h-[380px] sm:w-full sm:max-w-[1440px] sm:rounded-[4px] sm:bg-[#0f172a] sm:px-9 sm:py-9 sm:shadow-[0_18px_36px_rgba(15,23,42,0.14)]">
        <img
          src={heroImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover sm:object-cover sm:object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.05)_20%,rgba(15,23,42,0.92)_100%)] sm:bg-[linear-gradient(90deg,#111827_0%,rgba(17,24,39,0.5)_50%,rgba(17,24,39,0)_100%)]" />
        <div className="relative w-full max-w-none text-white sm:w-[544px] sm:max-w-[544px]">
          <div className="inline-flex h-[29px] w-auto max-w-full items-center justify-center gap-[10px] rounded-full border border-[#FFFFFF33] bg-[#FFFFFF33] px-4 py-2 text-center backdrop-blur-[12px] sm:w-[257px]">
            <span className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[10px] font-semibold uppercase leading-[16px] tracking-[0.1em] text-white">
              <span className="sm:hidden">Sponsored &middot; Zero Brokerage</span>
              <span className="hidden sm:inline">{badgeText} &middot; Zero Brokerage</span>
            </span>
          </div>
          <h3 className="mt-6 h-auto w-full font-['Plus_Jakarta_Sans'] text-[22px] font-extrabold leading-[23px] tracking-[0] sm:h-[96px] sm:w-[544px] sm:leading-[48px]">
            <span className="whitespace-nowrap">{titlePrefix}</span>
            <span className="block text-white sm:text-[#E51C23]">{titleHighlight}</span>
          </h3>
          <p className="mt-4 h-auto w-full font-['Lato'] text-[13px] font-normal leading-[18px] tracking-[0] text-[#E5E7EB] sm:h-[48px] sm:w-[544px] sm:leading-6">
            {description}
          </p>
          <button className="ml-2 cta-red cta-red-on-dark mt-5 inline-flex h-[50px] w-[280px] items-center justify-center rounded-[16px] px-8 py-3 text-white sm:h-[48px] sm:w-[153px] sm:rounded-[12px]">
            <span className="inline-flex h-[24px] w-[89px] items-center justify-center whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-6 tracking-[0.0068em] text-inherit">
              {buttonText}
            </span>
          </button>
        </div>
      </div>
    </>
  );
}

export default BuilderDirectSection;
