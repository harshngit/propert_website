import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Buy", to: "/buy", widthClass: "w-[47px]" },
  { label: "Rent", to: "/rent", widthClass: "w-[52px]" },
  { label: "Sell", to: "/sell", widthClass: "w-[45px]" },
  { label: "Services", to: "/services", widthClass: "w-[79px]" },
  { label: "News & Guide", to: "/news-guide", widthClass: "w-[117px]" },
];

function linkClass({ isActive }) {
  return [
    "inline-flex items-center gap-1.5 transition hover:text-slate-950",
    isActive ? "text-slate-950" : "text-slate-900",
  ].join(" ");
}

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="h-3 w-3 shrink-0 text-[#374151]"
      fill="none"
    >
      <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const tickerItems = [
  {
    badge: "Offer",
    badgeClassName: "bg-[#FACC15] text-[#111827]",
    text: "Limited Time Offer: 0% Brokerage on Delhi Collection",
    textWidthClass: "w-[342px]",
    itemWidthClass: "w-[402px]",
  },
  {
    badge: "New",
    badgeClassName: "bg-[#E31E24] text-white",
    text: "New Launch: A R Buildwel starting at \u20B91.2 Cr in New Delhi",
    textWidthClass: "w-[356px]",
    itemWidthClass: "w-[405px]",
  },
  {
    badge: "Offer",
    badgeClassName: "bg-[#FACC15] text-[#111827]",
    text: "Limited Time Offer: 0% Brokerage on West Mumbai Collection",
    textWidthClass: "w-[398px]",
    itemWidthClass: "w-[458px]",
  },
];

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

function ScrollingTicker() {
  const track = [...tickerItems, ...tickerItems];

  return (
    <div className="ticker-bar h-10 w-full overflow-hidden bg-[#111827] px-[50px] py-[10px]">
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
            {index !== track.length - 1 ? (
              <span aria-hidden="true" className="h-4 w-px shrink-0 bg-white/20" />
            ) : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

function SiteHeader() {
  const location = useLocation();
  const showTicker = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#F3F4F6] bg-white">
      {showTicker ? <ScrollingTicker /> : null}

      <div className="flex h-[72px] w-full items-center justify-between px-12 py-4">
        <div className="flex items-center gap-6">
          <NavLink
            to="/"
            className="flex h-8 items-center whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-8 tracking-[-0.6px] text-[#E51C23]"
          >
            PropertySerch
          </NavLink>

          <button
            type="button"
            className="inline-flex h-8  items-center gap-3 transition hover:text-slate-950"
          >
            <span className="flex h-5  w-[55px] items-center font-['Plus_Jakarta_Sans'] text-[14px] font-semibold leading-5 tracking-[0.088em] text-[#374151]">
              Mumbai
            </span>
            <Chevron />
          </button>
        </div>

        <nav className="flex w-[436px] flex-1 items-center justify-center gap-6 text-base font-semibold">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                [
                  "inline-flex h-5 items-center gap-1 whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-semibold leading-5 text-[#374151] transition hover:text-slate-950",
                  item.widthClass,
                  isActive ? "text-slate-950" : "",
                ].join(" ")
              }
            >
              <span className="leading-5">{item.label}</span>
              <Chevron />
            </NavLink>
          ))}
        </nav>

        <div className="flex h-10 w-[253px] items-center gap-6">
          <NavLink
            to="/login"
            className="inline-flex h-5 w-[58px] shrink-0 items-center gap-1 whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-semibold leading-5 text-[#374151] transition hover:text-slate-950"
          >
            <span className="flex h-5 items-center justify-start">Login</span>
            <Chevron />
          </NavLink>

          <button className="inline-flex h-10 w-[171px] items-center justify-center gap-1 rounded-[12px] bg-[#E51C23] px-4 py-[10px] text-center text-[14px] font-bold leading-5 tracking-[0.002em] text-white shadow-[0_10px_22px_rgba(229,28,35,0.35)] transition hover:bg-[#cc1820]">
            <span className="inline-flex h-5 w-[95px] items-center justify-center">Post Property</span>
            <span className="inline-flex h-4 w-10 items-center justify-center rounded-[2px] bg-[#F4B400] font-sans text-[10px] font-bold uppercase leading-5 tracking-[0.0107em] text-[#111827]">
              FREE
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
