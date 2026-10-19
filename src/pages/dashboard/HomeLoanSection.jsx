import React, { useState } from "react";
import { apiRequest } from "../../api/client";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, EmptyState, LoadState, Modal, Notice, SectionHeader, formatDate, formatINR, inputClass, labelClass, linkButton, primaryButton, secondaryButton, useLoad } from "./ui";

// Home loan (Module 25) - referral only. Enter your income and the property
// value, see an indicative eligibility and the lenders that fit, pick one and
// submit. Our loan desk refers you to that lender's loan officer and you
// follow the sanction and disbursement here. A R Buildwel does not lend.

const STATUS = { started: ["Not submitted yet", "gray"], submitted: ["Submitted", "blue"], referred: ["With the lender", "amber"], sanctioned: ["Sanctioned", "green"], disbursed: ["Disbursed", "green"], rejected: ["Not approved", "red"], withdrawn: ["Withdrawn", "gray"] };
const STEPS = ["started", "submitted", "referred", "sanctioned", "disbursed"];
const VERDICT = { within_eligibility: "Your loan amount is within the indicative eligibility.", above_eligibility: "The amount you asked for is more than the indicative eligibility.", indicative: "Indicative figure.", more_details_needed: "Add your income and the property value to see a figure." };
const money = (v) => (v === null || v === undefined ? "—" : formatINR(v));
const numOrNull = (v) => (v === "" || v === null || v === undefined ? null : Number(v));

function LoanDetail({ id, onClose, onChanged }) {
  const { accessToken } = useAuth();
  const { data: a, loading, error, reload } = useLoad((t) => apiRequest(`/finance/loans/${id}`, { token: t }).then((r) => r.data), [id]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [pick, setPick] = useState("");
  const run = async (path, body) => {
    setBusy(true);
    setMessage(null);
    try {
      await apiRequest(path, { method: "POST", token: accessToken, body });
      await reload();
      onChanged();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };
  const at = a ? STEPS.indexOf(a.status) : -1;
  const e = a?.eligibility;
  return (
    <Modal open title={a ? `${a.applicationNumber} · ${a.loanLabel}` : "Loan application"} onClose={onClose} width="max-w-[640px]">
      <LoadState loading={loading && !a} error={error} onRetry={reload} />
      {a && (
        <div className="space-y-4 text-[14px] text-[#374151]">
          {at >= 0 && <ol className="flex flex-wrap gap-2">{STEPS.map((s, i) => <li key={s} className={`rounded-full px-3 py-1 text-[12px] font-bold ${i <= at ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>{STATUS[s][0]}</li>)}</ol>}
          {message && <Notice tone="red">{message}</Notice>}
          {e && (
            <div className="rounded-[14px] bg-[#F9FAFB] p-4">
              <p className={labelClass}>Indicative eligibility</p>
              <p className="font-['Plus_Jakarta_Sans'] text-[22px] font-extrabold text-[#111827]">{money(e.eligibleAmount)}</p>
              <p className="text-[13px]">{VERDICT[e.verdict]} Indicative EMI {money(e.indicativeEmi)} a month at {e.ratePercent}% over {e.tenureYears} years.</p>
              <p className="mt-1 text-[12px] text-[#6B7280]">From your income: {money(e.eligibleByIncome)} · from the property value ({e.ltvPercent}% of it): {money(e.eligibleByPropertyValue)}</p>
            </div>
          )}
          {a.status === "started" && (
            <div>
              <p className={labelClass}>Lender options</p>
              {a.lenderOptions.length === 0 ? <p className="text-[#6B7280]">No empanelled lender is listed for this loan in your city yet. Submit anyway and our loan desk will suggest one.</p> : a.lenderOptions.map((o) => (
                <label key={o.institutionId} className="mt-2 flex cursor-pointer items-start gap-3 rounded-[12px] border border-[#E5E7EB] p-3">
                  <input type="radio" name="lender" className="mt-1" checked={pick === o.institutionId} onChange={() => setPick(o.institutionId)} />
                  <span><b data-no-translate>{o.name}</b><br /><span className="text-[12px] text-[#6B7280]">From {o.rateFromPercent ?? "—"}%{o.rateToPercent ? ` to ${o.rateToPercent}%` : ""} · up to {o.maxTenureYears ?? "—"} years · indicative eligibility {money(o.eligibleAmount)} · EMI about {money(o.indicativeEmi)}</span></span>
                </label>
              ))}
              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <button type="button" className={secondaryButton} disabled={busy} onClick={() => run(`/finance/loans/${id}/withdraw`, { reason: "Not going ahead" })}>Withdraw</button>
                <button type="button" className={primaryButton} disabled={busy} onClick={() => run(`/finance/loans/${id}/submit`, { institutionId: pick || null })}>{pick ? "Submit to this lender" : "Submit application"}</button>
              </div>
            </div>
          )}
          {a.lender && (
            <div>
              <p className={labelClass}>Lender</p>
              <p><b data-no-translate>{a.lender.name}</b>{a.lender.officer ? <> · loan officer <span data-no-translate>{a.lender.officer.name}</span> (<span data-no-translate>{a.lender.officer.code}</span>)</> : <> · waiting for our loan desk to refer it</>}</p>
              <p className="text-[12px] text-[#6B7280]">Your representative arranges the introduction. The loan is between you and the lender.</p>
            </div>
          )}
          {a.sanctionedAmount && (
            <div>
              <p className={labelClass}>Sanction</p>
              <p>{money(a.sanctionedAmount)}{a.sanctionedRate ? ` at ${a.sanctionedRate}%` : ""}{a.sanctionedOn ? ` on ${formatDate(a.sanctionedOn)}` : ""}</p>
              {a.disbursementSchedule.map((t, i) => <p key={i} className="text-[13px]">{formatDate(t.dueOn)} · {money(t.amount)}{t.note ? <> · <span data-no-translate>{t.note}</span></> : null}{t.paidOn ? ` · paid ${formatDate(t.paidOn)}` : ""}</p>)}
            </div>
          )}
          <div>
            <p className={labelClass}>Documents linked ({a.linkedDocuments.length})</p>
            {a.linkedDocuments.length === 0 ? <p className="text-[#6B7280]">None yet - upload salary slips, bank statements and ID under Documents; they are added to this application.</p> : a.linkedDocuments.map((d) => <p key={d.id} className="text-[13px]" data-no-translate>{d.fileName || String(d.type).replace(/_/g, " ")}</p>)}
          </div>
          <div>
            <p className={labelClass}>Updates</p>
            {a.timeline.map((t, i) => <p key={i} className="border-b border-[#F3F4F6] py-1.5 text-[13px] last:border-0"><b>{t.kind === "started" ? "Started" : (STATUS[t.kind] || [String(t.kind).replace(/_/g, " ")])[0]}</b> · {formatDate(t.at)}{t.note ? <><br /><span className="text-[#4B5563]" data-no-translate>{t.note}</span></> : null}</p>)}
          </div>
          <p className="text-[12px] leading-5 text-[#6B7280]">{a.disclaimer}</p>
          {["submitted", "referred"].includes(a.status) && <div className="flex justify-end"><button type="button" className={secondaryButton} disabled={busy} onClick={() => run(`/finance/loans/${id}/withdraw`, { reason: "Withdrawn by me" })}>Withdraw application</button></div>}
        </div>
      )}
    </Modal>
  );
}

function HomeLoanSection() {
  const { accessToken } = useAuth();
  const { data, loading, error, reload } = useLoad((t) => apiRequest("/finance/loans/mine", { token: t }).then((r) => r.data));
  const deals = useLoad((t) => portal.myDeals(t).catch(() => []));
  const [form, setForm] = useState(null);
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const dealList = Array.isArray(deals.data) ? deals.data : [];
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const body = { loanType: form.loanType, employmentType: form.employmentType || null, monthlyIncome: numOrNull(form.monthlyIncome), existingEmi: numOrNull(form.existingEmi), propertyValue: numOrNull(form.propertyValue), loanAmountRequested: numOrNull(form.loanAmountRequested), tenureYears: numOrNull(form.tenureYears), city: form.city || null, ...(form.dealId ? { dealId: form.dealId } : {}) };
      const made = (await apiRequest("/finance/loans", { method: "POST", token: accessToken, body })).data;
      setForm(null);
      reload();
      setOpen(made.id);
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  const rows = data?.applications || [];
  return (
    <div>
      <SectionHeader title="Home loan" subtitle="Check what you may be eligible for, see lenders that fit, and apply - we refer you to the lender and track it with you." />
      {notice && <div className="mb-4"><Notice tone={notice.tone}>{notice.text}</Notice></div>}
      <div className="mb-4"><button type="button" className={primaryButton} onClick={() => { setNotice(null); setForm({ loanType: "home_loan", employmentType: "salaried", monthlyIncome: "", existingEmi: "", propertyValue: "", loanAmountRequested: "", tenureYears: "20", city: "", dealId: "" }); }}>Check eligibility and apply</button></div>
      <LoadState loading={loading && !data} error={error} onRetry={reload} />
      {data && !rows.length && <EmptyState title="No loan applications yet" body="Enter your income and the property value to see an indicative eligibility and the lenders that fit." />}
      <div className="space-y-3">
        {rows.map((a) => (
          <Card key={a.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-extrabold text-[#111827]"><span data-no-translate>{a.applicationNumber}</span> · {a.loanLabel} <Badge tone={STATUS[a.status][1]}>{STATUS[a.status][0]}</Badge></p>
                <p className="mt-1 text-[13px] text-[#4B5563]">Loan asked {money(a.loanAmountRequested)} · indicative eligibility {money(a.eligibility?.eligibleAmount)}{a.lender ? <> · <span data-no-translate>{a.lender.name}</span></> : null}</p>
                <p className="mt-1 text-[12px] text-[#9CA3AF]">{a.propertyTitle ? <><span data-no-translate>{a.propertyTitle}</span> · </> : null}{formatDate(a.createdAt)}</p>
              </div>
              <button type="button" className={linkButton} onClick={() => setOpen(a.id)}>{a.status === "started" ? "Choose a lender and submit" : "View status"}</button>
            </div>
          </Card>
        ))}
      </div>
      {data?.disclaimer && <p className="mt-5 text-[12px] leading-5 text-[#6B7280]">{data.disclaimer}</p>}

      <Modal open={!!form} title="Home loan - your details" onClose={() => setForm(null)} width="max-w-[600px]">
        {form && (
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div><label className={labelClass}>Loan</label><select className={inputClass} value={form.loanType} onChange={set("loanType")}>{(data?.loanTypes || []).map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
              <div><label className={labelClass}>Employment</label><select className={inputClass} value={form.employmentType} onChange={set("employmentType")}><option value="salaried">Salaried</option><option value="self_employed">Self-employed</option><option value="business">Business owner</option><option value="professional">Professional</option><option value="other">Other</option></select></div>
              <div><label className={labelClass}>Monthly income (₹)</label><input className={inputClass} type="number" min="0" required value={form.monthlyIncome} onChange={set("monthlyIncome")} /></div>
              <div><label className={labelClass}>Existing EMIs (₹ a month)</label><input className={inputClass} type="number" min="0" value={form.existingEmi} onChange={set("existingEmi")} /></div>
              <div><label className={labelClass}>Property value (₹)</label><input className={inputClass} type="number" min="0" required value={form.propertyValue} onChange={set("propertyValue")} /></div>
              <div><label className={labelClass}>Loan amount wanted (₹)</label><input className={inputClass} type="number" min="0" value={form.loanAmountRequested} onChange={set("loanAmountRequested")} /></div>
              <div><label className={labelClass}>Tenure (years)</label><input className={inputClass} type="number" min="1" max="30" value={form.tenureYears} onChange={set("tenureYears")} /></div>
              <div><label className={labelClass}>City of the property</label><input className={inputClass} value={form.city} onChange={set("city")} /></div>
            </div>
            {dealList.length > 0 && (
              <div><label className={labelClass}>For which deal? (optional)</label><select className={inputClass} value={form.dealId} onChange={set("dealId")}><option value="">Not about a specific deal</option>{dealList.map((d) => <option key={d.id} value={d.id}>{d.property_title || "Deal"}</option>)}</select></div>
            )}
            <p className="text-[12px] text-[#6B7280]">We work out an indicative eligibility and show lenders that fit. Documents already on file are linked automatically.</p>
            <div className="flex justify-end gap-2"><button type="button" className={secondaryButton} onClick={() => setForm(null)}>Cancel</button><button type="submit" className={primaryButton} disabled={busy}>{busy ? "Working it out…" : "Check eligibility"}</button></div>
          </form>
        )}
      </Modal>
      {open && <LoanDetail id={open} onClose={() => setOpen(null)} onChanged={reload} />}
    </div>
  );
}

export default HomeLoanSection;
