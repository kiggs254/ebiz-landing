## Catalog Feed

Public, read-only product feed endpoint for merchant catalog distribution. No authentication is required.

### GET /catalog/products.xml - Product feed for Google Merchant Center and Facebook Catalog

Generates an XML product feed in RSS 2.0 format with Google Merchant Center extensions. Use this feed to submit your product catalog to Google Merchant Center, Facebook Catalog, or other merchant platforms that accept XML feeds.

**Auth:** Public (no authentication required)

The feed includes all products with `status=published` and `catalog_visibility` in `['visible', 'catalog']`. Product links are built using your configured storefront base URL. The response is cached publicly for 5 minutes.

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `site_url` | string | No | Override the base URL for product links. If omitted, uses shop setting `storefront_url` or `site_url`, environment variables, or constructs from request (e.g., `https://your-store.com`). |

**Example Request:**

```bash
curl "https://your-store-api.example.com/api/v1/catalog/products.xml"
```

Or with a specific site URL:

```bash
curl "https://your-store-api.example.com/api/v1/catalog/products.xml?site_url=https://myshop.example.com"
```

**Example Response (200):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
<channel>
  <title>My Shop Product Feed</title>
  <link>https://myshop.example.com</link>
  <description>My Shop products for Google Merchant / Facebook Catalog</description>
  <language>en</language>
  <lastBuildDate>Fri, 21 Sep 2026 14:32:00 GMT</lastBuildDate>
  <item>
    <g:id>product-123</g:id>
    <title>Premium Widget</title>
    <description>High quality widget for all uses</description>
    <link>https://myshop.example.com/product/premium-widget</link>
    <g:image_link>https://cdn.example.com/product-123-main.jpg</g:image_link>
    <g:availability>in stock</g:availability>
    <g:condition>new</g:condition>
    <g:price>99.99 KES</g:price>
    <g:sale_price>79.99 KES</g:sale_price>
    <g:mpn>WID-001</g:mpn>
    <g:brand>My Brand</g:brand>
    <g:product_type>Widgets</g:product_type>
  </item>
  <item>
    <g:id>product-456</g:id>
    <title>Standard Gadget</title>
    <description>Reliable gadget with great reviews</description>
    <link>https://myshop.example.com/product/standard-gadget</link>
    <g:image_link>https://cdn.example.com/product-456-main.jpg</g:image_link>
    <g:availability>out of stock</g:availability>
    <g:condition>new</g:condition>
    <g:price>49.99 KES</g:price>
    <g:brand>My Brand</g:brand>
    <g:product_type>Gadgets</g:product_type>
  </item>
</channel>
</rss>
```

**Response Format:**

Each `<item>` contains:

| Field | Description |
|-------|-------------|
| `<g:id>` | Product database ID |
| `<title>` | Product name |
| `<description>` | Stripped HTML from short_description, description, seo_description, or name |
| `<link>` | Product storefront URL (built using your configured `product_url_template` or `/product/:slug`) |
| `<g:image_link>` | URL of the first product image (if available) |
| `<g:availability>` | "in stock" or "out of stock" (derived from `stock_status` or inventory count) |
| `<g:condition>` | Always "new" |
| `<g:price>` | Price in the shop currency (KSH is converted to KES) |
| `<g:sale_price>` | Sale price (only included if `sale_price < price`) |
| `<g:mpn>` | Product SKU (if available) |
| `<g:brand>` | Brand name, or shop name if not set |
| `<g:product_type>` | Category name (if available) |

**Caching:**

- **Cache Control:** `public, max-age=300, s-maxage=900, stale-while-revalidate=900`
- Public cache: 5 minutes
- CDN cache: 15 minutes with stale fallback

**Gotchas:**

- Only published products with `catalog_visibility` in `['visible', 'catalog']` are included. Hidden or private products are excluded.
- Stock availability is determined from `stock_status` if set; otherwise derived from the `stock` count and `manage_stock` flag.
- Currency code is automatically normalized (e.g., KSH → KES).
- Sale price is only included in the feed if it is lower than the regular price and is a valid number.
