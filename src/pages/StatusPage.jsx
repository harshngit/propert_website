import React, { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import { apiRequest } from "../api/client";

// Public status page (contract sec. 25.5.4): whether each part of the
// platform is working, any open incident or planned maintenance with its
// updates and expected fix time, and the last two weeks of resolved ones.
// Refreshes every minute.

const STATE = {
  operational: ["Working", "bg-emerald-50 text-emerald-700", "bg-emerald-500"],
  maintenance: ["Maintenance", "bg-sky-50 text-sky-700", "bg-sky-500"],
  degraded: ["Slow or partly affected", "bg-amber-50 text-amber-800", "bg-amber-500"],
  partial_outage: ["Partly down", "bg-orange-50 text-orange-800", "bg-orange-500"],
  major_outage: ["Down", "bg-red-50 text-red-700", "bg-red-600"],
};
const STATUS = { investigating: "Investigating", identified: "Cause found", monitoring: "Fixed - monitoring", scheduled: "Scheduled", resolved: "Resolved" };
const when = (d) => (d ? new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "");

function Incident({ i, labels }) {
  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-5">
      <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">{i.title}</p>
      <p className="mt-1 text-[13px] text-[#6B7280]">
        {i.components.map((k) => labels[k] || k).join(", ")} · from {when(i.startsAt)}
        {i.etaAt && i.status !== "resolved" ? ` · ${i.impact === "maintenance" ? "until" : "expected fix"} ${when(i.etaAt)}` : ""}
        {i.resolvedAt ? ` · resolved ${when(i.resolvedAt)}` : ""}
      </p>
      <ol className="mt-3 space-y-2 border-l-2 border-[#E5E7EB] pl-4">
        {i.updates.map((u, n) => (
          <li key={n} className="text-[14px] text-[#374151]"><b>{STATUS[u.status]}</b> <span className="text-[12px] text-[#9CA3AF]">{when(u.at)}</span><br />{u.message}</li>
        ))}
      </ol>
    </div>
  );
}

export default function StatusPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    let gone = false;
    const load = () =>
      apiRequest("/status")
        .then((r) => !gone && (setData(r.data), setError(false)))
        .catch(() => !gone && setError(true));
    load();
    const t = setInterval(load, 60000);
    return () => {
      gone = true;
      clearInterval(t);
    };
  }, []);
  const labels = Object.fromEntries((data?.components || []).map((c) => [c.key, c.label]));
  const overall = data ? STATE[data.overall] : null;
  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <SiteHeader />
      <main className="mx-auto max-w-[880px] px-4 py-10">
        <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold text-[#111827]">PropertySerch status</h1>
        {error && !data && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-[14px] text-red-800">We cannot reach the platform to check its status right now. If you cannot use PropertySerch, it is likely down - please try again shortly.</p>
        )}
        {!data && !error && <p className="mt-4 text-[14px] text-[#6B7280]">Checking…</p>}
        {data && (
          <>
            <div className={`mt-4 flex items-center gap-3 rounded-2xl p-5 ${overall[1]}`}>
              <span className={`h-3 w-3 rounded-full ${overall[2]}`} />
              <p className="text-[16px] font-bold">{data.overall === "operational" ? "Everything is working" : data.overall === "maintenance" ? "Planned maintenance in progress" : "Some parts of PropertySerch are affected"}</p>
            </div>

            {data.active.length > 0 && (
              <section className="mt-6 space-y-3">
                <h2 className="text-[13px] font-bold uppercase tracking-wide text-[#6B7280]">Now</h2>
                {data.active.map((i) => <Incident key={i.id} i={i} labels={labels} />)}
              </section>
            )}

            <section className="mt-6 rounded-2xl border border-[#E5E7EB] bg-white">
              {data.components.map((c) => (
                <div key={c.key} className="flex items-center justify-between border-b border-[#F3F4F6] px-5 py-3 last:border-0">
                  <span className="text-[14px] text-[#111827]">{c.label}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${STATE[c.state][1]}`}>{STATE[c.state][0]}</span>
                </div>
              ))}
            </section>

            {data.upcoming.length > 0 && (
              <section className="mt-6 space-y-3">
                <h2 className="text-[13px] font-bold uppercase tracking-wide text-[#6B7280]">Planned maintenance</h2>
                {data.upcoming.map((i) => <Incident key={i.id} i={i} labels={labels} />)}
              </section>
            )}

            <section className="mt-6 space-y-3">
              <h2 className="text-[13px] font-bold uppercase tracking-wide text-[#6B7280]">Last 14 days</h2>
              {data.recent.length ? data.recent.map((i) => <Incident key={i.id} i={i} labels={labels} />) : <p className="text-[14px] text-[#6B7280]">No incidents.</p>}
            </section>
            <p className="mt-6 text-[12px] text-[#9CA3AF]">Updated {when(data.updatedAt)}. This page refreshes every minute.</p>
          </>
        )}
      </main>
      <CompanyFooterSection />
    </div>
  );
}
