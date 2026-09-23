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
        "phone": "+254700000002",
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

### POST /customers - Create Customer

Create a new customer account. At minimum, an email address is required.

**Auth:** API key or admin session required.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Customer email address (must be unique) |
| `first_name` | string | No | First name |
| `last_name` | string | No | Last name |
| `phone` | string | No | Phone number |
| `password` | string | No | Password (minimum 6 characters). If omitted, customer must use password reset flow to log in. |

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/customers" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "first_name": "Jane",
    "last_name": "Doe",
    "phone": "+254700000002",
    "password": "SecurePass123"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "customer": {
      "id": 42,
      "email": "jane@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "phone": "+254700000002",
      "created_at": "2026-01-15T10:00:00.000Z"
    }
  }
}
```

**Status Codes:**
- `201` - Customer created successfully
- `400` - Missing email or password too short
- `409` - Customer with this email already exists

**Gotchas:** Email addresses are case-insensitive and trimmed on both create and lookup. If password is omitted, the customer will need to request a password reset to set one for storefront login.

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
      "phone": "+254700000002",
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

### POST /customers/:id/notes - Add Customer Note

Add an internal note to a customer record. Notes are visible in the admin dashboard and used for order fulfillment context.

**Auth:** API key or admin session required.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | Note text (author and timestamp added automatically) |

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/customers/42/notes" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Customer prefers WhatsApp communication for delivery updates"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "note": {
      "id": 1,
      "customer_id": 42,
      "author_id": 5,
      "content": "Customer prefers WhatsApp communication for delivery updates",
      "created_at": "2026-01-15T10:15:00.000Z"
    }
  }
}
```

**Status Codes:**
- `201` - Note added successfully
- `404` - Customer not found

---

### DELETE /customers/:id - Delete Customer

Permanently delete a customer record and all associated data (addresses, notes, tags). Orders are not deleted but are disassociated from the customer.

**Auth:** API key or admin session required.

**Example Request:**

```bash
curl -X DELETE "https://your-store.com/api/v1/customers/42" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Customer deleted"
}
```

**Status Codes:**
- `200` - Customer deleted successfully
- `404` - Customer not found

**Gotchas:** Deletion is permanent and cannot be undone. Existing orders remain in the system but are no longer linked to the customer (customer_id becomes NULL). This allows order history and reporting to remain intact even after customer deletion.

---

### PUT /customers/:id/password - Update Customer Password

Set a new password for a customer account. Password must be at least 6 characters.

**Auth:** API key or admin session required.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `password` | string | Yes | New password (minimum 6 characters) |

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/customers/42/password" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NewSecurePass123"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Password updated"
}
```

**Status Codes:**
- `200` - Password updated successfully
- `400` - Password too short (less than 6 characters) or missing
- `404` - Customer not found

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

### GET /customers/loyalty-registrations - List Loyalty Registrations

Fetch pending, approved, or rejected loyalty program registrations with customer information.

**Auth:** API key or admin session required.

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `status` | string | pending | Filter by status: `pending`, `approved`, `rejected`, or `all` |
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page |

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/customers/loyalty-registrations?status=pending&page=1&limit=20" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "registrations": [
      {
        "id": 1,
        "customer_id": 42,
        "full_name": "Jane Doe",
        "phone": "+254700000002",
        "status": "pending",
        "id_image_url": null,
        "rejection_reason": null,
        "created_at": "2026-01-15T10:00:00.000Z",
        "updated_at": "2026-01-15T10:00:00.000Z",
        "customer": {
          "id": 42,
          "first_name": "Jane",
          "last_name": "Doe",
          "email": "jane@example.com",
          "phone": "+254700000002",
          "created_at": "2026-01-14T08:00:00.000Z"
        }
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 20
  }
}
```

**Status Codes:**
- `200` - Registrations listed successfully

---

### GET /customers/loyalty-registrations/:id - Get Loyalty Registration Details

Fetch a single loyalty program registration with customer information.

**Auth:** API key or admin session required.

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/customers/loyalty-registrations/1" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "registration": {
      "id": 1,
      "customer_id": 42,
      "full_name": "Jane Doe",
      "phone": "+254700000002",
      "status": "pending",
      "id_image_url": null,
      "rejection_reason": null,
      "created_at": "2026-01-15T10:00:00.000Z",
      "updated_at": "2026-01-15T10:00:00.000Z",
      "customer": {
        "id": 42,
        "first_name": "Jane",
        "last_name": "Doe",
        "email": "jane@example.com",
        "phone": "+254700000002",
        "created_at": "2026-01-14T08:00:00.000Z"
      }
    }
  }
}
```

**Status Codes:**
- `200` - Registration found
- `404` - Registration not found

---

### POST /customers/loyalty-registrations/:id/approve - Approve Loyalty Registration

Approve a pending loyalty program registration. Automatically creates a loyalty points balance for the customer if not already present.

**Auth:** API key or admin session required.

**Request Body:** Empty JSON object or omitted.

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/customers/loyalty-registrations/1/approve" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "registration": {
      "id": 1,
      "customer_id": 42,
      "full_name": "Jane Doe",
      "phone": "+254700000002",
      "status": "approved",
      "id_image_url": null,
      "rejection_reason": null,
      "created_at": "2026-01-15T10:00:00.000Z",
      "updated_at": "2026-01-15T10:30:00.000Z"
    }
  }
}
```

**Status Codes:**
- `200` - Registration approved
- `404` - Registration not found

**Gotchas:** Approving automatically initializes a loyalty points balance (with 0 points) if the customer doesn't already have one. This allows the loyalty system to track the customer even if they haven't yet earned any points.

---

### POST /customers/loyalty-registrations/:id/reject - Reject Loyalty Registration

Reject a loyalty program registration with an optional reason.

**Auth:** API key or admin session required.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | No | Optional rejection reason (stored for reference) |

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/customers/loyalty-registrations/1/reject" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "ID image not readable"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "registration": {
      "id": 1,
      "customer_id": 42,
      "full_name": "Jane Doe",
      "phone": "+254700000002",
      "status": "rejected",
      "id_image_url": null,
      "rejection_reason": "ID image not readable",
      "created_at": "2026-01-15T10:00:00.000Z",
      "updated_at": "2026-01-15T10:35:00.000Z"
    }
  }
}
```

**Status Codes:**
- `200` - Registration rejected
- `404` - Registration not found

---

### POST /customers/import - Bulk Import Customers

Import multiple customers and optionally create or approve loyalty registrations. Matches existing customers by phone number first, then email; updates fields if already found. Creates new customers when no match exists.

**Auth:** API key or admin session required.

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rows` | array | Yes | Array of customer objects (see field table below) |

**Row Object Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Conditional | Customer email. Required if creating a new customer and phone is not provided. |
| `phone` | string | Conditional | Customer phone. Used to match existing customers; can be used alone if customer already exists. |
| `first_name` | string | No | First name |
| `last_name` | string | No | Last name |
| `loyalty_status` | string | No | If set to `"active"`, creates or approves a loyalty registration for this customer and initializes loyalty balance. |
| `points_balance` | number | No | Initial loyalty points (only applied if creating a new loyalty balance; ignored if customer already has loyalty registration) |

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/customers/import" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "rows": [
      {
        "email": "jane@example.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "phone": "+254700000002",
        "loyalty_status": "active",
        "points_balance": 100
      },
      {
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Smith",
        "phone": "+254700000007"
      }
    ]
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "imported": 2,
    "skipped": 0,
    "errors": []
  }
```

**With Errors:**

```json
{
  "status": "success",
  "data": {
    "imported": 1,
    "skipped": 1,
    "errors": [
      {
        "row": 2,
        "identifier": "invalid_email",
        "error": "Valid phone or email is required"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Import completed (some or all rows may have succeeded)
- `400` - Missing or invalid `rows` array

**Gotchas:**
- **Matching:** Phone is matched first (preferred), then email. A row with both phone and email that match different existing customers will update the phone-matched customer.
- **New customer creation:** Requires at least an email address. Phone alone is insufficient to create a new customer account.
- **Loyalty registration:** Setting `loyalty_status: "active"` creates a registration and sets `status: "approved"` immediately. If a registration already exists for the customer and is in a different status, it updates to approved.
- **Points balance:** The `points_balance` field is only used on first loyalty balance creation. If a customer already has loyalty points, this field is ignored (existing balance is never overwritten).
- **Validation:** Each row is validated independently. Errors in one row do not stop processing of others; see the `errors` array in the response for details on which rows failed and why.

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

