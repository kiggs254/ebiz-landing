## 20. Quick Reference

### Endpoints Overview

| Resource | GET | POST | PUT | PATCH | DELETE |
|----------|-----|------|-----|-------|--------|
| Products | List, Get | Create | Update | - | Delete |
| Orders | List, Get | Create, Batch Create | Status | Payment status | Delete |
| Customers | List, Get | - | - | - | Delete |
| Categories | List, Get | Create | Update | - | Delete |
| Brands | List, Get | Create | Update | - | Delete |
| Branches | List, Get | Create | Update | - | Delete |
| Shipping | - | Calculate | - | - | - |
| Webhooks | List, Get, Deliveries | Create | Update | - | Delete |
| API Keys | List | Create | - | - | Delete |

### All Endpoints

**Authentication:**
- `POST /auth/register` - Register new admin user
- `POST /auth/login` - Login and create session
- `POST /auth/logout` - Logout and destroy session
- `GET /auth/me` - Get current user (requires auth)

**Products:**
- `GET /products` - List products (with pagination, search, filters)
- `POST /products` - Create product
- `GET /products/:id` - Get product details
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `POST /products/import` - Import products from CSV
- `GET /products/export` - Export products to CSV

**Categories:**
- `GET /categories` - List all categories
- `POST /categories` - Create category
- `GET /categories/:id` - Get category (with children/parent)
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

**Brands:**
- `GET /brands` - List all brands
- `POST /brands` - Create brand
- `GET /brands/:id` - Get brand
- `PUT /brands/:id` - Update brand
- `DELETE /brands/:id` - Delete brand

**Orders:**
- `GET /orders` - List orders (with pagination, filters)
- `POST /orders` - Create order
- `POST /orders/batch` - Batch create orders (up to 100)
- `GET /orders/:id` - Get order details
- `PUT /orders/:id/status` - Update order status
- `PATCH /orders/:id/payment-status` - Update payment status
- `DELETE /orders/:id` - Delete order

**Customers:**
- `GET /customers` - List customers
- `GET /customers/:id` - Get customer details
- `GET /customers/:id/loyalty` - Get loyalty balance & ledger
- `POST /customers/:id/notes` - Add customer note

**Branches:**
- `GET /branches` - List branches
- `POST /branches` - Create branch
- `GET /branches/:id` - Get branch
- `PUT /branches/:id` - Update branch
- `DELETE /branches/:id` - Delete branch
- `GET /branches/:id/integrations` - List branch integrations
- `PUT /branches/:id/integrations/:key` - Update branch integration

**Shipping:**
- `GET /shipping/zones` - List shipping zones
- `POST /shipping/zones` - Create shipping zone
- `GET /shipping/shipments` - List shipments
- `POST /shipping/external/calculate` - Calculate shipping rates (API key auth)

**Webhooks:**
- `GET /webhooks` - List webhooks
- `POST /webhooks` - Create webhook
- `GET /webhooks/:id` - Get webhook
- `PUT /webhooks/:id` - Update webhook
- `DELETE /webhooks/:id` - Delete webhook
- `GET /webhooks/:id/deliveries` - Get webhook delivery logs

**Marketing:**
- `GET /marketing` - List coupons
- `POST /marketing` - Create coupon
- `GET /marketing/:id/usage` - Get coupon usage

**Settings:**
- `GET /settings` - Get all settings
- `PUT /settings/:key` - Update setting
- `GET /settings/emails` - Get email templates
- `PUT /settings/emails/:id` - Update email template
- `GET /settings/payment-gateways` - Get payment gateways
- `PUT /settings/payment-gateways/:id` - Update payment gateway

**Plugins:**
- `GET /plugins` - List plugins
- `GET /plugins/:id` - Get plugin
- `POST /plugins/:id/enable` - Enable plugin
- `POST /plugins/:id/disable` - Disable plugin
- `PUT /plugins/:id/config` - Update plugin configuration

**API Keys:**
- `GET /api-keys` - List API keys (for current user)
- `POST /api-keys` - Create API key
- `DELETE /api-keys/:id` - Delete API key

### Response Format

**Success:**
```json
{
  "status": "success",
  "data": { ... }
}
```

**Error:**
```json
{
  "status": "error",
  "message": "Error message"
}
```

### Interactive Documentation

Visit `/api-docs` when the server is running for interactive Swagger documentation.

---

*Last updated: April 2026*
