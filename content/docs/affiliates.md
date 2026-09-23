The Affiliate addon runs a referral programme: approved affiliates get a code, shoppers who arrive through it can
be offered a discount, and the affiliate earns commission when the referred order matures. Commission lands in the
affiliate's wallet and leaves it as a payout — automatically over Paystack transfers, or settled by hand.

There are two surfaces:

- **Storefront endpoints** (`/storefront/affiliate/*`) — public, no authentication. They **never return 503**: when
  the programme is off they answer normally and say so (`enabled: false`, `tracked: false`, `valid: false`), so a
  storefront can call them unconditionally and render nothing.
- **Admin endpoints** (`/affiliate/*`) — **admin session** only. Every one of them returns `503` while the addon is
  switched off under **Settings → Addons**, **except** `GET` / `PUT /affiliate/config`, which stay reachable so the
  programme can be configured before it is switched on.

## Storefront endpoints (public)

### GET /storefront/affiliate/config - Affiliate Program Configuration

Retrieve customer-facing affiliate program settings including commission structure, referral discount terms, and payout methods. This endpoint always returns a 200 (returns `enabled: false` when the addon is off, so storefronts don't need special error handling).

**Auth:** Public (no authentication required)

```bash
curl -X GET "https://your-store-api.example.com/api/v1/storefront/affiliate/config"
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "config": {
      "enabled": true,
      "program_name": "Refer & Earn",
      "terms": "Earn commission on every referral",
      "auto_approve": false,
      "commission_type": "percentage",
      "commission_value": 10,
      "referral_discount_type": "percentage",
      "referral_discount_value": 15,
      "referral_first_order_only": false,
      "referral_min_order": 50,
      "cookie_days": 30,
      "min_payout_amount": 100,
      "payout_methods": ["bank_transfer", "wallet"],
      "wallet_pay_enabled": true,
      "wallet_pay_max_percent": 50
    }
  }
}
```

**Response fields:**

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | boolean | Whether affiliate program is active |
| `program_name` | string | Marketing name for the program |
| `terms` | string | Program terms or description |
| `auto_approve` | boolean | Whether applications auto-approve or require manual review |
| `commission_type` | string | `"fixed"` or `"percentage"` commission structure |
| `commission_value` | number | Commission amount (fixed) or rate (percentage) |
| `referral_discount_type` | string | `"fixed"` or `"percentage"` discount given to referred customer |
| `referral_discount_value` | number | Discount amount or percentage |
| `referral_first_order_only` | boolean | Discount applies to first order only |
| `referral_min_order` | number | Minimum order total to qualify for discount |
| `cookie_days` | integer | How many days to track visitor via referral cookie |
| `min_payout_amount` | number | Minimum wallet balance to request payout |
| `payout_methods` | array | Available payout methods (e.g., `bank_transfer`, `wallet`) |
| `wallet_pay_enabled` | boolean | Whether affiliates can use wallet balance at checkout |
| `wallet_pay_max_percent` | number | Max percent of order total payable from affiliate wallet |

**Gotchas:**
- Returns only customer-facing settings; internal payout configuration omitted.
- If program is disabled, returns `enabled: false` with no other fields.

---

### POST /storefront/affiliate/track - Track Referral Click

Record when a visitor lands on the storefront via an affiliate referral link. Returns a visitor token to store in the storefront's referral cookie.

**Auth:** Public (no authentication required)

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/affiliate/track" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "MYREF123",
    "visitor_token": "",
    "landing_path": "/products/category/tshirts",
    "referrer_url": "https://affiliate-site.example.com"
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | Affiliate referral code (case-sensitive) |
| `visitor_token` | string | No | Existing visitor token (for `first_click` attribution model) |
| `landing_path` | string | No | URL path where link landed |
| `referrer_url` | string | No | Referrer URL from browser |

**Response (Valid Code):**

```json
{
  "status": "success",
  "data": {
    "tracked": true,
    "visitor_token": "eyJhbGc...",
    "code": "MYREF123",
    "cookie_days": 30
  }
}
```

**Response (Unapproved/Invalid Code):**

```json
{
  "status": "success",
  "data": {
    "tracked": false
  }
}
```

**Gotchas:**
- Invalid or unapproved affiliate codes return `tracked: false`, not an error. This prevents breaking storefront landing pages if a link becomes stale.
- With `first_click` attribution, if a visitor_token is passed, it is returned as-is to preserve the original referrer's credit.
- With `last_click` attribution, a fresh visitor_token is always minted.
- Visitor token is an opaque JWT; do not parse or validate it on the storefront.

---

### POST /storefront/affiliate/preview-discount - Preview Affiliate Discount

Calculate what discount applies for a given affiliate code and cart subtotal. Validates the code, minimum order threshold, self-referral blocks, and first-order-only gates before returning the discount.

**Auth:** Public (no authentication required)

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/affiliate/preview-discount" \
  -H "Content-Type: application/json" \
  -d '{
    "code": "MYREF123",
    "subtotal": 150.00,
    "email": "customer@example.com"
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `code` | string | Yes | Affiliate referral code |
| `subtotal` | number | Yes | Order subtotal before discounts (must be above `referral_min_order`) |
| `email` | string | No | Customer email (for first-order and self-referral checks) |

**Response (Valid Code):**

```json
{
  "status": "success",
  "data": {
    "valid": true,
    "discount": 22.50,
    "code": "MYREF123",
    "reason": null
  }
}
```

**Response (Invalid Code):**

```json
{
  "status": "success",
  "data": {
    "valid": false,
    "discount": 0,
    "code": null,
    "reason": "invalid_code"
  }
}
```

**Response (Below Minimum Order):**

```json
{
  "status": "success",
  "data": {
    "valid": false,
    "discount": 0,
    "code": null,
    "reason": "below_minimum",
    "min_order": 50
  }
}
```

**Possible Failure Reasons:**
- `invalid_code`: Affiliate code not found or not approved.
- `below_minimum`: Subtotal is below the configured minimum order threshold.
- `self_referral`: Customer email matches the affiliate's own email (blocked if configured).
- `not_first_order`: Customer has prior orders, but code applies to first-order-only (if configured).

**Gotchas:**
- Mirrors checkout's validation rules exactly, so the UI can't promise a discount that checkout will reject.
- Email is optional; if omitted, self-referral and first-order checks are skipped.
- Per-affiliate commission overrides are not exposed; only the store-wide rate is visible here.

## Admin: programme configuration

### GET /affiliate/config - Get programme settings

Retrieve the complete programme configuration including commission rates, referral discounts, payout settings, and the list of order statuses the maturity trigger can use.

**Auth:** Admin session

```bash
curl "https://your-store-api.example.com/api/v1/affiliate/config" \
  --cookie cookies.txt
```

```json
{
  "status": "success",
  "data": {
    "config": {
      "enabled": true,
      "program_name": "Affiliate Programme",
      "terms": "Terms of the programme",
      "auto_approve": true,
      "self_referral_blocked": true,
      "commission_type": "percentage",
      "commission_value": 5,
      "commission_basis": "subtotal",
      "referral_discount_type": "percentage",
      "referral_discount_value": 5,
      "referral_first_order_only": true,
      "referral_min_order": 0,
      "cookie_days": 30,
      "attribution_model": "last_click",
      "maturity_status": "delivered",
      "hold_days": 0,
      "min_payout_amount": 500,
      "payout_methods": ["paystack", "manual"],
      "wallet_pay_enabled": true,
      "wallet_pay_max_percent": 100
    },
    "order_statuses": ["pending", "processing", "shipped", "in_transit", "on_hold", "completed", "cancelled", "delivered"]
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `enabled` | boolean | Is the programme active? |
| `program_name` | string | Display name of the programme |
| `terms` | string | Markdown terms and conditions |
| `auto_approve` | boolean | Automatically approve new applicants |
| `self_referral_blocked` | boolean | Prevent customers from referring themselves |
| `commission_type` | string | `percentage` or `fixed` |
| `commission_value` | number | Rate or fixed amount per sale |
| `commission_basis` | string | Calculate on `subtotal`, `total`, or `subtotal_after_discount` |
| `referral_discount_type` | string | Discount applied to referred customer: `percentage` or `fixed` |
| `referral_discount_value` | number | Discount rate or amount |
| `referral_first_order_only` | boolean | Only discount the referral's first order |
| `referral_min_order` | number | Referral must spend at least this to unlock discount |
| `cookie_days` | integer | How long the referral cookie persists |
| `attribution_model` | string | `first_click` or `last_click` — which click gets credit |
| `maturity_status` | string | Order must reach this status before commission moves to `available` |
| `hold_days` | integer | Additional hold after maturity (e.g. returns window) |
| `min_payout_amount` | number | Minimum balance to request a payout |
| `payout_methods` | array | Available withdrawal rails (`paystack`, `manual`) |
| `wallet_pay_enabled` | boolean | Can affiliates spend their balance as store credit? |
| `wallet_pay_max_percent` | number | Max % of order that wallet can cover |

### PUT /affiliate/config - Update programme settings

Update one or more programme settings. Only fields you pass are modified; others keep their current value.

**Auth:** Admin session

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/affiliate/config" \
  -H "Content-Type: application/json" --cookie cookies.txt \
  -d '{
    "affiliate_commission_value": 8,
    "affiliate_min_payout_amount": 1000
  }'
```

Response is identical to GET `/config`.

**Gotchas:**
- Commission rate changes only apply to **new** orders; existing commissions retain their snapshotted rates.
- Changing `maturity_status` does not recalculate pending commissions — they wait for the order to hit the status at the time the rule was active.

---

## Admin: affiliates

### GET /affiliate - List affiliates

Retrieve a paginated list of registered affiliates with optional filtering by status or search term.

**Auth:** Admin session

| Query param | Type | Description |
| --- | --- | --- |
| `page` | integer | Default `1` |
| `limit` | integer | Default `25`, max `100` |
| `status` | string | Filter: `all` (default), `pending`, `approved`, `rejected`, `suspended` |
| `search` | string | Filter by referral code, customer email, or name |

```bash
curl "https://your-store-api.example.com/api/v1/affiliate?status=approved&limit=20" \
  --cookie cookies.txt
```

```json
{
  "status": "success",
  "data": {
    "affiliates": [
      {
        "id": 1,
        "customer_id": 42,
        "code": "REF-ABC123DEF",
        "status": "approved",
        "rejection_reason": null,
        "approved_at": "2026-01-15T10:30:00.000Z",
        "approved_by": 5,
        "commission_type": null,
        "commission_value": null,
        "referral_discount_type": null,
        "referral_discount_value": null,
        "payout_method": "paystack",
        "bank_code": "011",
        "account_number": "0011234567",
        "account_name": "John Doe",
        "notes": "Premium affiliate",
        "customer": {
          "id": 42,
          "email": "john@example.com",
          "first_name": "John",
          "last_name": "Doe",
          "phone": "+254700000000"
        },
        "wallet": {
          "id": 1,
          "affiliate_id": 1,
          "available_balance": 5000,
          "pending_balance": 1500,
          "lifetime_earned": "15000.00",
          "lifetime_withdrawn": "10000.00",
          "currency": "KES"
        },
        "created_at": "2025-12-20T08:15:00.000Z",
        "updated_at": "2026-01-15T10:30:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 20
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | integer | Affiliate ID |
| `code` | string | Unique referral code |
| `status` | string | `pending`, `approved`, `rejected`, or `suspended` |
| `commission_type` | string or null | Per-affiliate override; null means inherit store config |
| `commission_value` | number or null | Per-affiliate override rate/amount; null means inherit store config |
| `payout_method` | string | `paystack` or `manual`; required if approved |
| `bank_code` | string | Paystack bank code (for Paystack payouts) |
| `account_number` | string | Bank account or M-Pesa number |
| `account_name` | string | Account holder name |
| `wallet` | object | Current balance and totals (only when loaded) |

### GET /affiliate/stats - Programme statistics

Snapshot counts and totals: affiliates by approval status, commissions by clearance status, pending payouts.

**Auth:** Admin session

```bash
curl "https://your-store-api.example.com/api/v1/affiliate/stats" \
  --cookie cookies.txt
```

```json
{
  "status": "success",
  "data": {
    "affiliates_total": 47,
    "affiliates_pending": 5,
    "affiliates_approved": 40,
    "commission_pending": 3250.50,
    "commission_available": 8900.00,
    "commission_paid": 25000.00,
    "payouts_awaiting": 2
  }
}
```

### GET /affiliate/:id - Get affiliate details

Retrieve full details for a specific affiliate including wallet balance, customer info, and stats.

**Auth:** Admin session

```bash
curl "https://your-store-api.example.com/api/v1/affiliate/1" \
  --cookie cookies.txt
```

```json
{
  "status": "success",
  "data": {
    "affiliate": { "id": 1, "..." },
    "stats": {
      "clicks": 12,
      "conversions": 8,
      "orders_total": "5000.00",
      "commission_pending": "2500.00",
      "commission_available": "5000.00",
      "commission_paid": "10000.00",
      "commission_lifetime": "17500.00"
    }
  }
}
```

### PUT /affiliate/:id/status - Approve, reject, or suspend affiliate

Transition an affiliate's status. Valid flows:
- `pending` → `approved` or `rejected`
- `approved` → `suspended`
- `suspended` → `approved`

When rejecting, optionally provide a reason that the affiliate can see.

**Auth:** Admin session

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/affiliate/1/status" \
  -H "Content-Type: application/json" --cookie cookies.txt \
  -d '{
    "status": "approved"
  }'
```

For rejection:

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/affiliate/1/status" \
  -H "Content-Type: application/json" --cookie cookies.txt \
  -d '{
    "status": "rejected",
    "rejection_reason": "Business address verification failed"
  }'
```

Response:

```json
{
  "status": "success",
  "data": {
    "affiliate": {
      "id": 1,
      "status": "approved",
      "approved_at": "2026-01-15T10:30:00.000Z",
      "approved_by": 5,
      "rejection_reason": null,
      "..."
    }
  }
}
```

**Gotchas:**
- Approving an affiliate creates their wallet if it doesn't exist.
- Rejecting clears the approval timestamp and sets `rejection_reason`.

### PUT /affiliate/:id - Update affiliate details

Override global rates and set bank/payout details on a per-affiliate basis. Pass `null` or empty string to clear an override.

**Auth:** Admin session

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/affiliate/1" \
  -H "Content-Type: application/json" --cookie cookies.txt \
  -d '{
    "commission_type": "percentage",
    "commission_value": 8,
    "payout_method": "paystack",
    "bank_code": "011",
    "account_number": "0011234567",
    "account_name": "John Doe",
    "notes": "Premium affiliate - higher rate"
  }'
```

Response:

```json
{
  "status": "success",
  "data": {
    "affiliate": { "..." }
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `commission_type` | string | `percentage` or `fixed` |
| `commission_value` | number | Rate or fixed amount |
| `referral_discount_type` | string | Discount on referred customer's order |
| `referral_discount_value` | number | Discount rate/amount |
| `payout_method` | string | `paystack` or `manual` |
| `bank_code` | string | Paystack bank code (for Paystack transfers) |
| `account_number` | string | Bank account or M-Pesa paybill/till number |
| `account_name` | string | Account holder name (required for Paystack) |
| `notes` | string | Internal notes about the affiliate |

---

## Admin: referrals

### GET /affiliate/:id/referrals - List affiliate referrals

Get paginated list of customers referred by an affiliate, including order details when the referral converted.

**Auth:** Admin session

| Query param | Type | Description |
| --- | --- | --- |
| `page` | integer | Default `1` |
| `limit` | integer | Default `25`, max `100` |

```bash
curl "https://your-store-api.example.com/api/v1/affiliate/1/referrals" \
  --cookie cookies.txt
```

```json
{
  "status": "success",
  "data": {
    "referrals": [
      {
        "id": 1,
        "affiliate_id": 1,
        "customer_id": 99,
        "order_id": 1234,
        "order": {
          "id": 1234,
          "order_number": "ORD-001",
          "total": 5000
        },
        "created_at": "2026-01-10T15:20:00.000Z"
      },
      {
        "id": 2,
        "affiliate_id": 1,
        "customer_id": 100,
        "order_id": null,
        "order": null,
        "created_at": "2026-01-11T08:45:00.000Z"
      }
    ],
    "total": 8,
    "page": 1,
    "limit": 25
  }
}
```

When `order_id` is null, the referral hasn't yet converted to an order.

---

## Admin: commissions

### GET /affiliate/commissions/list - List commissions

Retrieve paginated list of affiliate commissions across all affiliates, with optional filtering by status or affiliate.

**Auth:** Admin session

| Query param | Type | Description |
| --- | --- | --- |
| `page` | integer | Default `1` |
| `limit` | integer | Default `25`, max `100` |
| `status` | string | Filter: `pending`, `available`, `paid` |
| `affiliate_id` | integer | Filter by affiliate |

```bash
curl "https://your-store-api.example.com/api/v1/affiliate/commissions/list?status=available" \
  --cookie cookies.txt
```

```json
{
  "status": "success",
  "data": {
    "commissions": [
      {
        "id": 501,
        "affiliate_id": 1,
        "order_id": 1234,
        "status": "available",
        "amount": "250.00",
        "rate_type": "percentage",
        "rate_value": "5.00",
        "basis_amount": "5000.00",
        "matured_at": "2026-01-08T10:00:00.000Z",
        "order": {
          "id": 1234,
          "order_number": "ORD-001",
          "status": "delivered",
          "total": 5000
        },
        "affiliate": {
          "id": 1,
          "code": "REF-ABC123",
          "customer": {
            "id": 42,
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe"
          }
        },
        "created_at": "2026-01-05T10:00:00.000Z",
        "updated_at": "2026-01-15T14:22:00.000Z"
      }
    ],
    "total": 15,
    "page": 1,
    "limit": 25
  }
}
```

| Status | Meaning |
| --- | --- |
| `pending` | Order hasn't reached maturity status yet; commission is held |
| `available` | Order passed maturity + hold window; affiliate can request payout |
| `paid` | Commission has been dispersed via payout |

---

## Admin: wallets

### GET /affiliate/wallets/list - List affiliate wallets

Retrieve paginated list of affiliate wallets sorted by available balance (highest first). Includes affiliate and customer details.

**Auth:** Admin session

| Query param | Type | Description |
| --- | --- | --- |
| `page` | integer | Default `1` |
| `limit` | integer | Default `25`, max `100` |

```bash
curl "https://your-store-api.example.com/api/v1/affiliate/wallets/list" \
  --cookie cookies.txt
```

```json
{
  "status": "success",
  "data": {
    "wallets": [
      {
        "id": 1,
        "affiliate_id": 1,
        "available_balance": "8900.00",
        "pending_balance": "3250.50",
        "lifetime_earned": "25000.00",
        "lifetime_withdrawn": "10000.00",
        "lifetime_spent": "0.00",
        "currency": "KES",
        "affiliate": {
          "id": 1,
          "code": "REF-ABC123",
          "status": "approved",
          "customer": {
            "id": 42,
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe"
          }
        },
        "created_at": "2025-12-20T08:15:00.000Z",
        "updated_at": "2026-01-15T14:22:00.000Z"
      }
    ],
    "total": 40,
    "page": 1,
    "limit": 25
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `available_balance` | number | Can be spent or paid out |
| `pending_balance` | number | In pending commissions; moves to `available` when cleared |
| `lifetime_earned` | number | Cumulative commissions earned (cash-basis) |
| `lifetime_withdrawn` | number | Total dispersed via payouts |
| `lifetime_spent` | number | Affiliate wallet used to pay for orders |
| `currency` | string | 3-letter currency code (e.g., `KES`) |

### GET /affiliate/:id/ledger - Get wallet transaction history

Retrieve the transaction history (ledger) for an affiliate's wallet in reverse chronological order. Shows all credits, debits, and manual adjustments.

**Auth:** Admin session

| Query param | Type | Description |
| --- | --- | --- |
| `page` | integer | Default `1` |
| `limit` | integer | Default `50`, max `200` |

```bash
curl "https://your-store-api.example.com/api/v1/affiliate/1/ledger?limit=50" \
  --cookie cookies.txt
```

```json
{
  "status": "success",
  "data": {
    "entries": [
      {
        "id": 8,
        "affiliate_id": 1,
        "type": "commission",
        "bucket": "pending",
        "amount": "500.00",
        "balance_after": "3750.00",
        "note": "Commission from order #ORD-001",
        "commission_id": 501,
        "payout_id": null,
        "created_by": null,
        "created_at": "2026-01-15T14:22:00.000Z"
      },
      {
        "id": 7,
        "affiliate_id": 1,
        "type": "withdrawal",
        "bucket": "available",
        "amount": "-250.00",
        "balance_after": "8650.00",
        "note": "Payout #PAY-001",
        "commission_id": null,
        "payout_id": 10,
        "created_by": null,
        "created_at": "2026-01-14T09:30:00.000Z"
      },
      {
        "id": 6,
        "affiliate_id": 1,
        "type": "adjustment",
        "bucket": "available",
        "amount": "50.00",
        "balance_after": "8900.00",
        "note": "Manual correction for erroneous commission",
        "commission_id": null,
        "payout_id": null,
        "created_by": 5,
        "created_at": "2026-01-10T16:45:00.000Z"
      }
    ],
    "total": 23,
    "page": 1,
    "limit": 50
  }
}
```

### POST /affiliate/:id/adjust - Manually adjust wallet

Credit or debit an affiliate's available balance. A note is required. Positive amounts credit; negative amounts debit.

**Auth:** Admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/affiliate/1/adjust" \
  -H "Content-Type: application/json" --cookie cookies.txt \
  -d '{
    "amount": 150.00,
    "note": "Correction for disputed commission on order #ORD-001"
  }'
```

Response:

```json
{
  "status": "success",
  "data": {
    "wallet": {
      "id": 1,
      "affiliate_id": 1,
      "available_balance": "9050.00",
      "pending_balance": "3250.50",
      "lifetime_earned": "25150.00",
      "lifetime_withdrawn": "10000.00",
      "lifetime_spent": "0.00",
      "currency": "KES",
      "created_at": "2025-12-20T08:15:00.000Z",
      "updated_at": "2026-01-15T16:45:00.000Z"
    }
  }
}
```

**Gotchas:**
- Amount cannot be zero; must be positive (credit) or negative (debit).
- Note is mandatory and audited.
- Adjustment creates a ledger entry linked to the admin user who made it.

---

## Admin: payouts

### GET /affiliate/payouts/list - List payouts

Retrieve paginated list of payout requests with optional status filtering. Includes affiliate and customer details.

**Auth:** Admin session

| Query param | Type | Description |
| --- | --- | --- |
| `page` | integer | Default `1` |
| `limit` | integer | Default `25`, max `100` |
| `status` | string | Filter: `all` (default), `requested`, `processing`, `completed`, `failed`, `cancelled` |

```bash
curl "https://your-store-api.example.com/api/v1/affiliate/payouts/list?status=processing" \
  --cookie cookies.txt
```

```json
{
  "status": "success",
  "data": {
    "payouts": [
      {
        "id": 10,
        "affiliate_id": 1,
        "amount": "5000.00",
        "currency": "KES",
        "status": "processing",
        "method": "paystack",
        "reference": "aff-payout-10-20260115",
        "paystack_transfer_code": "TRF-123456789",
        "paystack_recipient_code": "RCP-001234",
        "provider_reference": null,
        "destination_summary": "John Doe - 0011234567",
        "failure_reason": null,
        "requested_at": "2026-01-15T10:00:00.000Z",
        "processed_at": null,
        "processed_by": null,
        "admin_note": null,
        "affiliate": {
          "id": 1,
          "code": "REF-ABC123",
          "customer": {
            "id": 42,
            "email": "john@example.com",
            "first_name": "John",
            "last_name": "Doe"
          }
        },
        "created_at": "2026-01-15T10:00:00.000Z",
        "updated_at": "2026-01-15T10:05:00.000Z"
      }
    ],
    "total": 5,
    "page": 1,
    "limit": 25
  }
}
```

| Status | Meaning |
| --- | --- |
| `requested` | Affiliate requested payout; awaiting processing |
| `processing` | Transfer initiated (for Paystack payouts) or in-flight |
| `paid` | Funds delivered |
| `failed` | Transfer rejected by gateway or payment failed |
| `cancelled` | Admin cancelled; funds refunded to wallet |

### POST /affiliate/payouts/:id/mark-paid - Settle manual payout

Mark a manual payout as complete. Use this when you've transferred funds out-of-band (e.g. bank transfer). Optionally provide a settlement reference.

**Auth:** Admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/affiliate/payouts/10/mark-paid" \
  -H "Content-Type: application/json" --cookie cookies.txt \
  -d '{
    "note": "Settled via bank transfer, ref TRF-XYZ-123"
  }'
```

Response:

```json
{
  "status": "success",
  "data": {
    "payout": {
      "id": 10,
      "affiliate_id": 1,
      "amount": "5000.00",
      "currency": "KES",
      "status": "paid",
      "method": "manual",
      "processed_at": "2026-01-15T16:00:00.000Z",
      "processed_by": 5,
      "admin_note": "Settled via bank transfer, ref TRF-XYZ-123",
      "..."
    }
  }
}
```

### POST /affiliate/payouts/:id/retry - Retry failed Paystack transfer

Re-attempt a Paystack payout that was rejected or failed to start. Only works for Paystack method payouts. No request body required.

**Auth:** Admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/affiliate/payouts/10/retry" \
  --cookie cookies.txt
```

Response:

```json
{
  "status": "success",
  "data": {
    "payout": {
      "id": 10,
      "status": "processing",
      "paystack_transfer_code": "TRF-987654321",
      "..."
    }
  }
}
```

**Gotchas:**
- Retry updates the `paystack_transfer_code` to the new transfer reference.
- If Paystack rejects the retry (bad account, insufficient funds), status moves to `failed`.

### POST /affiliate/payouts/:id/cancel - Cancel payout and refund wallet

Cancel a stuck, erroneous, or duplicate payout. The funds are credited back to the affiliate's available balance and a ledger entry is created.

**Auth:** Admin session

```bash
curl -X POST "https://your-store-api.example.com/api/v1/affiliate/payouts/10/cancel" \
  -H "Content-Type: application/json" --cookie cookies.txt \
  -d '{
    "reason": "Incorrect account number; affiliate will re-request"
  }'
```

Response:

```json
{
  "status": "success",
  "data": {
    "payout": {
      "id": 10,
      "status": "cancelled",
      "amount": "5000.00",
      "currency": "KES",
      "admin_note": "Incorrect account number; affiliate will re-request",
      "..."
    }
  }
}
```

After cancellation, the affiliate's wallet `available_balance` increases by the payout amount and they can request a new payout with corrected details.
