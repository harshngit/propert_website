import React from "react";
import { Link } from "react-router-dom";
import DropdownLandingPage from "../components/DropdownLandingPage";
import { blogArticles, buildBlogArticlePath } from "../data/blogArticles";

function FeaturedArticleSection() {
  const featuredArticle = blogArticles.find(
    (article) => article.slug === "institutional-real-estate-outlook-private-equity-school-assets"
  );

  return (
    <section className="w-full bg-white">
      <div className="w-full pb-0 md:pb-8">
        <Link
          to={buildBlogArticlePath(featuredArticle)}
          state={featuredArticle}
          className="block"
        >
        <article className="grid w-full items-center gap-6 overflow-hidden bg-[#111827] px-5 pb-10 pt-11 text-white md:grid-cols-[500px_minmax(0,1fr)] md:gap-8 md:px-8 md:py-12">
          <div className="overflow-hidden rounded-[16px] bg-[#0F172A]">
            <picture>
              <source media="(min-width: 768px)" srcSet="/images/buy or sell.png" />
              <img
                src="/images/blog mobile view.png"
                alt="Premium real estate"
                className="h-[263px] w-full object-cover object-center md:h-[300px] md:w-[600px]"
              />
            </picture>
          </div>

          <div className="ml-0 min-w-0 md:ml-[40px]">
            <span className="inline-flex h-[25px] items-center rounded-full bg-white/10 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 md:h-[20px]">
              Featured
            </span>

            <h2 className="mt-4 max-w-[800px] font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold leading-[35px] tracking-[-0.03em] text-white sm:text-[30px] md:text-[36px] md:leading-[1.15]">
              The 2024 Institutional Real Estate Outlook:
              <br className="hidden md:block" />
              Why Private Equity is Pivoting to School Assets
            </h2>

            <p className="mt-4 max-w-[760px] text-[12px] leading-[26px] text-white/55 sm:text-[16px]">
              An in-depth analysis of why K-12 education infrastructure has become the most
              resilient real estate asset class in India, and how fractional ownership is changing
              the entry barrier.
            </p>

            <div className="mt-6 inline-flex h-[56px] w-full items-center justify-center rounded-[12px] bg-[#E51C23] px-6 text-[16px] font-bold text-white transition hover:bg-[#cf171d] md:h-[48px] md:w-auto md:text-[14px]">
              Read Full Article
            </div>
          </div>
        </article>
        </Link>
      </div>
    </section>
  );
}

function LatestArticlesSection() {
  const articles = blogArticles.filter(
    (article) => article.slug !== "institutional-real-estate-outlook-private-equity-school-assets"
  );

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-4 pb-4 sm:px-6 lg:px-8 xl:px-[9px]">
        <div className="mb-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[32px] tracking-[-0.03em] text-[#111827]">
            Latest Articles
          </h2>
          <p className="mt-1 text-[12px] leading-[20px] text-[#667085]">
            Stay updated with the latest in real estate
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={buildBlogArticlePath(article)}
              state={article}
              className="block"
            >
              <article className="overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(15,23,42,0.08)]">
                <div className="h-[250px] w-full overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="h-full w-full object-cover object-center"
                  />
                </div>

                <div className="px-5 pb-5 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#E51C23]">
                      {article.category}
                    </span>
                    <span className="text-[10px] font-medium text-[#98A2B3]">{article.readTime}</span>
                  </div>

                  <h3 className="mt-3 min-h-[65px] font-['Plus_Jakarta_Sans'] text-[18px] font-bold leading-[1.35] tracking-[-0.02em] text-[#1E293B]">
                    {article.title}
                  </h3>

                  <p className=" min-h-[55px] text-[12px] leading-[22px] text-[#667085]">
                    {article.description}
                  </p>

                  <div className=" flex items-center justify-between border-t border-[#F1F5F9] pt-4">
                    <span className="text-[10px] text-[#98A2B3]">{article.date}</span>
                    <span className="inline-flex items-center gap-1 text-[12px] font-bold text-[#E51C23]">
                      <span>Read More</span>
                      <span aria-hidden="true">›</span>
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PaginationButton({
  children,
  active = false,
  disabled = false,
  compact = false,
  onClick,
  ariaLabel,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      className={[
        "inline-flex h-[40px] items-center justify-center rounded-[8px] border text-[16px] font-bold leading-none transition",
        compact ? "min-w-[29px] px-[8px]" : "min-w-[40px] px-[12px]",
        active
          ? "border-[#E51C23] bg-[#E51C23] text-white"
          : compact
            ? "border-[#E5E7EB] bg-white text-[#9CA3AF] hover:border-slate-300 hover:bg-slate-50"
            : "border-[#E5E7EB] bg-white text-[#111827] hover:border-slate-300 hover:bg-slate-50",
        disabled ? "cursor-not-allowed opacity-50" : "",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function LatestArticlesPagination() {
  const pages = [1, 2, 3, 42];
  const [currentPage, setCurrentPage] = React.useState(1);

  const goToPrevPage = () => {
    const currentIndex = pages.indexOf(currentPage);
    const nextIndex = Math.max(0, currentIndex - 1);
    setCurrentPage(pages[nextIndex]);
  };

  const goToNextPage = () => {
    const currentIndex = pages.indexOf(currentPage);
    const nextIndex = Math.min(pages.length - 1, currentIndex + 1);
    setCurrentPage(pages[nextIndex]);
  };

  return (
    <section className="w-full bg-white pb-8">
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-8 xl:px-[9px]">
        <div className="flex items-center justify-center gap-2">
          <PaginationButton
            compact
            ariaLabel="Previous page"
            onClick={goToPrevPage}
            disabled={currentPage === pages[0]}
          >
            <span className="text-[24px] font-normal leading-none text-[#9CA3AF]">‹</span>
          </PaginationButton>

          {pages.slice(0, 3).map((page) => (
            <PaginationButton
              key={page}
              active={currentPage === page}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PaginationButton>
          ))}

          <span className="px-1 text-[14px] text-[#98A2B3]">...</span>

          <PaginationButton active={currentPage === 42} onClick={() => setCurrentPage(42)}>
            42
          </PaginationButton>

          <PaginationButton
            compact
            ariaLabel="Next page"
            onClick={goToNextPage}
            disabled={currentPage === pages[pages.length - 1]}
          >
            <span className="text-[24px] font-normal leading-none text-[#9CA3AF]">›</span>
          </PaginationButton>
        </div>
      </div>
    </section>
  );
}

function CityGuideCard({ image, title, count }) {
  return (
    <article className="group relative h-[293px] w-[calc(100vw-36px)] shrink-0 snap-start overflow-hidden rounded-[20px] bg-slate-950 shadow-[0_10px_24px_rgba(15,23,42,0.08)] md:h-[235px] md:w-auto md:shrink">
      <img
        src={image}
        alt={title}
        className="h-full w-full object-cover object-center transition duration-300 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/28 to-black/10" />
      <div className="absolute inset-x-0 bottom-0 p-5 text-white">
        <h3 className="font-['Plus_Jakarta_Sans'] text-[20px] font-bold leading-[1.1] tracking-[-0.02em]">
          {title}
        </h3>
        <p className="mt-1 text-[12px] font-medium text-white/65">{count} Deep-dive Guides</p>

        <button
          type="button"
          className="mt-4 inline-flex h-[30px] items-center justify-center rounded-[8px] border border-white/16 bg-white/14 px-4 text-[12px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/22"
        >
          Explore City
        </button>
      </div>
    </article>
  );
}

function UltimateCityGuidesSection() {
  const cities = [
    { image: "/images/city-guide-mumbai.png", title: "Mumbai", count: 42 },
    { image: "/images/city-guide-delhi.png", title: "Delhi NCR", count: 35 },
    { image: "/images/city-guide-bangalore.png", title: "Bangalore", count: 28 },
    { image: "/images/city-guide-hyderabad.png", title: "Hyderabad", count: 22 },
  ];

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 xl:px-[9px]">
        <div className="mb-6 max-w-[900px]">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#111827] sm:text-[32px]">
            Ultimate City Guides
          </h2>
          <p className="mt-2 text-[14px] leading-[24px] text-[#667085]">
            Master the micro-markets with our comprehensive neighborhood intelligence reports
          </p>
        </div>

      <div className="flex w-full snap-x snap-mandatory gap-5 overflow-x-auto px-0 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-4">
          {cities.map((city) => (
            <CityGuideCard key={city.title} {...city} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SubscribeBannerSection() {
  return (
    <section className="w-full bg-white ">
      <div className="w-full bg-[#111827] px-6 py-10 text-white sm:px-8 lg:px-12 xl:px-16">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div className="max-w-[560px]">
            <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[1.15] tracking-[-0.03em] text-white sm:text-[30px]">
              Stay ahead of the market
            </h2>
            <p className="mt-4 max-w-[520px] text-[14px] leading-[24px] text-white/62 sm:text-[16px]">
              Get exclusive market reports, legal updates, and high-yield institutional
              opportunities delivered once a week. No spam.
            </p>
          </div>

          <div className="w-full max-w-[430px] lg:pt-1">
            <div className="flex h-[48px] w-full items-stretch rounded-[16px] border border-[#FFFFFF33] bg-[#FFFFFF1A] p-[4px] backdrop-blur-[4px]">
              <input
                type="email"
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-5 text-[18px] font-normal text-white outline-none placeholder:font-normal placeholder:text-[14px] placeholder:opacity-100 placeholder:text-[#808899]"
              />
              <button
                type="button"
                className="ml-[4px] inline-flex h-full w-[43%] min-w-[130px] shrink-0 items-center justify-center rounded-[12px] bg-[#E51C23] px-6 text-[14px] font-medium text-white transition hover:bg-[#cf171d]"
              >
                Subscribe
              </button>
            </div>

            <p className="mt-3 text-right font-['Plus_Jakarta_Sans'] text-[12px] font-normal leading-[18px] tracking-[0] text-[#6B7280]">
              By subscribing, you agree to our Privacy Policy and Terms
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function InsightsGuidesPage() {
  return (
    <DropdownLandingPage
      title="Blogs & Insights"
      description="Deep-dive into the Indian real estate market, legal checklists, city guides, and investment intelligence to help you make your choice with confidence."
      heroVariant="search"
      belowHeroContent={
        <>
          <FeaturedArticleSection />
          <LatestArticlesSection />
          <LatestArticlesSection />
          <LatestArticlesPagination />
          <UltimateCityGuidesSection />
          <SubscribeBannerSection />
        </>
      }
    />
  );
}

export default InsightsGuidesPage;
