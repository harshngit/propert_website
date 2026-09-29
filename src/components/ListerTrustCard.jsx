import React, { useEffect, useState } from "react";
import { apiRequest } from "../api/client";

// Sec. 8 trust on the listing page - who listed it (type only, never the
// identity or contact: controlled contact architecture), their trust score,
// badges, rating with verified-interaction reviews and replies, and when
// the listing was first recorded (first valid entry wins disputes).

const LISTER = { broker: "a partner broker", builder: "the builder / developer", owner: "the owner", lister: "a verified lister" };

function Stars({ value }) {
  return (
    <span className="text-[14px] tracking-[1px] text-[#F59E0B]" aria-label={`${value} out of 5`}>
      {"★★★★★".slice(0, Math.round(value))}
      <span className="text-[#E5E7EB]">{"★★★★★".slice(Math.round(value))}</span>
    </span>
  );
}

function ListerTrustCard({ propertyId }) {
  const [data, setData] = useState(null);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!/^[0-9a-f-]{36}$/i.test(String(propertyId || ""))) return;
    apiRequest(`/trust/public/listings/${propertyId}`)
      .then((r) => setData(r.data))
      .catch(() => setData(null));
  }, [propertyId]);
  if (!data) return null;
  const reviews = showAll ? data.reviews : data.reviews.slice(0, 3);
  return (
    <section className="mt-8 rounded-[20px] border border-[#E5E7EB] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold text-[#111827]">Listed by {LISTER[data.listerType] || LISTER.lister}</h2>
          <p className="mt-1 text-[13px] text-[#6B7280]">
            First listed on {new Date(data.firstListedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} ·{" "}
            {data.completedDeals} completed deal{data.completedDeals === 1 ? "" : "s"} on PropertySerch
          </p>
        </div>
        <div className="text-right">
          <p className="font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-none text-[#111827]">
            {data.trustScore}
            <span className="text-[14px] font-semibold text-[#9CA3AF]">/100</span>
          </p>
          <p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Trust score</p>
        </div>
      </div>
      {data.badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {data.badges.map((b) => (
            <span key={b.key + b.label} title={b.effect} className="inline-flex items-center gap-1 rounded-full bg-[#ECFDF5] px-3 py-1 text-[12px] font-bold text-[#065F46]">
              ✓ {b.label}
            </span>
          ))}
        </div>
      )}
      <div className="mt-5 border-t border-[#F3F4F6] pt-4">
        <p className="flex items-center gap-2 text-[14px] font-bold text-[#111827]">
          {data.rating.count ? (
            <>
              <Stars value={data.rating.average} /> {data.rating.average} · {data.rating.count} verified review{data.rating.count === 1 ? "" : "s"}
            </>
          ) : (
            "No reviews yet"
          )}
        </p>
        <p className="mt-1 text-[12px] text-[#6B7280]">Only customers with a closed deal, completed site visit or confirmed lease can review.</p>
        {reviews.map((r) => (
          <div key={r.id} className="mt-4">
            <p className="flex flex-wrap items-center gap-2 text-[13px]">
              <Stars value={r.rating} />
              <span className="font-bold text-[#111827]">{r.title || "Verified review"}</span>
              <span className="text-[#9CA3AF]">
                {r.reviewer_first_name} · {new Date(r.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </span>
            </p>
            {r.body && <p className="mt-1 text-[14px] leading-6 text-[#4B5563]">{r.body}</p>}
            {r.reply && <p className="mt-2 rounded-[10px] bg-[#F9FAFB] px-3 py-2 text-[13px] text-[#4B5563]"><b>Reply:</b> {r.reply}</p>}
          </div>
        ))}
        {data.reviews.length > 3 && (
          <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-3 text-[13px] font-bold text-[#E51C23]">
            {showAll ? "Show fewer" : `Show all ${data.reviews.length} reviews`}
          </button>
        )}
      </div>
    </section>
  );
}

export default ListerTrustCard;
