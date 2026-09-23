Enable recurring product deliveries and subscription billing. The **Subscriptions addon** powers subscription packages, recurring payment processing, and automated delivery reminders. All endpoints require admin/API authentication unless noted otherwise, and return `503` when the addon is switched off (Settings → Addons).

---

## Packages

### GET /subscriptions/packages - List packages

List all subscription packages with pagination, filtering, and search.

**Auth:** API key or admin session

```bash
curl "https://your-store-api.example.com/api/v1/subscriptions/packages?page=1&limit=20&status=active&search=produce" \
  -H "Authorization: Basic <credentials>"
```

| Query param | Type | Description |
|---|---|---|
| `page` | number | Default 1 |
| `limit` | number | Default 20 |
| `status` | string | "active", "inactive", or omit for all |
| `search` | string | Search by package name |

**Response:**
```json
{
  "status": "success",
  "data": {
    "packages": [
      {
        "id": 7,
        "name": "Weekly Produce Box",
        "description": "Fresh vegetables and fruits every week",
        "image_url": "https://example.com/produce-box.jpg",
        "rrp": 5000,
        "price": 4000,
        "weekly_price": 1000,
        "billing_cycle": "monthly",
        "delivery_frequency": "weekly",
        "delivery_zone": "Nairobi",
        "status": "active",
        "is_popular": true,
        "subscribers_count": 12,
        "items_count": 2,
        "created_at": "2026-09-23T10:30:00.000Z",
        "updated_at": "2026-09-23T10:30:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 20
  }
}
```

**Status codes:**
- `200` — Packages list
- `503` — Addon disabled

---

### POST /subscriptions/packages - Create package

Create a new subscription package with optional items (products and quantities).

**Auth:** API key or admin session  
**Addon:** Subscriptions — returns 503 when switched off.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/subscriptions/packages" \
  -H "Authorization: Basic <credentials>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Weekly Produce Box",
    "description": "Fresh vegetables and fruits every week",
    "image_url": "https://example.com/produce-box.jpg",
    "rrp": 5000,
    "price": 4000,
    "weekly_price": 1000,
    "billing_cycle": "monthly",
    "delivery_frequency": "weekly",
    "delivery_zone": "Nairobi",
    "status": "active",
    "is_popular": true,
    "items": [
      { "product_id": 12, "quantity": 3 },
      { "product_id": 45, "quantity": 2 }
    ]
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Package name |
| `description` | string | No | Marketing description |
| `image_url` | string | No | Package hero image |
| `rrp` | number | No | Recommended retail price |
| `price` | number | If no weekly_price | Monthly price in base currency |
| `weekly_price` | number | If no price | Weekly price (does not auto-multiply) |
| `billing_cycle` | string | No | e.g., "monthly", "quarterly" |
| `delivery_frequency` | string | No | e.g., "weekly", "bi-weekly" |
| `delivery_zone` | string | No | Geographic area served |
| `status` | string | No | "active" or "inactive" (default: active) |
| `is_popular` | boolean | No | Flag for storefront display |
| `items` | array | No | Array of {product_id, quantity} objects |

**Response:**
```json
{
  "status": "success",
  "data": {
    "package": {
      "id": 7,
      "name": "Weekly Produce Box",
      "description": "Fresh vegetables and fruits every week",
      "image_url": "https://example.com/produce-box.jpg",
      "rrp": 5000,
      "price": 4000,
      "weekly_price": 1000,
      "billing_cycle": "monthly",
      "delivery_frequency": "weekly",
      "delivery_zone": "Nairobi",
      "status": "active",
      "is_popular": true,
      "subscribers_count": 0,
      "items_count": 2,
      "items": [
        {
          "id": 23,
          "product_id": 12,
          "quantity": 3,
          "product": {
            "id": 12,
            "name": "Tomatoes (1kg)",
            "price": "250.00",
            "sale_price": null,
            "sku": "TOM-001",
            "status": "active"
          }
        }
      ],
      "created_at": "2026-09-23T10:30:00.000Z",
      "updated_at": "2026-09-23T10:30:00.000Z"
    }
  }
}
```

**Status codes:**
- `201` — Package created
- `400` — Missing name and/or price
- `503` — Addon disabled

---

### GET /subscriptions/packages/:id - Get package

Retrieve a single subscription package with all items and products.

**Auth:** API key or admin session

```bash
curl "https://your-store-api.example.com/api/v1/subscriptions/packages/7" \
  -H "Authorization: Basic <credentials>"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "package": {
      "id": 7,
      "name": "Weekly Produce Box",
      "price": 4000,
      "items": [ ... ]
    }
  }
}
```

**Status codes:**
- `200` — Package retrieved
- `404` — Package not found
- `503` — Addon disabled

---

### PUT /subscriptions/packages/:id - Update package

Update an existing subscription package. The `items` array, if provided, replaces all items.

**Auth:** API key or admin session

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/subscriptions/packages/7" \
  -H "Authorization: Basic <credentials>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Produce Box",
    "price": 5000,
    "items": [
      { "product_id": 12, "quantity": 5 },
      { "product_id": 45, "quantity": 3 },
      { "product_id": 78, "quantity": 2 }
    ]
  }'
```

**Status codes:**
- `200` — Package updated
- `404` — Package not found
- `503` — Addon disabled

---

### DELETE /subscriptions/packages/:id - Delete package

Delete a subscription package. If the package has active or pending_payment subscribers, it is deactivated instead (status set to inactive). Packages with no active subscribers are fully deleted, unlinked from orders.

**Auth:** API key or admin session

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/subscriptions/packages/7" \
  -H "Authorization: Basic <credentials>"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Package deleted"
  }
}
```

**Gotcha:** Deleting a package with active subscribers deactivates it instead, preserving subscriber billing.

**Status codes:**
- `200` — Deleted or deactivated
- `404` — Package not found
- `503` — Addon disabled

---

## Subscribers

### GET /subscriptions/subscribers - List subscriptions

List all subscriptions with filtering, search, and pagination. Results are branch-scoped when the `X-Branch-Id` header is sent.

**Auth:** API key or admin session

```bash
curl "https://your-store-api.example.com/api/v1/subscriptions/subscribers?page=1&limit=20&status=active&search=john" \
  -H "Authorization: Basic <credentials>"
```

| Query param | Type | Description |
|---|---|---|
| `page` | number | Default 1 |
| `limit` | number | Default 20 |
| `status` | string | One of: active, pending_payment, cancelled, paused, all |
| `search` | string | Customer email, name, or package name |
| `package_id` | number | Filter by package |
| `customer_id` | number | Filter by customer |
| `X-Branch-Id` | header | Branch ID or 'all'; filters results |

**Response:**
```json
{
  "status": "success",
  "data": {
    "subscribers": [
      {
        "id": 15,
        "package_id": 7,
        "customer_id": 42,
        "status": "active",
        "current_period_start": "2026-09-23T00:00:00.000Z",
        "current_period_end": "2026-10-23T00:00:00.000Z",
        "next_delivery_date": "2026-09-29T00:00:00.000Z",
        "next_payment_date": "2026-10-23T00:00:00.000Z",
        "customer": {
          "id": 42,
          "email": "john@example.com",
          "first_name": "John",
          "last_name": "Doe"
        },
        "package": {
          "id": 7,
          "name": "Weekly Produce Box",
          "price": 4000
        }
      }
    ],
    "total": 47,
    "page": 1,
    "limit": 20
  }
}
```

**Status codes:**
- `200` — Subscriptions list
- `503` — Addon disabled

---

### POST /subscriptions/subscribers - Create subscription

Create a new subscription for a customer on a package. Sets `current_period_start` and `current_period_end` to now + 1 month, and `next_delivery_date` to next Monday.

**Auth:** API key or admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/subscriptions/subscribers" \
  -H "Authorization: Basic <credentials>" \
  -H "Content-Type: application/json" \
  -d '{
    "package_id": 7,
    "customer_id": 42,
    "status": "active"
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `package_id` | number | Yes | ID of the package |
| `customer_id` | number | Yes | ID of the customer |
| `status` | string | No | "active" or "pending_payment" (default: active); sets `last_payment_date` if active |

**Response:**
```json
{
  "status": "success",
  "data": {
    "subscription": {
      "id": 15,
      "package_id": 7,
      "customer_id": 42,
      "status": "active",
      "current_period_start": "2026-09-23T10:30:00.000Z",
      "current_period_end": "2026-10-23T10:30:00.000Z",
      "next_delivery_date": "2026-09-28T00:00:00.000Z",
      "next_payment_date": "2026-10-23T10:30:00.000Z",
      "last_payment_date": "2026-09-23T10:30:00.000Z",
      "payment_method": "pesapal",
      "customer": { ... },
      "package": { ... }
    }
  }
}
```

**Status codes:**
- `201` — Subscription created
- `400` — Missing package_id or customer_id
- `404` — Package or customer not found
- `503` — Addon disabled

---

### GET /subscriptions/subscribers/:id - Get subscription

Retrieve a subscription with full details: customer, package, items, orders (last 20), and transactions.

**Auth:** API key or admin session

```bash
curl "https://your-store-api.example.com/api/v1/subscriptions/subscribers/15" \
  -H "Authorization: Basic <credentials>"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "subscription": {
      "id": 15,
      "package_id": 7,
      "customer_id": 42,
      "status": "active",
      "current_period_start": "2026-09-23T10:30:00.000Z",
      "current_period_end": "2026-10-23T10:30:00.000Z",
      "next_delivery_date": "2026-09-28T00:00:00.000Z",
      "next_payment_date": "2026-10-23T10:30:00.000Z",
      "last_payment_date": "2026-09-23T10:30:00.000Z",
      "payment_method": "pesapal",
      "delivery_day_of_week": null,
      "pesapal_subscription_ref": null,
      "branch_id": null,
      "customer": {
        "id": 42,
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+254700000002"
      },
      "package": {
        "id": 7,
        "name": "Weekly Produce Box",
        "price": 4000,
        "items": [
          {
            "id": 23,
            "product_id": 12,
            "quantity": 3,
            "product": {
              "id": 12,
              "name": "Tomatoes (1kg)",
              "price": "250.00",
              "sale_price": null,
              "sku": "TOM-001",
              "images": [ ... ]
            }
          }
        ]
      },
      "orders": [
        {
          "id": 501,
          "order_number": "ORD-20260923-001",
          "status": "completed",
          "payment_status": "paid",
          "total": 4000,
          "currency": "KES",
          "created_at": "2026-09-23T10:35:00.000Z",
          "transactions": [ ... ]
        }
      ],
      "created_at": "2026-09-23T10:30:00.000Z",
      "updated_at": "2026-09-23T10:35:00.000Z"
    }
  }
}
```

**Status codes:**
- `200` — Subscription retrieved
- `403` — Access denied (branch-scoped)
- `404` — Subscription not found
- `503` — Addon disabled

---

### PATCH /subscriptions/subscribers/:id - Update subscription

Update subscription status, delivery date, or switch to a different package. When status is set to `cancelled`, both `next_delivery_date` and `next_payment_date` are cleared automatically.

**Auth:** API key or admin session

```bash
curl -X PATCH "https://your-store-api.example.com/api/v1/subscriptions/subscribers/15" \
  -H "Authorization: Basic <credentials>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "paused",
    "next_delivery_date": "2026-10-05T00:00:00.000Z"
  }'
```

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | One of: active, pending_payment, cancelled, paused |
| `next_delivery_date` | ISO8601 | Override next delivery date |
| `package_id` | number | Switch to a different package |

**Response:**
```json
{
  "status": "success",
  "data": {
    "subscription": { ... }
  }
}
```

**Gotcha:** Cancelling (status → cancelled) clears `next_delivery_date` and `next_payment_date`.

**Status codes:**
- `200` — Subscription updated
- `403` — Access denied (branch-scoped)
- `404` — Subscription not found
- `503` — Addon disabled

---

### DELETE /subscriptions/subscribers/:id - Delete subscription

Delete a subscription. Only cancelled subscriptions can be deleted. Associated orders are unlinked but not deleted.

**Auth:** API key or admin session

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/subscriptions/subscribers/15" \
  -H "Authorization: Basic <credentials>"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "message": "Subscription deleted"
  }
}
```

**Gotcha:** Cannot delete an active or pending subscription. Cancel first.

**Status codes:**
- `200` — Deleted
- `400` — Subscription not cancelled
- `403` — Access denied (branch-scoped)
- `404` — Subscription not found
- `503` — Addon disabled

---

## Payment & Reminders

### GET /subscriptions/payment-callback - Handle payment callback

Process a Pesapal payment confirmation webhook. Query parameters from the payment gateway.  
**No authentication required. Not gated by addon setting** (allows confirmations for existing subscribers).

```bash
curl "https://your-store-api.example.com/api/v1/subscriptions/payment-callback?OrderTrackingId=abc123&OrderMerchantReference=SUB-15"
```

| Query param | Description |
|---|---|
| `OrderTrackingId` | Pesapal tracking ID |
| `OrderMerchantReference` | Must match `SUB-{subscription_id}` |

**Response:**
```json
{
  "status": "success",
  "data": {
    "payment_status": "completed"
  }
}
```

**Status codes:**
- `200` — Payment processed
- `400` — Missing or invalid parameters
- `404` — Subscription not found
- `500` — Pesapal gateway not configured

---

### POST /subscriptions/payment-callback - Handle payment callback (POST)

Same as GET, accepts POST for Pesapal IPN. **No authentication required.**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/subscriptions/payment-callback" \
  -H "Content-Type: application/json" \
  -d '{
    "OrderTrackingId": "abc123",
    "OrderMerchantReference": "SUB-15"
  }'
```

**Status codes:**
- `200` — Payment processed
- `400` — Missing or invalid parameters
- `404` — Subscription not found
- `500` — Pesapal gateway not configured

---

### POST /subscriptions/subscribers/:id/payment-link - Generate payment link

Generate a Pesapal payment link for subscription renewal. Uses the package's monthly price.

**Auth:** API key or admin session  
**Addon:** Subscriptions — returns 503 when switched off.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/subscriptions/subscribers/15/payment-link" \
  -H "Authorization: Basic <credentials>"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "payment_link": "https://pesapal.com/api/v2/redirect-portal?...",
    "payment_result": { ... }
  }
}
```

**Status codes:**
- `200` — Link generated
- `400` — Subscription incomplete
- `404` — Subscription not found
- `500` — Pesapal gateway not configured
- `503` — Addon disabled

---

### POST /subscriptions/subscribers/:id/send-reminder - Send payment reminder

Send a manual payment renewal reminder via email and/or WhatsApp. Includes a Pesapal payment link if the gateway is configured.

**Auth:** API key or admin session  
**Addon:** Subscriptions — returns 503 when switched off.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/subscriptions/subscribers/15/send-reminder" \
  -H "Authorization: Basic <credentials>" \
  -H "Content-Type: application/json" \
  -d '{
    "channels": ["email", "whatsapp"]
  }'
```

| Field | Type | Description |
|-------|------|-------------|
| `channels` | array | At least one of: "email", "whatsapp" |

**Response:**
```json
{
  "status": "success",
  "data": {
    "email_sent": true,
    "whatsapp_sent": true,
    "email_error": null,
    "whatsapp_error": null,
    "payment_link": "https://pesapal.com/api/v2/redirect-portal?..."
  }
}
```

**Gotcha:** If email or WhatsApp send fails, the respective error is returned but the request succeeds with `200`. Check the `*_error` fields for details.

**Status codes:**
- `200` — Reminder sent (check error fields)
- `400` — No channels specified or subscription incomplete
- `404` — Subscription not found
- `503` — Addon disabled
