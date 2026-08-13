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
    <div className="mt-12 border-t border-slate-100 pt-10">
      <div className="grid gap-8 xl:grid-cols-[1.2fr_repeat(3,1fr)]">
        <div>
          <div className="text-[28px] font-black text-[#E51C23]">PropertySerch</div>
          <div className="mt-2 text-[14px] text-slate-500">Wholly owned by A R Buildwel</div>
          <p className="mt-5 text-[14px] max-w-[340px] leading-7 text-slate-500">
            Beyond Listings. Built for Deals. A Real Estate Transaction Operating System, wholly
            owned by A R Buildwel, G-53, Vardhman Location Plaza-II, Rajouri Garden, New Delhi -
            110027
          </p>

          <div className="mt-8 flex items-center gap-3">
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
            <div className="text-[14px] font-black text-slate-900">{column.title}</div>
            <div className="mt-4 text-[14px] grid gap-3 text-slate-500">
              {column.items.map((item) => (
                <div key={item}>{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-11 mb-11 text-[10px] border-t border-slate-100 pt-5">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs tracking-[0.04em] text-slate-400">
          <div>(c) 2026 A R Buildwel · PropertySerch.com · G-53, Vardhman Location Plaza-II, Rajouri Garden, New Delhi - 110027</div>
          <div className="flex flex-wrap gap-5">
            <span>TERMS OF SERVICE</span>
            <span>PRIVACY POLICY</span>
            <span>RERA COMPLIANCE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyFooterSection;
