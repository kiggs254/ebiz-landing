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

### POST /storefront/auth/forgot-password - Request password reset

Sends a password reset email (or SMS fallback) to the customer's email or phone. Returns success regardless of whether the account exists (prevents enumeration). Safe to call with just email OR phone.

**Auth:** Public. No authentication required.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sam@example.com"
  }'
```

| Body field | Type | Description |
| --- | --- | --- |
| `email` | string | Customer email (optional if phone is provided) |
| `phone` | string | Customer phone (optional if email is provided) |

```json
{ "status": "success", "data": { "sent": true, "message": "If that account exists, a password reset link has been sent." } }
```

**Gotcha:** The response is the same whether the account was found or not. The frontend should always show "Check your email" — avoid disclosing whether an email exists. The reset link is time-limited and single-use.

### GET /storefront/auth/set-password/validate - Validate password reset token

Before showing the password-reset form, validate the token sent in the email link. Returns the customer's email and first name for display, or `valid: false` if the token is expired or invalid.

**Auth:** Public. No authentication required — the token is the only credential.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/auth/set-password/validate?token=eyJhbGc..."
```

| Query Param | Type | Description |
| --- | --- | --- |
| `token` | string | Required. Password reset token from the email link |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "valid": true,
    "email": "amina@example.com",
    "first_name": "Amina"
  }
}
```

When the token is invalid or expired:

```json
{
  "status": "success",
  "data": {
    "valid": false
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `valid` | boolean | Whether the token is valid and not expired |
| `email` | string | Customer email (only when `valid: true`) |
| `first_name` | string | Customer first name (only when `valid: true`, may be null) |

**Gotchas:**

- Both missing and expired tokens return `valid: false` — don't leak whether an email is registered.
- Use the customer's `email` and `first_name` to personalize the form ("Reset password for Amina").
- Always pass the full token (unchanged) to the `/set-password` endpoint.

### POST /storefront/auth/set-password - Set/reset password with token

Consume a password reset token and apply the new password. On success, the customer is automatically logged in — no second login prompt is needed.

**Auth:** Public. No authentication required — the token is the credential.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/auth/set-password" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGc...",
    "password": "newpassword123"
  }'
```

| Field | Type | Description |
| --- | --- | --- |
| `token` | string | Required. Password reset token (unchanged from the email link) |
| `password` | string | Required. New password. Write-only, not returned in responses |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "customer": {
      "id": 42,
      "email": "amina@example.com",
      "first_name": "Amina",
      "last_name": "Yeboah"
    }
  }
}
```

| Status | Meaning |
| --- | --- |
| `200` | Password set and customer logged in (session cookie is set) |
| `400` | Missing token or password, or token format invalid |
| `401` | Token is invalid or expired |

**Gotchas:**

- The endpoint validates the token's expiry server-side; don't trust client-side validation.
- On success, the response includes a session cookie (`shopflow.sid`) — the customer is logged in and can access `/storefront/customer/*` endpoints immediately.
- The token can only be used once; attempting to reuse it returns `401`.
- Redirect to `/account` after a successful password reset — the customer is already authenticated.

## Profile

### GET /storefront/customer/profile - Get profile

Requires auth. Returns the full customer record.

### PUT /storefront/customer/profile - Update profile

Requires auth. Updates `first_name`, `last_name`, and/or `phone`.

```json
{ "first_name": "Sam", "last_name": "Rivera", "phone": "+254700000004" }
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
{ "phone": "+254700000004", "items": [{ "product_id": 412, "quantity": 1 }] }
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

## Affiliate Program

The affiliate addon lets customers become referrers, earn commissions on referred sales, and withdraw earnings. All endpoints require a logged-in customer session.

### GET /storefront/customer/affiliate - Get affiliate status

Fetch the signed-in customer's affiliate status, referral code, commission rate, and wallet balance.

Returns `{ enabled: false, enrolled: false }` if the program is disabled.

**Auth:** Signed-in customer session.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/customer/affiliate" \
  -H "Cookie: shopflow.sid=••••"
```

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "enrolled": true,
    "affiliate": {
      "id": 1,
      "code": "REF123ABC",
      "status": "approved",
      "rejection_reason": null,
      "payout_method": "paystack",
      "account_number": "0012345678",
      "bank_code": "057",
      "account_name": "John Doe"
    },
    "commission": 10.0,
    "referral_discount": 5.0,
    "wallet": {
      "available_balance": 5000.0,
      "pending_balance": 1500.0,
      "lifetime_earned": 25000.0,
      "lifetime_withdrawn": 18500.0,
      "lifetime_spent": 0.0,
      "currency": "KES"
    },
    "stats": {
      "clicks": 12,
      "conversions": 8,
      "orders_total": 500.0,
      "commission_pending": 1500.0,
      "commission_available": 5000.0,
      "commission_paid": 18500.0,
      "commission_lifetime": 25000.0
    },
    "min_payout_amount": 1000.0,
    "payout_methods": ["paystack", "manual"]
  }
}
```

**Gotcha:** If enrolled but pending approval, `status` is `"pending"` and wallet data may be incomplete. If `auto_approve: true` in the response (when not enrolled), joining auto-approves immediately.

### POST /storefront/customer/affiliate/apply - Join the program

Submit an application to the affiliate program. If `auto_approve` is enabled on the storefront, the customer is approved instantly; otherwise their application is queued for manual review.

Idempotent — applying twice when already enrolled returns `201` again (re-applying after rejection is supported).

**Auth:** Signed-in customer session.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/customer/affiliate/apply" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=••••" \
  -d '{
    "payout_method": "paystack",
    "bank_code": "057",
    "account_number": "0012345678",
    "account_name": "John Doe"
  }'
```

| Body field | Type | Description |
| --- | --- | --- |
| `payout_method` | string | `"paystack"` or `"manual"` (optional at signup; can be added later) |
| `bank_code` | string | Bank code if using Paystack (optional) |
| `account_number` | string | Account number (optional) |
| `account_name` | string | Account holder name (optional) |

```json
{
  "status": "success",
  "data": {
    "affiliate": {
      "id": 1,
      "code": "REF123ABC",
      "status": "approved"
    }
  }
}
```

Returns `503` if the program is disabled on the storefront.

### PUT /storefront/customer/affiliate/payout-details - Update payout destination

Set or update where affiliate earnings are paid out. At least one field is required.

**Auth:** Signed-in customer session.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/storefront/customer/affiliate/payout-details" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=••••" \
  -d '{
    "payout_method": "paystack",
    "bank_code": "057",
    "account_number": "0012345678",
    "account_name": "John Doe"
  }'
```

| Body field | Type | Description |
| --- | --- | --- |
| `payout_method` | string | `"paystack"` or `"manual"` |
| `bank_code` | string | Bank code (if paystack) |
| `account_number` | string | Account number |
| `account_name` | string | Account holder name |

```json
{ "status": "success", "data": { "updated": true } }
```

Returns `404` if the customer is not enrolled in the program.

### GET /storefront/customer/affiliate/wallet - Wallet ledger

Paginated list of all wallet transactions (commissions earned, adjustments, withdrawals).

**Auth:** Signed-in customer session.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/customer/affiliate/wallet?page=1&limit=25" \
  -H "Cookie: shopflow.sid=••••"
```

| Query param | Type | Description |
| --- | --- | --- |
| `page` | number | Default `1` |
| `limit` | number | Default `25`, max `100` |

```json
{
  "status": "success",
  "data": {
    "enrolled": true,
    "wallet": {
      "available_balance": 5000.0,
      "pending_balance": 1500.0,
      "currency": "KES"
    },
    "entries": [
      {
        "id": 101,
        "affiliate_id": 1,
        "type": "commission",
        "amount": 500.0,
        "reference": "ORDER-456",
        "description": null,
        "created_at": "2026-09-20T14:32:00Z"
      }
    ],
    "total": 24,
    "page": 1,
    "limit": 25
  }
}
```

### GET /storefront/customer/affiliate/referrals - Referrals and conversions

Paginated list of referrals (people who signed up via the affiliate's code) and which ones converted to orders.

**Auth:** Signed-in customer session.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/customer/affiliate/referrals?page=1&limit=25" \
  -H "Cookie: shopflow.sid=••••"
```

| Query param | Type | Description |
| --- | --- | --- |
| `page` | number | Default `1` |
| `limit` | number | Default `25`, max `100` |

```json
{
  "status": "success",
  "data": {
    "enrolled": true,
    "referrals": [
      {
        "id": 201,
        "affiliate_id": 1,
        "customer_id": 55,
        "order_id": 456,
        "amount": 500.0,
        "status": "approved",
        "order": {
          "id": 456,
          "order_number": "ORD-2026-001",
          "status": "completed",
          "created_at": "2026-09-19T10:00:00Z"
        }
      }
    ],
    "total": 8,
    "page": 1,
    "limit": 25
  }
}
```

### POST /storefront/customer/affiliate/payout - Request withdrawal

Initiate a payout from the affiliate wallet. Amount must be >= `min_payout_amount`.

**Auth:** Signed-in customer session.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/customer/affiliate/payout" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=••••" \
  -d '{
    "amount": 5000.0,
    "method": "paystack"
  }'
```

| Body field | Type | Description |
| --- | --- | --- |
| `amount` | number | Required. Withdrawal amount. |
| `method` | string | Optional. `"paystack"` or `"manual"`. Uses affiliate's default if omitted. |

```json
{
  "status": "success",
  "data": {
    "payout": {
      "id": 301,
      "reference": "PAYOUT-2026-001",
      "amount": 5000.0,
      "status": "pending",
      "method": "paystack"
    }
  }
}
```

Returns `404` if the customer is not enrolled.

**Gotcha:** A pending payout moves the funds from `available_balance` to `pending_balance` immediately. The status progresses to `processing`, then `completed` (or `failed`). The next call to GET `/customer/affiliate/wallet` will show the updated balances.

### GET /storefront/customer/affiliate/payouts - Withdrawal history

Paginated list of all payout requests and their current statuses.

**Auth:** Signed-in customer session.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/customer/affiliate/payouts?page=1&limit=25" \
  -H "Cookie: shopflow.sid=••••"
```

| Query param | Type | Description |
| --- | --- | --- |
| `page` | number | Default `1` |
| `limit` | number | Default `25`, max `100` |

```json
{
  "status": "success",
  "data": {
    "enrolled": true,
    "payouts": [
      {
        "id": 301,
        "affiliate_id": 1,
        "amount": 5000.0,
        "reference": "PAYOUT-2026-001",
        "status": "completed",
        "method": "paystack",
        "created_at": "2026-09-20T14:30:00Z",
        "updated_at": "2026-09-21T08:15:00Z"
      }
    ],
    "total": 3,
    "page": 1,
    "limit": 25
  }
}
```
