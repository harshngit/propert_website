import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import DropdownLandingPage from "../components/DropdownLandingPage";
import { buildBlogArticlePath } from "../data/blogArticles";
import { useArticleCategories, useArticleList } from "../hooks/useArticles";
import { subscribeNewsletter } from "../api/content";
import { buildCityPath } from "../utils/city";

const STATIC_FEATURED_SLUG = "institutional-real-estate-outlook-private-equity-school-assets";

// The featured article is the CMS article marked featured (or, with the
// static fallback, the institutional outlook piece); everything else is
// "latest".
function splitArticles(articles, fromCms) {
  const featured = fromCms
    ? articles.find((a) => a.isFeatured) || articles[0]
    : articles.find((a) => a.slug === STATIC_FEATURED_SLUG) || articles[0];
  return { featured, latest: articles.filter((a) => a !== featured) };
}

function FeaturedArticleSection({ featuredArticle }) {
  if (!featuredArticle) return null;

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
            {featuredArticle.fromCms ? (
              <img
                src={featuredArticle.image}
                alt={featuredArticle.title}
                className="h-[263px] w-full object-cover object-center md:h-[300px] md:w-[600px]"
              />
            ) : (
              <picture>
                <source media="(min-width: 768px)" srcSet="/images/buy or sell.png" />
                <img
                  src="/images/blog mobile view.png"
                  alt="Premium real estate"
                  className="h-[263px] w-full object-cover object-center md:h-[300px] md:w-[600px]"
                />
              </picture>
            )}
          </div>

          <div className="ml-0 min-w-0 md:ml-[40px]">
            <span className="inline-flex h-[25px] items-center rounded-full bg-white/10 px-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/75 md:h-[20px]">
              Featured
            </span>

            <h2 className="mt-4 max-w-[800px] font-['Plus_Jakarta_Sans'] text-[20px] font-extrabold leading-[35px] tracking-[-0.03em] text-white sm:text-[30px] md:text-[36px] md:leading-[1.15]">
              {featuredArticle.title}
            </h2>

            <p className="mt-4 max-w-[760px] text-[12px] leading-[26px] text-white/55 sm:text-[16px]">
              {featuredArticle.description}
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

function LatestArticlesSection({ articles, heading = "Latest Articles", subheading = "Stay updated with the latest in real estate" }) {

  return (
    <section className="w-full bg-white">
      <div className="mx-auto w-full max-w-[1440px] px-4 pt-4 pb-4 sm:px-6 lg:px-8 xl:px-[9px]">
        <div className="mb-6">
          <h2 className="font-['Plus_Jakarta_Sans'] text-[24px] font-extrabold leading-[32px] tracking-[-0.03em] text-[#111827]">
            {heading}
          </h2>
          <p className="mt-1 text-[12px] leading-[20px] text-[#667085]">
            {subheading}
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

function CityGuideCard({ image, title, count, city }) {
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

        <Link
          to={buildCityPath(city)}
          className="mt-4 inline-flex h-[30px] items-center justify-center rounded-[8px] border border-white/16 bg-white/14 px-4 text-[12px] font-semibold text-white backdrop-blur-sm transition hover:bg-white/22"
        >
          Explore City
        </Link>
      </div>
    </article>
  );
}

function UltimateCityGuidesSection() {
  const cities = [
    { image: "/images/city-guide-mumbai.png", title: "Mumbai", city: "Mumbai", count: 42 },
    { image: "/images/city-guide-delhi.png", title: "Delhi NCR", city: "Delhi", count: 35 },
    { image: "/images/city-guide-bangalore.png", title: "Bangalore", city: "Bengaluru", count: 28 },
    { image: "/images/city-guide-hyderabad.png", title: "Hyderabad", city: "Hyderabad", count: 22 },
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
  const [email, setEmail] = React.useState("");
  const [state, setState] = React.useState({ status: "idle", message: "" });
  const submit = async (event) => {
    event.preventDefault();
    setState({ status: "saving", message: "" });
    try {
      await subscribeNewsletter(email.trim(), window.location.pathname);
      setState({ status: "done", message: "You're subscribed - look out for our weekly market brief." });
      setEmail("");
    } catch (err) {
      setState({ status: "error", message: err.message });
    }
  };
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
            <form onSubmit={submit} className="flex h-[48px] w-full items-stretch rounded-[16px] border border-[#FFFFFF33] bg-[#FFFFFF1A] p-[4px] backdrop-blur-[4px]">
              <input
                type="email"
                required
                aria-label="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-5 text-[18px] font-normal text-white outline-none placeholder:font-normal placeholder:text-[14px] placeholder:opacity-100 placeholder:text-[#808899]"
              />
              <button
                type="submit"
                disabled={state.status === "saving"}
                className="ml-[4px] inline-flex h-full w-[43%] min-w-[130px] shrink-0 items-center justify-center rounded-[12px] bg-[#E51C23] px-6 text-[14px] font-medium text-white transition hover:bg-[#cf171d] disabled:opacity-60"
              >
                {state.status === "saving" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
            {state.message && (
              <p role="status" className={`mt-2 text-[13px] ${state.status === "error" ? "text-red-300" : "text-emerald-300"}`}>
                {state.message}
              </p>
            )}

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
  const [params, setParams] = useSearchParams();
  const query = params.get("q") || "";
  const topic = params.get("category") || "";
  const filtering = !!(query || topic);
  const { articles, fromCms, loading } = useArticleList(filtering ? 24 : 13, { search: query, category: topic });
  const topics = useArticleCategories();
  const { featured, latest } = splitArticles(articles, fromCms);
  const updateParams = (next) => {
    const merged = { q: query, category: topic, ...next };
    setParams(Object.fromEntries(Object.entries(merged).filter(([, v]) => v)));
  };

  return (
    <DropdownLandingPage
      title="Blogs & Insights"
      description="Deep-dive into the Indian real estate market, legal checklists, city guides, and investment intelligence to help you make your choice with confidence."
      heroVariant="search"
      searchProps={{
        query,
        onSearch: (q) => updateParams({ q }),
        topics,
        activeTopic: topic,
        onTopic: (category) => updateParams({ category }),
      }}
      belowHeroContent={
        <>
          {filtering ? (
            articles.length ? (
              <LatestArticlesSection
                articles={articles}
                heading={query ? `Results for "${query}"` : topic}
                subheading={`${articles.length} guide${articles.length === 1 ? "" : "s"}${query && topic ? ` in ${topic}` : ""}`}
              />
            ) : (
              <section className="mx-auto w-full max-w-[1440px] px-4 py-12 text-center sm:px-6">
                <p className="font-['Plus_Jakarta_Sans'] text-[18px] font-bold text-[#111827]">{loading ? "Searching…" : "No guides found"}</p>
                {!loading && (
                  <button type="button" onClick={() => setParams({})} className="mt-2 text-[14px] font-bold text-[#E51C23]">
                    Clear search
                  </button>
                )}
              </section>
            )
          ) : (
            <>
              <FeaturedArticleSection featuredArticle={featured} />
              <LatestArticlesSection articles={latest.slice(0, 6)} />
              {latest.length > 6 && <LatestArticlesSection articles={latest.slice(6, 12)} heading="More Articles" />}
            </>
          )}
          <UltimateCityGuidesSection />
          <SubscribeBannerSection />
        </>
      }
    />
  );
}

export default InsightsGuidesPage;
