# 📋 Agent Folder - Documentation Index

## Quick Navigation

### 🚀 For First-Time Users
→ Start here: **[QUICKSTART.md](QUICKSTART.md)** - 3-step setup guide

### 🆘 Just Got an Error?
→ Read: **[SETUP_GUIDE.md](SETUP_GUIDE.md)** - Troubleshooting & fixes

### ⚙️ Need Configuration Help?
→ See: **[CONFIGURATION.md](CONFIGURATION.md)** - Complete command reference

### 📚 Full Documentation
→ Check: **[README.md](README.md)** - Comprehensive guide

---

## 📁 What's in This Folder?

| File | Purpose |
|------|---------|
| **monitor-agent.py** | Main Python script - runs on your devices to monitor network |
| **generate_token.py** | Utility - creates valid JWT tokens for testing |
| **run-agent.bat** | Windows helper - easier way to run the agent |
| **QUICKSTART.md** | ⭐ **Start here** - 3 simple steps to get running |
| **SETUP_GUIDE.md** | Problem solving - common issues and fixes |
| **CONFIGURATION.md** | Command reference - all options and environment vars |
| **README.md** | Complete documentation - everything about the agent |
| **INDEX.md** | This file - navigation guide |

---

## 🎯 Most Common Tasks

### I want to run the monitoring agent
1. Read: [QUICKSTART.md](QUICKSTART.md)
2. Run: `python monitor-agent.py --token "YOUR_TOKEN" --device "Device"`

### I got an error
1. Check: [SETUP_GUIDE.md](SETUP_GUIDE.md) for your specific error
2. Try the suggested fix
3. Run agent again

### I need to customize parameters
1. See: [CONFIGURATION.md](CONFIGURATION.md)
2. Examples for different server ports, intervals, etc.

### I want to understand how it works  
1. Read: [README.md](README.md) full documentation
2. Check: monitor-agent.py source code with comments

---

## 📊 Agent Workflow

```
1. Register Account
   ↓
2. Login to Dashboard
   ↓
3. Get Authentication Token
   ↓
4. Run Monitor Agent
   python monitor-agent.py --token "TOKEN" --device "Name"
   ↓
5. Agent Registers with Server
   ↓
6. Agent Scans Network Connections
   ↓
7. Agent Sends Data to Dashboard
   ↓
8. Dashboard Updates in Real-Time
```

---

## 🔍 Troubleshooting Quick Links

| Problem | Solution |
|---------|----------|
| "Can't reach server" | [SETUP_GUIDE.md](SETUP_GUIDE.md#server-connection-error) |
| "Invalid token" | [SETUP_GUIDE.md](SETUP_GUIDE.md#token-error) |
| "Port already in use" | [SETUP_GUIDE.md](SETUP_GUIDE.md#python-error-port-already-in-use) |
| "No connections detected" | [SETUP_GUIDE.md](SETUP_GUIDE.md#no-connections-detected) |
| "ModuleNotFoundError" | [SETUP_GUIDE.md](SETUP_GUIDE.md#moduleerror) |

---

## 💾 Setup Progress Checklist

- [ ] Dashboard is running (`npm run dev`)
- [ ] Account is registered  
- [ ] Can login to dashboard
- [ ] Have token from localStorage
- [ ] Python is installed
- [ ] `pip install requests` executed
- [ ] Tried running agent with correct token
- [ ] Device appears on dashboard
- [ ] Can click "View Details" to see connections

---

## 🎓 Learning Resources

- **For Python developers**: See monitor-agent.py source code
- **For API integration**: Check ../API_DOCS.md
- **For full system**: Read ../COMPLETE_GUIDE.md
- **For deployment**: See ../DEPLOYMENT.md

---

## 💡 Pro Tips

✅ Run this first: [QUICKSTART.md](QUICKSTART.md)  
✅ Keep agent running continuously  
✅ Can run on multiple devices  
✅ Dashboard updates every 5 seconds  
✅ Use port 3001/3002 if 3000 is busy  

---

## 📞 Support

If stuck:
1. Check [QUICKSTART.md](QUICKSTART.md) - 90% of issues covered here
2. Look in [SETUP_GUIDE.md](SETUP_GUIDE.md) - Common problems and solutions
3. Review [CONFIGURATION.md](CONFIGURATION.md) - Make sure syntax is correct
4. Check console output - error messages are now very descriptive

---

**Last Updated**: February 5, 2026  
**Version**: 1.1  
**Status**: Production Ready ✅

Start with: **[QUICKSTART.md](QUICKSTART.md)**
