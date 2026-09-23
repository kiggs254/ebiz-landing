The Media API allows you to upload, list, update, and delete media files (images, PDFs, videos). All files are stored on S3 and served through a CDN.

### POST /media/upload - Upload a file

Upload an image, PDF, or video to your media library. The file is automatically compressed (for images) and stored on S3.

**Auth:** API key or admin session

**File size limit:** 10 MB

**Allowed file types:**
- Images: JPEG, PNG, GIF, WebP, SVG
- Documents: PDF
- Video: MP4, WebM

```bash
curl -X POST https://your-store-api.example.com/api/v1/media/upload \
  -H "X-API-Key: your-api-key" \
  -F "file=@product-image.jpg"
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "media": {
      "id": 42,
      "filename": "abc123def456",
      "original_filename": "product-image.jpg",
      "mime_type": "image/jpeg",
      "size": 245000,
      "url": "https://cdn.example.com/media/abc123def456.jpg",
      "s3_key": "media/abc123def456.jpg",
      "alt_text": null,
      "uploaded_by": 5,
      "created_at": "2026-09-23T10:30:00Z",
      "updated_at": "2026-09-23T10:30:00Z"
    }
  }
}
```

**Notes:**
- The returned `url` is the public CDN link — use this in product images, pages, etc.
- Images are automatically compressed; returned `size` is the compressed size
- Attribution (`uploaded_by`) is automatically recorded from the API key's owner or session user
- 400: No file uploaded, or unsupported file type
- 401: Missing authentication

---

### GET /media - List media files

Retrieve a paginated list of uploaded media files with optional search and type filtering.

**Auth:** API key or admin session

```bash
curl -X GET "https://your-store-api.example.com/api/v1/media?page=1&limit=20&search=product&type=image" \
  -H "X-API-Key: your-api-key"
```

**Query parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| page | integer | No | Page number (default: 1) |
| limit | integer | No | Results per page (default: 50) |
| search | string | No | Search in filename or original_filename (case-insensitive) |
| type | string | No | Filter by MIME type prefix (e.g. "image" matches "image/jpeg", "image/png") |

**Response:**

```json
{
  "status": "success",
  "data": {
    "media": [
      {
        "id": 42,
        "filename": "abc123def456",
        "original_filename": "product-image.jpg",
        "mime_type": "image/jpeg",
        "size": 245000,
        "url": "https://cdn.example.com/media/abc123def456.jpg",
        "s3_key": "media/abc123def456.jpg",
        "alt_text": null,
        "uploaded_by": 5,
        "created_at": "2026-09-23T10:30:00Z",
        "updated_at": "2026-09-23T10:30:00Z"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

**Notes:**
- Results are sorted by `created_at` descending (newest first)
- Search is case-insensitive partial match on both `original_filename` and `filename`
- Type filter matches the beginning of the MIME type (e.g. "image" or "video/mp4")

---

### PATCH /media/:id - Update media metadata

Update the alt text (accessibility description) for a media file.

**Auth:** API key or admin session

```bash
curl -X PATCH https://your-store-api.example.com/api/v1/media/42 \
  -H "X-API-Key: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"alt_text": "Fresh organic flour in a 1kg bag"}'
```

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| alt_text | string | No | Alternative text for accessibility (max 255 chars); pass null to clear |

**Response:**

```json
{
  "status": "success",
  "data": {
    "media": {
      "id": 42,
      "filename": "abc123def456",
      "original_filename": "product-image.jpg",
      "mime_type": "image/jpeg",
      "size": 245000,
      "url": "https://cdn.example.com/media/abc123def456.jpg",
      "s3_key": "media/abc123def456.jpg",
      "alt_text": "Fresh organic flour in a 1kg bag",
      "uploaded_by": 5,
      "created_at": "2026-09-23T10:30:00Z",
      "updated_at": "2026-09-23T14:15:00Z"
    }
  }
}
```

**Notes:**
- Only `alt_text` can be updated; other fields are immutable
- Set `alt_text` to `null` in the JSON to remove existing alt text
- 404: Media file not found

---

### DELETE /media/:id - Delete a media file

Permanently delete a media file from S3 and the media library. The file is removed from CDN and cannot be recovered.

**Auth:** API key or admin session

```bash
curl -X DELETE https://your-store-api.example.com/api/v1/media/42 \
  -H "X-API-Key: your-api-key"
```

**Response:**

```json
{
  "status": "success",
  "message": "Media deleted successfully"
}
```

**Notes:**
- Deletion is permanent; files are removed from S3 immediately
- Any product image URLs pointing to a deleted file will break
- 404: Media file not found

---

## File Type Restrictions

The API only accepts:
- **Images**: JPEG, PNG, GIF, WebP, SVG (any size, automatically compressed)
- **Documents**: PDF
- **Video**: MP4, WebM

Uploads of other types (executables, archives, etc.) return a 400 error with the message: _"Invalid file type. Only images, PDFs, and videos are allowed."_

## Best Practices

1. **Always set alt text on product images** for accessibility and SEO
2. **Use descriptive original filenames** at upload time (they're sanitized but help with organization)
3. **Leverage the CDN URL** from the response; never hardcode S3 keys or construct URLs client-side
4. **Batch delete** old unused media files to keep storage costs down
5. **Compression** is automatic on images; no need to pre-optimize before upload
