import React from "react";

function SectionHeading({ title, subtitle, accent, className = "" }) {
  const wrapperClassName = className || "mb-5 mt-[40px] flex flex-wrap items-end justify-between gap-5";

  return (
    <div className={wrapperClassName}>
      <div>
        <h2 className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-9 tracking-[0.002em] text-[#111827]">
          {title} {accent ? <span className="text-red-500">{accent}</span> : null}
        </h2>
        <p className="mt-1 font-['Plus_Jakarta_Sans'] text-[16px] font-normal leading-6 text-[#6B7280]">
          {subtitle}
        </p>
      </div>
      <button className="inline-flex h-6 w-[77.5px] flex-nowrap items-center gap-2 whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-6 tracking-[0.0049em] text-[#E51C23] transition hover:text-red-600">
        <span className="inline-flex h-6 w-[62px] shrink-0 items-center justify-center whitespace-nowrap text-center">
          View All
        </span>
        <img
          src="/images/Img%20(1).png"
          alt=""
          aria-hidden="true"
          className="h-[12px] w-[7.5px] shrink-0 object-contain"
        />
      </button>
    </div>
  );
}

export default SectionHeading;
