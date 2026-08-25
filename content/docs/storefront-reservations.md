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

`opening_hours` is keyed by **ISO weekday as a string** — `"1"` is Monday through `"7"` is Sunday.
A missing or empty key means closed that day. A `close` earlier than its `open` means service runs
past midnight (`18:00` to `01:00` closes the next morning).

`areas` is only populated when `area_selection_enabled` is true, and `branches` only when
`branch_selection_enabled` is true **and** the Branches addon is on. Both are empty otherwise —
don't render the picker.

Internal capacity numbers and the staff notification list are deliberately not exposed here.

---

### GET /storefront/reservations/availability - Free slots for a date

| Query param | Type | Description |
| --- | --- | --- |
| `date` | string | Required. `YYYY-MM-DD` |
| `party_size` | number | Slots too small for this party come back `available: false` |
| `branch_id` | number | Only when `branch_selection_enabled` |
| `area_id` | number | Only when `area_selection_enabled`; uses that area's own capacity |

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

Post `reserved_at` back **verbatim**. Don't reconstruct the instant from `time` — that is a
display string in the shop's timezone, not the browser's.

---

### POST /storefront/reservations - Make a booking

| Field | Type | Notes |
| --- | --- | --- |
| `guest_name` | string | Required |
| `guest_email` | string | Required *unless* `guest_phone` is given |
| `guest_phone` | string | Required *unless* `guest_email` is given |
| `party_size` | number | Required. Must sit within `min_party_size`–`max_party_size` |
| `reserved_at` | string | Required. The exact value from `/availability` |
| `branch_id` | number | Optional |
| `area_id` | number | Optional |
| `occasion` | string | Ignored when `occasion_enabled` is false |
| `special_requests` | string | Free text, capped at 2000 characters |

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

`status` is `confirmed` when the restaurant has `auto_confirm` on, and `pending` otherwise —
the guest-facing copy should say "we'll confirm shortly" in the pending case rather than promising
the table.

**Store both `reference` and `confirmation_code`.** The lookup and cancel endpoints need the pair.

The submitted slot is re-validated server-side against real availability, so a hand-crafted POST
cannot book a closed Monday or a full sitting. Errors worth handling:

| Status | Meaning |
| --- | --- |
| `400` | Missing field, party outside the allowed range, or a time that is not a bookable slot |
| `409` | The slot filled between the guest loading it and submitting. Re-fetch availability and ask them to pick again |

The `409` is a real race, not a theoretical one: two guests can be looking at the same last table.
Capacity is re-checked inside the write transaction, so exactly one of them wins.

---

### GET /storefront/reservations/:reference - Look up a booking

Requires the confirmation code as `?code=`.

```bash
curl "https://your-store-api.example.com/api/v1/storefront/reservations/RSV-8F3K2Q?code=k3m9xq2rtv7bn4pd8waz"
```

An unknown reference and a wrong code both return the same `404`, so the endpoint can't be used to
enumerate references.

---

### POST /storefront/reservations/:reference/cancel - Guest cancellation

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/reservations/RSV-8F3K2Q/cancel" \
  -H "Content-Type: application/json" \
  -d '{ "code": "k3m9xq2rtv7bn4pd8waz", "reason": "Plans changed" }'
```

Returns `403` when the restaurant has `allow_guest_cancel` off, and `400` when the booking is
already closed or the sitting is inside `cancellation_window_hours`. Check `allow_guest_cancel` from
`/config` before rendering a cancel button, and surface the returned message rather than a generic
error — it tells the guest to call instead.

---

## Building the booking form

1. `GET /config` once. Bail out quietly if `enabled` is false.
2. Offer dates from today to `max_advance_days`, skipping `blackout_dates` and weekdays with no
   `opening_hours` entry — that avoids a round trip to learn the venue is shut.
3. On date or party-size change, `GET /availability` and render the slots where `available` is true.
4. `POST` with the slot's `reserved_at` unchanged. Handle `409` by refreshing step 3.
5. Show the `reference`, and keep the `confirmation_code` in the link you give the guest.
