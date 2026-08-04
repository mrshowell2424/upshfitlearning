# Advanced Monitoring Dashboards Guide

## Overview

Complete dashboard infrastructure with:
- **Grafana Dashboards** - Professional monitoring with Prometheus
- **Custom React Dashboards** - In-app metrics visualization
- **Real-time Charts** - Live metric updates
- **Business Intelligence** - KPI tracking
- **Alert Integration** - Critical notifications

---

## 1. Grafana Setup

### Installation

```bash
# Docker Compose
cat > docker-compose.yml << EOF
version: '3'
services:
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_INSTALL_PLUGINS=grafana-piechart-panel
    volumes:
      - grafana-storage:/var/lib/grafana

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus-storage:/prometheus

volumes:
  grafana-storage:
  prometheus-storage:
EOF

docker-compose up -d
```

### Configuration

**prometheus.yml:**
```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'upshift-hub'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'

  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:5432']

  - job_name: 'node'
    static_configs:
      - targets: ['localhost:9100']
```

### Dashboard Import

**In Grafana:**
1. Go to Dashboards → New → Import
2. Upload `monitoring/grafana-dashboards.json`
3. Select Prometheus data source
4. Save

**Dashboards Included:**

1. **Application Health Overview**
   - Error rate gauge
   - API response time graph
   - Active users count
   - Uptime status
   - 5xx error count
   - Payment success rate
   - Database query times
   - Lessons generated

2. **Business Metrics Dashboard**
   - Daily Active Users (DAU) trend
   - Monthly Active Users (MAU)
   - Paid users count
   - Conversion rate
   - Revenue (last 30 days)
   - Average Revenue Per User (ARPU)
   - Resource saves
   - Lesson generation rate
   - Churn rate
   - NPS score

3. **Infrastructure & Resources**
   - CPU usage by instance
   - Memory usage
   - Database connections
   - Connection pool utilization
   - Disk space usage
   - Network I/O
   - API request queue depth
   - Container restarts

4. **Integration Health**
   - Google Sheets sync status
   - Sync failures count
   - Substack article ingestion
   - Claude generation success rate
   - Stripe webhook processing
   - External API response times
   - Webhook retries

---

## 2. Custom React Dashboards

### File Structure

```
app/admin/dashboards/
├── metrics-dashboard.tsx      # Main metrics visualization
├── business-dashboard.tsx     # KPI tracking
├── infrastructure-dashboard.tsx # System health
└── alerts-dashboard.tsx       # Alert management
```

### Components Used

**Recharts Library:**
- AreaChart - Error rate trends
- LineChart - Response time trends
- BarChart - Volume metrics
- PieChart - Distribution metrics
- AreaChart - Payment status

### Access Control

```typescript
// Protect dashboard routes
// app/admin/layout.tsx
import { checkAdminAccess } from '@/lib/auth';

export default async function AdminLayout({ children }: any) {
  const user = await getCurrentUser();
  
  if (!user?.isAdmin) {
    redirect('/');
  }

  return <>{children}</>;
}
```

### API Endpoint

**GET /api/admin/metrics**
- Returns current metrics
- Returns time-series data
- Returns active alerts
- Requires admin authorization

**Response:**
```json
{
  "current": {
    "errorRate": 0.3,
    "apiResponseTime": 245,
    "databaseQueryTime": 85,
    "activeUsers": 342,
    "lessonsGenerated": 1248,
    "paymentsProcessed": 156,
    "resourcesSaved": 684,
    "uptime": 99.95
  },
  "timeSeries": {
    "errorRate": [...],
    "apiResponseTime": [...]
  },
  "alerts": [
    {
      "severity": "warning",
      "message": "High memory usage",
      "timestamp": 1690000000000
    }
  ]
}
```

---

## 3. Key Metrics Tracked

### Performance Metrics

```
Error Rate (%)
- Current value
- 24h trend
- Threshold: > 1% = warning, > 5% = critical

API Response Time
- P50, P95, P99
- By endpoint
- Threshold: > 1000ms = warning, > 3s = critical

Database Query Time
- P50, P95, P99
- By query type
- Threshold: > 500ms = warning

Page Load Time
- By page/route
- Threshold: > 3s = warning

Cache Hit Rate
- By cache type
- Threshold: < 80% = warning
```

### Business Metrics

```
Daily Active Users (DAU)
- 24h, 7d, 30d
- Trend comparison

Monthly Active Users (MAU)
- Absolute count
- Churn indicator

Paid Users
- Count and trend
- Conversion rate from free

Revenue
- Daily, monthly, total
- By subscription tier
- ARPU (Average Revenue Per User)

Lesson Generation
- 24h count
- By format (slides, document, worksheet, assessment)
- By standard code

Resource Interactions
- Saves, views, downloads
- Top resources

Payment Processing
- Success rate
- Failure count
- Processing time
- Stripe webhook lag
```

### Infrastructure Metrics

```
CPU Usage (%)
- By instance
- Threshold: > 80% = warning

Memory Usage (%)
- By instance
- Threshold: > 85% = warning

Disk Space
- By mount point
- Threshold: > 90% = critical

Database Connections
- Active count
- Pool utilization
- Threshold: > 50 = warning

Request Queue
- Depth
- Processing time
- Threshold: > 100 = warning

Network I/O
- Bytes in/out
- Packet loss
```

---

## 4. Dashboard Features

### Real-Time Updates

```typescript
useEffect(() => {
  // Fetch metrics every 30 seconds
  const interval = setInterval(() => {
    fetch('/api/admin/metrics').then(/* update state */);
  }, 30000);

  return () => clearInterval(interval);
}, []);
```

### Alert Indicators

- 🟢 Green: All metrics healthy
- 🟡 Yellow: Warning threshold exceeded
- 🔴 Red: Critical threshold exceeded

### Interactive Charts

- Hover for detailed values
- Click legend to toggle metrics
- Zoom and pan on graphs
- Export data as CSV

### Time Range Selection

```typescript
const timeRanges = [
  { label: '1 Hour', seconds: 3600 },
  { label: '24 Hours', seconds: 86400 },
  { label: '7 Days', seconds: 604800 },
  { label: '30 Days', seconds: 2592000 },
];
```

---

## 5. Dashboard Deployment

### Vercel Deployment

**Environment Variables:**
```bash
NEXT_PUBLIC_METRICS_API_URL=https://api.upshiftlearning.org/api/admin/metrics
ADMIN_API_TOKEN=[secure-token]
```

**Build Configuration:**
```bash
# In vercel.json
{
  "routes": [
    {
      "src": "/admin/dashboards/(.*)",
      "middleware": "adminAuth"
    }
  ]
}
```

### Grafana Cloud Deployment

**Option 1: Grafana Cloud**
```bash
# Sign up at https://grafana.com/cloud
# Link Prometheus
# Import dashboards
```

**Option 2: Self-Hosted Grafana**
```bash
# Use DigitalOcean App Platform or similar
# Follow Grafana documentation
```

---

## 6. Alert Configuration

### Grafana Alerts

```json
{
  "alert": "HighErrorRate",
  "condition": "error_rate > 5",
  "duration": "5m",
  "notifications": ["slack-critical", "pagerduty"]
}
```

### Dashboard Alerts

Real-time alerts shown on dashboards with:
- Red banner for critical
- Yellow banner for warning
- Sound notification (optional)
- Email notification integration

---

## 7. Scheduled Reports

### Daily Report (8 AM UTC)

```typescript
// schedules/daily-report.ts
export async function sendDailyReport() {
  const metrics = await getMetrics({ period: '24h' });
  
  const report = `
    Daily Metrics Report
    ===================
    DAU: ${metrics.activeUsers}
    Error Rate: ${metrics.errorRate}%
    Uptime: ${metrics.uptime}%
    Revenue: $${metrics.revenue}
  `;

  await sendEmail({
    to: 'team@upshiftlearning.org',
    subject: 'Daily Metrics Report',
    body: report,
  });
}
```

### Weekly Report (Monday 9 AM UTC)

Includes:
- Trend analysis
- YoY comparison
- Top issues
- Key achievements
- Action items

### Monthly Report

Includes:
- Business KPIs
- Infrastructure analysis
- Cost analysis
- Performance trends
- Incident summary

---

## 8. Dashboard Access Control

### Role-Based Access

```typescript
enum DashboardAccess {
  ADMIN = 'admin',           // All dashboards
  MANAGER = 'manager',       // Business + Infrastructure
  ENGINEER = 'engineer',     // Infrastructure + Integration
  SUPPORT = 'support',       // Business only
}

function canAccessDashboard(user: User, dashboard: string): boolean {
  const permissions = {
    'metrics': [ADMIN, ENGINEER, MANAGER],
    'business': [ADMIN, MANAGER, SUPPORT],
    'infrastructure': [ADMIN, ENGINEER],
    'alerts': [ADMIN, ENGINEER, MANAGER],
  };

  return permissions[dashboard]?.includes(user.role) ?? false;
}
```

### Audit Logging

```typescript
// Log all dashboard access
async function logDashboardAccess(userId: string, dashboard: string) {
  await db.insert(audit_logs).values({
    userId,
    action: 'dashboard_access',
    resource: dashboard,
    timestamp: new Date(),
  });
}
```

---

## 9. Performance Optimization

### Data Aggregation

**Problem:** Dashboard queries slow with 1M+ metrics

**Solution:** Pre-aggregate metrics

```typescript
// Hourly aggregation job
export async function aggregateMetrics() {
  const hourAgo = new Date(Date.now() - 3600000);

  await db.insert(metrics_hourly).values(
    await db
      .select({
        hour: sql`date_trunc('hour', timestamp)`,
        metric_name: sql`metric_name`,
        avg_value: sql`avg(value)`,
        min_value: sql`min(value)`,
        max_value: sql`max(value)`,
        p95_value: sql`percentile_cont(0.95) within group(order by value)`,
      })
      .from(metrics_raw)
      .where(sql`timestamp > ${hourAgo}`)
      .groupBy(sql`1, 2`)
  );
}
```

### Caching

```typescript
// Cache dashboard data
const cacheMetrics = (key: string, data: any, ttl: number) => {
  redis.setex(key, ttl, JSON.stringify(data));
};

const getMetrics = async (key: string) => {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  const fresh = await fetchMetrics();
  cacheMetrics(key, fresh, 300); // 5 min TTL
  return fresh;
};
```

---

## 10. Dashboard Best Practices

✅ **Do:**
- Show trends, not just current values
- Use color coding for alert states
- Include context (thresholds, targets)
- Automate data refresh
- Provide export options
- Log all access
- Set appropriate update frequencies

❌ **Don't:**
- Show too many metrics (< 20 per dashboard)
- Use confusing color schemes
- Have stale data (> 5 min old)
- Require manual refresh
- Grant access to non-admins
- Alert on every small change

---

## 11. Troubleshooting

### Dashboard Not Loading Data

```bash
# Check Prometheus connectivity
curl http://localhost:9090/api/v1/query?query=upshift_errors_total

# Check data retention
# Default: 15 days, adjust in prometheus.yml with:
# --storage.tsdb.retention.time=30d
```

### Slow Dashboard Performance

```bash
# Use aggregated queries
# Reduce refresh rate for heavy dashboards
# Use dashboard variables to filter data
```

### Missing Metrics

```bash
# Verify metrics are being scraped
http://localhost:9090/targets

# Check application is exporting metrics
curl http://localhost:3000/metrics
```

---

## Files Created

| File | Purpose | Size |
|------|---------|------|
| `monitoring/grafana-dashboards.json` | Grafana dashboard definitions | 1,500+ lines |
| `app/admin/dashboards/metrics-dashboard.tsx` | React metrics dashboard | 400+ lines |
| `app/api/admin/metrics/route.ts` | Metrics API endpoint | 200+ lines |
| `DASHBOARDS_GUIDE.md` | Complete setup guide | This file |
| **Total** | **Complete dashboard infrastructure** | **2,100+ lines** |

---

## Quick Start

1. **Set up Prometheus**
   ```bash
   docker-compose up -d
   ```

2. **Install Grafana**
   ```bash
   open http://localhost:3001
   login: admin/admin
   ```

3. **Import Dashboards**
   - Upload `grafana-dashboards.json`
   - Select Prometheus data source
   - Save

4. **Access React Dashboard**
   ```bash
   open http://localhost:3000/admin/dashboards/metrics
   ```

5. **Configure Alerts**
   - Set up Slack webhooks
   - Test alert routing
   - Document runbooks

---

**Status:** Complete Dashboard Infrastructure ✅

Ready for production monitoring and visualization!
