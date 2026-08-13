import type { MetadataRoute } from "next";
import { ALL_DOCS } from "@/components/docs/registry";
import { listPosts } from "@/lib/blog";

const SITE_URL = "https://e-biz.co.ke";

type Freq = "weekly" | "monthly" | "yearly";

// Async so published posts are included. The blog fetch fails soft, so an
// unreachable Manager costs the post URLs, never the whole sitemap.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const core: Array<[string, number, Freq]> = [
    ["", 1, "weekly"],
    ["features", 0.9, "monthly"],
    ["get-started", 0.9, "monthly"],
    ["docs", 0.7, "weekly"],
    ["blog", 0.8, "weekly"],
    ["about", 0.6, "monthly"],
    ["contact", 0.6, "monthly"],
    ["privacy", 0.3, "yearly"],
    ["terms", 0.3, "yearly"],
    ["cookies", 0.3, "yearly"],
    ["refunds", 0.3, "yearly"],
  ];

  // Every API documentation page, straight from the docs registry.
  const docs: Array<[string, number, Freq]> = ALL_DOCS.map((d) => [
    `docs/${d.slug}`,
    0.5,
    "monthly",
  ]);

  const base = [...core, ...docs].map(([path, priority, changeFrequency]) => ({
    url: path ? `${SITE_URL}/${path}` : SITE_URL,
    lastModified: now,
    changeFrequency,
    priority,
  }));

  // Each published post, carrying its own last-modified date so a re-crawl is
  // driven by the post actually changing rather than the build running.
  const posts = (await listPosts()).map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at || p.published_at || now),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...base, ...posts];
}
