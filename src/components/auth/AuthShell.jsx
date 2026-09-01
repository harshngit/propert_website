import React from "react";
import { Link } from "react-router-dom";

function CheckMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-[#E51C23]" fill="none">
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BrandLogo() {
  return (
    <Link to="/" className="inline-flex items-center gap-3">
      {/* <span className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#E51C23] shadow-[0_10px_18px_rgba(229,28,35,0.24)]">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6 text-white" fill="none">
          <path
            d="M7 18V7.8c0-.97.79-1.75 1.75-1.75h5.1c1.94 0 3.15 1.03 3.15 2.67 0 1.16-.55 1.98-1.53 2.43 1.32.38 2.04 1.34 2.04 2.79 0 2.04-1.32 3.49-3.74 3.49H7Zm3.1-9.05v2.37h2.45c.84 0 1.33-.41 1.33-1.19 0-.79-.49-1.18-1.33-1.18H10.1Zm0 4.31v2.5h2.76c.93 0 1.46-.45 1.46-1.24 0-.82-.54-1.26-1.46-1.26H10.1Z"
            fill="currentColor"
          />
        </svg>
      </span> */}
      <span className="font-['Plus_Jakarta_Sans'] text-[36px] font-extrabold tracking-[-0.6px] text-[#E51C23]">
        PropertySerch
      </span>
    </Link>
  );
}

function AuthShell({
  leftTitle,
  leftSubtitle,
  features = [],
  cardKicker = "Account Access",
  cardTitle = "Welcome back",
  cardBadge = "Secure sign in",
  children,
  footer,
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FCFCFD] text-[#111827]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#FDECEC] blur-3xl" />
        <div className="absolute right-[-6rem] top-40 h-80 w-80 rounded-full bg-[#EEF2FF] blur-3xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-4 py-6 sm:px-6 lg:px-10">
        <div className="grid flex-1 items-center gap-5 px-0 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-10">
          <div className="max-w-[720px] lg:pb-12">
            <div className="mb-5">
              <BrandLogo />
            </div>

            <h1 className="mt-4 text-[26px] font-black leading-tight tracking-[-0.8px] text-[#111827] sm:text-[32px] lg:text-[36px]">
              {leftTitle}
            </h1>
            {leftSubtitle ? <p className="mt-4 max-w-[500px] text-[15px] leading-7 text-[#6B7280]">{leftSubtitle}</p> : null}

            {features.length ? (
              <div className="mt-10 space-y-5">
                {features.map((item) => (
                  <div key={item.title} className="flex items-start gap-4">
                    <div className="mt-1.5 rounded-full bg-[#FFF1F1] p-1.5 shadow-[0_6px_18px_rgba(229,28,35,0.08)]">
                      <CheckMark />
                    </div>
                    <div>
                      <div className="text-[15px] font-extrabold leading-5 text-[#111827]">{item.title}</div>
                      <div className="mt-1 text-[13px] leading-5 text-[#6B7280]">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[530px] rounded-[28px] border border-[#E5E7EB] bg-white px-8 py-2 shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:px-8 sm:py-4">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  {/* <p className="my-2 text-[15px] font-bold uppercase tracking-[0.18em] text-[#E51C23]">{cardKicker}</p> */}
                  <p className="mt-5 text-[24px] font-black leading-tight text-[#111827]">{cardTitle}</p>
                </div>
                {/* <div className="hidden rounded-[16px] bg-[#FFF1F1] px-3 py-2 text-[12px] font-bold text-[#E51C23] sm:block">
                  {cardBadge}
                </div> */}
              </div>

              {children}

              {footer ? (
                <div className="mt-6 border-t border-[#F3F4F6] text-center text-[13px] leading-5 text-[#6B7280]">{footer}</div>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default AuthShell;
