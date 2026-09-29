import React, { useState } from "react";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import {
  Badge, CITY_SUGGESTIONS, Card, EmptyState, LoadState, Modal, Notice, SectionHeader, StatCard, formatDate, formatINR,
  inputClass, labelClass, linkButton, monthLabel, primaryButton, secondaryButton, useLoad,
} from "./ui";

// NRI Services (Annexure A sec. 13.1 NRI dashboard): properties under
// management with rent ledger, service requests to the assigned manager,
// repatriation tracking against the FEMA US$1M limit, and indicative
// FEMA / TDS guidance. Figures are indicative - not tax advice.

const TABS = [
  { key: "properties", label: "My properties" },
  { key: "requests", label: "Service requests" },
  { key: "repatriation", label: "Repatriation" },
  { key: "guidance", label: "FEMA & TDS guide" },
];
const REQUEST_TYPES = [
  ["property_management", "Property management"], ["rent_collection", "Rent collection"], ["tenant_management", "Find / manage tenant"],
  ["maintenance", "Maintenance"], ["sell", "Sell a property"], ["buy", "Buy a property"], ["rent_out", "Rent out"],
  ["document_coordination", "Documents"], ["legal_guidance", "Legal guidance"], ["tax_guidance", "Tax guidance"],
  ["repatriation", "Repatriation"], ["other", "Other"],
];
const typeName = (v) => REQUEST_TYPES.find(([k]) => k === v)?.[1] || v;
const rupees = (v) => formatINR(v) || "₹0";

function Disclaimers({ items }) {
  if (!items?.length) return null;
  return (
    <div className="mt-4 space-y-1">
      {items.map((d) => (
        <p key={d.key} className="text-[11px] leading-4 text-[#9CA3AF]" dangerouslySetInnerHTML={{ __html: d.content_html }} />
      ))}
    </div>
  );
}

function PropertyForm({ property, onSaved, onCancel }) {
  const { accessToken } = useAuth();
  const [f, setF] = useState({
    title: property?.title || "", city: property?.city || "", locality: property?.locality || "",
    areaSqft: property?.area_sqft || "", purchasePrice: property?.purchase_price || "", purchaseDate: property?.purchase_date?.slice(0, 10) || "",
    currentEstimatedValue: property?.current_estimated_value || "", occupancyStatus: property?.occupancy_status || "vacant",
    managementStatus: property?.management_status || "self_managed", monthlyRentExpected: property?.monthly_rent_expected || "",
    tenantName: property?.tenant_name || "", tenantPhone: "", leaseStartDate: property?.lease_start_date?.slice(0, 10) || "", leaseEndDate: property?.lease_end_date?.slice(0, 10) || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    const num = (v) => (v === "" ? null : Number(v));
    const body = {
      ...f,
      areaSqft: num(f.areaSqft), purchasePrice: num(f.purchasePrice), currentEstimatedValue: num(f.currentEstimatedValue),
      monthlyRentExpected: num(f.monthlyRentExpected), purchaseDate: f.purchaseDate || null, leaseStartDate: f.leaseStartDate || null,
      leaseEndDate: f.leaseEndDate || null, tenantPhone: f.tenantPhone ? f.tenantPhone.replace(/\D/g, "").slice(-10) : undefined,
      tenantName: f.tenantName || undefined, locality: f.locality || undefined,
    };
    try {
      if (property) await portal.updateNriProperty(accessToken, property.id, body);
      else await portal.createNriProperty(accessToken, body);
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
        <label className={`${labelClass} sm:col-span-2`}>Property name *<input required value={f.title} onChange={set("title")} placeholder="e.g. 3 BHK, Palm Heights" className={inputClass} /></label>
        <label className={labelClass}>City *<input required list="nri-cities" value={f.city} onChange={set("city")} className={inputClass} /></label>
        <datalist id="nri-cities">{CITY_SUGGESTIONS.map((c) => <option key={c} value={c} />)}</datalist>
        <label className={labelClass}>Locality<input value={f.locality} onChange={set("locality")} className={inputClass} /></label>
        <label className={labelClass}>Area (sq.ft)<input type="number" min="0" value={f.areaSqft} onChange={set("areaSqft")} className={inputClass} /></label>
        <label className={labelClass}>Purchase price (₹)<input type="number" min="0" value={f.purchasePrice} onChange={set("purchasePrice")} className={inputClass} /></label>
        <label className={labelClass}>Purchase date<input type="date" value={f.purchaseDate} onChange={set("purchaseDate")} className={inputClass} /></label>
        <label className={labelClass}>Current value (₹, estimate)<input type="number" min="0" value={f.currentEstimatedValue} onChange={set("currentEstimatedValue")} className={inputClass} /></label>
        <label className={labelClass}>Occupancy
          <select value={f.occupancyStatus} onChange={set("occupancyStatus")} className={inputClass}>
            <option value="vacant">Vacant</option><option value="tenant_occupied">Rented out</option><option value="owner_occupied">Family / self</option><option value="under_maintenance">Under maintenance</option>
          </select>
        </label>
        <label className={labelClass}>Management
          <select value={f.managementStatus} onChange={set("managementStatus")} className={inputClass}>
            <option value="self_managed">I manage it</option><option value="management_requested">Want A R Buildwel to manage</option><option value="platform_managed">Managed by A R Buildwel</option>
          </select>
        </label>
        <label className={labelClass}>Expected monthly rent (₹)<input type="number" min="0" value={f.monthlyRentExpected} onChange={set("monthlyRentExpected")} className={inputClass} /></label>
        <label className={labelClass}>Tenant name<input value={f.tenantName} onChange={set("tenantName")} className={inputClass} /></label>
        <label className={labelClass}>Tenant mobile{property?.tenant_phone_masked ? ` (saved: ${property.tenant_phone_masked})` : ""}<input type="tel" value={f.tenantPhone} onChange={set("tenantPhone")} className={inputClass} /></label>
        <label className={labelClass}>Lease start<input type="date" value={f.leaseStartDate} onChange={set("leaseStartDate")} className={inputClass} /></label>
        <label className={labelClass}>Lease end<input type="date" value={f.leaseEndDate} onChange={set("leaseEndDate")} className={inputClass} /></label>
      </div>
      {error && <Notice tone="red">{error}</Notice>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={primaryButton}>{saving ? "Saving…" : "Save"}</button>
        <button type="button" onClick={onCancel} className={secondaryButton}>Cancel</button>
      </div>
    </form>
  );
}

function RentLedger({ property }) {
  const { accessToken } = useAuth();
  const { data, loading, error, reload } = useLoad((token) => portal.nriRent(token, property.id), [property.id]);
  const [form, setForm] = useState({ periodMonth: new Date().toISOString().slice(0, 7), rentDue: property.monthly_rent_expected || "", rentReceived: "", tdsDeducted: "", receivedOn: "" });
  const [msg, setMsg] = useState(null);
  const rows = Array.isArray(data) ? data : data?.items || [];
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const add = async (event) => {
    event.preventDefault();
    setMsg(null);
    try {
      const num = (v) => (v === "" ? undefined : Number(v));
      await portal.addNriRent(accessToken, property.id, {
        periodMonth: `${form.periodMonth}-01`, rentDue: num(form.rentDue), rentReceived: num(form.rentReceived), tdsDeducted: num(form.tdsDeducted), receivedOn: form.receivedOn || undefined,
      });
      setMsg({ tone: "green", text: "Rent recorded." });
      reload();
    } catch (err) {
      setMsg({ tone: "red", text: err.message });
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={add} className="grid gap-3 rounded-[14px] bg-[#F9FAFB] p-4 sm:grid-cols-5 sm:items-end">
        <label className={labelClass}>Month<input type="month" required value={form.periodMonth} onChange={set("periodMonth")} className={inputClass} /></label>
        <label className={labelClass}>Due (₹)<input type="number" min="0" value={form.rentDue} onChange={set("rentDue")} className={inputClass} /></label>
        <label className={labelClass}>Received (₹)<input type="number" min="0" value={form.rentReceived} onChange={set("rentReceived")} className={inputClass} /></label>
        <label className={labelClass}>TDS (₹)<input type="number" min="0" value={form.tdsDeducted} onChange={set("tdsDeducted")} className={inputClass} /></label>
        <button type="submit" className={primaryButton}>Record</button>
      </form>
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      <LoadState loading={loading} error={error} onRetry={reload} />
      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-[14px] border border-[#E5E7EB]">
          <table className="w-full min-w-[520px] text-left text-[14px]">
            <thead className="bg-[#F9FAFB] text-[12px] uppercase text-[#6B7280]"><tr><th className="px-4 py-2">Month</th><th className="px-4 py-2">Due</th><th className="px-4 py-2">Received</th><th className="px-4 py-2">TDS</th><th className="px-4 py-2">Status</th></tr></thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {rows.map((r) => (
                <tr key={r.id}><td className="px-4 py-2">{monthLabel(r.period_month)}</td><td className="px-4 py-2">{rupees(r.rent_due)}</td><td className="px-4 py-2">{rupees(r.rent_received)}</td><td className="px-4 py-2">{rupees(r.tds_deducted)}</td><td className="px-4 py-2"><Badge status={{ received: "confirmed", partial: "reported", overdue: "disputed", waived: "cancelled" }[r.status] || "due"}>{r.status}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PropertiesTab({ onChange }) {
  const { accessToken } = useAuth();
  const { data, loading, error, reload } = useLoad((token) => portal.nriProperties(token));
  const [editing, setEditing] = useState(null);
  const [ledgerFor, setLedgerFor] = useState(null);
  const rows = data || [];
  const refresh = () => { reload(); onChange(); };
  return (
    <div>
      <div className="mb-4 flex justify-end"><button type="button" onClick={() => setEditing({})} className={primaryButton}>Add property</button></div>
      <LoadState loading={loading} error={error} onRetry={reload} />
      {data && !rows.length && <EmptyState title="No properties yet" body="Add the properties you own in India - we'll track rent, tenants and paperwork, and can manage them for you." />}
      <div className="flex flex-col gap-3">
        {rows.map((p) => (
          <Card key={p.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[16px] font-bold text-[#111827]">{p.title}</p>
                  <Badge tone={p.occupancy_status === "tenant_occupied" ? "green" : "gray"}>{String(p.occupancy_status).replace(/_/g, " ")}</Badge>
                  {p.management_status !== "self_managed" && <Badge tone="blue">{String(p.management_status).replace(/_/g, " ")}</Badge>}
                </div>
                <p className="mt-1 text-[13px] text-[#6B7280]">
                  {[p.locality, p.city].filter(Boolean).join(", ")}
                  {p.current_estimated_value ? ` · Value ${rupees(p.current_estimated_value)}` : ""}
                  {p.monthly_rent_expected ? ` · Rent ${rupees(p.monthly_rent_expected)}/mo` : ""}
                </p>
                <p className="mt-1 text-[12px] text-[#6B7280]">
                  {p.tenant_name ? `Tenant: ${p.tenant_name}${p.tenant_phone_masked ? ` (${p.tenant_phone_masked})` : ""}` : "No tenant"}
                  {p.lease_end_date ? ` · Lease ends ${formatDate(p.lease_end_date)}` : ""}
                  {Number(p.rent_outstanding) > 0 ? ` · Outstanding ${rupees(p.rent_outstanding)}` : ""}
                  {Number(p.open_requests) > 0 ? ` · ${p.open_requests} open request(s)` : ""}
                </p>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setLedgerFor(p)} className={linkButton}>Rent ledger</button>
                <button type="button" onClick={() => setEditing(p)} className={linkButton}>Edit</button>
                <button type="button" onClick={() => window.confirm("Remove this property?") && portal.deleteNriProperty(accessToken, p.id).then(refresh)} className={`${linkButton} text-[#6B7280]`}>Remove</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Modal open={!!editing} title={editing?.id ? "Edit property" : "Add property"} onClose={() => setEditing(null)} width="max-w-[720px]">
        {editing && <PropertyForm property={editing.id ? editing : null} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); refresh(); }} />}
      </Modal>
      <Modal open={!!ledgerFor} title={ledgerFor ? `Rent - ${ledgerFor.title}` : ""} onClose={() => { setLedgerFor(null); refresh(); }} width="max-w-[760px]">
        {ledgerFor && <RentLedger property={ledgerFor} />}
      </Modal>
    </div>
  );
}

function RequestsTab({ onChange }) {
  const { accessToken } = useAuth();
  const { data, loading, error, reload } = useLoad((token) => portal.nriRequests(token));
  const { data: properties } = useLoad((token) => portal.nriProperties(token));
  const [creating, setCreating] = useState(false);
  const [openId, setOpenId] = useState(null);
  const [form, setForm] = useState({ requestType: "property_management", title: "", description: "", priority: "medium", nriPropertyId: "" });
  const [msg, setMsg] = useState(null);
  const rows = data?.items || [];
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const create = async (event) => {
    event.preventDefault();
    setMsg(null);
    try {
      await portal.createNriRequest(accessToken, { ...form, nriPropertyId: form.nriPropertyId || null, description: form.description || undefined });
      setCreating(false);
      setForm((f) => ({ ...f, title: "", description: "" }));
      setMsg({ tone: "green", text: "Request sent to your relationship manager." });
      reload();
      onChange();
    } catch (err) {
      setMsg({ tone: "red", text: err.message });
    }
  };

  return (
    <div>
      <div className="mb-4 flex justify-end"><button type="button" onClick={() => setCreating(true)} className={primaryButton}>New request</button></div>
      {msg && <div className="mb-3"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      <LoadState loading={loading} error={error} onRetry={reload} />
      {data && !rows.length && <EmptyState title="No service requests" body="Ask us to manage a property, collect rent, find a tenant, sort documents or plan a repatriation." />}
      <div className="flex flex-col gap-3">
        {rows.map((r) => (
          <Card key={r.id}>
            <button type="button" onClick={() => setOpenId(r.id)} className="flex w-full flex-wrap items-start justify-between gap-3 text-left">
              <div className="min-w-0">
                <p className="text-[15px] font-bold text-[#111827]">{r.title}</p>
                <p className="mt-1 text-[13px] text-[#6B7280]">
                  {typeName(r.request_type)}{r.property_title ? ` · ${r.property_title}` : ""} · raised {formatDate(r.created_at)}
                  {r.assigned_manager_name ? ` · ${r.assigned_manager_name}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {r.sla_breached && <Badge tone="red">Overdue</Badge>}
                <Badge status={r.status === "completed" ? "completed" : r.status === "cancelled" ? "cancelled" : "in_progress"}>{String(r.status).replace(/_/g, " ")}</Badge>
              </div>
            </button>
          </Card>
        ))}
      </div>
      <Modal open={creating} title="New service request" onClose={() => setCreating(false)}>
        <form onSubmit={create} className="flex flex-col gap-4">
          <label className={labelClass}>What do you need?<select value={form.requestType} onChange={set("requestType")} className={inputClass}>{REQUEST_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
          <label className={labelClass}>Property<select value={form.nriPropertyId} onChange={set("nriPropertyId")} className={inputClass}><option value="">Not about a specific property</option>{(properties || []).map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select></label>
          <label className={labelClass}>Title *<input required value={form.title} onChange={set("title")} className={inputClass} /></label>
          <label className={labelClass}>Details<textarea rows={3} value={form.description} onChange={set("description")} className={`${inputClass} h-auto py-2`} /></label>
          <label className={labelClass}>Priority<select value={form.priority} onChange={set("priority")} className={inputClass}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
          <div className="flex gap-2"><button type="submit" className={primaryButton}>Send request</button><button type="button" onClick={() => setCreating(false)} className={secondaryButton}>Cancel</button></div>
        </form>
      </Modal>
      <Modal open={!!openId} title="Service request" onClose={() => { setOpenId(null); reload(); }} width="max-w-[640px]">
        {openId && <RequestThread id={openId} />}
      </Modal>
    </div>
  );
}

function RequestThread({ id }) {
  const { accessToken } = useAuth();
  const { data: r, loading, error, reload } = useLoad((token) => portal.nriRequest(token, id), [id]);
  const [text, setText] = useState("");
  if (loading || error) return <LoadState loading={loading} error={error} onRetry={reload} />;
  const timeline = r.timeline || [];
  const closed = ["completed", "cancelled"].includes(r.status);
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[16px] font-bold text-[#111827]">{r.title}</p>
        <p className="text-[13px] text-[#6B7280]">{typeName(r.request_type)} · {String(r.status).replace(/_/g, " ")}{r.sla_due_at ? ` · response due ${formatDate(r.sla_due_at, true)}` : ""}</p>
        {r.description && <p className="mt-2 text-[14px] text-[#374151]">{r.description}</p>}
      </div>
      <div className="max-h-72 space-y-2 overflow-y-auto">
        {timeline.length === 0 && <p className="text-[13px] text-[#6B7280]">No updates yet - your relationship manager will respond soon.</p>}
        {timeline.map((u) => (
          <div key={u.id} className={`rounded-[12px] px-3 py-2 text-[13px] ${u.author_id === r.investor_user_id ? "ml-8 bg-[#FEF2F2]" : "mr-8 bg-[#F3F4F6]"}`}>
            <p className="text-[#111827]">{u.message || (u.to_status ? `Status: ${String(u.to_status).replace(/_/g, " ")}` : "")}</p>
            <p className="mt-0.5 text-[11px] text-[#9CA3AF]">{u.author_name || ""} · {formatDate(u.created_at, true)}</p>
          </div>
        ))}
      </div>
      {!closed && (
        <form
          onSubmit={async (e) => { e.preventDefault(); if (!text.trim()) return; await portal.addNriRequestUpdate(accessToken, id, text.trim()); setText(""); reload(); }}
          className="flex gap-2"
        >
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Add a message for your manager" className={inputClass} />
          <button type="submit" className={primaryButton}>Send</button>
        </form>
      )}
      {!closed && (
        <button type="button" onClick={async () => { await portal.cancelNriRequest(accessToken, id); reload(); }} className={`${linkButton} self-start text-[#6B7280]`}>Cancel request</button>
      )}
    </div>
  );
}

function RepatriationTab({ onChange }) {
  const { accessToken } = useAuth();
  const { data, loading, error, reload } = useLoad((token) => portal.repatriation(token));
  const [form, setForm] = useState({ source: "rental_income", amountInr: "", amountUsdEquivalent: "", status: "planned" });
  const [msg, setMsg] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const add = async (event) => {
    event.preventDefault();
    setMsg(null);
    try {
      await portal.addRepatriation(accessToken, { source: form.source, amountInr: Number(form.amountInr), amountUsdEquivalent: form.amountUsdEquivalent ? Number(form.amountUsdEquivalent) : undefined, status: form.status });
      setForm((f) => ({ ...f, amountInr: "", amountUsdEquivalent: "" }));
      setMsg({ tone: "green", text: "Recorded." });
      reload();
      onChange();
    } catch (err) {
      setMsg({ tone: "red", text: err.message });
    }
  };
  if (loading || error) return <LoadState loading={loading} error={error} onRetry={reload} />;
  const s = data.summary || {};
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <p className="text-[14px] font-bold text-[#111827]">FY {s.financialYear} - US$ {Number(s.completedUsd || 0).toLocaleString("en-IN")} of US$ {Number(s.annualLimitUsd || 0).toLocaleString("en-IN")} used</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F3F4F6]"><div className="h-full rounded-full bg-[#E51C23]" style={{ width: `${Math.min(100, s.utilisationPercent || 0)}%` }} /></div>
        <p className="mt-2 text-[12px] text-[#6B7280]">In process: US$ {Number(s.pipelineUsd || 0).toLocaleString("en-IN")} · Remaining: US$ {Number(s.remainingUsd || 0).toLocaleString("en-IN")}</p>
      </Card>
      <form onSubmit={add} className="grid gap-3 rounded-[14px] bg-[#F9FAFB] p-4 sm:grid-cols-5 sm:items-end">
        <label className={labelClass}>Source<select value={form.source} onChange={set("source")} className={inputClass}><option value="rental_income">Rental income</option><option value="sale_proceeds">Sale proceeds</option><option value="other">Other</option></select></label>
        <label className={labelClass}>Amount (₹)<input required type="number" min="0" value={form.amountInr} onChange={set("amountInr")} className={inputClass} /></label>
        <label className={labelClass}>US$ equivalent<input type="number" min="0" value={form.amountUsdEquivalent} onChange={set("amountUsdEquivalent")} className={inputClass} /></label>
        <label className={labelClass}>Status<select value={form.status} onChange={set("status")} className={inputClass}><option value="planned">Planned</option><option value="in_process">In process</option><option value="completed">Completed</option></select></label>
        <button type="submit" className={primaryButton}>Add</button>
      </form>
      {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
      {(data.items || []).length > 0 && (
        <div className="overflow-x-auto rounded-[14px] border border-[#E5E7EB]">
          <table className="w-full min-w-[520px] text-left text-[14px]">
            <thead className="bg-[#F9FAFB] text-[12px] uppercase text-[#6B7280]"><tr><th className="px-4 py-2">Source</th><th className="px-4 py-2">Amount</th><th className="px-4 py-2">US$</th><th className="px-4 py-2">15CA/CB</th><th className="px-4 py-2">Status</th></tr></thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {data.items.map((r) => (
                <tr key={r.id}><td className="px-4 py-2 capitalize">{String(r.source).replace(/_/g, " ")}</td><td className="px-4 py-2">{rupees(r.amount_inr)}</td><td className="px-4 py-2">{r.amount_usd_equivalent ? Number(r.amount_usd_equivalent).toLocaleString("en-IN") : "—"}</td><td className="px-4 py-2 capitalize">{String(r.form_15ca_cb_status || "—").replace(/_/g, " ")}</td><td className="px-4 py-2"><Badge status={r.status === "completed" ? "completed" : r.status === "cancelled" ? "cancelled" : "scheduled"}>{String(r.status).replace(/_/g, " ")}</Badge></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Disclaimers items={data.disclaimers} />
    </div>
  );
}

function GuidanceTab() {
  const fema = useLoad(() => portal.femaGuidance());
  const [sale, setSale] = useState({ salePrice: "", purchasePrice: "", holdingMonths: "" });
  const [saleResult, setSaleResult] = useState(null);
  const [rent, setRent] = useState("");
  const [rentResult, setRentResult] = useState(null);
  const [error, setError] = useState(null);
  const run = async (fn, setter) => {
    setError(null);
    try { setter(await fn()); } catch (err) { setError(err.message); }
  };
  return (
    <div className="flex flex-col gap-5">
      <Card>
        <p className="text-[15px] font-bold text-[#111827]">FEMA essentials for NRIs</p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-[14px] text-[#374151]">{(fema.data?.points || []).map((p) => <li key={p}>{p}</li>)}</ul>
        <Disclaimers items={fema.data?.disclaimers} />
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <p className="text-[15px] font-bold text-[#111827]">TDS when you sell</p>
          <form onSubmit={(e) => { e.preventDefault(); run(() => portal.tdsOnSale({ salePrice: Number(sale.salePrice), purchasePrice: Number(sale.purchasePrice), holdingMonths: sale.holdingMonths ? Number(sale.holdingMonths) : undefined }), setSaleResult); }} className="mt-3 grid gap-3 sm:grid-cols-3">
            <label className={labelClass}>Sale price (₹)<input required type="number" min="0" value={sale.salePrice} onChange={(e) => setSale((s) => ({ ...s, salePrice: e.target.value }))} className={inputClass} /></label>
            <label className={labelClass}>Purchase price (₹)<input required type="number" min="0" value={sale.purchasePrice} onChange={(e) => setSale((s) => ({ ...s, purchasePrice: e.target.value }))} className={inputClass} /></label>
            <label className={labelClass}>Held (months)<input type="number" min="0" value={sale.holdingMonths} onChange={(e) => setSale((s) => ({ ...s, holdingMonths: e.target.value }))} className={inputClass} /></label>
            <button type="submit" className={`${primaryButton} sm:col-span-3`}>Calculate</button>
          </form>
          {saleResult && (
            <div className="mt-3 text-[14px] text-[#374151]">
              <p>{saleResult.gainType === "long_term" ? "Long-term" : "Short-term"} gain: <b>{rupees(saleResult.capitalGain)}</b></p>
              <p>TDS on the gain (with a lower-deduction certificate): <b>{rupees(saleResult.tdsOnCapitalGain?.total)}</b></p>
              <p>TDS on the full price (without one): <b>{rupees(saleResult.tdsOnFullConsideration?.total)}</b></p>
              <ul className="mt-2 list-disc pl-5 text-[12px] text-[#6B7280]">{(saleResult.notes || []).map((n) => <li key={n}>{n}</li>)}</ul>
              <Disclaimers items={saleResult.disclaimers} />
            </div>
          )}
        </Card>
        <Card>
          <p className="text-[15px] font-bold text-[#111827]">TDS on your rental income</p>
          <form onSubmit={(e) => { e.preventDefault(); run(() => portal.rentTds({ monthlyRent: Number(rent) }), setRentResult); }} className="mt-3 flex gap-3">
            <input required type="number" min="0" value={rent} onChange={(e) => setRent(e.target.value)} placeholder="Monthly rent (₹)" className={inputClass} />
            <button type="submit" className={primaryButton}>Calculate</button>
          </form>
          {rentResult && (
            <div className="mt-3 text-[14px] text-[#374151]">
              <p>Tenant deducts <b>{rupees(rentResult.monthlyTds)}</b>/month ({rentResult.effectiveRatePercent}%) - you receive <b>{rupees(rentResult.netMonthlyRent)}</b>.</p>
              <p>Annual TDS: <b>{rupees(rentResult.annualTds)}</b></p>
              <Disclaimers items={rentResult.disclaimers} />
            </div>
          )}
        </Card>
      </div>
      {error && <Notice tone="red">{error}</Notice>}
    </div>
  );
}

function NriSection() {
  const { data, loading, error, reload } = useLoad((token) => portal.nriDashboard(token));
  const [tab, setTab] = useState("properties");
  if (loading && !data) return <LoadState loading />;
  if (error) return <LoadState error={error} onRetry={reload} />;
  const d = data;
  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="NRI Services"
        subtitle="Your properties in India, managed remotely - rent, tenants, paperwork and repatriation, with a dedicated relationship manager."
        action={<Badge status={d.profile?.verificationStatus === "verified" ? "approved" : "pending"}>{d.profile?.verificationStatus === "verified" ? "Verified investor" : "Verification pending"}</Badge>}
      />
      {d.assignedManager ? (
        <Notice>Your relationship manager: <b>{d.assignedManager.name || d.assignedManager.full_name}</b></Notice>
      ) : (
        <Notice tone="amber">Your relationship manager is being assigned - we'll introduce them here shortly.</Notice>
      )}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Properties" value={d.portfolio?.properties} hint={`${d.portfolio?.tenant_occupied || 0} rented · ${d.portfolio?.vacant || 0} vacant`} onClick={() => setTab("properties")} />
        <StatCard label="Current value" value={formatINR(d.portfolio?.total_current_value) || "—"} />
        <StatCard label={`Rent collected FY ${d.rent?.financialYear || ""}`} value={formatINR(d.rent?.collected_this_fy) || "₹0"} hint={Number(d.rent?.outstanding) > 0 ? `${rupees(d.rent.outstanding)} outstanding` : undefined} />
        <StatCard label="Open requests" value={d.serviceRequests?.open ?? 0} hint={d.serviceRequests?.slaBreached ? `${d.serviceRequests.slaBreached} overdue` : undefined} onClick={() => setTab("requests")} />
      </div>
      <div className="scrollbar-hide flex gap-2 overflow-x-auto">
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} className={`shrink-0 rounded-full px-4 py-1.5 text-[14px] font-semibold ${tab === t.key ? "bg-[#111827] text-white" : "border border-[#E5E7EB] bg-white text-[#374151]"}`}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === "properties" && <PropertiesTab onChange={reload} />}
      {tab === "requests" && <RequestsTab onChange={reload} />}
      {tab === "repatriation" && <RepatriationTab onChange={reload} />}
      {tab === "guidance" && <GuidanceTab />}
      <Disclaimers items={d.disclaimers} />
    </div>
  );
}

export default NriSection;
