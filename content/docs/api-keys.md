## 3. API Key Setup

### Creating API Keys (Admin)

API keys are created in the admin dashboard. When onboarding a new integration partner:

1. Log in to the admin dashboard
2. Go to **Settings** → **API** tab
3. Click **Add API Key**
4. Enter a descriptive name (e.g., "ERP Integration", "Mobile App")
5. Set permissions: **Read** and/or **Write**
6. Optionally set an expiration date (default: 365 days)
7. Click **Create**
8. **Important:** Copy the **Consumer Key** and **Consumer Secret** immediately - the secret is shown only once.

### Sharing Credentials with Developers

Provide your integration partner with:

| Credential | Format | Example |
|------------|--------|---------|
| **Consumer Key** | `ck_` + 32 hex chars | `ck_a1b2c3d4e5f6...` |
| **Consumer Secret** | `cs_` + 32 hex chars | `cs_x9y8z7w6v5...` |
| **Base URL** | Your API base URL | `https://your-store.com/api/v1` |

### API Key Permissions

- **Read** - GET requests (list, retrieve)
- **Write** - POST, PUT, PATCH, DELETE requests

### Enabling the API

The REST API must be enabled in **Settings** → **Addons**. If disabled, all API key requests return `403 Forbidden`.

---

## 4. Rate Limits

### Global (per IP)

| Scope | Window | Max requests | Notes |
|-------|--------|--------------|-------|
| **Storefront** (`/api/v1/storefront/*`) | 15 min | 5,000 | Public storefront; higher limit |
| **Admin API** (all other `/api/v1/*` except storefront) | 15 min | 1,000 | Per IP; **skipped** for logged-in admin session on `/products` and `/orders` (bulk UI / parallel updates) |
| **Auth** (`/api/v1/auth/*`, `/api/v1/storefront/auth/*`) | 15 min | 10 | Login/signup brute-force protection |

### REST API keys (per key)

When a request is authenticated with an **API key** (HTTP Basic with consumer key/secret or `X-API-Key`), a **per-key** rate limit is applied in addition to the global limit:

- **Window:** 1 minute (rolling).
- **Limit:** Configurable per API key (`rate_limit_per_minute`), or server default when not set.
- **Default:** 60 requests/minute (override with env `API_DEFAULT_RATE_LIMIT_PER_MINUTE`).
- **Range:** 1–10,000 requests/minute per key.

Configure the limit when creating or editing an API key in **Settings → Addons → API → API Keys**. Leave "Rate limit (requests per minute)" empty to use the server default.

When exceeded, the API returns `429 Too Many Requests` with a `Retry-After` header.

**Products (REST):** The `/api/v1/products` routes do **not** apply the per-API-key minute limiter, so bulk catalog updates are not throttled by key (the global per-IP limit still applies unless the admin session skip above matches).

---

## 5. API Key Management

### GET /api-keys - List API keys

Retrieve all API keys owned by the current user.

**Auth:** Admin session required.

```bash
curl "https://your-store-api.example.com/api/v1/api-keys" \
  -H "Cookie: sessionId=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "keys": [
      {
        "id": 42,
        "user_id": 1,
        "key": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
        "consumer_key": "ck_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
        "consumer_secret": null,
        "name": "ERP Integration",
        "permissions_json": { "read": true, "write": true },
        "rate_limit_per_minute": 120,
        "expires_at": "2027-09-23T00:00:00Z",
        "created_at": "2024-09-23T10:30:00Z",
        "updated_at": "2024-09-23T10:30:00Z"
      }
    ]
  }
}
```

**Notes:**
- The `consumer_secret` is always `null` in list responses for security.
- Only keys belonging to the authenticated user are returned.

---

### GET /api-keys/:id - Get API key details

Retrieve details for a specific API key by ID.

**Auth:** Admin session required.

```bash
curl "https://your-store-api.example.com/api/v1/api-keys/42" \
  -H "Cookie: sessionId=your_session_cookie"
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | URL | API key ID |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "apiKey": {
      "id": 42,
      "user_id": 1,
      "key": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "consumer_key": "ck_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "consumer_secret": null,
      "name": "ERP Integration",
      "permissions_json": { "read": true, "write": true },
      "rate_limit_per_minute": 120,
      "expires_at": "2027-09-23T00:00:00Z",
      "created_at": "2024-09-23T10:30:00Z",
      "updated_at": "2024-09-23T10:30:00Z"
    }
  }
}
```

**Error Responses:**

| Status | Meaning |
|--------|---------|
| `404` | API key not found or does not belong to the current user |

---

### POST /api-keys - Create API key

Create a new API key with optional custom permissions and rate limits.

**Auth:** Admin session required.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/api-keys" \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionId=your_session_cookie" \
  -d '{
    "name": "ERP Integration",
    "permissions": { "read": true, "write": true },
    "expires_at": "2027-09-23T00:00:00Z",
    "rate_limit_per_minute": 120
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | No | Descriptive name for the key (e.g., "ERP Integration", "Mobile App"); defaults to "API Key" if omitted |
| `permissions` | object | No | Permission flags; defaults to `{ "read": true, "write": true }` |
| `expires_at` | string (ISO 8601) | No | Expiration timestamp; if omitted, defaults to 365 days from creation |
| `rate_limit_per_minute` | integer | No | Requests per minute (1–10,000); if omitted, uses server default (usually 60) |

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "apiKey": {
      "id": 42,
      "user_id": 1,
      "key": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "consumer_key": "ck_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "consumer_secret": "cs_x9y8z7w6v5u4t3s2r1q0p9o8n7m6l5k4",
      "name": "ERP Integration",
      "permissions_json": { "read": true, "write": true },
      "rate_limit_per_minute": 120,
      "expires_at": "2027-09-23T00:00:00Z",
      "created_at": "2024-09-23T10:30:00Z",
      "updated_at": "2024-09-23T10:30:00Z"
    }
  }
}
```

**Important:** The `consumer_secret` is displayed **only once** when the key is created. Copy it immediately and store it securely — you cannot retrieve it again later.

---

### PUT /api-keys/:id - Update API key

Update the name, permissions, expiration date, or rate limit of an existing API key.

**Auth:** Admin session required.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/api-keys/42" \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionId=your_session_cookie" \
  -d '{
    "name": "ERP Integration (Updated)",
    "rate_limit_per_minute": 240
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | URL | API key ID |
| `name` | string | No | Update the descriptive name |
| `permissions` | object | No | Update permission flags |
| `expires_at` | string (ISO 8601) or null | No | Update expiration timestamp, or `null` to remove expiration |
| `rate_limit_per_minute` | integer or null | No | Update rate limit (1–10,000), or `null` to use server default |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "apiKey": {
      "id": 42,
      "user_id": 1,
      "key": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "consumer_key": "ck_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "consumer_secret": null,
      "name": "ERP Integration (Updated)",
      "permissions_json": { "read": true, "write": true },
      "rate_limit_per_minute": 240,
      "expires_at": "2027-09-23T00:00:00Z",
      "created_at": "2024-09-23T10:30:00Z",
      "updated_at": "2024-09-24T14:15:00Z"
    }
  }
}
```

**Error Responses:**

| Status | Meaning |
|--------|---------|
| `404` | API key not found or does not belong to the current user |

**Notes:**
- Only the fields you send are updated; omitted fields are left unchanged.
- The `consumer_secret` cannot be changed via this endpoint — use the `/regenerate` endpoint instead.

---

### POST /api-keys/:id/regenerate - Regenerate API key secret

Generate a new `consumer_secret` for an existing API key. The old secret becomes invalid immediately.

**Auth:** Admin session required.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/api-keys/42/regenerate" \
  -H "Content-Type: application/json" \
  -H "Cookie: sessionId=your_session_cookie"
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | URL | API key ID |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "apiKey": {
      "id": 42,
      "user_id": 1,
      "key": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "consumer_key": "ck_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
      "consumer_secret": "cs_newSecretNewSecretNewSecretNewSec",
      "name": "ERP Integration",
      "permissions_json": { "read": true, "write": true },
      "rate_limit_per_minute": 120,
      "expires_at": "2027-09-23T00:00:00Z",
      "created_at": "2024-09-23T10:30:00Z",
      "updated_at": "2024-09-24T14:20:00Z"
    }
  }
}
```

**Error Responses:**

| Status | Meaning |
|--------|---------|
| `404` | API key not found or does not belong to the current user |

**Important:** The new `consumer_secret` is displayed **only once**. Copy it immediately. Any systems using the old secret must be updated before the old secret is deleted (which happens immediately). There is no grace period.

---

### DELETE /api-keys/:id - Delete API key

Delete an API key permanently. All requests using this key will immediately fail with `401 Unauthorized`.

**Auth:** Admin session required.

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/api-keys/42" \
  -H "Cookie: sessionId=your_session_cookie"
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | integer | URL | API key ID |

**Example Response (200):**

```json
{
  "status": "success",
  "message": "API key deleted"
}
```

**Error Responses:**

| Status | Meaning |
|--------|---------|
| `404` | API key not found or does not belong to the current user |

**Notes:**
- This action is irreversible.
- Any integrations using this key must immediately switch to a different key or authentication method.

---

## Security Best Practices

- **Treat consumer secrets like passwords.** Store them securely, never commit them to source control.
- **Rotate secrets regularly.** Use the `/regenerate` endpoint to issue new credentials.
- **Use minimal permissions.** Grant only the read/write permissions the integration actually needs.
- **Set expiration dates.** Integrate with your audit process by expiring keys that are no longer needed.
- **Monitor usage.** Check the API operation logs in the admin dashboard to detect unusual activity.

