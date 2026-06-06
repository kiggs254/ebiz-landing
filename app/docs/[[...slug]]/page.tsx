import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Doc } from "@/components/docs/Markdown";
import { DocsHome } from "@/components/docs/DocsHome";
import {
  ALL_DOCS,
  DOC_GROUPS,
  findDoc,
  adjacentDocs,
} from "@/components/docs/registry";

export const dynamicParams = false;

function groupOf(slug: string): string {
  return (
    DOC_GROUPS.find((g) => g.items.some((i) => i.slug === slug))?.label ?? "API"
  );
}

async function readDoc(slug: string): Promise<string> {
  return fs.readFile(
    path.join(process.cwd(), "content", "docs", `${slug}.md`),
    "utf8"
  );
}

export function generateStaticParams() {
  return [
    { slug: [] as string[] },
    ...ALL_DOCS.map((d) => ({ slug: [d.slug] })),
  ];
}

export async function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Promise<Metadata> {
  const slug = params.slug?.[0];
  if (!slug)
    return {
      title: "API reference",
      description:
        "E-biz REST API reference: products, orders, customers, branches, webhooks, and realtime events.",
      alternates: { canonical: "https://e-biz.co.ke/docs" },
    };
  const doc = findDoc(slug);
  if (!doc) return {};
  return {
    title: doc.title,
    description: `E-biz API reference: ${doc.title}.`,
    alternates: { canonical: `https://e-biz.co.ke/docs/${slug}` },
  };
}

export default async function DocsPage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const slug = params.slug?.[0];

  if (!slug) {
    let overview = "";
    try {
      overview = await readDoc("overview");
    } catch {
      /* optional */
    }
    return <DocsHome overview={overview} />;
  }

  const doc = findDoc(slug);
  if (!doc) notFound();

  let source = "";
  try {
    source = await readDoc(slug);
  } catch {
    notFound();
  }

  const { prev, next } = adjacentDocs(slug);

  return (
    <article className="dc-article">
      <span className="dc-eyebrow">{groupOf(slug)}</span>
      <h1>{doc.title}</h1>
      <Doc source={source} />
      <nav className="dc-prevnext">
        {prev ? (
          <Link className="dc-prevnext-link" href={`/docs/${prev.slug}`}>
            <span className="dc-pn-dir">Previous</span>
            <span className="dc-pn-title">{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="dc-prevnext-link dc-pn-next" href={`/docs/${next.slug}`}>
            <span className="dc-pn-dir">Next</span>
            <span className="dc-pn-title">{next.title}</span>
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
