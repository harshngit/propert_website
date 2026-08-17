import React from "react";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import PropertyGallery from "../components/PropertyGallery";
import { propertyResults } from "../data/propertyResults";

function LocationIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4 shrink-0 text-[#6B7280]" fill="none">
      <path d="M8 14s4.5-4.2 4.5-7.5a4.5 4.5 0 1 0-9 0C3.5 9.8 8 14 8 14Z" fill="currentColor" />
      <circle cx="8" cy="6.5" r="1.6" fill="white" />
    </svg>
  );
}

function BedIcon() {
  return <img src="/images/bhk.png" alt="" aria-hidden="true" className="h-[14px] w-[14px] shrink-0 object-contain" />;
}

function AreaIcon() {
  return <img src="/images/Vector.png" alt="" aria-hidden="true" className="h-[13px] w-[13px] shrink-0 object-contain" />;
}

function BackIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none">
      <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const AMENITIES = ["Gym", "Swimming Pool", "Park", "Clubhouse", "24x7 Security", "Power Backup"];

function PropertyDetailPage() {
  const { id } = useParams();
  const property = propertyResults.find((item) => String(item.id) === id);

  if (!property) {
    return (
      <main className="min-h-screen w-full bg-white text-[#0F172A]">
        <SiteHeader />
        <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-red-500">PropertySerch</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-5xl">
            We couldn&apos;t find that listing
          </h1>
          <p className="mt-4 text-lg text-slate-500">
            It may have been sold, taken down, or the link is incorrect.
          </p>
          <Link to="/properties" className="cta-red mt-8 inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-extrabold text-white">
            Browse all properties
          </Link>
        </section>
        <CompanyFooterSection />
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full bg-white text-[#0F172A]">
      <SiteHeader />

      <section className="mx-auto max-w-[1100px] px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          to="/properties"
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#6B7280] transition hover:text-[#111827]"
        >
          <BackIcon />
          Back to search results
        </Link>

        <nav aria-label="Breadcrumb" className="mt-3 flex flex-wrap items-center gap-1.5 text-[13px] text-[#6B7280]">
          <Link to="/" className="font-semibold transition hover:text-[#111827]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/properties" className="font-semibold transition hover:text-[#111827]">
            {property.city}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="font-semibold text-[#111827]">{property.title}</span>
        </nav>
      </section>

      <section className="mx-auto max-w-[1100px] px-4 pt-4 sm:px-6 lg:px-8">
        <PropertyGallery
          images={property.images && property.images.length ? property.images : [property.image]}
          title={property.title}
          heroOverlay={
            <>
              <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                {property.badge && (
                  <span className="whitespace-nowrap rounded-full bg-[#E51C23] px-4 py-2 text-[12px] font-extrabold uppercase leading-none tracking-[0.02em] text-white shadow-[0_2px_6px_rgba(15,23,42,0.12)]">
                    {property.badge}
                  </span>
                )}
                {property.verified && (
                  <span className="whitespace-nowrap rounded-full bg-white px-4 py-2 text-[12px] font-extrabold uppercase leading-none tracking-[0.02em] text-[#111827] shadow-[0_2px_6px_rgba(15,23,42,0.12)]">
                    ✓ Verified
                  </span>
                )}
              </div>
              <div className="absolute right-4 top-4 whitespace-nowrap rounded-[8px] bg-[#111827] px-[10px] py-[8px] text-[10px] font-bold text-white">
                {property.match}
              </div>
            </>
          }
        />
      </section>

      <section className="mx-auto grid max-w-[1100px] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.6fr_1fr] lg:px-8">
        {/* LEFT: DETAILS */}
        <div>
          <h1 className="text-[26px] font-black leading-tight tracking-tight text-slate-950 sm:text-[32px]">
            {property.title}
          </h1>
          <p className="mt-2 flex items-center gap-1.5 text-[15px] text-[#6B7280]">
            <LocationIcon />
            {property.location}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-[#F3F4F6] py-5 text-[14px] font-semibold uppercase text-[#111827]">
            <span className="inline-flex items-center gap-2">
              <BedIcon />
              {property.details}
            </span>
            <span className="inline-flex items-center gap-2">
              <AreaIcon />
              {property.area}
            </span>
            <span className="text-[#6B7280]">{property.rate}</span>
          </div>

          <div className="mt-6">
            <h2 className="text-[16px] font-bold text-slate-950">About this property</h2>
            <p className="mt-3 max-w-[620px] text-[15px] leading-7 text-[#4B5563]">
              {property.title} is a {property.details.toLowerCase()} home in {property.location.split(",")[0]}, offering{" "}
              {property.area} of living space. This listing is {property.verified ? "verified by our team" : "newly listed"}{" "}
              and {property.tags?.[0]?.toLowerCase()}, making it a strong fit for buyers looking to move without delay.
            </p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {property.tags?.map((tag) => (
              <span
                key={tag}
                className="inline-flex h-[30px] items-center rounded-[6px] bg-[#F9FAFB] px-[12px] text-[11px] font-semibold uppercase leading-[16px] text-[#6B7280]"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <h2 className="text-[16px] font-bold text-slate-950">Amenities</h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:grid-cols-3">
              {AMENITIES.map((amenity) => (
                <div
                  key={amenity}
                  className="rounded-[10px] border border-[#F3F4F6] bg-[#F9FAFB] px-3 py-2.5 text-[13px] font-semibold text-[#374151]"
                >
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: PRICE + CTA CARD */}
        <div>
          <div className="sticky top-24 rounded-[20px] border border-[#F3F4F6] bg-white p-6 shadow-[0_18px_36px_rgba(15,23,42,0.08)]">
            <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6B7280]">Price</p>
            <p className="mt-1 text-[30px] font-black text-slate-950">₹{property.price}</p>
            <p className="text-[13px] text-[#6B7280]">₹{property.rate}</p>

            <div className="mt-6 flex flex-col gap-3">
              <button type="button" className="cta-red inline-flex h-[48px] w-full items-center justify-center rounded-[12px] text-[14px] font-bold text-white">
                Enquire Now
              </button>
              <button type="button" className="inline-flex h-[48px] w-full items-center justify-center gap-2 rounded-[12px] border-2 border-[#E51C23] bg-white text-[14px] font-bold text-[#E51C23]">
                <img src="/images/phone.png" alt="" aria-hidden="true" className="h-[16px] w-[16px] object-contain" />
                Call Owner
              </button>
            </div>

            <p className="mt-4 text-center text-[12px] text-[#9CA3AF]">
              Contact details are shared only after you enquire.
            </p>
          </div>
        </div>
      </section>

      <CompanyFooterSection />
    </main>
  );
}

export default PropertyDetailPage;
