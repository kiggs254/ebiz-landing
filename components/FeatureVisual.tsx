// Rich mini product-preview visuals for the core features. Pure component (no
// "use client") so both the home Features teaser and the /features page can use it.

import Image from "next/image";
import type { Hue, AccentKey } from "./featuresData";

export const HUES: Record<AccentKey, Hue> = {
  orders: { color: "var(--accent)", soft: "var(--accent-soft)", ink: "var(--accent-ink)" },
  ai: { color: "var(--violet)", soft: "var(--violet-soft)", ink: "var(--violet-ink)" },
  branches: { color: "var(--blue)", soft: "var(--blue-soft)", ink: "var(--blue-ink)" },
  customers: { color: "var(--pink)", soft: "var(--pink-soft)", ink: "var(--pink-ink)" },
  storefront: { color: "var(--teal)", soft: "var(--teal-soft)", ink: "var(--teal-ink)" },
};

export function FeatureVisual({ kind, hue }: { kind: AccentKey; hue: Hue }) {
  const base: React.CSSProperties = {
    height: 168,
    borderRadius: 10,
    border: "1px solid var(--line-softer)",
    background: "var(--bg-2)",
    overflow: "hidden",
    position: "relative",
  };

  if (kind === "orders") {
    return (
      <div style={base}>
        <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          {(
            [
              ["#3041", "paid", "M-Pesa", "4,200"],
              ["#3040", "shipped", "Pesapal", "12,860"],
              ["#3039", "pending", "COD", "980"],
              ["#3038", "paid", "Card", "6,540"],
            ] as Array<[string, string, string, string]>
          ).map((r, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "50px 1fr 60px 60px",
                gap: 8,
                alignItems: "center",
                fontFamily: "var(--mono)",
                fontSize: 10.5,
                padding: "5px 8px",
                background: "var(--bg)",
                border: "1px solid var(--line-softer)",
                borderRadius: 5,
                opacity: i === 0 ? 1 : 0.55 - i * 0.08,
                transform: `translateX(${i * 4}px)`,
              }}
            >
              <span>{r[0]}</span>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  fontSize: 9.5,
                  padding: "1px 6px",
                  borderRadius: 999,
                  background: hue.soft,
                  color: hue.ink,
                  width: "fit-content",
                }}
              >
                {r[1]}
              </span>
              <span style={{ color: "var(--ink-3)" }}>{r[2]}</span>
              <span style={{ textAlign: "right" }}>{r[3]}</span>
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: hue.ink,
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: hue.color,
              animation: "blink 1.4s infinite",
            }}
          />
          LIVE
        </div>
      </div>
    );
  }

  if (kind === "ai") {
    return (
      <div style={{ ...base, padding: 14 }}>
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 10,
            color: hue.ink,
            marginBottom: 8,
          }}
        >
          ✦ generate description
        </div>
        <div
          style={{
            background: "var(--bg)",
            border: "1px solid var(--line-softer)",
            borderRadius: 6,
            padding: 10,
            fontSize: 11.5,
            lineHeight: 1.5,
            color: "var(--ink-2)",
          }}
        >
          Hand-finished walnut desk lamp with a{" "}
          <span style={{ background: hue.soft, color: hue.ink, padding: "0 2px" }}>
            brushed brass
          </span>{" "}
          stem. Warm, dimmable glow
          <span
            style={{
              display: "inline-block",
              width: 6,
              height: 12,
              background: hue.color,
              marginLeft: 1,
              verticalAlign: -2,
              animation: "cursor 1s infinite",
            }}
          />
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
          {["SEO", "Tags", "Variants"].map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10,
                fontFamily: "var(--mono)",
                padding: "3px 7px",
                borderRadius: 4,
                border: "1px solid var(--line-softer)",
                color: "var(--ink-3)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (kind === "branches") {
    const nodes: Array<[number, number, string, boolean]> = [
      [120, 70, "HQ", true],
      [54, 36, "Store A", false],
      [186, 40, "Store B", false],
      [50, 106, "Store C", false],
      [190, 108, "Warehouse", false],
    ];
    return (
      <div style={{ ...base, padding: 14 }}>
        <svg
          viewBox="0 0 240 140"
          width="100%"
          height="140"
          aria-label="Connected multi-branch network"
        >
          <path
            d="M120 70 L54 36 M120 70 L186 40 M120 70 L50 106 M120 70 L190 108"
            stroke={hue.color}
            strokeWidth="0.9"
            strokeDasharray="2 3"
            fill="none"
            opacity="0.55"
          />
          {nodes.map(([x, y, name, hub], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={hub ? 13 : 9} fill={hue.color} opacity="0.14" />
              <circle cx={x} cy={y} r={hub ? 5 : 3.5} fill={hue.color} />
              <text
                x={x}
                y={y - (hub ? 15 : 12)}
                fontSize="8.5"
                fill="var(--ink-2)"
                fontFamily="var(--mono)"
                textAnchor="middle"
              >
                {name}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (kind === "customers") {
    return (
      <div style={{ ...base, padding: 14 }}>
        {(
          [
            ["Sofia R.", "Gold", 1480, "/people/person-1.jpg"],
            ["James O.", "Silver", 920, "/people/person-2.jpg"],
            ["Mia T.", "Gold", 2240, "/people/person-3.jpg"],
          ] as Array<[string, string, number, string]>
        ).map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 0",
              borderBottom: i < 2 ? "1px solid var(--line-softer)" : "none",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={c[3]}
              alt=""
              style={{ width: 26, height: 26, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11.5, fontWeight: 500 }}>{c[0]}</div>
              <div style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "var(--mono)" }}>
                {c[1]} member
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--display)",
                fontSize: 16,
                fontWeight: 600,
                color: hue.ink,
              }}
            >
              {c[2]}
              <span style={{ fontSize: 10, color: "var(--ink-3)", marginLeft: 2 }}>pts</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // storefront
  return (
    <div style={{ ...base, padding: 0, background: "var(--bg)" }}>
      <div
        style={{
          height: 24,
          borderBottom: "1px solid var(--line-softer)",
          display: "flex",
          alignItems: "center",
          padding: "0 10px",
          gap: 6,
        }}
      >
        <span style={{ width: 5, height: 5, borderRadius: 999, background: hue.color }} />
        <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--ink-3)" }}>
          shop.northwind.com
        </span>
      </div>
      <div style={{ padding: 14 }}>
        <div
          style={{
            fontFamily: "var(--display)",
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            marginBottom: 10,
          }}
        >
          New arrivals
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
          {([
            ["sneaker", "SKU-1201"],
            ["headphones", "SKU-1202"],
            ["sunglasses", "SKU-1203"],
          ] as Array<[string, string]>).map(([img, sku]) => (
            <div key={sku}>
              <div
                style={{
                  position: "relative",
                  height: 60,
                  borderRadius: 4,
                  border: "1px solid var(--line-softer)",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={`/products/${img}.jpg`}
                  alt=""
                  fill
                  sizes="120px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div
                style={{
                  fontSize: 9,
                  marginTop: 4,
                  fontFamily: "var(--mono)",
                  color: "var(--ink-3)",
                }}
              >
                {sku}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
