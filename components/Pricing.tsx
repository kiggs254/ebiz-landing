import { Check, Section } from "./primitives";

const ALWAYS_INCLUDED = [
  "Managed dedicated server + hosting",
  "SSL certificate",
  "Unlimited products & orders",
  "No per-transaction fees",
  "No revenue share",
  "Payments: M-Pesa, Pesapal, Paystack, cards, COD",
  "Updates & security patches",
  "Email support",
];

export default function Pricing() {
  return (
    <Section
      id="pricing"
      ariaLabel="Pricing"
      style={{ background: "var(--bg-2)" }}
    >
      <div style={{ textAlign: "center", marginBottom: 44 }}>
        <span
          className="eyebrow"
          style={{ "--eyebrow-color": "var(--teal)" } as any}
        >
          Pricing
        </span>
        <h2
          className="section-title"
          style={{
            margin: "16px auto 0",
            textAlign: "center",
            "--title-accent": "var(--teal-ink)",
          } as any}
        >
          Simple monthly pricing.
          <br />
          <em>No transaction fees.</em>
        </h2>
        <p
          className="section-lede"
          style={{ margin: "24px auto 0", textAlign: "center" }}
        >
          Your dedicated server, hosting, updates, and support are all included in
          the monthly fee, and we manage everything. A one-time setup fee covers
          custom storefront design and onboarding, quoted to scope.
        </p>
      </div>

      {/* Single price statement + contact-sales CTA */}
      <div
        style={{
          border: "1px solid var(--ink)",
          borderRadius: 20,
          background: "var(--ink)",
          color: "var(--bg)",
          padding: "44px 32px",
          textAlign: "center",
          maxWidth: 720,
          margin: "0 auto 32px",
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            opacity: 0.6,
          }}
        >
          Starts as low as
        </div>
        <div
          style={{
            marginTop: 14,
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontFamily: "var(--display)",
              fontSize: "clamp(48px, 8vw, 76px)",
              fontWeight: 600,
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            KES&nbsp;4,000
          </span>
          <span style={{ opacity: 0.6, fontSize: 16 }}>/ month</span>
        </div>
        <div style={{ marginTop: 8, opacity: 0.65, fontSize: 15 }}>
          ≈ $35 / month
        </div>
        <p
          style={{
            margin: "18px auto 0",
            opacity: 0.78,
            fontSize: 15,
            lineHeight: 1.6,
            maxWidth: "46ch",
          }}
        >
          Final pricing depends on your store size and the addons you need.
          Hosting on a dedicated server we manage is always included. Talk to our
          team and we'll put together a plan that fits.
        </p>
        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 28,
          }}
        >
          <a
            href="/contact"
            style={{
              padding: "14px 26px",
              borderRadius: 999,
              background: "var(--bg)",
              color: "var(--ink)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Contact sales <span className="arrow">→</span>
          </a>
          <a
            href="/contact"
            style={{
              padding: "14px 26px",
              borderRadius: 999,
              border: "1px solid color-mix(in srgb, currentColor 35%, transparent)",
              color: "var(--bg)",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Book a live demo
          </a>
        </div>
      </div>

      <div
        style={{
          background: "var(--bg)",
          border: "1px solid var(--line-softer)",
          borderRadius: 14,
          padding: 28,
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: "var(--mono)",
            fontSize: 11,
            color: "var(--ink-3)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          Always included
        </div>
        <div
          className="always-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
          }}
        >
          {ALWAYS_INCLUDED.map((it, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 13.5,
              }}
            >
              <span style={{ color: "var(--accent)" }}>
                <Check size={13} />
              </span>
              {it}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
