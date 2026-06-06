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

