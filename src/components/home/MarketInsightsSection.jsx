import React from "react";

// Engine 6 on a city page: real area trends and demand against supply from the
// market intelligence API. The page hides this section when a city has no
// scored areas yet. Always with the non-advisory disclaimer.

const TREND = { rising: ["Rising", "text-[#047857]"], stable: ["Stable", "text-[#374151]"], declining: ["Declining", "text-[#B91C1C]"] };

function DemandSupplyBars({ areas }) {
  const max = Math.max(1, ...areas.map((a) => Math.max(a.buyerRequirements + a.enquiries, a.liveListings)));
  return (
    <div className="space-y-3">
      {areas.map((a) => (
        <div key={a.locality}>
          <p className="text-[13px] font-semibold text-[#111827]" data-no-translate>{a.locality}</p>
          <div className="mt-1 space-y-1">
            <div className="h-2.5 rounded-full bg-[#111827]" style={{ width: `${Math.max(2, ((a.buyerRequirements + a.enquiries) / max) * 100)}%` }} title={`${a.buyerRequirements + a.enquiries} buyers`} />
            <div className="h-2.5 rounded-full bg-[#E51C23]" style={{ width: `${Math.max(2, (a.liveListings / max) * 100)}%` }} title={`${a.liveListings} listings`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MarketInsightsSection({ cityLabel, report }) {
  const areas = (report?.areas || []).slice(0, 5);
  if (!areas.length) return null;
  return (
    <section className="mx-auto w-full max-w-[1440px]">
      <div className="rounded-[28px] border border-[#E5E7EB] bg-white px-5 py-8 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:px-8">
        <h2 className="text-[30px] font-black leading-tight text-[#111827] sm:text-[34px]"><span data-no-translate>{cityLabel}</span> Market Insights</h2>
        <p className="mt-1 text-[16px] leading-6 text-[#6B7280]">
          From live listings, buyer activity and public market data
          {report.cityMedianPricePerSqft ? <> · median ₹{report.cityMedianPricePerSqft.toLocaleString("en-IN")} per sq ft</> : null}
          {report.indexYoyPercent != null ? <> · city price index {report.indexYoyPercent > 0 ? "+" : ""}{report.indexYoyPercent}% a year</> : null}
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <article className="rounded-[24px] border border-[#E5E7EB] p-6">
            <h3 className="text-[16px] font-bold text-[#111827] sm:text-[20px]">Price trend by area</h3>
            <ul className="mt-4 divide-y divide-[#F3F4F6]">
              {areas.map((a) => {
                const [label, tone] = TREND[a.trend] || ["Not enough data", "text-[#6B7280]"];
                return (
                  <li key={a.locality} className="flex items-center justify-between gap-3 py-3 text-[14px]">
                    <span className="min-w-0"><span className="block font-semibold text-[#111827]" data-no-translate>{a.locality}</span><span className="block text-[12px] text-[#6B7280]">{a.recommendation}</span></span>
                    <span className={`shrink-0 text-right font-bold ${tone}`}>{label}{a.trendPercent != null ? <span className="block text-[12px] font-medium">{a.trendPercent > 0 ? "+" : ""}{a.trendPercent}% a year</span> : null}</span>
                  </li>
                );
              })}
            </ul>
          </article>
          <article className="rounded-[24px] border border-[#E5E7EB] p-6">
            <h3 className="text-[16px] font-bold text-[#111827] sm:text-[20px]">Buyers against listings</h3>
            <div className="mt-4"><DemandSupplyBars areas={areas} /></div>
            <div className="mt-4 flex items-center gap-6 text-[12px] text-[#6B7280]">
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 bg-[#111827]" aria-hidden="true" />Active buyers</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 bg-[#E51C23]" aria-hidden="true" />Live listings</span>
            </div>
          </article>
        </div>
        <p className="mt-4 text-[11px] italic leading-4 text-[#6B7280]">{report.disclaimer}</p>
      </div>
    </section>
  );
}

export default MarketInsightsSection;
