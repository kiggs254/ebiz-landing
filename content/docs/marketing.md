## Marketing & Loyalty API

The Marketing module provides full management of coupons, newsletter contacts, loyalty points, abandoned carts, and marketing automation campaigns. All endpoints require admin session or API key authentication (Basic Auth or `X-API-Key` header) unless noted otherwise.

**Base path:** `/api/v1/marketing`

---

### GET /marketing - Marketing Overview

Returns aggregate counts across all marketing features, including loyalty program stats.

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/marketing" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "coupons": 12,
    "contacts": 340,
    "abandoned_carts": 8,
    "automation_campaigns": 3,
    "loyalty": {
      "enrolled": 156,
      "points_outstanding": 24800,
      "pending_registrations": 4
    }
  }
}
```

---

## Contacts

Manage newsletter and marketing email subscribers.

### GET /marketing/contacts - List Contacts

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 20 | Items per page (max 200) |
| `offset` | integer | 0 | Pagination offset |
| `search` | string | - | Filter by email (partial match) |

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/marketing/contacts?limit=10&search=gmail" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "contacts": [
      {
        "id": 1,
        "email": "jane@gmail.com",
        "status": "active",
        "source": "footer",
        "createdAt": "2025-03-15T10:30:00.000Z"
      }
    ],
    "total": 1
  }
}
```

### GET /marketing/contacts/stats - Contact Statistics

Returns total, active, and unsubscribed contact counts.

```bash
curl -X GET "https://your-store.com/api/v1/marketing/contacts/stats" \
  -u "ck_xxx:cs_yyy"
```

```json
{
  "status": "success",
  "data": {
    "total": 340,
    "active": 312,
    "unsubscribed": 28
  }
}
```

### POST /marketing/contacts - Create Contact

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Contact email address |
| `source` | string | No | Where the contact came from (default: `"api"`) |
| `status` | string | No | `"active"` or `"unsubscribed"` (default: `"active"`) |

If a contact with the same email already exists, it is reactivated and updated (returns 200 instead of 201).

```bash
curl -X POST "https://your-store.com/api/v1/marketing/contacts" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{"email": "new@example.com", "source": "import"}'
```

### PUT /marketing/contacts/:id - Update Contact

| Field | Type | Description |
|-------|------|-------------|
| `status` | string | `"active"` or `"unsubscribed"` |
| `source` | string | Update the source label |

```bash
curl -X PUT "https://your-store.com/api/v1/marketing/contacts/42" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{"status": "unsubscribed"}'
```

### DELETE /marketing/contacts/:id - Delete Contact

```bash
curl -X DELETE "https://your-store.com/api/v1/marketing/contacts/42" \
  -u "ck_xxx:cs_yyy"
```

---

## Coupons

Full CRUD for discount coupons, plus validation for external checkout integrations.

### GET /marketing/coupons - List Coupons

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 20 | Items per page (max 200) |
| `offset` | integer | 0 | Pagination offset |
| `search` | string | - | Filter by coupon code or description |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "coupons": [
      {
        "id": 1,
        "code": "SUMMER25",
        "type": "percentage",
        "value": "25.00",
        "usage_limit": 100,
        "usage_count": 34,
        "min_purchase": "1000.00",
        "start_date": "2025-06-01T00:00:00.000Z",
        "end_date": "2025-08-31T23:59:59.000Z",
        "status": "active",
        "usages": []
      }
    ],
    "total": 12
  }
}
```

### GET /marketing/coupons/stats - Coupon Statistics

```json
{
  "status": "success",
  "data": {
    "total": 12,
    "active": 8,
    "expired": 4,
    "total_usage": 156
  }
}
```

### POST /marketing/coupons - Create Coupon

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | Coupon code (stored uppercase) |
| `type` | string | No | `"percentage"` or `"fixed"` (default: `"percentage"`) |
| `value` | number | Yes | Discount value |
| `usage_limit` | integer | No | Max total uses (null = unlimited) |
| `start_date` | datetime | Yes | When the coupon becomes valid |
| `end_date` | datetime | No | When the coupon expires |
| `min_purchase` | number | No | Minimum cart total required |
| `status` | string | No | `"active"` or `"inactive"` (default: `"active"`) |

```bash
curl -X POST "https://your-store.com/api/v1/marketing/coupons" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "WELCOME10",
    "type": "percentage",
    "value": 10,
    "start_date": "2025-07-01T00:00:00.000Z",
    "usage_limit": 500,
    "min_purchase": 500
  }'
```

### GET /marketing/coupons/:id - Get Coupon

Returns a single coupon with its usage records.

### PUT /marketing/coupons/:id - Update Coupon

Accepts the same fields as create. Only include fields you want to change.

### DELETE /marketing/coupons/:id - Delete Coupon

### GET /marketing/coupons/:id/usage - Coupon Usage History

Returns all usage records for a coupon, including the associated order details.

### POST /marketing/coupons/:id/validate - Validate Coupon

Check if a coupon is currently valid. Optionally pass a cart total to preview the discount amount — useful for external checkout integrations.

| Field | Type | Description |
|-------|------|-------------|
| `cart_total` | number | Cart subtotal for discount preview |

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/marketing/coupons/1/validate" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{"cart_total": 5000}'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "valid": true,
    "coupon": {
      "id": 1,
      "code": "SUMMER25",
      "type": "percentage",
      "value": "25.00"
    },
    "discount_preview": {
      "cart_total": 5000,
      "discount_amount": 1250,
      "final_total": 3750
    }
  }
}
```

When invalid, the response includes a `reason`:

```json
{
  "status": "success",
  "data": {
    "valid": false,
    "reason": "Coupon has expired"
  }
}
```

---

## Loyalty Program

Manage the built-in loyalty points program: view configuration, check balances, adjust points, browse the ledger, and approve registrations.

### GET /marketing/loyalty/config - Loyalty Configuration

Returns the full loyalty program settings. If loyalty is disabled, returns the config with `enabled: false`.

```bash
curl -X GET "https://your-store.com/api/v1/marketing/loyalty/config" \
  -u "ck_xxx:cs_yyy"
```

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "points_per_currency": 1,
    "currency_per_point": 0.5,
    "min_redeem": 100,
    "max_redeem_percent": 50,
    "require_approval": true,
    "earn_on_statuses": ["completed"]
  }
}
```

### GET /marketing/loyalty/stats - Loyalty Statistics

Returns aggregate stats. If loyalty is disabled, returns `{ enabled: false }`.

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "enrolled": 156,
    "points_outstanding": 24800,
    "total_earned": 89200,
    "total_redeemed": 64400,
    "pending_registrations": 4
  }
}
```

### GET /marketing/loyalty/balances - List Customer Balances

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 20 | Items per page (max 200) |
| `offset` | integer | 0 | Pagination offset |
| `search` | string | - | Search by customer email or name |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "balances": [
      {
        "id": 1,
        "customer_id": 42,
        "points": 450,
        "lifetime_earned": 1200,
        "lifetime_redeemed": 750,
        "customer": {
          "id": 42,
          "email": "jane@example.com",
          "first_name": "Jane",
          "last_name": "Doe"
        }
      }
    ],
    "total": 156
  }
}
```

### GET /marketing/loyalty/balances/:customer_id - Single Customer Balance

Returns the balance, customer info, and loyalty registration status.

```bash
curl -X GET "https://your-store.com/api/v1/marketing/loyalty/balances/42" \
  -u "ck_xxx:cs_yyy"
```

### POST /marketing/loyalty/adjust - Adjust Points

Manually add or deduct loyalty points. Creates a ledger entry with type `"adjust"`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customer_id` | integer | Yes | Target customer |
| `points` | integer | Yes | Positive to add, negative to deduct |
| `note` | string | Yes | Reason for the adjustment |

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/marketing/loyalty/adjust" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{"customer_id": 42, "points": 500, "note": "Loyalty bonus for VIP customer"}'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "balance": {
      "customer_id": 42,
      "points": 950,
      "lifetime_earned": 1700
    },
    "ledger_entry": {
      "id": 234,
      "customer_id": 42,
      "type": "adjust",
      "points": 500,
      "note": "Loyalty bonus for VIP customer",
      "meta": { "adjusted_by": "api" },
      "createdAt": "2025-07-20T14:30:00.000Z"
    }
  }
}
```

Returns 400 if a deduction would take the balance below zero.

### GET /marketing/loyalty/ledger - Points Ledger

Browse all loyalty point transactions across customers.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 50 | Items per page (max 200) |
| `offset` | integer | 0 | Pagination offset |
| `customer_id` | integer | - | Filter by customer |
| `type` | string | - | Filter: `"earn"`, `"redeem"`, or `"adjust"` |
| `from` | date | - | Start date (inclusive) |
| `to` | date | - | End date (inclusive) |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "entries": [
      {
        "id": 234,
        "customer_id": 42,
        "type": "earn",
        "points": 120,
        "note": "Order #ORD-1720000000000",
        "meta": { "order_id": 456 },
        "createdAt": "2025-07-15T09:00:00.000Z",
        "customer": {
          "email": "jane@example.com",
          "first_name": "Jane",
          "last_name": "Doe"
        }
      }
    ],
    "total": 892
  }
}
```

### GET /marketing/loyalty/registrations - List Registrations

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 20 | Items per page (max 200) |
| `offset` | integer | 0 | Pagination offset |
| `status` | string | - | Filter: `"pending"`, `"approved"`, `"rejected"` |

### PUT /marketing/loyalty/registrations/:id - Approve / Reject Registration

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | Yes | `"approved"` or `"rejected"` |
| `rejection_reason` | string | When rejecting | Reason shown to the customer |

```bash
curl -X PUT "https://your-store.com/api/v1/marketing/loyalty/registrations/7" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{"status": "approved"}'
```

---

## Abandoned Carts

Track and recover abandoned shopping carts.

### GET /marketing/abandoned-carts - List Abandoned Carts

Returns abandoned carts with associated order details.

### GET /marketing/abandoned-carts/count/unviewed - Unviewed Count

Returns the count of abandoned carts that haven't been reviewed yet.

### PATCH /marketing/abandoned-carts/:id/view - Mark as Viewed

### DELETE /marketing/abandoned-carts/:id - Delete Cart

### POST /marketing/abandoned-carts/:id/trigger-automation - Trigger Recovery

Manually trigger the cart recovery automation for a specific abandoned cart.

| Field | Type | Description |
|-------|------|-------------|
| `force` | boolean | Set `true` to re-send from step 1 even if already triggered |

---

## Marketing Automation

Configure and monitor automated email campaigns (cart recovery, welcome series, etc.). Requires the Marketing Automation addon to be enabled.

### GET /marketing/automation/status - Addon Status

Returns whether marketing automation is enabled.

### GET /marketing/automation/campaigns - List Campaigns

Returns all automation campaigns. Creates defaults on first access if none exist.

### GET /marketing/automation/campaigns/:type - Get Campaign

Returns a single campaign by type with its full configuration.

### PUT /marketing/automation/campaigns/:type - Update Campaign

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | boolean | Enable or disable the campaign |
| `config_json` | object | Campaign configuration (delays, templates, etc.) |

### GET /marketing/automation/runs - Automation Run History

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | 50 | Items per page (max 200) |
| `offset` | integer | 0 | Pagination offset |

### GET /marketing/automation/template-variables - Template Variables

Returns the available placeholder variables for email templates.

### POST /marketing/automation/templates/enhance - AI-Enhance Template

Uses AI to improve an email template's subject line and content.

| Field | Type | Description |
|-------|------|-------------|
| `subject` | string | Current subject line |
| `content` | string | Current email content |
| `objective` | string | Campaign objective |
| `audience` | string | Target audience description |

---

## Public Endpoint

### POST /marketing/subscribe - Newsletter Subscription

**No authentication required.** Creates or reactivates a marketing contact.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Subscriber email |
| `source` | string | No | Subscription source (default: `"footer"`) |

```bash
curl -X POST "https://your-store.com/api/v1/marketing/subscribe" \
  -H "Content-Type: application/json" \
  -d '{"email": "subscriber@example.com"}'
```
