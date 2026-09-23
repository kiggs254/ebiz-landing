## 14. Webhooks

Webhooks send HTTP POST requests to your URL when events occur in the store. Use them for real-time sync with ERP, inventory, or analytics.

### Setup (Admin)

1. Go to **Settings** → **API** tab
2. Scroll to **Webhooks**
3. Click **Add Webhook**
4. Enter your **Delivery URL** (must be HTTPS in production)
5. Select **Events** to subscribe to
6. Optionally set a **Secret** (auto-generated if omitted)

### Sharing Webhook Credentials

After creating a webhook, provide the integration partner with:

- **Webhook URL** - Their endpoint URL (they configure this)
- **Secret** - For signature verification (shown only when creating/editing)

### Available Events

| Event | Description |
|-------|-------------|
| `order.created` | New order created |
| `order.updated` | Order updated |
| `order.cancelled` | Order cancelled |
| `order.completed` | Order completed |
| `product.created` | New product created |
| `product.updated` | Product updated |
| `product.deleted` | Product deleted |
| `customer.created` | New customer created |
| `customer.updated` | Customer updated |
| `payment.completed` | Payment completed |
| `payment.failed` | Payment failed |
| `shipment.created` | Shipment created |
| `shipment.updated` | Shipment updated |
| `coupon.used` | Coupon used |
| `review.created` | Review created |
| `review.approved` | Review approved |
| `*` | All events (wildcard) |

### How Webhooks Work

1. **Event occurs** - e.g. order created, product updated
2. **System finds webhooks** - All enabled webhooks subscribed to that event
3. **Delivery** - HTTP POST to each webhook URL with the payload
4. **Headers** - `Content-Type: application/json`, `X-Shopflow-Signature`, `X-Shopflow-Event`
5. **Logging** - Delivery status (success/failed) and response code logged

### Webhook Payload Format

**Headers:**

```
Content-Type: application/json
X-Shopflow-Signature: <HMAC-SHA256 hex signature>
X-Shopflow-Event: <event-type>
```

**Body:**
The raw request body is the event payload as JSON. The signature is computed from this exact string - use the raw body for verification, not a re-parsed/re-stringified version.

The payload structure is event-specific. Use the `X-Shopflow-Event` header to determine the event type.

**Example - `order.created` / `order.updated`:**
```json
{
  "id": 123,
  "order_number": "ORD-1709468833000",
  "customer_id": 42,
  "status": "pending",
  "payment_status": "pending",
  "subtotal": "2400.00",
  "shipping": "300.00",
  "tax": "0.00",
  "discount": "0.00",
  "total": "2700.00",
  "currency": "KES"
}
```

**Example - `product.created` / `product.updated`:**
```json
{
  "id": 42,
  "name": "Organic Flour",
  "sku": "FLOUR-001",
  "price": "12.99",
  "stock": 100,
  "status": "active",
  "product_type": "simple"
}
```

**Example - `product.deleted`:**
```json
{
  "id": 42
}
```

### Verifying Webhook Signatures

Always verify the `X-Shopflow-Signature` header to ensure the request came from your store.

**Signature algorithm:** HMAC-SHA256 of the raw request body with your webhook secret.

**JavaScript (Node.js):**

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(rawBody, signature, secret) {
  const computed = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');
  return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(computed, 'hex'));
}

// Express middleware example
app.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-shopflow-signature'];
  const event = req.headers['x-shopflow-event'];
  
  if (!verifyWebhookSignature(req.body.toString(), signature, process.env.WEBHOOK_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  const payload = JSON.parse(req.body.toString());
  // Process payload...
  res.status(200).send('OK');
});
```

**Python:**
```python
import hmac
import hashlib
import json

def verify_webhook_signature(raw_body: bytes, signature: str, secret: str) -> bool:
    computed = hmac.new(
        secret.encode('utf-8'),
        raw_body,
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(computed, signature)

# Flask example
@app.route('/webhook', methods=['POST'])
def webhook():
    signature = request.headers.get('X-Shopflow-Signature', '')
    signature = signature or request.headers.get('x-shopflow-signature', '')
    
    if not verify_webhook_signature(request.data, signature, WEBHOOK_SECRET):
        return 'Invalid signature', 401
    
    payload = request.get_json()
    # Process payload...
    return 'OK', 200
```

**PHP:**
```php
<?php
function verifyWebhookSignature($rawBody, $signature, $secret) {
    $computed = hash_hmac('sha256', $rawBody, $secret);
    return hash_equals($computed, $signature);
}

// Usage
$rawBody = file_get_contents('php://input');
$signature = $_SERVER['HTTP_X_SHOPFLOW_SIGNATURE'] ?? '';

if (!verifyWebhookSignature($rawBody, $signature, $webhookSecret)) {
    http_response_code(401);
    exit('Invalid signature');
}

$payload = json_decode($rawBody, true);
// Process payload...
```

### Webhook Best Practices

1. **Respond quickly** - Return `200 OK` within 2-3 seconds; process asynchronously if needed
2. **Verify signature** - Always validate the signature before processing
3. **Idempotency** - Handle duplicate deliveries (same event may be retried)
4. **HTTPS** - Use HTTPS for the webhook URL
5. **Logging** - Log delivery attempts and failures for debugging

### Webhook Delivery Logs

View delivery history in **Settings** → **API** → Webhooks → Actions → **View Deliveries**. Shows status, response code, and payload for each delivery.

### Test Webhook

Use the **Test** action in the webhook list to send a test payload. This helps verify your endpoint is reachable and returns 200.

### Webhook Management Endpoints

- `GET /webhooks` - List webhooks
- `POST /webhooks` - Create webhook
- `GET /webhooks/:id` - Get webhook
- `PUT /webhooks/:id` - Update webhook
- `DELETE /webhooks/:id` - Delete webhook
- `GET /webhooks/:id/deliveries` - Get webhook delivery logs
- `POST /webhooks/:id/test` - Send test payload
- `POST /webhooks/mpesa` - M-Pesa callback (backwards-compat alias)
- `POST /storefront/webhooks/mpesa` - M-Pesa callback (storefront)

## API Reference

### POST /webhooks - Create a Webhook

Register a new webhook to receive event notifications for your store.

**Auth:** Admin session required.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/webhooks" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-server.com/webhooks/orders",
    "events": ["order.created", "order.updated"],
    "secret": "optional-secret-key"
  }'
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | Yes | HTTPS endpoint URL where webhook payloads will be delivered |
| `events` | array | Yes | Array of event types to subscribe to (e.g., `["order.created", "product.updated"]` or `["*"]` for all) |
| `secret` | string | No | Webhook secret for signature verification. Auto-generated if omitted. |

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "webhook": {
      "id": 1,
      "url": "https://your-server.com/webhooks/orders",
      "events_json": ["order.created", "order.updated"],
      "secret": "abc123def456...",
      "enabled": true,
      "created_at": "2025-09-23T10:30:00Z",
      "updated_at": "2025-09-23T10:30:00Z"
    }
  }
}
```

**Error Response (400):**

```json
{
  "status": "error",
  "message": "URL and events array are required"
}
```

**Gotchas:** If no secret is provided, one will be generated automatically and returned in the response. Save this secret securely — you'll need it to verify webhook signatures. The `events` parameter must be a non-empty array; `url` must be provided and should use HTTPS.

---

### GET /webhooks - List All Webhooks

Retrieve all webhooks configured for this store.

**Auth:** Admin session required.

```bash
curl -X GET "https://your-store-api.example.com/api/v1/webhooks"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "webhooks": [
      {
        "id": 1,
        "url": "https://your-server.com/webhooks/orders",
        "events_json": ["order.created", "order.updated"],
        "secret": "abc123def456...",
        "enabled": true,
        "created_at": "2025-09-23T10:30:00Z",
        "updated_at": "2025-09-23T10:30:00Z"
      },
      {
        "id": 2,
        "url": "https://erp.company.com/shopflow-webhook",
        "events_json": ["*"],
        "secret": "xyz789uvw123...",
        "enabled": false,
        "created_at": "2025-09-20T14:15:00Z",
        "updated_at": "2025-09-22T09:45:00Z"
      }
    ]
  }
}
```

**Gotchas:** Webhooks are ordered by creation date, newest first. The `secret` is included in responses only when viewing your own store's webhooks.

---

### GET /webhooks/:id - Get a Single Webhook

Retrieve details about a specific webhook.

**Auth:** Admin session required.

```bash
curl -X GET "https://your-store-api.example.com/api/v1/webhooks/1"
```

**Field Reference:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Webhook ID (path parameter) |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "webhook": {
      "id": 1,
      "url": "https://your-server.com/webhooks/orders",
      "events_json": ["order.created", "order.updated"],
      "secret": "abc123def456...",
      "enabled": true,
      "created_at": "2025-09-23T10:30:00Z",
      "updated_at": "2025-09-23T10:30:00Z"
    }
  }
}
```

**Error Response (404):**

```json
{
  "status": "error",
  "message": "Webhook not found"
}
```

**Gotchas:** Returns 404 if the webhook ID does not exist. Verify the ID before attempting to retrieve it.

---

### PUT /webhooks/:id - Update a Webhook

Modify an existing webhook's URL, events, secret, or enabled status.

**Auth:** Admin session required.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/webhooks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://new-server.com/webhooks/events",
    "events": ["order.created", "order.cancelled"],
    "enabled": true
  }'
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `url` | string | No | New HTTPS endpoint URL |
| `events` | array | No | Updated event subscription array |
| `secret` | string | No | New secret for signature verification |
| `enabled` | boolean | No | Enable or disable the webhook |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "webhook": {
      "id": 1,
      "url": "https://new-server.com/webhooks/events",
      "events_json": ["order.created", "order.cancelled"],
      "secret": "abc123def456...",
      "enabled": true,
      "created_at": "2025-09-23T10:30:00Z",
      "updated_at": "2025-09-23T11:45:00Z"
    }
  }
}
```

**Gotchas:** Only fields provided in the request body are updated; omitted fields retain their previous values. If you change the secret, save the new value immediately as you won't see it again when retrieving the webhook.

---

### DELETE /webhooks/:id - Delete a Webhook

Remove a webhook permanently. It will no longer receive event notifications.

**Auth:** Admin session required.

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/webhooks/1"
```

**Field Reference:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Webhook ID (path parameter) |

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Webhook deleted successfully"
}
```

**Error Response (404):**

```json
{
  "status": "error",
  "message": "Webhook not found"
}
```

**Gotchas:** This operation cannot be undone. Deleted webhooks are permanently removed, and no deliveries for that webhook will be logged.

---

### POST /webhooks/:id/test - Send Test Payload

Send a test webhook payload to verify your endpoint is reachable and working correctly.

**Auth:** Admin session required.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/webhooks/1/test"
```

**Field Reference:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Webhook ID (path parameter) |

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Test webhook triggered"
}
```

**Error Response (404):**

```json
{
  "status": "error",
  "message": "Webhook not found"
}
```

**Error Response (400):**

```json
{
  "status": "error",
  "message": "Webhook is disabled"
}
```

**Test Payload Structure:**

The test sends a JSON payload with:
```json
{
  "action": "test",
  "timestamp": "2025-09-23T11:50:00.000Z",
  "webhook_id": 1,
  "message": "This is a test webhook payload"
}
```

**Gotchas:** The webhook must be enabled to receive a test payload. If you get a 400 error, enable the webhook first via the PUT endpoint. The test payload is sent with the same signature headers as real events, so you can verify your signature verification logic.

---

### GET /webhooks/:id/deliveries - Get Webhook Delivery History

Retrieve the delivery history (logs) for a specific webhook. Shows the 100 most recent deliveries.

**Auth:** Admin session required.

```bash
curl -X GET "https://your-store-api.example.com/api/v1/webhooks/1/deliveries"
```

**Field Reference:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Webhook ID (path parameter) |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "deliveries": [
      {
        "id": 1001,
        "webhook_id": 1,
        "event_type": "order.created",
        "payload_json": {
          "id": 123,
          "order_number": "ORD-1709468833000",
          "customer_id": 42,
          "status": "pending",
          "total": "2700.00"
        },
        "status": "success",
        "response_code": 200,
        "created_at": "2025-09-23T11:40:00Z"
      },
      {
        "id": 1000,
        "webhook_id": 1,
        "event_type": "order.created",
        "payload_json": {
          "id": 122,
          "order_number": "ORD-1709468700000",
          "customer_id": 41,
          "status": "pending",
          "total": "1500.00"
        },
        "status": "success",
        "response_code": 200,
        "created_at": "2025-09-23T11:35:00Z"
      },
      {
        "id": 999,
        "webhook_id": 1,
        "event_type": "order.updated",
        "payload_json": {
          "id": 121,
          "order_number": "ORD-1709468600000",
          "status": "completed"
        },
        "status": "failed",
        "response_code": 500,
        "created_at": "2025-09-23T11:30:00Z"
      }
    ]
  }
}
```

**Delivery Status Values:**

- `pending` - Delivery is queued or in progress
- `success` - Endpoint returned 2xx status code
- `failed` - Endpoint returned error or did not respond

**Gotchas:** Only the 100 most recent deliveries are returned. Older deliveries may be archived or purged based on your store's retention policy. The `response_code` field will be null for pending/failed deliveries where no response was received. Use this view to debug integration issues and confirm your endpoint is receiving payloads correctly.

---

## Storefront Payment Webhooks

### POST /storefront/webhooks/mpesa - M-Pesa STK Push Callback

Safaricom M-Pesa payment callback endpoint for STK Push (Lipa na M-Pesa Online) results. Called by Safaricom Daraja when a customer completes or cancels the payment prompt on their phone.

**Auth:** Public webhook (IP allowlist optional; see below)

**Signature Verification:** None (optional IP allowlist only)

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/webhooks/mpesa" \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "MerchantCheckoutRequestID": "...",
        "CheckoutRequestID": "ws_CO_...",
        "ResultCode": 0,
        "ResultDesc": "The service request has been processed successfully.",
        "CallbackMetadata": {
          "Item": [
            { "Name": "Amount", "Value": 150 },
            { "Name": "MpesaReceiptNumber", "Value": "NHY51H60SL3" },
            { "Name": "TransactionDate", "Value": 20231201120530 },
            { "Name": "PhoneNumber", "Value": +254700000002 }
          ]
        }
      }
    }
  }'
```

**Request Fields (via Safaricom):**

| Field | Type | Description |
|-------|------|-------------|
| `Body.stkCallback.CheckoutRequestID` | string | Unique identifier for this payment attempt (from initiate endpoint) |
| `Body.stkCallback.ResultCode` | integer | 0 = success, non-zero = failure/cancel |
| `Body.stkCallback.ResultDesc` | string | Human-readable result message |
| `Body.stkCallback.CallbackMetadata.Item[]` | array | Additional data (amount, receipt, timestamp, phone) |

**Response (Always):**

```json
{
  "ResultCode": 0,
  "ResultDesc": "Accepted"
}
```

The endpoint always responds with success (ResultCode 0) to Safaricom, regardless of internal processing outcome. This prevents Safaricom from retrying indefinitely.

**Side Effects:**
- Updates the order's payment_status to `paid` or `failed` based on ResultCode.
- Creates or updates a Transaction record with the M-Pesa receipt number.
- Sends payment confirmation email if successful.
- Updates the order status to `processing` if payment successful.

**IP Allowlist (Optional):**

By default, all IPs are accepted. To restrict to Safaricom's production IPs, set environment variables:
- `MPESA_IP_ALLOWLIST_ENABLED=true` - Enable IP filtering
- `MPESA_ALLOWED_IPS` - Comma-separated extra IPs to allow (combined with Safaricom defaults)

When enabled, non-Safaricom IPs are logged and silently accepted (no error response).

**Safaricom Production IPs (Defaults):**
```
196.201.214.200, 196.201.214.206, 196.201.213.114,
196.201.214.207, 196.201.214.208, 196.201.213.44,
196.201.212.127, 196.201.212.128, 196.201.212.129,
196.201.212.132, 196.201.212.136, 196.201.212.138,
196.201.212.69, 196.201.214.222
```

**Gotchas:**
- This is a callback from Safaricom, not a customer-initiated API call. Do NOT call this endpoint from the storefront.
- Payment status is determined by ResultCode: 0 = success, anything else = failure.
- The endpoint is idempotent; duplicate callbacks for the same CheckoutRequestID are safe.
- Callback metadata (amount, receipt, timestamp) is not verified; use only for logging/audit.
- If order is not found, the callback is logged but returns success to Safaricom (no error leak).
- The endpoint does NOT validate the amount against the order total; Safaricom controls what was charged.

---

### POST /webhooks/mpesa - M-Pesa Payment Callback (Backwards-Compat Alias)

Receives payment confirmation callbacks from Safaricom when a customer completes or cancels an M-Pesa STK push payment request. This endpoint is a backwards-compatibility alias; the real handler lives at `/storefront/webhooks/mpesa`. Requests to this older URL are automatically forwarded.

**Auth:** Public (no authentication required; called by Safaricom servers)

**Workflow:**
1. Store initiates M-Pesa STK push via Pesapal or equivalent gateway
2. Safaricom returns a `CheckoutRequestID`
3. Customer enters USSD or responds to mobile prompt
4. Safaricom POSTs callback here with result (`ResultCode` 0 = paid, non-zero = failed/cancelled)
5. Handler looks up the transaction by `CheckoutRequestID`, updates order payment status, and sends WhatsApp notifications if applicable
6. Always responds `200 OK` to acknowledge receipt

```bash
curl -X POST "https://your-store-api.example.com/api/v1/webhooks/mpesa" \
  -H "Content-Type: application/json" \
  -d '{
    "Body": {
      "stkCallback": {
        "CheckoutRequestID": "ws_CO_01042025071421344710711",
        "ResultCode": 0,
        "ResultDesc": "The transaction has been received successfully.",
        "CallbackMetadata": {
          "Item": [
            { "Name": "Amount", "Value": 200 },
            { "Name": "MpesaReceiptNumber", "Value": "LHD61H5QX77" },
            { "Name": "TransactionDate", "Value": "20250104071421" },
            { "Name": "PhoneNumber", "Value": "+254700000002" }
          ]
        }
      }
    }
  }'
```

**Safaricom Callback Payload:**

| Field | Type | Description |
|-------|------|-------------|
| `Body.stkCallback.CheckoutRequestID` | string | Original request ID from the STK push initiation |
| `Body.stkCallback.ResultCode` | integer | `0` = paid, `1032` = user cancelled, `1037` = timed out, `1` = insufficient funds, `2001` = wrong PIN, etc. |
| `Body.stkCallback.ResultDesc` | string | Human-readable result message |
| `Body.stkCallback.CallbackMetadata.Item[]` | array | Payment details (only present when `ResultCode = 0`). Each item has `Name` (e.g. "Amount", "MpesaReceiptNumber") and `Value`. |

**Success Response (ResultCode = 0):**

When the callback indicates payment success (`ResultCode: 0`):
- Transaction is marked `completed` with the M-Pesa receipt number
- Associated order's `payment_status` is set to `paid`
- Loyalty points are awarded (if applicable)
- Order change notification is broadcast via WebSocket
- WhatsApp Storefront: sends payment confirmation message (only if the live STK poll is not active, to avoid duplicates)

**Failure Response (ResultCode ≠ 0):**

When the callback indicates cancellation or failure:
- Transaction is marked `failed`
- Order's `payment_status` remains `pending` (allows customer to retry)
- Order change notification broadcast with `event: 'order:stk_failed'` and a `reason` string
- WhatsApp Storefront: sends "payment failed" message with Retry/Cancel buttons (only if live poll inactive)

**Gotchas:**
- **Always responds 200 OK**: Even if processing fails, the handler always responds `{ ResultCode: 0, ResultDesc: 'Accepted' }` to acknowledge receipt. Safaricom treats any other status as delivery failure and retries. Errors are logged server-side for manual review.
- **No authentication**: This is a public endpoint called by Safaricom's infrastructure, not by your application. The `CheckoutRequestID` serves as the request token.
- **IP allowlist (optional)**: Set environment variable `MPESA_IP_ALLOWLIST_ENABLED=true` to restrict callbacks to Safaricom's known IP ranges. This requires your edge/proxy to accurately preserve the real client IP (e.g., via `X-Forwarded-For` or `CloudFlare-Connecting-IP`). Disabled by default to avoid accidentally dropping valid callbacks.
- **Transaction lookup**: The handler looks up the transaction by `CheckoutRequestID` stored in `transactions.transaction_id`. If not found, callback is silently acknowledged (no order update, just logged).
- **Already finalized**: If the transaction was already processed (e.g., a previous callback for the same request), the second callback is ignored.
- **Amount mismatch**: If the actual paid amount differs from the expected transaction amount, payment is still accepted but logged with a warning for manual review.
- **WhatsApp Storefront**: The callback only sends WhatsApp notifications if the storefront's live polling mechanism is not active (determined by transaction age). For orders created via WhatsApp Storefront, the order source and creation time determine whether this fallback message is sent.

**Error Scenarios (All Return 200 OK):**

| Scenario | Action |
|----------|--------|
| Missing `CheckoutRequestID` | Logged as warning; transaction not found; callback acknowledged |
| No transaction record for `CheckoutRequestID` | Logged as warning; no order update; callback acknowledged |
| Transaction already completed | Logged as info; callback acknowledged |
| Malformed request body | Logged as warning; callback acknowledged |
| Handler exception | Logged as error; callback acknowledged |

**Related Endpoints:**

- `POST /storefront/webhooks/mpesa` — The canonical endpoint (same logic, different URL for storefront-namespace organization)
- `GET /orders/:id` — Check order's payment status after callback
- WebSocket `order_changes` channel — Real-time updates on payment status changes

---

