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

### Product Import (CSV)

**POST /products/import**

- `Content-Type: multipart/form-data`
- `file` - CSV file
- `updateExisting` - `true` (default) or `false` to update existing products by SKU
- `columnMapping` - Optional JSON object for column mapping

Returns `202 Accepted` with a task ID for background processing.

---

### Product Export

**GET /products/export**

Returns a CSV file with all products. Supports same query params as list (`search`, `status`, etc.).

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
