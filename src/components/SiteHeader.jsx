import React from "react";
import { Link, NavLink, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CITY_OPTIONS, buildCityPath, fromCitySlug } from "../utils/city";

const navItems = [
  { label: "Buy", to: "/buy", widthClass: "w-[47px]" },
  { label: "Rent", to: "/rent", widthClass: "w-[52px]" },
  { label: "Sell", to: "/sell", widthClass: "w-[45px]" },
  { label: "Services", to: "/services", widthClass: "w-[79px]" },
  { label: "News & Guide", to: "/news-guide", widthClass: "w-[117px]" },
];

const navDropdowns = {
  Buy: [
    { label: "Institutional Properties", to: "/buy/institutional-properties" },
    { label: "Bank Auction Properties", to: "/buy/bank-auction-properties" },
    { label: "Special Situation Properties", to: "/buy/special-situation-properties" },
  ],
  Rent: ["Family Homes", "Studio Homes", "PG & Co-living", "Furnished Flats"],
  Sell: ["List Property", "Property Valuation", "Owner Services", "Broker Tools"],
  Services: [{ label: "Get Involved", to: "/services/get-involved" }],
  "News & Guide": [
    { label: "Insights & Guides", to: "/news-guide/insights-guides" },
    { label: "Opened through the blog listing", to: "/news-guide/opened-through-the-blog-listing" },
  ],
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

const CONSOLE_URL = "https://property-dashboard-one-navy.vercel.app/";

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

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6 text-[#374151]"
      fill="none"
    >
      <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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
          const config = typeof item === "string" ? { label: item } : item;
          const label = config.label;

          if (config.to) {
            return (
              <Link
                key={label}
                to={config.to}
                onClick={() => onSelect?.(label, config)}
                className="rounded-[12px] px-3 py-2 text-left text-[14px] font-semibold leading-5 text-[#374151] transition hover:bg-slate-50 hover:text-slate-950"
              >
                {label}
              </Link>
            );
          }

          return (
            <button
              key={label}
              type="button"
              onMouseDown={(event) => {
                event.preventDefault();
                onSelect?.(label, config);
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
        className="inline-flex h-5 items-center whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-semibold leading-5 transition hover:text-slate-950"
      >
        <span className="leading-5 text-[#374151]">
          {selectedCity}
        </span>
        <Chevron />
      </button>

      <DropdownPanel
        items={CITY_OPTIONS}
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
      <button
        type="button"
        onClick={onSelect}
        className={[
          "inline-flex h-5 items-center whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-semibold leading-5 transition hover:text-slate-950",
          item.widthClass,
          isOpen ? "text-slate-950" : "text-[#374151]",
        ].join(" ")}
      >
        <span className="leading-5">{item.label}</span>
        <Chevron />
      </button>

      <DropdownPanel
        items={dropdownItems}
        className="min-w-[280px]"
        isOpen={isOpen}
        onSelect={onSelect}
      />
    </div>
  );
}

function initialOf(name) {
  return (name || "").trim().charAt(0).toUpperCase() || "U";
}

function canAccessConsole(role) {
  const normalizedRole = String(role || "").toLowerCase().replace(/[\s_-]+/g, " ").trim();
  return (
    normalizedRole.includes("broker") ||
    normalizedRole.includes("agency admin") ||
    normalizedRole === "admin" ||
    normalizedRole.includes("admin")
  );
}

// Right-anchored on purpose (not DropdownPanel, which centers under its
// trigger) - this sits at the far right edge of the header, so a centered
// panel would spill off the viewport.
function AccountMenu({ isOpen, onEnter, onLeave, onLoggedOut }) {
  const { user, logout } = useAuth();
  const firstName = (user?.fullName || "").split(" ")[0] || "Account";
  const showConsole = canAccessConsole(user?.role);

  const handleLogout = async (event) => {
    event.preventDefault();
    await logout();
    onLoggedOut();
  };

  return (
    <div className="relative flex items-center" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button
        type="button"
        className="inline-flex h-10 shrink-0 items-center gap-2 whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-semibold leading-5 text-[#374151] transition hover:text-slate-950"
      >
        {user?.profilePictureUrl ? (
          <img
            src={user.profilePictureUrl}
            alt={firstName}
            className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FDE8E8] text-[13px] font-extrabold text-[#E51C23]">
            {initialOf(user?.fullName)}
          </span>
        )}
        <span className="max-w-[110px] truncate">{firstName}</span>
        <Chevron />
      </button>

      <div
        className={[
          "absolute right-0 top-full z-50 mt-0 min-w-[200px] rounded-[16px] border border-slate-200 bg-white p-2 shadow-[0_18px_40px_rgba(15,23,42,0.12)] transition duration-150",
          isOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none translate-y-1 opacity-0",
        ].join(" ")}
      >
        {showConsole ? (
          <a
            href={CONSOLE_URL}
            target="_blank"
            rel="noreferrer"
            className="mb-1 inline-flex w-full items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 py-2 text-[14px] font-semibold leading-5 text-[#374151] transition hover:border-[#D1D5DB] hover:bg-slate-100 hover:text-slate-950"
          >
            Console
          </a>
        ) : null}
        <p className="truncate px-3 pb-1 pt-1.5 text-[12px] font-semibold text-slate-400">
          Signed in as {user?.email || user?.mobile}
        </p>
        <button
          type="button"
          onMouseDown={handleLogout}
          className="w-full rounded-[12px] px-3 py-2 text-left text-[14px] font-semibold leading-5 text-[#374151] transition hover:bg-slate-50 hover:text-slate-950"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

function SiteHeader() {
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();
  const showTicker =
    location.pathname === "/" ||
    location.pathname.startsWith("/city/") ||
    location.pathname.startsWith("/properties");
  const [openMenu, setOpenMenu] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mobileCityOpen, setMobileCityOpen] = React.useState(false);
  const [mobileNavOpen, setMobileNavOpen] = React.useState(null);
  const selectedCity = params.citySlug ? fromCitySlug(params.citySlug) : searchParams.get("city") || "Mumbai";
  const cityLabel = location.pathname === "/" ? "City" : selectedCity;

  const handleCitySelect = (label) => {
    setOpenMenu(null);
    setMobileCityOpen(false);
    setMobileMenuOpen(false);
    navigate(buildCityPath(label));
  };

  const handleMobileNavToggle = (label) => {
    setMobileNavOpen((current) => (current === label ? null : label));
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#F3F4F6] bg-white">
      {showTicker ? <div className="hidden sm:block"><ScrollingTicker /></div> : null}

      <div className="flex min-h-[64px] w-full items-center justify-between px-4 py-3 sm:h-[72px] sm:px-6 lg:px-12">
        <div className="flex items-center gap-3 sm:gap-6">
          <NavLink
            to="/"
            className="flex h-8 items-center whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold leading-8 tracking-[-0.6px] text-[#E51C23] sm:text-[24px]"
          >
            PropertySerch
          </NavLink>

          <div className="hidden sm:block">
            <CitySelector
              selectedCity={cityLabel}
              isOpen={openMenu === "city"}
              onEnter={() => {
                setOpenMenu("city");
              }}
              onLeave={() => {
                setOpenMenu(null);
              }}
              onSelect={handleCitySelect}
            />
          </div>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-6 text-base font-semibold lg:flex">
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
                setOpenMenu((current) => (current === item.label ? null : item.label));
              }}
            />
          ))}
        </nav>

        <div className="hidden h-10  items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <AccountMenu
              isOpen={openMenu === "account"}
              onEnter={() => setOpenMenu("account")}
              onLeave={() => setOpenMenu(null)}
              onLoggedOut={() => {
                setOpenMenu(null);
                navigate("/");
              }}
            />
          ) : (
            <NavLink
              to="/login"
              state={{ from: location }}
              className="inline-flex h-10 shrink-0 items-center gap-1 whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[14px] font-semibold leading-5 text-[#374151] transition hover:text-slate-950"
            >
              <span className="flex h-5 items-center justify-start">Login</span>
              <Chevron />
            </NavLink>
          )}

          <button className="cta-red inline-flex h-10 w-[171px] items-center justify-center gap-1 rounded-[12px] px-4 py-[10px] text-center text-[14px] font-bold leading-5 tracking-[0.002em] text-white">
            <span className="inline-flex h-5 w-[95px] items-center justify-center">Post Property</span>
            <span className="inline-flex h-4 w-10 items-center justify-center rounded-[2px] bg-[#F4B400] font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase leading-5 tracking-[0.0107em] text-[#111827]">
              FREE
            </span>
          </button>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-slate-200 lg:hidden"
          onClick={() => {
            setMobileMenuOpen((value) => !value);
          }}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <MenuIcon />
        </button>
      </div>

      <div className={mobileMenuOpen ? "border-t border-[#F3F4F6] px-4 py-4 sm:hidden" : "hidden"}>
        <div className="grid gap-3">
          <div className="rounded-[16px] bg-slate-50 px-4 py-4">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left"
              onClick={() => setMobileCityOpen((value) => !value)}
              aria-expanded={mobileCityOpen}
            >
              <span className="text-[14px] font-semibold text-[#374151]">City</span>
              <span className={mobileCityOpen ? "rotate-180 transition-transform" : "transition-transform"}>
                <Chevron />
              </span>
            </button>

            {mobileCityOpen ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {CITY_OPTIONS.map((city) => (
                  <button
                    key={city}
                    type="button"
                    onClick={() => handleCitySelect(city)}
                    className={[
                      "rounded-full px-3.5 py-2 text-[13px] font-semibold leading-4",
                    selectedCity === city ? "bg-[#E51C23] text-white" : "bg-white text-[#374151]",
                    ].join(" ")}
                  >
                    {city}
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          {navItems.map((item) => (
            <div
              key={item.label}
              className="rounded-[12px] border border-slate-200 px-4 py-3"
            >
              <button
                type="button"
                onClick={() => handleMobileNavToggle(item.label)}
                className="flex w-full items-center justify-between text-[14px] font-semibold text-[#374151]"
              >
                <span>{item.label}</span>
                <span className={mobileNavOpen === item.label ? "rotate-180 transition-transform" : "transition-transform"}>
                  <Chevron />
                </span>
              </button>

              {mobileNavOpen === item.label ? (
                <div className="mt-3 grid gap-2 rounded-[12px] bg-slate-50 p-3">
                  {(navDropdowns[item.label] || []).map((option) => {
                    const label = typeof option === "string" ? option : option.label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileNavOpen(null);
                        }}
                        className="rounded-[10px] px-3 py-2 text-left text-[13px] font-semibold text-[#374151] hover:bg-white hover:text-slate-950"
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          ))}

          {isAuthenticated ? (
            <div className="flex items-center justify-between gap-2 rounded-[12px] border border-slate-200 px-4 py-3">
              <div className="flex min-w-0 items-center gap-2">
                {user?.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={user?.fullName || "Account"}
                    className="h-7 w-7 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
                  />
                ) : (
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FDE8E8] text-[12px] font-extrabold text-[#E51C23]">
                    {initialOf(user?.fullName)}
                  </span>
                )}
                <span className="truncate text-[14px] font-semibold text-[#374151]">
                  {(user?.fullName || "Account").split(" ")[0]}
                </span>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                {canAccessConsole(user?.role) ? (
                  <a
                    href={CONSOLE_URL}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex h-8 items-center justify-center rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 text-[13px] font-semibold text-[#374151]"
                  >
                    Console
                  </a>
                ) : null}
                <button
                  type="button"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await logout();
                    navigate("/");
                  }}
                  className="shrink-0 text-[13px] font-bold text-red-500"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <NavLink
              to="/login"
              state={{ from: location }}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-[12px] border border-slate-200 px-4 py-3 text-[14px] font-semibold text-[#374151]"
            >
              <span>Login</span>
              <Chevron />
            </NavLink>
          )}

          <button className="cta-red inline-flex h-11 items-center justify-center gap-2 rounded-[12px] px-4 text-[14px] font-bold text-white">
            Post Property
            <span className="rounded-[2px] bg-[#F4B400] px-2 py-1 text-[10px] font-bold uppercase text-[#111827]">
              FREE
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default SiteHeader;
