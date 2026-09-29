import React from "react";
import { Link } from "react-router-dom";

function CompanyFooterSection({ className = "" }) {
  // Footer links go to the page for each item; items whose page / module
  // isn't live yet (e.g. Media & Press) render as plain text.
  const CONSOLE_URL = "https://property-dashboard-one-navy.vercel.app/";
  const columns = [
    {
      title: "Platform",
      items: [
        { label: "Post Property", to: "/sell/list-property" },
        { label: "Post Requirements", to: "/post-requirement" },
        { label: "Broker CRM", href: CONSOLE_URL },
        { label: "Property Management", to: "/account/investor-profile" },
        { label: "Institutional Marketplace", to: "/buy/institutional-properties" },
      ],
    },
    {
      title: "Services",
      items: [
        { label: "Bank Auction Properties", to: "/buy/bank-auction-properties" },
        { label: "Special Situation Properties", to: "/buy/special-situation-properties" },
        { label: "For NRIs", to: "/for-nri" },
        { label: "For HNI Investors", to: "/for-hni" },
        { label: "Investment Calculators", to: "/tools" },
        { label: "Legal & Compliance", to: "/legal" },
      ],
    },
    {
      title: "Partner with us",
      items: [
        { label: "Become a Broker Partner", to: "/services/get-involved" },
        { label: "Become a Builder Partner", to: "/services/get-involved" },
        { label: "Become a Franchise Partner", to: "/services/get-involved" },
        { label: "Request Your City", to: "/services/get-involved" },
        { label: "Media & Press" },
      ],
    },
  ];

  const socials = [
    { alt: "Facebook", src: "/icons/fb.png" },
    { alt: "X", src: "/icons/X.png" },
    { alt: "Instagram", src: "/icons/insta.png" },
    { alt: "LinkedIn", src: "/icons/linkdin.png" },
  ];

  return (
    <div className={["mt-12 border-t border-slate-100", className].filter(Boolean).join(" ")}>
      <div className="px-4 pt-8 sm:px-6 lg:px-12">
        <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_repeat(3,1fr)]">
          <div>
            <div className="text-[24px] font-black text-[#E51C23] sm:text-[28px]">PropertySerch</div>
            <div className="mt-2 text-[14px] text-slate-500">Wholly owned by A R Buildwel</div>
            <p className="mt-5 max-w-[340px] text-[14px] leading-7 text-slate-500">
              Beyond Listings. Built for Deals. A Real Estate Transaction Operating System, wholly
              owned by A R Buildwel, G-53, Vardhman Location Plaza-II, Rajouri Garden, New Delhi -
              110027
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              {socials.map((item) => (
                <img
                  key={item.alt}
                  src={item.src}
                  alt={item.alt}
                  className="h-5 w-5 object-cover"
                />
              ))}
            </div>
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <div className="text-[14px] font-black text-slate-900 sm:text-[16px]">{column.title}</div>
              <div className="mt-4 grid gap-3 text-[14px] text-slate-500">
                {column.items.map((item) =>
                  item.to ? (
                    <Link key={item.label} to={item.to} className="transition hover:text-slate-900">
                      {item.label}
                    </Link>
                  ) : item.href ? (
                    <a key={item.label} href={item.href} target="_blank" rel="noreferrer" className="transition hover:text-slate-900">
                      {item.label}
                    </a>
                  ) : (
                    <div key={item.label}>{item.label}</div>
                  )
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-11 mb-11 border-t border-slate-100 pt-5 text-[10px]">
          <div className="flex flex-col gap-4 text-[10px] tracking-[0.04em] text-slate-400 sm:text-xs md:flex-row md:items-center md:justify-between">
            <div className="max-w-[760px]">
              (c) 2026 A R Buildwel &middot; PropertySerch.com &middot; G-53, Vardhman Location Plaza-II,
              Rajouri Garden, New Delhi - 110027
            </div>
            <div className="grid grid-cols-2 gap-x-5 gap-y-2 md:flex md:flex-wrap">
              <Link to="/legal#terms" className="whitespace-nowrap transition hover:text-slate-600">
                TERMS OF SERVICE
              </Link>
              <Link to="/legal#privacy" className="whitespace-nowrap transition hover:text-slate-600">
                PRIVACY POLICY
              </Link>
              <Link
                to="/legal#rera"
                className="col-span-2 whitespace-nowrap transition hover:text-slate-600 md:col-span-1"
              >
                RERA COMPLIANCE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyFooterSection;
