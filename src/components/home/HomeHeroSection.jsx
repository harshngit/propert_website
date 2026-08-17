import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { buildPropertiesPath } from "../../utils/propertySearch";

function PinIcon() {
  return (
    <img
      src="/images/pin%20icon.png"
      alt=""
      aria-hidden="true"
      className="h-[16px] w-[12px] shrink-0 object-contain"
    />
  );
}

function HomeIcon() {
  return (
    <img
      src="/images/home%20icon.png"
      alt=""
      aria-hidden="true"
      className="h-[16px] w-[18px] shrink-0 object-contain"
    />
  );
}

function RupeeIcon() {
  return (
    <img
      src="/images/rupay%20icon.png"
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

function HomeHeroSection() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tabs = ["Buy", "Rent", "Commercial", "Institutional"];
  const [activeTab, setActiveTab] = React.useState("Buy");
  const [searchLocation, setSearchLocation] = React.useState("");
  const [propertyType, setPropertyType] = React.useState("");
  const [budget, setBudget] = React.useState("");
  const tabWidths = {
    Buy: "w-[75px]",
    Rent: "w-[80px]",
    Commercial: "w-[132px]",
    Institutional: "w-[131px]",
  };
  const tabSmWidths = {
    Buy: "sm:w-[75px]",
    Rent: "sm:w-[80px]",
    Commercial: "sm:w-[132px]",
    Institutional: "sm:w-[131px]",
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const currentCity = searchParams.get("city");
    const nextPath = buildPropertiesPath(searchParams, {
      city: currentCity || undefined,
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
        <div className="absolute left-1/2 top-0 inline-flex -translate-x-1/2 whitespace-nowrap rounded-full bg-[#F6E8C8] px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#C08C2C] sm:top-[44px] sm:px-5 sm:text-[10px]">
          Real Estate Transaction Operating System
        </div>

        <div className="mx-auto flex w-full max-w-[1184px] items-center justify-center px-2 sm:px-0">
          <h1
            className="text-center font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-[34px] tracking-[0] text-[#111827] sm:text-[36px] sm:leading-[42px] lg:text-[48px] lg:leading-[48px]"
            style={{ width: "100%", maxWidth: "1020px" }}
          >
            Beyond listings. Built for the entire deal
          </h1>
        </div>
      </div>

      <div className="mx-auto mt-3 flex w-full max-w-[1184px] items-center justify-center px-3 sm:mt-4 sm:px-0">
        <div className="flex w-full max-w-[747px] flex-col items-center justify-center font-['Lato'] text-[14px] font-normal leading-[22px] text-[#6B7280] sm:text-[18px] sm:leading-[28px]">
          <p className="m-0 text-center">
            Verified properties, legal facilitation, financing, and closure
            tracked end-to-end on one platform
          </p>
          <p className="m-0 text-center">
            Not a portal, an operating system for real estate transactions
          </p>
        </div>
      </div>

      <form className="mx-auto mt-8 w-full max-w-[896px] px-0 sm:mt-12" onSubmit={handleSearch}>
        <div className="mx-auto grid w-full max-w-[880px] grid-cols-2 gap-2 sm:flex sm:overflow-visible">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={[
                "flex h-[44px] w-full items-center justify-center rounded-tl-[12px] rounded-tr-[12px] px-3 py-3 font-['Plus_Jakarta_Sans'] text-[13px] font-bold leading-5 shadow-[2px_0_6px_rgba(0,0,0,0.08)] sm:px-6 sm:text-[14px]",
                tabWidths[tab],
                tabSmWidths[tab],
                activeTab === tab
                  ? "bg-[#E51C23] tracking-[0.0283em] text-white hover:bg-[#cc1820]"
                  : "bg-[#F9FAFB] tracking-[0.0059em] text-[#4B5563]",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-0 flex w-full flex-col gap-3 rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] border border-[#F3F4F6] bg-white p-3 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-[4px] sm:p-4 lg:h-[88px] lg:flex-nowrap lg:flex-row lg:items-center lg:gap-4">
          <div className="flex min-h-[44px] w-full items-center gap-3 border-r-0 border-[#F3F4F6] px-0 text-[#1A1A1A] lg:h-[36px] lg:w-[305px] lg:shrink-0 lg:border-r lg:px-4">
            <PinIcon />
            <div className="flex w-full items-center py-0 lg:h-[36px] lg:w-[249px] lg:py-[9px]">
              <input
                type="text"
                placeholder="Search City, Locality or Landmark"
                value={searchLocation}
                onChange={(event) => setSearchLocation(event.target.value)}
                className="w-full min-w-0 border-0 bg-transparent p-0 font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-5 text-[#1A1A1A] outline-none placeholder:text-gray-500 focus:border-0 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex min-h-[44px] w-full items-center gap-3 px-0 text-[#1A1A1A] lg:h-[36px] lg:w-[192px] lg:shrink-0 lg:px-4">
            <HomeIcon />
            <div className="flex w-full items-center py-0 pl-1 pr-4 lg:h-[36px] lg:w-[130px] lg:py-[9px]">
              <input
                type="text"
                placeholder="Property Type"
                value={propertyType}
                onChange={(event) => setPropertyType(event.target.value)}
                className="w-full min-w-0 border-0 bg-transparent p-0 font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-5 text-[#1A1A1A] outline-none placeholder:text-gray-500 focus:border-0 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex min-h-[44px] w-full items-center gap-3 px-0 text-[#1A1A1A] lg:h-[36px] lg:w-[160px] lg:shrink-0 lg:px-4">
            <RupeeIcon />
            <div className="flex w-full items-center py-0 pl-2 pr-4 lg:h-[36px] lg:w-[106px] lg:py-[9px]">
              <input
                type="text"
                placeholder="Budget"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="w-full min-w-0 border-0 bg-transparent p-0 font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-5 text-[#1A1A1A] outline-none placeholder:text-gray-500 focus:border-0 focus:outline-none"
              />
            </div>
          </div>

          <button type="submit" className="cta-red ml-0 inline-flex h-[56px] w-full shrink-0 items-center justify-center gap-2 rounded-[12px] px-10 py-4 text-white lg:ml-auto lg:w-[159px]">
            <SearchIcon />
            <span className="flex h-6 w-[55px] items-center justify-center font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-6 tracking-[0.0049em]">
              Search
            </span>
          </button>
        </div>
      </form>

      <div className="mt-5 flex h-6 w-full items-center justify-center px-4 text-center font-['Plus_Jakarta_Sans'] text-[13px] leading-6 tracking-[0.0049em] sm:mt-6 sm:text-[14px]">
        <span className="font-normal text-[#6B7280]">
          Are you a Property Owner?{" "}
        </span>
        <span className="font-semibold text-[#E51C23]">Post for FREE</span>
      </div>

      <div className="mt-10 inline-flex whitespace-nowrap rounded-full bg-slate-100 px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-slate-600 sm:mt-[68px] sm:px-4 sm:text-[12px] sm:tracking-[0.18em]">
        Verified users • Secure contact • End-to-end tracking
      </div>
    </section>
  );
}

export default HomeHeroSection;
