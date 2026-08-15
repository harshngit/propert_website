import React from "react";

function CompanyFooterSection() {
  const columns = [
    {
      title: "Platform",
      items: ["Post Property", "Post Requirements", "Broker CRM", "Property Management", "Institutional Marketplace"],
    },
    {
      title: "Services",
      items: ["Home Loans & Financing", "Legal Assistance", "Special Situation Properties", "Fractional Ownership", "Investment Intelligence"],
    },
    {
      title: "Partner with us",
      items: ["Become a Broker Partner", "Become a Builder Partner", "Become a Franchise Partner", "Institutional Partnerships", "Media & Press"],
    },
  ];

  const socials = [
    { alt: "Facebook", src: "/images/fb.png" },
    { alt: "X", src: "/images/X.png" },
    { alt: "Instagram", src: "/images/insta.png" },
    { alt: "LinkedIn", src: "/images/linkdin.png" },
  ];

  return (
    <div className="mt-12 border-t border-slate-100">
      <div className="px-4 pt-10 sm:px-6 lg:px-12">
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
                {column.items.map((item) => (
                  <div key={item}>{item}</div>
                ))}
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
              <span className="whitespace-nowrap">TERMS OF SERVICE</span>
              <span className="whitespace-nowrap">PRIVACY POLICY</span>
              <span className="col-span-2 whitespace-nowrap md:col-span-1">RERA COMPLIANCE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyFooterSection;
