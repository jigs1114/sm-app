# Deployment Guide

## Local Development

### Start Server
```bash
npm run dev
```
Server runs on `http://localhost:3000`

### Build for Production
```bash
npm run build
npm start
```

---

## Deploy to Vercel (Recommended)

### Prerequisites
- Vercel account (free at vercel.com)
- Git repository

### Steps

1. **Push code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/monitor-app
git push -u origin main
```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://your-vercel-domain.vercel.app
     JWT_SECRET=your-production-secret-key
     NODE_ENV=production
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app is live!

---

## Deploy to Railway (Free Tier Available)

### Prerequisites
- Railway account (free at railway.app)
- GitHub repository

### Steps

1. **Push code to GitHub** (see Vercel steps above)

2. **Create Railway Project**
   - Go to [railway.app](https://railway.app)
   - Click "Create New Project"
   - Select "Deploy from GitHub"
   - Select your repository

3. **Configure Environment Variables**
   - In Railway dashboard, go to Variables
   - Add environment variables:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-domain.railway.app
     JWT_SECRET=your-production-secret-key
     NODE_ENV=production
     ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build
   - Your app is live at provided URL

---

## Deploy to Heroku (Requires Credit Card)

### Prerequisites
- Heroku account
- Heroku CLI
- GitHub repository

### Steps

1. **Login to Heroku**
```bash
heroku login
```

2. **Create Heroku App**
```bash
heroku create your-app-name
```

3. **Set Environment Variables**
```bash
heroku config:set NEXT_PUBLIC_API_URL=https://your-app-name.herokuapp.com
heroku config:set JWT_SECRET=your-production-secret-key
heroku config:set NODE_ENV=production
```

4. **Deploy**
```bash
git push heroku main
```

5. **Open App**
```bash
heroku open
```

---

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY .next ./.next
COPY public ./public

EXPOSE 3000

CMD ["npm", "start"]
```

### Build and Run

```bash
# Build image
docker build -t monitor-app:latest .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://localhost:3000 \
  -e JWT_SECRET=your-secret \
  monitor-app:latest
```

### Deploy with Docker Compose

```yaml
version: '3.8'

services:
  app:
    image: monitor-app:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3000
      - JWT_SECRET=your-secret
      - NODE_ENV=production
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

---

## Production Checklist

- [ ] Update `JWT_SECRET` to strong random string
- [ ] Set `NODE_ENV=production`
- [ ] Update `NEXT_PUBLIC_API_URL` to your domain
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Configure database instead of in-memory storage
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy
- [ ] Add SSL certificate
- [ ] Set up domain name
- [ ] Configure email notifications
- [ ] Add rate limiting
- [ ] Enable CORS properly
- [ ] Set up CI/CD pipeline

---

## Environment Variables for Production

```env
# Server URL (no trailing slash)
NEXT_PUBLIC_API_URL=https://monitor.example.com

# JWT Secret (generate strong random string)
JWT_SECRET=your-production-secret-key-min-32-characters

# Node environment
NODE_ENV=production

# Optional: Database
DATABASE_URL=postgresql://user:password@localhost:5432/monitor_db

# Optional: API Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_WINDOW=3600
RATE_LIMIT_MAX_REQUESTS=100

# Optional: Email (for alerts)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## Performance Optimization

### 1. Enable Caching
```javascript
// next.config.js
module.exports = {
  headers: () => [
    {
      source: '/api/:path*',
      headers: [
        { key: 'Cache-Control', value: 'max-age=0' }
      ]
    }
  ]
}
```

### 2. Database Indexing
```sql
CREATE INDEX idx_devices_status ON monitored_devices(status);
CREATE INDEX idx_devices_user_id ON monitored_devices(user_id);
CREATE INDEX idx_connections_user_id ON connections(user_id);
```

### 3. Compression
Already enabled by Next.js for static assets

### 4. CDN
Deploy static assets to CDN (CloudFlare, AWS CloudFront)

---

## Monitoring & Logging

### Application Logs
```bash
# Check logs on Vercel
vercel logs

# Check logs on Railway
railway logs
```

### Error Tracking
Add Sentry:
```bash
npm install @sentry/nextjs
```

### Uptime Monitoring
- Use UptimeRobot (free)
- Pingdom
- Datadog

---

## Scaling Considerations

### Current Limitations
- In-memory storage (single server only)
- No load balancing
- No session persistence

### For Scaling
1. **Add Database**
   - PostgreSQL or MongoDB
   - Implement connection pooling

2. **Add Redis**
   - Cache frequently accessed data
   - Session management

3. **Load Balancer**
   - Distribute traffic
   - Auto-scaling

4. **Separate Services**
   - API server
   - Real-time WebSocket server
   - Background jobs

---

## Backup & Recovery

### Database Backups
```bash
# PostgreSQL backup
pg_dump -U user -h localhost monitor_db > backup.sql

# Restore
psql -U user -h localhost monitor_db < backup.sql
```

### Automated Backups
Set up automated daily backups to S3 or cloud storage

---

## Troubleshooting Deployments

| Issue | Solution |
|-------|----------|
| Build fails | Check Node version, try `npm ci` |
| Env vars not working | Restart application after adding |
| Out of memory | Add more resources or optimize code |
| Slow requests | Enable caching, add database indexes |
| Connection refused | Check firewall, port binding |

---

## Cost Estimation

| Service | Free Tier | Cost |
|---------|-----------|------|
| Vercel | ✓ (Hobby) | $20+/month (Pro) |
| Railway | ✓ (Limited) | Pay-as-you-go |
| Heroku | ✗ | $7+/month |
| Database | ✓ (Limited) | $5-50+/month |

---

## Custom Domain

### 1. Buy Domain
- Namecheap
- GoDaddy
- Google Domains

### 2. Update DNS Records

**For Vercel:**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**For Railway:**
```
Type: CNAME
Name: @
Value: your-railway-domain
```

### 3. Verify Domain
Takes 24-48 hours to propagate

---

## Getting Help

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Docs: [nextjs.org/docs](https://nextjs.org/docs)
- Railway Docs: [railway.app/docs](https://railway.app/docs)
- Stack Overflow: Tag `next.js` and `deployment`
