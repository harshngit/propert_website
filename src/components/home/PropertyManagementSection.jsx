import React from "react";

function PropertyManagementSection() {
  const leftChips = [
    "Tenant placement & rent collection",
    "Repairs & maintenance coordination",
    "Property tax & statutory payments",
  ];

  return (
    <div className="mt-12 grid gap-4 lg:grid-cols-[1.18fr_0.95fr]">
      <div className="rounded-[20px] border border-[#cfdcff] bg-[#eef3ff] px-6 py-7 text-[#0f172a] shadow-[0_10px_24px_rgba(15,23,42,0.04)] md:px-8 md:py-8">
        <h3 className="max-w-[650px] font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[1.2] tracking-[0] text-[#0f172a] md:text-[28px]">
          Your India property. Managed while you&apos;re abroad.
        </h3>
        <p className="mt-3 max-w-[670px] font-['Lato'] text-[16px] leading-7 text-[#334155]">
          A dedicated relationship manager handles renting, repairs, and tax payments on your
          behalf. One point of contact, one simple monthly fee, no visits required.
        </p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {leftChips.map((chip) => (
            <span
              key={chip}
              className="rounded-[7px] border border-[#c5d4ff] bg-white px-3 py-1.5 text-[11px] font-medium tracking-[0.01em] text-[#111827]"
            >
              {chip}
            </span>
          ))}
        </div>

        <button className="mt-7 inline-flex items-center justify-center rounded-[10px] bg-[#E51C23] px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-[#cc1820]">
          Talk to a Relationship Manager →
        </button>

        <p className="mt-5 border-t border-[#d7e2ff] pt-5 font-['Lato'] text-[13px] leading-6 text-[#64748b]">
          Service fees are billed monthly and communicated upfront; tax rules vary by state and
          individual situation. Consult a qualified CA before transacting.
        </p>
      </div>

      <div className="rounded-[20px] bg-[#0f1f3a] px-6 py-7 text-white shadow-[0_10px_24px_rgba(15,23,42,0.12)] md:px-8 md:py-8">
        <div className="inline-flex rounded-full bg-[#FFFFFF1A] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-[#FFFFFF]">
          Dedicated Manager · One Point of Contact
        </div>

        <h3 className="mt-6 max-w-[500px] font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[1.25] tracking-[0] text-white md:text-[28px]">
          Tension-free ownership, from anywhere
        </h3>

        <p className="mt-4 max-w-[470px] font-['Lato'] text-[16px] leading-7 text-white/82">
          Whether you&apos;re in Dubai, London, or Singapore, your relationship manager keeps
          your property earning, maintained, and compliant with regular updates, so you&apos;re
          never left wondering.
        </p>

        <button className="mt-8 bg-[#E51C23] inline-flex rounded-[10px] border border-white/15 px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-[#cc1820]">
          View NRI Property Management →
        </button>
      </div>
    </div>
  );
}

export default PropertyManagementSection;
