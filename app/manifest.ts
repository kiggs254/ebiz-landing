import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "E-biz Ecommerce Management System",
    short_name: "E-biz",
    description:
      "Sell online, in-store, and on WhatsApp. The commerce command center for modern brands, with M-Pesa, Pesapal, Paystack, cards, and cash built in.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAFAF7",
    theme_color: "#D6724D",
    icons: [
      { src: "/favicon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
