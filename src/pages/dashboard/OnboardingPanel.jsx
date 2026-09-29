import React, { useState } from "react";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { CITY_SUGGESTIONS, PROPERTY_TYPES, inputClass, labelClass, primaryButton, Notice } from "./ui";

// Onboarding (Screen 2): what the person wants to do, plus buyer / tenant
// preferences used to match properties, and for NRI / HNI investors their
// country, property interest, ticket size and an introduction to their
// relationship manager. Can be changed later in Profile.

const ROLE_OPTIONS = [
  { value: "buyer", title: "Buy a property", body: "Post what you need, get matched properties and site visits." },
  { value: "tenant", title: "Rent a home", body: "Find rentals, then track your lease, rent and maintenance." },
  { value: "seller", title: "Sell my property", body: "List it, see enquiries and visits - we handle every buyer." },
  { value: "owner", title: "Rent out my property", body: "List a rental, then manage your tenant, rent and repairs." },
];

const INVESTOR_OPTIONS = [
  { value: "nri", title: "I live outside India (NRI / OCI)", body: "Buy, sell, rent out or have your Indian property managed remotely." },
  { value: "hni", title: "I invest in property (HNI)", body: "Curated bank auction, special situation and institutional deals." },
];

const INTEREST_TYPES = [
  { value: "buy", label: "Buy" },
  { value: "sell", label: "Sell" },
  { value: "rent_out", label: "Rent out" },
  { value: "manage", label: "Property management" },
  { value: "invest", label: "Investment deals" },
];

const ASSET_CLASSES = [
  { value: "auction", label: "Bank auctions" },
  { value: "special_situation", label: "Special situation" },
  { value: "institutional", label: "Institutional (schools, colleges)" },
  { value: "commercial", label: "Commercial" },
  { value: "residential", label: "Residential" },
];

const COUNTRIES = ["United Arab Emirates", "United States", "United Kingdom", "Canada", "Australia", "Singapore", "Saudi Arabia", "Qatar", "Kuwait", "Oman", "Germany", "New Zealand"];

function Chips({ options, value, onChange }) {
  return (
    <div className="mt-1.5 flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.value);
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(on ? value.filter((v) => v !== o.value) : [...value, o.value])}
            className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold transition ${on ? "border-[#E51C23] bg-[#FEF2F2] text-[#E51C23]" : "border-[#E5E7EB] text-[#374151] hover:border-[#FCA5A5]"}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function RoleCard({ option, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
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
}

function OnboardingPanel({ profile, onDone }) {
  const { accessToken, user } = useAuth();
  const prefs = profile.preferences || {};
  const [roles, setRoles] = useState([
    ...(profile.portalRoles || []),
    ...(profile.investor?.isNri ? ["nri"] : []),
    ...(profile.investor?.isHni ? ["hni"] : []),
  ]);
  const [inv, setInv] = useState({ country: "", interests: [], ticketMinLakh: "", ticketMaxLakh: "", assetClasses: [] });
  const [intro, setIntro] = useState(null); // shown after an investor onboards: RM introduction
  const [form, setForm] = useState({
    city: (prefs.preferred_locations || [])[0] || "",
    propertyType: prefs.property_type || "",
    budgetMaxLakh: prefs.budget_max ? String(Number(prefs.budget_max) / 1e5) : "",
    urgency: prefs.urgency || "flexible",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const seeking = roles.includes("buyer") || roles.includes("tenant");
  const isNri = roles.includes("nri");
  const isHni = roles.includes("hni");
  const setInvField = (key) => (e) => setInv((f) => ({ ...f, [key]: e && e.target ? e.target.value : e }));
  const toggle = (value) => setRoles((r) => (r.includes(value) ? r.filter((x) => x !== value) : [...r, value]));
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    if (!roles.length) {
      setError("Pick at least one option.");
      return;
    }
    if (isNri && !inv.country.trim() && !profile.investor?.isNri) {
      setError("Tell us which country you live in.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      let investorProfile = null;
      if (isNri || isHni) {
        let timeZone;
        try {
          timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
          timeZone = undefined;
        }
        const lakh = (v) => Math.round(Number(v) * 1e5);
        investorProfile = await portal.saveInvestorProfile(accessToken, {
          isNri,
          isHni,
          ...(inv.country.trim() ? { countryOfResidence: inv.country.trim(), residencyStatus: "nri" } : {}),
          ...(inv.interests.length ? { propertyInterestTypes: inv.interests } : {}),
          ...(inv.assetClasses.length ? { assetClassPreferences: inv.assetClasses } : {}),
          ...(inv.ticketMinLakh ? { ticketSizeMin: lakh(inv.ticketMinLakh) } : {}),
          ...(inv.ticketMaxLakh ? { ticketSizeMax: lakh(inv.ticketMaxLakh) } : {}),
          ...(timeZone ? { timeZone } : {}),
        });
      }
      const body = { portalRoles: roles.filter((r) => ["buyer", "tenant", "seller", "owner"].includes(r)) };
      if (seeking) {
        body.preferences = {
          preferredLocations: form.city ? [form.city.trim()] : [],
          propertyType: form.propertyType || null,
          transactionType: roles.includes("buyer") ? "buy" : "rent",
          budgetMax: form.budgetMaxLakh ? Number(form.budgetMaxLakh) * 1e5 : null,
          urgency: form.urgency,
        };
      }
      const saved = await portal.saveProfile(accessToken, body);
      if (investorProfile) setIntro({ profile: saved, manager: investorProfile.manager_name, verification: investorProfile.verification_status });
      else onDone(saved);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (intro) {
    return (
      <div className="mx-auto max-w-[620px] rounded-[20px] border border-[#E5E7EB] bg-white p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-8">
        <p className="font-['Plus_Jakarta_Sans'] text-[12px] font-bold uppercase tracking-[0.08em] text-[#E51C23]">You're all set</p>
        {intro.manager ? (
          <>
            <h1 className="mt-2 font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold text-[#111827]">Meet {intro.manager}, your relationship manager</h1>
            <p className="mt-2 text-[14px] leading-6 text-[#4B5563]">
              {intro.manager.split(" ")[0]} will reach out shortly to understand your plans, verify your investor profile and handle everything
              for you in India - you never have to deal with buyers, tenants or sellers directly.
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-2 font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold text-[#111827]">Your relationship manager is being assigned</h1>
            <p className="mt-2 text-[14px] leading-6 text-[#4B5563]">We'll introduce your dedicated A R Buildwel manager shortly - you'll see them on your dashboard.</p>
          </>
        )}
        {intro.verification !== "verified" && (
          <p className="mt-3 text-[13px] text-[#6B7280]">Next step: our team verifies your investor profile, which unlocks full details of auction and special situation deals.</p>
        )}
        <button type="button" onClick={() => onDone(intro.profile)} className={`${primaryButton} mt-6`}>
          Continue to my dashboard
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-[760px] rounded-[20px] border border-[#E5E7EB] bg-white p-6 shadow-[0_12px_30px_rgba(15,23,42,0.06)] sm:p-8">
      <p className="font-['Plus_Jakarta_Sans'] text-[12px] font-bold uppercase tracking-[0.08em] text-[#E51C23]">Welcome</p>
      <h1 className="mt-1 font-['Plus_Jakarta_Sans'] text-[26px] font-extrabold leading-tight text-[#111827]">
        Hi {user?.fullName?.split(" ")[0] || "there"}, what brings you to PropertySerch?
      </h1>
      <p className="mt-2 text-[14px] text-[#6B7280]">Pick everything that applies - your dashboard is set up around it.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {ROLE_OPTIONS.map((option) => (
          <RoleCard key={option.value} option={option} active={roles.includes(option.value)} onClick={() => toggle(option.value)} />
        ))}
      </div>
      <p className="mt-5 font-['Plus_Jakarta_Sans'] text-[13px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Investors</p>
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        {INVESTOR_OPTIONS.map((option) => (
          <RoleCard key={option.value} option={option} active={roles.includes(option.value)} onClick={() => toggle(option.value)} />
        ))}
      </div>

      {(isNri || isHni) && (
        <div className="mt-6 grid gap-4 rounded-[16px] bg-[#F9FAFB] p-4 sm:grid-cols-2">
          <p className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#111827] sm:col-span-2">About your investing</p>
          {isNri && (
            <>
              <label className={labelClass}>
                Country of residence
                <input list="onboarding-countries" value={inv.country} onChange={setInvField("country")} placeholder="e.g. United Arab Emirates" className={inputClass} />
                <datalist id="onboarding-countries">
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
              <div className="sm:col-span-2">
                <span className={labelClass}>What do you need help with in India?</span>
                <Chips options={INTEREST_TYPES} value={inv.interests} onChange={setInvField("interests")} />
              </div>
            </>
          )}
          {isHni && (
            <>
              <label className={labelClass}>
                Ticket size from (₹ Lakh)
                <input type="number" min="0" value={inv.ticketMinLakh} onChange={setInvField("ticketMinLakh")} placeholder="e.g. 100" className={inputClass} />
              </label>
              <label className={labelClass}>
                Ticket size up to (₹ Lakh)
                <input type="number" min="0" value={inv.ticketMaxLakh} onChange={setInvField("ticketMaxLakh")} placeholder="e.g. 1000" className={inputClass} />
              </label>
              <div className="sm:col-span-2">
                <span className={labelClass}>Deal types you're interested in</span>
                <Chips options={ASSET_CLASSES} value={inv.assetClasses} onChange={setInvField("assetClasses")} />
              </div>
            </>
          )}
          <p className="text-[12px] text-[#6B7280] sm:col-span-2">
            Every investor gets a dedicated A R Buildwel relationship manager. Full deal details unlock once we verify your profile.
          </p>
        </div>
      )}

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
