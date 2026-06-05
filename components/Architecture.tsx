import { Section } from "./primitives";

const CHANNELS: Array<[string, string, string]> = [
  ["Web storefront", "React · SEO-fast", "var(--blue)"],
  ["Mobile app", "iOS / Android", "var(--violet)"],
  ["In-store POS", "Kiosk & counter", "var(--teal)"],
  ["WhatsApp storefront", "Browse · checkout · pay", "var(--green)"],
  ["Any headless client", "Your stack, our API", "var(--pink)"],
];

const SERVICES: Array<[string, string]> = [
  ["Postgres", "Source of truth"],
  ["Redis", "Cache & queues"],
  ["S3 / R2", "Media library"],
  ["AI · OpenAI / DeepSeek", "Catalog & search"],
  ["SMTP · SMS · WhatsApp", "Outbound"],
];

const BENEFITS: Array<[string, string, string]> = [
  ["Speed", "Static pages, dynamic data.", "var(--blue-ink)"],
  ["Flexibility", "Our storefront, or yours.", "var(--violet-ink)"],
  ["Scale", "Independent frontends & backends.", "var(--teal-ink)"],
  ["Multi-channel", "One backend, many touchpoints.", "var(--pink-ink)"],
];

export default function Architecture() {
  return (
    <Section
      id="architecture"
      ariaLabel="Headless architecture overview"
      style={{ background: "var(--bg-2)" }}
    >
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
            style={{ "--eyebrow-color": "var(--blue)" } as any}
          >
            Headless architecture
          </span>
          <h2
            className="section-title"
            style={{ "--title-accent": "var(--blue-ink)" } as any}
          >
            One backend.
            <br />
            <em>Anywhere</em> you sell.
          </h2>
        </div>
        <p className="section-lede" style={{ marginTop: 0, maxWidth: 380 }}>
          Your storefront is decoupled from your admin. Static pages render
          instantly; dynamic data streams in over WebSocket. Scale frontends and
          backends independently.
        </p>
      </div>

      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--line-softer)",
          borderRadius: 16,
          padding: "clamp(28px, 4vw, 56px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(var(--line-softer) 1px, transparent 1px), linear-gradient(90deg, var(--line-softer) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />

        <div
          className="arch-grid"
          style={{
            position: "relative",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "clamp(20px, 4vw, 56px)",
            alignItems: "center",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--ink-3)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Storefronts
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CHANNELS.map(([t, sub, color], i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid var(--line-softer)",
                    borderLeft: `3px solid ${color}`,
                    borderRadius: 10,
                    padding: "12px 14px",
                    background: "var(--bg)",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t}</div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10.5,
                      color: "var(--ink-3)",
                      marginTop: 2,
                    }}
                  >
                    {sub}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", position: "relative" }}>
            <div
              style={{
                border: "2px solid var(--ink)",
                borderRadius: 14,
                padding: "28px 18px",
                background: "var(--bg)",
                position: "relative",
                boxShadow: "0 16px 40px -20px rgba(14,14,12,0.2)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 11,
                  color: "var(--accent)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                E-biz Core
              </div>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 28,
                  fontWeight: 600,
                  marginTop: 6,
                  letterSpacing: "-0.02em",
                }}
              >
                REST API
              </div>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 28,
                  fontWeight: 600,
                  marginTop: -2,
                  letterSpacing: "-0.02em",
                  color: "var(--accent-ink)",
                }}
              >
                + Webhooks
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: "var(--ink-3)" }}>
                Node · Postgres · Redis
              </div>
              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  gap: 6,
                  justifyContent: "center",
                  flexWrap: "wrap",
                }}
              >
                {[
                  ["Multi-tenant", "var(--violet-soft)", "var(--violet-ink)"],
                  ["20+ addons", "var(--teal-soft)", "var(--teal-ink)"],
                ].map(([label, bg, fg]) => (
                  <span
                    key={label}
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 9.5,
                      padding: "3px 8px",
                      borderRadius: 999,
                      background: bg,
                      color: fg,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="arch-pulse-left" aria-hidden />
              <div className="arch-pulse-right" aria-hidden />
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--ink-4)",
                marginTop: 14,
                letterSpacing: "0.1em",
              }}
            >
              ↑↓ JSON · WebSocket
            </div>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--ink-3)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 14,
                textAlign: "right",
              }}
            >
              Services
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SERVICES.map(([t, sub], i) => (
                <div
                  key={i}
                  style={{
                    border: "1px solid var(--line-softer)",
                    borderRight: "3px solid var(--teal)",
                    borderRadius: 10,
                    padding: "12px 14px",
                    background: "var(--bg)",
                    textAlign: "right",
                  }}
                >
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{t}</div>
                  <div
                    style={{
                      fontFamily: "var(--mono)",
                      fontSize: 10.5,
                      color: "var(--ink-3)",
                      marginTop: 2,
                    }}
                  >
                    {sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="arch-benefits"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 20,
            marginTop: 48,
            paddingTop: 28,
            borderTop: "1px solid var(--line-softer)",
            position: "relative",
          }}
        >
          {BENEFITS.map(([k, v, color], i) => (
            <div key={i}>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 21,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                  color,
                }}
              >
                {k}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
                {v}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
