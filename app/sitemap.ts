import type { MetadataRoute } from "next";

const SITE_URL = "https://e-biz.co.ke";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const pages: Array<[string, number]> = [
    ["", 1],
    ["features", 0.8],
    ["about", 0.6],
    ["contact", 0.6],
    ["privacy", 0.4],
    ["terms", 0.4],
    ["cookies", 0.3],
    ["refunds", 0.3],
  ];

  return pages.map(([path, priority]) => ({
    url: `${SITE_URL}/${path}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority,
  }));
}
