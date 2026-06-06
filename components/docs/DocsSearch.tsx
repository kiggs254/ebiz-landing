"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type SearchEntry = {
  slug: string;
  title: string;
  group: string;
  headings: string[];
};

export function DocsSearch({ index }: { index: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
    else setQ("");
  }, [open]);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term)
      return index.slice(0, 8).map((e) => ({ e, matched: [] as string[] }));
    return index
      .map((e) => {
        const hay = (
          e.title +
          " " +
          e.group +
          " " +
          e.headings.join(" ")
        ).toLowerCase();
        const score = hay.includes(term)
          ? e.title.toLowerCase().includes(term)
            ? 2
            : 1
          : 0;
        const matched = e.headings
          .filter((h) => h.toLowerCase().includes(term))
          .slice(0, 3);
        return { e, score, matched };
      })
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [q, index]);

  const go = (slug: string) => {
    setOpen(false);
    router.push(`/docs/${slug}`);
  };

  return (
    <>
      <button
        type="button"
        className="dc-search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search documentation"
      >
        <span className="dc-search-icon" aria-hidden>
          ⌕
        </span>
        <span className="dc-search-text">Search docs</span>
        <kbd className="dc-kbd">⌘K</kbd>
      </button>

      {open && (
        <div className="dc-search-overlay" onClick={() => setOpen(false)}>
          <div className="dc-search-modal" onClick={(e) => e.stopPropagation()}>
            <input
              ref={inputRef}
              className="dc-search-input"
              placeholder="Search the API reference…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <div className="dc-search-results">
              {results.length === 0 && (
                <div className="dc-search-empty">No results for “{q}”.</div>
              )}
              {results.map(({ e, matched }) => (
                <button
                  key={e.slug}
                  type="button"
                  className="dc-search-result"
                  onClick={() => go(e.slug)}
                >
                  <span className="dc-search-grp">{e.group}</span>
                  <span className="dc-search-ttl">{e.title}</span>
                  {matched && matched.length > 0 && (
                    <span className="dc-search-sub">{matched.join(" · ")}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="dc-search-foot">
              <kbd className="dc-kbd">Esc</kbd> to close
            </div>
          </div>
        </div>
      )}
    </>
  );
}
