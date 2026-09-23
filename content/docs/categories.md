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

### POST /categories/:id/generate-seo - Generate SEO Metadata Draft

Generate AI-powered SEO title and description for a single category. Returns suggestions for admin review without saving changes to the database.

**Auth:** Admin session or API key

```bash
curl -X POST "https://your-store-api.example.com/api/v1/categories/5/generate-seo" \
  -H "X-API-Key: sk_abc123"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "seo_title": "Premium Flour for Baking | Your Store",
    "seo_description": "High-quality wheat and specialty flours. Perfect for bread, pastries, and cakes. Free shipping on orders over 1000 KES."
  }
}
```

**Gotchas:**
- Does not save the generated metadata — review it in the admin UI and save manually if desired.
- Returns 404 if the category does not exist.
- Returns 500 if no AI provider is configured in Settings > Advanced.

### POST /categories/bulk-generate-seo - Bulk Generate SEO in Background

Queue a background job to generate and persist SEO metadata for multiple categories. Use mode `auto` to target only categories without SEO descriptions, or mode `manual` to specify exact category IDs.

**Auth:** Admin session or API key

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `category_ids` | array of integers | No (required if mode=manual) | Category IDs to process |
| `mode` | string | No | `auto` or `manual`; default is `manual` |
| `overwrite` | boolean | No | If true, update categories that already have SEO descriptions; if false, skip them |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/categories/bulk-generate-seo" \
  -H "X-API-Key: sk_abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "category_ids": [1, 2, 5],
    "mode": "manual",
    "overwrite": false
  }'
```

**Response (202):**

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "task_xyz789",
      "status": "queued",
      "progress": 0
    },
    "job_id": "task_xyz789",
    "count": 3,
    "message": "Category SEO generation started in background"
  }
}
```

**Gotchas:**
- Returns 202 (Accepted), not 200 — the job runs asynchronously in the background.
- Returns 400 if no categories match (e.g., mode=auto with all categories already having SEO descriptions).
- Track progress via Settings > Advanced > Background Tasks using the returned `job_id`.

### GET /categories/:id/branches - Get Branch Availability

Fetch the branch-level availability status for a category. When a category is disabled on a branch, it is hidden from that branch's storefront catalog.

**Auth:** Admin session or API key

```bash
curl "https://your-store-api.example.com/api/v1/categories/5/branches" \
  -H "X-API-Key: sk_abc123"
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Branch ID |
| `name` | string | Branch name |
| `city` | string or null | City where branch operates |
| `branch_code` | string or null | Internal branch code |
| `is_disabled` | boolean | When `true`, this category does not appear on this branch's storefront |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "branches": [
      {
        "id": 1,
        "name": "Main Store",
        "city": "Nairobi",
        "branch_code": "HQ",
        "is_disabled": false
      },
      {
        "id": 2,
        "name": "Westlands Outlet",
        "city": "Nairobi",
        "branch_code": "WES",
        "is_disabled": true
      }
    ]
  }
}
```

**Gotchas:**
- Returns only **active** branches; disabled branches are excluded.
- All branches have `is_disabled: false` by default — use PUT to disable a category on specific branches.

### PUT /categories/:id/branches - Set Branch Availability

Control which branches should not display this category. Submit an empty array to make the category visible on all branches.

**Auth:** Admin session or API key

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `disabled_branch_ids` | array of integers | No | Branch IDs where this category should be hidden. Omitted or empty array = visible on all branches |

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/categories/5/branches" \
  -H "X-API-Key: sk_abc123" \
  -H "Content-Type: application/json" \
  -d '{
    "disabled_branch_ids": [2]
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "disabled_branch_ids": [2]
  }
}
```

**Gotchas:**
- Replaces the entire disabled list — does not merge with existing settings.
- Invalid branch IDs are silently filtered out; the endpoint returns 200 even if no valid branches were provided.
- Storefront catalog queries respect this setting and exclude disabled categories per branch.

---

