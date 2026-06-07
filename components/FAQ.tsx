"use client";

import { useState } from "react";
import { Section } from "./primitives";

const FAQS = [
  {
    q: "Is there a per-transaction fee on top of payments?",
    a: "No. We do not take a cut of your sales. You pay your payment gateway (M-Pesa, Pesapal, Paystack, or your card processor) their standard fees, and E-biz charges only the flat monthly subscription.",
  },
  {
    q: "Do I get my own dedicated server, and who manages it?",
    a: "You get your own dedicated server with its own database, with no shared hosting and no noisy neighbours. We fully manage it for you (uptime, backups, security, updates), and it's included in your monthly subscription, so there's no separate hosting bill and nothing for you to set up or maintain. You still own your data and can export it any time.",
  },
  {
    q: "Can I get email on my own domain?",
    a: "Yes. We can optionally set up professional email on your domain (like sales@yourbrand.com), included with your managed hosting. It's configured for deliverability with SPF, DKIM, and DMARC, so your order and marketing emails land in the inbox, not spam.",
  },
  {
    q: "How long does a launch take?",
    a: "Typically 2–4 weeks from contract signing to your first sale. Discovery + design takes 1–2 weeks; deployment, catalog migration, and training take another 1–2.",
  },
  {
    q: "Can I customize the storefront myself later?",
    a: "Absolutely. Your storefront can be restyled, extended, or completely replaced any time, and your admin dashboard keeps working either way. We'll make the changes for you, or your own team can.",
  },
  {
    q: "What if I outgrow the platform?",
    a: "You won't get locked in. Your store and all your data are yours to keep and export at any time, so you can take them elsewhere if you ever need to.",
  },
  {
    q: "Can I sell internationally?",
    a: "Yes. E-biz deploys globally. Shipping zones cover 194 countries and multi-currency is built in, so you can sell wherever your customers are.",
  },
];

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
