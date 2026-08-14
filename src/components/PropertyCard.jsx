import React from "react";

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] font-extrabold uppercase leading-none tracking-[0.02em] text-[#111827] shadow-[0_2px_6px_rgba(15,23,42,0.08)]">
      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#E51C23] text-white">
        <svg aria-hidden="true" viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none">
          <path
            d="M2.5 6.2L4.8 8.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span>Verified</span>
    </span>
  );
}

function PropertyCard({ item }) {
  const isNewLaunch = item.badge === "NEW LAUNCH";

  return (
    <article className="h-[384px] overflow-hidden rounded-[20px] border border-slate-200 bg-white shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
      <div className={`relative h-[180px] overflow-hidden p-3 ${item.cardClass}`}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        <div className="absolute left-4 top-4">
          {isNewLaunch ? (
            <span className="inline-flex items-center rounded-full bg-[#E51C23] px-4 py-2 text-[12px] font-extrabold uppercase leading-none tracking-[0.02em] text-white shadow-[0_2px_6px_rgba(15,23,42,0.12)]">
              New Launch
            </span>
          ) : (
            <VerifiedBadge />
          )}
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
