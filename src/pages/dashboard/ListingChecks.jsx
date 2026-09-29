import React, { useState } from "react";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { Badge, LoadState, Notice, inputClass, labelClass, linkButton, primaryButton, secondaryButton, useLoad } from "./ui";

// Sec. 9 for the lister: verification level (System / Seller / Legally /
// Site Verified), the automatic system checks, requesting a higher level
// with documents, what to do when the property was already listed first
// (routing / update / cancel), and appeals. Risk scores stay internal.

const LEVELS = { 1: "Verified by System", 2: "Seller Verified", 3: "Legally Verified", 4: "Site Verified" };
const LEVEL_HELP = {
  2: "Upload ownership proof (sale deed, allotment letter). We verify your ID, call you and confirm recent photos - usually within 24 hours. +15% search boost.",
  3: "Upload the title chain (3+ years), encumbrance certificate and tax receipts for our legal panel. Automatic for sales above ₹1 Cr. +25% search boost.",
  4: "An A R Buildwel representative visits, checks photos, condition, amenities and measurements and uploads an inspection report. +35% search boost.",
};
const CHECKS = {
  min_3_images: "At least 3 photos",
  mandatory_fields: "All key details filled",
  geo_in_india: "Map location set",
  no_duplicate: "Not already listed",
  no_spam: "No contact details or spam",
};

function ListingChecks({ listing, onChanged }) {
  const { accessToken } = useAuth();
  const { data, loading, error, reload } = useLoad((t) => portal.listingChecks(t, listing.id), [listing.id]);
  const [requesting, setRequesting] = useState(null);
  const [appealing, setAppealing] = useState(false);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async (fn, okText) => {
    setBusy(true);
    try {
      await fn();
      setMsg({ tone: "green", text: okText });
      setRequesting(null);
      setAppealing(false);
      setText("");
      setFiles([]);
      reload();
      onChanged?.();
    } catch (err) {
      setMsg({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  if (loading && !data) return <LoadState loading />;
  if (error) return <LoadState error={error} onRetry={reload} />;
  const d = data;
  const byLevel = Object.fromEntries((d.verifications || []).map((v) => [v.level, v]));

  return (
    <div className="flex flex-col gap-4">
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      <div className="flex flex-wrap items-center gap-2">
        {d.verificationLevel > 0 ? <Badge tone="green">✓ {LEVELS[d.verificationLevel]}</Badge> : <Badge tone="gray">Not verified yet</Badge>}
        {d.underReview && <Badge tone="amber">Under review</Badge>}
      </div>

      {byLevel[1] && (
        <div>
          <p className="text-[14px] font-bold text-[#111827]">Automatic checks</p>
          <ul className="mt-2 grid gap-1 sm:grid-cols-2">
            {Object.entries(byLevel[1].checks || {}).map(([k, ok]) => (
              <li key={k} className={`text-[13px] ${ok ? "text-[#065F46]" : "text-[#B91C1C]"}`}>{ok ? "✓" : "✗"} {CHECKS[k] || k}</li>
            ))}
          </ul>
        </div>
      )}

      {d.duplicateStatus === "blocked" && d.status === "pending_approval" && (
        <div className="rounded-[14px] border border-[#C7D2FE] bg-[#EEF2FF] p-4">
          <p className="text-[14px] font-bold text-[#111827]">This property was already listed on PropertySerch</p>
          <p className="mt-1 text-[13px] text-[#4B5563]">The first listing keeps priority. Choose how to proceed:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button type="button" disabled={busy} className={secondaryButton} onClick={() => run(() => portal.resolveDuplicate(accessToken, listing.id, "request_routing"), "Request sent to the original lister.")}>Work with the original lister</button>
            <button type="button" disabled={busy} className={secondaryButton} onClick={() => run(() => portal.resolveDuplicate(accessToken, listing.id, "update_existing"), "Your newer details were sent for the existing listing.")}>Send as an update</button>
            <button type="button" disabled={busy} className={secondaryButton} onClick={() => run(() => portal.resolveDuplicate(accessToken, listing.id, "cancel"), "Listing cancelled.")}>Cancel this listing</button>
          </div>
        </div>
      )}

      {d.status === "approved" && (
        <div>
          <p className="text-[14px] font-bold text-[#111827]">Get a higher verification badge</p>
          <div className="mt-2 flex flex-col gap-2">
            {[2, 3, 4].map((lvl) => {
              const v = byLevel[lvl];
              return (
                <div key={lvl} className="rounded-[12px] border border-[#E5E7EB] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[14px] font-semibold text-[#111827]">{LEVELS[lvl]}</p>
                    {v ? (
                      <Badge status={v.status === "verified" ? "approved" : v.status === "rejected" ? "rejected" : "pending"}>{v.status.replace("_", " ")}</Badge>
                    ) : (
                      <button type="button" className={linkButton} onClick={() => { setRequesting(lvl); setText(""); setFiles([]); }}>Request</button>
                    )}
                  </div>
                  <p className="mt-1 text-[12px] text-[#6B7280]">{LEVEL_HELP[lvl]}</p>
                  {v?.status === "rejected" && (
                    <p className="mt-1 text-[12px] text-[#B91C1C]">{v.notes} <button type="button" className={linkButton} onClick={() => { setRequesting(lvl); setText(""); setFiles([]); }}>Try again</button></p>
                  )}
                  {requesting === lvl && (
                    <div className="mt-3 flex flex-col gap-2">
                      <label className={labelClass}>
                        Documents
                        <input type="file" multiple accept=".pdf,image/*" onChange={(e) => setFiles([...e.target.files])} className={`${inputClass} py-2`} />
                      </label>
                      <label className={labelClass}>
                        Note (optional)
                        <input value={text} onChange={(e) => setText(e.target.value)} className={inputClass} />
                      </label>
                      <div className="flex gap-2">
                        <button type="button" disabled={busy} className={primaryButton} onClick={() => run(() => portal.requestListingVerification(accessToken, listing.id, { level: lvl, note: text, files }), "Verification requested.")}>Submit</button>
                        <button type="button" className={secondaryButton} onClick={() => setRequesting(null)}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {((d.status === "rejected" && d.fraud?.band === "critical") || d.duplicateStatus === "blocked") && !(d.appeals || []).some((a) => a.status === "pending") && (
        <div>
          {!appealing ? (
            <button type="button" className={linkButton} onClick={() => setAppealing(true)}>Appeal this decision</button>
          ) : (
            <div className="flex flex-col gap-2">
              <label className={labelClass}>
                Why is this wrong?
                <textarea rows={3} value={text} onChange={(e) => setText(e.target.value)} className={`${inputClass} h-auto py-2`} />
              </label>
              <label className={labelClass}>
                Evidence
                <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} className={`${inputClass} py-2`} />
              </label>
              <div className="flex gap-2">
                <button type="button" disabled={busy || text.trim().length < 10} className={primaryButton} onClick={() => run(() => portal.appealListing(accessToken, listing.id, { reason: text.trim(), files }), "Appeal submitted - an admin will review it.")}>Submit appeal</button>
                <button type="button" className={secondaryButton} onClick={() => setAppealing(false)}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}
      {(d.appeals || []).map((a) => (
        <p key={a.id} className="text-[12px] text-[#6B7280]">Appeal: <b>{a.status}</b>{a.decision_note ? ` - ${a.decision_note}` : ""}</p>
      ))}
    </div>
  );
}

export default ListingChecks;
