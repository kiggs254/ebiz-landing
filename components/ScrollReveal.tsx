"use client";

import { useEffect } from "react";

/**
 * Global scroll-reveal. Mounted once in the layout. After hydration it finds the
 * meaningful blocks in each section, hides the ones still below the fold, and
 * fades + lifts them in (with a gentle per-item stagger) as they scroll into
 * view. Above-the-fold content is never hidden, so there's no flash. Fully
 * disabled under prefers-reduced-motion.
 */
export default function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const vh = window.innerHeight;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const sec = e.target as HTMLElement & { __items?: HTMLElement[] };
          obs.unobserve(sec);
          const items = sec.__items ?? [sec];
          items.forEach((node, i) => {
            node.style.transitionDelay = Math.min(i * 65, 380) + "ms";
            node.classList.add("r-in");
          });
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -8% 0px" }
    );

    const isStretchy = (el: HTMLElement) => {
      const d = getComputedStyle(el).display;
      return (
        /grid|flex/.test(d) &&
        el.children.length >= 2 &&
        el.children.length <= 12
      );
    };

    document
      .querySelectorAll<HTMLElement>("main > section, footer")
      .forEach((sec) => {
        if (sec.id === "hero") return; // hero animates on load via CSS

        const container =
          sec.querySelector<HTMLElement>(":scope > .container") ||
          sec.querySelector<HTMLElement>(":scope > .video-band-inner") ||
          sec;

        // Flatten one level of grid/flex wrappers so cards stagger individually.
        const items: HTMLElement[] = [];
        Array.from(container.children).forEach((childEl) => {
          const child = childEl as HTMLElement;
          if (isStretchy(child)) {
            Array.from(child.children).forEach((c) =>
              items.push(c as HTMLElement)
            );
          } else {
            items.push(child);
          }
        });

        // Never animate sticky elements (would break sticky positioning).
        const safe = items.filter(
          (el) => getComputedStyle(el).position !== "sticky"
        );
        if (!safe.length) return;

        // Already in / near the viewport at load → leave visible (no flash).
        if (sec.getBoundingClientRect().top < vh * 0.88) return;

        safe.forEach((el) => el.classList.add("r-anim"));
        (sec as HTMLElement & { __items?: HTMLElement[] }).__items = safe;
        obs.observe(sec);
      });

    return () => obs.disconnect();
  }, []);

  return null;
}
