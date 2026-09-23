Semantic product search powered by AI embeddings and reranking. The AI Search module provides intelligent search capabilities with query expansion via synonyms, analytics, and circuit-breaker protection for reliability. All endpoints are gated by the **AI Search addon** — they return `503 Service Unavailable` when the addon is switched off.

**Base path:** `/api/v1/ai-search`

**Auth:** Admin session only (cookie-based authentication).

**Addon:** AI Search — gated by the `ai_search_addon_enabled` setting. When disabled, this module is not accessible.

---

## Configuration

### GET /ai-search/config - Get AI Search configuration

Retrieve current AI Search settings, including enabled providers (text embeddings, reranker, image, query parser), model names, and dimension info. Masked secret fields return a masked value with the last 4 characters visible, and a `secretSet` boolean map indicates which secrets have been configured.

**Auth:** Admin session only

```bash
curl -X GET "https://your-store-api.example.com/api/v1/ai-search/config" \
  --cookie "session_id=your_session_id"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "config": {
      "ai_search_addon_enabled": "true",
      "ai_search_embedding_provider": "openai",
      "ai_search_embedding_model": "text-embedding-3-small",
      "ai_search_reranker_enabled": "true",
      "ai_search_reranker_api_key": "••••••••xxxx"
    },
    "secretSet": {
      "ai_search_reranker_api_key": true
    },
    "catalog": {
      "bools": ["ai_search_addon_enabled", "ai_search_reranker_enabled", "..."],
      "strings": ["ai_search_embedding_provider", "ai_search_embedding_model", "..."],
      "numerics": ["ai_search_rerank_top_k", "..."],
      "providers": {
        "text": ["openai", "voyage", "cohere", "ollama"],
        "reranker": ["cohere", "bge"],
        "image": ["replicate", "ollama"],
        "queryParser": ["openai", "anthropic"]
      },
      "modelHints": {
        "openai": ["text-embedding-3-small", "text-embedding-3-large"],
        "voyage": ["voyage-3", "voyage-3-lite"]
      }
    }
  }
}
```

**Permissions:** `ai.view`

**Status codes:**
- `200` — Configuration retrieved
- `401` — Unauthorized
- `403` — Insufficient permissions
- `503` — AI Search addon is disabled

**Gotchas:**
- Secret fields (e.g., API keys) are masked on read; use the `secretSet` boolean to know whether a value is configured.
- When round-tripping config, sending back a masked value (e.g., "••••••••XXXX") is treated as "unchanged" and does not overwrite the stored key.

---

### PUT /ai-search/config - Update AI Search configuration

Partially update AI Search settings. Only allowlisted keys are accepted; unknown keys are silently ignored. Secret fields containing the masked prefix (e.g., "••••••••") are treated as unchanged.

**Auth:** Admin session only

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/ai-search/config" \
  --cookie "session_id=your_session_id" \
  -H "Content-Type: application/json" \
  -d '{
    "ai_search_addon_enabled": "true",
    "ai_search_embedding_provider": "openai",
    "ai_search_embedding_model": "text-embedding-3-small",
    "ai_search_reranker_api_key": "cohere_api_key_here"
  }'
```

**Response (200):**

```json
{
  "status": "success",
  "message": "AI search configuration updated"
}
```

**Permissions:** `ai.manage`

**Status codes:**
- `200` — Configuration updated
- `400` — Invalid request body (must be an object)
- `401` — Unauthorized
- `403` — Insufficient permissions
- `503` — AI Search addon is disabled

---

## Monitoring & Reindexing

### GET /ai-search/stats - Get AI Search statistics

Queue and coverage snapshot: pending/running/done/failed embedding jobs, current coverage percentage, product count, and pgvector extension status.

**Auth:** Admin session only

```bash
curl -X GET "https://your-store-api.example.com/api/v1/ai-search/stats" \
  --cookie "session_id=your_session_id"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "pgvector": true,
    "provider": "openai",
    "model": "text-embedding-3-small",
    "dims": 1536,
    "reranker_enabled": true,
    "image_enabled": false,
    "queue": {
      "pending": 5,
      "running": 1,
      "done": 234,
      "failed": 2,
      "total": 242,
      "coverage": 96.7,
      "products": 242
    }
  }
}
```

**Permissions:** `ai.view`

**Status codes:**
- `200` — Stats retrieved
- `401` — Unauthorized
- `403` — Insufficient permissions
- `503` — AI Search addon is disabled

---

### POST /ai-search/reindex - Enqueue bulk reindex

Kick off a background reindex job for all products or only those with failed embeddings. Returns HTTP 202 Accepted.

**Auth:** Admin session only

```bash
curl -X POST "https://your-store-api.example.com/api/v1/ai-search/reindex" \
  --cookie "session_id=your_session_id" \
  -H "Content-Type: application/json" \
  -d '{ "scope": "all" }'
```

**Request body:**

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | string | `failed` | `all` to reindex all products, `failed` to reindex only those with failed embeddings |

**Response (202):**

```json
{
  "status": "success",
  "data": {
    "scope": "all",
    "queued": 234
  }
}
```

**Permissions:** `ai.manage`

**Status codes:**
- `202` — Reindex job enqueued
- `400` — Unknown scope (use "all" or "failed")
- `401` — Unauthorized
- `403` — Insufficient permissions
- `503` — AI Search addon is disabled

**Gotchas:**
- The returned `queued` count is approximate; the actual job may process fewer items if products are deleted mid-reindex.

---

### GET /ai-search/analytics - Get search analytics

Top queries, zero-result queries, and latency percentiles (p50/p90/p99) over a configurable period. Query analytics are sampled in production; admin test searches are always logged.

**Auth:** Admin session only

```bash
curl -X GET "https://your-store-api.example.com/api/v1/ai-search/analytics?days=7" \
  --cookie "session_id=your_session_id"
```

**Query parameters:**

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `days` | integer | `7` | Period in days (1–90) |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "days": 7,
    "top_queries": [
      {
        "query": "shoes",
        "count": 134,
        "clicks": 89,
        "ctr": 66.4,
        "avg_results": 12.3
      }
    ],
    "zero_result_queries": [
      {
        "query": "xyz brand",
        "count": 3
      }
    ],
    "latency": {
      "p50": 45,
      "p90": 120,
      "p99": 340,
      "total": 2150
    }
  }
}
```

**Permissions:** `ai.view`

**Status codes:**
- `200` — Analytics retrieved
- `401` — Unauthorized
- `403` — Insufficient permissions
- `503` — AI Search addon is disabled

**Gotchas:**
- Zero-result queries identify search terms with no matching products — useful for spotting catalog gaps or common misspellings.
- Latency is measured end-to-end on the server; actual user latency includes network and rendering.

---

## Testing

### POST /ai-search/test-search - Test search query

Run a query through the live hybrid (semantic + keyword) search pipeline. Always logs the query to analytics so the test immediately appears on the Analytics tab. Useful for verifying search results in the admin before exposing the feature to customers.

**Auth:** Admin session only

```bash
curl -X POST "https://your-store-api.example.com/api/v1/ai-search/test-search" \
  --cookie "session_id=your_session_id" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "light running shoes",
    "limit": 10,
    "category_slug": "footwear",
    "debug": false
  }'
```

**Request body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `query` | string | Yes | Search query |
| `limit` | integer | No | Results per page (default 10, max 24) |
| `category_slug` | string | No | Restrict results to a category |
| `debug` | boolean | No | Include debug information in response |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "query": "light running shoes",
    "total": 18,
    "fallback": false,
    "relaxed": false,
    "timing": {
      "ms_total": 95,
      "ms_embed": 12,
      "ms_search": 68,
      "ms_rerank": 15
    },
    "products": [
      {
        "id": 412,
        "name": "Ultra Light Runner Pro",
        "sku": "ULR-001",
        "slug": "ultra-light-runner-pro",
        "price": "89.99",
        "sale_price": "69.99",
        "status": "active"
      }
    ]
  }
}
```

**Permissions:** `ai.view`

**Status codes:**
- `200` — Search completed
- `400` — Missing `query` parameter
- `401` — Unauthorized
- `403` — Insufficient permissions
- `503` — AI Search addon is disabled

**Gotchas:**
- `fallback: true` means the search had to fall back to keyword-only matching (semantic search unavailable).
- `relaxed: true` means the query was simplified or expanded to get results.
- `enabled: false` indicates the AI Search feature is not operational; the response will have an empty product list.

---

## Search Synonyms

Synonyms expand search queries to include related terms, improving discoverability. The system supports both global (across all shops) and shop-specific synonyms.

### GET /ai-search/synonyms - List synonyms

Retrieve search synonyms. Filter by scope (global defaults, shop-specific, or both).

**Auth:** Admin session only

```bash
curl -X GET "https://your-store-api.example.com/api/v1/ai-search/synonyms?scope=all" \
  --cookie "session_id=your_session_id"
```

**Query parameters:**

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `scope` | string | `all` | `all`, `global`, or `shop` |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "synonyms": [
      {
        "id": 1,
        "shop_id": null,
        "term": "phone",
        "expansion": ["smartphone", "mobile"],
        "scope": "global"
      },
      {
        "id": 12,
        "shop_id": 1,
        "term": "organic",
        "expansion": ["bio", "natural", "pesticide-free"],
        "scope": "shop"
      }
    ]
  }
}
```

**Permissions:** `ai.view`

**Status codes:**
- `200` — Synonyms retrieved
- `401` — Unauthorized
- `403` — Insufficient permissions
- `503` — AI Search addon is disabled

---

### POST /ai-search/synonyms - Create synonym

Add a new search synonym. Term must be unique within the scope (global or shop-specific).

**Auth:** Admin session only

```bash
curl -X POST "https://your-store-api.example.com/api/v1/ai-search/synonyms" \
  --cookie "session_id=your_session_id" \
  -H "Content-Type: application/json" \
  -d '{
    "term": "trainers",
    "expansion": ["sneakers", "athletic shoes", "running shoes"],
    "scope": "shop"
  }'
```

**Request body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `term` | string | Yes | Search term (max 120 chars) |
| `expansion` | array | Yes | Non-empty array of expansion words/phrases |
| `scope` | string | No | `global` or `shop` (default `shop`) |

**Response (201):**

```json
{
  "status": "success",
  "data": {
    "synonym": {
      "id": 45,
      "shop_id": 1,
      "term": "trainers",
      "expansion": ["sneakers", "athletic shoes", "running shoes"],
      "scope": "shop"
    }
  }
}
```

**Permissions:** `ai.manage`

**Status codes:**
- `201` — Synonym created
- `400` — Missing required fields or empty expansion
- `401` — Unauthorized
- `403` — Insufficient permissions
- `409` — Term already exists in this scope
- `503` — AI Search addon is disabled

---

### PUT /ai-search/synonyms/:id - Update synonym

Modify a synonym's term and/or expansion list.

**Auth:** Admin session only

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/ai-search/synonyms/45" \
  --cookie "session_id=your_session_id" \
  -H "Content-Type: application/json" \
  -d '{
    "expansion": ["sneakers", "athletic shoes", "sports shoes", "kicks"]
  }'
```

**Request body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `term` | string | No | New term (max 120 chars) |
| `expansion` | array | No | New expansion list |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "synonym": {
      "id": 45,
      "shop_id": 1,
      "term": "trainers",
      "expansion": ["sneakers", "athletic shoes", "sports shoes", "kicks"],
      "scope": "shop"
    }
  }
}
```

**Permissions:** `ai.manage`

**Status codes:**
- `200` — Synonym updated
- `401` — Unauthorized
- `403` — Insufficient permissions
- `404` — Synonym not found
- `503` — AI Search addon is disabled

---

### DELETE /ai-search/synonyms/:id - Delete synonym

Remove a synonym from the dictionary.

**Auth:** Admin session only

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/ai-search/synonyms/45" \
  --cookie "session_id=your_session_id"
```

**Response (200):**

```json
{
  "status": "success",
  "message": "deleted"
}
```

**Permissions:** `ai.manage`

**Status codes:**
- `200` — Synonym deleted
- `401` — Unauthorized
- `403` — Insufficient permissions
- `404` — Synonym not found
- `503` — AI Search addon is disabled

---

### POST /ai-search/synonyms/import - Bulk import synonyms

Import synonyms from CSV text. Format: one row per synonym, `term,expansion1|expansion2|expansion3`. Duplicate terms are skipped; failures on individual rows do not abort the entire import.

**Auth:** Admin session only

```bash
curl -X POST "https://your-store-api.example.com/api/v1/ai-search/synonyms/import" \
  --cookie "session_id=your_session_id" \
  -H "Content-Type: application/json" \
  -d '{
    "csv": "phone,smartphone|mobile\ntv,television\nfridge,refrigerator"
  }'
```

**Request body:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `csv` | string | Yes | CSV lines (format: `term,expansion1\|expansion2\|expansion3`) |

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "inserted": 3,
    "skipped": 0
  }
}
```

**Permissions:** `ai.manage`

**Status codes:**
- `200` — Import completed
- `400` — Missing CSV body
- `401` — Unauthorized
- `403` — Insufficient permissions
- `503` — AI Search addon is disabled

**Gotchas:**
- Empty lines and rows with missing term or expansion are skipped (counted in `skipped`).
- Expansion entries are split by `|`; whitespace is trimmed.
- Duplicate terms in the shop scope are silently skipped.

---

### POST /ai-search/synonyms/seed-defaults - Seed default synonyms

Populate the global synonym dictionary with conservative defaults (brand/generic pairs like "phone↔smartphone", "fridge↔refrigerator"). Only seeds when the table is empty; existing rows are never overwritten.

**Auth:** Admin session only

```bash
curl -X POST "https://your-store-api.example.com/api/v1/ai-search/synonyms/seed-defaults" \
  --cookie "session_id=your_session_id"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "seeded": 18,
    "note": null
  }
}
```

Or if already seeded:

```json
{
  "status": "success",
  "data": {
    "seeded": 0,
    "note": "global dictionary already populated; nothing inserted"
  }
}
```

**Permissions:** `ai.manage`

**Status codes:**
- `200` — Seeding completed (or already seeded)
- `401` — Unauthorized
- `403` — Insufficient permissions
- `503` — AI Search addon is disabled

---

## Circuit Breaker

The circuit breaker prevents hammering a broken reranker service. Tracks failures and temporarily stops requests when the failure rate exceeds a threshold.

### GET /ai-search/breaker - Get circuit breaker status

Read the circuit breaker state for the reranker (Cohere). Shows whether the breaker is open (failures detected), half-open (recovering), or closed (healthy).

**Auth:** Admin session only

```bash
curl -X GET "https://your-store-api.example.com/api/v1/ai-search/breaker" \
  --cookie "session_id=your_session_id"
```

**Response (200):**

```json
{
  "status": "success",
  "data": {
    "open": false,
    "failures": 0,
    "cooldownRemainingMs": 0
  }
}
```

**Permissions:** `ai.view`

**Status codes:**
- `200` — Breaker status retrieved
- `401` — Unauthorized
- `403` — Insufficient permissions
- `503` — AI Search addon is disabled

**Gotchas:**
- The breaker's internal state and thresholds are implementation-specific; this endpoint provides a snapshot for monitoring only.

---

### POST /ai-search/breaker/reset - Reset circuit breaker

Manually clear the circuit breaker state without restarting the server. Use after a provider outage has been resolved and you want to resume operations.

**Auth:** Admin session only

```bash
curl -X POST "https://your-store-api.example.com/api/v1/ai-search/breaker/reset" \
  --cookie "session_id=your_session_id"
```

**Response (200):**

```json
{
  "status": "success",
  "message": "circuit breaker reset"
}
```

**Permissions:** `ai.manage`

**Status codes:**
- `200` — Breaker reset
- `401` — Unauthorized
- `403` — Insufficient permissions
- `503` — AI Search addon is disabled
