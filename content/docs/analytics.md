Analytics endpoints provide real-time insights into your store's performance, including revenue, orders, customers, sales trends, product performance, payment methods, geographic distribution, and conversion metrics. All analytics endpoints require admin session authentication.

## Dashboard & Reporting

### GET /analytics - Full analytics dashboard

Returns comprehensive dashboard analytics for the specified time period, including revenue, orders, customers, sales trends, top products, category performance, payment methods, geographic distribution, customer segmentation, and conversion funnel. Optionally merges GA4 traffic and conversion data if configured.

**Auth:** Admin session only

Query params support preset periods (7d, 30d, 90d, 1y, today) or custom date ranges:

| Query param | Type | Description |
| --- | --- | --- |
| `period` | string | `7d`, `30d` (default), `90d`, `1y`, `today`, or `custom` |
| `range` | string | Legacy alias for `period` |
| `start_date` | string (ISO 8601) | Start date for custom range, e.g. `2025-01-01` |
| `end_date` | string (ISO 8601) | End date for custom range |

```bash
curl -b "shopflow.sid=your_session_cookie" \
  "https://api.example.com/api/v1/analytics?period=30d"
```

```json
{
  "status": "success",
  "data": {
    "revenue": {
      "total": 45000.50,
      "period": "period",
      "change": 12.5
    },
    "orders": {
      "total": 320,
      "period": "period",
      "change": 8.3
    },
    "customers": {
      "total": 285,
      "period": "period",
      "change": 15.2
    },
    "products": {
      "total": 1250,
      "period": "period",
      "change": 0
    },
    "sales_over_time": [
      {
        "date": "2025-01-15",
        "name": "2025-01-15",
        "revenue": 2450.75,
        "orders": 24
      }
    ],
    "top_products": [
      {
        "product_id": 412,
        "product_name": "Trail Runner Edition 02",
        "revenue": 8500.00,
        "orders": 50,
        "sales": 8500.00
      }
    ],
    "category_data": [
      {
        "name": "Running shoes",
        "sales": 15000.00,
        "orders": 95,
        "growth": 0
      }
    ],
    "monthly_revenue": [
      {
        "month": "2025-01",
        "revenue": 12500.75,
        "orders": 95,
        "growth": 0
      }
    ],
    "payment_methods": [
      {
        "method": "paystack",
        "amount": 22500.25,
        "percentage": 50
      }
    ],
    "time_of_day": [
      {
        "hour": "14:00",
        "orders": 45,
        "revenue": 6300.50
      }
    ],
    "geographic": [
      {
        "country": "Kenya",
        "sales": 35000.00,
        "orders": 280,
        "customers": 220
      }
    ],
    "customer_data": [
      {
        "period": "New",
        "value": 42,
        "color": "hsl(160, 100%, 35%)"
      },
      {
        "period": "Returning",
        "value": 58,
        "color": "hsl(217, 91%, 60%)"
      }
    ],
    "customer_stats": {
      "average_order_value": 140.63,
      "customer_lifetime_value": 157.89,
      "repeat_purchase_rate": 45.5
    },
    "conversion_funnel": [
      {
        "stage": "Visitors",
        "value": 0,
        "percentage": 100
      },
      {
        "stage": "Add to Cart",
        "value": 485,
        "percentage": 0
      },
      {
        "stage": "Checkout",
        "value": 485,
        "percentage": 0
      },
      {
        "stage": "Completed",
        "value": 320,
        "percentage": 65.98
      }
    ],
    "conversion_stats": {
      "overall_conversion_rate": 7.5,
      "cart_abandonment_rate": 92.5,
      "checkout_completion": 7.5
    },
    "traffic_sources": [],
    "traffic_stats": null
  }
}
```

**Metrics explained:**
- **Revenue, Orders, Customers, Products:** Current period totals plus `change` (percentage vs. prior period of equal length)
- **Sales Over Time:** Bucketed by day (up to 60 days), week (60–90 days), or month (90+ days)
- **Top Products:** Best 10 by revenue, with order count
- **Category Data:** Sales by product category, sorted by revenue
- **Payment Methods:** Breakdown by gateway (e.g. paystack, mpesa) with amount and percentage
- **Time of Day:** Orders and revenue by hour (UTC), 24 bars
- **Geographic:** By shipping country from order addresses; sorted by sales
- **Customer Data:** New vs Returning breakdown (percentages)
- **Customer Stats:** AOV (average order value), CLV (lifetime value), repeat purchase rate
- **Conversion Funnel:** Visitors → Cart → Checkout → Completed (internal; GA4 may override)
- **Traffic Sources & Stats:** Populated only when GA4 is configured (optional)

**Gotchas:**
- Period dates auto-compute if missing: 30 days before today by default. Bucket granularity (day/week/month) is automatic based on span.
- WhatsApp bot creates `is_provisional: true` customers during checkout; these are excluded from new customer counts.
- Orders count as "completed" if `status='completed'` OR `payment_status='paid'` (so partial shipments with payment count).

---

### GET /analytics/overview - Quick overview stats

Returns top-level metrics without time series or filtering. Use this for dashboard widgets that need fast, summary numbers.

**Auth:** Admin session only

No query params.

```bash
curl -b "shopflow.sid=your_session_cookie" \
  "https://api.example.com/api/v1/analytics/overview"
```

```json
{
  "status": "success",
  "data": {
    "totalRevenue": 125000.50,
    "totalOrders": 1050,
    "totalCustomers": 820,
    "totalProducts": 1250
  }
}
```

**Fields:**
- **totalRevenue:** Sum of all completed/paid orders across the shop (or branch if scoped)
- **totalOrders:** Count of all orders
- **totalCustomers:** Distinct customer count (excludes provisional customers)
- **totalProducts:** Total product count across catalog

---

### GET /analytics/revenue - Revenue-focused view

Focuses on revenue trends and payment breakdown for the specified period. Subset of the full dashboard (sales_over_time, payment_methods, time_of_day).

**Auth:** Admin session only

| Query param | Type | Description |
| --- | --- | --- |
| `period` | string | `7d`, `30d` (default), `90d`, `1y`, `today`, or `custom` |
| `range` | string | Legacy alias for `period` |
| `start_date` | string (ISO 8601) | Start date for custom range |
| `end_date` | string (ISO 8601) | End date for custom range |

```bash
curl -b "shopflow.sid=your_session_cookie" \
  "https://api.example.com/api/v1/analytics/revenue?period=7d"
```

```json
{
  "status": "success",
  "data": {
    "revenue": [
      {
        "month": "2025-01",
        "revenue": 12500.75,
        "orders": 95,
        "growth": 0
      }
    ],
    "sales_over_time": [
      {
        "date": "2025-01-15",
        "name": "2025-01-15",
        "revenue": 2450.75,
        "orders": 24
      }
    ],
    "payment_methods": [
      {
        "method": "paystack",
        "amount": 22500.25,
        "percentage": 50
      },
      {
        "method": "mpesa",
        "amount": 22500.25,
        "percentage": 50
      }
    ],
    "time_of_day": [
      {
        "hour": "14:00",
        "orders": 45,
        "revenue": 6300.50
      }
    ]
  }
}
```

**Fields:**
- **revenue:** Array of monthly (or daily for small ranges) revenue totals
- **sales_over_time:** Daily or weekly buckets depending on date span (same bucketing logic as full dashboard)
- **payment_methods:** Breakdown by gateway
- **time_of_day:** Hourly distribution (24 hours)

**Gotchas:**
- Same period/date logic as GET /analytics; bucket granularity is automatic.

---

## Transactions

### GET /transactions - List payment transactions

Retrieve a paginated list of all payment transactions (payments, refunds) with filtering and search, plus totals for revenue, refunds, and net revenue.

**Auth:** Admin session only

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | integer | 1 | Page number |
| `limit` | integer | 50 | Items per page |
| `type` | string | - | Filter by transaction type: `payment` or `refund` |
| `status` | string | - | Filter by status: `pending`, `completed`, `failed` |
| `method` | string | - | Filter by payment method: `credit_card`, `paystack`, `mpesa`, `pesapal`, `cash`, etc. |
| `search` | string | - | Search by transaction ID, method name, or associated order number |
| `start_date` | date (ISO 8601) | - | Filter transactions created on or after this date |
| `end_date` | date (ISO 8601) | - | Filter transactions created on or before this date |
| `branch_id` | integer | - | Filter by branch ID (when branches addon is enabled); omit or pass `all` for all branches |

**X-Branch-Id Header:** When the branches addon is enabled and a specific `X-Branch-Id` header is passed, the response includes only transactions from that branch plus branch-agnostic transactions (where `branch_id` is null). If omitted, accessible branches are determined by the user's role.

```bash
curl -X GET "https://your-store.com/api/v1/transactions?page=1&limit=50&status=completed&type=payment" \
  -H "X-Branch-Id: 1" \
  -b "connect.sid=your_session_cookie"
```

```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "id": 1,
        "transaction_id": "txn_1234567890abc",
        "type": "payment",
        "method": "paystack",
        "amount": "2500.00",
        "currency": "KES",
        "status": "completed",
        "order_id": 123,
        "branch_id": 1,
        "order": {
          "id": 123,
          "order_number": "ORD-1709468833000"
        },
        "created_at": "2024-12-25T10:30:00.000Z",
        "updated_at": "2024-12-25T10:30:00.000Z"
      },
      {
        "id": 2,
        "transaction_id": "txn_0987654321xyz",
        "type": "refund",
        "method": "paystack",
        "amount": "500.00",
        "currency": "KES",
        "status": "completed",
        "order_id": 124,
        "branch_id": null,
        "order": {
          "id": 124,
          "order_number": "ORD-1709468833001"
        },
        "created_at": "2024-12-26T14:15:00.000Z",
        "updated_at": "2024-12-26T14:15:00.000Z"
      }
    ],
    "total": 125,
    "page": 1,
    "limit": 50,
    "summary": {
      "total_revenue": "125000.00",
      "total_refunds": "5000.00",
      "net_revenue": "120000.00"
    }
  }
}
```

**Field Reference:**

| Field | Type | Description |
|-------|------|-------------|
| `transactions[]` | array | List of transaction objects |
| `transactions[].id` | integer | Internal transaction record ID |
| `transactions[].transaction_id` | string | External payment gateway transaction ID / reference |
| `transactions[].type` | string | `payment` or `refund` |
| `transactions[].method` | string | Payment method: `credit_card`, `paystack`, `mpesa`, `pesapal`, `cash`, etc. |
| `transactions[].amount` | string | Transaction amount as a decimal string |
| `transactions[].currency` | string | ISO 4217 currency code (e.g., `KES`) |
| `transactions[].status` | string | `pending`, `completed`, `failed` |
| `transactions[].order_id` | integer | Associated order ID |
| `transactions[].branch_id` | integer or null | Branch ID for multi-branch filtering; null for branch-agnostic transactions |
| `transactions[].order` | object | Minimal order reference: `{ id, order_number }` |
| `transactions[].created_at` | string (ISO 8601) | Transaction creation timestamp |
| `transactions[].updated_at` | string (ISO 8601) | Transaction last update timestamp |
| `total` | integer | Total transaction count (across all pages, before pagination) |
| `page` | integer | Current page number |
| `limit` | integer | Items per page |
| `summary.total_revenue` | string | Sum of all **completed** `payment` type transactions |
| `summary.total_refunds` | string | Sum of all **completed** `refund` type transactions |
| `summary.net_revenue` | string | `total_revenue - total_refunds` |

**Filtering Logic:**

- The `summary` totals are calculated from **all transactions in the database**, regardless of filters applied to the paginated list. They remain constant across pagination.
- Search performs a case-insensitive partial match across `transaction_id`, `method`, and associated `order.order_number` using SQL `iLike`.
- Date range filtering (`start_date`, `end_date`) operates on the transaction **`created_at`** timestamp (not `updated_at`).
- When a specific `branch_id` is supplied (via query param or `X-Branch-Id` header), results include transactions from that branch **or** transactions with no branch assignment (`branch_id` is null). If neither is provided, the user's allowed branches (from their role) determine visibility.
- Only authenticated (session-based) requests are permitted; API key authentication is not supported for this endpoint.

**Responses:**

- `200` – Success; see response schema above.
- `400` – Bad Request: invalid query parameters (e.g., malformed date format, invalid page/limit values).
- `401` – Unauthorized: missing session or session has expired.
- `403` – Forbidden: authenticated user lacks the `transactions` module permission.
