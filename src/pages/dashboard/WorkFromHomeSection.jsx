import React, { useState } from "react";
import { apiRequest } from "../../api/client";
import { API_BASE_URL } from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, EmptyState, LoadState, Notice, SectionHeader, formatDate, formatINR, inputClass, labelClass, linkButton, primaryButton, secondaryButton, useLoad } from "./ui";

// Work From Home (Module 47): earn a fixed amount for each verified field
// task near you - bringing a buyer to a property, getting an owner's consent
// for photos, collecting a requirement and so on.
//   Join -> Task board (near you) -> accept (reserved 48 hours) -> submit
//   evidence (location, photos, the buyer's / owner's OTP) -> verified by
//   A R Buildwel -> paid monthly.

const money = (v) => (v === null || v === undefined ? "—" : formatINR(v));
const WAIT = { otp: "Waiting for the OTP", representative: "With the A R Buildwel representative", review: "Being reviewed by A R Buildwel", listing_live: "Waiting for the listing to go live" };
const timeLeft = (v) => {
  const ms = new Date(v) - Date.now();
  if (ms <= 0) return "expired";
  const h = Math.floor(ms / 3600000);
  return h >= 48 ? `${Math.floor(h / 24)} days left` : h >= 1 ? `${h} h left` : `${Math.max(Math.floor(ms / 60000), 1)} min left`;
};
const locate = () => new Promise((resolve, reject) => {
  if (!navigator.geolocation) return reject(new Error("This device cannot share its location"));
  navigator.geolocation.getCurrentPosition((p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }), () => reject(new Error("Allow location access to continue")), { enableHighAccuracy: true, timeout: 15000 });
});

function JoinForm({ intro, onDone }) {
  const { accessToken } = useAuth();
  const [f, setF] = useState({ aadhaar: "", pan: "", bankAccount: "", bankIfsc: "", bankAccountName: "", city: "", locality: "", latitude: "", longitude: "", agreementAccepted: false });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const useLocation = async () => {
    setError(null);
    try {
      const p = await locate();
      setF((s) => ({ ...s, ...p }));
    } catch (err) {
      setError(err.message);
    }
  };
  const submit = async () => {
    setBusy(true);
    setError(null);
    try {
      await apiRequest("/wfh/register", { method: "POST", token: accessToken, body: f });
      onDone();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-5">
      <Card>
        <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">What you can earn</h2>
        <ul className="mt-3 divide-y divide-[#F3F4F6]">
          {intro.taskTypes.map((t) => (
            <li key={t.key} className="flex items-start justify-between gap-3 py-2.5">
              <div><p className="text-[14px] font-semibold text-[#111827]">{t.label}</p><p className="text-[12px] leading-5 text-[#6B7280]">{t.howItWorks}</p></div>
              <span className="shrink-0 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[12px] font-bold text-[#047857]">{t.amount > 0 ? money(t.amount) : "To be announced"}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card>
        <h2 className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">Join as a field partner</h2>
        {error && <div className="mt-3"><Notice tone="red">{error}</Notice></div>}
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block"><span className={labelClass}>Aadhaar number</span><input className={inputClass} inputMode="numeric" maxLength={14} value={f.aadhaar} onChange={set("aadhaar")} /></label>
          <label className="block"><span className={labelClass}>PAN (optional - lowers TDS)</span><input className={inputClass} maxLength={10} value={f.pan} onChange={(e) => setF((s) => ({ ...s, pan: e.target.value.toUpperCase() }))} /></label>
          <label className="block"><span className={labelClass}>Bank account number</span><input className={inputClass} inputMode="numeric" value={f.bankAccount} onChange={set("bankAccount")} /></label>
          <label className="block"><span className={labelClass}>IFSC code</span><input className={inputClass} maxLength={11} value={f.bankIfsc} onChange={(e) => setF((s) => ({ ...s, bankIfsc: e.target.value.toUpperCase() }))} /></label>
          <label className="block"><span className={labelClass}>Name on the bank account</span><input className={inputClass} value={f.bankAccountName} onChange={set("bankAccountName")} /></label>
          <label className="block"><span className={labelClass}>City</span><input className={inputClass} value={f.city} onChange={set("city")} /></label>
          <label className="block"><span className={labelClass}>Locality</span><input className={inputClass} value={f.locality} onChange={set("locality")} /></label>
          <div><span className={labelClass}>Your location (tasks are shown within {intro.radiusKm} km)</span><button type="button" onClick={useLocation} className={`${secondaryButton} mt-1.5 w-full`}>{f.latitude ? "Location set ✓" : "Use my current location"}</button></div>
        </div>
        <div className="mt-4 rounded-[12px] bg-[#F9FAFB] p-4">
          <p className="text-[13px] font-bold text-[#111827]">Field Partner Agreement <span className="font-normal text-[#6B7280]" data-no-translate>v{intro.agreementVersion}</span></p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[13px] leading-5 text-[#4B5563]">{intro.agreement.map((a) => <li key={a}>{a}</li>)}</ul>
          <label className="mt-3 flex items-start gap-2 text-[14px] text-[#111827]"><input type="checkbox" className="mt-1" checked={f.agreementAccepted} onChange={(e) => setF((s) => ({ ...s, agreementAccepted: e.target.checked }))} /><span>I have read and accept the Field Partner Agreement.</span></label>
        </div>
        <p className="mt-3 text-[12px] text-[#6B7280]">Your Aadhaar and bank details are stored encrypted and used only for verification and payouts.</p>
        <button type="button" disabled={busy || !f.agreementAccepted || !f.latitude} onClick={submit} className={`${primaryButton} mt-4`}>Join</button>
      </Card>
    </div>
  );
}

// The evidence form for one accepted task.
function TaskWork({ id, onBack }) {
  const { accessToken } = useAuth();
  const state = useLoad((token) => apiRequest(`/wfh/assignments/${id}`, { token }).then((r) => r.data), [id]);
  const [f, setF] = useState({ partyName: "", partyPhone: "", intent: "buy", propertyType: "", budgetMax: "", bedrooms: "", notes: "", consent: false, listingId: "", parking: "", amenities: "", buildingCondition: "", neighbourhood: "", accessRoad: "", overall: "good", remarks: "", exists: true, possession: "", access: "" });
  const [gps, setGps] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);
  if (state.loading || state.error) return <LoadState loading={state.loading} error={state.error} onRetry={state.reload} />;
  const a = state.data;
  const type = a.taskType;
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));
  const needsGps = ["buyer_visit", "condition_report", "auction_check"].includes(type);
  const needsParty = ["buyer_visit", "seller_photo", "requirement_collect", "listing_assist", "area_survey"].includes(type);
  const minPhotos = { seller_photo: 5, condition_report: 3, auction_check: 2 }[type] || 0;
  const partyWord = ["seller_photo", "listing_assist"].includes(type) ? "owner" : type === "buyer_visit" ? "buyer" : "person";
  const run = async (fn) => {
    setBusy(true);
    setMessage(null);
    try {
      const res = await fn();
      if (res) setMessage({ tone: "green", text: res });
      state.reload();
    } catch (err) {
      setMessage({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  const checkIn = () => run(async () => { setGps(await locate()); });
  const submit = () => run(async () => {
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => v !== "" && fd.append(k, v));
    if (gps) { fd.append("latitude", gps.latitude); fd.append("longitude", gps.longitude); }
    photos.forEach((p) => fd.append("photos", p));
    // Posted directly: the shared client is for JSON, and this carries files.
    const res = await fetch(`${API_BASE_URL}/wfh/assignments/${id}/submit`, { method: "POST", headers: { Authorization: `Bearer ${accessToken}` }, body: fd });
    const json = await res.json().catch(() => null);
    if (!res.ok || json?.success === false) throw new Error(json?.message || "Could not submit the task");
    return needsParty ? `Submitted. An OTP has been sent to the ${partyWord} - enter it below within 10 minutes.` : "Submitted for review.";
  });
  const confirm = () => run(async () => { await apiRequest(`/wfh/assignments/${id}/otp`, { method: "POST", token: accessToken, body: { otp } }); return "OTP confirmed."; });
  const resend = () => run(async () => { await apiRequest(`/wfh/assignments/${id}/otp/resend`, { method: "POST", token: accessToken }); return "A new OTP has been sent."; });

  return (
    <div className="space-y-5">
      <button type="button" className={linkButton} onClick={onBack}>← Back</button>
      {message && <Notice tone={message.tone}>{message.text}</Notice>}
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#111827]" data-no-translate>{a.title}</h2>
          <Badge tone="green">{money(a.paymentAmount)}</Badge>
          {a.state === "accepted" && <Badge tone="amber">{timeLeft(a.lockExpiresAt)}</Badge>}
        </div>
        <p className="text-[13px] text-[#6B7280]">{a.taskTypeLabel}</p>
        {a.property && <p className="mt-2 text-[14px] text-[#111827]" data-no-translate>{a.property.title}{a.property.address ? ` - ${a.property.address}` : ""}</p>}
        {a.location.latitude && <a className={`${linkButton} mt-1 inline-block`} href={`https://www.google.com/maps/search/?api=1&query=${a.location.latitude},${a.location.longitude}`} target="_blank" rel="noreferrer">Open the location in maps</a>}
        <p className="mt-3 rounded-[10px] bg-[#F9FAFB] px-3 py-2 text-[13px] leading-5 text-[#4B5563]">{a.howItWorks}</p>
        {a.instructions && <p className="mt-2 text-[13px] text-[#4B5563]" data-no-translate>{a.instructions}</p>}
      </Card>

      {a.state === "accepted" && (
        <Card>
          <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Submit evidence</h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {needsGps && <div className="sm:col-span-2"><span className={labelClass}>Check in at the property</span><button type="button" disabled={busy} onClick={checkIn} className={`${secondaryButton} mt-1.5`}>{gps ? "Checked in ✓" : "Check in with my location"}</button></div>}
            {needsParty && <>
              <label className="block"><span className={labelClass}>Name of the {partyWord}</span><input className={inputClass} value={f.partyName} onChange={set("partyName")} /></label>
              <label className="block"><span className={labelClass}>Mobile number of the {partyWord}</span><input className={inputClass} inputMode="numeric" maxLength={10} value={f.partyPhone} onChange={set("partyPhone")} /></label>
            </>}
            {["requirement_collect", "area_survey"].includes(type) && <>
              <label className="block"><span className={labelClass}>They want to</span><select className={inputClass} value={f.intent} onChange={set("intent")}><option value="buy">Buy</option><option value="rent">Rent</option><option value="sell">Sell</option></select></label>
              <label className="block"><span className={labelClass}>Property type</span><select className={inputClass} value={f.propertyType} onChange={set("propertyType")}><option value="">Any property</option><option value="apartment">Apartment</option><option value="villa">Villa</option><option value="independent_house">Independent House</option><option value="plot">Plot</option><option value="commercial">Commercial</option></select></label>
              <label className="block"><span className={labelClass}>Budget up to (₹)</span><input type="number" className={inputClass} value={f.budgetMax} onChange={set("budgetMax")} /></label>
              <label className="block"><span className={labelClass}>Bedrooms</span><input type="number" className={inputClass} value={f.bedrooms} onChange={set("bedrooms")} /></label>
              <label className="block sm:col-span-2"><span className={labelClass}>Notes</span><textarea rows={2} className={`${inputClass} h-auto py-2`} value={f.notes} onChange={set("notes")} /></label>
              <label className="flex items-start gap-2 text-[14px] text-[#111827] sm:col-span-2"><input type="checkbox" className="mt-1" checked={f.consent} onChange={set("consent")} /><span>The person agreed to share these details with A R Buildwel.</span></label>
            </>}
            {type === "listing_assist" && <label className="block sm:col-span-2"><span className={labelClass}>Listing ID (from the owner's listing page)</span><input className={inputClass} value={f.listingId} onChange={set("listingId")} /></label>}
            {type === "condition_report" && <>
              {[["parking", "Parking"], ["amenities", "Amenities"], ["buildingCondition", "Building condition"], ["neighbourhood", "Neighbourhood"], ["accessRoad", "Access road"]].map(([k, l]) => <label key={k} className="block"><span className={labelClass}>{l}</span><input className={inputClass} value={f[k]} onChange={set(k)} /></label>)}
              <label className="block"><span className={labelClass}>Overall</span><select className={inputClass} value={f.overall} onChange={set("overall")}><option value="good">Good</option><option value="fair">Fair</option><option value="poor">Poor</option></select></label>
              <label className="block sm:col-span-2"><span className={labelClass}>Remarks</span><textarea rows={2} className={`${inputClass} h-auto py-2`} value={f.remarks} onChange={set("remarks")} /></label>
            </>}
            {type === "auction_check" && <>
              <label className="block"><span className={labelClass}>Possession</span><select className={inputClass} value={f.possession} onChange={set("possession")}><option value="">Choose</option><option value="occupied">Occupied</option><option value="vacant">Vacant</option><option value="unclear">Unclear</option></select></label>
              <label className="flex items-center gap-2 text-[14px] text-[#111827]"><input type="checkbox" checked={f.exists} onChange={set("exists")} /><span>The property exists at this location</span></label>
              <label className="block sm:col-span-2"><span className={labelClass}>How is it reached?</span><input className={inputClass} value={f.access} onChange={set("access")} /></label>
              <label className="block sm:col-span-2"><span className={labelClass}>Remarks</span><textarea rows={2} className={`${inputClass} h-auto py-2`} value={f.remarks} onChange={set("remarks")} /></label>
            </>}
            {minPhotos > 0 && (
              <label className="block sm:col-span-2"><span className={labelClass}>Photos (at least {minPhotos})</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="mt-1.5 block w-full text-[13px]" onChange={(e) => setPhotos([...e.target.files].slice(0, 12))} />
                <span className="mt-1 block text-[12px] text-[#6B7280]">{photos.length} chosen. Take them at the property with location switched on in your camera, and upload the original files within 24 hours - edited or forwarded copies lose their location and are refused.</span>
              </label>
            )}
          </div>
          <button type="button" disabled={busy || (needsGps && !gps) || photos.length < minPhotos} onClick={submit} className={`${primaryButton} mt-4`}>Submit</button>
        </Card>
      )}

      {a.state === "submitted" && a.waitingFor === "otp" && (
        <Card>
          <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Enter the OTP</h3>
          <p className="mt-1 text-[13px] text-[#6B7280]">Sent to the {partyWord}'s mobile ending <span data-no-translate>{a.partyPhoneLast4}</span>. It is valid for 10 minutes.</p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <input aria-label="OTP" className={`${inputClass} !w-40`} inputMode="numeric" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
            <button type="button" disabled={busy || otp.length < 4} onClick={confirm} className={primaryButton}>Confirm</button>
            <button type="button" disabled={busy} onClick={resend} className={linkButton}>Send a new OTP</button>
          </div>
        </Card>
      )}
      {a.state === "submitted" && a.waitingFor && a.waitingFor !== "otp" && <Notice tone="amber">{WAIT[a.waitingFor]}. You will be told as soon as it is decided.</Notice>}
      {a.verificationStatus === "passed" && <Notice tone="green">Verified. {money(a.paymentAmount)} has been added to your earnings.</Notice>}
      {a.verificationStatus === "failed" && <Notice tone="red">Not approved: {a.rejectionReason}</Notice>}
      {a.state === "forfeited" && <Notice tone="red">The time reserved for this task ran out, so it went back on the board.</Notice>}
    </div>
  );
}

function Board({ canAccept, blocker, onAccepted }) {
  const { accessToken } = useAuth();
  const [type, setType] = useState("");
  const board = useLoad((token) => apiRequest(`/wfh/board${type ? `?taskType=${type}` : ""}`, { token }).then((r) => r.data), [type]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const accept = async (id) => {
    setBusy(true);
    setError(null);
    try {
      onAccepted((await apiRequest(`/wfh/tasks/${id}/accept`, { method: "POST", token: accessToken })).data.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  const refreshLocation = async () => {
    setError(null);
    try {
      await apiRequest("/wfh/location", { method: "PUT", token: accessToken, body: await locate() });
      board.reload();
    } catch (err) {
      setError(err.message);
    }
  };
  if (board.loading || board.error) return <LoadState loading={board.loading} error={board.error} onRetry={board.reload} />;
  const d = board.data;
  return (
    <div className="space-y-4">
      {error && <Notice tone="red">{error}</Notice>}
      {blocker && <Notice tone="amber">{blocker}</Notice>}
      <div className="flex flex-wrap items-center gap-3">
        <select aria-label="Task type" className={`${inputClass} !mt-0 !h-10 !w-auto`} value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All task types</option><option value="buyer_visit">Buyer site visit</option><option value="seller_photo">Seller photo permission</option><option value="requirement_collect">Requirement collection</option><option value="listing_assist">Seller listing assist</option><option value="condition_report">Property condition report</option><option value="auction_check">Auction property field check</option><option value="area_survey">Area demand mini-survey</option>
        </select>
        <button type="button" className={linkButton} onClick={refreshLocation}>Update my location</button>
        <span className="ml-auto text-[12px] text-[#6B7280]">Within {d.radiusKm} km of you</span>
      </div>
      {d.items.length === 0 ? <EmptyState title="No tasks near you right now" body="New tasks appear as listings and buyer requirements come in for your area. Check back soon." /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {d.items.map((t) => (
            <Card key={t.id}>
              <div className="flex items-start justify-between gap-2"><p className="text-[15px] font-bold text-[#111827]">{t.taskTypeLabel}</p><span className="shrink-0 rounded-full bg-[#ECFDF5] px-2.5 py-0.5 text-[13px] font-bold text-[#047857]">{money(t.paymentAmount)}</span></div>
              <p className="mt-1 text-[13px] text-[#6B7280]" data-no-translate>{[t.locality, t.city].filter(Boolean).join(", ")}</p>
              <p className="mt-1 text-[12px] text-[#6B7280]">{t.distanceKm} km away · {timeLeft(t.expiryAt)}</p>
              <button type="button" disabled={busy || !canAccept} onClick={() => accept(t.id)} className={`${primaryButton} mt-3 !h-9`}>Accept</button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function MyTasks({ onOpen }) {
  const list = useLoad((token) => apiRequest("/wfh/assignments", { token }).then((r) => r.data));
  if (list.loading || list.error) return <LoadState loading={list.loading} error={list.error} onRetry={list.reload} />;
  if (!list.data.length) return <EmptyState title="No tasks yet" body="Accept a task from the board to get started." />;
  return (
    <Card className="!p-0">
      <ul className="divide-y divide-[#F3F4F6]">
        {list.data.map((a) => (
          <li key={a.id}>
            <button type="button" onClick={() => onOpen(a.id)} className="flex w-full flex-wrap items-center gap-3 p-4 text-left hover:bg-[#FAFAFA]">
              <span className="min-w-0 flex-1"><span className="block truncate text-[15px] font-semibold text-[#111827]" data-no-translate>{a.title}</span><span className="block text-[13px] text-[#6B7280]">{a.taskTypeLabel} · {money(a.paymentAmount)}</span></span>
              {a.state === "accepted" ? <Badge tone="amber">{timeLeft(a.lockExpiresAt)} · submit evidence</Badge> : a.verificationStatus === "passed" ? <Badge tone="green">Verified</Badge> : a.verificationStatus === "failed" ? <Badge tone="red">Not approved</Badge> : a.state === "forfeited" ? <Badge tone="gray">Ran out of time</Badge> : <Badge tone="blue">{WAIT[a.waitingFor] || "Submitted"}</Badge>}
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function Earnings() {
  const { accessToken } = useAuth();
  const state = useLoad((token) => apiRequest("/wfh/earnings", { token }).then((r) => r.data));
  if (state.loading || state.error) return <LoadState loading={state.loading} error={state.error} onRetry={state.reload} />;
  const { totals: t, ledger, payouts, minPayout } = state.data;
  const slip = async (id) => {
    const res = await fetch(`${API_BASE_URL}/wfh/payouts/${id}/slip`, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (res.ok) window.open(URL.createObjectURL(await res.blob()), "_blank", "noopener");
  };
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-5">
        {[["Earned in all", t.lifetime], ["This month", t.thisMonth], ["Pending verification", t.pendingVerification], ["Awaiting payout", t.awaitingPayout], ["Paid out", t.paidOut]].map(([l, v]) => (
          <Card key={l}><p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">{l}</p><p className="mt-1 font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold text-[#111827]">{money(v)}</p></Card>
        ))}
      </div>
      <p className="text-[12px] text-[#6B7280]">Verified earnings of {money(minPayout)} or more are paid by bank transfer on the 1st of each month. TDS is deducted where the law requires.</p>
      <Card>
        <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Task by task</h3>
        {ledger.length === 0 ? <p className="mt-2 text-[14px] text-[#6B7280]">No verified tasks yet.</p> : (
          <ul className="mt-2 divide-y divide-[#F3F4F6]">
            {ledger.map((e) => <li key={e.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[14px]"><span><span className="text-[#111827]">{e.taskTypeLabel}</span> <span className="text-[12px] text-[#6B7280]" data-no-translate>· {e.locality || ""} · {formatDate(e.date)}</span></span><span className="flex items-center gap-2"><b>{money(e.amount)}</b><Badge tone={e.status === "paid" ? "green" : "amber"}>{e.status === "paid" ? "Paid" : "Awaiting payout"}</Badge></span></li>)}
          </ul>
        )}
      </Card>
      <Card>
        <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Payout history</h3>
        {payouts.length === 0 ? <p className="mt-2 text-[14px] text-[#6B7280]">No payouts yet.</p> : (
          <ul className="mt-2 divide-y divide-[#F3F4F6]">
            {payouts.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-[14px]">
                <span className="text-[#111827]" data-no-translate>{p.payoutNumber}<span className="block text-[12px] text-[#6B7280]">{p.paidAt ? formatDate(p.paidAt) : "Being processed"} · a/c ••••{p.bankAccountLast4}{p.utr ? ` · UTR ${p.utr}` : ""}</span></span>
                <span className="text-right"><b>{money(p.net)}</b><span className="block text-[12px] text-[#6B7280]">TDS {money(p.tds)}</span><button type="button" className={linkButton} onClick={() => slip(p.id)}>Payout slip</button></span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}

function Performance({ p, worker }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-4">
        <Card><p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Completed this month</p><p className="mt-1 font-['Plus_Jakarta_Sans'] text-[22px] font-extrabold text-[#111827]">{p.completedThisMonth}</p></Card>
        <Card><p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Tasks completed of accepted</p><p className="mt-1 font-['Plus_Jakarta_Sans'] text-[22px] font-extrabold text-[#111827]">{p.completionRate === null ? "—" : `${p.completionRate}%`}</p></Card>
        <Card><p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Rejection rate</p><p className={`mt-1 font-['Plus_Jakarta_Sans'] text-[22px] font-extrabold ${p.rejectionWarning ? "text-[#B91C1C]" : "text-[#111827]"}`}>{p.rejectionRate}%</p>{p.rejectionWarning && <p className="text-[12px] text-[#B91C1C]">Above 30% - your account is under review</p>}</Card>
        <Card><p className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Weekly streak</p><p className="mt-1 font-['Plus_Jakarta_Sans'] text-[22px] font-extrabold text-[#111827]">{p.streakWeeks}</p></Card>
      </div>
      <Card>
        <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Areas you have covered</h3>
        {p.areas.length === 0 ? <p className="mt-2 text-[14px] text-[#6B7280]">Your verified tasks will be listed here by area.</p> : <div className="mt-3 flex flex-wrap gap-2">{p.areas.map((a) => <span key={a.area} className="rounded-full border border-[#E5E7EB] px-3 py-1 text-[13px] text-[#111827]" data-no-translate>{a.area} · {a.tasks}</span>)}</div>}
      </Card>
      <Card>
        <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Your details</h3>
        <p className="mt-2 text-[14px] text-[#4B5563]" data-no-translate>Aadhaar ••••{worker.aadhaarLast4} · Bank a/c ••••{worker.bankAccountLast4} · {worker.bankIfsc} · KYC {worker.kycStatus}</p>
        <p className="mt-1 text-[12px] text-[#6B7280]">You are paid for each verified task. A deal that later closes on a property or lead you brought does not carry a commission.</p>
      </Card>
    </div>
  );
}

export default function WorkFromHomeSection() {
  const me = useLoad((token) => apiRequest("/wfh/me", { token }).then((r) => r.data));
  const [tab, setTab] = useState("board");
  const [open, setOpen] = useState(null);
  if (me.loading || me.error) return <LoadState loading={me.loading} error={me.error} onRetry={me.reload} />;
  const d = me.data;
  if (!d.enabled) return <SectionHeader title={d.programLabel} subtitle="This programme is not open at the moment." />;
  if (open) return <TaskWork id={open} onBack={() => { setOpen(null); me.reload(); }} />;
  return (
    <div className="space-y-5">
      <SectionHeader title={d.programLabel} subtitle="Earn from your neighbourhood: a fixed amount for every field task that passes verification. No licence needed." />
      {!d.joined ? <JoinForm intro={d} onDone={me.reload} /> : (
        <>
          <div className="flex gap-1 overflow-x-auto rounded-[12px] bg-[#F3F4F6] p-1 sm:w-fit">
            {[["board", "Task board"], ["tasks", "My tasks"], ["earnings", "My earnings"], ["performance", "My performance"]].map(([k, l]) => <button type="button" key={k} onClick={() => setTab(k)} className={`shrink-0 rounded-[9px] px-4 py-1.5 text-[13px] font-bold ${tab === k ? "bg-white text-[#111827] shadow-sm" : "text-[#6B7280]"}`}>{l}</button>)}
          </div>
          {tab === "board" && <Board canAccept={!d.blocker} blocker={d.blocker} onAccepted={(id) => setOpen(id)} />}
          {tab === "tasks" && <MyTasks onOpen={setOpen} />}
          {tab === "earnings" && <Earnings />}
          {tab === "performance" && <Performance p={d.performance} worker={d.worker} />}
        </>
      )}
    </div>
  );
}
