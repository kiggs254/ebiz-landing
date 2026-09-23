The Reservations addon enables hospitality businesses to manage table bookings, seating areas, and guest management. Staff can create, update, and track reservations from the admin dashboard, and guests can book tables through the storefront.

**Addon:** Reservations — all endpoints return 503 when switched off in Settings → Addons.

**Auth:** All endpoints require admin session authentication (staff login via dashboard) or API key with the `reservations` permission.

---

## Reading and listing reservations

### GET /reservations - List Reservations

List all reservations with optional filtering, sorting, and date range.

**Auth:** Admin session or API key (reservations:view permission).

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number for pagination |
| `limit` | number | 25 | Results per page (max 200) |
| `status` | string | | Filter by status: `pending`, `confirmed`, `seated`, `completed`, `cancelled`, `no_show`, or comma-separated for multiple (e.g., `pending,confirmed` for "Upcoming") |
| `search` | string | | Search guest name, email, phone, or reference number (case-insensitive substring) |
| `branch_id` | number | | Filter by branch |
| `area_id` | number | | Filter by area/section |
| `source` | string | | Filter by source: `admin`, `phone`, `walk_in`, `storefront` |
| `date` | string | | Filter by exact date (YYYY-MM-DD, shop timezone) |
| `from` | string | | Start of date range (YYYY-MM-DD, shop timezone) |
| `to` | string | | End of date range (YYYY-MM-DD, shop timezone) |
| `sort` | string | asc | `asc` for earliest-first, `desc` for most-recent-first |

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/reservations?status=pending,confirmed&from=2026-09-15&limit=50" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "reservations": [
      {
        "id": 1,
        "reference": "RES-000001",
        "confirmation_code": "ABC123DEF",
        "guest_name": "John Doe",
        "guest_email": "john@example.com",
        "guest_phone": "+254700000004",
        "party_size": 4,
        "reserved_at": "2026-09-25T18:00:00.000Z",
        "duration_minutes": 90,
        "status": "confirmed",
        "source": "storefront",
        "occasion": "Anniversary",
        "special_requests": "Window seat preferred",
        "internal_notes": "VIP customer",
        "branch_id": 1,
        "area_id": 2,
        "table_label": "Table 7",
        "customer_id": 5,
        "deposit_required": false,
        "deposit_amount": 0,
        "deposit_paid": false,
        "confirmed_at": "2026-09-15T14:30:00.000Z",
        "created_by": 3,
        "created_at": "2026-09-15T14:30:00.000Z",
        "updated_at": "2026-09-15T14:30:00.000Z",
        "branch": { "id": 1, "name": "Main", "city": "Nairobi" },
        "area": { "id": 2, "name": "Terrace", "capacity": 20 },
        "customer": { "id": 5, "first_name": "John", "last_name": "Doe", "email": "john@example.com", "phone": "+254700000004" },
        "creator": { "id": 3, "first_name": "Jane", "last_name": "Smith", "email": "jane@staff.com" }
      }
    ],
    "total": 42,
    "page": 1,
    "limit": 50,
    "timezone": "Africa/Nairobi"
  }
}
```

**Gotchas:**
- Dates are in the shop's timezone (returned as `timezone` in response). Timezone conversions happen server-side.
- Search is case-insensitive substring matching on four fields only; structured filters are more efficient.

---

### GET /reservations/stats - Reservation Statistics

Get real-time counters for dashboard tabs and the day header.

**Auth:** Admin session or API key (reservations:view permission).

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/reservations/stats" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "pending_count": 3,
    "upcoming_count": 12,
    "today_bookings": 8,
    "today_covers": 24,
    "today_by_status": {
      "pending": 1,
      "confirmed": 5,
      "seated": 2
    },
    "date": "2026-09-15",
    "timezone": "Africa/Nairobi"
  }
}
```

---

### GET /reservations/:id - Get Single Reservation

Fetch a reservation with all details and status history.

**Auth:** Admin session or API key (reservations:view permission).

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/reservations/1" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "reservation": {
      "id": 1,
      "reference": "RES-000001",
      "guest_name": "John Doe",
      "guest_email": "john@example.com",
      "guest_phone": "+254700000004",
      "party_size": 4,
      "reserved_at": "2026-09-25T18:00:00.000Z",
      "duration_minutes": 90,
      "status": "confirmed",
      "source": "storefront",
      "occasion": "Anniversary",
      "special_requests": "Window seat preferred",
      "internal_notes": "VIP customer",
      "branch_id": 1,
      "area_id": 2,
      "table_label": "Table 7",
      "customer_id": 5,
      "deposit_required": false,
      "deposit_amount": 0,
      "deposit_paid": false,
      "deposit_reference": null,
      "confirmed_at": "2026-09-15T14:30:00.000Z",
      "seated_at": null,
      "completed_at": null,
      "cancelled_at": null,
      "cancellation_reason": null,
      "reminder_sent_at": null,
      "created_by": 3,
      "created_at": "2026-09-15T14:30:00.000Z",
      "updated_at": "2026-09-15T14:30:00.000Z",
      "branch": { "id": 1, "name": "Main", "city": "Nairobi" },
      "area": { "id": 2, "name": "Terrace", "capacity": 20 },
      "customer": { "id": 5, "first_name": "John", "last_name": "Doe", "email": "john@example.com", "phone": "+254700000004" },
      "creator": { "id": 3, "first_name": "Jane", "last_name": "Smith", "email": "jane@staff.com" },
      "history": [
        {
          "id": 1,
          "from_status": null,
          "to_status": "pending",
          "note": "Created from storefront",
          "actor": "guest",
          "changed_by": null,
          "created_at": "2026-09-15T14:15:00.000Z"
        },
        {
          "id": 2,
          "from_status": "pending",
          "to_status": "confirmed",
          "note": "Auto-confirmed by system",
          "actor": "system",
          "changed_by": null,
          "created_at": "2026-09-15T14:30:00.000Z"
        }
      ]
    }
  }
}
```

---

## Creating and managing reservations

### POST /reservations - Create Reservation (Admin)

Create a reservation for a phone call, walk-in, or admin entry. Admin bookings bypass lead-time and advance-window rules (but capacity is still enforced).

**Auth:** Admin session or API key (reservations:manage permission).

**Request Body:**

```json
{
  "guest_name": "Jane Smith",
  "guest_email": "jane@example.com",
  "guest_phone": "+254700000005",
  "reserved_at": "2026-09-25T19:00:00Z",
  "party_size": 6,
  "duration_minutes": 120,
  "status": "confirmed",
  "source": "phone",
  "area_id": 1,
  "branch_id": 1,
  "table_label": "Table 5",
  "customer_id": 10,
  "occasion": "Birthday",
  "special_requests": "No shellfish",
  "internal_notes": "High-value customer",
  "deposit_required": false,
  "deposit_amount": 0,
  "enforce_capacity": true,
  "send_confirmation": true
}
```

**Field Reference:**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `guest_name` | string | Yes | Guest's name |
| `guest_email` | string | No | Email for confirmation (if `send_confirmation: true`) |
| `guest_phone` | string | No | Phone number |
| `reserved_at` | string (ISO 8601) | Yes | Absolute UTC instant (e.g., "2026-09-25T19:00:00Z") |
| `party_size` | number | No | Defaults to 1 if omitted |
| `duration_minutes` | number | No | Defaults to settings.default_duration_minutes if omitted |
| `status` | string | No | One of: `pending`, `confirmed`, `seated`, `completed`, `cancelled`, `no_show`. Default: `confirmed` (admin bookings skip pending) |
| `source` | string | No | One of: `admin`, `phone`, `walk_in`, `storefront`. Default: `admin` |
| `area_id` | number | No | Seating area ID |
| `branch_id` | number | No | Branch ID |
| `table_label` | string | No | Physical table label (e.g., "Table 7") |
| `customer_id` | number | No | Link to a customer record |
| `occasion` | string | No | Event type (e.g., "Birthday", "Anniversary") |
| `special_requests` | string | No | Dietary or preference notes |
| `internal_notes` | string | No | Private notes for staff |
| `deposit_required` | boolean | No | Whether a deposit was collected |
| `deposit_amount` | number | No | Deposit amount (when deposit_required=true) |
| `enforce_capacity` | boolean | No | When true (default), rejects if the slot is full. When false, allows overbooking. |
| `send_confirmation` | boolean | No | When true (default), sends confirmation email to guest |

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/reservations" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "guest_name": "Jane Smith",
    "reserved_at": "2026-09-25T19:00:00Z",
    "party_size": 4,
    "status": "confirmed",
    "source": "phone"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "reservation": {
      "id": 42,
      "reference": "RES-000042",
      "confirmation_code": "XYZ789ABC",
      "guest_name": "Jane Smith",
      "party_size": 4,
      "reserved_at": "2026-09-25T19:00:00.000Z",
      "status": "confirmed",
      "source": "phone"
    }
  }
}
```

**Validation/Errors:**
- 400: Missing `guest_name` or `reserved_at`
- 400: Invalid ISO 8601 date
- 400: Slot is at capacity (when `enforce_capacity: true`)

---

### PUT /reservations/:id - Edit Reservation Details

Update guest information, times, party size, and other details. Cannot be edited if status is terminal (cancelled, completed, no_show).

**Auth:** Admin session or API key (reservations:manage permission).

**Request Body (example):**

```json
{
  "guest_name": "Jane Smith (Updated)",
  "guest_phone": "+254700000006",
  "party_size": 5,
  "reserved_at": "2026-09-25T18:30:00Z",
  "special_requests": "No shellfish, prefer quiet corner",
  "internal_notes": "Birthday celebration",
  "customer_id": 10,
  "area_id": 2,
  "table_label": "Table 8",
  "deposit_amount": 500
}
```

**Field Reference:**

All fields from POST are editable except `source` and `status` (use PATCH /status instead).

| Field | Validation |
|-------|-----------|
| `reserved_at` | Cannot move to a slot that is at capacity (unless `enforce_capacity: false` in settings). Rechecks capacity. |
| `party_size` | Rechecks capacity if changed. |
| `area_id` | Rechecks capacity if changed. |
| `branch_id` | Rechecks capacity if changed. |
| `duration_minutes` | Uses settings default if omitted. |

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/reservations/1" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "party_size": 5,
    "special_requests": "Window seat preferred"
  }'
```

**Example Response (200):** Updated reservation object (same as GET /:id).

**Gotchas:**
- Terminal statuses (cancelled, completed, no_show) cannot be edited. Delete and recreate instead.
- Editing `reserved_at`, `party_size`, `area_id`, or `branch_id` rechecks capacity on the new configuration.

---

### PATCH /reservations/:id/status - Change Reservation Status

Transition a reservation to a new status (e.g., pending → confirmed, confirmed → seated, seated → completed).

**Auth:** Admin session or API key (reservations:manage permission).

**Request Body:**

```json
{
  "status": "seated",
  "note": "Table 7 seated at 19:10"
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | Yes | One of: `pending`, `confirmed`, `seated`, `completed`, `cancelled`, `no_show` |
| `note` | string | No | Optional reason or note for the status change |

**Valid Transitions:**
- `pending` → `confirmed`, `cancelled`
- `confirmed` → `seated`, `cancelled`, `pending`
- `seated` → `completed`, `cancelled`
- `completed` → (terminal, no transitions)
- `cancelled` → (terminal, no transitions)
- `no_show` → (terminal, no transitions)

**Example Request:**

```bash
curl -X PATCH "https://your-store.com/api/v1/reservations/1/status" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "seated",
    "note": "Guest arrived, seated at main table"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "reservation": {
      "id": 1,
      "status": "seated",
      "seated_at": "2026-09-25T19:10:00.000Z",
      "history": [
        { "from_status": "pending", "to_status": "confirmed", "note": "...", "created_at": "..." },
        { "from_status": "confirmed", "to_status": "seated", "note": "Guest arrived, seated at main table", "created_at": "2026-09-25T19:10:00.000Z" }
      ]
    }
  }
}
```

**Side Effects:**
- Changing to `confirmed` from `pending` sends a confirmation email to the guest (if `guest_email_enabled` in settings).
- Changing to `cancelled` sends a cancellation email to the guest.
- Status history is recorded with the admin's ID and timestamp.

---

### DELETE /reservations/:id - Delete Reservation

Permanently delete a reservation and broadcast the deletion to all connected clients.

**Auth:** Admin session or API key (reservations:manage permission).

**Example Request:**

```bash
curl -X DELETE "https://your-store.com/api/v1/reservations/1" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Reservation deleted."
}
```

**Response on 404:**

```json
{
  "status": "error",
  "message": "Reservation not found."
}
```

---

## Settings and configuration

### GET /reservations/settings - Get Reservation Settings

Fetch the current reservation configuration (opening hours, limits, notifications, etc.).

**Auth:** Admin session or API key (reservations:view permission).

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/reservations/settings" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "settings": {
      "id": 1,
      "opening_hours": {
        "1": [{ "open": "12:00", "close": "23:00" }],
        "5": [{ "open": "12:00", "close": "23:30" }],
        "6": [{ "open": "12:00", "close": "23:30" }],
        "7": [{ "open": "12:00", "close": "22:00" }]
      },
      "blackout_dates": [
        { "date": "2026-12-25", "reason": "Christmas" },
        { "date": "2026-12-26", "reason": "Boxing Day" }
      ],
      "slot_interval_minutes": 30,
      "default_duration_minutes": 90,
      "min_party_size": 1,
      "max_party_size": 12,
      "max_covers_per_slot": 20,
      "max_advance_days": 90,
      "min_lead_time_minutes": 120,
      "cancellation_window_hours": 24,
      "auto_confirm": false,
      "allow_guest_cancel": true,
      "branch_selection_enabled": false,
      "area_selection_enabled": true,
      "occasion_enabled": true,
      "deposit_required": false,
      "deposit_amount": 0,
      "deposit_threshold_party": 0,
      "notify_emails": ["manager@store.com"],
      "notify_whatsapp": ["+254700000000"],
      "guest_email_enabled": true,
      "reminder_hours_before": 24,
      "booking_terms": "Tables are held for 15 minutes after the reservation time.",
      "confirmation_message": "Your reservation is confirmed!"
    }
  }
}
```

**Field Reference:**

| Field | Type | Description |
|-------|------|-------------|
| `opening_hours` | object | Keyed by ISO weekday (`"1"` = Monday, `"7"` = Sunday). Each value is an array of `{ "open": "HH:MM", "close": "HH:MM" }`. Missing weekday = closed. Close ≤ open means service runs past midnight |
| `blackout_dates` | array | `[{ "date": "YYYY-MM-DD", "reason": "..." }]` for days when bookings are not accepted |
| `slot_interval_minutes` | number | Duration of each slot on the grid (e.g., 30 = 19:00, 19:30, 20:00, ...) |
| `default_duration_minutes` | number | How long a booking occupies (e.g., 90 minutes) |
| `min_party_size` | number | Smallest allowed party (e.g., 1) |
| `max_party_size` | number | Largest allowed party (e.g., 12) |
| `max_covers_per_slot` | number | Max total guests (covers) per slot across all bookings |
| `max_advance_days` | number | How many days ahead can a guest book (e.g., 90) |
| `min_lead_time_minutes` | number | Minimum advance booking time (e.g., 120 min = 2 hours) |
| `cancellation_window_hours` | number | How long before the reservation guests can cancel (e.g., 24 hours) |
| `auto_confirm` | boolean | When `true`, storefront bookings skip pending and go straight to confirmed |
| `allow_guest_cancel` | boolean | When `false`, guests cannot cancel their own bookings |
| `branch_selection_enabled` | boolean | Allow guests to pick a branch at booking |
| `area_selection_enabled` | boolean | Allow guests to pick a seating area at booking |
| `occasion_enabled` | boolean | Show occasion field (e.g., Birthday) at booking |
| `deposit_required` | boolean | When `true`, some bookings require a deposit (see `deposit_threshold_party`) |
| `deposit_amount` | number | Deposit amount in shop currency |
| `deposit_threshold_party` | number | Parties this size or larger need a deposit (0 = all require it) |
| `notify_emails` | array | Email addresses to notify on new/status-change bookings |
| `notify_whatsapp` | array | WhatsApp numbers to notify on new/status-change bookings |
| `guest_email_enabled` | boolean | Send confirmation/cancellation emails to guests |
| `reminder_hours_before` | number | Send reminder email this many hours before reservation |
| `booking_terms` | string | Terms/conditions shown to guests at booking |
| `confirmation_message` | string | Confirmation message shown to guests after booking |

---

### PUT /reservations/settings - Update Reservation Settings

Update any combination of settings. Fields you omit are not changed.

**Auth:** Admin session or API key (reservations:manage permission).

**Request Body (example):**

```json
{
  "slot_interval_minutes": 45,
  "max_advance_days": 60,
  "auto_confirm": true,
  "notify_emails": ["manager@store.com", "host@store.com"]
}
```

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/reservations/settings" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "max_advance_days": 60,
    "auto_confirm": true
  }'
```

**Validation Rules:**
- `slot_interval_minutes` must be ≥ 5
- `min_party_size` must not exceed `max_party_size`
- `opening_hours` must be an object (keyed by weekday)
- `blackout_dates` must be an array

**Example Response (200):** Same shape as GET /settings.

---

## Seating areas

### GET /reservations/areas - List Seating Areas

List all seating areas/sections (e.g., Terrace, Bar, Indoor). Each area has its own capacity.

**Auth:** Admin session or API key (reservations:view permission).

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/reservations/areas" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "areas": [
      {
        "id": 1,
        "name": "Indoor",
        "description": "Main dining room",
        "capacity": 30,
        "min_party_size": null,
        "max_party_size": null,
        "is_active": true,
        "sort_order": 1,
        "branch_id": null,
        "branch": null,
        "created_at": "2026-01-15T10:00:00.000Z",
        "updated_at": "2026-01-15T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Terrace",
        "description": "Outdoor seating",
        "capacity": 20,
        "min_party_size": 2,
        "max_party_size": 8,
        "is_active": true,
        "sort_order": 2,
        "branch_id": 1,
        "branch": { "id": 1, "name": "Main" },
        "created_at": "2026-01-15T10:00:00.000Z",
        "updated_at": "2026-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

### POST /reservations/areas - Create Seating Area

Create a new seating area.

**Auth:** Admin session or API key (reservations:manage permission).

**Request Body:**

```json
{
  "name": "Lounge",
  "description": "Cocktail bar and lounge",
  "capacity": 15,
  "min_party_size": 1,
  "max_party_size": 6,
  "is_active": true,
  "sort_order": 3,
  "branch_id": 1
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Area name (e.g., "Terrace", "Bar") |
| `description` | string | No | Details about the area |
| `capacity` | number | No | Total seats/covers in the area (e.g., 20) |
| `min_party_size` | number | No | Minimum party for this area; null = no restriction |
| `max_party_size` | number | No | Maximum party for this area; null = no restriction |
| `is_active` | boolean | No | Whether the area is bookable (default: true) |
| `sort_order` | number | No | Display order in the UI (default: 0) |
| `branch_id` | number | No | Associate with a specific branch (null = all branches) |

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/reservations/areas" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Lounge",
    "capacity": 15,
    "is_active": true
  }'
```

**Example Response (201):** Same shape as GET /areas (single area).

---

### PUT /reservations/areas/:id - Update Seating Area

Update area details.

**Auth:** Admin session or API key (reservations:manage permission).

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/reservations/areas/2" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "capacity": 25,
    "description": "Garden terrace with heating"
  }'
```

**Example Response (200):** Updated area object (same as POST response).

---

### DELETE /reservations/areas/:id - Delete Seating Area

Delete an area. If the area has existing reservations, it is deactivated instead (to preserve booking history).

**Auth:** Admin session or API key (reservations:manage permission).

**Example Request:**

```bash
curl -X DELETE "https://your-store.com/api/v1/reservations/areas/2" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Area deactivated — 5 reservation(s) reference it, so it was kept for history.",
  "data": {
    "area": { "id": 2, "name": "Terrace", "is_active": false },
    "deactivated": true
  }
}
```

If the area has no reservations:

```json
{
  "status": "success",
  "message": "Area deleted."
}
```

**Gotcha:** Foreign keys are ON DELETE SET NULL, so deleting an in-use area would strip it from historic reservations. The endpoint deactivates instead.

---

## Availability and search

### GET /reservations/availability - Check Availability

Query available time slots for a given date, party size, and optional area/branch.

**Auth:** Admin session or API key (reservations:view permission).

**Query Parameters:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | string | Yes | YYYY-MM-DD (shop timezone) |
| `party_size` | number | No | Party size; slots too small come back as `available: false` |
| `branch_id` | number | No | Only if branches addon enabled and `branch_selection_enabled` is true |
| `area_id` | number | No | Only if `area_selection_enabled` is true; uses that area's capacity |

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/reservations/availability?date=2026-09-20&party_size=4&area_id=2" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "date": "2026-09-20",
    "timezone": "Africa/Nairobi",
    "open": true,
    "slots": [
      {
        "time": "19:00",
        "reserved_at": "2026-09-20T16:00:00.000Z",
        "available": true
      },
      {
        "time": "19:30",
        "reserved_at": "2026-09-20T16:30:00.000Z",
        "available": false
      },
      {
        "time": "20:00",
        "reserved_at": "2026-09-20T17:00:00.000Z",
        "available": true
      }
    ]
  }
}
```

**Gotcha:** `reserved_at` is the UTC instant corresponding to the local slot time. Use it directly to book; don't re-calculate.

---

## Export

### GET /reservations/export/csv - Export Reservations (CSV)

Export a list of reservations as CSV for printing or external use.

**Auth:** Admin session or API key (reservations:view permission).

**Query Parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `from` | string | Start date (YYYY-MM-DD, shop timezone) |
| `to` | string | End date (YYYY-MM-DD, shop timezone) |
| `status` | string | Filter by status (e.g., `confirmed`) |

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/reservations/export/csv?from=2026-09-15&to=2026-09-30&status=confirmed" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```
Reference,Date,Time,Guest,Phone,Email,Party,Status,Source,Branch,Area,Table,Occasion,Requests,Notes
RES-000001,2026-09-20,19:00,John Doe,+254700000004,john@example.com,4,confirmed,storefront,Main,Terrace,Table 7,Anniversary,Window seat preferred,VIP customer
RES-000002,2026-09-21,19:30,Jane Smith,+254700000005,jane@example.com,6,confirmed,phone,Main,Indoor,,Birthday,No shellfish,Returning guest
```

**Response Headers:**
- `Content-Type: text/csv; charset=utf-8`
- `Content-Disposition: attachment; filename="reservations-{from}.csv"`
- `Cache-Control: no-store`

**Limits:**
- Maximum 5000 rows per export.
- Dates in shop timezone (the `instantToZonedDate` function converts UTC instants for display).

---

## Addon behavior

All endpoints return **503 Service Unavailable** when the Reservations addon is switched off:

```json
{
  "status": "error",
  "message": "The Reservations addon is disabled. Enable it under Settings → Addons."
}
```

Staff without the `reservations` permission will receive a 403 Forbidden instead.

---

## Real-time updates

When a reservation is created, updated, or deleted, the backend broadcasts the change to all connected WebSocket clients (if the storefront or admin dashboard is listening on the `reservation_changes` channel). Use this to update dashboards in real-time without polling.

---

## Timezone handling

All timestamps go over the wire as UTC (`reserved_at`, `created_at`, `confirmed_at`, etc.). The shop's timezone is returned in most responses (e.g., `GET /reservations` returns `timezone: "Africa/Nairobi"`). Use it to display wall-clock times to users. Admin-side date filters (`from`, `to`, `date`) and CSV exports all handle conversions server-side.
