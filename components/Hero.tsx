"use client";

/**
 * Hero — full-bleed shader poster.
 *
 * The previous two attempts (mock dashboard, then a wall of signal cards)
 * both landed in the visual language every SaaS home page uses. This one
 * commits fully to a poster aesthetic: warm-dark shader ground, enormous
 * type as the primary visual gesture, one small living beacon, no fake
 * product widgets. The site's colour system (warm ink, rust accent,
 * violet accessory) is pulled onto a WebGL mesh so it lives inside the
 * brand rather than the demo's cyan-on-black defaults.
 *
 * SSR guard: MeshGradient + PulsingBorder use WebGL. The shaders package
 * is loaded via next/dynamic with ssr:false so the server render is a
 * solid colour fallback and the shader only runs in the browser.
 */

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useCountUp } from "./primitives";

const MeshGradient = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.MeshGradient),
  { ssr: false, loading: () => null }
);
const PulsingBorder = dynamic(
  () => import("@paper-design/shaders-react").then((m) => m.PulsingBorder),
  { ssr: false, loading: () => null }
);

// ─── Warm shader palette — pulled from the site's own tokens ─────────────
//
// The globals.css tokens are oklch so they can't be handed straight to a
// WebGL shader; these are the RGB translations of the same hues, kept in
// step by eye. If the token palette moves, these need to move with it.

const MESH_BASE = ["#0E0E0C", "#3A1E14", "#C4693D", "#7A4E9C", "#EFE9D2"];
const MESH_OVERLAY = ["#0E0E0C", "#EFE9D2", "#C4693D", "#7A4E9C"];

// ─── Small mono ticker at the bottom — where the merchants actually are ─
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

function CitiesWire() {
  const all = [...CITIES, ...CITIES, ...CITIES];
  return (
    <div aria-hidden className="wire-strip">
      <div className="wire-track">
        <span className="wire-lead">Live from E-biz merchants</span>
        {all.map((c, i) => (
          <span key={i} className="wire-city">
            <span className="wire-bullet" />
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Stats strip that hangs below the dark poster ────────────────────────

function Stat({ value, suffix, label }: { value: number; suffix?: string; label: string }) {
  const [ref, out] = useCountUp(value);
  return (
    <div ref={ref} className="stat-cell">
      <span className="stat-rule" aria-hidden />
      <span className="stat-value">
        {out}
        {suffix ?? ""}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

// ─── The section ─────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section id="hero" data-section="hero" className="hero-poster">
      {/* Two shader layers: a warm colour mesh at slow drift for the ground,
          and a grainier, more distorted second pass on top for a printed /
          etched quality. Neither exposes backgroundColor in this version of
          the lib — the outer section's own bg carries the base. */}
      <MeshGradient
        className="hero-mesh"
        colors={MESH_BASE}
        speed={0.22}
        distortion={0.85}
        swirl={0.55}
        grainMixer={0.25}
        grainOverlay={0.08}
      />
      <MeshGradient
        className="hero-mesh hero-mesh-wire"
        colors={MESH_OVERLAY}
        speed={0.12}
        distortion={1}
        swirl={0.3}
        grainMixer={0.6}
        grainOverlay={0.22}
      />

      {/* Very slight dark vignette pulled in from the corners so the type
          reads on any part of the mesh, no matter where the colours drift. */}
      <div aria-hidden className="hero-vignette" />

      <div className="container hero-poster-inner">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="poster-eyebrow"
        >
          <span className="poster-eyebrow-dot" />
          E-BIZ · V4.3
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.22, 0.61, 0.36, 1] }}
          className="poster-headline"
        >
          Sell everywhere.
          <br />
          <span className="poster-accent">Run it here.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="poster-sub"
        >
          Online store, counter, WhatsApp. One dashboard.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="poster-ctas"
        >
          <a href="/get-started" className="poster-btn poster-btn-primary">
            Get started <span aria-hidden>→</span>
          </a>
          <a href="/features" className="poster-btn poster-btn-ghost">
            See it running
          </a>
        </motion.div>
      </div>

      {/* Corner beacon — a living "signal" mark. Deliberately just a
          shape, not a widget: no label, no fake data. It reads as the
          system heartbeat. */}
      <div className="poster-beacon" aria-hidden>
        <PulsingBorder
          colors={["#C4693D", "#EFE9D2", "#7A4E9C", "#3A1E14", "#C4693D"]}
          colorBack="#00000000"
          speed={0.9}
          roundness={1}
          thickness={0.09}
          softness={0.28}
          intensity={4.5}
          spots={4}
          spotSize={0.12}
          pulse={0.14}
          smoke={0.4}
          smokeSize={4}
          style={{ width: 66, height: 66, borderRadius: "50%" }}
        />
        <span className="poster-beacon-caption">Live</span>
      </div>

      {/* Bottom fade so the transition into the light section that follows
          feels intentional rather than a hard chop. */}
      <div aria-hidden className="poster-fade" />

      {/* Below the poster: cities wire + stats strip on the site's warm
          off-white. Two beats of quiet after the loud opening. */}
      <div className="hero-under">
        <div className="container">
          <div className="stats-strip">
            <Stat value={26} suffix="+" label="Addons" />
            <Stat value={3} label="Sales channels" />
            <Stat value={0} suffix="%" label="Transaction fees" />
            <Stat value={194} label="Countries shippable" />
          </div>
        </div>
        <CitiesWire />
      </div>
    </section>
  );
}
