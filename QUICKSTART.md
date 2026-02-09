# Smart Meter Monitor - Quick Start Guide

## Installation (5 minutes)

### 1. Install Dependencies
```bash
npm install
pip install requests  # For monitoring agent
```

### 2. Configure Server
Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-secret-key-123
NODE_ENV=development
```

### 3. Start Server
```bash
npm run dev
```
Visit: `http://localhost:3000`

---

## First Time Setup (10 minutes)

### Server Side (Admin)
1. Go to `http://localhost:3000/register`
2. Create account:
   - Username: `admin`
   - Email: `admin@example.com`
   - Password: `admin123`
3. Click "Register"
4. You're logged in! Go to Dashboard
5. Copy your JWT token from browser DevTools Console:
   ```javascript
   localStorage.getItem('token')
   ```

### Client Side (Device)
1. Run monitoring agent with your token:
```bash
python3 monitor-agent.py --token YOUR_TOKEN_HERE --device "My Meter"
```

2. Watch dashboard - device should appear!

---

## Daily Usage

### Monitor Dashboard
1. Login at `http://localhost:3000/login`
2. View all connected devices
3. Click "View Details" on any device
4. See live network connections

### Add New Device
1. Login to dashboard
2. Copy your token: `localStorage.getItem('token')`
3. Run agent on new device:
```bash
python3 monitor-agent.py --token YOUR_TOKEN --device "Device Name"
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection refused" | Check server is running with `npm run dev` |
| Agent won't start | Check token is correct, run with `sudo` (Linux) |
| No devices showing | Run agent script, check browser console |
| Dashboard blank | Refresh page, clear cache, relogin |

---

## Common Commands

```bash
# Start server
npm run dev

# Build for production
npm run build

# Run agent
python3 monitor-agent.py --token TOKEN --device "Name"

# Run agent with custom interval
python3 monitor-agent.py --token TOKEN --device "Name" --interval 5
```

---

## Architecture

```
┌─────────────────────────────────────────────┐
│     Browser Dashboard (React)                │
│  - User List, Status, Connections           │
│  - Real-time updates every 5s                │
└──────────────┬──────────────────────────────┘
               │
               ↓ HTTP API
┌──────────────────────────────────────────────┐
│  Next.js Server (Node.js)                    │
│  - Authentication (JWT)                      │
│  - Device Management                         │
│  - Connection Storage                        │
└──────────────┬──────────────────────────────┘
               │
        ┌──────┴──────┐
        ↓             ↓
    Device 1      Device 2
    (Python)      (Python)
    Agent         Agent
```

---

## Next Steps

- [ ] Deploy to Heroku / Railway / Vercel
- [ ] Add database (PostgreSQL, MongoDB)
- [ ] Enable WebSocket for real-time updates
- [ ] Add alert notifications
- [ ] Create mobile app

---

Need help? Check README.md for complete documentation.
