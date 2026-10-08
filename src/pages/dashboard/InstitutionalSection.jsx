import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { institutional, formatCr } from "../../api/institutional";
import { useAuth } from "../../context/AuthContext";
import InstitutionalStageTracker from "../../components/InstitutionalStageTracker";
import { Badge, Card, EmptyState, LoadState, Notice, SectionHeader, formatDate, inputClass, labelClass, primaryButton, secondaryButton, useLoad } from "./ui";

// Institutional (Engine 7) in My Dashboard:
//   Buyer verification - buyer type, budget, geography, intent and proof of
//     financial capacity; A R Buildwel verifies it, which unlocks NDA signing.
//   My institutional deals - the nine-stage tracker, what is needed from
//     the buyer next, and term sheets / offers (offers open at stage 8).
//   My institutional listings - for sellers, with buyer interest.

const STATUS = { pending: ["amber", "Being verified"], qualified: ["green", "Verified buyer"], rejected: ["red", "Changes needed"] };

function BuyerProfile({ meta }) {
  const { accessToken } = useAuth();
  const profile = useLoad((t) => institutional.buyerProfile(t));
  const [f, setF] = useState(null);
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (profile.loading) return;
    const p = profile.data;
    setF({ buyerType: p?.buyerType || "trust", organisationName: p?.organisationName || "", budgetMinCr: p?.budgetMinCr ?? "", budgetMaxCr: p?.budgetMaxCr ?? "", geographies: (p?.geographies || []).join(", "), assetClasses: p?.assetClasses || [], intent: p?.intent || "", capacityNote: p?.capacityNote || "" });
    setEditing(!p);
  }, [profile.data, profile.loading]);
  if (!f) return <LoadState loading />;
  const p = profile.data;
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const toggle = (v) => setF((x) => ({ ...x, assetClasses: x.assetClasses.includes(v) ? x.assetClasses.filter((a) => a !== v) : [...x.assetClasses, v] }));
  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await institutional.saveBuyerProfile(accessToken, { ...f, geographies: f.geographies.split(",").map((s) => s.trim()).filter(Boolean) }, file);
      setMsg({ tone: "green", text: "Submitted. We will verify your profile and notify you." });
      setFile(null);
      setEditing(false);
      profile.reload();
    } catch (err) {
      setMsg({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  const [tone, text] = STATUS[p?.status] || ["gray", "Not submitted"];
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">Institutional buyer verification</p>
        <Badge tone={tone}>{text}</Badge>
      </div>
      <p className="mt-1 text-[13px] text-[#6B7280]">Verified buyers can sign the NDA on an institutional listing and request its data room.</p>
      {msg && <div className="mt-3"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      {p?.status === "rejected" && p.decisionNote && <div className="mt-3"><Notice tone="red">{p.decisionNote}</Notice></div>}
      {!editing && p ? (
        <div className="mt-3 text-[14px] text-[#374151]">
          <p><b>{p.buyerTypeLabel}</b>{p.organisationName ? ` · ${p.organisationName}` : ""}{p.budgetMaxCr ? ` · budget up to ${formatCr(p.budgetMaxCr)}` : ""}</p>
          <button type="button" className={`${secondaryButton} mt-3`} onClick={() => setEditing(true)}>Update profile</button>
        </div>
      ) : (
        <form onSubmit={save} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className={labelClass}>Buyer type<select id="ib-type" className={inputClass} value={f.buyerType} onChange={set("buyerType")}>{(meta?.buyerTypes || []).map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}</select></label>
          <label className={labelClass}>Organisation<input id="ib-org" className={inputClass} value={f.organisationName} onChange={set("organisationName")} /></label>
          <label className={labelClass}>Budget from (₹ Cr)<input id="ib-min" type="number" min="0" step="any" className={inputClass} value={f.budgetMinCr} onChange={set("budgetMinCr")} /></label>
          <label className={labelClass}>Budget up to (₹ Cr)<input id="ib-max" type="number" min="0" step="any" className={inputClass} value={f.budgetMaxCr} onChange={set("budgetMaxCr")} /></label>
          <label className={`${labelClass} sm:col-span-2`}>Cities / states you are looking in<input id="ib-geo" className={inputClass} placeholder="Delhi, Gurugram, Pan India" value={f.geographies} onChange={set("geographies")} /></label>
          <fieldset className="sm:col-span-2">
            <legend className={labelClass}>Asset types</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {(meta?.assetClasses || []).map((a) => (
                <button key={a.value} type="button" aria-pressed={f.assetClasses.includes(a.value)} onClick={() => toggle(a.value)} className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${f.assetClasses.includes(a.value) ? "border-[#E51C23] bg-[#FEF2F2] text-[#E51C23]" : "border-[#E5E7EB] bg-white text-[#4B5563]"}`}>{a.label}</button>
              ))}
            </div>
          </fieldset>
          <label className={`${labelClass} sm:col-span-2`}>What you intend to do<textarea id="ib-intent" rows={2} maxLength={1500} className={`${inputClass} h-auto py-2`} placeholder="e.g. acquire a running CBSE school of 1,000+ students" value={f.intent} onChange={set("intent")} /></label>
          <label className={`${labelClass} sm:col-span-2`}>Financial capacity<textarea id="ib-capacity" rows={2} maxLength={1500} className={`${inputClass} h-auto py-2`} placeholder="Source of funds, corpus or committed capital (no account numbers)" value={f.capacityNote} onChange={set("capacityNote")} /></label>
          <label className={`${labelClass} sm:col-span-2`}>Proof of funds (optional: banker's letter, net-worth certificate)<input id="ib-file" type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className={`${inputClass} py-2`} /></label>
          <div className="flex gap-2 sm:col-span-2">
            <button type="submit" disabled={busy} className={primaryButton}>{busy ? "Submitting…" : "Submit for verification"}</button>
            {p && <button type="button" className={secondaryButton} onClick={() => setEditing(false)}>Cancel</button>}
          </div>
        </form>
      )}
    </Card>
  );
}

const YOUR_ACTION = {
  complete_buyer_profile: "Complete your buyer verification above so you can sign the NDA.",
  sign_nda: "You are verified - open the listing and sign the NDA to request the data room.",
};

function DealCard({ deal, onChanged }) {
  const { accessToken } = useAuth();
  const [amount, setAmount] = useState("");
  const [terms, setTerms] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const canOffer = deal.status === "active" && deal.stage === "offer_negotiation";
  const offer = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await institutional.offer(accessToken, deal.id, { amountCr: Number(amount), terms: terms || undefined });
      setAmount("");
      setTerms("");
      setMsg({ tone: "green", text: "Offer sent to your representative." });
      onChanged();
    } catch (err) {
      setMsg({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <Link to={`/institutional/asset/${deal.propertyId}`} className="text-[16px] font-bold text-[#111827] hover:text-[#E51C23]">{deal.listing.title}</Link>
          <p className="text-[12px] text-[#6B7280]">{deal.dealNumber} · opened {formatDate(deal.createdAt)}</p>
        </div>
        <Badge tone={deal.status === "closed_won" ? "green" : deal.status === "dropped" ? "gray" : deal.status === "on_hold" ? "amber" : "blue"}>
          {deal.status === "active" ? `Stage ${deal.stageNumber} of 9` : deal.status.replace(/_/g, " ")}
        </Badge>
      </div>
      <div className="mt-3"><InstitutionalStageTracker deal={deal} compact /></div>
      <p className="mt-3 text-[13px] text-[#374151]">
        NDA: <b>{deal.nda.signed ? "signed" : "not signed"}</b> · data room: <b>{deal.nda.access.replace(/_/g, " ")}</b>
        {deal.representative ? <> · representative: <b>{deal.representative.name}</b>{deal.representative.platformNumber ? ` (${deal.representative.platformNumber})` : ""}</> : null}
      </p>
      {deal.yourAction && <div className="mt-3"><Notice tone="amber">{YOUR_ACTION[deal.yourAction]}</Notice></div>}
      {deal.status === "active" && !deal.yourAction && deal.nextLabel && (
        <p className="mt-2 text-[13px] text-[#6B7280]">Next: {deal.nextLabel} - {deal.nextRequirements.filter((r) => !r.met).map((r) => r.label).join("; ") || "in progress"}.</p>
      )}
      {deal.siteVisitAt && !deal.siteVisitDoneAt && <p className="mt-2 text-[13px] text-[#374151]">Campus visit: {formatDate(deal.siteVisitAt, true)}</p>}
      {deal.offers.length > 0 && (
        <ul className="mt-3 divide-y divide-[#F3F4F6] rounded-[12px] border border-[#E5E7EB] px-3">
          {deal.offers.map((o) => (
            <li key={o.id} className="flex flex-wrap items-center justify-between gap-2 py-2 text-[13px]">
              <span><b>{o.kind.replace(/_/g, " ")}</b> from {o.byParty === "buyer" ? "you" : o.byParty === "seller" ? "the seller" : "A R Buildwel"} · <b>{formatCr(o.amountCr)}</b>{o.terms ? ` · ${o.terms}` : ""}</span>
              <Badge tone={o.status === "accepted" ? "green" : o.status === "open" ? "amber" : "gray"}>{o.status}</Badge>
            </li>
          ))}
        </ul>
      )}
      {canOffer && (
        <form onSubmit={offer} className="mt-3 grid gap-2 sm:grid-cols-[160px_1fr_auto]">
          <input id={`offer-${deal.id}`} type="number" step="any" min="0" required placeholder="Your offer (₹ Cr)" aria-label="Your offer in crores" value={amount} onChange={(e) => setAmount(e.target.value)} className={`${inputClass} mt-0`} />
          <input placeholder="Key terms (optional)" aria-label="Key terms" value={terms} onChange={(e) => setTerms(e.target.value)} className={`${inputClass} mt-0`} />
          <button type="submit" disabled={busy || !(Number(amount) > 0)} className={primaryButton}>Send offer</button>
        </form>
      )}
      {msg && <div className="mt-2"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      {deal.status === "closed_won" && <p className="mt-3 text-[13px] font-semibold text-[#065F46]">Closed at {formatCr(deal.agreedValueCr)} · agreement {formatDate(deal.agreementDate)}</p>}
    </Card>
  );
}

function InstitutionalSection() {
  const [meta, setMeta] = useState(null);
  const deals = useLoad((t) => institutional.myDeals(t));
  const listings = useLoad((t) => institutional.myListings(t));
  useEffect(() => {
    institutional.meta().then(setMeta).catch(() => {});
  }, []);
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader
        title="Institutional"
        subtitle="Schools, colleges, hospitals, hotels and campuses - buy under NDA, or list your institution confidentially."
        action={<Link to="/buy/institutional-properties" className={secondaryButton}>Browse listings</Link>}
      />
      <BuyerProfile meta={meta} />

      <p className="mt-2 font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">My institutional deals</p>
      <LoadState loading={deals.loading && !deals.data} error={deals.error} onRetry={deals.reload} />
      {deals.data && !deals.data.length && <EmptyState title="No institutional deals yet" body="Express interest on an institutional listing and its progress through the nine stages appears here." />}
      {(deals.data || []).map((d) => <DealCard key={d.id} deal={d} onChanged={deals.reload} />)}

      <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
        <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">My institutional listings</p>
        <Link to="/post-institutional" className={primaryButton}>List an institution</Link>
      </div>
      <LoadState loading={listings.loading && !listings.data} error={listings.error} onRetry={listings.reload} />
      {listings.data && !listings.data.length && <EmptyState title="No listings" body="List a school, college, hospital, hotel or campus - the name stays confidential." />}
      {(listings.data || []).map((l) => (
        <Card key={l.id}>
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <Link to={`/institutional/asset/${l.id}`} className="text-[16px] font-bold text-[#111827] hover:text-[#E51C23]">{l.institutionName}</Link>
              <p className="text-[12px] text-[#6B7280]">Buyers see: “{l.summary}”</p>
            </div>
            <Badge tone={l.status === "approved" ? "green" : l.status === "pending_approval" ? "amber" : "gray"}>{l.status === "approved" ? "Live" : l.status === "pending_approval" ? "In review" : String(l.status).replace(/_/g, " ")}</Badge>
          </div>
          <p className="mt-2 text-[13px] text-[#374151]">{l.assetClassLabel} · {l.dealTypeLabel} · asking {formatCr(l.askingPriceCr)} · {l.interest.active} active buyer{l.interest.active === 1 ? "" : "s"} ({l.interest.total} in total)</p>
        </Card>
      ))}
      {meta && <p className="text-[11px] text-[#9CA3AF]">{meta.disclaimer}</p>}
    </div>
  );
}

export default InstitutionalSection;
