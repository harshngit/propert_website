import React, { useState } from "react";
import { Link } from "react-router-dom";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import {
  Badge, Card, EmptyState, LoadState, Modal, Notice, SectionHeader, formatDate, formatINR, inputClass, labelClass,
  linkButton, primaryButton, secondaryButton, useLoad,
} from "./ui";

// Enquiries & Visits: every enquiry and requirement the person has raised,
// where it stands, who their representative is, and their site visit
// schedule. Visits are booked by the representative; the person can ask
// for one here.

function VisitRequestForm({ enquiry, onDone, onCancel }) {
  const { accessToken } = useAuth();
  const [when, setWhen] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await portal.requestVisit(accessToken, enquiry.id, { preferredAt: new Date(when).toISOString(), note: note || undefined });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const min = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-[14px] text-[#6B7280]">
        {enquiry.property_title} - your representative will confirm the slot with you and the owner.
      </p>
      <label className={labelClass}>
        Preferred date & time
        <input required type="datetime-local" min={min} value={when} onChange={(e) => setWhen(e.target.value)} className={inputClass} />
      </label>
      <label className={labelClass}>
        Note (optional)
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. weekends work best" className={inputClass} />
      </label>
      {error && <Notice tone="red">{error}</Notice>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={primaryButton}>
          {saving ? "Sending…" : "Request visit"}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function EnquiriesSection() {
  const enquiries = useLoad((token) => portal.enquiries(token));
  const visits = useLoad((token) => portal.visits(token));
  const [visitFor, setVisitFor] = useState(null);
  const [notice, setNotice] = useState(null);

  const upcoming = (visits.data || []).filter((v) => v.status === "scheduled" && new Date(v.scheduled_at) >= new Date(Date.now() - 86400000));
  const past = (visits.data || []).filter((v) => !upcoming.includes(v));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <SectionHeader
          title="Enquiries"
          subtitle="Every property you've enquired on and every requirement you've posted. All conversations go through your A R Buildwel representative."
        />
        {notice && (
          <div className="mb-3">
            <Notice>{notice}</Notice>
          </div>
        )}
        <LoadState loading={enquiries.loading} error={enquiries.error} onRetry={enquiries.reload} />
        {enquiries.data && !enquiries.data.length && (
          <EmptyState
            title="No enquiries yet"
            body='Open any listing and tap "Enquire Now" - a representative calls you back and can arrange a visit.'
            action={
              <Link to="/properties?purpose=all" className={primaryButton}>
                Browse properties
              </Link>
            }
          />
        )}
        <div className="flex flex-col gap-3">
          {(enquiries.data || []).map((e) => (
            <Card key={e.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    {e.property_id ? (
                      <Link to={`/properties/${e.property_id}`} className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827] hover:text-[#E51C23]">
                        {e.property_title}
                      </Link>
                    ) : (
                      <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">
                        {e.is_requirement ? "Your requirement" : "General enquiry"}
                      </p>
                    )}
                    <Badge tone={["won", "lost"].includes(e.status) ? "gray" : "blue"}>{e.status_label}</Badge>
                  </div>
                  <p className="mt-1 text-[13px] text-[#6B7280]">
                    {[e.locality, e.city].filter(Boolean).join(", ")}
                    {e.price_value ? ` · ${formatINR(e.price_value)}` : ""} · Sent {formatDate(e.created_at)}
                  </p>
                  <p className="mt-1 text-[13px] text-[#374151]">
                    {e.representative_name ? `Representative: ${e.representative_name}` : "A representative is being assigned"}
                    {e.next_visit_at ? ` · Visit on ${formatDate(e.next_visit_at, true)}` : ""}
                  </p>
                </div>
                {e.property_id && !["won", "lost"].includes(e.status) && !e.next_visit_at && (
                  <button type="button" onClick={() => setVisitFor(e)} className={linkButton}>
                    Request a site visit
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <SectionHeader title="Site visits" subtitle="Scheduled by your representative. You'll get a notification when a visit is booked or changed." />
        <LoadState loading={visits.loading} error={visits.error} onRetry={visits.reload} />
        {visits.data && !visits.data.length && <EmptyState title="No site visits yet" body="Request one from any open enquiry above." />}
        {upcoming.length > 0 && (
          <div className="mb-4 flex flex-col gap-2">
            {upcoming.map((v) => (
              <Card key={v.id} className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[15px] font-bold text-[#111827]">{v.property_title || "Site visit"}</p>
                  <p className="text-[13px] text-[#6B7280]">
                    {[v.locality, v.city].filter(Boolean).join(", ")}
                    {v.representative_name ? ` · with ${v.representative_name}` : ""}
                  </p>
                </div>
                <Badge status="scheduled">{formatDate(v.scheduled_at, true)}</Badge>
              </Card>
            ))}
          </div>
        )}
        {past.length > 0 && (
          <div className="overflow-x-auto rounded-[16px] border border-[#E5E7EB] bg-white">
            <table className="w-full min-w-[520px] text-left text-[14px]">
              <thead className="bg-[#F9FAFB] text-[12px] uppercase tracking-[0.04em] text-[#6B7280]">
                <tr>
                  <th className="px-4 py-2.5">Property</th>
                  <th className="px-4 py-2.5">Date</th>
                  <th className="px-4 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {past.map((v) => (
                  <tr key={v.id}>
                    <td className="px-4 py-2.5">{v.property_title || "-"}</td>
                    <td className="px-4 py-2.5">{formatDate(v.actual_visit_at || v.scheduled_at, true)}</td>
                    <td className="px-4 py-2.5">
                      <Badge status={v.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={!!visitFor} title="Request a site visit" onClose={() => setVisitFor(null)}>
        {visitFor && (
          <VisitRequestForm
            enquiry={visitFor}
            onCancel={() => setVisitFor(null)}
            onDone={() => {
              setVisitFor(null);
              setNotice("Visit request sent - your representative will confirm the slot.");
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export default EnquiriesSection;
