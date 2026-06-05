import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Section } from "@/components/primitives";

/**
 * Shared shell for long-form legal/document pages (privacy, terms, cookies).
 * Renders the site chrome + a titled header + a constrained `.legal` prose body.
 */
export default function LegalDoc({
  eyebrow = "Legal",
  title,
  updated,
  children,
}: {
  eyebrow?: string;
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Nav />
      <main>
        <Section id="legal-top" ariaLabel={title}>
          <span className="eyebrow">{eyebrow}</span>
          <h1
            style={{
              fontFamily: "var(--display)",
              fontWeight: 600,
              fontSize: "clamp(32px, 4vw, 50px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: "14px 0 10px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontFamily: "var(--mono)",
              fontSize: 12.5,
              letterSpacing: "0.04em",
              color: "var(--ink-3)",
              marginBottom: 36,
            }}
          >
            Last updated: {updated}
          </p>
          <div className="legal">{children}</div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
