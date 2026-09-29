import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import {
  Badge, CITY_SUGGESTIONS, Card, EmptyState, FeeConsent, LoadState, Modal, Notice, PROPERTY_TYPES, SectionHeader,
  formatDate, formatINR, inputClass, labelClass, linkButton, primaryButton, secondaryButton, typeLabel, useLoad,
} from "./ui";

// My Requirements (Screen 5 - Post Requirement). A requirement is tagged
// Hot / Warm / Cold from its urgency and goes straight to an A R Buildwel
// representative, who shortlists properties; matched listings show under
// Matched Properties.

const URGENCY_LABELS = { immediate: "Immediately", "30_days": "Within 30 days", flexible: "Flexible" };
const AMENITY_OPTIONS = ["Gym", "Pool", "Parking", "Lift", "Power Backup", "Security", "Clubhouse", "Park", "Play Area"];

function RequirementForm({ profile, onSaved, onCancel }) {
  const { accessToken } = useAuth();
  const roles = profile.portalRoles || [];
  const prefs = profile.preferences || {};
  const [form, setForm] = useState({
    purpose: roles.includes("buyer") || !roles.includes("tenant") ? "buy" : "rent",
    propertyType: prefs.property_type || "",
    city: (prefs.preferred_locations || [])[0] || "",
    localities: "",
    budgetMin: "",
    budgetMax: prefs.budget_max ? String(Number(prefs.budget_max) / 1e5) : "",
    bedrooms: "",
    areaMin: "",
    areaMax: "",
    urgency: prefs.urgency || "flexible",
    notes: "",
    amenities: [],
    latitude: null,
    longitude: null,
  });
  const [locating, setLocating] = useState(false);
  const pinLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, latitude: Number(pos.coords.latitude.toFixed(6)), longitude: Number(pos.coords.longitude.toFixed(6)) }));
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000 }
    );
  };
  const [mandateType, setMandateType] = useState("standard");
  const [consent, setConsent] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const unit = form.purpose === "buy" ? "₹ Lakh" : "₹ Thousand / month";
  const multiplier = form.purpose === "buy" ? 1e5 : 1e3;

  const submit = async (event) => {
    event.preventDefault();
    if (!consent) {
      setError("Please accept the professional fee terms to continue.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const num = (v, m = 1) => (v === "" ? null : Number(v) * m);
      const requirement = await portal.createRequirement(accessToken, {
        purpose: form.purpose,
        propertyType: form.propertyType || null,
        city: form.city.trim(),
        localities: form.localities.split(",").map((l) => l.trim()).filter(Boolean),
        budgetMin: num(form.budgetMin, multiplier),
        budgetMax: num(form.budgetMax, multiplier),
        bedrooms: num(form.bedrooms),
        areaMinSqft: num(form.areaMin),
        areaMaxSqft: num(form.areaMax),
        urgency: form.urgency,
        notes: form.notes || undefined,
        amenities: form.amenities,
        ...(form.latitude != null ? { latitude: form.latitude, longitude: form.longitude } : {}),
        mandateType,
        feeConsent: true,
      });
      onSaved(requirement);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: "buy", label: "I want to buy" },
          { value: "rent", label: "I want to rent" },
        ].map((o) => (
          <button
            type="button"
            key={o.value}
            onClick={() => setForm((f) => ({ ...f, purpose: o.value, budgetMin: "", budgetMax: "" }))}
            className={`h-[42px] rounded-[12px] border text-[14px] font-bold ${
              form.purpose === o.value ? "border-[#E51C23] bg-[#FEF2F2] text-[#E51C23]" : "border-[#E5E7EB] text-[#374151]"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={labelClass}>
          City *
          <input required list="req-cities" value={form.city} onChange={set("city")} placeholder="e.g. Gurugram" className={inputClass} />
          <datalist id="req-cities">
            {CITY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <label className={labelClass}>
          Preferred localities
          <input value={form.localities} onChange={set("localities")} placeholder="Sector 56, Golf Course Road" className={inputClass} />
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
          Bedrooms (at least)
          <select value={form.bedrooms} onChange={set("bedrooms")} className={inputClass}>
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n} BHK{n === 5 ? "+" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Budget from ({unit})
          <input type="number" min="0" step="0.01" value={form.budgetMin} onChange={set("budgetMin")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Budget up to ({unit})
          <input type="number" min="0" step="0.01" value={form.budgetMax} onChange={set("budgetMax")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Area from (sq.ft)
          <input type="number" min="0" value={form.areaMin} onChange={set("areaMin")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Area up to (sq.ft)
          <input type="number" min="0" value={form.areaMax} onChange={set("areaMax")} className={inputClass} />
        </label>
        <label className={labelClass}>
          How soon?
          <select value={form.urgency} onChange={set("urgency")} className={inputClass}>
            {Object.entries(URGENCY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <span className={labelClass}>Must-have amenities</span>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {AMENITY_OPTIONS.map((a) => {
            const on = form.amenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                aria-pressed={on}
                onClick={() => setForm((f) => ({ ...f, amenities: on ? f.amenities.filter((x) => x !== a) : [...f.amenities, a] }))}
                className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold ${on ? "border-[#E51C23] bg-[#FEF2F2] text-[#E51C23]" : "border-[#E5E7EB] text-[#374151]"}`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-[13px]">
        <button type="button" onClick={pinLocation} disabled={locating} className={linkButton}>
          {locating ? "Locating…" : form.latitude != null ? "📍 Location pinned - update" : "📍 Pin my current location"}
        </button>
        <span className="text-[#6B7280]">Optional - matches are scored by distance from this pin (within your city's radius).</span>
      </div>
      <label className={labelClass}>
        Anything else? (optional)
        <textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="e.g. near a metro station, east facing, school nearby" className={`${inputClass} h-auto py-2`} />
      </label>
      <FeeConsent kind="requirement" mandateType={mandateType} onMandateType={setMandateType} consent={consent} onConsent={setConsent} />
      {error && <Notice tone="red">{error}</Notice>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={saving} className={primaryButton}>
          {saving ? "Posting…" : "Post requirement"}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function RequirementsSection({ profile, reloadProfile }) {
  const { accessToken } = useAuth();
  const [params, setParams] = useSearchParams();
  const { data, loading, error, reload } = useLoad((token) => portal.requirements(token));
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(null);
  const formOpen = params.get("new") === "1";
  const closeForm = () => setParams({}, { replace: true });

  const setStatus = async (requirement, status) => {
    setBusy(requirement.id);
    try {
      await portal.updateRequirement(accessToken, requirement.id, { status });
      await reload();
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    } finally {
      setBusy(null);
    }
  };

  const renew = async (requirement) => {
    setBusy(requirement.id);
    try {
      await portal.renewRequirement(accessToken, requirement.id);
      setNotice({ tone: "green", text: "Requirement renewed for another 60 days." });
      await reload();
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    } finally {
      setBusy(null);
    }
  };

  const budget = (r) => {
    const min = formatINR(r.budget_min);
    const max = formatINR(r.budget_max);
    if (!min && !max) return "Any budget";
    return `${min || "Any"} - ${max || "Any"}${r.purpose === "rent" ? " / month" : ""}`;
  };

  return (
    <div>
      <SectionHeader
        title="My Requirements"
        subtitle="Tell us what you need. A representative responds and shortlists properties, and new matching listings are alerted to you."
        action={
          <button type="button" onClick={() => setParams({ new: "1" })} className={primaryButton}>
            Post Requirement
          </button>
        }
      />
      {notice && (
        <div className="mb-4">
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      )}
      <LoadState loading={loading} error={error} onRetry={reload} />
      {data && !data.length && (
        <EmptyState
          title="No requirements yet"
          body="Post what you're looking for - budget, location and timing - and we'll match it against every live listing."
          action={
            <button type="button" onClick={() => setParams({ new: "1" })} className={primaryButton}>
              Post your first requirement
            </button>
          }
        />
      )}
      <div className="flex flex-col gap-3">
        {(data || []).map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">
                    {r.purpose === "rent" ? "Rent" : "Buy"} · {typeLabel(r.property_type)}
                    {r.bedrooms ? ` · ${r.bedrooms}+ BHK` : ""}
                  </p>
                  <Badge status={r.temperature}>{r.temperature}</Badge>
                  <Badge status={r.status} />
                  {r.mandate_type === "exclusive" && <Badge tone="blue">Priority requirement</Badge>}
                  {r.expired_at && r.status === "paused" && <Badge tone="red">Expired</Badge>}
                </div>
                <p className="mt-1 text-[14px] text-[#374151]">
                  {[...(r.localities || []), r.city].join(", ")} · {budget(r)}
                </p>
                <p className="mt-1 text-[12px] text-[#6B7280]">
                  {URGENCY_LABELS[r.urgency]} · Posted {formatDate(r.created_at)} ·{" "}
                  {r.representative_name ? `Your representative: ${r.representative_name}` : "A representative will be assigned shortly"}
                </p>
                {r.expires_at && ["active", "paused"].includes(r.status) && (
                  <p className={`mt-1 text-[12px] ${r.expired_at || new Date(r.expires_at) - Date.now() < 7 * 86400000 ? "font-semibold text-[#B45309]" : "text-[#6B7280]"}`}>
                    {r.expired_at ? `Expired on ${formatDate(r.expired_at)} - renew to keep getting matches` : `Active until ${formatDate(r.expires_at)}`}
                  </p>
                )}
                {(r.amenities || []).length > 0 && <p className="mt-1 text-[12px] text-[#6B7280]">Amenities: {r.amenities.join(", ")}</p>}
                {r.notes && <p className="mt-1 text-[13px] italic text-[#6B7280]">"{r.notes}"</p>}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {r.status === "active" && (
                  <Link to="/dashboard/matches" className={linkButton}>
                    View matches
                  </Link>
                )}
                {r.status === "active" && (
                  <button type="button" disabled={busy === r.id} onClick={() => setStatus(r, "paused")} className={linkButton}>
                    Pause
                  </button>
                )}
                {r.status === "paused" && !r.expired_at && (
                  <button type="button" disabled={busy === r.id} onClick={() => setStatus(r, "active")} className={linkButton}>
                    Resume
                  </button>
                )}
                {["active", "paused"].includes(r.status) && (r.expired_at || new Date(r.expires_at) - Date.now() < 7 * 86400000) && (
                  <button type="button" disabled={busy === r.id} onClick={() => renew(r)} className={linkButton}>
                    Renew for 60 days
                  </button>
                )}
                {["active", "paused"].includes(r.status) && (
                  <>
                    <button type="button" disabled={busy === r.id} onClick={() => setStatus(r, "fulfilled")} className={linkButton}>
                      Found one
                    </button>
                    <button type="button" disabled={busy === r.id} onClick={() => setStatus(r, "closed")} className={`${linkButton} text-[#6B7280]`}>
                      Close
                    </button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={formOpen} title="Post a requirement" onClose={closeForm} width="max-w-[720px]">
        <RequirementForm
          profile={profile}
          onCancel={closeForm}
          onSaved={() => {
            closeForm();
            setNotice({ tone: "green", text: "Requirement posted - your A R Buildwel representative will be in touch. Check Matched Properties for listings that fit." });
            reload();
            reloadProfile?.();
          }}
        />
      </Modal>
    </div>
  );
}

export default RequirementsSection;
