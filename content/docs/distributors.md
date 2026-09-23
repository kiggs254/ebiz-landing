The distributor/dealer programme enables wholesale pricing for bulk buyers. Customers can browse programme terms, apply for approval, and preview their personalized pricing. All admin endpoints require a staff session and are gated by the `distributor_addon_enabled` setting; when the addon is switched off, endpoints return 503.

## Public Configuration

### GET /storefront/distributor/config - Programme description

Public programme information. Always returns a 200 (returns `enabled: false` when the addon is off, so storefronts don't need special error handling).

**Auth:** Public (no auth required)

```bash
curl "https://your-store-api.example.com/api/v1/storefront/distributor/config"
```

```json
{
  "status": "success",
  "data": {
    "config": {
      "enabled": true,
      "program_name": "Trade Programme",
      "terms": "Minimum order KES 10,000 required; 7-14 day delivery",
      "qty_basis": "units",
      "show_product_cta": true,
      "cta_text": "Get trade pricing"
    }
  }
}
```

When `enabled: false`, the response omits all other fields. Use this to show or hide the "Apply for trade pricing" CTA on the storefront.

## Customer Application

### GET /storefront/customer/distributor - Get customer's distributor status

The signed-in customer's distributor application status, their personalised pricing ladder, and their stored business details (if they've applied).

**Auth:** Signed-in customer session

```bash
curl "https://your-store-api.example.com/api/v1/storefront/customer/distributor" \
  --cookie cookies.txt
```

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "program_name": "Trade Programme",
    "terms": "Minimum order KES 10,000 required; 7-14 day delivery",
    "qty_basis": "units",
    "status": "approved",
    "is_distributor": true,
    "override_percent": 15,
    "bands": [
      { "min_qty": 0, "percent": 5 },
      { "min_qty": 101, "percent": 10 },
      { "min_qty": 501, "percent": 15 }
    ],
    "application": {
      "company_name": "Acme Traders Ltd",
      "tax_id": "A012345678B",
      "business_phone": "+254700000008",
      "business_address": "123 Commerce Street, Nairobi",
      "website": "https://acmetraders.example.com",
      "applied_at": "2024-08-15T10:30:00Z",
      "approved_at": "2024-08-17T14:22:00Z",
      "rejection_reason": null
    }
  }
}
```

`status` is one of:
- `pending` — application submitted, awaiting review
- `approved` — application approved, customer is eligible for pricing
- `rejected` — application rejected (see `rejection_reason`)

When `is_distributor` is `true`, the pricing `bands` are the customer's effective discount schedule. Use these to preview their total in the cart or checkout.

### POST /storefront/customer/distributor/apply - Apply to the programme

Apply (or re-apply) to the distributor programme. Re-applying after rejection resets the status to `pending` (or `approved` if auto-approval is on), clears the rejection reason, and updates stored details. Approved distributors can edit their business information without losing their status.

**Auth:** Signed-in customer session

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `company_name` | string | Yes | Max 255 chars |
| `tax_id` | string | No | Max 80 chars |
| `business_phone` | string | No | Max 50 chars |
| `business_address` | string | No | Max 1000 chars |
| `website` | string | No | Max 255 chars |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/customer/distributor/apply" \
  -H "Content-Type: application/json" --cookie cookies.txt \
  -d '{
    "company_name": "Acme Traders Ltd",
    "tax_id": "A012345678B",
    "business_phone": "+254700000008",
    "business_address": "123 Commerce Street, Nairobi",
    "website": "https://acmetraders.example.com"
  }'
```

Responds `201` on first application, `200` on edit:

```json
{ "status": "success", "data": { "status": "pending", "is_distributor": false } }
```

Returns `400` if `company_name` is missing, or `404` if the programme is disabled.

**Gotchas:**
- A `null` or empty `company_name` triggers a 400; other fields are trimmed and can be blank.
- Re-applying does not change `approved_at` — it preserves the original approval timestamp.
- Only the `pending` or `rejected` states trigger a reset to `pending`; `approved` distributors stay approved.

### POST /storefront/customer/distributor/preview-discount - Preview Distributor Discount

Calculate the trade discount for the authenticated customer's cart items. Returns discount amount, percentage, quantity tier, and the band that matched.

**Auth:** Signed-in customer session

```bash
curl -X POST https://your-store-api.example.com/api/v1/storefront/customer/distributor/preview-discount \
  -H "Content-Type: application/json" \
  -H "Cookie: connect.sid=your_session" \
  -d '{
    "items": [
      {
        "product_id": 42,
        "variant_id": null,
        "quantity": 10,
        "price": 50.00
      },
      {
        "product_id": 43,
        "variant_id": 12,
        "quantity": 20,
        "price": 30.00
      }
    ],
    "branch_id": null
  }'
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `items` | array | Yes | Cart items with product_id, quantity, and price |
| `branch_id` | integer | No | Branch ID for multi-branch pricing context |

**Item Object:**
| Field | Type | Description |
| --- | --- | --- |
| `product_id` | integer | Product ID |
| `variant_id` | integer | Variant ID if applicable |
| `quantity` | integer | Quantity ordered |
| `price` | number | Unit price (for reference; server recalculates) |

**Response (Customer is Distributor):**

```json
{
  "status": "success",
  "data": {
    "is_distributor": true,
    "amount": 300.00,
    "percent": 15,
    "qty": 30,
    "qty_basis": "units",
    "band": "bulk_10_49_units",
    "subtotal": 2000.00
  }
}
```

**Response (Customer is Not Distributor):**

```json
{
  "status": "success",
  "data": {
    "is_distributor": false,
    "amount": 0,
    "percent": 0
  }
}
```

**Response (Empty Cart):**

```json
{
  "status": "success",
  "data": {
    "is_distributor": true,
    "amount": 0,
    "percent": 0
  }
}
```

**Fields:**
| Field | Description |
| --- | --- |
| `is_distributor` | Whether customer qualifies for trade pricing |
| `amount` | Discount amount in store currency |
| `percent` | Discount as a percentage |
| `qty` | Total quantity used to match tier (units, weight, etc) |
| `qty_basis` | Basis for tier matching (`units`, `weight`, etc) |
| `band` | Internal name of the matched tier/band (e.g., `bulk_10_49_units`) |
| `subtotal` | Items subtotal before discount |

**Gotchas:**
- Only authenticated customers can call this endpoint.
- Prices are recalculated server-side from product and branch settings; sent prices are ignored.
- Distributor status is stored at the customer record level and must be set in the admin.
- Trade pricing is applied BEFORE coupons and loyalty in checkout (see distributor discount stacking rules in admin settings).
- Empty carts return `is_distributor: true` but `amount: 0`.
- The `band` field is internal; don't display it to customers—use `percent` and `amount` for UI.

## Admin Configuration

### GET /distributors/config - Get distributor programme settings

Fetch the current configuration including programme name, discount caps, auto-approval setting, and storefront CTA. This endpoint is reachable even when the addon is disabled, so settings can be configured before enabling.

**Auth:** Admin session only

```bash
curl -X GET https://your-store-api.example.com/api/v1/distributors/config \
  -H "Cookie: connect.sid=..."
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "config": {
      "enabled": true,
      "program_name": "Distributor Programme",
      "terms": "Approved distributors qualify for volume discounts.",
      "auto_approve": false,
      "qty_basis": "order",
      "max_percent": 100,
      "stack_with_coupons": false,
      "exclude_sale_items": false,
      "show_product_cta": true,
      "cta_text": "Buying in bulk? Sign in for distributor pricing."
    }
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| enabled | boolean | Whether the addon is active |
| program_name | string | Display name for the programme |
| terms | string | Terms and conditions text |
| auto_approve | boolean | Auto-approve new applications without review |
| qty_basis | string | `order` (entire cart) or `line` (per product line) |
| max_percent | number | Maximum discount percentage (0–100) |
| stack_with_coupons | boolean | Allow distributor + coupon discounts together |
| exclude_sale_items | boolean | Items on sale don't get trade discount |
| show_product_cta | boolean | Show bulk-buying CTA on product pages |
| cta_text | string | Text for the CTA button |

### PUT /distributors/config - Update programme settings

Modify any configuration field. When the addon is enabled for the first time, seeds default bands (Bronze, Silver, Gold, Platinum) if the bands table is empty.

**Auth:** Admin session only

```bash
curl -X PUT https://your-store-api.example.com/api/v1/distributors/config \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "distributor_program_name": "Dealer Programme",
    "distributor_auto_approve": true,
    "distributor_max_percent": 50
  }'
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| distributor_addon_enabled | boolean | No | Enable/disable the addon |
| distributor_program_name | string | No | Programme name |
| distributor_terms | string | No | Terms text |
| distributor_auto_approve | boolean | No | Auto-approve setting |
| distributor_qty_basis | string | No | `order` or `line` |
| distributor_max_percent | number | No | Max discount (0–100) |
| distributor_stack_with_coupons | boolean | No | Allow coupon stacking |
| distributor_exclude_sale_items | boolean | No | Exclude sale items |
| distributor_show_product_cta | boolean | No | Show storefront CTA |
| distributor_cta_text | string | No | CTA text |

**Response:** Same shape as GET /distributors/config.

**Gotchas:**
- Setting `distributor_addon_enabled: true` seeds default bands only if the bands table is empty.
- Config is cached for 30 seconds; expect a slight delay before storefront sees changes.

## Discount Bands

The store-wide discount ladder: quantity thresholds and corresponding percentages. Individual distributors can override with custom bands or a flat rate.

### GET /distributors/bands - List discount bands

Fetch all quantity-based discount bands, ordered by minimum quantity ascending.

**Auth:** Admin session only

```bash
curl -X GET https://your-store-api.example.com/api/v1/distributors/bands \
  -H "Cookie: connect.sid=..."
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "bands": [
      {
        "id": 1,
        "min_qty": 10,
        "percent": 5,
        "label": "Bronze",
        "enabled": true,
        "created_at": "2026-09-23T10:00:00Z",
        "updated_at": "2026-09-23T10:00:00Z"
      },
      {
        "id": 2,
        "min_qty": 25,
        "percent": 10,
        "label": "Silver",
        "enabled": true,
        "created_at": "2026-09-23T10:00:00Z",
        "updated_at": "2026-09-23T10:00:00Z"
      }
    ]
  }
}
```

### POST /distributors/bands - Create a discount band

Add a new band to the store ladder. Rejects if a band for the same min_qty already exists (min_qty is the band's unique key).

**Auth:** Admin session only

```bash
curl -X POST https://your-store-api.example.com/api/v1/distributors/bands \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "min_qty": 100,
    "percent": 20,
    "label": "Platinum"
  }'
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| min_qty | integer | Yes | Minimum quantity to qualify |
| percent | number | Yes | Discount percentage (clamped to max_percent) |
| label | string | No | Optional tier name (max 120 chars) |
| enabled | boolean | No | Default true |

**Response:**
```json
{
  "status": "success",
  "data": {
    "band": {
      "id": 5,
      "min_qty": 100,
      "percent": 20,
      "label": "Platinum",
      "enabled": true,
      "created_at": "2026-09-23T12:30:00Z",
      "updated_at": "2026-09-23T12:30:00Z"
    }
  }
}
```

**Status codes:**
- `201`: Band created successfully.
- `400`: Invalid min_qty or percent.
- `409`: A band for this min_qty already exists.

### PUT /distributors/bands/:id - Update a band

Modify min_qty, percent, label, or enabled status. Rejects if the new min_qty clashes with an existing band.

**Auth:** Admin session only

```bash
curl -X PUT https://your-store-api.example.com/api/v1/distributors/bands/1 \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "percent": 8,
    "label": "Bronze Plus"
  }'
```

| Field | Type | Description |
| --- | --- | --- |
| min_qty | integer | New minimum quantity |
| percent | number | New discount percentage |
| label | string | New label |
| enabled | boolean | Enabled/disabled |

**Response:** Updated band object.

### DELETE /distributors/bands/:id - Delete a band

Remove a band from the store ladder. Does not affect existing orders (discount is snapshotted at checkout).

**Auth:** Admin session only

```bash
curl -X DELETE https://your-store-api.example.com/api/v1/distributors/bands/5 \
  -H "Cookie: connect.sid=..."
```

**Response:**
```json
{
  "status": "success",
  "message": "Band deleted"
}
```

## Distributor Management

Manage approved dealers and their pricing overrides.

### GET /distributors - List distributors

Fetch paginated distributor accounts. Searchable by company name or customer email/name.

**Auth:** Admin session only

```bash
curl -X GET 'https://your-store-api.example.com/api/v1/distributors?page=1&limit=25&status=approved&search=acme' \
  -H "Cookie: connect.sid=..."
```

| Parameter | Type | Description |
| --- | --- | --- |
| page | integer | Page number (default 1) |
| limit | integer | Rows per page (default 25, max 100) |
| status | string | Filter: `all`, `pending`, `approved`, `rejected`, `suspended` |
| search | string | Search company name, customer email, or name |

**Response:**
```json
{
  "status": "success",
  "data": {
    "distributors": [
      {
        "id": 1,
        "customer_id": 42,
        "company_name": "Acme Trading Ltd",
        "status": "approved",
        "override_percent": null,
        "custom_bands": null,
        "notes": "Reliable, 2-year track record",
        "approved_at": "2026-06-15T09:00:00Z",
        "approved_by": 5,
        "rejection_reason": null,
        "created_at": "2026-06-01T11:00:00Z",
        "customer": {
          "id": 42,
          "email": "purchasing@acme.example.com",
          "first_name": "Jane",
          "last_name": "Smith",
          "phone": "+254700000002"
        }
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 25
  }
}
```

### GET /distributors/:id - Get distributor details

Fetch a single distributor including their effective pricing bands and recent orders.

**Auth:** Admin session only

```bash
curl -X GET https://your-store-api.example.com/api/v1/distributors/1 \
  -H "Cookie: connect.sid=..."
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "distributor": {
      "id": 1,
      "customer_id": 42,
      "company_name": "Acme Trading",
      "status": "approved",
      "override_percent": null,
      "custom_bands": null,
      "notes": "Premium account",
      "approved_at": "2026-06-15T09:00:00Z",
      "approved_by": 5,
      "rejection_reason": null,
      "created_at": "2026-06-01T11:00:00Z",
      "customer": { "id": 42, "email": "...", "first_name": "Jane", "last_name": "Smith", "phone": "..." }
    },
    "effective_bands": [
      { "min_qty": 10, "percent": 5, "label": "Bronze" },
      { "min_qty": 25, "percent": 10, "label": "Silver" },
      { "min_qty": 50, "percent": 15, "label": "Gold" },
      { "min_qty": 100, "percent": 20, "label": "Platinum" }
    ],
    "orders": [
      {
        "id": 501,
        "order_number": "ORD-20260923-001",
        "status": "completed",
        "total": 1500.00,
        "distributor_discount": 150.00,
        "created_at": "2026-09-20T14:30:00Z"
      }
    ]
  }
}
```

### PUT /distributors/:id/status - Update approval status

Change a distributor's status (pending → approved → suspended, etc.). Stores approval timestamp and the approver's user ID.

**Auth:** Admin session only

```bash
curl -X PUT https://your-store-api.example.com/api/v1/distributors/1/status \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "suspended",
    "reason": "Late payment issues"
  }'
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| status | string | Yes | One of: `pending`, `approved`, `rejected`, `suspended` |
| reason | string | No | Required when status is `rejected`; max 500 chars |

**Response:** Updated distributor object.

**Gotchas:**
- Approving a distributor stamps the current time and your user ID. Suspending later preserves the original approval timestamp.

### PUT /distributors/:id/pricing - Set pricing overrides

Configure flat-rate or tiered pricing for a specific distributor, overriding the store-wide bands.

**Auth:** Admin session only

```bash
curl -X PUT https://your-store-api.example.com/api/v1/distributors/1/pricing \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "override_percent": 15,
    "notes": "Negotiated flat 15% rate"
  }'
```

| Field | Type | Description |
| --- | --- | --- |
| override_percent | number | Flat discount (0–100); null to clear |
| custom_bands | array | Custom MOQ ladder; null or [] to clear |
| notes | string | Internal notes (max 2000 chars) |

**Response:** Updated distributor object.

**Discount resolution (most-specific wins):**
1. `override_percent` — flat rate for any quantity
2. `custom_bands` — distributor's own MOQ ladder
3. Store-wide bands (from GET /distributors/bands)

## Per-Product Wholesale Pricing

Configure product-specific wholesale prices, minimum order quantities, and tiered pricing.

### GET /distributors/product-pricing - List products with pricing

Fetch all products that have distributor-specific pricing configured. Searchable by name, SKU, or notes.

**Auth:** Admin session only

```bash
curl -X GET 'https://your-store-api.example.com/api/v1/distributors/product-pricing?search=widget' \
  -H "Cookie: connect.sid=..."
```

| Parameter | Type | Description |
| --- | --- | --- |
| search | string | Filter by product name, SKU, or notes |

**Response:**
```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 10,
        "product_id": 5,
        "wholesale_price": 25.00,
        "moq": 10,
        "bands": [
          { "min_qty": 50, "mode": "price", "value": 22.00, "label": "Bulk" },
          { "min_qty": 100, "mode": "price", "value": 20.00, "label": "Large" }
        ],
        "rrp": 49.99,
        "enabled": true,
        "notes": "Primary wholesale sku",
        "created_at": "2026-09-01T10:00:00Z",
        "product": {
          "id": 5,
          "name": "Premium Widget",
          "sku": "WDG-001",
          "price": 49.99,
          "sale_price": null,
          "images": [
            { "id": 1, "url": "https://cdn.example.com/product-1.jpg" }
          ]
        }
      }
    ],
    "total": 1
  }
}
```

### PUT /distributors/product-pricing/:productId - Upsert product pricing

Create or update per-product wholesale pricing. Idempotent — call with the same productId and new values to update.

**Auth:** Admin session only

```bash
curl -X PUT https://your-store-api.example.com/api/v1/distributors/product-pricing/5 \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "wholesale_price": 25.00,
    "moq": 10,
    "bands": [
      { "min_qty": 50, "mode": "price", "value": 22.00, "label": "Bulk" },
      { "min_qty": 100, "mode": "price", "value": 20.00, "label": "Large" }
    ],
    "rrp": 49.99,
    "enabled": true,
    "notes": "Primary wholesale SKU"
  }'
```

| Field | Type | Description |
| --- | --- | --- |
| wholesale_price | number | Base wholesale price |
| moq | integer | Minimum order quantity |
| bands | array | Tiered pricing by quantity |
| rrp | number | Recommended retail price (for admin reference) |
| enabled | boolean | Whether this pricing is active |
| notes | string | Internal notes (max 500 chars) |

**Band structure:**
| Field | Type | Description |
| --- | --- | --- |
| min_qty | integer | Minimum quantity to qualify |
| mode | string | `price` (fixed price) or `percent` (discount %) |
| value | number | The price or percentage |
| label | string | Optional tier name |

**Response:**
```json
{
  "status": "success",
  "data": {
    "pricing": {
      "id": 10,
      "product_id": 5,
      "wholesale_price": 25.00,
      "moq": 10,
      "bands": [
        { "min_qty": 50, "mode": "price", "value": 22.00, "label": "Bulk" },
        { "min_qty": 100, "mode": "price", "value": 20.00, "label": "Large" }
      ],
      "rrp": 49.99,
      "enabled": true,
      "notes": "Primary wholesale SKU",
      "created_at": "2026-09-01T10:00:00Z"
    }
  }
}
```

### DELETE /distributors/product-pricing/:productId - Delete product pricing

Remove wholesale pricing configuration for a product.

**Auth:** Admin session only

```bash
curl -X DELETE https://your-store-api.example.com/api/v1/distributors/product-pricing/5 \
  -H "Cookie: connect.sid=..."
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "deleted": true
  }
}
```

### POST /distributors/product-pricing/bulk - Bulk import pricing

Mass-upsert product pricing from a CSV or JSON file. Invalid rows are silently skipped (returns error details for up to 25 rows). Useful for wholesale catalogue imports.

**Auth:** Admin session only

```bash
curl -X POST https://your-store-api.example.com/api/v1/distributors/product-pricing/bulk \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product_id": 5,
        "wholesale_price": 25.00,
        "moq": 10,
        "bands": [
          { "min_qty": 50, "mode": "price", "value": 22.00 },
          { "min_qty": 100, "mode": "price", "value": 20.00 }
        ],
        "enabled": true
      },
      {
        "product_id": 6,
        "wholesale_price": 15.00,
        "moq": 20,
        "enabled": true
      }
    ]
  }'
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| items | array | Yes | Array of product pricing objects |
| product_id | integer | Yes | Product ID |
| wholesale_price | number | No | Base wholesale price |
| moq | integer | No | Minimum order quantity |
| bands | array | No | Tiered pricing bands |
| rrp | number | No | Recommended retail price |
| enabled | boolean | No | Active/inactive (default true) |
| notes | string | No | Notes (max 500 chars) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "saved": 2,
    "skipped": 0,
    "errors": []
  }
}
```

**If there are errors:**
```json
{
  "status": "success",
  "data": {
    "saved": 1,
    "skipped": 1,
    "errors": [
      {
        "index": 1,
        "product_id": 999,
        "reason": "product not found"
      }
    ]
  }
}
```

**Gotchas:**
- Rows with missing or invalid `product_id` are skipped.
- Malformed bands are silently dropped; if all bands fail, the row is still upserted with other fields.
- Error details are limited to the first 25 rows.
