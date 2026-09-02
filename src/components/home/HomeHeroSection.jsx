import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { buildPropertiesPath } from "../../utils/propertySearch";

function PinIcon() {
  return (
    <img
      src="/icons/pin%20icon.png"
      alt=""
      aria-hidden="true"
      className="h-[16px] w-[12px] shrink-0 object-contain"
    />
  );
}

function HomeIcon() {
  return (
    <img
      src="/icons/home%20icon.png"
      alt=""
      aria-hidden="true"
      className="h-[16px] w-[18px] shrink-0 object-contain"
    />
  );
}

function RupeeIcon() {
  return (
    <img
      src="/icons/rupay%20icon.png"
      alt=""
      aria-hidden="true"
      className="h-[16px] w-[10px] shrink-0 object-contain"
    />
  );
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0 text-white"
      fill="none"
    >
      <path
        d="M7 12.5a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11Zm3.95-1.05L14 14.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeHeroSection({
  currentCity,
  showBadge = true,
  titlePrefix = "",
  titleHighlight = "",
  titleText = "Beyond listings. Built for the entire deal",
  cityLandingMobile = false,
  descriptionLines = [
    "Verified properties, legal facilitation, financing, and closure tracked end-to-end on one platform",
    "Not a portal, an operating system for real estate transactions",
  ],
}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabs = ["Buy", "Rent", "Commercial", "Institutional"];
  const [activeTab, setActiveTab] = React.useState("Buy");
  const [searchLocation, setSearchLocation] = React.useState("");
  const [propertyType, setPropertyType] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const tabWidths = {
    Buy: "w-[60.43px]",
    Rent: "w-[63.43px]",
    Commercial: "w-[98.43px]",
    Institutional: "w-[96.43px]",
  };
  const tabSmWidths = {
    Buy: "sm:w-[75px]",
    Rent: "sm:w-[80px]",
    Commercial: "sm:w-[132px]",
    Institutional: "sm:w-[131px]",
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const activeCity = currentCity || searchParams.get("city");
    const nextPath = buildPropertiesPath(searchParams, {
      city: activeCity || undefined,
      location: searchLocation,
      propertyType,
      budget,
      type: activeTab.toLowerCase(),
    });

    navigate(nextPath);
  };

  return (
    <section className="relative flex min-h-[548px] max-w-full flex-col items-center justify-start pb-8 lg:pb-10">
      <div className="relative w-full pt-16 sm:pt-8 lg:pt-[96px]">
        {showBadge ? (
          <div className="absolute left-1/2 top-[30px] inline-flex -translate-x-1/2 whitespace-nowrap rounded-full bg-[#F6E8C8] px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.12em] text-[#C08C2C] sm:top-[44px] sm:px-5 sm:py-2 sm:text-[10px] sm:tracking-[0.14em]">
            Real Estate Transaction Operating System
          </div>
        ) : null}

        <div className="mx-auto flex w-full max-w-[1184px] items-center justify-center px-2 sm:px-0">
          <h1
            className="text-center font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-[34px] tracking-[0] text-[#111827] sm:hidden"
            style={{ width: "100%", maxWidth: "320px" }}
          >
            {titlePrefix ? (
              <>
                <span className="block">{titlePrefix}</span>
                <span className="block text-[#E51C23]">{titleHighlight}</span>
              </>
            ) : (
              <>
                <span className="block">Beyond listings.</span>
                <span className="block">Built for the entire deal</span>
              </>
            )}
          </h1>

          <h1
            className="hidden text-center font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-[34px] tracking-[0] text-[#111827] sm:block sm:text-[36px] sm:leading-[42px] lg:text-[48px] lg:leading-[48px]"
            style={{ width: "100%", maxWidth: "1020px" }}
          >
            {titlePrefix ? (
              <>
                {titlePrefix} <span className="text-[#E51C23]">{titleHighlight}</span>
              </>
            ) : (
              titleText
            )}
          </h1>
        </div>
      </div>

      <div className="mx-auto mt-2 flex w-full max-w-[1184px] items-center justify-center px-3 sm:mt-4 sm:px-0">
        <div className="flex w-full max-w-[340px] flex-col items-center justify-center font-['Lato'] text-[12px] font-normal leading-[20px] text-[#6B7280] sm:hidden">
          <p className="m-0 text-center">An operating system for real estate transactions with</p>
          <p className="m-0 text-center">legal facilitation and end-to-end tracking.</p>
        </div>

        <div className="hidden w-full max-w-[1020px] flex-col items-center justify-center font-['Lato'] text-[14px] font-normal leading-[20px] text-[#6B7280] sm:flex sm:text-[18px] sm:leading-[29px]">
          {descriptionLines.map((line) => (
            <p key={line} className="m-0 text-center">
              {line}
            </p>
          ))}
        </div>
      </div>

      <form
  className="mx-auto mt-6 w-full max-w-[896px] px-1 sm:mt-12 sm:px-0"
  onSubmit={handleSearch}
>
  {/* Tabs */}
  <div className="mx-auto flex w-full items-end gap-0 overflow-visible lg:max-w-[865px] lg:gap-[3px]">
    {tabs.map((tab) => (
      <button
        key={tab}
        type="button"
        onClick={() => setActiveTab(tab)}
        className={[
          "flex h-[36px] shrink-0 items-center justify-center",
          "rounded-t-[11px] px-2",
          "font-['Plus_Jakarta_Sans'] text-[10px] font-bold leading-none",
          "transition-colors duration-200",
          tab === "Buy" ? "w-[57px]" : "",
          tab === "Rent" ? "w-[60px]" : "",
          tab === "Commercial" ? "w-[96px]" : "",
          tab === "Institutional" ? "w-[93px]" : "",
          "sm:h-[54px] sm:flex-1 sm:px-4 sm:text-[14px]",
          "lg:h-[44px] lg:flex-none lg:px-6 lg:py-3 lg:text-[14px] lg:shadow-[2px_0_6px_rgba(0,0,0,0.08)]",
          tab === "Buy" ? "lg:w-[75px]" : "",
          tab === "Rent" ? "lg:w-[80px]" : "",
          tab === "Commercial" ? "lg:w-[132px]" : "",
          tab === "Institutional" ? "lg:w-[131px]" : "",
          activeTab === tab
            ? "relative z-10 bg-[#ED1C24] text-white lg:rounded-tl-[12px] lg:rounded-tr-[12px] lg:hover:bg-[#111827]"
            : "border-r border-white bg-[#F9FAFB] text-[#4B5563] lg:rounded-tl-[12px] lg:rounded-tr-[12px] lg:hover:bg-[#111827] lg:hover:text-white",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {tab}
      </button>
    ))}
  </div>

  {/* Search form container */}
  <div
    className="
      mx-auto mt-0 flex w-full flex-col overflow-hidden
      rounded-bl-[12px] rounded-br-[12px] rounded-tr-[16px]
      border border-[#E5E7EB] bg-white
      px-[18px] pb-[18px]
      shadow-[0px_4px_8px_rgba(0,0,0,0.12)]
      backdrop-blur-[4px]
      sm:p-4
      lg:h-[88px] lg:flex-row lg:flex-nowrap lg:items-center
      lg:gap-4 lg:overflow-visible lg:rounded-bl-[16px]
      lg:rounded-br-[16px]
    "
  >
    {/* Location */}
    <div
      className={`
        flex h-[56px] w-full items-center gap-[14px]
        border-b border-[#E5E7EB] px-0
        text-[#1A1A1A]
        lg:h-[36px] lg:w-[305px] lg:shrink-0
        lg:border-b-0 lg:border-r lg:px-4
        `}
    >
      <div className="flex w-[20px] shrink-0 items-center justify-center text-[#9CA3AF]">
        <PinIcon />
      </div>

      <input
        type="text"
        placeholder="Search City, Locality or Landmark"
        value={searchLocation}
        onChange={(event) => setSearchLocation(event.target.value)}
        className="
          w-full min-w-0 border-0 bg-transparent p-0
          font-['Plus_Jakarta_Sans'] text-[12px] font-normal
          leading-5 text-[#1A1A1A] outline-none
          placeholder:text-[#9CA3AF]
          focus:border-0 focus:outline-none
          sm:text-[14px]
        "
      />
    </div>

    {/* Property type */}
    <div
      className={`
        flex h-[56px] w-full items-center gap-[14px]
        border-b border-[#E5E7EB] px-0
        text-[#1A1A1A]
        lg:h-[36px] lg:w-[192px] lg:shrink-0
        lg:border-b-0 lg:px-4
        `}
    >
      <div className="flex w-[20px] shrink-0 items-center justify-center text-[#9CA3AF]">
        <HomeIcon />
      </div>

      <input
        type="text"
        placeholder="Property Type"
        value={propertyType}
        onChange={(event) => setPropertyType(event.target.value)}
        className="
          w-full min-w-0 border-0 bg-transparent p-0
          font-['Plus_Jakarta_Sans'] text-[12px] font-normal
          leading-5 text-[#1A1A1A] outline-none
          placeholder:text-[#1A1A1A]
          focus:border-0 focus:outline-none
          sm:text-[14px]
        "
      />
    </div>

    {/* Budget */}
    <div
      className={`
        flex h-[56px] w-full items-center gap-[14px]
        border-b border-[#E5E7EB] px-0
        text-[#1A1A1A]
        lg:h-[36px] lg:w-[160px] lg:shrink-0
        lg:border-b-0 lg:px-4
        `}
    >
      <div className="flex w-[20px] shrink-0 items-center justify-center text-[#9CA3AF]">
        <RupeeIcon />
      </div>

      <input
        type="text"
        placeholder="Budget"
        value={budget}
        onChange={(event) => setBudget(event.target.value)}
        className="
          w-full min-w-0 border-0 bg-transparent p-0
          font-['Plus_Jakarta_Sans'] text-[12px] font-normal
          leading-5 text-[#1A1A1A] outline-none
          placeholder:text-[#1A1A1A]
          focus:border-0 focus:outline-none
          sm:text-[14px]
        "
      />
    </div>

    {/* Search button */}
    <button
      type="submit"
      className={`
        cta-red mt-[17px] inline-flex h-[60px] w-full shrink-0
        items-center justify-center gap-[10px] rounded-[13px]
        bg-[#ED1C24] px-8 text-white
        transition-colors hover:bg-[#D71920]
        lg:ml-auto lg:mt-0 lg:h-[56px] lg:w-[159px]
        lg:rounded-[12px]
      `}
    >
      <SearchIcon />

      <span className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-6">
        Search
      </span>
    </button>
  </div>
</form>

      <div className={`${cityLandingMobile ? "mt-[48px] sm:mt-6" : "mt-5 sm:mt-6"} flex h-6 w-full items-center justify-center px-4 text-center font-['Plus_Jakarta_Sans'] text-[12px] leading-6 tracking-[0.0049em] sm:text-[14px]`}>
        <span className="font-normal text-[#6B7280]">
          Are you a Property Owner?{" "}
        </span>
        <span className="font-semibold text-[#E51C23]">Post for FREE</span>
      </div>

      <div className="mt-10 hidden whitespace-nowrap rounded-full bg-slate-100 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-600 sm:mt-[68px] sm:inline-flex sm:px-4 sm:text-[12px] sm:tracking-[0.18em]">
        Verified users • Secure contact • End-to-end tracking
      </div>
    </section>
  );
}

export default HomeHeroSection;
