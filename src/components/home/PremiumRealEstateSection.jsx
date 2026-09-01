import React from "react";

function PremiumRealEstateSection() {
  const chips = [
    "By invitation, subject to eligibility",
    "Assets in the Rs10 Cr - Rs100 Cr range",
    "Independently valued & professionally managed",
  ];

  return (
    <div className="relative left-1/2 mt-12 w-screen -translate-x-1/2 overflow-hidden bg-[#111827] px-5 py-10 text-white sm:px-8 lg:px-16 lg:py-16">
      <div className="mx-auto max-w-[1780px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="w-full max-w-[700.69px]">
  {/* Top Badge */}
  <div className="mb-[18px] inline-flex rounded-full bg-[#FFFFFF1A] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
    Exclusive Access &middot; HNI &amp; NRI
  </div>

  {/* Main Content */}
  <div className="grid grid-cols-1 items-stretch gap-[18px] lg:grid-cols-[230px_minmax(0,1fr)] lg:gap-[26px]">
    
    {/* LEFT SIDE */}
    <div className="flex flex-col justify-center rounded-[18px] border border-white/15 px-[16px] py-[12px]">
      {chips.map((chip, index) => (
        <div key={chip}>
          <div className="flex min-h-[82px] items-center gap-[14px]">
            
            {/* Number / Icon Circle */}
            <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full bg-[#FFFFFF1A] text-[13px] font-extrabold text-white">
              {String(index + 1).padStart(2, "0")}
            </div>

            <span className="text-[11px] font-medium leading-[18px] tracking-[0.01em] text-white/82">
              {chip}
            </span>
          </div>

          {/* Divider */}
          {index !== chips.length - 1 && (
            <div className="h-px w-full bg-white/10" />
          )}
        </div>
      ))}
    </div>

    {/* RIGHT SIDE */}
    <div className="flex min-w-0 flex-col justify-center">
      
      {/* Heading */}
      <h2 className="max-w-[440px] text-[27px] font-black leading-[1.08] tracking-tight text-white">
        Own a share of premium real estate.
        <span className="block">Not the whole property.</span>
      </h2>

      {/* Description */}
      <p className="mt-[18px] max-w-[440px] text-[13px] leading-[21px] text-white/55">
        Available only to verified, eligible investors — not a public offer or
        solicitation. Returns are not guaranteed. Investment involves risk;
        independent legal and financial due diligence is required before
        proceeding.
      </p>

      {/* Divider */}
      <div className="my-[18px] h-px w-full bg-white/10" />

      {/* Buttons */}
      <div className="flex flex-col gap-[12px] sm:flex-row">
        <button className="cta-red-on-dark inline-flex h-[50px] w-full flex-none items-center justify-center gap-2 whitespace-nowrap rounded-[12px] bg-[#E51C23] px-[14px] text-[13px] font-extrabold text-white transition sm:w-auto sm:flex-1">
          <span>Register Your Interest</span>
          <span aria-hidden="true">&rarr;</span>
        </button>

        <button className="inline-flex h-[50px] w-full flex-none items-center justify-center whitespace-nowrap rounded-[12px] border border-white/15 px-[12px] text-[12px] font-extrabold text-white transition hover:bg-white/5 sm:w-auto sm:flex-1">
          For NRI &amp; HNI Investors
        </button>
      </div>
    </div>
  </div>
</div>

          <div className="relative w-full max-w-[760px] overflow-hidden rounded-[16px] shadow-[0_18px_36px_rgba(0,0,0,0.16)] xl:max-w-[640px]">
            {/* Property Image */}
            <img
              src="/images/premium.png"
              alt="Premium real estate"
              className="h-[350px] w-full object-cover"
            />

            {/* Flat scrim for mobile, where the content spans full width */}
            <div className="pointer-events-none absolute inset-0 bg-[#0F1929]/60 lg:hidden" />

            {/* Dark gradient overlay
      Darker on left for text readability,
      transparent on right so image stays visible
  */}
            <div className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-[#0F1929]/95 via-[#0F1929]/65 to-transparent lg:block" />

            {/* Small bottom gradient for extra contrast */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0F1929]/45 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full px-5 sm:px-8 lg:w-[58%] lg:px-[32px]">
                {/* Verified Access Badge */}
                <div className="mb-[28px] inline-flex items-center gap-[10px] rounded-full border border-white/20 bg-[#111827]/45 px-[14px] py-[8px] backdrop-blur-[4px]">
                  <span className="flex h-[22px] w-[22px] items-center justify-center">
                    <svg
                      width="20"
                      height="22"
                      viewBox="0 0 20 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 1.5L18 4.5V10.5C18 15.4 14.7 19.3 10 20.5C5.3 19.3 2 15.4 2 10.5V4.5L10 1.5Z"
                        stroke="#E51C23"
                        strokeWidth="2"
                      />
                      <path
                        d="M6.5 10.5L9 13L13.5 8.5"
                        stroke="#E51C23"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <span className="text-[11px] font-bold uppercase tracking-[0.04em] text-white">
                    Verified Access
                  </span>
                </div>

                {/* Description */}
                <div className="flex gap-[16px]">
                  {/* Red vertical line */}
                  <div className="w-[2px] shrink-0 rounded-full bg-[#E51C23]" />

                  <p className="text-[15px] font-normal leading-[1.8] text-white">
                    An invite-only opportunity structured through a dedicated
                    Private Limited SPV, managed with an empanelled CA/CS and
                    independent valuer at every step. Details are shared only
                    after eligibility is confirmed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumRealEstateSection;
