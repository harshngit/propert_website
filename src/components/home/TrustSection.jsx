import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import GuideCard from "../GuideCard";
import { searchTags, whyItems } from "../../data/homeContent";
import { listTestimonials } from "../../api/content";
import { useGuideCards } from "../../hooks/useArticles";

function TrustSection({
  title = "Testimonials",
  subtitle = "Trusted by owners, buyers and institutions",
  city,
}) {
  // Testimonials are published from the CRM (Website Content > Testimonials);
  // a city page shows that city's own first. With none published the block
  // is left out rather than showing sample quotes.
  const [testimonials, setTestimonials] = useState([]);
  useEffect(() => {
    let cancelled = false;
    listTestimonials({ city, limit: 4 })
      .then((rows) => !cancelled && setTestimonials(rows.map((t) => ({ id: t.id, quote: t.quote, name: t.personName, role: [t.personRole, t.city].filter(Boolean).join(" · "), avatarImage: t.photoUrl, rating: t.rating || 5 }))))
      .catch(() => !cancelled && setTestimonials([]));
    return () => {
      cancelled = true;
    };
  }, [city]);
  const guideItems = useGuideCards(2);

  return (
    <div className="mt-12 px-0">
      {testimonials.length > 0 && (
      <div className="mx-auto max-w-full">
        <h3 className="text-[36px] font-black leading-tight text-[#E51C23] md:text-[34px]">{title}</h3>
        <p className="mt-1 text-[16px] text-slate-500">{subtitle}</p>

        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory md:grid md:grid-cols-2 md:overflow-visible md:pb-0 xl:grid-cols-4">
          {testimonials.map((item) => (
            <article
              key={item.id}
              className="min-w-full shrink-0 snap-start rounded-[26px] border border-[#dfe6f3] bg-white px-6 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] md:min-w-0 md:w-full"
            >
              <div className="text-[16px] leading-none tracking-[2px] text-[#f4b400]" aria-label={`${item.rating} out of 5`}>
                {"★★★★★".slice(0, item.rating)}
                <span className="text-[#E5E7EB]">{"★★★★★".slice(item.rating)}</span>
              </div>
              <p className="mt-4 min-h-[128px] max-w-[255px] overflow-hidden text-[12px] italic leading-7 text-[#525b6a] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3] sm:max-w-none sm:[display:block] sm:[-webkit-box-orient:initial] sm:[-webkit-line-clamp:unset] sm:overflow-visible">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                  {item.avatarImage ? (
                    <img
                      src={item.avatarImage}
                      alt=""
                      aria-hidden="true"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-[#FEE2E2] text-[14px] font-extrabold text-[#E51C23]">{item.name.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <div className="text-[14px] font-extrabold text-[#0f172a]">{item.name}</div>
                  <div className="text-[10px] text-slate-500">{item.role}</div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
      )}

      <div className="mt-12 border-t border-slate-100 pt-12">
        <div className="mx-auto grid max-w-full gap-10 xl:grid-cols-[1.1fr_1fr_1fr]">
          <div>
            <h4 className="text-[18px] font-black text-[#0f172a]">Popular Real Estate Guides</h4>
            <div className="mt-6 grid gap-5">
              {guideItems.map((item) => (
                <Link key={item.slug} to={`/news-guide/article/${item.slug}`} className="block transition hover:opacity-80">
                  <GuideCard item={item} />
                </Link>
              ))}
              {guideItems.length === 0 && <Link to="/news-guide/insights-guides" className="text-sm font-bold text-[#E51C23]">Browse all guides →</Link>}
            </div>
          </div>

          <div>
            <h4 className="text-[18px] font-black text-[#0f172a]">Popular Searches</h4>
            <div className="mx-auto mt-6 grid w-full max-w-[520px] grid-cols-2 gap-x-3 gap-y-3">
              {searchTags.map((tag) => (
                <span
                  key={tag}
                  className="flex w-full items-center justify-center whitespace-nowrap rounded-full border border-[#d7dfee] bg-[#F3F4F6] px-3 py-1.5 text-center text-[12px] leading-5 text-[#4B5563]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[18px] font-black text-[#0f172a]">Why PropertySerch</h4>
            <div className="mx-auto mt-6 grid w-full max-w-[520px] gap-3">
              {whyItems.map((item) => (
                <div
                  key={item}
                  className="flex w-full items-center justify-center rounded-full border border-[#d7dfee] bg-[#F3F4F6] px-3 py-1.5 text-center text-[12px] font-normal leading-5 text-[#4B5563]"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrustSection;
