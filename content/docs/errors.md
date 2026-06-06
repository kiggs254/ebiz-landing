## 18. Error Handling

### Error Response Format

```json
{
  "status": "error",
  "message": "Error message describing what went wrong"
}
```

### HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 202 | Accepted (async processing) |
| 207 | Multi-Status (batch operations) |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Invalid or missing API key |
| 403 | Forbidden - API disabled or insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| `API key required` | No auth header | Add HTTP Basic Auth or X-API-Key |
| `Invalid consumer key` | Wrong consumer key | Check API key credentials |
| `Invalid consumer secret` | Wrong consumer secret | Regenerate secret in admin |
| `API key expired` | Key past its expiry | Create new API key |
| `REST API is disabled` | API not enabled | Enable in Settings -> Addons |

### Troubleshooting

**401 Unauthorized**
- Check that consumer key and secret are correct
- Verify credentials are being sent in the Authorization header
- Ensure API key hasn't expired
- Check API key permissions

**403 Forbidden**
- Verify API key has required permissions (Read/Write)
- Check that the endpoint supports your permission level

**404 Not Found**
- Verify the endpoint URL is correct
- Check that the resource ID exists
- Ensure you're using the correct API version (`/api/v1`)

**400 Bad Request**
- Validate request body format (must be valid JSON)
- Check required fields are present
- Verify field types match expected format

---

