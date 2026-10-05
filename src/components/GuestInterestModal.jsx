import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { requestGuestOtp, submitGuestInterest } from "../api/guest";
import { track } from "../lib/tracker";

// "I'm Interested" for visitors who are not signed in (Guest Interest):
// mobile number -> OTP -> done. No account, no role, no onboarding. The
// interest becomes a lead for an A R Buildwel representative, and the guest
// sees only that representative's name and platform number - never the
// owner's or the buyer's contact. Registering later with the same number
// brings this history into the account.

const inputClass =
  "h-[44px] w-full rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 font-['Plus_Jakarta_Sans'] text-[15px] text-[#111827] outline-none focus:border-[#E51C23]";

function GuestInterestModal({ open, onClose, propertyId, requirementId, subject }) {
  const [step, setStep] = useState("mobile"); // mobile | otp | done
  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [note, setNote] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [resendIn, setResendIn] = useState(0);
  const otpRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    setStep("mobile");
    setOtp("");
    setError("");
    setResult(null);
  }, [open, propertyId, requirementId]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (resendIn <= 0) return undefined;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  useEffect(() => {
    if (step === "otp") otpRef.current?.focus();
  }, [step]);

  if (!open) return null;
  const digits = mobile.replace(/\D/g, "").slice(-10);
  const validMobile = /^[6-9]\d{9}$/.test(digits);

  const sendOtp = async (e) => {
    e?.preventDefault();
    if (!validMobile) return setError("Enter a valid 10-digit mobile number.");
    setBusy(true);
    setError("");
    try {
      const res = await requestGuestOtp(digits);
      setStep("otp");
      setResendIn(30);
      // Outside production the API echoes the code so the flow can be tested without SMS.
      if (res?.otp) setOtp(String(res.otp));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await submitGuestInterest({ mobile: digits, otp: otp.trim(), fullName: fullName.trim(), propertyId, requirementId, message: note.trim() });
      setResult(res);
      setStep("done");
      track("lead_submitted", { channel: "guest_interest", property_id: propertyId, requirement_id: requirementId });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4" onClick={onClose} role="dialog" aria-modal="true" aria-label="I'm interested">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[440px] rounded-[18px] bg-white p-6 text-left shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold text-[#111827]">I'm interested</h3>
            {subject && <p className="mt-1 text-[13px] leading-5 text-[#6B7280]">{subject}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[#6B7280]">✕</button>
        </div>

        {step === "mobile" && (
          <form onSubmit={sendOtp} className="mt-5 flex flex-col gap-3">
            <p className="text-[13px] leading-5 text-[#374151]">No sign-up needed - just verify your mobile number and our representative will call you.</p>
            <input type="tel" inputMode="numeric" autoComplete="tel" placeholder="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} className={inputClass} required />
            <input placeholder="Your name (optional)" autoComplete="name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
            <textarea rows={2} placeholder="Anything we should know? (optional)" value={note} onChange={(e) => setNote(e.target.value)} className={`${inputClass} h-auto py-2`} maxLength={500} />
            {error && <p className="text-[13px] text-red-600">{error}</p>}
            <button type="submit" disabled={busy || !validMobile} className="cta-red h-[44px] w-full rounded-[10px] text-sm font-bold text-white disabled:opacity-60">
              {busy ? "Sending code…" : "Send verification code"}
            </button>
            <p className="text-[11px] leading-4 text-[#9CA3AF]">
              Your number is shared only with your A R Buildwel representative - never with the owner, broker or any other party.
            </p>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={verify} className="mt-5 flex flex-col gap-3">
            <p className="text-[13px] leading-5 text-[#374151]">
              Enter the code sent to <b>+91 {digits}</b>.{" "}
              <button type="button" className="font-bold text-[#E51C23]" onClick={() => setStep("mobile")}>Change</button>
            </p>
            <input ref={otpRef} inputMode="numeric" autoComplete="one-time-code" placeholder="Verification code" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))} className={`${inputClass} tracking-[0.3em]`} required />
            {error && <p className="text-[13px] text-red-600">{error}</p>}
            <button type="submit" disabled={busy || otp.length < 4} className="cta-red h-[44px] w-full rounded-[10px] text-sm font-bold text-white disabled:opacity-60">
              {busy ? "Verifying…" : "Verify & register my interest"}
            </button>
            <button type="button" disabled={busy || resendIn > 0} onClick={sendOtp} className="text-[13px] font-bold text-[#E51C23] disabled:text-[#9CA3AF]">
              {resendIn > 0 ? `Resend code in ${resendIn}s` : "Resend code"}
            </button>
          </form>
        )}

        {step === "done" && result && (
          <div className="mt-5">
            <p className="text-[15px] font-bold text-emerald-700">Thank you - your interest is registered.</p>
            <div className="mt-3 rounded-[12px] bg-[#F9FAFB] p-4 text-[14px] text-[#374151]">
              {result.representative ? (
                <>
                  <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">Your representative</p>
                  <p className="mt-1 text-[16px] font-bold text-[#111827]">{result.representative.name}</p>
                  {result.representative.designation && <p className="text-[13px] text-[#6B7280]">{result.representative.designation}, A R Buildwel</p>}
                  {result.representative.platformNumber && (
                    <a href={`tel:${result.representative.platformNumber.replace(/\s/g, "")}`} className="mt-1 inline-block font-bold text-[#E51C23]">{result.representative.platformNumber}</a>
                  )}
                </>
              ) : (
                <p>{result.message}</p>
              )}
              <p className="mt-3 text-[12px] text-[#6B7280]">Reference {result.reference}</p>
            </div>
            <p className="mt-3 text-[13px] leading-5 text-[#6B7280]">
              Want to track this, save searches and get matched properties?{" "}
              <Link to="/register" className="font-bold text-[#E51C23]">Create a free account</Link> with the same mobile number - this enquiry will be waiting in it.
            </p>
            <button type="button" onClick={onClose} className="cta-red mt-5 h-[42px] w-full rounded-[10px] text-sm font-bold text-white">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuestInterestModal;
