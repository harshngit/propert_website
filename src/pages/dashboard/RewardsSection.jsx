import React, { useState } from "react";
import { apiRequest } from "../../api/client";
import { Badge, Card, LoadState, SectionHeader, formatDate, inputClass, useLoad } from "./ui";

// Rewards (Module 29): points earned from real activity on the platform,
// the tier they add up to, and the customer leaderboards - platform-wide
// or for one city. Other customers appear by first name and initial only.

const n = (v) => Number(v || 0).toLocaleString("en-IN");
const TIER_TONE = { bronze: "amber", silver: "gray", gold: "amber", platinum: "blue", elite: "green" };

function Leaderboard({ cities }) {
  const [scope, setScope] = useState("platform");
  const [city, setCity] = useState("");
  const [period, setPeriod] = useState("month");
  const ready = scope === "platform" || city;
  const board = useLoad(
    (token) => (ready ? apiRequest(`/gamification/leaderboard?scope=${scope}&period=${period}${scope === "area" ? `&city=${encodeURIComponent(city)}` : ""}`, { token }).then((r) => r.data) : Promise.resolve(null)),
    [scope, city, period, ready]
  );
  const rows = board.data?.items || [];
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="mr-auto font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Leaderboard</h2>
        <select aria-label="Leaderboard" className={`${inputClass} !mt-0 !h-9 !w-auto`} value={scope} onChange={(e) => setScope(e.target.value)}><option value="platform">Platform</option><option value="area">My city</option></select>
        {scope === "area" && (
          <select aria-label="City" data-no-translate className={`${inputClass} !mt-0 !h-9 !w-auto`} value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Choose a city</option>
            {cities.map((c) => <option key={c.city} value={c.city}>{c.city}</option>)}
          </select>
        )}
        <select aria-label="Period" className={`${inputClass} !mt-0 !h-9 !w-auto`} value={period} onChange={(e) => setPeriod(e.target.value)}><option value="month">This month</option><option value="quarter">This quarter</option><option value="all">All time</option></select>
      </div>
      {!ready ? <p className="mt-4 text-[14px] text-[#6B7280]">Choose a city to see its leaderboard.</p> : board.loading || board.error ? <div className="mt-4"><LoadState loading={board.loading} error={board.error} onRetry={board.reload} /></div> : rows.length === 0 ? (
        <p className="mt-4 text-[14px] text-[#6B7280]">No one is on this board yet.</p>
      ) : (
        <ol className="mt-4 divide-y divide-[#F3F4F6]">
          {rows.map((r, i) => (
            <li key={`${r.rank}-${i}`} className={`flex items-center gap-3 py-2.5 ${r.isMe ? "rounded-[10px] bg-[#FEF2F2] px-2" : ""}`}>
              <span className="w-8 font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">{r.rank}</span>
              <span className="min-w-0 flex-1 truncate text-[14px] font-semibold text-[#111827]" data-no-translate>{r.name}{r.isMe ? " ★" : ""}</span>
              <Badge tone={TIER_TONE[r.tier.key]}>{r.tier.label}</Badge>
              <span className="w-16 text-right text-[14px] font-bold text-[#111827]">{n(r.points)}</span>
            </li>
          ))}
        </ol>
      )}
      {board.data?.me && !rows.some((r) => r.isMe) && <p className="mt-3 rounded-[10px] bg-[#FEF2F2] px-3 py-2 text-[13px] text-[#111827]">Your rank: <b>#{board.data.me.rank}</b> · <b>{n(board.data.me.points)}</b></p>}
    </Card>
  );
}

export default function RewardsSection() {
  const me = useLoad((token) => apiRequest("/gamification/me", { token }).then((r) => r.data));
  const cities = useLoad((token) => apiRequest("/gamification/cities", { token }).then((r) => r.data));
  if (me.loading || me.error) return <LoadState loading={me.loading} error={me.error} onRetry={me.reload} />;
  const d = me.data;
  if (!d?.enabled) return <SectionHeader title="Rewards" subtitle="Rewards are switched off at the moment." />;
  return (
    <div className="space-y-5">
      <SectionHeader title="Rewards" subtitle="Points come from what you actually do here - posting a requirement, a verified listing, a completed deal, a published review." />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Points</p>
              <p className="font-['Plus_Jakarta_Sans'] text-[38px] font-extrabold leading-none text-[#111827]">{n(d.totalPoints)}</p>
            </div>
            <div><p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Your tier</p><Badge tone={TIER_TONE[d.tier.key]}>{d.tier.label}</Badge></div>
            <p className="ml-auto text-right text-[13px] text-[#6B7280]"><b className="text-[#111827]">{n(d.pointsThisMonth)}</b> <span>This month</span>{d.rankThisMonth ? <><br /><span>Rank</span> <b className="text-[#111827]">#{d.rankThisMonth}</b></> : null}</p>
          </div>
          <div className="mt-4 h-2.5 rounded-full bg-[#F3F4F6]"><div className="h-2.5 rounded-full bg-[#E51C23]" style={{ width: `${d.progressPercent}%` }} /></div>
          <p className="mt-1.5 text-[13px] text-[#6B7280]">{d.nextTier ? <><b className="text-[#111827]">{n(d.pointsToNext)}</b> <span>more points to reach</span> <b className="text-[#111827]">{d.nextTier.label}</b></> : <span>You are at the top tier.</span>}</p>
          <div className="mt-3 flex flex-wrap gap-2">{d.tiers.map((t) => <span key={t.key} className={`rounded-[8px] border px-2.5 py-1 text-[11px] ${t.key === d.tier.key ? "border-[#FCA5A5] bg-[#FEF2F2] font-bold text-[#B91C1C]" : "border-[#E5E7EB] text-[#6B7280]"}`}>{t.label} · {n(t.min)}+</span>)}</div>
        </Card>
        <Card>
          <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Weekly streak</p>
          <p className="mt-1 font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold text-[#111827]">{d.streakWeeks}</p>
          <p className="text-[13px] text-[#6B7280]"><span>Best so far:</span> {d.bestStreakWeeks}</p>
        </Card>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">How to earn points</h2>
          <ul className="mt-3 divide-y divide-[#F3F4F6]">
            {d.howToEarn.map((r) => (
              <li key={r.action_key} className="flex items-start justify-between gap-3 py-2.5">
                <div><p className="text-[14px] font-semibold text-[#111827]">{r.label}</p><p className="text-[12px] text-[#6B7280]">{r.description}</p></div>
                <span className="shrink-0 rounded-full bg-[#ECFDF5] px-2 py-0.5 text-[12px] font-bold text-[#047857]">+{r.points}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Recent points</h2>
          {d.recent.length === 0 ? <p className="mt-3 text-[14px] text-[#6B7280]">No points yet.</p> : (
            <ul className="mt-3 divide-y divide-[#F3F4F6]">
              {d.recent.map((p) => (
                <li key={p.id} className="flex items-start justify-between gap-3 py-2.5">
                  <div><p className="text-[14px] text-[#111827]">{p.label}</p><p className="text-[12px] text-[#6B7280]" data-no-translate>{formatDate(p.earned_at)}{p.city ? ` · ${p.city}` : ""}{p.note ? ` · ${p.note}` : ""}</p></div>
                  <span className={`shrink-0 text-[14px] font-bold ${p.points < 0 ? "text-[#B91C1C]" : "text-[#047857]"}`}>{p.points > 0 ? "+" : ""}{p.points}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
      <Leaderboard cities={cities.data || []} />
    </div>
  );
}
