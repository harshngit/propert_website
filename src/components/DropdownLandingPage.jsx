import React from "react";
import SiteHeader from "./SiteHeader";
import CompanyFooterSection from "./home/CompanyFooterSection";

function LocationIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="h-4 w-4 shrink-0 text-[#6B7280]"
      fill="none"
    >
      <path
        d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14Z"
        fill="currentColor"
      />
      <circle cx="8" cy="6.5" r="1.6" fill="white" />
    </svg>
  );
}

function FiltersIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 14 14" className="h-[14px] w-[14px] shrink-0" fill="none">
      <path
        d="M1.75 3h10.5M3.5 7h7M5.25 11h3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TopicsIcon() {
  return (
    <img
      src="/icons/topic%20icom.png"
      alt=""
      aria-hidden="true"
      className="h-[13.125px] w-[14px] shrink-0 object-contain"
    />
  );
}

function SearchIcon({ className = "text-[#9CA3AF]" }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className={`h-4 w-4 shrink-0 ${className}`}
      fill="none"
    >
      <path
        d="M7.25 12.5a5.25 5.25 0 1 1 0-10.5 5.25 5.25 0 0 1 0 10.5Zm3.9-.9L15 15.45"
      stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
      <path
        d="M4 4l8 8M12 4l-8 8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Divider() {
  return <span className="h-6 w-px shrink-0 bg-slate-200" />;
}

function FilterField({ label, value }) {
  return (
    <div className="inline-flex items-center whitespace-nowrap text-[14px] leading-5 text-[#475569]">
      <span>{label}</span>
      <span className="ml-2 font-semibold text-[#0F172A]">{value}</span>
    </div>
  );
}

function SidebarSection({ title, children }) {
  return (
    <section>
      <h3 className="text-[14px] font-bold leading-[18px] text-[#111827]">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function PillButton({ label, active = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-[36px] w-[88px] items-center justify-center rounded-[8px] border p-2 text-[12px] font-medium transition",
        active
          ? "border-[#E51C23] bg-[#FFF5F5] text-[#E51C23]"
          : "border-[#E2E8F0] bg-white text-[#111827] hover:border-[#CBD5E1] hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function CheckboxItem({ label, checked = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 text-left text-[14px] leading-[16px] text-[#111827]"
    >
      <span
        className={[
          "inline-flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[2.5px] border",
          checked ? "border-[#E51C23] bg-[#E51C23] text-white" : "border-[#CBD5E1] bg-white",
        ].join(" ")}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-[10px] w-[10px]" fill="none">
            <path
              d="M2.5 6.2 4.8 8.5 9.5 3.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>

      <span className="font-['Lato'] font-normal">{label}</span>
    </button>
  );
}

function Toggle({ on = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={[
        "relative inline-flex h-[18px] w-[32px] items-center rounded-full",
        on ? "bg-[#E51C23]" : "bg-[#E5E7EB]",
      ].join(" ")}
    >
      <span
        className={[
          "inline-block h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform",
          on ? "translate-x-[16px]" : "translate-x-[2px]",
        ].join(" ")}
      />
    </button>
  );
}

function AmenityChip({ label, active = false, onClick }) {
  const widthByLabel = {
    Gym: "49.34px",
    Pool: "49px",
    Park: "49px",
    Clubhouse: "81.38px",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ width: widthByLabel[label] || "49px" }}
      className={[
        "inline-flex h-[30px] items-center justify-center rounded-full px-[12px] text-[12px] font-medium transition",
        active ? "bg-[#111827] text-white" : "bg-[#F3F4F6] text-[#111827] hover:bg-slate-200",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function PriceRangeSlider({ minValue, maxValue, onMinChange, onMaxChange }) {
  const min = 0;
  const max = 100;
  const minPercent = (minValue / max) * 100;
  const maxPercent = (maxValue / max) * 100;

  return (
    <div>
      <div className="relative h-[20px] w-full">
        <div className="absolute left-0 right-0 top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#E2E8F0]" />
        <div
          className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#E51C23]"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />

        <input
          type="range"
          min={min}
          max={max}
          value={minValue}
          onChange={(event) => {
            const nextMin = Math.min(Number(event.target.value), maxValue - 1);
            onMinChange(nextMin);
          }}
          aria-label="Minimum price"
          className="price-range-thumb absolute inset-0 z-[2] h-[20px] w-full appearance-none bg-transparent"
        />

        <input
          type="range"
          min={min}
          max={max}
          value={maxValue}
          onChange={(event) => {
            const nextMax = Math.max(Number(event.target.value), minValue + 1);
            onMaxChange(nextMax);
          }}
          aria-label="Maximum price"
          className="price-range-thumb absolute inset-0 z-[3] h-[20px] w-full appearance-none bg-transparent"
        />
      </div>

      <div className="mt-[4px] flex justify-between text-[12px] text-[#6B7280]">
        <span>₹50 Lakh</span>
        <span>₹10 Cr+</span>
      </div>

      <style>{`
        .price-range-thumb::-webkit-slider-runnable-track {
          height: 3px;
          background: transparent;
        }
        .price-range-thumb::-moz-range-track {
          height: 3px;
          background: transparent;
        }
        .price-range-thumb::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          border: 2px solid #E51C23;
          background: #ffffff;
          cursor: pointer;
          margin-top: -5.5px;
        }
        .price-range-thumb::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 9999px;
          border: 2px solid #E51C23;
          background: #ffffff;
          cursor: pointer;
        }
  `}</style>
    </div>
  );
}

function GuidesSearchSection({ title, description }) {
  return (
    <section className="w-full border-b border-[#E5E7EB] bg-white text-[#111827]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 py-8 text-center sm:px-6 lg:px-8 xl:px-[9px]">
        <div className="max-w-[900px]">
          <h1 className="font-['Plus_Jakarta_Sans'] text-[34px] font-extrabold leading-[42px] tracking-[-0.03em] text-[#111827] sm:text-[40px] sm:leading-[48px]">
            {title}
          </h1>
          <p className="mt-2 text-[18px] font-normal leading-[28px] text-[#667085]">
            {description}
          </p>
        </div>

        <div className="mt-8 flex w-full flex-col gap-3 md:flex-row md:items-center">
          <div className="flex h-[52px] min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
            <SearchIcon className="text-[#9CA3AF]" />
            <input
              type="text"
              aria-label="Search guides"
              placeholder="Search for guides, laws, or market reports..."
              className="min-w-0 flex-1 bg-transparent font-['Lato'] text-[14px] font-normal leading-[20px] text-[#111827] outline-none placeholder:text-[#94A3B8]"
            />
          </div>

          <button
            type="button"
            className="inline-flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-[12px] border border-[#E5E7EB] bg-white px-5 text-[14px] font-bold text-[#111827] md:w-[108px]"
          >
            <TopicsIcon />
            <span>Topics</span>
          </button>

          <button
            type="button"
            aria-label="Search"
            className="inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-[12px] bg-[#E51C23] text-white"
          >
            <SearchIcon className="text-white" />
          </button>
        </div>
      </div>
    </section>
  );
}

function createDrawerState() {
  return {
    minPrice: 18,
    maxPrice: 82,
    selectedBhk: ["2 BHK", "3 BHK"],
    selectedPropertyTypes: ["Apartment"],
    selectedPropertyStatus: ["Under Construction"],
    selectedFurnishing: ["Full"],
    selectedParking: ["2 Wheeler"],
    verifiedOnly: true,
    reraApproved: false,
    selectedAmenities: [],
  };
}

function resolveInitialDrawerState(initialDrawerState) {
  if (typeof initialDrawerState === "function") {
    return initialDrawerState();
  }

  if (initialDrawerState && typeof initialDrawerState === "object") {
    return initialDrawerState;
  }

  return createDrawerState();
}

function DrawerHeader({ title, onReset, onClose, showClose = true }) {
  return (
    <div className="flex w-full shrink-0 items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
      <h2 className="text-[16px] font-bold leading-[20px] text-[#111827]">{title}</h2>

      <div className="flex items-center gap-4">
        <button type="button" onClick={onReset} className="text-[12px] font-medium text-[#E51C23]">
          Reset All
        </button>

        {showClose && (
          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
          >
            <CloseIcon />
          </button>
        )}
      </div>
    </div>
  );
}

function ResultsSidebar({ drawerState, setDrawerState, onClose }) {
  return (
    <>
      <DrawerHeader
        title="Filters"
        onReset={() => setDrawerState(createDrawerState())}
        onClose={onClose}
      />

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-[24px]">
          <SidebarSection title="Price Range">
            <PriceRangeSlider
              minValue={drawerState.minPrice}
              maxValue={drawerState.maxPrice}
              onMinChange={(value) =>
                setDrawerState((current) => ({ ...current, minPrice: value }))
              }
              onMaxChange={(value) =>
                setDrawerState((current) => ({ ...current, maxPrice: value }))
              }
            />
          </SidebarSection>

          <SidebarSection title="BHK Type">
            <div className="flex flex-wrap gap-[8px]">
              {["1 BHK", "2 BHK", "3 BHK", "4 BHK", "5+ BHK"].map((label) => (
                <PillButton
                  key={label}
                  label={label}
                  active={drawerState.selectedBhk.includes(label)}
                  onClick={() =>
                    setDrawerState((current) => {
                      const selectedBhk = current.selectedBhk.includes(label)
                        ? current.selectedBhk.filter((item) => item !== label)
                        : [...current.selectedBhk, label];
                      return { ...current, selectedBhk };
                    })
                  }
                />
              ))}
            </div>
          </SidebarSection>

          <SidebarSection title="Property Type">
            <div className="flex flex-col gap-[8px]">
              <CheckboxItem
                label="Apartment"
                checked={drawerState.selectedPropertyTypes.includes("Apartment")}
                onClick={() =>
                  setDrawerState((current) => {
                    const selectedPropertyTypes = current.selectedPropertyTypes.includes("Apartment")
                      ? current.selectedPropertyTypes.filter((item) => item !== "Apartment")
                      : [...current.selectedPropertyTypes, "Apartment"];
                    return { ...current, selectedPropertyTypes };
                  })
                }
              />
              <CheckboxItem
                label="Independent House/Villa"
                checked={drawerState.selectedPropertyTypes.includes("Independent House/Villa")}
                onClick={() =>
                  setDrawerState((current) => {
                    const selectedPropertyTypes = current.selectedPropertyTypes.includes(
                      "Independent House/Villa",
                    )
                      ? current.selectedPropertyTypes.filter(
                          (item) => item !== "Independent House/Villa",
                        )
                      : [...current.selectedPropertyTypes, "Independent House/Villa"];
                    return { ...current, selectedPropertyTypes };
                  })
                }
              />
              <CheckboxItem
                label="Plots"
                checked={drawerState.selectedPropertyTypes.includes("Plots")}
                onClick={() =>
                  setDrawerState((current) => {
                    const selectedPropertyTypes = current.selectedPropertyTypes.includes("Plots")
                      ? current.selectedPropertyTypes.filter((item) => item !== "Plots")
                      : [...current.selectedPropertyTypes, "Plots"];
                    return { ...current, selectedPropertyTypes };
                  })
                }
              />
            </div>
          </SidebarSection>

          <SidebarSection title="Property Status">
            <div className="flex flex-col gap-[8px]">
              <CheckboxItem
                label="Under Construction"
                checked={drawerState.selectedPropertyStatus.includes("Under Construction")}
                onClick={() =>
                  setDrawerState((current) => {
                    const selectedPropertyStatus = current.selectedPropertyStatus.includes(
                      "Under Construction",
                    )
                      ? current.selectedPropertyStatus.filter((item) => item !== "Under Construction")
                      : [...current.selectedPropertyStatus, "Under Construction"];
                    return { ...current, selectedPropertyStatus };
                  })
                }
              />
              <CheckboxItem
                label="Ready"
                checked={drawerState.selectedPropertyStatus.includes("Ready")}
                onClick={() =>
                  setDrawerState((current) => {
                    const selectedPropertyStatus = current.selectedPropertyStatus.includes("Ready")
                      ? current.selectedPropertyStatus.filter((item) => item !== "Ready")
                      : [...current.selectedPropertyStatus, "Ready"];
                    return { ...current, selectedPropertyStatus };
                  })
                }
              />
            </div>
          </SidebarSection>

          <SidebarSection title="Furnishing">
            <div className="flex flex-wrap items-center gap-[10px]">
              {["Full", "Semi", "None"].map((label) => (
                <CheckboxItem
                  key={label}
                  label={label}
                  checked={drawerState.selectedFurnishing.includes(label)}
                  onClick={() =>
                    setDrawerState((current) => {
                      const selectedFurnishing = current.selectedFurnishing.includes(label)
                        ? current.selectedFurnishing.filter((item) => item !== label)
                        : [...current.selectedFurnishing, label];
                      return { ...current, selectedFurnishing };
                    })
                  }
                />
              ))}
            </div>
          </SidebarSection>

          <SidebarSection title="Parking">
            <div className="flex flex-wrap items-center gap-[10px]">
              {["2 Wheeler", "4 Wheeler", "None"].map((label) => (
                <CheckboxItem
                  key={label}
                  label={label}
                  checked={drawerState.selectedParking.includes(label)}
                  onClick={() =>
                    setDrawerState((current) => {
                      const selectedParking = current.selectedParking.includes(label)
                        ? current.selectedParking.filter((item) => item !== label)
                        : [...current.selectedParking, label];
                      return { ...current, selectedParking };
                    })
                  }
                />
              ))}
            </div>
          </SidebarSection>

          <section className="border-t border-[#F3F4F6] pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold leading-[18px] text-[#111827]">
                Verified Only
              </span>
              <Toggle
                on={drawerState.verifiedOnly}
                onClick={() =>
                  setDrawerState((current) => ({
                    ...current,
                    verifiedOnly: !current.verifiedOnly,
                  }))
                }
              />
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className="text-[14px] font-bold leading-[18px] text-[#111827]">
                RERA Approved
              </span>
              <Toggle
                on={drawerState.reraApproved}
                onClick={() =>
                  setDrawerState((current) => ({
                    ...current,
                    reraApproved: !current.reraApproved,
                  }))
                }
              />
            </div>
          </section>

          <SidebarSection title="Amenities">
            <div className="flex flex-wrap gap-[10px]">
              {["Gym", "Pool", "Park", "Clubhouse"].map((label) => (
                <AmenityChip
                  key={label}
                  label={label}
                  active={drawerState.selectedAmenities.includes(label)}
                  onClick={() =>
                    setDrawerState((current) => {
                      const selectedAmenities = current.selectedAmenities.includes(label)
                        ? current.selectedAmenities.filter((item) => item !== label)
                        : [...current.selectedAmenities, label];
                      return { ...current, selectedAmenities };
                    })
                  }
                />
              ))}
            </div>
          </SidebarSection>
        </div>
      </div>
    </>
  );
}

function DropdownLandingPage({
  title,
  description,
  initialDrawerState,
  renderSidebar,
  heroVariant = "filters",
  belowHeroContent,
}) {
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [filtersMounted, setFiltersMounted] = React.useState(false);
  const [filtersEntered, setFiltersEntered] = React.useState(false);
  const [drawerState, setDrawerState] = React.useState(() =>
    resolveInitialDrawerState(initialDrawerState),
  );

  const resetFilters = React.useCallback(() => {
    setDrawerState(resolveInitialDrawerState(initialDrawerState));
  }, [initialDrawerState]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    if (filtersOpen) {
      setFiltersMounted(true);
      return undefined;
    }
    setFiltersEntered(false);
    if (!filtersMounted) return undefined;
    const timeout = setTimeout(() => setFiltersMounted(false), 300);
    return () => clearTimeout(timeout);
  }, [filtersOpen, filtersMounted]);

  React.useEffect(() => {
    if (!filtersMounted || !filtersOpen) return undefined;
    const raf = requestAnimationFrame(() => setFiltersEntered(true));
    return () => cancelAnimationFrame(raf);
  }, [filtersMounted, filtersOpen]);

  React.useEffect(() => {
    if (!filtersOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [filtersOpen]);

  return (
    <main className="flex min-h-screen w-full flex-col bg-white text-slate-900">
      <SiteHeader />

      {heroVariant === "search" ? (
        <>
          <GuidesSearchSection title={title} description={description} />
          {belowHeroContent}
        </>
      ) : (
        <section className="w-full border-b border-[#E5E7EB] bg-[#111827] text-white">
          <div className="w-full px-4 pb-8 pt-8 sm:px-6 lg:px-12">
            <div className="max-w-[1000px]">
              <h1 className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-[38px] tracking-[-0.03em] text-white sm:text-[34px] sm:leading-[42px]">
                {title}
              </h1>
              <p className="mt-2 max-w-[1040px] font-['Lato'] text-[15px] font-normal leading-6 text-white/85 sm:text-[16px]">
                {description}
              </p>
            </div>

            <div className="mt-8 flex w-full flex-col gap-3 md:flex-row md:items-center md:gap-4">
              <div className="flex h-[41px] min-w-0 flex-1 items-center gap-4 overflow-x-auto rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-4">
                <div className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[14px] text-[#0F172A]">
                  <LocationIcon />
                  <span className="font-semibold">Mumbai, Andheri West</span>
                </div>

                <Divider />

                <FilterField label="Type:" value="Buy" />

                <Divider />

                <FilterField label="Property:" value="Flat" />

                <Divider />

                <FilterField label="Budget:" value="₹1 Cr - ₹5 Cr" />
              </div>

              <div className="flex shrink-0 items-center gap-3 md:gap-4">
                <button
                  type="button"
                  onClick={() => setFiltersOpen((current) => !current)}
                  aria-expanded={filtersOpen}
                  aria-controls="results-filters"
                  className="inline-flex h-[45px] w-[149px] shrink-0 items-center justify-center gap-2 rounded-[12px] bg-white px-5 text-[14px] font-bold text-[#111827]"
                >
                  <FiltersIcon />
                  <span>More Filters</span>
                </button>

                <button
                  type="button"
                  aria-label="Search"
                  className="cta-red-on-dark inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[12px] bg-[#E51C23] text-white"
                >
                  <SearchIcon />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {heroVariant !== "search" && filtersMounted && (
        <div className="fixed inset-0 z-[100]">
          <button
            type="button"
            aria-label="Close filters"
            onClick={() => setFiltersOpen(false)}
            className={[
              "absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ease-out",
              filtersOpen && filtersEntered ? "opacity-100" : "opacity-0",
            ].join(" ")}
          />

          <aside
            id="results-filters"
            role="dialog"
            aria-modal="true"
            aria-labelledby="results-filters-title"
            className={[
              "fixed inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-[#E5E7EB] bg-white shadow-[-20px_0_60px_-24px_rgba(15,23,42,0.35)] transition-transform duration-300 ease-out",
              filtersOpen && filtersEntered ? "translate-x-0" : "translate-x-full",
            ].join(" ")}
          >
            {renderSidebar ? (
              renderSidebar({
                drawerState,
                setDrawerState,
                resetFilters,
                onClose: () => setFiltersOpen(false),
              })
            ) : (
              <ResultsSidebar
                drawerState={drawerState}
                setDrawerState={setDrawerState}
                onClose={() => setFiltersOpen(false)}
              />
            )}
          </aside>
        </div>
      )}

      <section className="flex-1" aria-hidden="true" />
      <CompanyFooterSection />
    </main>
  );
}

export default DropdownLandingPage;

export { CheckboxItem, DrawerHeader, SidebarSection, Toggle, createDrawerState };
