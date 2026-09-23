## Overview

The Blog API enables you to manage blog posts for your storefront. Blog posts are drafted and published through the admin, then displayed on the storefront via `GET /storefront/blogs`. All blog endpoints require admin session authentication and appropriate permissions (`appearance:view` for reading, `appearance:manage` for writing).

## Reading Blog Posts

### GET /blog - List blog posts

Retrieve paginated blog posts with optional search and status filtering.

**Auth:** Admin session with `appearance:view` permission

```bash
curl -X GET "https://your-store-api.example.com/api/v1/blog?page=1&limit=25&status=published" \
  -H "Cookie: shopflow.sid=session_token_here"
```

| Query param | Type | Required | Description |
| --- | --- | --- | --- |
| `page` | integer | No | Page number (default: 1, min: 1) |
| `limit` | integer | No | Posts per page (default: 25, max: 100) |
| `status` | string | No | Filter: `draft`, `published`, or `all` (default: all) |
| `search` | string | No | Search by title, excerpt, or category (case-insensitive) |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "posts": [
      {
        "id": 1,
        "title": "How to Use Our Products",
        "slug": "how-to-use-our-products",
        "excerpt": "A quick guide to getting the most from our offerings",
        "content": "<h2>Introduction</h2><p>Welcome to our guide...</p><div data-product-card data-product-id=\"42\"></div>",
        "cover_image": "https://cdn.example.com/cover.jpg",
        "category": "Tips & Tricks",
        "status": "published",
        "seo_title": "Our Product Guide | E-biz",
        "seo_description": "Learn how to maximize value from E-biz products",
        "reading_minutes": 5,
        "author_id": 10,
        "published_at": "2026-03-01T10:00:00.000Z",
        "created_at": "2026-02-28T14:30:00.000Z",
        "updated_at": "2026-03-01T10:00:00.000Z"
      }
    ],
    "total": 12,
    "page": 1,
    "totalPages": 1
  }
}
```

**Gotchas:**
- Results are ordered by `created_at` descending (newest first)
- The `search` filter is case-insensitive and matches against title, excerpt, and category
- If `status` is omitted or `all`, both draft and published posts are returned

---

### GET /blog/:id - Get a single blog post

Retrieve a blog post by its ID.

**Auth:** Admin session with `appearance:view` permission

```bash
curl -X GET "https://your-store-api.example.com/api/v1/blog/1" \
  -H "Cookie: shopflow.sid=session_token_here"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "post": {
      "id": 1,
      "title": "How to Use Our Products",
      "slug": "how-to-use-our-products",
      "excerpt": "A quick guide to getting the most from our offerings",
      "content": "<h2>Introduction</h2><p>Welcome...</p>",
      "cover_image": "https://cdn.example.com/cover.jpg",
      "category": "Tips & Tricks",
      "status": "published",
      "seo_title": "Our Product Guide | E-biz",
      "seo_description": "Learn how to maximize value",
      "reading_minutes": 5,
      "author_id": 10,
      "published_at": "2026-03-01T10:00:00.000Z",
      "created_at": "2026-02-28T14:30:00.000Z",
      "updated_at": "2026-03-01T10:00:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404` - Blog post not found
- `401` - Unauthorized (no session)
- `403` - Forbidden (insufficient permissions)

---

## Creating Blog Posts

### POST /blog - Create a blog post

Create a new blog post (draft or published). The slug is auto-generated from the title if not provided; if a collision is detected, a numeric suffix (-1, -2, etc.) is added. Reading time is calculated automatically from the HTML content.

**Auth:** Admin session with `appearance:manage` permission

```bash
curl -X POST "https://your-store-api.example.com/api/v1/blog" \
  -H "Cookie: shopflow.sid=session_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Spring Collection Tips",
    "excerpt": "Make the most of our spring lineup",
    "content": "<h2>Introduction</h2><p>As spring arrives...</p>",
    "cover_image": "https://cdn.example.com/spring.jpg",
    "category": "Collections",
    "status": "draft",
    "seo_title": "Spring Collection Guide",
    "seo_description": "Tips for using our spring products"
  }'
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | Yes | Post title |
| `slug` | string | No | URL slug (auto-generated from title if omitted; collisions are auto-suffixed) |
| `excerpt` | string | No | Short summary |
| `content` | string | No | Post body as HTML (optional; reading time is calculated from this) |
| `cover_image` | string | No | Cover image URL |
| `category` | string | No | Category name (default: "General") |
| `status` | string | No | `draft` or `published` (default: `draft`) |
| `seo_title` | string | No | SEO title |
| `seo_description` | string | No | SEO meta description |

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "post": {
      "id": 42,
      "title": "Spring Collection Tips",
      "slug": "spring-collection-tips",
      "excerpt": "Make the most of our spring lineup",
      "content": "<h2>Introduction</h2><p>As spring arrives...</p>",
      "cover_image": "https://cdn.example.com/spring.jpg",
      "category": "Collections",
      "status": "draft",
      "seo_title": "Spring Collection Guide",
      "seo_description": "Tips for using our spring products",
      "reading_minutes": 3,
      "author_id": 10,
      "published_at": null,
      "created_at": "2026-03-15T11:45:00.000Z",
      "updated_at": "2026-03-15T11:45:00.000Z"
    }
  }
}
```

**Error Responses:**
- `400` - Missing required `title` field
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)

**Gotchas:**
- If `status` is omitted or not `published`, the post defaults to `draft`.
- `published_at` is `null` for drafts and set to the current time when first published.
- Reading time is computed from HTML content; empty posts default to 1 minute.
- The `author_id` is automatically set to the authenticated user's ID.

---

## Updating Blog Posts

### PUT /blog/:id - Update a blog post

Update an existing blog post. All fields are optional; only provided fields are updated. When transitioning to published, if `published_at` is `null`, it is set to the current date; an existing timestamp is never overwritten.

**Auth:** Admin session with `appearance:manage` permission

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/blog/42" \
  -H "Cookie: shopflow.sid=session_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "published",
    "seo_title": "Updated SEO Title"
  }'
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `title` | string | No | Update post title |
| `slug` | string | No | Update URL slug (collision check applied) |
| `excerpt` | string | No | Update excerpt |
| `content` | string | No | Update body HTML (reading time recalculated) |
| `cover_image` | string | No | Update cover image URL |
| `category` | string | No | Update category |
| `status` | string | No | `draft` or `published` |
| `seo_title` | string | No | Update SEO title |
| `seo_description` | string | No | Update SEO meta description |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "post": {
      "id": 42,
      "title": "Spring Collection Tips",
      "slug": "spring-collection-tips",
      "status": "published",
      "seo_title": "Updated SEO Title",
      "published_at": "2026-03-15T12:30:00.000Z",
      "updated_at": "2026-03-15T12:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `404` - Blog post not found
- `401` - Unauthorized
- `403` - Forbidden

**Gotchas:**
- Publishing a draft (status transition to `published`) stamps `published_at` only if it was `null`; edits to an already-published post preserve the original publish timestamp.
- If you provide a new `slug` or update `title`, a collision check is performed (and auto-suffix applied if needed).
- Reading time is recalculated when `content` changes.

---

## Deleting Blog Posts

### DELETE /blog/:id - Delete a blog post

Permanently remove a blog post.

**Auth:** Admin session with `appearance:manage` permission

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/blog/42" \
  -H "Cookie: shopflow.sid=session_token_here"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Blog post deleted"
}
```

**Error Responses:**
- `404` - Blog post not found
- `401` - Unauthorized
- `403` - Forbidden

---

## AI-Powered Blog Generation

### POST /blog/generate - Generate a blog post with AI

Automatically draft a blog post using your configured AI provider (OpenAI or Deepseek). Supply a subject and optionally reference products to showcase. The AI generates HTML content with product placeholders (e.g., `{{PRODUCT_1}}`), which are replaced server-side with canonical product-card divs before being returned. Unmatched placeholders are stripped.

**Auth:** Admin session with `appearance:manage` permission

```bash
curl -X POST "https://your-store-api.example.com/api/v1/blog/generate" \
  -H "Cookie: shopflow.sid=session_token_here" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Summer care tips for outdoor enthusiasts",
    "tone": "informative and inspiring",
    "category": "Care Guides",
    "product_ids": [15, 42, 88]
  }'
```

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `subject` | string | Yes | Topic for the blog post (what it should be about) |
| `tone` | string | No | Writing tone (default: "friendly and informative") |
| `category` | string | No | Category name to include in the prompt |
| `product_ids` | array | No | Product IDs to showcase; order is preserved |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "title": "Maximize Your Summer Adventures: Expert Tips",
    "excerpt": "Discover how our products enhance your outdoor experience this season.",
    "content": "<h2>Introduction</h2><p>Summer is the perfect time to explore...</p><div data-product-card data-product-id=\"15\"></div><p>This product offers...</p>",
    "seo_title": "Summer Care Tips for Outdoor Enthusiasts",
    "seo_description": "Expert advice on using our products for summer adventures and outdoor activities."
  }
}
```

**Error Responses:**
- `400` - Missing or empty `subject`
- `401` - Unauthorized
- `403` - Forbidden
- `500` - AI provider error (misconfiguration or API failure)

**Gotchas:**
- The AI is instructed to place product placeholders (e.g., `{{PRODUCT_2}}`) on their own line and to use each only once.
- All product IDs must exist; invalid IDs are silently dropped (no error).
- The AI output is not saved; use the response to populate the editor, then call `POST /blog` to create the post.
- If `status` is not provided on subsequent creation, the post defaults to draft.
- The returned `content` includes product-card divs (e.g., `<div data-product-card data-product-id="15"></div>`), which are rendered by the storefront as live product cards.
- Any leftover unmatched placeholders (e.g., if the AI references `{{PRODUCT_99}}` but only 3 products were provided) are stripped before returning.

---

## Storefront Display

Published blog posts are available to your storefront via the public API at `GET /storefront/blogs`. The storefront can render posts with embedded product cards, and customers can browse blog content by category or search. Blog posts marked as `draft` are never visible to storefront customers.
