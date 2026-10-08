import React, { useState } from "react";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, EmptyState, LoadState, Modal, Notice, SectionHeader, formatDate, inputClass, labelClass, linkButton, primaryButton, secondaryButton, useLoad } from "./ui";

// Reviews (sec. 8 Trust & Reputation). Customers review the people they
// dealt with only after a verified interaction - a closed deal, a
// completed site visit or a confirmed lease. The other party is described
// by role only ("the listing broker"); identities stay with A R Buildwel.
// Reviews publish instantly unless the fake-review filter holds them for a
// quick admin check. Owners / sellers see reviews about them and can reply
// once or report one.

const INTERACTION = { deal_closed: "Closed deal", site_visit: "Site visit", lease: "Lease" };

function StarInput({ value, onChange }) {
  return (
    <div className="flex gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          onClick={() => onChange(n)}
          className={`text-[30px] leading-none ${n <= value ? "text-[#F59E0B]" : "text-[#E5E7EB] hover:text-[#FCD34D]"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

const stars = (n) => "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);

function ReviewsSection() {
  const { accessToken } = useAuth();
  const reviewable = useLoad((t) => portal.reviewable(t));
  const mine = useLoad((t) => portal.myReviews(t));
  const about = useLoad((t) => portal.reviewsAboutMe(t));
  const [writing, setWriting] = useState(null);
  const [form, setForm] = useState({ rating: 0, title: "", body: "" });
  const [notice, setNotice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [responding, setResponding] = useState(null); // { review, kind: 'reply' | 'report' }
  const [text, setText] = useState("");

  const open = (item) => {
    setWriting(item);
    setForm({ rating: 0, title: "", body: "" });
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!form.rating) return;
    setSaving(true);
    try {
      const r = await portal.createReview(accessToken, {
        dealId: writing.dealId || undefined,
        leaseId: writing.leaseId || undefined,
        subject: writing.subject,
        rating: form.rating,
        title: form.title || undefined,
        body: form.body || undefined,
      });
      setWriting(null);
      setNotice({
        tone: "green",
        text: r.status === "published" ? "Thanks - your review is live. It shows on that property's page, under the lister's trust score." : "Thanks - your review is being checked by our team and will appear on the property's page once approved.",
      });
      reviewable.reload();
      mine.reload();
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    } finally {
      setSaving(false);
    }
  };
  const respond = async () => {
    try {
      if (responding.kind === "reply") await portal.replyReview(accessToken, responding.review.id, text.trim());
      else await portal.reportReview(accessToken, responding.review.id, text.trim());
      setNotice({ tone: "green", text: responding.kind === "reply" ? "Reply posted." : "Reported - our team will take a look." });
      setResponding(null);
      about.reload();
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    }
  };

  const toReview = (reviewable.data || []).filter((r) => !r.alreadyReviewed);
  const aboutMe = about.data || [];

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Reviews" subtitle="Rate the people you dealt with. Only verified interactions can be reviewed, which keeps ratings honest." />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <div>
        <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">Waiting for your review</p>
        <LoadState loading={reviewable.loading && !reviewable.data} error={reviewable.error} onRetry={reviewable.reload} />
        {reviewable.data && !toReview.length && (
          <EmptyState title="Nothing to review right now" body="After a site visit, a closed deal or a confirmed lease you can review the broker, owner or builder here." />
        )}
        <div className="grid gap-3 md:grid-cols-2">
          {toReview.map((item) => (
            <Card key={`${item.dealId || item.leaseId}-${item.subject}`}>
              <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#111827]">{item.label}</p>
              <p className="mt-1 text-[13px] text-[#6B7280]">
                {INTERACTION[item.interaction]}{item.propertyTitle ? ` · ${item.propertyTitle}` : ""}
              </p>
              <button type="button" onClick={() => open(item)} className={`${primaryButton} mt-3`}>
                Write a review
              </button>
            </Card>
          ))}
        </div>
      </div>

      {(mine.data || []).length > 0 && (
        <div>
          <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">Your reviews</p>
          <div className="flex flex-col gap-3">
            {mine.data.map((r) => (
              <Card key={r.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-[15px]"><span className="text-[#F59E0B]">{stars(r.rating)}</span> <b className="text-[#111827]">{r.title || INTERACTION[r.interaction]}</b></p>
                  <Badge tone={r.status === "published" ? "green" : r.status === "pending_moderation" ? "amber" : "gray"}>
                    {r.status === "pending_moderation" ? "Being checked" : r.status}
                  </Badge>
                </div>
                {r.body && <p className="mt-1 text-[14px] text-[#4B5563]">{r.body}</p>}
                {r.reply && <p className="mt-2 rounded-[10px] bg-[#F9FAFB] px-3 py-2 text-[13px] text-[#4B5563]"><b>Reply:</b> {r.reply}</p>}
                <p className="mt-1 text-[12px] text-[#9CA3AF]">{formatDate(r.createdAt)}{r.propertyTitle ? ` · ${r.propertyTitle}` : ""}</p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {aboutMe.length > 0 && (
        <div>
          <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">Reviews about you</p>
          <div className="flex flex-col gap-3">
            {aboutMe.map((r) => (
              <Card key={r.id}>
                <p className="text-[15px]"><span className="text-[#F59E0B]">{stars(r.rating)}</span> <b className="text-[#111827]">{r.title || INTERACTION[r.interaction]}</b></p>
                {r.body && <p className="mt-1 text-[14px] text-[#4B5563]">{r.body}</p>}
                <p className="mt-1 text-[12px] text-[#9CA3AF]">{r.reviewerFirstName} · {formatDate(r.createdAt)}</p>
                {r.reply ? (
                  <p className="mt-2 rounded-[10px] bg-[#F9FAFB] px-3 py-2 text-[13px] text-[#4B5563]"><b>Your reply:</b> {r.reply}</p>
                ) : null}
                <div className="mt-2 flex gap-4">
                  {!r.reply && (
                    <button type="button" className={linkButton} onClick={() => { setResponding({ review: r, kind: "reply" }); setText(""); }}>Reply</button>
                  )}
                  <button type="button" className={`${linkButton} text-[#6B7280]`} onClick={() => { setResponding({ review: r, kind: "report" }); setText(""); }}>Report</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Modal open={!!writing} title={writing ? `Review ${writing.label.toLowerCase()}` : ""} onClose={() => setWriting(null)}>
        {writing && (
          <form onSubmit={submit} className="flex flex-col gap-4">
            <p className="text-[13px] text-[#6B7280]">{INTERACTION[writing.interaction]}{writing.propertyTitle ? ` · ${writing.propertyTitle}` : ""}</p>
            <StarInput value={form.rating} onChange={(rating) => setForm((f) => ({ ...f, rating }))} />
            <label className={labelClass}>
              Headline (optional)
              <input value={form.title} maxLength={150} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} className={inputClass} />
            </label>
            <label className={labelClass}>
              Your experience
              <textarea rows={4} maxLength={3000} value={form.body} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} className={`${inputClass} h-auto py-2`} placeholder="What went well, what could be better? Please don't include phone numbers or emails." />
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={!form.rating || saving} className={primaryButton}>{saving ? "Posting…" : "Post review"}</button>
              <button type="button" onClick={() => setWriting(null)} className={secondaryButton}>Cancel</button>
            </div>
          </form>
        )}
      </Modal>

      <Modal open={!!responding} title={responding?.kind === "reply" ? "Reply to this review" : "Report this review"} onClose={() => setResponding(null)}>
        <div className="flex flex-col gap-3">
          <p className="text-[13px] text-[#6B7280]">
            {responding?.kind === "reply" ? "Your reply is public and can be posted once." : "Tell us what's wrong. The review stays visible until our team decides."}
          </p>
          <textarea rows={4} value={text} onChange={(e) => setText(e.target.value)} className={`${inputClass} h-auto py-2`} />
          <div className="flex gap-2">
            <button type="button" disabled={text.trim().length < (responding?.kind === "reply" ? 2 : 5)} onClick={respond} className={primaryButton}>
              {responding?.kind === "reply" ? "Post reply" : "Report"}
            </button>
            <button type="button" onClick={() => setResponding(null)} className={secondaryButton}>Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ReviewsSection;
