import React from "react";
import { Link, useLocation } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";

const documentationNav = [
  { id: "terms", label: "Terms of Service", active: true },
  { id: "privacy", label: "Privacy Policy" },
  { id: "dpdp", label: "DPDP Notice" },
  { id: "disclaimers", label: "Disclaimers" },
  { id: "cookies", label: "Cookie Policy" },
];

const termsSections = [
  {
    number: "1.",
    title: "Introduction",
    body: [
      "All the text below is just placeholder for design purpose only.",
      "Welcome to PropertySerch. These Terms of Service (\"Terms\") govern your access to and use of our website, mobile applications, and related services. By accessing or using PropertySerch, you agree to comply with these Terms. If you do not agree, please discontinue use of the platform.",
    ],
  },
  {
    number: "2.",
    title: "Eligibility",
    body: [
      "You must be at least 18 years old and legally capable of entering into binding agreements to use our services. Users are responsible for providing accurate and up-to-date account information.",
    ],
  },
  {
    number: "3.",
    title: "Platform Services",
    body: [
      "PropertySerch provides a digital platform for property discovery, listing management, buyer-seller interactions, and related real estate services. We act as a technology platform and do not directly participate in property transactions unless explicitly stated.",
    ],
  },
  {
    number: "4.",
    title: "User Responsibilities",
    body: [
      "Users agree to:",
      "Provide accurate information.",
      "Verify property details independently.",
      "Use the platform lawfully and ethically.",
      "Respect other users and comply with applicable regulations.",
    ],
    list: true,
  },
  {
    number: "5.",
    title: "Property Listings",
    body: [
      "Property information is provided by owners, developers, brokers, or authorized representatives. While reasonable verification measures may be performed, users should independently validate all listing details before making decisions.",
    ],
  },
  {
    number: "6.",
    title: "Intellectual Property",
    body: [
      "All content, trademarks, logos, designs, and software available on PropertySerch remain the property of their respective owners and may not be copied, reproduced, or distributed without prior written permission.",
    ],
  },
  {
    number: "7.",
    title: "Limitation of Liability",
    body: [
      "PropertySerch is provided on an \"as available\" basis. We do not guarantee the accuracy, completeness, or availability of listings and are not liable for disputes arising between platform users.",
    ],
  },
  {
    number: "8.",
    title: "Contact",
    body: [
      "For questions regarding these Terms, please contact our support team through the official PropertySerch contact channels.",
    ],
  },
];

const privacySections = [
  {
    number: "1.",
    title: "Privacy Overview",
    body: [
      "PropertySerch respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how information is collected, used, and protected when using our platform.",
    ],
  },
  {
    number: "2.",
    title: "Information We Collect",
    body: [
      "We may collect:",
      "Name",
      "Email address",
      "Mobile number",
      "City and location preferences",
      "Property interests",
      "Uploaded documents where required",
      "Usage and device information",
    ],
    list: true,
  },
  {
    number: "3.",
    title: "How We Use Your Information",
    body: [
      "Your information may be used to:",
      "Deliver platform services",
      "Verify accounts and inquiries",
      "Improve user experience",
      "Send service-related communications",
      "Respond to support requests",
    ],
    list: true,
  },
  {
    number: "4.",
    title: "Data Sharing",
    body: [
      "Information may be shared with verified partners, service providers, or legal authorities where required by applicable laws. Personal information is never sold to third parties.",
    ],
  },
  {
    number: "5.",
    title: "Cookies & Analytics",
    body: [
      "We may use cookies and analytics technologies to improve website performance, remember user preferences, and understand platform usage.",
    ],
  },
  {
    number: "6.",
    title: "Data Security",
    body: [
      "Reasonable technical and organizational measures are implemented to protect personal information from unauthorized access, disclosure, or misuse.",
    ],
  },
  {
    number: "7.",
    title: "Your Rights",
    body: [
      "Depending on applicable regulations, you may request access to, correction of, or deletion of your personal information by contacting our support team.",
    ],
  },
  {
    number: "8.",
    title: "Contact",
    body: [
      "For privacy-related questions or requests, please contact PropertySerch through our official support channels.",
      "Email: privacy@propertyserch.com",
    ],
  },
];

function PublicLegalPage() {
  const location = useLocation();
  const activeId = location.hash.replace("#", "") || "terms";

  return (
    <main className="flex min-h-screen w-full flex-col bg-[#F8FAFC] text-slate-900">
      <SiteHeader />

      <section className=" w-full border-0 border-t border-[#E5E7EB] bg-white">
        <div className="mx-auto w-full max-w-[1180px] px-4 py-11 text-center sm:px-6 lg:px-8 lg:py-12">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold leading-[1.15] tracking-[-0.04em] text-[#111827] sm:text-[36px] lg:text-[38px]">
            Legal Documentation
          </h1>

          <p className="mt-3 text-[15px] leading-[26px] text-[#667085] sm:text-[16px]">
            Our terms, policies, and notices to ensure a transparent and secure experience for all
            users
          </p>
        </div>
      </section>

      <div aria-hidden="true" className="h-px w-full bg-[#E5E7EB]" />

      <section className="bg-white">
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="flex w-full items-start">
            {/* Documentation sidebar */}
            <aside className="mt-[10px] ml-[60px] w-[370px] shrink-0">
        <div className="w-[300px] pt-[42px]">
          <p className="font-['Plus_Jakarta_Sans'] text-[14px] font-bold uppercase leading-[20px] tracking-[0.08em] text-[#111827]">
           Documentation
          </p>

          <nav className="mt-[22px] flex flex-col gap-[4px]">
            {documentationNav.map((item) => {
              const isActive = item.id === activeId;

              return (
                <Link
                  key={item.id}
                  to={`/legal#${item.id}`}
                    className={[
                      "flex h-[48px] w-full items-center gap-[14px] rounded-[8px] px-[16px] transition-colors",
                      isActive
                        ? "border border-[#E51C231A] bg-[#FEF2F2] text-[#E51C23]"
                        : "border-none text-[#526078] hover:bg-[#EEF2F8] hover:text-[#111827]",
                    ].join(" ")}
                  >
                  <span
                    className={[
                      "inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center",
                      isActive ? "text-[#E51C23]" : "text-[#526078]",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    {item.id === "terms" && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[17px] w-[17px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 2.75h8l4 4v14.5H6V2.75Z" />
                        <path d="M14 2.75v4h4" />
                        <path d="M8.5 13.2h7" />
                        <path d="M8.5 16.2h7" />
                        <path d="M9 9.5h2.5" />
                      </svg>
                    )}

                    {item.id === "privacy" && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="currentColor"
                      >
                        <circle cx="8" cy="7" r="4" />
                        <circle cx="17.5" cy="9" r="3" />
                        <path d="M2 20v-3.5A4.5 4.5 0 0 1 6.5 12h3A4.5 4.5 0 0 1 14 16.5V20H2Z" />
                        <path d="M14.5 20v-4.2c0-1.1-.35-2.15-.95-3h3.95a4 4 0 0 1 4 4V20h-7Z" />
                      </svg>
                    )}

                    {item.id === "dpdp" && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      >
                        <path d="M12 3.5a7 7 0 0 0-7 7v3" />
                        <path d="M12 6.5a4 4 0 0 0-4 4v5" />
                        <path d="M12 9.5a1 1 0 0 0-1 1v7" />
                        <path d="M15 5a6 6 0 0 1 3 5.2v4.3" />
                        <path d="M15 8.5a3.5 3.5 0 0 1 1 2.5v6" />
                        <path d="M14 12v7" />
                      </svg>
                    )}

                    {item.id === "disclaimers" && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="currentColor"
                      >
                        <path d="M10.3 3.2a2 2 0 0 1 3.4 0l8 13.8A2 2 0 0 1 20 20H4a2 2 0 0 1-1.7-3l8-13.8ZM11 8v5h2V8h-2Zm1 8a1.2 1.2 0 1 0 0 2.4A1.2 1.2 0 0 0 12 16Z" />
                      </svg>
                    )}

                    {item.id === "cookies" && (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-[18px] w-[18px]"
                        fill="currentColor"
                      >
                        <path d="M20.5 13.3A8.5 8.5 0 1 1 10.7 3.5a4.5 4.5 0 0 0 5.8 5.8 4.5 4.5 0 0 0 4 4Z" />
                        <circle cx="8" cy="11" r="1.2" fill="#F8FAFF" />
                        <circle cx="11" cy="16" r="1.2" fill="#F8FAFF" />
                        <circle cx="6.5" cy="16.5" r="1" fill="#F8FAFF" />
                      </svg>
                    )}
                  </span>

                  <span className="font-['Plus_Jakarta_Sans'] text-[16px] font-medium leading-[22px]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Legal support card */}
          <div className="relative my-12 h-[180px] w-[280px] overflow-hidden rounded-[16px] bg-[#0F172A] py-[18px] text-white">
            <img
              src="/images/support card.png"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 right-0 h-[40px] w-[40px] select-none object-contain"
            />

            <div className="relative z-10 flex h-[165px] w-full flex-col items-start gap-[6px]">
              <p className=" w-[350px] ml-5 text-start font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-[22px]">
                Need Legal Help?
              </p>

              <p className="mx-5 font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[22px] text-[#AAB2C2]">
                Have questions regarding our terms
                <br />
                or how we handle your data?
              </p>

              <a
                href="mailto:support@propertyserch.com"
                className="mt-5 mx-3 flex h-[39.333335876464844px] w-[260px] items-center justify-center rounded-[10.67px] bg-[#E31B23] px-0  font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white transition-colors hover:bg-[#c9151d]"
              >
                Message Legal Support
              </a>
            </div>
          </div>
        </div>
            </aside>

            <main className="mt-[50px] mx-[20px] min-w-0">
              <article className="h-[2442.888916015625px] w-[930px] rounded-[21.33px] border border-[#1118271A] bg-white p-[42.67px] shadow-[0px_0.89px_1.78px_0px_rgba(0,0,0,0.05)]">
                <div className="flex items-start justify-between border-b border-[#E5E7EB] pb-[14px]">
                  <h2 className="font-['Plus_Jakarta_Sans'] text-[18.67px] font-semibold leading-[28px] text-[#111827]">
                    Terms of Service
                  </h2>
                  <p className="pt-[3px] font-['Plus_Jakarta_Sans'] text-[10.67px] font-medium leading-[16px] text-[#94A3B8]">
                    Last Updated: August 5, 2026
                  </p>
                </div>

                <div className="mt-[18px] space-y-[21px] font-['Plus_Jakarta_Sans'] text-[14px] leading-[22px] text-[#111827]">
                  {termsSections.map((section) => (
                    <section key={section.title} className="space-y-[10px]">
                      <h3 className="text-[13.33px] font-normal leading-[20px] text-[#111827]">
                        {section.number} {section.title}
                      </h3>
                      <div className="text-[13.33px] leading-[21.33px] text-[#111827]">
                        {section.list ? (
                          <>
                            <p className="mb-[6px]">{section.body[0]}</p>
                            <ul className="list-disc space-y-[2px] pl-[18px]">
                              {section.body.slice(1).map((line) => (
                                <li key={line}>{line}</li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          section.body.map((line) => <p key={line}>{line}</p>)
                        )}
                      </div>
                    </section>
                  ))}
                </div>

                <div className="mt-[28px] border-t border-[#E5E7EB] pt-[26px]">
                  <h2 className="font-['Plus_Jakarta_Sans'] text-[18.67px] font-semibold leading-[28px] text-[#111827]">
                    Privacy Policy
                  </h2>

                  <div className="mt-[18px] space-y-[21px] font-['Plus_Jakarta_Sans'] text-[14px] leading-[22px] text-[#111827]">
                    {privacySections.map((section) => (
                      <section key={section.title} className="space-y-[10px]">
                        <h3 className="text-[13.33px] font-normal leading-[20px] text-[#111827]">
                          {section.number} {section.title}
                        </h3>
                        <div className="text-[13.33px] leading-[21.33px] text-[#111827]">
                          {section.list ? (
                            <>
                              <p className="mb-[6px]">{section.body[0]}</p>
                              <ul className="list-disc space-y-[2px] pl-[18px]">
                                {section.body.slice(1).map((line) => (
                                  <li key={line}>{line}</li>
                                ))}
                              </ul>
                            </>
                          ) : section.number === "8." ? (
                            <>
                              <p>{section.body[0]}</p>
                              <div className="mt-[18px] rounded-[8px] border border-[#E5E7EB] bg-[#F8FAFC] px-[16px] py-[18px]">
                                <p className="text-[13.33px] leading-[21.33px] text-[#111827]">
                                  {section.body[1]}
                                </p>
                              </div>
                            </>
                          ) : (
                            section.body.map((line) => <p key={line}>{line}</p>)
                          )}
                        </div>
                      </section>
                    ))}
                  </div>
                </div>
              </article>
            </main>
          </div>
        </div>
      </section>
      <CompanyFooterSection />
    </main>
  );
}

export default PublicLegalPage;
