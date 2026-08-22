import React from "react";
import DropdownLandingPage, {
  CheckboxItem,
  DrawerHeader,
  SidebarSection,
  Toggle,
} from "../components/DropdownLandingPage";

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
      <DrawerHeader title="Filters" onReset={resetFilters} onClose={onClose} />

      <div className="flex-1 overflow-y-auto px-5 py-5">
        <div className="flex flex-col gap-[24px]">
          <SidebarSection title="Investment Size">
            <div className="flex flex-col gap-[12px]">
              {["₹50 Cr - ₹100 Cr", "₹100 Cr - ₹250 Cr", "₹250 Cr - ₹500 Cr", "Above ₹500 Cr"].map(
                (label) => (
                  <CheckboxItem
                    key={label}
                    label={label}
                    checked={drawerState.selectedInvestmentSizes.includes(label)}
                    onClick={() =>
                      setDrawerState((current) => {
                        const selectedInvestmentSizes = current.selectedInvestmentSizes.includes(label)
                          ? current.selectedInvestmentSizes.filter((item) => item !== label)
                          : [...current.selectedInvestmentSizes, label];
                        return { ...current, selectedInvestmentSizes };
                      })
                    }
                  />
                ),
              )}
            </div>
          </SidebarSection>

          <SidebarSection title="Property Type">
            <div className="flex flex-wrap gap-[8px]">
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
          </SidebarSection>

          <SidebarSection title="Opportunity Type">
            <div className="flex flex-col gap-[12px]">
              {["Direct Sale", "Debt Buyout", "Joint Venture"].map((label) => (
                <CheckboxItem
                  key={label}
                  label={label}
                  checked={drawerState.selectedOpportunityTypes.includes(label)}
                  onClick={() =>
                    setDrawerState((current) => {
                      const selectedOpportunityTypes = current.selectedOpportunityTypes.includes(label)
                        ? current.selectedOpportunityTypes.filter((item) => item !== label)
                        : [...current.selectedOpportunityTypes, label];
                      return { ...current, selectedOpportunityTypes };
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
          </section>

          <AdvisorCard />
        </div>
      </div>
    </>
  );
}

function InstitutionalPropertiesPage() {
  return (
    <DropdownLandingPage
      title="Institutional Opportunities"
      description="Exclusive access to high-value portfolios, commercial assets, and distressed debt opportunities for qualified institutional investors"
      initialDrawerState={createInvestmentDrawerState}
      renderSidebar={(props) => <InvestmentSidebar {...props} />}
    />
  );
}

export default InstitutionalPropertiesPage;
