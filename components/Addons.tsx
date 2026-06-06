"use client";

import { useState } from "react";
import { Section } from "./primitives";

type CatId = "ops" | "catalog" | "growth" | "messaging" | "ai" | "dev";

const CATEGORIES: Array<{
  id: CatId;
  label: string;
  color: string;
  soft: string;
  ink: string;
}> = [
  { id: "ops", label: "Operations", color: "var(--blue)", soft: "var(--blue-soft)", ink: "var(--blue-ink)" },
  { id: "catalog", label: "Catalog", color: "var(--violet)", soft: "var(--violet-soft)", ink: "var(--violet-ink)" },
  { id: "growth", label: "Marketing & Growth", color: "var(--accent)", soft: "var(--accent-soft)", ink: "var(--accent-ink)" },
  { id: "messaging", label: "Messaging", color: "var(--green)", soft: "var(--green-soft)", ink: "var(--green-ink)" },
  { id: "ai", label: "AI", color: "var(--pink)", soft: "var(--pink-soft)", ink: "var(--pink-ink)" },
  { id: "dev", label: "Developer & migration", color: "var(--teal)", soft: "var(--teal-soft)", ink: "var(--teal-ink)" },
];

const ADDONS = [
  { key: "multibranch", name: "Multi-Branch", desc: "Inventory, pricing & gateways per location.", cat: "ops" },
  { key: "subscriptions", name: "Subscriptions", desc: "Recurring orders with email & WhatsApp reminders.", cat: "ops" },
  { key: "stock", name: "Stock Management", desc: "Tracking, low-stock alerts & backorders.", cat: "ops" },
  { key: "taxes", name: "Taxes", desc: "Per-zone & per-product, inclusive or exclusive.", cat: "ops" },
  { key: "distance", name: "Distance Shipping", desc: "Maps-based delivery pricing by distance.", cat: "ops" },

  { key: "brands", name: "Brands", desc: "Brand taxonomy, filtering & brand pages.", cat: "catalog" },
  { key: "reviews", name: "Reviews", desc: "Customer reviews with a moderation workflow.", cat: "catalog" },
  { key: "ratings", name: "Ratings", desc: "Star ratings & average score display.", cat: "catalog" },
  { key: "multicurrency", name: "Multi-Currency", desc: "Sell in many currencies with auto rates.", cat: "catalog" },

  { key: "loyalty", name: "Loyalty Points", desc: "Earn & redeem, OTP-verified at checkout.", cat: "growth" },
  { key: "marketing", name: "Marketing Automation", desc: "Abandoned cart, review requests, recs.", cat: "growth" },
  { key: "gtm", name: "Google Tag Manager", desc: "E-commerce events & enhanced conversions.", cat: "growth" },

  { key: "whatsapp", name: "WhatsApp", desc: "Template messaging & order notifications.", cat: "messaging" },
  { key: "wastorefront", name: "WhatsApp Storefront", desc: "Browse, checkout & pay inside WhatsApp.", cat: "messaging" },

  { key: "ai", name: "AI Catalog", desc: "Descriptions, SEO copy & blurbs in seconds.", cat: "ai" },
  { key: "aisearch", name: "AI Search", desc: "Semantic search & personalized recommendations.", cat: "ai" },
  { key: "aiimage", name: "AI Images", desc: "Generate & enhance product photography.", cat: "ai" },

  { key: "api", name: "REST API + Webhooks", desc: "Full API, OpenAPI docs & audit trail.", cat: "dev" },
  { key: "woo", name: "WooCommerce Migration", desc: "Bulk-import products, customers & orders.", cat: "dev" },
  { key: "prescriptions", name: "Prescriptions", desc: "Rx upload, verification & refill tracking.", cat: "dev" },
] as const;

type Key = (typeof ADDONS)[number]["key"];

const DEFAULT_ON: Key[] = [
  "multibranch",
  "subscriptions",
  "stock",
  "brands",
  "reviews",
  "multicurrency",
  "loyalty",
  "marketing",
  "whatsapp",
  "ai",
  "api",
];

export default function Addons() {
  const [enabled, setEnabled] = useState<Record<Key, boolean>>(
    () =>
      Object.fromEntries(
        ADDONS.map((a) => [a.key, DEFAULT_ON.includes(a.key)])
      ) as Record<Key, boolean>
  );

  const toggle = (k: Key) => setEnabled((s) => ({ ...s, [k]: !s[k] }));
  const onCount = Object.values(enabled).filter(Boolean).length;

  const catOf = (id: CatId) => CATEGORIES.find((c) => c.id === id)!;

  const sidebar: Array<[string, boolean, string | null]> = [
    ["Dashboard", true, null],
    ["Orders", true, null],
    ["Products", true, null],
    ["Customers", true, null],
    ["Branches", enabled.multibranch, "var(--blue)"],
    ["Subscriptions", enabled.subscriptions, "var(--blue)"],
    ["Reviews", enabled.reviews, "var(--violet)"],
    ["Loyalty", enabled.loyalty, "var(--accent)"],
    ["Marketing", enabled.marketing, "var(--accent)"],
    ["WhatsApp", enabled.whatsapp || enabled.wastorefront, "var(--green)"],
    ["AI Studio", enabled.ai || enabled.aisearch || enabled.aiimage, "var(--pink)"],
    ["Prescriptions", enabled.prescriptions, "var(--teal)"],
    ["Developers", enabled.api, "var(--teal)"],
    ["Analytics", true, null],
    ["Settings", true, null],
  ];

  return (
    <Section id="addons" ariaLabel="Toggleable platform addons">
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
          <span
            className="eyebrow"
            style={{ "--eyebrow-color": "var(--violet)" } as any}
          >
            Addons · {ADDONS.length}+ and counting
          </span>
          <h2
            className="section-title"
            style={{ "--title-accent": "var(--violet-ink)" } as any}
          >
            Flip on exactly
            <br /> <em>what you need.</em>
          </h2>
        </div>
        <p className="section-lede" style={{ marginTop: 0, maxWidth: 380 }}>
          From multi-branch and subscriptions to AI, WhatsApp commerce, and a full
          REST API. Switch addons on and your dashboard adapts. Switch them off
          and they disappear. No clutter, no bloat.
        </p>
      </div>

      <div
        className="addons-layout"
        style={{
          display: "grid",
          gridTemplateColumns: "1.15fr 1fr",
          gap: 24,
          alignItems: "start",
        }}
      >
        <div
          style={{
            border: "1px solid var(--line-softer)",
            borderRadius: 14,
            background: "var(--bg)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 18px",
              borderBottom: "1px solid var(--line-softer)",
              background: "var(--bg-2)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink-3)",
              }}
            >
              Settings → Addons
            </span>
            <span
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--violet-ink)",
                fontWeight: 600,
              }}
            >
              {onCount}/{ADDONS.length} enabled
            </span>
          </div>

          {CATEGORIES.map((cat) => {
            const items = ADDONS.filter((a) => a.cat === cat.id);
            return (
              <div key={cat.id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "12px 18px 8px",
                    borderTop: "1px solid var(--line-softer)",
                    background: "var(--bg-2)",
                  }}
                >
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 2,
                      background: cat.color,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10.5,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: cat.ink,
                      fontWeight: 600,
                    }}
                  >
                    {cat.label}
                  </span>
                </div>
                {items.map((a) => {
                  const on = enabled[a.key];
                  return (
                    <button
                      key={a.key}
                      onClick={() => toggle(a.key)}
                      aria-pressed={on}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        width: "100%",
                        textAlign: "left",
                        padding: "13px 18px",
                        borderTop: "1px solid var(--line-softer)",
                        background: "transparent",
                        borderRight: "none",
                        borderBottom: "none",
                        borderLeft: "3px solid transparent",
                        borderLeftColor: on ? cat.color : "transparent",
                        color: "inherit",
                        transition: "background-color .15s ease",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 500, fontSize: 14.5 }}>{a.name}</div>
                        <div
                          style={{ color: "var(--ink-3)", fontSize: 12.5, marginTop: 2 }}
                        >
                          {a.desc}
                        </div>
                      </div>
                      <span
                        aria-hidden
                        style={{
                          width: 38,
                          height: 22,
                          borderRadius: 999,
                          background: on ? cat.color : "var(--bg-3)",
                          position: "relative",
                          transition: "background-color .2s ease",
                          flexShrink: 0,
                          display: "inline-block",
                        }}
                      >
                        <span
                          style={{
                            position: "absolute",
                            top: 2,
                            left: on ? 18 : 2,
                            width: 18,
                            height: 18,
                            borderRadius: "50%",
                            background: "var(--bg)",
                            transition: "left .2s ease",
                          }}
                        />
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>

        <div style={{ position: "sticky", top: 96 }}>
          <div
            style={{
              border: "1px solid var(--line-softer)",
              borderRadius: 14,
              background: "var(--bg)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--line-softer)",
                background: "var(--bg-2)",
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--ink-3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Sidebar · live preview
            </div>
            <div style={{ padding: 14 }}>
              {sidebar.map(([label, show, color], i) => {
                if (!show) return null;
                const isAddon = color !== null;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 400,
                      color: "var(--ink-2)",
                      background: i === 0 ? "var(--bg-2)" : "transparent",
                      animation: isAddon ? "addon-in .25s ease" : "none",
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span
                        style={{
                          width: 14,
                          height: 14,
                          borderRadius: 4,
                          background: isAddon ? (color as string) : "var(--bg-3)",
                          opacity: isAddon ? 0.9 : 1,
                        }}
                      />
                      {label}
                    </span>
                    {isAddon && (
                      <span
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: 9,
                          color: color as string,
                          letterSpacing: "0.1em",
                          fontWeight: 600,
                        }}
                      >
                        ADDON
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            style={{
              marginTop: 14,
              padding: "12px 16px",
              background: "var(--bg-2)",
              border: "1px solid var(--line-softer)",
              borderRadius: 10,
              fontSize: 12.5,
              color: "var(--ink-3)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "var(--violet)",
              }}
            />
            Try toggling, and your sidebar updates instantly.
          </div>
        </div>
      </div>
    </Section>
  );
}
