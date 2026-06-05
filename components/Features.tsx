"use client";

import { useState } from "react";
import { Section } from "./primitives";
import { FeatureVisual, HUES } from "./FeatureVisual";
import type { AccentKey } from "./featuresData";

type Feature = {
  title: string;
  body: string;
  accent: AccentKey;
  span: number;
};

const FEATURES: Feature[] = [
  {
    title: "Real-time order desk",
    body: "Orders land the moment they're placed. Status workflow, internal notes, shipment tracking, invoices — all in one fast desk.",
    accent: "orders",
    span: 2,
  },
  {
    title: "AI catalog",
    body: "Generate product descriptions, SEO copy, and category blurbs in seconds — so your catalog is ready to sell, faster.",
    accent: "ai",
    span: 1,
  },
  {
    title: "Stock across locations",
    body: "Per-branch stock, pricing, and payment options. Move products between shops and warehouses without spreadsheets.",
    accent: "branches",
    span: 1,
  },
  {
    title: "Customers & loyalty",
    body: "Profiles, segments, addresses, and points. Bring customers back with rewards verified at checkout.",
    accent: "customers",
    span: 1,
  },
  {
    title: "Your own storefront",
    body: "A fast, beautiful storefront with live search, wishlist, and SEO baked in. Use ours, or bring your own.",
    accent: "storefront",
    span: 1,
  },
];

const FeatureCard = ({ feature, span }: { feature: Feature; span: number }) => {
  const [hover, setHover] = useState(false);
  const hue = HUES[feature.accent];
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        gridColumn: `span ${span}`,
        border: "1px solid var(--line-softer)",
        borderRadius: 14,
        padding: 24,
        background: "var(--bg)",
        transition: "all .25s ease",
        transform: hover ? "translateY(-2px)" : "none",
        boxShadow: hover ? "0 24px 48px -28px rgba(14,14,12,0.18)" : "none",
        borderColor: hover ? hue.color : "var(--line-softer)",
      }}
    >
      <FeatureVisual kind={feature.accent} hue={hue} />
      <div style={{ marginTop: 18 }}>
        <h3
          style={{
            fontFamily: "var(--display)",
            fontSize: 25,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            margin: 0,
            display: "flex",
            alignItems: "center",
            gap: 9,
          }}
        >
          <span
            aria-hidden
            style={{
              width: 9,
              height: 9,
              borderRadius: 3,
              background: hue.color,
              flexShrink: 0,
            }}
          />
          {feature.title}
        </h3>
        <p
          style={{
            color: "var(--ink-3)",
            margin: "8px 0 0",
            fontSize: 14.5,
            textWrap: "pretty",
          }}
        >
          {feature.body}
        </p>
      </div>
    </article>
  );
};

export default function Features() {
  return (
    <Section id="features" ariaLabel="Core platform features">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 56,
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="eyebrow">Core platform · always included</span>
          <h2 className="section-title">
            One dashboard.
            <br />
            Your <em>whole business.</em>
          </h2>
        </div>
        <p className="section-lede" style={{ marginTop: 0, maxWidth: 380 }}>
          Products, orders, customers, payments, marketing — every workflow your
          team runs, in one fast, keyboard-friendly dashboard.
        </p>
      </div>

      <div
        className="features-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {FEATURES.map((f, i) => (
          <FeatureCard key={i} feature={f} span={f.span} />
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginTop: 44 }}>
        <a href="/features" className="btn btn-ghost">
          Explore all 20+ features &amp; addons <span className="arrow">→</span>
        </a>
      </div>
    </Section>
  );
}
