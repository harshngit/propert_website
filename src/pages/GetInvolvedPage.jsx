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
        <div className="mx-auto w-full max-w-[1350px] px-5 py-14 lg:px-8 lg:py-[60px]">
          <div className="mx-auto flex w-full max-w-[1270px] flex-col gap-12 lg:h-[349.5839px] lg:w-[1120px] lg:max-w-none lg:flex-row lg:items-center lg:justify-between lg:gap-0">
            <div className="flex w-full min-w-0 flex-col gap-[8px] lg:h-[257px] lg:w-[632px] lg:flex-none lg:justify-center">
              <h2 className="m-0 font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold leading-[35px] tracking-[-0.035em] text-[#111827]">
                Help Us Expand
              </h2>

              <p className="m-0 max-w-[586px] font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[26px] text-[#667085]">
                Don&apos;t see your city yet? Let us know. We&apos;re continuously expanding our coverage
                based on demand and market opportunities.
              </p>

              <div className="mt-[15px] flex flex-col gap-[20px]">
                <div className="flex items-start gap-[16px]">
                  <div className="mt-[3px] flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-[#FFF1F1] text-[#E51C23]">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-[26px] w-[20px]"
                      fill="none"
                    >
                      <path
                        d="M3.75 6.25 8.8 4v13.75L3.75 20V6.25Z"
                        fill="currentColor"
                      />
                      <path
                        d="m8.8 4 6.35 2.25V20L8.8 17.75V4Z"
                        fill="currentColor"
                        opacity="0.72"
                      />
                      <path
                        d="m15.15 6.25 5.1-2.25v13.75L15.15 20V6.25Z"
                        fill="currentColor"
                      />
                      <path
                        d="M12 6.7a3.1 3.1 0 0 0-3.1 3.1c0 2.35 3.1 5.6 3.1 5.6s3.1-3.25 3.1-5.6A3.1 3.1 0 0 0 12 6.7Z"
                        fill="#E51C23"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <circle cx="12" cy="9.8" r="1.05" fill="white" />
                    </svg>
                  </div>

                  <div className="min-w-0 pt-[1px]">
                    <h3 className="m-0 font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-[20px] text-[#111827]">
                      Market Analysis
                    </h3>

                    <p className="mt-[2px] mb-5 font-['Plus_Jakarta_Sans'] text-[14px] font-normal leading-[20px] text-[#667085]">
                      We conduct deep legal and valuation audits in every new city.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-[16px]">
                  <div className="mt-[3px] flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-[#FFF1F1] text-[#E51C23]">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-[18px] w-[22px]"
                      fill="currentColor"
                    >
                      <circle cx="12" cy="8" r="2.6" />
                      <circle cx="6.4" cy="9.3" r="2.1" />
                      <circle cx="17.6" cy="9.3" r="2.1" />
                      <path d="M7.4 16.8c0-2.55 2.05-4.55 4.6-4.55s4.6 2 4.6 4.55v1.4H7.4v-1.4Z" />
                      <path d="M2.8 17.7v-1.05c0-2.15 1.65-3.85 3.75-3.85.75 0 1.45.2 2.05.6a5.75 5.75 0 0 0-2.05 4.3H2.8Z" />
                      <path d="M21.2 17.7h-3.75a5.75 5.75 0 0 0-2.05-4.3 3.7 3.7 0 0 1 2.05-.6c2.1 0 3.75 1.7 3.75 3.85v1.05Z" />
                    </svg>
                  </div>

                  <div className="min-w-0 pt-[1px]">
                    <h3 className="m-0 font-['Plus_Jakarta_Sans'] text-[16px] font-bold leading-[20px] text-[#111827]">
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

            <div className="w-full rounded-[16.97px] border border-[#1118271A] bg-white px-[32px] py-[24px] shadow-[0px_0.71px_1.41px_0px_#0000000D] lg:h-[349.5839px] lg:w-[420px] lg:flex-none">
              <form
                className="flex w-full flex-col gap-[16.97px] lg:h-[400px] lg:w-[400px]"
                onSubmit={(event) => event.preventDefault()}
              >
                <label className="block">
                  <span className="mb-[8px] block font-['Plus_Jakarta_Sans'] text-[10px] font-bold leading-[13px] text-[#111827]">
                    Full Name
                  </span>

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    className="h-[30px] w-full rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-[13px] font-['Plus_Jakarta_Sans'] text-[8px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#E51C23] focus:ring-1 focus:ring-[#E51C23]/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-[8px] block font-['Plus_Jakarta_Sans'] text-[10px] font-bold leading-[13px] text-[#111827]">
                    Mobile Number
                  </span>

                  <div className="flex h-[30px] w-full items-center overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] focus-within:border-[#E51C23] focus-within:ring-1 focus-within:ring-[#E51C23]/20">
                    <span className="shrink-0 border-r border-[#E5E7EB] px-[13px] font-['Plus_Jakarta_Sans'] text-[8px] text-[#94A3B8]">
                      +91
                    </span>

                    <input
                      type="tel"
                      name="mobileNumber"
                      inputMode="numeric"
                      placeholder="Enter your mobile number"
                      className="h-full min-w-0 flex-1 border-0 bg-transparent px-[9px] font-['Plus_Jakarta_Sans'] text-[8px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:ring-0"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-[8px] block font-['Plus_Jakarta_Sans'] text-[10px] font-bold leading-[13px] text-[#111827]">
                    Desired City
                  </span>

                  <div className="relative">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="pointer-events-none absolute left-[12px] top-1/2 h-[12px] w-[12px] -translate-y-1/2 text-[#94A3B8]"
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

                    <select
                      name="desiredCity"
                      defaultValue=""
                      className="h-[30px] w-full appearance-none rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] pl-[33px] pr-[12px] font-['Plus_Jakarta_Sans'] text-[8px] text-[#9CA3AF] outline-none focus:border-[#E51C23] focus:ring-1 focus:ring-[#E51C23]/20"
                    >
                      <option value="" disabled>
                        Select or enter your city
                      </option>
                      <option value="mumbai">Mumbai</option>
                      <option value="pune">Pune</option>
                      <option value="nagpur">Nagpur</option>
                      <option value="nashik">Nashik</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-[10px]">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-[1px] h-[14px] w-[14px] shrink-0 cursor-pointer rounded-[2px] border-[#E51C23] accent-[#E51C23]"
                  />

                  <span className="max-w-[270px] font-['Plus_Jakarta_Sans'] text-[6px] font-normal leading-[9px] text-[#334155]">
                    I agree to be contacted by PropertySerch regarding availability in my requested city and accept the Privacy Policy
                  </span>
                </label>

                <button
                  type="submit"
                  className="mt-auto inline-flex h-[35px] w-full shrink-0 items-center justify-center rounded-[7px] border-0 bg-[#E51C23] font-['Plus_Jakarta_Sans'] text-[12px] font-bold text-white transition hover:bg-[#CC171D] focus:outline-none focus:ring-2 focus:ring-[#E51C23]/30"
                >
                  Request City
                </button>
              </form>
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
