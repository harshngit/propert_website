import React, { useState } from "react";
import { Link } from "react-router-dom";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { Badge, Card, EmptyState, LoadState, Notice, SectionHeader, formatDate, formatINR, linkButton, useLoad } from "./ui";

// My Deals & Invoices (Module 40): where each deal stands, what happens
// next, and A R Buildwel's professional-fee invoices - Instalment 1 on the
// Agreement to Sell, Instalment 2 on the Sale Deed (execution = registration),
// or the lease invoice - with GST, due date and a PDF copy.

import { DEAL_STAGE_LABEL as LABEL } from "../../utils/dealStages";
const KIND = { instalment_1: "Instalment 1 - Agreement to Sell", instalment_2: "Instalment 2 - Sale Deed", lease: "Lease professional fee" };

function InvoiceRow({ inv }) {
  const { accessToken } = useAuth();
  const [err, setErr] = useState(null);
  const overdue = inv.status === "overdue" || (inv.status === "invoiced" && inv.is_overdue);
  const open = async () => {
    try {
      const url = URL.createObjectURL(await portal.invoicePdf(accessToken, inv.id));
      window.open(url, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      setErr(e.message);
    }
  };
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 border-t border-[#F3F4F6] py-3 first:border-t-0">
      <div>
        <p className="text-[14px] font-semibold text-[#111827]">{KIND[inv.kind]} · {inv.invoice_number}</p>
        <p className="text-[12px] text-[#6B7280]">
          Fee {formatINR(Number(inv.fee_amount))} + {inv.gst_type === "igst" ? "IGST 18%" : "CGST 9% + SGST 9%"} = <b className="text-[#111827]">{formatINR(Number(inv.total_amount))}</b> · due {formatDate(inv.due_date)}
        </p>
        {err && <p className="text-[12px] text-[#B91C1C]">{err}</p>}
      </div>
      <span className="flex items-center gap-3">
        <Badge tone={inv.status === "paid" ? "green" : overdue ? "red" : inv.status === "waived" ? "gray" : "amber"}>{inv.status === "paid" ? "Paid" : overdue ? "Overdue" : inv.status === "waived" ? "Waived" : "Due"}</Badge>
        <button type="button" className={linkButton} onClick={open}>View PDF</button>
      </span>
    </li>
  );
}

function DealsSection() {
  const deals = useLoad((t) => portal.myDeals(t));
  const list = deals.data || [];
  const unpaid = list.flatMap((d) => d.invoices).filter((i) => ["invoiced", "overdue"].includes(i.status));
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader title="My Deals & Invoices" subtitle="Track each deal from site visit to registration, and your professional-fee invoices." />
      <LoadState loading={deals.loading && !deals.data} error={deals.error} onRetry={deals.reload} />
      {unpaid.length > 0 && (
        <Notice tone="amber">
          {unpaid.length} invoice{unpaid.length === 1 ? "" : "s"} to pay - {formatINR(unpaid.reduce((s, i) => s + Number(i.total_amount), 0))} in total. Payment is due within 7 days of the invoice date.
        </Notice>
      )}
      {deals.data && !list.length && <EmptyState title="No deals yet" body="Once you move ahead on a property with A R Buildwel, its progress and invoices appear here." />}
      {list.map((d) => {
        const idx = d.flow.indexOf(d.stage);
        return (
          <Card key={d.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                {d.property_id ? (
                  <Link to={`/properties/${d.property_id}`} className="text-[16px] font-bold text-[#111827] hover:text-[#E51C23]">{d.property_title}</Link>
                ) : (
                  <p className="text-[16px] font-bold text-[#111827]">{d.property_title || "Deal"}</p>
                )}
                <p className="text-[12px] text-[#6B7280]">
                  {[d.locality, d.city].filter(Boolean).join(", ")}{d.deal_value ? ` · ${formatINR(Number(d.deal_value))}` : ""}{d.broker_name ? ` · with ${d.broker_name}` : ""}
                </p>
              </div>
              <Badge tone={d.stage === "closed_won" ? "green" : d.stage === "closed_lost" ? "gray" : d.stage === "on_hold" ? "amber" : "blue"}>
                {d.stage === "closed_lost" ? "Closed" : d.stage === "on_hold" ? "On hold" : LABEL[d.stage]}
              </Badge>
            </div>

            {d.stage !== "closed_lost" && (
              <ol className="mt-4 flex flex-wrap gap-1.5">
                {d.flow.map((s, i) => (
                  <li key={s} className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${i < idx || d.stage === "closed_won" ? "bg-[#ECFDF5] text-[#065F46]" : i === idx ? "bg-[#E51C23] text-white" : "bg-[#F3F4F6] text-[#9CA3AF]"}`}>
                    {LABEL[s]}
                  </li>
                ))}
              </ol>
            )}

            {d.nextSteps.length > 0 && (
              <div className="mt-3 rounded-[12px] bg-[#F9FAFB] p-3 text-[13px] text-[#374151]">
                <p className="font-semibold">Next: {LABEL[d.next]}</p>
                <ul className="mt-1 list-disc pl-5">{d.nextSteps.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            )}
            {(d.ats_execution_date || d.sale_deed_execution_date || d.lease_execution_date) && (
              <p className="mt-3 text-[12px] text-[#6B7280]">
                {d.ats_execution_date && `Agreement to Sell executed ${formatDate(d.ats_execution_date)}. `}
                {d.sale_deed_execution_date && `Sale Deed executed ${formatDate(d.sale_deed_execution_date)}. `}
                {d.lease_execution_date && `Lease executed ${formatDate(d.lease_execution_date)}.`}
              </p>
            )}

            {d.invoices.length > 0 && (
              <ul className="mt-3 rounded-[12px] border border-[#E5E7EB] px-3">
                {d.invoices.map((i) => <InvoiceRow key={i.id} inv={i} />)}
              </ul>
            )}
          </Card>
        );
      })}
      <p className="text-[11px] text-[#9CA3AF]">
        Professional fee: 1% of the transaction value in two equal instalments, plus GST (CGST + SGST for residents, IGST for NRI / OCI). Stamp duty and registration charges are paid by the purchaser to the government, not to A R Buildwel.
      </p>
    </div>
  );
}

export default DealsSection;
