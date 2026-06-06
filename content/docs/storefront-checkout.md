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
    "customer": { "email": "sam@example.com", "first_name": "Sam", "phone": "+254700000000" },
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

## Take payment

### POST /storefront/checkout/process-payment - Start payment

Kicks off payment for an order through a gateway. The response depends on the gateway: M-Pesa triggers an STK push; Pesapal/Paystack return a `redirect_url` to send the customer to.

| Body field | Type | Description |
| --- | --- | --- |
| `order_id` | number | Required |
| `gateway_name` | string | Required, e.g. `M-Pesa`, `Paystack`, `Pesapal` |
| `payment_data` | object | Gateway-specific (e.g. `phone` for M-Pesa; `storefront_base_url` for redirect returns) |

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

Call this from your "payment success" page to force a Pesapal/Paystack status check even if the callback never reached the backend. Returns the resolved `payment_status`.

```json
{ "status": "success", "data": { "payment_status": "paid" } }
```

### POST /storefront/paystack/reconcile - Reconcile Paystack by reference

Robust fallback when Paystack strips your callback query params: pass the Paystack `reference` and the backend verifies and updates the order.

```json
{ "reference": "ps_ref_123" }
```

## Unified Checkout (advanced)

For Cybersource Unified Checkout, three server-assisted steps are available: `POST /storefront/checkout/unified-checkout/capture-context`, `.../authorize`, and `.../record-result`. Use these only if your store is configured for Unified Checkout; most stores use M-Pesa, Pesapal, Paystack, or COD via the flow above.

> Gateway webhooks (`/storefront/webhooks/mpesa`, `/storefront/webhooks/pesapal/*`) are called server-to-server by the providers, not by your storefront. They confirm payments out of band; your storefront only needs the polling/verify endpoints above.
