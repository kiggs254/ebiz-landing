## 5. Base URL & Versioning

| Environment | Base URL |
|-------------|----------|
| Production | `https://your-domain.com/api/v1` |
| Development | `http://localhost:3000/api/v1` |

The API version is in the path (`v1`). Future versions may use `v2`, etc.

### Using Postman

Use the same Base URL and **HTTP Basic Auth** (Consumer Key = username, Consumer Secret = password) for all requests. For **variable products**: use **GET /products** and **GET /products/:id** to read products (each product includes a `variants` array). Use **POST /products** with a JSON body containing `product_type: "variable"` and a `variants` array to create a variable product; use **PUT /products/:id** with a full `variants` array to update. See [Variable Products](#7-variable-products) for the exact request body shape and examples you can paste into Postman.

---

