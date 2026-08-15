import React from "react";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import SiteHeader from "../components/SiteHeader";

/* -------------------------------------------------------------------------- */
/*                                   ICONS                                    */
/* -------------------------------------------------------------------------- */

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4"
      fill="none"
    >
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

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0 text-[#6B7280]"
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
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-[12px] w-[12px] shrink-0 text-[#94A3B8]"
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

function BedIcon() {
  return (
    <img
      src="/images/bhk.png"
      alt=""
      aria-hidden="true"
      className="h-[13px] w-[13px] shrink-0 object-contain"
    />
  );
}

function AreaIcon() {
  return (
    <img
      src="/images/Vector.png"
      alt=""
      aria-hidden="true"
      className="h-[12px] w-[12px] shrink-0 object-contain"
    />
  );
}

function HeartIcon({ filled = false }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[16px] w-[16px]"
      fill={filled ? "#E51C23" : "none"}
    >
      <path
        d="M12 21s-7-4.4-9.2-8.9C1 9.2 2.4 5.9 5.8 5.1c1.8-.4 3.5.3 4.6 1.7 1.1-1.4 2.8-2.1 4.6-1.7 3.4.8 4.8 4.1 3 7-.1.2-.2.4-.3.6"
        stroke={filled ? "#E51C23" : "#6B7280"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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
          <svg
            viewBox="0 0 12 12"
            className="h-[10px] w-[10px]"
            fill="none"
          >
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

function ResultCard({ item }) {
  return (
    <article className="flex w-full flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] lg:flex-row">
      <div className="relative h-[168px] w-full shrink-0 lg:h-[168px] lg:w-[240px] xl:w-[250px]">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute left-[8px] top-[8px] flex items-center gap-[6px]">
          <span className="rounded-[6px] bg-[#E51C23] px-[8px] py-[4px] text-[10px] font-bold leading-none text-white">
            {item.badge}
          </span>

          {item.verified && (
            <span className="rounded-[6px] bg-white px-[8px] py-[4px] text-[10px] font-bold leading-none text-[#111827] shadow-sm">
              VERIFIED
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label="Save property"
          className="absolute right-[8px] top-[8px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white shadow-sm"
        >
          <HeartIcon filled={item.favorite} />
        </button>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-[14px] p-[16px] lg:p-[18px]">
        <div className="flex flex-col gap-[12px] xl:flex-row xl:items-start xl:justify-between xl:gap-[16px]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-[8px] gap-y-[4px]">
              <h3 className="text-[18px] font-extrabold leading-[22px] text-[#111827]">
                ₹{item.price}
              </h3>

              <span className="text-[12px] leading-[18px] text-[#6B7280]">
                ₹{item.rate}
              </span>
            </div>

            <h4 className="mt-[6px] text-[16px] font-bold leading-[20px] text-[#111827]">
              {item.title}
            </h4>

            <div className="mt-[6px] flex items-center gap-[6px] text-[12px] leading-[18px] text-[#6B7280]">
              <ResultPinIcon />
              <span className="truncate">{item.location}</span>
            </div>
          </div>

          <div className="flex shrink-0 items-start gap-[10px]">
            <div className="rounded-[8px] bg-[#111827] px-[10px] py-[8px] text-[10px] font-bold text-white">
              {item.match}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-[24px] gap-y-[10px] text-[12px] font-semibold uppercase leading-[16px] text-[#6B7280]">
          <span className="inline-flex items-center gap-[6px]">
            <BedIcon />
            {item.details}
          </span>

          <span className="inline-flex items-center gap-[6px]">
            <AreaIcon />
            {item.area}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-[8px]">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[6px] bg-[#F8FAFC] px-[10px] py-[6px] text-[10px] font-semibold uppercase leading-none text-[#6B7280]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-[12px] sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            className="inline-flex h-[42px] items-center justify-center rounded-[10px] bg-[#E51C23] px-[22px] text-[14px] font-bold text-white"
          >
            Enquire Now
          </button>

          <button
            type="button"
            aria-label="Call"
            className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#FCA5A5] bg-white text-[#E51C23]"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
              <path
                d="M8.5 5.5 10 8c.3.6.2 1.3-.2 1.8l-1.2 1.2c1.2 2.3 2.9 4 5.2 5.2l1.2-1.2c.5-.4 1.2-.5 1.8-.2l2.5 1.5c.7.4 1 1.3.7 2-1.1 2.5-4 3.6-6.4 2.6-4.2-1.7-7.6-5.1-9.3-9.3-1-2.4.1-5.3 2.6-6.4.7-.3 1.6 0 2 .7Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

function ResultTileCard({ item }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[14px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)]">
      <div className="relative h-[180px] w-full">
        <img
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />

        <div className="absolute left-[8px] top-[8px] flex items-center gap-[6px]">
          <span className="rounded-[6px] bg-[#E51C23] px-[8px] py-[4px] text-[10px] font-bold leading-none text-white">
            {item.badge}
          </span>

          {item.verified && (
            <span className="rounded-[6px] bg-white px-[8px] py-[4px] text-[10px] font-bold leading-none text-[#111827] shadow-sm">
              VERIFIED
            </span>
          )}
        </div>

        <button
          type="button"
          aria-label="Save property"
          className="absolute right-[8px] top-[8px] flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white shadow-sm"
        >
          <HeartIcon filled={item.favorite} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-[12px] p-[16px]">
        <div>
          <div className="flex items-baseline gap-[8px]">
            <h3 className="text-[17px] font-extrabold leading-[22px] text-[#111827]">
              ₹{item.price}
            </h3>

            <span className="text-[12px] leading-[18px] text-[#6B7280]">
              ₹{item.rate}
            </span>
          </div>

          <h4 className="mt-[6px] text-[15px] font-bold leading-[20px] text-[#111827]">
            {item.title}
          </h4>

          <div className="mt-[6px] flex items-center gap-[6px] text-[12px] leading-[18px] text-[#6B7280]">
            <ResultPinIcon />
            <span className="truncate">{item.location}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-[14px] gap-y-[8px] text-[11px] font-semibold uppercase leading-[16px] text-[#6B7280]">
          <span className="inline-flex items-center gap-[6px]">
            <BedIcon />
            {item.details}
          </span>

          <span className="inline-flex items-center gap-[6px]">
            <AreaIcon />
            {item.area}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-[8px]">
          {item.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-[6px] bg-[#F8FAFC] px-[10px] py-[6px] text-[10px] font-semibold uppercase leading-none text-[#6B7280]"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-[10px]">
          <button
            type="button"
            className="inline-flex h-[40px] flex-1 items-center justify-center rounded-[10px] bg-[#E51C23] px-[20px] text-[14px] font-bold text-white"
          >
            Enquire Now
          </button>

          <button
            type="button"
            aria-label="Call"
            className="inline-flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-[#FCA5A5] bg-white text-[#E51C23]"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none">
              <path
                d="M8.5 5.5 10 8c.3.6.2 1.3-.2 1.8l-1.2 1.2c1.2 2.3 2.9 4 5.2 5.2l1.2-1.2c.5-.4 1.2-.5 1.8-.2l2.5 1.5c.7.4 1 1.3.7 2-1.1 2.5-4 3.6-6.4 2.6-4.2-1.7-7.6-5.1-9.3-9.3-1-2.4.1-5.3 2.6-6.4.7-.3 1.6 0 2 .7Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}

function PaginationButton({ children, active = false, disabled = false }) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={[
        "inline-flex h-10 min-w-10 items-center justify-center rounded-[8px] border px-3 text-[14px] font-semibold transition",
        active
          ? "border-[#E51C23] bg-[#E51C23] text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
        disabled ? "cursor-not-allowed opacity-50" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function ViewModeButton({ active = false, onClick, children, label }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={onClick}
      className={[
        "flex h-[32px] w-[32px] items-center justify-center rounded-[6px] transition",
        active ? "bg-[#FFF5F5] text-[#E51C23]" : "text-[#64748B] hover:bg-slate-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function MapPlaceholder() {
  return (
    <div className="flex h-full min-h-[540px] w-full items-center justify-center rounded-[16px] border border-dashed border-[#CBD5E1] bg-[linear-gradient(135deg,#F8FAFC_0%,#EEF2FF_100%)] px-6 text-center">
      <div>
        <div className="text-[12px] font-bold uppercase tracking-[0.24em] text-[#94A3B8]">
          Map View
        </div>
        <h3 className="mt-3 text-[28px] font-black leading-tight text-[#0F172A]">
          Map will render here
        </h3>
        <p className="mt-3 text-[14px] text-[#64748B]">
          Properties stay visible beside the map on desktop and below it on mobile.
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  DATA                                      */
/* -------------------------------------------------------------------------- */

const results = [
  {
    id: 1,
    badge: "FEATURED",
    verified: true,
    favorite: false,
    image: "/images/1st,4th.png",
    price: "2.1 Cr",
    rate: "22,400/sq.ft",
    title: "Vardhaman Plaza",
    location: "Rajouri Garden, New Delhi - 110027",
    details: "3 BHK",
    area: "1850 sq.ft",
    match: "95% Match",
    tags: ["READY TO MOVE", "WEST FACING", "BIKE & CAR PARKING"],
  },
  {
    id: 2,
    badge: "VERIFIED",
    verified: true,
    favorite: false,
    image: "/images/2nd.png",
    price: "1.75 Cr",
    rate: "19,200/sq.ft",
    title: "Sunshine Residency",
    location: "Dwarka Sector 12, New Delhi - 110075",
    details: "2 BHK",
    area: "910 sq.ft",
    match: "89% Match",
    tags: ["UNDER CONSTRUCTION", "EAST FACING", "CAR PARKING"],
  },
  {
    id: 3,
    badge: "VERIFIED",
    verified: true,
    favorite: true,
    image: "/images/3rd.png",
    price: "2.1 Cr",
    rate: "22,400/sq.ft",
    title: "Vardhaman Plaza",
    location: "Rajouri Garden, New Delhi - 110027",
    details: "3 BHK",
    area: "1850 sq.ft",
    match: "95% Match",
    tags: ["READY TO MOVE", "WEST FACING", "BIKE & CAR PARKING"],
  },
  {
    id: 4,
    badge: "NEW LISTING",
    verified: false,
    favorite: false,
    image: "/images/1st,4th.png",
    price: "3.5 Cr",
    rate: "28,000/sq.ft",
    title: "Greenwood Heights",
    location: "Saket, New Delhi - 110017",
    details: "4 BHK",
    area: "1250 sq.ft",
    match: "98% Match",
    tags: ["READY TO MOVE", "NORTH FACING", "BIKE PARKING ONLY"],
  },
  {
    id: 5,
    badge: "VERIFIED",
    verified: true,
    favorite: false,
    image: "/images/2nd.png",
    price: "2.9 Cr",
    rate: "24,500/sq.ft",
    title: "Lotus Enclave",
    location: "Vasant Kunj, New Delhi - 110070",
    details: "3 BHK",
    area: "1180 sq.ft",
    match: "92% Match",
    tags: ["READY TO MOVE", "SOUTH FACING", "BIKE & CAR PARKING"],
  },
];

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

function PropertiesPage() {
  const areaLabel = "Mumbai, Andheri West";
  const [minPrice, setMinPrice] = React.useState(18);
  const [maxPrice, setMaxPrice] = React.useState(82);
  const [viewMode, setViewMode] = React.useState("list");
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
    setSelectedBhk(["2 BHK", "3 BHK"]);
    setSelectedPropertyTypes(["Apartment"]);
    setSelectedPropertyStatus(["Under Construction"]);
    setSelectedFurnishing(["Full"]);
    setSelectedParking(["2 Wheeler"]);
    setVerifiedOnly(true);
    setReraApproved(false);
    setSelectedAmenities([]);
  };

  return (
    <main className="min-h-screen w-full bg-white text-[#0F172A]">
      <div className="flex min-h-screen w-full flex-col bg-white">

        {/* HEADER */}
        <SiteHeader
          userLabel="User"
          userAvatarSrc="/images/avatar-1.jpg.png"
        />

        {/* ------------------------------------------------------------------ */}
        {/* TOP SEARCH BAR                                                     */}
        {/* ------------------------------------------------------------------ */}

        <section className="w-full border-b border-[#E5E7EB] bg-white">
          <div className="flex min-h-[77px] w-full items-center px-4 py-4 sm:px-6 lg:px-8 xl:px-12">
            <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-4">

              {/* SEARCH FIELDS */}
              <div className="flex h-[41px] min-w-0 flex-1 items-center gap-4 overflow-x-auto rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-4">
                <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[14px] text-[#0F172A]">
                  <LocationIcon />

                  <span className="font-semibold">
                    {areaLabel}
                  </span>
                </div>

                <Divider />

                <FilterField
                  label="Type:"
                  value="Buy"
                />

                <Divider />

                <FilterField
                  label="Property:"
                  value="Flat"
                />

                <Divider />

                <FilterField
                  label="Budget:"
                  value="₹1 Cr - ₹5 Cr"
                />
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex shrink-0 items-center gap-3 md:gap-4">
                <button
                  type="button"
                  className="inline-flex h-[45px] w-[149px] shrink-0 items-center justify-center gap-2 rounded-[12px] bg-[#111827] px-5 text-[14px] font-bold text-white"
                >
                  <FiltersIcon />
                  <span>More Filters</span>
                </button>

                <button
                  type="button"
                  aria-label="Search"
                  className="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#E51C23] text-white"
                >
                  <SearchIcon />
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* MAIN RESULTS                                                       */}
        {/* ------------------------------------------------------------------ */}

        <div className="w-full flex-1 bg-white">
          <div className="mx-auto w-full max-w-[1520px] px-4 pb-[40px] pt-[32px] sm:px-6 lg:px-8 xl:px-[48px]">

            <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-6 xl:gap-[32px]">

              {/* ============================================================ */}
              {/* LEFT SIDEBAR                                                 */}
              {/* ============================================================ */}

              <aside className="w-full shrink-0 lg:w-[240px] xl:w-[280px]">

                <div className="flex w-full items-center justify-between">
                  <h2 className="text-[16px] font-bold leading-[20px]">
                    Filters
                  </h2>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[12px] font-medium text-[#E51C23]"
                  >
                    Reset All
                  </button>
                </div>

                <div className="mt-[24px] flex flex-col gap-[24px]">

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
                          onClick={() => toggleSelection(label, setSelectedBhk)}
                        />
                      ))}
                    </div>
                  </SidebarSection>

                  {/* PROPERTY TYPE */}
                  <SidebarSection title="Property Type">
                    <div className="flex flex-col gap-[8px]">
                      <CheckboxItem
                        label="Apartment"
                        checked={selectedPropertyTypes.includes("Apartment")}
                        onClick={() =>
                          toggleSelection("Apartment", setSelectedPropertyTypes)
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
                        checked={selectedPropertyTypes.includes("Plots")}
                        onClick={() => toggleSelection("Plots", setSelectedPropertyTypes)}
                      />
                    </div>
                  </SidebarSection>

                  {/* STATUS */}
                  <SidebarSection title="Property Status">
                    <div className="flex flex-col gap-[8px]">
                      <CheckboxItem
                        label="Under Construction"
                        checked={selectedPropertyStatus.includes("Under Construction")}
                        onClick={() =>
                          toggleSelection(
                            "Under Construction",
                            setSelectedPropertyStatus,
                          )
                        }
                      />

                      <CheckboxItem
                        label="Ready"
                        checked={selectedPropertyStatus.includes("Ready")}
                        onClick={() => toggleSelection("Ready", setSelectedPropertyStatus)}
                      />
                    </div>
                  </SidebarSection>

                  {/* FURNISHING */}
                  <SidebarSection title="Furnishing">
                    <div className="flex flex-wrap items-center gap-[12px]">
                      <CheckboxItem
                        label="Full"
                        checked={selectedFurnishing.includes("Full")}
                        onClick={() => toggleSelection("Full", setSelectedFurnishing)}
                      />

                      <CheckboxItem
                        label="Semi"
                        checked={selectedFurnishing.includes("Semi")}
                        onClick={() => toggleSelection("Semi", setSelectedFurnishing)}
                      />

                      <CheckboxItem
                        label="None"
                        checked={selectedFurnishing.includes("None")}
                        onClick={() => toggleSelection("None", setSelectedFurnishing)}
                      />
                    </div>
                  </SidebarSection>

                  {/* PARKING */}
                  <SidebarSection title="Parking">
                    <div className="flex flex-wrap items-center gap-[12px]">
                      <CheckboxItem
                        label="2 Wheeler"
                        checked={selectedParking.includes("2 Wheeler")}
                        onClick={() => toggleSelection("2 Wheeler", setSelectedParking)}
                      />

                      <CheckboxItem
                        label="4 Wheeler"
                        checked={selectedParking.includes("4 Wheeler")}
                        onClick={() => toggleSelection("4 Wheeler", setSelectedParking)}
                      />

                      <CheckboxItem
                        label="None"
                        checked={selectedParking.includes("None")}
                        onClick={() => toggleSelection("None", setSelectedParking)}
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
                        onClick={() => setVerifiedOnly((current) => !current)}
                      />
                    </div>

                    <div className="flex w-full items-center justify-between">
                      <span className="text-[14px] font-semibold text-[#111827]">
                        RERA Approved
                      </span>

                      <Toggle
                        on={reraApproved}
                        onClick={() => setReraApproved((current) => !current)}
                      />
                    </div>
                  </div>

                  {/* AMENITIES */}
                  <SidebarSection title="Amenities">
                    <div className="flex flex-wrap gap-[8px]">
                      {[
                        "Gym",
                        "Pool",
                        "Park",
                        "Clubhouse",
                      ].map((item) => (
                        <AmenityChip
                          key={item}
                          label={item}
                          active={selectedAmenities.includes(item)}
                          onClick={() => toggleSelection(item, setSelectedAmenities)}
                        />
                      ))}
                    </div>
                  </SidebarSection>

                </div>
              </aside>

              {/* ============================================================ */}
              {/* RIGHT PROPERTY RESULTS                                       */}
              {/* ============================================================ */}

              <section className="min-w-0 w-full lg:flex-1 2xl:max-w-[1112px]">

                {/* RESULTS HEADER */}
                <div className="flex w-full items-start justify-between gap-6">
                  <div className="w-[258.98px] shrink-0">
                    <h1 className="text-[20px] font-semibold leading-[30px] text-[#111827]">
                      1,245 Properties in Mumbai
                    </h1>

                    <p className="font-['Lato'] text-[14px] font-normal leading-[21px] tracking-[-0.49%] text-[#6B7280]">
                      Properties for Sale in Andheri West
                    </p>
                  </div>

                  <div className="flex h-10 w-[300.5px] shrink-0 items-center gap-4">

                    {/* SORT */}
                    <div className="flex h-[38px] w-[170.5px] items-center gap-1 rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-1">
                      <span className="text-[9px] text-[#64748B]">
                        Sort By:
                      </span>

                      <button
                        type="button"
                        className="flex items-center gap-[7px] text-[9px] font-semibold text-[#111827]"
                      >
                        Relevance

                        <svg
                          viewBox="0 0 12 12"
                          className="h-[10px] w-[10px]"
                          fill="none"
                        >
                          <path
                            d="M3 4.5 6 7.5 9 4.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* VIEW SWITCHER */}
                    <div className="flex h-[40px] w-[114px] items-center gap-1 rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] p-1">

                      {/* LIST */}
                      <ViewModeButton
                        label="List view"
                        active={viewMode === "list"}
                        onClick={() => setViewMode("list")}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="h-[13px] w-[13px]"
                          fill="none"
                        >
                          <path
                            d="M5 4h9M5 8h9M5 12h9"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />

                          <circle cx="2" cy="4" r="1" fill="currentColor" />
                          <circle cx="2" cy="8" r="1" fill="currentColor" />
                          <circle cx="2" cy="12" r="1" fill="currentColor" />
                        </svg>
                      </ViewModeButton>

                      {/* TILE */}
                      <ViewModeButton
                        label="Tile view"
                        active={viewMode === "tile"}
                        onClick={() => setViewMode("tile")}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="h-[13px] w-[13px]"
                          fill="none"
                        >
                          <path
                            d="M2 2h5v5H2zM9 2h5v5H9zM2 9h5v5H2zM9 9h5v5H9z"
                            stroke="currentColor"
                            strokeWidth="1.4"
                          />
                        </svg>
                      </ViewModeButton>

                      {/* MAP */}
                      <ViewModeButton
                        label="Map view"
                        active={viewMode === "map"}
                        onClick={() => setViewMode("map")}
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="h-[13px] w-[13px]"
                          fill="none"
                        >
                          <path
                            d="M8 2 2 5v6l6 3 6-3V5L8 2Z"
                            stroke="currentColor"
                            strokeWidth="1.4"
                          />
                        </svg>
                      </ViewModeButton>

                    </div>
                  </div>
                </div>

                {viewMode === "list" && (
                  <>
                    {/* PROPERTY LIST */}
                    <div className="mt-[24px] flex w-full flex-col gap-[12px]">
                      {results.map((item) => (
                        <ResultCard
                          key={item.id}
                          item={item}
                        />
                      ))}
                    </div>
                  </>
                )}

                {viewMode === "tile" && (
                  <>
                    {/* PROPERTY TILES */}
                    <div className="mt-[24px] grid w-full grid-cols-1 gap-[12px] sm:grid-cols-2 xl:grid-cols-3">
                      {results.map((item) => (
                        <ResultTileCard
                          key={item.id}
                          item={item}
                        />
                      ))}
                    </div>
                  </>
                )}

                {viewMode === "map" && (
                  <>
                    {/* MAP VIEW */}
                    <div className="mt-[24px] grid w-full grid-cols-1 gap-[16px] xl:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
                      <MapPlaceholder />

                      <div className="flex min-w-0 flex-col gap-[12px]">
                        {results.map((item) => (
                          <ResultTileCard
                            key={item.id}
                            item={item}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* PAGINATION */}
                <div className="mt-[32px] flex justify-center">
                  <div className="flex flex-wrap items-center justify-center gap-[7px]">

                    <PaginationButton disabled>
                      â€¹
                    </PaginationButton>

                    <PaginationButton active>
                      1
                    </PaginationButton>

                    <PaginationButton>
                      2
                    </PaginationButton>

                    <PaginationButton>
                      3
                    </PaginationButton>

                    <span className="px-[3px] text-[10px] text-[#94A3B8]">
                      ...
                    </span>

                    <PaginationButton>
                      42
                    </PaginationButton>

                    <PaginationButton>
                      â€º
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


