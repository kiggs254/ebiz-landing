Customer accounts use the **session cookie**. After register or login, the session carries the customer, and protected endpoints (everything under `/storefront/customer/*`, plus a few others) work. They return `401` without a logged-in session. Always send `credentials: "include"`.

## Authentication

### POST /storefront/auth/register - Register

Creates a customer and logs them in (sets the session).

| Body field | Type | Description |
| --- | --- | --- |
| `email` | string | Required |
| `password` | string | Required |
| `first_name`, `last_name`, `phone` | string | Optional |

```json
{ "status": "success", "data": { "customer": { "id": 55, "email": "sam@example.com", "first_name": "Sam" } } }
```

### POST /storefront/auth/login - Log in

```json
{ "email": "sam@example.com", "password": "•••••••" }
```

On success, sets the session cookie and returns the customer. Right after login, merge any guest state: [`POST /storefront/cart/merge`](/docs/storefront-cart#post-storefront-cart-merge-merge-a-guest-cart-on-login) and `POST /storefront/wishlist/merge`.

### POST /storefront/auth/logout - Log out

Destroys the session.

### GET /storefront/auth/me - Current customer

Returns the logged-in customer, or `{ customer: null }` for guests. Safe to call on every page load to hydrate auth state.

```json
{ "status": "success", "data": { "customer": { "id": 55, "email": "sam@example.com", "first_name": "Sam", "last_name": "R" } } }
```

## Profile

### GET /storefront/customer/profile - Get profile

Requires auth. Returns the full customer record.

### PUT /storefront/customer/profile - Update profile

Requires auth. Updates `first_name`, `last_name`, and/or `phone`.

```json
{ "first_name": "Sam", "last_name": "Rivera", "phone": "+254700000000" }
```

## Addresses

All require auth. Addresses are returned in a storefront-friendly shape (`address_1`, `address_2`, `postal_code`, etc.).

### GET /storefront/customer/addresses - List addresses

### POST /storefront/customer/addresses - Add an address

| Body field | Type | Description |
| --- | --- | --- |
| `first_name` | string | Required |
| `last_name` | string | Optional |
| `address_1` | string | Required |
| `address_2` | string | Optional |
| `city` | string | Required |
| `state` | string | Optional |
| `postal_code` | string | Optional |
| `country` | string | Required |

```json
{
  "status": "success",
  "data": { "address": { "id": 12, "first_name": "Sam", "address_1": "12 Riverside", "city": "Nairobi", "country": "Kenya" } }
}
```

### PUT /storefront/customer/addresses/:id - Update an address

### DELETE /storefront/customer/addresses/:id - Delete an address

## Orders

### GET /storefront/customer/orders - List the customer's orders

Requires auth. Paginated.

| Query param | Type | Description |
| --- | --- | --- |
| `page` | number | Default `1` |
| `limit` | number | Default `20` |
| `status` | string | Optional order-status filter |

```json
{ "status": "success", "data": { "orders": [ /* with items + addresses */ ], "total": 6, "page": 1, "limit": 20 } }
```

### GET /storefront/customer/orders/:id - Get one order

Requires auth (and ownership). Includes items (with product + variant), addresses, transactions, and shipments.

## Subscriptions

### GET /storefront/customer/subscriptions - List subscriptions

Requires auth. Returns the customer's subscriptions with the package, schedule (`next_delivery_date`, `delivery_day_of_week`), and latest order. (Signing up for a subscription is covered in [Content & engagement](/docs/storefront-content#subscriptions).)

## Loyalty

The loyalty addon lets shoppers earn and redeem points. A redemption at checkout is OTP-verified.

### GET /storefront/loyalty/config - Public loyalty config

Returns whether loyalty is enabled and its rules (earn rate, redemption rate, min/max, OTP TTL, opt-in requirements). Public.

### POST /storefront/loyalty/preview - Preview redemption

Public. Given a phone or email plus cart items (and optional `coupon_code`), returns the customer's balance, the max redeemable points, and the estimated discount.

```json
{ "phone": "+254700000000", "items": [{ "product_id": 412, "quantity": 1 }] }
```

```json
{
  "status": "success",
  "data": { "eligible": true, "balance": 1480, "max_redeemable_points": 800, "estimated_discount_max": 80.0 }
}
```

### POST /storefront/loyalty/redemption/send-otp - Send redemption OTP

Public. Emails a verification code to the account matching the `phone` or `email`. Rate limited (`429` if requested too often).

### POST /storefront/loyalty/redemption/verify-otp - Verify OTP

Public. Verifies the `code` and returns a short-lived `redemption_token`.

```json
{ "status": "success", "data": { "redemption_token": "•••", "expires_in_minutes": 15 } }
```

Pass `{ token, points }` as `loyalty_redemption` to [`create-order`](/docs/storefront-checkout#post-storefront-checkout-create-order) to apply the discount.

### GET /storefront/customer/loyalty - Customer loyalty status

Requires auth. Returns the logged-in customer's balance, redemption rate, and opt-in/registration status.

### POST /storefront/loyalty/register - Opt in (multipart)

Requires auth. For programs that require opt-in: submits `full_name`, `phone`, and (if required) an `id_image` file via `multipart/form-data`.
