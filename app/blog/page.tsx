import type { Metadata } from "next";
import Link from "next/link";
import { listPosts, formatDate } from "@/lib/blog";

const SITE_URL = "https://e-biz.co.ke";

// Posts are published from the Manager and expected to appear without a
// redeploy; the fetch itself is cached for 5 minutes.
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Practical writing on running an online shop in Kenya — payments, delivery, stock, WhatsApp selling and getting found on Google.",
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blog`,
    title: "E-biz Blog",
    description:
      "Practical writing on running an online shop in Kenya — payments, delivery, stock, WhatsApp selling and getting found on Google.",
  },
};

export default async function BlogIndex() {
  const posts = await listPosts();

  // A Blog + ItemList tells search engines this is a feed and what's in it,
  // which is what earns the article carousel treatment.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/blog`,
    name: "E-biz Blog",
    url: `${SITE_URL}/blog`,
    publisher: { "@type": "Organization", name: "E-biz", url: SITE_URL },
    blogPost: posts.slice(0, 30).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.published_at || undefined,
      dateModified: p.updated_at || undefined,
    })),
  };

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <header className="blog-head">
        <p className="eyebrow">Blog</p>
        <h1>Running a shop online, written plainly.</h1>
        <p className="lede">
          Payments, delivery, stock, selling on WhatsApp and getting found on Google — what
          actually works for businesses in Kenya.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="blog-empty">
          No posts yet. <Link href="/contact">Tell us what you&rsquo;d like us to write about.</Link>
        </p>
      ) : (
        <ul className="blog-grid">
          {posts.map((p) => (
            <li key={p.slug} className="blog-card">
              <Link href={`/blog/${p.slug}`}>
                {p.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="blog-cover" src={p.cover_image_url} alt="" loading="lazy" />
                )}
                <div className="blog-card-body">
                  {p.published_at && <time dateTime={p.published_at}>{formatDate(p.published_at)}</time>}
                  <h2>{p.title}</h2>
                  {p.excerpt && <p>{p.excerpt}</p>}
                  {p.tags?.length > 0 && (
                    <div className="blog-tags">
                      {p.tags.slice(0, 3).map((t) => (
                        <span key={t}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
