import React from "react";

function PartnerGrowthSection() {
  const cards = [
    {
      number: "01",
      title: "Post in 60 seconds",
      body: "Straight from WhatsApp - auto-structured into your CRM.",
    },
    {
      number: "02",
      title: "Free CRM workspace",
      body: "Every lead scored Hot, Warm, or Cold - automatically.",
    },
    {
      number: "03",
      title: "SLA-tracked pipeline",
      body: "See exactly where every deal stands, and what&apos;s overdue.",
    },
  ];

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

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button className="rounded-[12px] bg-[#0f1f3a] px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-[#111f38]">
            Become a Broker Partner →
          </button>
          <button className="rounded-[12px] border border-[#d7dfee] bg-white px-6 py-3.5 text-[16px] font-extrabold text-[#0f172a] transition hover:bg-[#f8fbff]">
            Builder Partnerships →
          </button>
          <button className="rounded-[12px] bg-[#E51C23] px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-[#cc1820]">
            Become a Franchise Partner →
          </button>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.number}
              className="rounded-[18px] border border-[#dfe6f3] bg-[#f7f9fd] px-6 py-6 text-left"
            >
              <div className="text-[14px] font-extrabold tracking-[0.06em] text-[#2753f1]">
                {card.number}
              </div>
              <h4 className="mt-5 text-[19px] font-extrabold leading-[1.25] text-[#0f172a]">
                {card.title}
              </h4>
              <p className="mt-3 max-w-[290px] text-[16px] leading-7 text-[#5b6b86]">
                {card.body}
              </p>
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
