Delivery personnel management and real-time tracking for order fulfillment. The **Riders addon** enables staff to assign orders to delivery personnel (riders, couriers, technicians), and riders to track deliveries via a mobile app with GPS location updates and proof-of-delivery capture. Store owners define rider labels, which fields to collect, and whether riders are scoped to branches. Most endpoints return 503 when the addon is switched off.

All responses use the standard `{ status, data }` envelope.

## Admin: Rider Management

Endpoints for managing riders on the backend — creating, updating, and listing delivery personnel.

### GET /riders/config - Rider configuration

Retrieve the store's rider addon settings: labels, required fields, custom field definitions, branch enforcement, and notification channels. This endpoint is outside the addon gate and always returns successfully, allowing the admin UI to show configuration even if assignments are gated.

**Auth:** API key or admin session

```bash
curl -X GET "https://your-store.com/api/v1/riders/config" \
  -H "Cookie: shopflow.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "settings": {
      "label_singular": "Rider",
      "label_plural": "Riders",
      "visible_fields": ["first_name", "last_name", "phone", "vehicle_reg"],
      "required_fields": ["first_name", "last_name", "phone"],
      "vehicle_label": "Registration",
      "vehicle_types": ["Motorbike", "Car"],
      "enforce_branch": true,
      "custom_fields": [],
      "notify_channels": ["sms"],
      "assignment_message_template": "Order {order_number} assigned to you"
    }
  }
}
```

When addon is disabled:

```json
{
  "status": "success",
  "data": {
    "enabled": false
  }
}
```

### GET /riders - List riders

Retrieve all riders, optionally filtered by search, status, or branch. Staff scoped to a branch see only that branch's riders plus unassigned riders. Can filter by availability for a specific order.

**Auth:** API key or admin session (requires 'riders' 'view' permission)

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Free-text search across first/last name, ID number, email, phone, vehicle registration |
| `status` | string | Filter by status (active, inactive, archived) or 'all'. Defaults to excluding archived. |
| `branch_id` | integer | Explicit branch filter; overrides X-Branch-Id header |
| `available_for_order` | integer | Order ID; returns only active riders who can take this order |

```bash
curl -X GET "https://your-store.com/api/v1/riders?status=active&search=john" \
  -H "Cookie: shopflow.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "riders": [
      {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+254700000002",
        "email": "john@example.com",
        "id_number": "ID123456",
        "vehicle_reg": "KDG 123A",
        "vehicle_type": "Motorbike",
        "branch_id": 1,
        "branch": {
          "id": 1,
          "name": "Downtown"
        },
        "status": "active",
        "notes": "Reliable and punctual",
        "custom_fields": {},
        "user_id": 42,
        "app_enabled": true,
        "is_online": true,
        "push_token": null,
        "created_at": "2025-01-15T10:30:00Z",
        "updated_at": "2025-01-20T14:22:00Z"
      }
    ]
  }
}
```

### GET /riders/:id - Get a rider

Retrieve detailed information about a single rider.

**Auth:** API key or admin session (requires 'riders' 'view' permission)

```bash
curl -X GET "https://your-store.com/api/v1/riders/1" \
  -H "Cookie: shopflow.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "rider": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+254700000002",
      "email": "john@example.com",
      "id_number": "ID123456",
      "vehicle_reg": "KDG 123A",
      "vehicle_type": "Motorbike",
      "branch_id": 1,
      "branch": {
        "id": 1,
        "name": "Downtown"
      },
      "status": "active",
      "notes": "Reliable and punctual",
      "custom_fields": {},
      "user_id": 42,
      "app_enabled": true,
      "is_online": true,
      "push_token": null,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-20T14:22:00Z"
    }
  }
}
```

### POST /riders - Create a rider

Create a new rider. First name, last name, and phone are always required; additional required fields depend on store configuration. Custom fields are validated according to their type and required flag.

**Auth:** API key or admin session (requires 'riders' 'manage' permission)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `first_name` | string | Yes | Rider's first name |
| `last_name` | string | Yes | Rider's last name |
| `phone` | string | Yes | Phone number (7–20 characters, digits, spaces, hyphens, leading +) |
| `email` | string | No | Email address |
| `id_number` | string | No | National ID or license number (must be unique if required) |
| `vehicle_reg` | string | No | Vehicle registration (stored uppercase, must be unique if provided) |
| `vehicle_type` | string | No | Vehicle type (e.g., Motorbike, Car) |
| `branch_id` | integer | No | Branch ID (required if store enforces branch scoping) |
| `status` | string | No | One of active, inactive, archived. Defaults to active. |
| `notes` | string | No | Internal notes |
| `custom_fields` | object | No | Custom field values defined in settings |
| `user_id` | integer | No | User account ID for mobile app sign-in |
| `app_enabled` | boolean | No | Whether the rider can access the mobile app |

```bash
curl -X POST "https://your-store.com/api/v1/riders" \
  -H "Cookie: shopflow.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "phone": "+254700000002",
    "email": "john@example.com",
    "id_number": "ID123456",
    "vehicle_reg": "KDG 123A",
    "vehicle_type": "Motorbike",
    "branch_id": 1,
    "notes": "Reliable and punctual",
    "custom_fields": {}
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "rider": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+254700000002",
      "email": "john@example.com",
      "id_number": "ID123456",
      "vehicle_reg": "KDG 123A",
      "vehicle_type": "Motorbike",
      "branch_id": 1,
      "branch": {
        "id": 1,
        "name": "Downtown"
      },
      "status": "active",
      "notes": "Reliable and punctual",
      "custom_fields": {},
      "user_id": null,
      "app_enabled": false,
      "is_online": false,
      "push_token": null,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-15T10:30:00Z"
    }
  }
}
```

**Error Responses:**

- **422** — Validation error (missing required field, phone invalid, or custom field validation failed)
- **409** — Duplicate ID number or vehicle registration
- **403** — No permission to register riders at the specified branch

**Gotchas:**

- Phone validation requires at least 7 characters and contains only digits, spaces, hyphens, or a leading +.
- ID numbers and vehicle registrations must be globally unique; duplicates return 409.

### PUT /riders/:id - Update a rider

Update an existing rider. Validation follows the same rules as creation. Transferring a rider to a new branch requires permission on that branch.

**Auth:** API key or admin session (requires 'riders' 'manage' permission)

```bash
curl -X PUT "https://your-store.com/api/v1/riders/1" \
  -H "Cookie: shopflow.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+254700000003",
    "status": "inactive"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "rider": {
      "id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "phone": "+254700000003",
      "email": "john@example.com",
      "id_number": "ID123456",
      "vehicle_reg": "KDG 123A",
      "vehicle_type": "Motorbike",
      "branch_id": 1,
      "branch": {
        "id": 1,
        "name": "Downtown"
      },
      "status": "inactive",
      "notes": "Reliable and punctual",
      "custom_fields": {},
      "user_id": null,
      "app_enabled": false,
      "is_online": false,
      "push_token": null,
      "created_at": "2025-01-15T10:30:00Z",
      "updated_at": "2025-01-20T14:22:00Z"
    }
  }
}
```

### DELETE /riders/:id - Delete or archive a rider

Delete a rider if they have no delivery history. If the rider has completed any orders, they are archived instead to preserve delivery records. Archived riders no longer appear in assignment pickers.

**Auth:** API key or admin session (requires 'riders' 'manage' permission)

```bash
curl -X DELETE "https://your-store.com/api/v1/riders/1" \
  -H "Cookie: shopflow.sid=..."
```

**Example Response (200) — No delivery history (deleted):**

```json
{
  "status": "success",
  "data": {
    "deleted": true
  }
}
```

**Example Response (200) — With delivery history (archived):**

```json
{
  "status": "success",
  "data": {
    "archived": true,
    "orders": 5,
    "message": "John Doe has 5 orders on record, so they were archived rather than deleted. They no longer appear when assigning."
  }
}
```

**Gotchas:**

- Riders with delivery history are archived instead of deleted to preserve order history.
- Archived riders no longer appear in assignment pickers.

## Rider App: Order Delivery

Endpoints for the mobile rider app to manage deliveries, track location, and upload proof of delivery. All require an active rider session.

### GET /rider/me - Get current rider profile

Fetch the authenticated rider's profile including branch assignment and personal info. Used on app login to populate the rider's identity.

**Auth:** Rider session

**Addon:** Riders addon — returns 503 when switched off

```bash
curl "https://your-store.com/api/v1/rider/me" \
  -H "Cookie: shopflow.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "rider": {
      "id": 42,
      "first_name": "John",
      "last_name": "Kipchoge",
      "phone": "+254700000002",
      "email": "john.kipchoge@example.com",
      "vehicle_type": "motorcycle",
      "vehicle_reg": "KCU 123D",
      "status": "active",
      "is_online": false,
      "app_enabled": true,
      "custom_fields": {},
      "branch_id": 5,
      "branch": {
        "id": 5,
        "name": "Westlands Hub",
        "address": "123 Tech Park, Nairobi"
      },
      "created_at": "2025-06-15T10:00:00Z",
      "updated_at": "2026-09-23T14:00:00Z"
    }
  }
}
```

### GET /rider/orders - List rider's assigned orders

Fetch orders assigned to the authenticated rider, optionally filtered by state: `assigned` (not yet accepted), `active` (accepted or picked up, not delivered), or `delivered` (today only). App calls this on startup and after state transitions to refresh the work queue.

**Auth:** Rider session

**Addon:** Riders addon — returns 503 when switched off

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `state` | string | `active` | One of: `assigned`, `active`, `delivered` |

```bash
curl "https://your-store.com/api/v1/rider/orders?state=active" \
  -H "Cookie: shopflow.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": 5421,
        "order_number": "ORD-0001",
        "status": "assigned",
        "customer": {
          "id": 123,
          "name": "Amina Omondi",
          "phone": "+254700000001",
          "email": "amina@example.com"
        },
        "addresses": [
          {
            "id": 456,
            "type": "delivery",
            "street": "123 Main St",
            "city": "Nairobi",
            "postal_code": "00100",
            "latitude": -1.2870,
            "longitude": 36.8250
          }
        ],
        "items": [
          {
            "id": 1,
            "product_id": 10,
            "product_name": "Wireless Headphones",
            "quantity": 1,
            "price": 2500
          }
        ],
        "total": 2500,
        "rider_assigned_at": "2026-09-23T12:00:00Z",
        "rider_accepted_at": null,
        "rider_picked_up_at": null,
        "rider_delivered_at": null,
        "created_at": "2026-09-23T11:50:00Z"
      }
    ]
  }
}
```

**Gotchas:**

- `state=delivered` returns today's deliveries only (midnight local time cutoff).
- Max 100 orders returned; ordered by assignment time DESC, then creation time DESC.

### GET /rider/orders/:id - Get single order details

Fetch a single order assigned to this rider, including customer contact info and all delivery addresses. App calls this when the user taps an order to see full details and navigation info.

**Auth:** Rider session

**Addon:** Riders addon — returns 503 when switched off

```bash
curl "https://your-store.com/api/v1/rider/orders/5421" \
  -H "Cookie: shopflow.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 5421,
      "order_number": "ORD-0001",
      "status": "assigned",
      "customer": {
        "id": 123,
        "name": "Amina Omondi",
        "phone": "+254700000001",
        "email": "amina@example.com"
      },
      "addresses": [
        {
          "id": 456,
          "type": "delivery",
          "street": "123 Main St, Apt 5B",
          "city": "Nairobi",
          "state": "Nairobi County",
          "postal_code": "00100",
          "latitude": -1.2870,
          "longitude": 36.8250,
          "notes": "Building with blue gate, call when nearby"
        }
      ],
      "items": [
        {
          "id": 1,
          "product_id": 10,
          "product_name": "Wireless Headphones",
          "quantity": 1,
          "price": 2500
        }
      ],
      "total": 2500,
      "rider_assigned_at": "2026-09-23T12:00:00Z",
      "rider_accepted_at": null,
      "rider_picked_up_at": null,
      "rider_delivered_at": null,
      "created_at": "2026-09-23T11:50:00Z"
    }
  }
}
```

### POST /rider/orders/:id/accept - Accept an assigned order

Mark an order as accepted, moving it from `assigned` to `accepted` state. Rider automatically goes online so location tracking begins immediately. App calls this when rider taps "Accept" on a delivery.

**Auth:** Rider session

**Addon:** Riders addon — returns 503 when switched off

```bash
curl -X POST "https://your-store.com/api/v1/rider/orders/5421/accept" \
  -H "Cookie: shopflow.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 5421,
      "status": "assigned",
      "rider_accepted_at": "2026-09-23T14:00:00Z",
      "rider_picked_up_at": null,
      "rider_delivered_at": null
    }
  }
}
```

**Gotchas:**

- Cannot accept an order twice; 409 returned if already accepted.
- Rider automatically goes online; no need to call `/rider/online` separately.

### POST /rider/orders/:id/pickup - Mark order as picked up

Mark an order as picked up, moving it from `accepted` to `out_for_delivery` state. Rider must have accepted the order first. App calls this when the rider has received the package at the depot.

**Auth:** Rider session

**Addon:** Riders addon — returns 503 when switched off

```bash
curl -X POST "https://your-store.com/api/v1/rider/orders/5421/pickup" \
  -H "Cookie: shopflow.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 5421,
      "status": "out_for_delivery",
      "rider_accepted_at": "2026-09-23T14:00:00Z",
      "rider_picked_up_at": "2026-09-23T14:15:00Z",
      "rider_delivered_at": null
    }
  }
}
```

**Gotchas:**

- Returns 409 if order has not been accepted yet.
- Returns 409 if already picked up.

### POST /rider/orders/:id/deliver - Mark order as delivered

Mark an order as delivered, moving it from `picked_up` to `delivered` state. Rider must have picked up the order first. Rider remains online for the next delivery; auto-offline is client-side. App calls this when the rider has handed off the package to the customer.

**Auth:** Rider session

**Addon:** Riders addon — returns 503 when switched off

```bash
curl -X POST "https://your-store.com/api/v1/rider/orders/5421/deliver" \
  -H "Cookie: shopflow.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 5421,
      "status": "delivered",
      "rider_accepted_at": "2026-09-23T14:00:00Z",
      "rider_picked_up_at": "2026-09-23T14:15:00Z",
      "rider_delivered_at": "2026-09-23T14:45:00Z"
    }
  }
}
```

**Gotchas:**

- Returns 409 if order has not been picked up yet.
- Returns 409 if already delivered.
- Rider is NOT automatically taken offline.

### POST /rider/orders/:id/proof - Attach proof of delivery photo

Link a media asset (photo) to an order as proof of delivery. The photo must be uploaded separately via `/media/upload` first; this endpoint only records the association. Can be called at any time, even before marking the order delivered.

**Auth:** Rider session

**Addon:** Riders addon — returns 503 when switched off

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `media_id` | integer | Yes | ID of the media asset (from `/media/upload` response) |

```bash
curl -X POST "https://your-store.com/api/v1/rider/orders/5421/proof" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=..." \
  -d '{"media_id": 789}'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 5421,
      "proof_of_delivery_media_id": 789,
      "pod_recorded_at": "2026-09-23T14:45:00Z"
    }
  }
}
```

**Gotchas:**

- Photo upload is a separate call to `/media/upload`.
- Multiple calls update `proof_of_delivery_media_id` to the latest photo.

### POST /rider/location - Submit location samples

Batch-upload GPS location samples from the rider's device. App sends samples every 10-60 seconds when online; this endpoint batches multiple samples (max 20) to reduce network overhead. Rate-limited to 120 samples per minute per rider.

Invalid samples (outside Kenya bounding box; GPS accuracy >100m; timestamps >10 minutes in future) are silently dropped.

**Auth:** Rider session

**Addon:** Riders addon — returns 503 when switched off

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `samples` | array | Yes | Array of location samples; max 20 per request |
| `lat` | number | Yes (per sample) | Latitude; must be in -5 to 5 (Kenya) |
| `lng` | number | Yes (per sample) | Longitude; must be in 33 to 42 (Kenya) |
| `accuracy` | number | No | GPS accuracy in meters; max 100m accepted |
| `heading` | number | No | Compass heading in degrees (0–360) |
| `speed` | number | No | Speed in m/s |
| `recorded_at` | string | Yes (per sample) | ISO 8601 UTC timestamp |
| `order_id` | number | No | Order ID if location tied to a delivery |

```bash
curl -X POST "https://your-store.com/api/v1/rider/location" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=..." \
  -d '{
    "samples": [
      {
        "lat": -1.2870,
        "lng": 36.8250,
        "accuracy": 8.5,
        "heading": 245,
        "speed": 12.3,
        "recorded_at": "2026-09-23T14:30:00Z",
        "order_id": 5421
      }
    ]
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "accepted": 2
  }
}
```

**Gotchas:**

- Empty `samples` array returns immediately with `{ "accepted": 0 }`.
- Invalid samples silently drop; only valid ones increment `accepted`.
- Sending >20 samples returns 413 Payload Too Large.
- Rate limit is per-rider (120/min); exceeding returns 429 Too Many Requests.

### POST /rider/online - Toggle online/offline status

Manually set the rider's online/offline status. Used when the rider goes off-shift between deliveries or takes a break. Riders auto-go online when they accept an order.

**Auth:** Rider session

**Addon:** Riders addon — returns 503 when switched off

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `online` | boolean | Yes | `true` to go online, `false` to go offline |

```bash
curl -X POST "https://your-store.com/api/v1/rider/online" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=..." \
  -d '{"online": false}'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "is_online": false
  }
}
```

**Gotchas:**

- Setting `online=false` does NOT unassign pending deliveries; orders remain assigned.
- Accepting an order auto-sets `is_online=true` regardless of previous status.

### POST /rider/push-token - Register Expo push token

Register or refresh the rider's Expo push notification token. Called on app login and app resume (to handle token rotation). Token is used to send assignment notifications and order update alerts.

**Auth:** Rider session

**Addon:** Riders addon — returns 503 when switched off

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | Expo push token from `expo-notifications` on the device |

```bash
curl -X POST "https://your-store.com/api/v1/rider/push-token" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=..." \
  -d '{"token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"}'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "ok": true
  }
}
```

**Gotchas:**

- Expo tokens may rotate (e.g., after app update); call this on app resume to keep the backend token current.
- Push failures (Expo API down) do not fail the HTTP request; assignment succeeds even if push doesn't send.

## Admin: Delivery Tracking

Endpoints for live delivery maps and tracking rider locations and order fulfillment status. Both require admin session or API key with Riders App module permission.

### GET /admin/riders/:id/locations - Rider location history

Retrieve recorded GPS locations for a rider over a time range. Locations are stored as the rider moves, rate-limited to 120 samples per minute. Response returns locations in reverse chronological order (newest first).

**Auth:** API key or admin session, with Riders App module view permission

**Addon:** Riders addon — returns 503 when switched off

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `since` | ISO 8601 string | 1 hour ago | Only locations after this timestamp |
| `limit` | integer | 500 | Max locations to return (capped at 2000) |

```bash
curl "https://your-store.com/api/v1/admin/riders/5/locations?since=2026-09-23T10:00:00.000Z&limit=100"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "locations": [
      {
        "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
        "rider_id": 5,
        "order_id": 123,
        "lat": -1.2676,
        "lng": 36.8108,
        "accuracy": 8.5,
        "heading": 45,
        "speed": 12.3,
        "recorded_at": "2026-09-23T10:15:30.000Z"
      }
    ]
  }
}
```

**Gotchas:**

- `accuracy`, `heading`, and `speed` may be `null` if the device could not determine them.
- `order_id` is `null` when the rider is idle between deliveries.
- Results ordered newest first; post-process client-side for chronological order.

### GET /admin/orders/:id/track - Order delivery tracking

Retrieve the complete delivery path and current position of the rider assigned to an order. Returns order details, rider profile, latest location, and all GPS samples since the order was accepted.

**Auth:** API key or admin session, with Riders App module view permission

**Addon:** Riders addon — returns 503 when switched off

```bash
curl "https://your-store.com/api/v1/admin/orders/123/track"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "order": {
      "id": 123,
      "order_number": "ORD-1695640430000",
      "status": "shipped",
      "rider_id": 5,
      "rider_assigned_at": "2026-09-23T09:50:00.000Z",
      "rider_accepted_at": "2026-09-23T09:52:00.000Z",
      "customer": {
        "id": 42,
        "email": "customer@example.com",
        "first_name": "Jane",
        "last_name": "Doe"
      },
      "addresses": [
        {
          "id": 1,
          "type": "shipping",
          "first_name": "Jane",
          "last_name": "Doe",
          "street": "123 Main St",
          "city": "Nairobi",
          "state": "Nairobi",
          "postal_code": "00100",
          "country": "KE",
          "phone": "+254700000004",
          "latitude": -1.2676,
          "longitude": 36.8108
        }
      ]
    },
    "rider": {
      "id": 5,
      "first_name": "John",
      "last_name": "Mwangi",
      "is_online": true,
      "push_token": "ExponentPushToken[...]"
    },
    "latest": {
      "id": "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
      "rider_id": 5,
      "order_id": 123,
      "lat": -1.2676,
      "lng": 36.8108,
      "accuracy": 8.5,
      "heading": 45,
      "speed": 12.3,
      "recorded_at": "2026-09-23T10:15:30.000Z"
    },
    "path": [
      {
        "id": "b2c3d4e5-f6a7-5b6c-9d0e-1f2a3b4c5d6e",
        "rider_id": 5,
        "order_id": 123,
        "lat": -1.2674,
        "lng": 36.8105,
        "accuracy": 10.2,
        "heading": 0,
        "speed": 0,
        "recorded_at": "2026-09-23T09:52:00.000Z"
      }
    ]
  }
}
```

**Gotchas:**

- If `rider_id` is `null`, the order has no rider assigned; `rider` and `path` will both be `null`.
- The `path` starts from `rider_accepted_at` if set, otherwise `rider_assigned_at`.
- `latest` is the most recent sample from the `path`, or `null` if no location samples exist yet.
- The path is limited to the 2000 most recent samples.
