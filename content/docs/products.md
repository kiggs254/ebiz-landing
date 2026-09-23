## 6. Products API

### GET /products - List Products

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page |
| `search` | string | - | Search by name or SKU |
| `status` | string | - | Filter: `active`, `draft`, `archived` |
| `category_id` | integer | - | Filter by category |
| `brand_id` | integer | - | Filter by brand |
| `sort_by` | string | `created_at` | `price`, `name`, `created_at`, `updated_at`, `popularity_score`. Anything else falls back to `created_at` |
| `sort_order` | string | `desc` | `asc` or `desc` |

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/products?page=1&limit=20&status=active" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Organic Flour 1kg",
        "slug": "organic-flour-1kg",
        "sku": "FLOUR-001",
        "price": "12.99",
        "sale_price": null,
        "stock": 100,
        "stock_status": "instock",
        "status": "active",
        "product_type": "simple",
        "description": "Premium organic flour",
        "short_description": "1kg bag",
        "category": { "id": 1, "name": "Flour" },
        "brand": { "id": 1, "name": "Organic Co" },
        "images": [
          { "id": 1, "url": "https://cdn.example.com/flour.jpg", "alt": "Flour" }
        ],
        "tags": [],
        "variants": [],
        "popularity_score": 42,
        "created_at": "2026-01-15T10:00:00.000Z",
        "updated_at": "2026-01-15T10:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

**Variable products in the list:** Each product in `products` includes a `variants` array. For simple products it is `[]`. For variable products it contains one object per variant (see [Variant response shape](#variant-response-shape-reading) below).

---

### GET /products/:id - Get Single Product

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/products/1" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 1,
      "name": "Organic Flour 1kg",
      "slug": "organic-flour-1kg",
      "sku": "FLOUR-001",
      "price": "12.99",
      "sale_price": null,
      "stock": 100,
      "stock_status": "instock",
      "status": "active",
      "product_type": "simple",
      "description": "Premium organic flour",
      "short_description": "1kg bag",
      "category_id": 1,
      "brand_id": 1,
      "manage_stock": true,
      "images": [
        { "id": 1, "url": "https://cdn.example.com/flour.jpg", "alt": "Flour", "order": 0 }
      ],
      "variants": [],
      "categories": [{ "id": 1, "name": "Flour" }],
      "tags": [],
      "created_at": "2026-01-15T10:00:00.000Z",
      "updated_at": "2026-01-15T10:00:00.000Z"
    }
  }
}
```

For variable products, `variants` is populated with the full variant list; see [Variant response shape](#variant-response-shape-reading) and [Variable Products](#7-variable-products).

---

### POST /products - Create Product

**Request Body (Simple Product):**

```json
{
  "name": "Organic Flour 1kg",
  "sku": "FLOUR-001",
  "price": 12.99,
  "sale_price": 9.99,
  "stock": 100,
  "stock_status": "instock",
  "status": "active",
  "description": "Premium organic flour for baking",
  "short_description": "1kg bag",
  "category_id": 1,
  "brand_id": 1,
  "manage_stock": true,
  "images": [
    { "url": "https://cdn.example.com/flour.jpg", "alt": "Organic Flour", "order": 0 }
  ]
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Product name |
| `sku` | string | Yes | Unique SKU |
| `price` | number | Yes | Base price |
| `sale_price` | number | No | Sale price (null if no sale) |
| `stock` | integer | No | Stock quantity (default: 0) |
| `stock_status` | string | No | `instock`, `outofstock`, `onbackorder` |
| `status` | string | No | `active`, `draft`, `archived` (default: `draft`) |
| `description` | string | No | Full description |
| `short_description` | string | No | Short description |
| `category_id` | integer | No | Primary category ID |
| `category_ids` | array | No | Multiple category IDs |
| `brand_id` | integer | No | Brand ID |
| `tag_ids` | array | No | Tag IDs |
| `manage_stock` | boolean | No | Whether to track stock (default: true) |
| `images` | array | No | `[{ url, alt?, order? }]` |
| `slug` | string | No | URL slug (auto-generated from name if omitted) |
| `seo_title` | string | No | SEO title |
| `seo_description` | string | No | SEO meta description |
| `seo_keywords` | string | No | SEO keywords |

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/products" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Organic Flour 1kg",
    "sku": "FLOUR-001",
    "price": 12.99,
    "stock": 100,
    "status": "active",
    "category_id": 1
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 42,
      "name": "Organic Flour 1kg",
      "sku": "FLOUR-001",
      "price": "12.99",
      "stock": 100,
      "status": "active",
      "product_type": "simple",
      "created_at": "2026-03-04T10:00:00.000Z"
    }
  }
}
```

---

### PUT /products/:id - Update Product

Same as create; all fields are optional. Only provided fields are updated.

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/products/42" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "price": 14.99,
    "stock": 80,
    "sale_price": 12.99
  }'
```

---

### DELETE /products/:id - Delete Product

**Example Request:**

```bash
curl -X DELETE "https://your-store.com/api/v1/products/42" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

---

### GET /products/template - Download Import Template

Download a CSV template file with all supported product columns and field types for bulk imports.

**Auth:** API key or admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/products/template" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

CSV file with headers and sample data.

---

### POST /products/import - Bulk Import Products

Upload a CSV file to import products in bulk. Supports creating new products or updating existing ones by SKU.

**Auth:** API key or admin session

**Addon:** None (core feature)

```bash
curl -X POST "https://your-store-api.example.com/api/v1/products/import" \
  -u "ck_xxx:cs_yyy" \
  -F "file=@products.csv" \
  -F "updateExisting=true" \
  -F "createNew=true"
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | binary | Yes | CSV file (max 10MB). Headers: `SKU`, `Name`, `Description`, `Price`, `Sale Price`, `Stock`, `Status`, `Category`, `Images`, etc. |
| `updateExisting` | boolean | No | Default: `true`. Update products with matching SKU. |
| `createNew` | boolean | No | Default: `true`. Create products for rows without matching SKU. |
| `keepExternalImages` | boolean | No | Default: `false`. Preserve image URLs from external sources (e.g., supplier CDN). |
| `skipExistingImages` | boolean | No | Default: `false`. Do not update images for existing products. |
| `columnMapping` | JSON object | No | Custom column-name mapping (for non-standard CSV headers). |

**Example Response (202):**

```json
{
  "status": "success",
  "data": {
    "task_id": "import_abc123",
    "message": "Import started in background",
    "filename": "products.csv"
  }
}
```

**Gotchas:**
- Import runs as a background job; use the task ID to poll progress.
- SKU is the primary key for matching (case-sensitive).
- Blank `Type` on an update row converts variable products to simple and deletes variants.
- Images are fetched from URLs; invalid URLs are silently skipped.
- CSV must be UTF-8 encoded.

---

### GET /products/export - Export Products as CSV

Export all products (or a filtered subset) as CSV.

**Auth:** API key or admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/products/export?status=active&search=flour" \
  -u "ck_xxx:cs_yyy" \
  --output products.csv
```

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Search by name or SKU. |
| `status` | string | Filter: `active`, `draft`, `archived`. |
| `category_id` | integer | Filter by category. |
| `brand_id` | integer | Filter by brand. |

**Example Response (200):**

CSV file (all columns from the import template).

---

### POST /products/bulk-generate-ai - Generate AI Descriptions and SEO

Enqueue a background job to automatically generate product descriptions and SEO metadata using Claude AI.

**Auth:** API key or admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/products/bulk-generate-ai" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "product_ids": [1, 2, 3],
    "mode": "manual",
    "generate_short_description": true,
    "short_description_format": "paragraph",
    "generate_long_description": true,
    "generate_seo": true
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_ids` | array | Depends | List of product IDs. Required if `mode=manual`. Ignored if `mode=auto`. |
| `mode` | string | No | Default: `manual`. `auto` = find all products missing AI content. |
| `generate_short_description` | boolean | No | Generate short product descriptions. |
| `short_description_format` | string | No | `list` or `paragraph` (only if `generate_short_description=true`). |
| `generate_long_description` | boolean | No | Generate full product descriptions. |
| `generate_seo` | boolean | No | Generate SEO title, description, and keywords. |

**Example Response (202):**

```json
{
  "status": "success",
  "data": {
    "task_id": "ai_gen_xyz789",
    "job_id": "ai_gen_xyz789",
    "message": "Generation started in background",
    "count": 3
  }
}
```

**Gotchas:**
- Job runs asynchronously; poll task status for progress.
- `auto` mode finds products with no short description, no long description, or missing SEO title (any missing = match).
- Generated content is created as draft fields; you must review and publish.

---

### POST /products/bulk-enhance-images - Generate Images with AI

Enqueue a background job to generate or replace product images using Gemini AI.

**Auth:** API key or admin session

**Addon:** AI Image Generation (must be enabled and configured with Gemini API key)

```bash
curl -X POST "https://your-store-api.example.com/api/v1/products/bulk-enhance-images" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "product_ids": [5, 6],
    "mode": "append",
    "custom_prompt": "white background, professional lighting"
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_ids` | array | Yes | List of product IDs to enhance. |
| `mode` | string | No | Default: `append`. `append` = add new images. `replace` = regenerate all images. |
| `custom_prompt` | string | No | Custom instruction to guide image generation. |

**Example Response (202):**

```json
{
  "status": "success",
  "data": {
    "task_id": "img_enh_456def",
    "job_id": "img_enh_456def",
    "message": "AI image enhancement started in background",
    "count": 2,
    "mode": "append"
  }
}
```

**Gotchas:**
- Requires AI Image addon; returns 503 if disabled.
- Requires Gemini API key configured in Settings → Advanced.
- Generated images are created as product images but not yet published.
- Each product counts toward the configured `maxBulkSize` (default varies by plan).

---

### GET /products/ai-generation-status - Poll AI Generation Status

Get the status of ongoing AI content or image generation jobs.

**Auth:** API key or admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/products/ai-generation-status" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "status": "running",
    "processed": 2,
    "total": 5,
    "errors": []
  }
}
```

---

### POST /products/bulk-generate-image-alt - Generate Image Alt Text in Bulk

Enqueue a background job to generate alt text and titles for product images.

**Auth:** API key or admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/products/bulk-generate-image-alt" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "product_ids": [10, 11],
    "mode": "manual",
    "overwrite": false
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_ids` | array | Depends | List of product IDs. Required if `mode=manual`. Ignored if `mode=auto`. |
| `mode` | string | No | Default: `manual`. `auto` = find all images with missing alt/title. |
| `overwrite` | boolean | No | Default: `false`. `true` = regenerate even where alt/title already exist. |

**Example Response (202):**

```json
{
  "status": "success",
  "data": {
    "task_id": "img_alt_789ghi",
    "job_id": "img_alt_789ghi",
    "message": "Image alt text & title generation started in background",
    "count": 2
  }
}
```

**Gotchas:**
- Alt text is generated deterministically from product name (no AI call, fast).
- `auto` mode finds images with no alt or no title.

---

### POST /products/:id/duplicate - Duplicate a Product

Create an exact copy of a product (simple or variable).

**Auth:** API key or admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/products/42/duplicate" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 99,
      "name": "Organic Flour 1kg-copy",
      "sku": "FLOUR-001-COPY",
      "price": "12.99",
      "status": "draft",
      "product_type": "simple"
    }
  }
}
```

**Gotchas:**
- Duplicate is created as draft and receives "-copy" suffix on the name.
- Images, variants, categories, and tags are all duplicated.
- SKU is suffixed with "-COPY" to avoid duplicates.

---

### POST /products/:id/generate-image-alt - Generate Image Alt Text for One Product

Synchronously generate alt text and titles for all images of a single product.

**Auth:** API key or admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/products/42/generate-image-alt" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{ "overwrite": false }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `overwrite` | boolean | No | Default: `false`. `true` = regenerate even where alt/title already exist. |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "product_id": 42,
    "updated": 2,
    "images": [
      { "id": 1, "alt": "Organic Flour 1kg", "title": "Organic Flour 1kg" },
      { "id": 2, "alt": "Organic Flour 1kg", "title": "Organic Flour 1kg" }
    ]
  }
}
```

**Gotchas:**
- This is a synchronous operation (unlike bulk variants).
- Deterministically derived from product name; no AI involved.

---

### GET /products/:id/currency-prices - Get Currency Price Overrides

Retrieve all currency-specific price overrides for a product.

**Auth:** API key or admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/products/42/currency-prices" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "prices": [
      {
        "id": 1,
        "product_id": 42,
        "variant_id": null,
        "currency_code": "USD",
        "price": 14.99,
        "sale_price": 12.99
      },
      {
        "id": 2,
        "product_id": 42,
        "variant_id": 5,
        "currency_code": "EUR",
        "price": 13.50,
        "sale_price": null
      }
    ]
  }
}
```

---

### PUT /products/:id/currency-prices - Set Currency Price Overrides

Create or replace currency-specific price overrides for a product or variant.

**Auth:** API key or admin session

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/products/42/currency-prices" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "prices": [
      { "currency_code": "USD", "price": 14.99, "sale_price": 12.99, "variant_id": null },
      { "currency_code": "EUR", "price": 13.50, "sale_price": null, "variant_id": 5 }
    ]
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prices` | array | Yes | Array of price entries. |
| `prices[].currency_code` | string | Yes | ISO 4217 currency code (e.g., `USD`, `EUR`). |
| `prices[].price` | number | Yes | Price in this currency. |
| `prices[].sale_price` | number | No | Optional sale price for this currency. |
| `prices[].variant_id` | integer | No | If set, override applies only to this variant. Null = base product. |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "prices": [
      {
        "id": 1,
        "product_id": 42,
        "variant_id": null,
        "currency_code": "USD",
        "price": 14.99,
        "sale_price": 12.99
      },
      {
        "id": 2,
        "product_id": 42,
        "variant_id": 5,
        "currency_code": "EUR",
        "price": 13.50,
        "sale_price": null
      }
    ]
  }
}
```

**Gotchas:**
- Existing prices for the same currencies are replaced; others are preserved.
- Currency codes are normalized to uppercase.
- `variant_id=null` or omitted = base product price.
- Invalid prices or currency codes are silently skipped.

---

### Popularity score

Every product carries a read-only `popularity_score`: the number of units sold across all
orders that are **paid** and not **cancelled**. It is a plain unit count, not a rate or a
weighted ranking, so a product sold 40 times in one order scores the same as one sold once in
40 orders.

The score is recalculated for the whole catalog nightly at **04:00 server time**. It is not
updated as orders come in, so a product bought this morning keeps yesterday's score until the
next run. Writes to `popularity_score` through `POST`/`PUT /products` are ignored — the nightly
job is the only writer.

Sort by it with `sort_by=popularity_score` on the admin API, or `sort=best_sellers` on the
[storefront catalog](/docs/storefront-catalog).

---

### POST /products/popularity/recalculate - Recalculate scores

Rebuilds `popularity_score` for every product immediately, instead of waiting for the nightly
run. Useful right after a bulk order import, when the scores would otherwise be a day behind.

This rewrites the whole catalog in two statements, so treat it as an occasional operation —
it is not something to call per order.

```bash
curl -X POST "https://your-store.com/api/v1/products/popularity/recalculate" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Popularity scores recalculated"
}
```

---
