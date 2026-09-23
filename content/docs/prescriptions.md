The Prescriptions addon enables pharmacies and healthcare retailers to accept, verify, and fulfill prescriptions through E-biz. Customers upload prescription documents, staff verify them, and orders are created on demand.

**Addon:** Prescriptions — all endpoints return 503 when the addon is switched off in Settings → Addons.

**Auth:** All endpoints require admin session authentication and the `prescriptions:view` or `prescriptions:manage` permission.

---

## Reading and listing prescriptions

### GET /prescriptions - List prescriptions

Retrieves a paginated list of prescriptions with optional filtering by status or search term (customer name, email, phone).

**Auth:** Admin session with `prescriptions:view` permission

**Addon:** Prescriptions — returns 503 when disabled.

```bash
curl -X GET "https://your-store-api.example.com/api/v1/prescriptions?page=1&limit=25&status=pending&search=john" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `page` | integer | No | Page number (default 1) |
| `limit` | integer | No | Items per page, max 100 (default 25) |
| `status` | string | No | Filter by status: `pending`, `verified`, `rejected`, `expired`, or `all` (default all) |
| `search` | string | No | Search by customer name, email, or phone |

**Response:**
```json
{
  "status": "success",
  "data": {
    "prescriptions": [
      {
        "id": 1,
        "customer_id": 42,
        "customer_name": "John Doe",
        "customer_email": "john@example.com",
        "customer_phone": "+254700000002",
        "file_url": "https://cdn.example.com/prescriptions/file_1.pdf",
        "file_name": "prescription.pdf",
        "mime_type": "application/pdf",
        "file_size": 245000,
        "status": "pending",
        "admin_notes": null,
        "verified_by": null,
        "verified_at": null,
        "expires_at": null,
        "max_refills": 1,
        "refills_used": 0,
        "shipping_address_line1": "123 Main St",
        "shipping_address_line2": null,
        "shipping_city": "Nairobi",
        "shipping_state": null,
        "shipping_zip": "00100",
        "shipping_country": "KE",
        "customer": {
          "id": 42,
          "first_name": "John",
          "last_name": "Doe",
          "email": "john@example.com",
          "phone": "+254700000002"
        },
        "verifier": null,
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
      }
    ],
    "total": 42,
    "page": 1,
    "totalPages": 2
  }
}
```

**Gotchas:**
- The `search` parameter looks across customer name, email, and phone using case-insensitive matching.
- Prescriptions are sorted by most recent first (`created_at DESC`).
- Pagination limit is capped at 100 items per page.

---

### GET /prescriptions/stats - Prescription statistics

Returns quick counts of prescriptions grouped by verification status.

**Auth:** Admin session with `prescriptions:view` permission

**Addon:** Prescriptions — returns 503 when disabled.

```bash
curl -X GET "https://your-store-api.example.com/api/v1/prescriptions/stats" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "pending": 5,
    "verified": 12,
    "rejected": 2,
    "expired": 1,
    "total": 20
  }
}
```

---

### GET /prescriptions/:id - Get prescription details

Retrieves a single prescription with full details including customer info and linked orders.

**Auth:** Admin session with `prescriptions:view` permission

**Addon:** Prescriptions — returns 503 when disabled.

```bash
curl -X GET "https://your-store-api.example.com/api/v1/prescriptions/1" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "prescription": {
      "id": 1,
      "customer_id": 42,
      "session_id": null,
      "customer_name": "John Doe",
      "customer_email": "john@example.com",
      "customer_phone": "+254700000002",
      "file_url": "https://cdn.example.com/prescriptions/file_1.pdf",
      "file_name": "prescription.pdf",
      "mime_type": "application/pdf",
      "file_size": 245000,
      "status": "pending",
      "admin_notes": "Waiting for pharmacist review",
      "verified_by": null,
      "verified_at": null,
      "expires_at": null,
      "max_refills": 1,
      "refills_used": 0,
      "shipping_address_line1": "123 Main St",
      "shipping_address_line2": "Apt 4B",
      "shipping_city": "Nairobi",
      "shipping_state": null,
      "shipping_zip": "00100",
      "shipping_country": "KE",
      "customer": {
        "id": 42,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com",
        "phone": "+254700000002"
      },
      "verifier": null,
      "orders": [],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Errors:**
- `404` if prescription not found.

---

## Verifying and managing prescriptions

### PUT /prescriptions/:id/verify - Verify prescription

Marks a prescription as verified. Staff can optionally set expiry date, max refills, and notes. The request captures the verifying staff member's ID and timestamp.

**Auth:** Admin session with `prescriptions:manage` permission

**Addon:** Prescriptions — returns 503 when disabled.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/prescriptions/1/verify" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "admin_notes": "Verified against patient file. Valid for 90 days.",
    "expires_at": "2024-04-15T23:59:59Z",
    "max_refills": 3
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `admin_notes` | string | No | Staff notes (e.g., pharmacist review comments) |
| `expires_at` | string (ISO 8601) | No | Prescription expiry date |
| `max_refills` | integer | No | Maximum refills allowed (defaults to 1) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "prescription": {
      "id": 1,
      "status": "verified",
      "admin_notes": "Verified against patient file. Valid for 90 days.",
      "verified_by": 5,
      "verified_at": "2024-01-15T11:00:00Z",
      "expires_at": "2024-04-15T23:59:59Z",
      "max_refills": 3,
      "refills_used": 0
    }
  }
}
```

**Gotchas:**
- Setting `expires_at` or `max_refills` is optional; omit them to keep existing values.
- `verified_by` is set to the logged-in staff member's ID automatically.

---

### PUT /prescriptions/:id/reject - Reject prescription

Marks a prescription as rejected. Captures the rejecting staff member's ID and timestamp. Typically used when the prescription is invalid, expired, or not supported.

**Auth:** Admin session with `prescriptions:manage` permission

**Addon:** Prescriptions — returns 503 when disabled.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/prescriptions/1/reject" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "admin_notes": "Prescription expired. Patient should contact their doctor."
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `admin_notes` | string | No | Reason for rejection or other notes |

**Response:**
```json
{
  "status": "success",
  "data": {
    "prescription": {
      "id": 1,
      "status": "rejected",
      "admin_notes": "Prescription expired. Patient should contact their doctor.",
      "verified_by": 5,
      "verified_at": "2024-01-15T11:05:00Z"
    }
  }
}
```

---

### PUT /prescriptions/:id/notes - Update prescription notes

Updates the admin notes field only. Does not change verification status.

**Auth:** Admin session with `prescriptions:manage` permission

**Addon:** Prescriptions — returns 503 when disabled.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/prescriptions/1/notes" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "admin_notes": "Patient called to confirm delivery address."
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `admin_notes` | string | Yes | Staff notes |

**Response:**
```json
{
  "status": "success",
  "data": {
    "prescription": {
      "id": 1,
      "admin_notes": "Patient called to confirm delivery address."
    }
  }
}
```

---

## Creating orders and cleanup

### POST /prescriptions/:id/create-order - Create order from prescription

Creates an order from a prescription. If the prescription customer (by email) does not match an existing customer, a new customer is created automatically. The order is sourced as `admin`, subtotal is calculated from product prices, and a shipping address is built from the prescription's address fields. The prescription's `refills_used` counter is incremented, and the order is linked via the `OrderPrescription` join table.

**Auth:** Admin session with `prescriptions:manage` permission

**Addon:** Prescriptions — returns 503 when disabled.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/prescriptions/1/create-order" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "product_id": 101,
        "quantity": 1,
        "variant_id": null
      },
      {
        "product_id": 102,
        "quantity": 2,
        "variant_id": 205
      }
    ],
    "notes": "Refill #1 from prescription"
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `items` | array | Yes | List of order items (at least one) |
| `items[].product_id` | integer | Yes | Product ID |
| `items[].quantity` | integer | Yes | Quantity (minimum 1) |
| `items[].variant_id` | integer | No | Variant ID if the product is variable |
| `notes` | string | No | Order notes; defaults to "Created from prescription #id" |

**Response:**
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 999,
      "order_number": "ORD-00999",
      "customer_id": 42,
      "status": "pending",
      "payment_status": "pending",
      "subtotal": "500.00",
      "shipping": "0.00",
      "tax": "0.00",
      "discount": "0.00",
      "total": "500.00",
      "source": "admin",
      "customer_notes": "Refill #1 from prescription",
      "created_at": "2024-01-15T11:10:00Z"
    }
  },
  "message": "Order ORD-00999 created from prescription"
}
```

**Gotchas:**
- **Pricing:** Order items use the product's `sale_price` if set; otherwise `price`.
- **Customer creation:** If the prescription customer email matches no existing customer, a new one is created with `first_name`, `last_name`, and `phone` parsed from prescription fields.
- **Addresses:** A shipping address is created from prescription address fields; missing values default to `"—"` (for street if empty) or `null` (for state, zip).
- **Refunds:** The prescription's `refills_used` counter is incremented automatically.
- **Branches addon:** If the Branches addon is enabled with a default branch configured, the order is created under that branch.
- **Item validation:** The endpoint skips items whose product ID is not found (no error).

**Errors:**
- `400` if `items` array is missing, empty, or no customer information exists.
- `404` if prescription not found.

---

### DELETE /prescriptions/:id - Delete prescription

Permanently deletes a prescription record. Use cautiously; deleted prescriptions cannot be recovered.

**Auth:** Admin session with `prescriptions:manage` permission

**Addon:** Prescriptions — returns 503 when disabled.

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/prescriptions/1" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Response:**
```json
{
  "status": "success",
  "message": "Prescription deleted"
}
```

**Errors:**
- `404` if prescription not found.

---

## Common errors

| Error | Cause | Remedy |
|-------|-------|--------|
| 503 service unavailable | Addon disabled | Check instance Settings → Addons |
| 404 not found | Prescription doesn't exist | Verify the prescription ID |
| 400 bad request | Invalid field values (empty items array, missing customer info) | Check request body against endpoint spec |
