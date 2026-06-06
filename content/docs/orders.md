## 10. Orders API

### GET /orders - List Orders

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 20 | Items per page |
| `status` | string | - | Filter: `pending`, `processing`, `completed`, `cancelled` |
| `search` | string | - | Search by order number or customer email |

Each order in the list includes an **`items`** array (full line rows, not only a count). Every element includes **`product`** (with **`images`**, primary **`category`**, **`categories`**, **`brand`**, **`tags`**) and **`variant`** when applicable, matching `GET /orders/:id`. **`items_count`** is also set for convenience.

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/orders?page=1&limit=20&status=completed" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": 123,
        "order_number": "ORD-1709468833000",
        "customer_id": 42,
        "status": "completed",
        "payment_status": "paid",
        "subtotal": "2400.00",
        "shipping": "300.00",
        "tax": "0.00",
        "discount": "0.00",
        "total": "2700.00",
        "currency": "KES",
        "customer": {
          "id": 42,
          "email": "customer@example.com",
          "first_name": "Jane",
          "last_name": "Doe"
        },
        "items_count": 2,
        "items": [
          {
            "id": 1,
            "order_id": 123,
            "product_id": 101,
            "variant_id": 1001,
            "name": "Organic Flour 1kg",
            "sku": "FLOUR-ORG-1KG",
            "quantity": 2,
            "price": "1200.00",
            "product": {
              "id": 101,
              "name": "Organic Flour 1kg",
              "slug": "organic-flour-1kg",
              "sku": "FLOUR-ORG-1KG",
              "images": [{ "id": 1, "url": "/uploads/...", "alt": null, "order": 0 }],
              "category": { "id": 5, "name": "Baking", "slug": "baking" },
              "categories": [],
              "brand": { "id": 2, "name": "Shopflow", "slug": "shopflow" },
              "tags": []
            },
            "variant": {
              "id": 1001,
              "sku": "FLOUR-ORG-1KG",
              "price": "1200.00",
              "attributes_json": "{\"Size\":\"1kg\"}"
            }
          }
        ],
        "source": "api",
        "api_label": "WooCommerce",
        "order_date": "2024-12-25T10:30:00.000Z",
        "created_at": "2026-03-04T10:00:00.000Z"
      }
    ],
    "total": 50,
    "page": 1,
    "limit": 20
  }
}
```

> **`source`** - `"api"` for API-created orders, `"admin"` for orders created in the dashboard, `null` for legacy orders. The admin displays an **API** badge for `source === "api"` orders.
>
> **`api_label`** - The custom label set by the API caller (e.g. `"WooCommerce"`). Shown on the badge in the admin orders table instead of the default "API".
>
> **`order_date`** - The actual order date provided by your system. `null` when not set (admin falls back to `created_at`).

---

### GET /orders/:id - Get Single Order

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/orders/123" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 123,
      "order_number": "ORD-1709468833000",
      "customer_id": 42,
      "status": "completed",
      "payment_status": "paid",
      "subtotal": "2400.00",
      "shipping": "300.00",
      "tax": "0.00",
      "discount": "0.00",
      "total": "2700.00",
      "currency": "KES",
      "customer": {
        "id": 42,
        "email": "customer@example.com",
        "first_name": "Jane",
        "last_name": "Doe",
        "phone": "+254712345678"
      },
      "items": [
        {
          "id": 1,
          "order_id": 123,
          "product_id": 101,
          "variant_id": 1001,
          "name": "Organic Flour 1kg",
          "sku": "FLOUR-ORG-1KG",
          "quantity": 2,
          "price": "1200.00",
          "product": {
            "id": 101,
            "name": "Organic Flour 1kg",
            "slug": "organic-flour-1kg",
            "description": "...",
            "images": [],
            "category": { "id": 5, "name": "Baking", "slug": "baking" },
            "categories": [],
            "brand": { "id": 2, "name": "Shopflow", "slug": "shopflow" },
            "tags": [{ "id": 1, "name": "Gluten free", "slug": "gluten-free" }]
          },
          "variant": {
            "id": 1001,
            "sku": "FLOUR-ORG-1KG",
            "price": "1200.00",
            "sale_price": null,
            "stock": 50,
            "attributes_json": "{\"Size\":\"1kg\"}"
          }
        }
      ],
      "addresses": [
        {
          "type": "shipping",
          "name": "Jane Doe",
          "street": "Westlands Road, Apt 4B",
          "city": "Nairobi",
          "state": "Nairobi",
          "zip": "00100",
          "country": "Kenya"
        }
      ],
      "notes": [],
      "transactions": [],
      "created_at": "2026-03-04T10:00:00.000Z",
      "updated_at": "2026-03-04T10:00:00.000Z"
    }
  }
}
```

---

### POST /orders - Create Order

**Request Body:**

```json
{
  "customer_email": "jane@example.com",
  "subtotal": 2400,
  "shipping": 300,
  "tax": 0,
  "discount": 0,
  "total": 2700,
  "currency": "KES",
  "status": "pending",
  "payment_status": "paid",
  "payment_method": "mpesa",
  "payment_reference": "MPESA-QAB123XYZ",
  "items": [
    {
      "product_id": 101,
      "variant_id": 1001,
      "name": "Organic Flour 1kg",
      "sku": "FLOUR-ORG-1KG",
      "quantity": 2,
      "price": 1200
    },
    {
      "product_id": 102,
      "name": "Simple Product",
      "sku": "SIMPLE-001",
      "quantity": 1,
      "price": 500
    }
  ],
  "addresses": [
    {
      "type": "shipping",
      "name": "Jane Doe",
      "street": "Westlands Road, Apt 4B",
      "city": "Nairobi",
      "state": "Nairobi",
      "zip": "00100",
      "country": "Kenya"
    }
  ]
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `customer_email` | string | Yes* | Customer email (find existing or create guest customer). Preferred for integrations. |
| `email` | string | Yes* | Alternative to `customer_email` when `customer_id` is omitted. |
| `customer_id` | integer | Yes* | Legacy: existing customer ID. If set with an email, both must match the same customer. |
| `subtotal` | number | Yes | Sum of item prices |
| `shipping` | number | Yes | Shipping cost |
| `tax` | number | Yes | Tax amount |
| `discount` | number | Yes | Discount amount |
| `total` | number | Yes | Grand total |
| `currency` | string | Yes | ISO 4217 code (e.g. USD, KES) |
| `status` | string | No | `pending` (default), `processing`, `completed`, `cancelled` |
| `payment_status` | string | No | `pending` (default), `paid` |
| `payment_method` | string | No | Payment method used - free-form string, e.g. `mpesa`, `cash`, `bank_transfer`, `cod`, `card`. Stored on the order and on the auto-created transaction record. |
| `payment_reference` | string | No | Payment / transaction reference (e.g. M-Pesa code). When `payment_status` is `paid` and this is set, a transaction record is created automatically. Also accepted as `transaction_reference`. |
| `coupon_id` | integer | No | Coupon ID if applied |
| `items` | array | Yes | Order line items |
| `addresses` | array | No | Shipping and/or billing addresses. Omit if address is not applicable (e.g. POS, phone order). You can provide a free-form address - only `type` is required by the system; all other address fields are optional. |
| `order_date` | string (ISO 8601) | No | Actual date the order was placed in the originating system (e.g. `"2024-12-31T14:30:00Z"`). Use this when syncing historical orders so the admin dashboard reflects the real order date. Defaults to the submission time when omitted. |
| `api_label` | string | No | Optional display label shown as a badge on the order in the admin (max 100 chars). Useful to identify the source system, e.g. `"WooCommerce"`, `"ERP"`, `"POS"`. When omitted the badge simply shows **API**. |

\*Provide **`customer_email`** (or **`email`**) **or** **`customer_id`** - not all three as conflicting identifiers.

Optional when creating a new customer from email: **`customer_first_name`**, **`customer_last_name`**, **`customer_phone`** (or **`first_name`**, **`last_name`**, **`phone`**). Name defaults may be taken from the shipping address `name` line.

**Item Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_id` | integer | Yes | Product ID |
| `variant_id` | integer | No | Variant ID for variable products |
| `name` | string | Yes | Product/variant name |
| `sku` | string | Yes | SKU |
| `quantity` | integer | Yes | Quantity |
| `price` | number | Yes | Unit price |

**Address Fields** _(all optional - include what you have)_:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | Yes | `shipping` or `billing` |
| `name` | string | No | Full name |
| `street` | string | No | Street address |
| `city` | string | No | City |
| `state` | string | No | State/region |
| `zip` | string | No | Postal code |
| `country` | string | No | Country name or code |

> **Address is optional.** For phone orders, POS, or integrations that don't collect address details, you can omit `addresses` entirely or pass only a partial address. The order will be saved without address data.

**Example Request - Minimal (no address):**

```bash
curl -X POST "https://your-store.com/api/v1/orders" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "jane@example.com",
    "subtotal": 2400,
    "shipping": 0,
    "tax": 0,
    "discount": 0,
    "total": 2400,
    "currency": "KES",
    "items": [
      {
        "product_id": 101,
        "name": "Organic Flour 1kg",
        "sku": "FLOUR-ORG-1KG",
        "quantity": 2,
        "price": 1200
      }
    ]
  }'
```

**Example Request - With paid status and payment reference:**

```bash
curl -X POST "https://your-store.com/api/v1/orders" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "jane@example.com",
    "subtotal": 2400,
    "shipping": 300,
    "tax": 0,
    "discount": 0,
    "total": 2700,
    "currency": "KES",
    "payment_status": "paid",
    "payment_method": "mpesa",
    "payment_reference": "MPESA-QAB123XYZ",
    "items": [
      {
        "product_id": 101,
        "variant_id": 1001,
        "name": "Organic Flour 1kg",
        "sku": "FLOUR-ORG-1KG",
        "quantity": 2,
        "price": 1200
      }
    ],
    "addresses": [
      {
        "type": "shipping",
        "name": "Jane Doe",
        "street": "Westlands Road, Apt 4B",
        "city": "Nairobi",
        "country": "Kenya"
      }
    ]
  }'
```

**Example Request - With order date and API label:**

```bash
curl -X POST "https://your-store.com/api/v1/orders" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_email": "jane@example.com",
    "subtotal": 2400,
    "shipping": 300,
    "tax": 0,
    "discount": 0,
    "total": 2700,
    "currency": "KES",
    "payment_status": "paid",
    "payment_method": "mpesa",
    "payment_reference": "MPESA-QAB123XYZ",
    "order_date": "2024-12-25T10:30:00Z",
    "api_label": "WooCommerce",
    "items": [
      { "product_id": 101, "name": "Organic Flour 1kg", "sku": "FLOUR-ORG-1KG", "quantity": 2, "price": 1200 }
    ]
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 124,
      "order_number": "ORD-1709468834000",
      "customer_id": 42,
      "status": "pending",
      "payment_status": "paid",
      "payment_method": "mpesa",
      "subtotal": "2400.00",
      "shipping": "300.00",
      "tax": "0.00",
      "discount": "0.00",
      "total": "2700.00",
      "currency": "KES",
      "source": "api",
      "api_label": "WooCommerce",
      "order_date": "2024-12-25T10:30:00.000Z",
      "created_at": "2026-03-04T10:00:00.000Z"
    }
  }
}
```

> **`source`** is automatically set to `"api"` for all orders created via API key. The admin orders table shows an **API** badge (or your custom `api_label`) on these orders.
>
> **`order_date`** is the real date your system recorded the order. The admin dashboard displays this date so historical imports match their original timestamps.
>
> When `payment_status` is `paid` and `payment_reference` (or `transaction_reference`) is provided, a transaction record is created automatically - no need to call `/orders/:id/payment-status` separately.

---

### POST /orders/batch - Create Multiple Orders

Create up to **100 orders** in a single API call. Each order follows the same field spec as `POST /orders`. The response includes a `created` array (successful orders) and a `failed` array (with per-item error messages). The entire batch is logged as a single entry in the admin's **API Operation Logs** and can be undone with one click.

**Request Body:**

```json
{
  "orders": [
    {
      "customer_email": "alice@example.com",
      "subtotal": 500,
      "shipping": 50,
      "tax": 0,
      "discount": 0,
      "total": 550,
      "currency": "KES",
      "order_date": "2024-11-01T08:00:00Z",
      "api_label": "ERP Import",
      "items": [{ "product_id": 10, "name": "Item A", "sku": "A-001", "quantity": 1, "price": 500 }]
    },
    {
      "customer_email": "bob@example.com",
      "subtotal": 1200,
      "shipping": 100,
      "tax": 0,
      "discount": 0,
      "total": 1300,
      "currency": "KES",
      "order_date": "2024-11-02T09:15:00Z",
      "items": [{ "product_id": 11, "name": "Item B", "sku": "B-002", "quantity": 2, "price": 600 }]
    }
  ]
}
```

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/orders/batch" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{ "orders": [...] }'
```

**Example Response (207 Multi-Status):**

```json
{
  "status": "success",
  "data": {
    "created_count": 2,
    "failed_count": 0,
    "created": [ { "id": 125, "order_number": "ORD-...", ... }, { "id": 126, ... } ],
    "failed": []
  }
}
```

**Batch size limit:** 100 orders per request.

---

### PUT /orders/:id/status - Update Order Status

**Request Body:**

```json
{
  "status": "processing"
}
```

Valid statuses: `pending`, `processing`, `completed`, `cancelled`.

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/orders/123/status" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{"status":"processing"}'
```

---

### PATCH /orders/:id/payment-status - Update Payment Status

**Request Body:**

```json
{
  "payment_status": "paid",
  "transaction_reference": "MPESA-QAB123XYZ"
}
```

If `payment_status` is `paid` and `transaction_reference` is provided, a transaction record is created.

**Example Request:**

```bash
curl -X PATCH "https://your-store.com/api/v1/orders/123/payment-status" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{"payment_status":"paid","transaction_reference":"MPESA-QAB123XYZ"}'
```

---

### DELETE /orders/:id - Delete Order

**Example Request:**

```bash
curl -X DELETE "https://your-store.com/api/v1/orders/123" \
  -u "ck_xxx:cs_yyy"
```

---

