## 16. WooCommerce Compatibility

This API provides WooCommerce-compatible REST endpoints for managing your store programmatically. It uses HTTP Basic Authentication with consumer key and secret credentials, making it compatible with WooCommerce API clients and tools.

### Authentication Examples

#### cURL

```bash
curl -X GET "https://your-domain.com/api/v1/products" \
  -u "ck_abc123def456:cs_xyz789uvw012"
```

#### JavaScript (Fetch API)

```javascript
const consumerKey = 'ck_abc123def456';
const consumerSecret = 'cs_xyz789uvw012';
const credentials = btoa(`${consumerKey}:${consumerSecret}`);

fetch('https://your-domain.com/api/v1/products', {
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Python (requests)

```python
import requests
from requests.auth import HTTPBasicAuth

consumer_key = 'ck_abc123def456'
consumer_secret = 'cs_xyz789uvw012'

response = requests.get(
    'https://your-domain.com/api/v1/products',
    auth=HTTPBasicAuth(consumer_key, consumer_secret)
)

print(response.json())
```

#### PHP

```php
<?php
$consumer_key = 'ck_abc123def456';
$consumer_secret = 'cs_xyz789uvw012';

$ch = curl_init('https://your-domain.com/api/v1/products');
curl_setopt($ch, CURLOPT_USERPWD, $consumer_key . ':' . $consumer_secret);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
```

### Legacy X-API-Key Header (Backwards Compatible)

For backwards compatibility, you can also use the `X-API-Key` header:

```bash
curl -X GET "https://your-domain.com/api/v1/products" \
  -H "X-API-Key: your-legacy-api-key"
```

### Migration from Legacy API Keys

If you have existing API keys using the `X-API-Key` header:

1. Existing keys continue to work (backwards compatible)
2. New consumer key/secret pairs are automatically generated for existing keys
3. You can view consumer keys in the admin dashboard
4. Regenerate secrets if needed through the admin UI

### WooCommerce Client Compatibility

The API is designed to work with existing WooCommerce client libraries. The authentication mechanism (HTTP Basic Auth with `ck_`/`cs_` prefixed credentials) is compatible with:

- **WooCommerce REST API** client libraries
- **Postman** collections configured for WooCommerce
- Any HTTP client that supports Basic Auth

### Complete JavaScript Client Example

```javascript
class ShopflowAPI {
  constructor(baseURL, consumerKey, consumerSecret) {
    this.baseURL = baseURL;
    this.credentials = btoa(`${consumerKey}:${consumerSecret}`);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${this.credentials}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  // Products
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders?${queryString}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    });
  }

  // Customers
  async getCustomers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/customers?${queryString}`);
  }

  async getCustomer(id) {
    return this.request(`/customers/${id}`);
  }
}

// Usage
const api = new ShopflowAPI(
  'https://your-domain.com/api/v1',
  'ck_abc123def456',
  'cs_xyz789uvw012'
);

// Get products
const products = await api.getProducts({ page: 1, limit: 20 });

// Create product
const newProduct = await api.createProduct({
  name: 'New Product',
  sku: 'PROD-002',
  price: 29.99,
  stock: 100,
  status: 'active',
});

// Update product
await api.updateProduct(newProduct.id, {
  price: 39.99,
});

// Get orders
const orders = await api.getOrders({ status: 'completed' });
```

### Best Practices

#### Security

1. **Never commit API keys to version control**
   - Store credentials in environment variables
   - Use secure credential management systems

2. **Use HTTPS only**
   - HTTP Basic Auth credentials are sent in plain text over HTTP
   - Always use HTTPS in production

3. **Rotate credentials regularly**
   - Regenerate consumer secrets periodically
   - Revoke unused API keys

4. **Use least privilege**
   - Grant only necessary permissions (Read vs Write)
   - Use separate keys for different applications

#### Performance

1. **Use pagination**
   - Always specify `limit` parameter
   - Use `page` parameter for large datasets

2. **Filter on the server**
   - Use query parameters instead of filtering client-side
   - Reduces data transfer and improves performance

3. **Use webhooks**
   - Subscribe to events instead of polling
   - Reduces API calls and improves efficiency

---


## 17. WooCommerce Migration

The WooCommerce Migration addon lets you bulk-import products, customers, orders, and metadata from an existing WooCommerce store into E-biz. The migration is phase-based (attributes → categories → products → orders, in dependency order) and tracks progress in the background. A mapping table records which WooCommerce IDs map to E-biz IDs to enable incremental re-runs.

### Setup

To use the migration API:

1. Enable the addon under **Settings → Addons**.
2. Configure the WooCommerce URL and OAuth credentials (Consumer Key and Secret) via the Settings UI or API.
3. Test the connection to validate the credentials.
4. Preview the entity counts before starting.
5. Kick off the migration and poll the status endpoint.

**Addon Gate:** Endpoints tagged with "Addon: WooCommerce Migration" return 503 when the addon is disabled. Other endpoints (config, status, mapping stats) are always callable so you can configure or check results even when the addon is off.

---

### GET /woo-migration/config - Get Migration Configuration

Retrieve the current WooCommerce migration settings and phase metadata. The consumer secret is masked (only last 4 chars visible) so the UI can detect whether it is set without exposing the full value.

**Auth:** Admin session required (Settings view permission).

This endpoint is always callable, even when the addon is disabled, so you can configure credentials before enabling the addon.

```bash
curl -X GET "https://your-store.com/api/v1/woo-migration/config" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `config.woo_migration_addon_enabled` | string | `true` or `false` |
| `config.woo_migration_wc_url` | string | WooCommerce site URL (e.g. `https://myshop.woocommerce.com`) |
| `config.woo_migration_consumer_key` | string | OAuth consumer key (e.g. `ck_abc123def456`) |
| `config.woo_migration_consumer_secret` | string | Masked version (e.g. `••••••••xyz9`); write-only on PUT |
| `config.woo_migration_consumer_secret_set` | boolean | `true` if a secret is configured |
| `config.woo_migration_per_page` | string | Pagination size per API call (10–100, default 50) |
| `config.woo_migration_image_concurrency` | string | Concurrent image downloads (1–10, default 4) |
| `config.woo_migration_keep_external_images` | string | `true` to keep original image URLs; `false` to re-host on S3 |
| `catalog.phase_order` | array | Execution order of phases |
| `catalog.phase_labels` | object | Human-friendly names for phases |
| `catalog.phase_dependencies` | object | Phase ordering constraints (e.g. products depends on categories) |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "config": {
      "woo_migration_addon_enabled": "false",
      "woo_migration_wc_url": "https://myshop.woocommerce.com",
      "woo_migration_consumer_key": "ck_abc123def456",
      "woo_migration_consumer_secret": "••••••••xyz9",
      "woo_migration_consumer_secret_set": true,
      "woo_migration_per_page": "50",
      "woo_migration_image_concurrency": "4",
      "woo_migration_keep_external_images": "false"
    },
    "catalog": {
      "phase_order": ["attributes", "categories", "tags", "brands", "customers", "products", "reviews", "orders"],
      "phase_labels": {
        "attributes": "Attributes",
        "categories": "Categories",
        "tags": "Tags",
        "brands": "Brands",
        "customers": "Customers",
        "products": "Products + variations",
        "reviews": "Reviews",
        "orders": "Orders"
      },
      "phase_dependencies": {
        "attributes": [],
        "categories": [],
        "tags": [],
        "brands": [],
        "customers": [],
        "products": [],
        "reviews": ["products"],
        "orders": ["products", "customers"]
      }
    }
  }
}
```

---

### PUT /woo-migration/config - Update Migration Configuration

Update one or more allowlisted configuration keys. If the incoming `woo_migration_consumer_secret` starts with our mask pattern (`••••••••`), it is treated as "unchanged" and not written, preserving the existing secret.

**Auth:** Admin session required (Settings manage permission).

**Request Body:**

```json
{
  "woo_migration_addon_enabled": "true",
  "woo_migration_wc_url": "https://myshop.woocommerce.com",
  "woo_migration_consumer_key": "ck_abc123def456",
  "woo_migration_consumer_secret": "cs_xyz789uvw012",
  "woo_migration_per_page": "50",
  "woo_migration_image_concurrency": "4",
  "woo_migration_keep_external_images": "false"
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `woo_migration_addon_enabled` | string | No | `true` or `false` to toggle the addon |
| `woo_migration_wc_url` | string | No | WooCommerce site URL; must start with `http://` or `https://` |
| `woo_migration_consumer_key` | string | No | WooCommerce OAuth consumer key |
| `woo_migration_consumer_secret` | string | No | WooCommerce OAuth consumer secret (write-only; masked on GET) |
| `woo_migration_per_page` | string | No | Pagination size (10–100) |
| `woo_migration_image_concurrency` | string | No | Concurrent downloads (1–10) |
| `woo_migration_keep_external_images` | string | No | `true` to keep original image URLs |

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/woo-migration/config" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "woo_migration_addon_enabled": "true",
    "woo_migration_wc_url": "https://myshop.woocommerce.com",
    "woo_migration_consumer_key": "ck_abc123def456",
    "woo_migration_consumer_secret": "cs_xyz789uvw012"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "updated": 4
  }
}
```

**Gotchas:**

- The consumer secret is never returned on GET, only masked. To avoid clobbering the real secret, the API ignores PUT requests where the secret starts with `••••••••`.
- If you send back the response from GET with the masked secret unchanged, the real value is preserved.

---

### POST /woo-migration/test - Test Connection

Verify connectivity to the configured WooCommerce store and retrieve its WordPress and WooCommerce versions. This is called by the Settings UI before starting a migration to catch credential or URL problems early.

**Auth:** Admin session required (Settings manage permission).

**Addon:** WooCommerce Migration — returns 503 when switched off.

**Request Body:** Empty

```bash
curl -X POST "https://your-store.com/api/v1/woo-migration/test" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "wp_version": "6.4.1",
    "wc_version": "8.5.2",
    "source_url": "myshop.woocommerce.com",
    "message": "Connected — WordPress 6.4.1, WooCommerce 8.5.2"
  }
}
```

**Errors (400):**

- Bad credentials
- URL is not reachable
- WooCommerce plugin not installed
- Invalid consumer key/secret

---

### GET /woo-migration/preview - Preview Entity Counts

For each migration phase (attributes, categories, products, etc.), fetch the estimated count from WooCommerce and the number of rows already mapped in this instance. The UI shows "≈ N to import, ≈ M already mapped, will skip" per entity.

**Auth:** Admin session required (Settings view permission).

**Addon:** WooCommerce Migration — returns 503 when switched off.

**Request:**

```bash
curl -X GET "https://your-store.com/api/v1/woo-migration/preview" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `source_url` | string | The normalized WooCommerce URL (hostname only) |
| `counts` | object | Estimated row counts from WooCommerce per phase |
| `counts.attributes` | integer | Number of product attributes |
| `counts.categories` | integer | Number of product categories |
| `counts.tags` | integer | Number of product tags |
| `counts.brands` | integer | Number of brands (if present in WC) |
| `counts.customers` | integer | Number of customer accounts |
| `counts.products` | integer | Number of products (all statuses) |
| `counts.reviews` | integer | Number of product reviews |
| `counts.orders` | integer | Number of orders (all statuses) |
| `mapped` | object | Already-imported row counts per entity_type from `woo_migration_mappings` |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "source_url": "myshop.woocommerce.com",
    "counts": {
      "attributes": 5,
      "categories": 12,
      "tags": 8,
      "brands": 3,
      "customers": 142,
      "products": 847,
      "reviews": 234,
      "orders": 156
    },
    "mapped": {
      "product": 100,
      "category": 8
    }
  }
}
```

---

### POST /woo-migration/start - Start Migration

Enqueue a background task to migrate selected phases from WooCommerce. The endpoint validates dependencies (e.g. reviews requires products), tests the connection, and returns immediately with a 202 Accepted status. The actual migration runs asynchronously; poll `/woo-migration/status` to track progress.

**Auth:** Admin session required (Settings manage permission).

**Addon:** WooCommerce Migration — returns 503 when switched off.

**Request Body:**

```json
{
  "phases": {
    "attributes": true,
    "categories": true,
    "tags": true,
    "brands": true,
    "customers": true,
    "products": true,
    "reviews": true,
    "orders": true
  }
}
```

Omit or send an empty `phases` object to migrate all phases in order. The orchestrator validates that if a phase is selected, all its dependencies are selected (or throws a 400 with a helpful message).

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `phases` | object | No | Map of phase name to boolean. Omit to select all. |

**Example Request (specific phases):**

```bash
curl -X POST "https://your-store.com/api/v1/woo-migration/start" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -H "Content-Type: application/json" \
  -d '{
    "phases": {
      "categories": true,
      "products": true,
      "reviews": true
    }
  }'
```

**Example Response (202):**

```json
{
  "status": "success",
  "data": {
    "task_id": "550e8400-e29b-41d4-a716-446655440000",
    "selected_phases": ["categories", "products", "reviews"]
  }
}
```

**Dependency Validation:**

If you select `reviews` without `products`, the endpoint returns 400:

```json
{
  "status": "error",
  "message": "Reviews requires Products + variations — tick Products + variations or untick Reviews."
}
```

---

### GET /woo-migration/status - Get Migration Status

Retrieve the most recent WooCommerce migration task, including its current status, per-phase progress, and any errors. The task object includes metadata with phase counts and WooCommerce version info. This endpoint is always callable, even when the addon is disabled.

**Auth:** Admin session required (Settings view permission).

**Request:**

```bash
curl -X GET "https://your-store.com/api/v1/woo-migration/status" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `task` | object \| null | The most recent migration task, or null if none has run yet. |
| `task.id` | string (UUID) | Background task ID |
| `task.type` | string | Always `woo_migration_full` |
| `task.name` | string | Human-friendly name (e.g. "WooCommerce migration from myshop.woocommerce.com") |
| `task.status` | string | One of `pending`, `in_progress`, `completed`, `failed`, `cancelled` |
| `task.progress` | integer | Number of completed phases (0 to total) |
| `task.total` | integer | Total number of phases selected |
| `task.message` | string | Current phase being processed (e.g. "Phase 4/8 — Products + variations") |
| `task.processed` | integer | Number of units processed (same as progress for umbrella tasks) |
| `task.result` | object \| null | Final result when status is `completed` or `failed`; includes phase_counts |
| `task.metadata` | object | Static info: source_url, wc_version, selected_phases, running phase_counts |
| `task.created_at` | string (ISO 8601) | When the task was enqueued |
| `task.updated_at` | string (ISO 8601) | When the task was last updated |

**Example Response (200 — in progress):**

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "woo_migration_full",
      "name": "WooCommerce migration from myshop.woocommerce.com",
      "status": "in_progress",
      "progress": 3,
      "total": 8,
      "message": "Phase 4/8 — Products + variations",
      "processed": 3,
      "result": null,
      "metadata": {
        "source_url": "myshop.woocommerce.com",
        "wc_url": "https://myshop.woocommerce.com",
        "wp_version": "6.4.1",
        "wc_version": "8.5.2",
        "selected_phases": ["attributes", "categories", "tags", "brands", "customers", "products", "reviews", "orders"],
        "phase_counts": {
          "attributes": { "created": 5, "skipped": 0, "errored": 0 },
          "categories": { "created": 12, "skipped": 0, "errored": 0 },
          "tags": { "created": 8, "skipped": 0, "errored": 0 },
          "brands": { "created": 3, "skipped": 0, "errored": 0 }
        }
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:35:42Z"
    }
  }
}
```

**Example Response (200 — completed):**

```json
{
  "status": "success",
  "data": {
    "task": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "type": "woo_migration_full",
      "name": "WooCommerce migration from myshop.woocommerce.com",
      "status": "completed",
      "progress": 8,
      "total": 8,
      "message": "Migration complete — 8/8 phases",
      "processed": 8,
      "result": {
        "phase_counts": {
          "attributes": { "created": 5, "skipped": 0, "errored": 0 },
          "categories": { "created": 12, "skipped": 0, "errored": 0 },
          "tags": { "created": 8, "skipped": 0, "errored": 0 },
          "brands": { "created": 3, "skipped": 0, "errored": 0 },
          "customers": { "created": 142, "skipped": 0, "errored": 0 },
          "products": { "created": 847, "skipped": 0, "errored": 0 },
          "reviews": { "created": 234, "skipped": 0, "errored": 0 },
          "orders": { "created": 156, "skipped": 0, "errored": 0 }
        }
      },
      "metadata": {
        "source_url": "myshop.woocommerce.com",
        "wc_url": "https://myshop.woocommerce.com",
        "wp_version": "6.4.1",
        "wc_version": "8.5.2",
        "selected_phases": ["attributes", "categories", "tags", "brands", "customers", "products", "reviews", "orders"],
        "phase_counts": {
          "attributes": { "created": 5, "skipped": 0, "errored": 0 },
          "categories": { "created": 12, "skipped": 0, "errored": 0 },
          "tags": { "created": 8, "skipped": 0, "errored": 0 },
          "brands": { "created": 3, "skipped": 0, "errored": 0 },
          "customers": { "created": 142, "skipped": 0, "errored": 0 },
          "products": { "created": 847, "skipped": 0, "errored": 0 },
          "reviews": { "created": 234, "skipped": 0, "errored": 0 },
          "orders": { "created": 156, "skipped": 0, "errored": 0 }
        }
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T11:15:30Z"
    }
  }
}
```

---

### GET /woo-migration/mapping/stats - Get Import Mapping Counts

Count how many rows have been mapped per entity_type (product, category, customer, etc.) in the `woo_migration_mappings` table for a given WooCommerce source. Useful for tracking incremental imports or checking what has already been migrated. This endpoint is always callable, even when the addon is disabled.

**Auth:** Admin session required (Settings view permission).

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `source_url` | string | No | WooCommerce source URL to query. If omitted, the currently-configured URL is used. |

**Request:**

```bash
curl -X GET "https://your-store.com/api/v1/woo-migration/mapping/stats" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

Or with an explicit source:

```bash
curl -X GET "https://your-store.com/api/v1/woo-migration/mapping/stats?source_url=https://other.woocommerce.com" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `source_url` | string \| null | The normalized source URL (hostname only), or null if no config is set |
| `mapped` | object | Row counts per entity_type; keys are entity_type values like `product`, `category`, `customer` |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "source_url": "myshop.woocommerce.com",
    "mapped": {
      "product": 847,
      "category": 12,
      "attribute": 5,
      "attribute_value": 18,
      "brand": 3,
      "customer": 142,
      "order": 156,
      "review": 234,
      "tag": 8,
      "variation": 412
    }
  }
}
```

If no migration has run yet, all counts are 0 or the object is empty.

---

### Gotchas & Best Practices

1. **Incremental imports:** Re-running a migration with overlapping phases uses the mapping table to skip already-imported rows. If you want a fresh import, you must clear the mappings first (not exposed via API; contact support or clear via SQL).

2. **Image handling:** The `woo_migration_keep_external_images` setting controls whether images are re-hosted on S3 or linked to the original WooCommerce URL. Once set, changing it during a re-run may mix image URLs.

3. **Dependency order:** The phases always run in order: attributes → categories → tags → brands → customers → products → reviews → orders. Dependencies are validated; e.g. you cannot import reviews without products.

4. **Concurrency:** The `woo_migration_image_concurrency` setting limits concurrent image downloads. Higher values speed up large migrations but consume more bandwidth and CPU.

5. **Mapping namespace:** Mappings are keyed by the source URL's hostname (e.g. `myshop.woocommerce.com`), so you can migrate from multiple WooCommerce sites into one E-biz instance without conflicts.
