import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { portal } from "../../api/portal";
import { normalizeProperty } from "../../utils/normalizeProperty";
import PropertyCard from "../../components/PropertyCard";
import MatchBadge from "../../components/MatchBadge";
import { useFavourites } from "../../hooks/useFavourites";
import { useAuth } from "../../context/AuthContext";
import { EmptyState, LoadState, SectionHeader, primaryButton, useLoad } from "./ui";

// Matched Properties (Screen 6 / sec. 7): live listings the matching engine
// ranks against the person's active requirements - Hot (90+) and Warm
// (75+) matches, plus listings their representative sent them. Each card
// carries the colour-coded match badge with the parameter breakdown.
// The list refreshes itself every minute so new matches appear without a
// reload; opening a match is recorded to improve future matching.

const REFRESH_MS = 60 * 1000;

function MatchCard({ match, onOpen, isFavourite, toggleFavourite }) {
  const item = normalizeProperty(match.property);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <MatchBadge score={match.score} tier={match.tier} breakdown={match.breakdown} />
          {match.sentByRepresentative && (
            <span className="rounded-full bg-[#EEF2FF] px-2.5 py-1 text-[11px] font-bold text-[#3730A3]">From your representative</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => toggleFavourite(item.id)}
          className={`text-[13px] font-bold ${isFavourite(item.id) ? "text-[#E51C23]" : "text-[#6B7280] hover:text-[#E51C23]"}`}
        >
          {isFavourite(item.id) ? "♥ Saved" : "♡ Save"}
        </button>
      </div>
      <div onClickCapture={() => onOpen(match)}>
        <PropertyCard item={item} className="w-full" />
      </div>
    </div>
  );
}

function MatchesSection() {
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();
  const { data, loading, error, reload } = useLoad((token) => portal.matches(token));
  const recs = useLoad((token) => portal.recommendations(token));
  const [live, setLive] = useState(null);
  const [newCount, setNewCount] = useState(0);

  // Silent auto-refresh: new matches appear with a notice, no spinner.
  const current = useRef(null);
  current.current = live || data;
  useEffect(() => {
    if (!accessToken) return undefined;
    const t = setInterval(() => {
      portal
        .matches(accessToken)
        .then((fresh) => {
          const before = new Set((current.current?.items || []).map((m) => m.property.id));
          const added = (fresh.items || []).filter((m) => !before.has(m.property.id)).length;
          if (added) setNewCount((n) => n + added);
          setLive(fresh);
        })
        .catch(() => {});
    }, REFRESH_MS);
    return () => clearInterval(t);
  }, [accessToken]);

  const view = live || data;
  const items = view?.items || [];
  const hot = items.filter((m) => m.tier === "hot");
  const rest = items.filter((m) => m.tier !== "hot");
  const open = (match) =>
    portal.matchEvent(accessToken, { propertyId: match.property.id, requirementId: match.requirementId, event: "clicked" }).catch(() => {});
  const cardProps = { onOpen: open, isFavourite, toggleFavourite };
  const recItems = (recs.data?.items || []).filter((r) => !items.some((m) => m.property.id === r.property.id));

  return (
    <div>
      <SectionHeader
        title="Matched Properties"
        subtitle="Live listings ranked against your active requirements - location, budget, type, size and amenities. Tap a match badge to see why it fits."
      />
      <LoadState loading={loading && !view} error={error} onRetry={reload} />
      {newCount > 0 && (
        <div className="mb-4 rounded-[12px] bg-[#FEF2F2] px-4 py-2.5 text-[13px] font-semibold text-[#991B1B]">
          {newCount} new match{newCount === 1 ? "" : "es"} just arrived.
          <button type="button" className="ml-2 underline" onClick={() => setNewCount(0)}>
            Got it
          </button>
        </div>
      )}
      {view && view.requirements === 0 && (
        <EmptyState
          title="Post a requirement to get matches"
          body="Matches are worked out from your requirements - location, budget, property type, size and amenities."
          action={
            <button type="button" onClick={() => navigate("/dashboard/requirements?new=1")} className={primaryButton}>
              Post Requirement
            </button>
          }
        />
      )}
      {view && view.requirements > 0 && !items.length && (
        <EmptyState
          title="No strong matches yet"
          body={`Nothing live scores ${view.thresholds?.warm || 75}% or more against your requirements right now. We alert you the moment a Hot match (${view.thresholds?.hot || 90}%+) is listed, and send a daily digest of good matches.`}
        />
      )}

      {hot.length > 0 && (
        <>
          <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[15px] font-extrabold text-[#111827]">🔥 Hot matches</p>
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {hot.map((m) => (
              <MatchCard key={m.property.id} match={m} {...cardProps} />
            ))}
          </div>
        </>
      )}
      {rest.length > 0 && (
        <>
          {hot.length > 0 && <p className="mb-3 font-['Plus_Jakarta_Sans'] text-[15px] font-extrabold text-[#111827]">Good matches</p>}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {rest.map((m) => (
              <MatchCard key={m.property.id} match={m} {...cardProps} />
            ))}
          </div>
        </>
      )}

      {recItems.length > 0 && (
        <div className="mt-10">
          <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-extrabold text-[#111827]">Recommended for you</p>
          <p className="mb-3 text-[13px] text-[#6B7280]">
            {recs.data.basis === "history" ? "Based on properties you saved and enquired about." : "More listings close to what you're looking for."}
          </p>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recItems.slice(0, 6).map((m) => (
              <MatchCard key={m.property.id} match={m} {...cardProps} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MatchesSection;
