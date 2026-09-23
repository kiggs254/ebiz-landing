A general-purpose chat completion endpoint for staff tools inside the admin: product copy, replies,
summaries. It forwards a conversation to the configured provider and returns the reply as plain text.

This is **not** the AI Search addon — that lives on its own page and powers storefront search. This endpoint
has no addon toggle; it works whenever a provider key is configured on the server (`OPENAI_API_KEY` or
`DEEPSEEK_API_KEY`).

**Auth:** admin session only. **Rate limit:** 30 requests per user per 5 minutes, then `429`.

---

### POST /ai/chat - Send messages to AI and receive responses

Call this endpoint to send a conversation to an AI provider and receive a generated response. The AI provider, model, and system prompt can be customized per request or will fall back to store settings.

**Auth:** Admin session only (requires `requireAuth` middleware)

**Rate limit:** 30 requests per 5 minutes per user

**Prerequisites:**
- An API key must be configured for the selected provider:
  - OpenAI: set `OPENAI_API_KEY` environment variable
  - DeepSeek: set `DEEPSEEK_API_KEY` environment variable
- At least one API key provider must be configured for this endpoint to work

```bash
curl -X POST "https://your-store-api.example.com/api/v1/ai/chat" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Write a short product description for a blue t-shirt"
      }
    ],
    "provider": "openai",
    "model": "gpt-4o-mini",
    "systemPrompt": "You are a helpful e-commerce assistant."
  }'
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `messages` | Array | Yes | Array of message objects in the conversation. Each message must have `role` (user, assistant, or system) and `content` (text). Minimum one message. |
| `provider` | String | No | The AI provider: `"openai"` or `"deepseek"`. Defaults to store's `ai_provider` setting, or `"openai"` if not configured. |
| `model` | String | No | The model identifier (e.g., `"gpt-4o-mini"` for OpenAI, `"deepseek-chat"` for DeepSeek). Defaults to store's `ai_model` setting or the provider's default. |
| `systemPrompt` | String | No | Custom system prompt to control assistant behavior. Defaults to store's `ai_system_prompt` setting, or `"You are a helpful assistant."` if not set. |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "message": "This vibrant blue t-shirt is a perfect wardrobe staple. Made from soft, breathable cotton, it offers comfort and style for any occasion. Whether you're dressing it up with a blazer or down with jeans, this versatile piece transitions seamlessly from casual to semi-formal settings.",
    "provider": "openai",
    "model": "gpt-4o-mini"
  }
}
```

**Error Responses:**

| Status | Scenario |
| --- | --- |
| `400` | Missing or empty `messages` array. At least one message is required. |
| `401` | Not authenticated as an admin. Session cookie missing or invalid. |
| `429` | Rate limit exceeded (30 requests per 5 minutes). Retry after the window resets. |
| `500` | Missing or invalid API key for the selected provider, or the provider returned an unexpected response. Check environment variables and provider configuration. |
