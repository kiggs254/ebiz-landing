---
title: Storefront - Content
description: Reviews, wishlist, subscriptions, store content and config endpoints
---

Everything else a storefront needs: reviews, wishlist, subscriptions, prescriptions, store content and config, marketing, and the contact form. Most are public; a few use the session cookie or require login (noted per endpoint).

## Reviews

### GET /storefront/reviews - List approved reviews

Public. Returns approved reviews, optionally for one product.

| Query param | Type | Description |
| --- | --- | --- |
| `product_id` | number | Optional, filter to one product |
| `limit` | number | Default `10`, max `50` |

### GET /storefront/reviews/by-ids - Reviews by ID

Public. Returns approved reviews for a comma-separated `ids` list, preserving order.

### POST /storefront/reviews - Submit a review

Public (guest or logged in). New reviews start as `pending` and appear once an admin approves them. Guests must supply an `email`.

| Body field | Type | Description |
| --- | --- | --- |
| `product_id` | number | Required |
| `rating` | number | Required, 1-5 |
| `title`, `comment` | string | Optional |
| `email`, `first_name`, `last_name` | string | Required for guests |

## Wishlist

Session-based, same as the cart (guest via session, customer when logged in).

### GET /storefront/wishlist - Get the wishlist

### POST /storefront/wishlist - Add a product

```json
{ "product_id": 412 }
```

### DELETE /storefront/wishlist/:productId - Remove a product

### POST /storefront/wishlist/merge - Merge guest wishlist on login

Requires auth. Folds the guest session's wishlist into the customer's.

### POST /storefront/wishlist/share - Create a share link

Requires auth. Returns a `token` for a public, read-only wishlist link.

```json
{ "status": "success", "data": { "token": "ab12cd..." } }
```

### GET /storefront/wishlist/shared/:token - View a shared wishlist

Public. Returns the items for a shared wishlist token.

## Subscriptions

Part of the subscriptions addon (hidden in your UI when `subscriptions_addon_enabled` is off).

### GET /storefront/subscription-packages - List packages

Public. Returns active subscription packages with their items and product details.

### POST /storefront/subscription-signup - Sign up for a subscription

Public. Finds or creates the customer, creates a pending subscription, saves the delivery address, and returns a Pesapal `payment_link` to complete signup.

| Body field | Type | Description |
| --- | --- | --- |
| `package_id` | number | Required |
| `email` | string | Required |
| `first_name`, `last_name`, `phone` | string | Customer details |
| `shipping_address` | object | `{ address_1, city, state, country, postal_code }` |
| `preferred_delivery_day` | number | 1 = Monday .. 7 = Sunday |
| `item_selections` | array | Optional `{ product_id, variant_id }` choices |

```json
{ "status": "success", "data": { "subscription": { "id": 9 }, "payment_link": "https://pay.pesapal.com/..." } }
```

### GET /storefront/subscriptions/:id/summary - Subscription summary

Requires auth (and ownership). Returns the schedule and pricing summary for one subscription.

## Prescriptions

Part of the prescriptions/pharmacy addon. Disabled endpoints return a clear `400`.

### POST /storefront/prescriptions/upload - Upload a prescription

Public (guest or logged in), `multipart/form-data` with a `file` (PDF or image) plus `customer_name` and a `customer_email` or `customer_phone`. Returns the new prescription (status `pending`) for review.

### GET /storefront/prescriptions/check-cart - Which items need a prescription

Public. Pass `product_ids` (comma-separated) and get back whether any require a prescription, and which.

```json
{ "status": "success", "data": { "required": true, "products": [{ "id": 77, "name": "Amoxicillin 500mg", "slug": "..." }] } }
```

### GET /storefront/prescriptions/mine - My prescriptions

Requires auth. Lists the logged-in customer's prescriptions and their status/refills.

At checkout, pass valid `prescription_ids` to [`create-order`](/docs/storefront-checkout#post-storefront-checkout-create-order) for any items that require one.

## Store Content & Config

All public. Use these to render the store's chrome, theme, and pages.

### GET /storefront/test - Test endpoint

Verifies that storefront routes are operational. Use this as a healthcheck for storefront API availability.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/test"
```

```json
{
  "status": "success",
  "message": "Storefront routes are working"
}
```

### GET /storefront/settings - Get shop settings

Returns all public shop settings needed by the storefront, including store details, SEO, social links, feature addon toggles, custom scripts, and custom order statuses. Secrets and internal settings are omitted.

**Auth:** Public

```bash
curl "https://your-store-api.example.com/api/v1/storefront/settings"
```

```json
{
  "status": "success",
  "data": {
    "settings": {
      "shop_name": "My Store",
      "shop_description": "Welcome to our online store",
      "shop_email": "support@example.com",
      "shop_phone": "+254 712 345 678",
      "currency": "KES",
      "currency_symbol_position": "before",
      "storefront_url": "https://shop.example.com",
      "out_of_stock_visibility": "visible",
      "branches_enabled": "true",
      "branches_pricing_enabled": "false",
      "seo_site_title": "My Store - Shop Online",
      "seo_meta_description": "Shop our collection online",
      "social_facebook": "https://facebook.com/mystore",
      "social_instagram": "https://instagram.com/mystore",
      "subscriptions_addon_enabled": "true",
      "brands_enabled": "true",
      "gtm_enabled": "false"
    },
    "order_statuses": [
      { "id": "pending", "label": "Pending" },
      { "id": "processing", "label": "Processing" },
      { "id": "shipped", "label": "Shipped" },
      { "id": "delivered", "label": "Delivered" }
    ]
  }
}
```

**Gotchas:**

- All setting values are strings (including booleans like "true" or "false"); parse them in your storefront
- `order_statuses` is the shop's custom order status flow, not a static list; use it to build progress trackers
- Secrets (API keys, payment credentials) are never returned
- `branches_*` settings tell storefronts how to treat multi-branch pricing, availability, and ordering

### GET /storefront/theme - Get active theme

Returns the currently active theme configuration. Used by the storefront to load the correct theme styling and customization settings.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/theme"
```

```json
{
  "status": "success",
  "data": {
    "theme": {
      "id": 1,
      "name": "Minimal",
      "colors": {
        "primary": "#000000",
        "secondary": "#ffffff"
      }
    }
  }
}
```

### GET /storefront/banners - Get active banners

Returns currently active promotional banners. Banners are automatically filtered by their active time window (start_date and end_date). Optionally filter by position (e.g., 'hero', 'middle', 'bottom').

| Query Param | Type | Description |
| --- | --- | --- |
| `position` | string | Optional banner position filter (hero, middle, bottom, etc.) |

```bash
curl "https://your-store-api.example.com/api/v1/storefront/banners?position=hero"
```

```json
{
  "status": "success",
  "data": {
    "banners": [
      {
        "id": 1,
        "title": "Summer Sale",
        "position": "hero",
        "image_url": "https://cdn.example.com/banner-summer.jpg",
        "link": "/collections/summer",
        "start_date": "2026-06-01",
        "end_date": "2026-08-31"
      }
    ]
  }
}
```

**Gotchas:**

- Only active banners (within their time window) are returned
- `position` filter is case-insensitive and prefix-matched (e.g., 'hero' matches 'hero_main' and 'heroBig')
- Omit position for all active banners

### GET /storefront/menus - Get storefront menus

Retrieve navigation menus keyed by position (header, footer columns, footer bottom). Each menu contains items (and items can have children).

```bash
curl "https://your-store-api.example.com/api/v1/storefront/menus"
```

```json
{
  "status": "success",
  "data": {
    "menus": {
      "header_after_categories": {
        "id": 5,
        "name": "Header Nav",
        "status": "active",
        "items": [
          {
            "id": 11,
            "name": "About Us",
            "url": "/about",
            "order": 0,
            "children": []
          },
          {
            "id": 12,
            "name": "Support",
            "url": "#",
            "order": 1,
            "children": [
              {
                "id": 13,
                "name": "Contact",
                "url": "/contact",
                "order": 0
              },
              {
                "id": 14,
                "name": "FAQ",
                "url": "/faq",
                "order": 1
              }
            ]
          }
        ]
      },
      "footer_col1": {
        "id": 6,
        "name": "Footer Column 1",
        "status": "active",
        "items": [
          {
            "id": 15,
            "name": "Shipping Info",
            "url": "/shipping",
            "order": 0,
            "children": []
          }
        ]
      },
      "footer_col2": null,
      "footer_col3": null,
      "footer_bottom": null
    }
  }
}
```

Menu positions can be `null` if no menu is assigned. Items are ordered by the `order` field within their parent. Use this to render header and footer navigation trees.

### GET /storefront/homepage-sections - Get homepage section configuration

Returns the configured homepage sections that define how the storefront's homepage is laid out (e.g., hero banner, categories grid, featured products carousel, best sellers, testimonials, etc.). Returns default sections if none have been customized.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/homepage-sections"
```

```json
{
  "status": "success",
  "data": {
    "sections": [
      {
        "id": "hero",
        "type": "hero",
        "enabled": true,
        "title": null,
        "subtitle": null,
        "layout": null,
        "config": null
      },
      {
        "id": "categories",
        "type": "categories",
        "enabled": true,
        "title": "Shop by Category",
        "subtitle": "Collections",
        "layout": "grid",
        "config": {
          "category_ids": [],
          "limit": 12,
          "visible_count": 6
        }
      },
      {
        "id": "featured_products",
        "type": "products",
        "enabled": true,
        "title": "Featured Products",
        "subtitle": "Discover our handpicked selection",
        "layout": "carousel",
        "config": {
          "source": "manual",
          "product_ids": [1, 2, 3],
          "sort": "newest",
          "limit": 6,
          "visible_count": 6
        }
      }
    ]
  }
}
```

**Gotchas:**

- Only enabled sections should be rendered
- `config` schema varies by section type (products, categories, testimonials, etc.)
- Empty lists (e.g., `product_ids: []`) mean "auto-select" based on the source (best_sellers, latest, etc.)
- If settings have never been customized, default sections are returned (hero, categories, featured, brands, best sellers, testimonials)

### GET /storefront/custom-scripts - Get custom scripts

Returns all custom script snippets configured for the storefront (Google Analytics, pixel trackers, etc.).

```bash
curl "https://your-store-api.example.com/api/v1/storefront/custom-scripts"
```

```json
{
  "status": "success",
  "data": {
    "scripts": {
      "custom_scripts_head": "<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">",
      "custom_scripts_body_start": "<!-- Google Tag Manager (noscript) -->...",
      "custom_scripts_body_end": "<script>gtag('event', 'page_view');</script>"
    }
  }
}
```

Inject these into your HTML in the corresponding locations (between `<head>` tags, after `<body>` opens, before `</body>` closes).

### GET /storefront/blogs - List blog posts

Returns all published blog posts for the storefront. Same data as the legacy `/storefront/recipes` endpoint, which is deprecated.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/blogs"
```

```json
{
  "status": "success",
  "data": {
    "blogs": [
      {
        "id": 3,
        "title": "5 Tips for Organic Gardening",
        "slug": "5-tips-organic-gardening",
        "content": "<p>Composting is the foundation of organic gardening...</p>",
        "excerpt": "Learn the basics of composting and soil health.",
        "image_url": "https://cdn.example.com/blog-5-tips.jpg",
        "published_at": "2026-03-15T10:00:00.000Z"
      }
    ]
  }
}
```

Blogs are ordered by publish date (newest first). Use this to render a blog listing page.

### GET /storefront/blogs/:slug - Get blog post by slug

Fetch a single blog post by its slug.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/blogs/5-tips-organic-gardening"
```

```json
{
  "status": "success",
  "data": {
    "blog": {
      "id": 3,
      "title": "5 Tips for Organic Gardening",
      "slug": "5-tips-organic-gardening",
      "content": "<p>Composting is the foundation of organic gardening...</p>",
      "excerpt": "Learn the basics of composting and soil health.",
      "image_url": "https://cdn.example.com/blog-5-tips.jpg",
      "published_at": "2026-03-15T10:00:00.000Z"
    }
  }
}
```

Returns `404` if the blog post does not exist or is not published.

### GET /storefront/recipes - List recipes (deprecated, use /blogs)

Legacy endpoint. Use `GET /storefront/blogs` instead.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/recipes"
```

Returns the same data as `/storefront/blogs` but with `{ "recipes": [...] }` wrapper instead of `{ "blogs": [...] }`.

### GET /storefront/faqs - List FAQs

Returns frequently asked questions configured on the storefront.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/faqs"
```

```json
{
  "status": "success",
  "data": {
    "faqs": [
      {
        "id": 1,
        "question": "What is your return policy?",
        "answer": "We accept returns within 30 days of purchase...",
        "order": 0
      },
      {
        "id": 2,
        "question": "Do you ship internationally?",
        "answer": "Yes, we ship to over 50 countries...",
        "order": 1
      }
    ]
  }
}
```

FAQ items are ordered by the `order` field (lowest first). Use this to render a FAQ accordion or list.

### GET /storefront/store-locator - Get store locator config

Returns store locations, map settings, and branch information when the branches addon is enabled.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/store-locator"
```

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "googleMapsApiKey": "AIzaSyDxA...",
    "stores": [
      {
        "id": "1",
        "name": "Nairobi Branch",
        "address": "123 Main Street",
        "city": "Nairobi",
        "lat": -1.2842,
        "lng": 36.8172,
        "phone": "+254700000002"
      },
      {
        "id": "2",
        "name": "Mombasa Branch",
        "address": "456 Coast Road",
        "city": "Mombasa",
        "lat": -4.0435,
        "lng": 39.6682,
        "phone": "+254700000011"
      }
    ]
  }
}
```

When the branches addon is off, `stores` comes from the static store-locator settings. When the addon is on, `stores` is built from active branches. Use `googleMapsApiKey` to initialize a Google Map with the store locations.

### GET /storefront/attributes - Get product attributes

Returns product attributes that can be used as filters on the storefront. Pass `?filterable=true` to get only attributes marked for filter UI. Attributes are sorted by filter order then name.

| Query Param | Type | Description |
| --- | --- | --- |
| `filterable` | boolean | When true, returns only attributes marked filterable in Settings → Product Attributes |

```bash
curl "https://your-store-api.example.com/api/v1/storefront/attributes?filterable=true"
```

```json
{
  "status": "success",
  "data": {
    "attributes": [
      {
        "id": 1,
        "name": "Color",
        "slug": "color",
        "is_filterable": true,
        "filter_sort_order": 1
      },
      {
        "id": 2,
        "name": "Size",
        "slug": "size",
        "is_filterable": true,
        "filter_sort_order": 2
      }
    ]
  }
}
```

**Gotchas:**

- `filter_sort_order` controls the order filters appear in the storefront UI; items with the same order are sorted by name
- This is separate from attribute *values* (which come via `GET /storefront/products?include=attributes`)

### GET /storefront/sitemap/products - Get products for sitemap

Paginated endpoint that returns published products for XML sitemap generation. Respects Product Settings → "Out of Stock Visibility" and catalog_visibility (shows only 'visible' and 'catalog' products). Use pagination for large catalogs.

| Query Param | Type | Default | Max | Description |
| --- | --- | --- | --- | --- |
| `page` | integer | 1 | — | Page number |
| `limit` | integer | 1000 | 5000 | Items per page |

```bash
curl "https://your-store-api.example.com/api/v1/storefront/sitemap/products?page=1&limit=1000"
```

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "slug": "organic-flour-1kg",
        "updated_at": "2026-09-15T10:30:00Z"
      },
      {
        "slug": "rice-basmati-2kg",
        "updated_at": "2026-09-14T14:20:00Z"
      }
    ],
    "total": 156,
    "page": 1,
    "limit": 1000
  }
}
```

**Gotchas:**

- Hidden products (catalog_visibility=hidden) are never returned
- Out-of-stock products are excluded when the setting is enabled
- Use slug for sitemap URLs; it's the stable identifier (products can be looked up by slug or numeric ID)

### GET /storefront/sitemap.xml - Get XML sitemap

Generates a complete XML sitemap for Google Search Console including products, categories, pages, and blog posts. Cached for 1 hour. Respects Out of Stock Visibility and catalog_visibility settings.

| Query Param | Type | Description |
| --- | --- | --- |
| `storefront_url` | string | Optional override for the sitemap base URL (for testing) |
| `site_url` | string | Alternative optional override for base URL |

```bash
curl -H "Accept: application/xml" \
  "https://your-store-api.example.com/api/v1/storefront/sitemap.xml"
```

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://shop.example.com</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://shop.example.com/products</loc>
    <lastmod>2026-09-23</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://shop.example.com/products/organic-flour-1kg</loc>
    <lastmod>2026-09-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... more URLs -->
</urlset>
```

**Gotchas:**

- Base URL resolution order: query param > shop setting (storefront_url/site_url) > env var > request host
- Return type is `application/xml`, not JSON
- Cached for 3600 seconds (1 hour); changes to product timestamps or settings don't appear immediately
- Use in your `robots.txt` or submit directly to Google Search Console

### GET /storefront/pages - List published pages

Retrieve all published pages for use in storefront navigation, footers, and menus. Pages are returned in alphabetical order by title.

```bash
curl https://your-store-api.example.com/api/v1/storefront/pages
```

```json
{
  "status": "success",
  "data": {
    "pages": [
      {
        "id": 1,
        "title": "About Us",
        "slug": "about-us",
        "content": "<h2>Our Story</h2><p>Founded in 2020...</p>",
        "status": "published",
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-03-10T14:30:00Z"
      },
      {
        "id": 2,
        "title": "Contact",
        "slug": "contact",
        "content": "<p>Reach out to us...</p>",
        "status": "published",
        "created_at": "2024-01-20T10:00:00Z",
        "updated_at": "2024-02-05T09:15:00Z"
      },
      {
        "id": 3,
        "title": "Shipping & Returns",
        "slug": "shipping-returns",
        "content": "<h2>Our Shipping Policy</h2>...",
        "status": "published",
        "created_at": "2024-02-01T10:00:00Z",
        "updated_at": "2024-03-12T11:45:00Z"
      }
    ]
  }
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique page identifier |
| title | string | Page title (used in menus) |
| slug | string | URL-friendly identifier |
| content | string | HTML or markdown page content |
| status | string | Publication status (published/draft/archived) |
| created_at | string (ISO 8601) | When the page was created |
| updated_at | string (ISO 8601) | When the page was last updated |

**Notes:**

- Only pages with status "published" are returned
- Draft and archived pages are hidden from the storefront
- Call this endpoint once at storefront boot to populate navigation menus
- Cache the results for performance (invalidate when the admin updates pages)

### GET /storefront/pages/:slug - Get page by slug

Fetch a specific published page by its slug (URL identifier). The endpoint is tolerant of leading/trailing slashes and case variations to prevent 404s.

```bash
curl https://your-store-api.example.com/api/v1/storefront/pages/about-us
```

```json
{
  "status": "success",
  "data": {
    "page": {
      "id": 1,
      "title": "About Us",
      "slug": "about-us",
      "content": "<h2>Our Story</h2><p>We are a family-owned business founded in 2020. Our mission is to provide high-quality products at fair prices...</p>",
      "status": "published",
      "created_at": "2024-01-15T10:00:00Z",
      "updated_at": "2024-03-10T14:30:00Z"
    }
  }
}
```

**Path parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| slug | string | Yes | URL-friendly page identifier (e.g., "about-us", "shipping-returns") |

**Slug matching:**

- Matching is case-sensitive
- The endpoint tolerates leading/trailing slashes: "about", "/about", "about/", "/about/" all resolve to the same page
- Trailing slash handling: if the slug is stored as "about-us" in the database, requests for "about-us/" will still match

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| id | integer | Unique page identifier |
| title | string | Page title |
| slug | string | URL-friendly identifier |
| content | string | HTML or markdown content (ready for rendering) |
| status | string | Publication status |
| created_at | string (ISO 8601) | Creation timestamp |
| updated_at | string (ISO 8601) | Last update timestamp |

**Error responses:**

```json
{
  "status": "error",
  "message": "Page not found"
}
```

**Notes:**

- Returns 404 if the page does not exist or is not published
- Returns 400 if slug is empty or missing
- Content is returned as-is (HTML/markdown); storefront must render it appropriately
- Use this endpoint to load individual pages when users navigate to a page URL

### GET /storefront/shipping/areas - Get shipping areas

Returns the area/drop-point tree for an address, so checkout can offer a destination picker (when the store uses a courier with named drop points).

| Query param | Type | Required | Description |
| --- | --- | --- | --- |
| `country` | string | Yes | Country code or name |
| `state` | string | No | State/province |

```bash
curl "https://your-store-api.example.com/api/v1/storefront/shipping/areas?country=Kenya&state=Nairobi"
```

```json
{
  "status": "success",
  "data": {
    "areas": [
      {
        "id": 101,
        "name": "Central Nairobi",
        "children": [
          {
            "id": 102,
            "name": "Bogani Road",
            "children": []
          },
          {
            "id": 103,
            "name": "Westlands",
            "children": []
          }
        ]
      },
      {
        "id": 104,
        "name": "Suburbs",
        "children": []
      }
    ]
  }
}
```

When the store prices by zones alone (flat-rate shipping), `areas` is empty — the storefront should skip offering a drop-point picker. When a courier uses named drop points, you render this tree as a hierarchical selector so the customer can name their destination before you call [`/checkout/calculate-shipping`](/docs/storefront-checkout#post-storefront-checkout-calculate-shipping).

**Errors:**
- `400` if `country` is missing

### GET /storefront/debug/routes - List registered storefront routes

Debug endpoint that returns all HTTP methods and paths registered on the storefront router. Intended for internal diagnostics and integration testing.

```bash
curl https://your-store-api.example.com/api/v1/storefront/debug/routes
```

```json
{
  "status": "success",
  "routes": [
    "GET /products",
    "GET /products/:id",
    "POST /products/:id/reviews",
    "GET /categories",
    "GET /categories/:slug",
    "GET /checkout/shipping-quote",
    "POST /checkout/payment",
    "GET /customer/profile",
    "PUT /customer/profile",
    "GET /customer/orders",
    "GET /pages",
    "GET /pages/:slug",
    "POST /contact",
    "GET /cart",
    "POST /cart/add",
    "DELETE /cart/clear"
  ]
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| status | string | Always "success" |
| routes | array of strings | List of routes in format "METHOD /path" |

**Use cases:**

- Verify that all expected endpoints are registered during deployment
- Debugging storefront routing issues
- Documenting the live API surface without manual sync
- Integration tests: confirm available endpoints at runtime

**Notes:**

- Route parameters are shown as colon-style identifiers (`:id`, `:slug`) matching Express convention
- This is a diagnostic endpoint; do not rely on it for production client behavior
- The route list reflects the current Express router state and includes all mounted handlers

## Marketing

### POST /storefront/marketing/abandoned-carts - Track an abandoned cart

Public. Upserts an abandoned-cart record (by `email`/`phone`) so the store can send recovery emails. Send it from your checkout when a shopper enters contact details but does not complete.

| Body field | Type | Description |
| --- | --- | --- |
| `email`, `phone`, `first_name`, `last_name` | string | Contact details |
| `cart_items` | array | Required |
| `shipping_address` | object | Optional |
| `total_amount`, `currency` | varies | Optional |

### GET /storefront/marketing/abandoned-cart/restore - Restore from email link

Public. Given a signed `token` from a recovery email, returns the saved cart items and shipping address to pre-fill checkout.

## Contact

### POST /storefront/contact - Send an enquiry

Public. Emails the store's inbox. Requires `email` and `message`.

| Body field | Type | Description |
| --- | --- | --- |
| `name` | string | Optional |
| `email` | string | Required |
| `phone`, `subject` | string | Optional |
| `message` | string | Required |

```json
{ "status": "success", "message": "Enquiry sent successfully." }
```
