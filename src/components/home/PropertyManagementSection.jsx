import React from "react";

const leftFeatures = [
  {
    title: "Tenant placement",
    subtitle: "& rent collection",
    icon: TenantIcon,
  },
  {
    title: "Repairs &",
    subtitle: "maintenance coordination",
    icon: RepairIcon,
  },
  {
    title: "Property tax &",
    subtitle: "statutory payments",
    icon: DocumentIcon,
  },
];

function PropertyManagementSection() {
  return (
    <section className="mt-12 w-full">
      <div className="mx-auto grid w-full max-w-[1440px] gap-5 lg:grid-cols-[735.69px_592.31px]">
        {/* =====================================================
            LEFT CARD
        ====================================================== */}
        <div className="relative h-[419.7px] overflow-hidden rounded-[20px] border border-[#d7e3ff] bg-[#eef3ff] text-[#0f172a] shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
          {/* =====================================================
              LARGE CURVED BACKGROUND
          ====================================================== */}
          <div className="pointer-events-none absolute -right-[120px] -top-[135px] h-[535px] w-[455px] rounded-full bg-[#dce8fb]" />

          {/* =====================================================
              HOUSE IMAGE
          ====================================================== */}
          <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-[43%] overflow-hidden">
            <div className="absolute inset-0 overflow-hidden [clip-path:ellipse(88%_78%_at_100%_52%)]">
              <img
                src={encodeURI("/images/property-management-house.png")}
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover object-[58%_center]"
              />
            </div>

            <div
              className="  absolute inset-0 -z-10 bg-[#dce8fb]
    [clip-path:ellipse(78%_100%_at_100%_50%)]"
            />
          </div>

          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}
          <div className="relative z-10 flex h-full w-[62%] flex-col p-8">
            {/* =====================================================
        HEADING
    ====================================================== */}
            <h3 className="max-w-[410px] font-['Plus_Jakarta_Sans'] text-[27px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#0f172a]">
              Your India property. Managed
              <br />
              while you&apos;re abroad.
            </h3>

            {/* =====================================================
        DESCRIPTION
    ====================================================== */}
            <p className="mt-[14px] max-w-[430px] font-['Lato'] text-[12px] leading-[1.65] text-[#334155]">
              A dedicated relationship manager handles renting, repairs, and tax
              payments on your behalf. One point of contact, one simple monthly
              fee, no visits required.
            </p>

            {/* =====================================================
        FEATURE CARDS
    ====================================================== */}
            <div className="mt-[18px] grid max-w-[445px] grid-cols-3 gap-[8px]">
              {/* Tenant */}
              <div className="flex h-[60px] min-w-0 items-center gap-[8px] rounded-[8px] border border-[#cbdcff] bg-white px-[9px]">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[7px] bg-[#edf4ff]">
                  <TenantIcon />
                </div>

                <p className="max-w-[92px] font-['Plus_Jakarta_Sans'] text-[8px] font-semibold leading-[1.08] text-[#0f172a]">
                  <span className="block whitespace-nowrap">Tenant placement</span>
                  <span className="block whitespace-nowrap">& rent</span>
                  <span className="block whitespace-nowrap">collection</span>
                </p>
              </div>

              {/* Repairs */}
              <div className="flex h-[60px] min-w-0 items-center gap-[8px] rounded-[8px] border border-[#cbdcff] bg-white px-[9px]">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[7px] bg-[#edf4ff]">
                  <RepairIcon />
                </div>

                <p className="max-w-[100px] font-['Plus_Jakarta_Sans'] text-[9px] font-semibold leading-[1.18] text-[#0f172a]">
                  <span className="block">Repairs &</span>
                  <span className="block">maintenance coordination</span>
                </p>
              </div>

              {/* Tax */}
              <div className="flex h-[60px] min-w-0 items-center gap-[8px] rounded-[8px] border border-[#cbdcff] bg-white px-[9px]">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[7px] bg-[#edf4ff]">
                  <DocumentIcon />
                </div>

                <p className="max-w-[100px] font-['Plus_Jakarta_Sans'] text-[9px] font-semibold leading-[1.18] text-[#0f172a]">
                  <span className="block">Property tax &</span>
                  <span className="block">statutory payments</span>
                </p>
              </div>
            </div>

            {/* =====================================================
        CTA BUTTON
    ====================================================== */}
            <button className="mt-[20px] inline-flex h-[46px] w-fit items-center gap-[11px] rounded-[8px] bg-[#E51C23] px-[20px] font-['Plus_Jakarta_Sans'] text-[13px] font-extrabold text-white transition hover:bg-[#cf1820]">
              <span>Talk to a Relationship Manager</span>

              <span
                aria-hidden="true"
                className="translate-y-[-1px] text-[18px] font-semibold leading-none"
              >
                →
              </span>
            </button>

            {/* =====================================================
        DISCLAIMER
    ====================================================== */}
            <div className="mt-auto max-w-[440px] border-t border-[#d3def3] pt-[13px]">
              <div className="flex items-start gap-[8px]">
                {/* information icon */}
                <div className="mt-[1px] flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-full border border-[#2b7cff]">
                  <span className="font-['Plus_Jakarta_Sans'] text-[8px] font-extrabold leading-none text-[#2b7cff]">
                    i
                  </span>
                </div>

                <p className="max-w-[405px] font-['Lato'] text-[9px] leading-[1.55] text-[#64748b]">
                  Service fees are billed monthly and communicated upfront; tax
                  rules vary by state and individual situation. Consult a
                  qualified CA before transacting.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
    RIGHT CARD
====================================================== */}

        <div
          className="
    relative
    h-[419.7px] w-[670px]
    
    overflow-hidden
    rounded-[20px]
    bg-[#07182f]
    px-8 pb-8 pt-5
    text-white
    shadow-[0_16px_36px_rgba(15,23,42,0.14)]
  "
        >
          {/* =====================================================
      RIGHT IMAGE
  ====================================================== */}

          <div
            className="
      pointer-events-none
      absolute
      bottom-0
      right-0
      top-0
      z-[1]
      w-[47%]
      overflow-hidden
    "
          >
            {/* Curved image clipping */}
            <div
              className="
        absolute
        inset-0
        overflow-hidden
        [clip-path:ellipse(92%_78%_at_100%_47%)]
      "
            >
              <img
                src={encodeURI("/images/property managment 2.png")}
                alt=""
                aria-hidden="true"
                className="
          h-full
          w-full
          object-cover
          object-[57%_center]
        "
              />
            </div>

            {/* Fade image into navy on LEFT */}
            <div
              className="
        absolute
        inset-0
        bg-[linear-gradient(90deg,#07182f_0%,rgba(7,24,47,0.78)_8%,rgba(7,24,47,0.25)_28%,rgba(7,24,47,0)_52%)]
      "
            />

            {/* Bottom navy fade */}
            <div
              className="
        absolute
        bottom-0
        left-0
        right-0
        h-[42%]
        bg-[linear-gradient(180deg,rgba(7,24,47,0)_0%,rgba(7,24,47,0.48)_38%,#07182f_100%)]
      "
            />
          </div>

          {/* =====================================================
      CONTENT
  ====================================================== */}

          <div className="relative z-10 flex h-full flex-col">
            {/* =====================================================
        TOP CONTENT
    ====================================================== */}

            <div className="w-[57%]">
              {/* BADGE */}
              <div
                className="
          inline-flex
          h-[31px]
          items-center
          gap-[8px]
          rounded-full
          bg-[#0D2A52]
          px-[14px]
        "
              >
                <ManagerBadgeIcon />

                <span
                  className="
            whitespace-nowrap
            font-['Plus_Jakarta_Sans']
            text-[9px]
            font-bold
            uppercase
            tracking-[0.045em]
            text-white
          "
                >
                  Dedicated Manager · One Point of Contact
                </span>
              </div>

              {/* HEADING */}
              <h3
                className="
          mt-[22px]
          max-w-[320px]
          font-['Plus_Jakarta_Sans']
          text-[27px]
          font-extrabold
          leading-[1.18]
          tracking-[-0.025em]
          text-white
        "
              >
                Tension-free ownership,
                <br />
                from anywhere
              </h3>

              {/* DESCRIPTION */}
              <p
                className="
          mt-[22px]
          max-w-[305px]
          font-['Lato']
          text-[12px]
          font-normal
          leading-[1.9]
          text-white/90
        "
              >
                Whether you&apos;re in Dubai, London, or Singapore, your
                relationship manager keeps your property earning, maintained,
                and compliant with regular updates, so you&apos;re never left
                wondering.
              </p>

              {/* CTA BUTTON */}
              <button
                type="button"
                className="
          mt-[22px]
          inline-flex
          h-[46px]
          items-center
          justify-center
          gap-[12px]
          rounded-[8px]
          bg-[#E51C23]
          px-[20px]
          font-['Plus_Jakarta_Sans']
          text-[12px]
          font-extrabold
          text-white
          transition
          hover:bg-[#cf1820]
        "
              >
                <span>View NRI Property Management</span>

                <span
                  aria-hidden="true"
                  className="
            translate-y-[-1px]
            text-[17px]
            font-semibold
            leading-none
          "
                >
                  →
                </span>
              </button>
            </div>

            {/* =====================================================
        BOTTOM BENEFITS
    ====================================================== */}

            <div
              className="
        mt-auto
        grid
        w-[56%]
        grid-cols-3
      "
            >
              {/* ALWAYS UPDATED */}
              <div
                className="mt-4
          flex
          flex-col
          items-center
          border-r
          border-white/10
          px-[8px]
          text-center
        "
              >
                <div
                  className="
            flex
            h-[40px]
            w-[40px]
            items-center
            justify-center
            rounded-full
            bg-[#0D2A52]
          "
                >
                  <img
                    src={encodeURI("/icons/globe-icon (2).png")}
                    alt=""
                    aria-hidden="true"
                    className="h-7 w-7 object-contain"
                  />
                </div>

                <p
                  className="
            mt-[9px]
            font-['Lato']
            text-[10px]
            font-semibold
            leading-[1.35]
            text-white
          "
                >
                  <span className="block">Always updated,</span>
                  <span className="block">wherever you are</span>
                </p>
              </div>

              {/* COMPLIANT */}
              <div
                className="mt-4
          flex
          flex-col
          items-center
          border-r
          border-white/10
          px-[8px]
          text-center
        "
              >
                <div
                  className="
            flex
            h-[38px]
            w-[38px]
            items-center
            justify-center
            rounded-full
            bg-[#0D2A52]
          "
                >
                  <img
                    src={encodeURI("/icons/security.png")}
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 object-contain"
                  />
                </div>

                <p
                  className="
            mt-[9px]
            font-['Lato']
            text-[10px]
            font-semibold
            leading-[1.35]
            text-white
          "
                >
                  <span className="block">Compliant &</span>
                  <span className="block">well maintained</span>
                </p>
              </div>

              {/* EARNINGS */}
              <div
                className="mt-4
          flex
          flex-col
          items-center
          px-[8px]
          text-center
        "
              >
                <div
                  className="
            flex
            h-[38px]
            w-[38px]
            items-center
            justify-center
            rounded-full
            bg-[#0D2A52]
          "
                >
                  <img
                    src={encodeURI("/icons/rupay icon.png")}
                    alt=""
                    aria-hidden="true"
                    className="h-5 w-5 object-contain"
                  />
                </div>

                <p
                  className="
            mt-[9px]
            font-['Lato']
            text-[10px]
            font-semibold
            leading-[1.35]
            text-white
          "
                >
                  <span className="block">Earnings</span>
                  <span className="block">that stay on track</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   LEFT CARD ICONS
========================================================= */

function TenantIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px] text-[#2b7cff]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8.5 12a3.25 3.25 0 1 0 0-6.5A3.25 3.25 0 0 0 8.5 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="M4.5 19.25c.5-2.65 2.53-4.25 4-4.25s3.5 1.6 4 4.25"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      <path
        d="M15.5 8.25h4M15.5 12h3M15.5 15.75h4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function RepairIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px] text-[#2b7cff]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M14.5 4.5a5 5 0 0 0-4.3 7.5l-5.2 5.2a1.2 1.2 0 0 0 0 1.7l.6.6a1.2 1.2 0 0 0 1.7 0l5.2-5.2a5 5 0 0 0 6.7-6.7l-3 3-2.2-.6-.6-2.2 3-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[17px] w-[17px] text-[#2b7cff]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 4.75h6.8L17.75 8.7V19.25H7A1.75 1.75 0 0 1 5.25 17.5V6.5A1.75 1.75 0 0 1 7 4.75Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M13.8 4.75V8.2h3.95"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />

      <path
        d="M8.8 11h6.4M8.8 14h6.4M8.8 17h4.3"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#4ea1ff]"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M4.5 12h15M12 4.5c2.7 2.6 2.7 12.4 0 15M12 4.5c-2.7 2.6-2.7 12.4 0 15"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#4ea1ff]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 4.5 18 7v5.2c0 4.1-2.4 6.9-6 8.3-3.6-1.4-6-4.2-6-8.3V7l6-2.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m9.4 12 1.9 1.9 3.4-3.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RupeeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5 text-[#4ea1ff]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 6.25h10M7 9.5h10M9.8 9.5c2.8 0 4.4 1.6 5.6 3.5L18 18M7 6.25c1.7 1.5 3.1 3 4 4.85 1 1.95.4 4.4-1.3 6.15"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ManagerBadgeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[13px] w-[13px] shrink-0 text-[#4ea1ff]"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M12 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 12 11Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5.5 19.25c.7-3 2.95-4.7 6.5-4.7s5.8 1.7 6.5 4.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* =========================================================
   LOCATION PIN
========================================================= */

function LocationPin({ x, y }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path
        d="M0-8c-4.5 0-8 3.4-8 8 0 6 8 14 8 14S8 6 8 0c0-4.6-3.5-8-8-8Z"
        fill="#E7B763"
      />

      <circle cx="0" cy="0" r="2.5" fill="#0f1f3a" />
    </g>
  );
}

export default PropertyManagementSection;
