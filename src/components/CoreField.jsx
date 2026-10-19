import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { apiRequest } from "../api/client";

// Built-in fields in the Dynamic Field Manager. A form wraps itself in
// <CoreFieldsProvider entityType="property"> and writes each built-in field as
// <CoreField k="city" label="City *" className={labelClass}>...input...</CoreField>.
// The Super Admin's label, help text, required mark or "hidden" then apply; a
// field nobody has changed renders exactly as the form wrote it.
// A section that ends with <CoreSlot section="..." /> receives the built-in
// fields the Super Admin moved there; without one they stay where written.

const Ctx = createContext({});
const Slots = createContext({ slots: {}, register: () => {} });

export function CoreFieldsProvider({ entityType, children }) {
  const [core, setCore] = useState({});
  const [slots, setSlots] = useState({});
  useEffect(() => {
    let gone = false;
    apiRequest(`/fields/form?entityType=${entityType}`).then((r) => !gone && setCore(r.data?.core || {})).catch(() => {});
    return () => {
      gone = true;
    };
  }, [entityType]);
  const register = useCallback(
    (section, node) =>
      setSlots((s) => {
        if (node) return s[section] === node ? s : { ...s, [section]: node };
        if (!(section in s)) return s;
        const rest = { ...s };
        delete rest[section];
        return rest;
      }),
    []
  );
  return (
    <Ctx.Provider value={core}>
      <Slots.Provider value={{ slots, register }}>{children}</Slots.Provider>
    </Ctx.Provider>
  );
}

export const useCore = () => useContext(Ctx);

export function CoreSlot({ section }) {
  const { register } = useContext(Slots);
  const ref = useCallback((node) => register(section, node), [register, section]);
  return <div ref={ref} style={{ display: "contents" }} data-core-slot={section} />;
}

export function CoreField({ k, label, className, children, as: Tag = "label" }) {
  const c = useContext(Ctx)[k];
  const { slots } = useContext(Slots);
  if (c?.hidden && !c.locked) return null;
  let text = label;
  if (c) {
    if (c.relabelled) text = `${c.label}${/\*\s*$/.test(String(label)) ? " *" : ""}`;
    if (c.required && !c.locked && typeof text === "string" && !/\*\s*$/.test(text)) text = `${text} *`;
  }
  const el = (
    <Tag className={className} style={c && c.order !== null && c.order !== undefined ? { order: c.order } : undefined}>
      {text}
      {children}
      {c?.helpText && <span className="mt-1 block text-[11px] font-normal text-[#6B7280]">{c.helpText}</span>}
    </Tag>
  );
  const target = c?.section ? slots[c.section] : null;
  return target ? createPortal(el, target) : el;
}
