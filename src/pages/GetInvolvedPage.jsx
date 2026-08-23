import React from "react";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";

function GetInvolvedPage() {
  return (
    <main className="flex min-h-screen w-full flex-col bg-white text-slate-900">
      <SiteHeader />

      <section className="w-full border-y border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1180px] flex-col items-center px-4 py-10 text-center sm:px-6 lg:px-8">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[34px] font-extrabold leading-[1.15] tracking-[-0.04em] text-[#111827] sm:text-[38px] lg:text-[42px]">
            Get Involved with PropertySerch
          </h1>

          <p className="mt-3 w-full max-w-[720px] text-[18px] leading-[30px] text-[#667085] sm:text-[19px]">
            Whether you&apos;re an investor, developer, or industry professional, PropertySerch
            connects you with the tools and opportunities to grow
          </p>
        </div>
      </section>

      <section className="w-full bg-white">
        <div className="mx-auto flex w-full max-w-[1350px] flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-start lg:gap-[56px] lg:px-8">
          <div className="w-full max-w-[258px] flex-none">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#111827] sm:text-[36px] lg:text-[42px]">
              Help Us Expand
            </h2>
            <p className="mt-5 max-w-[250px] text-[16px] leading-[28px] text-[#667085]">
              Don&apos;t see your city yet? Let us know. We&apos;re continuously expanding our coverage
              based on demand and market opportunities.
            </p>

            <div className="mt-12 space-y-8">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF1F1] text-[#E51C23]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                    <path d="M12 3.5 19.5 8v8L12 20.5 4.5 16V8L12 3.5Z" fill="currentColor" />
                    <path
                      d="M12 8.1a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z"
                      fill="white"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold leading-6 text-[#111827]">Market Analysis</h3>
                  <p className="mt-1 max-w-[220px] text-[15px] leading-[24px] text-[#667085]">
                    We conduct deep legal and valuation audits in every new city.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF1F1] text-[#E51C23]">
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                    <path
                      d="M12 4.5c-1.8 0-3.2 1.4-3.2 3.1S10.2 10.7 12 10.7s3.2-1.4 3.2-3.1S13.8 4.5 12 4.5Zm-6.5 10.9c0-2.3 2.9-4 6.5-4s6.5 1.7 6.5 4V18H5.5v-2.6ZM3.8 9.2c0-1.4 1-2.5 2.4-2.5 1 0 1.8.6 2.2 1.4"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16.8 8c1.3 0 2.4 1 2.4 2.3 0 1.1-.8 2-1.8 2.2"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[18px] font-bold leading-6 text-[#111827]">Partner Onboarding</h3>
                  <p className="mt-1 max-w-[220px] text-[15px] leading-[24px] text-[#667085]">
                    Connecting with local legal experts and verified brokers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[394px] gap-10 rounded-[16.97px] border border-[#1118271A] bg-white px-8 py-6 shadow-[0_0.71px_1.41px_0_rgba(0,0,0,0.05)] lg:ml-auto lg:h-[349.5838928222656px]">
            <div className="space-y-[10px]">
              <label className="block">
                <span className="mb-2 block text-[14px] font-bold leading-5 text-[#111827]">
                  Full Name
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="h-[30px] w-full rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[12px] text-[#111827] outline-none placeholder:text-[#9CA3AF]"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[14px] font-bold leading-5 text-[#111827]">
                  Mobile Number
                </span>
                <div className="flex h-[30px] items-center rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[12px] text-[#9CA3AF]">
                  <span className="pr-3 text-[#94A3B8]">+91</span>
                  <span className="h-4 w-px bg-[#E5E7EB]" />
                  <input
                    type="text"
                    placeholder="Enter your mobile number"
                    className="min-w-0 flex-1 bg-transparent pl-3 text-[#111827] outline-none placeholder:text-[#9CA3AF]"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[14px] font-bold leading-5 text-[#111827]">
                  Desired City
                </span>
                <div className="flex h-[30px] items-center rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 text-[12px] text-[#9CA3AF]">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className="mr-3 h-4 w-4 shrink-0 text-[#94A3B8]"
                    fill="none"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-[#9CA3AF]">Select or enter your city</span>
                </div>
              </label>

              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-1 h-4 w-4 rounded-[4px] border-[#E51C23] bg-[#E51C23] text-[#E51C23] accent-[#E51C23]"
                />
                <span className="text-[10px] leading-[16px] text-[#334155]">
                  I agree to be contacted by PropertySerch regarding availability in my requested city
                  and accept the Privacy Policy
                </span>
              </label>

              <button
                type="button"
                className="inline-flex h-[36px] w-full items-center justify-center rounded-[8px] bg-[#E51C23] text-[15px] font-bold text-white"
              >
                Request City
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1" aria-hidden="true" />
      <CompanyFooterSection />
    </main>
  );
}

export default GetInvolvedPage;
