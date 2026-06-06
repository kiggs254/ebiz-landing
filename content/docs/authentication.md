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

