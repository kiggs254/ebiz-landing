## 11. Customers API

### GET /customers - List Customers

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page |
| `search` | string | - | Search by email, first name, or last name |

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/customers?page=1&limit=20" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "customers": [
      {
        "id": 42,
        "email": "customer@example.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "phone": "+254712345678",
        "total_orders": 5,
        "total_spent": 12500,
        "addresses": [
          {
            "id": 1,
            "type": "shipping",
            "address1": "Westlands Road",
            "city": "Nairobi",
            "state": "Nairobi",
            "zip": "00100",
            "country": "Kenya"
          }
        ],
        "created_at": "2026-01-15T10:00:00.000Z"
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET /customers/:id - Get Single Customer

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/customers/42" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "customer": {
      "id": 42,
      "email": "customer@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "phone": "+254712345678",
      "total_orders": 5,
      "total_spent": 12500,
      "addresses": [...],
      "notes": [...],
      "orders": [...],
      "created_at": "2026-01-15T10:00:00.000Z"
    }
  }
}
```

---

### GET /customers/:id/loyalty - Loyalty balance & ledger

Returns the customer's loyalty points balance, lifetime points earned, and up to 50 recent ledger entries (earn, redeem, adjust).

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/customers/42/loyalty" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "points_balance": 320,
    "lifetime_earned": 500,
    "ledger": [
      {
        "id": 1,
        "type": "earn",
        "points": 50,
        "order_id": 101,
        "note": "Earned on order ORD-..."
      }
    ]
  }
}
```

---

### Loyalty points (addon)

Shop-scoped settings are stored as **ShopSetting** keys (merged into admin `GET /settings`). Update with `PUT /api/v1/settings/shop/:key` and JSON body `{ "value": "..." }`.

| Key | Description |
|-----|-------------|
| `loyalty_points_enabled` | `true` / `false` - master toggle |
| `loyalty_award_trigger` | `payment_paid`, `order_completed`, or `either` |
| `loyalty_points_per_currency_unit` | Points earned per 1.00 of order **subtotal** (floor) |
| `loyalty_min_order_subtotal_to_earn` | Minimum subtotal to earn any points |
| `loyalty_points_per_currency_discount` | Points required per 1.00 discount at checkout (e.g. `100` = 100 pts = 1.00 off) |
| `loyalty_max_redeem_percent` | Max discount from points as % of merchandise subtotal |
| `loyalty_min_points_to_redeem` | Minimum points per redemption |
| `loyalty_min_checkout_total` | Minimum cart subtotal before redemption is allowed |
| `loyalty_otp_ttl_minutes` | Email OTP lifetime |
| `loyalty_redemption_token_ttl_minutes` | Session token lifetime after OTP verification |

**Storefront (public):**

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/v1/storefront/loyalty/config` | Safe config for the checkout UI |
| POST | `/api/v1/storefront/loyalty/preview` | Body: `email`, `items` (same shape as checkout), optional `coupon_code` - eligibility, balance, max points |
| POST | `/api/v1/storefront/loyalty/redemption/send-otp` | Body: `email` - sends verification code |
| POST | `/api/v1/storefront/loyalty/redemption/verify-otp` | Body: `email`, `code` - returns `redemption_token` for the session |
| POST | `/api/v1/storefront/checkout/create-order` | Optional body field `loyalty_redemption: { "token", "points" }` (with cart, coupon, etc.) |

Points are awarded idempotently per order when the configured trigger matches (e.g. payment marked paid). Redemption requires a valid OTP-derived token and deducts points in the same database transaction as order creation.

---

