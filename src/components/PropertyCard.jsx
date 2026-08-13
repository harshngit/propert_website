import React from "react";

function PropertyCard({ item }) {
  return (
    <article className="h-[384px] overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
      <div className={`relative h-[180px] p-3 ${item.cardClass}`}>
        <div
          className={`absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-[10px] px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.04em] ${
            item.badge === "NEW LAUNCH" ? "bg-[#C99A2E] text-white" : "bg-[#23B5D0] text-white"
          }`}
        >
          {item.badge}
        </div>
      </div>

      <div className="p-4 pb-[14px]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="font-['Plus_Jakarta_Sans'] text-[24px] font-black leading-none text-slate-900">
              {item.price}
            </div>
            <div className="mt-2 font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-slate-700">
              {item.title}
            </div>
          </div>
          <div className="whitespace-nowrap pt-1 font-['Plus_Jakarta_Sans'] text-[12px] text-slate-500">
            {item.rate}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <img
            src="/images/pin%20icon.png"
            alt=""
            aria-hidden="true"
            className="h-[16px] w-[12px] shrink-0 object-contain"
          />
          <span>{item.location}</span>
        </div>

        <div className="mt-5 flex items-center gap-6 border-t border-slate-100 pt-3 text-[12px] font-bold leading-none text-slate-500">
          <div className="inline-flex items-center gap-1">
            <img
              src="/images/bhk.png"
              alt=""
              aria-hidden="true"
              className="h-[15px] w-[15px] shrink-0 object-contain"
            />
            <span>{item.details}</span>
          </div>

          <div className="inline-flex items-center gap-1">
            <img
              src="/images/Vector.png"
              alt=""
              aria-hidden="true"
              className="h-[12px] w-[12px] shrink-0 object-contain"
            />
            <span>{item.area}</span>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-[5px] text-[11.5px] font-semibold leading-none text-[#2563EB]">
          <span className="h-[6px] w-[6px] rounded-full bg-sky-500" aria-hidden="true" />
          <span>Message via Platform</span>
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;
