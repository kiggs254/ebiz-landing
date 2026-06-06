## 12. Branches API

> **Note:** The Branches API is not available on the Home Chef deployment.

Branches allow multi-location management. Each branch can have its own integrations, and orders/products can be scoped to a specific branch.

### Branch Scoping

Include the `X-Branch-Id` header on any API request to scope it to a specific branch:

```bash
curl -X GET "https://your-store.com/api/v1/products" \
  -u "ck_xxx:cs_yyy" \
  -H "X-Branch-Id: 2"
```

When the `X-Branch-Id` header is present, the API filters results to that branch and associates newly created resources with it.

### GET /branches - List Branches

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/branches" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "branches": [
      {
        "id": 1,
        "name": "Main Store",
        "code": "MAIN",
        "address": "123 Main St, Nairobi",
        "phone": "+254700000000",
        "is_active": true,
        "created_at": "2026-01-15T10:00:00.000Z",
        "updated_at": "2026-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

### POST /branches - Create Branch

**Request Body:**

```json
{
  "name": "Downtown Branch",
  "code": "DT",
  "address": "456 Downtown Ave, Nairobi",
  "phone": "+254711111111",
  "is_active": true
}
```

**Example Request:**

```bash
curl -X POST "https://your-store.com/api/v1/branches" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Branch",
    "code": "DT",
    "address": "456 Downtown Ave, Nairobi",
    "phone": "+254711111111",
    "is_active": true
  }'
```

### GET /branches/:id - Get Single Branch

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/branches/1" \
  -u "ck_xxx:cs_yyy"
```

### PUT /branches/:id - Update Branch

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/branches/1" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Main Store (Updated)",
    "address": "789 New St, Nairobi"
  }'
```

### DELETE /branches/:id - Delete Branch

**Example Request:**

```bash
curl -X DELETE "https://your-store.com/api/v1/branches/1" \
  -u "ck_xxx:cs_yyy"
```

### GET /branches/:id/integrations - List Branch Integrations

Returns all integration configurations for a specific branch.

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/branches/1/integrations" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "integrations": [
      {
        "key": "woocommerce",
        "enabled": true,
        "config": {
          "store_url": "https://branch-store.example.com",
          "consumer_key": "ck_...",
          "consumer_secret": "cs_..."
        }
      }
    ]
  }
}
```

### PUT /branches/:id/integrations/:key - Update Branch Integration

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/branches/1/integrations/woocommerce" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "config": {
      "store_url": "https://branch-store.example.com",
      "consumer_key": "ck_new_key",
      "consumer_secret": "cs_new_secret"
    }
  }'
```

---

