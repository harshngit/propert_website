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

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {partnerCards.map((card) => (
            <article
              key={card.title}
              className="flex min-h-[188px] flex-col rounded-[22px] border border-[#dfe6f3] bg-white px-7 py-7 text-left shadow-[0_10px_24px_rgba(15,23,42,0.03)]"
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

      <div className="mt-12 rounded-[28px] bg-[#0f1f3a] px-6 py-8 text-white shadow-[0_12px_30px_rgba(15,23,42,0.08)] md:px-10 md:py-10">
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-5">
          {highlights.map((item) => (
            <div key={item.title} className="max-w-[240px]">
              <div className="h-3 w-3 rounded-[2px] bg-[#E51C23]" />
              <h4 className="mt-5 text-[18px] font-extrabold leading-[1.2] text-white">
                {item.title}
              </h4>
              <p className="mt-3 text-[16px] leading-7 text-[#a9bedf]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnerGrowthSection;
