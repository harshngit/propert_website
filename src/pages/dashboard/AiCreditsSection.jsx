import React, { useState } from "react";
import { apiRequest } from "../../api/client";
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, LoadState, Modal, Notice, SectionHeader, formatDate, formatINR, inputClass, labelClass, linkButton, primaryButton, secondaryButton, useLoad } from "./ui";

// AI credits (1 credit = Rs 1) for every customer role. Each AI action is paid
// from the wallet of the person who asks for it, and its price shows before
// the button is pressed. Buy a pack online (Razorpay), or pay by bank transfer
// / UPI and report it with its reference (and a screenshot) for approval.

const n = (v) => Number(v || 0).toLocaleString("en-IN");
const KIND = { purchase: "Bought", spend: "Used", refund: "Returned", grant: "Added by A R Buildwel", adjust: "Correction", referral: "Referral reward", expire: "Expired", refund_out: "Refunded to you" };
const TOPUP = { pending: ["amber", "Being checked"], approved: ["green", "Credited"], rejected: ["gray", "Not accepted"] };
const MAX_FILE = 5 * 1024 * 1024;

// Tells the dashboard's balance chip to refresh.
export const creditsChanged = () => window.dispatchEvent(new Event("ai-credits-changed"));

const loadRazorpay = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = resolve;
    s.onerror = () => reject(new Error("Could not load the payment window"));
    document.body.appendChild(s);
  });

function PaymentDetails({ details }) {
  const b = details?.bank || {};
  const u = details?.upi || {};
  const bank = b.accountName && b.accountNumber && b.ifsc;
  if (!bank && !u.id) return <p className="mt-2 text-[13px] text-[#B91C1C]">Bank and UPI details are not set up yet. Please contact A R Buildwel before paying.</p>;
  const row = (label, value, mono) => (
    <div className="flex gap-3 py-0.5"><dt className="w-[110px] shrink-0 text-[#6B7280]">{label}</dt><dd className={mono ? "font-mono" : ""}>{value}</dd></div>
  );
  return (
    <dl className="mt-2 text-[13px] text-[#111827]" data-no-translate>
      {u.id && row("UPI", `${u.id}${u.name ? ` (${u.name})` : ""}`, true)}
      {bank && row("Account name", b.accountName)}
      {bank && row("Account no.", b.accountNumber, true)}
      {bank && row("IFSC", b.ifsc, true)}
      {bank && b.bankName && row("Bank", `${b.bankName}${b.branch ? `, ${b.branch}` : ""}`)}
      {details.note && <p className="mt-1 text-[12px] text-[#6B7280]">{details.note}</p>}
    </dl>
  );
}

function TransferForm({ pack, details, onDone }) {
  const { accessToken } = useAuth();
  const [form, setForm] = useState({ method: details?.upi?.id ? "upi" : "bank", reference: "", paidOn: "" });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const tooBig = file && file.size > MAX_FILE;
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const fd = new FormData();
      fd.append("packId", pack.id);
      fd.append("method", form.method);
      fd.append("reference", form.reference.trim());
      if (form.paidOn) fd.append("paidOn", form.paidOn);
      if (file) fd.append("screenshot", file);
      await apiRequest("/ai-credits/topups", { method: "POST", body: fd, isFormData: true, token: accessToken });
      onDone("Payment reported. We will add the credits once it is checked.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <form onSubmit={submit} className="space-y-3">
      <div className="rounded-[12px] bg-[#F9FAFB] p-3">
        <p className="text-[14px] font-bold text-[#111827]">Amount to pay: {formatINR(pack.totalInr)} <span className="font-normal text-[#6B7280]">(incl. GST)</span></p>
        <PaymentDetails details={details} />
      </div>
      <label className={labelClass}>Paid by
        <select className={inputClass} value={form.method} onChange={(e) => setForm((f) => ({ ...f, method: e.target.value }))}>
          <option value="upi">UPI</option>
          <option value="bank">Bank transfer (NEFT / RTGS / IMPS)</option>
        </select>
      </label>
      <label className={labelClass}>UTR / transaction reference
        <input className={inputClass} value={form.reference} onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))} placeholder="e.g. 4211 0987 6543" maxLength={60} />
      </label>
      <label className={labelClass}>Paid on (optional)
        <input type="date" className={inputClass} value={form.paidOn} onChange={(e) => setForm((f) => ({ ...f, paidOn: e.target.value }))} />
      </label>
      <label className={labelClass}>Screenshot of the payment (optional - JPG, PNG or PDF, up to 5 MB)
        <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" className="mt-1.5 block w-full text-[13px]" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      </label>
      {tooBig && <Notice tone="red">This file is larger than 5 MB.</Notice>}
      {error && <Notice tone="red">{error}</Notice>}
      <button type="submit" className={primaryButton} disabled={busy || form.reference.trim().length < 6 || tooBig}>{busy ? "Sending…" : "Report payment"}</button>
    </form>
  );
}

export default function AiCreditsSection({ profile }) {
  const { accessToken } = useAuth();
  const w = useLoad((token) => apiRequest("/ai-credits/wallet", { token }).then((r) => r.data));
  const [buying, setBuying] = useState(null);
  const [transfer, setTransfer] = useState(null);
  const [notice, setNotice] = useState(null);

  const done = (tone, text) => {
    setNotice({ tone, text });
    creditsChanged();
    w.reload();
  };

  const buy = async (pack) => {
    setBuying(pack.id);
    setNotice(null);
    try {
      const order = (await apiRequest("/ai-credits/purchases", { method: "POST", body: { packId: pack.id }, token: accessToken })).data;
      await loadRazorpay();
      await new Promise((resolve, reject) => {
        new window.Razorpay({
          key: order.keyId,
          order_id: order.orderId,
          amount: order.amount,
          currency: order.currency,
          name: "PropertySerch.com",
          description: `${pack.name} - ${pack.totalCredits} AI credits (${order.receiptNumber})`,
          prefill: { name: profile?.user?.full_name || "", email: profile?.user?.email || "", contact: profile?.user?.phone || "" },
          theme: { color: "#E51C23" },
          handler: (r) =>
            apiRequest(`/ai-credits/purchases/${order.purchaseId}/verify`, { method: "POST", token: accessToken, body: { orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature } }).then(resolve, reject),
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) },
        }).open();
      });
      done("green", `${n(pack.totalCredits)} credits added. Your GST invoice is below.`);
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    } finally {
      setBuying(null);
    }
  };

  const download = async (id, number) => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai-credits/purchases/${id}/invoice`, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (!res.ok) throw new Error("Could not download the invoice");
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = `${number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    }
  };

  const screenshot = async (id) => {
    try {
      const r = await apiRequest(`/ai-credits/topups/${id}/screenshot`, { token: accessToken });
      window.open(r.data.url, "_blank", "noopener");
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    }
  };

  if (w.loading || w.error) return <LoadState loading={w.loading} error={w.error} onRetry={w.reload} />;
  const d = w.data;
  const earned = Object.values(d.referrals?.earned || {}).reduce((s, x) => s + x.credits, 0);
  const r = d.referrals?.rewards || {};

  return (
    <div className="space-y-5">
      <SectionHeader title="AI credits" subtitle="1 credit = Rs 1. Every AI action takes its credits from your balance, and you see the price before you press the button. Without credits, everything else on PropertySerch works as usual." />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Balance</p>
          <p className="font-['Plus_Jakarta_Sans'] text-[38px] font-extrabold leading-tight text-[#111827]">{n(d.balance)}</p>
          <p className="text-[13px] text-[#6B7280]">{n(d.lifetimePurchased)} bought · {n(d.lifetimeSpent)} used</p>
          {d.expiring?.length > 0 && <p className="mt-1 text-[13px] font-semibold text-[#B45309]">{n(d.expiring[0].credits)} credits expire on {formatDate(d.expiring[0].expiresAt)}</p>}
        </Card>
        <Card className="lg:col-span-2">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">What AI actions cost</h2>
          {d.prices.length === 0 ? <p className="mt-3 text-[14px] text-[#6B7280]">No paid AI actions are switched on.</p> : (
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {d.prices.map((p) => (
                <li key={p.key} className="flex items-start justify-between gap-3 rounded-[10px] border border-[#E5E7EB] px-3 py-2">
                  <span className="min-w-0"><span className="block text-[14px] font-semibold text-[#111827]">{p.label}</span><span className="block text-[12px] text-[#6B7280]">{p.description}</span></span>
                  <span className="shrink-0 rounded-full bg-[#FEF3C7] px-2 py-0.5 text-[12px] font-bold text-[#B45309]">{p.credits}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-[12px] text-[#6B7280]">If an AI action cannot run, its credits come back automatically.</p>
        </Card>
      </div>

      <div>
        <h2 className="mb-3 font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Buy credits</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {d.packs.map((p) => (
            <Card key={p.id} className="flex flex-col">
              <p className="text-[14px] font-bold text-[#111827]">{p.name}</p>
              <p className="mt-1 font-['Plus_Jakarta_Sans'] text-[26px] font-extrabold text-[#111827]">{n(p.totalCredits)} <span className="text-[14px] font-semibold text-[#6B7280]">credits</span></p>
              {p.bonusCredits > 0 && <p className="text-[12px] font-semibold text-[#047857]">includes {n(p.bonusCredits)} bonus</p>}
              <p className="mt-2 text-[12px] text-[#6B7280]">{formatINR(p.priceInr)} + {d.gstPercent}% GST = <b className="text-[#111827]">{formatINR(p.totalInr)}</b></p>
              <div className="mt-4 flex flex-col gap-2">
                {d.paymentOnline && <button type="button" className={primaryButton} disabled={!!buying} onClick={() => buy(p)}>{buying === p.id ? "Opening payment…" : "Pay online"}</button>}
                <button type="button" className={secondaryButton} onClick={() => setTransfer(p)}>Pay by bank transfer / UPI</button>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-2 text-[12px] text-[#6B7280]">A GST invoice is issued for every purchase. Credit validity and refunds follow the PropertySerch Terms &amp; Conditions{d.refundDays != null ? ` (unused bought credits can be refunded within ${d.refundDays} days)` : ""}.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Earn credits by introducing people</h2>
          {d.referrals?.code && <p className="mt-2 text-[14px]">Your code: <span className="font-mono font-bold text-[#E51C23]">{d.referrals.code}</span></p>}
          <ul className="mt-2 list-disc pl-5 text-[14px] text-[#374151]">
            {r.join > 0 && <li>{r.join} credits when someone you introduced joins</li>}
            {r.usagePercent > 0 && <li>{r.usagePercent}% of the AI credits they use</li>}
            {r.dealClosed > 0 && <li>{r.dealClosed} credits when their deal closes</li>}
          </ul>
          <p className="mt-2 text-[13px] text-[#6B7280]">Earned so far: <b className="text-[#111827]">{n(earned)} credits</b></p>
        </Card>
        <Card>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Bank / UPI payments you reported</h2>
          {!d.topups?.length ? <p className="mt-3 text-[14px] text-[#6B7280]">None yet.</p> : (
            <ul className="mt-3 divide-y divide-[#F3F4F6]">
              {d.topups.map((t) => (
                <li key={t.id} className="flex flex-wrap items-start justify-between gap-2 py-2.5 text-[13px]">
                  <span>
                    <span className="font-semibold text-[#111827]">{t.packName} · {formatINR(t.amountInr)}</span>
                    <span className="block font-mono text-[12px] text-[#6B7280]" data-no-translate>{t.method.toUpperCase()} {t.reference} · {formatDate(t.createdAt)}</span>
                    {t.status === "rejected" && t.decisionNote && <span className="block text-[12px] text-[#B91C1C]">{t.decisionNote}</span>}
                    {t.hasScreenshot && <button type="button" className={linkButton} onClick={() => screenshot(t.id)}>View screenshot</button>}
                  </span>
                  <Badge tone={TOPUP[t.status][0]}>{TOPUP[t.status][1]}</Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {d.invoices?.length > 0 && (
        <Card>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">GST invoices</h2>
          <ul className="mt-3 divide-y divide-[#F3F4F6]">
            {d.invoices.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[13px]">
                <span><span className="font-mono font-semibold text-[#111827]">{i.invoiceNumber}</span> <span className="text-[#6B7280]">· {i.packName} · {n(i.credits)} credits · {formatINR(i.totalInr)} · {formatDate(i.paidAt)}</span>{i.status === "refunded" && <Badge tone="gray">{i.refundedCredits} refunded</Badge>}</span>
                <button type="button" className={linkButton} onClick={() => download(i.id, i.invoiceNumber)}>Download PDF</button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">History</h2>
        {d.history.length === 0 ? <p className="mt-3 text-[14px] text-[#6B7280]">No credit activity yet.</p> : (
          <ul className="mt-3 divide-y divide-[#F3F4F6]">
            {d.history.map((h) => (
              <li key={h.id} className="flex items-start justify-between gap-3 py-2.5">
                <div><p className="text-[14px] font-semibold text-[#111827]">{KIND[h.kind] || h.kind}</p><p className="text-[12px] text-[#6B7280]">{formatDate(h.at, true)}{h.label ? ` · ${h.label}` : ""}</p></div>
                <div className="text-right"><p className={`text-[14px] font-bold ${h.credits < 0 ? "text-[#B91C1C]" : "text-[#047857]"}`}>{h.credits > 0 ? `+${h.credits}` : h.credits}</p><p className="text-[12px] text-[#6B7280]">{n(h.balanceAfter)}</p></div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Modal open={!!transfer} title={transfer ? `Pay for the ${transfer.name} pack` : ""} onClose={() => setTransfer(null)}>
        {transfer && <TransferForm pack={transfer} details={d.paymentDetails} onDone={(text) => { setTransfer(null); done("green", text); }} />}
      </Modal>
    </div>
  );
}
