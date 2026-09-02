import React from "react";

function SectionHeading({
  title,
  subtitle,
  accent,
  className = "",
  mobileCompact = false,
  mobileSmall = false,
  cityLandingMobile = false,
}) {
  const wrapperClassName =
    className ||
    (mobileCompact
      ? "mb-5 mt-[20px] flex flex-row items-start justify-between gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-5"
      : "mb-5 mt-[20px] flex flex-wrap items-end justify-between gap-5");

  return (
    <div className={wrapperClassName}>
      <div>
        <h2
          className={`font-['Plus_Jakarta_Sans'] font-extrabold leading-9 tracking-[0.002em] text-[#111827] ${
            cityLandingMobile
              ? "text-[24px] sm:text-[30px]"
              : mobileSmall
              ? "text-[28px] sm:text-[30px]"
              : mobileCompact
                ? "text-[24px] sm:text-[30px]"
                : "text-[30px]"
          }`}
        >
          {cityLandingMobile ? (
            <>
              <span className="sm:hidden">{title.replace(" Properties", "")}</span>
              <span className="hidden sm:inline">{title}</span>
            </>
          ) : (
            title
          )} {accent ? <span className="text-red-500">{accent}</span> : null}
        </h2>
        <p
          className={`font-['Plus_Jakarta_Sans'] font-normal leading-6 text-[#6B7280] ${
            mobileSmall
              ? "text-[13px] sm:mt-1 sm:text-[16px]"
              : mobileCompact
                ? "text-[12px] sm:mt-1 sm:text-[16px]"
                : "text-[16px]"
          }`}
        >
          {subtitle}
        </p>
      </div>
      <button
        className={`inline-flex h-6 w-[77.5px] flex-nowrap items-center gap-2 whitespace-nowrap font-['Plus_Jakarta_Sans'] font-bold leading-6 tracking-[0.0049em] text-[#E51C23] transition hover:text-red-600 ${
          cityLandingMobile ? "gap-1 sm:gap-2" : ""
        } ${
          cityLandingMobile
            ? "mt-5 mb-0 w-auto text-[12px] sm:mt-0 sm:w-[77.5px] sm:mb-5 sm:text-[12px]"
            : mobileSmall
            ? "mt-5 mb-0 w-auto text-[10px] sm:mt-0 sm:w-[77.5px] sm:mb-5 sm:text-[12px]"
            : mobileCompact
              ? "mt-5 mb-0 w-auto text-[12px] sm:mt-0 sm:w-[77.5px] sm:mb-5"
              : "mb-5 text-[12px]"
        }`}
      >
        <span
          className={`inline-flex h-6 shrink-0 items-center justify-center whitespace-nowrap text-center ${
            mobileCompact ? "ml-0 w-auto sm:ml-5 sm:w-[62px]" : "ml-5 w-[62px]"
          }`}
        >
          View All
        </span>
        <img
          src="/icons/Img%20(1).png"
          alt=""
          aria-hidden="true"
          className={
            cityLandingMobile
              ? "h-[11px] w-[8.5px] shrink-0 scale-[1.05] object-contain sm:h-[10px] sm:w-[7.5px] sm:scale-100"
              : "h-[10px] w-[7.5px] shrink-0 object-contain"
          }
        />
      </button>
    </div>
  );
}

export default SectionHeading;
