import React from "react";
import PropertiesPage from "./PropertiesPage";

function createInvestmentDrawerState() {
  return {
    selectedInvestmentSizes: ["₹50 Cr - ₹100 Cr"],
    selectedPropertyTypes: ["Educational"],
    selectedOpportunityTypes: ["Direct Sale"],
    verifiedOnly: true,
  };
}

function AdvisorCard() {
  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-4">
      <p className="text-[14px] font-normal leading-[20px] text-[#111827]">
        Need a tailored portfolio search?
      </p>
      <button
        type="button"
        className="mt-1 inline-flex items-center gap-1 text-[14px] font-semibold leading-[20px] text-[#E51C23]"
      >
        <span>Connect with Advisor</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

function InvestmentSidebar({ drawerState, setDrawerState, resetFilters, onClose }) {
  return (
    <>
      <div className="flex w-full shrink-0 items-center justify-between border-b border-[#F3F4F6] px-5 py-4">
        <h2 id="results-filters-title" className="text-[16px] font-bold leading-[20px]">
          Filters
        </h2>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={resetFilters}
            className="text-[12px] font-medium text-[#E51C23]"
          >
            Reset All
          </button>

          <button
            type="button"
            aria-label="Close filters"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#6B7280] transition hover:bg-[#F3F4F6] hover:text-[#111827]"
          >
            <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-[24px]">
          <section>
            <h3 className="text-[14px] font-bold leading-[18px] text-[#111827]">
              Investment Size
            </h3>

            <div className="mt-3 flex flex-col gap-[12px]">
              {["₹50 Cr - ₹100 Cr", "₹100 Cr - ₹250 Cr", "₹250 Cr - ₹500 Cr", "Above ₹500 Cr"].map(
                (label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() =>
                      setDrawerState((current) => {
                        const selectedInvestmentSizes = current.selectedInvestmentSizes.includes(label)
                          ? current.selectedInvestmentSizes.filter((item) => item !== label)
                          : [...current.selectedInvestmentSizes, label];
                        return { ...current, selectedInvestmentSizes };
                      })
                    }
                    className="flex items-center gap-3 text-left text-[14px] leading-[16px] text-[#111827]"
                  >
                    <span
                      className={[
                        "inline-flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[2.5px] border",
                        drawerState.selectedInvestmentSizes.includes(label)
                          ? "border-[#E51C23] bg-[#E51C23] text-white"
                          : "border-[#CBD5E1] bg-white",
                      ].join(" ")}
                    >
                      {drawerState.selectedInvestmentSizes.includes(label) && (
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
                ),
              )}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold leading-[18px] text-[#111827]">
              Property Type
            </h3>

            <div className="mt-3 flex flex-wrap gap-[8px]">
              {["Educational", "Industrial", "Hospitality", "Warehouse", "Mixed"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    setDrawerState((current) => {
                      const selectedPropertyTypes = current.selectedPropertyTypes.includes(label)
                        ? current.selectedPropertyTypes.filter((item) => item !== label)
                        : [...current.selectedPropertyTypes, label];
                      return { ...current, selectedPropertyTypes };
                    })
                  }
                  className={[
                    "inline-flex h-[36px] items-center justify-center rounded-[8px] border px-3 text-[12px] font-medium transition",
                    drawerState.selectedPropertyTypes.includes(label)
                      ? "border-[#E51C23] bg-[#FFF5F5] text-[#E51C23]"
                      : "border-[#E2E8F0] bg-white text-[#111827] hover:border-[#CBD5E1] hover:bg-slate-50",
                  ].join(" ")}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-[14px] font-bold leading-[18px] text-[#111827]">
              Opportunity Type
            </h3>

            <div className="mt-3 flex flex-col gap-[12px]">
              {["Direct Sale", "Debt Buyout", "Joint Venture"].map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    setDrawerState((current) => {
                      const selectedOpportunityTypes = current.selectedOpportunityTypes.includes(label)
                        ? current.selectedOpportunityTypes.filter((item) => item !== label)
                        : [...current.selectedOpportunityTypes, label];
                      return { ...current, selectedOpportunityTypes };
                    })
                  }
                  className="flex items-center gap-3 text-left text-[14px] leading-[16px] text-[#111827]"
                >
                  <span
                    className={[
                      "inline-flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-[2.5px] border",
                      drawerState.selectedOpportunityTypes.includes(label)
                        ? "border-[#E51C23] bg-[#E51C23] text-white"
                        : "border-[#CBD5E1] bg-white",
                    ].join(" ")}
                  >
                    {drawerState.selectedOpportunityTypes.includes(label) && (
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
              ))}
            </div>
          </section>

          <section className="border-t border-[#F3F4F6] pt-4">
            <div className="flex items-center justify-between">
              <span className="text-[14px] font-bold leading-[18px] text-[#111827]">
                Verified Only
              </span>

              <button
                type="button"
                aria-pressed={drawerState.verifiedOnly}
                onClick={() =>
                  setDrawerState((current) => ({
                    ...current,
                    verifiedOnly: !current.verifiedOnly,
                  }))
                }
                className={[
                  "relative inline-flex h-[18px] w-[32px] items-center rounded-full",
                  drawerState.verifiedOnly ? "bg-[#E51C23]" : "bg-[#E5E7EB]",
                ].join(" ")}
              >
                <span
                  className={[
                    "inline-block h-[14px] w-[14px] rounded-full bg-white shadow-sm transition-transform",
                    drawerState.verifiedOnly ? "translate-x-[16px]" : "translate-x-[2px]",
                  ].join(" ")}
                />
              </button>
            </div>
          </section>

          <AdvisorCard />
        </div>
      </div>
    </>
  );
}

function InstitutionalPropertiesPage() {
  return (
    <PropertiesPage
      heroTitle="Institutional Opportunities"
      heroDescription="Exclusive access to high-value portfolios, commercial assets, and distressed debt opportunities for qualified institutional investors"
      showTopSearchBar={false}
      initialDrawerState={createInvestmentDrawerState}
      renderSidebar={(props) => <InvestmentSidebar {...props} />}
    />
  );
}

export default InstitutionalPropertiesPage;
