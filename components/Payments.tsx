import { Fragment } from "react";
import { Section } from "./primitives";

const rails = [
  {
    name: "M-Pesa",
    sub: "STK Push & Till",
    tag: "Most popular",
    bg: "#1F8E3D",
    fg: "#fff",
    logo: "M",
    soft: "var(--green-soft)",
    ink: "var(--green-ink)",
    supports: ["STK push", "Till / Paybill", "Instant confirm"],
  },
  {
    name: "Pesapal",
    sub: "Cards · Mobile money · Bank",
    tag: null,
    bg: "#0E2E63",
    fg: "#fff",
    logo: "Pp",
    soft: "var(--blue-soft)",
    ink: "var(--blue-ink)",
    supports: ["Visa / Mastercard", "Mobile money", "Bank transfer"],
  },
  {
    name: "Paystack",
    sub: "Global card processing",
    tag: null,
    bg: "#0BA5E9",
    fg: "#fff",
    logo: "Ps",
    soft: "var(--violet-soft)",
    ink: "var(--violet-ink)",
    supports: ["Cards", "Apple / Google Pay", "Transfers"],
  },
  {
    name: "Cash on Delivery",
    sub: "Walk-in & manual orders",
    tag: null,
    bg: "var(--bg-3)",
    fg: "var(--ink)",
    logo: "₵",
    soft: "var(--accent-soft)",
    ink: "var(--accent-ink)",
    supports: ["Pay on arrival", "In-person", "No gateway"],
  },
];

const FlowArrow = () => (
  <svg width="48" height="14" viewBox="0 0 48 14" fill="none" aria-hidden>
    <path
      d="M0 7 H40 M34 2 L40 7 L34 12"
      stroke="var(--ink-3)"
      strokeWidth="1.2"
      fill="none"
      strokeLinecap="round"
    />
  </svg>
);

const FLOW = [
  {
    step: "1. Customer pays",
    title: "Any rail, one checkout",
    body: "STK push, card, bank, mobile money, or COD. Same flow either way.",
    color: "var(--blue-ink)",
  },
  {
    step: "2. E-biz reconciles",
    title: "Webhook → Order → Ledger",
    body: "Auto-matched. Zero spreadsheet duty.",
    color: "var(--violet-ink)",
  },
  {
    step: "3. You ship",
    title: "Notifications fire",
    body: "Email, SMS, and WhatsApp, to both staff and buyer.",
    color: "var(--teal-ink)",
  },
];

export default function Payments() {
  return (
    <Section id="payments" ariaLabel="Payment rails and reconciliation">
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
            Payments · built-in
          </span>
          <h2
            className="section-title"
            style={{ "--title-accent": "var(--blue-ink)" } as any}
          >
            Every way your <em>customers pay.</em>
          </h2>
        </div>
        <p className="section-lede" style={{ marginTop: 0, maxWidth: 360 }}>
          No fighting with Stripe or PayPal. No transaction fees on top. Your
          customers pay the way they already do, whether that's card, bank,
          mobile money, or cash, and E-biz reconciles every cent.
        </p>
      </div>

      <div
        className="rail-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 32,
        }}
      >
        {rails.map((r, i) => (
          <div
            key={i}
            style={{
              border: "1px solid var(--line-softer)",
              borderRadius: 14,
              background: "var(--bg)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                background: r.bg,
                color: r.fg,
                padding: "18px 18px 22px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.18)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--display)",
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {r.logo}
              </div>
              {r.tag && (
                <span
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    fontFamily: "var(--mono)",
                    fontSize: 9,
                    background: "rgba(255,255,255,0.18)",
                    padding: "3px 7px",
                    borderRadius: 999,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                  }}
                >
                  {r.tag}
                </span>
              )}
            </div>
            <div style={{ padding: "16px 18px" }}>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 21,
                  fontWeight: 600,
                  letterSpacing: "-0.02em",
                }}
              >
                {r.name}
              </div>
              <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginTop: 2 }}>
                {r.sub}
              </div>
              <div
                style={{
                  marginTop: 14,
                  fontFamily: "var(--mono)",
                  fontSize: 10,
                  color: "var(--ink-3)",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Supports
              </div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 8,
                }}
              >
                {r.supports.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 11,
                      padding: "3px 8px",
                      borderRadius: 999,
                      background: r.soft,
                      color: r.ink,
                      fontWeight: 500,
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div
        className="flow-grid"
        style={{
          background: "var(--bg-2)",
          border: "1px solid var(--line-softer)",
          borderRadius: 14,
          padding: "clamp(20px, 3vw, 32px)",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr auto 1fr",
          alignItems: "center",
          gap: 16,
        }}
      >
        {FLOW.map((f, i) => (
          <Fragment key={f.step}>
            {i > 0 && <FlowArrow />}
            <div>
              <div
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 10.5,
                  color: f.color,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {f.step}
              </div>
              <div
                style={{
                  fontFamily: "var(--display)",
                  fontSize: 23,
                  fontWeight: 600,
                  marginTop: 6,
                  letterSpacing: "-0.02em",
                }}
              >
                {f.title}
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
                {f.body}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </Section>
  );
}
