import React, { useEffect, useMemo, useRef, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import { guideItems } from "../data/homeContent";

const CITY_OPTIONS = ["Mumbai", "Pune", "Nagpur", "Nashik", "Other"];

function BusinessGrowthPromoSection() {
  const cards = [
    {
      title: "Become a Broker Partner",
      body: "Join 50,000+ verified agents.\nGet quality leads, premium listing tools, and exclusive market insights",
      action: "Join Network",
    },
    {
      title: "Become a Builder Partner",
      body: "Showcase projects to verified buyers.\nGenerate qualified leads, promote launches, and accelerate sales.",
      action: "Grow Your Business",
    },
    {
      title: "Become a Franchise Partner",
      body: "Build your real estate business with confidence. Manage brokers, expand your network, and grow with powerful tools.",
      action: "Get Started",
    },
  ];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 xl:px-[9px]">
        <h2 className="text-center font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[1.2] tracking-[-0.03em] text-[#111827] sm:text-[28px]">
          Grow Your Business with PropertySerch
        </h2>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.title}
              className="flex h-full flex-col rounded-[22px] border border-[#E5E7EB] bg-white px-7 py-8 shadow-[0_10px_24px_rgba(15,23,42,0.04)]"
            >
              <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold leading-[1.25] tracking-[-0.02em] text-[#111827]">
                {card.title}
              </h3>

              <p className="mt-4 whitespace-pre-line text-[14px] leading-[24px] text-[#667085]">
                {card.body}
              </p>

              <button
                type="button"
                className="mt-10 inline-flex items-center gap-2 whitespace-nowrap text-[14px] font-semibold text-[#E51C23] transition hover:text-[#cc171d]"
              >
                <span>{card.action}</span>
                <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CareersPromoSection() {
  const positionOptions = ["Builder", "Broker", "Marketing", "Operations", "Other"];
  const [positionOfInterest, setPositionOfInterest] = useState("");
  const [positionOpen, setPositionOpen] = useState(false);
  const positionFieldRef = useRef(null);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (positionFieldRef.current && !positionFieldRef.current.contains(event.target)) {
        setPositionOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  return (
    <section className="w-full bg-white">
      <div className="relative left-1/2 w-screen -translate-x-1/2 bg-[#0F172A] px-4 py-10 text-white sm:px-6 lg:px-8 lg:py-14">
        <div className="mx-auto grid w-full max-w-[1270px] gap-8 lg:grid-cols-[minmax(0,1fr)_374px] lg:items-center lg:gap-10 xl:gap-12">
          <div className=" max-w-[720px]">
            <span className="inline-flex h-[22px] items-center rounded-full bg-white/10 px-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/80">
              Careers at PropertySerch
            </span>

            <h2 className="mt-5 max-w-[720px] font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-[1.22] tracking-[-0.01em] text-white sm:text-[34px] lg:text-[36px]">
              Join Our Team to that&apos;s building the Future
              <span className="block">of Real Estate</span>
            </h2>

            <p className="mt-5 max-w-[720px] text-[16px] leading-[28px] text-[#9CA3AF] sm:text-[18px]">
              We&apos;re more than a portal, We&apos;re an operating system. We hire builders, thinkers,
              and executors who are passionate about transparency and efficiency in real estate
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                className="dark-hover-btn inline-flex h-[54px] w-full items-center justify-center rounded-[14px] bg-[#E51C23] px-7 text-[16px] font-extrabold text-white transition hover:bg-[#FFFFFF] sm:w-auto sm:min-w-[255px] sm:text-[16px]"
              >
                Contact Institutional Desk
              </button>

              <button
                type="button"
                className="dark-hover-btn inline-flex h-[54px] w-full items-center justify-center rounded-[14px] border border-white/15 bg-transparent px-7 text-[16px] font-extrabold text-white transition hover:bg-white sm:w-auto sm:min-w-[205px] sm:text-[16px]"
              >
                Sample Data Room
              </button>
            </div>
          </div>

          <div
            className="w-full rounded-[18px] px-5 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-7"
            style={{
              background: "#323949",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0px 18px 36px rgba(0,0,0,0.18)",
            }}
          >
            <form className="flex flex-col gap-4" onSubmit={(event) => event.preventDefault()}>
              <label className="block">
                <span className="mb-2 block text-[12px] font-bold leading-4 text-white/95">
                  Full Name
                </span>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="h-[34px] w-full rounded-[8px] border border-white/0 bg-white/8 px-4 text-[12px] text-white outline-none placeholder:text-white/45 focus:border-white/15 focus:ring-1 focus:ring-white/10"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[12px] font-bold leading-4 text-white/95">
                  Mobile Number
                </span>
                <div
                  className="flex h-[34px] items-center overflow-hidden rounded-[8px] border border-white/0 px-0 text-[12px] text-white/45 focus-within:ring-1 focus-within:ring-white/10"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  <span className="shrink-0 border-r border-white/10 px-4 text-white/55">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    className="min-w-0 flex-1 bg-transparent px-3 text-white outline-none placeholder:text-white/45"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-[12px] font-bold leading-4 text-white/95">
                  Email Address
                </span>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="h-[34px] w-full rounded-[8px] border border-white/0 bg-white/8 px-4 text-[12px] text-white outline-none placeholder:text-white/45 focus:border-white/15 focus:ring-1 focus:ring-white/10"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-[12px] font-bold leading-4 text-white/95">
                  Position of Interest
                </span>
                <div className="relative" ref={positionFieldRef}>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    className={[
                      "pointer-events-none absolute left-[12px] top-1/2 h-[12px] w-[12px] -translate-y-1/2 text-white/55 transition-transform duration-150",
                      positionOpen ? "rotate-180" : "",
                    ].join(" ")}
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

                  <input type="hidden" name="positionOfInterest" value={positionOfInterest} />

                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={positionOpen}
                    onClick={() => setPositionOpen((open) => !open)}
                    className={[
                      "flex h-[34px] w-full items-center rounded-[8px] border bg-white/8 px-4 pl-9 text-left text-[12px] text-white outline-none transition",
                      positionOpen
                        ? "border-white/20 ring-1 ring-white/10"
                        : "border-white/0 hover:border-white/10",
                    ].join(" ")}
                    style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                  >
                    <span className={positionOfInterest ? "text-white" : "text-white/45"}>
                      {positionOfInterest || "Select the role you're applying for"}
                    </span>
                  </button>

                  <div
                    className={[
                      "absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[14px] border border-white/10 bg-[#262C39] shadow-[0_16px_30px_rgba(0,0,0,0.28)] transition duration-150",
                      positionOpen
                        ? "pointer-events-auto translate-y-0 opacity-100"
                        : "pointer-events-none -translate-y-1 opacity-0",
                    ].join(" ")}
                  >
                    <div className="border-b border-white/10 px-3 py-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/45">
                        Select a role
                      </p>
                    </div>

                    <div className="grid gap-1 p-1">
                      {positionOptions.map((option) => {
                        const active = option === positionOfInterest;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setPositionOfInterest(option);
                              setPositionOpen(false);
                            }}
                            className={[
                              "flex w-full items-center justify-between rounded-[10px] px-3 py-2.5 text-left text-[12px] transition",
                              active
                                ? "bg-white/10 text-white"
                                : "text-white/82 hover:bg-white/6 hover:text-white",
                            ].join(" ")}
                          >
                            <span>{option}</span>
                            {active ? (
                              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/55">
                                Selected
                              </span>
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </label>

              <label className="flex cursor-pointer items-start gap-[10px] pt-1">
                <input
                  type="checkbox"
                  defaultChecked
                  className="mt-[1px] h-[16px] w-[16px] shrink-0 cursor-pointer rounded-[2px] border-[#E51C23] accent-[#E51C23]"
                />
                <span className="text-[9px] leading-[14px] text-white/60">
                  I agree to be contacted regarding my application and accept the Privacy Policy
                </span>
              </label>

              <button
                type="button"
                className="dark-hover-btn mt-2 inline-flex h-[36px] w-full items-center justify-center rounded-[8px] bg-[#E51C23] text-[14px] font-bold text-white transition"
              >
                Submit Application
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function GuidesSearchBenefitsSection() {
  const searchTags = [
    "Flats for Sale in Mumbai",
    "Luxury Villas in Goa",
    "Offices in Gurgaon",
    "Plot for sale in Bangalore",
    "Rent in South Delhi",
    "Penthouses in Pune",
  ];

  const benefits = ["100% Verified Users Only", "Private Contact Protection", "End-to-End Assistance"];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-[90px] sm:px-6 lg:px-8 xl:px-[9px]">
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#111827]">
              Popular Real Estate Guides
            </h3>

            <div className="mt-6 space-y-5">
              {guideItems.slice(0, 2).map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="h-[56px] w-[74px] shrink-0 overflow-hidden rounded-[8px] bg-[#F3F4F6]">
                    <img
                      src={item.thumbImage}
                      alt={item.title}
                      className="h-full w-full object-cover object-center"
                    />
                  </div>

                  <div className="min-w-0">
                    <h4 className="font-['Plus_Jakarta_Sans'] text-[15px] font-bold leading-[1.3] text-[#111827]">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.08em] text-[#98A2B3]">
                      {item.meta}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#111827]">
              Popular Searches
            </h3>

            <div className="mt-6 flex flex-wrap gap-2.5">
              {searchTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex h-[28px] items-center rounded-full bg-[#F3F4F6] px-4 text-[12px] font-medium text-[#6B7280]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold leading-[1.2] tracking-[-0.02em] text-[#111827]">
              Why PropertySerch
            </h3>

            <div className="mt-6 space-y-3">
              {benefits.map((benefit) => (
                <div
                  key={benefit}
                  className="flex h-[44px] items-center justify-center rounded-full border border-[#E5E7EB] bg-white px-5 text-center font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-[#4B5563] shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
                >
                  {benefit}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function GetInvolvedPage() {
  const [desiredCity, setDesiredCity] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const cityFieldRef = useRef(null);
  const cityInputRef = useRef(null);

  const filteredCities = useMemo(() => {
    const query = cityInput.trim().toLowerCase();
    if (!query) {
      return CITY_OPTIONS;
    }
    return CITY_OPTIONS.filter((city) => city.toLowerCase().includes(query));
  }, [cityInput]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (cityFieldRef.current && !cityFieldRef.current.contains(event.target)) {
        setCityOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  useEffect(() => {
    if (cityOpen) {
      requestAnimationFrame(() => {
        cityInputRef.current?.focus();
      });
    } else {
      setCityInput("");
    }
  }, [cityOpen]);

  const commitCity = (value) => {
    setDesiredCity(value);
    setCityInput(value);
    setCityOpen(false);
  };

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
        <div className="mx-auto w-full max-w-[1350px] px-5 py-14 lg:px-8 lg:py-[30px]">
          <div className="mx-auto mb-[50px] flex w-full max-w-[1270px] flex-col gap-12 lg:h-[349.5839px] lg:w-[1270px] lg:max-w-none lg:flex-row lg:items-center lg:justify-between lg:gap-0">
            <div className="flex w-full min-w-0 flex-col gap-[8px] lg:h-[257px] lg:w-[632px] lg:flex-none lg:justify-center">
              <h2 className="mt-[20px] font-['Plus_Jakarta_Sans'] text-[32px] font-extrabold leading-[35px] tracking-[-0.030em] text-[#111827]">
                Help Us Expand
              </h2>

              <p className="m-0 max-w-[586px] font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[26px] text-[#667085]">
                Don&apos;t see your city yet? Let us know. We&apos;re continuously expanding our coverage
                based on demand and market opportunities.
              </p>

              <div className="mt-[15px] flex flex-col gap-[20px]">
                <div className="flex items-start gap-[16px]">
                  <div className="mt-[3px] flex h-[45px] w-[45px] shrink-0 items-center justify-center rounded-full bg-[#FFF1F1] text-[#E51C23]">
                    <img
                      src="/icons/Img.png"
                      alt=""
                      aria-hidden="true"
                      className="h-[20px] w-[18px] object-contain"
                    />
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
                    <img
                      src="/icons/people.png"
                      alt=""
                      aria-hidden="true"
                      className="h-[20px] w-[20px] object-contain"
                    />
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

            <div
              className="w-full rounded-[16.97px] px-[32px] py-[24px] lg:h-[349.5838928222656px] lg:w-[430px] lg:flex-none lg:-ml-4"
              style={{
                background: "#FFFFFF",
                border: "1px solid #1118271A",
                boxShadow: "0px 0.71px 1.41px 0px #0000000D",
              }}
            >
              <form
                className="flex w-full flex-col gap-[16.97px] lg:h-[301.5838928222656px] lg:w-[366px]"
                onSubmit={(event) => event.preventDefault()}
              >
                <label className="block">
                  <span className="mb-[8px] block font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[13px] text-[#111827]">
                    Full Name
                  </span>

                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter your full name"
                    className="h-[34px] w-full rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-[13px] font-['Plus_Jakarta_Sans'] text-[12px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:border-[#E51C23] focus:ring-1 focus:ring-[#E51C23]/20"
                  />
                </label>

                <label className="block">
                  <span className="mb-[8px] block font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[13px] text-[#111827]">
                    Mobile Number
                  </span>

                  <div className="flex h-[30px] w-full items-center overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] focus-within:border-[#E51C23] focus-within:ring-1 focus-within:ring-[#E51C23]/20">
                    <span className="shrink-0 border-r border-[#E5E7EB] px-[13px] font-['Plus_Jakarta_Sans'] text-[10px] text-[#94A3B8]">
                      +91
                    </span>

                    <input
                      type="tel"
                      name="mobileNumber"
                      inputMode="numeric"
                      placeholder="Enter your mobile number"
                      className="h-[34px] min-w-0 flex-1 border-0 bg-transparent px-[9px] font-['Plus_Jakarta_Sans'] text-[12px] text-[#111827] outline-none placeholder:text-[#9CA3AF] focus:ring-0"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-[8px] block font-['Plus_Jakarta_Sans'] text-[12px] font-bold leading-[13px] text-[#111827]">
                    Desired City
                  </span>

                  <div className="relative" ref={cityFieldRef}>
                    <input type="hidden" name="desiredCity" value={desiredCity} />

                    <button
                      type="button"
                      aria-haspopup="listbox"
                      aria-expanded={cityOpen}
                      onClick={() => setCityOpen((open) => !open)}
                      className={[
                        "flex h-[34px] w-full items-center rounded-[8px] border bg-[#F9FAFB] px-[12px] text-left font-['Plus_Jakarta_Sans'] text-[12px] outline-none transition",
                        cityOpen
                          ? "border-[#E51C23] ring-1 ring-[#E51C23]/20"
                          : "border-[#E5E7EB] hover:border-[#D1D5DB]",
                      ].join(" ")}
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 16 16"
                        className={[
                          "mr-2 h-[12px] w-[12px] shrink-0 text-[#94A3B8] transition-transform duration-150",
                          cityOpen ? "rotate-180" : "",
                        ].join(" ")}
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

                      <span className={desiredCity ? "text-[#111827]" : "text-[#9CA3AF]"}>
                        {desiredCity || "Select or enter your city"}
                      </span>
                    </button>

                    <div
                      className={[
                        "absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0px_16px_30px_rgba(15,23,42,0.10)] transition duration-150",
                        cityOpen
                          ? "pointer-events-auto translate-y-0 opacity-100"
                          : "pointer-events-none -translate-y-1 opacity-0",
                      ].join(" ")}
                    >
                      <div className="border-b border-[#F3F4F6] p-2">
                        <div className="flex h-[34px] items-center rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] px-3 focus-within:border-[#E51C23] focus-within:ring-1 focus-within:ring-[#E51C23]/20">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            className="mr-2 h-3.5 w-3.5 shrink-0 text-[#94A3B8]"
                            fill="none"
                          >
                            <path
                              d="M7 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0 0 4 4"
                              stroke="currentColor"
                              strokeWidth="1.4"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <input
                            ref={cityInputRef}
                            type="text"
                            value={cityInput}
                            onChange={(event) => {
                              setCityInput(event.target.value);
                              setCityOpen(true);
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                const trimmed = cityInput.trim();
                                if (trimmed) {
                                  commitCity(trimmed);
                                }
                              }
                              if (event.key === "Escape") {
                                setCityOpen(false);
                              }
                            }}
                            placeholder="Select or enter your city"
                            className="h-full w-full bg-transparent text-[10px] text-[#111827] outline-none placeholder:text-[#9CA3AF]"
                          />
                        </div>
                      </div>

                      <div className="max-h-[180px] overflow-auto p-1">
                        {filteredCities.length ? (
                          filteredCities.map((city) => {
                            const active = city === desiredCity;
                            return (
                              <button
                                key={city}
                                type="button"
                                onClick={() => commitCity(city)}
                                className={[
                                  "flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left font-['Plus_Jakarta_Sans'] text-[12px] transition",
                                  active
                                    ? "bg-[#FEF2F2] text-[#E51C23]"
                                    : "text-[#374151] hover:bg-[#F9FAFB] hover:text-[#111827]",
                                ].join(" ")}
                              >
                                <span>{city}</span>
                                {active ? (
                                  <span className="text-[10px] font-bold uppercase tracking-[0.08em]">
                                    Selected
                                  </span>
                                ) : null}
                              </button>
                            );
                          })
                        ) : (
                          <button
                            type="button"
                            onClick={() => commitCity(cityInput.trim())}
                            className="flex w-full items-center justify-between rounded-[8px] px-3 py-2 text-left font-['Plus_Jakarta_Sans'] text-[12px] text-[#E51C23] transition hover:bg-[#FEF2F2]"
                          >
                            <span>Use “{cityInput.trim()}”</span>
                            <span className="text-[10px] font-bold uppercase tracking-[0.08em]">
                              Custom
                            </span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </label>

                <label className="flex cursor-pointer items-start gap-[10px]">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-[1px] h-[16px] w-[16px] shrink-0 cursor-pointer rounded-[2px] border-[#E51C23] accent-[#E51C23]"
                  />

                  <span className="max-w-[270px] font-['Plus_Jakarta_Sans'] text-[10px] font-normal leading-[12px] text-[#334155]">
                    I agree to be contacted by PropertySerch regarding availability in my requested city and accept the Privacy Policy
                  </span>
                </label>

                <button
                  type="submit"
                  className="cta-red mt-auto inline-flex h-[35px] w-full shrink-0 items-center justify-center rounded-[7px] border-0 font-['Plus_Jakarta_Sans'] text-[14px] font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-[#E51C23]/30"
                >
                  Request City
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="flex-1" aria-hidden="true" />
      <BusinessGrowthPromoSection />
      <CareersPromoSection />
      <GuidesSearchBenefitsSection />
      <CompanyFooterSection />
    </main>
  );
}

export default GetInvolvedPage;
