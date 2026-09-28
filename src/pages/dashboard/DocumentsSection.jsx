import React, { useState } from "react";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, EmptyState, LoadState, Notice, SectionHeader, formatDate, inputClass, labelClass, primaryButton, useLoad } from "./ui";

// Documents: KYC, agreements, receipts and NOCs shared with the A R Buildwel
// team. Each upload is reviewed; the status shows here.

const TYPES = [
  { value: "kyc", label: "KYC (PAN / Aadhaar / passport)" },
  { value: "agreement", label: "Agreement" },
  { value: "payment_receipt", label: "Payment receipt" },
  { value: "noc", label: "NOC" },
  { value: "other", label: "Other" },
];
const typeName = (v) => TYPES.find((t) => t.value === v)?.label.split(" (")[0] || v;

function DocumentsSection() {
  const { accessToken } = useAuth();
  const { data, loading, error, reload } = useLoad((token) => portal.documents(token));
  const [file, setFile] = useState(null);
  const [documentType, setDocumentType] = useState("kyc");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [inputKey, setInputKey] = useState(0);

  const upload = async (event) => {
    event.preventDefault();
    if (!file) return;
    setSaving(true);
    setNotice(null);
    try {
      await portal.uploadDocument(accessToken, file, documentType);
      setNotice({ tone: "green", text: "Uploaded - our team will review it." });
      setFile(null);
      setInputKey((k) => k + 1);
      await reload();
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <SectionHeader title="Documents" subtitle="Share documents securely with your A R Buildwel team. Files are private and only visible to you and the team handling your deal." />
      <Card className="mb-5">
        <form onSubmit={upload} className="grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <label className={labelClass}>
            Document type
            <select value={documentType} onChange={(e) => setDocumentType(e.target.value)} className={inputClass}>
              {TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            File (PDF or image, up to 20 MB)
            <input
              key={inputKey}
              type="file"
              accept=".pdf,image/*,.doc,.docx"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="mt-1 block w-full text-[14px] file:mr-3 file:rounded-[10px] file:border-0 file:bg-[#FDE8E8] file:px-4 file:py-2 file:font-bold file:text-[#E51C23]"
            />
          </label>
          <button type="submit" disabled={!file || saving} className={primaryButton}>
            {saving ? "Uploading…" : "Upload"}
          </button>
        </form>
        {notice && (
          <div className="mt-3">
            <Notice tone={notice.tone}>{notice.text}</Notice>
          </div>
        )}
      </Card>
      <LoadState loading={loading} error={error} onRetry={reload} />
      {data && !data.length && <EmptyState title="No documents yet" body="Upload your KYC to speed things up when you're ready to close a deal." />}
      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-[16px] border border-[#E5E7EB] bg-white">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead className="bg-[#F9FAFB] text-[12px] uppercase tracking-[0.04em] text-[#6B7280]">
              <tr>
                <th className="px-4 py-2.5">Document</th>
                <th className="px-4 py-2.5">Type</th>
                <th className="px-4 py-2.5">Uploaded</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {data.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-2.5">
                    <a href={d.document_url} target="_blank" rel="noreferrer" className="font-semibold text-[#111827] hover:text-[#E51C23]">
                      {d.file_name || "Document"}
                    </a>
                    {d.review_notes && <p className="text-[12px] text-[#6B7280]">{d.review_notes}</p>}
                  </td>
                  <td className="px-4 py-2.5">{typeName(d.document_type)}</td>
                  <td className="px-4 py-2.5">{formatDate(d.created_at)}</td>
                  <td className="px-4 py-2.5">
                    <Badge status={d.status}>{d.status === "pending" ? "In review" : undefined}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DocumentsSection;
