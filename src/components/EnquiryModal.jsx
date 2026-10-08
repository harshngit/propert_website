import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { representativeLine, submitEnquiry } from "../api/leads";
import { useAuth } from "../context/AuthContext";

// Reusable "talk to us" form for home-page and service CTAs (relationship
// manager, institutional desk, financing, fractional ownership) and for a
// listing's "Enquire Now" (pass `propertyId`). Creates a website lead in the
// CRM tagged with the topic so the team knows what the visitor asked about;
// a signed-in customer can then track it under My Dashboard > Enquiries.

// Extra questions by kind of enquiry (matched on the topic). The answers go
// to the CRM as structured details, so the home-loan desk sees the loan
// amount, the valuation desk the property, and so on.
const EXTRA_FIELDS = [
  [/loan|financ/i, [["loanAmount", "Loan amount needed (₹)", "number"], ["propertyValue", "Property value (₹)", "number"], ["city", "City of the property", "text"], ["employment", "Employment", ["Salaried", "Self-employed", "Business owner", "NRI", "Other"]]]],
  [/insurance/i, [["coverType", "Cover wanted", ["Home insurance", "Loan protection", "Both", "Not sure"]], ["city", "City of the property", "text"], ["propertyValue", "Property value (₹)", "number"]]],
  [/legal|due diligence/i, [["serviceNeeded", "What do you need?", ["Title / document check", "Agreement to Sell drafting", "Sale Deed and registration", "Full due diligence", "Other"]], ["city", "City of the property", "text"]]],
  [/valuation/i, [["propertyType", "Property type", ["Apartment", "Independent house / villa", "Plot", "Commercial", "Other"]], ["city", "Locality and city", "text"], ["areaSqft", "Area (sq ft)", "number"]]],
  [/seller|list property|owner services/i, [["propertyType", "Property type", ["Apartment", "Independent house / villa", "Plot", "Commercial", "Other"]], ["city", "Locality and city", "text"], ["expectedPrice", "Expected price (₹)", "number"]]],
  [/nri/i, [["country", "Country you live in", "text"], ["serviceNeeded", "Service needed", ["Buy", "Sell", "Rent out", "Property management", "Other"]]]],
  [/hni|fractional|spv|special situation/i, [["ticketSize", "Investment size (₹)", "number"], ["city", "Preferred city", "text"]]],
  [/institutional/i, [["institutionType", "Type of institution", ["School", "College", "University campus", "Hospital", "Other"]], ["budget", "Budget (₹)", "number"]]],
];
const extraFieldsFor = (topic, propertyId) => (propertyId ? [] : (EXTRA_FIELDS.find(([re]) => re.test(topic || "")) || [null, []])[1]);

const inputClass =
  "h-[42px] w-full rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 font-['Plus_Jakarta_Sans'] text-[14px] text-[#111827] outline-none focus:border-[#E51C23]";

function EnquiryModal({ open, onClose, topic, title, description, propertyId, submitLabel = "Request a call back" }) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [extra, setExtra] = useState({});
  const extraFields = extraFieldsFor(topic, propertyId);
  const [state, setState] = useState({ status: "idle", message: "" });

  useEffect(() => {
    if (!open) return;
    setState({ status: "idle", message: "" });
    setFullName(user?.fullName || "");
    setMobile(user?.mobile || "");
    setEmail(user?.email || "");
    setNote("");
    setExtra({});
  }, [open, user]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!mobile.trim() && !email.trim()) {
      setState({ status: "error", message: "Please share a mobile number or email so we can reach you." });
      return;
    }
    setState({ status: "submitting", message: "" });
    try {
      const details = Object.fromEntries(extraFields.map(([key, , type]) => [key, type === "number" && extra[key] ? Number(extra[key]) : extra[key]]).filter(([, v]) => v !== undefined && v !== ""));
      const res = await submitEnquiry({ fullName, mobile, email, propertyId, topic, details, message: `[${topic}] ${note}`.trim() });
      setState({ status: "done", message: `Thank you - ${representativeLine(res?.data?.representative)} will get in touch shortly.` });
    } catch (err) {
      setState({ status: "error", message: err.message });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <form
        onSubmit={onSubmit}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[92vh] w-full max-w-[440px] overflow-y-auto rounded-[18px] bg-white p-6 text-left shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold text-[#111827]">{title || topic}</h3>
            {description && <p className="mt-1 text-[13px] leading-5 text-[#6B7280]">{description}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[#6B7280]">
            ✕
          </button>
        </div>

        {state.status === "done" ? (
          <>
            <p className="mt-5 text-sm text-emerald-700">{state.message}</p>
            {user?.role === "customer" && (
              <Link to="/dashboard/enquiries" className="mt-3 inline-block text-sm font-bold text-[#E51C23] hover:underline">
                Track it in My Dashboard →
              </Link>
            )}
            <button type="button" onClick={onClose} className="cta-red mt-6 h-[42px] w-full rounded-[10px] text-sm font-bold text-white">
              Close
            </button>
          </>
        ) : (
          <div className="mt-5 flex flex-col gap-3">
            <input required placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
            <input type="tel" placeholder="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} className={inputClass} />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
            {extraFields.map(([key, label, type]) =>
              Array.isArray(type) ? (
                <select key={key} value={extra[key] || ""} onChange={(e) => setExtra((x) => ({ ...x, [key]: e.target.value }))} className={inputClass} aria-label={label}>
                  <option value="">{label}</option>
                  {type.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input key={key} type={type} min={type === "number" ? 0 : undefined} placeholder={label} aria-label={label} value={extra[key] || ""} onChange={(e) => setExtra((x) => ({ ...x, [key]: e.target.value }))} className={inputClass} />
              )
            )}
            <textarea
              rows={3}
              placeholder="How can we help? (optional)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className={`${inputClass} h-auto py-2`}
            />
            {state.status === "error" && <p className="text-[13px] text-red-600">{state.message}</p>}
            <button
              type="submit"
              disabled={state.status === "submitting"}
              className="cta-red h-[44px] w-full rounded-[10px] text-sm font-bold text-white disabled:opacity-60"
            >
              {state.status === "submitting" ? "Sending…" : submitLabel}
            </button>
            <p className="text-[11px] leading-4 text-[#9CA3AF]">
              Your details are shared only with your A R Buildwel representative.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}

export default EnquiryModal;
