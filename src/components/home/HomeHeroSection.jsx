import React from "react";

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
  const tabs = ["Buy", "Rent", "Commercial", "Institutional"];
  const [activeTab, setActiveTab] = React.useState("Buy");
  const tabWidths = {
    Buy: "w-[75px]",
    Rent: "w-[80px]",
    Commercial: "w-[132px]",
    Institutional: "w-[131px]",
  };

  return (
    <section className="relative flex min-h-[548px] max-w-full flex-col items-center justify-start lg:pb-10">
      <div className="relative w-full lg:pt-[96px]">
        <div className="absolute left-1/2 top-[44px] inline-flex -translate-x-1/2 rounded-full bg-[#F6E8C8] px-5 py-2 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#C08C2C]">
          Real Estate Transaction Operating System
        </div>

        <div className="mx-auto flex h-[48px] w-full max-w-[1184px] items-center justify-center">
          <h1
            className="h-[48px] text-center font-['Plus_Jakarta_Sans'] text-[48px] font-extrabold leading-[48px] tracking-[0] text-[#111827]"
            style={{ width: "1020.3092041015625px" }}
          >
            Beyond listings. Built for the entire deal
          </h1>
        </div>
      </div>

      <div className="mx-auto mt-4 flex h-[56px] w-full max-w-[1184px] items-center justify-center">
        <div className="flex h-[56px] w-[747px] flex-col items-center justify-center font-['Lato'] text-[18px] font-normal leading-[28px] text-[#6B7280]">
          <p className="m-0 h-[28px] text-center">
            Verified properties, legal facilitation, financing, and closure
            tracked end-to-end on one platform
          </p>
          <p className="m-0 h-[28px] text-center">
            Not a portal, an operating system for real estate transactions
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-[896px]">
        <div className="mx-auto flex w-full max-w-[880px] gap-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={[
                "flex h-[44px] items-center justify-center rounded-tl-[12px] rounded-tr-[12px] px-6 py-3 font-['Plus_Jakarta_Sans'] text-[14px] font-bold leading-5 shadow-[2px_0_6px_rgba(0,0,0,0.08)]",
                tabWidths[tab],
                activeTab === tab
                  ? "bg-[#E51C23] tracking-[0.0283em] text-white hover:bg-[#cc1820]"
                  : "bg-[#F9FAFB] tracking-[0.0059em] text-[#4B5563]",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-0 flex h-[88px] w-full flex-nowrap items-center gap-4 rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] border border-[#F3F4F6] bg-white p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-[4px]">
          <div className="flex h-[36px] w-[305px] shrink-0 items-center gap-3 border-r border-[#F3F4F6] px-4 text-[#1A1A1A]">
            <PinIcon />
            <div className="flex h-[36px] w-[249px] items-center py-[9px]">
              <input
                type="text"
                placeholder="Search City, Locality or Landmark"
                className="w-full border-0 bg-transparent p-0 font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[14px] outline-none placeholder:text-gray-500 focus:border-0 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex h-[36px] w-[192px] shrink-0 items-center gap-3 px-4 text-[#1A1A1A]">
            <HomeIcon />
            <div className="flex h-[36px] w-[130px] items-center py-[9px] pl-1 pr-4">
              <input
                type="text"
                placeholder="Property Type"
                className="w-full border-0 bg-transparent p-0 font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[16px] outline-none focus:border-0 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex h-[36px] w-[160px] shrink-0 items-center gap-3 px-4 text-[#1A1A1A]">
            <RupeeIcon />
            <div className="flex h-[36px] w-[106px] items-center py-[9px] pl-1 pr-4">
              <input
                type="text"
                placeholder="Budget"
                className="w-full border-0 bg-transparent p-0 font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[16px] outline-none focus:border-0 focus:outline-none"
              />
            </div>
          </div>

          <button className="ml-auto inline-flex h-[56px] w-[159px] shrink-0 items-center justify-center gap-2 rounded-[12px] bg-[#E51C23] px-10 py-4 text-white hover:bg-[#cc1820]">
            <SearchIcon />
            <span className="flex h-6 w-[55px] items-center justify-center font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-6 tracking-[0.0049em]">
              Search
            </span>
          </button>
        </div>
      </div>

      <div className="mt-6 flex h-6 w-[270px] items-center justify-center font-['Plus_Jakarta_Sans'] text-[14px] leading-6 tracking-[0.0049em]">
        <span className="font-normal text-[#6B7280]">
          Are you a Property Owner?{" "}
        </span>
        <span className="font-semibold text-[#E51C23]">Post for FREE</span>
      </div>

      <div className="mt-[68px] inline-flex rounded-full bg-slate-100 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-600">
        Verified users · Secure contact · End-to-end tracking
      </div>
    </section>
  );
}

export default HomeHeroSection;
