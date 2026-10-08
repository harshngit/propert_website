import { useEffect, useState } from "react";
import { getArticle, listArticleCategories, listArticles } from "../api/content";

// Blog articles come from the CMS (/content/articles) - always the backend,
// never bundled sample content. CMS rows are mapped to the field names the
// page components render.

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

// `search` / `category` narrow the list (Blogs & Insights search box and
// Topics). Articles always come from the CMS (CRM > Website Content) -
// nothing is bundled with the site, so what the team publishes is exactly
// what visitors see.
export function useArticleList(limit = 12, { search = "", category = "" } = {}) {
  const [state, setState] = useState({ articles: [], fromCms: true, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true }));
    listArticles({ limit, search: search || undefined, category: category || undefined })
      .then((data) => {
        if (!cancelled) setState({ articles: (data.items || []).map(fromCms), fromCms: true, loading: false, error: null });
      })
      .catch((err) => {
        if (!cancelled) setState({ articles: [], fromCms: true, loading: false, error: err.message });
      });
    return () => {
      cancelled = true;
    };
  }, [limit, search, category]);

  return state;
}

// Latest guides as small cards (home page, city pages, Get Involved).
export function useGuideCards(limit = 2) {
  const { articles } = useArticleList(limit);
  return articles.slice(0, limit).map((a) => ({ title: a.title, meta: (a.readTime || a.category || "GUIDE").toUpperCase(), thumbImage: a.image, slug: a.slug }));
}

// Topic list for the Topics menu - CMS categories, else the static ones.
export function useArticleCategories() {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    let cancelled = false;
    listArticleCategories()
      .then((rows) => {
        const names = (rows || []).map((r) => r.category || r).filter(Boolean);
        if (!cancelled) setCategories(names);
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
        if (!cancelled) setState({ article: null, related: [], loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return state;
}
