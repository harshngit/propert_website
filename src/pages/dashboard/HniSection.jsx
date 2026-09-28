import React, { useState } from "react";
import { Link } from "react-router-dom";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import {
  Badge, CITY_SUGGESTIONS, Card, EmptyState, LoadState, Modal, Notice, SectionHeader, StatCard, formatDate, formatINR,
  inputClass, labelClass, linkButton, primaryButton, secondaryButton, useLoad,
} from "./ui";

// HNI Investments (Annexure A sec. 13.1 HNI dashboard): curated deal flow
// (special situation + auction + institutional) matched to the investor's
// profile, a portfolio tracker with ROI / yield / CAGR computed by the
// backend, allocation mix and the exit pipeline. Projections are
// indicative - not investment advice.

const ASSET_CLASSES = [
  ["residential", "Residential"], ["commercial", "Commercial"], ["institutional", "Institutional"], ["land", "Land"],
  ["special_situation", "Special situation"], ["auction", "Bank auction"], ["hospitality", "Hospitality"], ["other", "Other"],
];
const className = (v) => ASSET_CLASSES.find(([k]) => k === v)?.[1] || v;
const pct = (v) => (v == null ? "—" : `${Number(v).toFixed(1)}%`);

function Disclaimers({ items }) {
  if (!items?.length) return null;
  return (
    <div className="space-y-1">
      {items.map((d) => (
        <p key={d.key} className="text-[11px] leading-4 text-[#9CA3AF]" dangerouslySetInnerHTML={{ __html: d.content_html }} />
      ))}
    </div>
  );
}

function InvestmentForm({ investment, onSaved, onCancel }) {
  const { accessToken } = useAuth();
  const i = investment || {};
  const [f, setF] = useState({
    title: i.title || "", assetClass: i.asset_class || "residential", city: i.city || "",
    acquisitionDate: i.acquisition_date?.slice(0, 10) || "", acquisitionCost: i.acquisition_cost || "", additionalCosts: i.additional_costs || "",
    currentValuation: i.current_valuation || "", monthlyRentalIncome: i.monthly_rental_income || "", annualExpenses: i.annual_expenses || "",
    status: i.status || "active", targetExitDate: i.target_exit_date?.slice(0, 10) || "", targetExitValue: i.target_exit_value || "",
    exitDate: i.exit_date?.slice(0, 10) || "", exitValue: i.exit_value || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const num = (v) => (v === "" ? undefined : Number(v));
    const date = (v) => v || null;
    const body = {
      title: f.title, assetClass: f.assetClass, city: f.city || undefined, status: f.status,
      acquisitionDate: date(f.acquisitionDate), acquisitionCost: num(f.acquisitionCost), additionalCosts: num(f.additionalCosts),
      currentValuation: num(f.currentValuation) ?? null, monthlyRentalIncome: num(f.monthlyRentalIncome), annualExpenses: num(f.annualExpenses),
      targetExitDate: date(f.targetExitDate), targetExitValue: num(f.targetExitValue) ?? null,
      exitDate: f.status === "exited" ? date(f.exitDate) : null, exitValue: f.status === "exited" ? num(f.exitValue) ?? null : null,
    };
    try {
      if (investment) await portal.updateInvestment(accessToken, investment.id, body);
      else await portal.createInvestment(accessToken, body);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>Investment name *<input required value={f.title} onChange={set("title")} placeholder="e.g. Office floor, Cyber City" className={inputClass} /></label>
        <label className={labelClass}>Asset class<select value={f.assetClass} onChange={set("assetClass")} className={inputClass}>{ASSET_CLASSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <label className={labelClass}>City<input list="hni-cities" value={f.city} onChange={set("city")} className={inputClass} /></label>
        <datalist id="hni-cities">{CITY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}</datalist>
        <label className={labelClass}>Acquired on<input type="date" value={f.acquisitionDate} onChange={set("acquisitionDate")} className={inputClass} /></label>
        <label className={labelClass}>Acquisition cost (₹) *<input required type="number" min="0" value={f.acquisitionCost} onChange={set("acquisitionCost")} className={inputClass} /></label>
        <label className={labelClass}>Stamp duty, fees etc. (₹)<input type="number" min="0" value={f.additionalCosts} onChange={set("additionalCosts")} className={inputClass} /></label>
        <label className={labelClass}>Current valuation (₹)<input type="number" min="0" value={f.currentValuation} onChange={set("currentValuation")} className={inputClass} /></label>
        <label className={labelClass}>Monthly rental income (₹)<input type="number" min="0" value={f.monthlyRentalIncome} onChange={set("monthlyRentalIncome")} className={inputClass} /></label>
        <label className={labelClass}>Annual expenses (₹)<input type="number" min="0" value={f.annualExpenses} onChange={set("annualExpenses")} className={inputClass} /></label>
        <label className={labelClass}>Status<select value={f.status} onChange={set("status")} className={inputClass}><option value="active">Holding</option><option value="exit_planned">Exit planned</option><option value="exited">Exited</option></select></label>
        <label className={labelClass}>Target exit date<input type="date" value={f.targetExitDate} onChange={set("targetExitDate")} className={inputClass} /></label>
        <label className={labelClass}>Target exit value (₹)<input type="number" min="0" value={f.targetExitValue} onChange={set("targetExitValue")} className={inputClass} /></label>
        {f.status === "exited" && (
          <>
            <label className={labelClass}>Exit date<input type="date" value={f.exitDate} onChange={set("exitDate")} className={inputClass} /></label>
            <label className={labelClass}>Exit value (₹)<input type="number" min="0" value={f.exitValue} onChange={set("exitValue")} className={inputClass} /></label>
          </>
        )}
      </div>
      {error && <Notice tone="red">{error}</Notice>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={primaryButton}>{saving ? "Saving…" : "Save"}</button>
        <button type="button" onClick={onCancel} className={secondaryButton}>Cancel</button>
      </div>
    </form>
  );
}

function Allocation({ title, rows, label = (k) => k }) {
  if (!rows?.length) return null;
  return (
    <Card>
      <p className="text-[14px] font-bold text-[#111827]">{title}</p>
      <div className="mt-3 space-y-2">
        {rows.map((r) => (
          <div key={r.key}>
            <div className="flex justify-between text-[12px] text-[#374151]"><span className="capitalize">{label(r.key)}</span><span>{r.percent}% · {formatINR(r.value)}</span></div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#F3F4F6]"><div className="h-full rounded-full bg-[#E51C23]" style={{ width: `${r.percent}%` }} /></div>
          </div>
        ))}
      </div>
    </Card>
  );
}

function HniSection() {
  const { accessToken } = useAuth();
  const dash = useLoad((token) => portal.hniDashboard(token));
  const deals = useLoad((token) => portal.hniDeals(token));
  const portfolio = useLoad((token) => portal.hniPortfolio(token));
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState(null);

  const reloadAll = () => {
    dash.reload();
    portfolio.reload();
  };
  const toggleShortlist = async (deal) => {
    try {
      await portal.trackHniDeal(accessToken, deal.id, deal.is_shortlisted ? "unshortlisted" : "shortlisted");
      deals.reload();
      dash.reload();
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    }
  };

  if (dash.loading && !dash.data) return <LoadState loading />;
  if (dash.error) return <LoadState error={dash.error} onRetry={dash.reload} />;
  const d = dash.data;
  const t = d.portfolio?.totals || {};
  const items = portfolio.data?.items || [];
  const dealItems = deals.data?.items || [];

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="HNI Investments"
        subtitle="Curated special-situation, auction and institutional deals, and your whole portfolio with returns and exit planning."
        action={<Badge status={d.profile?.verificationStatus === "verified" ? "approved" : "pending"}>{d.profile?.verificationStatus === "verified" ? "Verified investor" : "Verification pending"}</Badge>}
      />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Invested" value={t.investedDisplay || formatINR(t.invested) || "₹0"} />
        <StatCard label="Current value" value={t.currentValueDisplay || formatINR(t.currentValue) || "₹0"} hint={t.unrealisedGainPercent != null ? `${t.unrealisedGainPercent > 0 ? "+" : ""}${pct(t.unrealisedGainPercent)} unrealised` : undefined} />
        <StatCard label="Net rental yield" value={pct(t.netYieldPercent)} hint={t.annualRentalIncome ? `${formatINR(t.annualRentalIncome)} / yr` : undefined} />
        <StatCard label="Shortlisted deals" value={d.shortlistCount ?? 0} hint={`${(d.activeInterests || []).length} active interest(s)`} />
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between">
          <p className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold text-[#111827]">Curated deals for you</p>
          <Link to="/buy/special-situation-properties" className="text-[13px] font-bold text-[#E51C23]">All opportunities →</Link>
        </div>
        {d.dealAccess && !d.dealAccess.full && <div className="mb-3"><Notice tone="amber">{d.dealAccess.reason || "Full deal details unlock once your investor profile is verified."}</Notice></div>}
        <LoadState loading={deals.loading && !deals.data} error={deals.error} onRetry={deals.reload} />
        {deals.data && !dealItems.length && <EmptyState title="No curated deals right now" body="We match deals to your ticket size, cities and asset classes - update your investor profile to widen the net." />}
        <div className="grid gap-3 md:grid-cols-2">
          {dealItems.map((deal) => (
            <Card key={deal.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link to={`/deals/${deal.id}`} className="block text-[15px] font-bold text-[#111827] hover:text-[#E51C23]">{deal.title}</Link>
                  <p className="mt-1 text-[13px] text-[#6B7280]">
                    {className(deal.listing_category)} · {[deal.locality, deal.city].filter(Boolean).join(", ")}
                  </p>
                  <p className="mt-1 text-[13px] text-[#374151]">
                    {deal.reserve_price_display || formatINR(deal.price_value) || deal.price}
                    {deal.discount_percent ? ` · ${Number(deal.discount_percent).toFixed(0)}% below market` : ""}
                    {deal.indicative_yield_percent ? ` · ~${pct(deal.indicative_yield_percent)} yield` : ""}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {deal.investment_score != null && <Badge tone="blue">Score {Math.round(deal.investment_score)}</Badge>}
                    {deal.liquidity_band && <Badge tone={deal.liquidity_band === "high" ? "green" : deal.liquidity_band === "low" ? "red" : "amber"}>{deal.liquidity_band} liquidity</Badge>}
                    {deal.auction_date && <Badge tone="gray">Auction {formatDate(deal.auction_date)}</Badge>}
                  </div>
                </div>
                <button type="button" onClick={() => toggleShortlist(deal)} className={`shrink-0 text-[13px] font-bold ${deal.is_shortlisted ? "text-[#E51C23]" : "text-[#6B7280] hover:text-[#E51C23]"}`}>
                  {deal.is_shortlisted ? "★ Shortlisted" : "☆ Shortlist"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-end justify-between">
          <p className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold text-[#111827]">Portfolio</p>
          <button type="button" onClick={() => setEditing({})} className={primaryButton}>Add investment</button>
        </div>
        {portfolio.data && !items.length && <EmptyState title="Track your real estate portfolio" body="Add what you own to see returns, yield, allocation and your exit pipeline in one place." />}
        {items.length > 0 && (
          <div className="overflow-x-auto rounded-[16px] border border-[#E5E7EB] bg-white">
            <table className="w-full min-w-[760px] text-left text-[14px]">
              <thead className="bg-[#F9FAFB] text-[12px] uppercase text-[#6B7280]">
                <tr><th className="px-4 py-2.5">Investment</th><th className="px-4 py-2.5">Cost</th><th className="px-4 py-2.5">Value</th><th className="px-4 py-2.5">Return</th><th className="px-4 py-2.5">CAGR</th><th className="px-4 py-2.5">Net yield</th><th className="px-4 py-2.5">Status</th><th className="px-4 py-2.5" /></tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {items.map((inv) => {
                  const m = inv.metrics || {};
                  return (
                    <tr key={inv.id}>
                      <td className="px-4 py-2.5"><p className="font-semibold text-[#111827]">{inv.title}</p><p className="text-[12px] text-[#6B7280]">{className(inv.asset_class)}{inv.city ? ` · ${inv.city}` : ""}</p></td>
                      <td className="px-4 py-2.5">{formatINR(m.total_cost) || "—"}</td>
                      <td className="px-4 py-2.5">{formatINR(m.current_value) || "—"}</td>
                      <td className={`px-4 py-2.5 font-semibold ${Number(m.absolute_return_percent) >= 0 ? "text-emerald-700" : "text-red-600"}`}>{pct(m.absolute_return_percent)}</td>
                      <td className="px-4 py-2.5">{pct(m.capital_cagr_percent)}</td>
                      <td className="px-4 py-2.5">{pct(m.net_rental_yield_percent)}</td>
                      <td className="px-4 py-2.5"><Badge status={inv.status === "exited" ? "closed" : inv.status === "exit_planned" ? "notice" : "active"}>{String(inv.status).replace(/_/g, " ")}</Badge></td>
                      <td className="whitespace-nowrap px-4 py-2.5 text-right">
                        <button type="button" onClick={() => setEditing(inv)} className={`${linkButton} mr-3`}>Edit</button>
                        <button type="button" onClick={() => window.confirm("Remove this investment?") && portal.deleteInvestment(accessToken, inv.id).then(reloadAll)} className={`${linkButton} text-[#6B7280]`}>Remove</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Allocation title="By asset class" rows={d.portfolio?.allocationByAssetClass} label={className} />
          <Allocation title="By city" rows={d.portfolio?.allocationByCity} />
          <Card>
            <p className="text-[14px] font-bold text-[#111827]">Exit pipeline</p>
            {(d.portfolio?.exitPipeline || []).length === 0 ? (
              <p className="mt-2 text-[13px] text-[#6B7280]">Set a target exit date on an investment to plan exits.</p>
            ) : (
              <ul className="mt-2 divide-y divide-[#F3F4F6]">
                {d.portfolio.exitPipeline.map((e) => (
                  <li key={e.id} className="py-2 text-[13px]">
                    <p className="font-semibold text-[#111827]">{e.title}</p>
                    <p className="text-[#6B7280]">{formatDate(e.targetExitDate)} · target {formatINR(e.targetExitValue) || "—"} · now {formatINR(e.currentValue) || "—"}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      )}

      <Disclaimers items={[...(d.disclaimers || []), ...(portfolio.data?.disclaimers || [])].filter((x, i, arr) => arr.findIndex((y) => y.key === x.key) === i)} />

      <Modal open={!!editing} title={editing?.id ? "Edit investment" : "Add investment"} onClose={() => setEditing(null)} width="max-w-[720px]">
        {editing && <InvestmentForm investment={editing.id ? editing : null} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); setNotice({ tone: "green", text: "Portfolio updated." }); reloadAll(); }} />}
      </Modal>
    </div>
  );
}

export default HniSection;
