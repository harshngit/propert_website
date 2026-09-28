import React from "react";
import { useNavigate } from "react-router-dom";
import { portal } from "../../api/portal";
import { normalizeProperty } from "../../utils/normalizeProperty";
import PropertyCard from "../../components/PropertyCard";
import { useFavourites } from "../../hooks/useFavourites";
import { EmptyState, LoadState, SectionHeader, primaryButton, useLoad } from "./ui";

// Matched Properties (Screen 6): live listings ranked by how well they fit
// the person's active requirements, with the match % and a Hot Match tag.

const REASON_TEXT = {
  location: { locality: "In your locality", city: "In your city" },
  budget: { within: "Within budget", near: "Close to budget", any: null },
};

function MatchesSection() {
  const navigate = useNavigate();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { data, loading, error, reload } = useLoad((token) => portal.matches(token));

  return (
    <div>
      <SectionHeader
        title="Matched Properties"
        subtitle="Live listings ranked against your active requirements. Enquire on any of them and your representative takes it from there."
      />
      <LoadState loading={loading} error={error} onRetry={reload} />
      {data && data.requirements === 0 && (
        <EmptyState
          title="Post a requirement to get matches"
          body="Matches are worked out from your requirements - location, budget, type and bedrooms."
          action={
            <button type="button" onClick={() => navigate("/dashboard/requirements?new=1")} className={primaryButton}>
              Post Requirement
            </button>
          }
        />
      )}
      {data && data.requirements > 0 && !data.items.length && (
        <EmptyState
          title="No matching listings yet"
          body="Nothing live fits your requirements right now. We'll alert you the moment a matching property is listed - your representative is also sourcing options."
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {(data?.items || []).map((match) => {
          const item = normalizeProperty(match.property);
          const reasons = [REASON_TEXT.location[match.reasons.location], REASON_TEXT.budget[match.reasons.budget]].filter(Boolean);
          return (
            <div key={item.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 font-['Plus_Jakarta_Sans'] text-[12px] font-extrabold ${
                    match.hotMatch ? "bg-[#E51C23] text-white" : "bg-[#F3F4F6] text-[#374151]"
                  }`}
                >
                  {match.hotMatch ? "🔥 Hot Match · " : ""}
                  {match.score}% match
                </span>
                <button
                  type="button"
                  onClick={() => toggleFavourite(item.id)}
                  className={`text-[13px] font-bold ${isFavourite(item.id) ? "text-[#E51C23]" : "text-[#6B7280] hover:text-[#E51C23]"}`}
                >
                  {isFavourite(item.id) ? "♥ Saved" : "♡ Save"}
                </button>
              </div>
              <PropertyCard item={item} className="w-full" />
              {reasons.length > 0 && <p className="text-[12px] text-[#6B7280]">{reasons.join(" · ")}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MatchesSection;
