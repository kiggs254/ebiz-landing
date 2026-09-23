Public table-booking API for hospitality storefronts. No authentication. Part of the
**Reservations addon** — the endpoints below return `503` when it is switched off, with the one
deliberate exception noted under `/config`.

All responses use the standard `{ status, data }` envelope.

## The shape of a booking

A booking is held against **covers (seats), not tables**. Two parties of two and one party of four
both consume four of a slot's seats. A sitting occupies every slot its duration overlaps — a
90-minute booking at 19:00 on a 30-minute grid holds seats at 19:00, 19:30 and 20:00.

Times go over the wire as absolute instants (`reserved_at`). Wall-clock times are resolved in the
**shop's timezone**, which `/config` and `/availability` both return, so a storefront never has to
guess the restaurant's local time from the browser's.

---

### GET /storefront/reservations/config - Booking rules

Call this on page load to decide whether to show a "Book a table" entry point at all.

**Auth:** Public

**Addon:** Reservations (returns `enabled: false` when disabled, not 503)

This endpoint is intentionally NOT behind the addon gate. Storefronts call it on load to decide whether to render a "Book a table" link and set the form UI accordingly.

**This is the one endpoint that does not 503 when the addon is off.** It returns
`{ "enabled": false }` instead, so "the feature is not installed" is distinguishable from "the
backend is down" — a 503 is not.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/reservations/config"
```

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "timezone": "Africa/Nairobi",
    "opening_hours": { "5": [{ "open": "12:00", "close": "23:00" }] },
    "blackout_dates": [{ "date": "2026-12-25", "reason": "Christmas" }],
    "slot_interval_minutes": 30,
    "default_duration_minutes": 90,
    "min_party_size": 1,
    "max_party_size": 12,
    "max_advance_days": 90,
    "min_lead_time_minutes": 120,
    "cancellation_window_hours": 24,
    "allow_guest_cancel": true,
    "auto_confirm": false,
    "occasion_enabled": true,
    "branch_selection_enabled": false,
    "area_selection_enabled": true,
    "deposit_required": false,
    "deposit_amount": 0,
    "deposit_threshold_party": 0,
    "booking_terms": "Tables are held for 15 minutes.",
    "areas": [{ "id": 2, "name": "Terrace", "description": "Outdoor seating", "branch_id": null }],
    "branches": []
  }
}
```

**Response fields:**
- `enabled`: Feature active? If false, hide booking UI entirely.
- `timezone`: Server timezone for all slot calculations.
- `opening_hours`: ISO weekday as a string (`"1"` = Monday through `"7"` = Sunday). A missing or empty key means closed that day. A `close` earlier than its `open` means service runs past midnight.
- `blackout_dates`: ISO dates when no bookings accepted.
- `deposit_required`, `deposit_amount`: Upfront payment thresholds.
- `areas`: Populated only when `area_selection_enabled` is true.
- `branches`: Populated only when `branch_selection_enabled` is true and the Branches addon is on. Both empty otherwise — don't render the picker.

**Gotchas:**
- Internal capacity numbers and the staff notification list are deliberately not exposed here.

---

### GET /storefront/reservations/availability - Free slots for a date

Queries available booking slots for a given date and party size. All slots shown are within business hours, accounting for opening_hours, blackout_dates, and current reservations. Guests pick a slot from this list for their booking.

**Auth:** Public

**Addon:** Reservations (503 when disabled)

| Query param | Type | Required | Description |
| --- | --- | --- | --- |
| `date` | string | Yes | ISO date (YYYY-MM-DD) |
| `party_size` | integer | No | Number of guests; slots too small come back `available: false` |
| `branch_id` | integer | No | Branch ID if multiple locations exist |
| `area_id` | integer | No | Area/section ID if seating sections are enabled |

```bash
curl "https://your-store-api.example.com/api/v1/storefront/reservations/availability?date=2026-09-05&party_size=4"
```

```json
{
  "status": "success",
  "data": {
    "date": "2026-09-05",
    "timezone": "Africa/Nairobi",
    "open": true,
    "slots": [
      { "time": "19:00", "reserved_at": "2026-09-05T16:00:00.000Z", "available": true },
      { "time": "19:30", "reserved_at": "2026-09-05T16:30:00.000Z", "available": false }
    ]
  }
}
```

When the venue is shut, `open` is `false`, `slots` is empty, and `closed_reason` says why:
`closed_day` (no service hours that weekday), `blackout` (a closed date), or `out_of_range` (in the
past, or beyond `max_advance_days`).

**Gotchas:**
- Post `reserved_at` back **verbatim** to the booking endpoint. Don't reconstruct the instant from `time` — that is a display string in the shop's timezone, not the browser's.
- Closed days return `open: false` with `closed_reason` explaining why.
- The server re-validates when the booking is posted to prevent race conditions.

---

### POST /storefront/reservations - Make a booking

Guest books a table. Validates input, re-checks slot availability server-side, and creates the reservation. Fires confirmation emails.

**Auth:** Public

**Addon:** Reservations (503 when disabled)

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `guest_name` | string | Yes | Name for the reservation |
| `guest_email` | string | No | Email (at least one of email/phone required) |
| `guest_phone` | string | No | Phone (at least one of email/phone required) |
| `party_size` | integer | Yes | Number of guests (must be within config range) |
| `reserved_at` | string | Yes | The exact value from `/availability`; ISO 8601 instant |
| `branch_id` | integer | No | Branch ID if multiple locations |
| `area_id` | integer | No | Area/section ID if area selection enabled |
| `occasion` | string | No | Event occasion (e.g. "Birthday", max 100 chars; ignored when `occasion_enabled` is false) |
| `special_requests` | string | No | Guest requests for the kitchen/staff (max 2000 chars) |

At least one contact route is mandatory — a booking nobody can be reached about is a table the
restaurant loses when plans change.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/reservations" \
  -H "Content-Type: application/json" \
  -d '{
    "guest_name": "Amina Yeboah",
    "guest_phone": "+254 700 000 000",
    "guest_email": "amina@example.com",
    "party_size": 4,
    "reserved_at": "2026-09-05T16:00:00.000Z",
    "occasion": "Birthday",
    "special_requests": "One high chair please"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "reservation": {
      "reference": "RSV-8F3K2Q",
      "confirmation_code": "k3m9xq2rtv7bn4pd8waz",
      "status": "pending",
      "reserved_at": "2026-09-05T16:00:00.000Z",
      "party_size": 4,
      "guest_name": "Amina Yeboah",
      "deposit_required": false,
      "deposit_amount": 0
    }
  }
}
```

**Status codes:**
- **201** — Booking created. Status is `confirmed` when the restaurant has `auto_confirm` on, and `pending` otherwise.
- **400** — Missing field, party outside the allowed range, or a time that is not a bookable slot.
- **409** — The slot filled between the guest loading it and submitting. Re-fetch availability and ask them to pick again.
- **503** — Addon disabled.

**Gotchas:**
- If the guest is signed in (`req.session.customerId`), the booking is attached to that account. Otherwise, if the email matches an existing customer account, it's attached to them. This allows pre-account bookings to appear under "my bookings" after signup.
- The submitted slot is re-validated server-side, so a hand-crafted POST cannot book a closed Monday or a full sitting.
- `status` is `confirmed` when the restaurant has `auto_confirm` on, and `pending` otherwise — the guest-facing copy should say "we'll confirm shortly" in the pending case rather than promising the table.
- **Store both `reference` and `confirmation_code`.** The lookup and cancel endpoints need the pair.
- The `409` is a real race, not a theoretical one: two guests can be looking at the same last table. Capacity is re-checked inside the write transaction, so exactly one of them wins.

---

### GET /storefront/reservations/mine - Get signed-in customer's bookings

Returns all reservations under the authenticated customer's account, including pre-account bookings matched by email. Limited to 50 most recent.

**Auth:** Signed-in customer (requires a valid session cookie from `/storefront/auth/login` or `/storefront/auth/register`)

**Addon:** Reservations (503 when disabled)

```bash
curl https://your-store-api.example.com/api/v1/storefront/reservations/mine \
  -H "Cookie: connect.sid=<session_cookie>"
```

Example response:

```json
{
  "status": "success",
  "data": {
    "reservations": [
      {
        "reference": "RSV-8F3K2Q",
        "confirmation_code": "k3m9xq2rtv7bn4pd8waz",
        "status": "confirmed",
        "reserved_at": "2026-09-05T16:00:00.000Z",
        "duration_minutes": 90,
        "party_size": 4,
        "guest_name": "Amina Yeboah",
        "occasion": "Birthday",
        "special_requests": "One high chair please",
        "deposit_required": false,
        "deposit_amount": 0,
        "deposit_paid": false,
        "branch": {
          "id": 1,
          "name": "Downtown",
          "address": "123 Main St",
          "city": "Nairobi",
          "phone": "+254 7XX XXX XXX"
        },
        "area": {
          "id": 2,
          "name": "Terrace"
        }
      }
    ]
  }
}
```

**Gotchas:**
- The confirmation code is exposed here (unlike public lookup) because the response is already scoped to the authenticated owner.
- Bookings made before account creation (matched by email) appear in this list.

---

### GET /storefront/reservations/:reference - Look up a booking

Public lookup by reference and confirmation code. Returns booking details so guests can view and manage it.

**Auth:** Public

**Addon:** Reservations (503 when disabled)

Requires the confirmation code as `?code=`.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/reservations/RSV-8F3K2Q?code=k3m9xq2rtv7bn4pd8waz"
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `reference` | string (path) | Yes | Reservation reference (e.g. RSV-8F3K2Q) |
| `code` | string (query) | Yes | Confirmation code for security |

Example response:

```json
{
  "status": "success",
  "data": {
    "reservation": {
      "reference": "RSV-8F3K2Q",
      "status": "confirmed",
      "reserved_at": "2026-09-05T16:00:00.000Z",
      "duration_minutes": 90,
      "party_size": 4,
      "guest_name": "Amina Yeboah",
      "occasion": "Birthday",
      "special_requests": "One high chair please",
      "deposit_required": false,
      "deposit_amount": 0,
      "deposit_paid": false,
      "branch": {
        "id": 1,
        "name": "Downtown",
        "address": "123 Main St",
        "city": "Nairobi",
        "phone": "+254 7XX XXX XXX"
      },
      "area": {
        "id": 2,
        "name": "Terrace"
      }
    }
  }
}
```

**Status codes:**
- **200** — Found.
- **400** — Missing confirmation code.
- **404** — Reference not found OR code is wrong (same response for both to prevent reference enumeration).
- **503** — Addon disabled.

**Gotchas:**
- An unknown reference and a wrong code both return the same `404`, so the endpoint can't be used to
enumerate references.

---

### POST /storefront/reservations/:reference/cancel - Guest cancellation

Guest cancels their booking, subject to the cancellation window policy (e.g. must be cancelled >X hours ahead). Requires confirmation code.

**Auth:** Public

**Addon:** Reservations (503 when disabled)

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/reservations/RSV-8F3K2Q/cancel" \
  -H "Content-Type: application/json" \
  -d '{ "code": "k3m9xq2rtv7bn4pd8waz", "reason": "Plans changed" }'
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `reference` | string (path) | Yes | Reservation reference |
| `code` | string | Yes | Confirmation code (body or query param) |
| `reason` | string | No | Cancellation reason (max 500 chars) |

Example response (200):

```json
{
  "status": "success",
  "message": "Your booking has been cancelled."
}
```

**Status codes:**
- **200** — Cancelled successfully.
- **400** — Code mismatch, reservation already cancelled/completed/no-show, or outside cancellation window.
- **403** — Guest cancellations disabled by admin (allow_guest_cancel: false).
- **404** — Reference not found.
- **503** — Addon disabled.

**Gotchas:**
- The cancellation window is enforced: e.g. if `cancellation_window_hours: 24`, the booking can only be cancelled >24 hours before the reserved time.
- Bookings already in `cancelled`, `completed`, or `no_show` status cannot be cancelled again.
- Returns `403` when the restaurant has `allow_guest_cancel` off, and `400` when the booking is
already closed or the sitting is inside `cancellation_window_hours`. Check `allow_guest_cancel` from
`/config` before rendering a cancel button, and surface the returned message rather than a generic
error — it tells the guest to call instead.
- If guest cancellations are disabled, they must call the restaurant to modify their booking.

---

## Building the booking form

1. `GET /config` once. Bail out quietly if `enabled` is false.
2. Offer dates from today to `max_advance_days`, skipping `blackout_dates` and weekdays with no
   `opening_hours` entry — that avoids a round trip to learn the venue is shut.
3. On date or party-size change, `GET /availability` and render the slots where `available` is true.
4. `POST` with the slot's `reserved_at` unchanged. Handle `409` by refreshing step 3.
5. Show the `reference`, and keep the `confirmation_code` in the link you give the guest.

---

## Authentication schemes

- **Public:** No authentication. Anyone can check config, availability, and look up/cancel a booking with a reference and confirmation code.
- **Signed-in customer:** Requires a valid session cookie from `/storefront/auth/login` or `/storefront/auth/register`.

---

## Common errors

| Error | Cause | Remedy |
|-------|-------|--------|
| 400 bad request | Invalid date, party size, contact details, or time format | Check query/body params against config |
| 409 conflict | Slot taken just now by another guest | Refresh availability and pick again |
| 503 service unavailable | Addon disabled | Check instance settings |

---

## Deposit payments

If `deposit_required: true` and party size >= `deposit_threshold_party`, a deposit is collected at checkout or via a separate payment flow. The `deposit_paid` field indicates whether the deposit has been received.
