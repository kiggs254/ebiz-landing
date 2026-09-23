Push notifications alert staff, riders, and authenticated users to important events: new orders, completed bookings, assignment changes, and shop alerts. Devices register themselves via push tokens so the backend knows where to send notifications.

All responses use the standard `{ status, data }` envelope.

---

## Device Token Management

### POST /push-tokens - Register device push token

Register or refresh a device push token for the signed-in user. This enables the device to receive push notifications for new orders, new bookings, and other shop alerts.

When a device (e.g., a shared phone) changes hands between staff members, calling this endpoint re-assigns the token to the new user, automatically stopping notifications to the previous owner on that device.

**Auth:** Admin session or API key (staff, riders, or other authenticated users).

Example request:

```bash
curl -X POST "https://your-store-api.example.com/api/v1/push-tokens" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ExponentPushToken[ABC123xyz...]",
    "platform": "ios"
  }'
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `token` | string | Yes | Device push token from Expo or similar push service. This token uniquely identifies the device and is used to send notifications to it. |
| `platform` | string | No | Optional platform label such as "ios", "android", or "web". Stored for device identification but not required for functionality. |

Example response (200):

```json
{
  "status": "success",
  "data": {
    "ok": true
  }
}
```

**Gotchas:**
- Always call this endpoint when your app starts or regains focus to ensure the device is registered for alerts, especially after a reinstall.
- If the token already exists for another user, it will be re-assigned to the current user. This is intentional for shared-device scenarios.
- A missing or empty `token` field returns a `422 Unprocessable Entity` error.

---

### DELETE /push-tokens - Remove device push token

Delete a device push token from the system. Called on sign-out so the device stops receiving notifications for that user. If the token does not exist, the request succeeds silently.

**Auth:** Admin session or API key (staff, riders, or other authenticated users).

Example request (token as query parameter):

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/push-tokens?token=ExponentPushToken%5BABC123xyz...%5D"
```

Example request (token in request body):

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/push-tokens" \
  -H "Content-Type: application/json" \
  -d '{
    "token": "ExponentPushToken[ABC123xyz...]"
  }'
```

| Field / Parameter | Type | Required | Description |
|-------------------|------|----------|-------------|
| `token` (body) | string | No | Device push token to remove. Can be provided in the JSON body. |
| `token` (query) | string | No | Device push token to remove as a URL query parameter. |

Example response (200):

```json
{
  "status": "success",
  "data": {
    "ok": true
  }
}
```

**Gotchas:**
- Always call this endpoint when a user signs out to prevent the device from receiving notifications for the signed-out account.
- You can pass the token as either a query parameter or in the request body, whichever is more convenient.
- If the token is not found or is already removed, the endpoint returns `200 success` rather than an error — this is by design.
