import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";

// NRI / HNI investor onboarding (PUT /investors/me). Once an A R Buildwel
// team member verifies the profile, full auction / special situation deal
// details and investor alerts unlock.

const ASSET_CLASSES = [
  { value: "residential", label: "Residential" },
  { value: "commercial", label: "Commercial" },
  { value: "auction", label: "Bank auctions" },
  { value: "special_situation", label: "Special situations" },
  { value: "institutional", label: "Institutional (schools, colleges, hospitals)" },
  { value: "land", label: "Land" },
];

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  verified: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

const STATUS_TEXT = {
  pending: "Pending verification - our team will review your profile shortly.",
  verified: "Verified - you have full access to curated deals and investor alerts.",
  rejected: "Not verified - please contact your representative.",
};

const inputClass = "mt-1 h-[42px] w-full rounded-[10px] border border-[#E5E7EB] px-3 text-sm outline-none focus:border-[#E51C23]";

function toCrore(value) {
  return value ? String(Number(value) / 1e7) : "";
}

function InvestorProfilePage() {
  const { accessToken, isAuthenticated, isReady } = useAuth();
  const location = useLocation();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    isNri: false,
    isHni: true,
    residencyStatus: "resident",
    countryOfResidence: "India",
    cityOfResidence: "",
    investorCategory: "individual",
    preferredCities: "",
    assetClassPreferences: [],
    ticketMinCr: "",
    ticketMaxCr: "",
    riskAppetite: "moderate",
    alertsEnabled: true,
    alertMode: "window",
    alertWhatsapp: false,
    alertMaxPerDay: "3",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!accessToken) return;
    apiRequest("/investors/me", { token: accessToken })
      .then((res) => {
        const p = res.data;
        if (!p) return;
        setProfile(p);
        setForm({
          isNri: p.is_nri,
          isHni: p.is_hni,
          residencyStatus: p.residency_status || "resident",
          countryOfResidence: p.country_of_residence || "",
          cityOfResidence: p.city_of_residence || "",
          investorCategory: p.investor_category || "individual",
          preferredCities: (p.preferred_cities || []).join(", "),
          assetClassPreferences: p.asset_class_preferences || [],
          ticketMinCr: toCrore(p.ticket_size_min),
          ticketMaxCr: toCrore(p.ticket_size_max),
          riskAppetite: p.risk_appetite || "moderate",
          alertsEnabled: p.alerts_enabled,
          alertMode: p.alert_mode || "window",
          alertWhatsapp: (p.alert_channels || []).includes("whatsapp"),
          alertMaxPerDay: p.alert_max_per_day ? String(p.alert_max_per_day) : "3",
          timeZone: p.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
        });
      })
      .catch(() => {});
  }, [accessToken]);

  if (isReady && !isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  const set = (key) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleAsset = (value) =>
    setForm((f) => ({
      ...f,
      assetClassPreferences: f.assetClassPreferences.includes(value)
        ? f.assetClassPreferences.filter((v) => v !== value)
        : [...f.assetClassPreferences, value],
    }));

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await apiRequest("/investors/me", {
        method: "PUT",
        token: accessToken,
        body: {
          isNri: form.isNri,
          isHni: form.isHni,
          residencyStatus: form.residencyStatus,
          countryOfResidence: form.countryOfResidence || undefined,
          cityOfResidence: form.cityOfResidence || undefined,
          investorCategory: form.investorCategory,
          preferredCities: form.preferredCities.split(",").map((c) => c.trim()).filter(Boolean),
          assetClassPreferences: form.assetClassPreferences,
          ticketSizeMin: form.ticketMinCr ? Number(form.ticketMinCr) * 1e7 : null,
          ticketSizeMax: form.ticketMaxCr ? Number(form.ticketMaxCr) * 1e7 : null,
          riskAppetite: form.riskAppetite,
          alertsEnabled: form.alertsEnabled,
          alertMode: form.alertMode,
          alertChannels: form.alertWhatsapp ? ["in_app", "whatsapp"] : ["in_app"],
          alertMaxPerDay: Number(form.alertMaxPerDay) || null,
          timeZone: form.timeZone,
        },
      });
      setProfile(res.data);
      setMessage("Profile saved.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-white text-[#0F172A]">
      <SiteHeader />
      <section className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-[28px] font-extrabold text-[#111827]">Investor profile</h1>
        <p className="mt-2 text-sm text-[#6B7280]">
          NRI and HNI investors get curated bank auction, special situation and institutional deals, portfolio tools and a
          dedicated A R Buildwel representative.
        </p>

        {profile && (
          <div className={`mt-6 rounded-xl border px-4 py-3 text-sm ${STATUS_STYLES[profile.verification_status]}`}>
            {STATUS_TEXT[profile.verification_status]}
            {profile.manager_name && <div className="mt-1">Your representative: <span className="font-semibold">{profile.manager_name}</span></div>}
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-6">
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
              <input type="checkbox" checked={form.isNri} onChange={set("isNri")} /> I am an NRI / OCI
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
              <input type="checkbox" checked={form.isHni} onChange={set("isHni")} /> I invest as an HNI / institution
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-[#374151]">
              Residency status
              <select value={form.residencyStatus} onChange={set("residencyStatus")} className={inputClass}>
                <option value="resident">Resident Indian</option>
                <option value="nri">NRI</option>
                <option value="oci">OCI</option>
                <option value="pio">PIO</option>
              </select>
            </label>
            <label className="block text-xs font-semibold text-[#374151]">
              Country of residence
              <input value={form.countryOfResidence} onChange={set("countryOfResidence")} className={inputClass} />
            </label>
            <label className="block text-xs font-semibold text-[#374151]">
              City of residence
              <input value={form.cityOfResidence} onChange={set("cityOfResidence")} className={inputClass} />
            </label>
            <label className="block text-xs font-semibold text-[#374151]">
              Investor type
              <select value={form.investorCategory} onChange={set("investorCategory")} className={inputClass}>
                <option value="individual">Individual</option>
                <option value="family_office">Family office</option>
                <option value="trust">Trust</option>
                <option value="pe_fund">PE fund</option>
                <option value="corporate">Corporate</option>
                <option value="education_group">Education group</option>
              </select>
            </label>
            <label className="block text-xs font-semibold text-[#374151]">
              Ticket size from (₹ Cr)
              <input type="number" min="0" step="0.1" value={form.ticketMinCr} onChange={set("ticketMinCr")} className={inputClass} />
            </label>
            <label className="block text-xs font-semibold text-[#374151]">
              Ticket size up to (₹ Cr)
              <input type="number" min="0" step="0.1" value={form.ticketMaxCr} onChange={set("ticketMaxCr")} className={inputClass} />
            </label>
            <label className="block text-xs font-semibold text-[#374151] sm:col-span-2">
              Preferred cities (comma separated)
              <input value={form.preferredCities} onChange={set("preferredCities")} placeholder="Delhi, Gurugram, Noida" className={inputClass} />
            </label>
          </div>

          <div>
            <div className="text-xs font-semibold text-[#374151]">Interested in</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {ASSET_CLASSES.map((a) => (
                <button
                  type="button"
                  key={a.value}
                  onClick={() => toggleAsset(a.value)}
                  className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold ${
                    form.assetClassPreferences.includes(a.value) ? "border-[#E51C23] bg-[#FFF1F1] text-[#E51C23]" : "border-[#E5E7EB] text-[#4B5563]"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-[#E5E7EB] p-4">
            <label className="flex items-center gap-2 text-sm font-semibold text-[#111827]">
              <input type="checkbox" checked={form.alertsEnabled} onChange={set("alertsEnabled")} /> Alert me when matching deals go live
            </label>
            {form.alertsEnabled && (
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <label className="block text-xs font-semibold text-[#374151]">
                  When to send
                  <select value={form.alertMode} onChange={set("alertMode")} className={inputClass}>
                    <option value="window">Once a day, 9:30-10:30 am my time</option>
                    <option value="instant">As soon as a deal matches</option>
                  </select>
                  <span className="mt-1 block font-normal text-[#9CA3AF]">High-scoring priority deals always arrive straight away.</span>
                </label>
                <label className="block text-xs font-semibold text-[#374151]">
                  At most, per day
                  <select value={form.alertMaxPerDay} onChange={set("alertMaxPerDay")} className={inputClass}>
                    {["1", "2", "3", "5", "10"].map((n) => (
                      <option key={n} value={n}>{n} alert{n === "1" ? "" : "s"}</option>
                    ))}
                  </select>
                </label>
                <label className="block text-xs font-semibold text-[#374151]">
                  My time zone
                  <input value={form.timeZone} onChange={set("timeZone")} placeholder="e.g. Asia/Dubai" className={inputClass} />
                </label>
                <label className="flex items-center gap-2 self-end pb-2 text-sm text-[#374151]">
                  <input type="checkbox" checked={form.alertWhatsapp} onChange={set("alertWhatsapp")} /> Also on WhatsApp
                </label>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-700">{message}</p>}
          {profile && (profile.is_nri || profile.is_hni) && (
            <p className="text-sm">
              {profile.is_nri && (
                <Link to="/dashboard/nri" className="mr-4 font-bold text-[#E51C23] hover:underline">Open NRI Services →</Link>
              )}
              {profile.is_hni && (
                <Link to="/dashboard/hni" className="font-bold text-[#E51C23] hover:underline">Open HNI Investments →</Link>
              )}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" disabled={saving} className="cta-red inline-flex h-[44px] items-center justify-center rounded-[10px] px-8 text-sm font-bold text-white disabled:opacity-60">
              {saving ? "Saving…" : "Save profile"}
            </button>
            <Link to="/buy/bank-auction-properties" className="text-sm font-semibold text-[#E51C23]">
              Browse opportunities →
            </Link>
          </div>
        </form>
      </section>
      <CompanyFooterSection />
    </main>
  );
}

export default InvestorProfilePage;
