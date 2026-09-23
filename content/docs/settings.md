## Store Settings API

Manage all store configuration: general settings, email templates, payment gateways, currencies, shop identity, background operations, and asset storage. All endpoints require admin session authentication (`shopflow.sid` cookie) unless noted as public. Secrets are masked in responses as `••••••••` with companion `<key>_set` booleans showing whether a value is configured; send the real value only when changing it.

**Base path:** `/api/v1/settings`

---

## Admin Maps API

### GET /settings/admin-maps-key - Get Admin Google Maps Key

Returns the public browser Google Maps API key used by admin dashboard map widgets (e.g., local pickup location picker).

**Auth:** Admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/admin-maps-key" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "key": "AIzaSyD-c8..."
  }
}
```

---

### PUT /settings/admin-maps-key - Update Admin Google Maps Key

Set or update the public browser Google Maps API key. The operator restricts this key by HTTP referrer in the Google Cloud console.

**Auth:** Admin session

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | Yes | Public Google Maps API key |

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/settings/admin-maps-key" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{"key": "AIzaSyD-c8..."}'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "key": "AIzaSyD-c8..."
  }
}
```

---

## General Settings

### GET /settings - Get All Store Settings

Retrieve all store settings (general, shop-specific, and addon configuration). Secrets are masked and include `<key>_set` booleans.

**Auth:** Admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "settings": [
      { "key": "shop_name", "value": "My Store" },
      { "key": "store_email", "value": "orders@mystore.com" },
      { "key": "currency", "value": "KES" },
      { "key": "smtp_pass", "value": "••••••••" },
      { "key": "smtp_pass_set", "value": "true" }
    ],
    "addons_management": {
      "managed_by": "self",
      "blessed_until": null,
      "grace_active": true,
      "last_push_at": null,
      "available": null
    }
  }
}
```

---

### PUT /settings/:key - Update Global Admin Setting

Update a global (non-shop-scoped) admin-level setting (theme color, AI provider, social links). This is distinct from PUT /shop/:key, which manages shop-visible settings.

**Auth:** Admin session

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | Yes | Setting key (URL parameter) |
| `value` | string/number/boolean | Yes | New value |

**Common admin-only keys:**
- `admin_theme_color` — Admin UI theme color (hex)
- `ai_provider` — AI service (openai, gemini, claude)
- `ai_model` — Model ID for content generation
- Social links: `social_facebook`, `social_twitter`, `social_instagram`, etc.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/settings/admin_theme_color" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{"value": "#1f2937"}'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "setting": {
      "key": "admin_theme_color",
      "value": "#1f2937"
    }
  }
}
```

**Errors:**
- `400` — Invalid key or value length
- `403` — Blocked key (session_secret, payment_*, gateway_*, etc.)

**Notes:** Blocked keys cannot be updated via this endpoint; use dedicated PUT endpoints instead.

---

## Shop Configuration

### PUT /settings/shop/:key - Update Shop Setting

Modify a shop-level configuration value (store name, timezone, currency, addon toggles, order number format).

**Auth:** Admin session

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `key` | string | Yes | Setting key (URL parameter) |
| `value` | string/number/boolean | Yes | New value |

**Common keys:**
- `store_name` — Display name (storefront, emails)
- `shop_timezone` — IANA timezone (e.g. 'Africa/Nairobi')
- `currency` — Currency code (e.g. 'KES', 'USD')
- `order_number_mode` — 'random', 'sequential', or 'datestamp'
- Addon toggles: `subscriptions_addon_enabled`, `reservations_addon_enabled`, etc.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/settings/shop/store_name" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{"value": "My New Store Name"}'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "setting": {
      "key": "store_name",
      "value": "My New Store Name"
    }
  }
}
```

**Errors:**
- `400` — Invalid key, value, or timezone
- `403` — Key not in allowlist or blocked by Shopflow Manager plan

**Notes:**
- If managed by Shopflow Manager, addon keys are gated by the client's plan
- Changing `shop_timezone` or `product_url_template` invalidates related caches
- Addon toggles invalidate the 30-second addon flag cache immediately
- `currency` value 'KSH' is auto-corrected to 'KES'

---

## Site Assets

### PUT /settings/site-logo - Upload Store Logo

Upload a logo image that appears in email templates and storefront headers.

**Auth:** Admin session

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `logo` | file | Yes | Image file (JPEG, PNG, GIF, WebP, SVG, ICO); max 5MB |

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/settings/site-logo" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -F "logo=@logo.png"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "logo_url": "https://s3.example.com/shop-assets/logo-abc123.png"
  }
}
```

**Supported MIME types:** image/jpeg, image/jpg, image/png, image/gif, image/webp, image/svg+xml, image/x-icon

---

### PUT /settings/site-favicon - Upload Site Favicon

Upload a favicon displayed in browser tabs and bookmarks.

**Auth:** Admin session

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `favicon` | file | Yes | Image file (JPEG, PNG, GIF, WebP, SVG, ICO); max 5MB |

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/settings/site-favicon" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -F "favicon=@favicon.ico"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "favicon_url": "https://s3.example.com/shop-assets/favicon-xyz789.ico"
  }
}
```

---

## Email Templates

### GET /settings/emails - List Email Templates

List all email templates (system defaults + custom templates). For stores with the Reservations addon enabled, reservation-specific templates are included.

**Auth:** Admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/emails" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "templates": [
      {
        "id": 1,
        "name": "order_confirmation",
        "subject": "Order {{order_number}} confirmed",
        "heading": "Your Order is Confirmed",
        "content": "<p>Thank you for your order...</p>",
        "enabled": true,
        "recipient_kind": "customer",
        "recipient_custom_list": []
      }
    ]
  }
}
```

---

### POST /settings/emails - Create Email Template

Create a new custom email template. Template names must be unique.

**Auth:** Admin session (requires `settings:manage` permission)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique template name |
| `subject` | string | No | Email subject line with placeholders |
| `heading` | string | No | Email heading/title |
| `content` | string | No | Email body HTML |
| `enabled` | boolean | No | Whether template is enabled (default: true) |
| `recipient_kind` | string | No | `customer`, `admin`, or `custom` |
| `recipient_custom_list` | array or string | No | Custom recipient emails (array or comma/newline-separated) |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/emails" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "custom_announcement",
    "subject": "Special Offer from {{store_name}}",
    "heading": "Exclusive Offer",
    "content": "<p>Check out our latest deals...</p>",
    "enabled": true,
    "recipient_kind": "customer"
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "template": {
      "id": 42,
      "name": "custom_announcement",
      "subject": "Special Offer from {{store_name}}",
      "heading": "Exclusive Offer",
      "content": "<p>Check out our latest deals...</p>",
      "enabled": true,
      "recipient_kind": "customer",
      "recipient_custom_list": []
    }
  }
}
```

**Errors:**
- `400` — Template name is required or invalid
- `409` — Template with this name already exists

---

### PUT /settings/emails/:id - Update Email Template

Modify an existing email template (subject, heading, content, enabled state, recipient kind and list).

**Auth:** Admin session (requires `settings:manage` permission)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `subject` | string | No | Email subject line (supports {{placeholders}}) |
| `heading` | string | No | Email heading/title (supports {{placeholders}}) |
| `content` | string | No | Email HTML body (supports {{placeholders}}) |
| `enabled` | boolean | No | Whether emails are sent when this template triggers |
| `recipient_kind` | string | No | Recipient type: `customer`, `admin`, or `custom` |
| `recipient_custom_list` | array or string | No | Email addresses or phone numbers |

**Available placeholders:** {{customer_name}}, {{order_number}}, {{order_total}}, {{store_name}}, {{order_status}}, {{order_items}}, {{order_date}}, {{tracking_number}}, {{reset_link}}

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/settings/emails/5" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Order {{order_number}} - Updated",
    "heading": "Thank you for your order",
    "content": "<p>Your order has been received.</p>",
    "enabled": true,
    "recipient_kind": "customer"
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "template": {
      "id": 5,
      "name": "order_confirmation",
      "subject": "Order {{order_number}} - Updated",
      "heading": "Thank you for your order",
      "content": "<p>Your order has been received.</p>",
      "enabled": true,
      "recipient_kind": "customer",
      "recipient_custom_list": [],
      "updated_at": "2026-09-23T10:45:00Z"
    }
  }
}
```

**Errors:**
- `404` — Template not found

---

### DELETE /settings/emails/:id - Delete Email Template

Permanently delete a custom email template.

**Auth:** Admin session (requires `settings:manage` permission)

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/settings/emails/42" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "deleted": true
  }
}
```

**Errors:**
- `404` — Template not found

---

### POST /settings/emails/seed-defaults - Seed Default Email Templates

Create missing default email templates. Only creates templates that don't already exist. Restaurants with Reservations addon get reservation-specific templates too.

**Auth:** Admin session (requires `settings:manage` permission)

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/emails/seed-defaults" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "created": 8,
    "skipped": 2,
    "total": 10
  }
}
```

---

### POST /settings/emails/:id/preview - Preview Email Template

Render an email template with sample data and full wrapper (header, footer, store branding). Use this to see how the template will look when sent.

**Auth:** Admin session (requires `settings:manage` permission)

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/emails/1/preview" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "subject": "Order ORD-20260415-001 confirmed",
    "html": "<!DOCTYPE html>...<full email with header, content, and footer>...</html>"
  }
}
```

**Errors:**
- `404` — Template not found

---

### POST /settings/emails/:id/test - Send Test Email

Send a test email using the template with sample data. By default uses the authenticated admin's email; pass `to` to send to a different recipient.

**Auth:** Admin session (requires `settings:manage` permission)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `to` | string | No | Test recipient email (defaults to current user) |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/emails/1/test" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{"to": "test@example.com"}'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "sent": true,
    "to": "test@example.com"
  }
}
```

**Errors:**
- `400` — No recipient email provided
- `404` — Template not found

---

### POST /settings/emails/:id/generate - Generate Email Content with AI

Use the configured AI provider to automatically generate professional HTML email content for the template. Returns only the inner HTML body (no wrapper).

**Auth:** Admin session (requires `settings:manage` permission)

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/emails/1/generate" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "content": "<p>Dear {{customer_name}},</p><p>Thank you for your order...</p>"
  }
}
```

**Errors:**
- `404` — Template not found

---

## Payment Gateways

### GET /settings/payment-gateways - List Payment Gateways

Retrieve all configured payment gateways (Mpesa, Pesapal, Paystack, COD, Unified Checkout, etc.) with their configuration state.

**Auth:** Admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/payment-gateways" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "gateways": [
      {
        "id": "1",
        "name": "Mpesa",
        "enabled": false,
        "config_json": {
          "consumer_key": "",
          "consumer_secret": "••••••••",
          "consumer_secret_set": false,
          "environment": "sandbox"
        }
      },
      {
        "id": "3",
        "name": "Paystack",
        "enabled": true,
        "config_json": {
          "public_key": "pk_live_xxxxxxxxxxxxxxxx",
          "secret_key": "••••••••",
          "secret_key_set": true,
          "environment": "live"
        }
      }
    ]
  }
}
```

**Notes:** Secret fields are masked as `••••••••`; each masked field gets a companion `<field>_set` boolean showing whether a value is configured.

---

### PUT /settings/payment-gateways/:id - Update Payment Gateway

Modify a payment gateway's configuration (enable/disable, credentials, environment).

**Auth:** Admin session

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | boolean | No | Enable or disable the gateway |
| `config_json` | object | No | Gateway-specific configuration (merged with stored config) |

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/settings/payment-gateways/3" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "config_json": {
      "public_key": "pk_live_xxxxxxxxxxxxxxxx",
      "secret_key": "sk_live_xxxxxxxxxxxxxxxx",
      "environment": "live"
    }
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "gateway": {
      "id": "3",
      "name": "Paystack",
      "enabled": true,
      "config_json": {
        "public_key": "pk_live_xxxxxxxxxxxxxxxx",
        "secret_key": "••••••••",
        "secret_key_set": true,
        "environment": "live"
      }
    }
  }
}
```

**Errors:**
- `404` — Gateway not found

**Notes:** When updating, secrets that are masked or blank are ignored (stored secret is preserved). A round-trip save (read → modify → write) never loses secrets.

---

## Currencies

### GET /settings/currencies - List Supported Currencies

Retrieve all configured currencies, sorted alphabetically by code.

**Auth:** Admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/currencies" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "currencies": [
      {
        "id": 1,
        "code": "KES",
        "name": "Kenyan Shilling",
        "symbol": "KES",
        "exchange_rate": 1.0,
        "is_auto": false,
        "is_active": true,
        "created_at": "2026-01-01T00:00:00Z"
      }
    ]
  }
}
```

---

### POST /settings/currencies - Create a Currency

Add a new supported currency to the store.

**Auth:** Admin session

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | ISO 4217 3-letter currency code (uppercase) |
| `name` | string | No | Display name (defaults to code) |
| `symbol` | string | No | Currency symbol (e.g. '$', '£', '€') |
| `exchange_rate` | number | No | Rate relative to base currency (default 1.0) |
| `is_auto` | boolean | No | Auto-sync rate from provider (default true) |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/currencies" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "GBP",
    "name": "British Pound",
    "symbol": "£",
    "exchange_rate": 0.0063,
    "is_auto": true
  }'
```

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "currency": {
      "id": 3,
      "code": "GBP",
      "name": "British Pound",
      "symbol": "£",
      "exchange_rate": 0.0063,
      "is_auto": true,
      "is_active": true,
      "created_at": "2026-09-23T10:30:00Z"
    }
  }
}
```

**Errors:**
- `400` — Invalid or missing 3-letter code
- `409` — Currency already exists

---

### PUT /settings/currencies/:id - Update Currency

Modify a currency's properties (name, symbol, exchange rate, auto-sync setting).

**Auth:** Admin session

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Display name |
| `symbol` | string | No | Currency symbol |
| `exchange_rate` | number | No | Exchange rate |
| `is_auto` | boolean | No | Enable automatic rate sync |
| `is_active` | boolean | No | Activate or deactivate the currency |

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/settings/currencies/2" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{"exchange_rate": 0.0078, "is_auto": false}'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "currency": {
      "id": 2,
      "code": "USD",
      "name": "US Dollar",
      "symbol": "$",
      "exchange_rate": 0.0078,
      "is_auto": false,
      "is_active": true,
      "updated_at": "2026-09-23T10:35:00Z"
    }
  }
}
```

**Errors:**
- `404` — Currency not found

**Notes:** If `exchange_rate` is set without `is_auto`, the rate is treated as manual and `is_auto` becomes false.

---

### DELETE /settings/currencies/:id - Delete Currency

Remove a currency from the store.

**Auth:** Admin session

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/settings/currencies/3" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "deleted": true
  }
}
```

**Errors:**
- `404` — Currency not found

---

### POST /settings/currencies/refresh - Refresh Exchange Rates

Sync all auto-managed currency exchange rates from the configured rate provider.

**Auth:** Admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/currencies/refresh" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "updated": 5,
    "failed": 0
  }
}
```

**Notes:** Only currencies with `is_auto=true` are updated. Manual rates (is_auto=false) are not affected.

---

## Background Operations

### POST /settings/bulk-delete - Delete Multiple Records

Queues a bulk deletion job to avoid rate limiting the admin dashboard. Pass a resource type (e.g., `orders`, `customers`) and an array of IDs. Returns a background task tracked in Settings → Advanced panel.

**Auth:** Admin session (requires `settings:manage` permission)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `resource` | string | Yes | Resource type (`orders`, `customers`, etc.) |
| `ids` | array | Yes | Array of integer IDs to delete |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/bulk-delete" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{"resource": "orders", "ids": [101, 102, 103]}'
```

**Response (202 Accepted):**

```json
{
  "status": "success",
  "message": "Bulk delete of 3 orders started in the background",
  "data": {
    "task": {
      "id": "task-abc123...",
      "type": "bulk_delete",
      "status": "queued",
      "name": "Delete 3 orders",
      "total": 3,
      "progress": 0
    }
  }
}
```

**Errors:**
- `400` — Missing `resource` or `ids`, unsupported resource type, or no valid IDs provided

---

### GET /settings/background-tasks - List Background Tasks

List all background tasks (bulk deletes, CSV imports, S3 migrations, etc.). Filter by type and status. Recent tasks appear first.

**Auth:** Admin session (requires `settings:manage` permission)

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | string | Filter by task type (e.g., `bulk_delete`, `s3_migration`) |
| `status` | string | Filter by status: `queued`, `running`, `completed`, `failed`, `cancelled` |
| `limit` | integer | Max tasks to return (default: 20) |

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/background-tasks?status=running&limit=10" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "id": "task-xyz789...",
        "type": "bulk_delete",
        "status": "running",
        "name": "Delete 150 old orders",
        "total": 150,
        "progress": 45
      }
    ]
  }
}
```

---

### GET /settings/background-tasks/:id - Get Background Task Details

Retrieve full details of a specific background task, including status, progress, and error messages.

**Auth:** Admin session (requires `settings:manage` permission)

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/background-tasks/task-abc123" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "task-abc123...",
      "type": "bulk_delete",
      "status": "completed",
      "name": "Delete 3 orders",
      "total": 3,
      "progress": 3,
      "started_at": "2026-09-23T10:15:00Z",
      "completed_at": "2026-09-23T10:15:45Z"
    }
  }
}
```

**Errors:**
- `404` — Task not found

---

### POST /settings/background-tasks/:id/cancel - Cancel Background Task

Stop a running or queued background task. The task's status becomes `cancelled`.

**Auth:** Admin session (requires `settings:manage` permission)

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/background-tasks/task-abc123/cancel" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "task-abc123...",
      "status": "cancelled",
      "progress": 45
    }
  }
}
```

**Errors:**
- `404` — Task not found

---

### GET /settings/background-tasks/:id/report - Download Task Failure Report

For failed import or bulk operation tasks, download a CSV or JSON report detailing which records failed and why. The response is a file download.

**Auth:** Admin session (requires `settings:manage` permission)

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/background-tasks/task-abc123/report" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -o failure_report.csv
```

**Response (200):** File download with `Content-Type: text/csv` or `application/json` and `Content-Disposition: attachment` header.

**Errors:**
- `404` — Task not found or no report available

---

### GET /settings/background-tasks-archive - List Archived Background Tasks

Paginated listing of completed, failed, or cancelled background tasks. Use this to review past operations. Recent completions appear first.

**Auth:** Admin session (requires `settings:manage` permission)

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Records per page (default: 100, max: 500) |
| `status` | string | Filter by status: `completed`, `failed`, `cancelled` |
| `type` | string | Filter by task type |

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/background-tasks-archive?page=1&limit=20&status=completed" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "tasks": [
      {
        "id": "task-old123...",
        "type": "bulk_delete",
        "status": "completed",
        "name": "Delete 500 old orders",
        "total": 500,
        "progress": 500,
        "task_completed_at": "2026-09-20T14:30:00Z"
      }
    ],
    "total": 247,
    "page": 1,
    "limit": 20
  }
}
```

---

## Operation Logs

### GET /settings/api-operation-logs - List Operation Logs

Retrieve an audit trail of API operations with pagination and optional filtering.

**Auth:** Admin session

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default 1) |
| `limit` | integer | Results per page (default 50, max 200) |
| `operation_type` | string | Filter by operation type |

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/api-operation-logs?page=1&limit=50&operation_type=batch_order_create" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "logs": [
      {
        "id": 123,
        "session_type": "api_key",
        "api_key_id": 5,
        "user_id": null,
        "method": "POST",
        "endpoint": "/api/v1/orders/batch",
        "operation_type": "batch_order_create",
        "request_payload": { "orders": [...] },
        "response_summary": { "created": 10 },
        "affected_ids": [456, 457, 458, 459, 460, 461, 462, 463, 464, 465],
        "status_code": 201,
        "is_batch": true,
        "can_undo": true,
        "undo_data": { "orders": [{ "order_id": 456 }] },
        "undone_at": null,
        "undone_by": null,
        "ip": "192.168.1.100",
        "user_agent": "Mozilla/5.0...",
        "created_at": "2026-09-23T10:30:00Z",
        "updated_at": "2026-09-23T10:30:00Z"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 50
  }
}
```

**Notes:** `session_type` indicates whether the operation came from an `api_key` or admin `session`. `can_undo` indicates whether this operation supports reversal; `undo_data` contains the payload needed to reverse the operation (only shown if `can_undo=true`). The `affected_ids` array lists all records impacted by the operation.

---

### DELETE /settings/api-operation-logs - Clear Operation Logs

Delete operation audit logs. Use `undone_only=1` to safely clear only entries already marked as reversed.

**Auth:** Admin session

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `undone_only` | string | If '1', 'true', or 'yes', only delete logs marked as undone (default: delete all) |

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/settings/api-operation-logs?undone_only=1" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "deleted": 42
  }
}
```

**Caution:** Deletes are permanent. Use `undone_only=1` to avoid accidentally clearing active operations.

---

### POST /settings/api-operation-logs/:id/undo - Reverse an Operation

Reverse a recorded operation (e.g., delete an order created via batch, restore an order's previous status).

**Auth:** Admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/api-operation-logs/log-123/undo" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "undone": true,
    "summary": {
      "deleted_order_id": 456
    }
  }
}
```

**Status codes:**
- `200` — Operation undone successfully
- `400` — Operation cannot be undone
- `404` — Log entry not found
- `409` — Operation has already been undone

**Notes:** Only operations with `can_undo=true` can be reversed. Undone operations are marked with `undone_at` and `undone_by` timestamps.

---

## S3 Asset Migration

When you need to migrate product images and media from one S3-compatible storage provider to another (e.g., from AWS to a cheaper provider), use the S3 migration endpoints. The migration runs as a background task and does not interrupt the storefront.

### GET /settings/s3-migration/source-config - Get Current S3 Configuration

Returns the source S3 configuration (bucket name, endpoint, public URL) that this instance currently uses for asset storage. Secrets are not returned.

**Auth:** Admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/s3-migration/source-config" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "endpoint": "https://s3.amazonaws.com",
    "region": "us-east-1",
    "bucketName": "my-product-images",
    "publicUrl": "https://assets.mystore.com",
    "basePrefix": "products/"
  }
}
```

---

### POST /settings/s3-migration/test-connection - Validate Destination S3 Connection

Before starting a migration, test connectivity to your destination S3 bucket. This endpoint verifies that the credentials work and that the bucket is writable.

**Auth:** Admin session

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `endpoint` | string | Yes | S3-compatible endpoint URL (e.g., `https://s3.amazonaws.com`) |
| `region` | string | No | AWS region (default: auto-detected) |
| `accessKeyId` | string | Yes | S3 access key (write-only) |
| `secretAccessKey` | string | Yes | S3 secret access key (write-only) |
| `bucketName` | string | Yes | Destination bucket name |
| `publicUrl` | string | No | Public URL prefix for accessed assets |
| `skipAcl` | boolean | No | Skip ACL configuration (default: false) |
| `basePrefix` | string | No | Prefix path within bucket (e.g., `assets/`) |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/s3-migration/test-connection" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "https://s3.amazonaws.com",
    "region": "us-east-1",
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE",
    "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "bucketName": "my-new-bucket",
    "publicUrl": "https://cdn.mystore.com"
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "connected": true,
    "message": "Successfully connected and wrote test marker"
  }
}
```

---

### POST /settings/s3-migration/start - Begin S3 Migration

Starts the background migration task to copy all assets from the source bucket to the destination. Returns `409 Conflict` if a migration is already queued or running.

**Auth:** Admin session

**Request Body:** Same as test-connection, but `publicUrl` is required.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/s3-migration/start" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "endpoint": "https://s3.amazonaws.com",
    "region": "us-east-1",
    "accessKeyId": "AKIAIOSFODNN7EXAMPLE",
    "secretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
    "bucketName": "my-new-bucket",
    "publicUrl": "https://cdn.mystore.com",
    "basePrefix": "assets/"
  }'
```

**Response (202 Accepted):**

```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "s3_migration",
    "name": "S3 Asset Migration",
    "status": "queued",
    "total": 487,
    "progress": 0,
    "created_at": "2026-09-23T14:30:00Z"
  }
}
```

**Notes:** Destination S3 credentials are stored in Redis as a short-lived secret and are never logged or persisted in job data.

**Errors:**
- `400` — Missing required fields
- `409` — Migration already in progress or queued

---

### GET /settings/s3-migration/status - Check Migration Progress

Poll this endpoint to monitor the migration's progress. Returns the most recent migration task (or `{ status: "idle" }` if none has been started).

**Auth:** Admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/s3-migration/status" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "s3_migration",
    "name": "S3 Asset Migration",
    "status": "running",
    "total": 487,
    "progress": 152,
    "created_at": "2026-09-23T14:30:00Z",
    "started_at": "2026-09-23T14:31:15Z"
  }
}
```

**Status values:** `idle` (not started), `queued` (waiting), `running` (in progress), `completed` (success), `failed` (error), `cancelled` (stopped by admin).

---

### POST /settings/s3-migration/cancel - Stop a Running Migration

Cancels a currently running or queued migration. Returns `404` if no migration is active.

**Auth:** Admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/s3-migration/cancel" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "type": "s3_migration",
    "status": "cancelled",
    "progress": 152,
    "total": 487
  }
}
```

**Errors:**
- `404` — No migration is currently running or queued

---

## Order Number Format

Customize how order numbers are generated in your store. Choose between random alphanumeric IDs (the default), sequential numbering (1, 2, 3...), or date-based IDs (e.g., 20260923-001).

### GET /settings/order-number - Get Order Number Configuration

Retrieve the current order number format settings and a preview of what the next order number will look like.

**Auth:** Admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/settings/order-number" \
  -H "Cookie: shopflow.sid=session_cookie"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "config": {
      "mode": "sequential",
      "prefix": "ORD-",
      "suffix": "",
      "pad_width": 3
    },
    "preview": "ORD-043",
    "sequence": 42
  }
}
```

**Configuration Modes:**

| Mode | Example | Use Case |
|------|---------|----------|
| `random` | `A7K9M2X5B1` | Default; privacy-friendly |
| `sequential` | `ORD-001`, `ORD-002` | Easy reference |
| `datestamp` | `ORD-20260923-001` | Date-sortable; audits |

---

### POST /settings/order-number/reset-sequence - Reset Sequence Counter

Resets the order number sequence to a new starting value. Only affects sequential and datestamp modes.

**Auth:** Admin session (requires `settings:manage` permission)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `start_at` | integer | No | Sequence starting value (minimum 1, default 1) |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/order-number/reset-sequence" \
  -H "Cookie: shopflow.sid=session_cookie" \
  -H "Content-Type: application/json" \
  -d '{"start_at": 1000}'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "start_at": 1000,
    "preview": "ORD-1000"
  }
}
```

**Use Cases:** Year rollover, multi-channel sequences, rebranding.

---

## Storefront Cache

### POST /settings/clear-storefront-cache - Invalidate Storefront Cache

Force an immediate refresh of all storefront-related caches (product catalog, categories, settings, prices, etc.). Public endpoint useful for webhooks and external systems.

**Auth:** Public (no authentication required)

```bash
curl -X POST "https://your-store-api.example.com/api/v1/settings/clear-storefront-cache" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Response (200):**

```json
{
  "status": "success",
  "message": "Storefront cache cleared"
}
```

**Use cases:** After bulk product updates, after changing product visibility or inventory, after updating storefront settings or theme, after promotions or price changes.

**Notes:** This endpoint is public so external systems can trigger refresh. The cache is automatically invalidated for specific operations, but this endpoint forces a full refresh.
