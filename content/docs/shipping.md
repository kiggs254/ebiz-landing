## 13. Shipping API

### POST /shipping/external/calculate - Calculate Shipping Rates

Use this endpoint from ERP, POS, or partner systems to get shipping rates for a given address and cart.

**Auth:** API key required (HTTP Basic or X-API-Key).

**Request Body:**

```json
{
  "country": "KE",
  "state": "Nairobi",
  "city": "Westlands",
  "address": "Westlands Road",
  "postal_code": "00100",
  "latitude": -1.2676,
  "longitude": 36.8108,
  "place_id": "ChIJw8dw9L4RLxgRN6VaR-iGxQY",
  "items": [
    { "product_id": 101, "quantity": 2 },
    { "product_id": 205, "quantity": 1 }
  ]
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `country` | string | Yes | ISO 3166-1 alpha-2 country code |
| `state` | string | No | State/region |
| `city` | string | No | City |
| `address` | string | No | Street address |
| `postal_code` | string | No | Postal code |
| `latitude` | number | No | Latitude for distance-based shipping |
| `longitude` | number | No | Longitude for distance-based shipping |
| `place_id` | string | No | Google Place ID of the delivery address. Passed to the Google Distance Matrix / Routes API for a more accurate route lookup than raw coordinates (a place_id routes to the same entry point `maps.google.com` uses). When omitted and `latitude`/`longitude` are provided, the server reverse-geocodes them via the Google Geocoding API and uses the resolved Place ID automatically. |
| `items` | array | Yes | `[{ product_id, quantity }]` |

**Place ID resolution (distance-based shipping only):** precedence is `place_id` from the request → server-side reverse-geocode of `latitude`/`longitude` (when a Google Maps API key is configured in the shipping settings) → raw coordinates as a final fallback.

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/shipping/external/calculate" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "country": "KE",
    "state": "Nairobi",
    "city": "Westlands",
    "items": [
      { "product_id": 101, "quantity": 2 },
      { "product_id": 205, "quantity": 1 }
    ]
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "methods": [
      {
        "id": "convenient-couriers",
        "name": "Convenient Couriers",
        "type": "distance_based",
        "cost": 510,
        "zone_name": "Convenient Couriers"
      }
    ]
  }
}
```

---

## Shipping Zones

Shipping zones are geographic regions (identified by country codes) where your store offers delivery. Each zone contains one or more shipping methods that define how customers pay for delivery to that area.

### GET /shipping/zones - List All Shipping Zones

Retrieve all shipping zones with their associated methods.

**Auth:** Admin session

**Example Request:**
```bash
curl -X GET "https://your-store-api.example.com/api/v1/shipping/zones"
```

**Example Response (200):**
```json
{
  "status": "success",
  "data": {
    "zones": [
      {
        "id": 1,
        "name": "Kenya (EAC)",
        "enabled": true,
        "countries_json": ["KE", "UG", "TZ"],
        "methods": [
          {
            "id": 5,
            "zone_id": 1,
            "name": "Express Delivery",
            "type": "weight_based",
            "enabled": true
          }
        ]
      },
      {
        "id": 2,
        "name": "Rest of World",
        "enabled": false,
        "countries_json": []
      }
    ]
  }
}
```

---

### POST /shipping/zones - Create Shipping Zone

Create a new shipping zone.

**Auth:** Admin session

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Zone name (e.g., "Kenya (EAC)") |
| `enabled` | boolean | No | Default: true |
| `countries_json` | array of strings | No | List of country codes this zone covers (e.g., `["KE", "UG", "TZ"]`) |

**Example Request:**
```bash
curl -X POST "https://your-store-api.example.com/api/v1/shipping/zones" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "East Africa",
    "enabled": true,
    "countries_json": ["KE", "UG", "TZ", "RW"]
  }'
```

**Example Response (201):**
```json
{
  "status": "success",
  "data": {
    "zone": {
      "id": 3,
      "name": "East Africa",
      "enabled": true,
      "countries_json": ["KE", "UG", "TZ", "RW"],
      "created_at": "2024-09-23T10:00:00Z"
    }
  }
}
```

---

### GET /shipping/zones/:id - Get Shipping Zone

Retrieve a single shipping zone with its associated methods.

**Auth:** Admin session

**Example Request:**
```bash
curl -X GET "https://your-store-api.example.com/api/v1/shipping/zones/1"
```

**Example Response (200):**
```json
{
  "status": "success",
  "data": {
    "zone": {
      "id": 1,
      "name": "Kenya (EAC)",
      "enabled": true,
      "countries_json": ["KE", "UG", "TZ"],
      "methods": [
        {
          "id": 5,
          "zone_id": 1,
          "name": "Express Delivery",
          "type": "weight_based",
          "cost": 500,
          "enabled": true,
          "rate_basis": "weight",
          "rate_mode": "per_order"
        }
      ],
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-09-20T14:45:00Z"
    }
  }
}
```

**Error Responses:**
- 404: Zone not found

---

### PUT /shipping/zones/:id - Update Shipping Zone

Update a shipping zone's name, enabled status, or countries list.

**Auth:** Admin session

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | New zone name |
| `enabled` | boolean | No | Activate/deactivate the zone |
| `countries_json` | array of strings | No | List of country codes (e.g., `["KE", "UG"]`), or JSON string |

**Example Request:**
```bash
curl -X PUT "https://your-store-api.example.com/api/v1/shipping/zones/1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "East Africa (Updated)",
    "enabled": true,
    "countries_json": ["KE", "UG", "TZ", "RW"]
  }'
```

**Example Response (200):**
```json
{
  "status": "success",
  "data": {
    "zone": {
      "id": 1,
      "name": "East Africa (Updated)",
      "enabled": true,
      "countries_json": ["KE", "UG", "TZ", "RW"],
      "updated_at": "2024-09-23T10:00:00Z"
    }
  }
}
```

**Error Responses:**
- 404: Zone not found

---

### DELETE /shipping/zones/:id - Delete Shipping Zone

Delete a shipping zone and all associated shipping methods.

**Auth:** Admin session

**Example Request:**
```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/shipping/zones/1"
```

**Example Response (200):**
```json
{
  "status": "success",
  "message": "Shipping zone deleted successfully"
}
```

**Error Responses:**
- 404: Zone not found

**Note:** Deleting a zone cascades to remove all its shipping methods.

---

## Shipping Methods

Shipping methods define how delivery is priced within a zone. They support multiple types: flat-rate (fixed cost), weight-based (tiered by weight), free shipping, and local pickup.

### GET /shipping/methods - List All Shipping Methods

Retrieve all shipping methods across all zones.

**Auth:** Admin session

**Example Request:**
```bash
curl -X GET "https://your-store-api.example.com/api/v1/shipping/methods"
```

**Example Response (200):**
```json
{
  "status": "success",
  "data": {
    "methods": [
      {
        "id": 5,
        "zone_id": 1,
        "name": "Express Delivery",
        "type": "weight_based",
        "cost": 500,
        "min_amount": 500,
        "enabled": true,
        "rate_basis": "weight",
        "rate_mode": "per_order",
        "rates": [
          {
            "min_value": 0,
            "max_value": 10,
            "cost": 250,
            "label": "0-10 kg"
          },
          {
            "min_value": 10,
            "max_value": 20,
            "cost": 400,
            "label": "10-20 kg"
          }
        ]
      },
      {
        "id": 6,
        "zone_id": 1,
        "name": "Standard Delivery",
        "type": "flat_rate",
        "cost": 300,
        "enabled": true
      }
    ]
  }
}
```

---

### GET /shipping/methods/:id - Get Shipping Method

Retrieve a single shipping method with its rate bands.

**Auth:** Admin session

**Example Request:**
```bash
curl -X GET "https://your-store-api.example.com/api/v1/shipping/methods/5"
```

**Example Response (200):**
```json
{
  "status": "success",
  "data": {
    "method": {
      "id": 5,
      "zone_id": 1,
      "name": "Express Delivery",
      "type": "weight_based",
      "cost": 500,
      "min_amount": 500,
      "enabled": true,
      "rate_basis": "weight",
      "rate_mode": "per_order",
      "rates": [
        { "min_value": 0, "max_value": 10, "cost": 250, "label": "0-10 kg" },
        { "min_value": 10, "max_value": 20, "cost": 400, "label": "10-20 kg" },
        { "min_value": 20, "max_value": null, "cost": 600, "label": "20+ kg" }
      ],
      "zone": {
        "id": 1,
        "name": "Kenya (EAC)"
      }
    }
  }
}
```

**Error Responses:**
- 404: Shipping method not found

---

### POST /shipping/methods - Create Shipping Method

Create a new shipping method within a zone.

**Auth:** Admin session

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `zone_id` | integer | Yes | ID of the shipping zone |
| `name` | string | Yes | Method name (e.g., "Express Delivery") |
| `type` | string | Yes | `flat_rate`, `weight_based`, `free_shipping`, or `local_pickup` |
| `cost` | number | No | Fixed cost (flat_rate) or starting cost (weight_based); ignored for free_shipping |
| `min_amount` | number | No | Minimum cart value to use this method |
| `description` | string | No | Customer-facing description |
| `pickup_address` | string | No | Address for local_pickup type |
| `pickup_latitude` | number | No | Latitude for local_pickup |
| `pickup_longitude` | number | No | Longitude for local_pickup |
| `enabled` | boolean | No | Default: true |
| `rate_basis` | string | No | For weight_based: `weight`, `order_total`, or `item_count`. Default: `weight` |
| `rate_mode` | string | No | For weight_based: `per_order` or `per_item`. Default: `per_order` |
| `rates` | array | No | Array of rate bands (weight_based only) |

**Rate Band Structure (rates array):**
```json
{
  "min_value": 0,
  "max_value": 10,
  "cost": 250,
  "label": "0-10 kg"
}
```

**Rate Band Rules:**
- Bands must be sorted by `min_value`
- Consecutive bands must be contiguous (band N's `max_value` = band N+1's `min_value`)
- Exactly one band must have `max_value: null` (open-ended tail), and it must be the last one
- All `min_value`, `max_value`, and `cost` must be non-negative numbers

**Example Request (Flat Rate):**
```bash
curl -X POST "https://your-store-api.example.com/api/v1/shipping/methods" \
  -H "Content-Type: application/json" \
  -d '{
    "zone_id": 1,
    "name": "Standard Delivery",
    "type": "flat_rate",
    "cost": 300,
    "min_amount": 500,
    "enabled": true
  }'
```

**Example Request (Weight-Based):**
```bash
curl -X POST "https://your-store-api.example.com/api/v1/shipping/methods" \
  -H "Content-Type: application/json" \
  -d '{
    "zone_id": 1,
    "name": "Express Delivery",
    "type": "weight_based",
    "cost": 500,
    "rate_basis": "weight",
    "rate_mode": "per_order",
    "enabled": true,
    "rates": [
      { "min_value": 0, "max_value": 10, "cost": 250, "label": "0-10 kg" },
      { "min_value": 10, "max_value": 20, "cost": 400, "label": "10-20 kg" },
      { "min_value": 20, "max_value": null, "cost": 600, "label": "20+ kg" }
    ]
  }'
```

**Example Response (201):**
```json
{
  "status": "success",
  "data": {
    "method": {
      "id": 7,
      "zone_id": 1,
      "name": "Express Delivery",
      "type": "weight_based",
      "cost": 500,
      "enabled": true,
      "rates": [...]
    }
  }
}
```

**Error Responses:**
- 400: Validation error (invalid zone, malformed rate bands, missing required fields)
- 404: Zone not found

**Gotchas:**
- For `weight_based` methods, rate bands must be valid and contiguous or a 400 error is returned.
- The `cost` field for `free_shipping` is always stored as 0, even if you send a non-zero value.
- For `local_pickup`, coordinates are nullable; invalid numbers (non-finite) are stored as `null` so the map can degrade gracefully.

---

### PUT /shipping/methods/:id - Update Shipping Method

Update a shipping method's properties or rate bands.

**Auth:** Admin session

**Request Body:**

All fields are optional. Omit to keep existing values.

| Field | Type | Description |
|-------|------|-------------|
| `zone_id` | integer | Move method to a different zone |
| `name` | string | New method name |
| `type` | string | Change type (flat_rate, weight_based, free_shipping, local_pickup) |
| `cost` | number | Update cost |
| `min_amount` | number | Update minimum cart value |
| `description` | string | Update customer-facing description |
| `pickup_address` | string | Update pickup location |
| `pickup_latitude` | number | Update pickup latitude |
| `pickup_longitude` | number | Update pickup longitude |
| `enabled` | boolean | Activate/deactivate |
| `rate_basis` | string | For weight_based: `weight`, `order_total`, or `item_count` |
| `rate_mode` | string | For weight_based: `per_order` or `per_item` |
| `rates` | array | Replace rate bands (only when present; omitting preserves old bands) |

**Example Request:**
```bash
curl -X PUT "https://your-store-api.example.com/api/v1/shipping/methods/5" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Express Delivery (Updated)",
    "enabled": true,
    "rates": [
      { "min_value": 0, "max_value": 5, "cost": 200, "label": "0-5 kg" },
      { "min_value": 5, "max_value": null, "cost": 400, "label": "5+ kg" }
    ]
  }'
```

**Example Response (200):**
```json
{
  "status": "success",
  "data": {
    "method": {
      "id": 5,
      "name": "Express Delivery (Updated)",
      "enabled": true,
      "rates": [...]
    }
  }
}
```

**Error Responses:**
- 400: Validation error (invalid zone, malformed rate bands)
- 404: Method or zone not found

**Gotchas:**
- When you omit the `rates` array, the old rate bands are preserved. This lets you switch a method away from `weight_based` (e.g., to `flat_rate`) and later switch back without losing the band table you typed in.

---

### DELETE /shipping/methods/:id - Delete Shipping Method

Delete a shipping method and its rate bands.

**Auth:** Admin session

**Example Request:**
```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/shipping/methods/5"
```

**Example Response (200):**
```json
{
  "status": "success",
  "message": "Shipping method deleted successfully"
}
```

**Error Responses:**
- 404: Shipping method not found

---

## Shipping Areas

Shipping areas are delivery destinations within a zone, organized as a tree structure. Top-level areas (`parent_id: null`) are corridor groups; nested children are specific delivery drop points. Each area can have a delivery charge, free shipping threshold, and estimated delivery time.

### GET /shipping/zones/:zoneId/areas - List Shipping Areas

Retrieves all shipping areas (drop points and delivery corridors) within a shipping zone, organized as a hierarchical tree structure. Root-level items are corridor groups; nested children are the priced delivery destinations.

**Auth:** Admin session only.

```bash
curl "https://your-store.example.com/api/v1/shipping/zones/1/areas" \
  -H "Cookie: shopflow.sid=..."
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `areas` | array | Tree of ShippingArea objects with nested `children` |
| `total` | integer | Count of all areas (flat, not hierarchical) |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "areas": [
      {
        "id": 101,
        "zone_id": 1,
        "parent_id": null,
        "name": "Lang'ata",
        "slug": "langata",
        "rate": null,
        "free_over": null,
        "eta_days": null,
        "enabled": true,
        "sort_order": 0,
        "notes": "Corridor group",
        "created_at": "2026-01-15T10:00:00Z",
        "updated_at": "2026-01-15T10:00:00Z",
        "children": [
          {
            "id": 102,
            "zone_id": 1,
            "parent_id": 101,
            "name": "Bomas",
            "slug": "bomas",
            "rate": "500",
            "free_over": "5000",
            "eta_days": 1,
            "enabled": true,
            "sort_order": 0,
            "notes": null,
            "created_at": "2026-01-15T10:05:00Z",
            "updated_at": "2026-01-15T10:05:00Z",
            "children": []
          }
        ]
      }
    ],
    "total": 42
  }
}
```

---

### POST /shipping/zones/:zoneId/areas - Create a Shipping Area

Creates a new shipping area (drop point or corridor group) within a zone. Areas form a tree: top-level items (`parent_id: null`) are corridor groups; children are individual delivery destinations. A child inherits its parent's rate if it has none of its own.

**Auth:** Admin session only.

```bash
curl -X POST "https://your-store.example.com/api/v1/shipping/zones/1/areas" \
  -H "Cookie: shopflow.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bomas",
    "parent_id": 101,
    "rate": 500,
    "free_over": 5000,
    "eta_days": 1,
    "enabled": true,
    "sort_order": 0,
    "notes": "Downtown delivery point"
  }'
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Area name (up to 200 chars) |
| `parent_id` | integer | No | Parent area ID if nesting (must belong to same zone) |
| `rate` | number | No | Delivery charge; NULL = inherit from parent |
| `free_over` | number | No | Cart total ≥ this amount ships free |
| `eta_days` | integer | No | Estimated delivery days |
| `enabled` | boolean | No | Default true |
| `sort_order` | integer | No | Display order (default 0) |
| `notes` | string | No | Internal notes, max 500 chars |

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "area": {
      "id": 102,
      "zone_id": 1,
      "parent_id": 101,
      "name": "Bomas",
      "slug": "bomas",
      "rate": "500",
      "free_over": "5000",
      "eta_days": 1,
      "enabled": true,
      "sort_order": 0,
      "notes": "Downtown delivery point",
      "created_at": "2026-01-15T10:05:00Z",
      "updated_at": "2026-01-15T10:05:00Z"
    }
  }
}
```

**Validation:**
- `name` cannot be empty.
- If `parent_id` is provided, it must be an existing area in the same zone.
- Returns 400 if validation fails.

**Gotchas:**
- Rate and free_over are stored as DECIMAL(12,2). Pass a string-formatted number or number type.
- A parent area can have `rate: null` to act as a grouping container; children inherit the nearest ancestor with a rate.

---

### PUT /shipping/zones/:zoneId/areas/:areaId - Update a Shipping Area

Updates one or more fields of an existing shipping area. Validates hierarchy constraints (no self-parent, no cycles). Pass only the fields you want to change.

**Auth:** Admin session only.

```bash
curl -X PUT "https://your-store.example.com/api/v1/shipping/zones/1/areas/102" \
  -H "Cookie: shopflow.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "rate": 550,
    "free_over": 6000,
    "notes": "Updated rate 2026-01"
  }'
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Cannot be empty if provided |
| `parent_id` | integer | No | Reparent to another area; pass null or '' to clear parent |
| `rate` | number | No | Update shipping charge |
| `free_over` | number | No | Update free shipping threshold |
| `eta_days` | integer | No | Update delivery estimate |
| `enabled` | boolean | No | Enable/disable this area |
| `sort_order` | integer | No | Update display order |
| `notes` | string | No | Update internal notes |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "area": {
      "id": 102,
      "zone_id": 1,
      "parent_id": 101,
      "name": "Bomas",
      "slug": "bomas",
      "rate": "550",
      "free_over": "6000",
      "eta_days": 1,
      "enabled": true,
      "sort_order": 0,
      "notes": "Updated rate 2026-01",
      "created_at": "2026-01-15T10:05:00Z",
      "updated_at": "2026-01-15T10:15:00Z"
    }
  }
}
```

**Validation:**
- An area cannot be its own parent.
- Reparenting to a descendant (cycle) is rejected: "That would nest this area inside its own child".
- Changing `name` also updates the slug (normalized for matching addresses).

---

### DELETE /shipping/zones/:zoneId/areas/:areaId - Delete a Shipping Area

Deletes a shipping area and all its children (via ON DELETE CASCADE on the FK). The parent area, if any, remains.

**Auth:** Admin session only.

```bash
curl -X DELETE "https://your-store.example.com/api/v1/shipping/zones/1/areas/102" \
  -H "Cookie: shopflow.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "deleted": true
  }
}
```

---

### POST /shipping/zones/:zoneId/areas/import - Bulk Import Shipping Areas

Imports a rate card (price list) into a zone, creating or updating areas. Rows with a `group` field are nested under a single parent corridor created on demand. Matching is on slug within the same parent, so re-importing the same sheet updates rates in place rather than duplicating.

**Auth:** Admin session only.

**Use Case:** A courier sends a new price list via email or spreadsheet. Parse it into rows and import to update all rates and fees at once.

```bash
curl -X POST "https://your-store.example.com/api/v1/shipping/zones/2/areas/import" \
  -H "Cookie: shopflow.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "rows": [
      { "group": "Lang'\''ata", "name": "Bomas", "rate": 500, "free_over": 5000, "eta_days": 1 },
      { "group": "Lang'\''ata", "name": "Bogani Road", "rate": 550, "free_over": 5500, "eta_days": 1 },
      { "group": "Westlands", "name": "Parklands", "rate": 600, "free_over": 6000, "eta_days": 1 }
    ],
    "replace": false
  }'
```

**Request Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rows` | array | Yes | Non-empty array of area rows |
| `rows[i].group` | string | No | Corridor name; rows sharing this group nest under one parent |
| `rows[i].name` | string | Yes | Area name (required per row) |
| `rows[i].rate` | string\|number | No | Shipping rate; non-numeric chars (e.g., "KSh 500", "1,200") are stripped |
| `rows[i].free_over` | string\|number | No | Free shipping threshold |
| `rows[i].eta_days` | string\|number | No | Estimated delivery days |
| `replace` | boolean | No | If true, delete all existing areas in the zone first (default false) |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "created": 3,
    "updated": 0,
    "skipped": 0,
    "errors": []
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `created` | integer | Number of new areas inserted |
| `updated` | integer | Number of existing areas updated (matched on slug within parent) |
| `skipped` | integer | Number of rows skipped (errors) |
| `errors` | array | Up to 25 errors; each has `row` (1-indexed) and `reason` |

**When All Rows Succeed:**

```json
{
  "status": "success",
  "data": {
    "created": 10,
    "updated": 5,
    "skipped": 0,
    "errors": []
  }
}
```

**When Some Rows Fail:**

```json
{
  "status": "success",
  "data": {
    "created": 8,
    "updated": 5,
    "skipped": 2,
    "errors": [
      { "row": 3, "reason": "missing name" },
      { "row": 15, "reason": "insert failed" }
    ]
  }
}
```

**Parsing Quirks:**
- Non-numeric characters in rate/free_over (e.g., "KSh 500", "1,200") are stripped; only digits and dots remain.
- Empty `group` or null `group` places the area at the top level (no parent).
- Slug matching is case-insensitive and normalized (punctuation removed), so "Lang'ata" and "LANGATA" map to the same slug.

**Common Workflow:**
1. Courier sends a new price list (spreadsheet, email).
2. Copy/export the relevant columns into a JSON array of rows.
3. Call this endpoint with `replace: false` to merge the new rates into existing areas.
4. Optionally set `replace: true` to clear old structure and replace it entirely (useful when reorganizing corridors).

---

## Shipments

Track orders through the shipping process.

### GET /shipping/shipments - List Shipments

Retrieve all shipments with optional filtering by status and search.

**Auth:** Admin session

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Results per page (default: 50) |
| `status` | string | Filter by status: `pending`, `in_transit`, `delivered`, or `failed` |
| `search` | string | Search by tracking number or order number |

**Example Request:**
```bash
curl -X GET "https://your-store-api.example.com/api/v1/shipping/shipments?page=1&limit=20&status=in_transit"
```

**Example Response (200):**
```json
{
  "status": "success",
  "data": {
    "shipments": [
      {
        "id": "ship_abc123",
        "order_id": 42,
        "tracking_number": "TRK1234567890",
        "carrier": "Convenient Couriers",
        "status": "in_transit",
        "external_id": null,
        "external_status": null,
        "external_data": null,
        "created_at": "2024-09-20T08:00:00Z",
        "updated_at": "2024-09-20T08:00:00Z",
        "order": {
          "id": 42,
          "order_number": "ORD-000042"
        }
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

---

### GET /shipping/shipments/:id - Get Shipment

Retrieve a single shipment with tracking details and associated order.

**Auth:** Admin session

**Example Request:**
```bash
curl -X GET "https://your-store-api.example.com/api/v1/shipping/shipments/ship_abc123"
```

**Example Response (200):**
```json
{
  "status": "success",
  "data": {
    "shipment": {
      "id": "ship_abc123",
      "order_id": 42,
      "tracking_number": "TRK1234567890",
      "carrier": "Convenient Couriers",
      "status": "in_transit",
      "external_id": null,
      "external_status": null,
      "external_data": null,
      "created_at": "2024-09-20T08:00:00Z",
      "updated_at": "2024-09-20T08:00:00Z",
      "order": {
        "id": 42,
        "order_number": "ORD-000042"
      }
    }
  }
}
```

**Error Responses:**
- 404: Shipment not found

---

## Distance-Based Shipping (Convenient Couriers)

Configure distance-based shipping using Google Maps (Distance Matrix API). Charges are calculated based on the distance from your store to the delivery address.

### GET /shipping/distance-based-shipping - Get Distance-Based Shipping Config

Retrieve the distance-based shipping configuration (rate bands, API keys masked).

**Auth:** Admin session

**Example Request:**
```bash
curl -X GET "https://your-store-api.example.com/api/v1/shipping/distance-based-shipping"
```

**Example Response (200):**
```json
{
  "status": "success",
  "data": {
    "config": {
      "enabled": true,
      "rate_bands": [
        { "min_km": 0, "max_km": 5, "price": 200 },
        { "min_km": 6, "max_km": 10, "price": 250 },
        { "min_km": 11, "max_km": 20, "price": 380 },
        { "min_km": 21, "max_km": null, "price": 500 }
      ],
      "distance_api_key": "••••••••",
      "distance_browser_api_key": "AIzaSy...",
      "distance_calculation_method": "google_maps",
      "beyond_max_band_per_km": 30,
      "default_origin_latitude": -1.286389,
      "default_origin_longitude": 36.817223,
      "default_origin_place_id": "ChIJ0Z9...",
      "nairobi_county_name": "Nairobi"
    }
  }
}
```

**Key Fields:**
- `distance_api_key`: Server-side Google Maps API key, always masked on read. Use the update endpoint to set it.
- `distance_browser_api_key`: Referrer-restricted browser key, safe to expose to storefronts.
- `distance_calculation_method`: `haversine` (fast, approximates distance) or `google_maps` (accurate, uses Distance Matrix API)
- `rate_bands`: Array of price bands by distance. Bands should cover 0 to max, then one open-ended entry for overflow.
- `beyond_max_band_per_km`: Per-km charge (KES/km) for distances beyond the highest band.
- `default_origin_*`: Fallback location for shipping quotes when no branch is selected or the branch has no coordinates.

---

### PUT /shipping/distance-based-shipping - Update Distance-Based Shipping Config

Update distance-based shipping settings. Omit `distance_api_key` to keep the existing one (returned masked on read).

**Auth:** Admin session

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `enabled` | boolean | No | Activate/deactivate distance-based shipping |
| `rate_bands` | array | No | Distance-based price bands |
| `distance_api_key` | string | No | Google Maps API key (server-side, write-only; returned masked on read) |
| `distance_browser_api_key` | string | No | Referrer-restricted browser Maps key |
| `distance_calculation_method` | string | No | `haversine` or `google_maps` |
| `beyond_max_band_per_km` | number | No | Rate (KES/km) for distances beyond the highest band |
| `default_origin_latitude` | number | No | Default origin latitude |
| `default_origin_longitude` | number | No | Default origin longitude |
| `default_origin_place_id` | string | No | Google Place ID for the default origin (preferred over lat/lng) |
| `nairobi_county_name` | string | No | County name matcher for Nairobi addresses |

**Rate Band Structure:**
```json
{
  "min_km": 0,
  "max_km": 5,
  "price": 200
}
```

**Example Request:**
```bash
curl -X PUT "https://your-store-api.example.com/api/v1/shipping/distance-based-shipping" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "distance_calculation_method": "google_maps",
    "distance_api_key": "AIzaSyA...",
    "distance_browser_api_key": "AIzaSyB...",
    "rate_bands": [
      { "min_km": 0, "max_km": 5, "price": 200 },
      { "min_km": 6, "max_km": 10, "price": 250 },
      { "min_km": 11, "max_km": 20, "price": 380 },
      { "min_km": 21, "max_km": 999999, "price": 500 }
    ],
    "beyond_max_band_per_km": 30,
    "default_origin_latitude": -1.286389,
    "default_origin_longitude": 36.817223
  }'
```

**Example Response (200):**
```json
{
  "status": "success",
  "data": {
    "config": {
      "enabled": true,
      "distance_api_key": "••••••••",
      "distance_browser_api_key": "AIzaSyB...",
      "rate_bands": [...]
    }
  }
}
```

**Gotchas:**
- When you omit `distance_api_key`, the existing key is kept. If there's no existing key and you omit the field, it remains empty.
- The masked key `••••••••` is returned on read; do not send this masked value back on update (the endpoint detects it and preserves the old key instead).

---

### GET /shipping/convenient-couriers - Get Convenient Couriers Config

Alias for GET /shipping/distance-based-shipping. Maintained for backward compatibility.

**Auth:** Admin session

**Response:** Same as distance-based-shipping config.

---

### PUT /shipping/convenient-couriers - Update Convenient Couriers Config

Alias for PUT /shipping/distance-based-shipping. Maintained for backward compatibility.

**Auth:** Admin session

**Request & Response:** Same as distance-based-shipping config update.
