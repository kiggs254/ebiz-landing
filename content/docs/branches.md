## 12. Branches API

> **Note:** The Branches API is not available on the Home Chef deployment.

Branches allow multi-location management. Each branch can have its own integrations, and orders/products can be scoped to a specific branch.

### Branch Scoping

Include the `X-Branch-Id` header on any API request to scope it to a specific branch:

```bash
curl -X GET "https://your-store.com/api/v1/products" \
  -u "ck_xxx:cs_yyy" \
  -H "X-Branch-Id: 2"
```

When the `X-Branch-Id` header is present, the API filters results to that branch and associates newly created resources with it.

### GET /branches - List Branches

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/branches" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "branches": [
      {
        "id": 1,
        "name": "Main Store",
        "code": "MAIN",
        "address": "123 Main St, Nairobi",
        "phone": "+254700000000",
        "is_active": true,
        "created_at": "2026-01-15T10:00:00.000Z",
        "updated_at": "2026-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

### POST /branches - Create Branch

**Request Body:**

```json
{
  "name": "Downtown Branch",
  "code": "DT",
  "address": "456 Downtown Ave, Nairobi",
  "phone": "+254711111111",
  "is_active": true
}
```

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/branches" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Branch",
    "code": "DT",
    "address": "456 Downtown Ave, Nairobi",
    "phone": "+254711111111",
    "is_active": true
  }'
```

### GET /branches/:id - Get Single Branch

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/branches/1" \
  -u "ck_xxx:cs_yyy"
```

### PUT /branches/:id - Update Branch

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/branches/1" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Store (Updated)",
    "address": "789 New St, Nairobi"
  }'
```

Online ordering fields (enforced only when **Ordering hours** is on in the branch options):

| Field | Type | Notes |
|---|---|---|
| `accepting_orders` | boolean | `false` pauses storefront and WhatsApp orders for this branch |
| `ordering_hours` | object \| null | ISO weekday `"1"` (Mon) to `"7"` (Sun) → `[{ "open": "11:00", "close": "23:00" }]`, shop timezone. A close at or before the open runs past midnight. `null` means no restriction |
| `ordering_paused_message` | string \| null | Shown to customers while the branch isn't taking orders (max 300 characters) |

Staff orders and subscription renewals are never blocked by these.

### GET /branches/config - Branch Options

Returns how the shop uses branches. Works while the addon is off (`enabled: false`).

```json
{
  "status": "success",
  "data": {
    "options": {
      "enabled": true,
      "pricing_enabled": true,
      "availability_enabled": true,
      "unavailable_display": "hide",
      "stock_counts_enabled": false,
      "require_branch": true,
      "default_branch_id": null,
      "ordering_hours_enabled": false
    }
  }
}
```

| Option | Default | Effect |
|---|---|---|
| `pricing_enabled` | `false` | Each product and variant can have its own price, sale price and sale dates per branch. Checkout, WhatsApp and previews charge the branch price |
| `availability_enabled` | `true` | Honour each branch's "carried here" switch |
| `unavailable_display` | `hide` | `hide` leaves products a branch doesn't carry out of its listings; `sold_out` lists them marked sold out |
| `stock_counts_enabled` | `false` | Per-branch quantities. Customer orders are refused when the count can't cover them, staff orders floor at zero, and cancelling, refunding or deleting an order puts the stock back |
| `require_branch` | `false` | Storefront orders without a `branch_id` get a 400 |
| `default_branch_id` | `null` | Fills a missing branch on storefront, staff, prescription and subscription orders |
| `ordering_hours_enabled` | `false` | Enforce each branch's `accepting_orders` and `ordering_hours` (storefront/WhatsApp orders get a 409) |

### PUT /branches/config - Update Branch Options

Send only the options you want to change. Requires the branches **manage** permission.

```bash
curl -X PUT "https://your-store.com/api/v1/branches/config" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{ "pricing_enabled": true, "require_branch": true }'
```

### Per-branch product fields

When saving a product (`POST`/`PUT /products`), each `branch_stock` entry (on the product or a variant) accepts:

```json
{
  "branch_id": 2,
  "is_in_stock": true,
  "price": 950,
  "sale_price": 850,
  "sale_price_start_date": "2026-10-01T00:00:00Z",
  "sale_price_end_date": "2026-10-31T23:59:59Z",
  "stock_quantity": 40
}
```

Fields you leave out keep their saved value. `price: null` goes back to the product price and clears the branch sale. A branch sale price needs a branch price. `stock_quantity: null` means the branch doesn't count stock for that item.

### DELETE /branches/:id - Delete Branch

**Example Request:**

```bash
curl -X DELETE "https://your-store.com/api/v1/branches/1" \
  -u "ck_xxx:cs_yyy"
```

### GET /branches/:id/integrations - List Branch Integrations

Returns all integration configurations for a specific branch.

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/branches/1/integrations" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "integrations": [
      {
        "key": "woocommerce",
        "enabled": true,
        "config": {
          "store_url": "https://branch-store.example.com",
          "consumer_key": "ck_...",
          "consumer_secret": "cs_..."
        }
      }
    ]
  }
}
```

### PUT /branches/:id/integrations/:key - Update Branch Integration

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/branches/1/integrations/woocommerce" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "config": {
      "store_url": "https://branch-store.example.com",
      "consumer_key": "ck_new_key",
      "consumer_secret": "cs_new_secret"
    }
  }'
```

---

