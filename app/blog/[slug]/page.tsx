import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Doc } from "@/components/docs/Markdown";
import { getPost, listPosts, formatDate, readingMinutes } from "@/lib/blog";

const SITE_URL = "https://e-biz.co.ke";

export const revalidate = 300;
// Posts are created in the Manager after this builds, so unknown slugs must be
// rendered on demand rather than 404'd from a build-time list.
export const dynamicParams = true;

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const posts = await listPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Post not found", robots: { index: false, follow: true } };

  // Author-set SEO fields win; the title and excerpt are the fallback so a post
  // is never published with an empty description.
  const title = post.seo_title?.trim() || post.title;
  const description = post.seo_description?.trim() || post.excerpt?.trim() || undefined;
  const url = `${SITE_URL}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags,
      images: post.cover_image_url ? [{ url: post.cover_image_url }] : undefined,
    },
    twitter: {
      card: post.cover_image_url ? "summary_large_image" : "summary",
      title,
      description,
      images: post.cover_image_url ? [post.cover_image_url] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const minutes = readingMinutes(post.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": url,
        headline: post.seo_title?.trim() || post.title,
        description: post.seo_description?.trim() || post.excerpt || undefined,
        datePublished: post.published_at || undefined,
        dateModified: post.updated_at || undefined,
        author: { "@type": post.author ? "Person" : "Organization", name: post.author || "E-biz" },
        publisher: { "@type": "Organization", name: "E-biz", url: SITE_URL },
        mainEntityOfPage: url,
        image: post.cover_image_url || undefined,
        keywords: post.tags?.length ? post.tags.join(", ") : undefined,
        wordCount: post.content.trim().split(/\s+/).filter(Boolean).length,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
          { "@type": "ListItem", position: 3, name: post.title, item: url },
        ],
      },
    ],
  };

  return (
    <main className="page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav className="blog-crumbs" aria-label="Breadcrumb">
        <Link href="/blog">← Blog</Link>
      </nav>

      <article className="blog-article">
        <header>
          <h1>{post.title}</h1>
          <p className="blog-meta">
            {post.published_at && <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>}
            {post.author && <span> · {post.author}</span>}
            <span> · {minutes} min read</span>
          </p>
          {post.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="blog-hero" src={post.cover_image_url} alt="" />
          )}
        </header>

        <div className="doc">
          <Doc source={post.content} />
        </div>

        {post.tags?.length > 0 && (
          <footer className="blog-tags">
            {post.tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </footer>
        )}
      </article>

      <aside className="blog-cta">
        <h2>Ready to sell online?</h2>
        <p>Storefront, in-store and WhatsApp — from one dashboard.</p>
        <Link href="/get-started" className="btn">Get started</Link>
      </aside>
    </main>
  );
}
