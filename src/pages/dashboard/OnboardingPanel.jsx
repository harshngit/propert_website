import React, { useState } from "react";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { CITY_SUGGESTIONS, PROPERTY_TYPES, inputClass, labelClass, primaryButton, Notice } from "./ui";

// Onboarding (Screen 2): what the person wants to do, plus buyer / tenant
// preferences used to match properties. Can be changed later in Profile.

const ROLE_OPTIONS = [
  { value: "buyer", title: "Buy a property", body: "Post what you need, get matched properties and site visits." },
  { value: "tenant", title: "Rent a home", body: "Find rentals, then track your lease, rent and maintenance." },
  { value: "seller", title: "Sell my property", body: "List it, see enquiries and visits - we handle every buyer." },
  { value: "owner", title: "Rent out my property", body: "List a rental, then manage your tenant, rent and repairs." },
];

function OnboardingPanel({ profile, onDone }) {
  const { accessToken, user } = useAuth();
  const prefs = profile.preferences || {};
  const [roles, setRoles] = useState(profile.portalRoles || []);
  const [form, setForm] = useState({
    city: (prefs.preferred_locations || [])[0] || "",
    propertyType: prefs.property_type || "",
    budgetMaxLakh: prefs.budget_max ? String(Number(prefs.budget_max) / 1e5) : "",
    urgency: prefs.urgency || "flexible",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const seeking = roles.includes("buyer") || roles.includes("tenant");
  const toggle = (value) => setRoles((r) => (r.includes(value) ? r.filter((x) => x !== value) : [...r, value]));
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!roles.length) {
      setError("Pick at least one option.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body = { portalRoles: roles };
      if (seeking) {
        body.preferences = {
          preferredLocations: form.city ? [form.city.trim()] : [],
          propertyType: form.propertyType || null,
          transactionType: roles.includes("buyer") ? "buy" : "rent",
          budgetMax: form.budgetMaxLakh ? Number(form.budgetMaxLakh) * 1e5 : null,
          urgency: form.urgency,
        };
      }
      onDone(await portal.saveProfile(accessToken, body));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="mx-auto max-w-[760px] rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-8">
      <p className="font-['Plus_Jakarta_Sans'] text-[12px] font-bold uppercase tracking-[0.08em] text-[#E51C23]">Welcome</p>
      <h1 className="mt-1 font-['Plus_Jakarta_Sans'] text-[26px] font-extrabold leading-tight text-[#111827]">
        Hi {user?.fullName?.split(" ")[0] || "there"}, what brings you to PropertySerch?
      </h1>
      <p className="mt-2 text-[14px] text-[#6B7280]">Pick everything that applies - your dashboard is set up around it.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {ROLE_OPTIONS.map((option) => {
          const active = roles.includes(option.value);
          return (
            <button
              type="button"
              key={option.value}
              onClick={() => toggle(option.value)}
              aria-pressed={active}
              className={`rounded-[16px] border p-4 text-left transition ${
                active ? "border-[#E51C23] bg-[#FEF2F2] ring-1 ring-[#E51C23]" : "border-[#E5E7EB] bg-white hover:border-[#FCA5A5]"
              }`}
            >
              <span className="flex items-center justify-between">
                <span className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">{option.title}</span>
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${
                    active ? "border-[#E51C23] bg-[#E51C23] text-white" : "border-[#D1D5DB]"
                  }`}
                >
                  {active ? "✓" : ""}
                </span>
              </span>
              <span className="mt-1 block text-[13px] leading-5 text-[#6B7280]">{option.body}</span>
            </button>
          );
        })}
      </div>

      {seeking && (
        <div className="mt-6 grid gap-4 rounded-[16px] bg-[#F9FAFB] p-4 sm:grid-cols-2">
          <p className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#111827] sm:col-span-2">What are you looking for?</p>
          <label className={labelClass}>
            Preferred city
            <input list="onboarding-cities" value={form.city} onChange={set("city")} placeholder="e.g. Gurugram" className={inputClass} />
            <datalist id="onboarding-cities">
              {CITY_SUGGESTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </label>
          <label className={labelClass}>
            Property type
            <select value={form.propertyType} onChange={set("propertyType")} className={inputClass}>
              <option value="">Any</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <label className={labelClass}>
            {roles.includes("buyer") ? "Budget up to (₹ Lakh)" : "Monthly rent up to (₹ Lakh)"}
            <input type="number" min="0" step="0.01" value={form.budgetMaxLakh} onChange={set("budgetMaxLakh")} placeholder="e.g. 150" className={inputClass} />
          </label>
          <label className={labelClass}>
            How soon?
            <select value={form.urgency} onChange={set("urgency")} className={inputClass}>
              <option value="immediate">Immediately</option>
              <option value="30_days">Within 30 days</option>
              <option value="flexible">Flexible</option>
            </select>
          </label>
        </div>
      )}

      {error && (
        <div className="mt-4">
          <Notice tone="red">{error}</Notice>
        </div>
      )}
      <button type="submit" disabled={saving} className={`${primaryButton} mt-6 w-full sm:w-auto`}>
        {saving ? "Setting up…" : "Continue to my dashboard"}
      </button>
    </form>
  );
}

export default OnboardingPanel;
