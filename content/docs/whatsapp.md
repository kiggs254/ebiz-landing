The WhatsApp module enables sending transactional messages (order updates, reservation confirmations, etc.) and marketing campaigns to customers via WhatsApp. It supports both Meta Business API (cloud-hosted, full-featured, requires approval) and self-hosted OpenWA (no approval needed).

**Prerequisites:**
- WhatsApp addon enabled in Settings → Addons
- For Meta Cloud API: Meta Business Account, WABA (WhatsApp Business Account), and Cloud API credentials
- For self-hosted OpenWA: A provisioned OpenWA container

**Authentication:** All endpoints require admin session auth. Most are gated by the `settings.manage` permission (configuration, template management) or `settings.view` (read-only).

**Gating:** WhatsApp addon-gated endpoints return 503 when the addon is switched off. The one exception is `/whatsapp/config` (GET), which returns addon state.

---

## Configuration & Connection

### GET /whatsapp/config - Get Configuration

Returns the deployment-level Meta configuration and the per-store connection state. Secrets are masked on read.

**Auth:** Admin session with `settings.view` permission

```bash
curl -X GET "https://your-store-api.example.com/api/v1/whatsapp/config"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "tenant": {
      "app_id": "123456789",
      "embedded_signup_config_id": "conf_abc123",
      "solution_id": "solution_xyz",
      "graph_version": "v18.0",
      "webhook_url_hint": "/api/v1/webhooks/meta",
      "webhook_verify_token_configured": true,
      "embedded_signup_ready": true,
      "embedded_signup_proxy_url": "https://webhook-router.example.com",
      "webhook_router_tenant_id": "tenant_123"
    },
    "store": {
      "id": 1,
      "enabled": true,
      "config": {
        "waba_id": "123456789012345",
        "phone_number_id": "987654321098765",
        "access_token": "••••••••",
        "business_display_name": "My Store"
      },
      "connected": true,
      "connection_method": "embedded_api"
    }
  }
}
```

**Gotchas:**
- `access_token` is returned as `••••••••` for security
- `connection_method` can be `manual`, `embedded_api`, or `embedded_coexistence`

---

### PUT /whatsapp/config - Update Configuration

Manually update per-store WhatsApp connection. Secrets are write-only and returned masked on read. Rejected on portal-managed instances if attempting to toggle the addon.

**Auth:** Admin session with `settings.manage` permission

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | boolean | No | Toggle addon on/off (rejected on portal-managed stores) |
| `config.waba_id` | string | No | WhatsApp Business Account ID |
| `config.phone_number_id` | string | No | Phone number ID for the business |
| `config.access_token` | string | No | Meta access token (write-only, returns masked) |
| `config.business_display_name` | string | No | Business display name |
| `config.two_fa_pin` | string | No | 6-digit PIN for phone registration (write-only) |

**Example Request:**

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/whatsapp/config" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "config": {
      "waba_id": "123456789012345",
      "phone_number_id": "987654321098765",
      "access_token": "EAABs1234567890abcdef"
    }
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "config": {
      "waba_id": "123456789012345",
      "phone_number_id": "987654321098765",
      "access_token": "••••••••",
      "business_display_name": "My Store"
    }
  }
}
```

**Status Codes:**
- `200` - Configuration updated
- `400` - Validation error
- `403` - Addon managed by E-biz Manager (cannot toggle); insufficient permissions

**Gotchas:**
- When omitting `access_token`, the existing value is preserved
- Passing the masked value `••••••••` also preserves the current token
- Manual entry only; Embedded Signup is handled via `/whatsapp/onboarding/complete`

---

### POST /whatsapp/onboarding/complete - Complete Embedded Signup

Finalise WhatsApp onboarding after Embedded Signup closes. Exchanges Meta auth code for an access token, registers the phone number with Cloud API, and registers the WABA with the webhook router.

**Auth:** Admin session with `settings.manage` permission

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | `authResponse.code` from FB.login |
| `event` | string | No | Session event (FINISH, FINISH_GRANT_ONLY_API_ACCESS, FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING, FINISH_ONLY_WABA) |
| `waba_id` | string | Yes | WABA ID from session-info postMessage |
| `phone_number_id` | string | No | Phone ID (present for API; absent for coexistence) |
| `business_id` | string | No | Business ID |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/onboarding/complete" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "AQBV...xyz",
    "event": "FINISH",
    "waba_id": "123456789012345",
    "phone_number_id": "987654321098765",
    "business_id": "111222333444555"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "waba_id": "123456789012345",
    "phone_number_id": "987654321098765",
    "business_display_name": "My Business",
    "connection_method": "embedded_api",
    "event": "FINISH",
    "registered": true,
    "registration_error": null
  }
}
```

**Status Codes:**
- `200` - Onboarding complete
- `400` - Missing code, waba_id, or invalid Meta response
- `403` - Insufficient permissions
- `500` - META_APP_ID or META_APP_SECRET not configured on server

**Gotchas:**
- The country dial code is auto-derived and stored in the `whatsapp_default_country_code` setting
- Phone registration is skipped for coexistence flows
- Router registration may fail silently; onboarding succeeds but webhooks won't be delivered until manually registered

---

### POST /whatsapp/onboarding/disconnect - Disconnect WhatsApp

Unsubscribe the app from the WABA and unregister from the webhook router. Clears all stored configuration.

**Auth:** Admin session with `settings.manage` permission

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/onboarding/disconnect"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "disconnected": true
  }
}
```

**Status Codes:**
- `200` - Disconnected
- `403` - Insufficient permissions

---

### POST /whatsapp/phone/register - Register Phone Number

Manually register the phone number with Meta Cloud API using a 6-digit PIN. Used when the number needs re-registration after onboarding.

**Auth:** Admin session with `settings.manage` permission

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `pin` | string | Yes | 6-digit PIN for registration |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/phone/register" \
  -H "Content-Type: application/json" \
  -d '{ "pin": "123456" }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "registered": true
  }
}
```

**Status Codes:**
- `200` - Phone registered
- `400` - Invalid PIN format (must be 6 digits), or WhatsApp not connected
- `403` - Insufficient permissions

**Gotchas:**
- PIN must be exactly 6 digits
- Only works for Cloud API connections; skipped for coexistence
- Cannot register if WhatsApp is not connected

---

## Message Templates

### GET /whatsapp/templates - List All Templates

All WhatsApp message templates, ordered by name. Shows template status (DRAFT, PENDING_REVIEW, APPROVED, REJECTED) and metadata.

**Auth:** Admin session with `settings.view` permission

**Example Request:**

```bash
curl -X GET "https://your-store-api.example.com/api/v1/whatsapp/templates"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "templates": [
      {
        "id": 1,
        "name": "order_pending",
        "meta_name": "order_pending",
        "category": "UTILITY",
        "language": "en",
        "status": "APPROVED",
        "components": [
          {
            "type": "BODY",
            "text": "Hi {{customer_name}}, your order {{order_number}} has been received. Total: {{currency}} {{total}}."
          }
        ],
        "enabled": true,
        "created_at": "2026-09-20T10:30:00.000Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Templates retrieved
- `403` - Insufficient permissions

---

### GET /whatsapp/templates/:id - Get Single Template

Retrieve a template by ID. Shows full component structure (header, body, footer, buttons).

**Auth:** Admin session with `settings.view` permission

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Template ID |

**Example Request:**

```bash
curl -X GET "https://your-store-api.example.com/api/v1/whatsapp/templates/1"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "template": {
      "id": 1,
      "name": "order_pending",
      "meta_name": "order_pending",
      "category": "UTILITY",
      "language": "en",
      "status": "APPROVED",
      "components": [
        {
          "type": "BODY",
          "text": "Hi {{customer_name}}, your order {{order_number}} has been received."
        }
      ],
      "variables": {},
      "enabled": true,
      "recipient_kind": "customer",
      "recipient_custom_list": null,
      "meta_template_id": "meta_123",
      "rejection_reason": null,
      "created_at": "2026-09-20T10:30:00.000Z"
    }
  }
}
```

**Status Codes:**
- `200` - Template retrieved
- `404` - Template not found
- `403` - Insufficient permissions

---

### POST /whatsapp/templates - Create Template

Create a new WhatsApp message template. Starts in DRAFT status and must be submitted to Meta for approval before using on Cloud API. OpenWA templates remain DRAFT.

**Auth:** Admin session with `settings.manage` permission

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Internal template name (e.g., `order_pending`) |
| `meta_name` | string | No | Meta-scoped name (auto-generated if omitted) |
| `category` | string | No | `MARKETING`, `UTILITY` (default), or `AUTHENTICATION` |
| `language` | string | No | Language code (default: `en`) |
| `components` | array | Yes | Meta template components (HEADER, BODY, FOOTER, BUTTONS) |
| `variables` | object | No | Variable mappings for placeholder tracking |
| `enabled` | boolean | No | Template enabled (default: true) |
| `recipient_kind` | string | No | `customer` (default), `admin`, or `custom` |
| `recipient_custom_list` | array | No | List of phone numbers or emails for custom recipients |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/templates" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "order_shipped",
    "category": "UTILITY",
    "language": "en",
    "components": [
      {
        "type": "BODY",
        "text": "Hi {{customer_name}}, your order {{order_number}} has shipped! Track it here: https://example.com/track/{{order_number}}"
      }
    ],
    "enabled": true,
    "recipient_kind": "customer"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "template": {
      "id": 2,
      "name": "order_shipped",
      "meta_name": "order_shipped",
      "status": "DRAFT",
      "category": "UTILITY",
      "language": "en",
      "components": [
        {
          "type": "BODY",
          "text": "Hi {{customer_name}}, your order {{order_number}} has shipped!"
        }
      ],
      "created_at": "2026-09-23T12:00:00.000Z"
    }
  }
}
```

**Status Codes:**
- `201` - Template created
- `400` - Missing `name` or `components`
- `403` - Insufficient permissions

**Gotchas:**
- Recipient lists are normalized: emails are lowercased, phone numbers are deduplicated
- Invalid recipient entries are silently dropped
- `meta_name` is auto-normalized (spaces/special chars converted to underscores)

---

### PUT /whatsapp/templates/:id - Update Template

Update an existing template. Structural changes (body, header, footer, buttons) revert the template to DRAFT.

**Auth:** Admin session with `settings.manage` permission

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Template ID |

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Internal template name |
| `meta_name` | string | Meta-scoped name |
| `category` | string | `MARKETING`, `UTILITY`, or `AUTHENTICATION` |
| `language` | string | Language code |
| `components` | array | Meta template components |
| `variables` | object | Variable mappings |
| `enabled` | boolean | Enable/disable template |
| `recipient_kind` | string | `customer`, `admin`, or `custom` |
| `recipient_custom_list` | array | List of custom recipients |

**Example Request:**

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/whatsapp/templates/2" \
  -H "Content-Type: application/json" \
  -d '{
    "components": [
      {
        "type": "BODY",
        "text": "Hi {{customer_name}}, your order {{order_number}} has been dispatched!"
      }
    ]
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "template": {
      "id": 2,
      "name": "order_shipped",
      "status": "DRAFT",
      "components": [
        {
          "type": "BODY",
          "text": "Hi {{customer_name}}, your order {{order_number}} has been dispatched!"
        }
      ],
      "updated_at": "2026-09-23T12:05:00.000Z"
    }
  }
}
```

**Status Codes:**
- `200` - Template updated
- `404` - Template not found
- `403` - Insufficient permissions

**Gotchas:**
- Changing `components`, `language`, or `category` reverts status to DRAFT
- All fields are optional; only changed fields need to be submitted

---

### DELETE /whatsapp/templates/:id - Delete Template

Delete a template. If submitted to Meta (APPROVED or PENDING_REVIEW), also attempts to remove it from Meta's template library.

**Auth:** Admin session with `settings.manage` permission

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Template ID |

**Example Request:**

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/whatsapp/templates/2"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "deleted": true
  }
}
```

**Status Codes:**
- `200` - Template deleted
- `404` - Template not found
- `403` - Insufficient permissions

**Gotchas:**
- Deletion from Meta fails silently; local deletion always succeeds

---

### POST /whatsapp/templates/:id/submit - Submit for Approval

Submit a template to Meta's review process. The template must be in DRAFT status. Once submitted, it cannot be edited until Meta approves or rejects it.

**Auth:** Admin session with `settings.manage` permission

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Template ID |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/templates/42/submit" \
  -H "Content-Type: application/json"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "template": {
      "id": "42",
      "name": "order_confirmed",
      "status": "PENDING_REVIEW",
      "created_at": "2026-09-15T10:00:00Z"
    }
  }
}
```

**Status Codes:**
- `200` - Submitted for review
- `400` - Template not in DRAFT status
- `403` - Insufficient permissions

**Gotchas:**
- Approval typically takes a few minutes to hours
- Always test the template before submitting

---

### POST /whatsapp/templates/sync - Sync Templates from Meta

Fetches all templates from Meta and syncs them into the database. Detects newly approved templates and updates their status.

**Auth:** Admin session with `settings.manage` permission

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/templates/sync" \
  -H "Content-Type: application/json"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "synced": 5,
    "created": 2,
    "updated": 1,
    "deleted": 0
  }
}
```

**Status Codes:**
- `200` - Sync complete
- `403` - Insufficient permissions

**Gotchas:**
- Useful after manually approving templates in Meta Business Manager
- Refreshes local state if you suspect stale data

---

### POST /whatsapp/templates/generate - Generate with AI

Generates template components (header, body, footer, buttons) using AI. Respects Meta's strict rules and only uses valid placeholders for the subject.

**Auth:** Admin session with `settings.manage` permission

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Template name (e.g., `order_confirmed`, `reservation_pending`, `rider_assigned`) |
| `category` | string | No | `UTILITY` (default), `MARKETING`, or `AUTHENTICATION` |
| `language` | string | No | Language code (default: `en`) |
| `intent` | string | No | Additional context for AI (e.g., "include tracking number") |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/templates/generate" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "order_confirmed",
    "category": "UTILITY",
    "language": "en",
    "intent": "Include estimated delivery time"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "components": [
      {
        "type": "BODY",
        "text": "Hi {{customer_name}}, your order #{{order_number}} has been confirmed! We'll prepare it for you."
      },
      {
        "type": "BUTTONS",
        "buttons": [
          {
            "type": "URL",
            "text": "Track Order",
            "url": "https://example.com/t/{{order_number}}"
          }
        ]
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Components generated
- `400` - Invalid subject or missing required fields
- `403` - Insufficient permissions

**Gotchas:**
- Requires an AI API key configured in Settings
- The name drives the subject: `order_*` → order context, `reservation_*` → booking context, `rider_*` → delivery context

---

### POST /whatsapp/templates/:id/test - Send Test Copy

Send a test copy to a phone number to preview rendering and placeholder substitution before going live.

**Auth:** Admin session with `settings.manage` permission

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Template ID |

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phone` | string | Yes | Phone number to test (international format) |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/templates/42/test" \
  -H "Content-Type: application/json" \
  -d '{ "phone": "+254700000009" }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "sent": true,
    "error": null
  }
}
```

**Status Codes:**
- `200` - Test sent
- `400` - Invalid phone format
- `403` - Insufficient permissions

**Gotchas:**
- On Meta Cloud API, the template must be APPROVED; drafts are rejected
- On open-wa, DRAFT templates work fine
- Placeholders render with sample values

---

### POST /whatsapp/templates/:id/dispatch - Test Send to Real Order

Send a template to a customer's phone based on a real order. Useful for diagnosing why a template didn't fire on order status change.

**Auth:** Admin session with `settings.manage` permission

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | integer | Template ID |

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `order_id` | number | No* | Order ID (numeric PK) |
| `order_number` | string | No* | Order number (string lookup) |

*Provide either `order_id` or `order_number`.

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/templates/42/dispatch" \
  -H "Content-Type: application/json" \
  -d '{ "order_number": "ORD-12345" }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "sent": true,
    "error": null
  }
}
```

**Status Codes:**
- `200` - Message sent
- `400` - Order not found; customer phone missing
- `403` - Insufficient permissions

**Gotchas:**
- The template name determines the order status for dispatch (e.g., `order_confirmed` → dispatch as if order just moved to "confirmed")

---

## Self-Hosted WhatsApp (OpenWA)

The open-wa container runs on the private Coolify network. The backend proxies status checks and QR codes so admins can pair without direct access.

### GET /whatsapp/openwa/status - Check Pairing Status

Polls the open-wa container to see if a WhatsApp number is linked and ready. Returns a diagnosis.

**Auth:** Admin session with `settings.view` permission

| Query Parameter | Type | Default | Description |
|-----------------|------|---------|-------------|
| `force` | string | 0 | `1` to skip 30-second cache and run full probe |

**Example Request:**

```bash
curl "https://your-store-api.example.com/api/v1/whatsapp/openwa/status?force=1"
```

**Example Response (200, linked):**

```json
{
  "status": "success",
  "data": {
    "configured": true,
    "authenticated": true,
    "reachable": true,
    "session_found": true,
    "session_name": "store-session",
    "linked_phone": "+254700000009",
    "linked_display_name": "Newton Kimani",
    "state": "authenticated",
    "gateway_url": "http://openwa-gateway:3000",
    "diagnosis": "Linked",
    "provider_preference": "openwa"
  }
}
```

**Example Response (200, not configured):**

```json
{
  "status": "success",
  "data": {
    "configured": false,
    "authenticated": false,
    "diagnosis": "No self-hosted WhatsApp container is provisioned for this store."
  }
}
```

**Gotchas:**
- `linked_phone` and `linked_display_name` only present when authenticated
- Use `?force=1` on first mount or when user clicks Refresh

---

### GET /whatsapp/openwa/qr - Fetch Pairing QR Code

Returns a fresh PNG QR code for pairing a WhatsApp number. Cached for 15 seconds.

**Auth:** Admin session with `settings.manage` permission

**Example Request:**

```bash
curl -X GET "https://your-store-api.example.com/api/v1/whatsapp/openwa/qr" \
  -H "Accept: image/png" \
  --output qr.png
```

**Response (200):**

```
[PNG binary data — 200 x 200 pixels]
```

**Status Codes:**
- `200` - QR code returned
- `404` - Session still starting; try again in a few seconds
- `409` - This number is already linked; no code needed
- `403` - Insufficient permissions

**Gotchas:**
- QR code rotates internally every ~20 seconds
- Always set `Accept: image/png` so response is treated as binary

---

### POST /whatsapp/openwa/logout - Unlink the Paired Number

Unlinks the current WhatsApp number so a different number can be paired.

**Auth:** Admin session with `settings.manage` permission

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/openwa/logout" \
  -H "Content-Type: application/json"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "message": "Unlinked. Scan the QR to link a number."
  }
}
```

**Status Codes:**
- `200` - Unlinked
- `403` - Insufficient permissions

**Gotchas:**
- Destructive; after unlinking, a fresh QR code is generated on next request

---

## Campaigns

Bulk messaging campaigns send messages to opted-in customers. Recipients are materialised only when the campaign is sent.

### GET /whatsapp/campaigns - List Campaigns

Fetches campaigns, newest first. Also returns the audience policy.

**Auth:** Admin session with `settings.view` permission

**Example Request:**

```bash
curl "https://your-store-api.example.com/api/v1/whatsapp/campaigns"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "campaigns": [
      {
        "id": "1",
        "name": "Summer Sale",
        "message": "🌞 Summer sale is live! Get 20% off all items.",
        "status": "draft",
        "media_url": null,
        "media_type": null,
        "audience_json": { "segment": "vip_customers" },
        "scheduled_at": null,
        "created_by": 5,
        "created_at": "2026-08-01T14:30:00Z",
        "updated_at": "2026-08-01T14:30:00Z",
        "started_at": null,
        "last_error": null
      }
    ],
    "audience_policy": "opted_in_only"
  }
}
```

**Status Codes:**
- `200` - Campaigns retrieved
- `403` - Insufficient permissions

**Gotchas:**
- Status values: `draft`, `scheduled`, `sending`, `paused`, `completed`

---

### POST /whatsapp/campaigns - Create Campaign

Create a draft or scheduled campaign. Either a message or media URL (or both) is required.

**Auth:** Admin session with `settings.manage` permission

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Campaign name |
| `message` | string | No* | Message text |
| `media_url` | string | No* | Image, video, or document URL |
| `media_type` | string | No | `image`, `video`, or `document` (required if `media_url` provided) |
| `audience` | object | No | Audience filter (e.g., segment, tag, custom rules) |
| `scheduled_at` | string | No | ISO 8601 when to send (UTC). If omitted, campaign is draft. |

*At least one of `message` or `media_url` is required.

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/campaigns" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Sale Announcement",
    "message": "🌞 Check out our summer collection! Get 20% off.",
    "media_url": "https://cdn.example.com/banner.jpg",
    "media_type": "image",
    "audience": { "segment": "all_customers" },
    "scheduled_at": "2026-08-15T09:00:00Z"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "campaign": {
      "id": "2",
      "name": "Summer Sale Announcement",
      "message": "🌞 Check out our summer collection! Get 20% off.",
      "media_url": "https://cdn.example.com/banner.jpg",
      "media_type": "image",
      "status": "scheduled",
      "audience_json": { "segment": "all_customers" },
      "scheduled_at": "2026-08-15T09:00:00Z",
      "created_by": 5,
      "created_at": "2026-08-01T15:45:00Z",
      "updated_at": "2026-08-01T15:45:00Z",
      "started_at": null,
      "last_error": null
    }
  }
}
```

**Status Codes:**
- `201` - Campaign created
- `400` - Missing both message and media_url
- `403` - Insufficient permissions

**Gotchas:**
- Scheduled campaigns start via cron at specified time
- Recipients materialised only when `/send` is called, so you can reschedule before sending

---

### POST /whatsapp/campaigns/preview - Preview Audience

Resolves an audience filter and returns the count plus a masked sample of 5 phone numbers.

**Auth:** Admin session with `settings.view` permission

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `audience` | object | No | Audience filter |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/campaigns/preview" \
  -H "Content-Type: application/json" \
  -d '{ "audience": { "segment": "vip_customers" } }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "count": 247,
    "policy": "opted_in_only",
    "sample": [
      "+254...7479",
      "+254...8314",
      "+254...2961",
      "+254...4487",
      "+254...9002"
    ]
  }
}
```

**Status Codes:**
- `200` - Preview generated
- `403` - Insufficient permissions

**Gotchas:**
- Phone numbers masked to 4 digits for privacy
- Exact recipients materialised at `/send` time, so sample may not include everyone

---

### POST /whatsapp/campaigns/:id/send - Start Sending

Materialises recipients, transitions campaign to `sending`, and enqueues messages (paced deliberately).

**Auth:** Admin session with `settings.manage` permission

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Campaign ID |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/campaigns/2/send" \
  -H "Content-Type: application/json"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "queued": 247,
    "total": 247,
    "message": "Queued 247 messages. They are paced deliberately, so this will take a while."
  }
}
```

**Status Codes:**
- `200` - Messages queued
- `400` - Nobody matches audience; already sending
- `403` - Insufficient permissions

**Gotchas:**
- Once `sending`, campaign cannot be edited; pause it first
- Queued jobs respect status field, so pausing stops new sends
- Can be resumed after pausing; jobs for already-sent recipients are skipped

---

### POST /whatsapp/campaigns/:id/pause - Pause Campaign

Stops a sending campaign. Queued jobs check the status before sending and skip if paused.

**Auth:** Admin session with `settings.manage` permission

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Campaign ID |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp/campaigns/2/pause" \
  -H "Content-Type: application/json"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "message": "Paused. Messages already queued will stop rather than send."
  }
}
```

**Status Codes:**
- `200` - Campaign paused
- `403` - Insufficient permissions

**Gotchas:**
- Pausing does not recall already-sent messages
- Resume by calling `/send` again; pending recipients will be queued

---

### GET /whatsapp/campaigns/:id - Fetch Campaign & Recipients

Retrieves a single campaign and up to 200 of its recipients.

**Auth:** Admin session with `settings.view` permission

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | string | Campaign ID |

**Example Request:**

```bash
curl "https://your-store-api.example.com/api/v1/whatsapp/campaigns/2"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "campaign": {
      "id": "2",
      "name": "Summer Sale Announcement",
      "message": "Check out our summer collection!",
      "status": "sending",
      "audience_json": { "segment": "vip_customers" },
      "created_by": 5,
      "created_at": "2026-08-01T15:45:00Z",
      "updated_at": "2026-08-01T16:00:00Z",
      "started_at": "2026-08-01T16:00:00Z",
      "last_error": null
    },
    "recipients": [
      {
        "id": 1,
        "campaign_id": "2",
        "phone": "+254700000009",
        "status": "sent",
        "error": null,
        "sent_at": "2026-08-01T16:02:30Z",
        "created_at": "2026-08-01T16:00:00Z"
      },
      {
        "id": 2,
        "campaign_id": "2",
        "phone": "+254700000010",
        "status": "pending",
        "error": null,
        "sent_at": null,
        "created_at": "2026-08-01T16:00:00Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Campaign retrieved
- `404` - Campaign not found
- `403` - Insufficient permissions

**Gotchas:**
- Only first 200 recipients returned; fetch in batches for larger campaigns
- Recipient statuses: `pending`, `sent`, `failed`

---

## Reference

### GET /whatsapp/placeholders - Template Placeholders

Catalogue of named placeholders (e.g., `{{customer_name}}`, `{{order_number}}`) that can be inserted into templates.

**Auth:** Admin session with `settings.view` permission

| Query Parameter | Type | Default | Description |
|-----------------|------|---------|-------------|
| `subject` | string | order | Filter by subject: `order`, `reservation`, or `rider` |

**Example Request:**

```bash
curl "https://your-store-api.example.com/api/v1/whatsapp/placeholders?subject=order"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "placeholders": [
      {
        "key": "customer_name",
        "description": "Customer's first name",
        "sample": "Jane"
      },
      {
        "key": "order_number",
        "description": "Order reference number",
        "sample": "ORD-1709468833000"
      },
      {
        "key": "total",
        "description": "Order total (amount only)",
        "sample": "2700.00"
      },
      {
        "key": "currency",
        "description": "Currency code (ISO 4217)",
        "sample": "KES"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Placeholders retrieved
- `403` - Insufficient permissions

---

### GET /whatsapp/order-statuses - Order Statuses

List of canonical order statuses plus any custom ones configured in Settings → Order Configuration.

**Auth:** Admin session with `settings.view` permission

**Example Request:**

```bash
curl "https://your-store-api.example.com/api/v1/whatsapp/order-statuses"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "statuses": [
      {
        "id": "pending",
        "label": "Pending",
        "custom": false
      },
      {
        "id": "processing",
        "label": "Processing",
        "custom": false
      },
      {
        "id": "shipped",
        "label": "Shipped",
        "custom": false
      },
      {
        "id": "delivered",
        "label": "Delivered",
        "custom": false
      },
      {
        "id": "cancelled",
        "label": "Cancelled",
        "custom": false
      },
      {
        "id": "awaiting_supplier",
        "label": "Awaiting supplier",
        "custom": true
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Statuses retrieved
- `403` - Insufficient permissions

**Gotchas:**
- Custom statuses shadow canonical ones when relabelled
- Malformed values don't break the response; only valid rows returned

---

### GET /whatsapp/reservation-statuses - Reservation Statuses

List of booking statuses a reservation template can fire on. Empty when Reservations addon is disabled.

**Auth:** Admin session with `settings.view` permission

**Example Request:**

```bash
curl "https://your-store-api.example.com/api/v1/whatsapp/reservation-statuses"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "statuses": [
      {
        "id": "pending",
        "label": "Pending — awaiting confirmation",
        "custom": false
      },
      {
        "id": "confirmed",
        "label": "Confirmed",
        "custom": false
      },
      {
        "id": "seated",
        "label": "Seated",
        "custom": false
      },
      {
        "id": "completed",
        "label": "Completed",
        "custom": false
      },
      {
        "id": "cancelled",
        "label": "Cancelled",
        "custom": false
      },
      {
        "id": "no_show",
        "label": "No show",
        "custom": false
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Statuses retrieved
- `403` - Insufficient permissions

---

### GET /whatsapp/rider-triggers - Rider Notification Triggers

List of triggers a rider template can fire on. Empty when Riders addon is disabled.

**Auth:** Admin session with `settings.view` permission

**Example Request:**

```bash
curl "https://your-store-api.example.com/api/v1/whatsapp/rider-triggers"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "statuses": [
      {
        "id": "assignment",
        "label": "Rider assignment — order handed to a rider",
        "custom": false
      }
    ]
  }
}
```

**Example Response (Riders addon off):**

```json
{
  "status": "success",
  "data": {
    "enabled": false,
    "statuses": []
  }
}
```

**Status Codes:**
- `200` - Triggers retrieved
- `403` - Insufficient permissions

---

### GET /whatsapp/webhook-log - Webhook Activity

Recent Meta webhook deliveries (newest first). Shows last ~50 hits for debugging.

**Auth:** Admin session with `settings.view` permission

| Query Parameter | Type | Default | Max | Description |
|-----------------|------|---------|-----|-------------|
| `limit` | integer | 50 | 200 | Number of logs to return |

**Example Request:**

```bash
curl "https://your-store-api.example.com/api/v1/whatsapp/webhook-log?limit=50"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "logs": [
      {
        "id": 1,
        "event_type": "message_status_changed",
        "payload": {
          "object": "whatsapp_business_account",
          "entry": [
            {
              "id": "123456789012345",
              "changes": [
                {
                  "value": {
                    "messaging_product": "whatsapp",
                    "statuses": [
                      {
                        "id": "msg_abc123",
                        "status": "delivered"
                      }
                    ]
                  }
                }
              ]
            }
          ]
        },
        "created_at": "2026-09-23T12:30:45.000Z"
      }
    ]
  }
}
```

**Status Codes:**
- `200` - Logs retrieved
- `403` - Insufficient permissions

---

### DELETE /whatsapp/webhook-log - Clear Webhook Log

Delete all webhook activity logs to start fresh.

**Auth:** Admin session with `settings.manage` permission

**Example Request:**

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/whatsapp/webhook-log"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "cleared": true
  }
}
```

**Status Codes:**
- `200` - Logs cleared
- `403` - Insufficient permissions

---

## Integration Patterns

### Send Order Status Update

1. Create a template named `order_{status}` (e.g., `order_shipped`, `order_delivered`)
2. Use placeholders: `{{customer_name}}`, `{{order_number}}`, `{{total}}`, `{{currency}}`
3. If using Meta Cloud API: Submit template and wait for approval
4. Configure the store to send on order status change (in the admin UI)
5. When an order transitions to that status, the WhatsApp service fires automatically

### Send Reservation Confirmation

1. Create a template named `reservation_{status}` (e.g., `reservation_confirmed`)
2. Available placeholders: `{{guest_name}}`, `{{reservation_reference}}`, `{{date}}`, `{{time}}`, `{{party_size}}`
3. Submit to Meta if using Cloud API
4. Automatically fires when a booking enters that status

### Send Rider Assignment

1. Create a template named `rider_assignment` (Riders addon required)
2. Target audience: The rider (not the customer)
3. Include: order number, customer name/phone, shipping address
4. Submit to Meta if using Cloud API
5. Fires when a rider is assigned to an order
