import React, { useEffect, useRef, useState } from "react";
import { portal } from "../../api/portal";
import { getDisclaimers } from "../../api/content";
import { inputClass, labelClass, linkButton, secondaryButton } from "./ui";

// Module 46 consent block (Screens 4 / 5), three steps in order:
//   1. Professional fee consent - read to the end, tick, confirm by OTP
//      (non-skippable; the server issues a one-time consentToken)
//   2. Mandate type - Exclusive (price / budget range, both mandatory) or
//      Standard
//   3. Submit - the parent form enables it once `value.ready` is true
// `value` = { consentToken, mandateType, priceRange, ready }.
export const EMPTY_CONSENT = { consentToken: null, mandateType: null, priceRange: null, ready: false };

const toRupees = (lakh) => (lakh === "" || lakh == null ? null : Math.round(Number(lakh) * 1e5));

export default function FeeConsent({ kind, accessToken, value, onChange }) {
  const seller = kind === "listing";
  const [terms, setTerms] = useState(null);
  const [disclaimers, setDisclaimers] = useState([]);
  const [readToEnd, setReadToEnd] = useState(false);
  const [ticked, setTicked] = useState(false);
  const [otpSentTo, setOtpSentTo] = useState(null);
  const [devOtp, setDevOtp] = useState(null);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [range, setRange] = useState({ min: "", max: "" });
  const scrollRef = useRef(null);

  useEffect(() => {
    portal.consentTerms(accessToken).then(setTerms).catch((e) => setError(e.message));
    getDisclaimers(["mandate"]).then((d) => setDisclaimers(d || [])).catch(() => setDisclaimers([]));
  }, [accessToken]);

  // Short text that needs no scrolling counts as read.
  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollHeight <= el.clientHeight + 4) setReadToEnd(true);
  }, [terms]);

  const consented = Boolean(value.consentToken);

  const emit = (patch) => {
    const next = { ...value, ...patch };
    const exclusive = next.mandateType === "exclusive";
    const r = patch.range || range;
    const min = toRupees(r.min);
    const max = toRupees(r.max);
    const rangeOk = !exclusive || (min > 0 && max > 0 && min <= max);
    next.priceRange = exclusive ? (seller ? { minPrice: min, maxPrice: max } : { minBudget: min, maxBudget: max }) : null;
    next.ready = Boolean(next.consentToken && next.mandateType && rangeOk);
    delete next.range;
    onChange(next);
  };

  const sendOtp = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await portal.sendConsentOtp(accessToken);
      setOtpSentTo(res.sentTo);
      setDevOtp(import.meta.env.DEV ? res.otp : null);
    } catch (e) {
      setError(e.message);
      setTicked(false);
    } finally {
      setBusy(false);
    }
  };

  const verify = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await portal.verifyConsentOtp(accessToken, otp.trim(), kind);
      emit({ consentToken: res.consentToken });
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const onTick = (checked) => {
    setTicked(checked);
    if (checked && !otpSentTo) sendOtp();
  };

  const setRangeField = (key) => (e) => {
    const next = { ...range, [key]: e.target.value };
    setRange(next);
    emit({ range: next });
  };

  const months = terms ? Math.round((seller ? terms.mandatePeriodDays.seller : terms.mandatePeriodDays.buyer) / 30) : seller ? 6 : 3;
  const benefits = terms ? (seller ? terms.sellerBenefits : terms.buyerBenefits) : [];
  const stepClass = (done) =>
    `flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${done ? "bg-emerald-600 text-white" : "bg-[#E51C23] text-white"}`;

  return (
    <div className="flex flex-col gap-4 rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] p-4">
      {/* Step 1 - professional fee consent */}
      <div>
        <div className="flex items-center gap-2">
          <span className={stepClass(consented)}>{consented ? "✓" : "1"}</span>
          <p className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#111827]">Professional fee consent</p>
        </div>
        {!terms && !error && <p className="mt-2 text-[13px] text-[#6B7280]">Loading the fee terms…</p>}
        {terms && (
          <div
            ref={scrollRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              if (el.scrollTop + el.clientHeight >= el.scrollHeight - 4) setReadToEnd(true);
            }}
            className="mt-2 max-h-[160px] overflow-y-auto rounded-[10px] border border-[#E5E7EB] bg-white p-3 text-[13px] leading-5 text-[#374151]"
          >
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="text-[#6B7280]">
                  <th className="pb-1 pr-2 font-semibold">Deal</th>
                  <th className="pb-1 pr-2 font-semibold">Professional fee</th>
                  <th className="pb-1 font-semibold">When payable</th>
                </tr>
              </thead>
              <tbody>
                {terms.feeTable.map((row) => (
                  <tr key={row.deal} className="align-top">
                    <td className="py-1 pr-2 font-semibold">{row.deal}</td>
                    <td className="py-1 pr-2">{row.fee}</td>
                    <td className="py-1">{row.schedule}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2">{terms.text}</p>
            <p className="mt-2">All contact happens through your A R Buildwel representative - buyer and seller details are never shared with each other.</p>
          </div>
        )}
        {!consented && (
          <>
            <label className={`mt-3 flex items-start gap-2 text-[13px] leading-5 ${readToEnd ? "text-[#374151]" : "text-[#9CA3AF]"}`}>
              <input
                type="checkbox"
                disabled={!readToEnd || busy}
                checked={ticked}
                onChange={(e) => onTick(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[#E51C23]"
              />
              <span>
                I have read and accept the professional fee structure.
                {!readToEnd && " (scroll to the end of the terms first)"}
              </span>
            </label>
            {ticked && otpSentTo && (
              <div className="mt-3 flex flex-wrap items-end gap-2">
                <label className={labelClass}>
                  OTP sent to {otpSentTo}
                  <input
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                    className={`${inputClass} w-[160px]`}
                    placeholder="Enter OTP"
                  />
                </label>
                <button type="button" onClick={verify} disabled={busy || otp.length < 4} className={secondaryButton}>
                  {busy ? "Checking…" : "Confirm"}
                </button>
                <button type="button" onClick={sendOtp} disabled={busy} className={linkButton}>
                  Resend OTP
                </button>
                {devOtp && <span className="text-[12px] text-[#9CA3AF]">Dev OTP: {devOtp}</span>}
              </div>
            )}
          </>
        )}
        {consented && <p className="mt-2 text-[13px] text-emerald-700">Consent confirmed by OTP.</p>}
        {error && <p className="mt-2 text-[13px] text-[#B91C1C]">{error}</p>}
      </div>

      {/* Step 2 - mandate type (only after consent) */}
      {consented && (
        <div>
          <div className="flex items-center gap-2">
            <span className={stepClass(Boolean(value.mandateType) && value.ready)}>{value.ready ? "✓" : "2"}</span>
            <p className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#111827]">Mandate type</p>
          </div>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {[
              { v: "exclusive", title: `Exclusive Mandate - ${months} months`, body: "Service benefits below; same professional fee." },
              { v: "standard", title: "Standard Engagement", body: "Standard service, no exclusive benefits." },
            ].map((o) => (
              <label
                key={o.v}
                className={`cursor-pointer rounded-[12px] border bg-white p-3 transition ${
                  value.mandateType === o.v ? "border-[#E51C23] ring-1 ring-[#E51C23]" : "border-[#E5E7EB]"
                }`}
              >
                <input type="radio" name={`mandate-${kind}`} className="sr-only" checked={value.mandateType === o.v} onChange={() => emit({ mandateType: o.v })} />
                <span className="block text-[14px] font-bold text-[#111827]">{o.title}</span>
                <span className="mt-0.5 block text-[12px] leading-5 text-[#6B7280]">{o.body}</span>
              </label>
            ))}
          </div>
          <p className="mt-2 text-[12px] leading-5 text-[#6B7280]">
            Professional fee is 1% + GST/IGST regardless of mandate type. Exclusive Mandate benefits are service-based.
          </p>

          {value.mandateType === "exclusive" && (
            <div className="mt-3 rounded-[12px] border border-[#E5E7EB] bg-white p-3">
              <p className="text-[13px] font-bold text-[#111827]">{seller ? "Seller" : "Buyer"} benefits</p>
              <ul className="mt-1 list-disc pl-5 text-[12px] leading-5 text-[#374151]">
                {benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <label className={labelClass}>
                  {seller ? "Minimum acceptable price" : "Minimum budget"} (₹ Lakh) *
                  <input type="number" min="0" step="0.01" required value={range.min} onChange={setRangeField("min")} className={inputClass} />
                </label>
                <label className={labelClass}>
                  {seller ? "Maximum listed price" : "Maximum budget"} (₹ Lakh) *
                  <input type="number" min="0" step="0.01" required value={range.max} onChange={setRangeField("max")} className={inputClass} />
                </label>
              </div>
              {range.min !== "" && range.max !== "" && Number(range.min) > Number(range.max) && (
                <p className="mt-1 text-[12px] text-[#B91C1C]">The minimum cannot be more than the maximum.</p>
              )}
              <p className="mt-2 text-[12px] leading-5 text-[#6B7280]">
                Strictly confidential - stored encrypted and seen only by your assigned A R representative, never by {seller ? "buyers" : "sellers"} or brokers.
              </p>
              {disclaimers.map((d) => (
                <p key={d.key || d.disclaimer_key || d.title} className="mt-2 text-[11px] leading-4 text-[#9CA3AF]">
                  <span className="font-semibold text-[#6B7280]">{d.title}: </span>
                  {d.content_html}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Mandate status line on a listing / requirement card + its documents.
const STATUS_TEXT = {
  pending_rep_ack: "awaiting your representative",
  active: "active",
  expired: "expired",
  breached: "breached",
  cancelled: "cancelled",
};

export function MandateStatus({ mandate, accessToken }) {
  const [err, setErr] = useState(null);
  if (!mandate) return null;
  const exclusive = String(mandate.type).endsWith("_exclusive");
  const open = async (which) => {
    setErr(null);
    try {
      const url = URL.createObjectURL(await portal.mandatePdf(accessToken, mandate.id, which));
      window.open(url, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      setErr(e.message);
    }
  };
  return (
    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-[#6B7280]">
      <span>
        <span className="font-semibold text-[#374151]">{exclusive ? "Exclusive Mandate" : "Standard engagement"}</span>
        {exclusive && ` - ${STATUS_TEXT[mandate.status] || mandate.status}`}
        {exclusive && mandate.status === "active" && mandate.end_date && ` until ${new Date(mandate.end_date).toLocaleDateString("en-IN")}`}
        {` · ${mandate.number}`}
      </span>
      <button type="button" onClick={() => open("consent")} className={linkButton}>
        Fee consent record
      </button>
      {exclusive && mandate.status !== "pending_rep_ack" && (
        <button type="button" onClick={() => open("summary")} className={linkButton}>
          Mandate summary
        </button>
      )}
      {exclusive && mandate.status === "active" && (
        <span>
          Valuation: {String(mandate.valuation_status || "").replace(/_/g, " ")} · Due diligence: {String(mandate.due_diligence_status || "").replace(/_/g, " ")}
        </span>
      )}
      {err && <span className="text-[#B91C1C]">{err}</span>}
    </div>
  );
}
