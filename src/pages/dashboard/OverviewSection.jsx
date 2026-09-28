import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { portal } from "../../api/portal";
import { searchProperties } from "../../api/properties";
import { normalizeProperty } from "../../utils/normalizeProperty";
import PropertyCard from "../../components/PropertyCard";
import { Badge, Card, LoadState, SectionHeader, StatCard, formatDate, primaryButton, secondaryButton, useLoad } from "./ui";

// Home dashboard (Screen 3): quick actions, the numbers that matter for the
// roles the person picked, what needs attention, upcoming visits, latest
// notifications and new listings in their area.

function OverviewSection({ profile }) {
  const navigate = useNavigate();
  const roles = profile.portalRoles || [];
  const seeking = roles.includes("buyer") || roles.includes("tenant");
  const listing = roles.includes("seller") || roles.includes("owner");
  const { data, loading, error, reload } = useLoad((token) => portal.overview(token));
  const [nearby, setNearby] = useState([]);

  const city = (profile.preferences?.preferred_locations || [])[0];
  useEffect(() => {
    if (!seeking) return;
    const purpose = roles.includes("buyer") ? "buy" : "rent";
    searchProperties({ city: city || undefined, purpose, limit: 4, sort: "newest" })
      .then((res) => setNearby((res.items || []).map(normalizeProperty)))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, seeking]);

  if (loading || error) return <LoadState loading={loading} error={error} onRetry={reload} />;

  const c = data.counts;
  const attention = [];
  if (c.rent_due > 0) attention.push({ text: `${c.rent_due} month(s) of rent to report as paid`, to: "/dashboard/rentals" });
  if (data.listings.pending > 0) attention.push({ text: `${data.listings.pending} listing(s) waiting for approval`, to: "/dashboard/listings" });
  if (data.listings.rejected > 0) attention.push({ text: `${data.listings.rejected} listing(s) need changes`, to: "/dashboard/listings" });
  data.listings.renewalDue.forEach((l) =>
    attention.push({ text: `"${l.title}" expires on ${formatDate(l.expires_at)} - renew to keep it live`, to: "/dashboard/listings" }),
  );
  if (c.open_maintenance > 0) attention.push({ text: `${c.open_maintenance} open maintenance request(s)`, to: "/dashboard/rentals" });

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title={`Welcome back, ${profile.user.full_name.split(" ")[0]}`}
        subtitle="Everything about your property journey in one place. Your A R Buildwel representative handles every conversation for you."
        action={
          <div className="flex flex-wrap gap-2">
            {seeking && (
              <button type="button" onClick={() => navigate("/dashboard/requirements?new=1")} className={primaryButton}>
                Post Requirement
              </button>
            )}
            {listing && (
              <button type="button" onClick={() => navigate("/dashboard/listings?new=1")} className={seeking ? secondaryButton : primaryButton}>
                Post Property
              </button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {seeking && <StatCard label="Active requirements" value={c.active_requirements} onClick={() => navigate("/dashboard/requirements")} />}
        {seeking && <StatCard label="Saved properties" value={c.favourites} onClick={() => navigate("/dashboard/saved")} />}
        <StatCard label="Open enquiries" value={c.open_enquiries} onClick={() => navigate("/dashboard/enquiries")} />
        {listing && <StatCard label="Live listings" value={data.listings.live} hint={`${data.listings.total} total`} onClick={() => navigate("/dashboard/listings")} />}
        {(roles.includes("owner") || roles.includes("tenant") || c.active_leases > 0) && (
          <StatCard label="Active leases" value={c.active_leases} onClick={() => navigate("/dashboard/rentals")} />
        )}
        {!listing && <StatCard label="Saved searches" value={c.saved_searches} onClick={() => navigate("/dashboard/saved")} />}
      </div>

      {attention.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/60">
          <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#111827]">Needs your attention</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {attention.map((item) => (
              <li key={item.text}>
                <Link to={item.to} className="text-[14px] text-[#92400E] hover:underline">
                  • {item.text}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Upcoming site visits</p>
            <Link to="/dashboard/enquiries" className="text-[13px] font-bold text-[#E51C23]">
              All
            </Link>
          </div>
          {data.upcomingVisits.length ? (
            <ul className="mt-3 divide-y divide-[#F3F4F6]">
              {data.upcomingVisits.map((v) => (
                <li key={v.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[14px] font-semibold text-[#111827]">{v.property_title || "Site visit"}</p>
                    <p className="text-[12px] text-[#6B7280]">{[v.locality, v.city].filter(Boolean).join(", ")}</p>
                  </div>
                  <Badge status="scheduled">{formatDate(v.scheduled_at, true)}</Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[14px] text-[#6B7280]">No visits scheduled. Enquire on a property and ask your representative for a visit.</p>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Latest updates</p>
            <Link to="/dashboard/notifications" className="text-[13px] font-bold text-[#E51C23]">
              All
            </Link>
          </div>
          {data.notifications.length ? (
            <ul className="mt-3 divide-y divide-[#F3F4F6]">
              {data.notifications.map((n) => (
                <li key={n.id} className="py-2.5">
                  <p className={`text-[14px] ${n.is_read ? "text-[#374151]" : "font-bold text-[#111827]"}`}>{n.title}</p>
                  <p className="text-[12px] text-[#6B7280]">
                    {n.message} · {formatDate(n.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-[14px] text-[#6B7280]">You're all caught up. Match alerts and updates from your representative will appear here.</p>
          )}
        </Card>
      </div>

      {seeking && nearby.length > 0 && (
        <div>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold text-[#111827]">Latest properties{city ? ` in ${city}` : ""}</p>
            <Link
              to={`/properties?purpose=${roles.includes("buyer") ? "buy" : "rent"}${city ? `&city=${encodeURIComponent(city)}` : ""}`}
              className="text-[13px] font-bold text-[#E51C23]"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {nearby.map((item) => (
              <PropertyCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Your referral code</p>
            <p className="text-[13px] text-[#6B7280]">Share PropertySerch with friends and family looking to buy, sell or rent.</p>
          </div>
          <Link to="/dashboard/profile" className={secondaryButton}>
            {profile.referral?.code || "View"} · Share
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default OverviewSection;
