## 17. API Operation Logs & Undo

Every write request made with an API key is automatically recorded in the admin dashboard under **Settings -> Advanced -> API Operation Logs**. This gives you a full audit trail of all externally created/updated orders.

### What is logged

| Operation | Logged When |
|-----------|-------------|
| `order:create` | `POST /orders` via API key |
| `order:batch_create` | `POST /orders/batch` via API key |
| `order:status_update` | `PUT /orders/:id/status` or `PATCH /orders/:id/status` via API key |

Each log entry records:
- Timestamp and IP address
- API key ID used
- HTTP method and endpoint
- Affected order IDs
- Request payload (sensitive fields redacted)
- Response summary

### One-click Undo

For reversible operations, the **Undo** button appears in the log panel:

| Operation | Undo Effect |
|-----------|-------------|
| `order:create` | Deletes the created order and all its items/addresses/transactions |
| `order:batch_create` | Deletes all orders created in the batch |
| `order:status_update` | Restores the order's previous status |

Once undone, the Undo button is replaced with an **Undone** badge. Undo cannot be repeated.

---

