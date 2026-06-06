"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type Item = { id: string; text: string; level: number };

export function DocsToc() {
  const pathname = usePathname();
  const [items, setItems] = useState<Item[]>([]);
  const [active, setActive] = useState("");

  useEffect(() => {
    const article = document.querySelector(".dc-article");
    if (!article) {
      setItems([]);
      return;
    }
    const hs = Array.from(
      article.querySelectorAll("h2[id], h3[id]")
    ) as HTMLElement[];
    setItems(
      hs.map((h) => ({
        id: h.id,
        text: (h.textContent || "").trim(),
        level: h.tagName === "H2" ? 2 : 3,
      }))
    );
    if (!hs.length) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis[0]) setActive((vis[0].target as HTMLElement).id);
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );
    hs.forEach((h) => obs.observe(h));
    return () => obs.disconnect();
  }, [pathname]);

  if (items.length < 2) return <aside className="dc-toc" aria-hidden />;

  return (
    <aside className="dc-toc">
      <div className="dc-toc-title">On this page</div>
      <nav>
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={`dc-toc-link dc-toc-l${it.level}${
              active === it.id ? " dc-toc-active" : ""
            }`}
          >
            {it.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
