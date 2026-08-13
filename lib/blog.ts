/**
 * Blog posts, read from E-biz Manager.
 *
 * The landing page has no database of its own — posts are authored in the
 * Manager and served from its public, read-only endpoints. Everything here
 * fails soft: a blog outage must degrade to an empty list, never a 500 on the
 * marketing site.
 */

const MANAGER_URL = (process.env.MANAGER_URL || "https://manager.e-biz.co.ke").replace(/\/+$/, "");

export interface BlogSummary {
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  author: string | null;
  tags: string[];
  published_at: string | null;
  updated_at: string;
}

export interface BlogPost extends BlogSummary {
  content: string;
  seo_title: string | null;
  seo_description: string | null;
}

async function get<T>(path: string, revalidate: number): Promise<T | null> {
  try {
    const res = await fetch(`${MANAGER_URL}${path}`, {
      next: { revalidate },
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? null) as T | null;
  } catch {
    return null;
  }
}

/** Published posts, newest first. Empty when the Manager is unreachable. */
export async function listPosts(): Promise<BlogSummary[]> {
  const data = await get<BlogSummary[]>("/api/public/blog", 300);
  return Array.isArray(data) ? data : [];
}

/** One post, or null when it doesn't exist or isn't published. */
export async function getPost(slug: string): Promise<BlogPost | null> {
  return get<BlogPost>(`/api/public/blog/${encodeURIComponent(slug)}`, 300);
}

/** Rough read time — honest enough to set expectations, not a precise claim. */
export function readingMinutes(markdown: string): number {
  const words = String(markdown || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(value: string | null): string {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
