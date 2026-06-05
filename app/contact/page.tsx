import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Section } from "@/components/primitives";
import ContactForm from "@/components/ContactForm";
import { JsonLd, breadcrumb } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the E-biz team — book a demo, ask a question, or talk to sales. Based in Nairobi, Kenya.",
  alternates: { canonical: "https://e-biz.co.ke/contact" },
};

const METHODS: Array<{ label: string; value: string; href: string; note: string }> = [
  {
    label: "General & support",
    value: "hello@e-biz.co.ke",
    href: "mailto:hello@e-biz.co.ke",
    note: "We usually reply within one business day.",
  },
  {
    label: "Sales & demos",
    value: "Book a live demo",
    href: "mailto:hello@e-biz.co.ke?subject=Demo%20request",
    note: "See E-biz running with your products in 30 minutes.",
  },
  {
    label: "Where we are",
    value: "Nairobi, Kenya",
    href: "",
    note: "Serving merchants across Kenya and beyond.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumb([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <Nav />
      <main>
        <Section id="contact-top" ariaLabel="Contact E-biz">
          <div
            className="contact-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "0.9fr 1.1fr",
              gap: 48,
              alignItems: "start",
            }}
          >
            <div>
              <span className="eyebrow">Contact</span>
              <h1
                style={{
                  fontFamily: "var(--display)",
                  fontWeight: 600,
                  fontSize: "clamp(32px, 4vw, 52px)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  margin: "16px 0 0",
                  textWrap: "balance",
                }}
              >
                Let's talk <span style={{ color: "var(--accent-ink)" }}>commerce.</span>
              </h1>
              <p className="section-lede" style={{ marginTop: 18 }}>
                Whether you're moving from another platform or starting fresh, we'll
                help you get up and running. Reach out and a real person will get
                back to you.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 30 }}>
                {METHODS.map((m) => (
                  <div key={m.label}>
                    <div
                      style={{
                        fontFamily: "var(--mono)",
                        fontSize: 11,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "var(--ink-3)",
                        marginBottom: 5,
                      }}
                    >
                      {m.label}
                    </div>
                    {m.href ? (
                      <a
                        href={m.href}
                        style={{ fontFamily: "var(--display)", fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em", color: "var(--ink)" }}
                      >
                        {m.value}
                      </a>
                    ) : (
                      <div style={{ fontFamily: "var(--display)", fontSize: 19, fontWeight: 600, letterSpacing: "-0.01em" }}>
                        {m.value}
                      </div>
                    )}
                    <div style={{ color: "var(--ink-3)", fontSize: 13.5, marginTop: 3 }}>{m.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <ContactForm />
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
