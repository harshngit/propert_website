import React from "react";

function PropertyCard({ item }) {
  return (
    <article className="overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
      <div className={`relative h-[180px] p-3 ${item.cardClass}`}>
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.04em] ${
            item.badge === "NEW LAUNCH" ? "bg-rose-500 text-white" : "bg-white text-slate-900"
          }`}
        >
          <span className={`h-2 w-2 rounded-full ${item.badge === "NEW LAUNCH" ? "bg-white" : "bg-red-500"}`} />
          {item.badge}
        </div>
      </div>

      <div className="p-4 pb-[14px]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[28px] font-black leading-none text-slate-900">{item.price}</div>
            <div className="mt-2 text-[15px] font-bold text-slate-700">{item.title}</div>
          </div>
          <div className="whitespace-nowrap pt-1 text-[13px] text-slate-500">{item.rate}</div>
        </div>

        <div className="mt-2 text-sm text-slate-500">
          <span className="text-slate-400">-</span> {item.location}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-[13px] font-bold text-slate-500">
          <span>{item.details}</span>
          <span>{item.area}</span>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
