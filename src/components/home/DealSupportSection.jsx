import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDisclaimers } from "../../api/content";

const LIQUIDITY = { high: "High", moderate: "Moderate", low: "Low" };

// Special situation / auction promo with the live top-scored deal, plus the
// financing card. Disclaimers come from the admin-editable library.
function DealSupportSection({
  topDeal,
  onFinancing,
  title = "Special Situation Properties",
  description = "Curated bank auction, NBFC, and ARC-sourced deals, each carrying an Investment Score. Access for verified brokers, NRI, and HNI users.",
  pills = ["Verified Documents", "Ready for Possession", "Legally Clear"],
  buttonText = "View Curated Deals",
  financeTitle = "Need financing?",
  financeDescription = "Home loan, construction finance, loan against property, and NRI mortgage across leading banks and NBFCs.",
  financeRange = "₹10L - ₹100Cr",
  financeButtonText = "Check Eligibility",
}) {
  const navigate = useNavigate();
  const [disclaimers, setDisclaimers] = useState({});

  useEffect(() => {
    getDisclaimers(["special_situation", "loan"])
      .then((rows) => setDisclaimers(Object.fromEntries(rows.map((d) => [d.key, d.content_html]))))
      .catch(() => {});
  }, []);

  const scoreText =
    topDeal && topDeal.investment_score != null
      ? `Top deal - Investment Score ${topDeal.investment_score}/100${topDeal.liquidity_band ? ` - Liquidity: ${LIQUIDITY[topDeal.liquidity_band]}` : ""}`
      : "Every deal carries an Investment Score";
  const dealsPath = topDeal?.listing_category === "special_situation" ? "/buy/special-situation-properties" : "/buy/bank-auction-properties";
  return (
    <>
      <div className="h-[50px]" />

      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[18px] border border-slate-200 bg-white px-6 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:px-6">
          <div className="hidden rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-[12px] font-bold uppercase tracking-[0.08em] text-slate-500 sm:inline-flex">
            {scoreText}
          </div>

          <h3 className="mt-0 text-[28px] font-black leading-9 text-slate-900 sm:mt-4 sm:text-[24px]">{title}</h3>
          <p className="mt-4 max-w-[650px] text-[14px] leading-6 text-slate-500 sm:mt-2 sm:text-[14px] sm:leading-6">{description}</p>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {pills.map((pill) => (
              <span
                key={pill}
                className="whitespace-nowrap rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.05em] text-slate-500 sm:px-3 sm:py-1.5 sm:text-[11px]"
              >
                {pill}
              </span>
            ))}
          </div>
          <button type="button" onClick={() => navigate(dealsPath)} className="cta-red mt-[18px] h-[50px] w-full rounded-[16px] px-6 py-3.5 text-[16px] font-extrabold text-white sm:mt-4 sm:h-auto sm:w-auto sm:rounded-[14px] sm:text-[16px]">
            {buttonText}
          </button>
          <p className="mt-4 hidden border-t border-slate-100 pt-4 text-[14px] leading-6 text-slate-500 sm:block">
            {disclaimers.special_situation}
          </p>
        </div>

        <div className="rounded-[18px] bg-[#E51C23] px-6 py-6 text-white shadow-[0_10px_24px_rgba(239,68,68,0.18)]">
          <h3 className="text-[28px] font-black">{financeTitle}</h3>
          <p className="mt-3 text-[14px] leading-6 text-white/90">{financeDescription}</p>
          <div className="mt-5 text-[28px] font-black leading-none">{financeRange}</div>
          <button type="button" onClick={onFinancing} className="cta-white-on-red mt-6 w-full rounded-[14px] bg-white px-6 py-3.5 text-[16px] font-extrabold text-red-500 transition hover:bg-slate-50">
            {financeButtonText}
          </button>
          <p className="mt-4 border-t border-white/20 pt-4 text-[14px] leading-6 text-white/85">
            {disclaimers.loan}
          </p>
        </div>
      </div>
    </>
  );
}

export default DealSupportSection;
