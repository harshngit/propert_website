import React from "react";
import GuideCard from "../GuideCard";
import { footerColumns, guideItems, searchTags, whyItems } from "../../data/homeContent";

function ResourcesFooterSection() {
  return (
    <>
      <div className="h-11" />

      <div className="border-t border-slate-100 pt-9">
        <div className="grid gap-9 xl:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <h3 className="text-[20px] font-black text-slate-900">Popular Real Estate Guides</h3>
            <div className="mt-5 grid gap-4">
              {guideItems.map((item) => (
                <GuideCard key={item.title} item={item} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[20px] font-black text-slate-900">Popular Searches</h3>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {searchTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-[12px] text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[20px] font-black text-slate-900">Why PropertySerch</h3>
            <div className="mt-5 grid gap-3">
              {whyItems.map((item) => (
                <div
                  key={item}
                  className="rounded-full border border-slate-200 px-4 py-3 text-center font-bold text-slate-600"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-11 border-t border-slate-100 pt-8">
          <div className="grid gap-8 xl:grid-cols-[1.2fr_repeat(3,1fr)]">
            <div>
              <div className="text-[28px] font-black text-red-500">PropertySerch</div>
              <div className="mt-2 text-sm text-slate-500">Wholly owned by A R Buildwel</div>
              <p className="mt-4 max-w-[340px] leading-7 text-slate-500">
                Beyond Listings. Built for Deals. A Real Estate Transaction Operating System,
                wholly owned by A R Buildwel, G-53, Vardhman Location Plaza-II, Rajouri Garden,
                New Delhi - 110027
              </p>
            </div>

            {footerColumns.map((column) => (
              <div key={column.title}>
                <div className="text-[18px] font-black text-slate-900">{column.title}</div>
                <div className="mt-4 grid gap-3 text-slate-500">
                  {column.items.map((item) => (
                    <div key={item}>{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4 text-xs tracking-[0.04em] text-slate-400">
            <div>(c) 2026 PROPERTYSERCH. ALL RIGHTS RESERVED.</div>
            <div className="flex flex-wrap gap-5">
              <span>TERMS OF SERVICE</span>
              <span>PRIVACY POLICY</span>
              <span>RERA COMPLIANCE</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResourcesFooterSection;
