import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/client";
import { getLanguage, getLanguages, setLanguage, subscribe } from "../lib/i18n";

// Module 30: the language choice. Hidden while only English is switched on.
// The choice is kept on the device and, when signed in, on the account.
export default function LanguageSwitcher({ className = "" }) {
  const { accessToken } = useAuth();
  const [, tick] = useState(0);
  useEffect(() => subscribe(() => tick((n) => n + 1)), []);
  // A signed-in person's saved language follows them to a new device.
  useEffect(() => {
    if (!accessToken) return;
    let hasLocal = false;
    try { hasLocal = !!localStorage.getItem("ps_lang"); } catch { hasLocal = true; }
    if (hasLocal) return;
    apiRequest("/i18n/me", { token: accessToken }).then((r) => r.data?.language && setLanguage(r.data.language)).catch(() => {});
  }, [accessToken]);
  const languages = getLanguages();
  if (languages.length < 2) return null;
  const choose = async (code) => {
    const lang = await setLanguage(code);
    if (accessToken) apiRequest("/i18n/me", { method: "PUT", token: accessToken, body: { language: lang } }).catch(() => {});
  };
  return (
    <select
      data-no-translate
      aria-label="Language"
      value={getLanguage()}
      onChange={(e) => choose(e.target.value)}
      className={`h-9 cursor-pointer rounded-[10px] border border-[#E5E7EB] bg-white px-2 text-[13px] font-bold text-[#111827] ${className}`}
    >
      {languages.map((l) => <option key={l.code} value={l.code}>{l.nativeName}</option>)}
    </select>
  );
}
