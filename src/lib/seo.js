import { getLanguages } from "./i18n";
import { useEffect } from "react";

// Per-page SEO (sec. 21.2): title, meta description, canonical, Open Graph /
// Twitter tags and schema.org JSON-LD, written into <head> for the current
// route. Static routes are covered by ROUTE_META (see RouteSeo in App.jsx);
// data pages (a listing, an article, a city page) call useSeo() once their
// content has loaded, which overrides the route default.

export const SITE_NAME = "PropertySerch";
export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://propertyserch.com").replace(/\/$/, "");
const DEFAULT_IMAGE = `${SITE_URL}/icons/pwa-512.png`;
const DEFAULT_DESCRIPTION =
  "PropertySerch.com by A R Buildwel - buy, sell and rent verified property across India with a dedicated representative, bank auction and special situation deals, NRI and HNI services.";

function setMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!content) {
    if (el) el.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function applySeo({ title, description, path, image, jsonLd, noindex = false, type = "website" } = {}) {
  const fullTitle = title ? (title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`) : `${SITE_NAME} - Beyond Listings. Built for Deals.`;
  const desc = String(description || DEFAULT_DESCRIPTION).replace(/\s+/g, " ").trim().slice(0, 300);
  const url = `${SITE_URL}${path ?? window.location.pathname}`;
  document.title = fullTitle;
  setMeta("name", "description", desc);
  setMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  setLink("canonical", url);
  // Module 30: one hreflang alternate per offered language (only when more than English is on).
  document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
  const languages = getLanguages();
  if (languages.length > 1 && !noindex) {
    for (const l of [...languages, { code: "x-default" }]) {
      const el = document.createElement("link");
      el.setAttribute("rel", "alternate");
      el.setAttribute("hreflang", l.code === "x-default" ? l.code : `${l.code}-IN`);
      el.setAttribute("href", l.code === "en" || l.code === "x-default" ? url : `${url}${url.includes("?") ? "&" : "?"}lang=${l.code}`);
      document.head.appendChild(el);
    }
  }
  setMeta("property", "og:site_name", SITE_NAME);
  setMeta("property", "og:type", type);
  setMeta("property", "og:title", fullTitle);
  setMeta("property", "og:description", desc);
  setMeta("property", "og:url", url);
  setMeta("property", "og:image", image || DEFAULT_IMAGE);
  setMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
  setMeta("name", "twitter:title", fullTitle);
  setMeta("name", "twitter:description", desc);
  setMeta("name", "twitter:image", image || DEFAULT_IMAGE);

  document.head.querySelectorAll('script[data-seo="jsonld"]').forEach((n) => n.remove());
  const blocks = [ORGANIZATION, ...(Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [])];
  for (const block of blocks) {
    const s = document.createElement("script");
    s.type = "application/ld+json";
    s.dataset.seo = "jsonld";
    // "<" escaped so listing text can never close the script tag.
    s.textContent = JSON.stringify(block).replace(/</g, "\\u003c");
    document.head.appendChild(s);
  }
}

// Call from a page once its data is known. Pass null to leave the route default.
export function useSeo(meta, deps = []) {
  useEffect(() => {
    if (meta) applySeo(meta);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

// ------------------------------------------------------------ schema.org

export const ORGANIZATION = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${SITE_URL}/#organization`,
  name: "PropertySerch.com",
  legalName: "A R Buildwel",
  url: SITE_URL,
  logo: `${SITE_URL}/icons/pwa-512.png`,
  slogan: "Beyond Listings. Built for Deals.",
  address: {
    "@type": "PostalAddress",
    streetAddress: "G-53, Vardhman Location Plaza-II, Rajouri Garden",
    addressLocality: "New Delhi",
    postalCode: "110027",
    addressCountry: "IN",
  },
  areaServed: "IN",
};

export const websiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: SITE_URL,
  name: SITE_NAME,
  potentialAction: { "@type": "SearchAction", target: `${SITE_URL}/properties?q={search_term_string}`, "query-input": "required name=search_term_string" },
});

export const breadcrumbSchema = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, path], i) => ({ "@type": "ListItem", position: i + 1, name, item: `${SITE_URL}${path}` })),
});

export const faqSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
});

export const articleSchema = ({ title, description, image, publishedAt, updatedAt, path, author }) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: String(title || "").slice(0, 110),
  description,
  image: image ? [image] : undefined,
  datePublished: publishedAt || undefined,
  dateModified: updatedAt || publishedAt || undefined,
  author: { "@type": "Organization", name: author || "PropertySerch Editorial" },
  publisher: { "@id": `${SITE_URL}/#organization` },
  mainEntityOfPage: `${SITE_URL}${path}`,
});

// A listing: area and locality only - never a street address or a contact.
export const listingSchema = ({ id, title, description, image, price, city, locality, propertyType, bedrooms, areaSqft, transactionType }) => ({
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  url: `${SITE_URL}/properties/${id}`,
  name: title,
  description: String(description || "").slice(0, 500) || undefined,
  image: image ? [image] : undefined,
  about: {
    "@type": /apartment|flat/i.test(propertyType || "") ? "Apartment" : /house|villa/i.test(propertyType || "") ? "House" : "Residence",
    numberOfBedrooms: bedrooms || undefined,
    floorSize: areaSqft ? { "@type": "QuantitativeValue", value: Number(areaSqft), unitCode: "FTK" } : undefined,
    address: { "@type": "PostalAddress", addressLocality: locality || city, addressRegion: city, addressCountry: "IN" },
  },
  offers: price
    ? { "@type": "Offer", price: Number(price), priceCurrency: "INR", businessFunction: transactionType === "rent" ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell", seller: { "@id": `${SITE_URL}/#organization` } }
    : undefined,
});

// ------------------------------------------------------------ static routes

// [pattern, meta]. First match wins. Data pages refine this after loading.
export const ROUTE_META = [
  [/^\/$/, { title: "PropertySerch - Buy, Sell & Rent Verified Property in India", description: DEFAULT_DESCRIPTION, jsonLd: [websiteSchema()] }],
  [/^\/properties\/?$/, { title: "Search Property for Sale & Rent in India", description: "Search verified flats, houses, plots and commercial property across India - filter by locality, budget and type. Every enquiry is handled by an A R Buildwel representative." }],
  [/^\/properties\/.+/, { title: "Property details", description: "Verified property listing on PropertySerch - photos, price, verification level and locality details." }],
  [/^\/city\/.+/, { title: "Property in your city", description: "Property for sale and rent, locality insights and market trends for this city." }],
  [/^\/buy\/bank-auction-properties/, { title: "Bank Auction Properties in India", description: "Bank auction properties from SBI, IBAPI, MSTC and other banks - reserve price, EMD, auction dates and investment score in one place." }],
  [/^\/buy\/special-situation-properties/, { title: "Special Situation Properties - High-Opportunity Investment Deals", description: "Curated special situation properties with investment score, discount to market and liquidity rating for verified investors." }],
  [/^\/institutional\/asset\//, { title: 'Confidential institutional listing', description: 'Institutional asset on PropertySerch - details are shared with verified buyers under NDA.' }],
  [/^\/post-institutional/, { title: 'List an Institution' }],
  [/^\/buy\/institutional-properties/, { title: "Institutional Properties - Schools, Colleges & Campuses", description: "Schools, colleges, university campuses and other institutional assets for acquisition, with NDA-protected deal rooms." }],
  [/^\/deals\/.+/, { title: "Investment deal", description: "Investment deal on PropertySerch - verified investors see full details, score and documents." }],
  [/^\/rent/, { title: "Property for Rent in India", description: "Family homes, studio homes, PG and co-living and furnished flats for rent - with lease, rent and maintenance tracked online." }],
  [/^\/sell/, { title: "Sell or Rent Out Your Property", description: "List your property, get a valuation and let an A R Buildwel representative handle enquiries, site visits and paperwork." }],
  [/^\/tools/, { title: "Property Investment Calculators", description: "ROI, rental yield, appreciation, stamp duty and liquidity score calculators for Indian property." }],
  [/^\/for-nri/, { title: "NRI Property Services in India" }],
  [/^\/for-hni/, { title: "Property Investment Deals for HNIs" }],
  [/^\/services\/get-involved/, { title: "Get Involved - Careers, Brokers, Franchise & City Requests", description: "Join PropertySerch as a broker, builder or franchise partner, apply for a role or request your city." }],
  [/^\/news-guide\/insights-guides/, { title: "Property Insights & Guides", description: "Guides on buying, selling, investing, documentation, stamp duty and NRI property in India." }],
  [/^\/news-guide\/article\/.+/, { title: "Guide", type: "article" }],
  [/^\/legal/, { title: "Legal, Terms & Privacy", description: "Terms of service, privacy policy, RERA compliance and disclaimers for PropertySerch.com." }],
  [/^\/requirements/, { title: "Buyer & Tenant Requirements", description: "Requirements posted by buyers and tenants - area and locality only. Have a matching property? Tell us and a representative will connect." }],
  [/^\/(login|register|dashboard|account|console|post-)/, { title: "My account", noindex: true }],
];

export function metaForPath(pathname) {
  const hit = ROUTE_META.find(([re]) => re.test(pathname));
  return hit ? hit[1] : {};
}
