import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../../api/client";
import { useAuth } from "../../context/AuthContext";

// AI credit balance above the dashboard menu. Amber when it is at or below the
// user's low-balance alert; refreshes after any AI action, purchase or top-up.
export default function CreditBalance() {
  const { accessToken } = useAuth();
  const [b, setB] = useState(null);
  useEffect(() => {
    if (!accessToken) return undefined;
    let alive = true;
    const load = () => apiRequest("/ai-credits/balance", { token: accessToken }).then((r) => alive && setB(r.data)).catch(() => {});
    load();
    window.addEventListener("ai-credits-changed", load);
    return () => {
      alive = false;
      window.removeEventListener("ai-credits-changed", load);
    };
  }, [accessToken]);
  if (!b) return null;
  return (
    <Link
      to="/dashboard/ai-credits"
      className={`mb-3 flex items-center justify-between rounded-[14px] border px-4 py-2.5 font-['Plus_Jakarta_Sans'] text-[13px] ${b.low ? "border-amber-200 bg-amber-50 text-amber-800" : "border-[#E5E7EB] bg-white text-[#374151] hover:bg-slate-50"}`}
    >
      <span className="font-semibold">AI credits</span>
      <span className="font-extrabold text-[#111827]">{Number(b.balance).toLocaleString("en-IN")}{b.low ? <span className="ml-1.5 text-[11px] font-bold text-amber-700">Top up</span> : null}</span>
    </Link>
  );
}
