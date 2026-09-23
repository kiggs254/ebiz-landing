The Plugins API enables admins to list installed plugins, retrieve their details, enable/disable them, and update their configuration. Plugins extend your store's functionality with third-party integrations and features. This API is restricted to authenticated admin users only.

---

### GET /plugins - List All Plugins

Retrieve a list of all installed plugins with their metadata and current status.

**Auth:** Admin session required (authenticated staff user)

```bash
curl -X GET "https://your-store.com/api/v1/plugins" \
  -H "Cookie: shopflow.sid=your_session_id"
```

**Response Example (200):**

```json
{
  "status": "success",
  "data": {
    "plugins": [
      {
        "id": 1,
        "name": "email-notifications",
        "version": "1.2.3",
        "enabled": true,
        "config_json": {
          "api_key": "*_set",
          "features": ["welcome_email", "order_notifications"]
        },
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-20T14:45:30Z"
      },
      {
        "id": 2,
        "name": "analytics-tracker",
        "version": "2.0.1",
        "enabled": false,
        "config_json": {},
        "created_at": "2024-02-01T08:00:00Z",
        "updated_at": "2024-02-01T08:00:00Z"
      }
    ]
  }
}
```

---

### GET /plugins/:id - Get Plugin Details

Retrieve full details of a specific plugin by its ID.

**Auth:** Admin session required (authenticated staff user)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Plugin ID |

```bash
curl -X GET "https://your-store.com/api/v1/plugins/1" \
  -H "Cookie: shopflow.sid=your_session_id"
```

**Response Example (200):**

```json
{
  "status": "success",
  "data": {
    "plugin": {
      "id": 1,
      "name": "email-notifications",
      "version": "1.2.3",
      "enabled": true,
      "config_json": {
        "api_key": "*_set",
        "features": ["welcome_email", "order_notifications"]
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:45:30Z"
    }
  }
}
```

**Error Responses:**

Returns `404` if the plugin does not exist:

```json
{
  "status": "error",
  "message": "Plugin not found"
}
```

---

### POST /plugins/:id/enable - Enable a Plugin

Enable (activate) a plugin by its ID. Once enabled, the plugin remains active even after server restart.

**Auth:** Admin session required (authenticated staff user)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Plugin ID to enable |

```bash
curl -X POST "https://your-store.com/api/v1/plugins/2/enable" \
  -H "Cookie: shopflow.sid=your_session_id" \
  -H "Content-Type: application/json"
```

**Response Example (200):**

```json
{
  "status": "success",
  "message": "Plugin enabled successfully"
}
```

**Error Responses:**

Returns `404` if the plugin does not exist.

**Gotchas:**

- Enabling a plugin that is already enabled is idempotent and succeeds without error.

---

### POST /plugins/:id/disable - Disable a Plugin

Disable (deactivate) a plugin by its ID. Once disabled, the plugin remains inactive even after server restart.

**Auth:** Admin session required (authenticated staff user)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Plugin ID to disable |

```bash
curl -X POST "https://your-store.com/api/v1/plugins/1/disable" \
  -H "Cookie: shopflow.sid=your_session_id" \
  -H "Content-Type: application/json"
```

**Response Example (200):**

```json
{
  "status": "success",
  "message": "Plugin disabled successfully"
}
```

**Error Responses:**

Returns `404` if the plugin does not exist.

**Gotchas:**

- Disabling a plugin that is already disabled is idempotent and succeeds without error.

---

### PUT /plugins/:id/config - Update Plugin Configuration

Update the configuration of a plugin. Configuration is stored as JSON and can contain any structure required by the plugin. Secrets such as API keys are masked as `*_set` in responses.

**Auth:** Admin session required (authenticated staff user)

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Plugin ID to configure |

| Body field | Type | Required | Description |
|-----------|------|----------|-------------|
| `config` | object | No | Plugin-specific configuration (arbitrary JSON). Secrets should be sent only in write requests; the server masks them as `*_set` in read responses. If omitted, existing configuration is preserved. |

**Example Request:**

```bash
curl -X PUT "https://your-store.com/api/v1/plugins/1/config" \
  -H "Cookie: shopflow.sid=your_session_id" \
  -H "Content-Type: application/json" \
  -d '{
    "config": {
      "api_key": "sk_test_xxxxxxxxxxxxxxxx",
      "features": ["welcome_email", "order_notifications"],
      "timeout": 30
    }
  }'
```

**Response Example (200):**

```json
{
  "status": "success",
  "data": {
    "plugin": {
      "id": 1,
      "name": "email-notifications",
      "version": "1.2.3",
      "enabled": true,
      "config_json": {
        "api_key": "*_set",
        "features": ["welcome_email", "order_notifications"],
        "timeout": 30
      },
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-20T14:45:30Z"
    }
  }
}
```

**Error Responses:**

Returns `404` if the plugin does not exist.

**Gotchas:**

- Secrets (API keys, passwords, tokens) in the `config` object are masked as `*_set` in responses and all subsequent read operations.
- When `config` is provided, it entirely replaces the plugin's existing configuration. Omit `config` from the request body to preserve existing settings unchanged.
- All admin users can read and update plugin configuration; no role-based restrictions are applied.
