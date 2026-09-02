import React from "react";
import { useNavigate } from "react-router-dom";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import SiteHeader from "../components/SiteHeader";
import { propertyResults } from "../data/propertyResults";
import { buildPropertyDetailPath } from "../utils/propertySearch";

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                    */
/* -------------------------------------------------------------------------- */

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
      <path
        d="M7.25 12.5a5.25 5.25 0 1 1 0-10.5 5.25 5.25 0 0 1 0 10.5Zm3.9-.9L15 15.45"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FiltersIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 14 14"
      className="h-[14px] w-[14px] shrink-0"
      fill="none"
    >
      <path
        d="M1.75 3h10.5M3.5 7h7M5.25 11h3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-6 w-6 shrink-0 text-[#6B7280]"
      fill="none"
    >
      <path
        d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14Z"
        fill="currentColor"
      />
      <circle cx="8" cy="6.5" r="1.6" fill="white" />
    </svg>
  );
}

function ResultPinIcon() {
  return (
    <img
      src="/icons/pin%20icon.png"
      alt=""
      aria-hidden="true"
      className="h-[12px] w-[9px] shrink-0 object-contain"
    />
  );
}

function BedIcon() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}icons/bhk.png`}
      alt=""
      aria-hidden="true"
      className="h-[13px] w-[13px] shrink-0 object-contain"
    />
  );
}

function AreaIcon() {
  return (
    <img
      src={`${import.meta.env.BASE_URL}icons/Vector.png`}
      alt=""
      aria-hidden="true"
      className="h-[12px] w-[12px] shrink-0 object-contain"
    />
  );
}

function HeartIcon({ active = false }) {
  return (
    <svg
      viewBox="0 0 16 14"
      aria-hidden="true"
      className="relative top-[1px] h-[13.665px] w-[16px] shrink-0"
      fill={active ? "#E51C23" : "none"}
    >
      <path
        d="M14.4 2.8c-.4-.9-1-1.5-1.8-1.9-.8-.4-1.7-.5-2.6-.3-.9.2-1.7.8-2.4 1.6-.7-.8-1.5-1.4-2.4-1.6-.9-.2-1.8-.1-2.6.3-.8.4-1.4 1-1.8 1.9-.4.8-.5 1.8-.3 2.7.2 1 .8 1.9 1.6 2.8l5.5 5.5 5.5-5.5c.8-.8 1.4-1.8 1.6-2.8.2-.9.1-1.9-.3-2.7Z"
        fill={active ? "#E51C23" : "none"}
        stroke={active ? "#E51C23" : "#6B7280"}
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function resolveInitialDrawerState(initialDrawerState) {
  if (typeof initialDrawerState === "function") {
    return initialDrawerState();
  }

  if (initialDrawerState && typeof initialDrawerState === "object") {
    return initialDrawerState;
  }

  return {};
}

/* -------------------------------------------------------------------------- */
/*                            TOP SEARCH COMPONENTS                           */
/* -------------------------------------------------------------------------- */

function FilterField({ label, value }) {
  return (
    <div className="inline-flex items-center whitespace-nowrap text-[14px] leading-5 text-[#475569]">
      <span>{label}</span>
      <span className="ml-2 font-semibold text-[#0F172A]">{value}</span>
    </div>
  );
}

function Divider() {
  return <span className="h-6 w-px shrink-0 bg-slate-200" />;
}

function SearchControlsRow({ areaLabel, filtersOpen, onToggleFilters, variant = "light" }) {
  const isDark = variant === "dark";

  return (
    <div className="flex w-full items-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] pl-3 pr-4 py-1.5 md:gap-4 md:rounded-none md:border-0 md:bg-transparent md:px-0 md:py-0">
      <div className="flex h-[46px] min-w-0 flex-1 items-center gap-3 overflow-hidden bg-transparent px-0 md:h-[41px] md:gap-4 md:overflow-x-auto md:rounded-[12px] md:border md:border-[#E5E7EB] md:bg-[#F9FAFB] md:px-4">
        <div className="flex min-w-0 shrink-0 items-center gap-2 whitespace-nowrap text-[14px] leading-5 text-[#0F172A] md:gap-2 md:text-[14px]">
          <LocationIcon />

          <span className="flex min-w-0 flex-col font-semibold leading-5 md:flex-row md:items-center md:leading-5">
            <span>{areaLabel}</span>
            <span className="text-[11px] font-normal leading-[18px] text-[#6B7280] md:hidden">Flat • ₹1 Cr - ₹5 Cr</span>
          </span>
        </div>

        <span className="hidden md:inline-flex"><Divider /></span>

        <span className="hidden md:inline-flex"><FilterField label="Type:" value="Buy" /></span>

        <span className="hidden md:inline-flex"><Divider /></span>

        <span className="hidden md:inline-flex"><FilterField label="Property:" value="Flat" /></span>

        <span className="hidden md:inline-flex"><Divider /></span>

        <span className="hidden md:inline-flex"><FilterField label="Budget:" value="₹1 Cr - ₹5 Cr" /></span>
      </div>

      <div className="flex shrink-0 items-center gap-2 md:gap-4">
        <button
          type="button"
          onClick={onToggleFilters}
          aria-expanded={filtersOpen}
          aria-controls="results-filters"
          className={[
            "inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center gap-2 rounded-[10px] p-0 text-[14px] font-bold md:h-[45px] md:w-[149px] md:rounded-[12px] md:px-5",
            isDark
              ? "border border-[#E5E7EB] bg-white text-[#111827]"
              : "cta-navy text-white",
          ].join(" ")}
        >
          <FiltersIcon />
          <span className="hidden md:inline">More Filters</span>
        </button>

        <button
          type="button"
          aria-label="Search"
          className="cta-red-on-dark inline-flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#E51C23] text-white md:h-[44px] md:w-[44px] md:rounded-[12px]"
        >
          <SearchIcon />
        </button>
      </div>
    </div>
  );
}

function HeroSearchSection({
  title,
  description,
  areaLabel,
  filtersOpen,
  onToggleFilters,
  mobileTitleStyle = false,
  hideMobileDescription = false,
}) {
  return (
    <section className="w-full border-b border-[#2A3343] bg-[#111827] text-white">
      <div className={`mx-auto flex w-full max-w-[1440px] flex-col gap-6 px-4 ${mobileTitleStyle ? "py-4 sm:py-8" : "py-8"} sm:px-6 lg:px-8 xl:px-[9px]`}>
        <div className="max-w-[1120px]">
          <h1
            className={
              mobileTitleStyle
                ? "font-['Plus_Jakarta_Sans'] text-[22px] font-bold leading-[40px] tracking-[0] text-white sm:text-[40px] sm:font-semibold sm:leading-[1.15]"
                : "text-[34px] font-semibold leading-[1.15] text-white sm:text-[40px]"
            }
          >
            {title}
          </h1>
          <p
            className={`mt-2 max-w-[1120px] text-[18px] font-normal leading-[1.45] text-white/85 ${
              hideMobileDescription ? "hidden sm:block" : ""
            }`}
          >
            {description}
          </p>
        </div>

        <SearchControlsRow
          areaLabel={areaLabel}
          filtersOpen={filtersOpen}
          onToggleFilters={onToggleFilters}
          variant="dark"
        />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              SIDEBAR COMPONENTS                            */
/* -------------------------------------------------------------------------- */

function SidebarSection({ title, children }) {
  return (
    <section>
      <h3 className="text-[14px] font-bold leading-[18px] text-[#111827]">
        {title}
      </h3>

      <div className="mt-3">{children}</div>
    </section>
  );
}

function PillButton({ label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-[36px] w-[88px] items-center justify-center rounded-[8px] border p-2 text-[12px] font-medium transition",
        active
          ? "border-[#E51C23] bg-[#FFF5F5] text-[#E51C23]"
          : "border-[#E2E8F0] bg-white text-[#111827] hover:border-[#CBD5E1] hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function CheckboxItem({ label, checked = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 text-left text-[14px] leading-[16px] text-[#111827]"
    >
      <span
        className={[
          "inline-flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[2.5px] border",
          checked
            ? "border-[#E51C23] bg-[#E51C23] text-white"
            : "border-[#CBD5E1] bg-white",
        ].join(" ")}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-[10px] w-[10px]" fill="none">
            <path
              d="M2.5 6.2 4.8 8.5 9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <span className="font-['Lato'] font-normal">{label}</span>
    </button>
  );
}

function Toggle({ on = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={[
        "relative inline-flex h-[18px] w-[32px] items-center rounded-full",
        on ? "bg-[#E51C23]" : "bg-[#E5E7EB]",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform",
          on ? "translate-x-[16px]" : "translate-x-[2px]",
        ].join(" ")}
      />
    </button>
  );
}

function AmenityChip({ label, active = false, onClick }) {
  const widthByLabel = {
    Gym: "49.34px",
    Pool: "49px",
    Park: "49px",
    Clubhouse: "81.38px",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width: widthByLabel[label] || "49px" }}
      className={[
        "inline-flex h-[30px] items-center justify-center rounded-full px-[12px] text-[12px] font-medium transition",
        active
          ? "bg-[#111827] text-white"
          : "bg-[#F3F4F6] text-[#111827] hover:bg-slate-200",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function PriceRangeSlider({ minValue, maxValue, onMinChange, onMaxChange }) {
  const min = 0;
  const max = 100;
  const minPercent = (minValue / max) * 100;
  const maxPercent = (maxValue / max) * 100;

  return (
    <div>
      <div className="relative h-[20px] w-full">
        <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#E2E8F0]" />
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#E51C23]"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={(event) => {
            const nextMin = Math.min(Number(event.target.value), maxValue - 1);
            onMinChange(nextMin);
          }}
          aria-label="Minimum price"
          className="price-range-thumb absolute inset-0 z-[2] h-[20px] w-full appearance-none bg-transparent"
        />

        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={(event) => {
            const nextMax = Math.max(Number(event.target.value), minValue + 1);
            onMaxChange(nextMax);
          }}
          aria-label="Maximum price"
          className="price-range-thumb absolute inset-0 z-[3] h-[20px] w-full appearance-none bg-transparent"
        />
      </div>

      <div className="mt-[4px] flex justify-between text-[12px] text-[#6B7280]">
        <span>₹50 Lakh</span>
        <span>₹10 Cr+</span>
      </div>

      <style>{`
        .price-range-thumb::-webkit-slider-runnable-track {
          height: 3px;
          background: transparent;
        }
        .price-range-thumb::-moz-range-track {
          height: 3px;
          background: transparent;
        }
        .price-range-thumb::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          border: 2px solid #E51C23;
          background: #ffffff;
          cursor: pointer;
          margin-top: -5.5px;
        }
        .price-range-thumb::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          border: 2px solid #E51C23;
          background: #ffffff;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

function ResultCard({
  item,
  selected = false,
  favorite = false,
  onClick,
  onFavoriteToggle,
}) {
  return (
    <article
      onClick={onClick}
      className={[
        item.context === "institutional"
          ? "flex h-[272px] w-full overflow-hidden rounded-[16px] border shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
          : item.context === "auction"
            ? "flex h-[215px] w-full overflow-hidden rounded-[16px] border shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
          : item.context === "special"
            ? "flex h-[232px] w-full overflow-hidden rounded-[16px] border shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
          : "flex h-[215px] w-full overflow-hidden rounded-[16px] border shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
        "border-[#E5E7EB] bg-[#FFFFFF] hover:border-[#FFEBEB] hover:bg-[#FFF9F9] hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
        onClick ? "cursor-pointer" : "",
      ].join(" ")}
    >
      {/* PROPERTY IMAGE */}
      <div className="relative h-full w-[265px] shrink-0">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />

        {/* BADGES */}
        <div className="absolute left-[8px] top-[8px] flex items-center gap-[6px]">
          {item.badge === "NEW LISTING" ? (
            <span className="inline-flex h-[38px] w-[78.48px] items-center gap-[4px] rounded-[9999px] bg-white px-[8px] py-[4px] text-[10px] font-bold leading-[15px] tracking-normal text-[#111827] shadow-sm">
              <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full bg-[#E41C23]">
                <svg
                  viewBox="0 0 16 16"
                  className="h-[10px] w-[10px]"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 8.5 6.5 11 12 5.5"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span className="max-w-[38px] whitespace-normal text-center leading-[15px]">
                NEW LISTING
              </span>
            </span>
          ) : item.badge !== "VERIFIED" ? (
            <span className="inline-flex h-[23px] w-[71px] items-center justify-center rounded-[9999px] bg-[#EF4444] px-[8px] py-[4px] text-[10px] font-bold leading-[15px] text-white">
              {item.badge}
            </span>
          ) : null}

          {item.verified && (
            <span className="inline-flex h-[23px] w-[78.48px] items-center gap-[4px] rounded-[9999px] bg-white px-[8px] py-[4px] text-[10px] font-bold leading-[15px] tracking-normal text-[#111827] shadow-sm">
              <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full bg-[#E41C23]">
                <svg
                  viewBox="0 0 16 16"
                  className="h-[10px] w-[10px]"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M4 8.5 6.5 11 12 5.5"
                    stroke="#FFFFFF"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>

              <span>VERIFIED</span>
            </span>
          )}

        </div>

        {/* FAVOURITE BUTTON */}
        <button
          type="button"
          aria-label="Save property"
          onClick={(event) => {
            event.stopPropagation();
            onFavoriteToggle?.();
          }}
          className="absolute right-[8px] top-[8px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white shadow-sm"
        >
          <HeartIcon active={favorite} />
        </button>
      </div>

      {/* PROPERTY CONTENT */}
      <div className={`flex min-w-0 flex-1 justify-between ${item.context === "institutional" || item.context === "special" ? "relative p-[20px]" : "p-[24px]"}`}>
        {/* ================================================================ */}
        {/* LEFT SIDE                                                        */}
        {/* ================================================================ */}

        <div className={`flex min-w-0 flex-1 flex-col justify-between ${item.context === "institutional" || item.context === "special" ? "h-full" : ""}`}>
          {/* PRICE / TITLE / LOCATION */}
          <div className="min-w-0">
            {item.context === "special" ? (
              <>
                <h4 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[27px] text-[#111827]">{item.title}</h4>
                <div className="mt-[6px] flex items-center gap-[6px] font-['Plus_Jakarta_Sans'] text-[13px] font-normal leading-[19.5px] text-[#6B7280]"><ResultPinIcon /><span className="whitespace-nowrap">{item.location}</span></div>
              </>
            ) : (
              <>
            <div className={item.context === "institutional" || item.context === "auction" ? "flex items-baseline gap-[12px]" : ""}>
              <h3 className="whitespace-nowrap text-[24px] font-extrabold leading-[22px] text-[#111827]">
                {item.priceDisplay || `₹${item.price}`}
              </h3>

              <span className="whitespace-nowrap text-[12px] leading-[18px] text-[#6B7280]">
                {item.rateDisplay || `₹${item.rate}`}
              </span>
            </div>

            <h4 className="mt-[11px] text-[18px] font-bold leading-[20px] text-[#111827]">
              {item.title}
            </h4>

            <div className="mt-[6px] flex w-full items-center gap-[6px] font-['Plus_Jakarta_Sans'] text-[13px] font-normal leading-[19.5px] tracking-normal text-[#6B7280]">
              <ResultPinIcon />

              <span className="whitespace-nowrap">{item.location}</span>
            </div>
              </>
            )}
          </div>

          {/* PROPERTY TAGS */}
          <div className={item.context === "institutional" ? "flex translate-y-[7.5px] flex-wrap items-center gap-x-[24px] gap-y-[8px]" : "mt-10 flex flex-wrap items-center gap-x-[24px] gap-y-[8px]"}>
            {item.context === "auction" ? (
              <>
                <span className="auction-date inline-flex items-center gap-[8px] whitespace-nowrap font-['Inter'] text-[14px] font-medium leading-[20px] tracking-[0] text-[#111827]">
                  <img src="/icons/auction icon.png" alt="" aria-hidden="true" className="h-[16px] w-[16px] object-contain" />
                  {item.auctionDate}
                </span>
                <span className="inline-flex items-center rounded-[6px] bg-[#F9FAFB] px-[14px] py-[8px] font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase leading-[15px] tracking-[0] text-[#4B5563]">
                  E-Auction
                </span>
              </>
            ) : item.tags.map((tag) => (
              <span
                key={tag}
                className={item.context === "special" ? "whitespace-nowrap rounded-[6px] bg-[#F9FAFB] px-[10px] py-[6px] font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase leading-[15px] text-[#4B5563]" : "whitespace-nowrap rounded-[6px] bg-[#F9FAFB] px-[10px] py-[6px] text-[10px] font-semibold uppercase leading-[16px] text-[#6B7280]"}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* ================================================================ */}
        {/* RIGHT SIDE                                                       */}
        {/* ================================================================ */}

        <div className={item.context === "institutional" || item.context === "special" ? "pointer-events-none absolute inset-0 m-0 block" : "ml-[24px] flex shrink-0 flex-col items-end justify-between"}>
          {item.context === "institutional" || item.context === "special" ? (
            <div className="absolute right-[20px] top-[20px] whitespace-nowrap rounded-[8px] bg-[#111827] px-[10px] py-[8px] text-center font-['Plus_Jakarta_Sans'] text-[10px] font-semibold leading-[15px] text-white">
              {item.match}
            </div>
          ) : null}

          {/* OPPORTUNITY METADATA */}
          <div className={item.context === "institutional" ? "absolute left-[20px] right-[20px] top-[112px] flex h-[60px] items-start border-b border-[#F3F4F6] pb-[12px]" : item.context === "special" ? "absolute left-[20px] right-[20px] top-[88px] flex h-[60px] items-start border-b border-[#F3F4F6] pb-[12px]" : "flex h-[43px] items-center gap-[16px] border-b border-[#F3F4F6] pb-[12px]"}>
            {item.context === "auction" ? (
              <>
                <span className="inline-flex items-center gap-[6px] whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-medium leading-[21px] tracking-[0] text-[#111827]">
                  <BedIcon />
                  {item.details}
                </span>
                <span className="inline-flex items-center gap-[6px] whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-medium leading-[21px] tracking-[0.59%] text-[#111827]">
                  <AreaIcon />
                  {item.area}
                </span>
                <div className="whitespace-nowrap rounded-[8px] bg-[#111827] px-[10px] py-[8px] font-['Plus_Jakarta_Sans'] text-[10px] font-semibold leading-[15px] text-white">
                  {item.match}
                </div>
              </>
            ) : item.context === "institutional" ? (
              <div className="mt-2 grid w-full grid-cols-3 gap-4 text-left">
                <div>
                  <div className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold uppercase leading-[16.5px] tracking-[0] text-[#475569CC]">Asset Type</div>
                  <div className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-medium leading-[20px] tracking-[0] text-[#111827]">{item.details}</div>
                </div>
                <div>
                  <div className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold uppercase leading-[16.5px] tracking-[0] text-[#475569CC]">Total Area</div>
                  <div className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-medium leading-[20px] tracking-[0] text-[#111827]">{item.area}</div>
                </div>
                <div>
                  <div className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold uppercase leading-[16.5px] tracking-[0] text-[#475569CC]">Status</div>
                  <div className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-medium leading-[20px] tracking-[0] text-[#111827]">{item.status}</div>
                </div>
              </div>
            ) : item.context === "special" ? (
              <div className="grid w-full grid-cols-4 gap-[24px] text-left">
                <div><div className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold uppercase leading-[16.5px] text-[#475569CC]">Asking Price</div><div className="mt-[3px] whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[36px] tracking-[-0.6px] text-[#111827]">{item.priceDisplay}</div></div>
                <div><div className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold uppercase leading-[16.5px] text-[#475569CC]">Est. Yield</div><div className="mt-[3px] whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-medium leading-[20px] text-[#333333]">{item.yieldDisplay}</div></div>
                <div><div className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold uppercase leading-[16.5px] text-[#475569CC]">Total Area</div><div className="mt-[3px] whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-medium leading-[20px] text-[#111827]">{item.area}</div></div>
                <div><div className="font-['Plus_Jakarta_Sans'] text-[12px] font-semibold uppercase leading-[16.5px] text-[#475569CC]">Status</div><div className="mt-[3px] whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-medium leading-[20px] text-[#111827]">{item.status}</div></div>
              </div>
            ) : (
              <>
                <span className="inline-flex items-center gap-[6px] whitespace-nowrap text-[14px] font-semibold uppercase leading-[16px] text-[#111827]">
                  <BedIcon />
                  {item.details}
                </span>
                <span className="inline-flex items-center gap-[6px] whitespace-nowrap text-[14px] font-semibold uppercase leading-[16px] text-[#111827]">
                  <AreaIcon />
                  {item.area}
                </span>
                <div className="whitespace-nowrap rounded-[8px] bg-[#111827] px-[10px] py-[8px] text-[10px] font-bold text-white">
                  {item.match}
                </div>
              </>
            )}
          </div>

          {item.context === "auction" ? (
            <div className="mt-[16px] flex flex-col items-end gap-[6px] text-right">
              <div className="source-bank-label text-[10px] font-medium uppercase leading-[16px] tracking-[0.6px] text-[#9CA3AF]">Source Bank</div>
              <div className="flex items-center justify-end gap-[8px] font-['Plus_Jakarta_Sans'] text-[14px] font-semibold leading-[20px] text-[#1E293B]"><img src="/icons/sbi bank.png" alt="SBI" className="h-[24px] w-[32px] shrink-0 rounded-[2px] object-contain" />{item.sourceBank}</div>
            </div>
          ) : null}

          {/* ENQUIRE + PHONE BUTTON */}
          <div className={item.context === "institutional" || item.context === "special" ? "pointer-events-auto absolute bottom-[20px] right-[20px] flex items-center gap-[12px]" : "mt-4 flex items-center gap-[12px]"}>
            <button
              type="button"
              onClick={(event) => event.stopPropagation()}
              className={item.context === "auction" ? "cta-red inline-flex h-[48px] items-center justify-center whitespace-nowrap rounded-[10px] px-[22px] font-['Plus_Jakarta_Sans'] text-[14px] font-bold leading-[21px] text-white" : "cta-red inline-flex h-[45px] items-center justify-center whitespace-nowrap rounded-[10px] px-[22px] font-['Plus_Jakarta_Sans'] text-[14px] font-bold leading-[21px] text-white"}
            >
              {item.actionLabel || "Enquire Now"}
            </button>

            <button
              type="button"
              aria-label="Call"
              onClick={(event) => event.stopPropagation()}
              className="inline-flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-[12px] border border-[#E51C23] bg-white text-[#E51C23]"
            >
              <img
                src="/icons/phone.png"
                alt=""
                aria-hidden="true"
                className="h-[16px] w-[16px] object-contain"
              />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ResultTileCard({
  item,
  selected = false,
  favorite = false,
  featuredLayout = false,
  hidePrimaryBadgeWhenVerified = false,
  showVerifiedBadge = true,
  showMatchBadge = true,
  onClick,
  onFavoriteToggle,
}) {
  return (
    <article
        onClick={onClick}
        className={[
          "flex flex-col overflow-hidden border",
          item.context === "auction"
            ? "h-[530px] w-full min-w-0 rounded-[16px] shadow-[0_4px_20px_0_rgba(15,23,42,0.05)] sm:h-[510px]"
            : item.context === "special"
            ? item.title === "Commercial Estate - Debt Resolution"
              ? "h-[585px] w-full min-w-0 rounded-[16px] shadow-[0_4px_20px_0_rgba(15,23,42,0.05)] sm:h-[596px]"
              : "h-[526px] w-full min-w-0 rounded-[16px] shadow-[0_4px_20px_0_rgba(15,23,42,0.05)] sm:h-[537px]"
            : item.context === "institutional"
            ? "h-[510px] w-full min-w-0 rounded-[16px] shadow-[0_4px_20px_0_rgba(15,23,42,0.05)] sm:h-[500.5px]"
            : featuredLayout
            ? "h-[460px] w-full min-w-0 flex-1 rounded-[16px] shadow-[0_4px_20px_0_rgba(15,23,42,0.05)] sm:h-[500.5px]"
            : "h-[460px] rounded-[16px] shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:h-[500.5px]",
          "border-[#E5E7EB] bg-white hover:border-[#FFEBEB] hover:bg-[#FFF9F9] hover:shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
        onClick ? "cursor-pointer" : "",
      ].join(" ")}
    >
      <div className="relative h-[195px] w-full sm:h-[206px]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute left-[8px] top-[8px] flex w-fit flex-col items-start gap-[6px]">
          <div className="flex items-center gap-[6px]">
            {item.badge === "NEW LISTING" ? (
              <span className="inline-flex h-[38px] w-[78.48px] items-center gap-[4px] rounded-[9999px] bg-white px-[8px] py-[4px] text-[10px] font-bold leading-[15px] tracking-normal text-[#111827] shadow-sm">
                <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full bg-[#E41C23]">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-[10px] w-[10px]"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 8.5 6.5 11 12 5.5"
                      stroke="#FFFFFF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="max-w-[38px] whitespace-normal text-center leading-[15px]">
                  NEW LISTING
                </span>
              </span>
            ) : featuredLayout ? (
              <span className="inline-flex h-[23px] w-[79px] items-center justify-center rounded-[9999px] bg-[#EF4444] px-[8px] py-[4px] text-[10px] font-bold leading-[15px] text-white">
                FEATURED
              </span>
            ) : !hidePrimaryBadgeWhenVerified || !item.verified ? (
              <span className="inline-flex h-[23px] w-[71px] items-center justify-center rounded-[9999px] bg-[#EF4444] px-[8px] py-[4px] text-[10px] font-bold leading-[15px] text-white">
                {item.badge}
              </span>
            ) : null}

            {item.verified && showVerifiedBadge && (
              <span className="inline-flex h-[23px] w-[78.48px] items-center gap-[4px] rounded-[9999px] bg-white px-[8px] py-[4px] text-[10px] font-bold leading-[15px] tracking-normal text-[#111827] shadow-sm">
                <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full bg-[#E41C23]">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-[10px] w-[10px]"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 8.5 6.5 11 12 5.5"
                      stroke="#FFFFFF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span>VERIFIED</span>
              </span>
            )}
          </div>

          {showMatchBadge && item.context !== "institutional" && item.context !== "auction" && item.context !== "special" && (
            <span
              className={[
                "inline-flex h-[23px] w-fit items-center justify-center rounded-[9999px] bg-[#111827] px-[12.5px] text-[10px] font-bold leading-[15px] text-white shadow-sm",
                featuredLayout ? "md:hidden" : "",
              ].join(" ")}
            >
              {item.match}
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label="Save property"
          onClick={(event) => {
            event.stopPropagation();
            onFavoriteToggle?.();
          }}
          className="absolute right-[8px] top-[8px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white shadow-sm"
        >
          <HeartIcon active={favorite} />
        </button>
      </div>

    {item.context === "auction" ? (
      <div className="flex h-[315px] flex-1 flex-col bg-white p-[16px] md:hidden">
        <div className="flex items-baseline justify-between"><div className="flex items-baseline gap-[12px]"><div className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold leading-[24px] text-[#111827]">{item.priceDisplay}</div><div className="text-[12px] leading-[18px] text-[#6B7280]">{item.rateDisplay}</div></div><div className="whitespace-nowrap rounded-[6px] bg-[#111827] px-[8px] py-[5px] text-[8px] font-bold text-white">{item.match}</div></div>
        <h4 className="mt-[10px] block min-h-[24px] whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[15px] font-bold leading-[24px] text-[#111827]">{item.title}</h4>
        <div className="mt-[4px] flex items-center gap-[5px] text-[12px] leading-[18px] text-[#6B7280]"><ResultPinIcon /><span>{item.location}</span></div>
        <div className="mt-[20px] flex items-center gap-[18px] border-y border-[#F3E4E4] py-[12px] text-[12px] font-semibold leading-[20px] text-[#111827]"><span className="inline-flex items-center gap-[6px] whitespace-nowrap"><BedIcon />{item.details}</span><span className="inline-flex items-center gap-[6px] whitespace-nowrap"><AreaIcon />{item.area}</span></div>
        <div className="mt-[16px] flex items-center gap-[10px] text-[12px] font-medium leading-[20px] text-[#111827]"><img src="/icons/auction icon.png" alt="" aria-hidden="true" className="h-[16px] w-[16px] object-contain" /><span className="auction-date">{item.auctionDate}</span><span className="rounded-[6px] bg-[#F9FAFB] px-[8px] py-[5px] text-[10px] font-semibold uppercase text-[#475569]">E-Auction</span></div>
        <div className="mt-[16px] flex items-center justify-between"><span className="source-bank-label text-[10px] font-medium uppercase leading-[16px] tracking-[0.6px] text-[#9CA3AF]">Source Bank</span><span className="flex items-center gap-[8px] text-[12px] font-semibold leading-[20px] text-[#111827]"><img src="/icons/sbi bank.png" alt="SBI" className="h-[24px] w-[24px] shrink-0 rounded-[2px] object-contain" />{item.sourceBank}</span></div>
        <div className="mt-auto flex items-center gap-[10px]"><button type="button" onClick={(event) => event.stopPropagation()} className="cta-red inline-flex h-[48px] flex-1 items-center justify-center rounded-[10px] px-[8px] text-[14px] font-bold leading-[20px] text-white">{item.actionLabel}</button><button type="button" aria-label="Call" onClick={(event) => event.stopPropagation()} className="inline-flex h-[48px] w-[40px] shrink-0 items-center justify-center rounded-[10px] border border-[#E51C23] bg-white text-[#E51C23]"><img src="/icons/phone.png" alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" /></button></div>
      </div>
    ) : item.context === "special" ? (
      <div className={item.title === "Commercial Estate - Debt Resolution" ? "flex h-[390px] flex-1 flex-col bg-white p-[16px] md:hidden" : "flex h-[331px] flex-1 flex-col bg-white p-[16px] md:hidden"}>
        <div className="flex items-start justify-between"><div><div className="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold uppercase leading-[16.5px] text-[#475569CC]">Asking Price</div><div className="mt-[3px] font-['Plus_Jakarta_Sans'] text-[22px] font-extrabold leading-[36px] tracking-[-0.6px] text-[#111827]">{item.priceDisplay}</div></div><div className="whitespace-nowrap rounded-[6px] bg-[#111827] px-[8px] py-[5px] text-right font-['Plus_Jakarta_Sans'] text-[8px] font-bold leading-[15px] text-white">{item.match}</div></div>
        <h4 className="mt-[8px] font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[27px] text-[#111827]">{item.title}</h4>
        <div className="mt-[4px] flex items-center gap-[5px] font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[19.5px] text-[#6B7280]"><ResultPinIcon /><span>{item.location}</span></div>
        <div className="mt-[20px] grid grid-cols-3 gap-[10px] border-y border-[#F3F4F6] py-[12px]"><div><div className="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold uppercase leading-[16.5px] text-[#475569CC]">Est. Yield</div><div className="mt-[3px] font-['Plus_Jakarta_Sans'] text-[10px] font-medium leading-[20px] text-[#333333]">{item.yieldDisplay}</div></div><div><div className="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold uppercase leading-[16.5px] text-[#475569CC]">Total Area</div><div className="mt-[3px] font-['Plus_Jakarta_Sans'] text-[10px] font-medium leading-[20px] text-[#111827]">{item.area}</div></div><div><div className="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold uppercase leading-[16.5px] text-[#475569CC]">Status</div><div className="mt-[3px] font-['Plus_Jakarta_Sans'] text-[10px] font-medium leading-[20px] text-[#111827]">{item.status}</div></div></div>
        <div className="mt-[12px] flex items-center gap-[8px]"><span className="inline-flex h-[24px] items-center rounded-[5px] bg-[#F9FAFB] px-[8px] font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase leading-[15px] text-[#4B5563]">Freehold Title</span><span className="inline-flex h-[24px] items-center rounded-[5px] bg-[#F9FAFB] px-[8px] font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase leading-[15px] text-[#4B5563]">RERA Registered</span></div>
        <div className="mt-[16px] flex items-center gap-[10px]"><button type="button" onClick={(event) => event.stopPropagation()} className="cta-red inline-flex h-[48px] flex-1 items-center justify-center rounded-[10px] px-[8px] font-['Plus_Jakarta_Sans'] text-[14px] font-bold leading-[22.5px] text-white">{item.actionLabel}</button><button type="button" aria-label="Call" onClick={(event) => event.stopPropagation()} className="inline-flex h-[48px] w-[40px] shrink-0 items-center justify-center rounded-[10px] border border-[#E51C23] bg-white text-[#E51C23]"><img src="/icons/phone.png" alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" /></button></div>
      </div>
    ) : item.context === "institutional" ? (
      <div className="flex h-[315px] flex-1 flex-col bg-white p-[16px] md:hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold leading-[24px] text-[#111827]">{item.priceDisplay}</div>
            <div className="text-[9px] leading-[14px] text-[#6B7280]">{item.rateDisplay}</div>
          </div>
          <div className="whitespace-nowrap rounded-[6px] bg-[#111827] px-[8px] py-[5px] text-[8px] font-bold text-white">{item.match}</div>
        </div>
        <h4 className="mt-[7px] truncate text-[15px] font-bold leading-[20px] text-[#111827]">{item.title}</h4>
        <div className="mt-[4px] flex items-center gap-[5px] text-[12px] leading-[15px] text-[#6B7280]">
          <ResultPinIcon />
          <span>{item.location}</span>
        </div>
        <div className="mt-[20px] grid grid-cols-3 gap-[10px] border-y border-[#F3F4F6] py-[10px]">
          <div><div className="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold uppercase leading-[16.5px] tracking-[0] text-[#475569CC]">Asset Type</div><div className="mt-[3px] font-['Plus_Jakarta_Sans'] text-[10px] font-medium leading-[20px] tracking-[0] text-[#111827]">Industrial /<br />Warehousing</div></div>
          <div><div className="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold uppercase leading-[16.5px] tracking-[0] text-[#475569CC]">Total Area</div><div className="mt-[3px] font-['Plus_Jakarta_Sans'] text-[10px] font-medium leading-[20px] tracking-[0] text-[#111827]">850,000 sq.ft<br />(Leased)</div></div>
          <div><div className="font-['Plus_Jakarta_Sans'] text-[10px] font-semibold uppercase leading-[16.5px] tracking-[0] text-[#475569CC]">Status</div><div className="mt-[3px] font-['Plus_Jakarta_Sans'] text-[10px] font-medium leading-[20px] tracking-[0] text-[#111827]">98% Occupied<br />Tenants</div></div>
        </div>
        <div className="mt-[12px] flex items-center gap-[8px]">
          {item.tags.map((tag) => <span key={tag} className="inline-flex h-[24px] items-center rounded-[5px] bg-[#F9FAFB] px-[8px] font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase leading-[15px] tracking-[0] text-[#4B5563]">{tag}</span>)}
        </div>
        <div className="mt-auto flex items-center gap-[10px]">
          <button type="button" onClick={(event) => event.stopPropagation()} className="cta-red inline-flex h-[40px] flex-1 items-center justify-center rounded-[10px] px-[8px] text-[12px] font-bold leading-[18px] text-white">{item.actionLabel}</button>
          <button type="button" aria-label="Call" onClick={(event) => event.stopPropagation()} className="inline-flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px] border border-[#E51C23] bg-white text-[#E51C23]"><img src="/icons/phone.png" alt="" aria-hidden="true" className="h-[14px] w-[14px] object-contain" /></button>
        </div>
      </div>
    ) : null}

    <div
  className={[
    "flex flex-1 flex-col",
    item.context === "institutional" || item.context === "auction" ? "hidden md:flex" : "",
    featuredLayout ? "p-[16px] sm:p-[20px]" : "gap-[8px] p-[16px] sm:gap-[12px]",
  ].join(" ")}
>
  {/* PRICE / TITLE / LOCATION */}
  <div
    className={
      featuredLayout
        ? "flex flex-col justify-start"
        : ""
    }
  >
    {/* PRICE + RATE */}
    <div className="flex w-full items-baseline">
      <h3
        className={[
          "whitespace-nowrap font-extrabold text-[#111827]",
          featuredLayout
            ? "text-[18px] leading-[26px] sm:text-[22px] sm:leading-[32px]"
            : "text-[17px] leading-[22px]",
        ].join(" ")}
      >
        {item.priceDisplay || `₹${item.price}`}
      </h3>

      <span
        className={[
          "ml-auto whitespace-nowrap text-[#6B7280]",
          featuredLayout
            ? "text-[12px] leading-[18px]"
            : "text-[12px] leading-[18px]",
        ].join(" ")}
      >
        {item.rateDisplay || `₹${item.rate}`}
      </span>
    </div>

    {/* TITLE */}
    <h4
      className={[
        "font-bold text-[#111827]",
        featuredLayout
          ? "mt-[2px] text-[16px] leading-[24px]"
          : "mt-[6px] text-[15px] leading-[20px]",
      ].join(" ")}
    >
      {item.title}
    </h4>

    {/* LOCATION */}
    <div
      className={[
        "flex w-full items-center gap-[6px] font-['Plus_Jakarta_Sans'] font-normal tracking-normal text-[#6B7280]",
        featuredLayout
          ? "mt-[4px] text-[12px] leading-[18px] sm:text-[13px] sm:leading-[19.5px]"
          : "mt-[6px] text-[13px] leading-[19.5px]",
      ].join(" ")}
    >
      <ResultPinIcon />

      <span className="truncate">
        {item.location}
      </span>
    </div>
  </div>

  {/* BHK / AREA / MATCH */}
  <div
    className={[
      "flex flex-wrap items-center uppercase text-[#111827]",
      featuredLayout
        ? "mt-[16px] min-h-[52px] gap-[12px] border-y border-[#F3F4F6] py-[10px] text-[11px] font-semibold leading-[16px] sm:gap-[16px] sm:text-[14px]"
        : "gap-x-[14px] gap-y-[8px] border-y border-[#F3F4F6] py-[8px] text-[11px] font-semibold leading-[16px]",
    ].join(" ")}
  >
    {/* BHK */}
      <span className="inline-flex items-center gap-[5px] text-[11px] whitespace-nowrap sm:gap-[6px] sm:text-[12px]">
      <BedIcon />
      {item.details}
    </span>

    {/* AREA */}
    <span className="inline-flex items-center gap-[5px] text-[11px] whitespace-nowrap sm:gap-[6px] sm:text-[12px]">
      <AreaIcon />
      {item.area}
    </span>

    {/* MATCH BADGE */}
    <span
      className={[
        "whitespace-nowrap rounded-[8px] bg-[#111827] font-bold normal-case text-white",
        featuredLayout
          ? "px-[8px] py-[6px] text-[9px] sm:px-[10px] sm:py-[8px] sm:text-[10px]"
          : "px-[8px] py-[6px] text-[9px]",
      ].join(" ")}
    >
      {item.match}
    </span>
  </div>

  {/* TAGS */}
  <div
    className={[
      "flex w-full flex-wrap items-start content-start gap-x-[8px] gap-y-[8px]",
      featuredLayout ? "mt-[8px] sm:mt-[12px]" : "mt-[4px] min-h-0 sm:min-h-[64px]",
    ].join(" ")}
  >
    {item.tags.map((tag) => (
      <span
        key={tag}
        className="inline-flex h-[24px] items-center rounded-[6px] bg-[#F9FAFB] px-[8px] text-[9px] font-semibold uppercase leading-[16px] text-[#6B7280] sm:h-[30px] sm:px-[12px] sm:text-[10px]"
      >
        {tag}
      </span>
    ))}
  </div>

  {/* ACTION BUTTONS */}
  <div
    className={[
      "mt-auto flex items-center gap-[10px]",
      featuredLayout
        ? "pt-[10px] sm:pt-[16px]"
        : "",
    ].join(" ")}
  >
    {/* ENQUIRE NOW */}
    <button
      type="button"
      onClick={(event) => event.stopPropagation()}
      className={[
        "cta-red inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-[10px] px-[20px] font-['Plus_Jakarta_Sans'] font-bold leading-[21px] text-white",
        featuredLayout
          ? "h-[38px] text-[13px] sm:h-[48px] sm:text-[14px]"
          : "h-[36px] text-[14px] sm:h-[40px]",
      ].join(" ")}
    >
      {item.actionLabel || "Enquire Now"}
    </button>

    {/* PHONE */}
    <button
      type="button"
      aria-label="Call"
      onClick={(event) => event.stopPropagation()}
      className={[
        "inline-flex shrink-0 items-center justify-center border-2 border-[#E51C23] bg-white text-[#E51C23]",
        featuredLayout
          ? "h-[38px] w-[38px] rounded-[10px] sm:h-[48px] sm:w-[48px] sm:rounded-[12px]"
          : "h-[36px] w-[36px] rounded-[10px] sm:h-[40px] sm:w-[40px]",
      ].join(" ")}
    >
      <img
        src="/icons/phone.png"
        alt=""
        aria-hidden="true"
        className="h-[16px] w-[16px] object-contain"
      />
    </button>
  </div>
</div>
    </article>
  );
}

function PaginationButton({
  children,
  active = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex h-[40px] min-w-[40px] items-center justify-center rounded-[8px] border px-[12px] text-[14px] font-medium leading-none transition",
        active
          ? "border-[#E51C23] bg-[#E51C23] text-white"
          : "border-[#E5E7EB] bg-white text-[#111827] hover:border-slate-300 hover:bg-slate-50",
        disabled ? "cursor-not-allowed opacity-50" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ViewModeButton({
  active = false,
  onClick,
  children,
  label,
  sizeClass = "w-[32px]",
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={[
        "flex h-[32px] items-center justify-center rounded-[6px] transition",
        sizeClass,
        active
          ? "bg-white text-[#E51C23] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
          : "text-[#64748B] hover:bg-slate-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function MapResultCard({
  item,
  favorite = false,
  onClick,
  onFavoriteToggle,
}) {
  return (
    <article
      onClick={onClick}
      className="flex min-w-0 flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
    >
      <div className="relative h-[112px] w-full">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute left-[8px] top-[8px] flex w-fit flex-col items-start gap-[4px]">
          <div className="flex items-center gap-[6px]">
            {item.badge === "NEW LISTING" ? (
              <span className="inline-flex h-[34px] w-[78px] items-center gap-[4px] rounded-[9999px] bg-white px-[8px] py-[4px] text-[10px] font-bold leading-[15px] tracking-normal text-[#111827] shadow-sm">
                <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full bg-[#E41C23]">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-[10px] w-[10px]"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 8.5 6.5 11 12 5.5"
                      stroke="#FFFFFF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span className="max-w-[38px] whitespace-normal text-center leading-[15px]">
                  NEW LISTING
                </span>
              </span>
            ) : item.badge === "FEATURED" ? (
              <span className="inline-flex h-[23px] w-[79px] items-center justify-center rounded-[9999px] bg-[#EF4444] px-[8px] py-[4px] text-[10px] font-bold leading-[15px] text-white">
                FEATURED
              </span>
            ) : item.badge !== "VERIFIED" ? (
              <span className="inline-flex h-[23px] w-[71px] items-center justify-center rounded-[9999px] bg-[#EF4444] px-[8px] py-[4px] text-[10px] font-bold leading-[15px] text-white">
                {item.badge}
              </span>
            ) : null}

            {item.verified && (
              <span className="inline-flex h-[23px] w-[78px] items-center gap-[4px] rounded-[9999px] bg-white px-[8px] py-[4px] text-[10px] font-bold leading-[15px] tracking-normal text-[#111827] shadow-sm">
                <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full bg-[#E41C23]">
                  <svg
                    viewBox="0 0 16 16"
                    className="h-[10px] w-[10px]"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 8.5 6.5 11 12 5.5"
                      stroke="#FFFFFF"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>

                <span>VERIFIED</span>
              </span>
            )}
          </div>

          <span className="inline-flex h-[23px] w-fit items-center justify-center rounded-[9999px] bg-[#111827] px-[10px] py-[4px] text-[10px] font-bold leading-[15px] text-white shadow-sm">
            {item.match}
          </span>
        </div>

        <button
          type="button"
          aria-label="Save property"
          onClick={(event) => {
            event.stopPropagation();
            onFavoriteToggle?.();
          }}
          className="absolute right-[8px] top-[8px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white shadow-sm"
        >
          <HeartIcon active={favorite} />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-[8px] p-[12px]">
        <div className="flex items-baseline justify-between gap-[8px]">
          <h3 className="whitespace-nowrap text-[18px] font-extrabold leading-[24px] text-[#111827]">
            {item.priceDisplay || `₹${item.price}`}
          </h3>

          <span className="whitespace-nowrap text-[11px] leading-[18px] text-[#6B7280]">
            {item.rateDisplay || `₹${item.rate}`}
          </span>
        </div>

        <h4 className="truncate text-[15px] font-bold leading-[20px] text-[#111827]">
          {item.title}
        </h4>

        <div className="flex items-center gap-[6px] font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[18px] tracking-normal text-[#6B7280]">
          <ResultPinIcon />

          <span className="truncate">{item.location}</span>
        </div>

        <div className="flex items-center gap-[10px] border-y border-[#F3F4F6] py-[8px] text-[11px] font-semibold uppercase leading-[16px] text-[#111827]">
          <span className="inline-flex items-center gap-[6px] whitespace-nowrap">
            <BedIcon />
            {item.details}
          </span>

          <span className="inline-flex items-center gap-[6px] whitespace-nowrap">
            <AreaIcon />
            {item.area}
          </span>

          <span className="ml-auto inline-flex h-[23px] items-center justify-center whitespace-nowrap rounded-[9999px] bg-[#111827] px-[10px] text-[10px] font-bold normal-case leading-[15px] text-white shadow-sm">
            {item.match}
          </span>
        </div>

        <div className="flex flex-wrap gap-[8px]">
          {item.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="inline-flex h-[24px] items-center rounded-[6px] bg-[#F9FAFB] px-[8px] text-[9px] font-semibold uppercase leading-[16px] text-[#6B7280]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-[8px] pt-[2px]">
          <button
            type="button"
            onClick={(event) => event.stopPropagation()}
            className="cta-red inline-flex h-[36px] flex-1 items-center justify-center whitespace-nowrap rounded-[10px] px-[16px] font-['Plus_Jakarta_Sans'] text-[13px] font-bold leading-[18px] text-white"
          >
            {item.actionLabel || "Enquire Now"}
          </button>

          <button
            type="button"
            aria-label="Call"
            onClick={(event) => event.stopPropagation()}
            className="inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] border border-[#E51C23] bg-white text-[#E51C23]"
          >
            <img
              src="/icons/phone.png"
              alt=""
              aria-hidden="true"
              className="h-[16px] w-[16px] object-contain"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

function MapPlaceholder() {
  return (
    <div className="relative min-h-[821px] w-full overflow-hidden">
      <div className="relative h-full w-full">
        <img
          src="/images/map image.png"
          alt="Mumbai map"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute left-[18%] top-[24%] rounded-full bg-white px-[10px] py-[4px] text-[12px] font-bold text-[#374151] shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
          ₹1.15 Cr
        </div>

        <div className="absolute left-[28%] top-[42%] rounded-full bg-[#E51C23] px-[12px] py-[4px] text-[12px] font-bold text-white shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
          ₹1.45 Cr
        </div>

        <div className="absolute left-[40%] top-[42%] rounded-full bg-white px-[10px] py-[4px] text-[12px] font-bold text-[#374151] shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
          ₹1.45 Cr
        </div>

        <div className="absolute left-[18%] top-[66%] rounded-full bg-white px-[10px] py-[4px] text-[12px] font-bold text-[#374151] shadow-[0_1px_2px_rgba(0,0,0,0.12)]">
          ₹2.45 Cr
        </div>

        <div className="absolute left-[31%] top-[51%] w-[224px] rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_10px_25px_rgba(0,0,0,0.15)]">
          <div className="flex gap-[8px] p-[8px]">
            <img
              src="/images/1st,4th.png"
              alt=""
              className="h-[48px] w-[56px] rounded-[8px] object-cover"
            />

            <div className="min-w-0 flex-1">
              <div className="text-[12px] font-bold leading-[18px] text-[#111827]">
                ₹4.20 Cr
              </div>
              <div className="truncate text-[11px] font-semibold leading-[16px] text-[#111827]">
                Oberoi Sky City
              </div>
              <div className="truncate text-[10px] leading-[14px] text-[#6B7280]">
                Borivali East, Mumbai
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-[#F3F4F6] px-[8px] py-[6px] text-[10px] font-semibold text-[#E51C23]">
            <span>VIEW DETAILS</span>
            <span className="text-[#E51C23]">&rsaquo;</span>
          </div>
        </div>

        <div className="absolute right-[40px] bottom-[40px] flex h-[153px] w-[40px] flex-col gap-[8px]">
          <div className="flex h-[105px] w-[40px] flex-col overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
            <button
              type="button"
              className="flex h-[52px] w-full items-center justify-center text-[22px] font-light leading-none text-[#64748B]"
              aria-label="Zoom in"
            >
              +
            </button>
            <div className="mx-auto h-px w-full bg-[#F3F4F6]" />
            <button
              type="button"
              className="flex h-[52px] w-full items-center justify-center text-[22px] font-light leading-none text-[#64748B]"
              aria-label="Zoom out"
            >
              −
            </button>
          </div>

        <button
          type="button"
          className="flex h-[40px] w-[40px] items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-white text-[#64748B] shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
          aria-label="Recenter map"
        >
          <img
            src="/images/nav.png"
            alt=""
            aria-hidden="true"
            className="h-[16px] w-[16px] object-contain"
          />
        </button>
        </div>
      </div>
    </div>
  );
}

function parsePriceValue(label) {
  const normalized = label.toLowerCase().replace(/₹|,/g, "").trim();
  const numeric = Number.parseFloat(normalized);

  if (Number.isNaN(numeric)) {
    return 0;
  }

  if (normalized.includes("cr")) {
    return numeric * 10000000;
  }

  if (normalized.includes("lakh")) {
    return numeric * 100000;
  }

  return numeric;
}

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

function PropertiesPage({
  showTopSearchBar = true,
  initialDrawerState,
  renderSidebar,
  heroTitle,
  heroDescription,
  heroAreaLabel = "Mumbai, Andheri West",
  mobileHeroTitle = false,
  hideMobileHeroDescription = false,
  resultContext = "residential",
}) {
  const navigate = useNavigate();
  const results =
    resultContext === "institutional"
      ? propertyResults.map((item, index) => {
          const institutionalContexts = [
            {
              priceDisplay: "₹350 Cr – ₹400 Cr",
              rateDisplay: "Est. Yield: 8.5% - 9%",
              title: "Industrial Warehouse Portfolio",
              location: "Navi Mumbai",
              details: "Industrial / Warehousing",
              area: "850,000 sq.ft (Leased)",
              status: "98% Occupied Tenants",
              match: "89% Match",
            },
            {
              priceDisplay: "₹420 Cr – ₹470 Cr",
              rateDisplay: "Est. Yield: 9% - 9.5%",
              title: "Bangalore Office Park Portfolio",
              location: "Bangalore Outer Ring Road",
              details: "Office Space",
              area: "1,200,000 sq.ft",
              status: "Nearing Completion",
              match: "91% Match",
            },
            {
              priceDisplay: "₹280 Cr – ₹320 Cr",
              rateDisplay: "Est. Yield: 8% - 8.7%",
              title: "Delhi NCR Industrial Portfolio",
              location: "Delhi NCR",
              details: "Industrial / Warehousing",
              area: "750,000 sq.ft (Leased)",
              status: "Entity Level / Asset Sale",
              match: "85% Match",
            },
            {
              priceDisplay: "₹500 Cr – ₹550 Cr",
              rateDisplay: "Est. Yield: 9.2% - 9.8%",
              title: "Chennai IT Corridor Portfolio",
              location: "Chennai IT Corridor",
              details: "Commercial Office",
              area: "1,000,000 sq.ft (Leased)",
              status: "97% Occupied Tenants",
              match: "88% Match",
            },
            {
              priceDisplay: "₹610 Cr – ₹680 Cr",
              rateDisplay: "Est. Yield: 10% - 10.8%",
              title: "Hyderabad Data Center Campus",
              location: "Hyderabad Financial District",
              details: "Data Center",
              area: "620,000 sq.ft (Operational)",
              status: "Fully Commissioned",
              match: "92% Match",
            },
          ];

          return {
          ...item,
          context: "institutional",
          ...institutionalContexts[index % institutionalContexts.length],
          tags: ["PRE-LEASED", "RERA REGISTERED"],
          actionLabel: "Verify & Request Access",
          };
        })
      : resultContext === "special"
        ? propertyResults.map((item, index) => {
            const specialContexts = [
              { priceDisplay: "₹85.5 Cr", yieldDisplay: "11.4% Post Capex", area: "850,000 sq.ft", status: "NCLT Admitted", title: "Industrial Park - NCLT Resolution", location: "Navi Mumbai", match: "89% Match" },
              { priceDisplay: "₹120 Cr", yieldDisplay: "13.2% Post Capex", area: "1,100,000 sq.ft", status: "Resolution Approved", title: "Commercial Estate - Debt Resolution", location: "Pune", match: "87% Match" },
              { priceDisplay: "₹64 Cr", yieldDisplay: "10.8% Post Capex", area: "540,000 sq.ft", status: "NCLT Pending", title: "Logistics Hub - Insolvency Sale", location: "Gurugram", match: "86% Match" },
              { priceDisplay: "₹210 Cr", yieldDisplay: "12.6% Post Capex", area: "1,450,000 sq.ft", status: "Strategic Exit", title: "Tech Campus - Structured Exit", location: "Bengaluru", match: "90% Match" },
              { priceDisplay: "₹42 Cr", yieldDisplay: "9.9% Post Capex", area: "320,000 sq.ft", status: "NCLT Admitted", title: "Warehouse Cluster - Special Sale", location: "Ahmedabad", match: "84% Match" },
            ];

            return {
              ...item,
              context: "special",
              ...specialContexts[index % specialContexts.length],
              tags: ["FREEHOLD TITLE", "RERA REGISTERED"],
              actionLabel: "Verify & Request Access",
            };
          })
      : resultContext === "auction"
        ? propertyResults.map((item, index) => {
            const auctionContexts = [
              {
                priceDisplay: "₹2.1 Cr",
                rateDisplay: "₹22,400/sq.ft",
                title: "Lodha World One",
                location: "Lower Parel, Mumbai - 400013",
                details: "3 BHK",
                area: "1850 sqft",
                match: "95% Match",
                auctionDate: "Auction: Oct 28, 2023 | 11:30 AM",
              },
              {
                priceDisplay: "₹4.8 Cr",
                rateDisplay: "₹19,800/sq.ft",
                title: "DLF Commercial Tower",
                location: "Gurugram, Haryana - 122002",
                details: "Office Space",
                area: "2420 sqft",
                match: "91% Match",
                auctionDate: "Auction: Nov 06, 2023 | 12:00 PM",
              },
              {
                priceDisplay: "₹1.6 Cr",
                rateDisplay: "₹12,500/sq.ft",
                title: "Green Valley Residency",
                location: "Bengaluru, Karnataka - 560103",
                details: "3 BHK",
                area: "1280 sqft",
                match: "88% Match",
                auctionDate: "Auction: Nov 14, 2023 | 10:30 AM",
              },
              {
                priceDisplay: "₹3.2 Cr",
                rateDisplay: "₹15,600/sq.ft",
                title: "Marina Business Centre",
                location: "Chennai, Tamil Nadu - 600018",
                details: "Commercial Office",
                area: "2050 sqft",
                match: "86% Match",
                auctionDate: "Auction: Nov 21, 2023 | 02:00 PM",
              },
              {
                priceDisplay: "₹95 Lakh",
                rateDisplay: "₹8,900/sq.ft",
                title: "Skyline Heights",
                location: "Pune, Maharashtra - 411045",
                details: "2 BHK",
                area: "1065 sqft",
                match: "84% Match",
                auctionDate: "Auction: Nov 29, 2023 | 11:00 AM",
              },
            ];

            return {
              ...item,
              context: "auction",
              ...auctionContexts[index % auctionContexts.length],
              sourceBank: "State Bank of India",
              actionLabel: "Enquire Now",
            };
          })
      : propertyResults;
  const areaLabel = "Mumbai, Andheri West";
  const [minPrice, setMinPrice] = React.useState(18);
  const [maxPrice, setMaxPrice] = React.useState(82);
  const [viewMode, setViewMode] = React.useState("list");
  const [sortValue, setSortValue] = React.useState("relevance");
  const [sortOpen, setSortOpen] = React.useState(false);
  const sortMenuRef = React.useRef(null);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [filtersMounted, setFiltersMounted] = React.useState(false);
  const [filtersEntered, setFiltersEntered] = React.useState(false);
  const [customDrawerState, setCustomDrawerState] = React.useState(() =>
    resolveInitialDrawerState(initialDrawerState),
  );

  // Keep the drawer mounted for the duration of the exit transition instead
  // of yanking it out of the DOM the instant filtersOpen flips false.
  React.useEffect(() => {
    if (filtersOpen) {
      setFiltersMounted(true);
      return undefined;
    }
    setFiltersEntered(false);
    if (!filtersMounted) return undefined;
    const timeout = setTimeout(() => setFiltersMounted(false), 300);
    return () => clearTimeout(timeout);
  }, [filtersOpen, filtersMounted]);

  // Mounting straight into the "open" position skips the enter transition
  // entirely (the browser has no "before" frame to animate from). Flipping
  // to the open classes one frame after mount gives it one.
  React.useEffect(() => {
    if (!filtersMounted || !filtersOpen) return undefined;
    const raf = requestAnimationFrame(() => setFiltersEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [filtersMounted, filtersOpen]);

  // Lock page scroll and allow Escape to close while the drawer is open.
  React.useEffect(() => {
    if (!filtersOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filtersOpen]);
  React.useEffect(() => {
    if (!renderSidebar) return undefined;
    setCustomDrawerState(resolveInitialDrawerState(initialDrawerState));
    return undefined;
  }, [initialDrawerState, renderSidebar]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedPropertyId, setSelectedPropertyId] = React.useState(null);
  const [favoriteIds, setFavoriteIds] = React.useState(
    () =>
      new Set(results.filter((item) => item.favorite).map((item) => item.id)),
  );
  const [selectedBhk, setSelectedBhk] = React.useState(["2 BHK", "3 BHK"]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = React.useState([
    "Apartment",
  ]);
  const [selectedPropertyStatus, setSelectedPropertyStatus] = React.useState([
    "Under Construction",
  ]);
  const [selectedFurnishing, setSelectedFurnishing] = React.useState(["Full"]);
  const [selectedParking, setSelectedParking] = React.useState(["2 Wheeler"]);
  const [verifiedOnly, setVerifiedOnly] = React.useState(true);
  const [reraApproved, setReraApproved] = React.useState(false);
  const [selectedAmenities, setSelectedAmenities] = React.useState([]);

  const toggleSelection = (value, setter) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value],
    );
  };

  const resetFilters = () => {
    setMinPrice(18);
    setMaxPrice(82);
    setViewMode("list");
    setSortValue("relevance");
    setSortOpen(false);
    setCurrentPage(1);
    setSelectedPropertyId(null);
    setFavoriteIds(
      new Set(results.filter((item) => item.favorite).map((item) => item.id)),
    );
    setSelectedBhk(["2 BHK", "3 BHK"]);
    setSelectedPropertyTypes(["Apartment"]);
    setSelectedPropertyStatus(["Under Construction"]);
    setSelectedFurnishing(["Full"]);
    setSelectedParking(["2 Wheeler"]);
    setVerifiedOnly(true);
    setReraApproved(false);
    setSelectedAmenities([]);
  };

  const resetCustomFilters = () => {
    setCustomDrawerState(resolveInitialDrawerState(initialDrawerState));
  };

  React.useEffect(() => {
    const handleDocumentClick = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => document.removeEventListener("mousedown", handleDocumentClick);
  }, []);

  const sortedResults = React.useMemo(() => {
    const nextResults = [...results];

    if (sortValue === "price-low") {
      nextResults.sort(
        (a, b) => parsePriceValue(a.price) - parsePriceValue(b.price),
      );
    } else if (sortValue === "price-high") {
      nextResults.sort(
        (a, b) => parsePriceValue(b.price) - parsePriceValue(a.price),
      );
    }

    return nextResults;
  }, [sortValue]);

  const totalPages = 42;
  const itemsPerPage = 5;

  const pagedResults = React.useMemo(() => {
    if (sortedResults.length === 0) {
      return [];
    }

    const startIndex = (currentPage - 1) * itemsPerPage;

    return Array.from({ length: itemsPerPage }, (_, index) => {
      const absoluteIndex = startIndex + index;
      const source = sortedResults[absoluteIndex % sortedResults.length];
      const cycle = Math.floor(absoluteIndex / sortedResults.length);

      return {
        ...source,
        id: `${source.id}-${currentPage}-${cycle}-${index}`,
        // The synthetic `id` above only exists to keep React keys/selection
        // unique across repeated cycles of the same 5 mock records - detail
        // page links need the real underlying property id, not that.
        detailId: source.id,
      };
    });
  }, [currentPage, sortedResults]);

  const goToPage = (pageNumber) => {
    const nextPage = Math.min(Math.max(pageNumber, 1), totalPages);
    setCurrentPage(nextPage);
    setSelectedPropertyId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = (propertyId) => {
    setFavoriteIds((current) => {
      const next = new Set(current);

      if (next.has(propertyId)) {
        next.delete(propertyId);
      } else {
        next.add(propertyId);
      }

      return next;
    });
  };

  const sortLabel =
    sortValue === "price-low"
      ? "Price: Low to High"
      : sortValue === "price-high"
        ? "Price: High to Low"
        : "Relevance";
  const isPriceSort = sortValue === "price-low" || sortValue === "price-high";

  return (
    <main className="min-h-screen w-full bg-white text-[#0F172A]">
      <div className="flex min-h-screen w-full flex-col bg-white">
        {/* HEADER */}
        <SiteHeader />

        {/* ------------------------------------------------------------------ */}
        {/* TOP SEARCH BAR                                                     */}
        {/* ------------------------------------------------------------------ */}

        {heroTitle && heroDescription && (
          <HeroSearchSection
            title={heroTitle}
            description={heroDescription}
            areaLabel={heroAreaLabel}
            filtersOpen={filtersOpen}
            onToggleFilters={() => setFiltersOpen((current) => !current)}
            mobileTitleStyle={mobileHeroTitle}
            hideMobileDescription={hideMobileHeroDescription}
          />
        )}

        {showTopSearchBar && !heroTitle && !heroDescription && (
          <section className="w-full border-b border-[#E5E7EB] bg-white">
            <div className="flex min-h-[77px] w-full items-center px-4 py-4 sm:px-6 lg:px-8 xl:px-12">
              <SearchControlsRow
                areaLabel={areaLabel}
                filtersOpen={filtersOpen}
                onToggleFilters={() => setFiltersOpen((current) => !current)}
              />
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* MAIN RESULTS                                                       */}
        {/* ------------------------------------------------------------------ */}

        <div className="w-full flex-1 bg-white">
          <div
            className={[
              "w-full pb-[40px]",
              viewMode === "map"
                ? "mx-0 max-w-none pl-0 pr-4 pt-[0px] sm:pr-6 lg:pr-8 xl:pr-[9px]"
                : "mx-auto max-w-[1440px] px-4 pt-[32px] sm:px-6 lg:px-8 xl:px-[9px]",
            ].join(" ")}
          >
            <div className="flex w-full flex-col gap-6">
              {/* ============================================================ */}
              {/* FILTERS DRAWER                                               */}
              {/* ============================================================ */}

              {filtersMounted && (
                <div className="fixed inset-0 z-[100]">
                  <button
                    type="button"
                    aria-label="Close filters"
                    onClick={() => setFiltersOpen(false)}
                    className={[
                      "absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ease-out",
                      filtersOpen && filtersEntered
                        ? "opacity-100"
                        : "opacity-0",
                    ].join(" ")}
                  />

                  <aside
                    id="results-filters"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="results-filters-title"
                    className={[
                      "fixed inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-[#E5E7EB] bg-white shadow-[-20px_0_60px_-24px_rgba(15,23,42,0.35)] transition-transform duration-300 ease-out",
                      filtersOpen && filtersEntered
                        ? "translate-x-0"
                        : "translate-x-full",
                    ].join(" ")}
                  >
                    {renderSidebar ? (
                      renderSidebar({
                        drawerState: customDrawerState,
                        setDrawerState: setCustomDrawerState,
                        resetFilters: resetCustomFilters,
                        onClose: () => setFiltersOpen(false),
                      })
                    ) : (
                      <>
                        <div className="flex w-full shrink-0 items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
                          <h2
                            id="results-filters-title"
                            className="text-[16px] font-bold leading-[20px]"
                          >
                            Filters
                          </h2>

                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={resetFilters}
                              className="text-[12px] font-medium text-[#E51C23]"
                            >
                              Reset All
                            </button>

                            <button
                              type="button"
                              aria-label="Close filters"
                              onClick={() => setFiltersOpen(false)}
                              className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
                            >
                              <CloseIcon />
                            </button>
                          </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-5 py-5">
                          <div className="flex flex-col gap-[24px]">
                            {/* PRICE */}
                            <SidebarSection title="Price Range">
                              <PriceRangeSlider
                                minValue={minPrice}
                                maxValue={maxPrice}
                                onMinChange={setMinPrice}
                                onMaxChange={setMaxPrice}
                              />
                            </SidebarSection>

                            {/* BHK */}
                            <SidebarSection title="BHK Type">
                              <div className="flex flex-wrap gap-[8px]">
                                {[
                                  "1 BHK",
                                  "2 BHK",
                                  "3 BHK",
                                  "4 BHK",
                                  "5+ BHK",
                                ].map((label) => (
                                  <PillButton
                                    key={label}
                                    label={label}
                                    active={selectedBhk.includes(label)}
                                    onClick={() =>
                                      toggleSelection(label, setSelectedBhk)
                                    }
                                  />
                                ))}
                              </div>
                            </SidebarSection>

                            {/* PROPERTY TYPE */}
                            <SidebarSection title="Property Type">
                              <div className="flex flex-col gap-[8px]">
                                <CheckboxItem
                                  label="Apartment"
                                  checked={selectedPropertyTypes.includes(
                                    "Apartment",
                                  )}
                                  onClick={() =>
                                    toggleSelection(
                                      "Apartment",
                                      setSelectedPropertyTypes,
                                    )
                                  }
                                />

                                <CheckboxItem
                                  label="Independent House/Villa"
                                  checked={selectedPropertyTypes.includes(
                                    "Independent House/Villa",
                                  )}
                                  onClick={() =>
                                    toggleSelection(
                                      "Independent House/Villa",
                                      setSelectedPropertyTypes,
                                    )
                                  }
                                />

                                <CheckboxItem
                                  label="Plots"
                                  checked={selectedPropertyTypes.includes(
                                    "Plots",
                                  )}
                                  onClick={() =>
                                    toggleSelection(
                                      "Plots",
                                      setSelectedPropertyTypes,
                                    )
                                  }
                                />
                              </div>
                            </SidebarSection>

                            {/* STATUS */}
                            <SidebarSection title="Property Status">
                              <div className="flex flex-col gap-[8px]">
                                <CheckboxItem
                                  label="Under Construction"
                                  checked={selectedPropertyStatus.includes(
                                    "Under Construction",
                                  )}
                                  onClick={() =>
                                    toggleSelection(
                                      "Under Construction",
                                      setSelectedPropertyStatus,
                                    )
                                  }
                                />

                                <CheckboxItem
                                  label="Ready"
                                  checked={selectedPropertyStatus.includes(
                                    "Ready",
                                  )}
                                  onClick={() =>
                                    toggleSelection(
                                      "Ready",
                                      setSelectedPropertyStatus,
                                    )
                                  }
                                />
                              </div>
                            </SidebarSection>

                            {/* FURNISHING */}
                            <SidebarSection title="Furnishing">
                              <div className="flex flex-wrap items-center gap-[12px]">
                                <CheckboxItem
                                  label="Full"
                                  checked={selectedFurnishing.includes("Full")}
                                  onClick={() =>
                                    toggleSelection(
                                      "Full",
                                      setSelectedFurnishing,
                                    )
                                  }
                                />

                                <CheckboxItem
                                  label="Semi"
                                  checked={selectedFurnishing.includes("Semi")}
                                  onClick={() =>
                                    toggleSelection(
                                      "Semi",
                                      setSelectedFurnishing,
                                    )
                                  }
                                />

                                <CheckboxItem
                                  label="None"
                                  checked={selectedFurnishing.includes("None")}
                                  onClick={() =>
                                    toggleSelection(
                                      "None",
                                      setSelectedFurnishing,
                                    )
                                  }
                                />
                              </div>
                            </SidebarSection>

                            {/* PARKING */}
                            <SidebarSection title="Parking">
                              <div className="flex flex-wrap items-center gap-[12px]">
                                <CheckboxItem
                                  label="2 Wheeler"
                                  checked={selectedParking.includes(
                                    "2 Wheeler",
                                  )}
                                  onClick={() =>
                                    toggleSelection(
                                      "2 Wheeler",
                                      setSelectedParking,
                                    )
                                  }
                                />

                                <CheckboxItem
                                  label="4 Wheeler"
                                  checked={selectedParking.includes(
                                    "4 Wheeler",
                                  )}
                                  onClick={() =>
                                    toggleSelection(
                                      "4 Wheeler",
                                      setSelectedParking,
                                    )
                                  }
                                />

                                <CheckboxItem
                                  label="None"
                                  checked={selectedParking.includes("None")}
                                  onClick={() =>
                                    toggleSelection("None", setSelectedParking)
                                  }
                                />
                              </div>
                            </SidebarSection>

                            <div className="flex h-[74px] w-full flex-col gap-4 border-t border-[#F3F4F6] pt-4">
                              <div className="flex w-full items-center justify-between">
                                <span className="text-[14px] font-semibold text-[#111827]">
                                  Verified Only
                                </span>

                                <Toggle
                                  on={verifiedOnly}
                                  onClick={() =>
                                    setVerifiedOnly((current) => !current)
                                  }
                                />
                              </div>

                              <div className="flex w-full items-center justify-between">
                                <span className="text-[14px] font-semibold text-[#111827]">
                                  RERA Approved
                                </span>

                                <Toggle
                                  on={reraApproved}
                                  onClick={() =>
                                    setReraApproved((current) => !current)
                                  }
                                />
                              </div>
                            </div>

                            {/* AMENITIES */}
                            <SidebarSection title="Amenities">
                              <div className="flex flex-wrap gap-[8px]">
                                {["Gym", "Pool", "Park", "Clubhouse"].map(
                                  (item) => (
                                    <AmenityChip
                                      key={item}
                                      label={item}
                                      active={selectedAmenities.includes(item)}
                                      onClick={() =>
                                        toggleSelection(
                                          item,
                                          setSelectedAmenities,
                                        )
                                      }
                                    />
                                  ),
                                )}
                              </div>
                            </SidebarSection>
                          </div>
                        </div>

                        <div className="shrink-0 border-t border-[#F3F4F6] px-5 py-4">
                          <button
                            type="button"
                            onClick={() => setFiltersOpen(false)}
                            className="cta-red inline-flex h-[46px] w-full items-center justify-center rounded-[12px] text-[14px] font-bold text-white"
                          >
                            Show Results
                          </button>
                        </div>
                      </>
                    )}
                  </aside>
                </div>
              )}

              {/* ============================================================ */}
              {/* RIGHT PROPERTY RESULTS                                       */}
              {/* ============================================================ */}

              <section className="w-full min-w-0">
                {/* RESULTS HEADER */}
                <div className="flex w-full items-start justify-between gap-3 md:gap-6">
                  {viewMode !== "map" && (
                    <div className="min-w-0 shrink-0 md:w-[258.98px]">
                      <h1 className="font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold leading-[27px] text-[#111827] md:text-[20px] md:font-semibold md:leading-[30px]">
                        1,245 Properties in Mumbai
                      </h1>

                      <p className="font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[18px] tracking-[0] text-[#6B7280] md:font-['Lato'] md:text-[14px] md:leading-[21px] md:tracking-[-0.49%]">
                        Properties for Sale in Andheri West
                      </p>
                    </div>
                  )}

                  {viewMode !== "map" && (
                    <div
                      className={[
                        "hidden h-10 shrink-0 items-center gap-4 md:flex",
                        isPriceSort ? "w-[325.5px]" : "w-[300.5px]",
                      ].join(" ")}
                    >
                      {/* SORT */}
                      <div
                        ref={sortMenuRef}
                        className={[
                          "relative flex h-[38px] items-center gap-1 rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-1",
                          isPriceSort ? "w-[195.5px]" : "w-[170.5px]",
                        ].join(" ")}
                      >
                        <span className="inline-flex h-[18px] w-[54px] items-center justify-center font-['Lato'] text-[12px] font-bold leading-[18px] text-[#475569]">
                          Sort By:
                        </span>

                        <button
                          type="button"
                          aria-haspopup="listbox"
                          aria-expanded={sortOpen}
                          onClick={() => setSortOpen((current) => !current)}
                          className={[
                            "flex h-[30px] items-center justify-between rounded-[6px] bg-white px-[10px] py-[6px] shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]",
                            isPriceSort ? "w-[129.5px]" : "w-[104.5px]",
                          ].join(" ")}
                        >
                          <span className="whitespace-nowrap font-['Lato'] text-[12px] font-bold leading-[18px] text-[#111827]">
                            {sortLabel}
                          </span>

                          <span className="flex h-[10px] w-[12.5px] items-center justify-center px-[1px] py-[2px]">
                            <svg
                              viewBox="0 0 11 7"
                              className="h-[6px] w-[10.5px]"
                              fill="none"
                            >
                              <path
                                d="M1 1.25 5.5 5.75 10 1.25"
                                stroke="#111827"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </button>

                        {sortOpen && (
                          <div
                            className={[
                              "absolute right-0 top-[calc(100%+8px)] z-20 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white shadow-lg",
                              isPriceSort ? "w-[195.5px]" : "w-[170.5px]",
                            ].join(" ")}
                          >
                            {[
                              { label: "Relevance", value: "relevance" },
                              {
                                label: "Price: Low to High",
                                value: "price-low",
                              },
                              {
                                label: "Price: High to Low",
                                value: "price-high",
                              },
                            ].map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                  setSortValue(option.value);
                                  setSortOpen(false);
                                }}
                                className={[
                                  "flex w-full items-center px-[12px] py-[10px] text-left text-[12px] font-semibold text-[#111827] hover:bg-slate-50",
                                  sortValue === option.value
                                    ? "bg-[#FFF5F5] text-[#E51C23]"
                                    : "",
                                ].join(" ")}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* VIEW SWITCHER */}
                      <div className="flex h-[40px] w-[114px] items-center gap-1 rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-1">
                        {/* LIST */}
                        <ViewModeButton
                          label="List view"
                          active={viewMode === "list"}
                          onClick={() => setViewMode("list")}
                          sizeClass="w-[32px]"
                        >
                          <img
                            src="/icons/SVG%20(2).png"
                            alt=""
                            aria-hidden="true"
                            className="relative top-[0.5px] h-[13px] w-[15.5px] object-contain"
                            style={{
                              filter:
                                viewMode === "list"
                                  ? "none"
                                  : "grayscale(1) brightness(0.55)",
                            }}
                          />
                        </ViewModeButton>

                        {/* TILE */}
                        <ViewModeButton
                          label="Tile view"
                          active={viewMode === "tile"}
                          onClick={() => setViewMode("tile")}
                          sizeClass="w-[32px]"
                        >
                          <img
                            src="/icons/SVG%20(1).png"
                            alt=""
                            aria-hidden="true"
                            className="h-[14px] w-[16px] object-contain"
                            style={{
                              filter:
                                viewMode === "tile"
                                  ? "brightness(0) saturate(100%) invert(15%) sepia(95%) saturate(7342%) hue-rotate(351deg) brightness(95%) contrast(105%)"
                                  : "none",
                            }}
                          />
                        </ViewModeButton>

                        {/* MAP */}
                        <ViewModeButton
                          label="Map view"
                          active={viewMode === "map"}
                          onClick={() => setViewMode("map")}
                          sizeClass="w-[34px]"
                        >
                          <img
                            src="/icons/SVG.png"
                            alt=""
                            aria-hidden="true"
                            className="h-[15.763724327087402px] w-[18px] object-contain"
                            style={{
                              filter:
                                viewMode === "map"
                                  ? "brightness(0) saturate(100%) invert(15%) sepia(95%) saturate(7342%) hue-rotate(351deg) brightness(95%) contrast(105%)"
                                  : "none",
                            }}
                          />
                        </ViewModeButton>
                      </div>
                    </div>
                  )}

                  {viewMode !== "map" && (
                    <button
                      type="button"
                      aria-label="Sort properties"
                      onClick={() => setSortOpen((current) => !current)}
                      className="inline-flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#111827] text-white md:hidden"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        aria-hidden="true"
                      >
                        {/* Down arrow */}
                        <path
                          d="M7 9v11m0 0-3-3m3 3 3-3"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        {/* Up arrow */}
                        <path
                          d="M16 15V6m0 0-3 3m3-3 3 3"
                          stroke="currentColor"
                          strokeWidth="2.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {viewMode === "list" && (
                  <>
                    <div className="mt-[20px] flex w-full flex-col gap-[12px] md:hidden">
                      {pagedResults.map((item, index) => (
                        <ResultTileCard
                          key={`mobile-${item.id}`}
                          item={item}
                          featuredLayout={index === 0}
                          hidePrimaryBadgeWhenVerified
                          selected={selectedPropertyId === item.id}
                          favorite={favoriteIds.has(item.id)}
                          onClick={() => {
                            window.scrollTo(0, 0);
                            navigate(buildPropertyDetailPath(item), {
                              state: { property: item },
                            });
                          }}
                          onFavoriteToggle={() => toggleFavorite(item.id)}
                        />
                      ))}
                    </div>
                    {/* PROPERTY LIST */}
                    <div className="mt-[24px] hidden w-full flex-col gap-[12px] md:flex">
                      {pagedResults.map((item) => (
                        <ResultCard
                          key={item.id}
                          item={item}
                          selected={selectedPropertyId === item.id}
                          favorite={favoriteIds.has(item.id)}
                          onClick={() => {
                            window.scrollTo(0, 0);
                            navigate(buildPropertyDetailPath(item), {
                              state: { property: item },
                            });
                          }}
                          onFavoriteToggle={() => toggleFavorite(item.id)}
                        />
                      ))}
                    </div>
                  </>
                )}

                {viewMode === "tile" && (
                  <>
                    {/* PROPERTY TILES */}
                    <div className="mx-auto w-full max-w-[1440px] xl:px-[9px]">
                      <div className="mt-[24px] flex w-full gap-[16px] overflow-x-auto pb-[2px]">
                        {pagedResults.slice(0, 2).map((item) => (
                          <ResultTileCard
                            key={item.id}
                            item={item}
                            featuredLayout
                            hidePrimaryBadgeWhenVerified
                            selected={selectedPropertyId === item.id}
                            favorite={favoriteIds.has(item.id)}
                            onClick={() => {
                              window.scrollTo(0, 0);
                              navigate(buildPropertyDetailPath(item), {
                                state: { property: item },
                              });
                            }}
                            onFavoriteToggle={() => toggleFavorite(item.id)}
                          />
                        ))}
                      </div>
                    </div>

                    {pagedResults.length > 2 && (
                      <div className="mt-[16px] grid w-full grid-cols-1 gap-[16px] sm:grid-cols-2 xl:grid-cols-3">
                        {pagedResults.slice(2).map((item) => (
                          <ResultTileCard
                            key={item.id}
                            item={item}
                            hidePrimaryBadgeWhenVerified
                            selected={selectedPropertyId === item.id}
                            favorite={favoriteIds.has(item.id)}
                            onClick={() => {
                              window.scrollTo(0, 0);
                              navigate(buildPropertyDetailPath(item), {
                                state: { property: item },
                              });
                            }}
                            onFavoriteToggle={() => toggleFavorite(item.id)}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}

                {viewMode === "map" && (
                  <>
                    {/* MAP VIEW */}
                    <div className="grid w-full grid-cols-1 gap-[16px] xl:grid-cols-[minmax(0,1fr)_588px]">
                      <MapPlaceholder />

                      <div className="flex min-w-0 w-full max-w-[570px] justify-self-end flex-col gap-[16px] py-[24px] xl:pr-[9px]">
                        <div className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] pb-[12px]">
                          <div>
                            <h2 className="text-[20px] font-semibold leading-[30px] text-[#111827]">
                              1,245 Properties
                            </h2>

                            <p className="font-['Lato'] text-[14px] font-normal leading-[21px] tracking-[-0.49%] text-[#6B7280]">
                              Showing residential flats for sale in Mumbai
                            </p>
                          </div>

                          <div className="flex h-[40px] w-[114px] items-center gap-1 rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-1">
                            <ViewModeButton
                              label="List view"
                              active={viewMode === "list"}
                              onClick={() => setViewMode("list")}
                              sizeClass="w-[32px]"
                            >
                              <img
                                src="/icons/SVG%20(2).png"
                                alt=""
                                aria-hidden="true"
                                className="relative top-[0.5px] h-[13px] w-[15.5px] object-contain"
                                style={{
                                  filter:
                                    viewMode === "list"
                                      ? "none"
                                      : "grayscale(1) brightness(0.55)",
                                }}
                              />
                            </ViewModeButton>

                            <ViewModeButton
                              label="Tile view"
                              active={viewMode === "tile"}
                              onClick={() => setViewMode("tile")}
                              sizeClass="w-[32px]"
                            >
                              <img
                                src="/icons/SVG%20(1).png"
                                alt=""
                                aria-hidden="true"
                                className="h-[14px] w-[16px] object-contain"
                                style={{
                                  filter:
                                    viewMode === "tile"
                                      ? "brightness(0) saturate(100%) invert(15%) sepia(95%) saturate(7342%) hue-rotate(351deg) brightness(95%) contrast(105%)"
                                      : "none",
                                }}
                              />
                            </ViewModeButton>

                            <ViewModeButton
                              label="Map view"
                              active={viewMode === "map"}
                              onClick={() => setViewMode("map")}
                              sizeClass="w-[34px]"
                            >
                              <img
                                src="/icons/SVG.png"
                                alt=""
                                aria-hidden="true"
                                className="h-[15.763724327087402px] w-[18px] object-contain"
                                style={{
                                  filter:
                                    viewMode === "map"
                                      ? "brightness(0) saturate(100%) invert(15%) sepia(95%) saturate(7342%) hue-rotate(351deg) brightness(95%) contrast(105%)"
                                      : "none",
                                }}
                              />
                            </ViewModeButton>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-[12px] sm:grid-cols-2">
                          {pagedResults.slice(0, 4).map((item) => (
                            <MapResultCard
                              key={item.id}
                              item={item}
                              favorite={favoriteIds.has(item.id)}
                              onClick={() => {
                                window.scrollTo(0, 0);
                                navigate(buildPropertyDetailPath(item), {
                                  state: { property: item },
                                });
                              }}
                              onFavoriteToggle={() => toggleFavorite(item.id)}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* PAGINATION */}
                <div className="mt-[32px] flex justify-center">
                  <div className="flex flex-wrap items-center justify-center gap-[8px]">
                    <PaginationButton
                      disabled={currentPage === 1}
                      onClick={() => goToPage(currentPage - 1)}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M12.5 4.75 7.25 10l5.25 5.25"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </PaginationButton>

                    <PaginationButton
                      active={currentPage === 1}
                      onClick={() => goToPage(1)}
                    >
                      1
                    </PaginationButton>

                    <PaginationButton
                      active={currentPage === 2}
                      onClick={() => goToPage(2)}
                    >
                      2
                    </PaginationButton>

                    <PaginationButton
                      active={currentPage === 3}
                      onClick={() => goToPage(3)}
                    >
                      3
                    </PaginationButton>

                    <span className="inline-flex h-[24px] min-w-[29.34px] items-center justify-center px-[8px] text-[14px] leading-none text-[#94A3B8]">
                      ...
                    </span>

                    <PaginationButton
                      active={currentPage === 42}
                      onClick={() => goToPage(42)}
                    >
                      42
                    </PaginationButton>

                    <PaginationButton
                      disabled={currentPage === totalPages}
                      onClick={() => goToPage(currentPage + 1)}
                    >
                      <svg
                        viewBox="0 0 20 20"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        aria-hidden="true"
                      >
                        <path
                          d="M7.5 4.75 12.75 10l-5.25 5.25"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </PaginationButton>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <CompanyFooterSection />
      </div>
    </main>
  );
}

export default PropertiesPage;
