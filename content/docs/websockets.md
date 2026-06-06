## 15. WebSocket Real-time Updates

### Connection

The backend provides WebSocket support for real-time updates. Connect to:

```
ws://localhost:3000/ws
```

For production with HTTPS:
```
wss://your-domain.com/ws
```

### Authentication

WebSocket connections are authenticated using session cookies:
1. First, login via the REST API to establish a session
2. The WebSocket connection will automatically use the session cookie
3. Unauthenticated connections will be rejected

### Connection Lifecycle

1. **Connect**: Open WebSocket connection to `/ws`
2. **Authentication**: Server verifies session cookie
3. **Confirmation**: Server sends `{"type": "connected", "message": "...", "userId": ...}`
4. **Subscribe**: Send subscribe messages for specific events
5. **Receive Updates**: Server broadcasts real-time events
6. **Disconnect**: Close connection or server closes on authentication failure

### Message Format

#### Client to Server

**Subscribe to events:**
```json
{
  "type": "subscribe",
  "channel": "order_changes"
}
```

**Unsubscribe from events:**
```json
{
  "type": "unsubscribe",
  "channel": "order_changes"
}
```

**Ping (keepalive):**
```json
{
  "type": "ping"
}
```

#### Server to Client

**Connection confirmation:**
```json
{
  "type": "connected",
  "message": "WebSocket connection established",
  "userId": 1
}
```

**Real-time event:**
```json
{
  "event": "order:created",
  "data": {
    "id": 123,
    "order_number": "ORD-1234567890",
    "status": "pending",
    "payment_status": "pending",
    "total": 99.99,
    "customer_id": 45,
    "currency": "USD"
  },
  "timestamp": "2026-01-25T10:30:00.000Z"
}
```

**Error:**
```json
{
  "type": "error",
  "message": "Error description"
}
```

**Pong (response to ping):**
```json
{
  "type": "pong"
}
```

### Available Events

#### Order Events
- `order:created` - New order created
- `order:updated` - Order status or details updated
- `order:deleted` - Order deleted

**Event Payload:**
```json
{
  "event": "order:updated",
  "data": {
    "id": 123,
    "order_number": "ORD-1234567890",
    "status": "processing",
    "payment_status": "paid",
    "total": 99.99,
    "customer_id": 45,
    "currency": "USD",
    "changed_fields": {
      "status": "processing",
      "payment_status": "paid"
    }
  },
  "timestamp": "2026-01-25T10:30:00.000Z"
}
```

#### Product Events
- `product:created` - New product created
- `product:updated` - Product details updated
- `product:deleted` - Product deleted

**Event Payload:**
```json
{
  "event": "product:updated",
  "data": {
    "id": 456,
    "name": "Product Name",
    "sku": "SKU-123",
    "status": "published",
    "price": 29.99,
    "stock": 100,
    "changed_fields": {
      "price": 29.99,
      "stock": 100
    }
  },
  "timestamp": "2026-01-25T10:30:00.000Z"
}
```

#### Customer Events
- `customer:created` - New customer registered
- `customer:updated` - Customer details updated
- `customer:deleted` - Customer deleted

**Event Payload:**
```json
{
  "event": "customer:updated",
  "data": {
    "id": 789,
    "email": "customer@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "changed_fields": {
      "email": "customer@example.com"
    }
  },
  "timestamp": "2026-01-25T10:30:00.000Z"
}
```

#### Shipment Events
- `shipment:created` - New shipment created
- `shipment:updated` - Shipment status or tracking updated
- `shipment:deleted` - Shipment deleted

**Event Payload:**
```json
{
  "event": "shipment:updated",
  "data": {
    "id": 101,
    "order_id": 123,
    "tracking_number": "TRACK123456",
    "status": "shipped",
    "carrier": "UPS",
    "changed_fields": {
      "status": "shipped",
      "tracking_number": "TRACK123456"
    }
  },
  "timestamp": "2026-01-25T10:30:00.000Z"
}
```

#### Transaction Events
- `transaction:created` - New transaction created
- `transaction:updated` - Transaction status updated
- `transaction:deleted` - Transaction deleted

**Event Payload:**
```json
{
  "event": "transaction:created",
  "data": {
    "id": 202,
    "order_id": 123,
    "type": "payment",
    "status": "completed",
    "amount": 99.99,
    "gateway": "stripe"
  },
  "timestamp": "2026-01-25T10:30:00.000Z"
}
```

### Error Handling

- **Connection Errors**: WebSocket will attempt to reconnect automatically
- **Authentication Errors**: Connection is closed with code 1008
- **Invalid Messages**: Server responds with error message
- **Rate Limiting**: Excessive connections may be rate-limited

### Best Practices

1. **Reconnection**: Implement exponential backoff for reconnections
2. **Heartbeat**: Send ping messages periodically to keep connection alive
3. **Error Handling**: Handle connection errors gracefully
4. **Subscription Management**: Subscribe only to events you need
5. **Message Validation**: Validate all incoming messages before processing

### Example Client Implementation

```javascript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onopen = () => {
  console.log('Connected');
  // Subscribe to order events
  ws.send(JSON.stringify({ type: 'subscribe', channel: 'order_changes' }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  if (message.event && message.data) {
    // Handle real-time event
    console.log('Event:', message.event, message.data);
    
    // Update UI or invalidate queries
    if (message.event === 'order:created') {
      // Refresh orders list
      invalidateQueries(['orders']);
    }
  }
};

ws.onerror = (error) => {
  console.error('WebSocket error:', error);
};

ws.onclose = () => {
  console.log('Disconnected, attempting to reconnect...');
  // Implement reconnection logic
};
```

---

