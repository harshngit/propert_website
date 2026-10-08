import React, { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, EmptyState, LoadState, Notice, SectionHeader, formatINR, inputClass, labelClass, linkButton, primaryButton, secondaryButton, useLoad } from "./ui";

// Property Exchange (Module 45): exchange an old or stuck-up property for a
// new one. Raise a request on a listing of yours, see its indicative value
// and every path open to you - a direct swap with another owner, a trade-in
// against a new builder unit, or selling and reinvesting - then tell your
// A R Buildwel representative which one you want. The other owner is never
// shown; everything goes through the representative.

const STATUS = { open: ["Looking for options", "blue"], option_chosen: ["Option chosen", "amber"], in_progress: ["Deal in progress", "amber"], closed: ["Completed", "green"], cancelled: ["Cancelled", "gray"] };
const money = (v) => (v === null || v === undefined ? "—" : formatINR(v));
const gapText = (d) => (d === null || d === undefined ? null : d > 0 ? <>You add <b>{money(d)}</b></> : d < 0 ? <>You keep <b>{money(-d)}</b></> : <>Equal value</>);

function RequestForm({ listings, meta, onDone, onCancel }) {
  const { accessToken } = useAuth();
  const free = listings.filter((l) => !l.inExchange);
  const [f, setF] = useState({ oldPropertyId: free[0]?.id || "", reinvestmentIntent: "guidance", wantedCity: "", wantedPropertyType: "", wantedBedroomsMin: "", wantedBudgetMax: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      const body = Object.fromEntries(Object.entries(f).filter(([, v]) => v !== ""));
      onDone((await apiRequest("/exchange/requests", { method: "POST", token: accessToken, body })).data);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  if (!free.length) {
    return <EmptyState title="List the property first" body="An exchange starts from a listing of yours. Post the property you want to exchange, then come back here." action={<Link to="/dashboard/listings?new=1" className={primaryButton}>Post my property</Link>} />;
  }
  return (
    <Card>
      <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Raise an exchange request</h2>
      {error && <div className="mt-3"><Notice tone="red">{error}</Notice></div>}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2"><span className={labelClass}>Property you want to exchange</span>
          <select className={inputClass} value={f.oldPropertyId} onChange={set("oldPropertyId")} data-no-translate>
            {free.map((l) => <option key={l.id} value={l.id}>{l.title} - {[l.locality, l.city].filter(Boolean).join(", ")}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2"><span className={labelClass}>What do you want to do?</span>
          <select className={inputClass} value={f.reinvestmentIntent} onChange={set("reinvestmentIntent")}>
            {(meta?.intents || []).map((i) => <option key={i.value} value={i.value}>{i.label}</option>)}
          </select>
        </label>
        <label className="block"><span className={labelClass}>City you want</span><input className={inputClass} placeholder="Same city if left blank" value={f.wantedCity} onChange={set("wantedCity")} /></label>
        <label className="block"><span className={labelClass}>Property type you want</span>
          <select className={inputClass} value={f.wantedPropertyType} onChange={set("wantedPropertyType")}>
            <option value="">Any property</option><option value="apartment">Apartment</option><option value="villa">Villa</option><option value="independent_house">Independent House</option><option value="plot">Plot</option><option value="commercial">Commercial</option>
          </select>
        </label>
        <label className="block"><span className={labelClass}>Bedrooms (at least)</span><input type="number" min="0" className={inputClass} value={f.wantedBedroomsMin} onChange={set("wantedBedroomsMin")} /></label>
        <label className="block"><span className={labelClass}>Most you would pay for the new one (₹)</span><input type="number" min="0" className={inputClass} value={f.wantedBudgetMax} onChange={set("wantedBudgetMax")} /></label>
        <label className="block sm:col-span-2"><span className={labelClass}>Anything we should know? (optional)</span><textarea rows={2} className={`${inputClass} h-auto py-2`} value={f.notes} onChange={set("notes")} /></label>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" disabled={busy || !f.oldPropertyId} onClick={submit} className={primaryButton}>See my options</button>
        {onCancel && <button type="button" onClick={onCancel} className={secondaryButton}>Cancel</button>}
      </div>
    </Card>
  );
}

function OptionGroup({ group, first, requestOpen, onInterest, busy }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">{group.label}</h3>
        {group.model && <Badge tone="blue">Model {group.model}</Badge>}
        {first && <Badge tone="green">Recommended</Badge>}
      </div>
      <p className="mt-1 text-[13px] leading-5 text-[#6B7280]">{group.description}</p>
      {group.kind === "hold_and_rent" ? (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          {group.indicativeMonthlyRent && <p className="text-[14px] text-[#111827]">Indicative rent: <b>{money(group.indicativeMonthlyRent)}</b> a month <span className="text-[12px] text-[#6B7280]">({group.rentBasis})</span></p>}
          {requestOpen && <button type="button" disabled={busy} className={linkButton} onClick={() => onInterest(group.kind, null)}>Ask my representative about renting</button>}
        </div>
      ) : (
        <ul className="mt-3 grid gap-3 sm:grid-cols-2">
          {group.items.map((it) => (
            <li key={it.propertyId} className="flex gap-3 rounded-[14px] border border-[#E5E7EB] p-3">
              {it.image ? <img src={it.image} alt="" className="h-[72px] w-[96px] shrink-0 rounded-[10px] object-cover" /> : <div className="h-[72px] w-[96px] shrink-0 rounded-[10px] bg-[#F3F4F6]" />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-[#111827]" data-no-translate>{it.title}</p>
                <p className="text-[12px] text-[#6B7280]" data-no-translate>{[it.locality, it.city].filter(Boolean).join(", ")}{it.bedrooms ? ` · ${it.bedrooms} BHK` : ""}</p>
                <p className="mt-1 text-[13px] text-[#111827]">{money(it.value)} <span className="text-[12px] text-[#6B7280]">· {gapText(it.valueDifference)}</span></p>
                {it.indicativeRentalYieldPercent != null && <p className="text-[12px] text-[#047857]">Indicative rental yield {it.indicativeRentalYieldPercent}%</p>}
                {it.discountPercent != null && <p className="text-[12px] text-[#047857]">{it.discountPercent}% below estimated market value</p>}
                {it.interest ? <p className="mt-1 text-[12px] font-bold text-[#B45309]">{it.interest === "interested" ? "With your representative" : it.interest === "confirmed" ? "Going ahead" : "Not available"}</p>
                  : requestOpen && <button type="button" disabled={busy} className={`${linkButton} mt-1`} onClick={() => onInterest(group.kind, it.propertyId)}>I want this option</button>}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function RequestDetail({ id, onBack }) {
  const { accessToken } = useAuth();
  const state = useLoad((token) => apiRequest(`/exchange/requests/${id}`, { token }).then((r) => r.data), [id]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  if (state.loading || state.error) return <LoadState loading={state.loading} error={state.error} onRetry={state.reload} />;
  const d = state.data;
  const g = d.guidance;
  const run = async (fn, okText) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fn();
      setMessage({ tone: "green", text: okText || res?.data?.message });
      state.reload();
    } catch (err) {
      setMessage({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  const interest = (optionKind, propertyId) => run(() => apiRequest(`/exchange/requests/${id}/interest`, { method: "POST", token: accessToken, body: { optionKind, propertyId: propertyId || undefined } }));
  const ordered = [...d.options].sort((a, b) => g.recommended.indexOf(a.kind) - g.recommended.indexOf(b.kind));
  const [label, tone] = STATUS[d.status] || [d.status, "gray"];
  return (
    <div className="space-y-5">
      <button type="button" className={linkButton} onClick={onBack}>← All exchange requests</button>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#111827]" data-no-translate>{d.oldProperty.title}</h2>
          <Badge tone={tone}>{label}</Badge>
          <span className="ml-auto text-[12px] text-[#6B7280]" data-no-translate>{d.requestNumber}</span>
        </div>
        <p className="text-[13px] text-[#6B7280]">{d.reinvestmentIntentLabel}</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div><p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Your property (indicative)</p><p className="font-['Plus_Jakarta_Sans'] text-[22px] font-extrabold text-[#111827]">{money(g.oldPropertyValuation)}</p><p className="text-[11px] text-[#6B7280]">{d.valuationSource === "admin" ? "Reviewed by your representative" : d.valuationSource === "platform" ? "From area rates on the platform" : d.valuationSource === "asking" ? "Your asking price" : "A representative will value it"}</p></div>
          <div><p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">What you want typically costs</p><p className="font-['Plus_Jakarta_Sans'] text-[22px] font-extrabold text-[#111827]">{money(g.targetTypicalValue)}</p><p className="text-[11px] text-[#6B7280]">{g.targetBasis}</p></div>
          <div><p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Estimated gap</p><p className="font-['Plus_Jakarta_Sans'] text-[22px] font-extrabold text-[#111827]">{g.estimatedGap === null ? "—" : g.estimatedGap >= 0 ? money(g.estimatedGap) : `+${money(-g.estimatedGap)}`}</p><p className="text-[11px] text-[#6B7280]">{g.estimatedGap === null ? "" : g.estimatedGap >= 0 ? "You would add this" : "Surplus you would keep"}</p></div>
        </div>
        <p className="mt-3 text-[12px] leading-5 text-[#6B7280]">{g.valuationDisclaimer}</p>
        {d.representative && <p className="mt-3 rounded-[10px] bg-[#F9FAFB] px-3 py-2 text-[13px] text-[#111827]">Your representative: <b data-no-translate>{d.representative.name}</b>{d.representative.platformNumber ? <span data-no-translate> · {d.representative.platformNumber}</span> : null}</p>}
      </Card>

      {d.legs.length > 0 && (
        <Card>
          <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Your exchange is going ahead</h3>
          {d.valueDifference !== null && <p className="mt-1 text-[14px] text-[#111827]">{gapText(d.valueDifference)} <span className="text-[12px] text-[#6B7280]">- settled between the parties off-platform.</span></p>}
          <ul className="mt-3 divide-y divide-[#F3F4F6]">
            {d.legs.map((l) => <li key={l.dealId} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[14px]"><span data-no-translate>{l.property}</span><span className="text-[12px] text-[#6B7280]">{money(l.dealValue)} · <Badge status={l.stage} /></span></li>)}
          </ul>
          <p className="mt-2 text-[12px] leading-5 text-[#6B7280]">{d.feeNote} Both legs close together. Track each one in <Link to="/dashboard/deals" className="font-bold text-[#E51C23]">My Deals &amp; Invoices</Link>.</p>
        </Card>
      )}

      {d.status === "open" && ordered.length === 0 && <Card><p className="text-[14px] text-[#6B7280]">No matching options on the platform yet. Your representative will search for you, and new options appear here as owners and builders list.</p></Card>}
      {["open", "option_chosen"].includes(d.status) && ordered.map((o, i) => <OptionGroup key={o.kind} group={o} first={i === 0} requestOpen={d.status === "open"} onInterest={interest} busy={busy} />)}
      <p className="rounded-[12px] bg-[#F9FAFB] px-4 py-3 text-[12px] leading-5 text-[#6B7280]">{g.disclaimer}</p>
      {["open", "option_chosen"].includes(d.status) && <button type="button" disabled={busy} className={linkButton} onClick={() => window.confirm("Cancel this exchange request?") && run(() => apiRequest(`/exchange/requests/${id}/cancel`, { method: "POST", token: accessToken, body: {} }), "Exchange request cancelled.")}>Cancel this request</button>}
    </div>
  );
}

export default function ExchangeSection() {
  const list = useLoad((token) => apiRequest("/exchange/requests", { token }).then((r) => r.data));
  const listings = useLoad((token) => apiRequest("/exchange/my-listings", { token }).then((r) => r.data));
  const meta = useLoad((token) => apiRequest("/exchange/meta", { token }).then((r) => r.data));
  const [active, setActive] = useState(null);
  const [creating, setCreating] = useState(false);
  if (active) return <RequestDetail id={active} onBack={() => { setActive(null); list.reload(); listings.reload(); }} />;
  if (list.loading || list.error) return <LoadState loading={list.loading} error={list.error} onRetry={list.reload} />;
  const rows = list.data;
  return (
    <div className="space-y-5">
      <SectionHeader title="Property Exchange" subtitle="Exchange your old or stuck-up property for a new one: swap directly with another owner, trade it in against a new builder unit, or sell and reinvest with guidance."
        action={rows.length > 0 && !creating ? <button type="button" className={primaryButton} onClick={() => setCreating(true)}>New exchange request</button> : null} />
      {(creating || rows.length === 0) && <RequestForm listings={listings.data || []} meta={meta.data} onCancel={rows.length ? () => setCreating(false) : null} onDone={(d) => { setCreating(false); setActive(d.id); }} />}
      {rows.length > 0 && (
        <Card className="!p-0">
          <ul className="divide-y divide-[#F3F4F6]">
            {rows.map((r) => {
              const [label, tone] = STATUS[r.status] || [r.status, "gray"];
              return (
                <li key={r.id}>
                  <button type="button" onClick={() => setActive(r.id)} className="flex w-full flex-wrap items-center gap-3 p-4 text-left hover:bg-[#FAFAFA]">
                    <span className="min-w-0 flex-1"><span className="block truncate text-[15px] font-semibold text-[#111827]" data-no-translate>{r.oldProperty.title}</span><span className="block text-[13px] text-[#6B7280]">{r.reinvestmentIntentLabel} · {money(r.oldPropertyValuation)}</span></span>
                    <Badge tone={tone}>{label}</Badge>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>
      )}
    </div>
  );
}
