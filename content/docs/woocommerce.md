## 16. WooCommerce Compatibility

This API provides WooCommerce-compatible REST endpoints for managing your store programmatically. It uses HTTP Basic Authentication with consumer key and secret credentials, making it compatible with WooCommerce API clients and tools.

### Authentication Examples

#### cURL

```bash
curl -X GET "https://your-domain.com/api/v1/products" \
  -u "ck_abc123def456:cs_xyz789uvw012"
```

#### JavaScript (Fetch API)

```javascript
const consumerKey = 'ck_abc123def456';
const consumerSecret = 'cs_xyz789uvw012';
const credentials = btoa(`${consumerKey}:${consumerSecret}`);

fetch('https://your-domain.com/api/v1/products', {
  headers: {
    'Authorization': `Basic ${credentials}`,
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .then(data => console.log(data));
```

#### Python (requests)

```python
import requests
from requests.auth import HTTPBasicAuth

consumer_key = 'ck_abc123def456'
consumer_secret = 'cs_xyz789uvw012'

response = requests.get(
    'https://your-domain.com/api/v1/products',
    auth=HTTPBasicAuth(consumer_key, consumer_secret)
)

print(response.json())
```

#### PHP

```php
<?php
$consumer_key = 'ck_abc123def456';
$consumer_secret = 'cs_xyz789uvw012';

$ch = curl_init('https://your-domain.com/api/v1/products');
curl_setopt($ch, CURLOPT_USERPWD, $consumer_key . ':' . $consumer_secret);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

$response = curl_exec($ch);
curl_close($ch);

echo $response;
?>
```

### Legacy X-API-Key Header (Backwards Compatible)

For backwards compatibility, you can also use the `X-API-Key` header:

```bash
curl -X GET "https://your-domain.com/api/v1/products" \
  -H "X-API-Key: your-legacy-api-key"
```

### Migration from Legacy API Keys

If you have existing API keys using the `X-API-Key` header:

1. Existing keys continue to work (backwards compatible)
2. New consumer key/secret pairs are automatically generated for existing keys
3. You can view consumer keys in the admin dashboard
4. Regenerate secrets if needed through the admin UI

### WooCommerce Client Compatibility

The API is designed to work with existing WooCommerce client libraries. The authentication mechanism (HTTP Basic Auth with `ck_`/`cs_` prefixed credentials) is compatible with:

- **WooCommerce REST API** client libraries
- **Postman** collections configured for WooCommerce
- Any HTTP client that supports Basic Auth

### Complete JavaScript Client Example

```javascript
class ShopflowAPI {
  constructor(baseURL, consumerKey, consumerSecret) {
    this.baseURL = baseURL;
    this.credentials = btoa(`${consumerKey}:${consumerSecret}`);
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Basic ${this.credentials}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  }

  // Products
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id, productData) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Orders
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders?${queryString}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(status),
    });
  }

  // Customers
  async getCustomers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/customers?${queryString}`);
  }

  async getCustomer(id) {
    return this.request(`/customers/${id}`);
  }
}

// Usage
const api = new ShopflowAPI(
  'https://your-domain.com/api/v1',
  'ck_abc123def456',
  'cs_xyz789uvw012'
);

// Get products
const products = await api.getProducts({ page: 1, limit: 20 });

// Create product
const newProduct = await api.createProduct({
  name: 'New Product',
  sku: 'PROD-002',
  price: 29.99,
  stock: 100,
  status: 'active',
});

// Update product
await api.updateProduct(newProduct.id, {
  price: 39.99,
});

// Get orders
const orders = await api.getOrders({ status: 'completed' });
```

### Best Practices

#### Security

1. **Never commit API keys to version control**
   - Store credentials in environment variables
   - Use secure credential management systems

2. **Use HTTPS only**
   - HTTP Basic Auth credentials are sent in plain text over HTTP
   - Always use HTTPS in production

3. **Rotate credentials regularly**
   - Regenerate consumer secrets periodically
   - Revoke unused API keys

4. **Use least privilege**
   - Grant only necessary permissions (Read vs Write)
   - Use separate keys for different applications

#### Performance

1. **Use pagination**
   - Always specify `limit` parameter
   - Use `page` parameter for large datasets

2. **Filter on the server**
   - Use query parameters instead of filtering client-side
   - Reduces data transfer and improves performance

3. **Use webhooks**
   - Subscribe to events instead of polling
   - Reduces API calls and improves efficiency

---

