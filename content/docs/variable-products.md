## 7. Variable Products

Variable products have multiple variants (e.g., size, weight, color). The API exposes variable products and their variations on **GET /products** (list) and **GET /products/:id** (single). Each product includes a `variants` array; for variable products it contains the full set of variations with id, sku, price, stock, and option attributes.

### Variant response shape (reading)

When you **read** products (list or single), each variant in the `variants` array has this shape:

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Variant ID (use this as `variant_id` when creating orders or cart items) |
| `product_id` | integer | Parent product ID |
| `sku` | string | Variant SKU (unique) |
| `price` | string/number | Variant price |
| `sale_price` | string/number \| null | Sale price if set |
| `stock` | integer | Stock quantity |
| `manage_stock` | boolean | Whether stock is tracked |
| `stock_status` | string | `instock`, `outofstock`, `onbackorder` |
| `backorders` | string | `no`, `notify`, `yes` |
| `low_stock_threshold` | integer \| null | Low stock alert threshold |
| `attributes_json` | object | Variant options, e.g. `{ "Size": "1kg", "Weight": "500g" }` |
| `created_at` | string | ISO 8601 timestamp |
| `updated_at` | string | ISO 8601 timestamp |

**Example - variable product as returned by GET /products or GET /products/:id:**

```json
{
  "id": 10,
  "name": "Organic Flour",
  "slug": "organic-flour",
  "sku": "FLOUR-ORG",
  "price": "0",
  "sale_price": null,
  "stock": 0,
  "status": "published",
  "product_type": "variable",
  "category": { "id": 1, "name": "Flour" },
  "brand": { "id": 1, "name": "Organic Co" },
  "images": [{ "id": 1, "url": "https://cdn.example.com/flour.jpg", "alt": "Flour", "order": 0 }],
  "tags": [],
  "variants": [
    {
      "id": 101,
      "product_id": 10,
      "sku": "FLOUR-ORG-500G",
      "price": "6.99",
      "sale_price": "5.99",
      "stock": 50,
      "manage_stock": true,
      "stock_status": "instock",
      "backorders": "no",
      "low_stock_threshold": null,
      "attributes_json": { "Size": "500g" },
      "created_at": "2026-01-15T10:00:00.000Z",
      "updated_at": "2026-01-15T10:00:00.000Z"
    },
    {
      "id": 102,
      "product_id": 10,
      "sku": "FLOUR-ORG-1KG",
      "price": "12.99",
      "sale_price": null,
      "stock": 100,
      "manage_stock": true,
      "stock_status": "instock",
      "backorders": "no",
      "low_stock_threshold": 10,
      "attributes_json": { "Size": "1kg" },
      "created_at": "2026-01-15T10:00:00.000Z",
      "updated_at": "2026-01-15T10:00:00.000Z"
    }
  ],
  "created_at": "2026-01-15T10:00:00.000Z",
  "updated_at": "2026-01-15T10:00:00.000Z"
}
```

Use `variant.id` as `variant_id` when creating orders or adding to cart for variable products.

### Creating a Variable Product

**POST /products**

```json
{
  "name": "Organic Flour",
  "sku": "FLOUR-ORG",
  "price": 0,
  "status": "active",
  "description": "Premium organic flour in multiple sizes",
  "short_description": "Choose your size",
  "category_id": 1,
  "brand_id": 1,
  "manage_stock": false,
  "stock": 0,
  "product_type": "variable",
  "images": [
    { "url": "https://cdn.example.com/flour.jpg", "alt": "Organic Flour", "order": 0 }
  ],
  "variants": [
    {
      "sku": "FLOUR-ORG-500G",
      "price": 6.99,
      "sale_price": 5.99,
      "stock": 50,
      "manage_stock": true,
      "stock_status": "instock",
      "attributes": { "Size": "500g" }
    },
    {
      "sku": "FLOUR-ORG-1KG",
      "price": 12.99,
      "sale_price": 11.99,
      "stock": 100,
      "manage_stock": true,
      "stock_status": "instock",
      "attributes": { "Size": "1kg" }
    },
    {
      "sku": "FLOUR-ORG-2KG",
      "price": 22.99,
      "stock": 30,
      "manage_stock": true,
      "stock_status": "instock",
      "attributes": { "Size": "2kg" }
    }
  ]
}
```

### Variant Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sku` | string | No | Auto-generated from product SKU + attributes if omitted |
| `price` | number | Yes | Variant price |
| `sale_price` | number | No | Sale price (null if no sale) |
| `stock` | integer | No | Stock quantity (default: 0) |
| `manage_stock` | boolean | No | Whether to track stock (default: true) |
| `stock_status` | string | No | `instock`, `outofstock`, `onbackorder` |
| `backorders` | string | No | `no`, `notify`, `yes` (default: `no`) |
| `low_stock_threshold` | integer | No | Low stock alert threshold |
| `attributes` | object | No | Key-value pairs, e.g. `{ "Size": "1kg", "Color": "White" }`. When **reading**, the API returns this as `attributes_json`. |

### Variable Product Rules

1. **Product-level stock** - Set to `0` and `manage_stock: false` for variable products
2. **Product-level price** - Set to `0`; each variant has its own price
3. **SKU** - Each variant should have a unique SKU; if omitted, one is auto-generated
4. **Attributes** - Use `attributes` to define variant options (e.g., Size, Color)

### Complete Variable Product Example (T-Shirt)

```json
{
  "name": "Classic Cotton T-Shirt",
  "sku": "TSHIRT-001",
  "price": 0,
  "status": "active",
  "description": "Comfortable cotton t-shirt in multiple sizes and colors",
  "short_description": "100% cotton",
  "category_id": 2,
  "brand_id": 1,
  "manage_stock": false,
  "stock": 0,
  "images": [
    { "url": "https://cdn.example.com/tshirt-1.jpg", "alt": "T-Shirt White", "order": 0 },
    { "url": "https://cdn.example.com/tshirt-2.jpg", "alt": "T-Shirt Black", "order": 1 }
  ],
  "variants": [
    {
      "sku": "TSHIRT-001-S-M",
      "price": 24.99,
      "sale_price": 19.99,
      "stock": 100,
      "attributes": { "Size": "S", "Color": "White" }
    },
    {
      "sku": "TSHIRT-001-M-M",
      "price": 24.99,
      "sale_price": 19.99,
      "stock": 150,
      "attributes": { "Size": "M", "Color": "White" }
    },
    {
      "sku": "TSHIRT-001-L-B",
      "price": 24.99,
      "stock": 80,
      "attributes": { "Size": "L", "Color": "Black" }
    }
  ]
}
```

### Updating a Variable Product

**PUT /products/:id**

Include the full `variants` array. Existing variants are replaced. To remove all variants and convert to simple, send `variants: []`.

```json
{
  "variants": [
    {
      "sku": "FLOUR-ORG-500G",
      "price": 5.99,
      "stock": 60,
      "attributes": { "Size": "500g" }
    },
    {
      "sku": "FLOUR-ORG-1KG",
      "price": 10.99,
      "stock": 120,
      "attributes": { "Size": "1kg" }
    }
  ]
}
```

---

