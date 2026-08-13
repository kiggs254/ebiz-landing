import { listPosts } from "@/lib/blog";

const SITE_URL = "https://e-biz.co.ke";

export const revalidate = 900;

const esc = (v: string) =>
  String(v || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** RSS for the blog — how readers and aggregators subscribe without polling. */
export async function GET() {
  const posts = await listPosts();
  const items = posts
    .map(
      (p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${SITE_URL}/blog/${esc(p.slug)}</link>
      <guid isPermaLink="true">${SITE_URL}/blog/${esc(p.slug)}</guid>
      ${p.excerpt ? `<description>${esc(p.excerpt)}</description>` : ""}
      ${p.published_at ? `<pubDate>${new Date(p.published_at).toUTCString()}</pubDate>` : ""}
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
    <title>E-biz Blog</title>
    <link>${SITE_URL}/blog</link>
    <description>Practical writing on running an online shop in Kenya.</description>
    <language>en</language>
${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
