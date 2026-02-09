# Agent Configuration - Complete Reference

## 🚀 Quick Fix for Your Error

The token you used didn't match the server's JWT_SECRET. Here's the fix:

### Run These Commands:

```bash
# 1. Kill any running processes
Get-Process node | Stop-Process -Force

# 2. Start dashboard fresh
npm run dev
# Wait for "✓ Ready in XXXms"

# 3. Register account (in browser)
# Go to http://localhost:3000/register
# Create account

# 4. Get token (in browser console)
# Press F12 → Console tab → run:
localStorage.getItem('token')
# Copy the full token

# 5. Run agent (in new terminal)
cd agent
python monitor-agent.py --token "PASTE_TOKEN_HERE" --device "My Device"

# 6. Watch dashboard
# Browser: http://localhost:3000/dashboard
# You should see your device appear!
```

## 📋 Command Reference

### Basic Usage
```bash
python monitor-agent.py --token "YOUR_TOKEN" --device "Device Name"
```

### With Custom Server Port
```bash
python monitor-agent.py \
  --token "YOUR_TOKEN" \
  --device "Device Name" \
  --server http://localhost:3001
```

### With Custom Refresh Interval
```bash
python monitor-agent.py \
  --token "YOUR_TOKEN" \
  --device "Device Name" \
  --interval 5  # scan every 5 seconds instead of 10
```

### All Options
```bash
python monitor-agent.py \
  --token "YOUR_TOKEN" \
  --device "My Smart Meter" \
  --server http://localhost:3000 \
  --interval 10
```

## 🔧 Environment Variables (Alternative)

Instead of command-line args, set these:

```powershell
# PowerShell
$env:MONITOR_AUTH_TOKEN = "your_token_here"
$env:MONITOR_DEVICE_NAME = "My Device"
$env:MONITOR_SERVER_URL = "http://localhost:3000"
$env:MONITOR_REFRESH_INTERVAL = "10"
python monitor-agent.py
```

## ✅ Success Indicators

**When running agent, you should see:**
```
[✓] Device registered successfully
[✓] Device ID: device_abc123
[✓] Server: http://localhost:3000
[✓] Starting connection monitor...
[→] Scanning for TCP/UDP connections...
[→] Found X connections
```

**On dashboard, you should see:**
- Your device in the "Monitored Devices" table
- Status showing "Online"
- Connection count increasing
- Click "View Details" to see network connections

## ❌ Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `Check your token and server URL` | Token is invalid or expired | Get fresh token from dashboard Console |
| `Cannot reach server` | Server not running | Run `npm run dev` in main folder |
| `HTTP 404` | Wrong port | Use `--server http://localhost:3001` or :3002 |
| `ModuleNotFoundError: requests` | Python module missing | Run `pip install requests` |
| `Port 3000 is in use` | Another process using port | Kill with `Get-Process node \| Stop-Process` |

## 🎯 Flowchart

```
1. Start Dashboard
   npm run dev
   
2. Register Account
   http://localhost:3000/register
   
3. Login to Dashboard
   http://localhost:3000/dashboard
   
4. Get Token
   F12 → Console → localStorage.getItem('token')
   
5. Copy Token (entire string)
   
6. Run Agent
   python monitor-agent.py --token "TOKEN" --device "Name"
   
7. See Device on Dashboard
   Refresh browser → device appears in table
   
8. Click "View Details"
   See live network connections
```

## 📁 Files in Agent Folder

- `monitor-agent.py` - Main Python script that scans connections
- `generate_token.py` - Generate test tokens for development
- `run-agent.bat` - Windows batch wrapper (optional)
- `README.md` - Detailed documentation
- `QUICKSTART.md` - 3-step quick start
- `SETUP_GUIDE.md` - Setup troubleshooting
- `CONFIGURATION.md` - This file

## 💡 Pro Tips

1. **Multiple Devices**: Run agent on multiple machines with different tokens
2. **Keep Running**: Leave agent running in background for continuous monitoring  
3. **No Token Expiry**: Tokens don't expire in development (add expiry in production!)
4. **Auto-Refresh**: Dashboard refreshes every 5 seconds automatically
5. **Port Conflicts**: If port busy, Next.js auto-switches to 3001 or 3002
6. **Network Elevation**: Some connections need elevated privileges (use `sudo` on Linux/Mac)

## 🔐 Security Notes

- Your token is like a password - don't share it publicly
- Only run monitoring agent on networks you trust
- In production, implement token expiration
- Use HTTPS instead of HTTP
- Set strong JWT_SECRET in .env.local

## 📞 Still Having Issues?

1. Check `agent/QUICKSTART.md` for step-by-step guide
2. Read `agent/README.md` for detailed documentation
3. Review error message - it now tells you exactly what's wrong
4. Check that Next.js server is actually running on expected port
5. Verify token is complete (very long string with dots)

---

**Version**: 1.1  
**Last Updated**: February 5, 2026  
**Status**: Ready to use ✅
