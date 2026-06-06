## 19. Code Examples

### JavaScript (Fetch)

```javascript
const BASE_URL = 'https://your-store.com/api/v1';
const consumerKey = 'ck_xxx';
const consumerSecret = 'cs_yyy';
const credentials = btoa(`${consumerKey}:${consumerSecret}`);

async function api(endpoint, options = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);
  return data.data;
}

// Create variable product
const product = await api('/products', {
  method: 'POST',
  body: JSON.stringify({
    name: 'Organic Flour',
    sku: 'FLOUR-ORG',
    price: 0,
    status: 'active',
    category_id: 1,
    manage_stock: false,
    stock: 0,
    variants: [
      { sku: 'FLOUR-ORG-500G', price: 6.99, stock: 50, attributes: { Size: '500g' } },
      { sku: 'FLOUR-ORG-1KG', price: 12.99, stock: 100, attributes: { Size: '1kg' } },
    ],
  }),
});
```

### Python (requests)

```python
import requests
from requests.auth import HTTPBasicAuth

BASE_URL = 'https://your-store.com/api/v1'
auth = HTTPBasicAuth('ck_xxx', 'cs_yyy')

# Create order
response = requests.post(
    f'{BASE_URL}/orders',
    auth=auth,
    json={
        'customer_email': 'jane@example.com',
        'subtotal': 2400,
        'shipping': 300,
        'tax': 0,
        'discount': 0,
        'total': 2700,
        'currency': 'KES',
        'items': [
            {'product_id': 101, 'variant_id': 1001, 'name': 'Flour', 'sku': 'FLOUR-1KG', 'quantity': 2, 'price': 1200}
        ],
        'addresses': [
            {'type': 'shipping', 'name': 'Jane Doe', 'street': '123 Main St', 'city': 'Nairobi', 'state': 'Nairobi', 'zip': '00100', 'country': 'Kenya'}
        ],
    },
)
order = response.json()['data']['order']
```

### cURL

```bash
# Create variable product
curl -X POST "https://your-store.com/api/v1/products" \
  -u "ck_xxx:cs_yyy" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Organic Flour",
    "sku": "FLOUR-ORG",
    "price": 0,
    "status": "active",
    "category_id": 1,
    "manage_stock": false,
    "stock": 0,
    "variants": [
      {"sku": "FLOUR-ORG-500G", "price": 6.99, "stock": 50, "attributes": {"Size": "500g"}},
      {"sku": "FLOUR-ORG-1KG", "price": 12.99, "stock": 100, "attributes": {"Size": "1kg"}}
    ]
  }'
```

---

