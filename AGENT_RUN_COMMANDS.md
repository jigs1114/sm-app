# Agent Run Commands - IPv4 Detection

This document provides quick reference commands for running the monitoring agent with IPv4 address detection.

## Prerequisites

- Python 3.7+
- Token from the dashboard (generate via `/api/auth/generate-token`)
- Network access to the monitoring server

## Quick Start - Run Agent with IPv4 Detection

The agent automatically detects and displays IPv4 addresses during execution.

### Linux/macOS

```bash
cd agent
python3 monitor-agent.py --token YOUR_AUTH_TOKEN --device "MyDevice" --server http://localhost:3000
```

### Windows (PowerShell)

```powershell
cd agent
python monitor-agent.py --token YOUR_AUTH_TOKEN --device "MyDevice" --server http://localhost:3000
```

### Windows (Batch)

```batch
cd agent
run-agent.bat YOUR_AUTH_TOKEN MyDevice
```

## Command Options

```
--token TOKEN           : Authentication token (REQUIRED)
--device DEVICE_NAME    : Device name to register (optional, defaults to hostname)
--server SERVER_URL     : Monitoring server URL (optional, defaults to http://localhost:3000)
--interval SECONDS      : Refresh interval in seconds (optional, defaults to 10)
```

## Example Commands

### Basic Run
```bash
python3 monitor-agent.py --token abc123def456 --device "Smart-Meter-01"
```

### With Custom Server and Interval
```bash
python3 monitor-agent.py --token abc123def456 --device "SmartMeter-Office" --server http://192.168.1.100:3000 --interval 5
```

### Using Environment Variables
```bash
export MONITOR_AUTH_TOKEN="abc123def456"
export MONITOR_DEVICE_NAME="SmartMeter-Lab"
export MONITOR_SERVER_URL="http://192.168.1.100:3000"
export MONITOR_REFRESH_INTERVAL="10"

python3 monitor-agent.py
```

## IPv4 Detection Output

When the agent starts, you'll see output like:

```
[*] Starting network monitoring...
    Server: http://localhost:3000
    Device: MyDevice
    OS: Linux
    Refresh interval: 10s
    Local IPv4: 192.168.1.100, 172.17.0.1

[12:34:56] Cycle 1: Scanning connections... Found 24 new connections
    [24] connections reported to server
```

The **Local IPv4** line shows all detected IPv4 addresses on the machine running the agent.

## Dashboard IPv4 Display

After running the agent, you'll see the detected IPv4 addresses in the dashboard:

1. Log in to the dashboard at `http://localhost:3000`
2. View the "IPv4 Addresses" column in the Monitored Devices table
3. IPv4 addresses are displayed in **blue badges**
4. IPv6 addresses are displayed in **purple badges**

## Network Connection Monitoring

The agent monitors:
- **TCP connections** - All TCP protocol connections
- **UDP connections** - All UDP protocol connections
- **Source IPs** - IPv4 and IPv6 addresses initiating connections
- **Destination IPs** - IPv4 and IPv6 addresses receiving connections

### Supported Operating Systems

- **Linux**: Uses `ss` or `netstat` commands
- **Windows**: Uses `netstat` and `ipconfig` commands
- **macOS**: Uses `netstat` and `ifconfig` commands

## Troubleshooting

### No IPv4 Addresses Detected

1. Run as administrator/sudo on Windows or macOS
2. Verify network interfaces are up
3. Check command outputs manually:
   - Linux: `hostname -I`
   - Windows: `ipconfig`
   - macOS: `ifconfig`

### Connections Not Showing

1. Verify authentication token is valid
2. Check server URL accessibility: `curl http://localhost:3000`
3. Look for firewall blocking port 3000
4. Enable sudo/admin for full network access

### Server Connection Issues

```
[✗] Connection error: Cannot reach server at http://localhost:3000
    Make sure the dashboard server is running: npm run dev
```

Solution:
- Start the dashboard: `npm run dev` in the project root
- Verify port 3000 is not in use
- Check firewall rules

## Real-Time Monitoring

The agent continuously:
1. Detects active IPv4 and IPv6 addresses
2. Scans for new network connections
3. Sends data to the dashboard server
4. Updates device status as "online"
5. Auto-refreshes every N seconds (configurable)

## Performance Tips

- Reduce refresh interval for more real-time data (default: 10s)
- Increase interval to reduce system load (e.g., --interval 30)
- IPv4 detection is lightweight and runs at startup
- Use background mode for long-term monitoring

## Security Notes

- Keep your authentication token private
- Don't share server URLs with sensitive IP information
- Run agent with minimum required privileges
- Monitor suspicious connection patterns in the dashboard
