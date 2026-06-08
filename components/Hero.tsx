"use client";

import { Logo, useCountUp } from "./primitives";
import { AddonIcon } from "./icons";

const StatItem = ({
  value,
  suffix = "",
  prefix = "",
  label,
  decimals = 0,
  color = "var(--ink)",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
  label: string;
  decimals?: number;
  color?: string;
}) => {
  const [ref, display] = useCountUp(value, { decimals });
  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div
        style={{
          fontFamily: "var(--display)",
          fontWeight: 600,
          fontSize: 38,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color,
        }}
      >
        {prefix}
        {display}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: "var(--mono)",
          fontSize: 11,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          color: "var(--ink-3)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const MARQUEE_DOTS = [
  "var(--accent)",
  "var(--blue)",
  "var(--violet)",
  "var(--teal)",
  "var(--pink)",
  "var(--green)",
];

const HeroMarquee = () => {
  const items = [
    "Orders",
    "Products",
    "Customers",
    "Inventory",
    "Payments",
    "Analytics",
    "Multi-branch",
    "Subscriptions",
    "Loyalty points",
    "Marketing automation",
    "Coupons & discounts",
    "Reviews & ratings",
    "Brands",
    "Multi-currency",
    "Taxes",
    "Distance shipping",
    "WhatsApp commerce",
    "WhatsApp storefront",
    "AI catalog",
    "AI search",
    "AI images",
    "Headless storefront",
    "REST API & webhooks",
    "WooCommerce migration",
    "Prescriptions",
  ];
  const all = [...items, ...items, ...items];
  return (
    <div
      aria-hidden
      style={{
        overflow: "hidden",
        borderTop: "1px solid var(--line-softer)",
        borderBottom: "1px solid var(--line-softer)",
        padding: "14px 0",
        maskImage:
          "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 48,
          whiteSpace: "nowrap",
          animation: "mq 72s linear infinite",
          width: "max-content",
        }}
      >
        {all.map((it, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--mono)",
              fontSize: 12,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink-3)",
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: MARQUEE_DOTS[i % MARQUEE_DOTS.length],
                opacity: 0.85,
              }}
            />
            {it}
          </span>
        ))}
      </div>
    </div>
  );
};

const MockDashboard = () => (
  <div
    role="img"
    aria-label="E-biz admin dashboard preview with revenue chart, KPI cards, and recent orders"
    style={{
      borderRadius: 14,
      border: "1px solid var(--line-soft)",
      background: "var(--bg)",
      overflow: "hidden",
      boxShadow:
        "0 60px 120px -50px rgba(14,14,12,0.25), 0 30px 60px -30px rgba(14,14,12,0.18)",
      position: "relative",
    }}
  >
    <div
      style={{
        height: 38,
        borderBottom: "1px solid var(--line-softer)",
        display: "flex",
        alignItems: "center",
        padding: "0 14px",
        gap: 10,
        background: "var(--bg-2)",
      }}
    >
      <div style={{ display: "flex", gap: 6 }}>
        {["#E97171", "#E9C271", "#7DC97A"].map((c) => (
          <span
            key={c}
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: c,
              opacity: 0.7,
            }}
          />
        ))}
      </div>
      <div
        style={{
          flex: 1,
          background: "var(--bg)",
          height: 22,
          borderRadius: 6,
          border: "1px solid var(--line-softer)",
          fontFamily: "var(--mono)",
          fontSize: 10.5,
          color: "var(--ink-3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 9,
            height: 9,
            borderRadius: 999,
            border: "1.5px solid var(--ink-4)",
          }}
        />
        admin.northwind.com / dashboard
      </div>
      <span
        style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--ink-4)" }}
      >
        ● live
      </span>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "178px 1fr", minHeight: 446 }}>
      <aside
        style={{
          borderRight: "1px solid var(--line-softer)",
          padding: "16px 10px",
          background: "var(--bg-2)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "0 6px",
            marginBottom: 14,
          }}
        >
          <Logo size={16} />
        </div>
        {(
          [
            { label: "Dashboard", icon: "grid", active: true },
            { label: "Orders", icon: "cart", badge: "24", badgeColor: "var(--accent)" },
            { label: "Catalog", icon: "box", chevron: true },
            { label: "Subscriptions", icon: "repeat" },
            { label: "Prescriptions", icon: "pill", badge: "3", badgeColor: "var(--violet)" },
            { label: "Customers", icon: "users" },
            { label: "Analytics", icon: "bars" },
            { label: "Marketing", icon: "megaphone", badge: "5", badgeColor: "var(--blue)" },
            { label: "Blogs", icon: "newspaper" },
            { label: "WhatsApp Store", icon: "chat", badge: "2", badgeColor: "var(--green)" },
            { label: "Shipping", icon: "truck" },
            { label: "Transactions", icon: "card" },
            { label: "Appearance", icon: "palette" },
            { label: "Settings", icon: "gear" },
          ] as Array<{
            label: string;
            icon: string;
            active?: boolean;
            badge?: string;
            badgeColor?: string;
            chevron?: boolean;
          }>
        ).map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 8px",
              borderRadius: 6,
              fontSize: 11.5,
              fontWeight: item.active ? 600 : 450,
              color: item.active ? "var(--accent-ink)" : "var(--ink-3)",
              background: item.active ? "var(--accent-soft)" : "transparent",
              marginBottom: 1,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 9, minWidth: 0 }}>
              <span
                style={{
                  display: "flex",
                  flexShrink: 0,
                  color: item.active ? "var(--accent)" : "var(--ink-4)",
                }}
              >
                <AddonIcon name={item.icon} size={14} />
              </span>
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </span>
            </span>
            {item.badge && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 9,
                  background: item.badgeColor,
                  color: "#fff",
                  padding: "1px 5px",
                  borderRadius: 999,
                  flexShrink: 0,
                }}
              >
                {item.badge}
              </span>
            )}
            {item.chevron && (
              <span style={{ display: "flex", flexShrink: 0, color: "var(--ink-4)" }}>
                <AddonIcon name="chevron-down" size={12} />
              </span>
            )}
          </div>
        ))}
      </aside>

      <main style={{ padding: "18px 16px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 18,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10.5,
                color: "var(--ink-3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Today · 27 Apr
            </div>
            <div
              style={{
                fontFamily: "var(--display)",
                fontWeight: 600,
                fontSize: 20,
                marginTop: 4,
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back, Sofia
            </div>
          </div>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "5px 10px",
              fontSize: 10.5,
              fontFamily: "var(--mono)",
              border: "1px solid var(--line-softer)",
              borderRadius: 8,
              color: "var(--ink-3)",
              whiteSpace: "nowrap",
            }}
          >
            <AddonIcon name="calendar" size={12} /> Last 30 days
            <AddonIcon name="chevron-down" size={11} />
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
            marginBottom: 14,
          }}
        >
          {(
            [
              { k: "Revenue", v: "$184k", delta: "+12.4%", up: true, icon: "dollar", bar: "var(--green)", tint: "var(--green-soft)", ink: "var(--green-ink)" },
              { k: "Orders", v: "482", delta: "+8.1%", up: true, icon: "cart", bar: "var(--blue)", tint: "var(--blue-soft)", ink: "var(--blue-ink)" },
              { k: "Customers", v: "1,029", delta: "+5.2%", up: true, icon: "users", bar: "var(--violet)", tint: "var(--violet-soft)", ink: "var(--violet-ink)" },
              { k: "Products", v: "318", delta: "+6 new", up: true, icon: "box", bar: "var(--accent)", tint: "var(--accent-soft)", ink: "var(--accent-ink)" },
            ] as Array<{ k: string; v: string; delta: string; up: boolean; icon: string; bar: string; tint: string; ink: string }>
          ).map((s, i) => (
            <div
              key={i}
              style={{
                border: "1px solid var(--line-softer)",
                borderRadius: 8,
                padding: "9px 10px",
                background: "var(--bg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: "var(--ink-3)",
                    fontFamily: "var(--mono)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.k}
                </span>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    background: s.tint,
                    color: s.ink,
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <AddonIcon name={s.icon} size={12} />
                </span>
              </div>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontWeight: 600,
                  fontSize: 18,
                  marginTop: 6,
                  letterSpacing: "-0.02em",
                }}
              >
                {s.v}
              </div>
              <div
                style={{
                  fontSize: 9.5,
                  color: s.up ? "var(--good)" : "var(--accent)",
                  marginTop: 2,
                }}
              >
                {s.delta}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            border: "1px solid var(--line-softer)",
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 10,
            }}
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 600 }}>Sales Overview</div>
              <div style={{ fontSize: 10, color: "var(--ink-3)", marginTop: 1 }}>
                Monthly revenue performance
              </div>
            </div>
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10.5,
                color: "var(--ink-3)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: "var(--accent)",
                }}
              />
              Revenue
            </span>
          </div>
          <svg
            viewBox="0 0 600 150"
            width="100%"
            height="100"
            preserveAspectRatio="none"
            aria-hidden
          >
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1="0"
                y1={38 * i + 18}
                x2="600"
                y2={38 * i + 18}
                stroke="var(--line-softer)"
                strokeDasharray="2 4"
              />
            ))}
            <path
              d="M0 100 C 60 80, 120 95, 180 70 S 300 40, 360 55 S 480 30, 540 25 L600 18 L600 150 L0 150 Z"
              fill="var(--accent-soft)"
            />
            <path
              d="M0 100 C 60 80, 120 95, 180 70 S 300 40, 360 55 S 480 30, 540 25 L600 18"
              stroke="var(--accent)"
              strokeWidth="1.8"
              fill="none"
            />
            <circle cx="600" cy="18" r="3.5" fill="var(--accent)" />
          </svg>
        </div>

        <div
          style={{
            border: "1px solid var(--line-softer)",
            borderRadius: 8,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              borderBottom: "1px solid var(--line-softer)",
            }}
          >
            <span style={{ fontSize: 11.5, fontWeight: 600 }}>Recent orders</span>
            <span
              style={{ fontSize: 10, color: "var(--accent-ink)", fontWeight: 500 }}
            >
              View all
            </span>
          </div>
          {(
            [
              ["#3041", "S. Rivera", "$420", "fulfilled", "Apr 27"],
              ["#3040", "M. Chen", "$1,286", "processing", "Apr 27"],
              ["#3039", "L. Müller", "$98", "pending", "Apr 26"],
            ] as Array<[string, string, string, string, string]>
          ).map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "50px 1fr 60px 84px 48px",
                gap: 8,
                padding: "8px 14px",
                fontSize: 11,
                alignItems: "center",
                borderTop: i ? "1px solid var(--line-softer)" : "none",
                fontFamily: "var(--mono)",
                color: "var(--ink-2)",
              }}
            >
              <span>{row[0]}</span>
              <span
                style={{
                  fontFamily: "var(--sans)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {row[1]}
              </span>
              <span>{row[2]}</span>
              <span
                style={{
                  display: "inline-flex",
                  justifyContent: "center",
                  padding: "2px 6px",
                  borderRadius: 999,
                  background:
                    row[3] === "fulfilled"
                      ? "oklch(0.94 0.05 150)"
                      : row[3] === "processing"
                      ? "oklch(0.94 0.04 240)"
                      : "oklch(0.94 0.04 80)",
                  color:
                    row[3] === "fulfilled"
                      ? "oklch(0.4 0.08 150)"
                      : row[3] === "processing"
                      ? "oklch(0.4 0.08 240)"
                      : "oklch(0.45 0.08 60)",
                  fontSize: 9,
                }}
              >
                {row[3]}
              </span>
              <span style={{ color: "var(--ink-3)" }}>{row[4]}</span>
            </div>
          ))}
        </div>
      </main>
    </div>

    <div
      style={{
        position: "absolute",
        right: -14,
        top: 96,
        background: "var(--bg)",
        border: "1px solid var(--line-soft)",
        borderRadius: 10,
        padding: "10px 12px",
        boxShadow: "0 20px 40px -20px rgba(14,14,12,0.25)",
        display: "flex",
        gap: 10,
        alignItems: "center",
        fontSize: 12,
        animation: "pulse 3s ease-in-out infinite",
      }}
    >
      <span
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          background: "var(--accent-soft)",
          color: "var(--accent-ink)",
          display: "grid",
          placeItems: "center",
          fontFamily: "var(--mono)",
          fontSize: 11,
          fontWeight: 600,
        }}
      >
        M
      </span>
      <div>
        <div style={{ fontWeight: 500 }}>New order · $420</div>
        <div style={{ color: "var(--ink-3)", fontSize: 11 }}>M-Pesa · just now</div>
      </div>
    </div>
  </div>
);

export default function Hero() {
  return (
    <section
      id="hero"
      data-section="hero"
      style={{ paddingTop: 40, paddingBottom: 0, borderTop: "none" }}
    >
      <div className="container">
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.05fr 0.95fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div style={{ minWidth: 0 }}>
            <span className="tag hero-anim" style={{ marginBottom: 18 }}>
              <span
                aria-hidden
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: "var(--accent)",
                }}
              />
              v4.2 · Now with AI catalog generation
            </span>

            <h1
              className="display hero-title hero-anim"
              style={{
                fontWeight: 600,
                margin: "18px 0 0",
                textWrap: "balance",
                animationDelay: "0.08s",
              }}
            >
              The commerce command center{" "}
              <em className="hero-title-accent">for modern brands.</em>
            </h1>

            <p
              className="hero-anim"
              style={{
                fontSize: 18,
                lineHeight: 1.55,
                color: "var(--ink-3)",
                maxWidth: "46ch",
                margin: "22px 0 0",
                textWrap: "pretty",
                animationDelay: "0.16s",
              }}
            >
              Sell online, in-store, and on WhatsApp, with M-Pesa, Pesapal,
              Paystack, cards, and cash built in. Run the whole thing from one
              calm dashboard.
            </p>

            <div
              className="hero-anim"
              style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap", animationDelay: "0.24s" }}
            >
              <a href="/get-started" className="btn btn-primary">
                Get started <span className="arrow">→</span>
              </a>
              <a href="/features" className="btn btn-ghost">
                See all features
              </a>
            </div>

            <div
              className="hero-anim"
              style={{
                marginTop: 22,
                display: "flex",
                alignItems: "center",
                gap: 12,
                color: "var(--ink-3)",
                fontSize: 13,
                lineHeight: 1.45,
                animationDelay: "0.30s",
              }}
            >
              <span style={{ display: "flex", flexShrink: 0 }} aria-hidden>
                {[
                  "/people/person-4.jpg",
                  "/people/person-5.jpg",
                  "/people/person-6.jpg",
                  "/people/person-7.jpg",
                ].map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt=""
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "2px solid var(--bg)",
                      marginLeft: i === 0 ? 0 : -8,
                      display: "inline-block",
                    }}
                  />
                ))}
              </span>
              <span>
                One dashboard for online, in-store, and WhatsApp, selling in 194
                countries.
              </span>
            </div>
          </div>

          <div className="hero-visual hero-anim" style={{ position: "relative", minWidth: 0, animationDelay: "0.14s" }}>
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: "-40px -6% 0%",
                background:
                  "radial-gradient(55% 50% at 25% 0%, var(--violet-soft), transparent 70%), radial-gradient(50% 50% at 85% 20%, var(--blue-soft), transparent 70%), radial-gradient(45% 45% at 60% 95%, var(--pink-soft), transparent 70%)",
                filter: "blur(22px)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <MockDashboard />
            </div>
          </div>
        </div>

        <div
          className="stats-strip"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 32,
            marginTop: 72,
            paddingTop: 32,
            paddingBottom: 32,
            borderTop: "1px solid var(--line-softer)",
            borderBottom: "1px solid var(--line-softer)",
          }}
        >
          <StatItem value={20} suffix="+" label="Addons" color="var(--violet-ink)" />
          <StatItem value={3} label="Sales channels" color="var(--accent-ink)" />
          <StatItem
            value={0}
            suffix="%"
            label="Transaction fees"
            color="var(--green-ink)"
          />
          <StatItem
            value={194}
            label="Countries shippable"
            color="var(--teal-ink)"
          />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <HeroMarquee />
      </div>
    </section>
  );
}
