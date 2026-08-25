import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";

const documentationNav = [
  {
    id: "terms",
    label: "Terms of Service",
    icon: "/icons/terms%20and%20service.png",
  },
  {
    id: "privacy",
    label: "Privacy Policy",
    icon: "/icons/privacy%20policy.png",
  },
  { id: "rera", label: "RERA Compliance", icon: "/icons/rera.png" },
];

const activeIconFilter =
  "brightness(0) saturate(100%) invert(19%) sepia(96%) saturate(7492%) hue-rotate(349deg) brightness(97%) contrast(108%)";

const inactiveIconFilter =
  "brightness(0) saturate(100%) invert(37%) sepia(14%) saturate(679%) hue-rotate(174deg) brightness(92%) contrast(88%)";

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

const reraSections = [
  {
    number: "1.",
    title: "RERA Overview",
    body: [
      "PropertySerch highlights RERA-related information to support transparent property discovery and informed decision-making.",
    ],
  },
  {
    number: "2.",
    title: "Listing Information",
    body: [
      "Where applicable, property details such as registration numbers, project status, and promoter information should be verified against official RERA records before taking any action.",
    ],
  },
  {
    number: "3.",
    title: "User Responsibility",
    body: [
      "Users are responsible for independently confirming compliance requirements, approvals, and disclosures that apply in their jurisdiction.",
    ],
  },
  {
    number: "4.",
    title: "Contact",
    body: [
      "For RERA-related questions, please contact our support team through the official PropertySerch contact channels.",
    ],
  },
];

function PublicLegalPage() {
  const location = useLocation();
  const activeId = location.hash.replace("#", "") || "terms";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (activeId === "terms") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return undefined;
    }

    const target = document.getElementById(activeId);
    if (!target) return undefined;

    const offset = activeId === "privacy" ? 120 : activeId === "rera" ? 80 : 0;
    const raf = requestAnimationFrame(() => {
      const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(targetTop, 0), behavior: "smooth" });
    });

    return () => cancelAnimationFrame(raf);
  }, [activeId]);

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

      <section className="bg-[#F8FAFC]">
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
                  aria-current={isActive ? "page" : undefined}
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
                      isActive ? "opacity-100" : "opacity-80",
                    ].join(" ")}
                    aria-hidden="true"
                  >
                    <img
                      src={item.icon}
                      alt=""
                      className={[
                        "object-contain transition-[filter,opacity] duration-150",
                        item.id === "rera" ? "h-[22px] w-[22px]" : "h-[18px] w-[18px]",
                      ].join(" ")}
                      style={
                        isActive
                          ? {
                              filter: activeIconFilter,
                            }
                          : {
                              filter: inactiveIconFilter,
                            }
                      }
                    />
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
              <article className="w-[930px] rounded-[21.33px] border border-[#1118271A] bg-white p-[42.67px] pb-[56px] shadow-[0px_0.89px_1.78px_0px_rgba(0,0,0,0.05)]">
                <div
                  id="terms"
                  className="scroll-mt-[120px] flex items-start justify-between border-b border-[#E5E7EB] pb-[14px]"
                >
                  <h2 className="font-['Plus_Jakarta_Sans'] text-[26.67px] font-semibold leading-[28px] text-[#111827]">
                    Terms of Service
                  </h2>
                  <p className="pt-[3px] font-['Plus_Jakarta_Sans'] text-[12.67px] font-medium leading-[16px] text-[#94A3B8]">
                    Last Updated: August 5, 2026
                  </p>
                </div>

                <div className="mt-[18px] space-y-[21px] font-['Lato'] text-[14.22px] font-normal leading-[21.33px] text-[#111827]">
                  {termsSections.map((section) => (
                    <section key={section.title} className="space-y-[10px]">
                      <h3 className="font-['Lato'] text-[14.22px] font-normal leading-[21.33px] text-[#111827]">
                        {section.number} {section.title}
                      </h3>
                      <div className="font-['Lato'] text-[14.22px] font-normal leading-[21.33px] text-[#111827]">
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

                <div id="privacy" className="mt-[28px] border-t border-[#E5E7EB] pt-[26px]">
                  <h2 className="font-['Lato'] text-[26.67px] font-semibold leading-[28px] text-[#111827]">
                    Privacy Policy
                  </h2>

                  <div className="mt-[18px] space-y-[21px] font-['Lato'] text-[14.22px] font-normal leading-[21.33px] text-[#111827]">
                    {privacySections.map((section) => (
                      <section key={section.title} className="space-y-[10px]">
                        <h3 className="font-['Lato'] text-[14.22px] font-normal leading-[21.33px] text-[#111827]">
                          {section.number} {section.title}
                        </h3>
                        <div className="font-['Lato'] text-[14.22px] font-normal leading-[21.33px] text-[#111827]">
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
                                <p className="font-['Lato'] text-[14.22px] font-normal leading-[21.33px] text-[#111827]">
                                  Email:{" "}
                                  <span className="text-[#E31B23]">{section.body[1].replace("Email: ", "")}</span>
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

                <div className="mt-[28px] border-t border-[#E5E7EB] pt-[26px]" id="rera">
                  <h2 className="font-['Plus_Jakarta_Sans'] text-[18.67px] font-semibold leading-[28px] text-[#111827]">
                    RERA Compliance
                  </h2>

                  <div className="mt-[18px] space-y-[21px] font-['Plus_Jakarta_Sans'] text-[14px] leading-[22px] text-[#111827]">
                    {reraSections.map((section) => (
                      <section key={section.title} className="space-y-[10px]">
                        <h3 className="text-[13.33px] font-normal leading-[20px] text-[#111827]">
                          {section.number} {section.title}
                        </h3>
                        <div className="text-[13.33px] leading-[21.33px] text-[#111827]">
                          {section.body.map((line) => (
                            <p key={line}>{line}</p>
                          ))}
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
