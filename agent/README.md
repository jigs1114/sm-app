# Smart Meter Monitor - End-User Agent

This folder contains the monitoring agent script that runs on your devices to track network connections.

## 📁 Contents

- **monitor-agent.py** - Main Python monitoring script
- **run-agent.bat** - Windows batch runner (optional, convenience script)

## 🚀 Quick Start

### Step 1: Get Your Token

**Option A: From Dashboard (Recommended)**
1. Open dashboard: http://localhost:3000 (or :3001/:3002 if port busy)
2. Register an account (if not already done)
3. Login with your credentials  
4. Press `F12` to open DevTools
5. Go to **Console** tab
6. Run: `localStorage.getItem('token')`
7. Copy the entire token value

**Option B: Generate Test Token (For Testing)**
1. Use the generate_token.py script:
   ```bash
   python generate_token.py "user-id" "username"
   ```
2. Copy the generated token

### Step 2: Run the Agent

**Option A: Direct Python**
```bash
cd agent
python monitor-agent.py --token "YOUR_TOKEN_HERE" --device "My Device"
```

**Option B: Windows Batch (easier)**
```bash
cd agent
run-agent.bat "YOUR_TOKEN_HERE" "My Device"
```

**Option C: Custom Server**
```bash
python monitor-agent.py \
  --token "YOUR_TOKEN_HERE" \
  --device "My Device" \
  --server http://your-server.com \
  --interval 10
```

### Step 3: Check Dashboard

- Go back to http://localhost:3000/dashboard
- Your device should appear in the "Monitored Devices" table
- View network connections by clicking "View Details"

---

## 📊 What It Does

✅ **Scans TCP/UDP connections** on your device  
✅ **Registers device** on the server  
✅ **Sends updates** every 10 seconds (configurable)  
✅ **Shows live data** on the dashboard  

---

## 🔧 Command-Line Options

```bash
python monitor-agent.py [OPTIONS]

OPTIONS:
  --token TOKEN          Auth token from dashboard (REQUIRED)
  --device DEVICE        Device name (default: "Device")
  --server URL           Server URL (default: http://localhost:3000)
  --interval SECONDS     Refresh interval in seconds (default: 10)

EXAMPLES:
  # Basic usage
  python monitor-agent.py --token abc123... --device "Laptop"

  # With custom server
  python monitor-agent.py --token abc123... --device "Server" --server http://192.168.1.100:3000

  # Fast refresh (5 seconds)
  python monitor-agent.py --token abc123... --device "Meter" --interval 5
```

---

## 🌍 Environment Variables (Alternative)

Instead of command-line arguments, you can set environment variables:

```bash
# PowerShell
$env:MONITOR_AUTH_TOKEN = "your_token_here"
$env:MONITOR_DEVICE_NAME = "My Device"
$env:MONITOR_SERVER_URL = "http://localhost:3000"
$env:MONITOR_REFRESH_INTERVAL = "10"
python monitor-agent.py

# Linux/macOS
export MONITOR_AUTH_TOKEN="your_token_here"
export MONITOR_DEVICE_NAME="My Device"
export MONITOR_SERVER_URL="http://localhost:3000"
export MONITOR_REFRESH_INTERVAL="10"
python3 monitor-agent.py
```

---

## 🖥️ Supported Platforms

- ✅ **Windows** - netstat command
- ✅ **Linux** - ss or netstat commands
- ✅ **macOS** - netstat command

---

## 📦 Dependencies & Installation

### System Requirements

- **Python 3.7 or higher** - [Download Python](https://www.python.org/downloads/)
  - ✅ Python 3.8
  - ✅ Python 3.9
  - ✅ Python 3.10
  - ✅ Python 3.11+

### Required Python Packages

- `requests` - HTTP library for API communication with the server

### Installation Guide

#### **Windows**

1. **Install Python** (if not already installed)
   - Download from https://www.python.org/downloads/
   - During installation, **check "Add Python to PATH"**
   - Verify installation:
     ```powershell
     python --version
     pip --version
     ```

2. **Install Required Packages**
   ```powershell
   # Using pip (recommended)
   pip install requests

   # Or using pip3
   pip3 install requests
   ```

3. **Verify Installation**
   ```powershell
   python -c "import requests; print('requests library installed')"
   ```

---

#### **Linux (Ubuntu/Debian)**

1. **Install Python and Pip**
   ```bash
   sudo apt update
   sudo apt install python3 python3-pip
   
   # Verify
   python3 --version
   pip3 --version
   ```

2. **Install Required Packages**
   ```bash
   pip3 install requests
   ```

3. **Verify Installation**
   ```bash
   python3 -c "import requests; print('requests library installed')"
   ```

---

#### **macOS**

1. **Install Python** (using Homebrew recommended)
   ```bash
   # Install Homebrew if not installed
   /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
   
   # Install Python
   brew install python3
   
   # Verify
   python3 --version
   pip3 --version
   ```

2. **Install Required Packages**
   ```bash
   pip3 install requests
   ```

3. **Verify Installation**
   ```bash
   python3 -c "import requests; print('requests library installed')"
   ```

---

### Optional: Virtual Environment Setup

For better isolation and package management, use a Python virtual environment:

**Windows**
```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# Install packages
pip install requests

# Deactivate when done
deactivate
```

**Linux/macOS**
```bash
# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate

# Install packages
pip install requests

# Deactivate when done
deactivate
```

---

### Quick Install Check

Run this command to verify all dependencies are installed:

```bash
python -c "import requests; print('✓ All dependencies installed!')" || echo "✗ Missing dependencies"
```

---

## 📦 Requirements

---

## 🐛 Troubleshooting

### Token Error: "Check your token and server URL"
- Verify you copied the **entire** token from localStorage
- Make sure you're authenticated (token must be from registered user)
- Check server URL is correct:
  ```
  http://localhost:3000   (default)
  http://localhost:3001   (if 3000 is busy)
  http://localhost:3002   (if 3000-3001 are busy)
  ```
- Use `--server` flag to specify custom port:
  ```bash
  python monitor-agent.py --token "TOKEN" --device "Device" --server http://localhost:3002
  ```

### Server Connection Error: "Cannot reach server"
- Make sure dashboard is running:
  ```bash
  npm run dev
  ```
- Check if port 3000 is in use - server may start on 3001 or 3002
- Verify the server URL matches where Next.js is running
- Check Windows Firewall isn't blocking localhost connections

### ModuleNotFoundError: No module named 'requests'
```bash
pip install requests
```

### No Connections Detected
- Some connections may require elevated privileges
- Try running with `python -m` prefix
- Check if a firewall or antivirus is blocking network monitoring

### Invalid Token Error
- Token might be expired (though in-memory tokens don't expire)
- Token might have been created with different JWT_SECRET
- Try generating a new token with `generate_token.py`
- Make sure JWT_SECRET in .env.local hasn't changed

### Python Error: "Port already in use"
The dev server might be locked. Kill Node processes:
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

## 💡 Pro Tips

- You can monitor **multiple devices** with different tokens/names
- Leave the agent running continuously for real-time updates
- Dashboard auto-refreshes every 5 seconds
- Use `--interval 5` for more frequent updates (uses more CPU)
- Token is needed only once per device registration

---

## 📝 Example Output

```
[✓] Device registered successfully
[✓] Device ID: device_abc123
[✓] Server: http://localhost:3000
[✓] Starting connection monitor...
[→] Scanning for TCP/UDP connections...
[→] Found 5 connections, sending 2 new ones
[→] Next scan in 10 seconds...
[→] Scanning for TCP/UDP connections...
[→] No new connections found
```

---

## 🔐 Security Notes

- Your token is sensitive - don't share it
- Only run on trusted networks
- Monitor script requires network access permissions
- Some connections may be blocked by firewall or antivirus

---

## 📚 More Information

- See parent README for dashboard documentation
- Check API_DOCS.md for server API details
- Review COMPLETE_GUIDE.md for full system overview

---

**Version**: 1.0  
**Last Updated**: February 2024  
**Status**: Ready to use
