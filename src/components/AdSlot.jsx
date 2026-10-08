import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "./PropertyCard";
import { useAuth } from "../context/AuthContext";
import { recordAdClick, serveAds } from "../api/ads";

// Module 17 - native ad slots. Every slot renders nothing when no campaign
// is booked, so pages look the same until an advertiser buys the space.
//   BannerAd                 home_hero / city_banner - one full-width banner
//   CardAds                  home_sidebar - up to two sponsored cards
//   SponsoredListings        search_sponsored (top 3, "Sponsored") and
//                            featured_listing ("Featured")
//   InstitutionalFeaturedAd  top of the institutional listings
//   LoginSplashAd            full screen once per session after login,
//                            dismissable after 3 seconds

function useAds(placement, { city, locality, propertyType, enabled = true } = {}) {
  const { accessToken } = useAuth();
  const [ads, setAds] = useState([]);
  // One id per mounted slot = one page view; re-asking (city resolving, a re-render) is not a new impression.
  const viewId = useRef(`${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`).current;
  useEffect(() => {
    if (!enabled) return undefined;
    let live = true;
    serveAds({ placement, city, locality, propertyType, token: accessToken, viewId })
      .then((list) => live && setAds(list))
      .catch(() => live && setAds([]));
    return () => {
      live = false;
    };
  }, [placement, city, locality, propertyType, enabled, accessToken, viewId]);
  const click = (ad) => recordAdClick(ad, { city, token: accessToken });
  return { ads, click };
}

const Label = ({ ad, className = "" }) => (
  <span className={`text-[10px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF] ${className}`}>{ad.label} · {ad.advertiser}</span>
);
const Rera = ({ ad, className = "text-[#9CA3AF]" }) => (ad.reraNumber ? <p className={`mt-1 text-[11px] ${className}`}>RERA: {ad.reraNumber}</p> : null);

export function BannerAd({ placement, city, locality, className = "" }) {
  const { ads, click } = useAds(placement, { city, locality });
  const ad = ads[0];
  if (!ad) return null;
  return (
    <aside className={className} aria-label="Sponsored">
      <a href={ad.ctaUrl} target="_blank" rel="noopener sponsored" onClick={() => click(ad)}
        className="relative mx-auto flex min-h-[120px] max-w-[1200px] items-center overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-[#111827] text-white">
        {ad.imageUrl && <img src={ad.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />}
        <div className="relative flex w-full flex-col gap-3 p-5 sm:flex-row sm:items-center sm:p-7">
          <div className="min-w-0 flex-1">
            <Label ad={ad} className="!text-white/70" />
            <p className="mt-1 font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold leading-tight sm:text-[26px]">{ad.headline}</p>
            {ad.body && <p className="mt-1 max-w-[640px] text-[14px] leading-6 text-white/85">{ad.body}</p>}
            <Rera ad={ad} className="text-white/60" />
          </div>
          <span className="cta-red inline-flex h-[42px] shrink-0 items-center self-start rounded-[10px] px-5 text-[14px] font-bold text-white sm:self-center">{ad.ctaLabel}</span>
        </div>
      </a>
    </aside>
  );
}

export function CardAds({ placement = "home_sidebar", city, className = "" }) {
  const { ads, click } = useAds(placement, { city });
  if (!ads.length) return null;
  return (
    <aside className={className} aria-label="Sponsored">
      <div className={`mx-auto grid max-w-[1200px] gap-4 ${ads.length > 1 ? "sm:grid-cols-2" : ""}`}>
        {ads.map((ad) => (
          <a key={ad.campaignId} href={ad.ctaUrl} target="_blank" rel="noopener sponsored" onClick={() => click(ad)} className="flex gap-4 rounded-[18px] border border-[#E5E7EB] bg-white p-4 transition hover:border-[#FCA5A5]">
            {ad.imageUrl && <img src={ad.imageUrl} alt="" className="h-[84px] w-[120px] shrink-0 rounded-[12px] object-cover" />}
            <div className="min-w-0 flex-1">
              <Label ad={ad} />
              <p className="mt-0.5 font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">{ad.headline}</p>
              {ad.body && <p className="mt-0.5 text-[13px] leading-5 text-[#6B7280]">{ad.body}</p>}
              <Rera ad={ad} />
              <span className="mt-2 inline-block text-[13px] font-bold text-[#E51C23]">{ad.ctaLabel} →</span>
            </div>
          </a>
        ))}
      </div>
    </aside>
  );
}

const inr = (v) => {
  if (v === null || v === undefined) return null;
  if (v >= 1e7) return `₹${(v / 1e7).toFixed(2).replace(/\.?0+$/, "")} Cr`;
  if (v >= 1e5) return `₹${(v / 1e5).toFixed(2).replace(/\.?0+$/, "")} Lakh`;
  return `₹${Number(v).toLocaleString("en-IN")}`;
};
const cardItem = (l) => ({
  id: l.id, title: l.title, price: inr(l.priceValue) || l.price, rate: "", location: [l.locality, l.city].filter(Boolean).join(", "), image: l.image, verified: l.verified,
  details: l.bedrooms ? `${l.bedrooms} BHK` : String(l.propertyType || "").replace(/_/g, " "), area: l.areaSqft ? `${l.areaSqft} sq.ft` : "", cardClass: "bg-slate-100",
});

// Same card as organic listings, with the label the contract requires.
export function SponsoredListings({ placement = "search_sponsored", city, locality, propertyType, heading, className = "" }) {
  const { ads, click } = useAds(placement, { city, locality, propertyType });
  const list = ads.filter((a) => a.listing);
  if (!list.length) return null;
  return (
    <aside className={className} aria-label={list[0].label}>
      {heading && <p className="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-[#6B7280]">{heading}</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((ad) => (
          <div key={ad.campaignId} className="relative" onClickCapture={() => click(ad)}>
            <PropertyCard item={cardItem(ad.listing)} showMessage={false} className="!h-[340px]" />
            <span className={`pointer-events-none absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.04em] shadow ${ad.label === "Featured" ? "bg-[#F59E0B] text-white" : "bg-white text-[#111827]"}`}>{ad.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}

// The institutional card stays masked - the same public fields as the list below it.
export function InstitutionalFeaturedAd({ city, className = "" }) {
  const { ads, click } = useAds("institutional_featured", { city });
  const ad = ads.find((a) => a.listing);
  if (!ad) return null;
  const l = ad.listing;
  return (
    <Link to={`/institutional/asset/${l.id}`} onClick={() => click(ad)} className={`block rounded-[16px] border-2 border-[#F59E0B] bg-[#FFFBEB] p-5 ${className}`}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#E51C23]">{l.assetClassLabel}</p>
        <span className="rounded-full bg-[#F59E0B] px-3 py-0.5 text-[11px] font-extrabold uppercase text-white">Featured</span>
      </div>
      <h2 className="mt-1 font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#111827]">{l.title}</h2>
      <p className="mt-1 text-[13px] text-[#6B7280]">{[l.locality, l.city].filter(Boolean).join(", ")} · {l.dealTypeLabel} · Asking {l.priceRange || "on request"}</p>
      <span className="mt-3 inline-block text-[13px] font-bold text-[#E51C23]">View and request details →</span>
    </Link>
  );
}

const SPLASH_KEY = "ps_splash_seen";

export function LoginSplashAd() {
  const { accessToken } = useAuth();
  const [seen, setSeen] = useState(() => {
    try {
      return sessionStorage.getItem(SPLASH_KEY) === "1";
    } catch {
      return true;
    }
  });
  const { ads, click } = useAds("login_splash", { enabled: !!accessToken && !seen });
  const [wait, setWait] = useState(3);
  const ad = !seen && accessToken ? ads[0] : null;
  useEffect(() => {
    if (!ad) return undefined;
    try {
      sessionStorage.setItem(SPLASH_KEY, "1");
    } catch {
      /* ignore */
    }
    const t = setInterval(() => setWait((w) => Math.max(w - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [ad?.campaignId]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!ad) return null;
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-[#111827]/90 p-4" role="dialog" aria-label="Sponsored">
      <div className="relative w-full max-w-[560px] overflow-hidden rounded-[24px] bg-white shadow-2xl">
        {ad.imageUrl && <img src={ad.imageUrl} alt="" className="h-[240px] w-full object-cover" />}
        <div className="p-6">
          <Label ad={ad} />
          <p className="mt-1 font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-tight text-[#111827]">{ad.headline}</p>
          {ad.body && <p className="mt-2 text-[15px] leading-6 text-[#4B5563]">{ad.body}</p>}
          <Rera ad={ad} />
          <div className="mt-5 flex items-center gap-3">
            {ad.ctaUrl && <a href={ad.ctaUrl} target="_blank" rel="noopener sponsored" onClick={() => { click(ad); setSeen(true); }} className="cta-red inline-flex h-[44px] items-center rounded-[10px] px-5 text-[14px] font-bold text-white">{ad.ctaLabel}</a>}
            <button type="button" disabled={wait > 0} onClick={() => setSeen(true)} className="ml-auto h-[44px] rounded-[10px] border border-[#E5E7EB] px-5 text-[14px] font-bold text-[#374151] disabled:opacity-50">{wait > 0 ? `Skip in ${wait}` : "Skip"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
