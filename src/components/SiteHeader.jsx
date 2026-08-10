import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Mumbai", to: "/" },
  { label: "Buy", to: "/buy" },
  { label: "Rent", to: "/rent" },
  { label: "Sell", to: "/sell" },
  { label: "Services", to: "/services" },
  { label: "News & Guide", to: "/news-guide" },
  { label: "Login", to: "/login" },
];

function linkClass({ isActive }) {
  return [
    "inline-flex items-center gap-1.5 transition hover:text-slate-950",
    isActive ? "text-slate-950" : "text-slate-900",
  ].join(" ");
}

function Chevron() {
  return <span className="text-[11px] leading-none text-slate-500">⌄</span>;
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-6 shadow-sm md:px-10">
      <div className="flex h-[68px] items-center justify-between gap-6">
        <NavLink to="/" className="text-[28px] font-extrabold leading-none text-red-500">
          PropertySerch
        </NavLink>

        <nav className="flex flex-1 items-center justify-center gap-6 text-base font-semibold md:gap-9">
          {navItems.map((item) => (
            <NavLink key={item.label} to={item.to} className={linkClass}>
              {item.label}
              <Chevron />
            </NavLink>
          ))}
        </nav>

        <button className="inline-flex items-center gap-2 rounded-2xl bg-red-500 px-5 py-3 text-sm font-extrabold text-white shadow-[0_10px_22px_rgba(239,68,68,0.35)] transition hover:bg-red-600">
          <span>Post Property</span>
          <span className="rounded-sm bg-yellow-400 px-1.5 py-0.5 text-[10px] font-black uppercase leading-none text-red-700">
            FREE
          </span>
        </button>
      </div>
    </header>
  );
}

export default SiteHeader;
