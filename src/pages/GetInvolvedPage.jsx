import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import EnquiryModal from "../components/EnquiryModal";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import { guideItems } from "../data/homeContent";
import { submitBdLead, submitCareersApplication } from "../api/bdLeads";
import { apiRequest } from "../api/client";

// Every form on this page posts a business enquiry to /bd-leads (Super Admin
// reviews each one first). Returns a submit helper plus status for the UI.
function useEnquiry() {
  const [state, setState] = useState({ status: "idle", message: "" });
  // `resumeFile` (careers only) is sent as multipart alongside the fields.
  const submit = async (payload, resumeFile) => {
    setState({ status: "submitting", message: "" });
    try {
      const body = { ...payload, sourcePage: "/services/get-involved" };
      const res = resumeFile ? await submitCareersApplication(body, resumeFile) : await submitBdLead(body);
      setState({
        status: "done",
        message:
          res?.data?.resumeAttached === false
            ? res.message
            : "Thank you - our team will review your enquiry and get in touch.",
      });
      return true;
    } catch (err) {
      setState({ status: "error", message: err.message });
      return false;
    }
  };
  return [state, submit];
}

function FormStatus({ state, dark = false }) {
  if (!state.message) return null;
  const tone =
    state.status === "error" ? (dark ? "text-red-300" : "text-red-600") : dark ? "text-emerald-300" : "text-emerald-700";
  return <p className={`font-['Plus_Jakarta_Sans'] text-[12px] leading-[18px] ${tone}`}>{state.message}</p>;
}

function contactPayload(fullName, mobile, email) {
  return {
    fullName: fullName.trim(),
    mobile: mobile.trim() ? mobile.replace(/\D/g, "").slice(-10) : undefined,
    email: email?.trim() || undefined,
  };
}

const PARTNER_FORMS = {
  "Become a Broker Partner": { category: "broker", extraLabel: "City / area you work in", extraKey: "cityName" },
  "Become a Builder Partner": { category: "builder", extraLabel: "Company / firm name", extraKey: "businessName" },
  "Become a Franchise Partner": { category: "franchisee", extraLabel: "Territory of interest", extraKey: "territoryOfInterest" },
  // Advertising is open only to real-estate-ecosystem businesses; the
  // category list comes from the backend (admin-configurable).
  "Advertise With Us": { category: "advertiser", extraLabel: "Business name", extraKey: "businessName", advertiser: true },
};

const modalInput =
  "h-[40px] w-full rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 font-['Plus_Jakarta_Sans'] text-[13px] text-[#111827] outline-none focus:border-[#E51C23]";

function PartnerEnquiryModal({ title, onClose }) {
  const config = PARTNER_FORMS[title];
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [extra, setExtra] = useState("");
  const [message, setMessage] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [desiredPlacement, setDesiredPlacement] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [adCategories, setAdCategories] = useState([]);
  const [state, submit] = useEnquiry();

  useEffect(() => {
    if (!config.advertiser) return;
    apiRequest("/bd-leads/advertiser-categories")
      .then((res) => setAdCategories(res.data || []))
      .catch(() => {});
  }, [config.advertiser]);

  const onSubmit = async (event) => {
    event.preventDefault();
    await submit({
      category: config.category,
      ...contactPayload(fullName, mobile, email),
      [config.extraKey]: extra.trim(),
      message: message.trim() || undefined,
      ...(config.advertiser
        ? { businessCategory, desiredPlacement: desiredPlacement || undefined, budgetRange: budgetRange || undefined }
        : {}),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4" onClick={onClose}>
      <form
        onSubmit={onSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-[440px] rounded-[18px] bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold text-[#111827]">{title}</h3>
          <button type="button" onClick={onClose} aria-label="Close" className="text-[#6B7280]">✕</button>
        </div>
        {state.status === "done" ? (
          <>
            <p className="mt-4 text-sm text-emerald-700">{state.message}</p>
            <button type="button" onClick={onClose} className="cta-red mt-6 h-[40px] w-full rounded-[8px] text-sm font-bold text-white">Close</button>
          </>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            <input required placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={modalInput} />
            <input type="tel" placeholder="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} className={modalInput} />
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className={modalInput} />
            <input required placeholder={config.extraLabel} value={extra} onChange={(e) => setExtra(e.target.value)} className={modalInput} />
            {config.advertiser && (
              <>
                <select required value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} className={modalInput}>
                  <option value="">Business category</option>
                  {adCategories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select value={desiredPlacement} onChange={(e) => setDesiredPlacement(e.target.value)} className={modalInput}>
                  <option value="">Preferred placement (optional)</option>
                  <option>Home page banner</option>
                  <option>Search results</option>
                  <option>Property detail page</option>
                  <option>City pages</option>
                  <option>Newsletter</option>
                </select>
                <select value={budgetRange} onChange={(e) => setBudgetRange(e.target.value)} className={modalInput}>
                  <option value="">Monthly budget (optional)</option>
                  <option>Under ₹25,000</option>
                  <option>₹25,000 - ₹1 Lakh</option>
                  <option>₹1 - 5 Lakh</option>
                  <option>Above ₹5 Lakh</option>
                </select>
              </>
            )}
            <textarea rows={3} placeholder="Anything we should know? (optional)" value={message} onChange={(e) => setMessage(e.target.value)} className={`${modalInput} h-auto py-2`} />
            <FormStatus state={state} />
            <button type="submit" disabled={state.status === "submitting"} className="cta-red h-[40px] w-full rounded-[8px] text-sm font-bold text-white disabled:opacity-60">
              {state.status === "submitting" ? "Sending…" : "Send enquiry"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}

function BusinessGrowthPromoSection() {
  const [openForm, setOpenForm] = useState(null);
  const cards = [
    {
      title: "Become a Broker Partner",
      body: "Join 50,000+ verified agents.\nGet quality leads, premium listing tools, and exclusive market insights",
      action: "Join Network",
    },
    {
      title: "Become a Builder Partner",
      body: "Showcase projects to verified buyers.\nGenerate qualified leads, promote launches, and accelerate sales.",
      action: "Grow Your Business",
    },
    {
      title: "Become a Franchise Partner",
      body: "Build your real estate business with confidence. Manage brokers, expand your network, and grow with powerful tools.",
      action: "Get Started",
    },
    {
      title: "Advertise With Us",
      body: "Banks, NBFCs, insurers, interior designers, legal and moving services - reach buyers and owners at the right moment.",
      action: "Enquire",
    },
  ];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-4 pb-8 sm:px-6 lg:px-8 lg:py-8 xl:px-[9px]">
        <h2 className="text-center font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[30px] tracking-[0] text-[#111827] sm:text-[28px] sm:leading-[1.2] sm:tracking-[-0.03em]">
          Grow Your Business with PropertySerch
        </h2>

       <div className="mt-5 grid gap-5 lg:mt-8 lg:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <article
              key={card.title}
              className="flex h-full flex-col rounded-[22px] border border-[#E5E7EB] bg-white px-7 py-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
            >
              <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold leading-[25px] tracking-[-0.39%] text-[#111827] lg:leading-[1.25] lg:tracking-[-0.02em]">
                {card.title}
              </h3>

              <p className="mt-4 whitespace-pre-line font-['Plus_Jakarta_Sans'] text-[14px] leading-[22.75px] tracking-[-3.13%] text-[#6B7280] lg:leading-[24px] lg:tracking-normal">
                {card.body}
              </p>

              <button
                type="button"
                onClick={() => setOpenForm(card.title)}
                className="mt-5 inline-flex items-center gap-2 whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[16px] font-semibold leading-[24px] tracking-[-0.78%] text-[#E51C23] transition hover:text-[#cc171d] lg:mt-10 lg:text-[14px] lg:leading-normal lg:tracking-normal"
              >
                <span className="lg:hidden">
                  {card.title === "Become Builder Partner" || card.title === "Become Franchise Partner" ? "Grow Business" : card.action}
                </span>
                <span className="hidden lg:inline">{card.action}</span>
                <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </div>
      {openForm && <PartnerEnquiryModal title={openForm} onClose={() => setOpenForm(null)} />}
    </section>
  );
}

function CareersPromoSection() {
  const positionOptions = ["Builder", "Broker", "Marketing", "Operations", "Other"];
  const [positionOfInterest, setPositionOfInterest] = useState("");
  const [positionOpen, setPositionOpen] = useState(false);
  const positionFieldRef = useRef(null);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(true);
  const [resume, setResume] = useState(null);
  const [resumeKey, setResumeKey] = useState(0);
  const [deskOpen, setDeskOpen] = useState(false);
  const [state, submit] = useEnquiry();

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!positionOfInterest) return;
    const ok = await submit({ category: "careers", ...contactPayload(fullName, mobile, email), positionOfInterest }, resume);
    if (ok) {
      setFullName("");
      setMobile("");
      setEmail("");
      setPositionOfInterest("");
      setResume(null);
      setResumeKey((k) => k + 1);
    }
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (positionFieldRef.current && !positionFieldRef.current.contains(event.target)) {
        setPositionOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  return (
    <section className="w-full bg-white">
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#111827] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid w-full max-w-[1270px] gap-8 lg:grid-cols-[minmax(0,1fr)_374px] lg:items-center lg:gap-10 xl:gap-12">
          <div className=" max-w-[720px]">
            <span className="inline-flex h-[22px] items-center rounded-full bg-white/10 px-3 font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase leading-[15px] tracking-[1px] text-white/80">
              Careers at PropertySerch
            </span>

            <h2 className="mt-5 max-w-[720px] font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[36px] tracking-[0] text-white sm:text-[34px] lg:text-[36px] lg:leading-[1.22] lg:tracking-[-0.01em]">
              Join Our Team to that&apos;s building the Future
              <span className="block">of Real Estate</span>
            </h2>

            <p className="mt-5 max-w-[720px] font-['Plus_Jakarta_Sans'] text-[12px] leading-[18px] text-[#9CA3AF] sm:text-[18px] lg:text-[16px] lg:leading-[28px]">
              We&apos;re more than a portal, We&apos;re an operating system. We hire builders, thinkers,
              and executors who are passionate about transparency and efficiency in real estate
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:mt-8">
              <button
                type="button"
                onClick={() => setDeskOpen(true)}
                className="dark-hover-btn inline-flex h-[54px] w-full items-center justify-center rounded-[14px] bg-[#E51C23] px-7 font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-[24px] text-white transition hover:bg-[#FFFFFF] sm:w-auto sm:min-w-[255px] sm:text-[16px] lg:font-extrabold"
              >
                Contact Institutional Desk
              </button>

              <Link
                to="/buy/institutional-properties"
                className="dark-hover-btn inline-flex h-[54px] w-full items-center justify-center rounded-[14px] border border-white/15 bg-transparent px-7 font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-[24px] text-white transition hover:bg-white sm:w-auto sm:min-w-[205px] sm:text-[16px] lg:font-extrabold"
              >
                Sample Data Room
              </Link>
            </div>
          </div>

          <div
            className="w-full rounded-[18px] px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
            style={{
              background: "#323949",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0px 18px 36px rgba(0,0,0,0.18)",
            }}
          >
            <form className="flex flex-col gap-4" onSubmit={onSubmit}>
              <label className="block">
                <span className="mb-2 block font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[18px] text-white/95 lg:leading-4">
                  Full Name
                </span>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="h-[34px] w-full rounded-[8px] border border-white/10 bg-white/10 px-4 font-['Lato'] text-[14px] leading-[21px] text-white outline-none placeholder:text-[#9CA3AF] focus:border-white/15 focus:ring-1 focus:ring-white/10 lg:border-white/0 lg:bg-white/8 lg:font-sans lg:text-[12px] lg:leading-normal lg:placeholder:text-white/45"
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[18px] text-white/95 lg:leading-4">
                  Mobile Number
                </span>
                <div
                  className="flex h-[34px] items-center overflow-hidden rounded-[8px] border border-white/10 bg-white/10 px-0 font-['Lato'] text-[14px] leading-[21px] text-white/45 focus-within:ring-1 focus-within:ring-white/10 lg:border-white/0 lg:bg-white/8 lg:font-sans lg:text-[12px] lg:leading-normal"
                >
                  <span className="shrink-0 border-r border-white/10 px-4 text-white/55">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Enter your mobile number"
                    className="min-w-0 flex-1 bg-transparent px-3 text-white outline-none placeholder:text-[#9CA3AF] lg:placeholder:text-white/45"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[18px] text-white/95 lg:leading-4">
                  Email Address
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="h-[34px] w-full rounded-[8px] border border-white/10 bg-white/10 px-4 font-['Lato'] text-[14px] leading-[21px] text-white outline-none placeholder:text-[#9CA3AF] focus:border-white/15 focus:ring-1 focus:ring-white/10 lg:border-white/0 lg:bg-white/8 lg:font-sans lg:text-[12px] lg:leading-normal lg:placeholder:text-white/45"
                />
              </label>

              <label className="block">
                <span className="mb-2 block font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[18px] text-white/95 lg:leading-4">
                  Position of Interest
                </span>
                <div className="relative" ref={positionFieldRef}>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className={[
                      "pointer-events-none absolute left-[12px] top-1/2 h-[12px] w-[12px] -translate-y-1/2 text-white/55 transition-transform duration-150",
                      positionOpen ? "rotate-180" : "",
                    ].join(" ")}
                    fill="none"
                  >
                    <path
                      d="m4 6 4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <input type="hidden" name="positionOfInterest" value={positionOfInterest} />

                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={positionOpen}
                    onClick={() => setPositionOpen((open) => !open)}
                    className={[
                      "flex h-[34px] w-full items-center rounded-[8px] border bg-white/10 px-4 pl-9 text-left font-['Lato'] text-[14px] leading-[21px] text-white outline-none transition lg:bg-white/8 lg:font-sans lg:text-[12px] lg:leading-normal",
                      positionOpen
                        ? "border-white/20 ring-1 ring-white/10"
                        : "border-white/10 hover:border-white/10 lg:border-white/0",
                    ].join(" ")}
                  >
                    <span className={positionOfInterest ? "text-white" : "text-white/45"}>
                      {positionOfInterest || "Select the role you're applying for"}
                    </span>
                  </button>

                  <div
                    className={[
                      "absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[14px] border border-white/10 bg-[#262C39] shadow-[0_16px_30px_rgba(0,0,0,0.28)] transition duration-150",
                      positionOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0",
                    ].join(" ")}
                  >
                    <div className="border-b border-white/10 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                        Select a role
                      </p>
                    </div>

                    <div className="grid gap-1 p-1">
                      {positionOptions.map((option) => {
                        const active = option === positionOfInterest;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setPositionOfInterest(option);
                              setPositionOpen(false);
                            }}
                            className={[
                              "flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[12px] transition",
                              active
                                ? "bg-white/10 text-white"
                                : "text-white/82 hover:bg-white/6 hover:text-white",
                            ].join(" ")}
                          >
                            <span>{option}</span>
                            {active ? (
                              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/55">
                                Selected
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[18px] text-white/95 lg:leading-4">
                  Resume (PDF or Word, optional)
                </span>
                <input
                  key={resumeKey}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResume(e.target.files?.[0] || null)}
                  className="block w-full font-['Plus_Jakarta_Sans'] text-[12px] text-white/70 file:mr-3 file:rounded-[8px] file:border-0 file:bg-white/10 file:px-3 file:py-1.5 file:text-[12px] file:font-bold file:text-white"
                />
              </label>

              <label className="flex cursor-pointer items-start gap-[10px] pt-1">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-[1px] h-[16px] w-[16px] shrink-0 cursor-pointer rounded-[2px] border-[#E51C23] accent-[#E51C23]"
                />
                <span className="font-['Plus_Jakarta_Sans'] text-[10px] leading-[14px] text-white/60 lg:text-[9px] lg:leading-[14px]">
                  I agree to be contacted regarding my application and accept the Privacy Policy
                </span>
              </label>

              {!positionOfInterest && state.status === "idle" && fullName && (
                <p className="font-['Plus_Jakarta_Sans'] text-[12px] text-white/60">Select the role you&apos;re applying for.</p>
              )}
              <FormStatus state={state} dark />
              <button
                type="submit"
                disabled={!consent || !positionOfInterest || state.status === "submitting"}
                className="dark-hover-btn mt-2 inline-flex h-[36px] w-full items-center justify-center rounded-[8px] bg-[#E51C23] font-['Inter'] text-[14px] font-bold leading-[21px] text-white transition disabled:opacity-60 lg:font-bold"
              >
                {state.status === "submitting" ? "Submitting…" : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
      <EnquiryModal
        open={deskOpen}
        onClose={() => setDeskOpen(false)}
        topic="Institutional Desk"
        description="Buying or selling a school, college, hospital or hotel? Our institutional desk handles it confidentially."
      />
    </section>
  );
}

function GuidesSearchBenefitsSection() {
  const searchTags = [
    "Flats for Sale in Mumbai",
    "Luxury Villas in Goa",
    "Offices in Gurgaon",
    "Plot for sale in Bangalore",
    "Rent in South Delhi",
    "Penthouses in Pune",
  ];

  const benefits = ["100% Verified Users Only", "Private Contact Protection", "End-to-End Assistance"];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-[40px] sm:px-6 lg:px-8 xl:px-[9px]">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold leading-[28px] tracking-[0] text-[#111827] lg:text-[20px] lg:leading-[1.2] lg:tracking-[-0.02em]">
              Popular Real Estate Guides
            </h3>

            <div className="mt-6 space-y-5">
              {guideItems.slice(0, 2).map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="h-[56px] w-[74px] shrink-0 overflow-hidden rounded-[8px] bg-[#F3F4F6]">
                    <img
                      src={item.thumbImage}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold leading-[17.5px] text-[#111827] lg:text-[15px] lg:leading-[1.3]">
                      {item.title}
                    </h4>
                    <p className="mt-1 font-['Plus_Jakarta_Sans'] text-[10px] font-bold uppercase leading-[15px] tracking-[1.17%] text-[#9CA3AF]">
                      {item.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold leading-[28px] tracking-[0] text-[#111827] lg:text-[20px] lg:leading-[1.2] lg:tracking-[-0.02em]">
              Popular Searches
            </h3>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {searchTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex h-[28px] items-center rounded-full bg-[#F3F4F6] px-4 text-[12px] font-medium text-[#6B7280]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[18px] font-extrabold leading-[28px] tracking-[0] text-[#111827] lg:text-[20px] lg:leading-[1.2] lg:tracking-[-0.02em]">
              Why PropertySerch
            </h3>

            <div className="mt-6 space-y-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex h-[44px] items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-5 text-center font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-[24px] text-[#4B5563] shadow-[0_1px_2px_rgba(15,23,42,0.03)] lg:text-[14px] lg:leading-normal"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GetInvolvedPage() {
  const [desiredCity, setDesiredCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const cityFieldRef = useRef(null);
  const cityInputRef = useRef(null);
  const [cityOptions, setCityOptions] = useState([]);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [consent, setConsent] = useState(true);
  const [cityState, submitCity] = useEnquiry();

  // Suggestions are the cities an admin has marked "coming soon" - any
  // other city can still be typed in (requests are aggregated into a
  // demand ranking for the admin team).
  useEffect(() => {
    apiRequest("/geo/cities?status=coming_soon")
      .then((res) => setCityOptions((res.data || []).map((c) => c.city_name)))
      .catch(() => setCityOptions([]));
  }, []);

  const filteredCities = useMemo(() => {
    const query = cityInput.trim().toLowerCase();
    if (!query) {
      return cityOptions;
    }
    return cityOptions.filter((city) => city.toLowerCase().includes(query));
  }, [cityInput, cityOptions]);

  const onRequestCity = async (event) => {
    event.preventDefault();
    const city = (desiredCity || cityInput).trim();
    if (!city) return;
    const ok = await submitCity({ category: "city_addition", ...contactPayload(fullName, mobile, ""), cityName: city });
    if (ok) {
      setFullName("");
      setMobile("");
      setDesiredCity("");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (cityFieldRef.current && !cityFieldRef.current.contains(event.target)) {
        setCityOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (cityOpen) {
      requestAnimationFrame(() => {
        cityInputRef.current?.focus();
      });
    } else {
      setCityInput("");
    }
  }, [cityOpen]);

  const commitCity = (value) => {
    setDesiredCity(value);
    setCityInput(value);
    setCityOpen(false);
  };

  return (
    <main className="flex min-h-screen w-full flex-col bg-white text-slate-900">
      <SiteHeader />

      <section className="w-full border-y border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-start px-[20px] pb-[18px] pt-[25px] text-left sm:items-center sm:px-6 sm:py-10 sm:text-center lg:px-8">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold leading-[40px] tracking-[0] text-[#111827] sm:text-[38px] lg:text-[42px] lg:leading-[1.15] lg:tracking-[-0.04em]">
            Get Involved with PropertySerch
          </h1>

          <p className=" w-full max-w-[720px] font-['Plus_Jakarta_Sans'] text-[10px] leading-[15px] text-[#6B7280] sm:mt-3 sm:text-[19px] sm:leading-[30px] lg:text-[18px]">
            Whether you&apos;re an investor, developer, or industry
            professional, PropertySerch connects you with the tools and
            opportunities to grow
          </p>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1350px] px-5 pt-5 lg:px-8 lg:py-[30px]">
          <div className="mx-auto mb-[50px] flex w-full max-w-[1270px] flex-col gap-6 lg:h-[349.5839px] lg:w-[1270px] lg:max-w-none lg:flex-row lg:items-center lg:justify-between lg:gap-0">
            <div className="flex w-full min-w-0 flex-col gap-[8px] lg:h-[257px] lg:w-[632px] lg:flex-none lg:justify-center">
              <h2 className="mt-[20px] font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[32px] tracking-[0] text-[#111827] lg:text-[32px] lg:leading-[35px] lg:tracking-[-0.030em]">
                Help Us Expand
              </h2>

              <p className="m-0 max-w-[586px] font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[22px] text-[#6B7280] lg:text-[12px] lg:leading-[26px]">
                Don&apos;t see your city yet? Let us know. We&apos;re
                continuously expanding our coverage based on demand and market
                opportunities.
              </p>

              <div className="mt-[10px] lg:mt-[15px] flex flex-col gap-[20px]">
                <div className="flex items-start gap-[16px]">
                  <div className="mt-[3px] flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FFF1F1] text-[#E51C23] lg:h-[45px] lg:w-[45px]">
                    <img
                      src="/icons/Img.png"
                      alt=""
                      aria-hidden="true"
                      className="h-[20px] w-[18px] object-contain"
                    />
                  </div>

                  <div className="min-w-0 pt-[1px]">
                    <h3 className="m-0 font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-[24px] tracking-[0.29%] text-[#111827] lg:leading-[20px] lg:tracking-[0]">
                      Market Analysis
                    </h3>

                    <p className="mt-[2px] lg:mb-5 font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[20px] text-[#6B7280]">
                      We conduct deep legal and valuation audits in every new
                      city.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-[16px]">
                  <div className="mt-[3px] flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#FFF1F1] text-[#E51C23] lg:h-[45px] lg:w-[45px]">
                    <img
                      src="/icons/people.png"
                      alt=""
                      aria-hidden="true"
                      className="h-[20px] w-[20px] object-contain"
                    />
                  </div>

                  <div className="min-w-0 pt-[1px]">
                    <h3 className="m-0 font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-[24px] tracking-[0.29%] text-[#111827] lg:leading-[20px] lg:tracking-[0]">
                      Partner Onboarding
                    </h3>

                    <p className="mt-[2px] font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[20px] text-[#667085]">
                      Connecting with local legal experts and verified brokers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* right section */}

            <div
              className="w-full rounded-[16.97px] px-[32px] py-[24px] lg:h-[349.5838928222656px] lg:w-[430px] lg:flex-none lg:-ml-4"
              style={{
                background: "#FFFFFF",
                border: "1px solid #1118271A",
                boxShadow: "0px 0.71px 1.41px 0px #0000000D",
              }}
            >
              <form
                className="flex w-full flex-col gap-[16.97px] lg:min-h-[301.5838928222656px] lg:w-[366px]"
                onSubmit={onRequestCity}
              >
                <label className="block">
                  <span className="mb-[8px] block font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[18px] text-[#111827] lg:leading-[13px]">
                    Full Name
                  </span>

                  <input
                    type="text"
                    name="fullName"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="h-[34px] w-full rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-[13px] font-['Lato'] text-[14px] leading-[21px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#E51C23] focus:ring-1 focus:ring-[#E51C23]/20 lg:font-['Plus_Jakarta_Sans'] lg:text-[12px] lg:leading-normal"
                  />
                </label>

                <label className="block">
                  <span className="mb-[8px] block font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[18px] text-[#111827] lg:leading-[13px]">
                    Mobile Number
                  </span>

                  <div className="flex h-[30px] w-full items-center overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] font-['Lato'] text-[14px] leading-[21px] focus-within:border-[#E51C23] focus-within:ring-1 focus-within:ring-[#E51C23]/20 lg:font-['Plus_Jakarta_Sans'] lg:text-[12px] lg:leading-normal">
                    <span className="shrink-0 border-r border-[#E5E7EB] px-[13px] font-['Lato'] text-[14px] leading-[21px] text-[#9CA3AF] lg:font-['Plus_Jakarta_Sans'] lg:text-[10px] lg:leading-normal">
                      +91
                    </span>

                    <input
                      type="tel"
                      name="mobileNumber"
                      required
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      inputMode="numeric"
                      placeholder="Enter your mobile number"
                      className="h-[34px] min-w-0 flex-1 border-0 bg-transparent px-[9px] font-['Lato'] text-[14px] leading-[21px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:ring-0 lg:font-['Plus_Jakarta_Sans'] lg:text-[12px] lg:leading-normal"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-[8px] block font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[18px] text-[#111827] lg:leading-[13px]">
                    Desired City
                  </span>

                  <div className="relative" ref={cityFieldRef}>
                    <input
                      type="hidden"
                      name="desiredCity"
                      value={desiredCity}
                    />

                    <div
                      className={[
                        "flex h-[34px] w-full items-center rounded-[8px] border bg-[#F9FAFB] px-[12px] text-left transition",
                        cityOpen
                          ? "border-[#E51C23] ring-1 ring-[#E51C23]/20"
                          : "border-[#E5E7EB] hover:border-[#D1D5DB]",
                      ].join(" ")}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className={[
                          "mr-2 h-[12px] w-[12px] shrink-0 text-[#94A3B8] transition-transform duration-150",
                          cityOpen ? "rotate-180" : "",
                        ].join(" ")}
                        fill="none"
                      >
                        <path
                          d="m4 6 4 4 4-4"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      <input
                        ref={cityInputRef}
                        type="text"
                        aria-label="Desired City"
                        aria-haspopup="listbox"
                        aria-expanded={cityOpen}
                        value={cityOpen ? cityInput : desiredCity}
                        onFocus={() => setCityOpen(true)}
                        onChange={(event) => {
                          setCityInput(event.target.value);
                          setCityOpen(true);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            const trimmed = cityInput.trim();
                            if (trimmed) commitCity(trimmed);
                          }
                          if (event.key === "Escape") setCityOpen(false);
                        }}
                        placeholder="Select or enter your city"
                        className="min-w-0 flex-1 bg-transparent font-['Lato'] text-[14px] leading-[21px] text-[#111827] outline-none placeholder:text-[#9CA3AF] lg:font-['Plus_Jakarta_Sans'] lg:text-[12px] lg:leading-normal"
                      />
                    </div>

                    <div
                      className={[
                        "absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0px_16px_30px_rgba(15,23,42,0.10)] transition duration-150",
                        cityOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0",
                      ].join(" ")}
                    >
                      <div className="max-h-[180px] overflow-auto p-1">
                        {filteredCities.length ? (
                          filteredCities.map((city) => {
                            const active = city === desiredCity;
                            return (
                              <button
                                key={city}
                                type="button"
                                onClick={() => commitCity(city)}
                                className={[
                                  "flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left font-['Plus_Jakarta_Sans'] text-[12px] transition",
                                  active
                                    ? "bg-[#FEF2F2] text-[#E51C23]"
                                    : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827]",
                                ].join(" ")}
                              >
                                <span>{city}</span>
                                {active ? (
                                  <span className="text-[10px] font-bold uppercase tracking-[0.08em]">
                                    Selected
                                  </span>
                                ) : null}
                              </button>
                            );
                          })
                        ) : (
                          <button
                            type="button"
                            onClick={() => commitCity(cityInput.trim())}
                            className="flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left font-['Plus_Jakarta_Sans'] text-[12px] text-[#E51C23] transition hover:bg-[#FEF2F2]"
                          >
                            <span>Use “{cityInput.trim()}”</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.08em]">
                              Custom
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-[10px]">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-[1px] h-[16px] w-[16px] shrink-0 cursor-pointer rounded-[2px] border-[#E51C23] accent-[#E51C23]"
                  />

                  <span className="max-w-[270px] font-['Plus_Jakarta_Sans'] text-[10px] font-normal leading-[14px] tracking-[0.1%] text-[#374151]">
                    I agree to be contacted by PropertySerch regarding
                    availability in my requested city and accept the Privacy
                    Policy
                  </span>
                </label>

                <FormStatus state={cityState} />
                <button
                  type="submit"
                  disabled={!consent || cityState.status === "submitting"}
                  className="cta-red mt-auto inline-flex h-[35px] w-full shrink-0 items-center justify-center rounded-[7px] border-0 font-['Inter'] text-[14px] font-bold leading-[21px] text-white transition focus:outline-none focus:ring-2 focus:ring-[#E51C23]/30 disabled:opacity-60"
                >
                  {cityState.status === "submitting" ? "Sending…" : "Request City"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1" aria-hidden="true" />
      <BusinessGrowthPromoSection />
      <CareersPromoSection />
      <GuidesSearchBenefitsSection />
      <CompanyFooterSection />
    </main>
  );
}

export default GetInvolvedPage;
