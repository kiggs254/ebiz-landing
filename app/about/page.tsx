import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";
import { Section } from "@/components/primitives";
import { JsonLd, breadcrumb } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "About",
  description:
    "E-biz is the commerce command center for modern brands — sell online, in-store, and on WhatsApp, with every Kenyan payment method built in.",
  alternates: { canonical: "https://e-biz.co.ke/about" },
};

const VALUES: Array<{ title: string; body: string; color: string }> = [
  {
    title: "Built for operators",
    body: "No developers required. If you can run a shop, you can run E-biz — every feature is a toggle, not a ticket.",
    color: "var(--accent)",
  },
  {
    title: "Every way Kenya pays",
    body: "M-Pesa, Pesapal, Paystack, cards, bank transfer, and cash — reconciled in one place, automatically.",
    color: "var(--good)",
  },
  {
    title: "One calm dashboard",
    body: "Online store, physical counter, and WhatsApp orders all flow into a single, quiet command center.",
    color: "var(--blue, #3b6ea5)",
  },
  {
    title: "Hosting, handled",
    body: "Every store runs on its own dedicated server and database, fully managed by us and included in the subscription — no shared hosting, no server to maintain. Your data is still yours.",
    color: "var(--violet, #7c5cbf)",
  },
];

const STATS: Array<{ value: string; label: string }> = [
  { value: "194", label: "Countries shipped to" },
  { value: "20+", label: "Toggleable addons" },
  { value: "6", label: "Payment methods built in" },
  { value: "100%", label: "Your data, your server" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <Nav />
      <main>
        <Section id="about-top" ariaLabel="About E-biz">
          <div style={{ maxWidth: 760 }}>
            <span className="eyebrow">About E-biz</span>
            <h1
              style={{
                fontFamily: "var(--display)",
                fontWeight: 600,
                fontSize: "clamp(34px, 4.4vw, 58px)",
                lineHeight: 1.04,
                letterSpacing: "-0.03em",
                margin: "16px 0 0",
                textWrap: "balance",
              }}
            >
              The commerce command center{" "}
              <span style={{ color: "var(--accent-ink)" }}>for modern brands.</span>
            </h1>
            <p className="section-lede" style={{ marginTop: 20 }}>
              E-biz is the Ecommerce Management System behind a growing roster of
              African retailers — pharmacies, grocers, fashion labels, auto-parts
              dealers, and more. We give business owners one place to sell
              everywhere their customers are, and the operational tools to run it
              all without a tech team.
            </p>
          </div>
        </Section>

        <Section id="about-story" ariaLabel="Our story" style={{ paddingTop: 0 }}>
          <div style={{ maxWidth: 760 }}>
            <h2 className="section-title" style={{ marginBottom: 10 }}>
              Why we built it
            </h2>
            <p style={{ color: "var(--ink-2)", fontSize: 16, lineHeight: 1.7, margin: "0 0 14px" }}>
              Most commerce software is either too simple to run a real business
              or too complex to use without engineers. Merchants ended up stitching
              together a point-of-sale here, a website there, a spreadsheet for
              stock, and a WhatsApp line for orders — none of it talking to the
              others.
            </p>
            <p style={{ color: "var(--ink-2)", fontSize: 16, lineHeight: 1.7, margin: 0 }}>
              E-biz brings the whole operation into one calm dashboard: products,
              orders, customers, payments, and marketing, with every Kenyan payment
              method built in and 20+ addons you can switch on as you grow. It is
              shippable worldwide and runs on a dedicated server we manage for
              you — hosting included, nothing for you to maintain.
            </p>
          </div>
        </Section>

        <Section id="about-values" ariaLabel="What we believe" style={{ background: "var(--bg-2)" }}>
          <span className="eyebrow">What we believe</span>
          <h2 className="section-title" style={{ marginBottom: 44 }}>
            Principles that shape the product.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {VALUES.map((v) => (
              <article
                key={v.title}
                className="lift"
                style={{
                  border: "1px solid var(--line-softer)",
                  borderRadius: 14,
                  padding: 20,
                  background: "var(--bg)",
                }}
              >
                <span
                  aria-hidden
                  style={{ display: "block", width: 28, height: 4, borderRadius: 3, background: v.color, marginBottom: 14 }}
                />
                <h3 style={{ fontFamily: "var(--display)", fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em", margin: 0 }}>
                  {v.title}
                </h3>
                <p style={{ color: "var(--ink-3)", margin: "8px 0 0", fontSize: 14.5, lineHeight: 1.55 }}>
                  {v.body}
                </p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="about-stats" ariaLabel="By the numbers">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 16,
            }}
          >
            {STATS.map((s) => (
              <div key={s.label} style={{ borderLeft: "2px solid var(--accent)", paddingLeft: 16 }}>
                <div style={{ fontFamily: "var(--display)", fontSize: 40, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div style={{ color: "var(--ink-3)", fontSize: 13.5, marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </Section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
