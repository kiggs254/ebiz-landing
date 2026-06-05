import { Check, Section } from "./primitives";

const STEPS = [
  {
    n: "01",
    title: "We design your storefront",
    body: "Custom-designed to match your brand, products, and customers. One-time setup fee; everything pixel-considered.",
    detail: ["Brand discovery", "Custom storefront", "Catalog migration"],
  },
  {
    n: "02",
    title: "We host it on a dedicated server we manage",
    body: "Your own dedicated server — fully managed by us and included in your subscription. We handle uptime, backups, and security, so there's no separate hosting bill and nothing for you to set up.",
    detail: ["Managed dedicated server", "SSL + custom domain", "Health monitoring"],
  },
  {
    n: "03",
    title: "You run your business",
    body: "Log in to your admin, manage everything. We handle the tech: updates, security patches, uptime, support.",
    detail: ["Admin training", "24/7 monitoring", "Email support"],
  },
];

export default function HowItWorks() {
  return (
    <Section id="how" ariaLabel="How E-biz onboarding works">
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
          <span className="eyebrow">How it works</span>
          <h2 className="section-title">
            Three steps.
            <br />
            <em>You&apos;re selling.</em>
          </h2>
        </div>
        <p className="section-lede" style={{ marginTop: 0, maxWidth: 360 }}>
          We build, deploy, and hand you the keys. From signed contract to first
          sale, typically 2–4 weeks.
        </p>
      </div>

      <div style={{ position: "relative" }}>
        <div
          aria-hidden
          className="how-line"
          style={{
            position: "absolute",
            top: 60,
            left: "8%",
            right: "8%",
            height: 1,
            borderTop: "1px dashed var(--line-soft)",
            zIndex: 0,
          }}
        />

        <ol
          className="how-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 24,
            position: "relative",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {STEPS.map((s, i) => (
            <li key={i} style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: "50%",
                  background: ["var(--accent-soft)", "var(--violet-soft)", "var(--teal-soft)"][i],
                  border: `1px solid ${["var(--accent)", "var(--violet)", "var(--teal)"][i]}`,
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--mono)",
                  fontSize: 13,
                  fontWeight: 600,
                  color: ["var(--accent-ink)", "var(--violet-ink)", "var(--teal-ink)"][i],
                  margin: "0 auto 24px",
                }}
              >
                {s.n}
              </div>

              <div
                style={{
                  border: "1px solid var(--line-softer)",
                  borderRadius: 14,
                  padding: 24,
                  background: "var(--bg)",
                  textAlign: "center",
                  height: "100%",
                }}
              >
                <h3
                  style={{
                    fontFamily: "var(--display)",
                    fontSize: 25,
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    margin: 0,
                    textWrap: "balance",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    color: "var(--ink-3)",
                    margin: "12px 0 20px",
                    fontSize: 14,
                    textWrap: "pretty",
                  }}
                >
                  {s.body}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    paddingTop: 16,
                    borderTop: "1px dashed var(--line-soft)",
                  }}
                >
                  {s.detail.map((d, j) => (
                    <div
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 8,
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        color: "var(--ink-3)",
                        letterSpacing: "0.05em",
                      }}
                    >
                      <Check size={11} />
                      {d}
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
