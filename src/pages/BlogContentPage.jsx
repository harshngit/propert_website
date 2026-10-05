import React, { useEffect } from "react";
import { articleSchema, breadcrumbSchema, useSeo } from "../lib/seo";
import { Link, useParams } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import CompanyFooterSection from "../components/home/CompanyFooterSection";
import { buildBlogArticlePath } from "../data/blogArticles";
import { useArticle, useArticleList } from "../hooks/useArticles";

function LinkedInIcon() {
  return (
    <img
      src="/icons/linkdin.png"
      alt=""
      aria-hidden="true"
      className="h-[20px] w-[20px] object-contain"
    />
  );
}

function ChainIcon() {
  return (
    <img
      src="/icons/link icon.png"
      alt=""
      aria-hidden="true"
      className="h-[14px] w-[18.88px] object-contain"
    />
  );
}

function BlogContentPage() {
  const { slug } = useParams();
  const { article, related, loading } = useArticle(slug);
  const { articles } = useArticleList(6);
  const latestArticles = (related.length ? related : articles).filter((a) => a.slug !== slug).slice(0, 3);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useSeo(
    article
      ? {
          title: article.seoTitle || article.title,
          description: article.seoDescription || article.excerpt || article.description,
          path: `/news-guide/article/${slug}`,
          image: article.image || undefined,
          type: "article",
          jsonLd: [
            articleSchema({ title: article.title, description: article.excerpt || article.description, image: article.image, publishedAt: article.publishedAt || article.published_at, updatedAt: article.updatedAt || article.updated_at, path: `/news-guide/article/${slug}`, author: article.author }),
            breadcrumbSchema([["Home", "/"], ["Insights & Guides", "/news-guide/insights-guides"], [article.title, `/news-guide/article/${slug}`]]),
          ],
        }
      : null,
    [article?.title, slug]
  );

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => {});
  };

  if (loading || !article) {
    return (
      <main className="min-h-screen bg-white text-[#111827]">
        <SiteHeader />
        <section className="mx-auto max-w-3xl px-4 py-24 text-center">
          {loading ? (
            <p className="text-sm text-slate-500">Loading article…</p>
          ) : (
            <>
              <h1 className="text-3xl font-black text-slate-950">Article not found</h1>
              <Link to="/news-guide/insights-guides" className="cta-red mt-8 inline-flex rounded-2xl px-6 py-3.5 text-sm font-extrabold text-white">
                Browse all articles
              </Link>
            </>
          )}
        </section>
        <CompanyFooterSection />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <SiteHeader />

      <section className="bg-white">
        <div className="mx-auto flex w-full max-w-[1350px] flex-col gap-0 px-4 pt-8 sm:gap-2 sm:px-6 lg:px-8 xl:px-0">
          <div className="flex items-center gap-3 text-[14px] font-semibold uppercase tracking-[0.08em] text-[#0F172A]">
            <span className="inline-flex h-[24px] items-center rounded-[6px] bg-[#FDECEC] px-3 text-[10px] font-extrabold uppercase text-[#111827] md:text-[12px]">
              {article.category}
            </span>
            {article.readDuration && (
              <>
                <span className="h-1.5 w-1.5 rounded-full bg-[#CBD5E1]" />
                <span className="text-[12px] font-medium normal-case tracking-normal text-[#475569] md:text-[14px]">{article.readDuration}</span>
              </>
            )}
          </div>

          <h1 className="mt-3 max-w-[1300px] font-['Plus_Jakarta_Sans'] text-[28px] font-extrabold leading-[1.12] tracking-[-0.04em] text-[#0F172A] md:mt-4 md:text-[36px]">
            {article.title}
          </h1>

          <div className="mt-4 flex items-start justify-between gap-6 border-b border-[#EEF2F7] pb-4 md:border-b-0 md:border-t md:pb-0 md:pt-6">
            <div className="pt-1.5">
              <div className="text-[16px] font-bold leading-[22px] text-[#111827] md:text-[16px]">{article.author}</div>
              <div className="mt-1 text-[12px] leading-[16px] text-[#94A3B8] md:text-[13px]">{article.date}</div>
            </div>

            <div className="pt-1.5 flex items-center gap-3">
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Share on LinkedIn"
                className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#E2E8F0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition hover:border-[#CBD5E1] md:h-[40px] md:w-[40px]"
              >
                <LinkedInIcon />
              </a>
              <button
                type="button"
                onClick={copyLink}
                aria-label="Copy link"
                className="inline-flex h-[32px] w-[32px] items-center justify-center rounded-full border border-[#E2E8F0] bg-white shadow-[0_4px_12px_rgba(15,23,42,0.04)] transition hover:border-[#CBD5E1] md:h-[40px] md:w-[40px]"
              >
                <ChainIcon />
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center md:mt-4">
            <img
              src={article.image}
              alt={article.title}
              className="h-[260px] w-[1350px] max-w-full rounded-[24px] object-cover md:h-[500px]"
            />
          </div>

          {article.contentHtml ? (
            // CMS body HTML is authored by admins in the CMS.
            <div
              className="mt-6 w-full max-w-[1100px] font-['Lato'] text-[17px] leading-[30px] text-[#334155] [&_a]:text-[#E51C23] [&_a]:underline [&_blockquote]:my-6 [&_blockquote]:border-l-[6px] [&_blockquote]:border-[#E51C23] [&_blockquote]:pl-6 [&_blockquote]:italic [&_h2]:mt-8 [&_h2]:font-['Plus_Jakarta_Sans'] [&_h2]:text-[26px] [&_h2]:font-extrabold [&_h2]:text-[#111827] [&_h3]:mt-6 [&_h3]:text-[20px] [&_h3]:font-bold [&_h3]:text-[#111827] [&_li]:mt-2 [&_ol]:ml-6 [&_ol]:list-decimal [&_p]:mt-4 [&_ul]:ml-6 [&_ul]:list-disc"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          ) : (
            <div className="mt-6 w-full max-w-[1100px] font-['Lato'] text-[17px] leading-[30px] text-[#334155]">
              {article.intro && <p className="text-[19px] text-[#111827]">{article.intro}</p>}
              {(article.body || []).map((paragraph) => (
                <p key={paragraph} className="mt-4">
                  {paragraph}
                </p>
              ))}
            </div>
          )}

          {article.faqs?.length > 0 && (
            <section className="mt-12 w-full max-w-[1100px]">
              <h2 className="font-['Plus_Jakarta_Sans'] text-[26px] font-extrabold text-[#111827]">Frequently asked questions</h2>
              <div className="mt-4 divide-y divide-[#EEF2F7] rounded-2xl border border-[#EEF2F7]">
                {article.faqs.map((faq) => (
                  <details key={faq.question} className="px-5 py-4">
                    <summary className="cursor-pointer font-semibold text-[#111827]">{faq.question}</summary>
                    <p className="mt-2 text-[15px] leading-7 text-[#475569]">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <section className="mt-14 w-full max-w-[1350px]">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="font-['Plus_Jakarta_Sans'] text-[30px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#111827]">
                  Latest Articles
                </h2>
                <p className="mt-2 text-[16px] leading-[24px] text-[#64748B]">
                  Stay updated with the latest in real estate
                </p>
              </div>
              <a href="/news-guide/insights-guides" className="hidden items-center gap-1 text-[16px] font-semibold text-[#E51C23] md:inline-flex">
                <span>View All</span>
                <span aria-hidden="true">›</span>
              </a>
            </div>

            <div className="mt-8 flex w-full snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 md:gap-6 md:overflow-visible md:pb-0 lg:grid-cols-3">
              {latestArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={buildBlogArticlePath(article)}
                  state={article}
                  className="block min-w-full snap-start md:min-w-0"
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
                        <span className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#E51C23]">
                          {article.category}
                        </span>
                        <span className="text-[12px] font-medium text-[#98A2B3]">
                          {article.readTime}
                        </span>
                      </div>

                      <h3 className="mt-3 min-h-[82px] font-['Plus_Jakarta_Sans'] text-[20px] font-bold leading-[1.35] tracking-[-0.02em] text-[#1E293B]">
                        {article.title}
                      </h3>

                      <p className="mt-3 min-h-[72px] text-[14px] leading-[22px] text-[#667085]">
                        {article.description}
                      </p>

                      <div className="mt-6 flex items-center justify-between border-t border-[#F1F5F9] pt-4">
                        <span className="text-[13px] text-[#98A2B3]">{article.date}</span>
                        <span className="inline-flex items-center gap-1 text-[14px] font-semibold text-[#E51C23]">
                          <span>Read More</span>
                          <span aria-hidden="true">›</span>
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>

      
      <CompanyFooterSection />
    </main>
  );
}

export default BlogContentPage;
