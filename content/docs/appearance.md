Manage your store's appearance, themes, content, and branding. The Appearance API covers storefront layout (themes, banners, menus), pages and SEO content, shop settings, and an optional AI-powered Appearance Agent for generating pages and products. All endpoints require admin session authentication unless otherwise noted.

**Addon:** Appearance Agent (`ai_appearance_agent_enabled`) — agent-specific endpoints return 503 when disabled. Other endpoints function independently of addon status.

---

## Themes

Themes control the overall look and feel of the storefront. Each store can have multiple themes, with exactly one active at any time. A public endpoint lets storefronts fetch the active theme without authentication.

### GET /themes/active - Get active theme

Retrieves the currently active theme. If no theme is active, returns the default theme. This endpoint is public and used by storefronts to fetch the active theme without authentication.

**Auth:** Public (no authentication required)

```bash
curl https://your-store-api.example.com/api/v1/themes/active
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "theme": {
      "id": 1,
      "name": "modern",
      "display_name": "Modern Theme",
      "description": "A modern and clean storefront theme",
      "version": "2.0.0",
      "is_active": true,
      "config_json": {
        "primary_color": "#2563eb",
        "fonts": "inter"
      },
      "component_overrides_json": {},
      "preview_image_url": "https://s3.example.com/themes/modern-preview.jpg",
      "components": [
        {
          "id": 1,
          "theme_id": 1,
          "component_name": "hero_banner",
          "component_path": "components/HeroBanner.tsx",
          "props_schema_json": {},
          "created_at": "2025-01-15T10:30:00Z",
          "updated_at": "2025-01-15T10:30:00Z"
        }
      ],
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T12:00:00Z"
    }
  }
}
```

**Gotchas:**
- If no theme is active, the endpoint returns the default theme (name: "default") instead of null.
- Storefronts should not assume an active theme is set; always handle the fallback case.

---

### GET /themes - List all themes

Retrieves all themes in the store, sorted by is_active (active first) and creation date (newest first). Only authenticated admin users can access this.

**Auth:** Admin session only

```bash
curl -b cookies.txt https://your-store-api.example.com/api/v1/themes
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "themes": [
      {
        "id": 1,
        "name": "modern",
        "display_name": "Modern Theme",
        "is_active": true,
        "version": "2.0.0",
        "components": []
      },
      {
        "id": 2,
        "name": "classic",
        "display_name": "Classic Theme",
        "is_active": false,
        "version": "1.0.0",
        "components": []
      }
    ]
  }
}
```

---

### GET /themes/:id - Get theme details

Retrieves a single theme by ID, including all its components and configuration.

**Auth:** Admin session only

```bash
curl -b cookies.txt https://your-store-api.example.com/api/v1/themes/1
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "theme": {
      "id": 1,
      "name": "modern",
      "display_name": "Modern Theme",
      "description": "A modern storefront theme",
      "version": "2.0.0",
      "is_active": true,
      "config_json": {
        "primary_color": "#2563eb"
      },
      "component_overrides_json": {},
      "preview_image_url": "https://s3.example.com/themes/modern.jpg",
      "components": [],
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-15T12:00:00Z"
    }
  }
}
```

**Status codes:**
- `404` Theme not found

---

### POST /themes - Create theme

Creates a new theme. The name must be unique and both name and display_name are required. New themes are inactive by default.

`config_json` is stored and returned exactly as sent — the server defines no keys inside it, so the `primary_color` shown in these examples is only an illustration of what a storefront theme might keep there.

**Auth:** Admin session only

```bash
curl -X POST -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "name": "minimal",
    "display_name": "Minimal Theme",
    "description": "A minimal, fast-loading theme",
    "version": "1.0.0",
    "config_json": {
      "primary_color": "#000000"
    }
  }' \
  https://your-store-api.example.com/api/v1/themes
```

**Request fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Unique identifier for the theme |
| `display_name` | string | Yes | Human-readable theme name |
| `description` | string | No | Optional description |
| `version` | string | No | Version string (defaults to 1.0.0) |
| `config_json` | object | No | Theme configuration as JSON |
| `component_overrides_json` | object | No | Component overrides |
| `preview_image_url` | string | No | URL to preview image |

**Validation:**
- `name` and `display_name` are required; 400 if missing.
- `name` must be unique; 409 if a theme with that name exists.

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "theme": {
      "id": 3,
      "name": "minimal",
      "display_name": "Minimal Theme",
      "is_active": false,
      "config_json": {
        "primary_color": "#000000"
      },
      "components": [],
      "created_at": "2025-01-16T14:30:00Z",
      "updated_at": "2025-01-16T14:30:00Z"
    }
  }
}
```

**Gotchas:**
- New themes are always created with `is_active: false`. Activate them with `POST /themes/:id/activate`.
- The storefront cache is invalidated after theme creation.

---

### PUT /themes/:id - Update theme

Updates an existing theme. All fields are optional; only provided fields are updated.

**Auth:** Admin session only

```bash
curl -X PUT -b cookies.txt \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Modern v2",
    "version": "2.1.0",
    "config_json": {
      "primary_color": "#1e40af"
    }
  }' \
  https://your-store-api.example.com/api/v1/themes/1
```

**Status codes:**
- `404` Theme not found
- `409` New name already exists

**Gotchas:**
- The storefront cache is invalidated after theme update.

---

### DELETE /themes/:id - Delete theme

Deletes a theme and all its components. Cannot delete an active theme.

**Auth:** Admin session only

```bash
curl -X DELETE -b cookies.txt \
  https://your-store-api.example.com/api/v1/themes/3
```

**Validation:**
- Cannot delete an active theme. 400 if attempted.

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "message": "Theme deleted successfully"
  }
}
```

**Status codes:**
- `400` Cannot delete active theme
- `404` Theme not found

**Gotchas:**
- Must deactivate a theme before deleting it.
- Theme components are deleted via CASCADE.
- The storefront cache is invalidated after theme deletion.

---

### POST /themes/:id/activate - Activate theme

Activates a theme and deactivates all other themes. Updates shop_settings with the active theme ID. The storefront immediately uses the new active theme.

**Auth:** Admin session only

```bash
curl -X POST -b cookies.txt \
  https://your-store-api.example.com/api/v1/themes/2/activate
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "theme": {
      "id": 2,
      "name": "classic",
      "display_name": "Classic Theme",
      "version": "1.0.0",
      "is_active": true,
      "config_json": {},
      "component_overrides_json": {},
      "preview_image_url": null,
      "components": [],
      "created_at": "2025-01-15T11:00:00Z",
      "updated_at": "2025-01-16T15:00:00Z"
    }
  }
}
```

**Status codes:**
- `404` Theme not found

**Gotchas:**
- Only one theme can be active at a time. Activating a theme deactivates all others automatically.
- The storefront cache is invalidated after theme activation.

---

### POST /themes/:id/deactivate - Deactivate theme

Deactivates a theme. The active_theme_id is removed from shop_settings. If this is the only active theme, ensure another is activated via `POST /themes/:id/activate` before deactivating.

**Auth:** Admin session only

```bash
curl -X POST -b cookies.txt \
  https://your-store-api.example.com/api/v1/themes/1/deactivate
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "theme": {
      "id": 1,
      "name": "modern",
      "display_name": "Modern Theme",
      "version": "2.0.0",
      "is_active": false,
      "config_json": {},
      "component_overrides_json": {},
      "preview_image_url": null,
      "components": [],
      "created_at": "2025-01-15T10:00:00Z",
      "updated_at": "2025-01-16T15:30:00Z"
    }
  }
}
```

**Status codes:**
- `404` Theme not found

**Gotchas:**
- Deactivating does not affect other themes.
- The storefront cache is invalidated after theme deactivation.
- If no theme is active, GET /themes/active returns the default theme.

---

## Pages

Custom pages are user-created content that appears on the storefront. Pages can be published or kept as drafts, and optionally added to footer navigation groups.

### GET /appearance/pages - List all pages

Retrieve all custom pages. Pages are ordered alphabetically by title. These pages appear on the storefront (if published) and can be linked from menus.

**Auth:** Admin session only

```bash
curl -X GET "https://your-store-api.example.com/api/v1/appearance/pages" \
  -H "Cookie: connect.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "pages": [
      {
        "id": 1,
        "title": "Privacy Policy",
        "slug": "privacy-policy",
        "content": "<h1>Privacy Policy</h1><p>Your data is safe...</p>",
        "meta_description": "Our privacy policy",
        "status": "published",
        "footer_group": "company",
        "created_at": "2026-09-23T10:00:00Z",
        "updated_at": "2026-09-23T10:00:00Z"
      }
    ]
  }
}
```

---

### POST /appearance/pages - Create a page

Create a new custom page. Slug must be unique and is used in the page URL on the storefront.

**Auth:** Admin session with appearance:manage permission

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Page title |
| `slug` | string | Yes | URL-friendly slug (must be unique, e.g., "privacy-policy") |
| `content` | string | Yes | HTML or markdown page content |
| `meta_description` | string | No | SEO meta description |
| `status` | string | No | "draft" or "published" (default: "draft") |
| `footer_group` | string | No | "none", "support", or "company" (default: "none") — groups the page in the footer |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/appearance/pages" \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Privacy Policy",
    "slug": "privacy-policy",
    "content": "<h1>Privacy Policy</h1><p>Your data is safe...</p>",
    "meta_description": "Our privacy policy",
    "status": "draft",
    "footer_group": "company"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "page": {
      "id": 1,
      "title": "Privacy Policy",
      "slug": "privacy-policy",
      "content": "<h1>Privacy Policy</h1><p>Your data is safe...</p>",
      "meta_description": "Our privacy policy",
      "status": "draft",
      "footer_group": "company",
      "created_at": "2026-09-23T10:00:00Z",
      "updated_at": "2026-09-23T10:00:00Z"
    }
  }
}
```

**Error Responses:**
- `400`: Validation error (title, slug, content required; slug must be unique)
- `403`: Insufficient permissions

**Gotchas:**
- Slugs are case-sensitive and should be lowercase with hyphens.
- Changing a published page's slug may break existing links; use redirects.

---

### PUT /appearance/pages/:id - Update a page

Update a page's title, content, slug, or publishing status.

**Auth:** Admin session with appearance:manage permission

**Request Body:**

All fields are optional.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/appearance/pages/1" \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "published",
    "content": "<h1>Privacy Policy</h1><p>Updated content...</p>"
  }'
```

**Error Responses:**
- `404`: Page not found
- `403`: Insufficient permissions

---

### DELETE /appearance/pages/:id - Delete a page

Remove a custom page. Links to the page on the storefront will break unless you remove them first.

**Auth:** Admin session with appearance:manage permission

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/appearance/pages/1" \
  -H "Cookie: connect.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "deleted": true
  }
}
```

**Error Responses:**
- `404`: Page not found
- `403`: Insufficient permissions

---

## Banners

Promotional banners appear on the storefront hero section or other positions. Banners can have start and end dates; those with expired end dates are automatically marked inactive.

### GET /appearance/banners - List all banners

Retrieve all storefront banners. The endpoint automatically marks expired banners (end_date has passed) as inactive and returns them in reverse chronological order.

**Auth:** Admin session only

```bash
curl -X GET "https://your-store-api.example.com/api/v1/appearance/banners" \
  -H "Cookie: connect.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "banners": [
      {
        "id": 1,
        "title": "Summer Sale",
        "image_url": "https://cdn.example.com/summer-sale.jpg",
        "link": "/products?tag=summer",
        "position": "hero",
        "status": "active",
        "start_date": "2026-09-23T00:00:00Z",
        "end_date": "2026-09-30T23:59:59Z",
        "created_at": "2026-09-23T10:00:00Z",
        "updated_at": "2026-09-23T10:00:00Z"
      }
    ]
  }
}
```

---

### POST /appearance/banners - Create a banner

Create a new storefront banner. Banners can have an optional end_date after which they are automatically marked as inactive. Creating a banner invalidates the storefront cache.

**Auth:** Admin session with appearance:manage permission

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Banner title (e.g., "Summer Sale") |
| `image_url` | string | Yes | URL of the banner image |
| `link` | string | No | URL the banner links to when clicked |
| `position` | string | Yes | Position on storefront (e.g., "hero") |
| `status` | string | No | "active" or "inactive" (default: "active") |
| `start_date` | datetime | Yes | When the banner becomes visible |
| `end_date` | datetime | No | When the banner expires (auto-marked inactive after) |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/appearance/banners" \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Summer Sale",
    "image_url": "https://cdn.example.com/summer-sale.jpg",
    "link": "/products?tag=summer",
    "position": "hero",
    "status": "active",
    "start_date": "2026-09-23T00:00:00Z",
    "end_date": "2026-09-30T23:59:59Z"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "banner": {
      "id": 1,
      "title": "Summer Sale",
      "image_url": "https://cdn.example.com/summer-sale.jpg",
      "link": "/products?tag=summer",
      "position": "hero",
      "status": "active",
      "start_date": "2026-09-23T00:00:00Z",
      "end_date": "2026-09-30T23:59:59Z",
      "created_at": "2026-09-23T10:00:00Z",
      "updated_at": "2026-09-23T10:00:00Z"
    }
  }
}
```

**Gotchas:**
- If `end_date` is in the past when you create/update, the banner is automatically marked as inactive when fetched.
- Storefront cache is invalidated on create/update/delete.

---

### PUT /appearance/banners/:id - Update a banner

Update an existing banner. Changes are reflected on the storefront immediately.

**Auth:** Admin session with appearance:manage permission

**Request Body:**

All fields from POST are optional. Only fields you provide are updated.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/appearance/banners/1" \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "banner": {}
  }
}
```

**Error Responses:**
- `404`: Banner not found
- `403`: Insufficient permissions

---

### DELETE /appearance/banners/:id - Delete a banner

Remove a banner. The storefront cache is invalidated.

**Auth:** Admin session with appearance:manage permission

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/appearance/banners/1" \
  -H "Cookie: connect.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "deleted": true
  }
}
```

**Error Responses:**
- `404`: Banner not found
- `403`: Insufficient permissions

---

## Navigation Menus

Navigation menus organize links on the storefront header and footer. Menus are positioned at specific locations and can contain nested items (submenus).

### GET /appearance/menus - List all menus

Retrieve all navigation menus with their menu items (including nested/child items). Menus are ordered by position, and items within menus are ordered by their configured sort order.

**Auth:** Admin session only

```bash
curl -X GET "https://your-store-api.example.com/api/v1/appearance/menus" \
  -H "Cookie: connect.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "menus": [
      {
        "id": 1,
        "title": "Footer Links",
        "position": "footer_col1",
        "status": "active",
        "items": [
          {
            "id": 10,
            "menu_id": 1,
            "label": "About Us",
            "link": "/about",
            "order": 0,
            "parent_id": null,
            "status": "active",
            "children": [
              {
                "id": 11,
                "menu_id": 1,
                "label": "Team",
                "link": "/about/team",
                "order": 0,
                "parent_id": 10,
                "status": "active",
                "children": []
              }
            ]
          }
        ],
        "created_at": "2026-09-23T10:00:00Z",
        "updated_at": "2026-09-23T10:00:00Z"
      }
    ]
  }
}
```

---

### POST /appearance/menus - Create a menu

Create a new navigation menu. Position must be unique among menus. Available positions include header and footer locations.

**Auth:** Admin session with appearance:manage permission

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | Yes | Menu name (e.g., "Footer Links") |
| `position` | string | Yes | Unique position: `header_after_categories`, `footer_col1`, `footer_col2`, `footer_col3`, `footer_bottom` |
| `status` | string | No | "active" or "inactive" (default: "active") |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/appearance/menus" \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Footer Links",
    "position": "footer_col1",
    "status": "active"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "menu": {
      "id": 1,
      "title": "Footer Links",
      "position": "footer_col1",
      "status": "active",
      "items": [],
      "created_at": "2026-09-23T10:00:00Z",
      "updated_at": "2026-09-23T10:00:00Z"
    }
  }
}
```

**Error Responses:**
- `400`: title and position are required
- `403`: Insufficient permissions

---

### PUT /appearance/menus/:id - Update a menu

Update a menu's title, position, or status. Changing position requires it to be unique.

**Auth:** Admin session with appearance:manage permission

**Request Body:**

All fields are optional.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/appearance/menus/1" \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "status": "inactive"
  }'
```

**Error Responses:**
- `404`: Menu not found
- `403`: Insufficient permissions

---

### DELETE /appearance/menus/:id - Delete a menu

Delete a menu and all its items (including nested children). The storefront cache is invalidated.

**Auth:** Admin session with appearance:manage permission

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/appearance/menus/1" \
  -H "Cookie: connect.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "deleted": true
  }
}
```

**Error Responses:**
- `404`: Menu not found
- `403`: Insufficient permissions

---

### POST /appearance/menus/:id/items - Create a menu item

Add an item to a menu. Items can be top-level or nested under another item (via `parent_id`), supporting multi-level navigation hierarchies.

**Auth:** Admin session with appearance:manage permission

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `label` | string | Yes | Item text (e.g., "About Us") |
| `link` | string | Yes | URL the item links to |
| `order` | number | No | Sort order within the menu or parent (default: 0) |
| `parent_id` | number | No | Parent item ID for nesting (creates a submenu) |
| `status` | string | No | "active" or "inactive" (default: "active") |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/appearance/menus/1/items" \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "label": "About Us",
    "link": "/about",
    "order": 0,
    "status": "active"
  }'
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "item": {
      "id": 10,
      "menu_id": 1,
      "label": "About Us",
      "link": "/about",
      "order": 0,
      "parent_id": null,
      "status": "active",
      "created_at": "2026-09-23T10:00:00Z",
      "updated_at": "2026-09-23T10:00:00Z"
    }
  }
}
```

**Error Responses:**
- `400`: label and link are required
- `404`: Menu not found
- `403`: Insufficient permissions

**Gotchas:**
- If you set `parent_id` to create a nested item, the parent item must exist in the same menu.
- The storefront typically renders only 1–2 levels deep; deeply nested items may not display.

---

### PUT /appearance/menu-items/:id - Update a menu item

Update a menu item's label, link, order, nesting, or status.

**Auth:** Admin session with appearance:manage permission

**Request Body:**

All fields are optional.

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/appearance/menu-items/10" \
  -H "Cookie: connect.sid=..." \
  -H "Content-Type: application/json" \
  -d '{
    "label": "Our Story",
    "order": 1
  }'
```

**Error Responses:**
- `404`: Menu item not found
- `403`: Insufficient permissions

---

### DELETE /appearance/menu-items/:id - Delete a menu item

Remove a menu item. If the item has children, they are also deleted (cascade delete).

**Auth:** Admin session with appearance:manage permission

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/appearance/menu-items/10" \
  -H "Cookie: connect.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "deleted": true
  }
}
```

**Error Responses:**
- `404`: Menu item not found
- `403`: Insufficient permissions

---

## Shop Settings

### GET /appearance/shop-settings - Get all shop settings

Retrieve all shop settings (key-value pairs). These are used to configure storefront metadata like business contact info, hours, social links, etc.

**Auth:** Admin session only

```bash
curl -X GET "https://your-store-api.example.com/api/v1/appearance/shop-settings" \
  -H "Cookie: connect.sid=..."
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "settings": [
      {
        "id": 1,
        "key": "business_phone",
        "value": "+254-712-345-678",
        "created_at": "2026-09-23T10:00:00Z",
        "updated_at": "2026-09-23T10:00:00Z"
      },
      {
        "id": 2,
        "key": "business_email",
        "value": "support@example.com",
        "created_at": "2026-09-23T10:00:00Z",
        "updated_at": "2026-09-23T10:00:00Z"
      }
    ]
  }
}
```

**Gotchas:**
- Settings are read from the database; to update them, use the `/settings/:key` endpoint from the Settings API.
- Common keys: `business_phone`, `business_email`, `business_hours`, `social_facebook`, `social_instagram`, etc.

---

## Blog & Content Management

Blog posts and FAQs are displayed on the storefront to engage customers. Blog posts were migrated from legacy JSON storage into the `blog_posts` table.

### GET /appearance/blogs - Get blog posts

Retrieve all published blog posts from the Blog CMS. The legacy JSON-in-ShopSetting storage was migrated into the `blog_posts` table at startup; this endpoint returns the canonical blog list.

**Auth:** Admin session only

```bash
curl -X GET "https://your-api.example.com/api/v1/appearance/blogs" \
  -H "Authorization: Basic abc123"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "blogs": [
      {
        "id": "organic-flour-101",
        "title": "Getting Started with Organic Flour",
        "excerpt": "Learn the basics of baking with our premium organic flour.",
        "content": "Organic flour is produced from wheat...",
        "image": "https://cdn.example.com/blog-cover.jpg",
        "category": "Recipes",
        "publishedAt": "2026-09-15",
        "seoTitle": "Organic Flour Baking Guide - 2026",
        "seoDescription": "Master organic flour baking with our comprehensive guide"
      }
    ]
  }
}
```

**Field descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Blog post slug (unique identifier) |
| `title` | string | Post title |
| `excerpt` | string | Short preview text |
| `content` | string | Full post HTML/markdown |
| `image` | string | Cover image URL (falls back to `/placeholder.svg` if missing) |
| `category` | string | Post category (defaults to "General") |
| `publishedAt` | string | YYYY-MM-DD publication date |
| `seoTitle` | string | Meta title for SEO (optional; storefront falls back to title) |
| `seoDescription` | string | Meta description for SEO (optional; storefront falls back to excerpt) |

**Gotchas:**
- Posts are read-only through this endpoint; use the Blog CMS to create/update posts.
- Only published posts appear (status = 'published').

---

### PUT /appearance/blogs - Update blog posts

This endpoint is deprecated. It returns the current list of published blog posts without making changes. To manage blog posts, use the Blog CMS routes (`/api/v1/blog`) instead.

**Auth:** Admin session + appearance manage permission

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{"blogs": [...]}' \
  "https://your-api.example.com/api/v1/appearance/blogs"
```

---

### GET /appearance/faqs - Get storefront FAQs

Retrieve the frequently asked questions displayed on the storefront. Returns default FAQs if none are configured.

**Auth:** Admin session only

```bash
curl "https://your-api.example.com/api/v1/appearance/faqs"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "faqs": [
      {
        "id": "1",
        "question": "Are your products certified gluten-free?",
        "answer": "Yes! All our products are certified gluten-free and approved by the Ministry of Health."
      },
      {
        "id": "2",
        "question": "Do you offer delivery?",
        "answer": "Yes, we deliver across Kenya. Nairobi orders typically arrive in 1-2 days."
      }
    ]
  }
}
```

**Field descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | FAQ identifier |
| `question` | string | Question text |
| `answer` | string | Answer text |

---

### PUT /appearance/faqs - Update storefront FAQs

Upsert the collection of FAQs. Empty questions or answers are filtered out. Duplicate IDs are deduplicated by appending the array index.

**Auth:** Admin session + appearance manage permission

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "faqs": [
      {
        "id": "1",
        "question": "What is your return policy?",
        "answer": "We offer 30-day returns on all items."
      },
      {
        "id": "2",
        "question": "Do you ship internationally?",
        "answer": "Currently we ship within Kenya only."
      }
    ]
  }' \
  "https://your-api.example.com/api/v1/appearance/faqs"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "faqs": [
      {
        "id": "1",
        "question": "What is your return policy?",
        "answer": "We offer 30-day returns on all items."
      },
      {
        "id": "2",
        "question": "Do you ship internationally?",
        "answer": "Currently we ship within Kenya only."
      }
    ]
  }
}
```

**Gotchas:**
- Questions or answers that are missing or empty are removed from the result.
- If two FAQs have the same ID, the second's ID is changed to `{id}-{index}`.

---

## Store Locator

Display physical store locations on the storefront with Google Maps integration.

### GET /appearance/store-locator - Get store-locator config

Retrieve the store-locator configuration including the enabled flag, Google Maps API key (masked), and store list.

**Auth:** Admin session only

```bash
curl "https://your-api.example.com/api/v1/appearance/store-locator"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "enabled": true,
    "googleMapsApiKey": "",
    "stores": [
      {
        "id": "1",
        "name": "Naivas Supermarket - Westlands",
        "address": "Westlands Mall, Nairobi",
        "city": "Nairobi",
        "lat": -1.2659,
        "lng": 36.8065,
        "phone": "+254 700 000 000",
        "hours": "8:00 AM - 9:00 PM"
      }
    ]
  }
}
```

**Field descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | boolean | Whether store locator is active |
| `googleMapsApiKey` | string | Maps API key (masked on read; empty string if set) |
| `stores[].id` | string | Store identifier |
| `stores[].name` | string | Store name |
| `stores[].address` | string | Street address |
| `stores[].city` | string | City name |
| `stores[].lat` | number | Latitude coordinate |
| `stores[].lng` | number | Longitude coordinate |
| `stores[].phone` | string | Contact phone (optional) |
| `stores[].hours` | string | Operating hours (optional; e.g., "8:00 AM - 9:00 PM") |

---

### PUT /appearance/store-locator - Update store-locator config

Upsert the store-locator configuration. Each store must have a name, address, city, and valid lat/lng coordinates.

**Auth:** Admin session + appearance manage permission

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "enabled": true,
    "googleMapsApiKey": "YOUR_MAPS_API_KEY_SET_ON_WRITE",
    "stores": [
      {
        "id": "1",
        "name": "Downtown Store",
        "address": "123 Main Street, Nairobi",
        "city": "Nairobi",
        "lat": -1.2921,
        "lng": 36.782,
        "phone": "+254 700 111 222",
        "hours": "9:00 AM - 6:00 PM"
      }
    ]
  }' \
  "https://your-api.example.com/api/v1/appearance/store-locator"
```

**Gotchas:**
- Google Maps API key is masked on read (returns empty string if previously set). Accept it on write only.
- Stores with missing required fields (name, address, city, lat, lng) are filtered out.
- Invalid lat/lng values (non-finite numbers) cause a 400 error.

---

## Custom Scripts

Inject custom HTML, CSS, or JavaScript into the storefront for analytics, tracking, and third-party integrations.

### GET /appearance/custom-scripts - Get custom script snippets

Retrieve custom HTML/JavaScript snippets injected into the storefront. Returned as three keys: `custom_scripts_head`, `custom_scripts_body_start`, `custom_scripts_body_end`.

**Auth:** Admin session only

```bash
curl "https://your-api.example.com/api/v1/appearance/custom-scripts"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "scripts": {
      "custom_scripts_head": "<link rel=\"stylesheet\" href=\"https://cdn.example.com/custom.css\">",
      "custom_scripts_body_start": "<script async src=\"https://cdn.google-analytics.com/gtag/gtag.js\"></script>",
      "custom_scripts_body_end": ""
    }
  }
}
```

**Field descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| `custom_scripts_head` | string | Injected into `<head>` tag (for stylesheets, meta tags, analytics init) |
| `custom_scripts_body_start` | string | Injected at the start of `<body>` (for async scripts) |
| `custom_scripts_body_end` | string | Injected before closing `</body>` (for tracking pixels, deferred scripts) |

**Use cases:**
- Google Tag Manager (GTM) init in head or body-start
- Custom CSS overrides in head
- Analytics tracking pixels in body-end
- Third-party embeds (reviews, chat widgets)

---

### PUT /appearance/custom-scripts - Update custom scripts

Upsert custom script snippets. Pass `head`, `bodyStart`, and `bodyEnd` fields (case-sensitive). Empty strings clear the scripts.

**Auth:** Admin session + appearance manage permission

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "head": "<script>window.dataLayer = window.dataLayer || [];</script>",
    "bodyStart": "<script async src=\"https://www.googletagmanager.com/gtag/js?id=GA_ID\"></script>",
    "bodyEnd": "<img src=\"https://example.com/track?event=page_view\" style=\"display:none;\" />"
  }' \
  "https://your-api.example.com/api/v1/appearance/custom-scripts"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Custom scripts saved successfully"
}
```

**Gotchas:**
- Field names are case-sensitive: `head`, `bodyStart`, `bodyEnd`.
- Scripts are injected as-is without escaping or validation (be careful with user-supplied content).
- Empty strings or omitted fields clear those script blocks.

---

## Homepage Sections

Control what sections appear on the storefront homepage and their configuration. Sections can display products, categories, brands, testimonials, features, and more.

### GET /appearance/homepage-sections - Get homepage sections

Retrieve the ordered list of homepage sections and their configuration. Returns defaults if not yet configured. May auto-repair invalid JSON and indicate with `repaired: true`.

**Auth:** Admin session only

```bash
curl "https://your-api.example.com/api/v1/appearance/homepage-sections"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "sections": [
      {
        "id": "hero",
        "type": "hero",
        "enabled": true
      },
      {
        "id": "categories",
        "type": "categories",
        "enabled": true,
        "title": "Shop by category",
        "subtitle": "Collections",
        "layout": "grid",
        "config": {
          "category_ids": [1, 3, 5],
          "limit": 12,
          "visible_count": 6,
          "design": "default",
          "slugs": []
        }
      },
      {
        "id": "featured_products",
        "type": "products",
        "enabled": true,
        "title": "Featured Products",
        "subtitle": "Discover our handpicked selection",
        "layout": "carousel",
        "config": {
          "source": "manual",
          "product_ids": [42, 73, 101],
          "sort": "newest",
          "limit": 6,
          "visible_count": 6,
          "category_slug": null,
          "brand_slug": null,
          "tag_slug": null,
          "on_sale": false
        }
      }
    ],
    "repaired": false
  }
}
```

**Section types:**

| Type | Description | Config fields |
|------|-------------|----------------|
| `hero` | Hero banner | None |
| `brands` | Featured brands carousel | None |
| `banners_middle` | Middle promotional banners | None |
| `categories` | Category grid or carousel | `category_ids`, `limit`, `visible_count`, `design`, `slugs` |
| `products` | Product grid or carousel | `source`, `sort`, `product_ids`, `limit`, `visible_count`, `category_slug`, `brand_slug`, `tag_slug`, `on_sale` |
| `testimonials` | Customer reviews/testimonials | `source`, `review_ids`, `limit`, `visible_count`, `rating` |
| `newsletter` | Newsletter signup section | `eyebrow`, `background_image`, `disclaimer` |
| `features` | Feature grid (icons + text) | `items`, `columns` |

**Config constraints:**
- `limit`: 1–60
- `visible_count`: 1–12
- For testimonials, `rating` (1–5) filters reviews; null shows all ratings
- Categories `design`: `default`, `chips`, `carousel`, or `grid_overlay`
- Products `source`: `manual`, `category`, `brand`, `tag`, `best_sellers`, or `on_sale`
- Products `sort`: `manual`, `newest`, or `best_sellers`

---

### PUT /appearance/homepage-sections - Update homepage sections

Upsert the homepage section configuration. Validates section types, layouts, and config. Returns 400 for invalid input.

**Auth:** Admin session + appearance manage permission

```bash
curl -X PUT \
  -H "Content-Type: application/json" \
  -d '{
    "sections": [
      {
        "id": "hero",
        "type": "hero",
        "enabled": true
      },
      {
        "id": "categories",
        "type": "categories",
        "enabled": true,
        "title": "Shop by Category",
        "subtitle": "Browse all collections",
        "layout": "grid",
        "config": {
          "category_ids": [1, 2, 3],
          "limit": 12,
          "visible_count": 6,
          "design": "default",
          "slugs": []
        }
      },
      {
        "id": "best_sellers",
        "type": "products",
        "enabled": true,
        "title": "Best Sellers",
        "subtitle": "Our most popular items",
        "layout": "grid",
        "config": {
          "source": "best_sellers",
          "sort": "best_sellers",
          "limit": 6,
          "visible_count": 6,
          "product_ids": [],
          "category_slug": null,
          "brand_slug": null,
          "tag_slug": null,
          "on_sale": false
        }
      }
    ]
  }' \
  "https://your-api.example.com/api/v1/appearance/homepage-sections"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "sections": [
      {
        "id": "hero",
        "type": "hero",
        "enabled": true
      },
      {
        "id": "categories",
        "type": "categories",
        "enabled": true,
        "title": "Shop by Category",
        "subtitle": "Browse all collections",
        "layout": "grid",
        "config": {
          "category_ids": [1, 2, 3],
          "limit": 12,
          "visible_count": 6,
          "design": "default",
          "slugs": []
        }
      }
    ]
  }
}
```

**Validation errors (400):**
- Sections array is empty or missing
- Sections array exceeds 60 items
- Duplicate section IDs
- Invalid or unknown section type
- Invalid values (layouts, sources, design options)
- Out-of-range integers (limit, visible_count, columns, rating)

**Gotchas:**
- Unknown or invalid config fields are dropped during sanitization (they won't round-trip).
- All integer fields are truncated to whole numbers (no decimals).
- Category/product slugs are filtered to max 30 items.
- Feature items are limited to 20 per section.

---

### POST /appearance/pages/regenerate-html - Generate page HTML with AI

Generate HTML for a page using AI based on a brief outline or base content. Takes title, slug, base content (required), tone, and extra instructions. Rate limited to **10 requests per 5-minute window per user**.

**Auth:** Admin session + appearance manage permission  
**Rate limit:** 10 requests per 5 minutes per user (returns 429 when exceeded)

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
    "title": "About Us",
    "slug": "about-us",
    "baseContent": "We are a sustainable, organic food company founded in 2015. We partner with local farmers...",
    "tone": "professional and warm",
    "extraInstructions": "Add a team section and customer testimonials section. Keep it concise."
  }' \
  "https://your-api.example.com/api/v1/appearance/pages/regenerate-html"
```

**Request fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `baseContent` | string | Yes | Page outline or base content (cannot be empty) |
| `title` | string | No | Page title for context |
| `slug` | string | No | URL slug for context |
| `tone` | string | No | Desired tone (e.g., "professional", "casual", "friendly") |
| `extraInstructions` | string | No | Additional instructions for HTML generation |

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "html": "<section class=\"about-intro\"><h1>About Us</h1><p>We are a sustainable, organic food company...</p></section><section class=\"team\">...</section>"
  }
}
```

**Errors:**
- **400:** `baseContent` is missing or empty
- **401:** Unauthorized (session required)
- **403:** Forbidden (requires appearance manage permission)
- **429:** Rate limit exceeded (max 10 requests per 5 minutes)

**Gotchas:**
- AI generation takes a few seconds; this is not a synchronous operation.
- Generated HTML is plain HTML without wrapping in a page template.
- The `title` and `slug` are sent to the AI for context but do not constrain the output.
- Rate limiting is per-user; a busy store may see 429 errors if multiple admins regenerate pages in rapid succession.

---

## Appearance Agent

The Appearance Agent is an AI-powered assistant that helps manage store pages and create products. It uses Server-Sent Events (SSE) for streaming responses during conversation turns.

**Addon:** Appearance Agent (`ai_appearance_agent_enabled`) — returns 503 when disabled.

### GET /appearance/agent/config - Get Agent Configuration

Retrieve AI provider settings, capabilities, and addon status. This endpoint is accessible even when the addon is disabled, allowing clients to display a message explaining why the assistant is unavailable.

**Auth:** Session or API key (requires view access to Appearance or Products)

```bash
curl -X GET "https://your-store.com/api/v1/appearance/agent/config" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "provider": "openai",
    "model": "gpt-4",
    "provider_key_set": true,
    "enabled": true,
    "capabilities": {
      "pages": true,
      "products": true,
      "vision": "openai",
      "image_studio": true
    }
  }
}
```

**Gotchas:**
- `provider_key_set` indicates whether an API key is configured, not its validity.
- `vision` is the AI provider supporting image analysis, or null if unavailable.
- `image_studio` depends on the storefront's AI image addon configuration.

---

### POST /appearance/agent/uploads - Upload Attachment

Upload an image or file to attach to a message. Files are stored temporarily and referenced by their ID in conversation messages. Max file size is 10 MB.

**Auth:** Session or API key (requires view access to Appearance or Products)

**Request:**
- `file` (multipart/form-data): Binary file (image recommended; max 10 MB)

```bash
curl -X POST "https://your-store.com/api/v1/appearance/agent/uploads" \
  -u "ck_xxx:cs_yyy" \
  -F "file=@screenshot.png"
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": 42,
    "url": "https://cdn.example.com/uploads/agent_abc123.png",
    "filename": "screenshot.png",
    "mime_type": "image/png"
  }
}
```

**Gotchas:**
- File IDs are short-lived; attach them to a message immediately after upload.
- Only the uploading user can reference these attachments.

---

### GET /appearance/agent/pages - List Pages

Retrieve the list of pages the assistant can edit, for clients that show them in a sidebar or modal.

**Auth:** Admin session only (requires Appearance view permission)

```bash
curl -X GET "https://your-store.com/api/v1/appearance/agent/pages" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "pages": [
      {
        "id": 1,
        "title": "About Us",
        "slug": "about-us",
        "status": "published",
        "updated_at": "2026-09-20T14:30:00.000Z"
      },
      {
        "id": 2,
        "title": "Returns Policy",
        "slug": "returns-policy",
        "status": "draft",
        "updated_at": "2026-09-15T10:00:00.000Z"
      }
    ]
  }
}
```

---

### GET /appearance/agent/conversations - List Conversations

Retrieve the current user's last 30 conversations, in reverse chronological order (most recent first).

**Auth:** Session or API key (requires view access to Appearance or Products)

```bash
curl -X GET "https://your-store.com/api/v1/appearance/agent/conversations" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "conversations": [
      {
        "id": 101,
        "title": "Create product cards",
        "status": "idle",
        "updated_at": "2026-09-23T12:00:00.000Z"
      },
      {
        "id": 100,
        "title": null,
        "status": "idle",
        "updated_at": "2026-09-22T15:30:00.000Z"
      }
    ]
  }
}
```

**Gotchas:**
- `title` is null if the assistant never generated one.
- `status` is `idle` (no turn running) or `running` (actively processing).

---

### POST /appearance/agent/conversations - Create Conversation

Start a new conversation. The returned ID is used for all subsequent messages in this conversation.

**Auth:** Session or API key (requires view access to Appearance or Products)

```bash
curl -X POST "https://your-store.com/api/v1/appearance/agent/conversations" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (201):**

```json
{
  "status": "success",
  "data": {
    "id": 102
  }
}
```

---

### GET /appearance/agent/conversations/:id/messages - Replay Messages

Fetch all messages and changes from a conversation. Supports pagination via `after` to catch up or refresh a client after a reload or network hiccup.

**Auth:** Session or API key (requires view access to Appearance or Products)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `after` | integer | No | Retrieve messages with seq > this value (default 0) |

```bash
curl -X GET "https://your-store.com/api/v1/appearance/agent/conversations/102/messages?after=0" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "messages": [
      {
        "seq": 1,
        "role": "user",
        "content": "Create a product for organic flour",
        "tool_name": null,
        "tool_result": null,
        "label": null,
        "attachments": [],
        "status": "complete",
        "error_text": null,
        "created_at": "2026-09-23T12:00:00.000Z"
      },
      {
        "seq": 2,
        "role": "assistant",
        "content": "I'll create a product for organic flour with a good description and images.",
        "tool_name": null,
        "tool_result": null,
        "label": null,
        "status": "complete",
        "error_text": null,
        "created_at": "2026-09-23T12:00:05.000Z"
      },
      {
        "seq": 3,
        "role": "tool",
        "content": null,
        "tool_name": "create_product",
        "tool_result": "{\"id\": 999, \"name\": \"Organic Flour 1kg\"}",
        "label": "Creating Organic Flour 1kg",
        "status": "complete",
        "error_text": null,
        "created_at": "2026-09-23T12:00:10.000Z"
      }
    ],
    "changes": [
      {
        "id": 501,
        "tool_name": "create_product",
        "target_kind": "product",
        "target_id": "999",
        "op": "create",
        "before": {},
        "after": {
          "id": 999,
          "name": "Organic Flour 1kg",
          "status": "draft"
        },
        "undo_state": "ready",
        "created_at": "2026-09-23T12:00:10.000Z"
      }
    ]
  }
}
```

**Gotchas:**
- `seq` is the message sequence number; use it as the `after` parameter to fetch only new messages.
- Tool messages (role=tool) have `tool_name` and `tool_result`; `label` is a human-readable summary of what the tool did.
- Attachments are only present on user messages; they are objects with id, url, filename, etc.

---

### POST /appearance/agent/conversations/:id/messages - Send Message (Streaming)

Send a user message and receive the assistant's response as a stream of Server-Sent Events. The connection stays open until the assistant finishes or the user cancels.

**Auth:** Session or API key (requires view access to Appearance or Products)

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `text` | string | Conditional | User message (required unless answering a card; max 4000 chars) |
| `attachment_ids` | array[integer] | No | IDs of previously uploaded attachments |
| `answers` | object | No | Answers to an agent question card (seq, values) |

```bash
curl -X POST "https://your-store.com/api/v1/appearance/agent/conversations/102/messages" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Make the description more engaging and add an image",
    "attachment_ids": [42]
  }'
```

**Example Response (200, text/event-stream):**

```
data: {"kind":"status","seq":4,"status":"running"}

data: {"kind":"text","seq":4,"delta":"I'll "}

data: {"kind":"text","seq":4,"delta":"enhance the product description..."}

data: {"kind":"tool","seq":5,"tool_name":"update_product","status":"start"}

data: {"kind":"tool","seq":5,"tool_name":"update_product","status":"end","tool_result":"{...}"}

data: {"kind":"text","seq":6,"delta":"Done!"}

data: {"kind":"status","seq":6,"status":"complete"}
```

**Response Frame Types:**
- `status`: Turn started or completed. `seq` is the assistant's final message sequence.
- `text`: Text chunk (delta). Concatenate all deltas to build the full message.
- `tool`: Tool call (start/end). `tool_result` is JSON on completion.
- `error`: Turn failed. `message` describes the error.

**Gotchas:**
- Stream frames are newline-delimited JSON, one per line.
- A heartbeat comment (`: ping`) is sent every 20 seconds to prevent proxy timeouts.
- Closing the connection mid-turn cancels the run and stops the assistant.
- If providing `answers` to a question card, `text` is optional and will be appended after the rendered answers.

---

### POST /appearance/agent/conversations/:id/cancel - Cancel Turn

Request cancellation of a currently running assistant turn. The run may take a moment to exit.

**Auth:** Session or API key (requires view access to Appearance or Products)

```bash
curl -X POST "https://your-store.com/api/v1/appearance/agent/conversations/102/cancel" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "cancelled": true
  }
}
```

---

### GET /appearance/agent/changes - List Changes

Retrieve change records (tool actions) from this user's conversations. Optionally filter by conversation.

**Auth:** Session or API key (requires view access to Appearance or Products)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `conversation_id` | integer | No | Filter to changes from this conversation |
| `limit` | integer | No | Max results (default 50, max 200) |

```bash
curl -X GET "https://your-store.com/api/v1/appearance/agent/changes?conversation_id=102&limit=10" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "changes": [
      {
        "id": 501,
        "conversation_id": 102,
        "tool_name": "create_product",
        "target_kind": "product",
        "target_id": "999",
        "op": "create",
        "before": {},
        "after": {
          "id": 999,
          "name": "Organic Flour 1kg",
          "status": "draft"
        },
        "undo_state": "ready",
        "created_at": "2026-09-23T12:00:10.000Z"
      }
    ]
  }
}
```

**Gotchas:**
- `before` and `after` are the full snapshots before and after the change.
- `undo_state` is `ready` (can be undone) or `blocked` (permissions changed or target deleted).

---

### POST /appearance/agent/changes/:id/undo - Undo Single Change

Reverse a single change record. Requires Products manage permission.

**Auth:** Session or API key (requires Products manage permission)

```bash
curl -X POST "https://your-store.com/api/v1/appearance/agent/changes/501/undo" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "changeId": 501,
    "summary": "create_product: product 999 removed"
  }
}
```

**Gotchas:**
- Permissions are checked at undo time, not when the change was made.
- If the user was promoted or demoted since the change, they may now be able or unable to undo.

---

### POST /appearance/agent/conversations/:id/undo-all - Undo All Changes in Conversation

Reverse all changes made in a conversation. Requires Products manage permission.

**Auth:** Session or API key (requires Products manage permission)

```bash
curl -X POST "https://your-store.com/api/v1/appearance/agent/conversations/102/undo-all" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "undone": 3,
    "failed": 0,
    "summaries": [
      "create_product: product 999 removed",
      "update_page: page 5 restored",
      "create_banner: banner 12 removed"
    ]
  }
}
```

**Gotchas:**
- If some changes cannot be undone (permissions, target deleted), they are counted in `failed` and skipped.

---

### GET /appearance/agent/products/:id - Get Product Card State

Retrieve the current state of a product that the agent created or modified. Used to refresh the product card UI after an undo.

**Auth:** Session or API key (requires Products manage permission)

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `conversation_id` | integer | Yes | The conversation that created/modified this product |

```bash
curl -X GET "https://your-store.com/api/v1/appearance/agent/products/999?conversation_id=102" \
  -u "ck_xxx:cs_yyy"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 999,
      "name": "Organic Flour 1kg",
      "status": "draft",
      "images": [
        {
          "url": "https://cdn.example.com/flour1.jpg",
          "order": 0
        }
      ]
    }
  }
}
```

**Gotchas:**
- The product must have been touched by the agent in this conversation; otherwise returns 404.
- The card is a summary, not the full product; use the main product endpoint for complete details.

---

### POST /appearance/agent/products/:id/status - Publish or Unpublish Product

Change a product's status between published and draft. One-tap action from the product card in the assistant UI.

**Auth:** Session or API key (requires Products manage permission)

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | Yes | `published` or `draft` |
| `conversation_id` | integer | Yes | The conversation that created/modified this product |

```bash
curl -X POST "https://your-store.com/api/v1/appearance/agent/products/999/status" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "published",
    "conversation_id": 102
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 999,
      "name": "Organic Flour 1kg",
      "status": "published",
      "images": []
    },
    "change_id": 502
  }
}
```

**Gotchas:**
- The action is recorded as a change and can be undone.
- Product must be part of this conversation.

---

### PUT /appearance/agent/products/:id/images - Reorder or Remove Product Images

Rearrange or remove images from a product. Only URLs already on the product can be kept; new URLs are rejected.

**Auth:** Session or API key (requires Products manage permission)

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `urls` | array[string] | Yes | Image URLs to keep, in new order (at least 1; must be existing product images) |
| `conversation_id` | integer | Yes | The conversation that created/modified this product |

```bash
curl -X PUT "https://your-store.com/api/v1/appearance/agent/products/999/images" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "urls": [
      "https://cdn.example.com/flour1.jpg",
      "https://cdn.example.com/flour2.jpg"
    ],
    "conversation_id": 102
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "product": {
      "id": 999,
      "name": "Organic Flour 1kg",
      "status": "draft",
      "images": [
        {
          "url": "https://cdn.example.com/flour1.jpg",
          "order": 0
        },
        {
          "url": "https://cdn.example.com/flour2.jpg",
          "order": 1
        }
      ]
    },
    "change_id": 503
  }
}
```

**Gotchas:**
- All URLs in the request must already be on the product; new images cannot be attached this way.
- The action is recorded as a change and can be undone.
- Product must be part of this conversation.
