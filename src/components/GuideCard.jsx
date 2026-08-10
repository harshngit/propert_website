import React from "react";

function GuideCard({ item }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`h-[46px] w-[64px] shrink-0 rounded-[10px] border border-slate-200 ${item.thumbClass}`} />
      <div>
        <div className="text-sm font-extrabold leading-6 text-slate-900">{item.title}</div>
        <div className="mt-1 text-[11px] font-bold text-slate-400">{item.meta}</div>
      </div>
    </div>
  );
}

export default GuideCard;
