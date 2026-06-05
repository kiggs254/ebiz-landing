import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE_URL = "https://e-biz.co.ke";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "E-biz — The headless commerce platform for modern brands",
    template: "%s · E-biz",
  },
  description:
    "E-biz is a headless e-commerce platform for modern retailers. Sell online, in-store, and on WhatsApp — with M-Pesa, Pesapal, Paystack, cards, bank transfer, and cash built in. One calm dashboard for your whole operation, shippable to 194 countries.",
  keywords: [
    "E-biz",
    "headless commerce",
    "e-commerce platform",
    "online store builder",
    "WhatsApp commerce",
    "multi-branch inventory",
    "multi-currency store",
    "M-Pesa integration",
    "Pesapal integration",
    "Paystack",
    "Shopify alternative",
    "WooCommerce alternative",
    "REST API e-commerce",
  ],
  authors: [{ name: "E-biz", url: SITE_URL }],
  creator: "E-biz",
  publisher: "E-biz",
  applicationName: "E-biz",
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "E-biz",
    title: "E-biz — The headless commerce platform for modern brands",
    description:
      "Sell online, in-store, on WhatsApp — with M-Pesa, Pesapal, Paystack, cards, bank, and cash built in. The commerce command center for modern retail.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "E-biz — The headless commerce platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "E-biz — The headless commerce platform for modern brands",
    description:
      "Sell online, in-store, on WhatsApp — every way your customers pay. One calm dashboard for your whole business.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: { canonical: SITE_URL },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E0C" },
  ],
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "E-biz",
  url: SITE_URL,
  logo: `${SITE_URL}/favicon.svg`,
  description:
    "Headless e-commerce platform for modern retailers — sell online, in-store, and on WhatsApp.",
  email: "hello@e-biz.co.ke",
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "E-biz",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "A headless e-commerce platform with M-Pesa, Pesapal, Paystack, cards, bank transfer and Cash on Delivery built in. 20+ toggleable addons including multi-branch inventory, multi-currency, AI catalog, loyalty, subscriptions, REST API and WhatsApp commerce.",
  offers: [
    {
      "@type": "Offer",
      name: "Basic",
      price: "23",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "23",
        priceCurrency: "USD",
        unitText: "MONTH",
      },
    },
    {
      "@type": "Offer",
      name: "Full Addons",
      price: "38",
      priceCurrency: "USD",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "38",
        priceCurrency: "USD",
        unitText: "MONTH",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
