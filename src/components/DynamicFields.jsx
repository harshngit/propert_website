import { useEffect, useState } from "react";
import MapPicker from "./MapPicker";
import { apiRequest } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./dynamicFields.css";

// The same two helpers the CRM version gets from its hooks.
function useApiCall() {
  const { accessToken } = useAuth();
  return (path, options = {}) => apiRequest(path, { ...options, token: accessToken });
}
function useApiQuery(path) {
  const { accessToken } = useAuth();
  const [data, setData] = useState(null);
  useEffect(() => {
    let cancelled = false;
    apiRequest(path, { token: accessToken }).then((r) => !cancelled && setData(r.data)).catch(() => !cancelled && setData(null));
    return () => {
      cancelled = true;
    };
  }, [path, accessToken]);
  return { data };
}

// Dynamic Field Manager (sec. 5): draws the fields a Super Admin has added to
// a form, for the record's city (state-specific fields appear only there) and
// the signed-in role. Used inside the built-in forms: the parent keeps the
// values and sends them as `customFields`.
//   <DynamicFields entityType="property" city={form.city} core={form} values={custom} onChange={setCustom} errors={fieldErrors} />

const same = (a, b) => String(a) === String(b);
const empty = (v) => v === undefined || v === null || v === "" || (Array.isArray(v) && !v.length);
function test(c, values) {
  if (!c) return true;
  if (Array.isArray(c.all)) return c.all.every((x) => test(x, values));
  if (Array.isArray(c.any)) return c.any.some((x) => test(x, values));
  const v = values[c.field];
  const list = Array.isArray(c.value) ? c.value : [c.value];
  const has = (x) => (Array.isArray(v) ? v.some((y) => same(y, x)) : same(v ?? "", x ?? ""));
  switch (c.operator) {
    case "equals": return has(c.value);
    case "not_equals": return !has(c.value);
    case "in": return list.some(has);
    case "not_in": return !list.some(has);
    case "gt": return Number(v) > Number(c.value);
    case "lt": return Number(v) < Number(c.value);
    case "is_set": return !empty(v) && v !== false;
    case "is_empty": return empty(v) || v === false;
    default: return true;
  }
}
export const isShown = (field, values) => {
  const l = field.conditionalLogic;
  if (!l) return true;
  if (l.show_if && !test(l.show_if, values)) return false;
  if (l.hide_if && test(l.hide_if, values)) return false;
  return true;
};

// What to send: a phone the screen only saw masked goes back as "unchanged".
export function toPayload(values) {
  const out = {};
  for (const [k, v] of Object.entries(values || {})) out[k] = v && typeof v === "object" && v.masked ? { unchanged: true } : v === "" ? null : v;
  return out;
}

// Server errors ({ field, message }) by field name.
export const fieldErrors = (details) => Object.fromEntries((details || []).filter((e) => e.field).map((e) => [e.field, e.message]));

function Upload({ field, value, onChange }) {
  const call = useApiCall();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const multiple = !!field.validation?.multiple;
  const files = empty(value) ? [] : Array.isArray(value) ? value : [value];
  const pick = async (e) => {
    const chosen = [...e.target.files];
    e.target.value = "";
    if (!chosen.length) return;
    setBusy(true);
    setError(null);
    try {
      const done = [];
      for (const file of chosen) {
        const fd = new FormData();
        fd.append("file", file);
        done.push((await call(`/fields/${field.id}/upload`, { method: "POST", body: fd, isFormData: true })).data);
      }
      onChange(multiple ? [...files, ...done] : done[0]);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {files.map((f, i) => (
          <span key={f.path} className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] px-2.5 py-1.5 text-xs" data-no-translate>
            {field.type === "image" && f.url ? <img src={f.url} alt="" className="h-8 w-8 rounded object-cover" /> : null}
            {f.url ? <a href={f.url} target="_blank" rel="noreferrer" className="font-semibold text-[#E51C23]">{f.name}</a> : f.name}
            <button type="button" className="text-[#6B7280]" title="Remove" onClick={() => onChange(multiple ? files.filter((_, j) => j !== i) : null)}>×</button>
          </span>
        ))}
      </div>
      {(multiple || !files.length) && <input type="file" multiple={multiple} disabled={busy} accept={field.type === "image" ? "image/jpeg,image/png,image/webp" : (field.validation?.accepted_file_types || []).join(",") || undefined} onChange={pick} className="mt-1.5 block text-xs text-[#4B5563]" />}
      {busy && <p className="mt-1 text-xs text-[#6B7280]">Uploading…</p>}
      {error && <p className="mt-1 text-xs text-[#E51C23]">{error}</p>}
    </div>
  );
}

function Input({ field, value, onChange }) {
  const id = `cf-${field.name}`;
  const v = field.validation || {};
  const common = { id, className: "field-input", placeholder: field.placeholder || undefined };
  switch (field.type) {
    case "textarea":
      return <textarea {...common} rows={Number(v.rows) || 3} maxLength={v.max_length || 5000} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "number":
      return <input {...common} type="number" step={v.step || 1} min={v.min} max={v.max} value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />;
    case "decimal":
    case "currency":
      return (
        <div className="relative">
          {field.type === "currency" && <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#6B7280]">₹</span>}
          <input {...common} className={`field-input ${field.type === "currency" ? "pl-7" : ""}`} type="number" step={1 / 10 ** (v.precision ?? 2)} min={v.min ?? (field.type === "currency" ? 0 : undefined)} max={v.max} value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))} />
        </div>
      );
    case "dropdown":
      return (
        <select id={id} className="field-select" value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">Choose…</option>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    case "multiselect": {
      const list = Array.isArray(value) ? value : [];
      return (
        <div className="flex flex-wrap gap-2">
          {field.options.map((o) => {
            const on = list.includes(o.value);
            return <button type="button" key={o.value} onClick={() => onChange(on ? list.filter((x) => x !== o.value) : [...list, o.value])} className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${on ? "border-[#E51C23] bg-[#E51C23] text-white" : "border-[#E5E7EB] bg-white text-[#374151]"}`}>{o.label}</button>;
          })}
        </div>
      );
    }
    case "date":
      return <input {...common} type="date" min={v.min === "today" ? new Date().toISOString().slice(0, 10) : v.min} max={v.max === "today" ? new Date().toISOString().slice(0, 10) : v.max} value={value ? String(value).slice(0, 10) : ""} onChange={(e) => onChange(e.target.value)} />;
    case "datetime": {
      // The control works in local time; the value is kept as an ISO instant.
      const local = value ? new Date(new Date(value).getTime() - new Date(value).getTimezoneOffset() * 60000).toISOString().slice(0, 16) : "";
      return <input {...common} type="datetime-local" value={local} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")} />;
    }
    case "checkbox":
      return (
        <label className="flex items-center gap-2 text-sm text-[#1F2937]">
          <input id={id} type="checkbox" className="h-4 w-4 accent-[#E51C23]" checked={value === true} onChange={(e) => onChange(e.target.checked)} />
          Yes
        </label>
      );
    case "file":
    case "image":
      return <Upload field={field} value={value} onChange={onChange} />;
    case "email":
      return <input {...common} type="email" value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "phone":
      if (value && typeof value === "object" && value.masked) {
        return (
          <div className="flex items-center gap-3 text-sm text-[#374151]">
            <span data-no-translate>{value.countryCode} {value.number}</span>
            <button type="button" className="text-xs font-semibold text-[#E51C23]" onClick={() => onChange("")}>Change</button>
          </div>
        );
      }
      return <input {...common} type="tel" inputMode="tel" maxLength={16} value={typeof value === "object" && value ? value.number || "" : value ?? ""} onChange={(e) => onChange(e.target.value)} />;
    case "address": {
      const a = value && typeof value === "object" ? value : {};
      const set = (k) => (e) => onChange({ ...a, [k]: e.target.value });
      return (
        <div className="grid gap-2 sm:grid-cols-2">
          <input className="field-input sm:col-span-2" placeholder="Address line 1" value={a.line1 || ""} onChange={set("line1")} />
          <input className="field-input sm:col-span-2" placeholder="Address line 2" value={a.line2 || ""} onChange={set("line2")} />
          <input className="field-input" placeholder="City" value={a.city || ""} onChange={set("city")} />
          <input className="field-input" placeholder="State" value={a.state || ""} onChange={set("state")} />
          <input className="field-input" placeholder="Pincode" inputMode="numeric" maxLength={6} value={a.pincode || ""} onChange={set("pincode")} />
        </div>
      );
    }
    case "geo_point": {
      const g = value && typeof value === "object" ? value : {};
      const set = (k) => (e) => onChange({ ...g, [k]: e.target.value });
      const here = () => navigator.geolocation?.getCurrentPosition((p) => onChange({ lat: Number(p.coords.latitude.toFixed(7)), lng: Number(p.coords.longitude.toFixed(7)) }));
      return (
        <div className="space-y-2">
        <MapPicker value={g} onChange={onChange} />
        <div className="flex flex-wrap items-center gap-2">
          <input className="field-input w-36" type="number" step="any" placeholder="Latitude" value={g.lat ?? ""} onChange={set("lat")} />
          <input className="field-input w-36" type="number" step="any" placeholder="Longitude" value={g.lng ?? ""} onChange={set("lng")} />
          <button type="button" className="btn-outline btn-sm" onClick={here}>Use my location</button>
          {g.lat && g.lng ? <a className="text-xs font-semibold text-[#E51C23]" href={`https://www.google.com/maps/search/?api=1&query=${g.lat},${g.lng}`} target="_blank" rel="noreferrer">Check on the map</a> : null}
        </div>
        </div>
      );
    }
    case "rating": {
      const max = Number(v.max) || 5;
      return (
        <div className="flex gap-1">
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <button type="button" key={n} aria-label={`${n} of ${max}`} onClick={() => onChange(value === n ? "" : n)} className={`text-2xl leading-none ${Number(value) >= n ? "text-amber-500" : "text-[#D1D5DB]"}`}>★</button>
          ))}
        </div>
      );
    }
    default:
      return <input {...common} type="text" maxLength={v.max_length || 500} value={value ?? ""} onChange={(e) => onChange(e.target.value)} />;
  }
}

export default function DynamicFields({ entityType, city, module, core = {}, values = {}, onChange, errors = {}, onFields }) {
  // Wait for the typing to stop before asking which fields this city has.
  const [place, setPlace] = useState(city || "");
  useEffect(() => {
    const t = setTimeout(() => setPlace(city || ""), 500);
    return () => clearTimeout(t);
  }, [city]);
  const qs = new URLSearchParams({ entityType, ...(place ? { city: place } : {}), ...(module ? { module } : {}) }).toString();
  const { data } = useApiQuery(`/fields/form?${qs}`);
  useEffect(() => {
    if (!data) return;
    onFields?.(data.sections.flatMap((s) => s.fields));
    // Defaults for fields the record has no value for yet.
    const defaults = {};
    for (const f of data.sections.flatMap((s) => s.fields)) if (values[f.name] === undefined && f.defaultValue !== null && f.defaultValue !== undefined) defaults[f.name] = f.defaultValue;
    if (Object.keys(defaults).length) onChange({ ...defaults, ...values });
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!data || !data.count) return null;
  const all = { ...core, ...values };
  return (
    <div className="dyn-fields space-y-5">
      {data.sections.map((section) => {
        const fields = section.fields.filter((f) => isShown(f, all));
        if (!fields.length) return null;
        return (
          <div key={section.name}>
            <p className="mb-3 text-sm font-bold text-[#111827]">{section.name}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {fields.map((f) => (
                <div key={f.name} className={["textarea", "address", "multiselect", "geo_point", "file", "image"].includes(f.type) ? "sm:col-span-2" : ""}>
                  <label htmlFor={`cf-${f.name}`} className="field-label">{f.label}{f.required ? " *" : ""}</label>
                  <div className="mt-1"><Input field={f} value={values[f.name]} onChange={(v) => onChange({ ...values, [f.name]: v })} /></div>
                  {f.helpText && <p className="mt-1 text-xs text-[#6B7280]">{f.helpText}</p>}
                  {errors[f.name] && <p className="mt-1 text-xs font-semibold text-[#E51C23]">{errors[f.name]}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Read-only list of a record's custom fields (from `customFieldList` on the record).
export function CustomFieldList({ list }) {
  if (!list?.length) return null;
  const sections = [...new Set(list.map((f) => f.section))];
  return (
    <div className="space-y-4">
      {sections.map((s) => (
        <div key={s}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-[#6B7280]">{s}</p>
          <dl className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
            {list.filter((f) => f.section === s).map((f) => (
              <div key={f.name} className="flex justify-between gap-4 border-b border-[#E5E7EB] py-1.5">
                <dt className="text-[#6B7280]">{f.label}</dt>
                <dd className="text-right font-semibold text-[#111827]" data-no-translate>
                  {["file", "image"].includes(f.type)
                    ? (Array.isArray(f.value) ? f.value : [f.value]).map((x) => (x.url ? <a key={x.path} href={x.url} target="_blank" rel="noreferrer" className="block text-[#E51C23]">{x.name}</a> : <span key={x.path} className="block">{x.name}</span>))
                    : f.display}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </div>
  );
}

// The added fields of one record, shown and edited in place (the signed-in
// person's own profile). Draws nothing when no field has been added.
export function RecordFields({ entityType, entityId, city, title }) {
  const call = useApiCall();
  const form = useApiQuery(`/fields/form?${new URLSearchParams({ entityType, ...(city ? { city } : {}) }).toString()}`);
  const saved = useApiQuery(entityId ? `/fields/values/${entityType}/${entityId}` : `/fields/form?entityType=${entityType}`);
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (saved.data && entityId) setValues(saved.data.values || {});
  }, [saved.data, entityId]);
  if (!form.data?.count || !entityId || values === null) return null;
  const save = async () => {
    setBusy(true);
    setErrors({});
    setNote(null);
    try {
      const r = await call(`/fields/values/${entityType}/${entityId}`, { method: "PUT", body: { customFields: toPayload(values), ...(city ? { city } : {}) } });
      setValues(r.data.values || {});
      setNote("Saved.");
    } catch (err) {
      setErrors(fieldErrors(err.details));
      setNote(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="rounded-[16px] border border-[#E5E7EB] bg-white p-5">
      {title && <h3 className="mb-4 font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">{title}</h3>}
      <DynamicFields entityType={entityType} city={city} values={values} onChange={setValues} errors={errors} />
      <div className="mt-4 flex items-center gap-3">
        <button type="button" className="rounded-[10px] bg-[#E51C23] px-4 py-2 text-[13px] font-bold text-white disabled:opacity-60" disabled={busy} onClick={save}>{busy ? "Saving…" : "Save"}</button>
        {note && <span className="text-[12px] text-[#6B7280]">{note}</span>}
      </div>
    </div>
  );
}

// Search filters for added fields the Super Admin marked "use as a search
// filter". `value` is { <field name>: value }; send each as cf_<name>.
export function CustomFieldFilters({ city, value, onChange }) {
  const { data } = useApiQuery(`/fields/form?${new URLSearchParams({ entityType: "property", ...(city ? { city } : {}) }).toString()}`);
  const fields = (data?.sections || []).flatMap((s) => s.fields).filter((f) => f.searchable && ["dropdown", "multiselect", "checkbox", "text", "number", "rating"].includes(f.type));
  if (!fields.length) return null;
  const set = (name, v) => {
    const next = { ...value };
    if (v === "" || v === false || v === undefined) delete next[name];
    else next[name] = v;
    onChange(next);
  };
  return (
    <div className="dyn-fields flex w-full flex-col gap-3 border-t border-[#F3F4F6] pt-4">
      {fields.map((f) => (
        <label key={f.name} className="flex w-full items-center justify-between gap-3 text-[14px] font-semibold text-[#111827]">
          {f.label}
          {f.type === "checkbox" ? (
            <input type="checkbox" className="h-4 w-4 accent-[#E51C23]" checked={value[f.name] === true} onChange={(e) => set(f.name, e.target.checked)} />
          ) : f.options?.length ? (
            <select className="field-select" style={{ width: "55%" }} value={value[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)}>
              <option value="">Any</option>
              {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          ) : (
            <input className="field-input" style={{ width: "55%" }} type={f.type === "text" ? "text" : "number"} value={value[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} />
          )}
        </label>
      ))}
    </div>
  );
}
