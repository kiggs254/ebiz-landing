Everything else a storefront needs: reviews, wishlist, subscriptions, prescriptions, store content and config, marketing, and the contact form. Most are public; a few use the session cookie or require login (noted per endpoint).

## Reviews

### GET /storefront/reviews - List approved reviews

Public. Returns approved reviews, optionally for one product.

| Query param | Type | Description |
| --- | --- | --- |
| `product_id` | number | Optional, filter to one product |
| `limit` | number | Default `10`, max `50` |

### GET /storefront/reviews/by-ids - Reviews by ID

Public. Returns approved reviews for a comma-separated `ids` list, preserving order.

### POST /storefront/reviews - Submit a review

Public (guest or logged in). New reviews start as `pending` and appear once an admin approves them. Guests must supply an `email`.

| Body field | Type | Description |
| --- | --- | --- |
| `product_id` | number | Required |
| `rating` | number | Required, 1-5 |
| `title`, `comment` | string | Optional |
| `email`, `first_name`, `last_name` | string | Required for guests |

## Wishlist

Session-based, same as the cart (guest via session, customer when logged in).

### GET /storefront/wishlist - Get the wishlist

### POST /storefront/wishlist - Add a product

```json
{ "product_id": 412 }
```

### DELETE /storefront/wishlist/:productId - Remove a product

### POST /storefront/wishlist/merge - Merge guest wishlist on login

Requires auth. Folds the guest session's wishlist into the customer's.

### POST /storefront/wishlist/share - Create a share link

Requires auth. Returns a `token` for a public, read-only wishlist link.

```json
{ "status": "success", "data": { "token": "ab12cd..." } }
```

### GET /storefront/wishlist/shared/:token - View a shared wishlist

Public. Returns the items for a shared wishlist token.

## Subscriptions

Part of the subscriptions addon (hidden in your UI when `subscriptions_addon_enabled` is off).

### GET /storefront/subscription-packages - List packages

Public. Returns active subscription packages with their items and product details.

### POST /storefront/subscription-signup - Sign up for a subscription

Public. Finds or creates the customer, creates a pending subscription, saves the delivery address, and returns a Pesapal `payment_link` to complete signup.

| Body field | Type | Description |
| --- | --- | --- |
| `package_id` | number | Required |
| `email` | string | Required |
| `first_name`, `last_name`, `phone` | string | Customer details |
| `shipping_address` | object | `{ address_1, city, state, country, postal_code }` |
| `preferred_delivery_day` | number | 1 = Monday .. 7 = Sunday |
| `item_selections` | array | Optional `{ product_id, variant_id }` choices |

```json
{ "status": "success", "data": { "subscription": { "id": 9 }, "payment_link": "https://pay.pesapal.com/..." } }
```

### GET /storefront/subscriptions/:id/summary - Subscription summary

Requires auth (and ownership). Returns the schedule and pricing summary for one subscription.

## Prescriptions

Part of the prescriptions/pharmacy addon. Disabled endpoints return a clear `400`.

### POST /storefront/prescriptions/upload - Upload a prescription

Public (guest or logged in), `multipart/form-data` with a `file` (PDF or image) plus `customer_name` and a `customer_email` or `customer_phone`. Returns the new prescription (status `pending`) for review.

### GET /storefront/prescriptions/check-cart - Which items need a prescription

Public. Pass `product_ids` (comma-separated) and get back whether any require a prescription, and which.

```json
{ "status": "success", "data": { "required": true, "products": [{ "id": 77, "name": "Amoxicillin 500mg", "slug": "..." }] } }
```

### GET /storefront/prescriptions/mine - My prescriptions

Requires auth. Lists the logged-in customer's prescriptions and their status/refills.

At checkout, pass valid `prescription_ids` to [`create-order`](/docs/storefront-checkout#post-storefront-checkout-create-order) for any items that require one.

## Store content & config

All public. Use these to render the store's chrome, theme, and pages.

| Endpoint | Returns |
| --- | --- |
| `GET /storefront/settings` | Public store settings: name, currency, logo, SEO, socials, custom scripts, and addon feature flags |
| `GET /storefront/theme` | The active theme (colors, fonts, layout) |
| `GET /storefront/currencies` | Supported currencies + rates |
| `GET /storefront/banners` | Active banners (optional `?position=hero\|middle\|...`) |
| `GET /storefront/menus` | Header/footer menus keyed by position |
| `GET /storefront/homepage-sections` | Configured homepage section order |
| `GET /storefront/custom-scripts` | Head / body-start / body-end script snippets (GTM, analytics) |
| `GET /storefront/blogs` | Blog posts; `GET /storefront/blogs/:slug` for one |
| `GET /storefront/faqs` | Storefront FAQs |
| `GET /storefront/store-locator` | Store-locator config and store/branch list |
| `GET /storefront/pages` | Published content pages; `GET /storefront/pages/:slug` for one |
| `GET /storefront/sitemap.xml` | Ready-made XML sitemap (also `GET /storefront/sitemap/products` for JSON) |
| `GET /storefront/locations/countries` | Countries + states for address forms |

`GET /storefront/settings` is the one to call first - it tells your storefront the currency, branding, and which addons (brands, subscriptions, prescriptions, GTM) are enabled so you can show or hide sections accordingly.

## Marketing

### POST /storefront/marketing/abandoned-carts - Track an abandoned cart

Public. Upserts an abandoned-cart record (by `email`/`phone`) so the store can send recovery emails. Send it from your checkout when a shopper enters contact details but does not complete.

| Body field | Type | Description |
| --- | --- | --- |
| `email`, `phone`, `first_name`, `last_name` | string | Contact details |
| `cart_items` | array | Required |
| `shipping_address` | object | Optional |
| `total_amount`, `currency` | varies | Optional |

### GET /storefront/marketing/abandoned-cart/restore - Restore from email link

Public. Given a signed `token` from a recovery email, returns the saved cart items and shipping address to pre-fill checkout.

## Contact

### POST /storefront/contact - Send an enquiry

Public. Emails the store's inbox. Requires `email` and `message`.

| Body field | Type | Description |
| --- | --- | --- |
| `name` | string | Optional |
| `email` | string | Required |
| `phone`, `subject` | string | Optional |
| `message` | string | Required |

```json
{ "status": "success", "message": "Enquiry sent successfully." }
```
