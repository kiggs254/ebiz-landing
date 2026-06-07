import type { MetadataRoute } from "next";
import { ALL_DOCS } from "@/components/docs/registry";

const SITE_URL = "https://e-biz.co.ke";

type Freq = "weekly" | "monthly" | "yearly";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const core: Array<[string, number, Freq]> = [
    ["", 1, "weekly"],
    ["features", 0.9, "monthly"],
    ["get-started", 0.9, "monthly"],
    ["docs", 0.7, "weekly"],
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

  return [...core, ...docs].map(([path, priority, changeFrequency]) => ({
    url: path ? `${SITE_URL}/${path}` : SITE_URL,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
