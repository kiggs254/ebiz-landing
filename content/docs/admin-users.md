## Overview

The admin module provides role-based access control (RBAC) for staff management, activity auditing, and settings administration. Manage staff accounts, define roles with granular permissions, track all admin actions, and send test emails.

**Auth:** All admin routes require an admin session (`sessionAuth`). Permission requirements vary by endpoint (see `roles.view`, `roles.manage`, `users.view`, `users.manage`, `activity_log.view`, `settings.manage`).

## Roles

Roles define staff permissions. Each role has a permission matrix keyed by module name. System roles (like "admin") cannot be deleted.

### GET /admin/roles - List all roles

Retrieve all roles and the RBAC permission-module catalog.

**Auth:** Admin session only (requires `roles.view` permission)

```bash
curl https://your-store-api.example.com/api/v1/admin/roles
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "roles": [
      {
        "id": 1,
        "name": "admin",
        "description": null,
        "permissions_json": { "products": { "view": true, "manage": true }, "orders": { "view": true, "manage": true } },
        "is_system": true,
        "created_at": "2026-01-01T00:00:00.000Z",
        "updated_at": "2026-01-01T00:00:00.000Z"
      },
      {
        "id": 2,
        "name": "editor",
        "description": "Can edit products and categories",
        "permissions_json": { "products": { "view": true, "manage": true }, "categories": { "view": true, "manage": true } },
        "is_system": false,
        "created_at": "2026-09-23T10:00:00.000Z",
        "updated_at": "2026-09-23T10:00:00.000Z"
      }
    ],
    "modules": {
      "products": ["view", "manage"],
      "orders": ["view", "manage"],
      "categories": ["view", "manage"]
    }
  }
}
```

**Gotchas:** The `modules` object alongside roles contains the RBAC catalog describing which actions are available per module. Use it to render permission checkboxes in the admin UI.

---

### POST /admin/roles - Create a role

Create a new admin role with a permission matrix.

**Auth:** Admin session only (requires `roles.manage` permission)

```bash
curl -X POST https://your-store-api.example.com/api/v1/admin/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Editor",
    "description": "Can edit products and categories",
    "permissions_json": {
      "products": { "view": true, "manage": true },
      "categories": { "view": true, "manage": true }
    }
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Unique role name |
| description | string | No | Role description |
| permissions_json | object | No | Permission matrix (defaults to empty) |
| is_system | boolean | No | Reserved for system roles; always false on create |

**Response:**
```json
{
  "status": "success",
  "data": {
    "role": {
      "id": 3,
      "name": "Editor",
      "description": "Can edit products and categories",
      "permissions_json": {
        "products": { "view": true, "manage": true },
        "categories": { "view": true, "manage": true }
      },
      "is_system": false,
      "created_at": "2026-09-23T10:00:00.000Z",
      "updated_at": "2026-09-23T10:00:00.000Z"
    }
  }
}
```

**Gotchas:** Role names must be unique; duplicate names return 400. System roles cannot be created via this endpoint.

---

### PUT /admin/roles/:id - Update a role

Update role name, description, or permissions. The is_system flag cannot be changed.

**Auth:** Admin session only (requires `roles.manage` permission)

```bash
curl -X PUT https://your-store-api.example.com/api/v1/admin/roles/3 \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Can edit products, categories, and orders"
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "role": {
      "id": 3,
      "name": "Editor",
      "description": "Can edit products, categories, and orders",
      "permissions_json": { "products": { "view": true, "manage": true } },
      "is_system": false,
      "created_at": "2026-09-23T10:00:00.000Z",
      "updated_at": "2026-09-23T10:05:00.000Z"
    }
  }
}
```

---

### DELETE /admin/roles/:id - Delete a role

Delete a role by ID. System roles cannot be deleted; returns 400 if attempted.

**Auth:** Admin session only (requires `roles.manage` permission)

```bash
curl -X DELETE https://your-store-api.example.com/api/v1/admin/roles/3
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "deleted": true
  }
}
```

**Gotchas:** Deleted roles are automatically unlinked from all users. Cannot delete system roles or if no other admin role exists.

---

## Users

Manage staff accounts and their permissions via role assignment.

### GET /admin/users - List all staff users

Retrieve paginated list of staff accounts with optional search and pagination.

**Auth:** Admin session only (requires `users.view` permission)

**Query parameters (all optional):**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default 1) |
| limit | integer | Results per page (default 20, max 500, or "all" for 10,000) |
| search | string | Search by email, first_name, or last_name (case-insensitive) |

```bash
curl 'https://your-store-api.example.com/api/v1/admin/users?page=1&limit=20&search=alice'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 42,
        "email": "alice@example.com",
        "first_name": "Alice",
        "last_name": "Smith",
        "role": "admin",
        "role_id": 1,
        "roleRef": {
          "id": 1,
          "name": "admin"
        },
        "created_at": "2026-09-23T10:00:00.000Z",
        "updated_at": "2026-09-23T10:00:00.000Z"
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 5
  }
}
```

**Gotchas:**
- Password hashes are never returned in any response.
- The `roleRef` object contains current role data; the `role` field is legacy.
- Search is case-insensitive and partial-match (e.g., "ali" matches "alice").

---

### POST /admin/users - Create a staff user

Create a new admin or staff account.

**Auth:** Admin session only (requires `users.manage` permission)

```bash
curl -X POST https://your-store-api.example.com/api/v1/admin/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "SecurePassword123!",
    "first_name": "Alice",
    "last_name": "Smith",
    "role_id": 1
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Unique email address (write-only input) |
| password | string | Yes | Plain password (write-only, hashed on server) |
| first_name | string | No | User first name |
| last_name | string | No | User last name |
| role_id | integer | Yes | ID of role to assign |

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 42,
      "email": "alice@example.com",
      "first_name": "Alice",
      "last_name": "Smith",
      "role": "admin",
      "role_id": 1,
      "roleRef": {
        "id": 1,
        "name": "admin"
      },
      "created_at": "2026-09-23T10:00:00.000Z",
      "updated_at": "2026-09-23T10:00:00.000Z"
    }
  }
}
```

**Gotchas:** Email must be unique; duplicate emails return 409. role_id must reference an existing role; invalid IDs return 400. Passwords are never returned in responses.

---

### PUT /admin/users/:id - Update a staff user

Update user email, name, or role assignment.

**Auth:** Admin session only (requires `users.manage` permission)

```bash
curl -X PUT https://your-store-api.example.com/api/v1/admin/users/42 \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Alicia",
    "role_id": 2
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 42,
      "email": "alice@example.com",
      "first_name": "Alicia",
      "last_name": "Smith",
      "role": "editor",
      "role_id": 2,
      "roleRef": {
        "id": 2,
        "name": "editor"
      },
      "created_at": "2026-09-23T10:00:00.000Z",
      "updated_at": "2026-09-23T10:05:00.000Z"
    }
  }
}
```

---

### PUT /admin/users/:id/password - Reset a staff user password

Set a new password for a user. Typically used for password resets or recovery.

**Auth:** Admin session only (requires `users.manage` permission)

```bash
curl -X PUT https://your-store-api.example.com/api/v1/admin/users/42/password \
  -H "Content-Type: application/json" \
  -d '{
    "password": "NewSecurePassword456!"
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| password | string | Yes | New plain password (write-only, hashed on server) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "updated": true
  }
}
```

**Gotchas:** Passwords are write-only and never returned. Setting a new password invalidates existing sessions for that user immediately.

---

### DELETE /admin/users/:id - Delete a staff user

Delete a user account. The user's content (images, notes, created entities) is handed over to the admin performing the deletion or the longest-standing remaining admin. Credentials (sessions, API keys) are purged.

**Auth:** Admin session only (requires `users.manage` permission)

```bash
curl -X DELETE https://your-store-api.example.com/api/v1/admin/users/42
```

**Response:**
```json
{
  "status": "success",
  "message": "User account deleted. Their content has been reassigned to Admin User (admin@example.com). Product images: 5, Order notes: 3. Sessions and API keys removed.",
  "data": {
    "deleted": true,
    "reassigned_to": {
      "id": 1,
      "name": "Admin User"
    },
    "reassigned": {
      "product_images": 5,
      "order_notes": 3
    },
    "removed": {
      "sessions": 1,
      "api_keys": 0
    }
  }
}
```

**Gotchas:**
- Cannot delete your own account.
- Cannot delete if it is the last admin user.
- Handover happens in a database transaction; if any step fails, the entire deletion is rolled back.
- Reassigned content retains its original creation date and other metadata; only the creator is changed.

---

### GET /admin/users/:id/branches - Get user branch access

Retrieve which branches a user has access to.

**Auth:** Admin session only (requires `users.view` permission)

```bash
curl https://your-store-api.example.com/api/v1/admin/users/42/branches
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "branches": [
      {
        "id": 1,
        "name": "Main Store",
        "slug": "main-store",
        "created_at": "2026-01-01T00:00:00.000Z",
        "updated_at": "2026-09-23T10:00:00.000Z"
      },
      {
        "id": 2,
        "name": "Downtown",
        "slug": "downtown",
        "created_at": "2026-01-01T00:00:00.000Z",
        "updated_at": "2026-09-23T10:00:00.000Z"
      }
    ]
  }
}
```

---

### PUT /admin/users/:id/branches - Update user branch access

Replace all branch assignments for a user. An empty array removes all branch access.

**Auth:** Admin session only (requires `users.manage` permission)

```bash
curl -X PUT https://your-store-api.example.com/api/v1/admin/users/42/branches \
  -H "Content-Type: application/json" \
  -d '{
    "branch_ids": [1, 2, 3]
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| branch_ids | array of integers | Yes | IDs of branches to assign (empty array = no access) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "branches": [
      { "id": 1, "name": "Main Store", "slug": "main-store", "created_at": "2026-01-01T00:00:00.000Z", "updated_at": "2026-09-23T10:00:00.000Z" },
      { "id": 2, "name": "Downtown", "slug": "downtown", "created_at": "2026-01-01T00:00:00.000Z", "updated_at": "2026-09-23T10:00:00.000Z" },
      { "id": 3, "name": "Westside", "slug": "westside", "created_at": "2026-01-01T00:00:00.000Z", "updated_at": "2026-09-23T10:00:00.000Z" }
    ]
  }
}
```

**Gotchas:** This endpoint **replaces** all branch assignments, not merges. Branch scope filters are only applied if the branches addon is enabled; otherwise, users see all data regardless of branch assignment.

---

## Activity Logs

Track all admin and staff actions for compliance and auditing.

### GET /admin/activity-logs - List activity logs

Retrieve paginated activity logs with powerful filtering and full-text search.

**Auth:** Admin session only (requires `activity_log.view` permission)

**Query parameters (all optional, AND-combined):**

| Parameter | Type | Description |
|-----------|------|-------------|
| page | integer | Page number (default 1) |
| limit | integer | Results per page (default 50, max 500) |
| search / q | string | Full-text search across all columns, user email/name, and metadata JSON |
| user_id | integer | Filter by acting user ID |
| module | string | Filter by module (comma-separated or array) |
| action | string | Filter by action (comma-separated or array) |
| failures_only | boolean | If true, only logs with status_code >= 400 |
| start_date / from / date_from | date | Start of date range (YYYY-MM-DD) |
| end_date / to / date_to | date | End of date range (YYYY-MM-DD, inclusive) |

```bash
curl 'https://your-store-api.example.com/api/v1/admin/activity-logs?page=1&limit=20&module=products&start_date=2026-09-01&end_date=2026-09-30'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "logs": [
      {
        "id": 1001,
        "created_at": "2026-09-23T10:15:30.000Z",
        "user_id": 1,
        "user": {
          "id": 1,
          "email": "admin@example.com",
          "first_name": "Admin",
          "last_name": "User",
          "role": "admin"
        },
        "action": "product_created",
        "module": "products",
        "method": "POST",
        "path": "/api/v1/products",
        "status_code": 201,
        "entity_type": "product",
        "entity_id": "123",
        "ip": "192.168.1.1",
        "user_agent": "Mozilla/5.0...",
        "metadata_json": {
          "product_name": "New Widget",
          "category_id": 5
        }
      }
    ],
    "page": 1,
    "limit": 20,
    "total": 4523
  }
}
```

**Gotchas:**
- "search by anything" scans ALL columns including status_code (cast to text) and metadata_json (as JSON string).
- YYYY-MM-DD dates without time are treated as inclusive end-of-day (e.g., `2026-09-30` = up to 23:59:59.999).
- user_id resolves email/name searches; if you search for "alice@example.com", the backend finds all users with that email and includes logs from any of them.

---

### GET /admin/activity-logs/export - Export activity logs as CSV

Export filtered activity logs as a UTF-8 CSV file with the same filter parameters as the list endpoint. Maximum 50,000 rows per export.

**Auth:** Admin session only (requires `activity_log.view` permission)

```bash
curl 'https://your-store-api.example.com/api/v1/admin/activity-logs/export?module=products,orders&failures_only=true' \
  -H "Accept: text/csv" \
  -o activity-logs-2026-09-23.csv
```

**Response:**
```
id,created_at,user_email,user_name,action,module,method,path,status_code,entity_type,entity_id,ip,user_agent,metadata_json
1001,2026-09-23T10:15:30.000Z,admin@example.com,Admin User,product_created,products,POST,/api/v1/products,201,product,123,192.168.1.1,Mozilla/5.0...,"{"product_name":"New Widget","category_id":5}"
...
```

**Gotchas:**
- CSV is UTF-8 with BOM so Excel renders accented characters correctly.
- metadata_json is serialized as a JSON string per row.
- Timestamps are ISO 8601 format.

---

### GET /admin/activity-logs/:id - Get a single activity log

Retrieve a single activity log entry by ID.

**Auth:** Admin session only (requires `activity_log.view` permission)

```bash
curl https://your-store-api.example.com/api/v1/admin/activity-logs/1001
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "log": {
      "id": 1001,
      "created_at": "2026-09-23T10:15:30.000Z",
      "user_id": 1,
      "user": {
        "id": 1,
        "email": "admin@example.com",
        "first_name": "Admin",
        "last_name": "User",
        "role": "admin"
      },
      "action": "product_created",
      "module": "products",
      "method": "POST",
      "path": "/api/v1/products",
      "status_code": 201,
      "entity_type": "product",
      "entity_id": "123",
      "ip": "192.168.1.1",
      "user_agent": "Mozilla/5.0...",
      "metadata_json": {
        "product_name": "New Widget",
        "category_id": 5
      }
    }
  }
}
```

---

## Settings

### POST /admin/test-email - Send a test email

Send a test email to validate email configuration. Useful for verifying SMTP settings.

**Auth:** Admin session only (requires `settings.manage` permission)

```bash
curl -X POST https://your-store-api.example.com/api/v1/admin/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com"
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| to | string | Yes | Recipient email address (write-only) |

**Response:**
```json
{
  "status": "success",
  "data": {
    "sent": true
  }
}
```

**Gotchas:**
- If the email fails to send (SMTP unreachable, invalid address, etc.), the response is 500 with "Email send failed".
- Recipient addresses are write-only and never logged.
- Test email content is generic and hardcoded; do not use for actual customer communication.
