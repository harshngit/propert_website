import { useEffect, useState } from "react";
import { getArticle, listArticleCategories, listArticles } from "../api/content";
import { blogArticles, findBlogArticleBySlug } from "../data/blogArticles";

// Blog articles come from the CMS (/content/articles). Until the CMS has
// published content, the pages fall back to the bundled static articles so
// they never render empty. CMS rows are mapped to the static data's field
// names, which is what the page components already render.

const FALLBACK_IMAGES = ["/images/seo1.png", "/images/seo2.png", "/images/seo3.png"];

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });
}

export function fromCms(article, index = 0) {
  return {
    slug: article.slug,
    image: article.cover_image_url || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length],
    category: article.category,
    readTime: article.reading_minutes ? `${article.reading_minutes} Min Read` : "",
    readDuration: article.reading_minutes ? `${article.reading_minutes} min read` : "",
    title: article.title,
    description: article.excerpt || "",
    date: formatDate(article.published_at),
    author: article.author_name || "PropertySerch Editorial Desk",
    isFeatured: !!article.is_featured,
    contentHtml: article.content_html,
    publishedAt: article.published_at || null,
    updatedAt: article.updated_at || null,
    seoTitle: article.seo_title || null,
    seoDescription: article.seo_description || null,
    faqs: article.faqs || [],
    fromCms: true,
  };
}

// Static fallback articles filtered the same way the CMS search does
// (title / excerpt text and exact category).
function filterStatic({ search, category } = {}) {
  const q = (search || "").trim().toLowerCase();
  return blogArticles.filter(
    (a) =>
      (!category || a.category === category) &&
      (!q || `${a.title} ${a.description || ""} ${a.category || ""}`.toLowerCase().includes(q)),
  );
}

// `search` / `category` narrow the list (Blogs & Insights search box and
// Topics). While the CMS has no published articles at all, the bundled
// static ones are used - filtered client-side.
export function useArticleList(limit = 12, { search = "", category = "" } = {}) {
  const [state, setState] = useState({ articles: filterStatic({ search, category }), fromCms: false, loading: true });

  useEffect(() => {
    let cancelled = false;
    const filtering = !!(search || category);
    Promise.all([
      listArticles({ limit, search: search || undefined, category: category || undefined }),
      filtering ? listArticles({ limit: 1 }) : Promise.resolve(null),
    ])
      .then(([data, any]) => {
        if (cancelled) return;
        const items = data.items || [];
        const cmsHasContent = items.length > 0 || (any?.items || []).length > 0;
        setState(
          cmsHasContent
            ? { articles: items.map(fromCms), fromCms: true, loading: false }
            : { articles: filterStatic({ search, category }), fromCms: false, loading: false },
        );
      })
      .catch(() => {
        if (!cancelled) setState({ articles: filterStatic({ search, category }), fromCms: false, loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [limit, search, category]);

  return state;
}

// Topic list for the Topics menu - CMS categories, else the static ones.
export function useArticleCategories() {
  const [categories, setCategories] = useState(() => [...new Set(blogArticles.map((a) => a.category).filter(Boolean))]);
  useEffect(() => {
    let cancelled = false;
    listArticleCategories()
      .then((rows) => {
        const names = (rows || []).map((r) => r.category || r).filter(Boolean);
        if (!cancelled && names.length) setCategories(names);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);
  return categories;
}

export function useArticle(slug) {
  const [state, setState] = useState({ article: null, related: [], loading: true });

  useEffect(() => {
    let cancelled = false;
    setState({ article: null, related: [], loading: true });
    getArticle(slug)
      .then((data) => {
        if (cancelled) return;
        setState({ article: fromCms(data), related: (data.related || []).map(fromCms), loading: false });
      })
      .catch(() => {
        if (cancelled) return;
        const staticArticle = slug ? blogArticles.find((a) => a.slug === slug) : findBlogArticleBySlug(slug);
        setState({ article: staticArticle || null, related: [], loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return state;
}
