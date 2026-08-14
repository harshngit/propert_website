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
      avatarImage: "/images/avatar-1.jpg.png",
    },
    {
      quote:
        "The market insight panels are the only reason I'm moving my whole portfolio tracking to PropertySerch.",
      name: "Karthik Menon",
      role: "Independent Investor",
      avatarImage: "/images/avatar-2.jpg.png",
    },
    {
      quote:
        "I listed on a Tuesday and had four verified, budget-matched parties by Thursday. No spam calls at all.",
      name: "Deepa Iyer",
      role: "Owner, Luxury Villa",
      avatarImage: "/images/avatar-3.jpg.png",
    },
    {
      quote:
        "We leased 25,000 sq.ft through the institutional desk. The diligence pack alone saved us weeks of legal work.",
      name: "Rahul Sethi",
      role: "Director, Tech Global",
      avatarImage: "/images/avatar-4.jpg.png",
    },
  ];

  return (
    <div className="mt-12 px-0">
      <div className="mx-auto max-w-full">
        <h3 className="text-[36px] font-black leading-tight text-[#E51C23] md:text-[34px]">
          Testimonials
        </h3>
        <p className="mt-1 text-[16px] text-slate-500">Trusted by owners, buyers and institutions</p>

        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scroll-smooth md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-4">
          {testimonials.map((item) => (
            <article
              key={item.name}
              className="min-w-[82vw] shrink-0 rounded-[26px] border border-[#dfe6f3] bg-white px-6 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] md:min-w-0 md:w-full"
            >
              <div className="text-[16px] leading-none tracking-[2px] text-[#f4b400]">
                &#9733;&#9733;&#9733;&#9733;&#9733;
              </div>
              <p className="mt-4 min-h-[128px] max-w-[255px] overflow-hidden text-[12px] italic leading-7 text-[#525b6a] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:max-w-none sm:[display:block] sm:[-webkit-box-orient:initial] sm:[-webkit-line-clamp:unset] sm:overflow-visible">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                  {item.avatarImage ? (
                    <img
                      src={item.avatarImage}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>
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
        <div className="mx-auto grid max-w-full gap-10 xl:grid-cols-[1.1fr_1fr_1fr]">
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
            <div className="mx-auto mt-6 grid w-full max-w-[520px] grid-cols-2 gap-x-3 gap-y-3">
              {searchTags.map((tag) => (
                <span
                  key={tag}
                  className="flex w-full items-center justify-center whitespace-nowrap rounded-full border border-[#d7dfee] bg-[#F3F4F6] px-4 py-2 text-center text-[13px] leading-5 text-[#4B5563]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[18px] font-black text-[#0f172a]">Why PropertySerch</h4>
            <div className="mx-auto mt-6 grid w-full max-w-[520px] gap-3">
              {whyItems.map((item) => (
                <div
                  key={item}
                  className="flex w-full items-center justify-center rounded-full border border-[#d7dfee] bg-[#F3F4F6] px-4 py-2 text-center text-[13px] font-normal leading-5 text-[#4B5563]"
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
