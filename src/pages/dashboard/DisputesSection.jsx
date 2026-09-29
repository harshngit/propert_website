import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, EmptyState, LoadState, Modal, Notice, SectionHeader, formatDate, inputClass, labelClass, primaryButton, secondaryButton, useLoad } from "./ui";

// Help & disputes (Engine 5 Dispute Resolution). Report a fake listing
// claim or raise a problem; A R Buildwel resolves every case within 48
// hours. Follow the case timeline, add details or evidence.

const TYPES = [
  ["fake_claim", "Listing information is false"],
  ["duplicate_listing", "My property was listed by someone else"],
  ["institutional_data_access", "Data-room access problem"],
  ["review", "A review about me is unfair"],
  ["other", "Something else"],
];
const TONE = { open: "blue", under_review: "blue", awaiting_info: "amber", resolved: "green", dismissed: "gray", closed: "gray" };

function DisputesSection() {
  const { accessToken } = useAuth();
  const [params, setParams] = useSearchParams();
  const list = useLoad((t) => portal.disputes(t));
  const [form, setForm] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [reply, setReply] = useState("");
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  // /dashboard/disputes?new=1&property=<id> (from "Report this listing").
  useEffect(() => {
    if (params.get("new")) setForm({ type: params.get("property") ? "fake_claim" : "other", title: "", description: "", propertyId: params.get("property") || "" });
  }, [params]);

  useEffect(() => {
    if (!viewing) return;
    setDetail(null);
    portal.dispute(accessToken, viewing).then(setDetail).catch((e) => setMsg({ tone: "red", text: e.message }));
  }, [viewing, accessToken]);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const d = await portal.openDispute(accessToken, { ...form, files });
      setForm(null);
      setFiles([]);
      setParams({}, { replace: true });
      setMsg({ tone: "green", text: `Case ${d.case_number} opened - our team will resolve it within 48 hours.` });
      list.reload();
    } catch (err) {
      setMsg({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  const sendReply = async () => {
    setBusy(true);
    try {
      setDetail(await portal.commentDispute(accessToken, viewing, { body: reply, files }));
      setReply("");
      setFiles([]);
      list.reload();
    } catch (err) {
      setMsg({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  const open = detail && ["open", "under_review", "awaiting_info"].includes(detail.status);

  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Help & disputes"
        subtitle="Report false listing information or raise a problem. A R Buildwel resolves every case within 48 hours."
        action={<button type="button" className={primaryButton} onClick={() => setForm({ type: "other", title: "", description: "", propertyId: "" })}>Raise an issue</button>}
      />
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      <LoadState loading={list.loading && !list.data} error={list.error} onRetry={list.reload} />
      {list.data && !list.data.length && <EmptyState title="No cases" body="If something about a listing or a deal isn't right, raise it here." />}
      <div className="flex flex-col gap-3">
        {(list.data || []).map((d) => (
          <Card key={d.id}>
            <button type="button" className="w-full text-left" onClick={() => setViewing(d.id)}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[15px] font-bold text-[#111827]">{d.case_number} · {d.title}</p>
                <Badge tone={TONE[d.status]}>{d.status === "awaiting_info" ? "Your reply needed" : d.status.replace("_", " ")}</Badge>
              </div>
              <p className="mt-1 text-[12px] text-[#6B7280]">
                Opened {formatDate(d.created_at)}{d.property_title ? ` · ${d.property_title}` : ""}
                {["open", "under_review", "awaiting_info"].includes(d.status) ? ` · resolution due ${formatDate(d.sla_due_at)}` : ""}
              </p>
            </button>
          </Card>
        ))}
      </div>

      <Modal open={!!form} title="Raise an issue" onClose={() => { setForm(null); setParams({}, { replace: true }); }}>
        {form && (
          <form onSubmit={submit} className="flex flex-col gap-3">
            <label className={labelClass}>What is it about?
              <select value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))} className={inputClass}>
                {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </label>
            <label className={labelClass}>Short title
              <input value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} maxLength={200} />
            </label>
            <label className={labelClass}>Details
              <textarea rows={4} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className={`${inputClass} h-auto py-2`} placeholder="What happened? Please don't include phone numbers or emails." />
            </label>
            <label className={labelClass}>Evidence (optional)
              <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} className={`${inputClass} py-2`} />
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={busy || form.title.length < 5 || form.description.length < 10} className={primaryButton}>Submit</button>
              <button type="button" className={secondaryButton} onClick={() => setForm(null)}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!viewing} title={detail ? `${detail.case_number} · ${detail.title}` : "Case"} onClose={() => setViewing(null)} width="max-w-[680px]">
        {!detail ? <LoadState loading /> : (
          <div className="flex flex-col gap-4">
            {detail.resolution && <Notice tone="green">Resolution: {detail.resolution}</Notice>}
            <ol className="flex max-h-[360px] flex-col gap-3 overflow-y-auto border-l border-[#E5E7EB] pl-4">
              {detail.timeline.map((e) => (
                <li key={e.id}>
                  <p className="text-[12px] text-[#9CA3AF]">{e.actor_name || "A R Buildwel"} · {formatDate(e.created_at)}</p>
                  {e.body && <p className="whitespace-pre-line text-[14px] text-[#374151]">{e.body}</p>}
                  {(e.attachments || []).length > 0 && <p className="text-[12px] text-[#6B7280]">{e.attachments.length} file(s) attached</p>}
                </li>
              ))}
            </ol>
            {open && (
              <div className="flex flex-col gap-2">
                <textarea rows={3} value={reply} onChange={(e) => setReply(e.target.value)} className={`${inputClass} h-auto py-2`} placeholder="Add details" />
                <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} className={`${inputClass} py-2`} />
                <button type="button" disabled={busy || (!reply && !files.length)} className={`${primaryButton} w-fit`} onClick={sendReply}>Send</button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

export default DisputesSection;
