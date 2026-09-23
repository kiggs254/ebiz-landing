## 2. Authentication

### Method 1: HTTP Basic Auth (Recommended)

Use the Consumer Key as the username and Consumer Secret as the password.

```bash
curl -X GET "https://your-store.com/api/v1/products" \
  -u "ck_abc123def456:cs_xyz789uvw012"
```

### Method 2: X-API-Key Header (Legacy)

For backwards compatibility, you can use the legacy API key (if available):

```bash
curl -X GET "https://your-store.com/api/v1/products" \
  -H "X-API-Key: your-legacy-api-key"
```

### Content-Type

Always send `Content-Type: application/json` for POST, PUT, and PATCH requests.

### Session-based (Admin Dashboard)

1. Register/Login to get a session cookie
2. Session cookie is automatically sent with subsequent requests
3. Protected routes require valid session

---

## Authentication Endpoints

### POST /auth/register - Register admin user

Register a new admin user. Registration is only available when no other users exist in the system (production environments require at least one user to exist already).

**Auth:** Public (no authentication required).

```bash
curl -X POST "https://your-store-api.example.com/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Email address for the new admin account |
| `password` | string | Yes | Password for the account (write-only) |
| `first_name` | string | No | First name of the admin |
| `last_name` | string | No | Last name of the admin |

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "admin",
      "role_id": null,
      "is_super_admin": true,
      "permissions": {},
      "allowed_branch_ids": []
    }
  }
}
```

**Errors:**

| Status | Meaning |
| --- | --- |
| `400` | Email or password missing |
| `403` | Registration disabled (users already exist in production) |

---

### POST /auth/login - Login to admin dashboard

Authenticate with email and password. A successful login creates a session cookie valid for subsequent requests.

**Auth:** Public (no authentication required).

```bash
curl -X POST "https://your-store-api.example.com/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePassword123"
  }'
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Admin email address |
| `password` | string | Yes | Admin password (write-only) |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "admin",
      "role_id": null,
      "is_super_admin": true,
      "permissions": {},
      "allowed_branch_ids": []
    }
  }
}
```

**Errors:**

| Status | Meaning |
| --- | --- |
| `400` | Email or password missing |
| `401` | Invalid email or password |

**Gotchas:**

- The response includes a `Set-Cookie` header with the session cookie (`shopflow.sid`). Include this cookie in all subsequent authenticated requests.
- A login failure is logged to the activity log for audit purposes.

---

### POST /auth/logout - Logout

Terminate the current session and clear the session cookie.

**Auth:** Admin session cookie required.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/auth/logout" \
  -b "shopflow.sid=xyz..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

**Gotchas:**

- The response includes a `Set-Cookie` header that expires the session cookie.
- Any subsequent request without re-authenticating will receive a 401 Unauthorized response.

---

### GET /auth/me - Get current user

Retrieve the profile of the authenticated user, including roles and permissions.

**Auth:** Admin session cookie required.

```bash
curl "https://your-store-api.example.com/api/v1/auth/me" \
  -b "shopflow.sid=xyz..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "user": {
      "id": 1,
      "email": "admin@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "admin",
      "role_id": null,
      "is_super_admin": true,
      "permissions": {
        "products": "full",
        "orders": "full",
        "customers": "full"
      },
      "allowed_branch_ids": []
    }
  }
}
```

**Errors:**

| Status | Meaning |
| --- | --- |
| `401` | Not authenticated |
| `404` | User not found |

---

### POST /auth/forgot-password - Request password reset

Send a password reset link to the user's email address. The endpoint returns success regardless of whether the email exists, preventing email enumeration attacks.

**Auth:** Public (no authentication required).

```bash
curl -X POST "https://your-store-api.example.com/api/v1/auth/forgot-password" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com"
  }'
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `email` | string | Yes | Email address of the account to reset |

**Example Response (200):**

```json
{
  "status": "success",
  "message": "If an account exists with this email, you will receive a password reset link."
}
```

**Errors:**

| Status | Meaning |
| --- | --- |
| `400` | Email missing or invalid |

**Gotchas:**

- The response is always a 200 success, even if the email doesn't exist in the system. This prevents attackers from enumerating registered email addresses.
- The reset link sent via email is valid for a limited time period (check with your deployment).
- If the user never receives a reset email, verify that email delivery is properly configured on your server.

---

### POST /auth/reset-password - Complete password reset

Complete a password reset using the token received via email from the `/forgot-password` endpoint.

**Auth:** Public (no authentication required).

```bash
curl -X POST "https://your-store-api.example.com/api/v1/auth/reset-password" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "new_password": "NewSecurePassword123"
  }'
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | Password reset token from email link (write-only) |
| `new_password` | string | Yes | The new password to set (write-only) |

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Password has been reset. You can now log in with your new password."
}
```

**Errors:**

| Status | Meaning |
| --- | --- |
| `400` | Token or new_password missing, invalid or expired token, or new password too short |

**Gotchas:**

- Reset tokens expire after a certain period. If a user returns to reset their password after the token expires, they must restart the process via `/forgot-password`.
- The token is single-use and becomes invalid after successful password reset.
- New password must be at least 6 characters long.

---

### PUT /auth/me/email - Change email address

Update the authenticated user's email address. Password verification is required to prevent unauthorized email changes.

**Auth:** Admin session cookie required.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/auth/me/email" \
  -H "Content-Type: application/json" \
  -b "shopflow.sid=xyz..." \
  -d '{
    "new_email": "newemail@example.com",
    "current_password": "CurrentPassword123"
  }'
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `new_email` | string | Yes | The new email address |
| `current_password` | string | Yes | Current password for verification (write-only) |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "updated": true
  }
}
```

**Errors:**

| Status | Meaning |
| --- | --- |
| `400` | Missing required fields |
| `401` | User not authenticated or invalid current password |
| `404` | User not found |
| `409` | Email address already in use by another user |

**Gotchas:**

- The password verification is case-sensitive and must match exactly.
- An email change is logged to the activity log for audit purposes.
- The user remains logged in after the email change; no re-authentication is required.

---

### PUT /auth/me/password - Change password

Update the authenticated user's password. Current password verification is required. New password must be at least 6 characters long.

**Auth:** Admin session cookie required.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/auth/me/password" \
  -H "Content-Type: application/json" \
  -b "shopflow.sid=xyz..." \
  -d '{
    "current_password": "CurrentPassword123",
    "new_password": "NewPassword456"
  }'
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `current_password` | string | Yes | Current password for verification (write-only) |
| `new_password` | string | Yes | The new password to set, minimum 6 characters (write-only) |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "updated": true
  }
}
```

**Errors:**

| Status | Meaning |
| --- | --- |
| `400` | Missing required fields or new_password too short (<6 characters) |
| `401` | User not authenticated or invalid current password |
| `404` | User not found |

**Gotchas:**

- The current password verification is case-sensitive.
- A password change is logged to the activity log for audit purposes.
- The user remains logged in after the password change; no re-authentication is required.
- For security, consider recommending users to change passwords on a regular basis.

---

### POST /auth/ws-ticket - Issue WebSocket Authentication Ticket

Generate a short-lived HMAC ticket for authenticating a WebSocket connection from a mobile or native client. The ticket is valid for 60 seconds and prevents long-lived API keys from appearing in WebSocket upgrade URLs or access logs.

**Auth:** API key or admin session.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/auth/ws-ticket" \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic ck_abc123def456:cs_xyz789uvw012"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "ticket": "42.1706123456.a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    "expires_at": "2024-01-25T10:01:00.000Z"
  }
}
```

**Using the Ticket:**

Pass the ticket as the `?ticket=` query parameter when upgrading to WebSocket:

```javascript
const { data } = await fetch('/api/v1/auth/ws-ticket', { method: 'POST' }).then(r => r.json());
const ws = new WebSocket(`wss://your-store-api.example.com/stream?ticket=${data.ticket}`);
```

**How it works:**

1. The ticket is a 3-part string: `<userId>.<expirationUnix>.<hmacSignature>`.
2. The server verifies the ticket during WebSocket handshake using constant-time comparison.
3. After 60 seconds, the ticket is invalid and a new one must be issued.
4. The same `SESSION_SECRET` that gates session cookies is used to sign the HMAC — no separate key to rotate.

**Common use cases:**

- **React Native / Expo apps**: WebSocket globals don't support passing cookies, so a ticket bridges the gap.
- **Mobile tracking**: Rider app uses this to stream delivery location updates in real-time.
- **Live updates**: Any native client that needs server-pushed notifications or live data feeds.

