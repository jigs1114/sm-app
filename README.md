# Smart Meter Monitor App

A comprehensive real-time monitoring and device management application built with Next.js. Monitor TCP/UDP connections from multiple devices with a centralized dashboard, authentication system, and live data streaming.

## 🚀 Quick Start

### Server Setup
```bash
npm install
npm run dev
# Visit http://localhost:3000
```

### End-User Monitoring Agent
```bash
pip install requests
python3 monitor-agent.py --token <YOUR_TOKEN> --device "My Device"
```

## ✨ Features

- **Authentication** - User registration, login, JWT tokens, password hashing
- **Real-time Dashboard** - Live device monitoring, connection counts, status indicators
- **Network Monitoring** - TCP/UDP detection, IP/port tracking, traffic statistics
- **Detailed View** - Per-device connections, traffic stats, protocol detection
- **Monitoring Agent** - Python script for cross-platform device monitoring

## 📋 Installation

### Prerequisites
- Node.js 18+, npm
- Python 3.7+

### Full Setup

1. **Navigate to project**
```bash
cd monitor-app
npm install
```

2. **Configure environment** - Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=your-secret-key
NODE_ENV=development
```

3. **Run server**
```bash
npm run dev
```

4. **Register & Login**
   - Visit `http://localhost:3000/register`
   - Create account and login
   - Token is stored in localStorage

5. **Run monitoring agent on devices**
```bash
pip install requests
python3 monitor-agent.py --token <YOUR_TOKEN> --device "Smart Meter 1"
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/           # Login/Register endpoints
│   │   ├── monitor/        # Device registration & connections
│   │   └── dashboard/      # User list & details
│   ├── components/         # React UI components
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── dashboard/page.tsx
└── lib/
    ├── auth.ts            # Authentication utilities
    └── monitoring.ts      # Monitoring data management
```

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | User login |
| POST | `/api/monitor/register` | Register device |
| POST | `/api/monitor/connections` | Report connections |
| GET | `/api/dashboard/users` | Get all devices |
| GET | `/api/dashboard/user/:userId` | Get device details |

## 🐍 Monitoring Agent Usage

### Basic Usage
```bash
python3 monitor-agent.py --token <TOKEN> --device "Device Name"
```

### Advanced Options
```bash
python3 monitor-agent.py \
  --token <TOKEN> \
  --device "My Meter" \
  --server http://localhost:3000 \
  --interval 10
```

### Environment Variables
```bash
export MONITOR_SERVER_URL=http://localhost:3000
export MONITOR_AUTH_TOKEN=your-token
export MONITOR_DEVICE_NAME="My Device"
export MONITOR_REFRESH_INTERVAL=10
python3 monitor-agent.py
```

### Require Elevated Privileges
```bash
# Linux/macOS
sudo python3 monitor-agent.py --token <TOKEN>

# Windows - Run Command Prompt as Administrator
python monitor-agent.py --token <TOKEN>
```

## 🔐 Security Features

- JWT token-based authentication
- Password hashing with bcryptjs
- Secure API endpoints with token verification
- Cross-origin protection

## 📊 Dashboard Features

1. **Statistics Dashboard**
   - Total devices count
   - Online/offline device count
   - Active connections total

2. **Device Table**
   - Device name & username
   - Status (online/offline)
   - Connection count
   - Detected protocols & IPs
   - Last seen timestamp

3. **Device Details Modal**
   - Live connection list
   - Traffic statistics
   - IP addresses tracking
   - Auto-refresh capability

## 🔍 Network Monitoring

The agent monitors:
- **Protocol Types**: TCP, UDP (ICMP and OTHER protocols not supported)
- **Connection Info**: Source/Dest IP, Ports
- **Traffic**: Bytes in/out, Packets in/out
- **Status**: Connection state (ESTABLISHED, LISTEN, etc)

## 🛠️ Development

### Build
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## ⚙️ Configuration

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
JWT_SECRET=change-this-secret-in-production
NEXTAUTH_SECRET=change-this-too
NODE_ENV=development
```

### Monitoring Agent Config
```python
REFRESH_INTERVAL = 10  # seconds
```

## 📝 Database Note

⚠️ **Current**: In-memory storage (resets on server restart)

For production, integrate:
- PostgreSQL
- MongoDB
- MySQL
- Firebase

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Agent won't register | Check token, server URL, connectivity |
| No connections showing | Run agent, check permissions, verify activity |
| Dashboard doesn't update | Clear cache, check token, restart server |
| Permission denied | Run with sudo (Linux) or as admin (Windows) |

## 📚 Complete Documentation

For detailed information on:
- API endpoint documentation
- Database integration
- Production deployment
- Advanced features
- Performance optimization

See the original README.md file.

## 🎯 Example Workflow

1. **Server**: Register → Login → Copy token from localStorage
2. **Device**: Run `python3 monitor-agent.py --token <TOKEN>`
3. **Dashboard**: See device appear and track live connections
4. **Details**: Click device to view network activity

## 📄 License

MIT License - Free to use for any purpose

## 💡 Future Enhancements

- [ ] WebSocket real-time streaming
- [ ] Database integration
- [ ] Advanced analytics & graphs
- [ ] Alert notifications
- [ ] Connection filtering
- [ ] Log export functionality
- [ ] Multi-user roles
