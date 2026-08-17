import React from "react";

function FractionalOwnershipSection() {
  return (
    <div className="mt-12 rounded-[28px] border border-dashed border-[#dfe6f3] bg-white  shadow-[0_12px_30px_rgba(15,23,42,0.03)] ">
      <div className="mx-auto max-w-full px-10 mt-8">
        <div className="max-w-[740px]">
          <h3 className="font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-[1.2] tracking-[0] text-[#0f172a] md:text-[30px]">
            Fractional Ownership - for every kind of investor
          </h3>

          <p className="mt-5 max-w-full font-['Lato'] text-[18px] leading-8 text-[#5b6b86]">
            Beyond our HNI & NRI SPV opportunities in the ₹10 Cr-₹100 Cr range,
            we&apos;re also building a path for smaller-ticket investors to
            participate in professionally managed real estate valued between ₹1
            Cr and ₹10 Cr - structured through its own dedicated vehicle.
          </p>

          <button className="cta-red mt-8 inline-flex items-center justify-center rounded-[12px] border border-[#d7dfee] px-8 py-3.5 text-[16px] font-extrabold text-[#ffffff] shadow-[0_8px_18px_rgba(15,23,42,0.03)]">
            Register Your Interest →
          </button>

          <div className="mt-8 mb-6 max-w-full border-t border-[#e2e8f4] pt-6">
            <p className="font-['Lato'] text-[13px] leading-6 text-[#6b7a95]">
              Coming soon, subject to regulatory structuring. Not currently open
              for subscription. Not a public offer or solicitation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FractionalOwnershipSection;
