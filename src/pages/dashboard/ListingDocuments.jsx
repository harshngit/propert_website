import React, { useRef, useState } from "react";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { Badge, LoadState, Notice, inputClass, labelClass, primaryButton, useLoad } from "./ui";

// Documents & due diligence for a seller / owner (Modules 20 / 21): the
// checklist for this listing with what is still missing, upload with who
// can see each file (A R always; buyers only once a deal reaches
// negotiation), findings on title, encumbrance and possession, and NRI
// guidance. Every upload is classified and checked automatically.

const TYPES = [
  ["", "Detect automatically"], ["sale_deed", "Sale deed"], ["title_document", "Earlier title document"], ["encumbrance_certificate", "Encumbrance certificate"],
  ["tax_receipt", "Property tax receipt"], ["id_proof", "ID proof"], ["occupancy_certificate", "Occupancy certificate"], ["completion_certificate", "Completion certificate"],
  ["approved_plan", "Sanctioned plan"], ["mutation_record", "Mutation / khata"], ["society_noc", "Society NOC"], ["bank_noc", "Bank NOC / loan closure"],
  ["allotment_letter", "Allotment letter"], ["agreement_to_sell", "Agreement to sell"], ["rera_certificate", "RERA certificate"], ["power_of_attorney", "Power of attorney"],
  ["possession_letter", "Possession letter"], ["rent_agreement", "Rent agreement"], ["utility_bill", "Utility bill"], ["other", "Other"],
];
const STATUS = { complete: ["green", "All key documents in"], in_progress: ["amber", "Documents pending"], issues: ["red", "Needs attention"], not_started: ["gray", "Not started"] };

function ListingDocuments({ listing }) {
  const { accessToken } = useAuth();
  const report = useLoad((t) => portal.ddReport(t, listing.id), [listing.id]);
  const docs = useLoad((t) => portal.propertyDocuments(t, listing.id), [listing.id]);
  const fileRef = useRef(null);
  const [type, setType] = useState("");
  const [buyers, setBuyers] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const upload = async (e) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setBusy(true);
    setMsg(null);
    try {
      const r = await portal.addPropertyDocument(accessToken, listing.id, { file, documentType: type, visibleTo: ["owner", "broker", ...(buyers ? ["buyer"] : [])] });
      setMsg({ tone: "green", text: `Uploaded${r.analysis?.type ? ` - recognised as ${r.analysis.type.replace(/_/g, " ")}` : ""}.` });
      fileRef.current.value = "";
      setType("");
      report.reload();
      docs.reload();
    } catch (err) {
      setMsg({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  if (report.loading && !report.data) return <LoadState loading />;
  if (report.error) return <LoadState error={report.error} onRetry={report.reload} />;
  const r = report.data;
  const [tone, label] = STATUS[r.status] || STATUS.not_started;
  return (
    <div className="flex flex-col gap-4">
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      <div className="flex items-center gap-2">
        <Badge tone={tone}>{label}</Badge>
        {r.missing.length > 0 && <span className="text-[13px] text-[#6B7280]">{r.missing.length} required document{r.missing.length === 1 ? "" : "s"} missing</span>}
      </div>
      <ul className="grid gap-1 sm:grid-cols-2">
        {r.checklist.map((c) => (
          <li key={c.type} className={`text-[13px] ${c.present ? "text-[#065F46]" : c.required ? "text-[#B91C1C]" : "text-[#6B7280]"}`}>
            {c.present ? "✓" : "○"} {c.label}{!c.required ? " (optional)" : ""}
          </li>
        ))}
      </ul>

      {r.riskFlags.length > 0 && (
        <div className="rounded-[12px] bg-[#FFFBEB] p-3 text-[13px] text-[#92400E]">
          <p className="font-bold">Things our team will check with you</p>
          <ul className="mt-1 list-disc pl-5">{r.riskFlags.slice(0, 6).map((f, i) => <li key={i}>{f.detail || f.category}</li>)}</ul>
        </div>
      )}
      {r.nri?.points?.length > 0 && (
        <div className="rounded-[12px] bg-[#EEF2FF] p-3 text-[13px] text-[#3730A3]">
          <p className="font-bold">NRI considerations</p>
          <ul className="mt-1 list-disc pl-5">{r.nri.points.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
      )}

      <form onSubmit={upload} className="grid gap-3 rounded-[12px] border border-[#E5E7EB] p-3 sm:grid-cols-2">
        <label className={labelClass}>
          File (PDF or photo)
          <input ref={fileRef} type="file" accept=".pdf,image/*" className={`${inputClass} py-2`} />
        </label>
        <label className={labelClass}>
          Document type
          <select value={type} onChange={(e) => setType(e.target.value)} className={inputClass}>
            {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        </label>
        <label className="flex items-center gap-2 text-[13px] text-[#374151] sm:col-span-2">
          <input type="checkbox" checked={buyers} onChange={(e) => setBuyers(e.target.checked)} className="h-4 w-4 accent-[#E51C23]" />
          Share with buyers once a deal reaches negotiation
        </label>
        <button type="submit" disabled={busy} className={`${primaryButton} sm:col-span-2 sm:w-fit`}>{busy ? "Uploading…" : "Upload document"}</button>
      </form>

      <div>
        <p className="text-[14px] font-bold text-[#111827]">Uploaded ({(docs.data?.documents || []).length})</p>
        <ul className="mt-2 flex flex-col gap-2">
          {(docs.data?.documents || []).map((d) => (
            <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 text-[13px]">
              <a href={d.document_url} target="_blank" rel="noreferrer" className="font-semibold text-[#111827] hover:text-[#E51C23]">{d.file_name || d.document_type.replace(/_/g, " ")}</a>
              <span className="flex items-center gap-2">
                <span className="text-[#6B7280]">{d.document_type.replace(/_/g, " ")}</span>
                <Badge status={d.status === "approved" ? "approved" : d.status === "rejected" ? "rejected" : "pending"}>{d.status}</Badge>
              </span>
              {d.review_notes && <span className="w-full text-[12px] text-[#B91C1C]">{d.review_notes}</span>}
            </li>
          ))}
        </ul>
      </div>
      {(r.disclaimers || []).map((d) => <p key={d.key} className="text-[11px] text-[#9CA3AF]">{d.title}: {d.content_html}</p>)}
    </div>
  );
}

export default ListingDocuments;
