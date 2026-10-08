import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import EnquiryModal from "../components/EnquiryModal";
import { apiRequest } from "../api/client";
import { representativeLine, submitEnquiry } from "../api/leads";
import { submitBdLead } from "../api/bdLeads";
import { getDisclaimers } from "../api/content";
import { MARKETING_PAGES } from "../data/marketingPages";
import { breadcrumbSchema, faqSchema, useSeo } from "../lib/seo";
import { track } from "../lib/tracker";
import { useAuth } from "../context/AuthContext";

// Template for the launch sitemap pages - /about, /contact, /for-brokers,
// /for-buyers, /for-sellers, /institutional, /legal-coordination,
// /loan-assistance, /insurance, /due-diligence, /pricing, /advertise and
// /partner-with-us. Content lives in data/marketingPages.js. Forms create a
// CRM lead (enquiry) or a Business Leads entry (partner / advertiser).

const inputClass =
  "h-[44px] w-full rounded-[10px] border border-[#E5E7EB] bg-white px-3 font-['Plus_Jakarta_Sans'] text-[14px] text-[#111827] outline-none focus:border-[#E51C23]";
const h2 = "font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold text-[#111827]";

function InlineForm({ form, page }) {
  const { user } = useAuth();
  const [f, setF] = useState({ fullName: user?.fullName || "", mobile: user?.mobile || "", email: user?.email || "", extra: "", message: "", businessCategory: "" });
  const [partner, setPartner] = useState(page.partnerForms?.[0] || null);
  const [adCategories, setAdCategories] = useState([]);
  const [state, setState] = useState({ status: "idle", message: "" });
  const set = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
  const cfg = form.partner ? partner : form;

  useEffect(() => {
    if (!form.advertiser) return;
    apiRequest("/bd-leads/advertiser-categories").then((r) => setAdCategories(r.data || [])).catch(() => {});
  }, [form.advertiser]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const mobile = f.mobile.replace(/\D/g, "").slice(-10);
    if (!mobile && !f.email.trim()) return setState({ status: "error", message: "Please share a mobile number or email so we can reach you." });
    setState({ status: "submitting", message: "" });
    try {
      if (form.kind === "enquiry") {
        const res = await submitEnquiry({ fullName: f.fullName, mobile, email: f.email, topic: form.topic, message: `[${form.topic}] ${f.message}`.trim() });
        setState({ status: "done", message: `Thank you - ${representativeLine(res?.data?.representative)} will get in touch shortly.` });
      } else {
        await submitBdLead({
          category: cfg.category,
          fullName: f.fullName.trim(),
          mobile: mobile || undefined,
          email: f.email.trim() || undefined,
          [cfg.extraKey]: f.extra.trim(),
          message: f.message.trim() || undefined,
          ...(form.advertiser ? { businessCategory: f.businessCategory } : {}),
        });
        setState({ status: "done", message: "Thank you - our team will review this and get back to you." });
      }
      track("lead_submitted", { channel: form.kind === "enquiry" ? "page_enquiry" : `bd_${cfg.category}`, page: page.path });
    } catch (err) {
      setState({ status: "error", message: err.message });
    }
  };

  if (state.status === "done") return <p className="rounded-[12px] bg-emerald-50 px-4 py-3 text-[14px] font-semibold text-emerald-800">{state.message}</p>;
  return (
    <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
      {form.partner && (
        <div className="flex flex-wrap gap-2 sm:col-span-2">
          {page.partnerForms.map((p) => (
            <button key={p.category} type="button" onClick={() => setPartner(p)} className={`h-[38px] rounded-full border px-4 text-[13px] font-bold ${partner.category === p.category ? "border-[#E51C23] bg-[#FEF2F2] text-[#E51C23]" : "border-[#E5E7EB] bg-white text-[#374151]"}`}>
              {p.label}
            </button>
          ))}
        </div>
      )}
      <input required placeholder="Full name" autoComplete="name" value={f.fullName} onChange={set("fullName")} className={inputClass} />
      <input type="tel" placeholder="Mobile number" autoComplete="tel" value={f.mobile} onChange={set("mobile")} className={inputClass} />
      <input type="email" placeholder="Email address" autoComplete="email" value={f.email} onChange={set("email")} className={inputClass} />
      {form.kind === "bd" && <input required placeholder={cfg.extraLabel} value={f.extra} onChange={set("extra")} className={inputClass} />}
      {form.advertiser && (
        <select required value={f.businessCategory} onChange={set("businessCategory")} className={`${inputClass} sm:col-span-2`}>
          <option value="">Business category</option>
          {adCategories.map((c) => (
            <option key={c.value || c} value={c.value || c}>{c.label || c}</option>
          ))}
        </select>
      )}
      <textarea rows={3} placeholder="How can we help? (optional)" value={f.message} onChange={set("message")} maxLength={1500} className={`${inputClass} h-auto py-2 sm:col-span-2`} />
      {state.status === "error" && <p className="text-[13px] text-red-600 sm:col-span-2">{state.message}</p>}
      <button type="submit" disabled={state.status === "submitting"} className="cta-red h-[46px] rounded-[10px] px-6 text-sm font-bold text-white disabled:opacity-60 sm:w-fit">
        {state.status === "submitting" ? "Sending…" : "Send"}
      </button>
      <p className="self-center text-[11px] leading-4 text-[#9CA3AF]">Your details are used only by the A R Buildwel team to respond to you.</p>
    </form>
  );
}

function MarketingPage({ slug }) {
  const page = MARKETING_PAGES[slug];
  const [enquiry, setEnquiry] = useState(false);
  const [disclaimers, setDisclaimers] = useState([]);

  useSeo(
    {
      title: page.title,
      description: page.description,
      path: page.path,
      jsonLd: [breadcrumbSchema([["Home", "/"], [page.eyebrow, page.path]]), ...(page.faqs ? [faqSchema(page.faqs)] : [])],
    },
    [slug]
  );

  useEffect(() => {
    setDisclaimers([]);
    if (page.disclaimers?.length) getDisclaimers(page.disclaimers).then((d) => setDisclaimers(d || [])).catch(() => {});
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const Cta = ({ cta, primary }) => {
    if (!cta) return null;
    const cls = primary
      ? "cta-red inline-flex h-[48px] items-center rounded-[12px] px-6 text-[15px] font-bold text-white"
      : "inline-flex h-[48px] items-center rounded-[12px] border border-[#E5E7EB] bg-white px-6 text-[15px] font-bold text-[#111827] hover:border-[#FCA5A5]";
    if (cta.enquiry) return <button type="button" onClick={() => setEnquiry(true)} className={cls}>{cta.label}</button>;
    return <Link to={cta.to} className={cls}>{cta.label}</Link>;
  };
  const enquiryForm = page.form?.kind === "enquiry";

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      {enquiryForm && <EnquiryModal open={enquiry} onClose={() => setEnquiry(false)} topic={page.form.topic} title={page.form.title} description="Share a few details and a representative will call you back." />}

      <section className="bg-[#FEF2F2]">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-20">
          <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-bold uppercase tracking-[0.08em] text-[#E51C23]">{page.eyebrow}</p>
          <h1 className="mt-2 max-w-[780px] font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold leading-tight text-[#111827] sm:text-[44px]">{page.heading}</h1>
          <p className="mt-4 max-w-[660px] text-[16px] leading-7 text-[#4B5563]">{page.lead}</p>
          {(page.primary || page.secondary) && (
            <div className="mt-7 flex flex-wrap gap-3">
              <Cta cta={page.primary} primary />
              <Cta cta={page.secondary} primary={!page.primary} />
            </div>
          )}
        </div>
      </section>

      {page.feeRows && (
        <section className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6">
          <h2 className={h2}>Professional fee</h2>
          <div className="mt-5 overflow-x-auto rounded-[16px] border border-[#E5E7EB]">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead className="bg-[#F9FAFB] text-[12px] uppercase tracking-[0.06em] text-[#6B7280]">
                <tr><th className="px-5 py-3">Transaction</th><th className="px-5 py-3">Fee</th><th className="px-5 py-3">When it is payable</th></tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {page.feeRows.map(([a, b, c]) => (
                  <tr key={a}><td className="px-5 py-4 font-semibold text-[#111827]">{a}</td><td className="px-5 py-4 font-bold text-[#E51C23]">{b}</td><td className="px-5 py-4 text-[#4B5563]">{c}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 list-disc space-y-1 pl-5 text-[14px] leading-6 text-[#4B5563]">{page.feeNotes.map((n) => <li key={n}>{n}</li>)}</ul>
        </section>
      )}

      {page.compare && (
        <section className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6">
          <h2 className={h2}>{page.compare.title}</h2>
          <div className="mt-5 overflow-x-auto rounded-[16px] border border-[#E5E7EB]">
            <table className="w-full min-w-[640px] text-left text-[14px]">
              <thead className="bg-[#F9FAFB] text-[13px] text-[#111827]">
                <tr>{page.compare.columns.map((c, i) => <th key={i} className="px-5 py-3 font-bold">{c}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-[#F3F4F6]">
                {page.compare.rows.map(([label, a, b]) => (
                  <tr key={label}><td className="px-5 py-3 text-[#374151]">{label}</td><td className="px-5 py-3 font-semibold text-[#111827]">{a}</td><td className="px-5 py-3 text-[#6B7280]">{b}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {page.benefits && (
        <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {page.benefits.map(([title, body]) => (
              <div key={title} className="rounded-[16px] border border-[#E5E7EB] p-5">
                <h3 className="font-['Plus_Jakarta_Sans'] text-[16px] font-bold text-[#111827]">{title}</h3>
                <p className="mt-1 text-[14px] leading-6 text-[#6B7280]">{body}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {page.steps && (
        <section className="bg-[#F9FAFB]">
          <div className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6">
            <h2 className={h2}>{page.stepsTitle || "How it works"}</h2>
            <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {page.steps.map((step, i) => (
                <li key={step} className="rounded-[16px] bg-white p-5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E51C23] text-[14px] font-bold text-white">{i + 1}</span>
                  <p className="mt-3 text-[14px] font-semibold leading-6 text-[#111827]">{step}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {page.callout && (
        <section className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6">
          <div className="rounded-[16px] border border-[#FCA5A5] bg-[#FEF2F2] p-6">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#111827]">{page.callout.title}</h2>
            <p className="mt-2 max-w-[820px] text-[14px] leading-6 text-[#4B5563]">{page.callout.body}</p>
            {page.callout.link && <Link to={page.callout.link[1]} className="mt-3 inline-block text-[14px] font-bold text-[#E51C23]">{page.callout.link[0]} →</Link>}
          </div>
        </section>
      )}

      {page.facts && (
        <section className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6">
          <dl className="grid gap-4 sm:grid-cols-3">
            {page.facts.map(([k, v]) => (
              <div key={k} className="rounded-[16px] border border-[#E5E7EB] p-5">
                <dt className="text-[12px] font-bold uppercase tracking-[0.06em] text-[#6B7280]">{k}</dt>
                <dd className="mt-1 text-[14px] leading-6 text-[#111827]">{v}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {page.faqs && (
        <section className="mx-auto max-w-[900px] px-4 pt-12 sm:px-6">
          <h2 className={h2}>Common questions</h2>
          <div className="mt-4 divide-y divide-[#F3F4F6] rounded-[16px] border border-[#E5E7EB]">
            {page.faqs.map(([q, a]) => (
              <details key={q} className="group px-5 py-4">
                <summary className="cursor-pointer list-none font-['Plus_Jakarta_Sans'] text-[15px] font-bold text-[#111827]">{q}</summary>
                <p className="mt-2 text-[14px] leading-6 text-[#4B5563]">{a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {page.form && (page.form.inline || page.form.kind === "bd") && (
        <section className="mx-auto max-w-[900px] px-4 pt-12 sm:px-6" id="enquire">
          <div className="rounded-[18px] border border-[#E5E7EB] bg-[#F9FAFB] p-6">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold text-[#111827]">{page.form.title}</h2>
            {page.note && <p className="mt-1 text-[13px] text-[#6B7280]">{page.note}</p>}
            <div className="mt-4"><InlineForm form={page.form} page={page} /></div>
          </div>
        </section>
      )}
      {page.form && !page.form.inline && page.form.kind === "enquiry" && (
        <section className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6">
          <div className="flex flex-col items-start justify-between gap-4 rounded-[18px] bg-[#111827] p-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold text-white">{page.form.title}</h2>
              <p className="mt-1 text-[14px] text-[#D1D5DB]">{page.note || "A representative will call you back."}</p>
            </div>
            <button type="button" onClick={() => setEnquiry(true)} className="cta-red h-[46px] shrink-0 rounded-[12px] px-6 text-[15px] font-bold text-white">Request a call back</button>
          </div>
        </section>
      )}

      {page.links && (
        <section className="mx-auto max-w-[1200px] px-4 pt-8 sm:px-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {page.links.map(([label, to]) => <Link key={to} to={to} className="text-[14px] font-bold text-[#E51C23]">{label} →</Link>)}
          </div>
        </section>
      )}

      {disclaimers.length > 0 && (
        <section className="mx-auto max-w-[1200px] px-4 pt-10 sm:px-6">
          <div className="rounded-xl bg-[#F9FAFB] px-5 py-4 text-[12px] leading-5 text-[#6B7280]">
            {disclaimers.map((d) => (
              <p key={d.key} className="mt-1 first:mt-0">
                <span className="font-semibold text-[#4B5563]">{d.title}: </span>
                <span dangerouslySetInnerHTML={{ __html: d.content_html }} />
              </p>
            ))}
          </div>
        </section>
      )}

      <CompanyFooterSection />
    </main>
  );
}

export default MarketingPage;
