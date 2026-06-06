AI-powered semantic search and product recommendations. These are part of the **AI Search addon**: when it is disabled, search responds with `fallback: true` so your storefront can quietly fall back to the standard `GET /storefront/products?search=...` listing. All endpoints are public.

Recommendation and search endpoints accept an optional branch via the `X-Branch-Id` header or a `branch_id` query param (used only when the branches addon is on).

## Search

### GET /storefront/ai-search - Semantic + keyword search

Hybrid semantic and lexical product search.

| Query param | Type | Description |
| --- | --- | --- |
| `q` | string | Search query (alias: `search`) |
| `page` | number | Page number (default `1`) |
| `limit` | number | Results per page (default `24`, max `100`) |
| `category_slug` | string | Restrict to a category |
| `brand_slug` | string | Restrict to a brand |
| `min_price` | number | Minimum price |
| `max_price` | number | Maximum price |

```bash
curl "https://your-store-api.example.com/api/v1/storefront/ai-search?q=light%20trail%20shoes&limit=24"
```

```json
{
  "status": "success",
  "data": {
    "products": [ /* product objects */ ],
    "total": 18,
    "page": 1,
    "limit": 24,
    "relaxed": false,
    "fallback": false,
    "timing": { "total_ms": 120 }
  }
}
```

When the addon is off, the endpoint responds with HTTP `503` and `data.fallback: true`. Treat that as a signal to call the regular products listing with `search`.

### GET /storefront/ai-search/health - Addon status

Returns whether AI search is enabled and ready (pgvector installed, provider, model, embedding coverage). Call it once at boot to decide whether to enable the AI search UI.

```json
{
  "status": "success",
  "data": {
    "ok": true,
    "enabled": true,
    "pgvector": true,
    "provider": "openai",
    "model": "text-embedding-3-small",
    "coverage": 0.98
  }
}
```

### POST /storefront/ai-search/track-click - Record a result click

Best-effort analytics: records that a shopper clicked a product from a search. Failures are swallowed, so never block the UI on it.

```json
{ "query": "trail shoes", "product_id": 412 }
```

## Recommendations

All return `{ status, data: { products } }`.

### GET /storefront/recommendations/similar - Similar products

"You might also like" for a product page.

| Query param | Type | Description |
| --- | --- | --- |
| `product_id` | number | Required |
| `k` | number | Optional. Number of results |

### GET /storefront/recommendations/fbt - Frequently bought together

Products commonly purchased alongside the given product.

| Query param | Type | Description |
| --- | --- | --- |
| `product_id` | number | Required |
| `k` | number | Optional |

### GET /storefront/recommendations/fbt-cart - Bought together (cart)

"Complete your order" suggestions based on everything currently in the cart.

| Query param | Type | Description |
| --- | --- | --- |
| `ids` | string | Comma-separated product IDs in the cart |
| `k` | number | Optional |

### GET /storefront/recommendations/for-you - Personalized

Personalized picks. Uses the logged-in customer's session when present; otherwise returns popular fallbacks. The response also includes a `source` describing how the list was generated.

```json
{ "status": "success", "data": { "products": [ /* ... */ ], "source": "personalized" } }
```
