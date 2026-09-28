import React, { useState } from "react";
import { Link } from "react-router-dom";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { EmptyState, LoadState, SectionHeader, formatDate, linkButton, secondaryButton, useLoad } from "./ui";

// Notification Centre (Screen 12): match alerts, saved-search alerts,
// enquiry / visit updates and rental updates.

const LINKS = {
  property: (id) => `/properties/${id}`,
  lease: (id) => `/dashboard/rentals?lease=${id}`,
  lead: () => "/dashboard/enquiries",
  deal: () => "/dashboard/enquiries",
};

function NotificationsSection() {
  const { accessToken } = useAuth();
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useLoad((token) => portal.notifications(token, page), [page]);

  const markAll = async () => {
    await portal.markAllNotificationsRead(accessToken).catch(() => {});
    reload();
  };
  const open = (n) => {
    if (!n.is_read) portal.markNotificationRead(accessToken, n.id).catch(() => {});
  };

  const items = data?.items || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div>
      <SectionHeader
        title="Notifications"
        subtitle="Match alerts, updates from your representative, and rent and maintenance updates."
        action={
          items.some((n) => !n.is_read) && (
            <button type="button" onClick={markAll} className={secondaryButton}>
              Mark all as read
            </button>
          )
        }
      />
      <LoadState loading={loading} error={error} onRetry={reload} />
      {data && !items.length && <EmptyState title="No notifications yet" body="We'll let you know when there's a new match or an update on your enquiries." />}
      {items.length > 0 && (
        <ul className="divide-y divide-[#F3F4F6] overflow-hidden rounded-[16px] border border-[#E5E7EB] bg-white">
          {items.map((n) => {
            const to = n.related_entity_type && LINKS[n.related_entity_type]?.(n.related_entity_id);
            const content = (
              <div className={`flex items-start gap-3 px-4 py-3 ${n.is_read ? "" : "bg-[#FEF2F2]/60"}`}>
                <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.is_read ? "bg-transparent" : "bg-[#E51C23]"}`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-[14px] ${n.is_read ? "text-[#374151]" : "font-bold text-[#111827]"}`}>{n.title}</p>
                  {n.message && <p className="text-[13px] text-[#6B7280]">{n.message}</p>}
                  <p className="mt-0.5 text-[12px] text-[#9CA3AF]">{formatDate(n.created_at, true)}</p>
                </div>
              </div>
            );
            return (
              <li key={n.id}>
                {to ? (
                  <Link to={to} onClick={() => open(n)} className="block hover:bg-slate-50">
                    {content}
                  </Link>
                ) : (
                  <button type="button" onClick={() => open(n)} className="block w-full text-left hover:bg-slate-50">
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-4 text-[14px]">
          <button type="button" disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className={linkButton}>
            ← Newer
          </button>
          <span className="text-[#6B7280]">
            Page {page} of {totalPages}
          </span>
          <button type="button" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className={linkButton}>
            Older →
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationsSection;
