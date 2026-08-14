import React from "react";

function GuideCard({ item }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-[46px] w-[64px] shrink-0 overflow-hidden rounded-[10px] border border-slate-200 bg-slate-100">
        {item.thumbImage ? (
          <img
            src={item.thumbImage}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>
      <div>
        <div className="text-sm font-extrabold leading-6 text-slate-900">{item.title}</div>
        <div className="mt-1 text-[11px] font-bold text-slate-400">{item.meta}</div>
      </div>
    </div>
  );
}

export default GuideCard;
