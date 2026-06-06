import { Logo } from "./primitives";

export default function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        borderTop: "1px solid var(--line-softer)",
        padding: "56px 0 40px",
      }}
    >
      <div className="container">
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr",
            gap: 32,
            marginBottom: 48,
          }}
        >
          <div style={{ maxWidth: 320 }}>
            <Logo />
            <p
              style={{
                color: "var(--ink-3)",
                fontSize: 13.5,
                margin: "14px 0 0",
                lineHeight: 1.6,
              }}
            >
              The headless commerce platform for modern brands. Sell online,
              in-store, and on WhatsApp, however your customers want to pay.
            </p>
          </div>
          {(
            [
              ["Platform", [
                ["Features", "/features"],
                ["Addons", "/features#all-addons"],
                ["Pricing", "/#pricing"],
                ["Book a demo", "/contact"],
              ]],
              ["Developers", [
                ["API reference", "/docs"],
                ["Authentication", "/docs/authentication"],
                ["Webhooks", "/docs/webhooks"],
                ["Quick reference", "/docs/quick-reference"],
              ]],
              ["Company", [
                ["About", "/about"],
                ["Contact", "/contact"],
              ]],
              ["Legal", [
                ["Privacy Policy", "/privacy"],
                ["Terms & Conditions", "/terms"],
                ["Cookie Policy", "/cookies"],
                ["Refund Policy", "/refunds"],
              ]],
            ] as Array<[string, Array<[string, string]>]>
          ).map(([h, items]) => (
            <div key={h}>
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
                {h}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  padding: 0,
                  margin: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {items.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      style={{ fontSize: 13.5, color: "var(--ink-2)" }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 14,
            paddingTop: 24,
            borderTop: "1px solid var(--line-softer)",
            fontFamily: "var(--mono)",
            fontSize: 11.5,
            color: "var(--ink-3)",
            letterSpacing: "0.04em",
          }}
        >
          <span>
            © {new Date().getFullYear()} E-biz. Headless commerce, deployed
            worldwide.
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: "var(--good)",
              }}
            />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
}
