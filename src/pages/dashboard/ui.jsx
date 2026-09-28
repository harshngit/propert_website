import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

// Small shared building blocks for the My Dashboard sections - same type,
// colours and radii as the rest of the site.

export const inputClass =
  "mt-1 h-[42px] w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 font-['Plus_Jakarta_Sans'] text-[14px] text-[#111827] outline-none transition focus:border-[#E51C23]";
export const labelClass = "block font-['Plus_Jakarta_Sans'] text-[13px] font-semibold text-[#374151]";
export const primaryButton =
  "cta-red inline-flex h-[42px] items-center justify-center rounded-[12px] px-5 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white disabled:opacity-60";
export const secondaryButton =
  "inline-flex h-[42px] items-center justify-center rounded-[12px] border border-[#E5E7EB] bg-white px-4 font-['Plus_Jakarta_Sans'] text-[14px] font-semibold text-[#374151] transition hover:border-[#D1D5DB] hover:bg-slate-50 disabled:opacity-60";
export const linkButton = "font-['Plus_Jakarta_Sans'] text-[13px] font-bold text-[#E51C23] transition hover:text-red-700 disabled:opacity-50";

export const CITY_SUGGESTIONS = [
  "Delhi", "Gurugram", "Noida", "Greater Noida", "Ghaziabad", "Faridabad", "Mumbai", "Navi Mumbai", "Thane", "Pune",
  "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Chandigarh", "Lucknow", "Indore", "Kochi",
];

export const PROPERTY_TYPES = [
  { value: "apartment", label: "Apartment / Flat" },
  { value: "independent_house", label: "Independent House" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot" },
  { value: "commercial", label: "Commercial" },
  { value: "farmhouse", label: "Farmhouse" },
  { value: "other", label: "Other" },
];

export const typeLabel = (value) => PROPERTY_TYPES.find((t) => t.value === value)?.label || (value ? value.replace(/_/g, " ") : "Any property");

export function formatINR(value) {
  const n = Number(value);
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n >= 1e7) return `₹${Number((n / 1e7).toFixed(2))} Cr`;
  if (n >= 1e5) return `₹${Number((n / 1e5).toFixed(2))} L`;
  return `₹${n.toLocaleString("en-IN")}`;
}

export function formatDate(value, withTime = false) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}

export const monthLabel = (value) => new Date(value).toLocaleString("en-IN", { month: "long", year: "numeric" });

// Loads data with the signed-in token; `reload` re-runs it after a change.
export function useLoad(loader, deps = []) {
  const { accessToken } = useAuth();
  const [state, setState] = useState({ loading: true, error: null, data: null });
  const run = useCallback(() => {
    if (!accessToken) return Promise.resolve();
    setState((s) => ({ ...s, loading: true, error: null }));
    return loader(accessToken)
      .then((data) => setState({ loading: false, error: null, data }))
      .catch((err) => setState({ loading: false, error: err.message || "Something went wrong", data: null }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, ...deps]);
  useEffect(() => {
    run();
  }, [run]);
  return { ...state, reload: run };
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-tight text-[#111827] sm:text-[28px]">{title}</h1>
        {subtitle && <p className="mt-1 max-w-[640px] font-['Plus_Jakarta_Sans'] text-[14px] leading-6 text-[#6B7280]">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`rounded-[18px] border border-[#E5E7EB] bg-white p-5 shadow-[0_8px_20px_rgba(15,23,42,0.04)] ${className}`}>{children}</div>;
}

export function StatCard({ label, value, hint, onClick }) {
  const Tag = onClick ? "button" : "div";
  return (
    <Tag
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className="rounded-[16px] border border-[#E5E7EB] bg-white p-4 text-left shadow-[0_6px_16px_rgba(15,23,42,0.04)] transition hover:border-[#FCA5A5]"
    >
      <p className="font-['Plus_Jakarta_Sans'] text-[12px] font-bold uppercase tracking-[0.06em] text-[#9CA3AF]">{label}</p>
      <p className="mt-1 font-['Plus_Jakarta_Sans'] text-[26px] font-black leading-none text-[#111827]">{value ?? "-"}</p>
      {hint && <p className="mt-1 text-[12px] text-[#6B7280]">{hint}</p>}
    </Tag>
  );
}

const BADGE_TONES = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-800",
  amber: "border-amber-200 bg-amber-50 text-amber-800",
  red: "border-red-200 bg-red-50 text-red-700",
  blue: "border-sky-200 bg-sky-50 text-sky-800",
  gray: "border-slate-200 bg-slate-50 text-slate-600",
};

const STATUS_TONE = {
  approved: "green", confirmed: "green", completed: "green", resolved: "green", active: "green", fulfilled: "green", won: "green",
  pending_approval: "amber", pending: "amber", reported: "amber", due: "amber", scheduled: "blue", in_progress: "blue", notice: "amber", paused: "gray", open: "blue",
  rejected: "red", disputed: "red", cancelled: "gray", no_show: "red", inactive: "gray", ended: "gray", closed: "gray", lost: "gray",
  hot: "red", warm: "amber", cold: "blue",
};

const STATUS_TEXT = {
  pending_approval: "Pending approval",
  approved: "Live",
  inactive: "Closed",
  in_progress: "In progress",
  no_show: "No show",
  reported: "Awaiting owner",
};

export function Badge({ status, children, tone }) {
  const t = tone || STATUS_TONE[status] || "gray";
  const text = children || STATUS_TEXT[status] || String(status || "").replace(/_/g, " ");
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-['Plus_Jakarta_Sans'] text-[11px] font-bold capitalize ${BADGE_TONES[t]}`}>
      {text}
    </span>
  );
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="rounded-[18px] border border-dashed border-[#E5E7EB] bg-[#FAFAFA] px-6 py-10 text-center">
      <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">{title}</p>
      {body && <p className="mx-auto mt-1 max-w-[440px] text-[14px] leading-6 text-[#6B7280]">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function LoadState({ loading, error, onRetry }) {
  if (loading) return <p className="py-10 text-center text-[14px] text-[#6B7280]">Loading…</p>;
  if (error)
    return (
      <div className="rounded-[14px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">
        {error}{" "}
        {onRetry && (
          <button type="button" onClick={onRetry} className="font-bold underline">
            Try again
          </button>
        )}
      </div>
    );
  return null;
}

export function Notice({ tone = "green", children }) {
  const tones = {
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    red: "border-red-200 bg-red-50 text-red-700",
    amber: "border-amber-200 bg-amber-50 text-amber-800",
  };
  return <div className={`rounded-[12px] border px-4 py-3 text-[14px] ${tones[tone]}`}>{children}</div>;
}

export function Modal({ open, title, onClose, children, width = "max-w-[520px]" }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-10" onClick={onClose}>
      <div className={`w-full ${width} rounded-[18px] bg-white p-6 shadow-xl`} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold text-[#111827]">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[#6B7280] hover:text-[#111827]">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Professional fee consent + mandate type - required on every posted
// property and requirement (Annexure A mandate rules).
export function FeeConsent({ kind, mandateType, onMandateType, consent, onConsent }) {
  const exclusiveTerm = kind === "listing" ? "6 months" : "90 days";
  return (
    <div className="rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] p-4">
      <p className={labelClass}>Mandate type</p>
      <div className="mt-2 grid gap-2 sm:grid-cols-2">
        {[
          { value: "standard", title: "Standard", body: "We share your " + (kind === "listing" ? "property with verified buyers / tenants" : "requirement with matching listings") + "." },
          {
            value: "exclusive",
            title: `Exclusive (${exclusiveTerm})`,
            body: "A dedicated representative handles everything end to end, with priority matching.",
          },
        ].map((option) => (
          <label
            key={option.value}
            className={`cursor-pointer rounded-[12px] border bg-white p-3 transition ${
              mandateType === option.value ? "border-[#E51C23] ring-1 ring-[#E51C23]" : "border-[#E5E7EB]"
            }`}
          >
            <input type="radio" className="sr-only" checked={mandateType === option.value} onChange={() => onMandateType(option.value)} />
            <span className="block text-[14px] font-bold text-[#111827]">{option.title}</span>
            <span className="mt-0.5 block text-[12px] leading-5 text-[#6B7280]">{option.body}</span>
          </label>
        ))}
      </div>
      <label className="mt-3 flex items-start gap-2 text-[13px] leading-5 text-[#374151]">
        <input type="checkbox" checked={consent} onChange={(e) => onConsent(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#E51C23]" />
        <span>
          I agree to A R Buildwel's professional fee of 1% + GST on a completed sale (one month's rent + GST on a completed rental), payable
          only on closure. All contact happens through my A R Buildwel representative.
        </span>
      </label>
    </div>
  );
}
