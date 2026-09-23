Attributes define the properties (size, color, weight, etc.) that distinguish product variants, allowing storefront visitors to filter and select specific product options. Tags are free-form labels for organizing and categorizing products by theme, promotion, or any merchant-defined category.

Both modules support admin session or API key authentication. Use attributes to build complex product variations, and tags to organize your catalog by marketing campaigns, seasons, or custom groupings.

---

## Attributes

Attributes are product properties that buyers can use to filter or select variants. Each attribute has a name, optional slug, type, and a list of values (options). Attributes can be marked as filterable so they appear in storefront filter widgets.

### GET /attributes - List Attributes

Retrieve all attributes with optional search filtering.

**Auth:** API key or admin session

**Query Parameters:**

| Parameter | Type | Description |
| --- | --- | --- |
| `search` | string | Optional. Filter by attribute name or slug |

```bash
curl -X GET "https://your-store-api.example.com/api/v1/attributes?search=size" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "attributes": [
      {
        "id": 1,
        "name": "Size",
        "slug": "size",
        "type": "text",
        "is_filterable": true,
        "filter_sort_order": 1,
        "created_at": "2026-01-15T10:00:00.000Z",
        "updated_at": "2026-01-15T10:00:00.000Z",
        "values": [
          {
            "id": 10,
            "attribute_id": 1,
            "value": "Small",
            "created_at": "2026-01-15T10:01:00.000Z",
            "updated_at": "2026-01-15T10:01:00.000Z"
          },
          {
            "id": 11,
            "attribute_id": 1,
            "value": "Medium",
            "created_at": "2026-01-15T10:02:00.000Z",
            "updated_at": "2026-01-15T10:02:00.000Z"
          }
        ]
      }
    ]
  }
}
```

Attributes include nested `values` array listing all available options for that attribute.

---

### POST /attributes - Create Attribute

Create a new attribute (e.g. "Color", "Weight").

**Auth:** API key or admin session

**Request Body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `name` | string | Yes | Attribute name (e.g., "Size") |
| `slug` | string | No | URL-safe slug; auto-generated if omitted |
| `type` | string | No | Attribute type (default: "text") |
| `is_filterable` | boolean | No | Show this attribute in storefront filters (default: false) |
| `filter_sort_order` | integer | No | Order in the storefront filter UI (default: 0) |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/attributes" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Color",
    "slug": "color",
    "is_filterable": true,
    "filter_sort_order": 2
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "attribute": {
      "id": 2,
      "name": "Color",
      "slug": "color",
      "type": "text",
      "is_filterable": true,
      "filter_sort_order": 2,
      "created_at": "2026-01-15T10:00:00.000Z",
      "updated_at": "2026-01-15T10:00:00.000Z"
    }
  }
}
```

**Gotchas:**
- `name` is required; omitting it returns a 400.
- `slug` must be unique across attributes. If you provide a duplicate, the database constraint fails (500).
- `filter_sort_order` is used by storefronts to order filter options in the UI — lower numbers appear first.

---

### PUT /attributes/:id - Update Attribute

Modify an attribute's name, slug, type, or filter settings.

**Auth:** API key or admin session

**Path Parameters:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer | Yes | Attribute ID |

**Request Body:** Any of the fields from POST (name, slug, type, is_filterable, filter_sort_order).

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/attributes/2" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "is_filterable": false,
    "filter_sort_order": 0
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "attribute": {
      "id": 2,
      "name": "Color",
      "slug": "color",
      "type": "text",
      "is_filterable": false,
      "filter_sort_order": 0,
      "created_at": "2026-01-15T10:00:00.000Z",
      "updated_at": "2026-01-15T10:00:00.000Z"
    }
  }
}
```

**Error Cases:**
- `id` <= 0 or non-numeric returns 400.
- Non-existent `id` returns 404.

---

### POST /attributes/:id/values - Create Attribute Value

Add a new value (option) to an attribute.

**Auth:** API key or admin session

**Path Parameters:**

| Parameter | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | integer | Yes | Attribute ID |

**Request Body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `value` | string | Yes | The option text (e.g., "Red", "Large") |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/attributes/2/values" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "value": "Red"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "value": {
      "id": 25,
      "attribute_id": 2,
      "value": "Red",
      "created_at": "2026-01-15T10:03:00.000Z",
      "updated_at": "2026-01-15T10:03:00.000Z"
    }
  }
}
```

**Gotchas:**
- `value` is required.
- Duplicate values for the same attribute are allowed (no uniqueness constraint per attribute).
- Values are displayed in the order they were created on storefronts.

---

## Tags

Tags are free-form labels for organizing and categorizing products. Each tag has a name, optional slug, optional color (hex format), and optional description. Tags are used for filtering, promotion grouping, and storefront organization.

### GET /tags - List Tags

Retrieve all tags in your store, optionally filtered by search term. Results are ordered alphabetically by name.

**Auth:** Admin session only

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `search` | string | No | Filter tags by name or slug (case-insensitive partial match) |

**Example Request:**

```bash
curl -X GET "https://your-store-api.example.com/api/v1/tags?search=sale" \
  -H "Cookie: sessionId=YOUR_SESSION_ID"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "tags": [
      {
        "id": 1,
        "name": "Summer Sale",
        "slug": "summer-sale",
        "color": "#FF6B6B",
        "description": "Products on summer promotion",
        "created_at": "2026-01-15T10:00:00.000Z",
        "updated_at": "2026-01-15T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Flash Sale",
        "slug": "flash-sale",
        "color": "#FFD93D",
        "description": "Limited-time flash sale items",
        "created_at": "2026-02-01T14:30:00.000Z",
        "updated_at": "2026-02-01T14:30:00.000Z"
      }
    ]
  }
}
```

**Errors:**
- 401: Not authenticated (missing session)

---

### POST /tags - Create Tag

Create a new tag. The `slug` field must be unique across all tags.

**Auth:** Admin session only

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Display name (e.g., "Summer Sale", "New Arrival") |
| `slug` | string | No | URL-friendly slug; auto-generated from name if omitted |
| `color` | string | No | Hex color code (e.g., "#FF6B6B", "#FFD93D") for storefront display |
| `description` | string | No | Optional description explaining the tag's purpose |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/tags" \
  -H "Cookie: sessionId=YOUR_SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Best Seller",
    "slug": "best-seller",
    "color": "#4ECDC4",
    "description": "Our most popular products"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "tag": {
      "id": 3,
      "name": "Best Seller",
      "slug": "best-seller",
      "color": "#4ECDC4",
      "description": "Our most popular products",
      "created_at": "2026-03-10T09:15:00.000Z",
      "updated_at": "2026-03-10T09:15:00.000Z"
    }
  }
}
```

**Errors:**
- 400: Validation error (e.g., duplicate slug, invalid color format)
- 401: Not authenticated

**Gotchas:**
- Changing a tag's slug does not automatically update product associations.
- The color field is passed through to storefront themes; ensure it's a valid hex color.

---

### PUT /tags/:id - Update Tag

Update an existing tag's name, slug, color, or description.

**Auth:** Admin session only

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Tag ID |

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | New display name |
| `slug` | string | No | New slug (must remain unique) |
| `color` | string | No | New hex color code |
| `description` | string | No | New description |

**Example Request:**

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/tags/3" \
  -H "Cookie: sessionId=YOUR_SESSION_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bestselling Items",
    "color": "#1ABC9C"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "tag": {
      "id": 3,
      "name": "Bestselling Items",
      "slug": "best-seller",
      "color": "#1ABC9C",
      "description": "Our most popular products",
      "created_at": "2026-03-10T09:15:00.000Z",
      "updated_at": "2026-03-10T11:22:00.000Z"
    }
  }
}
```

**Errors:**
- 404: Tag not found
- 400: Validation error (e.g., slug already in use)
- 401: Not authenticated

---

### DELETE /tags/:id - Delete Tag

Remove a tag from your store. This does not affect products tagged with this tag; their tag associations are preserved.

**Auth:** Admin session only

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Tag ID |

**Example Request:**

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/tags/3" \
  -H "Cookie: sessionId=YOUR_SESSION_ID"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Tag deleted"
}
```

**Errors:**
- 404: Tag not found
- 401: Not authenticated

**Gotchas:**
- Deleting a tag does not cascade; products retain their internal tag associations even after the tag is deleted.
- Use the product endpoints to re-tag products after deleting a tag if necessary.
