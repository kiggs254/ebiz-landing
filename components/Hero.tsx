"use client";

import { Logo, useCountUp } from "./primitives";

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
    "M-Pesa",
    "Pesapal",
    "Paystack",
    "Card",
    "Apple Pay",
    "Bank transfer",
    "Mobile money",
    "Cash on Delivery",
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
          animation: "mq 32s linear infinite",
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

    <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", minHeight: 430 }}>
      <aside
        style={{
          borderRight: "1px solid var(--line-softer)",
          padding: "18px 12px",
          background: "var(--bg-2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
          <Logo size={16} />
        </div>
        {(
          [
            ["Dashboard", true],
            ["Orders", false, "24"],
            ["Products", false],
            ["Customers", false],
            ["Marketing", false],
            ["Analytics", false],
            ["Settings", false],
          ] as Array<[string, boolean, string?]>
        ).map(([label, active, badge], i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 9px",
              borderRadius: 6,
              fontSize: 12,
              fontWeight: active ? 600 : 400,
              color: active ? "var(--ink)" : "var(--ink-3)",
              background: active ? "var(--bg)" : "transparent",
              border: active ? "1px solid var(--line-softer)" : "1px solid transparent",
              marginBottom: 2,
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: active ? "var(--accent)" : "var(--bg-3)",
                  opacity: active ? 1 : 0.7,
                }}
              />
              {label}
            </span>
            {badge && (
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  background: "var(--accent)",
                  color: "#fff",
                  padding: "1px 6px",
                  borderRadius: 999,
                }}
              >
                {badge}
              </span>
            )}
          </div>
        ))}
      </aside>

      <main style={{ padding: "20px 20px" }}>
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
          <div style={{ display: "flex", gap: 6 }}>
            {(["7d", "30d", "90d"] as const).map((p) => (
              <span
                key={p}
                style={{
                  padding: "4px 9px",
                  fontSize: 10.5,
                  fontFamily: "var(--mono)",
                  border: p === "30d" ? "1px solid var(--ink)" : "1px solid var(--line-softer)",
                  borderRadius: 999,
                  color: p === "30d" ? "var(--ink)" : "var(--ink-3)",
                }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 10,
            marginBottom: 16,
          }}
        >
          {(
            [
              ["Revenue", "$184k", "+12.4%", true, "var(--blue)"],
              ["Orders", "482", "+8.1%", true, "var(--violet)"],
              ["Avg. order", "$382", "−2.3%", false, "var(--teal)"],
            ] as Array<[string, string, string, boolean, string]>
          ).map(([k, v, delta, up, accent], i) => (
            <div
              key={i}
              style={{
                border: "1px solid var(--line-softer)",
                borderTop: `2px solid ${accent}`,
                borderRadius: 8,
                padding: "11px 12px",
                background: "var(--bg)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "var(--ink-3)",
                  fontFamily: "var(--mono)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {k}
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
                {v}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: up ? "var(--good)" : "var(--accent)",
                  marginTop: 2,
                }}
              >
                {delta}
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
              marginBottom: 10,
            }}
          >
            <div style={{ fontSize: 11.5, fontWeight: 500 }}>Revenue · last 30 days</div>
            <div
              style={{
                display: "flex",
                gap: 12,
                fontSize: 10.5,
                color: "var(--ink-3)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span
                  style={{
                    width: 8,
                    height: 2,
                    background: "var(--ink)",
                    borderRadius: 2,
                  }}
                />
                This period
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span
                  style={{
                    width: 8,
                    height: 2,
                    background: "var(--ink-4)",
                    borderRadius: 2,
                  }}
                />
                Previous
              </span>
            </div>
          </div>
          <svg
            viewBox="0 0 600 160"
            width="100%"
            height="110"
            preserveAspectRatio="none"
            aria-hidden
          >
            {[0, 1, 2, 3].map((i) => (
              <line
                key={i}
                x1="0"
                y1={40 * i + 20}
                x2="600"
                y2={40 * i + 20}
                stroke="var(--line-softer)"
                strokeDasharray="2 4"
              />
            ))}
            <path
              d="M0 110 C 80 90, 140 120, 200 100 S 360 80, 420 95 S 540 110, 600 90"
              stroke="var(--ink-4)"
              strokeWidth="1.4"
              fill="none"
              opacity="0.5"
            />
            <path
              d="M0 100 C 60 80, 120 95, 180 70 S 300 40, 360 55 S 480 30, 540 25 L600 18 L600 160 L0 160 Z"
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
              padding: "10px 14px",
              borderBottom: "1px solid var(--line-softer)",
              fontSize: 11.5,
              fontWeight: 500,
            }}
          >
            Recent orders
          </div>
          {(
            [
              ["#SF-3041", "S. Rivera", "$420", "paid", "M-Pesa"],
              ["#SF-3040", "M. Chen", "$1,286", "shipped", "Card"],
              ["#SF-3039", "L. Müller", "$98", "pending", "COD"],
            ] as Array<[string, string, string, string, string]>
          ).map((row, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "84px 1fr 78px 72px 60px",
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
              <span style={{ fontFamily: "var(--sans)" }}>{row[1]}</span>
              <span>{row[2]}</span>
              <span
                style={{
                  display: "inline-flex",
                  justifyContent: "center",
                  padding: "2px 8px",
                  borderRadius: 999,
                  background:
                    row[3] === "paid"
                      ? "oklch(0.94 0.05 150)"
                      : row[3] === "shipped"
                      ? "oklch(0.94 0.04 240)"
                      : "oklch(0.94 0.04 80)",
                  color:
                    row[3] === "paid"
                      ? "oklch(0.4 0.08 150)"
                      : row[3] === "shipped"
                      ? "oklch(0.4 0.08 240)"
                      : "oklch(0.45 0.08 60)",
                  fontSize: 10,
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
              className="serif hero-anim"
              style={{
                fontSize: "clamp(34px, 3.8vw, 56px)",
                fontWeight: 600,
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                margin: "16px 0 0",
                textWrap: "balance",
                animationDelay: "0.08s",
              }}
            >
              The commerce command center{" "}
              <em style={{ color: "var(--accent-ink)", fontStyle: "normal" }}>
                for modern brands.
              </em>
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
              <a href="#cta" className="btn btn-primary">
                Book a live demo <span className="arrow">→</span>
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
                gap: 10,
                color: "var(--ink-3)",
                fontSize: 13,
                animationDelay: "0.30s",
              }}
            >
              <span style={{ display: "flex" }} aria-hidden>
                {["var(--violet)", "var(--blue)", "var(--teal)", "var(--pink)"].map(
                  (c, i) => (
                    <span
                      key={i}
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: "50%",
                        background: c,
                        border: "2px solid var(--bg)",
                        marginLeft: i === 0 ? 0 : -7,
                        display: "inline-block",
                      }}
                    />
                  )
                )}
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
          <StatItem value={4} label="Payment gateways" color="var(--accent-ink)" />
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
