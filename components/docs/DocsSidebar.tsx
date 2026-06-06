"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { DOC_GROUPS } from "./registry";

export function DocsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setOpen((o) => !o);
    window.addEventListener("ebiz-docs-nav-toggle", h);
    return () => window.removeEventListener("ebiz-docs-nav-toggle", h);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const active = (slug?: string) =>
    slug ? pathname === `/docs/${slug}` : pathname === "/docs";

  return (
    <>
      {open && <div className="dc-scrim" onClick={() => setOpen(false)} />}
      <aside className={`dc-sidebar${open ? " dc-sidebar-open" : ""}`}>
        <nav className="dc-nav">
          <Link
            href="/docs"
            className={`dc-nav-link${active() ? " dc-nav-active" : ""}`}
          >
            Introduction
          </Link>
          {DOC_GROUPS.map((g) => (
            <div key={g.label} className="dc-nav-group">
              <div className="dc-nav-grouplabel">{g.label}</div>
              {g.items.map((it) => (
                <Link
                  key={it.slug}
                  href={`/docs/${it.slug}`}
                  className={`dc-nav-link${active(it.slug) ? " dc-nav-active" : ""}`}
                >
                  {it.title}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
