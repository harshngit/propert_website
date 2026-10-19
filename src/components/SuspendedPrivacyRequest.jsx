import React, { useState } from "react";
import { apiRequest } from "../api/client";

// Section 35 / DPDP: a suspended or removed account cannot sign in, but the
// person can still ask for a copy of their data or for its deletion. They
// prove who they are with their sign-in details.
export default function SuspendedPrivacyRequest({ identifier = "" }) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState({ identifier, password: "", kind: "export", reason: "" });
  const [state, setState] = useState({ busy: false, done: null, error: null });
  const input = "mt-1 block h-[42px] w-full rounded-[12px] border border-[#E5E7EB] px-3 text-[14px] text-[#111827]";
  const send = async (e) => {
    e.preventDefault();
    setState({ busy: true, done: null, error: null });
    try {
      await apiRequest("/auth/suspended-privacy-request", { method: "POST", body: f });
      setState({ busy: false, done: f.kind, error: null });
    } catch (err) {
      setState({ busy: false, done: null, error: err.message });
    }
  };
  if (!open) {
    return <button type="button" onClick={() => setOpen(true)} className="mt-2 text-[13px] font-bold text-[#E51C23]">Ask for my data or its deletion</button>;
  }
  if (state.done) {
    return (
      <p className="mt-2 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-[13px] text-emerald-800">
        {state.done === "deletion" ? "Your deletion request is recorded. Your data is anonymised within 30 days unless the law requires us to keep it." : "Your request for a copy of your data is recorded. Our privacy team will send it to your registered email."}
      </p>
    );
  }
  return (
    <div className="mt-3 space-y-3 rounded-2xl border border-[#E5E7EB] p-4">
      <p className="text-[13px] text-[#374151]">Your data rights stay with you while the account is suspended or removed.</p>
      <label className="block text-[12px] font-semibold text-[#374151]">Email or mobile<input className={input} value={f.identifier} onChange={(e) => setF({ ...f, identifier: e.target.value })} /></label>
      <label className="block text-[12px] font-semibold text-[#374151]">Password<input type="password" className={input} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} /></label>
      <div className="flex gap-4 text-[13px] text-[#374151]">
        <label className="inline-flex items-center gap-2"><input type="radio" checked={f.kind === "export"} onChange={() => setF({ ...f, kind: "export" })} />A copy of my data</label>
        <label className="inline-flex items-center gap-2"><input type="radio" checked={f.kind === "deletion"} onChange={() => setF({ ...f, kind: "deletion" })} />Delete my data</label>
      </div>
      {f.kind === "deletion" && <label className="block text-[12px] font-semibold text-[#374151]">Reason (optional)<input className={input} value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} /></label>}
      {state.error && <p className="text-[13px] font-medium text-red-600">{state.error}</p>}
      <button type="button" onClick={send} disabled={state.busy || !f.identifier || !f.password} className="h-[40px] rounded-[12px] bg-[#E51C23] px-5 text-[14px] font-bold text-white disabled:opacity-60">{state.busy ? "Sending…" : "Send request"}</button>
    </div>
  );
}
