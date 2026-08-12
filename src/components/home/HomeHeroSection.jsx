import React from "react";

function PinIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-[#9CA3AF]" fill="none">
      <path
        d="M10 18s5-4.5 5-9a5 5 0 10-10 0c0 4.5 5 9 5 9Z"
        fill="currentColor"
      />
      <circle cx="10" cy="9" r="2" fill="white" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-[#9CA3AF]" fill="none">
      <path
        d="M2.5 9.75L10 3l7.5 6.75V17a.75.75 0 0 1-.75.75H13.5v-5.25h-7V17A.75.75 0 0 1 5.75 17H3.25a.75.75 0 0 1-.75-.75V9.75Z"
        fill="currentColor"
      />
    </svg>
  );
}

function RupeeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-[#9CA3AF]" fill="none">
      <path
        d="M6 4.5h8.5M6 7.5h8.5M6 4.5c2.5 0 4.5 1.1 5.5 3H6m0 0c2.5 0 4.5 1.1 5.5 3H6m0 0L14.5 15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-white" fill="none">
      <path
        d="M8.75 14.5a5.75 5.75 0 1 1 0-11.5 5.75 5.75 0 0 1 0 11.5Zm4.55-1.2 3.2 3.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HomeHeroSection() {
  return (
    <section className="flex h-[548px] max-w-full flex-col items-center justify-center lg:py-[96px]">
      <div className="mx-auto flex h-[48px] w-full max-w-[1184px] items-center justify-center">
        <h1
          className="h-[48px] text-center font-['Plus_Jakarta_Sans'] text-[48px] font-extrabold leading-[48px] tracking-[0] text-[#111827]"
          style={{ width: "1020.3092041015625px" }}
        >
          Beyond listings. Built for the entire deal
        </h1>
      </div>

      <div className="mx-auto mt-3 flex h-[56px] w-full max-w-[1184px] items-center justify-center">
        <div className="flex h-[56px] w-[747px] flex-col items-center justify-center font-['Lato'] text-[18px] font-normal leading-[28px] text-[#6B7280]">
          <p className="m-0 h-[28px] text-center">
            Verified properties, legal facilitation, financing, and closure tracked end-to-end on one platform
          </p>
          <p className="m-0 h-[28px] text-center">
            Not a portal, an operating system for real estate transactions
          </p>
        </div>
      </div>

      <div className="mx-auto mt-12 w-full max-w-[896px] pt-8">
        <div className="mx-auto flex w-full max-w-[880px] gap-1">
          {["Buy", "Rent", "Commercial", "Institutional"].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={[
                "flex h-11 items-center justify-center rounded-t-[12px] px-8 text-[18px] font-bold leading-5 shadow-[0_4px_4px_rgba(0,0,0,0.06)]",
                index === 0
                  ? "bg-[#E51C23] text-white"
                  : "bg-[#F9FAFB] text-[#4B5563]",
              ].join(" ")}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-0 flex h-[88px] w-full items-center gap-4 rounded-bl-[16px] rounded-br-[16px] rounded-tr-[16px] border border-[#F3F4F6] bg-white p-4 shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)]">
          <div className="flex h-[36px] w-[305px] items-center gap-3 border-r border-[#F3F4F6] px-4 text-[18px] font-normal leading-[28px] text-[#9CA3AF]">
            <PinIcon />
            <span>Search City, Locality or Landmark</span>
          </div>

          <div className="flex h-[36px] w-[192px] items-center gap-3 border-r border-[#F3F4F6] px-4 text-[18px] font-normal leading-[28px] text-[#111827]">
            <HomeIcon />
            <span>Property Type</span>
          </div>

          <div className="flex h-[36px] w-[160px] items-center gap-3 px-4 text-[18px] font-normal leading-[28px] text-[#111827]">
            <RupeeIcon />
            <span>Budget</span>
          </div>

          <button className="ml-auto inline-flex h-[56px] w-[159px] items-center justify-center gap-2 rounded-[12px] bg-[#E51C23] px-10 py-4 text-[18px] font-bold leading-5 text-white">
            <SearchIcon />
            <span>Search</span>
          </button>
        </div>
      </div>

      <p className="mt-6 font-semibold text-slate-500">
        Are you a Property Owner? <span className="text-red-500">Post for FREE</span>
      </p>

      <div className="mt-14 inline-flex rounded-full bg-slate-100 px-4 py-2 text-[12px] font-extrabold uppercase tracking-[0.18em] text-slate-600">
        Verified users - Secure contact - End-to-end tracking
      </div>
    </section>
  );
}

export default HomeHeroSection;
