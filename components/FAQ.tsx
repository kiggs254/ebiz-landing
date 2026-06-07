"use client";

import { useState } from "react";
import { Section } from "./primitives";
import { FAQS } from "./faqData";

const FAQItem = ({
  q,
  a,
  open,
  onToggle,
  index,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
  index: number;
}) => (
  <div
    style={{
      borderBottom: "1px solid var(--line-softer)",
    }}
  >
    <button
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`faq-panel-${index}`}
      id={`faq-trigger-${index}`}
      style={{
        width: "100%",
        padding: "24px 0",
        background: "transparent",
        border: "none",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 24,
        color: "inherit",
      }}
    >
      <span
        style={{
          fontFamily: "var(--serif)",
          fontSize: 22,
          letterSpacing: "-0.01em",
          textWrap: "balance",
        }}
      >
        {q}
      </span>
      <span
        aria-hidden
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid var(--line-soft)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0,
          transform: open ? "rotate(45deg)" : "rotate(0)",
          transition: "transform .2s ease",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1v10M1 6h10"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </button>
    <div
      id={`faq-panel-${index}`}
      role="region"
      aria-labelledby={`faq-trigger-${index}`}
      style={{
        maxHeight: open ? 240 : 0,
        overflow: "hidden",
        transition: "max-height .25s ease, padding .25s ease",
        paddingBottom: open ? 24 : 0,
      }}
    >
      <p
        style={{
          margin: 0,
          color: "var(--ink-3)",
          fontSize: 15,
          lineHeight: 1.6,
          maxWidth: "64ch",
          textWrap: "pretty",
        }}
      >
        {a}
      </p>
    </div>
  </div>
);

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <Section id="faq" ariaLabel="Frequently asked questions">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div
        className="faq-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1.5fr",
          gap: 64,
          alignItems: "flex-start",
        }}
      >
        <div className="faq-aside" style={{ position: "sticky", top: 96 }}>
          <span className="eyebrow">FAQ</span>
          <h2 className="section-title">
            Questions,
            <br />
            <em>answered.</em>
          </h2>
          <p className="section-lede">
            Still curious? Drop us a line at{" "}
            <a
              href="mailto:hello@e-biz.co.ke"
              style={{
                color: "var(--accent-ink)",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              hello@e-biz.co.ke
            </a>
            .
          </p>
        </div>
        <div>
          {FAQS.map((f, i) => (
            <FAQItem
              key={i}
              index={i}
              q={f.q}
              a={f.a}
              open={open === i}
              onToggle={() => setOpen(open === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}
