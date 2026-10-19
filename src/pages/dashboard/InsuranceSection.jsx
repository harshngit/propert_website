import React, { useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, EmptyState, LoadState, Modal, Notice, SectionHeader, formatDate, formatINR, inputClass, labelClass, linkButton, primaryButton, secondaryButton, useLoad } from "./ui";

// Insurance (Module 26) - referral only. Your property's details are filled
// in from the deal; choose the cover and an insurer, and our insurance desk
// refers you to that insurer's licensed officer. The policy and the premium
// are between you and the insurer - nothing is paid through this site.

const STATUS = { requested: ["Request received", "blue"], option_selected: ["Insurer chosen", "blue"], referred: ["With the insurer", "amber"], issued: ["Policy issued", "green"], declined: ["Declined", "red"], cancelled: ["Cancelled", "gray"] };
const money = (v) => (v === null || v === undefined ? "—" : formatINR(v));

function RequestForm({ deals, onDone, onCancel }) {
  const { accessToken } = useAuth();
  const [dealId, setDealId] = useState(deals[0]?.id || "");
  const [preview, setPreview] = useState(null);
  const [coverType, setCoverType] = useState("");
  const [institutionId, setInstitutionId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!dealId) return;
    setPreview(null);
    apiRequest(`/finance/insurance/preview?dealId=${dealId}`, { token: accessToken })
      .then((r) => { setPreview(r.data); setCoverType(r.data.propertyDetails.suggestedCover || r.data.coverTypes[0]?.value || ""); setInstitutionId(""); })
      .catch((err) => setError(err.message));
  }, [dealId, accessToken]);
  const d = preview?.propertyDetails;
  const cover = preview?.coverTypes.find((c) => c.value === coverType);
  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      onDone((await apiRequest("/finance/insurance", { method: "POST", token: accessToken, body: { coverType, dealId, ...(institutionId ? { institutionId } : {}) } })).data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-4 text-[14px]">
      {error && <Notice tone="red">{error}</Notice>}
      <div><label className={labelClass}>Which deal is this for?</label><select className={inputClass} value={dealId} onChange={(e) => setDealId(e.target.value)}>{deals.map((x) => <option key={x.id} value={x.id}>{x.property_title || "Deal"}</option>)}</select></div>
      {!preview ? <p className="text-[#6B7280]">Filling in your property details…</p> : (
        <>
          <div className="rounded-[14px] bg-[#F9FAFB] p-4">
            <p className={labelClass}>Your property (filled in for you)</p>
            <p data-no-translate><b>{d.title || "—"}</b>{d.city ? ` · ${[d.locality, d.city].filter(Boolean).join(", ")}` : ""}</p>
            <p className="text-[13px] text-[#4B5563]">{d.propertyType ? <span data-no-translate>{d.propertyType} · </span> : null}{d.areaSqft ? `${d.areaSqft} sq ft · ` : ""}value {money(d.propertyValue)}{d.lender ? <> · home loan with <span data-no-translate>{d.lender}</span></> : null}</p>
          </div>
          <div><label className={labelClass}>Cover</label><select className={inputClass} value={coverType} onChange={(e) => { setCoverType(e.target.value); setInstitutionId(""); }}>{preview.coverTypes.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></div>
          <div>
            <p className={labelClass}>Insurers offering this cover</p>
            {!cover || cover.insurers.length === 0 ? <p className="text-[#6B7280]">No empanelled insurer is listed for this cover yet. Send the request and our insurance desk will suggest one.</p> : cover.insurers.map((i) => (
              <label key={i.institutionId} className="mt-2 flex cursor-pointer items-center gap-3 rounded-[12px] border border-[#E5E7EB] p-3">
                <input type="radio" name="insurer" checked={institutionId === i.institutionId} onChange={() => setInstitutionId(i.institutionId)} />
                <b data-no-translate>{i.name}</b>
              </label>
            ))}
          </div>
          <p className="text-[12px] leading-5 text-[#6B7280]">{preview.disclaimer}</p>
        </>
      )}
      <div className="flex justify-end gap-2"><button type="button" className={secondaryButton} onClick={onCancel}>Cancel</button><button type="button" className={primaryButton} disabled={busy || !preview || !coverType} onClick={submit}>{busy ? "Sending…" : "Send request"}</button></div>
    </div>
  );
}

function RequestDetail({ id, onClose, onChanged }) {
  const { accessToken } = useAuth();
  const { data: r, loading, error, reload } = useLoad((t) => apiRequest(`/finance/insurance/${id}`, { token: t }).then((x) => x.data), [id]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
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
  const d = r?.propertyDetails || {};
  return (
    <Modal open title={r ? `${r.requestNumber} · ${r.coverLabel}` : "Insurance request"} onClose={onClose} width="max-w-[620px]">
      <LoadState loading={loading && !r} error={error} onRetry={reload} />
      {r && (
        <div className="space-y-4 text-[14px] text-[#374151]">
          <p><Badge tone={STATUS[r.status][1]}>{STATUS[r.status][0]}</Badge></p>
          {message && <Notice tone="red">{message}</Notice>}
          <div><p className={labelClass}>Property</p><p data-no-translate>{d.title || "—"}{d.city ? ` · ${[d.locality, d.city].filter(Boolean).join(", ")}` : ""}</p><p className="text-[13px] text-[#4B5563]">Sum insured {money(r.sumInsured)}</p></div>
          <div>
            <p className={labelClass}>Insurer</p>
            {r.insurer ? <p><b data-no-translate>{r.insurer.name}</b>{r.insurer.officer ? <> · insurance officer <span data-no-translate>{r.insurer.officer.name}</span> (<span data-no-translate>{r.insurer.officer.code}</span>)</> : <> · waiting for our insurance desk to refer it</>}</p> : <p className="text-[#6B7280]">Not chosen yet.</p>}
            {["requested", "option_selected"].includes(r.status) && r.coverageOptions.map((o) => (
              <button key={o.institutionId} type="button" disabled={busy || r.insurer?.institutionId === o.institutionId} className={`${secondaryButton} mr-2 mt-2`} onClick={() => run(`/finance/insurance/${id}/select`, { institutionId: o.institutionId })}><span data-no-translate>{r.insurer?.institutionId === o.institutionId ? `Chosen: ${o.name}` : `Choose ${o.name}`}</span></button>
            ))}
          </div>
          {r.policy && <div><p className={labelClass}>Policy</p><p><b data-no-translate>{r.policy.number}</b> · {formatDate(r.policy.start)} to {formatDate(r.policy.end)}{r.policy.premiumAmount ? ` · premium ${money(r.policy.premiumAmount)} (paid to the insurer)` : ""}</p></div>}
          <div>
            <p className={labelClass}>Updates</p>
            {r.timeline.map((t, i) => <p key={i} className="border-b border-[#F3F4F6] py-1.5 text-[13px] last:border-0"><b>{(STATUS[t.kind] || [String(t.kind).replace(/_/g, " ")])[0]}</b> · {formatDate(t.at)}{t.note ? <><br /><span className="text-[#4B5563]" data-no-translate>{t.note}</span></> : null}</p>)}
          </div>
          <p className="text-[12px] leading-5 text-[#6B7280]">{r.disclaimer}</p>
          {["requested", "option_selected"].includes(r.status) && <div className="flex justify-end"><button type="button" className={secondaryButton} disabled={busy} onClick={() => run(`/finance/insurance/${id}/cancel`, { reason: "Cancelled by me" })}>Cancel this request</button></div>}
        </div>
      )}
    </Modal>
  );
}

function InsuranceSection() {
  const { data, loading, error, reload } = useLoad((t) => apiRequest("/finance/insurance/mine", { token: t }).then((r) => r.data));
  const deals = useLoad((t) => portal.myDeals(t).catch(() => []));
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(null);
  const [notice, setNotice] = useState(null);
  const dealList = (Array.isArray(deals.data) ? deals.data : []).filter((d) => d.property_id);
  const rows = data?.requests || [];
  return (
    <div>
      <SectionHeader title="Insurance" subtitle="Home and loan-protection cover for the property you are buying - we refer you to an empanelled insurer and keep your policy on record." />
      {notice && <div className="mb-4"><Notice tone={notice.tone}>{notice.text}</Notice></div>}
      <div className="mb-4">
        {dealList.length > 0 ? <button type="button" className={primaryButton} onClick={() => { setNotice(null); setCreating(true); }}>Get insurance for my property</button> : <Notice tone="amber">Insurance is arranged once you are moving ahead on a property. Your deals appear under My Deals &amp; Invoices.</Notice>}
      </div>
      <LoadState loading={loading && !data} error={error} onRetry={reload} />
      {data && !rows.length && <EmptyState title="No insurance requests yet" body="When you are buying a property, ask here and your property details are filled in for you." />}
      <div className="space-y-3">
        {rows.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-extrabold text-[#111827]"><span data-no-translate>{r.requestNumber}</span> · {r.coverLabel} <Badge tone={STATUS[r.status][1]}>{STATUS[r.status][0]}</Badge></p>
                <p className="mt-1 text-[13px] text-[#4B5563]">{r.propertyTitle ? <><span data-no-translate>{r.propertyTitle}</span> · </> : null}sum insured {money(r.sumInsured)}{r.insurer ? <> · <span data-no-translate>{r.insurer.name}</span></> : null}</p>
                {r.policy && <p className="mt-1 text-[12px] text-[#9CA3AF]">Policy <span data-no-translate>{r.policy.number}</span> · valid to {formatDate(r.policy.end)}</p>}
              </div>
              <button type="button" className={linkButton} onClick={() => setOpen(r.id)}>View</button>
            </div>
          </Card>
        ))}
      </div>
      {data?.disclaimer && <p className="mt-5 text-[12px] leading-5 text-[#6B7280]">{data.disclaimer}</p>}
      <Modal open={creating} title="Get insurance" onClose={() => setCreating(false)} width="max-w-[600px]">
        {creating && <RequestForm deals={dealList} onCancel={() => setCreating(false)} onDone={(made) => { setCreating(false); setNotice({ tone: "green", text: `Request ${made.requestNumber} received. Our insurance desk will refer you to the insurer.` }); reload(); }} />}
      </Modal>
      {open && <RequestDetail id={open} onClose={() => setOpen(null)} onChanged={reload} />}
    </div>
  );
}

export default InsuranceSection;
