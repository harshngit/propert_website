import React from "react";
import { partnerCards } from "../../data/homeContent";

function BusinessGrowthSection() {
  return (
    <>
      <div className="mt-12 overflow-hidden rounded-[24px] bg-[#111827] px-6 py-8 text-white md:px-10 md:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-center">
          <div className="max-w-[560px]">
            <div className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white/75">
              First in India
            </div>
            <h2 className="mt-4 max-w-[520px] text-[34px] font-black leading-[1.06] tracking-tight md:text-[44px]">
              Buy or sell a school, college, or university. Confidentially
            </h2>
            <p className="mt-5 max-w-[520px] text-[16px] leading-7 text-white/65 md:text-[18px]">
              Secure 9-stage deal process with NDA-gated access to institutional details
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button className="rounded-[14px] bg-red-500 px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-red-600">
                Contact Institutional Desk
              </button>
              <button className="rounded-[14px] border border-white/15 px-6 py-3.5 text-[16px] font-extrabold text-white transition hover:bg-white/5">
                Sample Data Room
              </button>
            </div>
          </div>

          <div className="relative h-[230px] overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#8eb4d8_0%,#d9ecfa_20%,#f7f3e9_55%,#9f6b4d_56%,#4b2f2d_100%)] shadow-[0_18px_36px_rgba(0,0,0,0.18)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.55),transparent_18%),radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.32),transparent_14%),linear-gradient(180deg,transparent_44%,rgba(15,23,42,0.2)_100%)]" />
            <div className="absolute bottom-4 left-4 right-4 grid grid-cols-4 gap-2 text-[9px] font-bold uppercase tracking-[0.1em] text-white/90">
              <div className="rounded-md bg-black/35 px-2 py-1 text-center backdrop-blur-sm">
                Asset Type: K-12 School
              </div>
              <div className="rounded-md bg-black/35 px-2 py-1 text-center backdrop-blur-sm">
                EBITDA Band
              </div>
              <div className="rounded-md bg-black/35 px-2 py-1 text-center backdrop-blur-sm">
                Stage: Data Room
              </div>
              <div className="rounded-md bg-black/35 px-2 py-1 text-center backdrop-blur-sm">
                Access: NDA Required
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white px-0 pt-12">
        <h2 className="text-center text-[28px] font-black leading-tight text-slate-900 md:text-[32px]">
          Grow Your Business with PropertySerch
        </h2>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {partnerCards.map((card) => (
            <article
              key={card.title}
              className="rounded-[22px] border border-slate-200 bg-white px-7 py-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
            >
              <h3 className="text-[22px] font-black leading-tight text-slate-900">{card.title}</h3>
              <p className="mt-4 max-w-[320px] leading-7 text-slate-500">{card.body}</p>
              <button className="mt-8 inline-flex items-center gap-2 text-[15px] font-extrabold text-red-500 transition hover:text-red-600">
                <span>{card.action}</span>
                <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}

export default BusinessGrowthSection;
