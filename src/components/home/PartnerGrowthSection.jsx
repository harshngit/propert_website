import React from "react";
import { partnerCards } from "../../data/homeContent";

function PartnerGrowthSection() {
  const highlights = [
    {
      title: "Controlled Contact",
      body: "Numbers, emails & links auto-blocked publicly",
    },
    {
      title: "Trust Score",
      body: "Fraud & duplicate detection on every listing",
    },
    {
      title: "Institutional Marketplace",
      body: "India's first for schools & colleges",
    },
    {
      title: "NRI Dashboard",
      body: "Manage your India property from anywhere",
    },
    {
      title: "Legal Network",
      body: "Connect with verified property lawyers",
    },
  ];

  return (
    <div className="mt-12 ">
      <div className="mx-auto max-w-full text-center">
        <h3 className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-[1.2] tracking-[0] text-[#111827] md:text-[30px]">
          Grow your business on PropertySerch
        </h3>

        <p className="mx-auto mt-5 max-w-[760px] font-['Lato'] text-[18px] leading-8 text-[#5b6b86]">
          Join brokers and builders already running their entire pipeline - from first WhatsApp
          message to signed closure - on one system.
        </p>

        {/* <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="rounded-[12px] bg-[#0f1f3a] px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-[#111f38]">
            Become a Broker Partner →
          </button>
          <button className="rounded-[12px] border border-[#d7dfee] bg-white px-6 py-3.5 text-[16px] font-extrabold text-[#0f172a] transition hover:bg-[#f8fbff]">
            Builder Partnerships →
          </button>
          <button className="rounded-[12px] bg-[#E51C23] px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-[#cc1820]">
            Become a Franchise Partner →
          </button>
        </div> */}

        <div className="mt-10 flex gap-5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory lg:grid lg:grid-cols-3 lg:overflow-visible lg:pb-0">
          {partnerCards.map((card) => (
            <article
              key={card.title}
              className="flex min-h-[188px] min-w-[82vw] shrink-0 snap-start flex-col rounded-[22px] border border-[#dfe6f3] bg-white px-7 py-7 text-left shadow-[0_10px_24px_rgba(15,23,42,0.03)] lg:min-w-0 lg:w-auto"
            >
              <h4 className="whitespace-nowrap text-[22px] font-black leading-tight text-[#0f172a]">
                {card.title}
              </h4>
              <p className="mt-4 max-w-[320px] flex-1 text-[16px] leading-7 text-[#5b6b86]">
                {card.body}
              </p>
              <button className="mt-8 inline-flex shrink-0 items-center gap-2 whitespace-nowrap text-[15px] font-extrabold text-[#E51C23] transition hover:text-[#cc1820]">
                <span>{card.action}</span>
                <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </div>

<div className="mt-12">
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
    {highlights.map((item, index) => (
      <div
        key={item.title}
        className="
          flex
          min-h-[200px]
          flex-col
          items-center
          rounded-[16px]
          border
          border-[#E5E7EB]
          bg-white
          px-5
          pt-4
          pb-8
          text-center
          shadow-[0_6px_20px_rgba(15,23,42,0.06)]
        "
      >
        {/* Icon Area */}
        <div className="relative flex h-[110px] w-[110px] items-center justify-center">
          
          {/* Soft circle */}
          <div
            className="
              absolute
              h-[86px]
              w-[86px]
              rounded-full
              bg-[#FCFCFD]
              shadow-[0_5px_18px_rgba(15,23,42,0.08)]
            "
          />

          {/* Red dotted arc */}
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 110 110"
            fill="none"
          >
            <circle
              cx="55"
              cy="55"
              r="47"
              stroke="#E51C23"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="2.5 5"
              pathLength="100"
              strokeDasharray="27 73"
              transform="rotate(195 55 55)"
            />
          </svg>

          {/* Controlled Contact */}
          {index === 0 && (
            <svg
              viewBox="0 0 24 24"
              className="relative z-10 h-[48px] w-[48px]"
              fill="none"
              stroke="#07182f"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="5" y="10" width="14" height="10" rx="2" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" />

              <circle
                cx="12"
                cy="14"
                r="2"
                stroke="#E51C23"
              />

              <path
                d="M9 19c.7-2 2-3 3-3s2.3 1 3 3"
                stroke="#E51C23"
              />
            </svg>
          )}

          {/* Trust Score */}
          {index === 1 && (
            <svg
              viewBox="0 0 24 24"
              className="relative z-10 h-[48px] w-[48px]"
              fill="none"
              stroke="#07182f"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3Z" />

              <path
                d="m9 12 2 2 4-4"
                stroke="#E51C23"
                strokeWidth="1.8"
              />
            </svg>
          )}

          {/* Institutional Marketplace */}
          {index === 2 && (
            <svg
              viewBox="0 0 24 24"
              className="relative z-10 h-[48px] w-[48px]"
              fill="none"
              stroke="#07182f"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m3 9 9-5 9 5" />
              <path d="M5 10h14" />

              <path d="M6 10v8" />
              <path d="M10 10v8" />
              <path d="M14 10v8" />
              <path d="M18 10v8" />

              <path d="M4 18h16" />
              <path d="M3 21h18" />

              <circle
                cx="12"
                cy="7"
                r="1"
                stroke="#E51C23"
                fill="#E51C23"
              />
            </svg>
          )}

          {/* NRI Dashboard */}
          {index === 3 && (
            <svg
              viewBox="0 0 24 24"
              className="relative z-10 h-[48px] w-[48px]"
              fill="none"
              stroke="#07182f"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 14a8 8 0 1 1 16 0" />

              <path d="M6 18v2" />
              <path d="M10 17v3" />
              <path d="M14 16v4" />
              <path d="M18 18v2" />

              <path
                d="m12 14 4-4"
                stroke="#E51C23"
                strokeWidth="1.8"
              />

              <circle
                cx="12"
                cy="14"
                r="1.4"
                stroke="#E51C23"
              />
            </svg>
          )}

          {/* Legal Network */}
          {index === 4 && (
            <svg
              viewBox="0 0 24 24"
              className="relative z-10 h-[48px] w-[48px]"
              fill="none"
              stroke="#07182f"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3v18" />
              <path d="M7 5h10" />

              <path d="m7 5-4 7h8L7 5Z" />
              <path d="m17 5-4 7h8l-4-7Z" />

              <path d="M8 21h8" />

              <circle
                cx="12"
                cy="5"
                r="1.2"
                stroke="#E51C23"
                fill="white"
              />
            </svg>
          )}
        </div>

        {/* Title */}
        <h4
          className="
            mt-5
            flex
            min-h-[50px]
            max-w-[200px]
            items-center
            justify-center
            font-['Plus_Jakarta_Sans']
            text-[18px]
            font-extrabold
            leading-[1.25]
            text-[#07182f]
          "
        >
          {item.title}
        </h4>

        {/* Red Line */}
        <div className="mt-4 h-[2px] w-[38px] bg-[#E51C23]" />

        {/* Description */}
        <p
          className="
            mt-5
            max-w-[210px]
            font-['Lato']
            text-[14px]
            leading-[1.7]
            text-[#64748b]
          "
        >
          {item.body}
        </p>
      </div>
    ))}
  </div>
</div>
    </div>
  );
}

export default PartnerGrowthSection;
