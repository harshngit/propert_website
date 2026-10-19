import React, { useState } from "react";
import { apiRequest } from "../../api/client";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, EmptyState, LoadState, Modal, Notice, SectionHeader, formatDate, inputClass, labelClass, linkButton, primaryButton, secondaryButton, useLoad } from "./ui";

// Legal help (Module 24). Describe what you need; the documents already on
// file for your deal or property are linked for you; an empanelled advocate
// is assigned and you follow the status here. You engage the advocate
// directly - A R Buildwel refers and coordinates and takes no fee share. You
// may also use an advocate of your own choice: tell your representative.

const STATUS = { requested: ["Request received", "blue"], advocate_assigned: ["Advocate assigned", "amber"], in_progress: ["In progress", "amber"], report_ready: ["Report ready", "green"], completed: ["Completed", "green"], cancelled: ["Cancelled", "gray"] };
const STEPS = ["requested", "advocate_assigned", "in_progress", "report_ready", "completed"];

function CaseDetail({ id, onClose, onChanged }) {
  const { accessToken } = useAuth();
  const { data: c, loading, error, reload } = useLoad((t) => apiRequest(`/legal/cases/${id}`, { token: t }).then((r) => r.data), [id]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const cancel = async () => {
    setBusy(true);
    setMessage(null);
    try {
      await apiRequest(`/legal/cases/${id}/cancel`, { method: "POST", token: accessToken, body: {} });
      await reload();
      onChanged();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBusy(false);
    }
  };
  const at = c ? STEPS.indexOf(c.status) : -1;
  return (
    <Modal open title={c ? `${c.caseNumber} · ${c.serviceLabel}` : "Legal case"} onClose={onClose} width="max-w-[620px]">
      <LoadState loading={loading && !c} error={error} onRetry={reload} />
      {c && (
        <div className="space-y-4 text-[14px] text-[#374151]">
          {c.status !== "cancelled" && (
            <ol className="flex flex-wrap gap-2">
              {STEPS.map((s, i) => (
                <li key={s} className={`rounded-full px-3 py-1 text-[12px] font-bold ${i <= at ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#6B7280]"}`}>{STATUS[s][0]}</li>
              ))}
            </ol>
          )}
          {message && <Notice tone="red">{message}</Notice>}
          <div>
            <p className={labelClass}>What you asked for</p>
            <p className="whitespace-pre-line" data-no-translate>{c.requirement}</p>
            {c.propertyTitle && <p className="mt-1 text-[12px] text-[#6B7280]">Property: <span data-no-translate>{c.propertyTitle}</span></p>}
          </div>
          <div>
            <p className={labelClass}>{c.serviceType === "valuation" ? "Valuer" : "Advocate"}</p>
            {c.advocate ? (
              <p><b data-no-translate>{c.advocate.name}</b>{c.advocate.firm ? <>, <span data-no-translate>{c.advocate.firm}</span></> : null}{c.advocate.lpCode ? <> · Panel code <span data-no-translate>{c.advocate.lpCode}</span></> : <> · your own chosen advocate</>}{c.dueOn ? <><br /><span className="text-[12px] text-[#6B7280]">Expected by {formatDate(c.dueOn)}</span></> : null}</p>
            ) : (
              <p className="text-[#6B7280]">{c.status === "cancelled" ? "No advocate was assigned." : "Being assigned - your representative will confirm shortly."}</p>
            )}
            <p className="mt-1 text-[12px] text-[#6B7280]">Your representative arranges the introduction. You engage the advocate directly.</p>
          </div>
          <div>
            <p className={labelClass}>Documents linked ({c.linkedDocuments.length})</p>
            {c.linkedDocuments.length === 0 ? <p className="text-[#6B7280]">None on file yet - upload them under Documents and your representative will add them.</p> : c.linkedDocuments.map((d) => <p key={d.id} className="text-[13px]"><span data-no-translate>{d.fileName || String(d.type).replace(/_/g, " ")}</span></p>)}
          </div>
          <div>
            <p className={labelClass}>Updates</p>
            {c.timeline.map((t, i) => (
              <p key={i} className="border-b border-[#F3F4F6] py-1.5 text-[13px] last:border-0"><b>{(STATUS[t.kind] || [String(t.kind).replace(/_/g, " ")])[0]}</b> · {formatDate(t.at)}{t.note ? <><br /><span className="text-[#4B5563]" data-no-translate>{t.note}</span></> : null}</p>
            ))}
          </div>
          <p className="text-[12px] leading-5 text-[#6B7280]">{c.disclaimer}</p>
          {c.status === "requested" && <div className="flex justify-end"><button type="button" className={secondaryButton} disabled={busy} onClick={cancel}>Cancel this request</button></div>}
        </div>
      )}
    </Modal>
  );
}

function LegalHelpSection() {
  const { accessToken } = useAuth();
  const { data, loading, error, reload } = useLoad((t) => apiRequest("/legal/cases/mine", { token: t }).then((r) => r.data));
  const deals = useLoad((t) => portal.myDeals(t).catch(() => []));
  const [form, setForm] = useState(null);
  const [open, setOpen] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);
  const dealList = Array.isArray(deals.data) ? deals.data : deals.data?.deals || [];
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const body = { serviceType: form.serviceType, requirement: form.requirement.trim(), ...(form.dealId ? { dealId: form.dealId } : {}) };
      const made = (await apiRequest("/legal/cases", { method: "POST", token: accessToken, body })).data;
      setForm(null);
      setNotice({ tone: "green", text: `Request ${made.caseNumber} received. ${made.linkedDocuments.length} document${made.linkedDocuments.length === 1 ? "" : "s"} on file linked. Your representative will assign an advocate.` });
      reload();
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  const cases = data?.cases || [];
  return (
    <div>
      <SectionHeader title="Legal help" subtitle="Due diligence, title checks, agreement drafting and registration support through empanelled advocates - coordinated by your representative." />
      {notice && <div className="mb-4"><Notice tone={notice.tone}>{notice.text}</Notice></div>}
      <div className="mb-4"><button type="button" className={primaryButton} onClick={() => { setNotice(null); setForm({ serviceType: "due_diligence", requirement: "", dealId: "" }); }}>Ask for legal help</button></div>
      <LoadState loading={loading && !data} error={error} onRetry={reload} />
      {data && !cases.length && <EmptyState title="No legal requests yet" body="Tell us what you need - checking a title, drafting an agreement, help with registration - and we will link your documents and assign an advocate." />}
      <div className="space-y-3">
        {cases.map((c) => (
          <Card key={c.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-extrabold text-[#111827]"><span data-no-translate>{c.caseNumber}</span> · {c.serviceLabel} <Badge tone={STATUS[c.status][1]}>{STATUS[c.status][0]}</Badge></p>
                <p className="mt-1 line-clamp-2 text-[13px] text-[#4B5563]" data-no-translate>{c.requirement}</p>
                <p className="mt-1 text-[12px] text-[#9CA3AF]">{c.advocate ? <>Advocate: <span data-no-translate>{c.advocate.name}</span> · </> : null}{c.documents} documents linked · {formatDate(c.createdAt)}{c.dueOn ? ` · expected by ${formatDate(c.dueOn)}` : ""}</p>
              </div>
              <button type="button" className={linkButton} onClick={() => setOpen(c.id)}>View status</button>
            </div>
          </Card>
        ))}
      </div>
      {data?.disclaimer && <p className="mt-5 text-[12px] leading-5 text-[#6B7280]">{data.disclaimer}</p>}

      <Modal open={!!form} title="Ask for legal help" onClose={() => setForm(null)}>
        {form && (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className={labelClass}>What do you need?</label>
              <select className={inputClass} value={form.serviceType} onChange={(e) => setForm({ ...form, serviceType: e.target.value })}>
                {(data?.services || []).map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            {dealList.length > 0 && (
              <div>
                <label className={labelClass}>For which deal? (optional)</label>
                <select className={inputClass} value={form.dealId} onChange={(e) => setForm({ ...form, dealId: e.target.value })}>
                  <option value="">Not about a specific deal</option>
                  {dealList.map((d) => <option key={d.id} value={d.id}>{d.propertyTitle || d.property_title || d.title || "Deal"}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className={labelClass}>Describe your requirement</label>
              <textarea className={inputClass} rows={4} required minLength={10} maxLength={4000} value={form.requirement} onChange={(e) => setForm({ ...form, requirement: e.target.value })} placeholder="For example: please verify the title chain and encumbrance before I sign the agreement." />
              <p className="mt-1 text-[12px] text-[#6B7280]">Please don't include phone numbers or emails. Documents already on file are linked automatically.</p>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" className={secondaryButton} onClick={() => setForm(null)}>Cancel</button>
              <button type="submit" className={primaryButton} disabled={busy || form.requirement.trim().length < 10}>{busy ? "Sending…" : "Send request"}</button>
            </div>
          </form>
        )}
      </Modal>
      {open && <CaseDetail id={open} onClose={() => setOpen(null)} onChanged={reload} />}
    </div>
  );
}

export default LegalHelpSection;
