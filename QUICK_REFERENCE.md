# 🎯 Smart Meter Monitor - Quick Reference

## ⚡ Get Running in 2 Minutes

```bash
# 1. Install & start
cd monitor-app && npm install && npm run dev

# 2. In another terminal, install Python deps
pip install requests

# 3. Register at http://localhost:3000/register

# 4. Get token from console
# Open http://localhost:3000/login, press F12, paste:
# localStorage.getItem('token')

# 5. Run agent
python3 monitor-agent.py --token YOUR_TOKEN --device "Device 1"

# 6. Watch dashboard refresh at http://localhost:3000/dashboard
```

---

## 📍 Key URLs

| URL | Purpose |
|-----|---------|
| http://localhost:3000 | Home (redirects to login/dashboard) |
| http://localhost:3000/register | Create new account |
| http://localhost:3000/login | Login |
| http://localhost:3000/dashboard | Main monitoring dashboard |

---

## 🔑 Key Credentials (Test Account)

```
Username: admin
Email: admin@example.com
Password: admin123
```

---

## 📊 Dashboard at a Glance

```
┌─────────────────────────────────────────────────┐
│  Smart Meter Monitor Dashboard                  │
├─────────────────────────────────────────────────┤
│  [Total]  [Online]  [Offline]  [Connections]   │
│    10       8          2           156         │
├─────────────────────────────────────────────────┤
│ Device      Status  Connections  Protocols  IP │
│ ─────────────────────────────────────────────── │
│ Meter 1     Online  45            TCP        3 │
│ Meter 2     Offline 23            TCP/UDP    1 │
│ ...                                            │
├─────────────────────────────────────────────────┤
│ [Refresh] Auto-refresh every 5 seconds [Logout]│
└─────────────────────────────────────────────────┘
```

---

## 🔧 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run built app
npm start

# Run monitoring agent
python3 monitor-agent.py --token TOKEN --device "Device Name"

# With custom options
python3 monitor-agent.py \
  --token TOKEN \
  --device "Device" \
  --server http://localhost:3000 \
  --interval 10

# Run with sudo (for network monitoring)
sudo python3 monitor-agent.py --token TOKEN --device "Device"
```

---

## 📡 API Endpoints Quick Reference

```
Authentication:
POST   /api/auth/register      - Create account
POST   /api/auth/login          - Login

Monitoring:
POST   /api/monitor/register    - Register device (token in body)
POST   /api/monitor/connections - Report connection (token in body)

Dashboard:
GET    /api/dashboard/users     - Get all devices (Bearer token)
GET    /api/dashboard/user/:id  - Get device details (Bearer token)
```

---

## 🐍 Python Agent Options

```
--token       (required)  JWT token from server
--device      (optional)  Device name (default: hostname)
--server      (optional)  Server URL (default: http://localhost:3000)
--interval    (optional)  Update interval seconds (default: 10)

Environment Variables:
MONITOR_SERVER_URL
MONITOR_AUTH_TOKEN
MONITOR_DEVICE_NAME
MONITOR_REFRESH_INTERVAL
```

---

## 📁 Key Files

| File | What It Does |
|------|-------------|
| src/app/page.tsx | Home page (redirects) |
| src/app/login/page.tsx | Login screen |
| src/app/register/page.tsx | Registration screen |
| src/app/dashboard/page.tsx | Main dashboard |
| src/app/api/auth/*.ts | Auth endpoints |
| src/app/api/monitor/*.ts | Device monitoring endpoints |
| src/app/api/dashboard/*.ts | Dashboard data endpoints |
| src/lib/auth.ts | JWT, hashing, user logic |
| src/lib/monitoring.ts | Device, connection storage |
| monitor-agent.py | Python monitoring script |
| .env.local | Configuration |

---

## 🚀 Deploy to Cloud (Choose One)

### Vercel (Easiest)
```bash
npm i -g vercel
vercel deploy
```

### Railway
Push to GitHub, connect on railway.app

### Heroku
```bash
heroku create app-name
heroku config:set JWT_SECRET=secret
git push heroku main
```

---

## 🔍 Debugging Tips

**Check Server Logs:**
Terminal running `npm run dev` shows all requests

**Check Client Logs:**
Press F12 → Console tab in browser

**Check Agent Output:**
Terminal running agent shows connection scanning

**Common Issues:**

| Issue | Fix |
|-------|-----|
| Port 3000 in use | Kill process or use different port |
| Token invalid | Copy full token, no spaces |
| Agent can't connect | Check server URL, firewall |
| No devices showing | Run agent, wait 5 seconds |
| Password mismatch error | Passwords must match exactly |

---

## 📚 Documentation

- **README.md** - Full project overview
- **QUICKSTART.md** - 10-minute tutorial
- **COMPLETE_GUIDE.md** - Detailed walkthrough
- **API_DOCS.md** - API reference
- **DEPLOYMENT.md** - Production setup

---

## 🎨 Tech Stack

```
Frontend:    React 19 + Next.js 16 + TypeScript + Tailwind CSS
Backend:     Node.js + Next.js API Routes
Database:    In-memory (replace with PostgreSQL/MongoDB)
Auth:        JWT + bcryptjs
Monitoring:  Python 3 + requests library
Styling:     Tailwind CSS
```

---

## 💾 .env.local Template

```env
# Required
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=change-this-to-random-32-char-string
NODE_ENV=development

# Optional for production
# DATABASE_URL=postgresql://...
# SMTP_HOST=smtp.gmail.com
```

---

## ✅ Setup Checklist

- [ ] Node.js 18+ installed
- [ ] Python 3.7+ installed
- [ ] `npm install` completed
- [ ] `pip install requests` completed
- [ ] `.env.local` configured
- [ ] `npm run build` succeeds (no errors)
- [ ] `npm run dev` starts server
- [ ] Can register account
- [ ] Can login
- [ ] Can copy token
- [ ] Python agent runs without errors
- [ ] Device shows up in dashboard

---

## 🎓 Learning Path

1. **Day 1**: Get it running (this quickstart)
2. **Day 2**: Understand architecture (COMPLETE_GUIDE.md)
3. **Day 3**: Explore APIs (API_DOCS.md)
4. **Day 4**: Deploy to cloud (DEPLOYMENT.md)
5. **Day 5+**: Customize and extend

---

## 🆘 Quick Support

**Server won't start:**
```bash
rm -rf .next node_modules
npm install
npm run build
npm run dev
```

**Agent won't connect:**
```bash
# Test connection
curl http://localhost:3000/api/dashboard/users \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Stuck?**
1. Check documentation files
2. Look at terminal output
3. Check browser console (F12)
4. Try test commands above

---

**Ready to start? Run:**
```bash
npm run dev
```

**Then visit:** http://localhost:3000

Good luck! 🚀
