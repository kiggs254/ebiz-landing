// Shared catalog of what E-biz does, used by the home Features teaser and the
// dedicated /features page. Plain data module (no "use client") so it can be
// imported by both server and client components. Copy is written for business
// owners, not developers.

export type Hue = { color: string; soft: string; ink: string };

export type AccentKey =
  | "orders"
  | "ai"
  | "branches"
  | "customers"
  | "storefront";

const hue = (color: string, soft: string, ink: string): Hue => ({ color, soft, ink });

export const CORE_FEATURES: Array<{
  title: string;
  body: string;
  visual: AccentKey;
  hue: Hue;
}> = [
  {
    title: "Real-time order desk",
    body: "Every order lands in one place the moment it's placed. Update status, add notes, send invoices, and track delivery, without switching tabs or refreshing.",
    visual: "orders",
    hue: hue("var(--accent)", "var(--accent-soft)", "var(--accent-ink)"),
  },
  {
    title: "AI product catalog",
    body: "Write product descriptions, SEO text, and category blurbs in seconds. Spend less time typing and more time selling.",
    visual: "ai",
    hue: hue("var(--violet)", "var(--violet-soft)", "var(--violet-ink)"),
  },
  {
    title: "Stock across locations",
    body: "Track stock, prices, and payment options for every shop or warehouse. Move products between locations without spreadsheets.",
    visual: "branches",
    hue: hue("var(--blue)", "var(--blue-soft)", "var(--blue-ink)"),
  },
  {
    title: "Customers & loyalty",
    body: "Know your customers, their order history, addresses, and segments, and bring them back with reward points that work right at checkout.",
    visual: "customers",
    hue: hue("var(--pink)", "var(--pink-soft)", "var(--pink-ink)"),
  },
  {
    title: "Your own storefront",
    body: "A fast, beautiful online store designed around your brand, with live search, wishlists, and SEO ready to go from day one.",
    visual: "storefront",
    hue: hue("var(--teal)", "var(--teal-soft)", "var(--teal-ink)"),
  },
];

export const CATEGORIES: Array<{
  id: string;
  label: string;
  blurb: string;
  color: string;
  soft: string;
  ink: string;
}> = [
  { id: "ops", label: "Operations", blurb: "Run the day-to-day.", color: "var(--blue)", soft: "var(--blue-soft)", ink: "var(--blue-ink)" },
  { id: "catalog", label: "Catalog", blurb: "Merchandise your products.", color: "var(--violet)", soft: "var(--violet-soft)", ink: "var(--violet-ink)" },
  { id: "growth", label: "Marketing & Growth", blurb: "Bring customers back.", color: "var(--accent)", soft: "var(--accent-soft)", ink: "var(--accent-ink)" },
  { id: "messaging", label: "Messaging", blurb: "Meet customers on WhatsApp.", color: "var(--green)", soft: "var(--green-soft)", ink: "var(--green-ink)" },
  { id: "ai", label: "AI", blurb: "Let AI do the busywork.", color: "var(--pink)", soft: "var(--pink-soft)", ink: "var(--pink-ink)" },
  { id: "integrations", label: "Integrations & data", blurb: "Connect and migrate.", color: "var(--teal)", soft: "var(--teal-soft)", ink: "var(--teal-ink)" },
];

export const ADDONS: Array<{ name: string; desc: string; cat: string; icon: string }> = [
  // Operations
  { name: "Multi-Branch", desc: "Run several shops or warehouses from one account, each with its own stock, prices, and payment options.", cat: "ops", icon: "branch" },
  { name: "Subscriptions", desc: "Sell recurring orders like weekly boxes or monthly plans, with automatic reminders by email and WhatsApp.", cat: "ops", icon: "repeat" },
  { name: "Stock Management", desc: "Always know what's in stock, get low-stock alerts, and let customers back-order when you run out.", cat: "ops", icon: "box" },
  { name: "Taxes", desc: "Apply the right tax automatically by location and product, shown the way your customers expect.", cat: "ops", icon: "percent" },
  { name: "Distance Shipping", desc: "Charge delivery based on distance so shipping prices are always fair and accurate.", cat: "ops", icon: "truck" },

  // Catalog
  { name: "Brands", desc: "Organize products by brand, with dedicated brand pages and filters shoppers can browse.", cat: "catalog", icon: "tag" },
  { name: "Reviews", desc: "Collect customer reviews and approve them before they go live. It's the social proof that sells.", cat: "catalog", icon: "chat" },
  { name: "Ratings", desc: "Show star ratings and averages on every product to build trust at a glance.", cat: "catalog", icon: "star" },
  { name: "Multi-Currency", desc: "Let customers shop and pay in their own currency, with exchange rates that update automatically.", cat: "catalog", icon: "coin" },

  // Marketing & Growth
  { name: "Loyalty Points", desc: "Reward repeat customers with points they earn and redeem at checkout, verified by one-time code.", cat: "growth", icon: "gift" },
  { name: "Marketing Automation", desc: "Win back abandoned carts, request reviews, and send follow-ups, all automatically.", cat: "growth", icon: "megaphone" },
  { name: "Google Tag Manager", desc: "Measure sales and conversions and plug in your marketing pixels, with no code changes.", cat: "growth", icon: "target" },

  // Messaging
  { name: "WhatsApp", desc: "Send order updates, reminders, and confirmations straight to customers on WhatsApp.", cat: "messaging", icon: "bubble" },
  { name: "WhatsApp Storefront", desc: "Let customers browse your catalog, order, and pay without ever leaving WhatsApp.", cat: "messaging", icon: "bag" },

  // AI
  { name: "AI Catalog", desc: "Generate product descriptions, SEO copy, and category blurbs in seconds.", cat: "ai", icon: "sparkles" },
  { name: "AI Search", desc: "Help shoppers find exactly what they want with smart search and personalized recommendations.", cat: "ai", icon: "search" },
  { name: "AI Images", desc: "Create and clean up product photos automatically. Studio quality, without the studio.", cat: "ai", icon: "image" },

  // Integrations & data
  { name: "REST API + Webhooks", desc: "Connect E-biz to the other tools you use and automate the busywork.", cat: "integrations", icon: "code" },
  { name: "WooCommerce Migration", desc: "Moving from WooCommerce? Bring your products, customers, and orders across in bulk.", cat: "integrations", icon: "download" },
  { name: "Prescriptions", desc: "For pharmacies: collect, verify, and track prescriptions right at checkout.", cat: "integrations", icon: "medical" },
];
