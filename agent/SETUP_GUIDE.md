# 🔧 Agent Setup - Issue & Solution

## What Happened

You tried to run the monitoring agent with a token, but got:
```
[✗] Registration failed
[✗] Failed to register device. Check your token and server URL.
```

## Root Causes

1. **Token Mismatch**: The token you used was created with a **different JWT_SECRET** than what's in `.env.local`
2. **Port Issue**: The Next.js server was running on port 3002, not 3000 (port was already in use)
3. **Server Not Responding**: The API endpoint wasn't returning proper JSON error messages

## What I Fixed

### 1. ✅ Improved Error Messages
- Modified `monitor-agent.py` to show better error messages
- Now tells you if server connection fails vs token is invalid

### 2. ✅ Created Token Generator
- Added `generate_token.py` script to create valid test tokens
- Generates tokens with the correct JWT_SECRET from `.env.local`

### 3. ✅ Added Quick Start Guide  
- Created `agent/QUICKSTART.md` with 3-step setup
- Includes expected output and common fixes

### 4. ✅ Updated Documentation
- Enhanced `agent/README.md` with:
  - Multiple ways to get valid tokens
  - Detailed troubleshooting section
  - Pro tips for multi-device monitoring
  - Port configuration options

## How to Use Now

### Method 1: Get Token from Dashboard (Recommended)
```bash
# 1. Run dashboard
npm run dev

# 2. Register & login at http://localhost:3000
# 3. Press F12, go to Console, run: localStorage.getItem('token')
# 4. Copy token and run:

cd agent
python monitor-agent.py --token "YOUR_TOKEN" --device "My Device"
```

### Method 2: Generate Test Token
```bash
cd agent
python generate_token.py "user-id" "username"
# Copy the generated token and use it above
```

## Key Points

✅ **Token must match JWT_SECRET** - Use tokens from dashboard or generate_token.py  
✅ **Server port matters** - Might be :3000, :3001, or :3002  
✅ **Use --server flag** if port is different:  
```bash
python monitor-agent.py --token "TOKEN" --device "Device" --server http://localhost:3002
```

## Files Created/Modified

| File | Purpose |
|------|---------|
| `agent/monitor-agent.py` | Updated with better error handling |
| `agent/generate_token.py` | **NEW** - Generate valid tokens for testing |
| `agent/QUICKSTART.md` | **NEW** - Quick 3-step setup guide |
| `agent/README.md` | Updated with port options & troubleshooting |

## Next Steps

1. Read `agent/QUICKSTART.md` for the fastest path forward
2. Start dashboard: `npm run dev`
3. Get your token from dashboard Console
4. Run agent with correct token and server port
5. See your device appear on dashboard!

## Example Working Commands

```bash
# Default (port 3000)
python monitor-agent.py --token "eyJhbGc..." --device "Smart Meter"

# If port is 3001
python monitor-agent.py --token "eyJhbGc..." --device "Smart Meter" --server http://localhost:3001

# If port is 3002
python monitor-agent.py --token "eyJhbGc..." --device "Smart Meter" --server http://localhost:3002

# With custom refresh interval
python monitor-agent.py --token "eyJhbGc..." --device "Smart Meter" --interval 5
```

---

**Status**: Ready to use! ✅  
**Last Updated**: February 5, 2026
