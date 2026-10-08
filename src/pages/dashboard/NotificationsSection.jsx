import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { portal } from "../../api/portal";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { EmptyState, LoadState, SectionHeader, formatDate, linkButton, secondaryButton, useLoad } from "./ui";
import { disablePush, enablePush, pushState, sendTestPush } from "../../lib/pwa";

// Notification Centre (Screen 12): match alerts, saved-search alerts,
// enquiry / visit updates and rental updates.

const LINKS = {
  property: (id) => `/properties/${id}`,
  lease: (id) => `/dashboard/rentals?lease=${id}`,
  lead: () => "/dashboard/enquiries",
  deal: () => "/dashboard/enquiries",
};

// Browser push for the PWA: the same alerts, delivered even when the site
// is closed. Hidden where the browser has no push support or the server has
// no push keys yet.
function PushToggle() {
  const { accessToken } = useAuth();
  const [state, setState] = useState(null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const refresh = () => pushState(accessToken).then(setState).catch(() => setState(null));
  useEffect(() => {
    refresh();
  }, [accessToken]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!state?.supported || !state.configured) return null;
  const run = async (fn, done) => {
    setBusy(true);
    setNote("");
    try {
      await fn();
      setNote(done);
    } catch (err) {
      setNote(err.message);
    } finally {
      setBusy(false);
      refresh();
    }
  };
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
      <div>
        <p className="text-[14px] font-bold text-[#111827]">Push notifications on this device</p>
        <p className="text-[12px] text-[#6B7280]">
          {state.permission === "denied"
            ? "Blocked in your browser settings for this site."
            : state.subscribed
              ? "On - match alerts and updates reach you even when the site is closed."
              : "Get Hot matches and updates from your representative straight away."}
          {note ? ` ${note}` : ""}
        </p>
      </div>
      <div className="flex gap-2">
        {state.subscribed ? (
          <>
            <button type="button" disabled={busy} className={secondaryButton} onClick={() => run(() => sendTestPush(accessToken), "Test sent.")}>Send a test</button>
            <button type="button" disabled={busy} className={secondaryButton} onClick={() => run(() => disablePush(accessToken), "Turned off.")}>Turn off</button>
          </>
        ) : (
          <button type="button" disabled={busy || state.permission === "denied"} className={secondaryButton} onClick={() => run(() => enablePush(accessToken), "Turned on.")}>Turn on</button>
        )}
      </div>
    </div>
  );
}

// Which topics are pushed and the quiet hours (saved to the account). The
// list below always keeps every notification - this only controls push.
function PushPreferences() {
  const { accessToken } = useAuth();
  const [prefs, setPrefs] = useState(null);
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  useEffect(() => {
    apiRequest("/notifications/preferences", { token: accessToken }).then((r) => setPrefs(r.data)).catch(() => setPrefs(null));
  }, [accessToken]);
  if (!prefs) return null;
  const save = async (patch) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    setNote("");
    try {
      const r = await apiRequest("/notifications/preferences", { method: "PUT", token: accessToken, body: { pushEnabled: next.pushEnabled, pushMuted: next.pushMuted, quietStart: next.quietStart || null, quietEnd: next.quietEnd || null, timezone: next.timezone } });
      setPrefs(r.data);
      setNote("Saved.");
    } catch (err) {
      setNote(err.message);
    }
  };
  const toggle = (key) => save({ pushMuted: prefs.pushMuted.includes(key) ? prefs.pushMuted.filter((k) => k !== key) : [...prefs.pushMuted, key] });
  return (
    <div className="mb-4 rounded-[14px] border border-[#E5E7EB] bg-white px-4 py-3">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left text-[14px] font-bold text-[#111827]" aria-expanded={open}>
        Notification settings
        <span className="text-[12px] font-semibold text-[#E51C23]">{open ? "Hide" : "Topics and quiet hours"}</span>
      </button>
      {open && (
        <div className="mt-3 flex flex-col gap-2">
          {prefs.topics.map((t) => (
            <label key={t.key} className="flex items-center justify-between gap-3 text-[13px] text-[#374151]">
              {t.label}
              <input id={`np-${t.key}`} type="checkbox" checked={!prefs.pushMuted.includes(t.key)} onChange={() => toggle(t.key)} className="h-4 w-4 accent-[#E51C23]" />
            </label>
          ))}
          <div className="mt-2 flex flex-wrap items-end gap-3 border-t border-[#F3F4F6] pt-3">
            <label className="text-[12px] font-semibold text-[#6B7280]">Quiet from
              <input id="np-quiet-start" type="time" value={prefs.quietStart || ""} onChange={(e) => setPrefs({ ...prefs, quietStart: e.target.value })} className="mt-1 block h-[38px] rounded-[10px] border border-[#E5E7EB] px-2 text-[14px] text-[#111827]" />
            </label>
            <label className="text-[12px] font-semibold text-[#6B7280]">Until
              <input id="np-quiet-end" type="time" value={prefs.quietEnd || ""} onChange={(e) => setPrefs({ ...prefs, quietEnd: e.target.value })} className="mt-1 block h-[38px] rounded-[10px] border border-[#E5E7EB] px-2 text-[14px] text-[#111827]" />
            </label>
            <button type="button" className={secondaryButton} disabled={!!prefs.quietStart !== !!prefs.quietEnd} onClick={() => save({})}>Save quiet hours</button>
            {(prefs.quietStart || prefs.quietEnd) && <button type="button" className={linkButton} onClick={() => save({ quietStart: null, quietEnd: null })}>Clear</button>}
          </div>
          <p className="text-[11px] text-[#9CA3AF]">No push is sent during quiet hours ({prefs.timezone}); it stays in this list. {note}</p>
        </div>
      )}
    </div>
  );
}

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
      <PushToggle />
      <PushPreferences />
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
