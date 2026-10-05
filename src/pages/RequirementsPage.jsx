import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import GuestInterestModal from "../components/GuestInterestModal";
import EnquiryModal from "../components/EnquiryModal";
import { listGuestRequirements } from "../api/guest";
import { useAuth } from "../context/AuthContext";

// Posted requirements anyone can browse (Guest Browsing). Shown with area
// and locality only - never the buyer, their contact or their budget. A
// visitor with a matching property taps "I'm interested": guests verify a
// mobile number with a one-time code, signed-in users send an enquiry;
// either way an A R Buildwel representative takes it from there.

const PURPOSE = { buy: "Looking to buy", rent: "Looking to rent", invest: "Looking to invest", lease: "Looking to lease" };
const typeLabel = (t) => (t ? String(t).replace(/_/g, " ") : "property");

function RequirementsPage() {
  const { user } = useAuth();
  const [params, setParams] = useSearchParams();
  const [city, setCity] = useState(params.get("city") || "");
  const purpose = params.get("purpose") || "";
  const [state, setState] = useState({ status: "loading", items: [] });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, status: "loading" }));
    listGuestRequirements({ city: params.get("city") || undefined, purpose: purpose || undefined })
      .then((items) => !cancelled && setState({ status: "ready", items: items || [] }))
      .catch((err) => !cancelled && setState({ status: "error", items: [], message: err.message }));
    return () => {
      cancelled = true;
    };
  }, [params, purpose]);

  const apply = (next) => {
    const q = new URLSearchParams(params);
    Object.entries(next).forEach(([k, v]) => (v ? q.set(k, v) : q.delete(k)));
    setParams(q, { replace: true });
  };
  const subject = selected ? `${PURPOSE[selected.purpose] || "Requirement"}: ${typeLabel(selected.propertyType)} in ${[...(selected.localities || []).slice(0, 2), selected.city].filter(Boolean).join(", ")}` : "";

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="bg-[#FEF2F2]">
        <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold uppercase tracking-[0.08em] text-[#E51C23]">Requirement Marketplace</p>
          <h1 className="mt-2 font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-tight text-[#111827] sm:text-[40px]">What buyers and tenants are looking for</h1>
          <p className="mt-3 max-w-[660px] text-[15px] leading-7 text-[#4B5563]">
            Live requirements, shown by area only. Have a property that fits? Tell us and a representative will connect the two sides - contact details are never shared.
          </p>
          <form
            className="mt-6 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              apply({ city: city.trim() });
            }}
          >
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="City" className="h-[44px] w-[220px] rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-[14px] outline-none focus:border-[#E51C23]" />
            <select value={purpose} onChange={(e) => apply({ purpose: e.target.value })} className="h-[44px] rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-[14px]">
              <option value="">Buy or rent</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
            <button type="submit" className="cta-red h-[44px] rounded-[10px] px-5 text-[14px] font-bold text-white">Search</button>
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-10 sm:px-6">
        {state.status === "loading" && <p className="py-10 text-center text-[14px] text-[#6B7280]">Loading…</p>}
        {state.status === "error" && <p className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{state.message}</p>}
        {state.status === "ready" && !state.items.length && (
          <div className="rounded-[18px] border border-dashed border-[#E5E7EB] bg-[#FAFAFA] px-6 py-12 text-center">
            <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">No open requirements here right now</p>
            <p className="mx-auto mt-1 max-w-[440px] text-[14px] leading-6 text-[#6B7280]">Try another city, or post your property so it is matched as soon as a buyer posts.</p>
            <Link to="/post-property" className="cta-red mt-4 inline-flex h-[42px] items-center rounded-[10px] px-5 text-[14px] font-bold text-white">Post my property</Link>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.items.map((r) => (
            <article key={r.id} className="flex flex-col rounded-[16px] border border-[#E5E7EB] p-5">
              <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#E51C23]">{PURPOSE[r.purpose] || "Requirement"}</p>
              <h2 className="mt-1 font-['Plus_Jakarta_Sans'] text-[17px] font-bold capitalize text-[#111827]">
                {r.bedrooms ? `${r.bedrooms} BHK ` : ""}{typeLabel(r.propertyType)}
              </h2>
              <p className="mt-1 text-[14px] text-[#4B5563]">{[...(r.localities || []).slice(0, 3), r.city].filter(Boolean).join(", ")}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-[12px] font-semibold">
                {(r.areaMinSqft || r.areaMaxSqft) && (
                  <span className="rounded-md bg-[#F3F4F6] px-2 py-1 text-[#374151]">
                    {r.areaMinSqft ? Number(r.areaMinSqft).toLocaleString("en-IN") : "Any"}-{r.areaMaxSqft ? Number(r.areaMaxSqft).toLocaleString("en-IN") : "any"} sq.ft
                  </span>
                )}
                {r.urgency && <span className="rounded-md bg-amber-50 px-2 py-1 capitalize text-amber-800">{String(r.urgency).replace(/_/g, " ")}</span>}
                <span className="rounded-md bg-[#F3F4F6] px-2 py-1 text-[#6B7280]">Posted {new Date(r.postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
              </div>
              <button type="button" onClick={() => setSelected(r)} className="mt-4 h-[42px] rounded-[10px] border-2 border-[#E51C23] text-[14px] font-bold text-[#E51C23] hover:bg-[#FEF2F2]">
                I have a matching property
              </button>
            </article>
          ))}
        </div>
      </section>

      {user ? (
        <EnquiryModal open={!!selected} onClose={() => setSelected(null)} topic={`Requirement ${selected?.id || ""}`} title="I have a matching property" description={subject} submitLabel="Tell my representative" />
      ) : (
        <GuestInterestModal open={!!selected} onClose={() => setSelected(null)} requirementId={selected?.id} subject={subject} />
      )}
      <CompanyFooterSection />
    </main>
  );
}

export default RequirementsPage;
