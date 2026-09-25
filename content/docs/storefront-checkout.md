The checkout flow: quote shipping, list payment methods, validate a coupon, create the order, take payment, then confirm. These endpoints are public and support guest checkout. They run on the session cookie, so send `credentials: "include"`.

A typical flow:

1. `POST /storefront/checkout/calculate-shipping` - show shipping options
2. `GET /storefront/checkout/payment-gateways` - show payment options
3. `POST /storefront/checkout/validate-coupon` - (optional) apply a discount
4. `POST /storefront/checkout/create-order` - create the pending order
5. `POST /storefront/checkout/process-payment` - start payment with a gateway
6. Poll `GET /storefront/orders/:id/payment-status` (or `verify-payment`) until resolved

## Shipping

### POST /storefront/checkout/calculate-shipping - Quote shipping

Returns available shipping methods and costs for an address + cart.

| Body field | Type | Description |
| --- | --- | --- |
| `country` | string | Required |
| `state`, `city`, `address`, `postal_code` | string | Address parts |
| `latitude`, `longitude`, `place_id` | varies | Optional, used by distance-based shipping |
| `items` | array | Cart lines (`product_id`, `variant_id`, `quantity`) |
| `branch_id` | number | Optional, branches addon only |

```json
{ "status": "success", "data": { "methods": [{ "id": 4, "name": "Standard", "cost": "300.00", "type": "flat_rate" }] } }
```

### GET /storefront/checkout/distance-based-shipping-config - Distance shipping config

Public config for the distance-based shipping addon (Google Maps key, origin, pricing). Accepts an optional `branch_id`. (`/storefront/checkout/convenient-couriers-config` is an alias.)

### GET /storefront/checkout/convenient-couriers-config - Distance-based shipping config

Alias for `/checkout/distance-based-shipping-config`. Returns the distance-based shipping addon configuration.

| Query param | Type | Description |
| --- | --- | --- |
| `branch_id` | number | Optional, branches addon only |

```json
{ "status": "success", "data": { "config": { "enabled": true, "nairobi_county_name": "Nairobi", "distance_calculation_method": "google_maps", "google_maps_api_key": "AIz..." } } }
```

### GET /storefront/delivery-promise - Delivery date estimate

Returns the estimated delivery date(s) based on the store's delivery schedule configuration (cutoff times, delivery days). Useful for displaying delivery promises on product and cart pages.

| Query param | Type | Description |
| --- | --- | --- |
| `method` | string | Optional shipping method name to filter the promise |

```bash
curl "https://your-store-api.example.com/api/v1/storefront/delivery-promise?method=standard"
```

```json
{
  "status": "success",
  "data": {
    "delivery_promise": {
      "date": "2025-09-27",
      "weekday": "Fri",
      "when": "tomorrow",
      "after_cutoff": false,
      "cutoff_label": "3:00 PM",
      "message": "Order by 3:00 PM for delivery by tomorrow"
    }
  }
}
```

Returns `null` if delivery promise is not configured. The message is locale-aware and timezone-aware.

## Payment methods

### GET /storefront/checkout/payment-gateways - List enabled gateways

Returns the payment gateways enabled for the store (or a branch), with the safe public fields only (no secrets).

| Query param | Type | Description |
| --- | --- | --- |
| `branch_id` | number | Optional, branches addon only |

```json
{ "status": "success", "data": { "gateways": [{ "name": "M-Pesa", "enabled": true }, { "name": "Paystack", "enabled": true }, { "name": "Cash on Delivery", "enabled": true }] } }
```

## Coupons

### POST /storefront/checkout/validate-coupon - Validate a coupon

Checks a coupon against the cart and returns the computed discount. Does not apply anything; pass the same `coupon_code` to `create-order` to actually use it.

| Body field | Type | Description |
| --- | --- | --- |
| `coupon_code` | string | Required |
| `items` | array | Cart lines (`product_id`, `variant_id`, `quantity`) |

```json
{
  "status": "success",
  "data": { "valid": true, "code": "WELCOME10", "type": "percentage", "value": "10", "subtotal": 158.0, "discount": 15.8 }
}
```

Returns `400` with a message for invalid, expired, used-up, or below-minimum coupons.

## Create order

### POST /storefront/checkout/create-order - Create an order

Creates a pending order (guest or logged-in). Validates products, recomputes the subtotal server-side, applies shipping/coupon/loyalty, links prescriptions if required, sends confirmation emails, and fires the `order.created` webhook.

| Body field | Type | Description |
| --- | --- | --- |
| `customer` | object | `{ email* , first_name, last_name, phone }` |
| `shipping_address` | object | `{ first_name, last_name, address_1, address_2, city, state, postal_code, country }` |
| `billing_address` | object | Same shape, or `{ same_as_shipping: true }` |
| `items` | array | `{ product_id, variant_id?, quantity }` (price is recomputed server-side) |
| `shipping_method_id` | number/string | A method id from `calculate-shipping`, or `distance-based-shipping` |
| `payment_method` | string | e.g. `mpesa`, `paystack`, `pesapal`, `cod` |
| `coupon_code` | string | Optional |
| `notes` | string | Optional customer note |
| `branch_id` | number | Optional, branches addon only |
| `loyalty_redemption` | object | Optional `{ token, points }` (see [loyalty](/docs/storefront-customers#loyalty)) |
| `prescription_ids` | number[] | Required if any item needs a prescription |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/checkout/create-order" \
  -H "Content-Type: application/json" --cookie cookies.txt \
  -d '{
    "customer": { "email": "sam@example.com", "first_name": "Sam", "phone": "+254700000004" },
    "shipping_address": { "first_name": "Sam", "last_name": "R", "address_1": "12 Riverside", "city": "Nairobi", "state": "Nairobi", "country": "Kenya" },
    "billing_address": { "same_as_shipping": true },
    "items": [{ "product_id": 412, "quantity": 1 }],
    "shipping_method_id": 4,
    "payment_method": "mpesa"
  }'
```

Responds `201` with the created order (status `pending`, payment_status `pending`) including items and addresses:

```json
{ "status": "success", "data": { "order": { "id": 1043, "order_number": "ORD-...", "status": "pending", "payment_status": "pending", "total": "458.00", "currency": "KES", "items": [], "addresses": [] } } }
```

Take the returned `order.id` into the payment step. The cart is cleared automatically on success.

**Branch rules** (branches addon, per the shop's [branch options](/docs/branches#get-branchesconfig-branch-options)):

| Situation | Response |
|---|---|
| `require_branch` is on and no `branch_id` was sent | `400` "Choose a branch to order from." |
| No `branch_id`, a default branch is set | The order goes to the default branch |
| The branch is paused or outside its ordering hours | `409` with the branch's message |
| A line isn't carried, is sold out, or has fewer left than ordered at the branch | `409` naming the item |

Lines are charged the branch price when per-branch pricing is on. The coupon, loyalty and distributor previews take the same optional `branch_id`, so their totals match checkout.

## Take payment

### POST /storefront/checkout/process-payment - Start payment

Kicks off payment for an order through a gateway. The response depends on the gateway: M-Pesa triggers an STK push; Pesapal, Paystack and Tingg return a `redirect_url` to send the customer to.

| Body field | Type | Description |
| --- | --- | --- |
| `order_id` | number | Required |
| `gateway_name` | string | Required, e.g. `M-Pesa`, `Paystack`, `Pesapal`, `Tingg` |
| `payment_data` | object | Gateway-specific (e.g. `phone` for M-Pesa; `storefront_base_url` for redirect returns; `return_path` for Tingg) |

```json
{ "status": "success", "data": { "redirect_url": "https://pay.example.com/...", "reference": "..." } }
```

### GET /storefront/orders/:id/payment-status - Poll payment status

After an STK push (or while waiting on a redirect), poll this to detect success, cancellation, or timeout without WebSockets.

```json
{
  "status": "success",
  "data": {
    "order_id": 1043,
    "order_number": "ORD-...",
    "payment_status": "paid",
    "status": "processing",
    "transaction": { "id": 88, "status": "completed", "method": "M-Pesa", "amount": "458.00", "reference": "QABC123", "created_at": "..." }
  }
}
```

### POST /storefront/orders/:id/verify-payment - Force a verification

Call this from your "payment success" page to force a Pesapal, Paystack or Tingg status check even if the callback never reached the backend. Returns the resolved `payment_status`.

```json
{ "status": "success", "data": { "payment_status": "paid" } }
```

### POST /storefront/paystack/reconcile - Reconcile Paystack by reference

Robust fallback when Paystack strips your callback query params: pass the Paystack `reference` and the backend verifies and updates the order.

```json
{ "reference": "ps_ref_123" }
```

### GET /storefront/webhooks/pesapal/callback - Pesapal payment callback

This is where customers return after completing or cancelling payment on Pesapal. The payment gateway redirects here with transaction metadata; the endpoint verifies the payment status and updates the order (or subscription).

**Auth:** Public. No authentication required — the Pesapal tracking ID is the sole credential.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/webhooks/pesapal/callback?OrderTrackingId=abc123&OrderMerchantReference=ORD-42"
```

| Query Param | Type | Description |
| --- | --- | --- |
| `OrderTrackingId` | string | Required. Pesapal's unique tracking ID for this transaction (case-insensitive) |
| `OrderMerchantReference` | string | Required. Your merchant reference. Use `ORD-{orderId}` for orders or `SUB-{subscriptionId}` for subscriptions. Backward compatible with legacy `order_number` format |
| `storefront` | string | Optional. Full storefront URL (with protocol and host) to redirect to instead of the configured default |
| `storefront_url` | string | Optional. Alternative parameter name for storefront URL override |

**Response:**

The endpoint does not return JSON. Instead, it **redirects (302) to your storefront** with a status query parameter:

- **Success:** `{storefront_base}/checkout?status=success&orderId={orderId}`
- **Failure:** `{storefront_base}/checkout?status=failed&orderId={orderId}`
- **Pending:** `{storefront_base}/checkout?status=pending&orderId={orderId}`

For subscriptions, the redirect is to `/subscription-success` with `subscriptionId` instead of `orderId`.

| Status | Meaning |
| --- | --- |
| `success` | Payment completed. Order `payment_status` is now `paid` |
| `failed` | Payment failed or was cancelled. Order `payment_status` is now `failed` |
| `pending` | Payment is pending (awaiting completion). Order remains in `pending` state |

**Gotchas:**

- The endpoint handles both new and existing transactions. If a transaction already exists for the tracking ID, it updates it; otherwise, it creates one.
- For subscriptions, successful payment activates the subscription with a `current_period_end` one month from now and calculates the next delivery date based on the shop's `delivery_day_of_week` setting.
- If the `storefront_url` or `storefront` parameter is invalid or missing, the redirect uses the default configured `storefront_url` from settings, falling back to the `STOREFRONT_URL` environment variable.
- Always read `OrderTrackingId` case-insensitively — Pesapal's redirects vary in capitalization.

## Tingg (Cellulant)

Tingg's hosted checkout takes M-Pesa, Airtel Money and cards on one page. Turn it on in **Settings → Payments → Tingg** with the API key, client ID/secret and service code from the Tingg merchant dashboard. The IPN secret is generated for you, and the notification and return URLs are sent with every checkout, so nothing needs setting in the Tingg dashboard.

**Flow:**

1. Create the order (`POST /storefront/checkout/create-order`).
2. `POST /storefront/checkout/process-payment` with `gateway_name: "Tingg"`. Send `payment_data.storefront_base_url` (your site's origin) and `payment_data.return_path` (where the customer should land, e.g. `/checkout/success`). The customer's email, phone and name come from the order when you leave them out.
3. Redirect the customer to `data.redirect_url` (Tingg's page).
4. Tingg returns them via the backend, which confirms the payment with Tingg and redirects to `{storefront_base_url}{return_path}` with:

| Query param | Meaning |
| --- | --- |
| `payment` | `success` (order is paid), `failed` (not paid — offer a retry), or `pending` (not confirmed yet) |
| `order` / `order_id` | The order number and id |
| `recheck` | Only while `pending`: a backend link that checks again and redirects back |
| `gateway` | `tingg` |

```json
{
  "order_id": 1043,
  "gateway_name": "Tingg",
  "payment_data": { "storefront_base_url": "https://shop.example.com", "return_path": "/checkout/success" }
}
```

**Retrying:** call `process-payment` again for the same order. Each order keeps one Tingg reference, so this re-opens the same payment rather than starting a new one. An order that is already paid is refused.

**How an order gets marked paid:** Tingg's notification (`POST /storefront/webhooks/tingg/ipn/{secret}`), the customer's return, `verify-payment` and a reconcile sweep every 2 minutes all ask Tingg what was actually paid. The order is marked paid only when Tingg reports a payment covering the amount due, and only once. A payment that doesn't match the amount is left pending, with a note on the order for staff.

## Unified Checkout (Cybersource)

Unified Checkout is a hosted payment form from Cybersource (formerly Flex Microform) that handles card, wallet, and local payment methods in a single iframe. This section documents the API flow for initiating, authorizing, and recording payment results.

### POST /storefront/checkout/unified-checkout/capture-context - Get Unified Checkout Context

Request a Cybersource capture context JWT for displaying the Unified Checkout form on the storefront. This context is required to initialize the Unified Checkout JavaScript library.

**Auth:** Public (no authentication required)

```bash
curl -X POST https://your-store-api.example.com/api/v1/storefront/checkout/unified-checkout/capture-context \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 12345,
    "email": "customer@example.com",
    "return_url": "https://storefront.example.com/checkout?payment=pending&order_id=12345",
    "target_origin": "https://storefront.example.com"
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `order_id` | integer | Yes | Order ID (must exist and payment_status != 'paid') |
| `email` | string | No | Customer email for Cybersource context |
| `return_url` | string | No | Storefront URL to return to after payment (for redirect flows) |
| `target_origin` | string | No | Storefront origin for iframe postMessage communication |

**Response:**

```json
{
  "status": "success",
  "data": {
    "capture_context": "eyJraWQiOiI...",
    "client_library": "https://testpayments.cybersource.com/unified-checkout/0.34/unified-checkout.min.js",
    "client_library_integrity": "sha256-...",
    "transaction_ref": "ABC123",
    "expires_at": "2025-09-23T19:30:00Z",
    "use_complete_mandate": false
  }
}
```

**Status Codes:**
- `200` - Context generated successfully
- `400` - Order already paid, Unified Checkout not enabled, or invalid order
- `404` - Order not found

**Gotchas:**
- The capture_context JWT expires after ~15 minutes; request a fresh one if the form is left open for a long time.
- target_origin should match the storefront's origin; mismatches may cause postMessage failures.
- If email is not provided, Cybersource will prompt for it in the form.

### POST /storefront/checkout/unified-checkout/authorize - Authorize with Transient Token

Process payment authorization using a transient token obtained from Cybersource Unified Checkout (non-orchestrated flow).

**Auth:** Public (no authentication required)

```bash
curl -X POST https://your-store-api.example.com/api/v1/storefront/checkout/unified-checkout/authorize \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 12345,
    "transient_token": "eyJraWQiOiI...",
    "billing": {
      "first_name": "John",
      "last_name": "Doe",
      "address_1": "123 Main St",
      "city": "San Francisco",
      "state": "CA",
      "postal_code": "94102",
      "country": "US"
    }
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `order_id` | integer | Yes | Order ID |
| `transient_token` | string | Yes | Transient token JWT from Unified Checkout form |
| `billing` | object | No | Billing address details |

**Response:**

```json
{
  "status": "success",
  "data": {
    "success": true,
    "transaction_id": "6142353050326433653031",
    "status": "completed",
    "message": "Payment authorized",
    "gateway": "Unified Checkout"
  }
}
```

**Status Codes:**
- `200` - Authorization successful
- `400` - Missing order_id or transient_token, payment processing error
- `404` - Order not found

**Gotchas:**
- Transient tokens are single-use; attempting to reuse a token fails.
- This flow is for non-orchestrated (customer-initiated) payments; see record-result for orchestrated flow.
- The billing address is optional; Cybersource can use the card's billing address if not provided.

### POST /storefront/checkout/unified-checkout/record-result - Record Orchestrated Payment Result

Record the payment result from Cybersource Unified Checkout orchestrated (.complete) flow. Used when Cybersource handles the authorization and the storefront calls .complete() to get the result.

**Auth:** Public (no authentication required)

```bash
curl -X POST https://your-store-api.example.com/api/v1/storefront/checkout/unified-checkout/record-result \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": 12345,
    "complete_response": {
      "status": "AUTHORIZED",
      "details": {
        "transaction_id": "6142353050326433653031",
        "processorResponse": "00"
      }
    }
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `order_id` | integer | Yes | Order ID |
| `complete_response` | object | Yes | Complete response from Cybersource .complete() method |

**Response:**

```json
{
  "status": "success",
  "data": {
    "success": true,
    "transaction_id": "6142353050326433653031",
    "status": "completed",
    "message": "Payment authorized",
    "gateway": "Unified Checkout"
  }
}
```

**Status Codes:**
- `200` - Result recorded successfully
- `400` - Missing order_id or complete_response, invalid response format
- `404` - Order not found

**Gotchas:**
- This endpoint is for the orchestrated flow where Cybersource manages the authorization. For non-orchestrated flow (where the storefront manages auth), use /authorize instead.
- The complete_response must be the exact response object from Cybersource's .complete() call; don't modify it.
- If the response status is not AUTHORIZED, payment_status will be set to failed but no error is returned (idempotent).
