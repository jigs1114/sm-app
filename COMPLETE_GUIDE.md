# Smart Meter Monitor App - Complete Setup & Usage Guide

## 📋 Project Overview

Smart Meter Monitor is a full-stack real-time network monitoring application built with:
- **Frontend**: React with Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with JWT authentication
- **Monitoring**: Python agent for cross-platform network monitoring
- **Real-time**: 5-second auto-refresh dashboard

**Features:**
✅ User authentication with JWT  
✅ Real-time device monitoring dashboard  
✅ TCP/UDP connection tracking  
✅ Live traffic statistics  
✅ Device status management  
✅ Cross-platform monitoring agent  

---

## 🚀 Quick Start (5 minutes)

### 1. Install & Run Server
```bash
cd monitor-app
npm install
npm run dev
```
Open: http://localhost:3000

### 2. Register & Login
- Click "Register"
- Create account (any username/password)
- Login with your credentials

### 3. Get Your Token
Open browser console (F12) and run:
```javascript
localStorage.getItem('token')
```
Copy the token.

### 4. Run Monitoring Agent
```bash
pip install requests
python3 monitor-agent.py --token YOUR_TOKEN_HERE --device "My Meter"
```

### 5. Watch Dashboard
Refresh dashboard - your device should appear and show connections!

---

## 📂 Project Structure

```
monitor-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/route.ts        ← Login endpoint
│   │   │   │   └── register/route.ts     ← Registration endpoint
│   │   │   ├── monitor/
│   │   │   │   ├── register/route.ts     ← Device registration
│   │   │   │   └── connections/route.ts  ← Connection updates
│   │   │   └── dashboard/
│   │   │       ├── users/route.ts        ← Get all devices
│   │   │       └── user/[userId]/route.ts ← Get device details
│   │   ├── components/
│   │   │   ├── LoginForm.tsx             ← Login UI
│   │   │   ├── RegisterForm.tsx          ← Registration UI
│   │   │   ├── Dashboard.tsx             ← Main dashboard
│   │   │   ├── UserTable.tsx             ← Device list
│   │   │   └── UserDetailsModal.tsx      ← Device details popup
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── page.tsx                      ← Home (redirects to login/dashboard)
│   └── lib/
│       ├── auth.ts                       ← JWT, password hashing
│       └── monitoring.ts                 ← Device & connection management
├── monitor-agent.py                      ← Python monitoring script
├── .env.local                            ← Configuration
├── package.json                          ← Dependencies
├── tsconfig.json                         ← TypeScript config
├── tailwind.config.ts                    ← Tailwind CSS config
└── next.config.js                        ← Next.js config
```

---

## 🔧 Installation Details

### Prerequisites
- Node.js 18+ ([nodejs.org](https://nodejs.org))
- Python 3.7+ ([python.org](https://python.org))
- npm (comes with Node.js)
- pip (comes with Python)

### Step 1: Install Node Dependencies
```bash
cd monitor-app
npm install
```

Installs:
- `next` - React framework
- `react` - UI library
- `typescript` - Type safety
- `tailwindcss` - Styling
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens (manual implementation)
- `socket.io` - Real-time communication (prepared for future use)

### Step 2: Install Python Dependencies
```bash
pip install requests
```

This allows the monitoring agent to send HTTP requests to the server.

### Step 3: Configure Environment
Create/edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-secret-key-min-32-chars-change-in-production
NODE_ENV=development
```

### Step 4: Start Development Server
```bash
npm run dev
```

Output:
```
> next dev

▲ Next.js 16.1.6
- Local: http://localhost:3000
```

---

## 👤 User Authentication

### Registration Flow
1. User fills form: username, email, password, confirm password
2. Client sends to `/api/auth/register`
3. Server validates:
   - All fields present
   - Passwords match
   - Password ≥ 6 characters
   - Username/email unique
4. Server hashes password with bcryptjs
5. Server generates JWT token
6. Client stores token in localStorage
7. User redirected to dashboard

### Login Flow
1. User fills form: username, password
2. Client sends to `/api/auth/login`
3. Server finds user by username
4. Server compares password hash
5. If valid: generates JWT token
6. Client stores token in localStorage
7. User redirected to dashboard

### Token Storage
Token stored in browser localStorage:
```javascript
localStorage.getItem('token')    // Get token
localStorage.setItem('token', 'new-token')  // Set token
localStorage.removeItem('token') // Remove token
```

---

## 📊 Dashboard Features

### Main Dashboard
**URL**: `http://localhost:3000/dashboard`

**Statistics Panel:**
- Total devices connected
- Currently online devices
- Currently offline devices
- Total active connections

**Device Table:**
| Column | Info |
|--------|------|
| Device Name | Custom device identifier |
| Username | Account owner |
| Status | Online (🟢) or Offline (🔴) |
| Connections | Number of network connections |
| Protocols | TCP/UDP/ICMP detected |
| Detected IPs | Source/destination IPs |
| Last Seen | When device last connected |
| Action | View Details button |

**Features:**
- Auto-refresh every 5 seconds
- Click table header to sort
- Click "View Details" to see connections
- Manual refresh button
- Logout button

### Device Details Modal
**Triggered**: Click "View Details" on any device

**Shows:**
- Device name and current status
- Statistics summary:
  - Total connections
  - Total bytes in/out
  - Unique destination IPs
- Network connections table:
  - Protocol type
  - Source IP:Port
  - Destination IP:Port
  - Bytes transferred
  - Connection state
- Auto-refresh toggle (3 seconds)

---

## 🔌 Monitoring Agent (Python)

### What It Does
1. Monitors network connections on the device
2. Detects TCP/UDP protocols
3. Extracts source/destination IPs and ports
4. Sends to server every 10 seconds (configurable)
5. Registers device on first run

### Installation

**Linux/macOS:**
```bash
pip install requests
```

**Windows:**
```bash
pip install requests
```

### Usage

**Basic:**
```bash
python3 monitor-agent.py --token YOUR_TOKEN --device "My Device"
```

**Advanced:**
```bash
python3 monitor-agent.py \
  --token YOUR_TOKEN \
  --device "Smart Meter 1" \
  --server http://localhost:3000 \
  --interval 5
```

**Arguments:**
- `--token` (required): JWT from dashboard
- `--device`: Custom device name (default: computer hostname)
- `--server`: Server URL (default: http://localhost:3000)
- `--interval`: Update interval seconds (default: 10)

**Environment Variables:**
```bash
export MONITOR_SERVER_URL=http://localhost:3000
export MONITOR_AUTH_TOKEN=your-token
export MONITOR_DEVICE_NAME="My Device"
export MONITOR_REFRESH_INTERVAL=10

python3 monitor-agent.py
```

### How It Works
1. **Register**: Sends device name to `/api/monitor/register`
2. **Monitor**: Scans network connections every N seconds
3. **Filter**: Keeps only TCP/UDP (ignores ICMP, others)
4. **Report**: Sends new connections to `/api/monitor/connections`
5. **Repeat**: Continues in loop until interrupted (Ctrl+C)

### Network Commands Used
**Linux:** `ss -tuln` or `netstat -tuln`  
**Windows:** `netstat -an`  
**macOS:** `netstat -an`

### Permissions Required
**Linux/macOS:**
```bash
sudo python3 monitor-agent.py --token TOKEN
```

**Windows:**
Run Command Prompt as Administrator

---

## 🔐 Security

### Password Hashing
Uses bcryptjs:
```
Password → Salt (10 rounds) → Hash → Database
```

Verification:
```
User Input + Stored Hash → Compare → Match or Fail
```

### JWT Tokens
Format: `header.payload.signature`

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "id": "user-uuid",
  "username": "john",
  "email": "john@example.com",
  "iat": 1707132600
}
```

**Signature:** HMAC-SHA256(secret)

### Token Validation
- Stored in localStorage (client)
- Sent with API requests (Authorization header or body)
- Server verifies signature before processing
- No server-side session storage

---

## 📈 Data Flow

### Authentication Flow
```
┌─────────┐  username/password  ┌─────────────┐
│ Browser │─────────────────→  │ Server      │
└─────────┘                     ├─────────────┤
    ↓                           │ ① Hash pass │
  Stores                        │ ② Compare   │
  Token                         │ ③ Gen JWT   │
    ↓                           │ ④ Return    │
    └──────────← JWT token ────└─────────────┘
```

### Monitoring Flow
```
┌──────────────┐              ┌─────────────────┐
│  Device      │              │ Monitoring      │
│  (Python)    │              │ Server          │
├──────────────┤              ├─────────────────┤
│ ① Scan nets  │              │ ① Verify token  │
│ ② Get IP:Port│─ HTTP POST ──│ ② Store data    │
│ ③ Parse TCP  │──────────────│ ③ Return OK     │
│ ④ Repeat     │              │ ④ Wait...       │
└──────────────┘              └─────────────────┘
     Every 10s                    Receive & Store
```

### Dashboard Flow
```
┌─────────────┐              ┌──────────────┐
│  Browser    │              │ Server       │
│  Dashboard  │              │ (Next.js)    │
├─────────────┤              ├──────────────┤
│ Load page   │── GET /users ── Fetch all   │
│ Get token   │◄ ────────────── users       │
│ Display     │                             │
│ Auto-refresh│── GET /users ── Updated     │
│ every 5s    │◄ ────────────── data        │
└─────────────┘              └──────────────┘
   Browser                      Node.js
```

---

## 🧪 Testing

### Test Authentication
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username":"testuser",
    "email":"test@example.com",
    "password":"test123",
    "confirmPassword":"test123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Test Monitoring
```bash
# Register device
curl -X POST http://localhost:3000/api/monitor/register \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_TOKEN","deviceName":"Test Device"}'

# Send connection
curl -X POST http://localhost:3000/api/monitor/connections \
  -H "Content-Type: application/json" \
  -d '{
    "token":"YOUR_TOKEN",
    "sourceIp":"192.168.1.100",
    "sourcePort":50000,
    "destIp":"8.8.8.8",
    "destPort":443,
    "protocol":"TCP"
  }'
```

### Test Dashboard
```bash
# Get all users
curl http://localhost:3000/api/dashboard/users \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get user details
curl http://localhost:3000/api/dashboard/user/USER_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🚨 Troubleshooting

### Server Issues

**"npm: command not found"**
- Install Node.js from nodejs.org
- Restart terminal after installation

**Port 3000 already in use**
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9  # Linux/Mac
netstat -ano | findstr :3000   # Windows
```

**Build fails**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Agent Issues

**"Token invalid"**
- Check token is correct
- Verify token copied fully (no spaces)
- Token may have expired (relogin)

**"Connection refused"**
- Check server is running: `npm run dev`
- Check server URL is correct
- Check firewall not blocking

**"Permission denied"**
- Run with sudo/admin: `sudo python3 monitor-agent.py`

**"No connections showing"**
- Ensure device has network activity
- Wait a few seconds for first update
- Check agent is running: should print "Scanning connections..."

### Dashboard Issues

**"Can't login"**
- Check username/password is correct
- Clear localStorage: `localStorage.clear()`
- Try incognito/private window

**"Dashboard blank"**
- Press F5 to refresh
- Clear browser cache
- Check console (F12) for errors

**"No devices showing"**
- Run monitoring agent on device
- Check agent is connected (should show registration)
- Wait for auto-refresh (5 seconds)

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| README.md | Main overview |
| QUICKSTART.md | 5-minute setup |
| API_DOCS.md | API reference |
| DEPLOYMENT.md | Production deployment |
| This file | Complete guide |

---

## 🎯 Next Steps

1. **Development**
   - [ ] Modify dashboard styling
   - [ ] Add custom device names
   - [ ] Filter connections
   - [ ] Export data

2. **Features**
   - [ ] Add WebSocket for real-time
   - [ ] Add alerts/notifications
   - [ ] Add analytics/graphs
   - [ ] Add multi-user support

3. **Production**
   - [ ] Add database (PostgreSQL)
   - [ ] Deploy to cloud (Vercel)
   - [ ] Set up SSL certificate
   - [ ] Configure custom domain

---

## 🆘 Getting Help

1. **Check documentation**
   - README.md for overview
   - API_DOCS.md for endpoints
   - DEPLOYMENT.md for production

2. **Check console logs**
   - Browser: F12 → Console tab
   - Server: Terminal output

3. **Common issues**
   - See troubleshooting section above

4. **Online resources**
   - Next.js: [nextjs.org/docs](https://nextjs.org/docs)
   - React: [react.dev](https://react.dev)
   - Tailwind: [tailwindcss.com](https://tailwindcss.com)

---

## 📝 License

MIT License - Free to use and modify

---

**Version**: 1.0  
**Last Updated**: February 2024  
**Built with**: Next.js 16, React 19, TypeScript 5, Tailwind CSS 4
