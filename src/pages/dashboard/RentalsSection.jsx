import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import {
  Badge, Card, EmptyState, LoadState, Modal, Notice, SectionHeader, formatDate, formatINR, inputClass, labelClass,
  linkButton, monthLabel, primaryButton, secondaryButton, useLoad,
} from "./ui";

// Rentals - for owners / landlords and tenants. The owner records the lease;
// the tenant confirms it, reports each month's rent and raises maintenance
// requests; the owner confirms rent and updates requests. Rent is paid
// directly to the owner - this is the shared record, not a payment.

const MAINTENANCE_CATEGORIES = ["plumbing", "electrical", "appliance", "carpentry", "painting", "pest_control", "other"];
const today = () => new Date().toISOString().slice(0, 10);
const rupees = (v) => formatINR(v) || `₹${Number(v || 0).toLocaleString("en-IN")}`;
const ordinal = (n) => {
  const suffix = [11, 12, 13].includes(n % 100) ? "th" : { 1: "st", 2: "nd", 3: "rd" }[n % 10] || "th";
  return `${n}${suffix}`;
};

function LeaseForm({ listings, onSaved, onCancel }) {
  const { accessToken } = useAuth();
  const [form, setForm] = useState({
    propertyId: "",
    propertyLabel: "",
    tenantName: "",
    tenantMobile: "",
    tenantEmail: "",
    monthlyRent: "",
    securityDeposit: "",
    rentDueDay: "5",
    startDate: today(),
    endDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const lease = await portal.createLease(accessToken, {
        propertyId: form.propertyId || undefined,
        propertyLabel: form.propertyLabel || undefined,
        tenantName: form.tenantName,
        tenantMobile: form.tenantMobile.replace(/\D/g, "").slice(-10) || undefined,
        tenantEmail: form.tenantEmail || undefined,
        monthlyRent: Number(form.monthlyRent),
        securityDeposit: form.securityDeposit ? Number(form.securityDeposit) : undefined,
        rentDueDay: Number(form.rentDueDay),
        startDate: form.startDate,
        endDate: form.endDate || undefined,
      });
      onSaved(lease);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        {listings.length > 0 && (
          <label className={`${labelClass} sm:col-span-2`}>
            Property
            <select value={form.propertyId} onChange={set("propertyId")} className={inputClass}>
              <option value="">Another property (describe below)</option>
              {listings.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.title} - {[l.locality, l.city].filter(Boolean).join(", ")}
                </option>
              ))}
            </select>
          </label>
        )}
        {!form.propertyId && (
          <label className={`${labelClass} sm:col-span-2`}>
            Property address *
            <input required value={form.propertyLabel} onChange={set("propertyLabel")} placeholder="Flat 402, Palm Heights, Sector 56, Gurugram" className={inputClass} />
          </label>
        )}
        <label className={labelClass}>
          Tenant's name *
          <input required value={form.tenantName} onChange={set("tenantName")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Tenant's mobile
          <input type="tel" value={form.tenantMobile} onChange={set("tenantMobile")} placeholder="10-digit mobile" className={inputClass} />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Tenant's email
          <input type="email" value={form.tenantEmail} onChange={set("tenantEmail")} className={inputClass} />
          <span className="mt-1 block text-[11px] font-normal text-[#9CA3AF]">
            Mobile or email is required - your tenant sees this lease when they sign in to PropertySerch with it.
          </span>
        </label>
        <label className={labelClass}>
          Monthly rent (₹) *
          <input required type="number" min="1" value={form.monthlyRent} onChange={set("monthlyRent")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Security deposit (₹)
          <input type="number" min="0" value={form.securityDeposit} onChange={set("securityDeposit")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Rent due on (day of month)
          <input type="number" min="1" max="28" value={form.rentDueDay} onChange={set("rentDueDay")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Lease start *
          <input required type="date" value={form.startDate} onChange={set("startDate")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Lease end
          <input type="date" min={form.startDate} value={form.endDate} onChange={set("endDate")} className={inputClass} />
        </label>
      </div>
      {error && <Notice tone="red">{error}</Notice>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={primaryButton}>
          {saving ? "Saving…" : "Add lease"}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function ReportRentForm({ payment, onSubmit, onCancel }) {
  const [form, setForm] = useState({ paidOn: today(), paymentMode: "upi", reference: "", note: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <p className="text-[14px] text-[#6B7280]">
        {monthLabel(payment.period_month)} · {rupees(payment.amount)}. Your owner confirms once they see the payment.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Paid on
          <input required type="date" max={today()} value={form.paidOn} onChange={set("paidOn")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Paid by
          <select value={form.paymentMode} onChange={set("paymentMode")} className={inputClass}>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank transfer</option>
            <option value="cheque">Cheque</option>
            <option value="cash">Cash</option>
            <option value="other">Other</option>
          </select>
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Reference (UPI / transaction / cheque no.)
          <input value={form.reference} onChange={set("reference")} className={inputClass} />
        </label>
      </div>
      {error && <Notice tone="red">{error}</Notice>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={primaryButton}>
          {saving ? "Sending…" : "Mark as paid"}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function MaintenanceForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ title: "", category: "plumbing", priority: "medium", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };
  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <label className={labelClass}>
        What's the issue? *
        <input required minLength={3} value={form.title} onChange={set("title")} placeholder="e.g. Kitchen tap leaking" className={inputClass} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          Category
          <select value={form.category} onChange={set("category")} className={`${inputClass} capitalize`}>
            {MAINTENANCE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c.replace("_", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Priority
          <select value={form.priority} onChange={set("priority")} className={inputClass}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </label>
      </div>
      <label className={labelClass}>
        Details
        <textarea rows={3} value={form.description} onChange={set("description")} className={`${inputClass} h-auto py-2`} />
      </label>
      {error && <Notice tone="red">{error}</Notice>}
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={primaryButton}>
          {saving ? "Sending…" : "Raise request"}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function LeaseDetail({ leaseId, onBack }) {
  const { accessToken } = useAuth();
  const { data: lease, loading, error, reload } = useLoad((token) => portal.lease(token, leaseId), [leaseId]);
  const [reporting, setReporting] = useState(null);
  const [raising, setRaising] = useState(false);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async (fn, message) => {
    setBusy(true);
    setNotice(null);
    try {
      await fn();
      if (message) setNotice({ tone: "green", text: message });
      await reload();
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };

  if (loading || error) return <LoadState loading={loading} error={error} onRetry={reload} />;
  const owner = lease.side === "owner";

  return (
    <div className="flex flex-col gap-5">
      <button type="button" onClick={onBack} className={`${linkButton} self-start`}>
        ← All rentals
      </button>
      <SectionHeader
        title={lease.property_title || lease.property_label}
        subtitle={`${owner ? `Tenant: ${lease.tenant_name}` : `Owner: ${lease.owner_name}`} · ${rupees(lease.monthly_rent)} / month · due on the ${ordinal(lease.rent_due_day)}`}
        action={<Badge status={lease.status} />}
      />
      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <Card>
        <div className="grid gap-3 text-[14px] sm:grid-cols-4">
          <div>
            <p className="text-[12px] text-[#9CA3AF]">Lease period</p>
            <p className="font-semibold">
              {formatDate(lease.start_date)} - {lease.end_date ? formatDate(lease.end_date) : "open"}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-[#9CA3AF]">Security deposit</p>
            <p className="font-semibold">{lease.security_deposit ? rupees(lease.security_deposit) : "-"}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#9CA3AF]">Tenant confirmation</p>
            <p className="font-semibold">{lease.tenant_confirmed_at ? `Confirmed ${formatDate(lease.tenant_confirmed_at)}` : "Pending"}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {!owner && !lease.tenant_confirmed_at && (
              <button type="button" disabled={busy} onClick={() => run(() => portal.confirmLease(accessToken, lease.id), "Lease confirmed.")} className={primaryButton}>
                Confirm lease
              </button>
            )}
            {owner && lease.status === "active" && (
              <button type="button" disabled={busy} onClick={() => run(() => portal.updateLease(accessToken, lease.id, { status: "notice" }), "Marked as on notice.")} className={linkButton}>
                Tenant on notice
              </button>
            )}
            {owner && lease.status !== "ended" && (
              <button
                type="button"
                disabled={busy}
                onClick={() =>
                  window.confirm("End this lease? Rent tracking stops after the end date.") &&
                  run(() => portal.updateLease(accessToken, lease.id, { status: "ended", endDate: lease.end_date || today() }), "Lease ended.")
                }
                className={`${linkButton} text-[#6B7280]`}
              >
                End lease
              </button>
            )}
          </div>
        </div>
      </Card>

      <div>
        <p className="mb-2 font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold text-[#111827]">Rent</p>
        <p className="mb-3 text-[13px] text-[#6B7280]">
          {owner ? "Confirm each month once the rent reaches you." : "Pay your owner directly, then mark the month as paid here."}
        </p>
        <div className="overflow-x-auto rounded-[16px] border border-[#E5E7EB] bg-white">
          <table className="w-full min-w-[560px] text-left text-[14px]">
            <thead className="bg-[#F9FAFB] text-[12px] uppercase tracking-[0.04em] text-[#6B7280]">
              <tr>
                <th className="px-4 py-2.5">Month</th>
                <th className="px-4 py-2.5">Amount</th>
                <th className="px-4 py-2.5">Status</th>
                <th className="px-4 py-2.5">Paid</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3F4F6]">
              {lease.rent.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-2.5 font-semibold">{monthLabel(p.period_month)}</td>
                  <td className="px-4 py-2.5">{rupees(p.amount)}</td>
                  <td className="px-4 py-2.5">
                    <Badge status={p.status} />
                  </td>
                  <td className="px-4 py-2.5 text-[13px] text-[#6B7280]">
                    {p.paid_on ? `${formatDate(p.paid_on)}${p.payment_mode ? ` · ${p.payment_mode.replace("_", " ")}` : ""}${p.reference ? ` · ${p.reference}` : ""}` : "-"}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    {!owner && ["due", "disputed"].includes(p.status) && (
                      <button type="button" onClick={() => setReporting(p)} className={linkButton}>
                        Mark paid
                      </button>
                    )}
                    {owner && p.status !== "confirmed" && (
                      <span className="inline-flex gap-3">
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => run(() => portal.reviewRent(accessToken, lease.id, p.id, { action: "confirm" }), "Rent confirmed.")}
                          className={linkButton}
                        >
                          Confirm received
                        </button>
                        {p.status === "reported" && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => {
                              const note = window.prompt("What's the issue with this payment?");
                              if (note !== null) run(() => portal.reviewRent(accessToken, lease.id, p.id, { action: "dispute", note }), "Tenant notified.");
                            }}
                            className={`${linkButton} text-[#6B7280]`}
                          >
                            Not received
                          </button>
                        )}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold text-[#111827]">Maintenance requests</p>
          {lease.status !== "ended" && (
            <button type="button" onClick={() => setRaising(true)} className={secondaryButton}>
              Raise request
            </button>
          )}
        </div>
        {!lease.maintenance.length && <EmptyState title="No maintenance requests" body={owner ? "Your tenant can raise repairs here." : "Something broken? Raise it here and your owner is notified."} />}
        <div className="flex flex-col gap-3">
          {lease.maintenance.map((m) => (
            <Card key={m.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-bold text-[#111827]">{m.title}</p>
                    <Badge status={m.status} />
                    <Badge tone={m.priority === "urgent" || m.priority === "high" ? "red" : "gray"}>{m.priority}</Badge>
                  </div>
                  <p className="mt-1 text-[13px] text-[#6B7280]">
                    <span className="capitalize">{m.category.replace("_", " ")}</span> · raised {formatDate(m.created_at)}
                    {m.raised_by_name ? ` by ${m.raised_by_name}` : ""}
                  </p>
                  {m.description && <p className="mt-1 text-[14px] text-[#374151]">{m.description}</p>}
                  {m.owner_note && <p className="mt-2 rounded-[10px] bg-[#F9FAFB] px-3 py-2 text-[13px] text-[#374151]">Owner update: {m.owner_note}</p>}
                </div>
                <div className="flex flex-wrap gap-3">
                  {owner && m.status === "open" && (
                    <button type="button" disabled={busy} onClick={() => run(() => portal.updateMaintenance(accessToken, lease.id, m.id, { status: "in_progress" }))} className={linkButton}>
                      Start work
                    </button>
                  )}
                  {owner && ["open", "in_progress"].includes(m.status) && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        const note = window.prompt("What was done? (optional)") ?? null;
                        if (note !== null) run(() => portal.updateMaintenance(accessToken, lease.id, m.id, { status: "resolved", ownerNote: note || undefined }), "Marked resolved.");
                      }}
                      className={linkButton}
                    >
                      Mark resolved
                    </button>
                  )}
                  {m.status === "resolved" && (
                    <button type="button" disabled={busy} onClick={() => run(() => portal.updateMaintenance(accessToken, lease.id, m.id, { status: "closed" }))} className={`${linkButton} text-[#6B7280]`}>
                      Close
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal open={!!reporting} title="Mark rent as paid" onClose={() => setReporting(null)}>
        {reporting && (
          <ReportRentForm
            payment={reporting}
            onCancel={() => setReporting(null)}
            onSubmit={async (form) => {
              await portal.reportRent(accessToken, lease.id, reporting.id, form);
              setReporting(null);
              setNotice({ tone: "green", text: "Payment sent to your owner to confirm." });
              await reload();
            }}
          />
        )}
      </Modal>
      <Modal open={raising} title="Raise a maintenance request" onClose={() => setRaising(false)}>
        {raising && (
          <MaintenanceForm
            onCancel={() => setRaising(false)}
            onSubmit={async (form) => {
              await portal.raiseMaintenance(accessToken, lease.id, form);
              setRaising(false);
              setNotice({ tone: "green", text: `Request raised - ${owner ? "your tenant" : "your owner"} has been notified.` });
              await reload();
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function RentalsSection({ profile }) {
  const [params, setParams] = useSearchParams();
  const leases = useLoad((token) => portal.rentals(token));
  const isOwner = (profile.portalRoles || []).includes("owner");
  const listings = useLoad((token) => (isOwner ? portal.listings(token) : Promise.resolve([])), [isOwner]);
  const [notice, setNotice] = useState(null);
  const selected = params.get("lease");
  const formOpen = params.get("new") === "1";

  if (selected) return <LeaseDetail leaseId={selected} onBack={() => { setParams({}); leases.reload(); }} />;

  const owned = (leases.data || []).filter((l) => l.side === "owner");
  const rented = (leases.data || []).filter((l) => l.side === "tenant");
  const rentListings = (listings.data || []).filter((l) => l.transaction_type === "rent");

  const LeaseCard = ({ l }) => (
    <Card>
      <button type="button" onClick={() => setParams({ lease: l.id })} className="flex w-full flex-wrap items-start justify-between gap-3 text-left">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[16px] font-bold text-[#111827]">{l.property_title || l.property_label}</p>
            <Badge status={l.status} />
            {!l.tenant_confirmed_at && <Badge tone="amber">{l.side === "tenant" ? "Please confirm" : "Awaiting tenant"}</Badge>}
          </div>
          <p className="mt-1 text-[13px] text-[#6B7280]">
            {l.side === "owner" ? `Tenant: ${l.tenant_name}` : `Owner: ${l.owner_name}`} · {rupees(l.monthly_rent)} / month · since {formatDate(l.start_date)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-[12px] font-semibold">
          {l.rent_due > 0 && <Badge tone="amber">{l.side === "tenant" ? `${l.rent_due} month(s) to pay` : `${l.rent_due} month(s) unpaid`}</Badge>}
          {l.rent_to_confirm > 0 && <Badge tone={l.side === "owner" ? "red" : "blue"}>{l.side === "owner" ? `${l.rent_to_confirm} to confirm` : `${l.rent_to_confirm} awaiting owner`}</Badge>}
          {l.open_maintenance > 0 && <Badge tone="blue">{l.open_maintenance} open request(s)</Badge>}
          <span className="text-[#E51C23]">Open →</span>
        </div>
      </button>
    </Card>
  );

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader
        title="Rentals"
        subtitle="Lease details, a month-by-month rent record and maintenance requests - shared between owner and tenant. Rent is paid directly to the owner."
        action={
          isOwner && (
            <button type="button" onClick={() => setParams({ new: "1" })} className={primaryButton}>
              Add a lease
            </button>
          )
        }
      />
      {notice && <Notice>{notice}</Notice>}
      <LoadState loading={leases.loading} error={leases.error} onRetry={leases.reload} />
      {leases.data && !leases.data.length && (
        <EmptyState
          title="No rentals yet"
          body={
            isOwner
              ? "Let your property? Add the lease and invite your tenant - you'll both track rent and repairs here."
              : "When your landlord adds your lease with your mobile or email, it appears here for you to confirm."
          }
          action={
            isOwner && (
              <button type="button" onClick={() => setParams({ new: "1" })} className={primaryButton}>
                Add a lease
              </button>
            )
          }
        />
      )}
      {owned.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#374151]">Properties you've let out</p>
          {owned.map((l) => (
            <LeaseCard key={l.id} l={l} />
          ))}
        </div>
      )}
      {rented.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#374151]">Homes you rent</p>
          {rented.map((l) => (
            <LeaseCard key={l.id} l={l} />
          ))}
        </div>
      )}

      <Modal open={formOpen} title="Add a lease" onClose={() => setParams({})} width="max-w-[680px]">
        {formOpen && (
          <LeaseForm
            listings={rentListings}
            onCancel={() => setParams({})}
            onSaved={(lease) => {
              setNotice("Lease added - your tenant has been asked to confirm it.");
              setParams({ lease: lease.id });
            }}
          />
        )}
      </Modal>
    </div>
  );
}

export default RentalsSection;
