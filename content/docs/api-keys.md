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

