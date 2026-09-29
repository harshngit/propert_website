import React, { useEffect, useState } from "react";
import EnquiryModal from "../components/EnquiryModal";
import PropertiesPage from "./PropertiesPage";
import { DealFiltersSidebar, createDealFilterState, dealFiltersToParams } from "../components/DealFilters";

function AdvisorCard() {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[10px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-4">
      <EnquiryModal open={open} onClose={() => setOpen(false)} topic="Institutional Advisor" description="Tell us what you are looking for - asset type, city and ticket size - and an institutional advisor will call you back confidentially." />
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

const renderDealSidebar = (props) => <DealFiltersSidebar context="institutional" {...props} footer={<AdvisorCard />} />;
const toParams = (state) => dealFiltersToParams(state, "institutional");

function InstitutionalPropertiesPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <PropertiesPage
      heroTitle="Institutional Opportunities"
      heroDescription="Confidential sale, stake-sale, lease and JV opportunities for schools, colleges, hospitals, hotels and campuses - for verified institutional buyers"
      purpose="buy"
      mobileHeroTitle
      hideMobileHeroDescription
      resultContext="institutional"
      showTopSearchBar={false}
      initialDrawerState={createDealFilterState}
      renderSidebar={renderDealSidebar}
      drawerToParams={toParams}
    />
  );
}

export default InstitutionalPropertiesPage;
