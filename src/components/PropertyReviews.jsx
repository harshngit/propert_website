import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../api/client";

// Reviews written about this listing - by customers who completed a site
// visit, closed a deal or confirmed a lease on it. Published reviews only;
// first name of the reviewer, never a contact.

function Stars({ value }) {
  const n = Math.round(value || 0);
  return (
    <span className="text-[14px] tracking-[1px] text-[#F59E0B]" aria-label={`${value} out of 5`}>
      {"★★★★★".slice(0, n)}
      <span className="text-[#E5E7EB]">{"★★★★★".slice(n)}</span>
    </span>
  );
}

function PropertyReviews({ propertyId }) {
  const [data, setData] = useState(null);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    if (!/^[0-9a-f-]{36}$/i.test(String(propertyId || ""))) return;
    apiRequest(`/trust/public/properties/${propertyId}/reviews`)
      .then((r) => setData(r.data))
      .catch(() => setData(null));
  }, [propertyId]);
  if (!data) return null;
  const reviews = showAll ? data.reviews : data.reviews.slice(0, 3);
  return (
    <section id="reviews" className="mt-8 rounded-[20px] border border-[#E5E7EB] bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold text-[#111827]">Reviews for this property</h2>
          <p className="mt-1 text-[13px] text-[#6B7280]">From customers who visited, bought or rented it through PropertySerch.</p>
        </div>
        {data.rating.count > 0 && (
          <div className="text-right">
            <p className="font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-none text-[#111827]">
              {data.rating.average}
              <span className="text-[14px] font-semibold text-[#9CA3AF]">/5</span>
            </p>
            <p className="text-[12px] text-[#6B7280]">
              <Stars value={data.rating.average} /> {data.rating.count} review{data.rating.count === 1 ? "" : "s"}
            </p>
          </div>
        )}
      </div>
      {data.rating.count === 0 && <p className="mt-4 text-[14px] text-[#4B5563]">No reviews for this property yet.</p>}
      {reviews.map((r) => (
        <div key={r.id} className="mt-5 border-t border-[#F3F4F6] pt-4">
          <p className="flex flex-wrap items-center gap-2 text-[13px]">
            <Stars value={r.rating} />
            <span className="font-bold text-[#111827]">{r.title || "Verified review"}</span>
            <span className="text-[#9CA3AF]">
              <span data-no-translate>{r.reviewer_first_name}</span> · {new Date(r.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
            </span>
          </p>
          {r.body && <p className="mt-1 text-[14px] leading-6 text-[#4B5563]" data-no-translate>{r.body}</p>}
          {r.reply && <p className="mt-2 rounded-[10px] bg-[#F9FAFB] px-3 py-2 text-[13px] text-[#4B5563]"><b>Reply:</b> <span data-no-translate>{r.reply}</span></p>}
        </div>
      ))}
      {data.reviews.length > 3 && (
        <button type="button" onClick={() => setShowAll((v) => !v)} className="mt-4 text-[13px] font-bold text-[#E51C23]">
          {showAll ? "Show fewer" : `Show all ${data.reviews.length} reviews`}
        </button>
      )}
      <p className="mt-5 border-t border-[#F3F4F6] pt-4 text-[13px] text-[#6B7280]">
        Visited, bought or rented this property through us?{" "}
        <Link to="/dashboard/reviews" className="font-bold text-[#E51C23]">Write a review</Link> from your dashboard.
      </p>
    </section>
  );
}

export default PropertyReviews;
