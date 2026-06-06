"use client";

import Image from "next/image";
import { useState } from "react";
import { Section } from "./primitives";

const INDUSTRIES = [
  {
    id: "retail",
    name: "Online Retail",
    color: "var(--accent)",
    ink: "var(--accent-ink)",
    soft: "var(--accent-soft)",
    headline: "Full e-commerce, with payments and tracking out of the box.",
    metrics: [
      ["Avg. order value", "$58"],
      ["Repeat rate", "34%"],
      ["Fulfillment", "< 24h"],
    ],
    sample: {
      product: "Trail Runner Edition 02",
      price: "$96",
      stock: "12 in stock",
    },
  },
  {
    id: "grocery",
    name: "Grocery & Supermarkets",
    color: "var(--teal)",
    ink: "var(--teal-ink)",
    soft: "var(--teal-soft)",
    headline: "Multi-branch stock, subscription boxes, weekly loyalty.",
    metrics: [
      ["Branches", "7 stores"],
      ["Subscriptions", "480 active"],
      ["Stock sync", "Real-time"],
    ],
    sample: {
      product: "Fresh produce box · 2kg",
      price: "$18/wk",
      stock: "Subscription",
    },
  },
  {
    id: "food",
    name: "Restaurants & Food",
    color: "var(--pink)",
    ink: "var(--pink-ink)",
    soft: "var(--pink-soft)",
    headline: "Menu management, WhatsApp ordering, catering pages.",
    metrics: [
      ["Menu items", "146"],
      ["WhatsApp orders", "38%"],
      ["Avg. ticket", "$15"],
    ],
    sample: {
      product: "Family sharing platter",
      price: "$42",
      stock: "Available · 6pm",
    },
  },
  {
    id: "fashion",
    name: "Fashion & Lifestyle",
    color: "var(--violet)",
    ink: "var(--violet-ink)",
    soft: "var(--violet-soft)",
    headline: "Variants, lookbooks, influencer affiliates, returns.",
    metrics: [
      ["Variants/SKU", "Up to 64"],
      ["Influencer codes", "120+"],
      ["Returns rate", "4.2%"],
    ],
    sample: {
      product: "Linen overshirt · sand",
      price: "$78",
      stock: "XS / S / M / L",
    },
  },
  {
    id: "electronics",
    name: "Electronics",
    color: "var(--blue)",
    ink: "var(--blue-ink)",
    soft: "var(--blue-soft)",
    headline: "SKU specs, warranty tracking, and installment plans.",
    metrics: [
      ["SKUs", "2,400"],
      ["Warranty claims", "Tracked"],
      ["Installments", "3, 6, 12 mo"],
    ],
    sample: {
      product: "Solar inverter · 3kVA",
      price: "$485",
      stock: "Warranty: 24mo",
    },
  },
  {
    id: "b2b",
    name: "B2B Suppliers",
    color: "var(--green)",
    ink: "var(--green-ink)",
    soft: "var(--green-soft)",
    headline: "REST API, customer tiers, bulk pricing, NET-30.",
    metrics: [
      ["Customer tiers", "5"],
      ["Price lists", "Per-tier"],
      ["Payment terms", "NET-30"],
    ],
    sample: {
      product: "Wholesale order · 240 units",
      price: "$1,840",
      stock: "NET-30 approved",
    },
  },
] as const;

const IND_IMAGES: Record<string, string> = {
  retail: "/products/sneaker.jpg",
  grocery: "/products/produce.jpg",
  food: "/products/meal.jpg",
  fashion: "/products/shirt.jpg",
  electronics: "/products/headphones.jpg",
  b2b: "/products/box.jpg",
};

export default function Industries() {
  const [active, setActive] = useState<(typeof INDUSTRIES)[number]["id"]>(
    "retail"
  );
  const ind = INDUSTRIES.find((i) => i.id === active)!;

  return (
    <Section
      id="industries"
      ariaLabel="Industries served"
      style={{ background: "var(--bg-2)" }}
    >
      <div style={{ marginBottom: 40 }}>
        <span
          className="eyebrow"
          style={{ "--eyebrow-color": "var(--pink)" } as any}
        >
          Who it&apos;s for
        </span>
        <h2 className="section-title">
          One platform.
          <br />
          <em>Many businesses.</em>
        </h2>
      </div>

      <div
        role="tablist"
        aria-label="Industries"
        style={{
          display: "flex",
          gap: 4,
          flexWrap: "wrap",
          borderBottom: "1px solid var(--line-softer)",
          marginBottom: 32,
        }}
      >
        {INDUSTRIES.map((i) => {
          const isActive = i.id === active;
          return (
            <button
              key={i.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i.id)}
              style={{
                background: "transparent",
                border: "none",
                padding: "14px 18px",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                color: isActive ? i.ink : "var(--ink-3)",
                borderBottom: isActive
                  ? `2px solid ${i.color}`
                  : "2px solid transparent",
                marginBottom: -1,
                transition: "color .15s ease",
              }}
            >
              {i.name}
            </button>
          );
        })}
      </div>

      <div
        className="ind-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 32,
          alignItems: "center",
        }}
      >
        <div>
          <h3
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(28px, 3.6vw, 42px)",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              margin: 0,
              lineHeight: 1.1,
            }}
          >
            {ind.headline}
          </h3>

          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {ind.metrics.map((m, i) => (
              <div
                key={i}
                style={{
                  paddingTop: 14,
                  borderTop: `2px solid ${ind.color}`,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--ink-3)",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {m[0]}
                </div>
                <div
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: 22,
                    fontWeight: 600,
                    marginTop: 4,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {m[1]}
                </div>
              </div>
            ))}
          </div>

          <a href="#cta" className="btn btn-ghost" style={{ marginTop: 28 }}>
            See a {ind.name.toLowerCase()} demo <span className="arrow">→</span>
          </a>
        </div>

        <div
          style={{
            border: "1px solid var(--line-softer)",
            borderRadius: 14,
            background: "var(--bg)",
            padding: 22,
            position: "relative",
          }}
        >
          <div
            style={{
              height: 220,
              borderRadius: 8,
              overflow: "hidden",
              border: "1px solid var(--line-softer)",
              position: "relative",
            }}
          >
            <Image
              src={IND_IMAGES[ind.id]}
              alt={ind.sample.product}
              fill
              sizes="(max-width: 900px) 90vw, 420px"
              style={{ objectFit: "cover" }}
            />
            <span
              style={{
                position: "absolute",
                top: 12,
                left: 12,
                fontFamily: "var(--mono)",
                fontSize: 9,
                padding: "3px 7px",
                background: ind.color,
                color: "#fff",
                borderRadius: 4,
                letterSpacing: "0.1em",
              }}
            >
              {ind.name.toUpperCase()}
            </span>
          </div>
          <div style={{ marginTop: 16 }}>
            <div
              style={{
                fontFamily: "var(--display)",
                fontSize: 21,
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              {ind.sample.product}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8,
              }}
            >
              <span style={{ fontWeight: 600, color: ind.ink }}>
                {ind.sample.price}
              </span>
              <span style={{ color: "var(--ink-3)", fontSize: 13 }}>
                {ind.sample.stock}
              </span>
            </div>
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <button
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: 8,
                background: "var(--ink)",
                color: "var(--bg)",
                border: "none",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              Add to cart
            </button>
            <button
              style={{
                padding: "10px 14px",
                borderRadius: 8,
                background: "transparent",
                border: "1px solid var(--line-soft)",
                color: "var(--ink)",
                fontSize: 13,
              }}
              aria-label="Save to wishlist"
            >
              ♡
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
