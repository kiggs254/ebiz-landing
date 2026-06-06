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

---

