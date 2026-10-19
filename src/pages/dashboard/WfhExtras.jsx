import React, { useEffect, useState } from "react";
import { apiRequest } from "../../api/client";
import { isNativeApp, setToken, start as startTracking, stop as stopTracking, subscribe } from "../../lib/fieldTracking";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, LoadState, Notice, inputClass, labelClass, linkButton, primaryButton, secondaryButton, useLoad } from "./ui";

// Work From Home (Module 47) - the anti-fraud steps a field partner sees:
// the location track at the property, the household declaration, and teams.

// The location track at the property (see lib/fieldTracking.js). In the
// PropertySerch Field app it keeps running with the screen locked; in a
// browser this page has to stay open with the screen on.
export function LocationTracker({ id }) {
  const { accessToken } = useAuth();
  const [t, setT] = useState({ running: false, progress: null, error: null, taskId: null, native: isNativeApp() });
  useEffect(() => subscribe(setT), []);
  useEffect(() => setToken(accessToken), [accessToken]);
  const mine = t.taskId === id;
  const on = mine && t.running;
  const progress = mine ? t.progress : null;
  const error = mine ? t.error : null;
  const pct = progress ? Math.min(100, Math.round((progress.minutes / progress.need) * 100)) : 0;
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[14px] font-bold text-[#111827]">Location at the property</p>
          <p className="text-[12px] text-[#6B7280]">
            {t.native
              ? "Stay at the property for 10 minutes. You can lock the phone or use other apps - a notification shows while your visit is being recorded."
              : "Stay at the property with this page open and the screen on for 10 minutes. In the PropertySerch Field app you can lock the phone instead."}
          </p>
        </div>
        {progress?.ok ? <Badge tone="green">Complete</Badge> : on ? (
          <div className="flex items-center gap-2">
            <Badge tone="amber">Recording</Badge>
            <button type="button" className={linkButton} onClick={() => stopTracking()}>Stop</button>
          </div>
        ) : (
          <button type="button" className={secondaryButton} onClick={() => startTracking(id, accessToken)}>{progress ? "Resume" : "Start"}</button>
        )}
      </div>
      {(on || progress) && (
        <div className="mt-3">
          <div className="h-2 rounded-full bg-[#E5E7EB]"><div className="h-2 rounded-full bg-[#16A34A] transition-all" style={{ width: `${pct}%` }} /></div>
          <p className="mt-1 text-[12px] text-[#6B7280]">{progress ? `${progress.minutes} of ${progress.need} minutes at the property` : "Finding your position…"}</p>
          {progress?.issues?.length > 0 && !progress.ok && <p className="mt-1 text-[12px] text-[#92400E]">{progress.issues.join(" · ")}</p>}
        </div>
      )}
      {!mine && t.running && <p className="mt-2 text-[12px] text-[#92400E]">Another task's visit is being recorded. Starting here stops that one.</p>}
      {error && <p className="mt-2 text-[12px] font-semibold text-[#B91C1C]">{error}</p>}
    </div>
  );
}

const RELATION = { spouse: "Spouse", parent: "Parent", child: "Child", sibling: "Brother / sister", in_law: "In-law", other: "Other" };

// Household declaration: these numbers can never be submitted as a buyer or an owner.
export function FamilyPanel({ onChanged }) {
  const { accessToken } = useAuth();
  const state = useLoad((token) => apiRequest("/wfh/family", { token }).then((r) => r.data));
  const [rows, setRows] = useState([{ relation: "spouse", name: "", mobile: "", aadhaar: "" }]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  if (state.loading || state.error) return <LoadState loading={state.loading} error={state.error} onRetry={state.reload} />;
  const d = state.data;
  const setRow = (i, k) => (e) => setRows((list) => list.map((r, j) => (j === i ? { ...r, [k]: e.target.value } : r)));
  const save = async (body) => {
    setBusy(true);
    setMessage(null);
    try {
      await apiRequest("/wfh/family", { method: "PUT", token: accessToken, body });
      setRows([{ relation: "spouse", name: "", mobile: "", aadhaar: "" }]);
      setMessage({ tone: "green", text: "Saved." });
      state.reload();
      onChanged?.();
    } catch (err) {
      setMessage({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  const filled = rows.filter((r) => r.mobile.trim());
  return (
    <Card>
      <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">My household</h3>
      <p className="mt-1 text-[13px] leading-5 text-[#6B7280]">List the mobile numbers of the people in your family. A family member can never be submitted as a buyer or an owner, so this protects your account. Numbers can be added later but not removed.</p>
      {message && <div className="mt-3"><Notice tone={message.tone}>{message.text}</Notice></div>}
      {d.members.length > 0 && (
        <ul className="mt-3 divide-y divide-[#F3F4F6] rounded-[12px] border border-[#E5E7EB]">
          {d.members.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 px-3 py-2 text-[13px]">
              <span className="text-[#111827]"><span data-no-translate>{m.name || "—"}</span> · {RELATION[m.relation] || m.relation}</span>
              <span className="text-[#6B7280]" data-no-translate>••••••{m.phoneLast4}</span>
            </li>
          ))}
        </ul>
      )}
      {d.declared && !d.members.length && <p className="mt-3 text-[13px] text-[#374151]">You confirmed that there is nobody to declare.</p>}
      <div className="mt-4 space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="grid gap-3 sm:grid-cols-4">
            <label className="block"><span className={labelClass}>Relation</span><select className={inputClass} value={r.relation} onChange={setRow(i, "relation")}>{d.relations.map((k) => <option key={k} value={k}>{RELATION[k] || k}</option>)}</select></label>
            <label className="block"><span className={labelClass}>Name</span><input className={inputClass} value={r.name} onChange={setRow(i, "name")} /></label>
            <label className="block"><span className={labelClass}>Mobile number</span><input className={inputClass} inputMode="numeric" maxLength={10} value={r.mobile} onChange={setRow(i, "mobile")} /></label>
            <label className="block"><span className={labelClass}>Aadhaar (optional)</span><input className={inputClass} inputMode="numeric" maxLength={12} value={r.aadhaar} onChange={setRow(i, "aadhaar")} /></label>
          </div>
        ))}
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className={linkButton} onClick={() => setRows((list) => [...list, { relation: "other", name: "", mobile: "", aadhaar: "" }])}>+ Add another person</button>
          <button type="button" disabled={busy || !filled.length} className={primaryButton} onClick={() => save({ members: filled })}>Save</button>
          {!d.declared && <button type="button" disabled={busy} className={secondaryButton} onClick={() => save({ none: true })}>I have nobody to declare</button>}
        </div>
      </div>
    </Card>
  );
}

// Teams: work with other field partners and see how the team is doing.
export function TeamPanel({ onChanged }) {
  const { accessToken } = useAuth();
  const state = useLoad((token) => apiRequest("/wfh/team", { token }).then((r) => r.data));
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  if (state.loading || state.error) return <LoadState loading={state.loading} error={state.error} onRetry={state.reload} />;
  const t = state.data.team;
  const run = async (path, options, done) => {
    setBusy(true);
    setMessage(null);
    try {
      await apiRequest(path, { token: accessToken, ...options });
      if (done) setMessage({ tone: "green", text: done });
      state.reload();
      onChanged?.();
    } catch (err) {
      setMessage({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  if (!t) {
    return (
      <div className="space-y-5">
        {message && <Notice tone={message.tone}>{message.text}</Notice>}
        <Card>
          <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Start a team</h3>
          <p className="mt-1 text-[13px] text-[#6B7280]">Cover a neighbourhood together with up to {state.data.maxSize} field partners. Each person is still paid for their own verified tasks.</p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="block grow"><span className={labelClass}>Team name</span><input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} maxLength={60} /></label>
            <button type="button" disabled={busy || name.trim().length < 3} className={primaryButton} onClick={() => run("/wfh/team", { method: "POST", body: { name } }, "Team created. Share the code with the people you want in it.")}>Create team</button>
          </div>
        </Card>
        <Card>
          <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Join a team</h3>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <label className="block grow"><span className={labelClass}>Team code</span><input className={inputClass} value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={12} /></label>
            <button type="button" disabled={busy || code.trim().length < 4} className={secondaryButton} onClick={() => run("/wfh/team/join", { method: "POST", body: { code } }, "You have joined the team.")}>Join</button>
          </div>
        </Card>
      </div>
    );
  }
  return (
    <div className="space-y-5">
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#111827]" data-no-translate>{t.name}</h3>
            <p className="text-[13px] text-[#6B7280]">Team code <b className="text-[#111827]" data-no-translate>{t.code}</b> - share it to invite field partners.</p>
          </div>
          <button type="button" disabled={busy} className={secondaryButton} onClick={() => window.confirm("Leave this team?") && run("/wfh/team/leave", { method: "POST" }, "You have left the team.")}>Leave team</button>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <div className="rounded-[12px] bg-[#F9FAFB] px-2 py-3"><p className="text-[20px] font-extrabold text-[#111827]">{t.stats.verifiedThisMonth}</p><p className="text-[12px] text-[#6B7280]">Verified this month</p></div>
          <div className="rounded-[12px] bg-[#F9FAFB] px-2 py-3"><p className="text-[20px] font-extrabold text-[#111827]">{t.stats.verifiedTotal}</p><p className="text-[12px] text-[#6B7280]">Verified in all</p></div>
          <div className="rounded-[12px] bg-[#F9FAFB] px-2 py-3"><p className="text-[20px] font-extrabold text-[#111827]">#{t.stats.rank}</p><p className="text-[12px] text-[#6B7280]">of {t.stats.teams} teams</p></div>
        </div>
      </Card>
      <Card>
        <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Members</h3>
        <ul className="mt-2 divide-y divide-[#F3F4F6]">
          {t.members.map((m) => (
            <li key={m.userId} className="flex flex-wrap items-center justify-between gap-3 py-2.5 text-[14px]">
              <span className="text-[#111827]"><span data-no-translate>{m.name}</span>{m.isYou ? " (you)" : ""} {m.isLeader && <Badge tone="amber">Leader</Badge>}</span>
              <span className="flex items-center gap-3 text-[13px] text-[#6B7280]">
                {m.verifiedThisMonth} this month · {m.verifiedTotal} in all
                {t.isLeader && !m.isYou && <button type="button" disabled={busy} className={linkButton} onClick={() => window.confirm("Remove this person from the team?") && run(`/wfh/team/members/${m.userId}`, { method: "DELETE" }, "Removed.")}>Remove</button>}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[12px] text-[#9CA3AF]">A member of your team cannot be submitted as a buyer or an owner on your tasks.</p>
      </Card>
    </div>
  );
}
