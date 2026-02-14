# 📖 Smart Meter Monitor - Documentation Index

Welcome to Smart Meter Monitor! This is a complete real-time network monitoring application. Below is a guide to all documentation.

## 🚀 Start Here

Choose your learning style:

### ⚡ I want to get it running NOW (2 minutes)
→ Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**Quick steps:**
```bash
npm install && npm run dev          # Terminal 1
pip install requests                # Terminal 2
python3 monitor-agent.py --token TOKEN --device Device
```

### 📚 I want a guided tutorial (10 minutes)
→ Read [QUICKSTART.md](QUICKSTART.md)

Covers:
- Installation
- Server setup  
- Creating account
- Running monitoring agent
- Basic usage

### 🎓 I want to understand everything (30 minutes)
→ Read [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md)

Includes:
- Full architecture
- Project structure
- How everything works
- Security details
- Troubleshooting

### 🔌 I need API documentation
→ Read [API_DOCS.md](API_DOCS.md)

Contains:
- All endpoints
- Request/response examples
- Error codes
- Example cURL commands

### 🌐 I want to deploy to production
→ Read [DEPLOYMENT.md](DEPLOYMENT.md)

Covers:
- Deploy to Vercel
- Deploy to Railway
- Deploy to Heroku
- Docker deployment
- Production checklist

### 📖 General information
→ Read [README.md](README.md)

Overview of:
- Features
- Tech stack
- Installation
- API basics

---

## 📁 File Guide

### Documentation
```
├── QUICK_REFERENCE.md     ← Quick lookup table
├── QUICKSTART.md          ← 10-minute tutorial
├── COMPLETE_GUIDE.md      ← Full detailed guide
├── API_DOCS.md            ← API reference
├── DEPLOYMENT.md          ← Production setup
├── README.md              ← Project overview
└── INDEX.md               ← This file
```

### Source Code
```
src/
├── app/
│   ├── api/               ← Backend endpoints
│   │   ├── auth/          ← Login/Register
│   │   ├── monitor/       ← Device registration
│   │   └── dashboard/     ← Data endpoints
│   ├── components/        ← React components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── Dashboard.tsx
│   │   ├── UserTable.tsx
│   │   └── UserDetailsModal.tsx
│   ├── login/
│   ├── register/
│   ├── dashboard/
│   └── page.tsx
└── lib/
    ├── auth.ts            ← JWT, passwords
    └── monitoring.ts      ← Data management
```

### Other Files
```
├── monitor-agent.py       ← Python monitoring agent
├── .env.local             ← Configuration
├── package.json           ← npm dependencies
├── next.config.ts         ← Next.js settings
├── tsconfig.json          ← TypeScript settings
├── setup.sh               ← Linux/Mac setup script
└── setup.bat              ← Windows setup script
```

---

## 🎯 Common Tasks

### I want to...

**...get the app running**
→ [QUICKSTART.md](QUICKSTART.md) or [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**...understand the architecture**
→ [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) → "Data Flow" section

**...integrate with my app**
→ [API_DOCS.md](API_DOCS.md)

**...deploy to production**
→ [DEPLOYMENT.md](DEPLOYMENT.md)

**...add a new feature**
→ [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) → "Project Structure"

**...troubleshoot an issue**
→ [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) → "Troubleshooting" or [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**...understand the Python agent**
→ [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) → "Monitoring Agent"

**...use the API**
→ [API_DOCS.md](API_DOCS.md)

**...customize the UI**
→ src/app/components/

**...change API behavior**
→ src/app/api/ or src/lib/

---

## 📋 What This App Does

```
┌─────────────────────────────────────────────┐
│ Smart Meter Monitor App                      │
├─────────────────────────────────────────────┤
│                                              │
│  Web Dashboard (React)                       │
│  • Real-time monitoring                      │
│  • Device management                         │
│  • Connection tracking                       │
│  • Live statistics                           │
│                                              │
│  ↓ HTTP API (Next.js)                       │
│                                              │
│  Python Monitoring Agent                     │
│  • Network scanning                          │
│  • Connection detection                      │
│  • TCP/UDP monitoring                        │
│  • Multi-device support                      │
│                                              │
└─────────────────────────────────────────────┘
```

**Features:**
✅ User authentication (register/login)  
✅ Real-time device monitoring  
✅ TCP/UDP connection tracking  
✅ Live statistics dashboard  
✅ Device status monitoring  
✅ Cross-platform agent  
✅ Automatic data refresh  
✅ Secure JWT tokens  

---

## 🏃 Quick Start Commands

```bash
# Setup
npm install
pip install requests
npm run build      # Verify everything works

# Development
npm run dev        # Start server on localhost:3000

# Testing
curl http://localhost:3000/api/dashboard/users \
  -H "Authorization: Bearer TOKEN"

# Monitoring
python3 monitor-agent.py --token TOKEN --device "Device"

# Production
npm run build
npm start
```

---

## 🔑 Key Concepts

### Authentication
- Users create account with username/email/password
- Password hashed with bcryptjs (10 salt rounds)
- JWT token generated on login
- Token stored in browser localStorage
- Token sent with every API request

### Dashboard
- Real-time list of connected devices
- Shows 8 status with online/offline indicators
- Auto-refreshes every 5 seconds
- Displays detected IP addresses and protocols
- Click device to see detailed connections

### Monitoring Agent
- Python script that runs on devices
- Scans network connections every 10 seconds
- Detects TCP/UDP protocols
- Sends new connections to server
- Supports Linux, Windows, macOS

### API
- RESTful endpoints
- JWT authentication
- JSON request/response
- Error handling with status codes
- Base URL: `http://localhost:3000/api`

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Next.js 16 + TypeScript |
| Styling | Tailwind CSS 4 |
| Backend | Node.js + Next.js API Routes |
| Database | In-memory (configure PostgreSQL for production) |
| Auth | JWT + bcryptjs |
| Monitoring | Python 3 |
| Real-time | WebSocket (prepared for future) |

---

## 📞 Support Paths

**Problem** → **Solution**

1. App won't start
   → Check Node.js installed, run `npm install`
   → See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) → "Debugging"

2. Agent won't connect
   → Check token is correct, server is running
   → See [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) → "Troubleshooting"

3. API not working
   → Check [API_DOCS.md](API_DOCS.md) for correct format
   → See [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) → "Testing"

4. Need API details
   → Check [API_DOCS.md](API_DOCS.md)
   → All endpoints documented with examples

5. Want to deploy
   → Check [DEPLOYMENT.md](DEPLOYMENT.md)
   → Step-by-step for Vercel, Railway, Heroku, Docker

6. Need security info
   → Check [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md) → "Security"
   → Details on hashing, JWT, token storage

---

## 🚀 Next Steps

### First Time Users
1. Read [QUICKSTART.md](QUICKSTART.md)
2. Get app running
3. Test with monitoring agent
4. Explore dashboard

### Developers
1. Read [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md)
2. Review project structure
3. Check API endpoints in [API_DOCS.md](API_DOCS.md)
4. Start customizing

### DevOps / Deployment
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Choose hosting platform
3. Follow step-by-step guide
4. Configure domain/SSL

### API Integration
1. Read [API_DOCS.md](API_DOCS.md)
2. Try example cURL commands
3. Integrate into your app
4. Handle authentication

---

## 📊 Project Stats

```
Lines of Code:
  - TypeScript/TSX: ~2000 lines
  - Python: ~800 lines
  - CSS/Tailwind: ~1000 lines
  - Configuration: ~500 lines

Files Created:
  - Components: 5
  - Pages: 3
  - API Routes: 6
  - Lib Files: 2
  - Documentation: 7

Features:
  - Authentication: 1 system
  - API Endpoints: 8
  - UI Components: 5
  - Monitoring: 2 (server + agent)
```

---

## ✅ Verification Checklist

- [ ] Node.js 18+ installed
- [ ] Python 3.7+ installed
- [ ] Repository cloned/downloaded
- [ ] `npm install` completed
- [ ] `pip install requests` completed
- [ ] `.env.local` configured
- [ ] `npm run build` succeeds
- [ ] `npm run dev` starts successfully
- [ ] Can access http://localhost:3000
- [ ] Can register/login
- [ ] Can copy token
- [ ] Python agent runs
- [ ] Device appears on dashboard

---

## 🎉 You're All Set!

Pick a documentation file above and start exploring:

- **Want to run it?** → [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **Want to understand?** → [COMPLETE_GUIDE.md](COMPLETE_GUIDE.md)
- **Want API details?** → [API_DOCS.md](API_DOCS.md)
- **Want to deploy?** → [DEPLOYMENT.md](DEPLOYMENT.md)

Happy monitoring! 🚀
