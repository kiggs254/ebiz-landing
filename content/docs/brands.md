## 9. Brands API

Brands can be listed, retrieved by ID, created, updated, and deleted using the same API key authentication.

### GET /brands - List Brands

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Optional. Search by name or slug |

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/brands" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "brands": [
      {
        "id": 1,
        "name": "Organic Co",
        "slug": "organic-co",
        "created_at": "2026-01-15T10:00:00.000Z",
        "updated_at": "2026-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

### GET /brands/:id - Get Single Brand

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/brands/1" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):** Returns `{ "status": "success", "data": { "brand": { ... } } }`.

### POST /brands - Create Brand

Send a JSON body with `name`, `slug` (optional). Same Basic Auth.

### PUT /brands/:id - Update Brand

Send a JSON body with fields to update. Same Basic Auth.

### DELETE /brands/:id - Delete Brand

**Example Request:**

```bash
curl -X DELETE "https://your-store.com/api/v1/brands/1" \
  -u "ck_xxx:cs_yyy"
```

---

