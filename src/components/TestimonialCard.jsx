import React from "react";

function TestimonialCard({ item }) {
  return (
    <article className="rounded-[24px] border border-slate-200 bg-white p-[22px] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <div className="text-[18px] tracking-[2px] text-amber-500">★★★★★</div>
      <p className="mt-4 min-h-[112px] italic leading-7 text-slate-500">{item.quote}</p>
      <div className="mt-4 flex items-center gap-3">
        <div className={`h-[38px] w-[38px] rounded-full ${item.avatarClass}`} />
        <div>
          <div className="text-[15px] font-extrabold text-slate-900">{item.name}</div>
          <div className="text-xs text-slate-400">{item.role}</div>
        </div>
      </div>
    </article>
  );
}

export default TestimonialCard;
