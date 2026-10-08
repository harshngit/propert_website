import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import { institutional } from "../api/institutional";
import { useAuth } from "../context/AuthContext";
import { useSeo } from "../lib/seo";

// /post-institutional - an institution's owner / promoter lists it for
// sale, stake sale, lease, JV or management takeover. The listing is
// confidential and goes live after A R Buildwel reviews it. Location on
// the map (latitude / longitude) is mandatory.

const input = "mt-1 h-[42px] w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 text-[14px] text-[#111827] outline-none focus:border-[#E51C23]";
const label = "block text-[13px] font-semibold text-[#374151]";
const blank = { institutionName: "", assetClass: "k12_school", boardAffiliation: "", yearEstablished: "", city: "", locality: "", address: "", latitude: "", longitude: "", campusAreaAcres: "", builtUpAreaSqft: "", studentEnrollment: "", capacityUnits: "", facultyCount: "", nocStatus: "valid", landOwnership: "owned", dealType: "full_sale", askingPriceCr: "", annualRevenueCr: "", ebitdaCr: "", infrastructure: "" };

function PostInstitutionalPage() {
  const { accessToken, isAuthenticated, isReady, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [meta, setMeta] = useState(null);
  const [f, setF] = useState(blank);
  const [approvals, setApprovals] = useState([{ name: "", status: "valid" }]);
  const [state, setState] = useState({ status: "idle", message: "" });
  useSeo({ title: "List an Institution - School, College, Hospital or Campus", description: "List a school, college, hospital, hotel or campus for sale, stake sale, lease or joint venture - confidentially, to verified institutional buyers under NDA.", path: "/post-institutional" }, []);
  useEffect(() => {
    institutional.meta().then(setMeta).catch(() => {});
  }, []);

  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const cls = meta?.assetClasses.find((a) => a.value === f.assetClass);
  const education = !cls || cls.sector === "education";
  const fillMyLocation = () => {
    // Fills latitude / longitude when the person is on campus.
    navigator.geolocation?.getCurrentPosition(
      (pos) => setF((x) => ({ ...x, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) })),
      () => setState({ status: "error", message: "Could not read your location - enter the latitude and longitude from a map." })
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    const n = (v) => (v === "" ? undefined : Number(v));
    setState({ status: "submitting", message: "" });
    try {
      const listing = await institutional.createListing(accessToken, {
        ...f,
        yearEstablished: n(f.yearEstablished), latitude: n(f.latitude), longitude: n(f.longitude), campusAreaAcres: n(f.campusAreaAcres), builtUpAreaSqft: n(f.builtUpAreaSqft),
        studentEnrollment: education ? n(f.studentEnrollment) : undefined, capacityUnits: education ? undefined : n(f.capacityUnits), facultyCount: n(f.facultyCount),
        askingPriceCr: n(f.askingPriceCr), annualRevenueCr: n(f.annualRevenueCr), ebitdaCr: n(f.ebitdaCr),
        boardAffiliation: f.boardAffiliation || undefined, locality: f.locality || undefined, address: f.address || undefined, infrastructure: f.infrastructure || undefined,
        approvals: approvals.filter((a) => a.name.trim()),
      });
      setState({ status: "done", message: "", listing });
    } catch (err) {
      setState({ status: "error", message: err.message });
    }
  };

  if (isReady && !isAuthenticated) {
    return (
      <main className="min-h-screen bg-white"><SiteHeader />
        <div className="mx-auto max-w-[640px] px-4 py-20 text-center">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold text-[#111827]">List an institution</h1>
          <p className="mt-2 text-[15px] leading-7 text-[#6B7280]">Sign in to list a school, college, hospital, hotel or campus. Your listing stays confidential - buyers see only the type, locality and ranges until they are verified and sign an NDA.</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/login" state={{ from: location }} className="cta-red inline-flex h-[44px] items-center rounded-[12px] px-6 text-[14px] font-bold text-white">Sign in</Link>
            <Link to="/register" className="inline-flex h-[44px] items-center rounded-[12px] border border-[#E5E7EB] px-6 text-[14px] font-bold text-[#111827]">Create an account</Link>
          </div>
        </div>
        <CompanyFooterSection />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <div className="mx-auto max-w-[860px] px-4 py-10 sm:px-6">
        <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold uppercase tracking-[0.08em] text-[#E51C23]">Institutional</p>
        <h1 className="mt-1 font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold text-[#111827]">List an institution</h1>
        <p className="mt-2 max-w-[640px] text-[14px] leading-6 text-[#6B7280]">The name and figures you enter are confidential. The public listing shows only the type, the locality and ranges. A R Buildwel reviews every listing before it goes live.</p>

        {state.status === "done" ? (
          <div className="mt-8 rounded-[16px] border border-emerald-200 bg-emerald-50 p-6">
            <p className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold text-emerald-900">Submitted for review</p>
            <p className="mt-1 text-[14px] text-emerald-800">Buyers will see it as “{state.listing.summary}”. We will notify you when it is live and whenever a verified buyer shows interest.</p>
            <button type="button" onClick={() => navigate("/dashboard/institutional")} className="cta-red mt-4 h-[42px] rounded-[10px] px-5 text-[14px] font-bold text-white">Go to my institutional dashboard</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-8">
            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-3 font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">The institution</legend>
              <label className={`${label} sm:col-span-2`}>Institution name (kept confidential)<input id="pi-name" required className={input} value={f.institutionName} onChange={set("institutionName")} /></label>
              <label className={label}>Type<select id="pi-class" className={input} value={f.assetClass} onChange={set("assetClass")}>{(meta?.assetClasses || []).map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}</select></label>
              <label className={label}>{education ? "Board / affiliation" : "Category / brand"}<input id="pi-board" className={input} placeholder={education ? "CBSE, ICSE, IB, UGC, AICTE…" : ""} value={f.boardAffiliation} onChange={set("boardAffiliation")} /></label>
              <label className={label}>Year established<input id="pi-year" type="number" min="1800" max="2100" className={input} value={f.yearEstablished} onChange={set("yearEstablished")} /></label>
              <label className={label}>{education ? "Students enrolled" : `Capacity (${cls?.capacityLabel || "units"})`}<input id="pi-size" type="number" min="0" className={input} value={education ? f.studentEnrollment : f.capacityUnits} onChange={set(education ? "studentEnrollment" : "capacityUnits")} /></label>
              <label className={label}>{education ? "Faculty" : "Staff"}<input id="pi-faculty" type="number" min="0" className={input} value={f.facultyCount} onChange={set("facultyCount")} /></label>
            </fieldset>

            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-3 font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">Location and campus</legend>
              <label className={label}>City<input id="pi-city" required className={input} value={f.city} onChange={set("city")} /></label>
              <label className={label}>Locality<input id="pi-locality" className={input} value={f.locality} onChange={set("locality")} /></label>
              <label className={`${label} sm:col-span-2`}>Address (confidential)<input id="pi-address" className={input} value={f.address} onChange={set("address")} /></label>
              <label className={label}>Latitude<input id="pi-lat" required type="number" step="any" min="-90" max="90" className={input} value={f.latitude} onChange={set("latitude")} /></label>
              <label className={label}>Longitude<input id="pi-lng" required type="number" step="any" min="-180" max="180" className={input} value={f.longitude} onChange={set("longitude")} /></label>
              <p className="text-[12px] text-[#6B7280] sm:col-span-2">The campus location is required. <button type="button" onClick={fillMyLocation} className="font-bold text-[#E51C23]">Use my current location</button> if you are on campus, or copy the coordinates from a map.</p>
              <label className={label}>Campus area (acres)<input id="pi-acres" type="number" step="any" min="0" className={input} value={f.campusAreaAcres} onChange={set("campusAreaAcres")} /></label>
              <label className={label}>Built-up area (sq ft)<input id="pi-built" type="number" min="0" className={input} value={f.builtUpAreaSqft} onChange={set("builtUpAreaSqft")} /></label>
              <label className={`${label} sm:col-span-2`}>Infrastructure<textarea id="pi-infra" rows={2} maxLength={2000} className={`${input} h-auto py-2`} placeholder="Labs, hostel, transport, operating theatres, banquet halls…" value={f.infrastructure} onChange={set("infrastructure")} /></label>
            </fieldset>

            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-3 font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">Approvals and land</legend>
              <label className={label}>NOC status<select id="pi-noc" className={input} value={f.nocStatus} onChange={set("nocStatus")}><option value="valid">Valid</option><option value="pending">Pending</option><option value="expired">Expired</option><option value="not_applicable">Not applicable</option></select></label>
              <label className={label}>Land ownership<select id="pi-land" className={input} value={f.landOwnership} onChange={set("landOwnership")}><option value="owned">Owned</option><option value="leased">Leased</option><option value="trust_held">Trust-held</option><option value="mixed">Mixed</option></select></label>
              <div className="sm:col-span-2">
                <p className={label}>Regulatory approvals{cls?.expectedApprovals?.length ? ` (usually: ${cls.expectedApprovals.join("; ")})` : ""}</p>
                {approvals.map((a, i) => (
                  <div key={i} className="mt-2 flex gap-2">
                    <input aria-label="Approval" className={`${input} mt-0 flex-1`} placeholder="e.g. CBSE affiliation" value={a.name} onChange={(e) => setApprovals((xs) => xs.map((x, j) => (j === i ? { ...x, name: e.target.value } : x)))} />
                    <select aria-label="Status" className={`${input} mt-0 w-36`} value={a.status} onChange={(e) => setApprovals((xs) => xs.map((x, j) => (j === i ? { ...x, status: e.target.value } : x)))}><option value="valid">Valid</option><option value="pending">Pending</option><option value="expired">Expired</option></select>
                  </div>
                ))}
                <button type="button" onClick={() => setApprovals((xs) => [...xs, { name: "", status: "valid" }])} className="mt-2 text-[13px] font-bold text-[#E51C23]">+ Add another approval</button>
              </div>
            </fieldset>

            <fieldset className="grid gap-4 sm:grid-cols-2">
              <legend className="mb-3 font-['Plus_Jakarta_Sans'] text-[16px] font-extrabold text-[#111827]">The transaction (₹ crore, self-reported)</legend>
              <label className={label}>Transaction<select id="pi-deal" className={input} value={f.dealType} onChange={set("dealType")}>{(meta?.dealTypes || []).map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
              <label className={label}>Asking price<input id="pi-ask" required type="number" step="any" min="0" className={input} value={f.askingPriceCr} onChange={set("askingPriceCr")} /></label>
              <label className={label}>Annual revenue<input id="pi-rev" type="number" step="any" min="0" className={input} value={f.annualRevenueCr} onChange={set("annualRevenueCr")} /></label>
              <label className={label}>EBITDA<input id="pi-ebitda" type="number" step="any" min="0" className={input} value={f.ebitdaCr} onChange={set("ebitdaCr")} /></label>
            </fieldset>

            {state.status === "error" && <p className="rounded-[12px] border border-red-200 bg-red-50 px-4 py-3 text-[14px] text-red-700">{state.message}</p>}
            {user && user.role !== "customer" && <p className="text-[13px] text-[#6B7280]">Brokers need institutional broker certification to list; staff list from the CRM.</p>}
            <button type="submit" disabled={state.status === "submitting"} className="cta-red h-[46px] rounded-[12px] px-7 text-[15px] font-bold text-white disabled:opacity-60">{state.status === "submitting" ? "Submitting…" : "Submit for review"}</button>
            {meta && <p className="text-[12px] leading-5 text-[#9CA3AF]">{meta.disclaimer}</p>}
          </form>
        )}
      </div>
      <CompanyFooterSection />
    </main>
  );
}

export default PostInstitutionalPage;
