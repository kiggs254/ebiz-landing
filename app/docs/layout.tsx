import "./docs.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import fs from "node:fs/promises";
import path from "node:path";
import { DOC_GROUPS } from "@/components/docs/registry";
import { DocsTopbar } from "@/components/docs/DocsTopbar";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { DocsToc } from "@/components/docs/DocsToc";
import type { SearchEntry } from "@/components/docs/DocsSearch";

export const metadata: Metadata = {
  title: { default: "API reference", template: "%s · E-biz Docs" },
  description:
    "The E-biz REST API reference: products, orders, customers, branches, payments, webhooks, and realtime events.",
};

async function buildIndex(): Promise<SearchEntry[]> {
  const entries: SearchEntry[] = [];
  for (const g of DOC_GROUPS) {
    for (const it of g.items) {
      let headings: string[] = [];
      try {
        const md = await fs.readFile(
          path.join(process.cwd(), "content", "docs", `${it.slug}.md`),
          "utf8"
        );
        headings = Array.from(md.matchAll(/^#{2,3}\s+(.+)$/gm))
          .map((m) => m[1].replace(/[*`]/g, "").trim())
          .slice(0, 50);
      } catch {
        /* file may be missing during partial builds */
      }
      entries.push({ slug: it.slug, title: it.title, group: g.label, headings });
    }
  }
  return entries;
}

export default async function DocsLayout({
  children,
}: {
  children: ReactNode;
}) {
  const index = await buildIndex();
  return (
    <div className="dc-shell">
      <DocsTopbar index={index} />
      <div className="dc-body">
        <DocsSidebar />
        <main className="dc-main">{children}</main>
        <DocsToc />
      </div>
    </div>
  );
}
