import { apiRequest } from "./client";

// Website CMS - blog/guide articles and city landing pages (backendapi's
// src/routes/content.routes.js). Only published content is returned.

export async function listArticles(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value);
  });
  const qs = query.toString();
  const res = await apiRequest(`/content/articles${qs ? `?${qs}` : ""}`);
  return res.data;
}

export async function getArticle(slug) {
  const res = await apiRequest(`/content/articles/${encodeURIComponent(slug)}`);
  return res.data;
}

export async function getCityPage(slug) {
  const res = await apiRequest(`/content/city-pages/${encodeURIComponent(slug)}`);
  return res.data;
}

export async function getDisclaimers(contentTypes = [], stateCode) {
  const query = new URLSearchParams();
  if (contentTypes.length) query.set("contentType", contentTypes.join(","));
  if (stateCode) query.set("stateCode", stateCode);
  const res = await apiRequest(`/disclaimers?${query.toString()}`);
  return res.data;
}

export async function listArticleCategories() {
  const res = await apiRequest("/content/articles/categories");
  return res.data;
}

// Newsletter sign-up (Blogs & Insights) - public; repeating an email is fine.
export async function subscribeNewsletter(email, sourcePage) {
  const res = await apiRequest("/content/newsletter", { method: "POST", body: { email, sourcePage } });
  return res.data;
}
