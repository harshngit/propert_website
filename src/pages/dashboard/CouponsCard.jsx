import React, { useState } from "react";
import { apiRequest } from "../../api/client";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, formatDate, formatINR, inputClass, labelClass, primaryButton, secondaryButton, useLoad } from "./ui";

// Scheme coupons (Engine 8): enter a COU- code, see what it gives, and apply
// it - to a deal (professional fee), to your account (Full CRM workspace), or
// for a benefit our team delivers. Your referral code is separate.

const STATUS = { reserved: ["Waiting for the invoice", "amber"], applied: ["Applied", "green"], pending: ["Our team will deliver it", "amber"], fulfilled: ["Delivered", "green"], reversed: ["Withdrawn", "gray"] };

export default function CouponsCard() {
  const { accessToken } = useAuth();
  const mine = useLoad((token) => apiRequest("/coupons/mine", { token }).then((r) => r.data));
  const deals = useLoad((token) => portal.myDeals(token).catch(() => []));
  const [code, setCode] = useState("");
  const [checked, setChecked] = useState(null);
  const [dealId, setDealId] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const call = (path, body) => apiRequest(path, { method: "POST", token: accessToken, body }).then((r) => r.data);
  const check = async () => {
    setBusy(true);
    setMessage(null);
    try {
      setChecked(await call("/coupons/check", { code }));
    } catch (err) {
      setChecked({ valid: false, reason: err.message });
    } finally {
      setBusy(false);
    }
  };
  const apply = async () => {
    setBusy(true);
    try {
      const r = await call("/coupons/apply", { code, entityId: checked.coupon.service === "professional_fee" ? dealId : undefined });
      setMessage({ ok: true, text: r.message });
      setCode("");
      setChecked(null);
      mine.reload();
    } catch (err) {
      setMessage({ ok: false, text: err.message });
    } finally {
      setBusy(false);
    }
  };
  const withdraw = async (id) => {
    await call(`/coupons/mine/${id}/withdraw`).catch(() => {});
    mine.reload();
  };
  const needsDeal = checked?.valid && checked.coupon.service === "professional_fee";
  const dealList = Array.isArray(deals.data) ? deals.data : deals.data?.items || [];
  return (
    <Card>
      <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Have a coupon?</h3>
      <p className="mt-1 text-[13px] text-[#6B7280]">Scheme coupons start with COU-, for example COU-BU-DIW26. Each has its own dates and limits.</p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className={labelClass}>Coupon code
          <input className={`${inputClass} uppercase`} maxLength={20} value={code} placeholder="COU-BU-DIW26" onChange={(e) => { setCode(e.target.value.toUpperCase()); setChecked(null); }} />
        </label>
        {needsDeal && (
          <label className={labelClass}>For which deal?
            <select className={inputClass} value={dealId} onChange={(e) => setDealId(e.target.value)}>
              <option value="">Choose…</option>
              {dealList.map((d) => <option key={d.id} value={d.id}>{d.property_title || d.title || "Deal"}</option>)}
            </select>
          </label>
        )}
        {!checked?.valid ? (
          <button type="button" className={secondaryButton} disabled={busy || code.trim().length < 6} onClick={check}>Check</button>
        ) : (
          <button type="button" className={primaryButton} disabled={busy || (needsDeal && !dealId)} onClick={apply}>Apply</button>
        )}
      </div>
      {checked && (
        <p className={`mt-2 text-[13px] ${checked.valid ? "text-emerald-700" : "text-[#B91C1C]"}`}>
          {checked.valid
            ? `${checked.coupon.name}: ${checked.coupon.benefit}${needsDeal ? " - taken off your next professional-fee invoice on that deal (the fee never goes below 1%)" : ""}. Valid until ${formatDate(checked.coupon.validUntil)}.`
            : checked.reason}
        </p>
      )}
      {needsDeal && !dealList.length && <p className="mt-1 text-[12px] text-[#6B7280]">This coupon applies to a deal, and you have none yet.</p>}
      {message && <p className={`mt-2 text-[13px] font-semibold ${message.ok ? "text-emerald-700" : "text-[#B91C1C]"}`}>{message.text}</p>}
      {(mine.data || []).length > 0 && (
        <ul className="mt-4 divide-y divide-[#F3F4F6] border-t border-[#F3F4F6]">
          {mine.data.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 py-2.5 text-[13px]">
              <span>
                <span className="font-mono font-bold text-[#111827]" data-no-translate>{r.code}</span> <span className="text-[#6B7280]" data-no-translate>{r.couponName}</span>
                {r.discount > 0 && <span className="ml-2 text-emerald-700">{formatINR(r.discount)} off</span>}
                {r.daysGranted && <span className="ml-2 text-emerald-700">{r.daysGranted} days</span>}
              </span>
              <span className="flex items-center gap-2">
                <Badge tone={STATUS[r.status]?.[1]}>{STATUS[r.status]?.[0] || r.status}</Badge>
                {r.status === "reserved" && <button type="button" className="text-[12px] font-bold text-[#E51C23]" onClick={() => withdraw(r.id)}>Withdraw</button>}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
