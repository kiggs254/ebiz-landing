The **Storefront API** is the public, customer-facing API that powers E-biz storefronts. Use it to build your own headless storefront (web, mobile, kiosk, or anything else) on top of an E-biz store: browse the catalog, manage a cart, check out, take payments, and run customer accounts.

It is separate from the [admin / external REST API](/docs/authentication). The admin API is authenticated with API keys and manages the store; the Storefront API is **public** and is what your shoppers' browsers talk to directly.

## Base URL

All storefront endpoints live under `/api/v1/storefront` on your store's backend host:

```text
https://your-store-api.example.com/api/v1/storefront
```

A legacy `/api/v1/store/*` prefix is also accepted for older bundles, but new integrations should use `/api/v1/storefront`.

## Authentication model

The Storefront API does **not** use API keys. There are two access levels:

| Access | How it works |
| --- | --- |
| Public | Catalog, content, search, and config endpoints are open. No auth needed. |
| Session | Cart, wishlist, checkout, and customer-account endpoints use a server-side **session cookie**. Guests get a session automatically; logging in attaches a customer to that session. |

The session cookie is set by the backend (`express-session`). Your storefront must send and accept cookies on every request, or the cart and login state will not persist.

```js
// Browser fetch: always include credentials so the session cookie travels.
const res = await fetch(`${API}/api/v1/storefront/cart`, {
  credentials: "include",
});
```

```js
// A small wrapper you can reuse across the storefront.
const API = process.env.NEXT_PUBLIC_API_URL; // e.g. https://your-store-api.example.com
async function sf(path, opts = {}) {
  const res = await fetch(`${API}/api/v1/storefront${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(opts.headers || {}) },
    ...opts,
  });
  const json = await res.json();
  if (!res.ok || json.status === "error") {
    throw new Error(json.message || `Request failed (${res.status})`);
  }
  return json.data;
}
```

Customer accounts use the same cookie. After `POST /storefront/auth/login`, the session carries the `customerId`; protected endpoints (anything under `/storefront/customer/*`, plus a few others) return `401` without it.

## CORS (read this first)

Because the storefront runs on a different origin from the API and relies on cookies, the backend only accepts requests from **allow-listed origins**. Before your storefront can talk to the API:

1. Add your storefront's origin (e.g. `https://shop.yourbrand.com`) to the backend's `CORS_ORIGIN` (comma-separated) and restart the backend.
2. Always send `credentials: "include"` from the browser. In production the session cookie is `SameSite=None; Secure`, so the storefront must be served over HTTPS.

Requests from origins that are not allow-listed are rejected by CORS.

## Response shape

Every endpoint returns the same envelope:

```json
{
  "status": "success",
  "data": { }
}
```

Errors use the same envelope with a message:

```json
{
  "status": "error",
  "message": "Product not found"
}
```

## Conventions

- **snake_case everywhere.** Query params and JSON bodies use snake_case (`category_slug`, `product_id`, `shipping_address`), which is different from the admin API.
- **Slugs, not IDs, for public lookups.** Single products and categories are fetched by `slug` (`GET /storefront/products/:slug`). A numeric id is also accepted as a fallback.
- **Only published products** are returned. Drafts and archived products never appear.
- **Pricing.** Products expose `price` and `sale_price`. When `sale_price` is set and lower than `price`, `sale_price` is the active price and `price` is the strike-through. Variants follow the same rule.
- **Availability.** Trust `stock_status` (`"instock"`, `"outofstock"`, `"onbackorder"`) rather than the raw `stock` count. Some imports leave `stock = 0` with `stock_status = "instock"`.
- **Images.** Live at `product.images[]`, each with `url`, `alt`, and `order` (sort ascending by `order`).
- **Multi-currency.** Read the store's base currency from `GET /storefront/settings` and the list of supported currencies + rates from `GET /storefront/currencies`.
- **Branches (optional).** If the branches addon is on, catalog and checkout endpoints accept an optional `branch_id`. If it is off, `branch_id` is ignored, so your storefront never has to send it.
- **Age-restricted products** carry `age_restricted: true` so you can gate them in the UI.

## Errors

| Status | Meaning |
| --- | --- |
| `400` | Bad request (missing/invalid fields) |
| `401` | Not authenticated (a `/customer/*` endpoint without a logged-in session) |
| `404` | Resource not found |
| `429` | Rate limited (e.g. loyalty OTP requests) |
| `500` | Server error |

## Where to go next

- [Catalog](/docs/storefront-catalog) - products, categories, brands, tags, currencies
- [Search & recommendations](/docs/storefront-search) - AI search and product recommendations
- [Cart](/docs/storefront-cart) - build and manage the cart
- [Checkout & payments](/docs/storefront-checkout) - shipping, coupons, orders, payments
- [Customer accounts](/docs/storefront-customers) - register, log in, profile, addresses, orders
- [Content & engagement](/docs/storefront-content) - reviews, wishlist, content, subscriptions, prescriptions
