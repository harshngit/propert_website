import React from "react";

function SectionHeading({ title, subtitle, accent }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-5">
      <div>
        <h2 className="text-[28px] font-black leading-none text-slate-900">
          {title} {accent ? <span className="text-red-500">{accent}</span> : null}
        </h2>
        <p className="mt-1 text-slate-500">{subtitle}</p>
      </div>
      <button className="text-sm font-extrabold text-red-500 transition hover:text-red-600">
        View All -
      </button>
    </div>
  );
}

export default SectionHeading;
