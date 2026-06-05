"use client";

import React, { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

export const Logo = ({ size = 22 }: { size?: number }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 9 }}>
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none" aria-hidden>
      <rect width="28" height="28" rx="7" fill="var(--accent)" />
      <text
        x="13.5"
        y="19"
        textAnchor="middle"
        fontFamily="var(--display)"
        fontSize="14"
        fontWeight={800}
        letterSpacing="-1.2"
        fill="#15110F"
      >
        eb
      </text>
      <circle cx="21.5" cy="6.5" r="2.2" fill="#FAFAF7" />
    </svg>
    <span
      style={{
        fontFamily: "var(--display)",
        fontSize: size + 2,
        letterSpacing: "-0.03em",
        lineHeight: 1,
        fontWeight: 600,
      }}
    >
      E-biz
    </span>
  </span>
);

export function useCountUp(
  target: number,
  { duration = 1400, decimals = 0 }: { duration?: number; decimals?: number } = {}
) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (t: number) => {
              const p = Math.min(1, (t - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(target * eased);
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, duration]);

  const display =
    decimals > 0
      ? val.toFixed(decimals)
      : Math.round(val).toLocaleString();
  return [ref, display] as const;
}

export const Section = ({
  id,
  children,
  style,
  ariaLabel,
}: {
  id: string;
  children: ReactNode;
  style?: CSSProperties;
  ariaLabel?: string;
}) => (
  <section id={id} data-section={id} style={style} aria-label={ariaLabel}>
    <div className="container">{children}</div>
  </section>
);

export const Check = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M3 8.5l3 3 7-7"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Cross = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M4 4l8 8M12 4l-8 8"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

export const Dash = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden>
    <path d="M4 8h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);
