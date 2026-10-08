import React from "react";

// The nine stages of an institutional deal, with the current one marked.
function InstitutionalStageTracker({ deal, compact = false }) {
  return (
    <ol className={`grid gap-1.5 ${compact ? "grid-cols-3 sm:grid-cols-9" : "grid-cols-3 md:grid-cols-9"}`} aria-label="Deal stages">
      {deal.stages.map((s) => (
        <li
          key={s.value}
          aria-current={s.current ? "step" : undefined}
          className={`rounded-[10px] px-2 py-2 text-center text-[11px] font-semibold leading-tight ${s.done ? "bg-[#ECFDF5] text-[#065F46]" : s.current ? "bg-[#E51C23] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}
        >
          <span className="block text-[10px] opacity-80">{s.number}</span>
          {s.label}
        </li>
      ))}
    </ol>
  );
}

export default InstitutionalStageTracker;
