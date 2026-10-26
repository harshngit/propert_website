import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

// Engine 6: the area's market outlook on a property page - price trend,
// investment potential and a plain-words recommendation, with the
// non-advisory disclaimer. Hidden when the area has too little data.

const TREND = { rising: ["Rising", "text-[#047857]"], stable: ["Stable", "text-[#374151]"], declining: ["Declining", "text-[#B91C1C]"] };

export default function AreaOutlook({ city, locality }) {
  const [a, setA] = useState(null);
  useEffect(() => {
    if (!city) return undefined;
    let alive = true;
    apiRequest(`/market-intel/area?city=${encodeURIComponent(city)}&locality=${encodeURIComponent(locality || "")}`)
      .then((r) => alive && setA(r.data))
      .catch(() => alive && setA(null));
    return () => {
      alive = false;
    };
  }, [city, locality]);
  if (!a || a.potentialScore === null || a.potentialScore === undefined) return null;
  const [trendLabel, trendTone] = TREND[a.trend] || ["Not enough data", "text-[#6B7280]"];
  return (
    <section className="mt-8 w-full rounded-[16px] border border-[#E5E7EB] p-5 lg:max-w-[1024px]">
      <h2 className="text-[18px] font-extrabold text-[#111827]">Area outlook: <span data-no-translate>{a.locality || locality || city}</span></h2>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div><p className="text-[12px] text-[#6B7280]">Price trend</p><p className={`text-[15px] font-bold ${trendTone}`}>{trendLabel}{a.trendPercent !== null && a.trendPercent !== undefined ? ` (${a.trendPercent > 0 ? "+" : ""}${a.trendPercent}%/yr)` : ""}</p></div>
        <div><p className="text-[12px] text-[#6B7280]">Investment potential</p><p className="text-[15px] font-bold text-[#111827]">{a.potentialScore}/100</p></div>
        <div><p className="text-[12px] text-[#6B7280]">Rental yield</p><p className="text-[15px] font-bold text-[#111827]">{a.rentalYieldPercent !== null && a.rentalYieldPercent !== undefined ? `${a.rentalYieldPercent}%` : "—"}</p></div>
        <div><p className="text-[12px] text-[#6B7280]">Liquidity</p><p className="text-[15px] font-bold capitalize text-[#111827]">{a.liquidity || "—"}</p></div>
      </div>
      <p className="mt-3 text-[14px] text-[#374151]">{a.summary}</p>
      <p className="mt-2 text-[11px] italic leading-4 text-[#6B7280]">{a.disclaimer}</p>
    </section>
  );
}
