"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./primitives";

const NAV_LINKS: Array<{ id: string; label: string; href: string; page?: boolean }> = [
  { id: "features", label: "Features", href: "/features", page: true },
  { id: "industries", label: "Who it's for", href: "/#industries" },
  { id: "comparison", label: "Compare", href: "/#comparison" },
  { id: "pricing", label: "Pricing", href: "/#pricing" },
];

export default function Nav() {
  const pathname = usePathname();
  const [active, setActive] = useState("hero");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const trigger = window.innerHeight * 0.35;
      const sections = document.querySelectorAll<HTMLElement>("[data-section]");
      let current = "hero";
      sections.forEach((sec) => {
        const r = sec.getBoundingClientRect();
        if (r.top <= trigger) current = sec.id;
      });
      setActive(current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    if (pathname !== "/") return; // let the browser navigate to /#id
    const el = document.getElementById(id);
    if (el) {
      e.preventDefault();
      window.scrollTo({ top: el.offsetTop - 64, behavior: "smooth" });
    }
  };

  return (
    <header
      role="banner"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        background: scrolled
          ? "color-mix(in srgb, var(--bg) 78%, transparent)"
          : "transparent",
        backdropFilter: scrolled ? "saturate(140%) blur(10px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(140%) blur(10px)" : "none",
        borderBottom: scrolled
          ? "1px solid var(--line-softer)"
          : "1px solid transparent",
        transition: "background-color .2s ease, border-color .2s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        <a
          href="/"
          aria-label="E-biz home"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Logo />
        </a>
        <nav
          aria-label="Primary"
          className="nav-links"
          style={{ display: "flex", gap: 4, alignItems: "center" }}
        >
          {NAV_LINKS.map((l) => {
            const isActive = l.page
              ? pathname === l.href
              : pathname === "/" && active === l.id;
            return (
              <a
                key={l.id}
                href={l.href}
                onClick={l.page ? undefined : go(l.id)}
                aria-current={isActive ? "page" : undefined}
                style={{
                  position: "relative",
                  padding: "8px 14px",
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: isActive ? "var(--ink)" : "var(--ink-3)",
                  transition: "color .15s ease",
                }}
              >
                {l.label}
                {isActive && (
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "50%",
                      bottom: 2,
                      transform: "translateX(-50%)",
                      width: 4,
                      height: 4,
                      borderRadius: 999,
                      background: "var(--accent)",
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <a
            href="/#cta"
            onClick={go("cta")}
            style={{ fontSize: 13.5, color: "var(--ink-3)", padding: "8px 12px" }}
          >
            Sign in
          </a>
          <a
            href="/#cta"
            onClick={go("cta")}
            className="btn btn-primary"
            style={{ padding: "10px 18px", fontSize: 13.5 }}
          >
            Book a demo
            <span className="arrow">→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
