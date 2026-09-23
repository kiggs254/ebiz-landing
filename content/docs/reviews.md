Manage product reviews submitted by customers. Reviews are moderated before appearing on the storefront — you can list, approve, reject, update status, and delete them.

**Auth:** All endpoints require admin session authentication.

---

## List Reviews

### GET /reviews - List all reviews

Retrieve all reviews with optional filtering by status, product, rating, or search terms. Supports pagination.

**Auth:** Admin session only

**Query Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | integer | Page number (default: 1) |
| `limit` | integer | Results per page (default: 20) |
| `status` | string | Filter by status: `pending`, `approved`, `rejected` |
| `product_id` | integer | Filter reviews for a specific product |
| `rating` | integer | Filter by star rating (1–5) |
| `search` | string | Search in review title, comment, product name, or customer email |

**Example Request:**

```bash
curl -X GET "https://your-store-api.example.com/api/v1/reviews?status=pending&page=1&limit=20" \
  -H "Cookie: shopflow.sid=<session_cookie>"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "reviews": [
      {
        "id": 42,
        "product_id": 101,
        "customer_id": 5,
        "rating": 4,
        "title": "Great quality",
        "comment": "Really happy with this product. Arrived quickly.",
        "status": "pending",
        "created_at": "2026-09-20T14:30:00Z",
        "updated_at": "2026-09-20T14:30:00Z",
        "product": {
          "id": 101,
          "name": "Premium Headphones",
          "sku": "HP-001"
        },
        "customer": {
          "id": 5,
          "first_name": "John",
          "last_name": "Doe",
          "email": "john@example.com"
        }
      },
      {
        "id": 41,
        "product_id": 102,
        "customer_id": 6,
        "rating": 2,
        "title": "Not as described",
        "comment": "Color is different from the photo.",
        "status": "pending",
        "created_at": "2026-09-19T10:15:00Z",
        "updated_at": "2026-09-19T10:15:00Z",
        "product": {
          "id": 102,
          "name": "T-Shirt",
          "sku": "TS-001"
        },
        "customer": {
          "id": 6,
          "first_name": "Jane",
          "last_name": "Smith",
          "email": "jane@example.com"
        }
      }
    ],
    "total": 47,
    "page": 1,
    "limit": 20
  }
}
```

**Search behavior:** The `search` parameter matches against review title, comment text, product name, and customer email/name (case-insensitive, substring match). All matching reviews are returned.

---

## Moderate Reviews

### PUT /reviews/:id/approve - Approve a review

Set a review's status to "approved" and invalidate the storefront cache so it appears to customers immediately. Fires an event hook for plugins.

**Auth:** Admin session only

**Example Request:**

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/reviews/42/approve" \
  -H "Cookie: shopflow.sid=<session_cookie>"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "review": {
      "id": 42,
      "product_id": 101,
      "customer_id": 5,
      "rating": 4,
      "title": "Great quality",
      "comment": "Really happy with this product. Arrived quickly.",
      "status": "approved",
      "created_at": "2026-09-20T14:30:00Z",
      "updated_at": "2026-09-20T14:30:00Z",
      "product": {
        "id": 101,
        "name": "Premium Headphones",
        "sku": "HP-001"
      },
      "customer": {
        "id": 5,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com"
      }
    }
  }
}
```

**Response Status Codes:**

| Status | Description |
|--------|-------------|
| `200` | Review approved successfully |
| `404` | Review not found |

---

### PUT /reviews/:id/reject - Reject a review

Set a review's status to "rejected" and invalidate the storefront cache so it no longer appears. Fires an event hook for plugins.

**Auth:** Admin session only

**Example Request:**

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/reviews/41/reject" \
  -H "Cookie: shopflow.sid=<session_cookie>"
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "review": {
      "id": 41,
      "product_id": 102,
      "customer_id": 6,
      "rating": 2,
      "title": "Not as described",
      "comment": "Color is different from the photo.",
      "status": "rejected",
      "created_at": "2026-09-19T10:15:00Z",
      "updated_at": "2026-09-19T10:15:00Z",
      "product": {
        "id": 102,
        "name": "T-Shirt",
        "sku": "TS-001"
      },
      "customer": {
        "id": 6,
        "first_name": "Jane",
        "last_name": "Smith",
        "email": "jane@example.com"
      }
    }
  }
}
```

**Response Status Codes:**

| Status | Description |
|--------|-------------|
| `200` | Review rejected successfully |
| `404` | Review not found |

---

### PUT /reviews/:id - Update review status

Update a review's status directly. Currently only the `status` field is modifiable.

**Auth:** Admin session only

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | Review status: `pending`, `approved`, `rejected` |

**Example Request:**

```bash
curl -X PUT "https://your-store-api.example.com/api/v1/reviews/42" \
  -H "Content-Type: application/json" \
  -H "Cookie: shopflow.sid=<session_cookie>" \
  -d '{
    "status": "approved"
  }'
```

**Example Response (200):**

```json
{
  "status": "success",
  "data": {
    "review": {
      "id": 42,
      "product_id": 101,
      "customer_id": 5,
      "rating": 4,
      "title": "Great quality",
      "comment": "Really happy with this product. Arrived quickly.",
      "status": "approved",
      "created_at": "2026-09-20T14:30:00Z",
      "updated_at": "2026-09-20T14:30:00Z",
      "product": {
        "id": 101,
        "name": "Premium Headphones",
        "sku": "HP-001"
      },
      "customer": {
        "id": 5,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john@example.com"
      }
    }
  }
}
```

**Gotcha:** The `status` field is optional in the request body. If omitted, the review is returned unchanged and the cache is still invalidated.

---

## Delete Reviews

### DELETE /reviews/:id - Delete a review

Permanently delete a review. Fires an event hook before deletion.

**Auth:** Admin session only

**Example Request:**

```bash
curl -X DELETE "https://your-store-api.example.com/api/v1/reviews/41" \
  -H "Cookie: shopflow.sid=<session_cookie>"
```

**Example Response (200):**

```json
{
  "status": "success",
  "message": "Review deleted"
}
```

**Response Status Codes:**

| Status | Description |
|--------|-------------|
| `200` | Review deleted successfully |
| `404` | Review not found |

---

## Storefront Considerations

- Reviews with `status: "approved"` appear on the storefront product detail page.
- Reviews with `status: "pending"` or `status: "rejected"` are hidden from customers.
- Approving, rejecting, updating, or deleting a review invalidates the storefront cache for that product and all reviews, ensuring changes appear immediately.
