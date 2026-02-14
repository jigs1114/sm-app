# Dashboard IPv4 Detection - Visual Guide

## Agent Startup Output

When you run the monitoring agent, it will detect and display local IPv4 addresses:

### Linux/macOS Example
```
$ python3 monitor-agent.py --token abc123 --device "SmartMeter-Lab"

[*] Starting network monitoring...
    Server: http://localhost:3000
    Device: SmartMeter-Lab
    OS: Linux
    Refresh interval: 10s
    Local IPv4: 192.168.1.45, 172.17.0.2

[14:23:45] Cycle 1: Scanning connections... Found 18 new connections
    [18] connections reported to server
[14:23:55] Cycle 2: Scanning connections... Found 5 new connections
    [5] connections reported to server
```

### Windows PowerShell Example
```
PS C:\monitor-app\agent> python .\monitor-agent.py --token abc123 --device SmartMeter-Win

[*] Starting network monitoring...
    Server: http://localhost:3000
    Device: SmartMeter-Win
    OS: Windows
    Refresh interval: 10s
    Local IPv4: 192.168.1.100, 10.0.0.50

[14:25:30] Cycle 1: Scanning connections... Found 32 new connections
    [32] connections reported to server
```

## Dashboard Table Display

### Monitored Devices Table Header
```
┌─────────────┬──────────┬────────┬─────────────┬──────────┬──────────────────┬──────────────────┬──────────────────┬────────┐
│ Device Name │ Username │ Status │ Connections│ Protocols│ IPv4 Addresses    │ IPv6 Addresses    │ Last Seen        │ Action │
├─────────────┼──────────┼────────┼─────────────┼──────────┼──────────────────┼──────────────────┼──────────────────┼────────┤
```

### Example Row Data

#### Device with Multiple IPv4 Addresses
```
│ Smart-M-01  │ john_doe │ Online │ 24          │ TCP, UDP │ 192.168.1.100    │ fe80::1...       │ 2 min ago        │ View   │
│             │          │        │             │          │ 10.0.0.50        │ 2001:db8::1...   │                  │ Detail │
│             │          │        │             │          │ +1                │ +1                │                  │        │
```

#### Device with Only IPv4 (No IPv6)
```
│ Office-Meter│ jane_dev │ Online │ 156         │ TCP, UDP │ 192.168.1.200    │ None              │ Just now         │ View   │
│             │          │        │             │          │ 172.16.0.10      │                   │                  │ Detail │
```

#### Device with Only IPv6 (IPv4 Loopback)
```
│ Local-Test  │ admin    │ Offline│ 3           │ TCP      │ None              │ fe80::1...        │ 5 hours ago      │ View   │
│             │          │        │             │          │                   │ ::1...            │                  │ Detail │
```

## Color Scheme

### IPv4 Addresses
```
┌─────────────────────┐
│ 192.168.1.100       │ ← Blue background (#EBF8FF)
│ 10.0.0.50           │   Blue text (#1E40AF)
│ +1                  │   Semibold font
└─────────────────────┘
```

### IPv6 Addresses
```
┌─────────────────────┐
│ fe80::1...          │ ← Purple background (#FAF5FF)
│ 2001:db8::1...      │   Purple text (#6B21A8)
│ +2                  │   Semibold font
└─────────────────────┘
```

## Device Details Modal

When clicking "View Details" on a device, you'll see all IPv4 and IPv6 addresses:

```
╔════════════════════════════════════════════╗
║  Device: Smart-Meter-01                    ║
╠════════════════════════════════════════════╣
║ Total Connections: 24                      ║
║ Device Status: Online                      ║
║                                            ║
║ IPv4 Addresses (2):                        ║
║   • 192.168.1.100                          ║
║   • 10.0.0.50                              ║
║                                            ║
║ IPv6 Addresses (2):                        ║
║   • fe80::1                                ║
║   • 2001:db8::1                            ║
║                                            ║
║ Registered: Jan 15, 2025 @ 10:30 AM       ║
║ Last Seen: Just now                        ║
╚════════════════════════════════════════════╝
```

## API Response Example

### Request
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:3000/api/dashboard/users
```

### Response
```json
{
  "success": true,
  "data": [
    {
      "id": "user_abc123",
      "username": "john_doe",
      "deviceName": "Smart-Meter-01",
      "status": "online",
      "connectionCount": 24,
      "registeredAt": "2025-01-15T10:30:00Z",
      "lastSeen": "2025-01-15T14:23:45Z",
      "protocols": ["TCP", "UDP"],
      "ipv4Addresses": [
        "192.168.1.100",
        "10.0.0.50"
      ],
      "ipv6Addresses": [
        "fe80::1",
        "2001:db8::1"
      ],
      "uniqueIps": [
        "192.168.1.100",
        "10.0.0.50",
        "fe80::1",
        "2001:db8::1"
      ]
    },
    {
      "id": "user_def456",
      "username": "jane_dev",
      "deviceName": "Office-Meter",
      "status": "online",
      "connectionCount": 156,
      "registeredAt": "2025-01-14T08:15:00Z",
      "lastSeen": "2025-01-15T14:25:30Z",
      "protocols": ["TCP", "UDP"],
      "ipv4Addresses": [
        "192.168.1.200",
        "172.16.0.10"
      ],
      "ipv6Addresses": [],
      "uniqueIps": [
        "192.168.1.200",
        "172.16.0.10"
      ]
    }
  ]
}
```

## Running the Agent

### Quick Start
```bash
# Generate token first
python3 agent/generate_token.py

# Run agent
python3 agent/monitor-agent.py \
  --token YOUR_AUTH_TOKEN \
  --device "SmartMeter-Lab" \
  --server http://localhost:3000
```

### View Results

1. **In Agent Console**: Displays local IPv4 addresses on startup
2. **In Dashboard**: Updated table shows separate IPv4 and IPv6 columns
3. **In API Response**: `ipv4Addresses` and `ipv6Addresses` arrays are populated

## Troubleshooting IPv4 Detection

### Issues with IPv4 Detection

**Problem**: Agent doesn't show "Local IPv4" line
```
Solution: Run with sudo/admin privileges
sudo python3 monitor-agent.py --token ...
```

**Problem**: Dashboard shows "None" for IPv4 Addresses
```
Solutions:
1. Ensure agent is sending valid IPv4 addresses
2. Check agent logs for connection scanning
3. Verify network interfaces are active
```

**Problem**: IPv4 Address Shows Incorrectly
```
Validation checks:
✓ 192.168.1.100  (valid)
✗ 256.1.1.1       (invalid octet)
✗ 192.168.1       (incomplete)
✗ fe80::1         (IPv6, not IPv4)
```

## Use Cases

### 1. Network Monitoring
Monitor which IPv4 addresses are actively sending/receiving data:
```
Device: Office-Router
IPv4 Addresses: 192.168.1.1, 10.0.0.1, 172.16.0.1
Purpose: Track all WAN/LAN network interfaces
```

### 2. Smart Meter Tracking
Track multiple IPv4 addresses across meter devices:
```
Device: Smart-Meter-Grid-01
IPv4: 192.168.100.50
IPv4: 192.168.100.51
IPv4: 10.0.0.100
Purpose: Multi-interface IEC 60870-5-104 connections
```

### 3. Dual-Stack Networks
Monitor IPv4 and IPv6 usage in modern networks:
```
Device: Data-Collector-01
IPv4: 192.168.1.100    ← Legacy
IPv6: 2001:db8::100    ← Modern
Purpose: Transition tracking
```

### 4. Compliance & Security
Document all IP addresses for audit trails:
```
Device: Secure-Meter
IPv4 Detected: 192.168.1.100 (physical)
IPv4 Detected: 127.0.0.1     (loopback)
IPv6 Detected: ::1           (loopback)
Purpose: Security logging
```

## Dashboard Walk-through

1. **Open Dashboard**
   ```
   URL: http://localhost:3000
   Login with your credentials
   ```

2. **View Monitored Devices**
   ```
   Cards show:
   - Total Devices: 5
   - Online Devices: 4
   - Offline Devices: 1
   - Total Connections: 450
   ```

3. **Check IPv4 Column**
   ```
   See all detected IPv4 addresses
   Click "View Details" for more info
   ```

4. **Check IPv6 Column**
   ```
   See all detected IPv6 addresses
   (Empty if device is IPv4-only)
   ```

## Performance Notes

- IPv4 detection runs once at agent startup
- Dashboard filtering happens in real-time
- No performance impact on existing functionality
- Scales linearly with number of connections

## Next Steps

1. ✅ Run the monitoring agent on your devices
2. ✅ View IPv4 addresses in the dashboard
3. ✅ Monitor network connections per device
4. ✅ Set up alerts for suspicious IPs (future)
5. ✅ Archive logs with IPv4 data for compliance
