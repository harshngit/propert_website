import React, { useState } from "react";
import { Link } from "react-router-dom";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import { CITY_SUGGESTIONS, CRM_URL, Card, Notice, PROPERTY_TYPES, SectionHeader, formatDate, inputClass, labelClass, primaryButton, secondaryButton, useLoad } from "./ui";

// Profile & Referral: portal roles, buyer / tenant preferences (used for
// matching), the permanent referral code with one-tap WhatsApp share
// (sec. 33.1A), and progress from the Lite Dashboard to Full CRM (sec. 13.2A).

const ROLE_OPTIONS = [
  { value: "buyer", label: "Buyer" },
  { value: "tenant", label: "Tenant" },
  { value: "seller", label: "Seller" },
  { value: "owner", label: "Owner / Landlord" },
];

const TRUST_LABELS = { verification: "Verification", deals: "Completed deals", response: "Response time", ratings: "Ratings", geo: "Listing location" };

// Sec. 8 trust score + badges, with KYC submission (ID document is sent to
// A R for verification; only the last 4 characters of any number are kept).
function TrustCard() {
  const { accessToken } = useAuth();
  const trust = useLoad((t) => portal.trust(t));
  const [reference, setReference] = useState("");
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const t = trust.data;
  if (!t) return null;
  const kyc = (t.verifications || []).find((v) => v.kind === "kyc");
  const submitKyc = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await portal.submitVerification(accessToken, { kind: "kyc", reference, file });
      setMsg({ tone: "green", text: "Submitted - your A R Buildwel representative will verify it." });
      setReference("");
      setFile(null);
      trust.reload();
    } catch (err) {
      setMsg({ tone: "red", text: err.message });
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Trust score</p>
          <p className="mt-1 text-[13px] text-[#6B7280]">Shown (without your identity) on your listings and reviews. A higher score ranks your listings higher.</p>
        </div>
        <p className="font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold leading-none text-[#111827]">
          {t.score}
          <span className="text-[14px] text-[#9CA3AF]">/100</span>
        </p>
      </div>
      {t.badges.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {t.badges.map((b) => (
            <span key={b.id} className={`rounded-full px-3 py-1 text-[12px] font-bold ${b.status === "warning" ? "bg-amber-50 text-amber-800" : "bg-[#ECFDF5] text-[#065F46]"}`}>
              {b.status === "warning" ? "⚠ " : "✓ "}
              {b.label}
            </span>
          ))}
        </div>
      )}
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {Object.entries(TRUST_LABELS).map(([k, label]) => (
          <div key={k}>
            <div className="flex justify-between text-[12px]"><span className="font-semibold text-[#374151]">{label} ({t.weights[k]}%)</span><span className="text-[#6B7280]">{t.components[k]?.score ?? 0}</span></div>
            <div className="mt-1 h-1.5 rounded-full bg-[#F3F4F6]"><div className="h-1.5 rounded-full bg-[#E51C23]" style={{ width: `${t.components[k]?.score ?? 0}%` }} /></div>
          </div>
        ))}
      </div>
      {t.nextSteps.length > 0 && <p className="mt-3 text-[12px] text-[#6B7280]">Improve it: {t.nextSteps.join(" · ")}</p>}
      <div className="mt-4 border-t border-[#F3F4F6] pt-4">
        <p className="text-[14px] font-bold text-[#111827]">
          KYC {kyc ? <span className="ml-1 text-[12px] font-semibold capitalize text-[#6B7280]">({kyc.status}{kyc.notes ? ` - ${kyc.notes}` : ""})</span> : null}
        </p>
        {(!kyc || kyc.status === "rejected") && (
          <form onSubmit={submitKyc} className="mt-2 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <label className={labelClass}>
              ID number (PAN / Aadhaar)
              <input value={reference} onChange={(e) => setReference(e.target.value)} className={inputClass} placeholder="Only the last 4 characters are stored" />
            </label>
            <label className={labelClass}>
              ID document
              <input type="file" accept=".pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className={`${inputClass} py-2`} />
            </label>
            <button type="submit" disabled={busy || (!reference && !file)} className={primaryButton}>{busy ? "Sending…" : "Submit KYC"}</button>
          </form>
        )}
        {msg && <div className="mt-3"><Notice tone={msg.tone}>{msg.text}</Notice></div>}
      </div>
    </Card>
  );
}

function ProfileSection({ profile, onProfileChange }) {
  const { accessToken } = useAuth();
  const prefs = profile.preferences || {};
  const [roles, setRoles] = useState(profile.portalRoles || []);
  const [form, setForm] = useState({
    locations: (prefs.preferred_locations || []).join(", "),
    propertyType: prefs.property_type || "",
    transactionType: prefs.transaction_type || "",
    budgetMinLakh: prefs.budget_min ? String(Number(prefs.budget_min) / 1e5) : "",
    budgetMaxLakh: prefs.budget_max ? String(Number(prefs.budget_max) / 1e5) : "",
    bedrooms: prefs.bedrooms ?? "",
    urgency: prefs.urgency || "flexible",
  });
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState(null);
  const [copied, setCopied] = useState(false);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const toggle = (value) => setRoles((r) => (r.includes(value) ? r.filter((x) => x !== value) : [...r, value]));

  const save = async (event) => {
    event.preventDefault();
    if (!roles.length) {
      setNotice({ tone: "red", text: "Keep at least one role." });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      const updated = await portal.saveProfile(accessToken, {
        portalRoles: roles,
        preferences: {
          preferredLocations: form.locations.split(",").map((l) => l.trim()).filter(Boolean),
          propertyType: form.propertyType || null,
          transactionType: form.transactionType || null,
          budgetMin: form.budgetMinLakh ? Number(form.budgetMinLakh) * 1e5 : null,
          budgetMax: form.budgetMaxLakh ? Number(form.budgetMaxLakh) * 1e5 : null,
          bedrooms: form.bedrooms === "" ? null : Number(form.bedrooms),
          urgency: form.urgency,
        },
      });
      onProfileChange(updated);
      setNotice({ tone: "green", text: "Profile saved." });
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const code = profile.referral?.code;
  // Admin-configured message plus a sign-up link that pre-fills the code.
  const shareText = `${profile.referral?.shareMessage || ""} ${window.location.origin}/register?ref=${code || ""}`.trim();
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked - the code is visible to copy by hand
    }
  };
  const tier = profile.tier;

  return (
    <div className="flex flex-col gap-6">
      <SectionHeader title="Profile & Referral" subtitle={`${profile.user.full_name} · ${profile.user.email || profile.user.mobile || ""} · member since ${formatDate(profile.user.created_at)}`} />

      {code && (
        <Card className="bg-gradient-to-br from-white to-[#FEF2F2]">
          <p className="font-['Plus_Jakarta_Sans'] text-[12px] font-bold uppercase tracking-[0.08em] text-[#E51C23]">Your referral code</p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span className="rounded-[12px] border-2 border-dashed border-[#E51C23] bg-white px-4 py-2 font-mono text-[24px] font-black tracking-[0.08em] text-[#111827]">{code}</span>
            <button type="button" onClick={copy} className={secondaryButton}>
              {copied ? "Copied" : "Copy"}
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-[42px] items-center gap-2 rounded-[12px] bg-[#25D366] px-4 text-[14px] font-bold text-white"
            >
              Share on WhatsApp
            </a>
          </div>
          <p className="mt-3 text-[13px] text-[#6B7280]">
            Your permanent code. Friends can enter it when they sign up. {profile.referral.referredUsers} people have joined with your code so far.
          </p>
        </Card>
      )}

      <TrustCard />

      <Card>
        <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">Dashboard level: {tier.current === "full" ? "Full CRM" : "Lite"}</p>
        <p className="mt-1 text-[13px] text-[#6B7280]">
          {tier.current === "full" && tier.exempt
            ? "As an HNI investor you have the full CRM workspace from day one - deal pipeline with SLA tracking, activity log, scored deal flow, saved searches, portfolio and analytics."
            : tier.current === "full"
            ? "You've unlocked the full CRM workspace - deal pipeline, activity log, saved searches and analytics. It stays unlocked permanently."
            : `Full CRM unlocks after ${tier.dealThreshold} completed deals or ${tier.referralThreshold} people joining with your code - whichever comes first.`}
        </p>
        {tier.current === "full" && (
          <div className="mt-3">
            <a href={`${CRM_URL}/app/workspace`} target="_blank" rel="noreferrer" className={primaryButton}>
              Open my CRM workspace
            </a>
            <p className="mt-2 text-[12px] text-[#6B7280]">Sign in there with the same email / mobile and password or OTP you use on this website.</p>
          </div>
        )}
        {tier.current !== "full" && (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {[
              ["Completed deals", tier.closedDeals, tier.dealThreshold],
              ["Referred sign-ups", tier.referredUsers, tier.referralThreshold],
            ].map(([label, value, max]) => (
              <div key={label}>
                <div className="flex justify-between text-[12px] font-semibold text-[#374151]">
                  <span>{label}</span>
                  <span>
                    {value} / {max}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#F3F4F6]">
                  <div className="h-full rounded-full bg-[#E51C23]" style={{ width: `${Math.min(100, (value / max) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <form onSubmit={save} className="flex flex-col gap-5">
          <div>
            <p className={labelClass}>I'm using PropertySerch as</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ROLE_OPTIONS.map((o) => (
                <button
                  type="button"
                  key={o.value}
                  onClick={() => toggle(o.value)}
                  aria-pressed={roles.includes(o.value)}
                  className={`rounded-full border px-4 py-1.5 text-[14px] font-semibold ${
                    roles.includes(o.value) ? "border-[#E51C23] bg-[#FEF2F2] text-[#E51C23]" : "border-[#E5E7EB] text-[#374151]"
                  }`}
                >
                  {roles.includes(o.value) ? "✓ " : ""}
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#111827]">What you're looking for</p>
            <p className="text-[13px] text-[#6B7280]">Used to suggest properties. For specific searches, post a requirement.</p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <label className={labelClass}>
                Preferred cities / localities
                <input list="profile-cities" value={form.locations} onChange={set("locations")} placeholder="Gurugram, Noida" className={inputClass} />
                <datalist id="profile-cities">
                  {CITY_SUGGESTIONS.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </label>
              <label className={labelClass}>
                Looking to
                <select value={form.transactionType} onChange={set("transactionType")} className={inputClass}>
                  <option value="">-</option>
                  <option value="buy">Buy</option>
                  <option value="rent">Rent</option>
                </select>
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
                Bedrooms
                <input type="number" min="0" max="20" value={form.bedrooms} onChange={set("bedrooms")} className={inputClass} />
              </label>
              <label className={labelClass}>
                Budget from (₹ Lakh)
                <input type="number" min="0" step="0.01" value={form.budgetMinLakh} onChange={set("budgetMinLakh")} className={inputClass} />
              </label>
              <label className={labelClass}>
                Budget up to (₹ Lakh)
                <input type="number" min="0" step="0.01" value={form.budgetMaxLakh} onChange={set("budgetMaxLakh")} className={inputClass} />
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
          </div>
          {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}
          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" disabled={saving} className={primaryButton}>
              {saving ? "Saving…" : "Save profile"}
            </button>
            <Link to="/account/investor-profile" className="text-[13px] font-bold text-[#E51C23]">
              NRI or HNI investor? Set up your investor profile →
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ProfileSection;
