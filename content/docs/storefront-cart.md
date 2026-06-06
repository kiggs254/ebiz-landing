The cart is tied to the **session cookie** (see [Overview](/docs/storefront#authentication-model)). Guests get a cart keyed to their session; once a customer logs in, the cart is keyed to their account. Always send `credentials: "include"` so the cart persists across requests.

When a guest logs in, call [`POST /storefront/cart/merge`](#post-storefront-cart-merge-merge-a-guest-cart-on-login) to fold their guest cart into their account cart.

## Endpoints

### GET /storefront/cart - Get the cart

Returns the current session's cart with product and variant details (including images).

```json
{
  "status": "success",
  "data": {
    "items": [
      {
        "id": 91,
        "product_id": 412,
        "variant_id": null,
        "quantity": 2,
        "product": { "id": 412, "name": "Trail Runner Edition 02", "slug": "...", "price": "96.00", "sale_price": "79.00", "images": [{ "url": "https://..." }] },
        "variant": null
      }
    ]
  }
}
```

If there is no session, `items` is an empty array.

### POST /storefront/cart - Add an item

Adds a product (and optional variant) to the cart. If the line already exists, its quantity is increased.

| Body field | Type | Description |
| --- | --- | --- |
| `product_id` | number | Required |
| `quantity` | number | Defaults to `1` |
| `variant_id` | number | Optional, for variable products |

```bash
curl -X POST "https://your-store-api.example.com/api/v1/storefront/cart" \
  -H "Content-Type: application/json" \
  --cookie-jar cookies.txt --cookie cookies.txt \
  -d '{ "product_id": 412, "quantity": 1 }'
```

Returns the created/updated cart line under `data.item`.

### PUT /storefront/cart/:id - Update quantity

Sets the quantity of a cart line (must be `>= 1`). `:id` is the cart line id returned by `GET /storefront/cart`.

```json
{ "quantity": 3 }
```

### DELETE /storefront/cart/:id - Remove a line

Removes a single cart line.

```json
{ "status": "success", "message": "Item removed from cart" }
```

### DELETE /storefront/cart - Clear the cart

Removes every line from the current session's cart.

### POST /storefront/cart/merge - Merge a guest cart on login

**Requires a logged-in session.** Call this right after login: it merges the guest session's cart into the customer's cart (summing quantities for matching lines), then clears the guest copy.

```json
{ "status": "success", "message": "Cart merged successfully" }
```

### POST /storefront/cart/validate-branch-stock - Validate stock for a branch

Only relevant when the branches addon is on. Given a `branch_id` and cart lines, returns which lines are unavailable at that branch so you can prompt the shopper before checkout.

| Body field | Type | Description |
| --- | --- | --- |
| `branch_id` | number | The branch to validate against |
| `items` | array | Cart lines (`product_id`, `variant_id`, `quantity`) |

```json
{
  "status": "success",
  "data": {
    "unavailable_line_ids": [91],
    "unavailable_items": [{ "product_id": 412, "variant_id": null, "name": "Trail Runner Edition 02" }]
  }
}
```
