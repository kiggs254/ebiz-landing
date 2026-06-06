import type { Metadata } from "next";
import Image from "next/image";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import { Section } from "@/components/primitives";
import { FeatureVisual } from "@/components/FeatureVisual";
import { AddonIcon } from "@/components/icons";
import { AddonVisual } from "@/components/AddonVisual";
import { CORE_FEATURES, CATEGORIES, ADDONS } from "@/components/featuresData";
import { JsonLd, breadcrumb } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Everything E-biz does: order management, AI catalog, multi-location stock, loyalty, WhatsApp commerce, and 20+ toggleable addons. Built for business owners, no developers required.",
  alternates: { canonical: "https://e-biz.co.ke/features" },
};

function Tile({ img, h }: { img: string; h: number }) {
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 14,
        overflow: "hidden",
        border: "1px solid var(--line-soft)",
        boxShadow: "0 26px 50px -28px rgba(14,14,12,0.30)",
        height: h,
        background: "var(--bg-2)",
      }}
    >
      <Image
        src={`/products/${img}.jpg`}
        alt=""
        fill
        sizes="(max-width: 900px) 50vw, 300px"
        style={{ objectFit: "cover" }}
      />
    </div>
  );
}

export default function FeaturesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Features", path: "/features" },
        ])}
      />
      <Nav />
      <main>
        <Section id="features-top" ariaLabel="All features">
          <div
            className="features-hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.02fr 0.98fr",
              gap: 48,
              alignItems: "center",
            }}
          >
            <div>
              <span className="eyebrow" style={{ "--eyebrow-color": "var(--violet)" } as any}>
                Everything E-biz does
              </span>
              <h1
                style={{
                  fontFamily: "var(--display)",
                  fontWeight: 600,
                  fontSize: "clamp(36px, 4.4vw, 60px)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.03em",
                  margin: "16px 0 0",
                  textWrap: "balance",
                }}
              >
                Every tool your store needs,{" "}
                <span style={{ color: "var(--violet-ink)" }}>in one place.</span>
              </h1>
              <p className="section-lede" style={{ marginTop: 20 }}>
                E-biz runs your whole business: orders, products, customers,
                payments, and marketing. Then you switch on 20+ addons as you
                grow. No developers required.
              </p>
              <div style={{ display: "flex", gap: 12, marginTop: 28, flexWrap: "wrap" }}>
                <a href="#cta" className="btn btn-primary">
                  Book a live demo <span className="arrow">→</span>
                </a>
                <a href="/#pricing" className="btn btn-ghost">
                  See pricing
                </a>
              </div>
            </div>

            <div className="features-hero-art" style={{ position: "relative" }}>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: "-30px -8% 0",
                  background:
                    "radial-gradient(50% 50% at 28% 8%, var(--violet-soft), transparent 70%), radial-gradient(48% 48% at 88% 28%, var(--accent-soft), transparent 70%), radial-gradient(45% 45% at 62% 96%, var(--blue-soft), transparent 70%)",
                  filter: "blur(26px)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              />
              <div
                style={{
                  position: "relative",
                  zIndex: 1,
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 14,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 14, transform: "translateY(-16px)" }}>
                  <Tile img="sneaker" h={186} />
                  <Tile img="sunglasses" h={140} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14, transform: "translateY(16px)" }}>
                  <Tile img="headphones" h={140} />
                  <Tile img="watch2" h={186} />
                </div>
              </div>

              <div
                style={{
                  position: "absolute",
                  top: 14,
                  left: -14,
                  zIndex: 2,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                  background: "var(--bg)",
                  border: "1px solid var(--line-soft)",
                  borderRadius: 999,
                  padding: "7px 12px",
                  boxShadow: "0 16px 32px -18px rgba(14,14,12,0.32)",
                  fontSize: 12,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ color: "var(--accent)" }}>★</span> 4.9 · 2.4k reviews
              </div>

              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: -12,
                  zIndex: 2,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "var(--bg)",
                  border: "1px solid var(--line-soft)",
                  borderRadius: 999,
                  padding: "7px 12px",
                  boxShadow: "0 16px 32px -18px rgba(14,14,12,0.32)",
                  fontSize: 12,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                }}
              >
                <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--good)" }} />
                +24% sales this week
              </div>
            </div>
          </div>
        </Section>

        <Section id="core" ariaLabel="Core platform" style={{ paddingTop: 0 }}>
          <span className="eyebrow">Core platform · in every plan</span>
          <h2 className="section-title" style={{ marginBottom: 10 }}>
            The essentials, included.
          </h2>
          <p className="section-lede" style={{ marginBottom: 44 }}>
            These come switched on from day one. They're the foundation every store runs
            on.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {CORE_FEATURES.map((f, i) => (
              <article
                key={i}
                className="lift"
                style={{
                  border: "1px solid var(--line-softer)",
                  borderRadius: 14,
                  padding: 18,
                  background: "var(--bg)",
                }}
              >
                <FeatureVisual kind={f.visual} hue={f.hue} />
                <div style={{ marginTop: 16 }}>
                  <h3
                    style={{
                      fontFamily: "var(--display)",
                      fontSize: 20,
                      fontWeight: 600,
                      letterSpacing: "-0.02em",
                      margin: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 9,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 9,
                        height: 9,
                        borderRadius: 3,
                        background: f.hue.color,
                        flexShrink: 0,
                      }}
                    />
                    {f.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--ink-3)",
                      margin: "8px 0 0",
                      fontSize: 14.5,
                      lineHeight: 1.55,
                      textWrap: "pretty",
                    }}
                  >
                    {f.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="all-addons"
          ariaLabel="All addons"
          style={{ background: "var(--bg-2)" }}
        >
          <span className="eyebrow" style={{ "--eyebrow-color": "var(--accent)" } as any}>
            Addons · 20+ and counting
          </span>
          <h2 className="section-title">
            Switch on exactly <em>what you need.</em>
          </h2>
          <p className="section-lede" style={{ marginBottom: 48 }}>
            Every addon is one toggle away in your dashboard, and they're all
            included in the Full plan.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
            {CATEGORIES.map((cat) => {
              const items = ADDONS.filter((a) => a.cat === cat.id);
              return (
                <div key={cat.id}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      flexWrap: "wrap",
                      marginBottom: 18,
                      paddingBottom: 12,
                      borderBottom: `2px solid ${cat.color}`,
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        background: cat.soft,
                        color: cat.ink,
                        display: "grid",
                        placeItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <AddonIcon name={items[0]?.icon} size={19} />
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--display)",
                        fontWeight: 600,
                        fontSize: 22,
                        letterSpacing: "-0.02em",
                        margin: 0,
                        color: cat.ink,
                      }}
                    >
                      {cat.label}
                    </h3>
                    <span style={{ color: "var(--ink-3)", fontSize: 14 }}>
                      {cat.blurb}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontFamily: "var(--mono)",
                        fontSize: 12,
                        color: "var(--ink-4)",
                      }}
                    >
                      {items.length} addon{items.length > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
                      gap: 14,
                    }}
                  >
                    {items.map((a, i) => (
                      <div
                        key={i}
                        className="lift"
                        style={{
                          border: "1px solid var(--line-softer)",
                          borderRadius: 12,
                          padding: 14,
                          background: "var(--bg)",
                          overflow: "hidden",
                        }}
                      >
                        <AddonVisual kind={a.icon} hue={cat} />
                        <div style={{ marginTop: 14 }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 9,
                              fontWeight: 600,
                              fontSize: 15.5,
                            }}
                          >
                            <span
                              aria-hidden
                              style={{ width: 8, height: 8, borderRadius: 2, background: cat.color, flexShrink: 0 }}
                            />
                            {a.name}
                          </div>
                          <div
                            style={{
                              color: "var(--ink-3)",
                              fontSize: 13,
                              marginTop: 6,
                              lineHeight: 1.5,
                              textWrap: "pretty",
                            }}
                          >
                            {a.desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
