# API Documentation

## Base URL
```
http://localhost:3000/api
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

**Request:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "confirmPassword": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-123",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Response (Error - 400/409):**
```json
{
  "error": "Username or email already exists"
}
```

---

### Login User
**POST** `/auth/login`

**Request:**
```json
{
  "username": "john_doe",
  "password": "securePassword123"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-123",
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid credentials"
}
```

---

## Monitoring Endpoints

### Register Device
**POST** `/monitor/register`

**Headers:**
```
Content-Type: application/json
```

**Request:**
```json
{
  "token": "your-jwt-token",
  "deviceName": "Smart Meter #1"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "device-uuid-123",
    "username": "john_doe",
    "deviceName": "Smart Meter #1",
    "status": "online",
    "connections": [],
    "lastSeen": "2024-02-05T10:30:00Z",
    "registeredAt": "2024-02-05T10:30:00Z"
  }
}
```

---

### Report Network Connection
**POST** `/monitor/connections`

**Headers:**
```
Content-Type: application/json
```

**Request:**
```json
{
  "token": "your-jwt-token",
  "sourceIp": "192.168.1.100",
  "sourcePort": 54321,
  "destIp": "8.8.8.8",
  "destPort": 443,
  "protocol": "TCP"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "conn-uuid-123",
    "userId": "device-uuid-123",
    "sourceIp": "192.168.1.100",
    "sourcePort": 54321,
    "destIp": "8.8.8.8",
    "destPort": 443,
    "protocol": "TCP",
    "bytesIn": 0,
    "bytesOut": 0,
    "packetsIn": 0,
    "packetsOut": 0,
    "state": "ESTABLISHED",
    "timestamp": "2024-02-05T10:30:00Z",
    "lastUpdated": "2024-02-05T10:30:00Z"
  }
}
```

---

## Dashboard Endpoints

### Get All Monitored Users
**GET** `/dashboard/users`

**Headers:**
```
Authorization: Bearer your-jwt-token
Content-Type: application/json
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "user-uuid-1",
      "username": "meter_1",
      "deviceName": "Smart Meter 1",
      "status": "online",
      "connectionCount": 45,
      "lastSeen": "2024-02-05T10:35:00Z",
      "registeredAt": "2024-02-05T10:00:00Z",
      "protocols": ["TCP", "UDP"],
      "uniqueIps": ["8.8.8.8", "1.1.1.1", "192.168.1.1"]
    },
    {
      "id": "user-uuid-2",
      "username": "meter_2",
      "deviceName": "Smart Meter 2",
      "status": "offline",
      "connectionCount": 23,
      "lastSeen": "2024-02-05T08:30:00Z",
      "registeredAt": "2024-02-04T15:00:00Z",
      "protocols": ["TCP"],
      "uniqueIps": ["8.8.8.8"]
    }
  ]
}
```

---

### Get User Details
**GET** `/dashboard/user/:userId`

**Headers:**
```
Authorization: Bearer your-jwt-token
Content-Type: application/json
```

**Response (Success - 200):**
```json
{
  "success": true,
  "data": {
    "id": "user-uuid-1",
    "username": "meter_1",
    "deviceName": "Smart Meter 1",
    "status": "online",
    "lastSeen": "2024-02-05T10:35:00Z",
    "registeredAt": "2024-02-05T10:00:00Z",
    "connections": [
      {
        "id": "conn-1",
        "sourceIp": "192.168.1.100",
        "sourcePort": 54321,
        "destIp": "8.8.8.8",
        "destPort": 443,
        "protocol": "TCP",
        "bytesIn": 5120,
        "bytesOut": 2560,
        "packetsIn": 45,
        "packetsOut": 32,
        "state": "ESTABLISHED",
        "timestamp": "2024-02-05T10:30:00Z",
        "lastUpdated": "2024-02-05T10:32:00Z"
      }
    ],
    "summary": {
      "totalConnections": 45,
      "protocols": ["TCP", "UDP"],
      "uniqueSourceIps": ["192.168.1.100"],
      "uniqueDestIps": ["8.8.8.8", "1.1.1.1", "192.168.1.1"],
      "totalBytesIn": 512000,
      "totalBytesOut": 256000,
      "totalPacketsIn": 4500,
      "totalPacketsOut": 3200
    }
  }
}
```

**Response (Not Found - 404):**
```json
{
  "error": "User not found"
}
```

---

## Error Codes

| Code | Message | Meaning |
|------|---------|---------|
| 200 | Success | Request completed successfully |
| 400 | Bad Request | Missing or invalid parameters |
| 401 | Unauthorized | Invalid or missing authentication token |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Resource already exists (duplicate user) |
| 500 | Server Error | Internal server error |

---

## Token Format

All tokens are JWT format: `header.payload.signature`

**Example Decoded Payload:**
```json
{
  "id": "user-uuid-123",
  "username": "john_doe",
  "email": "john@example.com",
  "iat": 1707132600000
}
```

---

## Rate Limiting

Currently no rate limiting. For production, implement:
- 100 requests per minute per IP
- 1000 registrations per day
- Connection updates: max 1 per second per device

---

## CORS

Currently accepts all origins. For production, configure:
```
ALLOWED_ORIGINS=https://example.com,https://app.example.com
```

---

## Authentication Flow

```
1. Client registers/login → Get JWT token
2. Client stores token in localStorage
3. Client sends token in:
   - Monitor endpoints: in JSON body
   - Dashboard endpoints: in Authorization header
4. Server validates token
5. Server returns data or error
```

---

## Example cURL Commands

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john",
    "email": "john@example.com",
    "password": "pass123",
    "confirmPassword": "pass123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "pass123"}'
```

### Get Users
```bash
curl -X GET http://localhost:3000/api/dashboard/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Register Device
```bash
curl -X POST http://localhost:3000/api/monitor/register \
  -H "Content-Type: application/json" \
  -d '{"token": "YOUR_TOKEN", "deviceName": "Device 1"}'
```

### Report Connection
```bash
curl -X POST http://localhost:3000/api/monitor/connections \
  -H "Content-Type: application/json" \
  -d '{
    "token": "YOUR_TOKEN",
    "sourceIp": "192.168.1.100",
    "sourcePort": 54321,
    "destIp": "8.8.8.8",
    "destPort": 443,
    "protocol": "TCP"
  }'
```
