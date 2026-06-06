## 8. Categories API

Categories can be listed, retrieved by ID, created, updated, and deleted using the same API key authentication as Products and Orders.

### GET /categories - List Categories

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Optional. Search by name, slug, or description |

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/categories" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Flour",
        "slug": "flour",
        "description": "Flour and baking",
        "parent_id": null,
        "created_at": "2026-01-15T10:00:00.000Z",
        "updated_at": "2026-01-15T10:00:00.000Z"
      }
    ]
  }
}
```

### GET /categories/:id - Get Single Category

**Example Request:**

```bash
curl -X GET "https://your-store.com/api/v1/categories/1" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):** Returns `{ "status": "success", "data": { "category": { ... } } }` with optional `children` and `parent` associations.

### POST /categories - Create Category

Send a JSON body with `name`, `slug` (optional), `description` (optional), `parent_id` (optional). Same Basic Auth as above.

### PUT /categories/:id - Update Category

Send a JSON body with fields to update. Same Basic Auth.

### DELETE /categories/:id - Delete Category

**Example Request:**

```bash
curl -X DELETE "https://your-store.com/api/v1/categories/1" \
  -u "ck_xxx:cs_yyy"
```

---

