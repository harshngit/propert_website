import React from "react";

function TickerBadge({ children, className }) {
  return (
    <span
      className={[
        "inline-flex h-[14px] items-center rounded-[4px] px-[6px] py-[2px] font-['Plus_Jakarta_Sans'] text-[10px] font-extrabold uppercase leading-[10px] tracking-[0.5px]",
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function CityTickerSection({ cityLabel }) {
  const tickerItems = [
    {
      badge: "Offer",
      badgeClassName: "bg-[#FACC15] text-[#111827]",
      text: `Limited Time Offer: 0% Brokerage on ${cityLabel} Collection`,
      textWidthClass: "w-[380px]",
      itemWidthClass: "w-[440px]",
    },
    {
      badge: "Offer",
      badgeClassName: "bg-[#FACC15] text-[#111827]",
      text: `Limited Time Offer: 0% Brokerage on ${cityLabel} Collection`,
      textWidthClass: "w-[380px]",
      itemWidthClass: "w-[440px]",
    },
    {
      badge: "New",
      badgeClassName: "bg-[#E31E24] text-white",
      text: `New Launch: A R Buildwel starting at ?1.2 Cr in ${cityLabel}`,
      textWidthClass: "w-[356px]",
      itemWidthClass: "w-[405px]",
    },
  ];

  const track = [...tickerItems, ...tickerItems];

  return (
    <section className="w-full bg-[#111827]">
      <div className="ticker-bar h-10 w-full overflow-hidden bg-[#111827] px-4 sm:px-6 lg:px-12">
        <div className="ticker-track flex w-max items-center gap-6">
          {track.map((item, index) => (
            <React.Fragment key={`${item.badge}-${item.text}-${index}`}>
              <div className={`ticker-item flex h-5 shrink-0 items-center gap-3 ${item.itemWidthClass}`}>
                <TickerBadge className={item.badgeClassName}>{item.badge}</TickerBadge>
                <span
                  className={[
                    "flex h-5 items-center font-['Plus_Jakarta_Sans'] text-[14px] font-semibold leading-5 tracking-[-0.35px] text-white",
                    item.textWidthClass,
                  ].join(" ")}
                >
                  {item.text}
                </span>
              </div>
              {index !== track.length - 1 ? <span aria-hidden="true" className="h-4 w-px shrink-0 bg-white/20" /> : null}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CityTickerSection;
