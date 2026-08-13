import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Section } from "@/components/primitives";
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

  // Related posts share a tag; falling back to the newest keeps the rail
  // populated on a young blog rather than rendering an empty section.
  const all = await listPosts();
  const related = all
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const overlap = (x: typeof a) => x.tags?.filter((t) => post.tags?.includes(t)).length || 0;
      return overlap(b) - overlap(a);
    })
    .slice(0, 3);

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Nav />
      <main>
        <Section id="post-top" ariaLabel={post.title}>
          <nav className="blog-crumbs" aria-label="Breadcrumb">
            <Link href="/blog">← All posts</Link>
          </nav>

          <article className="blog-article">
            <header>
              {post.tags?.length > 0 && <span className="blog-kicker">{post.tags[0]}</span>}
              <h1>{post.title}</h1>
              <p className="blog-meta">
                {post.published_at && (
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                )}
                {post.author && <> · {post.author}</>}
                <> · {minutes} min read</>
              </p>
              {post.cover_image_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="blog-hero" src={post.cover_image_url} alt="" />
              )}
            </header>

            <div className="doc blog-body">
              <Doc source={post.content} />
            </div>

            {post.tags?.length > 0 && (
              <footer className="blog-tags blog-tags-end">
                {post.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </footer>
            )}
          </article>

          <aside className="blog-cta">
            <h2>Ready to sell online?</h2>
            <p>Storefront, in-store and WhatsApp — from one dashboard, hosting included.</p>
            <Link href="/get-started" className="btn btn-primary">Get started</Link>
          </aside>

          {related.length > 0 && (
            <section className="blog-related" aria-label="More posts">
              <h2>Keep reading</h2>
              <ul className="blog-grid">
                {related.map((p) => (
                  <li key={p.slug} className="blog-card">
                    <Link href={`/blog/${p.slug}`}>
                      {p.cover_image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className="blog-cover" src={p.cover_image_url} alt="" loading="lazy" />
                      )}
                      <div className="blog-card-body">
                        {p.published_at && (
                          <time dateTime={p.published_at}>{formatDate(p.published_at)}</time>
                        )}
                        <h3>{p.title}</h3>
                        {p.excerpt && <p>{p.excerpt}</p>}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}
