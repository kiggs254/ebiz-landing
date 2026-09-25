Every endpoint in the E-biz REST API — **569 operations** — generated from the same OpenAPI spec that
powers the interactive reference at `/api-docs` on your API host. Paths are relative to `/api/v1`. Each row
links to the page that documents it in full.

## By area

| Area | Endpoints | Documented in |
|------|-----------|---------------|
| Auth | 9 | [Authentication](/docs/authentication) |
| Products | 17 | [Products](/docs/products) |
| Reservations | 15 | [Reservations](/docs/reservations) |
| Categories | 9 | [Categories](/docs/categories) |
| Brands | 5 | [Brands](/docs/brands) |
| Orders | 17 | [Orders](/docs/orders) |
| Customers | 12 | [Customers](/docs/customers) |
| Branches | 9 | [Branches](/docs/branches) |
| Shipping | 22 | [Shipping](/docs/shipping) |
| Webhooks | 9 | [Webhooks](/docs/webhooks) |
| API Keys | 6 | [API keys & rate limits](/docs/api-keys) |
| Settings | 39 | [Store settings](/docs/settings) |
| Transactions | 1 | [Analytics & transactions](/docs/analytics) |
| Media | 4 | [Media library](/docs/media) |
| Marketing | 38 | [Marketing & loyalty](/docs/marketing) |
| Analytics | 3 | [Analytics & transactions](/docs/analytics) |
| Reviews | 5 | [Reviews](/docs/reviews) |
| Tags | 4 | [Attributes & tags](/docs/attributes-tags) |
| Attributes | 4 | [Attributes & tags](/docs/attributes-tags) |
| Subscriptions | 14 | [Subscriptions](/docs/subscriptions) |
| Admin | 15 | [Staff users & roles](/docs/admin-users) |
| Themes | 3 | [Appearance & themes](/docs/appearance) |
| AI Image | 6 | [AI images](/docs/ai-image) |
| AI Search | 15 | [AI search](/docs/ai-search), [AI assistant](/docs/ai-assistant) |
| Affiliates | 19 | [Affiliates](/docs/affiliates) |
| Appearance | 32 | [Appearance & themes](/docs/appearance) |
| Appearance Agent | 14 | [Appearance & themes](/docs/appearance) |
| Catalog Feed | 1 | [Catalog feed](/docs/catalog-feed) |
| Distributors | 18 | [Distributors](/docs/distributors) |
| Plugins | 5 | [Plugins](/docs/plugins) |
| Prescriptions | 11 | [Prescriptions](/docs/prescriptions), [Content & engagement](/docs/storefront-content) |
| Push Notifications | 2 | [Push notifications](/docs/push-notifications) |
| Rider App | 10 | [Riders & tracking](/docs/riders) |
| Riders | 8 | [Riders & tracking](/docs/riders) |
| Storefront - Cart | 7 | [Cart & wishlist](/docs/storefront-cart) |
| Storefront - Catalog | 13 | [Content & engagement](/docs/storefront-content), [Catalog & discovery](/docs/storefront-catalog) |
| Storefront - Checkout | 15 | [Checkout & payments](/docs/storefront-checkout), [Content & engagement](/docs/storefront-content) |
| Storefront - Content | 35 | [Blog](/docs/blog), [Content & engagement](/docs/storefront-content), [Checkout & payments](/docs/storefront-checkout) |
| Storefront - Customers | 26 | [Customer accounts](/docs/storefront-customers) |
| Storefront - Loyalty | 3 | [Customer accounts](/docs/storefront-customers) |
| Storefront - Reservations | 6 | [Table reservations](/docs/storefront-reservations) |
| Storefront - Search | 7 | [AI search & recommendations](/docs/storefront-search) |
| Storefront - Subscriptions | 3 | [Content & engagement](/docs/storefront-content) |
| WhatsApp | 30 | [WhatsApp](/docs/whatsapp) |
| WhatsApp Storefront | 16 | [WhatsApp Storefront](/docs/whatsapp-storefront) |
| WooCommerce Migration | 7 | [WooCommerce compatibility](/docs/woocommerce) |

## All endpoints

**Auth**

- `POST /auth/forgot-password` — Request password reset link ([docs](/docs/authentication))
- `POST /auth/login` — Login ([docs](/docs/authentication))
- `POST /auth/logout` — Logout ([docs](/docs/authentication))
- `GET /auth/me` — Get current user ([docs](/docs/authentication))
- `PUT /auth/me/email` — Change email address ([docs](/docs/authentication))
- `PUT /auth/me/password` — Change password ([docs](/docs/authentication))
- `POST /auth/register` — Register admin user ([docs](/docs/authentication))
- `POST /auth/reset-password` — Reset password with token ([docs](/docs/authentication))
- `POST /auth/ws-ticket` — Issue a WebSocket authentication ticket ([docs](/docs/authentication))

**Products**

- `GET /products` — List products ([docs](/docs/products))
- `POST /products` — Create product ([docs](/docs/products))
- `GET /products/:id` — Get product ([docs](/docs/products))
- `PUT /products/:id` — Update product ([docs](/docs/products))
- `DELETE /products/:id` — Delete product ([docs](/docs/products))
- `GET /products/:id/currency-prices` — Get currency price overrides for a product ([docs](/docs/products))
- `PUT /products/:id/currency-prices` — Set or update currency price overrides ([docs](/docs/products))
- `POST /products/:id/duplicate` — Duplicate a product ([docs](/docs/products))
- `POST /products/:id/generate-image-alt` — Generate image alt text for a single product ([docs](/docs/products))
- `GET /products/ai-generation-status` — Get AI generation job status ([docs](/docs/products))
- `POST /products/bulk-enhance-images` — Enhance product images with AI ([docs](/docs/products))
- `POST /products/bulk-generate-ai` — Generate AI descriptions and SEO for products ([docs](/docs/products))
- `POST /products/bulk-generate-image-alt` — Generate image alt text and titles in bulk ([docs](/docs/products))
- `GET /products/export` — Export products as CSV ([docs](/docs/products))
- `POST /products/import` — Import products from CSV ([docs](/docs/products))
- `POST /products/popularity/recalculate` — Recalculate popularity scores ([docs](/docs/products))
- `GET /products/template` — Download product import template ([docs](/docs/products))

**Reservations**

- `GET /reservations` — List reservations ([docs](/docs/reservations))
- `POST /reservations` — Create a reservation (front desk / phone) ([docs](/docs/reservations))
- `GET /reservations/:id` — Get a reservation with its status history ([docs](/docs/reservations))
- `PUT /reservations/:id` — Edit a reservation ([docs](/docs/reservations))
- `DELETE /reservations/:id` — Delete a reservation ([docs](/docs/reservations))
- `PATCH /reservations/:id/status` — Move a reservation to another status ([docs](/docs/reservations))
- `GET /reservations/areas` — List bookable areas ([docs](/docs/reservations))
- `POST /reservations/areas` — Create an area ([docs](/docs/reservations))
- `PUT /reservations/areas/:id` — Update an area ([docs](/docs/reservations))
- `DELETE /reservations/areas/:id` — Delete an area ([docs](/docs/reservations))
- `GET /reservations/availability` — Bookable slots for a date ([docs](/docs/reservations))
- `GET /reservations/export/csv` — Export the service book as CSV ([docs](/docs/reservations))
- `GET /reservations/settings` — Get reservation settings ([docs](/docs/reservations))
- `PUT /reservations/settings` — Update reservation settings ([docs](/docs/reservations))
- `GET /reservations/stats` — Today's service counters ([docs](/docs/reservations))

**Categories**

- `GET /categories` — List categories ([docs](/docs/categories))
- `POST /categories` — Create category ([docs](/docs/categories))
- `GET /categories/:id` — Get category ([docs](/docs/categories))
- `PUT /categories/:id` — Update category ([docs](/docs/categories))
- `DELETE /categories/:id` — Delete category ([docs](/docs/categories))
- `GET /categories/:id/branches` — Get branch availability for category ([docs](/docs/categories))
- `PUT /categories/:id/branches` — Update branch availability for category ([docs](/docs/categories))
- `POST /categories/:id/generate-seo` — Generate SEO metadata for category ([docs](/docs/categories))
- `POST /categories/bulk-generate-seo` — Bulk-generate SEO metadata for categories ([docs](/docs/categories))

**Brands**

- `GET /brands` — List brands ([docs](/docs/brands))
- `POST /brands` — Create brand ([docs](/docs/brands))
- `GET /brands/:id` — Get brand ([docs](/docs/brands))
- `PUT /brands/:id` — Update brand ([docs](/docs/brands))
- `DELETE /brands/:id` — Delete brand ([docs](/docs/brands))

**Orders**

- `GET /orders` — List orders ([docs](/docs/orders))
- `POST /orders` — Create order ([docs](/docs/orders))
- `GET /orders/:id` — Get order details ([docs](/docs/orders))
- `PUT /orders/:id` — Update order (full) ([docs](/docs/orders))
- `DELETE /orders/:id` — Delete order ([docs](/docs/orders))
- `POST /orders/:id/assign-rider` — Assign or unassign a rider to an order ([docs](/docs/orders))
- `POST /orders/:id/notes` — Add a note to an order ([docs](/docs/orders))
- `PATCH /orders/:id/payment-status` — Update payment status ([docs](/docs/orders))
- `POST /orders/:id/resend-confirmation-email` — Resend order confirmation email ([docs](/docs/orders))
- `PUT /orders/:id/status` — Update order status ([docs](/docs/orders))
- `PATCH /orders/:id/status` — Update order status (PATCH) ([docs](/docs/orders))
- `PATCH /orders/:id/view` — Mark order as viewed ([docs](/docs/orders))
- `GET /orders/batch` — Fetch multiple orders by IDs ([docs](/docs/orders))
- `POST /orders/batch` — Create multiple orders (batch) ([docs](/docs/orders))
- `GET /orders/count/unviewed` — Count unviewed orders ([docs](/docs/orders))
- `GET /orders/export` — Export orders as CSV ([docs](/docs/orders))
- `GET /orders/sources` — List all order sources ([docs](/docs/orders))

**Customers**

- `GET /customers` — List customers ([docs](/docs/customers))
- `POST /customers` — Create customer ([docs](/docs/customers))
- `GET /customers/:id` — Get customer details ([docs](/docs/customers))
- `DELETE /customers/:id` — Delete customer ([docs](/docs/customers))
- `GET /customers/:id/loyalty` — Get loyalty points balance and ledger ([docs](/docs/customers))
- `POST /customers/:id/notes` — Add customer note ([docs](/docs/customers))
- `PUT /customers/:id/password` — Update customer password ([docs](/docs/customers))
- `POST /customers/import` — Bulk import customers ([docs](/docs/customers))
- `GET /customers/loyalty-registrations` — List loyalty program registrations ([docs](/docs/customers))
- `GET /customers/loyalty-registrations/:id` — Get loyalty registration details ([docs](/docs/customers))
- `POST /customers/loyalty-registrations/:id/approve` — Approve loyalty registration ([docs](/docs/customers))
- `POST /customers/loyalty-registrations/:id/reject` — Reject loyalty registration ([docs](/docs/customers))

**Branches**

- `GET /branches` — List branches ([docs](/docs/branches))
- `POST /branches` — Create branch ([docs](/docs/branches))
- `GET /branches/:id` — Get branch ([docs](/docs/branches))
- `PUT /branches/:id` — Update branch ([docs](/docs/branches))
- `DELETE /branches/:id` — Delete branch ([docs](/docs/branches))
- `GET /branches/:id/integrations` — Get branch integrations ([docs](/docs/branches))
- `PUT /branches/:id/integrations/:integrationKey` — Update branch integration ([docs](/docs/branches))
- `GET /branches/config` — Get branch options ([docs](/docs/branches))
- `PUT /branches/config` — Update branch options ([docs](/docs/branches))

**Shipping**

- `GET /shipping/convenient-couriers` — Get Convenient Couriers Config ([docs](/docs/shipping))
- `PUT /shipping/convenient-couriers` — Update Convenient Couriers Config ([docs](/docs/shipping))
- `GET /shipping/distance-based-shipping` — Get Distance-Based Shipping Config ([docs](/docs/shipping))
- `PUT /shipping/distance-based-shipping` — Update Distance-Based Shipping Config ([docs](/docs/shipping))
- `POST /shipping/external/calculate` — Calculate shipping rates for external systems ([docs](/docs/shipping))
- `GET /shipping/methods` — List Shipping Methods ([docs](/docs/shipping))
- `POST /shipping/methods` — Create Shipping Method ([docs](/docs/shipping))
- `GET /shipping/methods/:id` — Get Shipping Method ([docs](/docs/shipping))
- `PUT /shipping/methods/:id` — Update Shipping Method ([docs](/docs/shipping))
- `DELETE /shipping/methods/:id` — Delete Shipping Method ([docs](/docs/shipping))
- `GET /shipping/shipments` — List shipments ([docs](/docs/shipping))
- `GET /shipping/shipments/:id` — Get Shipment ([docs](/docs/shipping))
- `GET /shipping/zones` — List shipping zones ([docs](/docs/shipping))
- `POST /shipping/zones` — Create shipping zone ([docs](/docs/shipping))
- `GET /shipping/zones/:id` — Get Shipping Zone ([docs](/docs/shipping))
- `PUT /shipping/zones/:id` — Update Shipping Zone ([docs](/docs/shipping))
- `DELETE /shipping/zones/:id` — Delete Shipping Zone ([docs](/docs/shipping))
- `GET /shipping/zones/:zoneId/areas` — List shipping areas in a zone ([docs](/docs/shipping))
- `POST /shipping/zones/:zoneId/areas` — Create a shipping area ([docs](/docs/shipping))
- `PUT /shipping/zones/:zoneId/areas/:areaId` — Update a shipping area ([docs](/docs/shipping))
- `DELETE /shipping/zones/:zoneId/areas/:areaId` — Delete a shipping area ([docs](/docs/shipping))
- `POST /shipping/zones/:zoneId/areas/import` — Bulk import shipping areas ([docs](/docs/shipping))

**Webhooks**

- `POST /storefront/webhooks/mpesa` — M-Pesa payment callback webhook ([docs](/docs/webhooks))
- `GET /webhooks` — List webhooks ([docs](/docs/webhooks))
- `POST /webhooks` — Create webhook ([docs](/docs/webhooks))
- `GET /webhooks/:id` — Get webhook ([docs](/docs/webhooks))
- `PUT /webhooks/:id` — Update webhook ([docs](/docs/webhooks))
- `DELETE /webhooks/:id` — Delete webhook ([docs](/docs/webhooks))
- `GET /webhooks/:id/deliveries` — Get webhook delivery logs ([docs](/docs/webhooks))
- `POST /webhooks/:id/test` — Test webhook delivery ([docs](/docs/webhooks))
- `POST /webhooks/mpesa` — M-Pesa payment callback webhook (backwards-compat alias) ([docs](/docs/webhooks))

**API Keys**

- `GET /api-keys` — List API keys ([docs](/docs/api-keys))
- `POST /api-keys` — Create API key ([docs](/docs/api-keys))
- `GET /api-keys/:id` — Get API key details ([docs](/docs/api-keys))
- `PUT /api-keys/:id` — Update API key ([docs](/docs/api-keys))
- `DELETE /api-keys/:id` — Delete API key ([docs](/docs/api-keys))
- `POST /api-keys/:id/regenerate` — Regenerate API key secret ([docs](/docs/api-keys))

**Settings**

- `GET /settings` — Get all settings ([docs](/docs/settings))
- `PUT /settings/:key` — Update setting ([docs](/docs/settings))
- `GET /settings/admin-maps-key` — Get the admin Google Maps key ([docs](/docs/settings))
- `PUT /settings/admin-maps-key` — Update the admin Google Maps key ([docs](/docs/settings))
- `GET /settings/api-operation-logs` — List API operation logs ([docs](/docs/settings))
- `DELETE /settings/api-operation-logs` — Delete API operation logs ([docs](/docs/settings))
- `POST /settings/api-operation-logs/:id/undo` — Undo an API operation ([docs](/docs/settings))
- `GET /settings/background-tasks` — List background tasks ([docs](/docs/settings))
- `GET /settings/background-tasks-archive` — List archived (completed/failed) background tasks ([docs](/docs/settings))
- `GET /settings/background-tasks/:id` — Get a background task by ID ([docs](/docs/settings))
- `POST /settings/background-tasks/:id/cancel` — Cancel a background task ([docs](/docs/settings))
- `GET /settings/background-tasks/:id/report` — Download a background task failure report ([docs](/docs/settings))
- `POST /settings/bulk-delete` — Delete multiple resources in a background task ([docs](/docs/settings))
- `POST /settings/clear-storefront-cache` — Clear storefront cache ([docs](/docs/settings))
- `GET /settings/currencies` — List supported currencies ([docs](/docs/settings))
- `POST /settings/currencies` — Create a new currency ([docs](/docs/settings))
- `PUT /settings/currencies/:id` — Update currency ([docs](/docs/settings))
- `DELETE /settings/currencies/:id` — Delete currency ([docs](/docs/settings))
- `POST /settings/currencies/refresh` — Refresh all currency exchange rates ([docs](/docs/settings))
- `GET /settings/emails` — Get email templates ([docs](/docs/settings))
- `POST /settings/emails` — Create a new email template ([docs](/docs/settings))
- `PUT /settings/emails/:id` — Update email template ([docs](/docs/settings))
- `DELETE /settings/emails/:id` — Delete an email template ([docs](/docs/settings))
- `POST /settings/emails/:id/generate` — Generate email content using AI ([docs](/docs/settings))
- `POST /settings/emails/:id/preview` — Preview an email template with sample data ([docs](/docs/settings))
- `POST /settings/emails/:id/test` — Send a test email ([docs](/docs/settings))
- `POST /settings/emails/seed-defaults` — Create missing default email templates ([docs](/docs/settings))
- `GET /settings/order-number` — Get order number configuration ([docs](/docs/settings))
- `POST /settings/order-number/reset-sequence` — Reset order number sequence ([docs](/docs/settings))
- `GET /settings/payment-gateways` — Get payment gateways ([docs](/docs/settings))
- `PUT /settings/payment-gateways/:id` — Update payment gateway ([docs](/docs/settings))
- `POST /settings/s3-migration/cancel` — Cancel running S3 migration ([docs](/docs/settings))
- `GET /settings/s3-migration/source-config` — Get S3 source configuration ([docs](/docs/settings))
- `POST /settings/s3-migration/start` — Start S3 asset migration ([docs](/docs/settings))
- `GET /settings/s3-migration/status` — Get S3 migration status ([docs](/docs/settings))
- `POST /settings/s3-migration/test-connection` — Test S3 destination connection ([docs](/docs/settings))
- `PUT /settings/shop/:key` — Update shop setting ([docs](/docs/settings))
- `PUT /settings/site-favicon` — Upload site favicon ([docs](/docs/settings))
- `PUT /settings/site-logo` — Upload site logo ([docs](/docs/settings))

**Transactions**

- `GET /transactions` — List transactions ([docs](/docs/analytics))

**Media**

- `GET /media` — List media files ([docs](/docs/media))
- `PATCH /media/:id` — Update media metadata ([docs](/docs/media))
- `DELETE /media/:id` — Delete media file ([docs](/docs/media))
- `POST /media/upload` — Upload file ([docs](/docs/media))

**Marketing**

- `GET /marketing` — Marketing overview ([docs](/docs/marketing))
- `GET /marketing/abandoned-carts` — List abandoned carts ([docs](/docs/marketing))
- `DELETE /marketing/abandoned-carts/:id` — Delete abandoned cart ([docs](/docs/marketing))
- `POST /marketing/abandoned-carts/:id/trigger-automation` — Trigger cart recovery automation ([docs](/docs/marketing))
- `PATCH /marketing/abandoned-carts/:id/view` — Mark abandoned cart as viewed ([docs](/docs/marketing))
- `GET /marketing/abandoned-carts/count/unviewed` — Count unviewed abandoned carts ([docs](/docs/marketing))
- `GET /marketing/automation/campaigns` — List automation campaigns ([docs](/docs/marketing))
- `GET /marketing/automation/campaigns/:type` — Get automation campaign ([docs](/docs/marketing))
- `PUT /marketing/automation/campaigns/:type` — Update automation campaign ([docs](/docs/marketing))
- `GET /marketing/automation/runs` — List automation runs ([docs](/docs/marketing))
- `GET /marketing/automation/status` — Automation addon status ([docs](/docs/marketing))
- `GET /marketing/automation/template-variables` — Get template variables ([docs](/docs/marketing))
- `POST /marketing/automation/templates/enhance` — AI-enhance email template ([docs](/docs/marketing))
- `GET /marketing/contacts` — List contacts ([docs](/docs/marketing))
- `POST /marketing/contacts` — Create contact ([docs](/docs/marketing))
- `PUT /marketing/contacts/:id` — Update contact ([docs](/docs/marketing))
- `DELETE /marketing/contacts/:id` — Delete contact ([docs](/docs/marketing))
- `POST /marketing/contacts/bulk` — Perform bulk actions on contacts ([docs](/docs/marketing))
- `GET /marketing/contacts/groups` — List contact groups with member counts ([docs](/docs/marketing))
- `POST /marketing/contacts/import` — Bulk import marketing contacts ([docs](/docs/marketing))
- `GET /marketing/contacts/stats` — Contact statistics ([docs](/docs/marketing))
- `GET /marketing/coupons` — List coupons ([docs](/docs/marketing))
- `POST /marketing/coupons` — Create coupon ([docs](/docs/marketing))
- `GET /marketing/coupons/:id` — Get coupon ([docs](/docs/marketing))
- `PUT /marketing/coupons/:id` — Update coupon ([docs](/docs/marketing))
- `DELETE /marketing/coupons/:id` — Delete coupon ([docs](/docs/marketing))
- `GET /marketing/coupons/:id/usage` — Get coupon usage history ([docs](/docs/marketing))
- `POST /marketing/coupons/:id/validate` — Validate coupon ([docs](/docs/marketing))
- `GET /marketing/coupons/stats` — Coupon statistics ([docs](/docs/marketing))
- `POST /marketing/loyalty/adjust` — Adjust loyalty points ([docs](/docs/marketing))
- `GET /marketing/loyalty/balances` — List customer loyalty balances ([docs](/docs/marketing))
- `GET /marketing/loyalty/balances/:customer_id` — Get customer loyalty balance ([docs](/docs/marketing))
- `GET /marketing/loyalty/config` — Get loyalty program configuration ([docs](/docs/marketing))
- `GET /marketing/loyalty/ledger` — Global loyalty points ledger ([docs](/docs/marketing))
- `GET /marketing/loyalty/registrations` — List loyalty registrations ([docs](/docs/marketing))
- `PUT /marketing/loyalty/registrations/:id` — Approve or reject loyalty registration ([docs](/docs/marketing))
- `GET /marketing/loyalty/stats` — Loyalty program statistics ([docs](/docs/marketing))
- `POST /marketing/subscribe` — Subscribe to newsletter (public) ([docs](/docs/marketing))

**Analytics**

- `GET /analytics` — Get full analytics dashboard ([docs](/docs/analytics))
- `GET /analytics/overview` — Get quick analytics overview ([docs](/docs/analytics))
- `GET /analytics/revenue` — Get revenue-focused analytics ([docs](/docs/analytics))

**Reviews**

- `GET /reviews` — List reviews ([docs](/docs/reviews))
- `PUT /reviews/:id` — Update review (approve/reject) ([docs](/docs/reviews))
- `DELETE /reviews/:id` — Delete review ([docs](/docs/reviews))
- `PUT /reviews/:id/approve` — Approve a review ([docs](/docs/reviews))
- `PUT /reviews/:id/reject` — Reject a review ([docs](/docs/reviews))

**Tags**

- `GET /tags` — List tags ([docs](/docs/attributes-tags))
- `POST /tags` — Create tag ([docs](/docs/attributes-tags))
- `PUT /tags/:id` — Update tag ([docs](/docs/attributes-tags))
- `DELETE /tags/:id` — Delete tag ([docs](/docs/attributes-tags))

**Attributes**

- `GET /attributes` — List attributes ([docs](/docs/attributes-tags))
- `POST /attributes` — Create attribute ([docs](/docs/attributes-tags))
- `PUT /attributes/:id` — Update attribute ([docs](/docs/attributes-tags))
- `POST /attributes/:id/values` — Create attribute value ([docs](/docs/attributes-tags))

**Subscriptions**

- `GET /subscriptions/packages` — List subscription packages ([docs](/docs/subscriptions))
- `POST /subscriptions/packages` — Create subscription package ([docs](/docs/subscriptions))
- `GET /subscriptions/packages/:id` — Get subscription package ([docs](/docs/subscriptions))
- `PUT /subscriptions/packages/:id` — Update subscription package ([docs](/docs/subscriptions))
- `DELETE /subscriptions/packages/:id` — Delete subscription package ([docs](/docs/subscriptions))
- `GET /subscriptions/payment-callback` — Handle payment callback (GET) ([docs](/docs/subscriptions))
- `POST /subscriptions/payment-callback` — Handle payment callback (POST) ([docs](/docs/subscriptions))
- `GET /subscriptions/subscribers` — List subscriptions ([docs](/docs/subscriptions))
- `POST /subscriptions/subscribers` — Create subscription ([docs](/docs/subscriptions))
- `GET /subscriptions/subscribers/:id` — Get subscription ([docs](/docs/subscriptions))
- `PATCH /subscriptions/subscribers/:id` — Update subscription ([docs](/docs/subscriptions))
- `DELETE /subscriptions/subscribers/:id` — Delete subscription ([docs](/docs/subscriptions))
- `POST /subscriptions/subscribers/:id/payment-link` — Generate Pesapal payment link ([docs](/docs/subscriptions))
- `POST /subscriptions/subscribers/:id/send-reminder` — Send payment reminder ([docs](/docs/subscriptions))

**Admin**

- `GET /admin/activity-logs` — List activity logs ([docs](/docs/admin-users))
- `GET /admin/activity-logs/:id` — Get a single activity log entry ([docs](/docs/admin-users))
- `GET /admin/activity-logs/export` — Export activity logs as CSV ([docs](/docs/admin-users))
- `GET /admin/roles` — List roles ([docs](/docs/admin-users))
- `POST /admin/roles` — Create a role ([docs](/docs/admin-users))
- `PUT /admin/roles/:id` — Update a role ([docs](/docs/admin-users))
- `DELETE /admin/roles/:id` — Delete a role ([docs](/docs/admin-users))
- `POST /admin/test-email` — Send a test email ([docs](/docs/admin-users))
- `GET /admin/users` — List admin users ([docs](/docs/admin-users))
- `POST /admin/users` — Create a staff user ([docs](/docs/admin-users))
- `PUT /admin/users/:id` — Update a staff user ([docs](/docs/admin-users))
- `DELETE /admin/users/:id` — Delete a staff user ([docs](/docs/admin-users))
- `GET /admin/users/:id/branches` — Get user branch access ([docs](/docs/admin-users))
- `PUT /admin/users/:id/branches` — Update user branch access ([docs](/docs/admin-users))
- `PUT /admin/users/:id/password` — Reset a staff user password ([docs](/docs/admin-users))

**Themes**

- `GET /themes` — List themes ([docs](/docs/appearance))
- `GET /themes/:id` — Get theme ([docs](/docs/appearance))
- `PUT /themes/:id` — Update theme ([docs](/docs/appearance))

**AI Image**

- `GET /ai-image/config` — Get AI Image Configuration ([docs](/docs/ai-image))
- `PUT /ai-image/config` — Update AI Image Configuration ([docs](/docs/ai-image))
- `POST /ai-image/products/:id/images/apply` — Save Generated Image to S3 ([docs](/docs/ai-image))
- `POST /ai-image/products/:id/images/enhance` — Enhance Existing Product Image ([docs](/docs/ai-image))
- `POST /ai-image/products/:id/images/generate` — Generate Image from Text ([docs](/docs/ai-image))
- `POST /ai-image/test` — Test AI Image Generation ([docs](/docs/ai-image))

**AI Search**

- `GET /ai-search/analytics` — Get search analytics ([docs](/docs/ai-search))
- `GET /ai-search/breaker` — Get circuit breaker status ([docs](/docs/ai-search))
- `POST /ai-search/breaker/reset` — Reset circuit breaker ([docs](/docs/ai-search))
- `GET /ai-search/config` — Get AI Search configuration ([docs](/docs/ai-search))
- `PUT /ai-search/config` — Update AI Search configuration ([docs](/docs/ai-search))
- `POST /ai-search/reindex` — Enqueue bulk reindex ([docs](/docs/ai-search))
- `GET /ai-search/stats` — Get AI Search stats ([docs](/docs/ai-search))
- `GET /ai-search/synonyms` — List search synonyms ([docs](/docs/ai-search))
- `POST /ai-search/synonyms` — Create search synonym ([docs](/docs/ai-search))
- `PUT /ai-search/synonyms/:id` — Update search synonym ([docs](/docs/ai-search))
- `DELETE /ai-search/synonyms/:id` — Delete search synonym ([docs](/docs/ai-search))
- `POST /ai-search/synonyms/import` — Bulk import synonyms ([docs](/docs/ai-search))
- `POST /ai-search/synonyms/seed-defaults` — Seed default synonyms ([docs](/docs/ai-search))
- `POST /ai-search/test-search` — Test search query ([docs](/docs/ai-search))
- `POST /ai/chat` — Send messages to AI and receive responses ([docs](/docs/ai-assistant))

**Affiliates**

- `GET /affiliate` — List affiliates ([docs](/docs/affiliates))
- `GET /affiliate/:id` — Get affiliate details ([docs](/docs/affiliates))
- `PUT /affiliate/:id` — Update affiliate rate overrides ([docs](/docs/affiliates))
- `POST /affiliate/:id/adjust` — Manually adjust affiliate wallet ([docs](/docs/affiliates))
- `GET /affiliate/:id/ledger` — Get affiliate wallet ledger ([docs](/docs/affiliates))
- `GET /affiliate/:id/referrals` — List affiliate referrals ([docs](/docs/affiliates))
- `PUT /affiliate/:id/status` — Update affiliate status ([docs](/docs/affiliates))
- `GET /affiliate/commissions/list` — List affiliate commissions ([docs](/docs/affiliates))
- `GET /affiliate/config` — Get affiliate configuration ([docs](/docs/affiliates))
- `PUT /affiliate/config` — Update affiliate configuration ([docs](/docs/affiliates))
- `POST /affiliate/payouts/:id/cancel` — Cancel payout and refund wallet ([docs](/docs/affiliates))
- `POST /affiliate/payouts/:id/mark-paid` — Mark payout as paid ([docs](/docs/affiliates))
- `POST /affiliate/payouts/:id/retry` — Retry failed Paystack transfer ([docs](/docs/affiliates))
- `GET /affiliate/payouts/list` — List affiliate payouts ([docs](/docs/affiliates))
- `GET /affiliate/stats` — Get affiliate program statistics ([docs](/docs/affiliates))
- `GET /affiliate/wallets/list` — List affiliate wallets ([docs](/docs/affiliates))
- `GET /storefront/affiliate/config` — Get affiliate program configuration ([docs](/docs/affiliates))
- `POST /storefront/affiliate/preview-discount` — Preview affiliate referral discount ([docs](/docs/affiliates))
- `POST /storefront/affiliate/track` — Track referral click ([docs](/docs/affiliates))

**Appearance**

- `GET /appearance/banners` — List all banners ([docs](/docs/appearance))
- `POST /appearance/banners` — Create a banner ([docs](/docs/appearance))
- `PUT /appearance/banners/:id` — Update a banner ([docs](/docs/appearance))
- `DELETE /appearance/banners/:id` — Delete a banner ([docs](/docs/appearance))
- `GET /appearance/blogs` — Get storefront blog posts ([docs](/docs/appearance))
- `PUT /appearance/blogs` — Update storefront blog posts ([docs](/docs/appearance))
- `GET /appearance/custom-scripts` — Get custom scripts (head, body-start, body-end) ([docs](/docs/appearance))
- `PUT /appearance/custom-scripts` — Update custom scripts ([docs](/docs/appearance))
- `GET /appearance/faqs` — Get storefront FAQs ([docs](/docs/appearance))
- `PUT /appearance/faqs` — Update storefront FAQs ([docs](/docs/appearance))
- `GET /appearance/homepage-sections` — Get homepage sections configuration ([docs](/docs/appearance))
- `PUT /appearance/homepage-sections` — Update homepage sections configuration ([docs](/docs/appearance))
- `PUT /appearance/menu-items/:id` — Update a menu item ([docs](/docs/appearance))
- `DELETE /appearance/menu-items/:id` — Delete a menu item ([docs](/docs/appearance))
- `GET /appearance/menus` — List all menus ([docs](/docs/appearance))
- `POST /appearance/menus` — Create a menu ([docs](/docs/appearance))
- `PUT /appearance/menus/:id` — Update a menu ([docs](/docs/appearance))
- `DELETE /appearance/menus/:id` — Delete a menu ([docs](/docs/appearance))
- `POST /appearance/menus/:id/items` — Create a menu item ([docs](/docs/appearance))
- `GET /appearance/pages` — List all pages ([docs](/docs/appearance))
- `POST /appearance/pages` — Create a page ([docs](/docs/appearance))
- `PUT /appearance/pages/:id` — Update a page ([docs](/docs/appearance))
- `DELETE /appearance/pages/:id` — Delete a page ([docs](/docs/appearance))
- `POST /appearance/pages/regenerate-html` — Generate page HTML with AI ([docs](/docs/appearance))
- `GET /appearance/shop-settings` — Get all shop settings ([docs](/docs/appearance))
- `GET /appearance/store-locator` — Get store-locator configuration ([docs](/docs/appearance))
- `PUT /appearance/store-locator` — Update store-locator configuration ([docs](/docs/appearance))
- `POST /themes` — Create theme ([docs](/docs/appearance))
- `DELETE /themes/:id` — Delete theme ([docs](/docs/appearance))
- `POST /themes/:id/activate` — Activate theme ([docs](/docs/appearance))
- `POST /themes/:id/deactivate` — Deactivate theme ([docs](/docs/appearance))
- `GET /themes/active` — Get active theme ([docs](/docs/appearance))

**Appearance Agent**

- `GET /appearance/agent/changes` — List changes made by agent or user ([docs](/docs/appearance))
- `POST /appearance/agent/changes/:id/undo` — Undo a single change ([docs](/docs/appearance))
- `GET /appearance/agent/config` — Get Appearance Agent configuration ([docs](/docs/appearance))
- `GET /appearance/agent/conversations` — List user's conversations ([docs](/docs/appearance))
- `POST /appearance/agent/conversations` — Create new conversation ([docs](/docs/appearance))
- `POST /appearance/agent/conversations/:id/cancel` — Cancel a running conversation ([docs](/docs/appearance))
- `GET /appearance/agent/conversations/:id/messages` — Retrieve conversation messages and changes ([docs](/docs/appearance))
- `POST /appearance/agent/conversations/:id/messages` — Send message and run agent turn ([docs](/docs/appearance))
- `POST /appearance/agent/conversations/:id/undo-all` — Undo all changes in conversation ([docs](/docs/appearance))
- `GET /appearance/agent/pages` — List pages for Appearance Agent ([docs](/docs/appearance))
- `GET /appearance/agent/products/:id` — Get product card state ([docs](/docs/appearance))
- `PUT /appearance/agent/products/:id/images` — Reorder or remove product images ([docs](/docs/appearance))
- `POST /appearance/agent/products/:id/status` — Publish or unpublish product ([docs](/docs/appearance))
- `POST /appearance/agent/uploads` — Upload attachment for agent conversation ([docs](/docs/appearance))

**Catalog Feed**

- `GET /catalog/products.xml` — Product feed for Google Merchant Center and Facebook Catalog ([docs](/docs/catalog-feed))

**Distributors**

- `GET /distributors` — List distributors ([docs](/docs/distributors))
- `GET /distributors/:id` — Get distributor details ([docs](/docs/distributors))
- `PUT /distributors/:id/pricing` — Set per-distributor pricing overrides ([docs](/docs/distributors))
- `PUT /distributors/:id/status` — Update distributor approval status ([docs](/docs/distributors))
- `GET /distributors/bands` — List store-wide discount bands ([docs](/docs/distributors))
- `POST /distributors/bands` — Create a discount band ([docs](/docs/distributors))
- `PUT /distributors/bands/:id` — Update a discount band ([docs](/docs/distributors))
- `DELETE /distributors/bands/:id` — Delete a discount band ([docs](/docs/distributors))
- `GET /distributors/config` — Get distributor programme configuration ([docs](/docs/distributors))
- `PUT /distributors/config` — Update distributor programme configuration ([docs](/docs/distributors))
- `GET /distributors/product-pricing` — List products with distributor pricing ([docs](/docs/distributors))
- `PUT /distributors/product-pricing/:productId` — Upsert product-level distributor pricing ([docs](/docs/distributors))
- `DELETE /distributors/product-pricing/:productId` — Delete product-level distributor pricing ([docs](/docs/distributors))
- `POST /distributors/product-pricing/bulk` — Bulk import product distributor pricing ([docs](/docs/distributors))
- `GET /storefront/customer/distributor` — Get customer's distributor status ([docs](/docs/distributors))
- `POST /storefront/customer/distributor/apply` — Apply to the distributor programme ([docs](/docs/distributors))
- `POST /storefront/customer/distributor/preview-discount` — Preview distributor discount ([docs](/docs/distributors))
- `GET /storefront/distributor/config` — Get distributor programme config ([docs](/docs/distributors))

**Plugins**

- `GET /plugins` — List all plugins ([docs](/docs/plugins))
- `GET /plugins/:id` — Get a single plugin ([docs](/docs/plugins))
- `PUT /plugins/:id/config` — Update plugin configuration ([docs](/docs/plugins))
- `POST /plugins/:id/disable` — Disable a plugin ([docs](/docs/plugins))
- `POST /plugins/:id/enable` — Enable a plugin ([docs](/docs/plugins))

**Prescriptions**

- `GET /prescriptions` — List prescriptions ([docs](/docs/prescriptions))
- `GET /prescriptions/:id` — Get prescription details ([docs](/docs/prescriptions))
- `DELETE /prescriptions/:id` — Delete prescription ([docs](/docs/prescriptions))
- `POST /prescriptions/:id/create-order` — Create order from prescription ([docs](/docs/prescriptions))
- `PUT /prescriptions/:id/notes` — Update prescription notes ([docs](/docs/prescriptions))
- `PUT /prescriptions/:id/reject` — Reject prescription ([docs](/docs/prescriptions))
- `PUT /prescriptions/:id/verify` — Verify prescription ([docs](/docs/prescriptions))
- `GET /prescriptions/stats` — Prescription statistics ([docs](/docs/prescriptions))
- `GET /storefront/prescriptions/check-cart` — Check which cart products require prescriptions ([docs](/docs/storefront-content))
- `GET /storefront/prescriptions/mine` — List authenticated customer's prescriptions ([docs](/docs/storefront-content))
- `POST /storefront/prescriptions/upload` — Upload a prescription ([docs](/docs/storefront-content))

**Push Notifications**

- `POST /push-tokens` — Register device push token ([docs](/docs/push-notifications))
- `DELETE /push-tokens` — Remove device push token ([docs](/docs/push-notifications))

**Rider App**

- `POST /rider/location` — Submit location samples ([docs](/docs/riders))
- `GET /rider/me` — Get current rider profile ([docs](/docs/riders))
- `POST /rider/online` — Toggle online/offline status ([docs](/docs/riders))
- `GET /rider/orders` — List rider's assigned orders ([docs](/docs/riders))
- `GET /rider/orders/:id` — Get single order details ([docs](/docs/riders))
- `POST /rider/orders/:id/accept` — Accept an assigned order ([docs](/docs/riders))
- `POST /rider/orders/:id/deliver` — Mark order as delivered ([docs](/docs/riders))
- `POST /rider/orders/:id/pickup` — Mark order as picked up ([docs](/docs/riders))
- `POST /rider/orders/:id/proof` — Attach proof of delivery photo ([docs](/docs/riders))
- `POST /rider/push-token` — Register Expo push token ([docs](/docs/riders))

**Riders**

- `GET /admin/orders/:id/track` — Get order delivery tracking data ([docs](/docs/riders))
- `GET /admin/riders/:id/locations` — Get rider location history ([docs](/docs/riders))
- `GET /riders` — List riders ([docs](/docs/riders))
- `POST /riders` — Create a rider ([docs](/docs/riders))
- `GET /riders/:id` — Get a rider by ID ([docs](/docs/riders))
- `PUT /riders/:id` — Update a rider ([docs](/docs/riders))
- `DELETE /riders/:id` — Delete or archive a rider ([docs](/docs/riders))
- `GET /riders/config` — Get Riders addon configuration ([docs](/docs/riders))

**Storefront - Cart**

- `GET /storefront/cart` — Get cart items ([docs](/docs/storefront-cart))
- `POST /storefront/cart` — Add item to cart ([docs](/docs/storefront-cart))
- `DELETE /storefront/cart` — Clear entire cart ([docs](/docs/storefront-cart))
- `PUT /storefront/cart/:id` — Update cart item quantity ([docs](/docs/storefront-cart))
- `DELETE /storefront/cart/:id` — Remove item from cart ([docs](/docs/storefront-cart))
- `POST /storefront/cart/merge` — Merge guest cart into customer cart ([docs](/docs/storefront-cart))
- `POST /storefront/cart/validate-branch-stock` — Validate cart items at a branch ([docs](/docs/storefront-cart))

**Storefront - Catalog**

- `GET /storefront/attributes` — Get product attributes ([docs](/docs/storefront-content))
- `GET /storefront/branch-stock` — Get live branch stock status ([docs](/docs/storefront-catalog))
- `GET /storefront/branches` — Get shop branch locations ([docs](/docs/storefront-catalog))
- `GET /storefront/brands` — Get all brands ([docs](/docs/storefront-catalog))
- `GET /storefront/categories` — Get category tree ([docs](/docs/storefront-catalog))
- `GET /storefront/categories/:slug` — Get category by slug ([docs](/docs/storefront-catalog))
- `GET /storefront/currencies` — Get currencies and rates ([docs](/docs/storefront-catalog))
- `GET /storefront/locations/countries` — Get list of supported countries ([docs](/docs/storefront-catalog))
- `GET /storefront/products` — List products ([docs](/docs/storefront-catalog))
- `GET /storefront/products/:slug` — Get product by slug ([docs](/docs/storefront-catalog))
- `GET /storefront/products/by-ids` — Get products by IDs ([docs](/docs/storefront-catalog))
- `GET /storefront/tags` — Get all product tags ([docs](/docs/storefront-catalog))
- `GET /storefront/test` — Test storefront routing ([docs](/docs/storefront-content))

**Storefront - Checkout**

- `POST /storefront/checkout/calculate-shipping` — Calculate shipping costs ([docs](/docs/storefront-checkout))
- `GET /storefront/checkout/convenient-couriers-config` — Get distance-based shipping configuration ([docs](/docs/storefront-checkout))
- `POST /storefront/checkout/create-order` — Create order from cart ([docs](/docs/storefront-checkout))
- `GET /storefront/checkout/distance-based-shipping-config` — Get distance-based shipping config ([docs](/docs/storefront-checkout))
- `GET /storefront/checkout/payment-gateways` — List enabled payment gateways ([docs](/docs/storefront-checkout))
- `POST /storefront/checkout/process-payment` — Process payment through gateway ([docs](/docs/storefront-checkout))
- `POST /storefront/checkout/unified-checkout/authorize` — Authorize Unified Checkout payment ([docs](/docs/storefront-checkout))
- `POST /storefront/checkout/unified-checkout/capture-context` — Get Unified Checkout capture context ([docs](/docs/storefront-checkout))
- `POST /storefront/checkout/unified-checkout/record-result` — Record Unified Checkout orchestrated result ([docs](/docs/storefront-checkout))
- `POST /storefront/checkout/validate-coupon` — Validate coupon code ([docs](/docs/storefront-checkout))
- `GET /storefront/orders/:id/payment-status` — Get order payment status ([docs](/docs/storefront-checkout))
- `POST /storefront/orders/:id/verify-payment` — Verify payment on-demand ([docs](/docs/storefront-checkout))
- `POST /storefront/paystack/reconcile` — Reconcile Paystack payment status ([docs](/docs/storefront-checkout))
- `GET /storefront/shipping/areas` — Get shipping areas ([docs](/docs/storefront-content))
- `GET /storefront/webhooks/pesapal/callback` — Pesapal payment callback ([docs](/docs/storefront-checkout))
- `POST /storefront/webhooks/tingg/ipn/:secret` — Tingg payment notification (IPN) ([docs](/docs/storefront-checkout))
- `GET /storefront/webhooks/tingg/return` — Tingg customer return ([docs](/docs/storefront-checkout))

**Storefront - Content**

- `GET /blog` — List blog posts ([docs](/docs/blog))
- `POST /blog` — Create a blog post ([docs](/docs/blog))
- `GET /blog/:id` — Get a single blog post ([docs](/docs/blog))
- `PUT /blog/:id` — Update a blog post ([docs](/docs/blog))
- `DELETE /blog/:id` — Delete a blog post ([docs](/docs/blog))
- `POST /blog/generate` — Generate a blog post with AI ([docs](/docs/blog))
- `GET /storefront/banners` — Get active banners ([docs](/docs/storefront-content))
- `GET /storefront/blogs` — List blog posts ([docs](/docs/storefront-content))
- `GET /storefront/blogs/:slug` — Get blog post by slug ([docs](/docs/storefront-content))
- `POST /storefront/contact` — Submit storefront contact form ([docs](/docs/storefront-content))
- `GET /storefront/custom-scripts` — Get custom scripts ([docs](/docs/storefront-content))
- `GET /storefront/debug/routes` — List debug routes registered on storefront ([docs](/docs/storefront-content))
- `GET /storefront/delivery-promise` — Get delivery promise ([docs](/docs/storefront-checkout))
- `GET /storefront/faqs` — List FAQs ([docs](/docs/storefront-content))
- `GET /storefront/homepage-sections` — Get homepage section configuration ([docs](/docs/storefront-content))
- `GET /storefront/marketing/abandoned-cart/restore` — Restore abandoned cart ([docs](/docs/storefront-content))
- `POST /storefront/marketing/abandoned-carts` — Track abandoned checkout ([docs](/docs/storefront-content))
- `GET /storefront/menus` — Get storefront menus ([docs](/docs/storefront-content))
- `GET /storefront/pages` — List published pages ([docs](/docs/storefront-content))
- `GET /storefront/pages/:slug` — Get page by slug ([docs](/docs/storefront-content))
- `GET /storefront/recipes` — List recipes (deprecated, use /blogs) ([docs](/docs/storefront-content))
- `GET /storefront/reviews` — List approved reviews ([docs](/docs/storefront-content))
- `POST /storefront/reviews` — Submit a review ([docs](/docs/storefront-content))
- `GET /storefront/reviews/by-ids` — Get reviews by IDs ([docs](/docs/storefront-content))
- `GET /storefront/settings` — Get public shop settings ([docs](/docs/storefront-content))
- `GET /storefront/sitemap.xml` — Get XML sitemap ([docs](/docs/storefront-content))
- `GET /storefront/sitemap/products` — Get products for XML sitemap ([docs](/docs/storefront-content))
- `GET /storefront/store-locator` — Get store locator config ([docs](/docs/storefront-content))
- `GET /storefront/theme` — Get active theme configuration ([docs](/docs/storefront-content))
- `GET /storefront/wishlist` — Get the wishlist ([docs](/docs/storefront-content))
- `POST /storefront/wishlist` — Add product to wishlist ([docs](/docs/storefront-content))
- `DELETE /storefront/wishlist/:productId` — Remove product from wishlist ([docs](/docs/storefront-content))
- `POST /storefront/wishlist/merge` — Merge guest wishlist on login ([docs](/docs/storefront-content))
- `POST /storefront/wishlist/share` — Create a share link ([docs](/docs/storefront-content))
- `GET /storefront/wishlist/shared/:token` — View a shared wishlist ([docs](/docs/storefront-content))

**Storefront - Customers**

- `POST /storefront/auth/forgot-password` — Request password reset link ([docs](/docs/storefront-customers))
- `POST /storefront/auth/login` — Customer login ([docs](/docs/storefront-customers))
- `POST /storefront/auth/logout` — Logout and destroy session ([docs](/docs/storefront-customers))
- `GET /storefront/auth/me` — Get current customer ([docs](/docs/storefront-customers))
- `POST /storefront/auth/register` — Customer registration ([docs](/docs/storefront-customers))
- `POST /storefront/auth/set-password` — Set/reset password with token ([docs](/docs/storefront-customers))
- `GET /storefront/auth/set-password/validate` — Validate password reset token ([docs](/docs/storefront-customers))
- `GET /storefront/customer/addresses` — List customer addresses ([docs](/docs/storefront-customers))
- `POST /storefront/customer/addresses` — Create a new customer address ([docs](/docs/storefront-customers))
- `PUT /storefront/customer/addresses/:id` — Update customer address ([docs](/docs/storefront-customers))
- `DELETE /storefront/customer/addresses/:id` — Delete customer address ([docs](/docs/storefront-customers))
- `GET /storefront/customer/affiliate` — Get affiliate status and earnings ([docs](/docs/storefront-customers))
- `POST /storefront/customer/affiliate/apply` — Apply to join affiliate program ([docs](/docs/storefront-customers))
- `POST /storefront/customer/affiliate/payout` — Request affiliate payout ([docs](/docs/storefront-customers))
- `PUT /storefront/customer/affiliate/payout-details` — Update payout destination ([docs](/docs/storefront-customers))
- `GET /storefront/customer/affiliate/payouts` — Get affiliate payout history ([docs](/docs/storefront-customers))
- `GET /storefront/customer/affiliate/referrals` — Get affiliate referrals and conversions ([docs](/docs/storefront-customers))
- `GET /storefront/customer/affiliate/wallet` — Get affiliate wallet ledger ([docs](/docs/storefront-customers))
- `GET /storefront/customer/loyalty` — Get customer loyalty status and balance ([docs](/docs/storefront-customers))
- `GET /storefront/customer/orders` — Get customer's orders ([docs](/docs/storefront-customers))
- `GET /storefront/customer/orders/:id` — Get customer's order by ID ([docs](/docs/storefront-customers))
- `GET /storefront/customer/profile` — Get customer profile ([docs](/docs/storefront-customers))
- `PUT /storefront/customer/profile` — Update signed-in customer profile ([docs](/docs/storefront-customers))
- `GET /storefront/customer/subscriptions` — Get customer's subscriptions ([docs](/docs/storefront-customers))
- `GET /storefront/loyalty/config` — Get loyalty configuration ([docs](/docs/storefront-customers))
- `POST /storefront/loyalty/register` — Register for loyalty program opt-in ([docs](/docs/storefront-customers))

**Storefront - Loyalty**

- `POST /storefront/loyalty/preview` — Preview loyalty point redemption ([docs](/docs/storefront-customers))
- `POST /storefront/loyalty/redemption/send-otp` — Send OTP for loyalty redemption ([docs](/docs/storefront-customers))
- `POST /storefront/loyalty/redemption/verify-otp` — Verify OTP and get redemption token ([docs](/docs/storefront-customers))

**Storefront - Reservations**

- `POST /storefront/reservations` — Create a new reservation ([docs](/docs/storefront-reservations))
- `GET /storefront/reservations/:reference` — Look up reservation by reference ([docs](/docs/storefront-reservations))
- `POST /storefront/reservations/:reference/cancel` — Cancel a reservation ([docs](/docs/storefront-reservations))
- `GET /storefront/reservations/availability` — Get available time slots ([docs](/docs/storefront-reservations))
- `GET /storefront/reservations/config` — Get reservations configuration ([docs](/docs/storefront-reservations))
- `GET /storefront/reservations/mine` — Get signed-in customer's bookings ([docs](/docs/storefront-reservations))

**Storefront - Search**

- `GET /storefront/ai-search` — Hybrid semantic + lexical product search ([docs](/docs/storefront-search))
- `GET /storefront/ai-search/health` — AI search addon health check ([docs](/docs/storefront-search))
- `POST /storefront/ai-search/track-click` — Track a product click in AI search results ([docs](/docs/storefront-search))
- `GET /storefront/recommendations/fbt` — Frequently bought together recommendations ([docs](/docs/storefront-search))
- `GET /storefront/recommendations/fbt-cart` — Frequently bought together for cart items ([docs](/docs/storefront-search))
- `GET /storefront/recommendations/for-you` — Get personalized product recommendations ([docs](/docs/storefront-search))
- `GET /storefront/recommendations/similar` — Similar product recommendations ([docs](/docs/storefront-search))

**Storefront - Subscriptions**

- `GET /storefront/subscription-packages` — Get active subscription packages ([docs](/docs/storefront-content))
- `POST /storefront/subscription-signup` — Sign up for a subscription ([docs](/docs/storefront-content))
- `GET /storefront/subscriptions/:id/summary` — Get subscription summary ([docs](/docs/storefront-content))

**WhatsApp**

- `GET /whatsapp/campaigns` — List all WhatsApp campaigns ([docs](/docs/whatsapp))
- `POST /whatsapp/campaigns` — Create a new campaign ([docs](/docs/whatsapp))
- `GET /whatsapp/campaigns/:id` — Fetch a campaign and its recipients ([docs](/docs/whatsapp))
- `POST /whatsapp/campaigns/:id/pause` — Pause a campaign mid-flight ([docs](/docs/whatsapp))
- `POST /whatsapp/campaigns/:id/send` — Start sending a campaign ([docs](/docs/whatsapp))
- `POST /whatsapp/campaigns/preview` — Preview the audience for a campaign ([docs](/docs/whatsapp))
- `GET /whatsapp/config` — Get WhatsApp configuration ([docs](/docs/whatsapp))
- `PUT /whatsapp/config` — Update WhatsApp configuration ([docs](/docs/whatsapp))
- `POST /whatsapp/onboarding/complete` — Complete Embedded Signup handshake ([docs](/docs/whatsapp))
- `POST /whatsapp/onboarding/disconnect` — Disconnect WhatsApp ([docs](/docs/whatsapp))
- `POST /whatsapp/openwa/logout` — Unlink the paired WhatsApp number ([docs](/docs/whatsapp))
- `GET /whatsapp/openwa/qr` — Fetch the pairing QR code ([docs](/docs/whatsapp))
- `GET /whatsapp/openwa/status` — Check self-hosted WhatsApp (open-wa) pairing status ([docs](/docs/whatsapp))
- `GET /whatsapp/order-statuses` — Get order statuses ([docs](/docs/whatsapp))
- `POST /whatsapp/phone/register` — Register phone number ([docs](/docs/whatsapp))
- `GET /whatsapp/placeholders` — Get template placeholders ([docs](/docs/whatsapp))
- `GET /whatsapp/reservation-statuses` — Get reservation statuses ([docs](/docs/whatsapp))
- `GET /whatsapp/rider-triggers` — Get rider notification triggers ([docs](/docs/whatsapp))
- `GET /whatsapp/templates` — List templates ([docs](/docs/whatsapp))
- `POST /whatsapp/templates` — Create template ([docs](/docs/whatsapp))
- `GET /whatsapp/templates/:id` — Get template ([docs](/docs/whatsapp))
- `PUT /whatsapp/templates/:id` — Update template ([docs](/docs/whatsapp))
- `DELETE /whatsapp/templates/:id` — Delete template ([docs](/docs/whatsapp))
- `POST /whatsapp/templates/:id/dispatch` — Test-send template against a real order ([docs](/docs/whatsapp))
- `POST /whatsapp/templates/:id/submit` — Submit a template to Meta for approval ([docs](/docs/whatsapp))
- `POST /whatsapp/templates/:id/test` — Send a test copy to a phone number ([docs](/docs/whatsapp))
- `POST /whatsapp/templates/generate` — Generate template components using AI ([docs](/docs/whatsapp))
- `POST /whatsapp/templates/sync` — Sync templates from Meta ([docs](/docs/whatsapp))
- `GET /whatsapp/webhook-log` — Get webhook activity log ([docs](/docs/whatsapp))
- `DELETE /whatsapp/webhook-log` — Clear webhook log ([docs](/docs/whatsapp))

**WhatsApp Storefront**

- `GET /whatsapp-storefront/analytics` — Dashboard stats ([docs](/docs/whatsapp-storefront))
- `GET /whatsapp-storefront/analytics/popular` — Popular products ([docs](/docs/whatsapp-storefront))
- `GET /whatsapp-storefront/config` — Get configuration ([docs](/docs/whatsapp-storefront))
- `PUT /whatsapp-storefront/config` — Update configuration ([docs](/docs/whatsapp-storefront))
- `GET /whatsapp-storefront/faqs` — List FAQs ([docs](/docs/whatsapp-storefront))
- `POST /whatsapp-storefront/faqs` — Create FAQ ([docs](/docs/whatsapp-storefront))
- `PUT /whatsapp-storefront/faqs/:id` — Update FAQ ([docs](/docs/whatsapp-storefront))
- `DELETE /whatsapp-storefront/faqs/:id` — Delete FAQ ([docs](/docs/whatsapp-storefront))
- `PUT /whatsapp-storefront/faqs/reorder` — Reorder FAQs ([docs](/docs/whatsapp-storefront))
- `GET /whatsapp-storefront/sessions` — List conversations ([docs](/docs/whatsapp-storefront))
- `GET /whatsapp-storefront/sessions/:id` — Get conversation details ([docs](/docs/whatsapp-storefront))
- `DELETE /whatsapp-storefront/sessions/:id` — Reset or delete session ([docs](/docs/whatsapp-storefront))
- `PATCH /whatsapp-storefront/sessions/:id/bot-pause` — Toggle bot pause ([docs](/docs/whatsapp-storefront))
- `POST /whatsapp-storefront/sessions/:id/resume` — Resume bot ([docs](/docs/whatsapp-storefront))
- `POST /whatsapp-storefront/sessions/:id/send-message` — Send manual message ([docs](/docs/whatsapp-storefront))
- `GET /whatsapp-storefront/sessions/active-count` — Active session count ([docs](/docs/whatsapp-storefront))

**WooCommerce Migration**

- `GET /woo-migration/config` — Get masked WooCommerce migration configuration ([docs](/docs/woocommerce))
- `PUT /woo-migration/config` — Update WooCommerce migration configuration ([docs](/docs/woocommerce))
- `GET /woo-migration/mapping/stats` — Get row counts of imported WooCommerce entities ([docs](/docs/woocommerce))
- `GET /woo-migration/preview` — Preview entity counts for migration ([docs](/docs/woocommerce))
- `POST /woo-migration/start` — Start a WooCommerce migration task ([docs](/docs/woocommerce))
- `GET /woo-migration/status` — Get latest migration task status ([docs](/docs/woocommerce))
- `POST /woo-migration/test` — Test WooCommerce connection ([docs](/docs/woocommerce))
