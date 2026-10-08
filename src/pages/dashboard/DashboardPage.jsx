import React, { useEffect, useState } from "react";
import { Link, NavLink, Navigate, useLocation, useParams } from "react-router-dom";
import SiteHeader from "../../components/SiteHeader";
import CompanyFooterSection from "../../components/home/CompanyFooterSection";
import { useAuth } from "../../context/AuthContext";
import { portal } from "../../api/portal";
import { LoadState, CRM_URL } from "./ui";
import OnboardingPanel from "./OnboardingPanel";
import OverviewSection from "./OverviewSection";
import RequirementsSection from "./RequirementsSection";
import MatchesSection from "./MatchesSection";
import SavedSection from "./SavedSection";
import EnquiriesSection from "./EnquiriesSection";
import ListingsSection from "./ListingsSection";
import RentalsSection from "./RentalsSection";
import DocumentsSection from "./DocumentsSection";
import NotificationsSection from "./NotificationsSection";
import ProfileSection from "./ProfileSection";
import NriSection from "./NriSection";
import HniSection from "./HniSection";
import ReviewsSection from "./ReviewsSection";
import DisputesSection from "./DisputesSection";
import DealsSection from "./DealsSection";
import InstitutionalSection from "./InstitutionalSection";
import RewardsSection from "./RewardsSection";
import PrivacySection from "./PrivacySection";
import MessagesSection from "./MessagesSection";
import ExchangeSection from "./ExchangeSection";
import WorkFromHomeSection from "./WorkFromHomeSection";
import DraftDocumentsSection from "./DraftDocumentsSection";

// My Dashboard - the Lite Dashboard (Annexure A sec. 13.1 / 13.2A) for a
// customer account acting as buyer, tenant, seller and/or owner. Which
// sections show depends on the roles picked in onboarding (editable under
// Profile); every section is still reachable by URL.


const SECTIONS = [
  { key: "overview", label: "Overview", roles: null, Component: OverviewSection },
  { key: "requirements", label: "My Requirements", roles: ["buyer", "tenant"], Component: RequirementsSection },
  { key: "matches", label: "Matched Properties", roles: ["buyer", "tenant"], Component: MatchesSection },
  { key: "saved", label: "Saved", roles: null, Component: SavedSection },
  { key: "enquiries", label: "Enquiries & Visits", roles: null, Component: EnquiriesSection },
  { key: "messages", label: "Messages", roles: null, Component: MessagesSection },
  { key: "deals", label: "My Deals & Invoices", roles: null, Component: DealsSection },
  { key: "listings", label: "My Listings", roles: ["seller", "owner"], Component: ListingsSection },
  { key: "exchange", label: "Property Exchange", roles: ["seller", "owner"], Component: ExchangeSection },
  { key: "rentals", label: "Rentals", roles: ["owner", "tenant"], Component: RentalsSection },
  // Shown when the investor profile (Profile > NRI / HNI) marks the person as NRI / HNI.
  { key: "nri", label: "NRI Services", investor: "is_nri", Component: NriSection },
  { key: "hni", label: "HNI Investments", investor: "is_hni", Component: HniSection },
  { key: "institutional", label: "Institutional", roles: null, Component: InstitutionalSection },
  { key: "reviews", label: "Reviews", roles: null, Component: ReviewsSection },
  { key: "work-from-home", label: "Work From Home", roles: null, Component: WorkFromHomeSection },
  { key: "rewards", label: "Rewards", roles: null, Component: RewardsSection },
  { key: "disputes", label: "Help & disputes", roles: null, Component: DisputesSection },
  { key: "documents", label: "Documents", roles: null, Component: DocumentsSection },
  { key: "draft-documents", label: "Draft documents", roles: null, Component: DraftDocumentsSection },
  { key: "notifications", label: "Notifications", roles: null, Component: NotificationsSection },
  { key: "profile", label: "Profile & Referral", roles: null, Component: ProfileSection },
  { key: "privacy", label: "Privacy & data", roles: null, Component: PrivacySection },
];

const ROLE_LABELS = { buyer: "Buyer", tenant: "Tenant", seller: "Seller", owner: "Owner / Landlord", nri: "NRI", hni: "HNI investor" };

function DashboardPage() {
  const { section = "overview" } = useParams();
  const location = useLocation();
  const { user, accessToken, isAuthenticated, isReady } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [investor, setInvestor] = useState(null);

  const isCustomer = user?.role === "customer";

  const loadProfile = () =>
    portal
      .profile(accessToken)
      .then((data) => {
        setProfile(data);
        setError(null);
      })
      .catch((err) => setError(err.message));

  useEffect(() => {
    if (!accessToken || !isCustomer) return;
    portal.investorProfile(accessToken).then(setInvestor).catch(() => setInvestor(null));
  }, [accessToken, isCustomer]);

  useEffect(() => {
    if (accessToken && isCustomer) loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, isCustomer]);

  if (isReady && !isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  const current = SECTIONS.find((s) => s.key === section);
  if (!current) return <Navigate to="/dashboard" replace />;

  const roles = profile?.portalRoles || [];
  const labelRoles = [...roles, ...(profile?.investor?.isNri ? ["nri"] : []), ...(profile?.investor?.isHni ? ["hni"] : [])];
  const visible = SECTIONS.filter((s) =>
    s.key === section ||
    (s.investor ? !!investor?.[s.investor] : !s.roles || s.roles.some((r) => roles.includes(r))),
  );
  const Section = current.Component;

  let body;
  if (!isReady || (isCustomer && !profile && !error)) {
    body = <LoadState loading />;
  } else if (!isCustomer) {
    body = (
      <div className="mx-auto max-w-[560px] rounded-[18px] border border-[#E5E7EB] bg-white p-8 text-center">
        <h1 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold text-[#111827]">Your workspace is the CRM</h1>
        <p className="mt-2 text-[14px] leading-6 text-[#6B7280]">
          This dashboard is for buyers, tenants, sellers and owners. Broker, builder and team accounts manage listings, leads and deals in
          the CRM.
        </p>
        <a href={CRM_URL} target="_blank" rel="noreferrer" className="cta-red mt-5 inline-flex h-[44px] items-center rounded-[12px] px-6 text-[14px] font-bold text-white">
          Open the CRM
        </a>
      </div>
    );
  } else if (error) {
    body = <LoadState error={error} onRetry={loadProfile} />;
  } else if (!profile.onboardedAt || (!roles.length && !profile.investor)) {
    body = (
      <OnboardingPanel
        profile={profile}
        onDone={(p) => {
          setProfile(p);
          portal.investorProfile(accessToken).then(setInvestor).catch(() => setInvestor(null));
        }}
      />
    );
  } else {
    body = (
      <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-3 hidden rounded-[16px] border border-[#E5E7EB] bg-white p-4 lg:block">
            <p className="truncate font-['Plus_Jakarta_Sans'] text-[15px] font-extrabold text-[#111827]">{profile.user.full_name}</p>
            <p className="mt-0.5 text-[12px] text-[#6B7280]">{labelRoles.map((r) => ROLE_LABELS[r]).join(" · ")}</p>
            {profile.referral?.code && (
              <p className="mt-2 inline-flex rounded-full bg-[#FDE8E8] px-2.5 py-0.5 font-mono text-[12px] font-bold text-[#E51C23]">
                {profile.referral.code}
              </p>
            )}
            {profile.tier?.current === "full" && (
              <a href={`${CRM_URL}/app/workspace`} target="_blank" rel="noreferrer" className="mt-3 block text-[13px] font-bold text-[#E51C23] hover:underline">
                Open my CRM workspace →
              </a>
            )}
          </div>
          <nav className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0">
            {visible.map((s) => (
              <NavLink
                key={s.key}
                to={s.key === "overview" ? "/dashboard" : `/dashboard/${s.key}`}
                end
                className={({ isActive }) =>
                  [
                    "shrink-0 whitespace-nowrap rounded-[12px] px-3.5 py-2 font-['Plus_Jakarta_Sans'] text-[14px] font-semibold transition",
                    isActive || s.key === section
                      ? "bg-[#FDE8E8] text-[#E51C23]"
                      : "border border-[#E5E7EB] bg-white text-[#374151] hover:bg-slate-50 lg:border-transparent lg:bg-transparent",
                  ].join(" ")
                }
              >
                {s.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <Section profile={profile} onProfileChange={setProfile} reloadProfile={loadProfile} />
        </section>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-[#F9FAFB] text-[#111827]">
      <SiteHeader />
      <div className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-12 lg:py-10">
        <div className="mb-4 flex items-center gap-2 text-[12px] text-[#9CA3AF]">
          <Link to="/" className="hover:text-[#E51C23]">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#6B7280]">My Dashboard</span>
        </div>
        {body}
      </div>
      <CompanyFooterSection />
    </main>
  );
}

export default DashboardPage;
