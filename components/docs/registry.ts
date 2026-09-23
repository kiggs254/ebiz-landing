// Navigation + page registry for the API docs portal.
// Each slug maps to content/docs/<slug>.md.

export type DocItem = { slug: string; title: string };
export type DocGroup = { label: string; items: DocItem[] };

export const DOC_GROUPS: DocGroup[] = [
  {
    label: "Getting started",
    items: [
      { slug: "authentication", title: "Authentication" },
      { slug: "api-keys", title: "API keys & rate limits" },
      { slug: "base-url", title: "Base URL & versioning" },
      { slug: "errors", title: "Errors & status codes" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { slug: "products", title: "Products" },
      { slug: "variable-products", title: "Variable products" },
      { slug: "categories", title: "Categories" },
      { slug: "brands", title: "Brands" },
      { slug: "attributes-tags", title: "Attributes & tags" },
      { slug: "reviews", title: "Reviews" },
      { slug: "media", title: "Media library" },
      { slug: "catalog-feed", title: "Catalog feed" },
    ],
  },
  {
    label: "Orders & customers",
    items: [
      { slug: "orders", title: "Orders" },
      { slug: "customers", title: "Customers" },
      { slug: "branches", title: "Branches" },
      { slug: "shipping", title: "Shipping" },
    ],
  },
  {
    label: "Marketing & loyalty",
    items: [
      { slug: "marketing", title: "Marketing & loyalty" },
    ],
  },
  {
    label: "Store admin",
    items: [
      { slug: "settings", title: "Store settings" },
      { slug: "appearance", title: "Appearance & themes" },
      { slug: "admin-users", title: "Staff users & roles" },
      { slug: "analytics", title: "Analytics & transactions" },
      { slug: "plugins", title: "Plugins" },
      { slug: "push-notifications", title: "Push notifications" },
      { slug: "ai-assistant", title: "AI assistant" },
    ],
  },
  {
    label: "Addons",
    items: [
      { slug: "reservations", title: "Reservations" },
      { slug: "subscriptions", title: "Subscriptions" },
      { slug: "prescriptions", title: "Prescriptions" },
      { slug: "riders", title: "Riders & tracking" },
      { slug: "affiliates", title: "Affiliates" },
      { slug: "distributors", title: "Distributors" },
      { slug: "whatsapp", title: "WhatsApp" },
      { slug: "whatsapp-storefront", title: "WhatsApp Storefront" },
      { slug: "ai-search", title: "AI search" },
      { slug: "ai-image", title: "AI images" },
      { slug: "blog", title: "Blog" },
    ],
  },
  {
    label: "Realtime & events",
    items: [
      { slug: "webhooks", title: "Webhooks" },
      { slug: "websockets", title: "WebSocket realtime" },
    ],
  },
  {
    label: "Storefront API",
    items: [
      { slug: "storefront", title: "Overview" },
      { slug: "storefront-catalog", title: "Catalog & discovery" },
      { slug: "storefront-search", title: "AI search & recommendations" },
      { slug: "storefront-cart", title: "Cart & wishlist" },
      { slug: "storefront-checkout", title: "Checkout & payments" },
      { slug: "storefront-customers", title: "Customer accounts" },
      { slug: "storefront-content", title: "Content & engagement" },
      { slug: "storefront-reservations", title: "Table reservations" },
    ],
  },
  {
    label: "Guides",
    items: [
      { slug: "woocommerce", title: "WooCommerce compatibility" },
      { slug: "code-examples", title: "Code examples" },
      { slug: "operation-logs", title: "Operation logs & undo" },
      { slug: "quick-reference", title: "Quick reference" },
    ],
  },
];

export const ALL_DOCS: DocItem[] = DOC_GROUPS.flatMap((g) => g.items);

export function findDoc(slug: string): DocItem | undefined {
  return ALL_DOCS.find((d) => d.slug === slug);
}

export function adjacentDocs(slug: string): {
  prev: DocItem | null;
  next: DocItem | null;
} {
  const i = ALL_DOCS.findIndex((d) => d.slug === slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? ALL_DOCS[i - 1] : null,
    next: i < ALL_DOCS.length - 1 ? ALL_DOCS[i + 1] : null,
  };
}
