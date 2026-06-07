// Single source of truth for the FAQ — rendered by FAQ.tsx and emitted as
// FAQPage structured data on the homepage for rich results.
export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
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
