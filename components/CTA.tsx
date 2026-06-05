import { Section } from "./primitives";

export default function CTA() {
  return (
    <Section
      id="cta"
      ariaLabel="Book a demo"
      style={{ paddingTop: 120, paddingBottom: 120 }}
    >
      <div
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          borderRadius: 20,
          padding: "clamp(40px, 6vw, 88px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <svg
          aria-hidden
          style={{
            position: "absolute",
            right: -120,
            bottom: -120,
            opacity: 0.12,
          }}
          width="500"
          height="500"
          viewBox="0 0 500 500"
        >
          <circle cx="250" cy="250" r="100" stroke="var(--bg)" strokeWidth="1" fill="none" />
          <circle cx="250" cy="250" r="160" stroke="var(--bg)" strokeWidth="1" fill="none" />
          <circle cx="250" cy="250" r="220" stroke="var(--bg)" strokeWidth="1" fill="none" />
          <circle cx="250" cy="250" r="40" fill="var(--accent)" />
        </svg>

        <div style={{ position: "relative", maxWidth: 720 }}>
          <span
            style={{
              fontFamily: "var(--mono)",
              fontSize: 11,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--accent)",
            }}
          >
            Ready when you are
          </span>

          <h2
            className="serif"
            style={{
              fontSize: "clamp(44px, 6.4vw, 88px)",
              fontWeight: 600,
              lineHeight: 1.0,
              letterSpacing: "-0.025em",
              margin: "14px 0 0",
              textWrap: "balance",
            }}
          >
            Let&apos;s build the
            <br />
            <em style={{ color: "var(--accent)", fontStyle: "normal" }}>store you&apos;ve imagined.</em>
          </h2>

          <p
            style={{
              fontSize: 18,
              marginTop: 28,
              opacity: 0.7,
              maxWidth: "52ch",
              textWrap: "pretty",
            }}
          >
            Book a 30-minute live demo. We&apos;ll walk you through the admin
            dashboard, answer payment and shipping questions, and quote your
            storefront to scope.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 36,
              flexWrap: "wrap",
            }}
          >
            <a
              href="#"
              className="btn"
              style={{
                background: "var(--bg)",
                color: "var(--ink)",
                border: "1px solid var(--bg)",
              }}
            >
              Book a live demo <span className="arrow">→</span>
            </a>
            <a
              href="mailto:hello@e-biz.co.ke"
              className="btn"
              style={{
                background: "transparent",
                color: "var(--bg)",
                border: "1px solid color-mix(in srgb, var(--bg) 30%, transparent)",
              }}
            >
              hello@e-biz.co.ke
            </a>
          </div>
        </div>
      </div>
    </Section>
  );
}
