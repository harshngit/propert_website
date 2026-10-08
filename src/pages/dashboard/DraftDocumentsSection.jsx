import React, { useState } from "react";
import { apiRequest } from "../../api/client";
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, EmptyState, LoadState, Notice, SectionHeader, formatDate, inputClass, labelClass, linkButton, primaryButton, secondaryButton, useLoad } from "./ui";

// Draft documents (Module 50): pick a template, fill in only what it asks
// for, and download a working draft as PDF or Word - or a blank version to
// fill in by hand. Every draft is for your own advocate to review, stamp
// and register before signing.

function Fill({ template, onBack }) {
  const { accessToken } = useAuth();
  const [stateCode, setStateCode] = useState("");
  const form = useLoad((token) => apiRequest(`/templates/${template.id}/form${stateCode ? `?stateCode=${stateCode}` : ""}`, { token }).then((r) => r.data), [template.id, stateCode]);
  const [values, setValues] = useState({});
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [made, setMade] = useState(null);
  const download = async (format) => {
    const res = await fetch(`${API_BASE_URL}/templates/generated/${made.id}/download?format=${format}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) return setError("Could not download the document. Please try again.");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(await res.blob());
    a.download = /filename="([^"]+)"/.exec(res.headers.get("content-disposition") || "")?.[1] || `document.${format}`;
    a.click();
    return null;
  };
  const generate = async (blank) => {
    setBusy(true);
    setError(null);
    try {
      const body = blank ? { blank: true } : { stateCode: stateCode || undefined, values };
      setMade((await apiRequest(`/templates/${template.id}/generate`, { method: "POST", token: accessToken, body })).data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  if (form.loading || form.error) return <LoadState loading={form.loading} error={form.error} onRetry={form.reload} />;
  const d = form.data;
  return (
    <div className="space-y-5">
      <button type="button" className={linkButton} onClick={onBack}>← All templates</button>
      <Card>
        <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#111827]">{d.template.name}</h2>
        <p className="mt-1 text-[13px] text-[#6B7280]">{d.template.description}</p>
        {error && <div className="mt-3"><Notice tone="red">{error}</Notice></div>}
        {made ? (
          <div className="mt-4 space-y-3">
            <Notice tone="green">{made.isBlank ? "Your blank form is ready." : "Your draft is ready."} <span data-no-translate>{made.documentNumber}</span></Notice>
            <div className="flex flex-wrap gap-3">
              <button type="button" className={primaryButton} onClick={() => download("pdf")}>Download PDF</button>
              <button type="button" className={secondaryButton} onClick={() => download("docx")}>Download Word</button>
              <button type="button" className={linkButton} onClick={() => setMade(null)}>Make another</button>
            </div>
          </div>
        ) : (
          <>
            {d.needsState && (
              <label className="mt-4 block"><span className={labelClass}>State the property is in</span>
                <select className={inputClass} value={stateCode} onChange={(e) => setStateCode(e.target.value)} data-no-translate><option value="">Choose the state</option>{d.states.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}</select>
              </label>
            )}
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {d.fields.map((f) => (
                <label key={f.name} className={`block ${f.fieldType === "longtext" ? "sm:col-span-2" : ""}`}>
                  <span className={labelClass}>{f.label}{f.isRequired ? " *" : ""}</span>
                  {f.fieldType === "longtext" ? <textarea rows={2} className={`${inputClass} h-auto py-2`} value={values[f.name] ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
                    : f.fieldType === "dropdown" ? <select className={inputClass} value={values[f.name] ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}><option value="">Choose</option>{f.options.map((o) => <option key={o} value={o}>{o}</option>)}</select>
                      : <input className={inputClass} type={f.fieldType === "date" ? "date" : ["number", "currency"].includes(f.fieldType) ? "number" : "text"} value={values[f.name] ?? ""} onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />}
                  {f.helpText && <span className="mt-1 block text-[12px] text-[#6B7280]">{f.helpText}</span>}
                </label>
              ))}
            </div>
            {d.computed.length > 0 && <p className="mt-3 text-[12px] text-[#6B7280]">Worked out for you: {d.computed.map((c) => c.label).join(", ")}.</p>}
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" disabled={busy || (d.needsState && !stateCode)} className={primaryButton} onClick={() => generate(false)}>Create my draft</button>
              <button type="button" disabled={busy} className={secondaryButton} onClick={() => generate(true)}>Blank version</button>
            </div>
          </>
        )}
        <p className="mt-4 rounded-[10px] bg-[#F9FAFB] px-3 py-2 text-[12px] leading-5 text-[#6B7280]">{d.disclaimer} A R Buildwel facilitates the transaction and does not act as legal counsel.</p>
      </Card>
    </div>
  );
}

export default function DraftDocumentsSection() {
  const list = useLoad((token) => apiRequest("/templates", { token }).then((r) => r.data));
  const mine = useLoad((token) => apiRequest("/templates/generated", { token }).then((r) => r.data));
  const [open, setOpen] = useState(null);
  if (open) return <Fill template={open} onBack={() => { setOpen(null); mine.reload(); }} />;
  if (list.loading || list.error) return <LoadState loading={list.loading} error={list.error} onRetry={list.reload} />;
  return (
    <div className="space-y-5">
      <SectionHeader title="Draft documents" subtitle="Ready-made agreement drafts. You fill in only the details; the document is prepared for your advocate to review, stamp and register." />
      {list.data.length === 0 ? <EmptyState title="No templates available yet" body="Your A R Buildwel representative prepares the documents for your deal." /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.data.map((t) => (
            <Card key={t.id}>
              <p className="text-[15px] font-bold text-[#111827]">{t.name}</p>
              <p className="mt-1 text-[13px] leading-5 text-[#6B7280]">{t.description}</p>
              <button type="button" className={`${primaryButton} mt-3 !h-9`} onClick={() => setOpen(t)}>Fill in and download</button>
            </Card>
          ))}
        </div>
      )}
      {(mine.data || []).length > 0 && (
        <Card>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Drafts you have made</h2>
          <ul className="mt-2 divide-y divide-[#F3F4F6]">
            {mine.data.slice(0, 15).map((g) => <li key={g.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[14px]"><span className="text-[#111827]">{g.templateName} <span className="text-[12px] text-[#6B7280]" data-no-translate>· {g.documentNumber} · {formatDate(g.createdAt)}</span></span><Badge tone={g.isBlank ? "gray" : g.draft ? "amber" : "green"}>{g.isBlank ? "Blank form" : g.draft ? "Draft" : "Advocate reviewed"}</Badge></li>)}
          </ul>
        </Card>
      )}
    </div>
  );
}
