import React, { useState } from "react";
import { Link } from "react-router-dom";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { normalizeProperty } from "../../utils/normalizeProperty";
import PropertyCard from "../../components/PropertyCard";
import { useFavourites } from "../../hooks/useFavourites";
import { Card, EmptyState, LoadState, Notice, SectionHeader, formatDate, formatINR, linkButton, primaryButton, typeLabel, useLoad } from "./ui";

// Saved: favourite properties (hearts anywhere on the site) and saved
// searches, which alert the person when a new matching listing goes live.

function searchLink(filters) {
  const params = new URLSearchParams();
  Object.entries(filters || {}).forEach(([key, value]) => value != null && value !== "" && params.set(key, value));
  return `/properties?${params.toString()}`;
}

function describe(filters = {}) {
  return [
    filters.purpose === "rent" ? "For rent" : filters.purpose === "buy" ? "For sale" : "Sale & rent",
    filters.city,
    filters.propertyType && typeLabel(filters.propertyType),
    filters.bedrooms && `${filters.bedrooms}+ BHK`,
    filters.maxPrice && `up to ${formatINR(filters.maxPrice)}`,
    filters.q && `"${filters.q}"`,
  ]
    .filter(Boolean)
    .join(" · ");
}

function SavedSection() {
  const { accessToken } = useAuth();
  const { isFavourite, toggleFavourite } = useFavourites();
  const favourites = useLoad((token) => portal.favourites(token));
  const searches = useLoad((token) => portal.savedSearches(token));
  const [error, setError] = useState(null);

  const run = async (fn) => {
    setError(null);
    try {
      await fn();
      await searches.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const items = (favourites.data?.items || []).filter((p) => isFavourite(p.id));

  return (
    <div className="flex flex-col gap-8">
      <div>
        <SectionHeader title="Saved properties" subtitle="Tap the heart on any listing to keep it here." />
        <LoadState loading={favourites.loading} error={favourites.error} onRetry={favourites.reload} />
        {favourites.data && !items.length && (
          <EmptyState
            title="Nothing saved yet"
            body="Browse listings and tap ♡ on the ones you like to compare them later."
            action={
              <Link to="/properties?purpose=all" className={primaryButton}>
                Browse properties
              </Link>
            }
          />
        )}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => {
            const item = normalizeProperty(p);
            return (
              <div key={p.id} className="flex flex-col gap-2">
                <PropertyCard item={item} className="w-full" />
                <div className="flex items-center justify-between text-[12px] text-[#6B7280]">
                  <span>{p.status === "approved" ? `Saved ${formatDate(p.saved_at)}` : "No longer available"}</span>
                  <button type="button" onClick={() => toggleFavourite(p.id)} className={linkButton}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <SectionHeader
          title="Saved searches"
          subtitle='Use "Save this search" on any listings page. With alerts on, we notify you as soon as a matching property is listed.'
        />
        {error && (
          <div className="mb-3">
            <Notice tone="red">{error}</Notice>
          </div>
        )}
        <LoadState loading={searches.loading} error={searches.error} onRetry={searches.reload} />
        {searches.data && !searches.data.length && (
          <EmptyState title="No saved searches" body='Search for properties, then tap "Save this search" above the results.' />
        )}
        <div className="flex flex-col gap-3">
          {(searches.data || []).map((s) => (
            <Card key={s.id}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#111827]">{s.name}</p>
                  <p className="text-[13px] text-[#6B7280]">{describe(s.filters)}</p>
                  {s.last_alerted_at && <p className="text-[12px] text-[#9CA3AF]">Last alert {formatDate(s.last_alerted_at)}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-[13px] font-semibold text-[#374151]">
                    <input
                      type="checkbox"
                      checked={s.alerts_enabled}
                      onChange={(e) => run(() => portal.updateSavedSearch(accessToken, s.id, { alertsEnabled: e.target.checked }))}
                      className="h-4 w-4 accent-[#E51C23]"
                    />
                    Alerts
                  </label>
                  <Link to={searchLink(s.filters)} className={linkButton}>
                    Open
                  </Link>
                  <button type="button" onClick={() => run(() => portal.deleteSavedSearch(accessToken, s.id))} className={`${linkButton} text-[#6B7280]`}>
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SavedSection;
