Public, read-only catalog endpoints. No authentication is required. All return the standard `{ status, data }` envelope.

## Products

### GET /storefront/products - List products

Returns published products with pagination. Supports filtering, search, and sorting.

| Query param | Type | Description |
| --- | --- | --- |
| `page` | number | Page number (default `1`) |
| `limit` | number | Items per page (default `20`) |
| `search` | string | Match against name and description |
| `category_slug` | string | Filter by category slug (includes descendant categories) |
| `brand_slug` | string | Filter by brand slug |
| `tag_slug` | string | Filter by tag slug |
| `featured` | boolean | `true` to return only featured products |
| `on_sale` | boolean | `true` to return only products with an active sale price |
| `sort` | string | `newest` (default), `price_asc`, `price_desc`, `best_sellers` |
| `branch_id` | number | Optional. Only when the branches addon is enabled |

```bash
curl "https://your-store-api.example.com/api/v1/storefront/products?category_slug=running-shoes&sort=price_asc&page=1&limit=24"
```

```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": 412,
        "name": "Trail Runner Edition 02",
        "slug": "trail-runner-edition-02",
        "description": "...",
        "price": "96.00",
        "sale_price": "79.00",
        "sku": "TR-02",
        "status": "published",
        "product_type": "simple",
        "is_featured": true,
        "stock_status": "instock",
        "age_restricted": false,
        "category": { "id": 8, "name": "Running shoes", "slug": "running-shoes" },
        "brand": { "id": 3, "name": "Northwind", "slug": "northwind" },
        "images": [{ "id": 1, "url": "https://.../tr02.jpg", "alt": "Trail Runner", "order": 0 }],
        "variants": [],
        "tags": [{ "id": 5, "name": "New", "slug": "new" }]
      }
    ],
    "total": 137,
    "page": 1,
    "limit": 24
  }
}
```

A variable product (`product_type: "variable"`) includes a `variants[]` array; each variant has its own `price`, `sale_price`, `sku`, and `attributes_json`.

### GET /storefront/products/by-ids - Get several products by ID

Fetch a specific set of products, preserving the order of the `ids` you pass. Handy for "recently viewed" or rebuilding a cart from local storage.

| Query param | Type | Description |
| --- | --- | --- |
| `ids` | string | Required. Comma-separated product IDs, e.g. `412,87,209` |
| `branch_id` | number | Optional, branches addon only |

```bash
curl "https://your-store-api.example.com/api/v1/storefront/products/by-ids?ids=412,87,209"
```

### GET /storefront/products/:slug - Get a single product

Fetch one published product by `slug` (a numeric id is accepted as a fallback). Includes full details: `category`, `categories`, `brand`, `images`, `variants`, `tags`, and approved `reviews` (with the reviewer's first/last name).

```bash
curl "https://your-store-api.example.com/api/v1/storefront/products/trail-runner-edition-02"
```

Returns `404` if the product does not exist or is not published.

## Categories

### GET /storefront/categories - Category tree

Returns the full category tree (root categories with nested `children`). When branches are enabled, categories disabled for a `branch_id` are excluded.

| Query param | Type | Description |
| --- | --- | --- |
| `branch_id` | number | Optional, branches addon only |

```json
{
  "status": "success",
  "data": {
    "categories": [
      { "id": 1, "name": "Footwear", "slug": "footwear", "children": [
        { "id": 8, "name": "Running shoes", "slug": "running-shoes", "children": [] }
      ] }
    ]
  }
}
```

### GET /storefront/categories/:slug - Category by slug

Returns the category, a sample of its published products (up to 20, newest first), and an optional category banner.

```json
{
  "status": "success",
  "data": {
    "category": { "id": 8, "name": "Running shoes", "slug": "running-shoes", "parent": null, "children": [] },
    "products": [ /* up to 20 products */ ],
    "banner": null
  }
}
```

For a full, paginated product listing in a category, use `GET /storefront/products?category_slug=...` instead.

## Brands

### GET /storefront/brands - List brands

Returns all brands, sorted by name. (Hidden in your UI when the `brands_enabled` setting is off.)

```json
{ "status": "success", "data": { "brands": [{ "id": 3, "name": "Northwind", "slug": "northwind" }] } }
```

## Tags

### GET /storefront/tags - List tags

Returns all product tags, sorted by name.

```json
{ "status": "success", "data": { "tags": [{ "id": 5, "name": "New", "slug": "new" }] } }
```

## Currencies

### GET /storefront/currencies - Supported currencies and rates

Returns the store's enabled currencies and exchange rates so your storefront can offer a currency switcher.

```json
{
  "status": "success",
  "data": {
    "base": "KES",
    "currencies": [
      { "code": "KES", "symbol": "KSh", "rate": 1 },
      { "code": "USD", "symbol": "$", "rate": 0.0077 }
    ]
  }
}
```

### GET /storefront/locations/countries - Countries & states

Returns the list of countries and their states/regions for address forms and shipping selectors.
