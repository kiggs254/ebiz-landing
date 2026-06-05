// A distinct mini-infographic for every addon, colour-keyed to its category hue.
// Pure component (no "use client") — usable from server or client components.

import type { Hue } from "./featuresData";

const wrap: React.CSSProperties = {
  height: 118,
  borderRadius: 8,
  border: "1px solid var(--line-softer)",
  background: "var(--bg-2)",
  overflow: "hidden",
  position: "relative",
  padding: 12,
};
const mono: React.CSSProperties = { fontFamily: "var(--mono)", fontSize: 10 };
const card: React.CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--line-softer)",
  borderRadius: 6,
};

function Header({ hue, children }: { hue: Hue; children: React.ReactNode }) {
  return (
    <div
      style={{
        ...mono,
        color: "var(--ink-3)",
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 6,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontSize: 9,
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: 999, background: hue.color }} />
      {children}
    </div>
  );
}

export function AddonVisual({ kind, hue }: { kind: string; hue: Hue }) {
  switch (kind) {
    case "branch":
      return (
        <div style={wrap}>
          <svg viewBox="0 0 230 94" width="100%" height="94" aria-hidden>
            <path
              d="M115 22 L42 70 M115 22 L115 70 M115 22 L188 70"
              stroke={hue.color}
              strokeWidth="1"
              strokeDasharray="2 3"
              opacity="0.6"
              fill="none"
            />
            {([
              [115, 22, "HQ", true],
              [42, 70, "Store A", false],
              [115, 70, "Store B", false],
              [188, 70, "Store C", false],
            ] as Array<[number, number, string, boolean]>).map(([x, y, n, hub], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r={hub ? 11 : 9} fill={hue.color} opacity="0.14" />
                <circle cx={x} cy={y} r={hub ? 5 : 4} fill={hue.color} />
                <text
                  x={x}
                  y={hub ? y - 12 : y + 16}
                  fontSize="8.5"
                  textAnchor="middle"
                  fill="var(--ink-3)"
                  fontFamily="var(--mono)"
                >
                  {n}
                </text>
              </g>
            ))}
          </svg>
        </div>
      );

    case "repeat":
      return (
        <div style={wrap}>
          <Header hue={hue}>Recurring</Header>
          {[
            ["Mon · 5 May", "Box ×1"],
            ["Mon · 12 May", "Box ×1"],
            ["Mon · 19 May", "Box ×1"],
          ].map(([d, b], i) => (
            <div
              key={i}
              style={{
                ...card,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 8px",
                marginBottom: 4,
              }}
            >
              <span style={{ ...mono, color: "var(--ink-2)" }}>{d}</span>
              <span
                style={{
                  fontFamily: "var(--mono)",
                  fontSize: 8,
                  padding: "1px 6px",
                  borderRadius: 999,
                  background: hue.soft,
                  color: hue.ink,
                }}
              >
                AUTO
              </span>
            </div>
          ))}
        </div>
      );

    case "box":
      return (
        <div style={wrap}>
          <Header hue={hue}>Inventory</Header>
          {([
            ["Classic Tee", 124, 0.92, false],
            ["Ceramic Mug", 8, 0.12, true],
            ["Canvas Cap", 56, 0.46, false],
          ] as Array<[string, number, number, boolean]>).map(([n, c, pct, low], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <span style={{ flex: 1, fontSize: 10.5, color: "var(--ink-2)" }}>{n}</span>
              <div style={{ width: 56, height: 5, borderRadius: 999, background: "var(--bg-3)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct * 100}%`, background: low ? hue.color : "var(--ink-4)" }} />
              </div>
              <span style={{ ...mono, width: 26, textAlign: "right", color: low ? hue.ink : "var(--ink-3)", fontWeight: low ? 600 : 400 }}>{c}</span>
            </div>
          ))}
        </div>
      );

    case "percent":
      return (
        <div style={wrap}>
          <div style={{ ...card, padding: "12px 14px" }}>
            {[
              ["Subtotal", "$120.00", false],
              ["Tax · 16%", "+ $19.20", true],
            ].map(([l, v, hl], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{l}</span>
                <span style={{ ...mono, fontSize: 11, color: hl ? hue.ink : "var(--ink-2)", fontWeight: hl ? 600 : 400 }}>{v}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--line-softer)", paddingTop: 7, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 11, fontWeight: 600 }}>Total</span>
              <span style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 16 }}>$139.20</span>
            </div>
          </div>
        </div>
      );

    case "truck":
      return (
        <div style={wrap}>
          <svg viewBox="0 0 230 94" width="100%" height="94" aria-hidden>
            <path d="M30 64 Q115 24 196 58" stroke={hue.color} strokeWidth="1.4" strokeDasharray="3 3" fill="none" />
            <rect x="18" y="54" width="20" height="16" rx="3" fill="var(--bg)" stroke="var(--ink-3)" strokeWidth="1.3" />
            <circle cx="196" cy="50" r="8" fill={hue.color} />
            <circle cx="196" cy="50" r="3" fill="var(--bg)" />
            <path d="M196 58 L191 50 L201 50 Z" fill={hue.color} />
            <rect x="80" y="22" width="72" height="18" rx="9" fill="var(--bg)" stroke="var(--line-soft)" />
            <text x="116" y="34" fontSize="9.5" textAnchor="middle" fill={hue.ink} fontFamily="var(--mono)">
              8.4 km · $4.20
            </text>
          </svg>
        </div>
      );

    case "tag":
      return (
        <div style={wrap}>
          <Header hue={hue}>Shop by brand</Header>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {["Northwind", "Vertex", "Atlas", "Orbit", "Foundry", "Meridian"].map((b) => (
              <span
                key={b}
                style={{
                  fontSize: 9.5,
                  padding: "4px 9px",
                  borderRadius: 999,
                  background: hue.soft,
                  color: hue.ink,
                  fontWeight: 500,
                }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      );

    case "chat":
      return (
        <div style={wrap}>
          <div style={{ ...card, padding: "10px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: hue.color, fontSize: 11, letterSpacing: "1px" }}>★★★★★</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 8, padding: "1px 6px", borderRadius: 999, background: hue.soft, color: hue.ink }}>
                APPROVE
              </span>
            </div>
            <div style={{ fontSize: 10.5, color: "var(--ink-2)", marginTop: 6, lineHeight: 1.4 }}>
              “Great quality, arrived fast!”
            </div>
            <div style={{ ...mono, fontSize: 9, color: "var(--ink-3)", marginTop: 5 }}>— Sofia R. · verified buyer</div>
          </div>
        </div>
      );

    case "star":
      return (
        <div style={{ ...wrap, display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 30, color: hue.ink, lineHeight: 1 }}>4.8</div>
            <div style={{ color: hue.color, fontSize: 11, letterSpacing: "1px", marginTop: 2 }}>★★★★★</div>
            <div style={{ ...mono, fontSize: 8.5, color: "var(--ink-3)", marginTop: 3 }}>120 ratings</div>
          </div>
          <div style={{ flex: 1 }}>
            {[5, 4, 3, 2, 1].map((s, i) => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                <span style={{ ...mono, fontSize: 8.5, color: "var(--ink-4)", width: 6 }}>{s}</span>
                <div style={{ flex: 1, height: 4, borderRadius: 999, background: "var(--bg-3)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${[88, 64, 28, 10, 5][i]}%`, background: hue.color, opacity: 0.55 + (4 - i) * 0.1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "coin":
      return (
        <div style={wrap}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <Header hue={hue}>Currency</Header>
            <span style={{ ...mono, fontSize: 9, padding: "2px 8px", borderRadius: 999, border: `1px solid ${hue.color}`, color: hue.ink }}>USD ▾</span>
          </div>
          {[
            ["$", "96.00"],
            ["€", "88.20"],
            ["£", "75.40"],
          ].map(([s, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
              <span style={{ ...mono, color: "var(--ink-3)" }}>{s} price</span>
              <span style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 13 }}>{s}{v}</span>
            </div>
          ))}
        </div>
      );

    case "gift":
      return (
        <div style={wrap}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={{ ...mono, fontSize: 9, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Your points</span>
            <span style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 22, color: hue.ink }}>1,480</span>
          </div>
          <div style={{ height: 7, borderRadius: 999, background: "var(--bg-3)", overflow: "hidden", margin: "10px 0 8px" }}>
            <div style={{ height: "100%", width: "74%", background: hue.color }} />
          </div>
          <div style={{ fontSize: 10.5, color: "var(--ink-3)" }}>520 pts to your next reward 🎁</div>
        </div>
      );

    case "megaphone":
      return (
        <div style={{ ...wrap, display: "flex", alignItems: "center", gap: 6 }}>
          {[
            ["Cart left", false],
            ["Wait 24h", false],
            ["Email sent", true],
          ].map(([t, done], i) => (
            <div key={i} style={{ display: "contents" }}>
              {i > 0 && <span style={{ color: "var(--ink-4)", fontSize: 12 }}>→</span>}
              <div
                style={{
                  flex: 1,
                  ...card,
                  background: done ? hue.soft : "var(--bg)",
                  borderColor: done ? hue.color : "var(--line-softer)",
                  padding: "10px 6px",
                  textAlign: "center",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 500, color: done ? hue.ink : "var(--ink-2)" }}>{t}</div>
                <div style={{ ...mono, fontSize: 12, marginTop: 4, color: done ? hue.ink : "var(--ink-4)" }}>{done ? "✓" : "○"}</div>
              </div>
            </div>
          ))}
        </div>
      );

    case "target":
      return (
        <div style={wrap}>
          <Header hue={hue}>Conversions</Header>
          {([
            ["Visits", "1,240", 100],
            ["Add to cart", "420", 60],
            ["Checkout", "180", 36],
            ["Purchase", "96", 22],
          ] as Array<[string, string, number]>).map(([l, v, pct], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 9.5, color: "var(--ink-3)", width: 64 }}>{l}</span>
              <div style={{ flex: 1, height: 8, borderRadius: 3, background: "var(--bg-3)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${pct}%`, background: hue.color, opacity: 0.4 + pct / 160 }} />
              </div>
              <span style={{ ...mono, fontSize: 9, color: "var(--ink-3)", width: 30, textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>
      );

    case "bubble":
      return (
        <div style={wrap}>
          <Header hue={hue}>WhatsApp</Header>
          <div style={{ ...card, padding: "6px 9px", maxWidth: "82%", borderRadius: "8px 8px 8px 2px", marginBottom: 6, fontSize: 10, color: "var(--ink-2)" }}>
            Your order #SF-3041 has shipped 📦
          </div>
          <div style={{ padding: "6px 9px", maxWidth: "70%", marginLeft: "auto", borderRadius: "8px 8px 2px 8px", background: hue.soft, color: hue.ink, fontSize: 10, fontWeight: 500 }}>
            Track it here →
          </div>
        </div>
      );

    case "bag":
      return (
        <div style={wrap}>
          <Header hue={hue}>Checkout in chat</Header>
          <div style={{ ...card, padding: 8, display: "flex", gap: 8, alignItems: "center" }}>
            <span style={{ width: 30, height: 30, borderRadius: 6, overflow: "hidden", flexShrink: 0, border: "1px solid var(--line-softer)" }}>
              <img src="/products/sneaker.jpg" alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 600 }}>Trail Runner</div>
              <div style={{ ...mono, fontSize: 9, color: "var(--ink-3)" }}>$96.00</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, padding: "5px 10px", borderRadius: 999, background: hue.color, color: "#fff" }}>Pay</span>
          </div>
          <div style={{ ...mono, fontSize: 8.5, color: "var(--ink-3)", marginTop: 6 }}>Paid via M-Pesa · in WhatsApp</div>
        </div>
      );

    case "sparkles":
      return (
        <div style={wrap}>
          <div style={{ ...mono, fontSize: 9.5, color: hue.ink, marginBottom: 8 }}>✦ Generating description…</div>
          <div style={{ ...card, padding: "8px 10px", fontSize: 10.5, lineHeight: 1.5, color: "var(--ink-2)" }}>
            Hand-finished walnut lamp with a{" "}
            <span style={{ background: hue.soft, color: hue.ink, padding: "0 2px" }}>brushed brass</span> stem
            <span style={{ display: "inline-block", width: 5, height: 11, background: hue.color, marginLeft: 1, verticalAlign: -2, animation: "cursor 1s infinite" }} />
          </div>
        </div>
      );

    case "search":
      return (
        <div style={wrap}>
          <div style={{ ...card, padding: "6px 10px", display: "flex", alignItems: "center", gap: 6, marginBottom: 7 }}>
            <span style={{ color: hue.ink, fontSize: 11 }}>⌕</span>
            <span style={{ ...mono, fontSize: 10, color: "var(--ink-2)" }}>red running sho</span>
            <span style={{ width: 1, height: 11, background: hue.color, animation: "cursor 1s infinite" }} />
          </div>
          {["Red Trail Runner", "Crimson Sneaker", "Ruby Hi-Top"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4, fontSize: 10, color: "var(--ink-3)" }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: hue.color, opacity: 0.8 - i * 0.2 }} />
              {s}
            </div>
          ))}
        </div>
      );

    case "image":
      return (
        <div style={{ ...wrap, display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 56, borderRadius: 6, border: "1px solid var(--line-softer)", overflow: "hidden" }}>
              <img src="/products/camera.jpg" alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: "grayscale(1) brightness(0.92) contrast(0.95)" }} />
            </div>
            <div style={{ ...mono, fontSize: 8.5, color: "var(--ink-4)", marginTop: 5 }}>before</div>
          </div>
          <span style={{ color: hue.ink, fontSize: 13 }}>✦→</span>
          <div style={{ flex: 1, textAlign: "center" }}>
            <div style={{ height: 56, borderRadius: 6, border: `1px solid ${hue.color}`, overflow: "hidden", position: "relative" }}>
              <img src="/products/camera.jpg" alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
              <span style={{ position: "absolute", top: 2, right: 4, color: hue.color, fontSize: 11 }}>✦</span>
            </div>
            <div style={{ ...mono, fontSize: 8.5, color: hue.ink, marginTop: 5 }}>enhanced</div>
          </div>
        </div>
      );

    case "code":
      return (
        <div style={wrap}>
          <div style={{ ...card, padding: "9px 11px", fontFamily: "var(--mono)", fontSize: 9.5, lineHeight: 1.7 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span><span style={{ color: hue.ink }}>GET</span> <span style={{ color: "var(--ink-3)" }}>/api/v1/orders</span></span>
              <span style={{ color: "var(--good)" }}>200</span>
            </div>
            <div style={{ color: "var(--ink-3)" }}>{"{ "}<span style={{ color: "var(--ink-2)" }}>&quot;status&quot;</span>: <span style={{ color: hue.ink }}>&quot;success&quot;</span>,</div>
            <div style={{ color: "var(--ink-3)" }}>&nbsp;&nbsp;<span style={{ color: "var(--ink-2)" }}>&quot;data&quot;</span>: [ … ] {"}"}</div>
          </div>
        </div>
      );

    case "download":
      return (
        <div style={wrap}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10.5, marginBottom: 10 }}>
            <span style={{ ...mono, color: "var(--ink-3)" }}>WooCommerce</span>
            <span style={{ color: hue.ink }}>→</span>
            <span style={{ fontFamily: "var(--display)", fontWeight: 600 }}>E-biz</span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "var(--bg-3)", overflow: "hidden", marginBottom: 8 }}>
            <div style={{ height: "100%", width: "80%", background: hue.color }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", ...mono, fontSize: 9, color: "var(--ink-3)" }}>
            <span>Importing products…</span>
            <span style={{ color: hue.ink }}>1,240 / 1,550</span>
          </div>
        </div>
      );

    case "medical":
      return (
        <div style={wrap}>
          <div style={{ ...card, padding: "10px 12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <span style={{ fontFamily: "var(--display)", fontWeight: 600, fontSize: 13, color: hue.ink }}>℞ Prescription</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 8, padding: "2px 7px", borderRadius: 999, background: hue.soft, color: hue.ink }}>VERIFIED ✓</span>
            </div>
            {[0.9, 0.7, 0.5].map((w, i) => (
              <div key={i} style={{ height: 4, borderRadius: 999, background: "var(--bg-3)", width: `${w * 100}%`, marginBottom: 5 }} />
            ))}
          </div>
        </div>
      );

    default:
      return <div style={wrap} />;
  }
}
