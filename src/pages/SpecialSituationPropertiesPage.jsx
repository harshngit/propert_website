import React, { useEffect, useState } from "react";
import EnquiryModal from "../components/EnquiryModal";
import PropertiesPage from "./PropertiesPage";
import { DealFiltersSidebar, createDealFilterState, dealFiltersToParams } from "../components/DealFilters";

function AdvisorCard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-4">
      <EnquiryModal open={open} onClose={() => setOpen(false)} topic="Special Situation Advisor" description="Tell us your budget and the kind of opportunity you want - a deals advisor will shortlist options for you." />
      <p className="text-[14px] font-normal leading-[20px] text-[#111827]">
        Need a tailored portfolio search?
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-1 inline-flex items-center gap-1 text-[14px] font-semibold leading-[20px] text-[#E51C23]"
      >
        <span>Connect with Advisor</span>
        <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}

const renderDealSidebar = (props) => <DealFiltersSidebar context="special" {...props} footer={<AdvisorCard />} />;
const toParams = (state) => dealFiltersToParams(state, "special");

function SpecialSituationPropertiesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PropertiesPage
      heroTitle="Special Situation Opportunities"
      heroDescription="High-Opportunity Investment Deals - insolvency resolutions (NCLT), time-bound sales and structured exits for professional investors and funds"
      purpose="buy"
      mobileHeroTitle
      hideMobileHeroDescription
      showTopSearchBar={false}
      resultContext="special"
      initialDrawerState={createDealFilterState}
      renderSidebar={renderDealSidebar}
      drawerToParams={toParams}
    />
  );
}

export default SpecialSituationPropertiesPage;
