# Quick Start - Run Monitor Agent in 3 Steps

## Step 1: Make Sure Dashboard is Running

```bash
cd ..
npm run dev
```

Wait until you see: `✓ Ready in XXXms`

Note the port number (usually 3000, might be 3001/3002 if busy)

## Step 2: Get Your Token

Open http://localhost:3000 (or use the port from Step 1)

**Register Account:**
- Click "Register"
- Enter username, email, password
- Click "Register"

**Login & Get Token:**
- Click "Login"  
- Enter your credentials
- Press F12 to open DevTools
- Go to "Console" tab
- Run: `localStorage.getItem('token')`
- Copy the full token string

## Step 3: Run the Agent

Open a **new terminal/PowerShell** in the agent folder:

```bash
cd agent
python monitor-agent.py --token "YOUR_TOKEN_HERE" --device "My Meter"
```

**If dashboard is on different port:**
```bash
python monitor-agent.py --token "YOUR_TOKEN_HERE" --device "My Meter" --server http://localhost:3002
```

## Watch Your Device Appear!

Go back to dashboard in browser - your device should appear in the "Monitored Devices" table!

---

## ✅ Expected Output

```
[✓] Device registered successfully
[✓] Device ID: device_abc123
[✓] Server: http://localhost:3000
[✓] Starting connection monitor...
[→] Scanning for TCP/UDP connections...
[→] Found 5 connections, sending 2 new ones
[→] Next scan in 10 seconds...
```

## 🆘 Not Working?

See README.md for detailed troubleshooting

