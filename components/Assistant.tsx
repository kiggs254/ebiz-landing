import { Section } from "./primitives";

/**
 * The Appearance Assistant.
 *
 * The pitch is the interaction itself, so the right-hand panel reproduces a real
 * exchange rather than describing one — including the change card and its Undo
 * button, because "it's reversible" is the part that makes autonomy palatable.
 */

const Tick = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M3 8.5l3 3 7-7"
      stroke="var(--green-ink)"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const Undo = () => (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
    <path
      d="M3 8a5 5 0 1 1 1.6 3.7M3 4.5V8h3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const POINTS = [
  {
    t: "It does the work, not a to-do list",
    b: "Ask for a returns policy, a homepage banner, or a menu link and it is on your storefront when the sentence finishes.",
  },
  {
    t: "You see exactly what changed",
    b: "Every edit arrives as a before-and-after, down to the field. Nothing happens behind your back.",
  },
  {
    t: "One click puts it back",
    b: "Every change is recorded and reversible. A page it deleted comes back whole, links and all.",
  },
  {
    t: "It cannot outrank your staff",
    b: "It works strictly within the permissions of whoever is signed in. A copywriter's login stays a copywriter's login.",
  },
];

export default function Assistant() {
  return (
    <Section
      id="assistant"
      ariaLabel="The E-biz Appearance Assistant"
      style={{ background: "var(--bg-2)" }}
    >
      <div
        className="assistant-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 56,
          alignItems: "center",
        }}
      >
        {/* ── the pitch ── */}
        <div>
          <span className="eyebrow" style={{ "--eyebrow-color": "var(--pink)" } as any}>
            New · Store assistant
          </span>
          <h2
            className="section-title"
            style={{ "--title-accent": "var(--pink-ink)", marginBottom: 14 } as any}
          >
            Just say what you <em>want changed.</em>
          </h2>
          <p className="section-lede" style={{ maxWidth: 460, marginBottom: 26 }}>
            Most shop software makes you learn where everything lives. E-biz has a
            chat at the top of your storefront settings instead. Describe the
            change and it is made — pages, banners, menus, SEO — while you watch.
          </p>

          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
            {POINTS.map((p) => (
              <li key={p.t} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span
                  aria-hidden
                  style={{
                    marginTop: 5,
                    width: 7,
                    height: 7,
                    borderRadius: 999,
                    background: "var(--pink)",
                    flexShrink: 0,
                  }}
                />
                <span>
                  <strong style={{ display: "block", fontSize: 15, marginBottom: 2 }}>{p.t}</strong>
                  <span style={{ color: "var(--ink-3)", fontSize: 14.5, lineHeight: 1.6 }}>
                    {p.b}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── the interaction ── */}
        <div
          style={{
            border: "1px solid var(--bg-3)",
            borderRadius: 18,
            background: "var(--bg)",
            overflow: "hidden",
            boxShadow: "0 24px 60px -32px rgba(0,0,0,.28)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              padding: "13px 18px",
              borderBottom: "1px solid var(--bg-3)",
            }}
          >
            <span
              style={{
                width: 26,
                height: 26,
                borderRadius: 8,
                background: "var(--pink-soft)",
                display: "grid",
                placeItems: "center",
                fontSize: 13,
              }}
              aria-hidden
            >
              ✦
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Assistant</div>
              <div style={{ fontSize: 11.5, color: "var(--ink-4)" }}>
                Appearance · your storefront
              </div>
            </div>
          </div>

          <div style={{ padding: "18px 18px 20px", display: "grid", gap: 12 }}>
            {/* what the owner typed */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div
                style={{
                  maxWidth: "80%",
                  background: "var(--pink-soft)",
                  borderRadius: "14px 4px 14px 14px",
                  padding: "9px 13px",
                  fontSize: 14,
                }}
              >
                Create a privacy policy page
              </div>
            </div>

            {/* what it did */}
            {["Reading your pages", "Writing Privacy Policy"].map((step) => (
              <div
                key={step}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 12.5,
                  color: "var(--ink-4)",
                  paddingLeft: 2,
                }}
              >
                <Tick />
                <span>{step}</span>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  maxWidth: "88%",
                  background: "var(--bg-2)",
                  borderRadius: "4px 14px 14px 14px",
                  padding: "9px 13px",
                  fontSize: 14,
                  lineHeight: 1.55,
                }}
              >
                Done — it&rsquo;s live at <strong>/privacy-policy</strong>. Worth having
                someone check the wording before you rely on it.
              </div>
            </div>

            {/* the receipt */}
            <div
              style={{
                border: "1px solid var(--bg-3)",
                borderRadius: 12,
                background: "var(--bg)",
                padding: "11px 13px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 600 }}>
                  Created Privacy Policy
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 5,
                    border: "1px solid var(--bg-3)",
                    borderRadius: 999,
                    padding: "4px 10px",
                    fontSize: 12,
                    color: "var(--ink-3)",
                  }}
                >
                  <Undo />
                  Undo
                </span>
              </div>
              <div
                style={{
                  marginTop: 9,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  fontSize: 11.5,
                }}
              >
                <span style={{ color: "var(--ink-4)" }}>URL</span>
                <code
                  style={{
                    background: "var(--green-soft)",
                    color: "var(--green-ink)",
                    borderRadius: 5,
                    padding: "1px 6px",
                  }}
                >
                  /privacy-policy
                </code>
                <span style={{ color: "var(--ink-4)", marginLeft: 8 }}>Content</span>
                <code
                  style={{
                    background: "var(--green-soft)",
                    color: "var(--green-ink)",
                    borderRadius: 5,
                    padding: "1px 6px",
                  }}
                >
                  +64 lines
                </code>
              </div>
            </div>

            {/* a follow-up, because it is a conversation not a prompt box */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
              <div
                style={{
                  maxWidth: "80%",
                  background: "var(--pink-soft)",
                  borderRadius: "14px 4px 14px 14px",
                  padding: "9px 13px",
                  fontSize: 14,
                }}
              >
                Link it from the footer under Support
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: 12.5,
                color: "var(--ink-4)",
                paddingLeft: 2,
              }}
            >
              <Tick />
              <span>Updating footer menu</span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-start" }}>
              <div
                style={{
                  maxWidth: "88%",
                  background: "var(--bg-2)",
                  borderRadius: "4px 14px 14px 14px",
                  padding: "9px 13px",
                  fontSize: 14,
                  lineHeight: 1.55,
                }}
              >
                Added under <strong>Support</strong>, below Contact us.
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
