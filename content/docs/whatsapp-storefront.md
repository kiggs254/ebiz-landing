Admin API for WhatsApp storefront management, including conversation sessions, configuration, analytics, and FAQ management. All endpoints require admin session authentication (`sessionAuth`) and the WhatsApp Storefront addon to be enabled. The `/config` endpoint (both GET and PUT) remain accessible while the addon is disabled to allow configuration before enablement.

All responses use the standard `{ status, data }` envelope, and errors use `{ status: 'error', message }`.

---

## Sessions Management

### GET /whatsapp-storefront/sessions/active-count - Active session count

Returns the count of active WhatsApp conversations from the last 30 minutes. Used to populate sidebar badges.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

```bash
curl -X GET "https://your-store-api.example.com/api/v1/whatsapp-storefront/sessions/active-count" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "count": 5
  }
}
```

---

### GET /whatsapp-storefront/sessions - List conversations

Paginated list of active WhatsApp conversations, ordered by most recent message first.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

| Query param | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | integer | 1 | Page number (1-indexed) |
| `limit` | integer | 25 | Results per page (max 100) |
| `search` | string | — | Filter by customer phone number (partial match) |

```bash
curl -X GET "https://your-store-api.example.com/api/v1/whatsapp-storefront/sessions?page=1&limit=25&search=254700" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "sessions": [
      {
        "id": "abc-123",
        "phone": "+254700000001",
        "customer_id": 42,
        "customer": {
          "id": 42,
          "first_name": "Alice",
          "last_name": "Smith",
          "email": "alice@example.com",
          "phone": "+254700000001"
        },
        "bot_paused": false,
        "bot_paused_until": null,
        "last_message_at": "2026-09-23T14:30:00.000Z",
        "created_at": "2026-09-20T10:15:00.000Z",
        "updated_at": "2026-09-23T14:30:00.000Z"
      }
    ],
    "total": 42,
    "page": 1,
    "totalPages": 2
  }
}
```

The response excludes the full `conversation_history` from the list view for performance. Use the detail endpoint to fetch it.

---

### GET /whatsapp-storefront/sessions/:id - Get conversation details

Fetch a single session with up to 300 most recent messages in chronological order (earliest to latest).

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

```bash
curl -X GET "https://your-store-api.example.com/api/v1/whatsapp-storefront/sessions/abc-123" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "session": {
      "id": "abc-123",
      "phone": "+254700000001",
      "customer_id": 42,
      "customer": {
        "id": 42,
        "first_name": "Alice",
        "last_name": "Smith",
        "email": "alice@example.com",
        "phone": "+254700000001"
      },
      "conversation_history": [
        {
          "role": "user",
          "content": "Hi, what's your best-selling product?"
        },
        {
          "role": "assistant",
          "content": "Our best seller is the Premium Phone Case..."
        }
      ],
      "state_data": {},
      "bot_paused": false,
      "bot_paused_until": null,
      "last_message_at": "2026-09-23T14:30:00.000Z",
      "created_at": "2026-09-20T10:15:00.000Z",
      "updated_at": "2026-09-23T14:30:00.000Z"
    },
    "messages": [
      {
        "id": "msg-1",
        "session_id": "abc-123",
        "direction": "inbound",
        "wa_message_id": "wamid.123",
        "message_type": "text",
        "payload": {
          "text": "Hi, what's your best-selling product?"
        },
        "ai_tool_calls": null,
        "created_at": "2026-09-23T14:15:00.000Z"
      },
      {
        "id": "msg-2",
        "session_id": "abc-123",
        "direction": "outbound",
        "wa_message_id": "wamid.124",
        "message_type": "text",
        "payload": {
          "text": "Our best seller is the Premium Phone Case..."
        },
        "ai_tool_calls": null,
        "created_at": "2026-09-23T14:30:00.000Z"
      }
    ]
  }
}
```

Fetch up to 300 of the most recent messages, reversed for display. The `ai_tool_calls` array contains details of any AI operations (product searches, order creations) performed while processing that message.

---

### DELETE /whatsapp-storefront/sessions/:id - Reset or delete session

Reset a session (soft delete) or permanently delete it (hard delete).

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

| Query param | Type | Default | Description |
| --- | --- | --- | --- |
| `hard` | string | "false" | Set to "true" for permanent deletion of session and all messages |

**Soft reset (default: hard=false):**
- Clears `conversation_history` and `state_data`
- Clears `bot_paused` and `bot_paused_until`
- Keeps the session row for retention metrics

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/whatsapp-storefront/sessions/abc-123" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Session reset — conversation, state, and pause timers cleared."
}
```

**Hard delete (hard=true):**
- Drops the entire session row
- Deletes all associated message log rows
- Used by the admin "Delete Conversation" button

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/whatsapp-storefront/sessions/abc-123?hard=true" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Conversation permanently deleted (47 messages removed).",
  "data": {
    "session_id": "abc-123",
    "messages_deleted": 47
  }
}
```

---

## Analytics

### GET /whatsapp-storefront/analytics - Dashboard stats

Retrieve WhatsApp storefront analytics including session counts, message volume, orders, and revenue within a configurable date range.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

| Query param | Type | Default | Description |
| --- | --- | --- | --- |
| `range` | string | "7d" | Date range: "today", "7d", "30d", or "90d" |

```bash
curl -X GET "https://your-store-api.example.com/api/v1/whatsapp-storefront/analytics?range=30d" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "total_sessions": 156,
    "active_sessions": 42,
    "total_messages": 1247,
    "orders": 28,
    "revenue": 18500.50,
    "avg_order_value": 660.18,
    "range": "30d"
  }
}
```

- `total_sessions`: Cumulative sessions ever created
- `active_sessions`: Sessions with messages within the range
- `total_messages`: Message count within the range
- `orders`: Orders created via WhatsApp within the range (source='whatsapp')
- `revenue`: Total order value from WhatsApp orders within the range
- `avg_order_value`: Average order value for the range period

---

### GET /whatsapp-storefront/analytics/popular - Popular products

Top products ordered via WhatsApp by quantity, ranked with order count.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

| Query param | Type | Default | Description |
| --- | --- | --- | --- |
| `limit` | integer | 10 | Maximum products to return (max 20) |

```bash
curl -X GET "https://your-store-api.example.com/api/v1/whatsapp-storefront/analytics/popular?limit=10" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": 101,
        "name": "Premium Phone Case",
        "slug": "premium-phone-case",
        "price": 1500,
        "sale_price": 1200,
        "total_quantity": 87,
        "order_count": 23
      },
      {
        "id": 205,
        "name": "Screen Protector",
        "slug": "screen-protector",
        "price": 500,
        "sale_price": 350,
        "total_quantity": 64,
        "order_count": 18
      }
    ]
  }
}
```

- `total_quantity`: Total units ordered across all orders
- `order_count`: Number of distinct orders containing this product

---

## Configuration

### GET /whatsapp-storefront/config - Get configuration

Fetch all WhatsApp storefront configuration including general settings, message templates, and numeric controls. This endpoint remains accessible even when the addon is disabled (for pre-enablement setup).

**Auth:** Admin session only.

```bash
curl -X GET "https://your-store-api.example.com/api/v1/whatsapp-storefront/config" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "config": {
      "whatsapp_storefront_addon_enabled": "true",
      "whatsapp_storefront_greeting": "Welcome to our shop!",
      "whatsapp_storefront_ai_model": "claude-3-5-sonnet",
      "whatsapp_storefront_business_hours": "{\"monday\": \"09:00-18:00\"}",
      "whatsapp_storefront_bot_paused": "false",
      "whatsapp_storefront_bot_paused_message": "Our bot is currently unavailable. Please try again later.",
      "whatsapp_storefront_welcome_message_new": "Welcome! This is your first time here.",
      "whatsapp_storefront_welcome_message_returning": "Welcome back!",
      "whatsapp_storefront_msg_branch_welcome_header": "🏬 Pick your branch"
    },
    "catalog": {
      "messages": [
        {
          "key": "greeting",
          "label": "Greeting Message",
          "group": "General",
          "type": "text",
          "default": "Welcome to our shop!",
          "maxLen": 160
        }
      ],
      "numeric": [
        {
          "key": "whatsapp_storefront_session_timeout_minutes",
          "label": "Session Timeout",
          "min": 5,
          "max": 1440,
          "default": 1440
        }
      ],
      "msgPrefix": "whatsapp_storefront_msg_"
    }
  }
}
```

The `catalog` object provides metadata for dynamic UI rendering. Message keys are prefixed with `msgPrefix` (e.g., `whatsapp_storefront_msg_` + `branch_welcome_header` = `whatsapp_storefront_msg_branch_welcome_header`).

---

### PUT /whatsapp-storefront/config - Update configuration

Update WhatsApp storefront settings, message templates, and numeric controls.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off (except for GET /config).

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/whatsapp-storefront/config" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -d '{
    "whatsapp_storefront_greeting": "Welcome to our amazing shop!",
    "whatsapp_storefront_ai_model": "claude-3-5-haiku",
    "whatsapp_storefront_welcome_message_new": "Hi there! First time shopping with us?"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Configuration updated"
}
```

**Validation:**
- Numeric values are clamped to their min/max ranges
- Button message text is truncated to `maxLen` if provided
- Invalid keys are silently ignored
- All values are coerced to strings before storage

---

## Session Control

### PATCH /whatsapp-storefront/sessions/:id/bot-pause - Toggle bot pause

Manually pause or resume the bot for a specific session. Clears auto-pause timers regardless of direction.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

```bash
curl -X PATCH "https://your-store-api.example.com/api/v1/whatsapp-storefront/sessions/abc-123/bot-pause" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -d '{ "paused": true }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "bot_paused": true,
    "bot_paused_until": null
  },
  "message": "Bot paused for this chat"
}
```

**Behavior:**
- When `paused=true`: Bot stops responding to new messages; other admin tabs are notified in real time via PostgreSQL NOTIFY
- When `paused=false`: Clears auto-pause timer; next inbound message will be replied to by the bot
- Always clears `bot_paused_until` to prevent confusion during handoffs

---

### POST /whatsapp-storefront/sessions/:id/resume - Resume bot

Clear the auto-pause timer for this session so the bot responds to the next message. Used by admin "Resume now" toast buttons. Idempotent — no-op when the session isn't currently auto-paused.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp-storefront/sessions/abc-123/resume" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Bot resumed for this chat"
}
```

---

### POST /whatsapp-storefront/sessions/:id/send-message - Send manual message

Send a manual text message to a customer in an active session. Automatically pauses the bot to prevent conflicts with the human agent.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp-storefront/sessions/abc-123/send-message" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -d '{
    "text": "Thanks for your interest! Let me get you more details about that product."
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "bot_paused": true,
    "auto_paused": true
  },
  "message": "Message sent"
}
```

**Behavior:**
- If the bot was already paused, `auto_paused` is `false`
- If the bot was running, it's auto-paused and `auto_paused` is `true`
- Message is logged with `sender: "admin"` in the message log
- Conversation history is updated (limited to last 20 turns)
- Requires a valid WhatsApp provider (Meta Cloud) configured under Settings → WhatsApp

**Error cases:**
- `400`: Message text is required or empty
- `404`: Session not found
- `503`: No WhatsApp provider is available

---

## FAQ Management

### GET /whatsapp-storefront/faqs - List FAQs

Retrieve all FAQ entries in sort order.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

```bash
curl -X GET "https://your-store-api.example.com/api/v1/whatsapp-storefront/faqs" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "faqs": [
      {
        "id": 1,
        "question": "What are your business hours?",
        "answer": "We're open Monday to Friday, 9am to 6pm.",
        "category": "General",
        "enabled": true,
        "sort_order": 0,
        "created_at": "2026-09-20T10:00:00.000Z",
        "updated_at": "2026-09-23T14:00:00.000Z"
      },
      {
        "id": 2,
        "question": "How long does shipping take?",
        "answer": "Standard shipping: 3-5 business days. Express: 1-2 business days.",
        "category": "Shipping",
        "enabled": true,
        "sort_order": 1,
        "created_at": "2026-09-20T10:05:00.000Z",
        "updated_at": "2026-09-23T14:00:00.000Z"
      }
    ]
  }
}
```

---

### POST /whatsapp-storefront/faqs - Create FAQ

Create a new FAQ entry. Sort order is auto-assigned to the end of the list.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `question` | string | Yes | FAQ question (trimmed) |
| `answer` | string | Yes | FAQ answer (trimmed) |
| `category` | string | No | Category label (optional) |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/whatsapp-storefront/faqs" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -d '{
    "question": "Do you offer international shipping?",
    "answer": "Yes, we ship to most countries in Africa.",
    "category": "Shipping"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "faq": {
      "id": 3,
      "question": "Do you offer international shipping?",
      "answer": "Yes, we ship to most countries in Africa.",
      "category": "Shipping",
      "enabled": true,
      "sort_order": 2,
      "created_at": "2026-09-23T15:00:00.000Z",
      "updated_at": "2026-09-23T15:00:00.000Z"
    }
  }
}
```

---

### PUT /whatsapp-storefront/faqs/reorder - Reorder FAQs

Update sort order for multiple FAQ entries atomically within a transaction.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/whatsapp-storefront/faqs/reorder" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -d '{
    "order": [
      { "id": 2, "sort_order": 0 },
      { "id": 1, "sort_order": 1 },
      { "id": 3, "sort_order": 2 }
    ]
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "FAQs reordered"
}
```

**Field Reference:**

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `order` | array | Yes | Array of `{ id, sort_order }` objects |
| `order[].id` | integer | Yes | FAQ id |
| `order[].sort_order` | integer | Yes | New sort order (0-indexed) |

---

### PUT /whatsapp-storefront/faqs/:id - Update FAQ

Update question, answer, category, enabled status, or sort order. Unspecified fields are not changed.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/whatsapp-storefront/faqs/1" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=your_session_cookie" \
  -d '{
    "question": "What are your updated business hours?",
    "enabled": true
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "faq": {
      "id": 1,
      "question": "What are your updated business hours?",
      "answer": "We're open Monday to Friday, 9am to 6pm.",
      "category": "General",
      "enabled": true,
      "sort_order": 0,
      "created_at": "2026-09-20T10:00:00.000Z",
      "updated_at": "2026-09-23T16:00:00.000Z"
    }
  }
}
```

---

### DELETE /whatsapp-storefront/faqs/:id - Delete FAQ

Remove an FAQ entry permanently.

**Auth:** Admin session only.

**Addon:** WhatsApp Storefront — returns 503 when switched off.

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/whatsapp-storefront/faqs/1" \
  -H "Cookie: shopflow.sid=your_session_cookie"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "FAQ deleted"
}
```
