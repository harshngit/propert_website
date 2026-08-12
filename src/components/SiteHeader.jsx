import React from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { label: "Buy", to: "/buy", widthClass: "w-[47px]" },
  { label: "Rent", to: "/rent", widthClass: "w-[52px]" },
  { label: "Sell", to: "/sell", widthClass: "w-[45px]" },
  { label: "Services", to: "/services", widthClass: "w-[79px]" },
  { label: "News & Guide", to: "/news-guide", widthClass: "w-[117px]" },
];

const cityOptions = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad"];

const navDropdowns = {
  Buy: ["Apartments", "Villas", "Plots", "New Projects"],
  Rent: ["Family Homes", "Studio Homes", "PG & Co-living", "Furnished Flats"],
  Sell: ["List Property", "Property Valuation", "Owner Services", "Broker Tools"],
  Services: ["Home Loans", "Legal Help", "Interior Design", "Property Management"],
  "News & Guide": ["Market Insights", "Buying Guide", "Legal Guide", "Investment Tips"],
};

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

function Chevron() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className="h-3 w-3 shrink-0 text-[#374151]"
      fill="none"
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    <div className="ticker-bar h-10 w-full overflow-hidden bg-[#111827] px-12 py-[10px]">
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

function DropdownPanel({ items, className = "", isOpen, onSelect }) {
  return (
    <div
      className={[
        "absolute left-1/2 top-full z-50 mt-0 min-w-[220px] -translate-x-1/2 rounded-[16px] border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition duration-150",
        isOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-1 opacity-0",
        className,
      ].join(" ")}
    >
      <div className="grid gap-1">
        {items.map((item) => {
          const label = typeof item === "string" ? item : item.label;

          return (
            <button
              key={label}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onSelect(label);
              }}
              className="rounded-[12px] px-3 py-2 text-left text-[14px] font-semibold leading-5 text-[#374151] transition hover:bg-slate-50 hover:text-slate-950"
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CitySelector({ isOpen, onEnter, onLeave, selectedCity, onSelect }) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        type="button"
        className="inline-flex h-8 items-center gap-1 rounded-[10px] px-2 py-1 transition hover:bg-slate-50 hover:text-slate-950"
      >
        <span className="flex min-w-[55px] items-center font-['Plus_Jakarta_Sans'] text-[14px] font-semibold leading-5 tracking-[0.088em] text-[#374151]">
          {selectedCity}
        </span>
        <Chevron />
      </button>

      <DropdownPanel
        items={cityOptions}
        className="min-w-[240px]"
        isOpen={isOpen}
        onSelect={onSelect}
      />
    </div>
  );
}

function HeaderNavItem({ item, isOpen, onEnter, onLeave, onSelect }) {
  const dropdownItems = navDropdowns[item.label] || [];

  return (
    <div className="relative flex items-center gap-1" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <NavLink
        to={item.to}
        className={({ isActive }) =>
          [
            "inline-flex h-5 items-center whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-semibold leading-5 transition hover:text-slate-950",
            item.widthClass,
            isActive ? "text-slate-950" : "text-[#374151]",
          ].join(" ")
        }
      >
        <span className="leading-5">{item.label}</span>
        <Chevron />
      </NavLink>

      <DropdownPanel
        items={dropdownItems}
        className="min-w-[280px]"
        isOpen={isOpen}
        onSelect={onSelect}
      />
    </div>
  );
}

function SiteHeader() {
  const location = useLocation();
  const showTicker = location.pathname === "/";
  const [openMenu, setOpenMenu] = React.useState(null);
  const [selectedCity, setSelectedCity] = React.useState("Mumbai");

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

          <CitySelector
            selectedCity={selectedCity}
            isOpen={openMenu === "city"}
            onEnter={() => {
              setOpenMenu("city");
            }}
            onLeave={() => {
              setOpenMenu(null);
            }}
            onSelect={(label) => {
              setSelectedCity(label);
              setOpenMenu(null);
            }}
          />
        </div>

        <nav className="flex w-[436px] flex-1 items-center justify-center gap-6 text-base font-semibold">
          {navItems.map((item) => (
            <HeaderNavItem
              key={item.label}
              item={item}
              isOpen={openMenu === item.label}
              onEnter={() => {
                setOpenMenu(item.label);
              }}
              onLeave={() => {
                setOpenMenu(null);
              }}
              onSelect={() => {
                setOpenMenu(null);
              }}
            />
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
