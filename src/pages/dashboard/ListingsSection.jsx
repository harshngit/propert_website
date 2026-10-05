import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { portal } from "../../api/portal";
import { useAuth } from "../../context/AuthContext";
import {
  Badge, CITY_SUGGESTIONS, Card, EmptyState, LoadState, Modal, Notice, PROPERTY_TYPES, SectionHeader,
  formatDate, formatINR, inputClass, labelClass, linkButton, primaryButton, secondaryButton, typeLabel, useLoad,
} from "./ui";
import FeeConsent, { EMPTY_CONSENT, MandateStatus } from "./FeeConsent";
import ListingChecks from "./ListingChecks";
import ListingDocuments from "./ListingDocuments";

// My Listings (Screen 4 - Post Property) for sellers and owners. A posted
// property is checked by the A R Buildwel team before it goes live. The
// seller / owner sees enquiry, interest and visit counts - never the
// enquirers' contact details; the representative handles every buyer /
// tenant (mandatory intermediation).

const FURNISHING = ["Unfurnished", "Semi-Furnished", "Fully Furnished"];
const POSSESSION = ["Ready to Move", "Under Construction"];

// Sale price in lakh -> "85 Lakh" / "1.5 Cr"; rent is a plain monthly amount.
function priceString(kind, amount) {
  const n = Number(amount);
  if (kind === "rent") return String(Math.round(n));
  return n >= 100 ? `${Number((n / 100).toFixed(2))} Cr` : `${n} Lakh`;
}

function priceInput(listing) {
  const v = Number(listing.price_value);
  if (!Number.isFinite(v) || v <= 0) return "";
  return listing.transaction_type === "rent" ? String(v) : String(Number((v / 1e5).toFixed(2)));
}

function ListingForm({ existing, onSaved, onCancel }) {
  const { accessToken } = useAuth();
  const editing = !!existing;
  const [form, setForm] = useState(() => ({
    transactionType: existing?.transaction_type === "rent" ? "rent" : "sell",
    propertyType: existing?.property_type || "apartment",
    title: existing?.title || "",
    price: existing ? priceInput(existing) : "",
    city: existing?.city || "",
    locality: existing?.locality || "",
    address: existing?.address || "",
    areaSqft: existing?.area_sqft ?? "",
    bedrooms: existing?.bedrooms ?? "",
    bathrooms: existing?.bathrooms ?? "",
    furnishing: existing?.furnishing || "",
    floorNumber: existing?.floor_number ?? "",
    totalFloors: existing?.total_floors ?? "",
    possessionStatus: existing?.possession_status || "",
    description: existing?.description || "",
    pg: (existing?.tags || []).includes("PG"),
    latitude: existing?.latitude ?? "",
    longitude: existing?.longitude ?? "",
  }));
  // Module 46 consent block: OTP consent token, mandate type, price range.
  const [mandate, setMandate] = useState(EMPTY_CONSENT);
  // Engine 4 deal sourcing from direct sellers - never labelled "distressed".
  const [situationTags, setSituationTags] = useState([]);
  const [marketValueLakh, setMarketValueLakh] = useState("");
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState(null);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((f) => ({ ...f, latitude: pos.coords.latitude.toFixed(6), longitude: pos.coords.longitude.toFixed(6) }));
        setLocating(false);
      },
      () => setLocating(false),
      { timeout: 10000 },
    );
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!editing && !mandate.ready) {
      setError("Complete the professional fee consent (OTP) and choose a mandate type to continue.");
      return;
    }
    setSaving(true);
    setError(null);
    const num = (v) => (v === "" || v == null ? undefined : Number(v));
    const body = {
      title: form.title.trim(),
      propertyType: form.propertyType,
      transactionType: form.transactionType,
      price: priceString(form.transactionType, form.price),
      city: form.city.trim(),
      locality: form.locality.trim(),
      address: form.address.trim() || undefined,
      areaSqft: num(form.areaSqft),
      bedrooms: num(form.bedrooms),
      bathrooms: num(form.bathrooms),
      furnishing: form.furnishing || undefined,
      floorNumber: num(form.floorNumber),
      totalFloors: num(form.totalFloors),
      possessionStatus: form.possessionStatus || undefined,
      description: form.description.trim() || undefined,
      latitude: num(form.latitude),
      longitude: num(form.longitude),
    };
    try {
      const saved = editing
        ? await portal.updateListing(accessToken, existing.id, body)
        : await portal.createListing(accessToken, {
            ...body,
            pg: form.transactionType === "rent" && form.pg,
            mandateType: mandate.mandateType,
            consentToken: mandate.consentToken,
            ...(mandate.priceRange ? { priceRange: mandate.priceRange } : {}),
            ...(form.transactionType === "sell" && situationTags.length
              ? { situationTags, ...(marketValueLakh ? { estimatedMarketValue: Math.round(Number(marketValueLakh) * 1e5) } : {}) }
              : {}),
          });
      onSaved(saved, editing);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {editing && existing.status === "approved" && (
        <Notice tone="amber">Saving changes sends your listing back for a quick review before the update goes live.</Notice>
      )}
      <div className="grid grid-cols-2 gap-2">
        {[
          { value: "sell", label: "Sell" },
          { value: "rent", label: "Rent out" },
        ].map((o) => (
          <button
            type="button"
            key={o.value}
            onClick={() => setForm((f) => ({ ...f, transactionType: o.value, price: "" }))}
            className={`h-[42px] rounded-[12px] border text-[14px] font-bold ${
              form.transactionType === o.value ? "border-[#E51C23] bg-[#FEF2F2] text-[#E51C23]" : "border-[#E5E7EB] text-[#374151]"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>
          Title *
          <input required minLength={5} maxLength={200} value={form.title} onChange={set("title")} placeholder="e.g. 3 BHK apartment with park view" className={inputClass} />
          <span className="mt-1 block text-[11px] font-normal text-[#9CA3AF]">Don't include phone numbers or emails - enquiries come through your representative.</span>
        </label>
        <label className={labelClass}>
          Property type *
          <select value={form.propertyType} onChange={set("propertyType")} className={inputClass}>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          {form.transactionType === "rent" ? "Monthly rent (₹) *" : "Expected price (₹ Lakh) *"}
          <input required type="number" min="0" step="0.01" value={form.price} onChange={set("price")} placeholder={form.transactionType === "rent" ? "e.g. 45000" : "e.g. 150"} className={inputClass} />
          {form.price && <span className="mt-1 block text-[11px] font-normal text-[#6B7280]">= {formatINR(form.transactionType === "rent" ? form.price : Number(form.price) * 1e5)}</span>}
        </label>
        <label className={labelClass}>
          City *
          <input required list="listing-cities" value={form.city} onChange={set("city")} className={inputClass} />
          <datalist id="listing-cities">
            {CITY_SUGGESTIONS.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </label>
        <label className={labelClass}>
          Locality / sector *
          <input required value={form.locality} onChange={set("locality")} placeholder="e.g. Sector 56" className={inputClass} />
        </label>
        <label className={`${labelClass} sm:col-span-2`}>
          Full address (private - never shown publicly)
          <input value={form.address} onChange={set("address")} placeholder="Flat / house no., society, street" className={inputClass} />
        </label>
        <label className={labelClass}>
          Built-up area (sq.ft)
          <input type="number" min="1" value={form.areaSqft} onChange={set("areaSqft")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Bedrooms
          <input type="number" min="0" max="20" value={form.bedrooms} onChange={set("bedrooms")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Bathrooms
          <input type="number" min="0" max="20" value={form.bathrooms} onChange={set("bathrooms")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Furnishing
          <select value={form.furnishing} onChange={set("furnishing")} className={inputClass}>
            <option value="">-</option>
            {FURNISHING.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Floor
          <input type="number" min="0" value={form.floorNumber} onChange={set("floorNumber")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Total floors
          <input type="number" min="0" value={form.totalFloors} onChange={set("totalFloors")} className={inputClass} />
        </label>
        <label className={labelClass}>
          Possession
          <select value={form.possessionStatus} onChange={set("possessionStatus")} className={inputClass}>
            <option value="">-</option>
            {POSSESSION.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </label>
        <div className={labelClass}>
          Map location
          <div className="mt-1 flex items-center gap-2">
            <button type="button" onClick={useMyLocation} disabled={locating} className={secondaryButton}>
              {locating ? "Locating…" : form.latitude ? "Update location" : "Use my current location"}
            </button>
            {form.latitude && <span className="text-[12px] font-normal text-emerald-700">✓ Pinned</span>}
          </div>
          <span className="mt-1 block text-[11px] font-normal text-[#9CA3AF]">Use this while you're at the property.</span>
        </div>
      </div>
      <label className={labelClass}>
        Description
        <textarea rows={4} value={form.description} onChange={set("description")} placeholder="What makes it a great home - layout, light, amenities, neighbourhood" className={`${inputClass} h-auto py-2`} />
      </label>
      {form.transactionType === "rent" && !editing && (
        <label className="flex items-center gap-2 text-[14px] text-[#374151]">
          <input type="checkbox" checked={form.pg} onChange={set("pg")} className="h-4 w-4 accent-[#E51C23]" />
          This is a PG / co-living space
        </label>
      )}
      {form.transactionType === "sell" && !editing && (
        <div className="rounded-[14px] border border-[#E5E7EB] p-4">
          <p className="text-[14px] font-bold text-[#111827]">Need a quick or time-bound sale? (optional)</p>
          <p className="mt-1 text-[12px] text-[#6B7280]">
            Tagged sales are offered as Special Situation Properties to our verified investors and brokers - often the fastest route to a
            serious buyer. Your identity and contact stay private.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {[
              ["urgent_sale", "Urgent sale"],
              ["time_bound_sale", "Time-bound sale"],
              ["investor_exit", "Investor exit"],
              ["financial_distress", "Financial restructuring"],
            ].map(([value, label]) => {
              const on = situationTags.includes(value);
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setSituationTags((t) => (on ? t.filter((x) => x !== value) : [...t, value]))}
                  className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold ${on ? "border-[#E51C23] bg-[#FEF2F2] text-[#E51C23]" : "border-[#E5E7EB] text-[#374151]"}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
          {situationTags.length > 0 && (
            <label className={`${labelClass} mt-3`}>
              Your estimate of its market value (₹ Lakh)
              <input type="number" min="0" step="0.01" value={marketValueLakh} onChange={(e) => setMarketValueLakh(e.target.value)} placeholder="Helps show buyers the discount" className={inputClass} />
            </label>
          )}
        </div>
      )}
      {!editing && <FeeConsent kind="listing" accessToken={accessToken} value={mandate} onChange={setMandate} />}
      {error && <Notice tone="red">{error}</Notice>}
      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={saving || (!editing && !mandate.ready)} className={primaryButton}>
          {saving ? "Saving…" : editing ? "Save changes" : "Submit for approval"}
        </button>
        <button type="button" onClick={onCancel} className={secondaryButton}>
          Cancel
        </button>
      </div>
    </form>
  );
}

function PhotoUpload({ listing, onDone }) {
  const { accessToken } = useAuth();
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const upload = async () => {
    setSaving(true);
    setError(null);
    try {
      await portal.uploadListingPhotos(accessToken, listing.id, files, { hasCover: !!listing.primary_image });
      onDone(files.length);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[14px] text-[#6B7280]">
        Good photos get far more enquiries. Add clear, well-lit pictures of each room - JPG or PNG. The first one becomes the cover photo.
      </p>
      <input
        type="file"
        accept="image/*,video/mp4"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files || []).slice(0, 15))}
        className="text-[14px] file:mr-3 file:rounded-[10px] file:border-0 file:bg-[#FDE8E8] file:px-4 file:py-2 file:font-bold file:text-[#E51C23]"
      />
      {files.length > 0 && <p className="text-[13px] text-[#374151]">{files.length} file(s) selected</p>}
      {error && <Notice tone="red">{error}</Notice>}
      <div className="flex gap-2">
        <button type="button" onClick={upload} disabled={!files.length || saving} className={primaryButton}>
          {saving ? "Uploading…" : "Upload photos"}
        </button>
        <button type="button" onClick={() => onDone(0)} className={secondaryButton}>
          Later
        </button>
      </div>
    </div>
  );
}

function ListingEnquiries({ listing }) {
  const { data, loading, error, reload } = useLoad((token) => portal.listingEnquiries(token, listing.id), [listing.id]);
  return (
    <div>
      <p className="mb-3 text-[13px] text-[#6B7280]">
        Contact details stay with your A R Buildwel representative, who screens every {listing.transaction_type === "rent" ? "tenant" : "buyer"} and
        arranges visits with you.
      </p>
      <LoadState loading={loading} error={error} onRetry={reload} />
      {data && !data.length && <EmptyState title="No enquiries yet" body="We'll notify you when someone is interested." />}
      {data && data.length > 0 && (
        <ul className="divide-y divide-[#F3F4F6] rounded-[14px] border border-[#E5E7EB]">
          {data.map((e) => (
            <li key={e.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <div>
                <p className="text-[14px] font-semibold text-[#111827]">{e.first_name || "Interested party"}</p>
                <p className="text-[12px] text-[#6B7280]">
                  Enquired {formatDate(e.created_at)}
                  {e.visits ? ` · ${e.visits} visit(s)` : ""}
                </p>
                {e.representative_name && (
                  <p className="text-[12px] text-[#6B7280]">
                    Handled by {e.representative_name}{e.representative_number ? ` · ${e.representative_number}` : ""} - buyer details stay with your representative.
                  </p>
                )}
              </div>
              <Badge tone="blue">{e.status_label}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ListingsSection({ reloadProfile }) {
  const [checksFor, setChecksFor] = useState(null);
  const [docsFor, setDocsFor] = useState(null);
  const { accessToken } = useAuth();
  const [params, setParams] = useSearchParams();
  const { data, loading, error, reload } = useLoad((token) => portal.listings(token));
  const [notice, setNotice] = useState(null);
  const [editing, setEditing] = useState(null);
  const [photosFor, setPhotosFor] = useState(null);
  const [enquiriesFor, setEnquiriesFor] = useState(null);
  const [busy, setBusy] = useState(null);
  const formOpen = params.get("new") === "1";

  useEffect(() => {
    if (formOpen) setNotice(null);
  }, [formOpen]);

  const openEdit = async (listing) => {
    setBusy(listing.id);
    try {
      setEditing(await portal.listing(accessToken, listing.id));
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    } finally {
      setBusy(null);
    }
  };

  const act = async (listing, action, message) => {
    setBusy(listing.id);
    try {
      await portal.listingAction(accessToken, listing.id, action);
      setNotice({ tone: "green", text: message });
      await reload();
    } catch (err) {
      setNotice({ tone: "red", text: err.message });
    } finally {
      setBusy(null);
    }
  };

  const daysLeft = (d) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

  return (
    <div>
      <SectionHeader
        title="My Listings"
        subtitle="Post your property for free. Our team verifies it, and your representative handles every enquiry, visit and negotiation."
        action={
          <button type="button" onClick={() => setParams({ new: "1" })} className={primaryButton}>
            Post Property
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
          title="You haven't listed a property yet"
          body="List a property to sell or rent out. It takes a few minutes, and you'll see enquiries and visits here."
          action={
            <button type="button" onClick={() => setParams({ new: "1" })} className={primaryButton}>
              Post your property
            </button>
          }
        />
      )}
      <div className="flex flex-col gap-4">
        {(data || []).map((l) => (
          <Card key={l.id} className="p-0">
            <div className="flex flex-col gap-4 p-4 sm:flex-row">
              <div className="h-[140px] w-full shrink-0 overflow-hidden rounded-[14px] bg-[#F3F4F6] sm:w-[200px]">
                {l.primary_image ? (
                  <img src={l.primary_image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <button type="button" onClick={() => setPhotosFor(l)} className="flex h-full w-full flex-col items-center justify-center text-[13px] font-bold text-[#E51C23]">
                    <span className="text-[22px]">＋</span>
                    Add photos
                  </button>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-['Plus_Jakarta_Sans'] text-[17px] font-bold text-[#111827]">{l.title}</p>
                  <Badge status={l.status} />
                  {l.is_verified && <Badge tone="green">Verified</Badge>}
                  {l.mandate_type === "exclusive" && <Badge tone="blue">Exclusive Mandate</Badge>}
                  {l.listing_category === "special_situation" && <Badge tone="amber">Special situation</Badge>}
                  {l.verification_level > 0 && <Badge tone="green">✓ {["", "System", "Seller", "Legally", "Site"][l.verification_level]} Verified</Badge>}
                  {l.under_review && l.status === "approved" && <Badge tone="amber">Under review</Badge>}
                  {l.duplicate_status === "blocked" && <Badge tone="blue">Already listed</Badge>}
                </div>
                <p className="mt-1 text-[14px] text-[#374151]">
                  {formatINR(l.price_value) || l.price}
                  {l.transaction_type === "rent" ? " / month" : ""} · {typeLabel(l.property_type)}
                  {l.bedrooms ? ` · ${l.bedrooms} BHK` : ""} · {[l.locality, l.city].filter(Boolean).join(", ")}
                </p>
                {l.status === "rejected" && l.rejection_reason && (
                  <p className="mt-2 rounded-[10px] bg-red-50 px-3 py-2 text-[13px] text-red-700">Needs changes: {l.rejection_reason}</p>
                )}
                {l.status === "pending_approval" && <p className="mt-2 text-[13px] text-[#92400E]">Our team is reviewing your listing - usually within a day.</p>}
                <MandateStatus mandate={l.mandate} accessToken={accessToken} />
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    ["Enquiries", l.enquiry_count],
                    [l.transaction_type === "rent" ? "Interested tenants" : "Interested buyers", l.interested_count],
                    ["Site visits", l.visit_count],
                    ["Saved by", l.favourite_count],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-[10px] bg-[#F9FAFB] px-3 py-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.04em] text-[#9CA3AF]">{label}</p>
                      <p className="text-[18px] font-extrabold text-[#111827]">{value}</p>
                    </div>
                  ))}
                </div>
                {l.expires_at && (
                  <p className={`mt-2 text-[12px] ${daysLeft(l.expires_at) <= 7 ? "font-bold text-[#B45309]" : "text-[#6B7280]"}`}>
                    {daysLeft(l.expires_at) > 0 ? `Live until ${formatDate(l.expires_at)} (${daysLeft(l.expires_at)} days)` : "Expired - renew to show it again"}
                  </p>
                )}
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {l.status === "approved" && (
                    <Link to={`/properties/${l.id}`} className={linkButton}>
                      View live listing
                    </Link>
                  )}
                  <button type="button" onClick={() => setEnquiriesFor(l)} className={linkButton}>
                    Enquiries
                  </button>
                  <button type="button" onClick={() => setPhotosFor(l)} className={linkButton}>
                    Add photos
                  </button>
                  <button type="button" onClick={() => setChecksFor(l)} className={linkButton}>
                    Verification & checks
                  </button>
                  <button type="button" onClick={() => setDocsFor(l)} className={linkButton}>
                    Documents
                  </button>
                  {l.status !== "inactive" && (
                    <button type="button" disabled={busy === l.id} onClick={() => openEdit(l)} className={linkButton}>
                      Edit
                    </button>
                  )}
                  {l.status === "approved" && (
                    <button type="button" disabled={busy === l.id} onClick={() => act(l, "renew", "Listing renewed.")} className={linkButton}>
                      Renew
                    </button>
                  )}
                  {["approved", "pending_approval"].includes(l.status) && (
                    <button
                      type="button"
                      disabled={busy === l.id}
                      onClick={() => act(l, "close", `Listing closed. Congratulations if it's ${l.transaction_type === "rent" ? "rented" : "sold"}!`)}
                      className={`${linkButton} text-[#6B7280]`}
                    >
                      Mark {l.transaction_type === "rent" ? "rented" : "sold"}
                    </button>
                  )}
                  {l.status === "inactive" && (
                    <button type="button" disabled={busy === l.id} onClick={() => act(l, "reopen", "Listing sent for approval to go live again.")} className={linkButton}>
                      Relist
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal open={formOpen} title="Post your property" onClose={() => setParams({}, { replace: true })} width="max-w-[760px]">
        <ListingForm
          onCancel={() => setParams({}, { replace: true })}
          onSaved={async (saved) => {
            setParams({}, { replace: true });
            // Sec. 9.5: clean listings go live instantly; others are held for a check.
            setNotice(
              saved?.status === "approved"
                ? { tone: "green", text: saved.under_review ? "Your listing is live (a routine check is running). Add at least 3 photos to earn the System Verified badge." : "Your listing is live! Add at least 3 photos to earn the System Verified badge." }
                : saved?.duplicate_status === "blocked"
                ? { tone: "amber", text: "This property already seems to be listed. Open Verification & checks to choose how to proceed." }
                : saved?.status === "rejected"
                ? { tone: "red", text: "Your listing could not be published. See Verification & checks to appeal." }
                : { tone: "green", text: "Submitted - our team will check it shortly. Add photos now to get more enquiries." }
            );
            await reload();
            reloadProfile?.();
            setPhotosFor(saved);
          }}
        />
      </Modal>
      <Modal open={!!editing} title="Edit listing" onClose={() => setEditing(null)} width="max-w-[760px]">
        {editing && (
          <ListingForm
            existing={editing}
            onCancel={() => setEditing(null)}
            onSaved={async () => {
              setEditing(null);
              setNotice({ tone: "green", text: "Changes saved and sent for review." });
              await reload();
            }}
          />
        )}
      </Modal>
      <Modal open={!!docsFor} title={docsFor ? `Documents - ${docsFor.title}` : ""} onClose={() => setDocsFor(null)} width="max-w-[680px]">
        {docsFor && <ListingDocuments listing={docsFor} />}
      </Modal>
      <Modal open={!!checksFor} title={checksFor ? `Verification - ${checksFor.title}` : ""} onClose={() => setChecksFor(null)} width="max-w-[640px]">
        {checksFor && <ListingChecks listing={checksFor} onChanged={reload} />}
      </Modal>
      <Modal open={!!photosFor} title="Add photos" onClose={() => setPhotosFor(null)}>
        {photosFor && (
          <PhotoUpload
            listing={photosFor}
            onDone={async (count) => {
              setPhotosFor(null);
              if (count) {
                setNotice({ tone: "green", text: `${count} photo(s) uploaded.` });
                await reload();
              }
            }}
          />
        )}
      </Modal>
      <Modal open={!!enquiriesFor} title={enquiriesFor ? `Enquiries - ${enquiriesFor.title}` : ""} onClose={() => setEnquiriesFor(null)}>
        {enquiriesFor && <ListingEnquiries listing={enquiriesFor} />}
      </Modal>
    </div>
  );
}

export default ListingsSection;
