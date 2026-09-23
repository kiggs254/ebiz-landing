AI Image generation and enhancement enables merchants to automatically create and improve product photos using Google Gemini vision AI. This addon generates text-to-image, enhances existing images, and auto-generates alt text via the admin dashboard.

**Addon:** AI Image — returns 503 when switched off. Must be enabled under Settings → Addons → AI Image Generation.

**Auth:** Admin session required. All endpoints require `products.manage` or `settings.manage` permissions.

---

## Configuration

### GET /ai-image/config - Get Configuration

Retrieve the current AI Image addon configuration. The API key is masked for security. This endpoint is always accessible, even when the addon is disabled, allowing the Settings UI to display the current state and toggle immediately.

**Auth:** Admin session required.

**Example Request:**

```bash
curl -X GET "https://your-store-api.example.com/api/v1/ai-image/config" \
  -H "Cookie: shopflow.sid=abc123def456"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "config": {
      "enabled": true,
      "api_key": "••••••••••••••••••••••••",
      "api_key_set": true,
      "model": "gemini-2.0-flash",
      "aspect_ratio": "1:1",
      "generate_prompt_template": "A professional product photo of a {name}",
      "enhance_prompt_template": "Enhance the quality and clarity of this {category} product image",
      "max_bulk_size": 100,
      "valid_aspect_ratios": ["1:1", "16:9", "9:16"],
      "default_model": "gemini-2.0-flash"
    }
  }
}
```

**Field Reference:**

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | boolean | Master toggle for the addon |
| `api_key` | string | Masked API key (write-only on PUT) |
| `api_key_set` | boolean | True if a key is configured |
| `model` | string | Google Gemini model ID (e.g., gemini-2.0-flash) |
| `aspect_ratio` | string | Default image aspect ratio: 1:1, 16:9, or 9:16 |
| `generate_prompt_template` | string | Template for text-to-image generation; supports `{name}`, `{category}`, `{brand}`, `{description}` |
| `enhance_prompt_template` | string | Template for image enhancement |
| `max_bulk_size` | integer | Maximum products per bulk operation (1–5000) |

**Gotchas:**
- The API key is always masked (`api_key_set` tells you if one is configured).
- This endpoint never returns 503 when the addon is disabled; others do.

---

### PUT /ai-image/config - Update Configuration

Update AI Image addon settings. The server accepts allowlisted keys and coerces values appropriately.

**Auth:** Admin session required (settings.manage permission).

**Request Body:**

```json
{
  "ai_image_gemini_api_key": "AIzaSy...",
  "ai_image_gemini_model": "gemini-2.0-flash",
  "ai_image_aspect_ratio": "1:1",
  "ai_image_generate_prompt_template": "A professional product photo of a {name}",
  "ai_image_enhance_prompt_template": "Enhance the quality of this {category} product image",
  "ai_image_max_bulk_size": 100
}
```

**Field Reference:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `ai_image_gemini_api_key` | string | No | Google Gemini API key (write-only; never returned on GET). Masked keys are not overwritten. |
| `ai_image_gemini_model` | string | No | Model ID (defaults to `gemini-2.0-flash` if empty) |
| `ai_image_aspect_ratio` | string | No | One of: `1:1`, `16:9`, `9:16` (defaults to `1:1` if invalid) |
| `ai_image_generate_prompt_template` | string | No | Template for generation (defaults if empty) |
| `ai_image_enhance_prompt_template` | string | No | Template for enhancement (defaults if empty) |
| `ai_image_max_bulk_size` | integer | No | 1–5000, clamped to valid range if outside |

**Example Request:**

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/ai-image/config" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=abc123def456" \
  -d '{
    "ai_image_gemini_api_key": "AIzaSy...",
    "ai_image_enabled": true
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "written": 2
  }
}
```

**Gotchas:**
- Empty values and masked keys (when admin saves without retyping) are silently skipped, not overwritten.
- This endpoint is accessible even when the addon is disabled, allowing setup before enabling.
- You can test the key without enabling the addon using the `/test` endpoint.

---

### POST /ai-image/test - Test Key Validity

Perform a one-shot test image generation to validate the configured Gemini API key and model. The image is not persisted. Useful before enabling the addon.

**Auth:** Admin session required (settings.manage permission).

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/ai-image/test" \
  -H "Cookie: shopflow.sid=abc123def456"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "ok": true,
    "image_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "mime_type": "image/png",
    "model": "gemini-2.0-flash"
  }
}
```

**Error Responses:**

| Status | Code | Meaning |
|--------|------|---------|
| 400 | `no_key` | No Gemini API key configured |
| 400 | `no_model` | No model specified |
| 422 | (implicit) | Generation rejected by safety filter (contains prohibited content) |
| 429 | (implicit) | Quota exceeded on the Gemini API |
| 502 | (implicit) | Upstream API error or network failure |

**Gotchas:**
- Test runs with the addon "enabled" regardless of the master toggle, so you can validate a key before flipping the toggle on.
- No request body; the test uses a simple prompt.

---

## Product Image Operations

### POST /ai-image/products/:id/images/generate - Generate Image from Text

Generate a new product image from a text prompt using Gemini. The image is returned as base64 but not saved to the product's gallery — call `/apply` to upload to S3, then update the product via the form editor.

**Auth:** Admin session required (products.manage permission).

**Addon:** Requires AI Image addon enabled (returns 503 otherwise).

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID |

**Request Body:**

```json
{
  "prompt": "A professional studio photo of a coffee mug on a white background, well-lit"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `prompt` | string | No | Custom text prompt. If omitted, the server renders the template using product metadata: `{name}`, `{description}`, `{category}`, `{brand}`, `{sku}`. |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/ai-image/products/42/images/generate" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=abc123def456" \
  -d '{
    "prompt": "A modern, minimalist product photo on a gradient background"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "product_id": 42,
    "prompt": "A modern, minimalist product photo on a gradient background",
    "preview_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "mime_type": "image/png"
  }
}
```

**Error Responses:**

| Status | Code | Meaning |
|--------|------|---------|
| 400 | - | Invalid product ID or invalid input |
| 404 | - | Product not found |
| 422 | - | Safety filter rejected the prompt (depicts violence, hate, etc.) |
| 429 | - | Gemini API quota exceeded |
| 502 | - | Upstream error (network, API failure) |
| 503 | - | AI Image addon is disabled |

**Gotchas:**
- The returned image is base64, not a URL. Use `/apply` to persist it and get a URL.
- If you omit `prompt`, the server uses the configured template with product metadata. Variables like `{name}` are case-insensitive in the template.
- Safety filter rejections (422) are intentional; the API will not generate images that violate Gemini's policies.

---

### POST /ai-image/products/:id/images/enhance - Enhance Existing Image

Enhance an existing product image (from S3, URL, or upload) using Gemini vision. The enhanced image is returned as base64 without persisting it — call `/apply` to save.

**Auth:** Admin session required (products.manage permission).

**Addon:** Requires AI Image addon enabled (returns 503 otherwise).

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID |

**Request Body:**

```json
{
  "source_url": "https://s3.example.com/products/original-image.jpg",
  "prompt": "Enhance colors and clarity, improve product visibility"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `source_url` | string (URL) | Yes | Public URL of the image to enhance (e.g., S3, CDN) |
| `prompt` | string | No | Custom enhancement instructions. If omitted, uses the configured enhance template with product metadata. |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/ai-image/products/42/images/enhance" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=abc123def456" \
  -d '{
    "source_url": "https://s3.example.com/products/coffee-mug-raw.jpg",
    "prompt": "Enhance the colors and make the product pop on the background"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "product_id": 42,
    "source_url": "https://s3.example.com/products/coffee-mug-raw.jpg",
    "prompt": "Enhance the colors and make the product pop on the background",
    "preview_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "mime_type": "image/png"
  }
}
```

**Error Responses:**

| Status | Code | Meaning |
|--------|------|---------|
| 400 | - | Invalid product ID, missing source_url, or URL is unreachable/invalid |
| 404 | - | Product not found |
| 422 | - | Safety filter rejected the enhanced result |
| 429 | - | Gemini API quota exceeded |
| 502 | - | Upstream error (failed to fetch image from URL, API failure) |
| 503 | - | AI Image addon is disabled |

**Gotchas:**
- The `source_url` must be publicly accessible (Gemini vision API downloads it).
- Private S3 URLs require public read access or signed URLs.
- The enhanced image is base64; use `/apply` to upload and get a URL.
- If you omit `prompt`, the server uses the enhance template with product metadata.

---

### POST /ai-image/products/:id/images/apply - Save Generated Image to S3

Upload a base64-encoded image (from `/generate` or `/enhance`) to S3 and return its public URL. Does NOT write to the product's image gallery — the admin form editor manages the gallery as client state and persists it on Save.

**Auth:** Admin session required (products.manage permission).

**Addon:** Requires AI Image addon enabled (returns 503 otherwise).

**Path Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | integer | Yes | Product ID |

**Request Body:**

```json
{
  "preview_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "mime_type": "image/png"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `preview_base64` | string | Yes | Base64-encoded image data (from `/generate` or `/enhance`) |
| `mime_type` | string | No | MIME type (`image/png`, `image/jpeg`, `image/webp`). Defaults to `image/png`. |

**Example Request:**

```bash
curl -X POST "https://your-store-api.example.com/api/v1/ai-image/products/42/images/apply" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=abc123def456" \
  -d '{
    "preview_base64": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
    "mime_type": "image/png"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "url": "https://cdn.example.com/products/ai-coffee-mug-42-1702468800000.png",
    "key": "products/ai/ai-coffee-mug-42-1702468800000.png",
    "size": 4096
  }
}
```

**Error Responses:**

| Status | Code | Meaning |
|--------|------|---------|
| 400 | - | Invalid product ID, missing preview_base64, or empty decoded image |
| 404 | - | Product not found |
| 503 | - | AI Image addon is disabled |

**Gotchas:**
- This endpoint does **not** add the image to `product.images` — that happens when the admin saves the product form with the new URL in the gallery.
- The filename is generated as `ai-{slug}-{timestamp}.{ext}` and uploaded to S3 under `products/ai/`.
- Response status is **201 Created**, not 200.

---

## Integration Example: Full Workflow

1. **Generate or enhance an image:**
   ```bash
   # Generate from text
   POST /api/v1/ai-image/products/42/images/generate
   { "prompt": "..." }
   # → { "preview_base64": "..." }
   
   # OR enhance existing
   POST /api/v1/ai-image/products/42/images/enhance
   { "source_url": "https://...", "prompt": "..." }
   # → { "preview_base64": "..." }
   ```

2. **Upload the preview to S3:**
   ```bash
   POST /api/v1/ai-image/products/42/images/apply
   { "preview_base64": "<from step 1>" }
   # → { "url": "https://cdn.example.com/...", "key": "...", "size": ... }
   ```

3. **Update the product form with the new URL** (via the regular PUT /products/:id endpoint) and save the product to persist the image in the gallery.

---

## Bulk Operations

The admin UI also supports bulk image generation and enhancement:
- **POST /products/bulk-generate-ai** — Generate images for multiple products in a background queue.
- **POST /products/bulk-enhance-images** — Enhance images for multiple products.
- **POST /products/bulk-generate-image-alt** — Auto-generate alt text for images.
- **GET /products/ai-generation-status** — Poll the status of queued bulk jobs.

See the **Products** section for details on these bulk endpoints.

---

## Configuration Best Practices

- **Aspect Ratio:** Choose the aspect ratio that fits your product catalog (e.g., `1:1` for square tiles, `16:9` for hero sections).
- **Prompt Templates:** Customize templates to match your brand voice. Use placeholders like `{name}`, `{category}`, `{brand}`, `{description}`, `{sku}`.
- **API Key:** Store your Gemini API key securely. Never share the key via email or logs. Rotate periodically.
- **Bulk Size:** Set `max_bulk_size` to a reasonable limit (default 100) to avoid long-running operations.

---

## Costs & Quotas

- Google Gemini API charges per image generation and enhancement call.
- Monitor your quota in the [Google Cloud Console](https://console.cloud.google.com).
- Bulk operations can incur significant costs if you process thousands of products; test on a small sample first.
