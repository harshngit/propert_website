import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";

// Deal room (Module 39) on a deal page: verified buyer -> sign the NDA ->
// admin approval -> documents. Documents open through short-lived links
// (PDFs watermarked with the viewer's identity); the viewer blurs when the
// window loses focus and blocks right-click, as a screen-capture deterrent.

const DOC_TYPE_LABELS = {
  auction_notice: "Auction notice", sale_notice: "Sale notice", emd_receipt: "EMD details", title_documents: "Title documents",
  valuation_report: "Valuation report", legal_opinion: "Legal opinion", inspection_report: "Inspection report",
  term_sheet: "Term sheet", financials: "Financials", photos: "Photos", other: "Document",
  land_records: "Land records", noc: "NOC", fire_noc: "Fire NOC", municipal_approval: "Municipal approval", encumbrance_certificate: "Encumbrance certificate",
  audited_financials: "Audited financials", affiliation_certificate: "Affiliation certificate", trust_deed: "Trust deed", enrollment_records: "Enrollment records", regulatory_approval: "Regulatory approval",
};

// A stable, non-identifying device fingerprint for the access log.
function deviceFingerprint() {
  const raw = [navigator.userAgent, navigator.language, screen.width, screen.height, screen.colorDepth, Intl.DateTimeFormat().resolvedOptions().timeZone].join("|");
  let h = 0;
  for (let i = 0; i < raw.length; i += 1) h = (Math.imul(31, h) + raw.charCodeAt(i)) | 0;
  return `fp-${(h >>> 0).toString(16)}`;
}

function Viewer({ doc, url, onClose }) {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    const hide = () => setHidden(true);
    const show = () => setHidden(false);
    const onVisibility = () => (document.hidden ? hide() : show());
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "PrintScreen") hide();
    };
    window.addEventListener("blur", hide);
    window.addEventListener("focus", show);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("keyup", onKey);
    return () => {
      window.removeEventListener("blur", hide);
      window.removeEventListener("focus", show);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("keyup", onKey);
    };
  }, [onClose]);

  const isImage = /^image\//.test(doc.mime_type || "") || /\.(png|jpe?g|webp|gif)$/i.test(doc.file_name || "");
  return (
    <div className="fixed inset-0 z-[80] flex flex-col bg-black/80 p-3 sm:p-6" onContextMenu={(e) => e.preventDefault()}>
      <div className="mb-2 flex items-center justify-between text-white">
        <p className="truncate text-sm font-semibold">{doc.title} · v{doc.version}</p>
        <button type="button" onClick={onClose} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold hover:bg-white/20">Close</button>
      </div>
      <div className={`relative flex-1 overflow-hidden rounded-xl bg-white transition ${hidden ? "blur-xl" : ""}`}>
        {isImage ? (
          <img src={url} alt={doc.title} className="h-full w-full select-none object-contain" draggable={false} />
        ) : (
          <iframe title={doc.title} src={`${url}#toolbar=0`} className="h-full w-full" />
        )}
        {hidden && <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#111827]">Confidential - return to this window to continue viewing</div>}
      </div>
      <p className="mt-2 text-center text-[11px] text-white/60">Confidential. Access is logged and this link expires shortly.</p>
    </div>
  );
}

// `onChanged` (optional) fires after the NDA is signed; `profileLink` overrides where an unverified buyer is sent.
function DealRoomPanel({ dealId, onChanged, profileLink }) {
  const { accessToken, isAuthenticated, user } = useAuth();
  const location = useLocation();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [showNda, setShowNda] = useState(false);

  const load = useCallback(() => {
    if (!accessToken) return;
    apiRequest(`/deal-room/${dealId}`, { token: accessToken })
      .then((res) => setRoom(res.data))
      .catch((err) => setError(err.message));
  }, [accessToken, dealId]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    if (user?.fullName) setName((n) => n || user.fullName);
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-[#E5E7EB] p-5">
        <p className="text-sm font-bold text-[#111827]">Deal room</p>
        <p className="mt-1 text-sm text-[#6B7280]">Auction notices, legal papers and EMD details are shared with verified investors under an NDA.</p>
        <Link to="/login" state={{ from: location }} className="mt-3 inline-block text-sm font-bold text-[#E51C23]">Sign in to request access →</Link>
      </div>
    );
  }
  if (error) return <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  if (!room) return <div className="rounded-2xl border border-[#E5E7EB] p-5 text-sm text-[#6B7280]">Loading deal room…</div>;

  const a = room.access;

  const sign = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await apiRequest(`/deal-room/${dealId}/nda`, { method: "POST", token: accessToken, body: { fullName: name, accept: accepted } });
      setRoom(res.data);
      setShowNda(false);
      onChanged?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const open = async (doc, purpose) => {
    setBusy(true);
    try {
      const res = await apiRequest(`/deal-room/documents/${doc.id}/url?purpose=${purpose}&fp=${deviceFingerprint()}`, { token: accessToken });
      if (purpose === "download") {
        window.open(res.data.url, "_blank", "noopener");
      } else {
        setViewing({ doc, url: res.data.url });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E5E7EB] p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold text-[#111827]">Deal room</p>
        <span className="text-[11px] font-semibold text-[#6B7280]">{room.documentCount} document{room.documentCount === 1 ? "" : "s"}</span>
      </div>

      <ol className="mt-3 space-y-1.5 text-[13px]">
        {[
          ["Verified investor", a.verified || a.status === "staff"],
          ["NDA signed", a.ndaSigned],
          ["Approved by A R Buildwel", a.approved],
        ].map(([label, done]) => (
          <li key={label} className={`flex items-center gap-2 ${done ? "text-emerald-700" : "text-[#6B7280]"}`}>
            <span className={`flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${done ? "bg-emerald-600 text-white" : "border border-[#D1D5DB]"}`}>{done ? "✓" : ""}</span>
            {label}
          </li>
        ))}
      </ol>

      {!a.verified && a.status !== "staff" && (
        <div className="mt-3 text-[13px] text-[#6B7280]">
          {a.verifiedReason}{" "}
          <Link to={profileLink?.to || "/account/investor-profile"} className="font-bold text-[#E51C23]">{profileLink?.label || "Investor profile"} →</Link>
        </div>
      )}

      {a.verified && ["not_requested", "rejected", "revoked", "expired"].includes(a.status) && (
        <>
          {a.status !== "not_requested" && (
            <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-[13px] text-amber-800">
              {a.status === "expired" ? "Your access has expired." : `Your access was ${a.status}.`}
              {a.decisionReason ? ` ${a.decisionReason}` : ""} You can sign again to re-request.
            </p>
          )}
          {!showNda ? (
            <button type="button" onClick={() => setShowNda(true)} className="cta-red mt-4 inline-flex h-[42px] w-full items-center justify-center rounded-[10px] text-sm font-bold text-white">
              Review NDA &amp; request access
            </button>
          ) : (
            <form onSubmit={sign} className="mt-4 space-y-3">
              <div className="max-h-40 overflow-y-auto rounded-lg bg-[#F9FAFB] p-3 text-[12px] leading-5 text-[#374151]">
                <p className="font-bold">{room.nda.title} (v{room.nda.version})</p>
                <p className="mt-1 whitespace-pre-line">{room.nda.text}</p>
              </div>
              <label className="block text-[12px] font-semibold text-[#374151]">
                Type your full name to sign
                <input required minLength={3} value={name} onChange={(e) => setName(e.target.value)} className="mt-1 h-[40px] w-full rounded-[10px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#E51C23]" />
              </label>
              <label className="flex items-start gap-2 text-[12px] text-[#374151]">
                <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#E51C23]" />
                I have read and agree to this confidentiality undertaking.
              </label>
              <button type="submit" disabled={!accepted || busy} className="cta-red inline-flex h-[42px] w-full items-center justify-center rounded-[10px] text-sm font-bold text-white disabled:opacity-60">
                {busy ? "Signing…" : "Sign NDA & request access"}
              </button>
            </form>
          )}
        </>
      )}

      {a.status === "pending_approval" && (
        <p className="mt-3 rounded-lg bg-sky-50 px-3 py-2 text-[13px] text-sky-800">NDA signed - our team will approve your access shortly. We'll notify you.</p>
      )}

      {a.open && (
        <div className="mt-4">
          {room.documents.length === 0 ? (
            <p className="text-[13px] text-[#6B7280]">No documents in this deal room yet.</p>
          ) : (
            <ul className="divide-y divide-[#F3F4F6] rounded-xl border border-[#F3F4F6]">
              {room.documents.map((doc) => (
                <li key={doc.id} className="flex items-center justify-between gap-2 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[#111827]">{doc.title}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{DOC_TYPE_LABELS[doc.document_type] || "Document"} · v{doc.version}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button type="button" disabled={busy} onClick={() => open(doc, "view")} className="text-[12px] font-bold text-[#E51C23]">View</button>
                    {doc.download_allowed && (
                      <button type="button" disabled={busy} onClick={() => open(doc, "download")} className="text-[12px] font-bold text-[#374151]">Download</button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {a.expiresAt && <p className="mt-2 text-[11px] text-[#9CA3AF]">Access valid until {new Date(a.expiresAt).toLocaleDateString("en-IN")}</p>}
        </div>
      )}

      {viewing && <Viewer doc={viewing.doc} url={viewing.url} onClose={() => setViewing(null)} />}
    </div>
  );
}

export default DealRoomPanel;
