import React, { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import DealRoomPanel from "../components/DealRoomPanel";
import GuestInterestModal from "../components/GuestInterestModal";
import InstitutionalStageTracker from "../components/InstitutionalStageTracker";
import { institutional, formatCr } from "../api/institutional";
import { useAuth } from "../context/AuthContext";
import { applySeo, breadcrumbSchema } from "../lib/seo";
import { track } from "../lib/tracker";

// One institutional asset (Screen 9).
//   Public view   type, locality, ranges - never the institution's name.
//   The gate      verified buyer -> NDA signed on the platform -> admin
//                 approval. Each step shows where the visitor stands.
//   Private view  full details, valuation, due diligence, the
//                 representative, the data room and the deal's stage.

const Check = ({ ok }) => <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${ok ? "bg-[#ECFDF5] text-[#065F46]" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>{ok ? "✓" : "•"}</span>;

function Fact({ label, value }) {
  return (
    <div className="rounded-[12px] border border-[#E5E7EB] p-3">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.05em] text-[#9CA3AF]">{label}</dt>
      <dd className="mt-0.5 text-[15px] font-bold text-[#111827]">{value ?? "—"}</dd>
    </div>
  );
}

function InstitutionalAssetPage() {
  const { id } = useParams();
  const location = useLocation();
  const { accessToken, isAuthenticated, user } = useAuth();
  const [state, setState] = useState({ status: "loading" });
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [guest, setGuest] = useState(false);
  const [deal, setDeal] = useState(null);

  const load = useCallback(() => {
    institutional
      .listing(id, accessToken || undefined)
      .then((data) => {
        setState({ status: "ready", data });
        applySeo({
          title: `${data.listing.title} - Confidential Institutional Listing`,
          description: `${data.listing.summary}. Details are shared with verified buyers under NDA.`,
          path: `/institutional/asset/${id}`,
          jsonLd: [breadcrumbSchema([["Home", "/"], ["Institutional", "/buy/institutional-properties"], [data.listing.title, `/institutional/asset/${id}`]])],
        });
        if (data.myDeal && accessToken) institutional.deal(accessToken, data.myDeal.id).then(setDeal).catch(() => setDeal(null));
        else setDeal(null);
      })
      .catch((err) => setState({ status: "error", message: err.message }));
  }, [id, accessToken]);
  useEffect(() => {
    load();
  }, [load]);

  if (state.status === "loading") return <main className="min-h-screen bg-white"><SiteHeader /><p className="py-24 text-center text-[14px] text-[#6B7280]">Loading…</p></main>;
  if (state.status === "error") {
    return (
      <main className="min-h-screen bg-white"><SiteHeader />
        <div className="mx-auto max-w-[640px] px-4 py-24 text-center">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold text-[#111827]">This listing is not available</h1>
          <p className="mt-2 text-[14px] text-[#6B7280]">{state.message}</p>
          <Link to="/buy/institutional-properties" className="cta-red mt-6 inline-flex h-[44px] items-center rounded-[12px] px-5 text-[14px] font-bold text-white">Browse institutional listings</Link>
        </div>
      </main>
    );
  }

  const { listing: l, access, valuation: v, dueDiligence: dd, representative, myDeal, disclaimer } = state.data;
  const g = access.gates || {};
  const isBuyerView = access.full && access.as === "buyer";
  const customer = user?.role === "customer";

  const expressInterest = async () => {
    setBusy(true);
    try {
      const d = await institutional.interest(accessToken, id, note.trim());
      setDeal(d);
      track("lead_submitted", { channel: "institutional_interest", property_id: id });
      load();
    } catch (err) {
      setState((s) => ({ ...s, flash: err.message }));
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <GuestInterestModal open={guest} onClose={() => setGuest(false)} propertyId={id} subject={l.title} />
      <div className="mx-auto max-w-[1100px] px-4 py-8 sm:px-6">
        <nav className="text-[13px] text-[#6B7280]"><Link to="/buy/institutional-properties" className="hover:text-[#E51C23]">Institutional</Link> / {l.assetClassLabel}</nav>

        <header className="mt-3 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#E51C23]">{l.assetClassLabel} · {l.dealTypeLabel}</p>
            <h1 className="mt-1 font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-tight text-[#111827] sm:text-[34px]">{access.full ? l.institutionName : l.title}</h1>
            <p className="mt-1 text-[14px] text-[#6B7280]">{[l.locality, l.city].filter(Boolean).join(", ")}{l.boardAffiliation ? ` · ${l.boardAffiliation}` : ""}{access.full && l.yearEstablished ? ` · established ${l.yearEstablished}` : l.establishedDecade ? ` · established in the ${l.establishedDecade}` : ""}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[12px] font-bold ${access.full ? "bg-[#ECFDF5] text-[#065F46]" : "bg-[#F3F4F6] text-[#4B5563]"}`}>{access.full ? (access.as === "lister" ? "Your listing" : "Unlocked under NDA") : "Confidential listing"}</span>
        </header>

        {deal && (
          <section className="mt-6 rounded-[16px] border border-[#E5E7EB] p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">Your deal · {deal.dealNumber}</h2>
              <p className="text-[13px] text-[#6B7280]">Stage {deal.stageNumber} of 9 · {deal.stageLabel}{deal.status !== "active" ? ` · ${deal.status.replace(/_/g, " ")}` : ""}</p>
            </div>
            <div className="mt-3"><InstitutionalStageTracker deal={deal} /></div>
            {deal.representative && <p className="mt-3 text-[13px] text-[#374151]">Your representative: <b>{deal.representative.name}</b>{deal.representative.platformNumber ? ` · ${deal.representative.platformNumber}` : ""}</p>}
            {deal.siteVisitAt && !deal.siteVisitDoneAt && <p className="mt-1 text-[13px] text-[#374151]">Campus visit on {new Date(deal.siteVisitAt).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}.</p>}
            <Link to="/dashboard/institutional" className="mt-2 inline-block text-[13px] font-bold text-[#E51C23]">Open in my dashboard →</Link>
          </section>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="min-w-0 space-y-6">
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {access.full ? (
                <>
                  <Fact label="Asking price" value={formatCr(l.askingPriceCr)} />
                  <Fact label={l.studentEnrollment ? "Students" : l.capacityLabel || "Capacity"} value={(l.studentEnrollment || l.capacityUnits)?.toLocaleString("en-IN")} />
                  <Fact label="Faculty / staff" value={l.facultyCount?.toLocaleString("en-IN")} />
                  <Fact label="Campus" value={l.campusAreaAcres ? `${l.campusAreaAcres} acres` : null} />
                  <Fact label="Built-up" value={l.builtUpAreaSqft ? `${Number(l.builtUpAreaSqft).toLocaleString("en-IN")} sq ft` : null} />
                  <Fact label="Buildings" value={l.buildingCount} />
                  <Fact label="Annual revenue" value={formatCr(l.annualRevenueCr)} />
                  <Fact label="EBITDA" value={formatCr(l.ebitdaCr)} />
                  <Fact label="EBITDA multiple" value={l.ebitdaMultiple ? `${l.ebitdaMultiple}x` : null} />
                  <Fact label="NOC" value={l.nocStatus.replace(/_/g, " ")} />
                  <Fact label="Land" value={l.landOwnership.replace(/_/g, " ")} />
                  <Fact label="Address" value={l.address} />
                </>
              ) : (
                <>
                  <Fact label="Asking price" value={l.priceRange || "On request"} />
                  <Fact label={l.enrollmentRange ? "Students" : "Capacity"} value={l.enrollmentRange || l.capacityRange} />
                  <Fact label="Campus" value={l.campusRange} />
                  <Fact label="Transaction" value={l.dealTypeLabel} />
                  <Fact label="Land" value={l.landOwnership.replace(/_/g, " ")} />
                  <Fact label="Board / affiliation" value={l.boardAffiliation} />
                </>
              )}
            </dl>
            {access.full && <p className="text-[12px] text-[#9CA3AF]">Revenue, EBITDA and multiples are self-reported and indicative.</p>}

            {!access.full && (
              <div className="rounded-[16px] bg-[#F9FAFB] p-5 text-[14px] leading-6 text-[#4B5563]">
                The institution's name, exact figures, financials, valuation and documents are confidential. They are released to verified buyers who sign a confidentiality undertaking and are approved by A R Buildwel.
              </div>
            )}

            {access.full && l.infrastructure && <section><h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold text-[#111827]">Infrastructure</h2><p className="mt-1 text-[14px] leading-6 text-[#4B5563]">{l.infrastructure}</p></section>}
            {access.full && l.approvals?.length > 0 && (
              <section>
                <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold text-[#111827]">Regulatory approvals</h2>
                <ul className="mt-2 flex flex-wrap gap-2">{l.approvals.map((a) => <li key={a.name} className={`rounded-full px-3 py-1 text-[12px] font-bold ${a.status === "valid" ? "bg-[#ECFDF5] text-[#065F46]" : a.status === "expired" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}>{a.name} · {a.status.replace(/_/g, " ")}</li>)}</ul>
              </section>
            )}

            {access.full && v && (
              <section>
                <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold text-[#111827]">Valuation (indicative)</h2>
                <p className="mt-1 text-[14px] text-[#374151]">Indicative range <b>{v.indicativeRange ? `${formatCr(v.indicativeRange.lowCr)} – ${formatCr(v.indicativeRange.highCr)}` : "not available"}</b> against an asking price of {formatCr(v.askingPriceCr)}.</p>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Fact label="EBITDA-linked value" value={v.ebitdaLinked.valueCr ? `${formatCr(v.ebitdaLinked.valueCr)} (${v.ebitdaLinked.appliedMultiple}x)` : null} />
                  <Fact label="Asset-based value" value={formatCr(v.assetBased.valueCr)} />
                  <Fact label="Replacement cost" value={formatCr(v.replacementCost.valueCr)} />
                  <Fact label="Enrollment trend" value={v.enrollmentTrend.trend === "unknown" ? null : `${v.enrollmentTrend.trend}${v.enrollmentTrend.cagrPercent != null ? ` (${v.enrollmentTrend.cagrPercent}% a year)` : ""}`} />
                  <Fact label="Exit potential" value={`${v.exitPotential.score}/100 · ${v.exitPotential.band}`} />
                  <Fact label="Against comparables" value={v.benchmarking.verdict || (v.benchmarking.comparables ? "Comparable data limited" : "No comparables yet")} />
                </dl>
                <p className="mt-2 text-[12px] text-[#9CA3AF]">{v.basis}</p>
              </section>
            )}

            {access.full && dd && (
              <section>
                <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold text-[#111827]">Due diligence</h2>
                <p className="mt-1 text-[14px] text-[#374151]">{dd.checklist.length - dd.missingCount} of {dd.checklist.length} regulatory documents are in the data room.</p>
                <ul className="mt-2 grid gap-1 sm:grid-cols-2">{dd.checklist.map((c) => <li key={c.type} className={`text-[13px] ${c.present ? "text-[#065F46]" : "text-[#6B7280]"}`}>{c.present ? "✓" : "○"} {c.label}</li>)}</ul>
                <ul className="mt-3 space-y-1">{dd.review.map((r) => <li key={r.key} className="text-[13px] text-[#374151]"><b className={r.status === "ok" ? "text-[#065F46]" : r.status === "issue" ? "text-red-700" : "text-[#9CA3AF]"}>{r.status === "ok" ? "Checked" : r.status === "issue" ? "Issue raised" : "Pending"}</b> · {r.label}</li>)}</ul>
                {dd.riskFlags.length > 0 && (
                  <div className="mt-3 rounded-[12px] bg-[#FFFBEB] p-3 text-[13px] text-[#92400E]"><p className="font-bold">Points to review with your advisers</p><ul className="mt-1 list-disc pl-5">{dd.riskFlags.map((f, i) => <li key={i}>{f.detail}</li>)}</ul></div>
                )}
              </section>
            )}
          </div>

          <aside className="space-y-4">
            {!access.full && (
              <div className="rounded-[16px] border border-[#E5E7EB] p-5">
                <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">Unlock the full details</h2>
                <ol className="mt-3 space-y-3 text-[14px] text-[#374151]">
                  <li className="flex gap-3"><Check ok={g.signedIn} /><span>Sign in{!g.signedIn && <> · <Link to="/login" state={{ from: location }} className="font-bold text-[#E51C23]">Sign in</Link> or <Link to="/register" className="font-bold text-[#E51C23]">register</Link></>}</span></li>
                  <li className="flex gap-3"><Check ok={g.qualified} /><span>Be verified as an institutional buyer{g.signedIn && !g.qualified && customer && <> · <Link to="/dashboard/institutional" className="font-bold text-[#E51C23]">Complete buyer profile</Link></>}</span></li>
                  <li className="flex gap-3"><Check ok={g.ndaSigned} /><span>Sign the confidentiality undertaking (NDA)</span></li>
                  <li className="flex gap-3"><Check ok={g.approved} /><span>Approval by A R Buildwel{g.ndaSigned && !g.approved ? " · in review" : ""}</span></li>
                </ol>
              </div>
            )}

            {/* Stage 1 - intent */}
            {!myDeal && access.as !== "lister" && access.as !== "staff" && (
              <div className="rounded-[16px] border border-[#E5E7EB] p-5">
                <h2 className="font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">Interested in this asset?</h2>
                {isAuthenticated && customer ? (
                  <>
                    <textarea id="inst-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} maxLength={800} placeholder="Tell us about your group and what you are looking for (optional)" className="mt-3 w-full rounded-[10px] border border-[#E5E7EB] px-3 py-2 text-[14px] outline-none focus:border-[#E51C23]" />
                    <button type="button" disabled={busy} onClick={expressInterest} className="cta-red mt-2 h-[44px] w-full rounded-[10px] text-[14px] font-bold text-white disabled:opacity-60">{busy ? "Sending…" : "Express interest"}</button>
                  </>
                ) : isAuthenticated ? (
                  <p className="mt-2 text-[13px] text-[#6B7280]">Institutional interest is registered from a buyer account.</p>
                ) : (
                  <>
                    <p className="mt-2 text-[13px] text-[#6B7280]">A representative will call you in confidence. No account is needed to start.</p>
                    <button type="button" onClick={() => setGuest(true)} className="cta-red mt-3 h-[44px] w-full rounded-[10px] text-[14px] font-bold text-white">I'm interested</button>
                  </>
                )}
                {state.flash && <p className="mt-2 text-[13px] text-red-600">{state.flash}</p>}
                <p className="mt-2 text-[11px] text-[#9CA3AF]">You deal only with your A R Buildwel representative. The seller never receives your contact details.</p>
              </div>
            )}

            {representative && (
              <div className="rounded-[16px] border border-[#E5E7EB] p-5">
                <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Your representative</p>
                <p className="mt-1 text-[16px] font-bold text-[#111827]">{representative.name}</p>
                {representative.platformNumber && <p className="font-bold text-[#E51C23]">{representative.platformNumber}</p>}
              </div>
            )}

            {/* NDA + data room (the deal-room gates) */}
            {isAuthenticated && access.as !== "lister" && (g.qualified || access.full) && <DealRoomPanel dealId={id} onChanged={load} profileLink={{ to: "/dashboard/institutional", label: "Buyer profile" }} />}
          </aside>
        </div>

        <p className="mt-10 rounded-xl bg-[#F9FAFB] px-5 py-4 text-[12px] leading-5 text-[#6B7280]">{disclaimer}</p>
      </div>
      <CompanyFooterSection />
    </main>
  );
}

export default InstitutionalAssetPage;
