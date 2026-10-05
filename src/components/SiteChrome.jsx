import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { analyticsConfigured, consentState, setConsent } from "../lib/tracker";
import { isStandalone, onInstallAvailable, promptInstall } from "../lib/pwa";

// Site-wide overlays: the analytics-cookie choice (GA4 / Meta Pixel load
// only after "Accept") and the "install the app" prompt for the PWA.

export function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(analyticsConfigured() && !consentState());
  }, []);
  if (!show) return null;
  const choose = (granted) => {
    setConsent(granted);
    setShow(false);
  };
  return (
    <div className="fixed inset-x-0 bottom-0 z-[70] border-t border-[#E5E7EB] bg-white px-4 py-3 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.25)]" role="region" aria-label="Cookie choice">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] leading-5 text-[#374151]">
          We use analytics cookies to understand how the site is used and to measure our advertising. See our{" "}
          <Link to="/legal#privacy" className="font-bold text-[#E51C23]">privacy policy</Link>.
        </p>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => choose(false)} className="h-[38px] rounded-[10px] border border-[#E5E7EB] px-4 text-[13px] font-bold text-[#374151]">Decline</button>
          <button type="button" onClick={() => choose(true)} className="cta-red h-[38px] rounded-[10px] px-4 text-[13px] font-bold text-white">Accept</button>
        </div>
      </div>
    </div>
  );
}

const DISMISS_KEY = "ps_install_dismissed";

export function InstallPrompt() {
  const [available, setAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === "1";
    } catch {
      return false;
    }
  });
  useEffect(() => onInstallAvailable(setAvailable), []);
  if (!available || dismissed || isStandalone()) return null;
  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="fixed bottom-4 left-4 right-4 z-[65] mx-auto flex max-w-[420px] items-center gap-3 rounded-[16px] border border-[#E5E7EB] bg-white p-3 shadow-xl sm:left-auto sm:right-4">
      <img src="/icons/pwa-192.png" alt="" className="h-11 w-11 rounded-[10px]" />
      <div className="min-w-0 flex-1">
        <p className="text-[14px] font-bold text-[#111827]">Install PropertySerch</p>
        <p className="text-[12px] text-[#6B7280]">Open faster and get alerts on new matches.</p>
      </div>
      <button type="button" onClick={() => promptInstall().then((ok) => ok || dismiss())} className="cta-red h-[36px] rounded-[10px] px-3 text-[13px] font-bold text-white">Install</button>
      <button type="button" onClick={dismiss} aria-label="Not now" className="px-1 text-[#9CA3AF]">✕</button>
    </div>
  );
}
