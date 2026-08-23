export const blogArticles = [
  {
    slug: "rera-compliance-checklist-second-home-buyers-2024",
    image: "/images/seo1.png",
    category: "Legal & Tax",
    readTime: "12 Min Read",
    title: "RERA Compliance Checklist for Second-Home Buyers in 2024",
    description:
      "Navigating the complexities of holiday home registrations and state-specific tax implications...",
    date: "Oct 24, 2025",
    author: "PropertySerch Editorial Desk",
    readDuration: "6 min read",
    intro:
      "A practical guide to help second-home buyers understand the registration, documentation, and tax steps that matter before signing.",
    body: [
      "Buying a second home comes with a different compliance rhythm than an end-user purchase. From RERA registration checks to state-specific stamp duty rules, each step influences the final deal outcome.",
      "This article breaks down the paperwork, red flags, and practical checkpoints so buyers can move through the process with more confidence and fewer surprises.",
    ],
  },
  {
    slug: "mumbai-metro-line-3-impact-on-residential-prices",
    image: "/images/seo2.png",
    category: "Market Trends",
    readTime: "8 Min Read",
    title: "Mumbai Metro Line 3: Impact on Residential Prices in North Mumbai",
    description:
      "How infrastructure upgrades are creating new real estate hotspots in previously underserved areas...",
    date: "Oct 22, 2025",
    author: "PropertySerch Market Desk",
    readDuration: "5 min read",
    intro:
      "Infrastructure changes are reshaping how buyers assess micro-markets, commute times, and future appreciation potential.",
    body: [
      "Metro connectivity has historically influenced both rental demand and capital values in Mumbai’s residential corridors.",
      "In this piece, we look at what Line 3 means for North Mumbai, how localities may benefit, and what buyers should track next.",
    ],
  },
  {
    slug: "rise-of-reits-direct-ownership-vs-real-estate-stocks",
    image: "/images/seo3.png",
    category: "Investment",
    readTime: "15 Min Read",
    title: "The Rise of REITs: Comparing Direct Ownership vs. Real Estate Stocks",
    description:
      "A guide for HNI investors looking to diversify their portfolios without the hassle of property management...",
    date: "Aug 5, 2026",
    author: "PropertySerch Research Team",
    readDuration: "7 min read",
    intro:
      "REITs are opening up a more liquid route to real estate exposure, but they are not a direct replacement for physical ownership.",
    body: [
      "For investors seeking diversification, REITs and listed property plays offer easier entry and exit compared with direct acquisitions.",
      "We compare cash flow, control, tax considerations, and return potential so readers can decide what fits their portfolio goals.",
    ],
  },
  {
    slug: "institutional-real-estate-outlook-private-equity-school-assets",
    image: "/images/buy or sell.png",
    category: "Featured",
    readTime: "10 Min Read",
    title: "The 2024 Institutional Real Estate Outlook: Why Private Equity is Pivoting to School Assets",
    description:
      "An in-depth analysis of why K-12 education infrastructure has become the most resilient real estate asset class in India...",
    date: "Aug 23, 2026",
    author: "PropertySerch Institutional Desk",
    readDuration: "8 min read",
    intro:
      "Institutional capital is increasingly chasing long-duration, stable-yield assets with strong social infrastructure demand.",
    body: [
      "School assets are being evaluated as resilient operating assets with long-term occupancy and strategic urban placement.",
      "This feature explores why private equity has been reallocating toward these assets and what the structure looks like in practice.",
    ],
  },
];

export function findBlogArticleBySlug(slug) {
  return blogArticles.find((article) => article.slug === slug) ?? blogArticles[0] ?? null;
}

export function buildBlogArticlePath(article) {
  return `/news-guide/article/${article?.slug ?? "article"}`;
}
