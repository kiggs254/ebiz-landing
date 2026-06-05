import { Check, Cross, Dash, Section } from "./primitives";

const ROWS: Array<[string, string, string, string, string]> = [
  ["M-Pesa & mobile money", "yes", "plugin", "plugin", "no"],
  ["Your own dedicated server", "yes", "no", "yes", "no"],
  ["No transaction fees", "yes", "partial", "yes", "yes"],
  ["Multi-branch", "addon", "plus-only", "plugin", "no"],
  ["AI content generation", "built-in", "plugin", "plugin", "plugin"],
  ["Loyalty points", "built-in", "plugin", "plugin", "plugin"],
  ["Connect your other tools", "included", "paid", "free", "included"],
  ["WhatsApp integration", "built-in", "plugin", "plugin", "plugin"],
  ["You own your data", "yes", "no", "yes", "no"],
  ["Local + global gateways", "all 4", "stripe-only", "plugins", "limited"],
];

const Cell = ({ value }: { value: string }) => {
  const map: Record<
    string,
    { icon: React.ReactNode; label: string; color: string; strong: boolean }
  > = {
    yes: { icon: <Check />, label: "Yes", color: "var(--good)", strong: true },
    no: { icon: <Cross />, label: "No", color: "var(--ink-4)", strong: false },
    plugin: { icon: <Dash />, label: "Plugin ($)", color: "var(--ink-3)", strong: false },
    plugins: { icon: <Dash />, label: "Plugins", color: "var(--ink-3)", strong: false },
    paid: { icon: <Dash />, label: "Paid plan", color: "var(--ink-3)", strong: false },
    partial: { icon: <Dash />, label: "0.5–2%", color: "var(--ink-3)", strong: false },
    locked: { icon: <Cross />, label: "Locked", color: "var(--ink-4)", strong: false },
    limited: { icon: <Dash />, label: "Limited", color: "var(--ink-3)", strong: false },
    "plus-only": { icon: <Dash />, label: "Plus only", color: "var(--ink-3)", strong: false },
    free: { icon: <Check />, label: "Free", color: "var(--good)", strong: false },
    addon: { icon: <Check />, label: "Addon", color: "var(--good)", strong: true },
    "built-in": { icon: <Check />, label: "Built-in", color: "var(--good)", strong: true },
    included: { icon: <Check />, label: "Included", color: "var(--good)", strong: true },
    "all 4": { icon: <Check />, label: "All 4", color: "var(--good)", strong: true },
    "stripe-only": {
      icon: <Dash />,
      label: "Stripe only",
      color: "var(--ink-3)",
      strong: false,
    },
  };
  const v = map[value] || map["no"];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: v.color,
        fontSize: 13.5,
        fontWeight: v.strong ? 500 : 400,
      }}
    >
      <span style={{ display: "inline-flex" }}>{v.icon}</span>
      {v.label}
    </div>
  );
};

export default function Comparison() {
  return (
    <Section id="comparison" ariaLabel="Comparison vs other platforms">
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
            style={{ "--eyebrow-color": "var(--green)" } as any}
          >
            vs the alternatives
          </span>
          <h2
            className="section-title"
            style={{ "--title-accent": "var(--green-ink)" } as any}
          >
            What makes <em>E-biz</em> different.
          </h2>
        </div>
        <p className="section-lede" style={{ marginTop: 0, maxWidth: 380 }}>
          Honest comparison. The features global platforms charge extra for — or
          simply don&apos;t offer — are the ones built into E-biz&apos;s core.
        </p>
      </div>

      <div
        style={{
          border: "1px solid var(--line-softer)",
          borderRadius: 14,
          overflow: "hidden",
          background: "var(--bg)",
        }}
      >
        <div
          className="cmp-row"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
            background: "var(--bg-2)",
            borderBottom: "1px solid var(--line-softer)",
            padding: "18px 20px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10.5,
              color: "var(--ink-3)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Feature
          </div>
          <div
            style={{
              fontFamily: "var(--display)",
              fontSize: 19,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: "var(--accent)",
              }}
            />
            E-biz
          </div>
          <div style={{ fontSize: 14, color: "var(--ink-3)" }}>Shopify</div>
          <div style={{ fontSize: 14, color: "var(--ink-3)" }}>WooCommerce</div>
          <div style={{ fontSize: 14, color: "var(--ink-3)" }}>BigCommerce</div>
        </div>

        {ROWS.map((r, i) => (
          <div
            key={i}
            className="cmp-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr 1fr 1fr",
              padding: "16px 20px",
              borderTop: i ? "1px solid var(--line-softer)" : "none",
              alignItems: "center",
              background: i % 2 ? "transparent" : "var(--bg)",
            }}
          >
            <div style={{ fontWeight: 500, fontSize: 14 }}>{r[0]}</div>
            <div
              style={{
                padding: "6px 10px",
                background: "var(--accent-soft)",
                borderRadius: 6,
                width: "fit-content",
              }}
            >
              <Cell value={r[1]} />
            </div>
            <Cell value={r[2]} />
            <Cell value={r[3]} />
            <Cell value={r[4]} />
          </div>
        ))}
      </div>
    </Section>
  );
}
