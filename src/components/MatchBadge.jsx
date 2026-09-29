import React, { useEffect, useRef, useState } from "react";

// Sec. 7.3 match badge: "96% Match", colour-coded green > 90, yellow 70-90,
// orange 50-70, red < 50; click for the parameter-wise breakdown.

const LABELS = { location: "Location", budget: "Budget", type: "Property type", area: "Area / size", amenities: "Amenities" };

export function matchToneClass(score) {
  if (score > 90) return "bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]";
  if (score >= 70) return "bg-[#FEF9C3] text-[#854D0E] border-[#FDE68A]";
  if (score >= 50) return "bg-[#FFEDD5] text-[#9A3412] border-[#FED7AA]";
  return "bg-[#FEE2E2] text-[#991B1B] border-[#FECACA]";
}

function MatchBadge({ score, tier, breakdown, className = "" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);
  if (score == null) return null;
  const s = Math.round(Number(score));
  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 font-['Plus_Jakarta_Sans'] text-[12px] font-extrabold ${matchToneClass(s)}`}
        title="See why this matches"
      >
        {tier === "hot" ? "🔥 " : ""}
        {s}% Match
      </button>
      {open && breakdown && (
        <span className="absolute left-0 z-40 mt-1 block w-[260px] rounded-[14px] border border-[#E5E7EB] bg-white p-3 text-left shadow-[0_12px_30px_rgba(15,23,42,0.14)]">
          <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Why it matches</span>
          {Object.entries(breakdown).map(([k, v]) => (
            <span key={k} className="mb-2 block last:mb-0">
              <span className="flex items-center justify-between text-[12px]">
                <span className="font-semibold text-[#111827]">{LABELS[k] || k}</span>
                <span className="text-[#6B7280]">{v.score}%</span>
              </span>
              <span className="mt-1 block h-1 rounded-full bg-[#F3F4F6]">
                <span className="block h-1 rounded-full bg-[#E51C23]" style={{ width: `${v.score}%` }} />
              </span>
              {v.detail && <span className="mt-0.5 block text-[11px] text-[#6B7280]">{v.detail}</span>}
            </span>
          ))}
        </span>
      )}
    </span>
  );
}

export default MatchBadge;
