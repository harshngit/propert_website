import React from "react";

function FractionalOwnershipSection() {
  return (
    <section className="mt-12 w-full">
      {/* =====================================================
          DESKTOP DESIGN
          ===================================================== */}
      <div className="relative hidden h-[430px] w-full overflow-hidden rounded-[20px] border border-[#E5EAF2] bg-white shadow-[0_8px_28px_rgba(15,23,42,0.05)] xl:block">
        {/* =====================================================
            TOP LEFT ICON
            ===================================================== */}
        <div className="absolute left-[48px] top-[28px] flex h-[56px] w-[56px] items-center justify-center rounded-[9px] bg-[#E51C23] shadow-[0_8px_18px_rgba(229,28,35,0.18)]">
          <UsersIcon className="h-[30px] w-[30px] text-white" />
        </div>

        {/* RED VERTICAL LINE */}
        <div className="absolute left-[118px] top-[29px] h-[55px] w-px bg-[#E51C23]" />

        {/* =====================================================
            HEADING
            ===================================================== */}
        <h3 className="absolute left-[140px] top-[27px] w-[430px] font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-[1.18] tracking-[-0.025em] text-[#0F172A]">
          Fractional Ownership -
          <span className="block">for every kind of investor</span>
        </h3>

        {/* =====================================================
            DESCRIPTION
            ===================================================== */}
        <p className="absolute left-[595px] top-[28px] w-[520px] font-['Lato'] text-[14px] leading-[22px] text-[#5B6B86]">
          Beyond our HNI &amp; NRI SPV opportunities in the ₹10 Cr-₹100 Cr
          range, we&apos;re also building a path for smaller-ticket investors to
          participate in professionally managed real estate valued between ₹1 Cr
          and ₹10 Cr - structured through its own dedicated vehicle.
        </p>

        {/* =====================================================
            CTA BUTTON
            ===================================================== */}
        <button
          type="button"
          className="cta-red absolute right-[48px] top-[28px] flex h-[50px] w-[230px] items-center justify-center rounded-[10px] text-[14px] font-extrabold text-white shadow-[0_8px_20px_rgba(229,28,35,0.18)] transition duration-300 hover:-translate-y-[2px]"
        >
          Register Your Interest
          <span className="ml-2 text-[17px]">→</span>
        </button>

        {/* =====================================================
            FEATURES CARD
            ===================================================== */}
        <div className="absolute left-[48px] top-[135px] h-[205px] w-[680px] rounded-[16px] border border-[#E8EDF4] bg-white shadow-[0_5px_18px_rgba(15,23,42,0.035)]">
          <div className="grid h-full grid-cols-4 px-[14px] py-[18px]">
            {/* ITEM 1 */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FFF1F2]">
                <UsersIcon className="h-[25px] w-[25px] text-[#E51C23]" />
              </div>

              <p className="mt-[13px] font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[17px] text-[#0F172A]">
                For every
                <br />
                kind of investor
              </p>

              <div className="mt-[17px] h-[2px] w-[25px] bg-[#E51C23]" />
            </div>

            {/* ITEM 2 */}
            <div className="flex flex-col items-center justify-center border-l border-[#E4E9F0] text-center">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FFF1F2]">
                <GrowthIcon className="h-[25px] w-[25px] text-[#E51C23]" />
              </div>

              <p className="mt-[13px] font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[17px] text-[#0F172A]">
                Professionally
                <br />
                managed
                <br />
                real estate
              </p>

              <div className="mt-[17px] h-[2px] w-[25px] bg-[#E51C23]" />
            </div>

            {/* ITEM 3 */}
            <div className="flex flex-col items-center justify-center border-l border-[#E4E9F0] text-center">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FFF1F2]">
                <PieChartIcon className="h-[25px] w-[25px] text-[#E51C23]" />
              </div>

              <p className="mt-[13px] font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[17px] text-[#0F172A]">
                Structured through
                <br />
                its own dedicated
                <br />
                vehicle
              </p>

              <div className="mt-[17px] h-[2px] w-[25px] bg-[#E51C23]" />
            </div>

            {/* ITEM 4 */}
            <div className="flex flex-col items-center justify-center border-l border-[#E4E9F0] text-center">
              <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FFF1F2]">
                <ShieldIcon className="h-[25px] w-[25px] text-[#E51C23]" />
              </div>

              <p className="mt-[13px] font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[17px] text-[#0F172A]">
                Secure.
                <br />
                Transparent.
                <br />
                Compliant.
              </p>

              <div className="mt-[17px] h-[2px] w-[25px] bg-[#E51C23]" />
            </div>
          </div>
        </div>

        {/* =====================================================
            CITY BACKGROUND DECORATION
            ===================================================== */}

        {/* LIGHT PINK AREA */}
        <div className="pointer-events-none absolute bottom-[57px] right-[145px] h-[260px] w-[570px] rounded-[50%] bg-[radial-gradient(circle,rgba(229,28,35,0.08)_0%,rgba(229,28,35,0.035)_45%,rgba(255,255,255,0)_72%)]" />

        {/* OUTER CURVE */}
        <div className="pointer-events-none absolute bottom-[70px] right-[145px] h-[250px] w-[545px] rounded-[50%] border border-[#F7D6D8]" />

        {/* MIDDLE CURVE */}
        <div className="pointer-events-none absolute bottom-[76px] right-[170px] h-[220px] w-[490px] rounded-[50%] border border-[#FBE4E6]" />

        {/* INNER CURVE */}
        <div className="pointer-events-none absolute bottom-[83px] right-[195px] h-[190px] w-[440px] rounded-[50%] border border-dashed border-[#F3C6C9]" />

        {/* DECORATIVE DOTS */}
        <span className="absolute right-[600px] top-[185px] h-[6px] w-[6px] rounded-full bg-[#E51C23]" />
        <span className="absolute right-[455px] top-[130px] h-[5px] w-[5px] rounded-full bg-[#F48B90]" />
        <span className="absolute right-[208px] top-[125px] h-[6px] w-[6px] rounded-full bg-[#E51C23]" />

        {/* =====================================================
            CITY IMAGE
            ===================================================== */}
        <img
          src="/images/fractional-city.png"
          alt="Fractional ownership real estate"
          className="absolute bottom-[57px] right-[125px] z-10 h-[255px] w-[650px] object-contain object-bottom"
        />

        {/* =====================================================
            TRUST CARD
            ===================================================== */}
        <div className="absolute bottom-[78px] right-[47px] z-20 h-[175px] w-[175px] rounded-[16px] border border-[#F5D7DA] bg-white/95 px-[18px] py-[19px] shadow-[0_10px_26px_rgba(15,23,42,0.07)] backdrop-blur-sm">
          <div className="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-[#FFF1F2]">
            <ShieldIcon className="h-[26px] w-[26px] text-[#E51C23]" />
          </div>

          <p className="mt-[13px] font-['Plus_Jakarta_Sans'] text-[12px] font-extrabold leading-[17px] text-[#0F172A]">
            Built for trust.
            <br />
            Designed for
            <br />
            performance.
          </p>

          <div className="mt-[12px] h-[2px] w-[24px] bg-[#E51C23]" />
        </div>

        {/* =====================================================
            DISCLAIMER
            ===================================================== */}
        <div className="absolute bottom-[18px] left-[48px] right-[48px] flex h-[40px] items-center gap-[12px] rounded-[8px] bg-[#FFF0F1] px-[16px]">
          <div className="flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border-[1.4px] border-[#E51C23] font-['Lato'] text-[11px] font-bold text-[#E51C23]">
            i
          </div>

          <p className="font-['Lato'] text-[11px] leading-[16px] text-[#5B6B86]">
            Coming soon, subject to regulatory structuring. Not currently open
            for subscription. Not a public offer or solicitation.
          </p>
        </div>
      </div>

      {/* =====================================================
          TABLET / MOBILE
          ===================================================== */}
      <div className="overflow-hidden rounded-[20px] border border-[#E5EAF2] bg-white px-5 py-6 shadow-[0_8px_28px_rgba(15,23,42,0.05)] xl:hidden md:px-8">
        {/* HEADER */}
        <div className="flex items-start gap-4">
          <div className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-[9px] bg-[#E51C23]">
            <UsersIcon className="h-[28px] w-[28px] text-white" />
          </div>

          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[25px] font-extrabold leading-[1.18] tracking-[-0.025em] text-[#0F172A] md:text-[30px]">
              Fractional Ownership -
              <span className="block">for every kind of investor</span>
            </h3>

            <p className="mt-4 font-['Lato'] text-[15px] leading-7 text-[#5B6B86]">
              Beyond our HNI &amp; NRI SPV opportunities in the ₹10 Cr-₹100 Cr
              range, we&apos;re also building a path for smaller-ticket
              investors to participate in professionally managed real estate
              valued between ₹1 Cr and ₹10 Cr - structured through its own
              dedicated vehicle.
            </p>

            <button
              type="button"
              className="cta-red mt-5 inline-flex h-[50px] items-center justify-center rounded-[10px] px-7 text-[14px] font-extrabold text-white"
            >
              Register Your Interest
              <span className="ml-2 text-[17px]">→</span>
            </button>
          </div>
        </div>

        {/* FEATURES */}
        <div className="mt-7 grid grid-cols-2 overflow-hidden rounded-[16px] border border-[#E8EDF4] md:grid-cols-4">
          <MobileFeature
            icon={
              <UsersIcon className="h-[25px] w-[25px] text-[#E51C23]" />
            }
          >
            For every
            <br />
            kind of investor
          </MobileFeature>

          <MobileFeature
            icon={
              <GrowthIcon className="h-[25px] w-[25px] text-[#E51C23]" />
            }
          >
            Professionally
            <br />
            managed
            <br />
            real estate
          </MobileFeature>

          <MobileFeature
            icon={
              <PieChartIcon className="h-[25px] w-[25px] text-[#E51C23]" />
            }
          >
            Structured through
            <br />
            its own dedicated
            <br />
            vehicle
          </MobileFeature>

          <MobileFeature
            icon={
              <ShieldIcon className="h-[25px] w-[25px] text-[#E51C23]" />
            }
          >
            Secure.
            <br />
            Transparent.
            <br />
            Compliant.
          </MobileFeature>
        </div>

        {/* CITY */}
        <div className="relative mt-6 overflow-hidden rounded-[16px] bg-[#FFFAFA] pt-4">
          <div className="absolute left-1/2 top-[20px] h-[260px] w-[90%] -translate-x-1/2 rounded-[50%] border border-[#F8D9DB]" />

          <img
            src="/images/fractional-city.png"
            alt="Fractional ownership real estate"
            className="relative z-10 mx-auto w-full max-w-[620px] object-contain"
          />

          <div className="relative z-20 mx-4 mb-4 rounded-[14px] border border-[#F5D7DA] bg-white px-5 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#FFF1F2]">
                <ShieldIcon className="h-[25px] w-[25px] text-[#E51C23]" />
              </div>

              <p className="font-['Plus_Jakarta_Sans'] text-[13px] font-extrabold leading-[19px] text-[#0F172A]">
                Built for trust. Designed for performance.
              </p>
            </div>
          </div>
        </div>

        {/* DISCLAIMER */}
        <div className="mt-5 flex items-start gap-3 rounded-[8px] bg-[#FFF0F1] px-4 py-3">
          <div className="flex h-[21px] w-[21px] shrink-0 items-center justify-center rounded-full border-[1.4px] border-[#E51C23] font-['Lato'] text-[11px] font-bold text-[#E51C23]">
            i
          </div>

          <p className="font-['Lato'] text-[11px] leading-[17px] text-[#5B6B86]">
            Coming soon, subject to regulatory structuring. Not currently open
            for subscription. Not a public offer or solicitation.
          </p>
        </div>
      </div>
    </section>
  );
}

function MobileFeature({ icon, children }) {
  return (
    <div className="flex min-h-[155px] flex-col items-center justify-center border-[#E4E9F0] p-4 text-center [&:nth-child(even)]:border-l md:[&:not(:first-child)]:border-l">
      <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FFF1F2]">
        {icon}
      </div>

      <p className="mt-3 font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[17px] text-[#0F172A]">
        {children}
      </p>

      <div className="mt-4 h-[2px] w-[24px] bg-[#E51C23]" />
    </div>
  );
}

export default FractionalOwnershipSection;

/* =========================================================
   ICONS
   ========================================================= */

function UsersIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx="16"
        cy="9.5"
        r="4.6"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 26V23.5C8 19.9 10.9 17 14.5 17H17.5C21.1 17 24 19.9 24 23.5V26"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M7.2 13.2C4.8 13.4 3 15.4 3 17.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M24.8 13.2C27.2 13.4 29 15.4 29 17.8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M3 24V21.8C3 19.4 4.9 17.5 7.3 17.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />

      <path
        d="M29 24V21.8C29 19.4 27.1 17.5 24.7 17.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GrowthIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="5"
        y="18"
        width="5"
        height="9"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <rect
        x="13.5"
        y="13"
        width="5"
        height="14"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <rect
        x="22"
        y="8"
        width="5"
        height="19"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M5 14L11 8L16 10L26 3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M21.5 3H26V7.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PieChartIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M14 4C8.477 4 4 8.477 4 14C4 19.523 8.477 24 14 24C19.523 24 24 19.523 24 14H14V4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M18 3V10H25C24.4 6.4 21.6 3.6 18 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 3L26 7V14C26 20.7 22 26 16 29C10 26 6 20.7 6 14V7L16 3Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />

      <path
        d="M11.5 15.5L14.5 18.5L20.8 12.3"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}