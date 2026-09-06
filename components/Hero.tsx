"use client";

/**
 * Hero — "Live Signals".
 *
 * The old hero was Text | Screenshot: a fine pattern that reads like every
 * other SaaS home page ever shipped. This replaces the screenshot with a wall
 * of tiny live product moments — an order coming in, a WhatsApp confirmation,
 * a rider assigned, revenue ticking up — that IS the product firing. The
 * message is not "here is a picture of a dashboard"; it is "here is what your
 * dashboard is doing right now".
 *
 * All CSS-only motion. One orchestrated page-load stagger, then a slow
 * lifetime pulse the eye barely registers unless it looks. No layout thrash,
 * no libraries.
 */

import Image from "next/image";
import { useCountUp } from "./primitives";

// ─── Ticker along the top: where the real merchants are ───────────────────
const CITIES = [
  "Nairobi",
  "Kampala",
  "Kigali",
  "Accra",
  "Lagos",
  "Dar es Salaam",
  "Kumasi",
  "Mombasa",
  "Addis Ababa",
  "Kinshasa",
  "Lusaka",
  "Douala",
];

function TopWire() {
  const all = [...CITIES, ...CITIES, ...CITIES];
  return (
    <div
      aria-hidden
      style={{
        borderTop: "1px solid var(--line-softer)",
        borderBottom: "1px solid var(--line-softer)",
        overflow: "hidden",
        maskImage: "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
        WebkitMaskImage: "linear-gradient(90deg, transparent, #000 14%, #000 86%, transparent)",
        padding: "9px 0",
        background: "var(--bg)",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: 36,
          whiteSpace: "nowrap",
          width: "max-content",
          animation: "mq 88s linear infinite",
        }}
      >
        <span className="wire-lead" style={wireLead}>Live from E-biz merchants</span>
        {all.map((c, i) => (
          <span key={i} style={wireDot}>
            <span aria-hidden style={wireBullet} />
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Signal cards ────────────────────────────────────────────────────────
// Each card is a tiny fragment of the admin — small, high-fidelity, with a
// stagger delay. Deliberately not perfectly aligned: the cards nudge left or
// right by a few px so the eye reads them as pinned, not gridded.

function SignalNewOrder() {
  const [ref, kes] = useCountUp(4850, { duration: 1600 });
  return (
    <div ref={ref} className="signal signal-a" style={signalCard}>
      <SignalHead label="Order · just now" dot="var(--accent)" />
      <div style={rowBetween}>
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <span style={monoTag}>ORD-2411-8827</span>
          <span style={cardTitle}>Grace Wanjiku</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
          <span style={priceLarge}>KSh {kes}</span>
          <span style={mpesaPill}>M-PESA</span>
        </div>
      </div>
      <div style={statusRail}>
        <StatusTick label="Placed" active />
        <StatusTick label="Processing" active pulse />
        <StatusTick label="Packed" />
        <StatusTick label="Delivered" />
      </div>
    </div>
  );
}

function SignalWhatsApp() {
  return (
    <div className="signal signal-b" style={{ ...signalCard, paddingBottom: 14 }}>
      <SignalHead label="WhatsApp · 2m ago" dot="var(--green)" />
      <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
        <div
          aria-hidden
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            background: "var(--green-soft)",
            display: "grid",
            placeItems: "center",
            color: "var(--green-ink)",
            fontFamily: "var(--mono)",
            fontSize: 12,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          MA
        </div>
        <div style={waBubble}>
          <div style={{ fontSize: 13, lineHeight: 1.45, color: "var(--ink)" }}>
            Booking confirmed 🎉<br />
            2 guests · Fri 12 Sep, 7:30 PM<br />
            <span style={{ color: "var(--ink-3)", fontSize: 12 }}>Ref RSV-GYX53L</span>
          </div>
          <div style={waMeta}>
            <span>19:04</span>
            <TickTicks />
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalRider() {
  return (
    <div className="signal signal-c" style={signalCard}>
      <SignalHead label="Rider · 4m ago" dot="var(--blue)" />
      <div style={rowBetween}>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <div style={mapPin}>
            <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden>
              <path
                d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
                fill="none"
                stroke="var(--blue-ink)"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="10" r="2.4" fill="var(--blue-ink)" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={cardTitle}>John Kariuki</span>
            <span style={{ ...monoTag, color: "var(--ink-3)" }}>KGD 5657 · Motorbike</span>
          </div>
        </div>
        <a href="tel:+254712345678" style={callBtn} aria-label="Call rider">
          Call
        </a>
      </div>
      <div style={{ ...monoTag, marginTop: 12, color: "var(--ink-3)" }}>
        Assigned to ORD-2411-8811 · Karen → Kilimani
      </div>
    </div>
  );
}

function SignalRevenue() {
  const [ref, val] = useCountUp(184500, { duration: 1800 });
  // Simple ascending sparkline that draws itself via a stroke-dashoffset trick.
  const points = "0,42 26,38 52,40 78,32 104,34 130,26 156,22 182,14 208,10";
  return (
    <div ref={ref} className="signal signal-d" style={signalCard}>
      <SignalHead label="Today · so far" dot="var(--violet)" />
      <div style={rowBetween}>
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <span style={monoTag}>REVENUE</span>
          <span
            style={{
              fontFamily: "var(--display)",
              fontWeight: 600,
              fontSize: 26,
              lineHeight: 1,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            KSh {val}
          </span>
          <span style={{ ...monoTag, color: "var(--good)" }}>▲ 18.4% vs yesterday</span>
        </div>
        <svg viewBox="0 0 220 56" width="118" height="34" aria-hidden style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id="spk" x1="0" x2="1">
              <stop offset="0" stopColor="var(--accent)" />
              <stop offset="1" stopColor="var(--violet)" />
            </linearGradient>
          </defs>
          <polyline
            points={points}
            fill="none"
            stroke="url(#spk)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: 260,
              strokeDashoffset: 260,
              animation: "sparkDraw 1.6s ease-out 0.6s forwards",
            }}
          />
          <circle cx="208" cy="10" r="3" fill="var(--violet)">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>
    </div>
  );
}

// ─── Small helpers used inside the signal cards ──────────────────────────

function SignalHead({ label, dot }: { label: string; dot: string }) {
  return (
    <div style={sigHead}>
      <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: dot }} />
      {label}
    </div>
  );
}

function StatusTick({ label, active, pulse }: { label: string; active?: boolean; pulse?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 }}>
      <span
        style={{
          width: pulse ? 9 : 7,
          height: pulse ? 9 : 7,
          borderRadius: 999,
          background: active ? "var(--accent)" : "var(--bg-3)",
          boxShadow: pulse ? "0 0 0 4px rgba(216, 108, 66, 0.14)" : "none",
          animation: pulse ? "signalPulse 1.6s ease-in-out infinite" : "none",
        }}
      />
      <span style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: "0.05em", color: active ? "var(--ink-2)" : "var(--ink-4)", textTransform: "uppercase" }}>
        {label}
      </span>
    </div>
  );
}

function TickTicks() {
  return (
    <span aria-hidden style={{ display: "inline-flex", gap: 1, color: "var(--good)" }}>
      <svg viewBox="0 0 14 10" width="14" height="10">
        <path d="M1 5 L5 9 L13 1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <svg viewBox="0 0 14 10" width="14" height="10" style={{ marginLeft: -6 }}>
        <path d="M1 5 L5 9 L13 1" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

// ─── The section ─────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section id="hero" data-section="hero" style={sectionStyle}>
      {/* Background: two barely-there layers. A vertical column grid (broadsheet
          rule) and a grain overlay. Together they give the whole thing paper. */}
      <div aria-hidden style={gridOverlay} />
      <div aria-hidden style={grainOverlay} />

      <div className="container hero-shell">
        <div className="hero-broadsheet">
          {/* ─── LEFT: headline + CTA ─── */}
          <div className="hero-left">
            <a href="#assistant" className="tag tag-link hero-anim" style={{ textDecoration: "none", color: "inherit" }}>
              <span aria-hidden style={{ width: 6, height: 6, borderRadius: 999, background: "var(--accent)" }} />
              v4.3 · Store Assistant, live
              <span aria-hidden style={{ marginLeft: 2, opacity: 0.55 }}>→</span>
            </a>

            <h1 className="display hero-headline hero-anim" style={{ animationDelay: "0.08s" }}>
              One control tower.
              <br />
              Every order, every message,
              <br />
              every <em className="hero-title-accent">rider.</em>
            </h1>

            <p className="hero-anim hero-lede" style={{ animationDelay: "0.18s" }}>
              E-biz runs the online store, the counter, and the WhatsApp chat —
              from one calm dashboard, with M-Pesa, Paystack, Pesapal, cards and cash
              built in.
            </p>

            <div className="hero-anim" style={{ display: "flex", gap: 12, marginTop: 30, flexWrap: "wrap", animationDelay: "0.28s" }}>
              <a href="/get-started" className="btn btn-primary">
                Get started <span className="arrow">→</span>
              </a>
              <a href="/features" className="btn btn-ghost">
                See it running
              </a>
            </div>

            <div className="hero-anim" style={{ ...factRow, animationDelay: "0.36s" }}>
              <span style={factItem}>
                <span aria-hidden style={{ ...factDot, background: "var(--accent)" }} />
                No transaction fees
              </span>
              <span style={factItem}>
                <span aria-hidden style={{ ...factDot, background: "var(--violet)" }} />
                194 countries
              </span>
              <span style={factItem}>
                <span aria-hidden style={{ ...factDot, background: "var(--teal)" }} />
                Live in a day
              </span>
            </div>

            <div className="hero-anim hero-avatars" style={{ animationDelay: "0.42s" }}>
              <span style={{ display: "flex", flexShrink: 0 }} aria-hidden>
                {[4, 5, 6, 7].map((n, i) => (
                  <Image
                    key={n}
                    src={`/people/person-${n}.png`}
                    alt=""
                    width={28}
                    height={28}
                    style={{ marginLeft: i === 0 ? 0 : -8, borderRadius: 999, background: "var(--bg-2)", border: "2px solid var(--bg)" }}
                  />
                ))}
              </span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, letterSpacing: "0.05em", color: "var(--ink-3)", textTransform: "uppercase" }}>
                Trusted by shops from Kilimani to Kumasi
              </span>
            </div>
          </div>

          {/* ─── RIGHT: the signals wall ─── */}
          <div className="hero-right">
            <div aria-hidden style={signalsBackdrop} />
            <div className="hero-signals" aria-label="Live product moments">
              <SignalNewOrder />
              <SignalWhatsApp />
              <SignalRider />
              <SignalRevenue />
            </div>
            <div style={rightLegend} aria-hidden>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--good)", boxShadow: "0 0 0 3px rgba(88, 168, 122, 0.16)", animation: "signalPulse 1.6s ease-in-out infinite" }} />
                Streaming — sample data
              </span>
              <span>NBO · UTC+3</span>
            </div>
          </div>
        </div>

        {/* Stats strip — restyled with rule marks and mono labels */}
        <div className="hero-anim hero-stats" style={{ animationDelay: "0.5s" }}>
          <Stat label="Addons" value={26} suffix="+" tint="var(--violet-ink)" />
          <Stat label="Sales channels" value={3} tint="var(--accent-ink)" />
          <Stat label="Transaction fees" value={0} suffix="%" tint="var(--green-ink)" />
          <Stat label="Countries shippable" value={194} tint="var(--teal-ink)" />
        </div>
      </div>

      {/* Wire is full-bleed; live-cities marquee sits below the container */}
      <div style={{ marginTop: 32 }}>
        <TopWire />
      </div>
    </section>
  );
}

function Stat({ label, value, suffix, tint }: { label: string; value: number; suffix?: string; tint: string }) {
  const [ref, out] = useCountUp(value);
  return (
    <div ref={ref} style={statCol}>
      <span style={statRule} aria-hidden />
      <span style={{ ...statValue, color: tint }}>
        {out}
        {suffix ?? ""}
      </span>
      <span style={statLabel}>{label}</span>
    </div>
  );
}

// ─── Inline styles for one-off pieces (the shared bits live in globals.css) ─

const sectionStyle: React.CSSProperties = {
  paddingTop: 36,
  paddingBottom: 0,
  position: "relative",
  isolation: "isolate",
  overflow: "hidden",
};

const gridOverlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 0,
  backgroundImage:
    "linear-gradient(to right, rgba(14,14,12,0.045) 1px, transparent 1px)",
  backgroundSize: "calc((min(100%, 1280px) - 64px) / 12) 100%",
  backgroundPosition: "center top",
  maskImage: "linear-gradient(to bottom, black 0%, black 68%, transparent 100%)",
  WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 68%, transparent 100%)",
};

const grainOverlay: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  pointerEvents: "none",
  zIndex: 0,
  opacity: 0.35,
  mixBlendMode: "multiply",
  backgroundImage:
    // ~140 tiny dots in an SVG data URI — cheap grain, no image.
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
};

const wireLead: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-2)",
  fontWeight: 600,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

const wireDot: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
  display: "inline-flex",
  alignItems: "center",
  gap: 10,
};

const wireBullet: React.CSSProperties = {
  width: 4,
  height: 4,
  borderRadius: 999,
  background: "var(--accent)",
  opacity: 0.7,
};

const signalsBackdrop: React.CSSProperties = {
  position: "absolute",
  inset: "-40px -8% -20px",
  zIndex: -1,
  background:
    "radial-gradient(60% 55% at 30% 20%, var(--violet-soft), transparent 70%), radial-gradient(50% 55% at 80% 60%, var(--accent-soft), transparent 70%), radial-gradient(45% 50% at 20% 95%, var(--teal-soft), transparent 70%)",
  filter: "blur(30px)",
  pointerEvents: "none",
};

const signalCard: React.CSSProperties = {
  background: "var(--bg)",
  border: "1px solid var(--line-soft)",
  borderRadius: 14,
  padding: "14px 16px 16px",
  boxShadow:
    "0 30px 60px -40px rgba(14,14,12,0.35), 0 12px 28px -16px rgba(14,14,12,0.15)",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};

const sigHead: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  fontFamily: "var(--mono)",
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
};

const rowBetween: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: 10,
};

const monoTag: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 10.5,
  letterSpacing: "0.06em",
  color: "var(--ink-3)",
};

const cardTitle: React.CSSProperties = {
  fontFamily: "var(--display)",
  fontWeight: 600,
  fontSize: 15,
  color: "var(--ink)",
  letterSpacing: "-0.01em",
};

const priceLarge: React.CSSProperties = {
  fontFamily: "var(--display)",
  fontWeight: 600,
  fontSize: 20,
  lineHeight: 1,
  color: "var(--ink)",
  letterSpacing: "-0.02em",
  fontVariantNumeric: "tabular-nums",
};

const mpesaPill: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 9.5,
  fontWeight: 700,
  letterSpacing: "0.08em",
  background: "var(--green-soft)",
  color: "var(--green-ink)",
  padding: "3px 7px",
  borderRadius: 5,
};

const statusRail: React.CSSProperties = {
  display: "flex",
  gap: 6,
  paddingTop: 10,
  borderTop: "1px dashed var(--line-softer)",
};

const waBubble: React.CSSProperties = {
  background: "var(--green-soft)",
  border: "1px solid rgba(38, 137, 74, 0.14)",
  borderTopLeftRadius: 4,
  borderTopRightRadius: 14,
  borderBottomLeftRadius: 14,
  borderBottomRightRadius: 14,
  padding: "10px 12px 8px",
  flex: 1,
  minWidth: 0,
};

const waMeta: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: 6,
  marginTop: 4,
  fontFamily: "var(--mono)",
  fontSize: 10,
  color: "var(--ink-4)",
};

const mapPin: React.CSSProperties = {
  width: 30,
  height: 30,
  borderRadius: 8,
  background: "var(--blue-soft)",
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
};

const callBtn: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: "0.08em",
  color: "var(--ink)",
  textTransform: "uppercase",
  border: "1px solid var(--line-soft)",
  padding: "6px 10px",
  borderRadius: 6,
  textDecoration: "none",
  fontWeight: 600,
  background: "var(--bg-2)",
};

const rightLegend: React.CSSProperties = {
  marginTop: 16,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  fontFamily: "var(--mono)",
  fontSize: 10.5,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
};

const factRow: React.CSSProperties = {
  display: "flex",
  gap: 24,
  marginTop: 26,
  flexWrap: "wrap",
};

const factItem: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  fontFamily: "var(--mono)",
  fontSize: 11.5,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "var(--ink-2)",
  fontWeight: 600,
};

const factDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: 2,
};

const statCol: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
  position: "relative",
  paddingTop: 14,
};

const statRule: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  width: 24,
  height: 2,
  background: "var(--ink)",
};

const statValue: React.CSSProperties = {
  fontFamily: "var(--display)",
  fontWeight: 600,
  fontSize: 40,
  lineHeight: 1,
  letterSpacing: "-0.03em",
  fontVariantNumeric: "tabular-nums",
};

const statLabel: React.CSSProperties = {
  fontFamily: "var(--mono)",
  fontSize: 11,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
  color: "var(--ink-3)",
};
