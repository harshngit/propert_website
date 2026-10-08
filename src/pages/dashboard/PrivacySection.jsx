import React, { useState } from "react";
import { apiRequest } from "../../api/client";
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, LoadState, Notice, SectionHeader, formatDate, linkButton, primaryButton, secondaryButton, useLoad } from "./ui";

// Privacy & data (Module 33, DPDP Act 2023): download a copy of everything
// held about you, see what you consented to, and ask for deletion. Deletion
// is an anonymisation after a 30-day notice that you can cancel.

const CONSENT_LABEL = { collection: "Collecting your details", usage: "Using them to run your enquiries and deals", sharing: "Sharing them with your assigned representative", retention: "Keeping them while your account is active", rights: "Your rights over your data", security: "How they are protected", marketing: "Offers and marketing messages (optional)" };

export default function PrivacySection() {
  const { accessToken } = useAuth();
  const state = useLoad((token) => apiRequest("/user/privacy", { token }).then((r) => r.data));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  const [asking, setAsking] = useState(false);
  const [reason, setReason] = useState("");
  if (state.loading || state.error) return <LoadState loading={state.loading} error={state.error} onRetry={state.reload} />;
  const { consents, openDeletion, items } = state.data;

  const run = async (fn, okText) => {
    setBusy(true);
    setMessage(null);
    try {
      await fn();
      setMessage({ tone: "green", text: okText });
      setAsking(false);
      state.reload();
    } catch (err) {
      setMessage({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  const download = (format) => run(async () => {
    const res = await fetch(`${API_BASE_URL}/user/my-data?format=${format}`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!res.ok) throw new Error("Could not prepare your data. Please try again.");
    const blob = format === "csv" ? await res.blob() : new Blob([JSON.stringify((await res.json()).data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `propertyserch-my-data.${format}`;
    a.click();
  }, "Your data has been downloaded.");
  const marketing = consents.items.find((c) => c.category === "marketing");

  return (
    <div className="space-y-5">
      <SectionHeader title="Privacy & data" subtitle="Your rights under the Digital Personal Data Protection Act, 2023: see what we hold, take a copy, or ask us to delete it." />
      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      <Card>
        <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Download my data</h2>
        <p className="mt-1 text-[14px] leading-6 text-[#6B7280]">Your profile, requirements, listings, enquiries, deals, invoices, documents list, reviews, consents and recent activity.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" disabled={busy} onClick={() => download("csv")} className={primaryButton}>Download as CSV</button>
          <button type="button" disabled={busy} onClick={() => download("json")} className={secondaryButton}>Download as JSON</button>
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">What you agreed to</h2>
          <Badge tone={consents.upToDate ? "green" : "amber"}>{consents.upToDate ? "Up to date" : "Needs your consent"}</Badge>
          <span className="ml-auto text-[12px] text-[#6B7280]" data-no-translate>v{consents.currentVersion}</span>
        </div>
        <ul className="mt-3 divide-y divide-[#F3F4F6]">
          {consents.items.map((c) => (
            <li key={c.category} className="flex items-center justify-between gap-3 py-2.5 text-[14px]">
              <span className="text-[#111827]">{CONSENT_LABEL[c.category] || c.category}</span>
              <span className="shrink-0 text-[12px] text-[#6B7280]">{c.granted ? <>✓ {c.at ? <span data-no-translate>{formatDate(c.at)}</span> : null}</> : <span>Not given</span>}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-4">
          {!consents.upToDate && <button type="button" disabled={busy} className={linkButton} onClick={() => run(() => apiRequest("/user/consent", { method: "POST", token: accessToken, body: {} }), "Consent recorded.")}>I agree to the current privacy policy</button>}
          {marketing && <button type="button" disabled={busy} className={linkButton} onClick={() => run(() => apiRequest("/user/consent", { method: "POST", token: accessToken, body: { categories: ["marketing"], granted: !marketing.granted } }), marketing.granted ? "Marketing messages turned off." : "Marketing messages turned on.")}>{marketing.granted ? "Stop marketing messages" : "Allow marketing messages"}</button>}
        </div>
      </Card>

      <Card>
        <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Delete my data</h2>
        {openDeletion ? (
          <>
            <Notice tone="amber">
              {openDeletion.status === "on_hold"
                ? <>Your request <b data-no-translate>{openDeletion.requestNumber}</b> is on hold: {(openDeletion.holdReasons || []).map((h) => h.detail).join("; ")}. It will go ahead once this is settled.</>
                : <>Request <b data-no-translate>{openDeletion.requestNumber}</b>: your personal data will be anonymised on <b data-no-translate>{formatDate(openDeletion.dueAt)}</b>.</>}
            </Notice>
            <button type="button" disabled={busy} className={`${secondaryButton} mt-3`} onClick={() => run(() => apiRequest("/user/request-deletion", { method: "DELETE", token: accessToken }), "Deletion request cancelled.")}>Cancel the request</button>
          </>
        ) : (
          <>
            <p className="mt-1 text-[14px] leading-6 text-[#6B7280]">After a 30-day notice your name, contact details and sign-in are removed, and your listings and requirements leave public view. You can cancel during the 30 days. Invoices, fee consents and deal records are kept for as long as the law requires. An open deal, an unpaid invoice or an active mandate must be settled first.</p>
            {asking ? (
              <div className="mt-3 space-y-3">
                <textarea aria-label="Reason (optional)" rows={2} placeholder="Reason (optional)" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full rounded-[12px] border border-[#E5E7EB] px-3 py-2 text-[14px]" />
                <div className="flex flex-wrap gap-3">
                  <button type="button" disabled={busy} className={primaryButton} onClick={() => run(() => apiRequest("/user/request-deletion", { method: "POST", token: accessToken, body: { reason: reason || undefined } }), "Deletion request recorded. You can cancel it within 30 days.")}>Confirm deletion request</button>
                  <button type="button" className={secondaryButton} onClick={() => setAsking(false)}>Keep my account</button>
                </div>
              </div>
            ) : (
              <button type="button" className={`${linkButton} mt-3`} onClick={() => setAsking(true)}>Request deletion of my data</button>
            )}
          </>
        )}
      </Card>

      {items.length > 0 && (
        <Card>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Your requests</h2>
          <ul className="mt-3 divide-y divide-[#F3F4F6]">
            {items.slice(0, 10).map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[14px]">
                <span className="text-[#111827]"><b data-no-translate>{r.requestNumber}</b> · {{ export: "Copy of my data", deletion: "Deletion", inactivity: "Inactive account notice" }[r.kind]}</span>
                <span className="flex items-center gap-2 text-[12px] text-[#6B7280]"><span data-no-translate>{formatDate(r.requestedAt)}</span><Badge status={r.status} /></span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
