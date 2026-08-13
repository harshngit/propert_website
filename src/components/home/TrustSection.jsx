import React from "react";
import GuideCard from "../GuideCard";
import { guideItems, searchTags, whyItems } from "../../data/homeContent";

function TrustSection() {
  const testimonials = [
    {
      quote:
        "Every document was already verified before I visited. What normally takes three months closed in exactly two weeks.",
      name: "Priya Nair",
      role: "VP, Digital at HDFC Bank",
      avatarClass: "bg-gradient-to-br from-slate-300 to-slate-500",
    },
    {
      quote:
        "The market insight panels are the only reason I&apos;m moving my whole portfolio tracking to PropertySerch.",
      name: "Karthik Menon",
      role: "Independent Investor",
      avatarClass: "bg-gradient-to-br from-sky-400 via-fuchsia-400 to-pink-400",
    },
    {
      quote:
        "I listed on a Tuesday and had four verified, budget-matched parties by Thursday. No spam calls at all.",
      name: "Deepa Iyer",
      role: "Owner, Luxury Villa",
      avatarClass: "bg-gradient-to-br from-pink-200 via-amber-100 to-yellow-200",
    },
    {
      quote:
        "We leased 25,000 sq.ft through the institutional desk. The diligence pack alone saved us weeks of legal work.",
      name: "Rahul Sethi",
      role: "Director, Tech Global",
      avatarClass: "bg-gradient-to-br from-stone-300 to-stone-500",
    },
  ];

  return (
    <div className="mt-12 px-0">
      <div className="mx-auto max-w-[full] ">
        <h3 className="text-[36px] font-black leading-tight text-[#E51C23] md:text-[34px]">
          Testimonials
        </h3>
        <p className="mt-1 text-[16px] text-slate-500">Trusted by owners, buyers and institutions</p>

        <div className="mt-6 grid gap-4 xl:grid-cols-4">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="rounded-[26px] border border-[#dfe6f3] bg-white px-6 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
            >
              <div className="text-[16px] leading-none tracking-[2px] text-[#f4b400]">★★★★★</div>
              <p className="mt-4 text-[12px] min-h-[128px] italic leading-7 text-[#525b6a]">“{item.quote}”</p>
              <div className="mt-5 flex items-center gap-3">
                <div className={`h-10 w-10 rounded-full ${item.avatarClass}`} />
                <div>
                  <div className="text-[14px] font-extrabold text-[#0f172a]">{item.name}</div>
                  <div className="text-[10px] text-slate-500">{item.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-12 border-t border-slate-100 pt-12">
        <div className="mx-auto grid max-w-[full] gap-10  xl:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <h4 className="text-[18px] font-black text-[#0f172a]">Popular Real Estate Guides</h4>
            <div className="mt-6 grid gap-5">
              {guideItems.map((item) => (
                <GuideCard key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[18px] font-black text-[#0f172a]">Popular Searches</h4>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {searchTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#d7dfee] px-4 py-2 text-[13px] text-[#4B5563] bg-[#F3F4F6]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[18px] font-black text-[#0f172a]">Why PropertySerch</h4>
            <div className="mt-6 grid gap-3">
              {whyItems.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-[#d7dfee] bg-white px-4 py-3 text-center text-[16px] font-semibold text-[#5b6b86]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrustSection;
