# Comprehensive Monitoring & Observability Setup

## Overview

Complete monitoring infrastructure with:
- **Error Tracking:** Sentry
- **APM & Infrastructure:** Datadog
- **Application Performance:** New Relic
- **Custom Metrics:** Prometheus-compatible
- **Logs:** Aggregation and analysis
- **Uptime Monitoring:** StatusPage
- **Analytics:** Segment/custom tracking

---

## 1. Sentry (Error Tracking & Performance)

### Setup

```bash
# Install Sentry SDK
bun add @sentry/nextjs

# Create accounts at https://sentry.io
NEXT_PUBLIC_SENTRY_DSN=https://[key]@sentry.io/[project-id]
SENTRY_ORG=upshift-learning
SENTRY_PROJECT=upshift-hub
SENTRY_AUTH_TOKEN=[token-from-sentry]
```

### Configuration Files

**Client-side:** `monitoring/sentry.config.ts`
- Browser error tracking
- Session replay
- Performance monitoring
- User context tracking

**Server-side:** Integrated in API routes
- Server error tracking
- Transaction monitoring
- Custom breadcrumbs

### Key Features

✅ **Error Tracking**
- Automatic error capture
- Grouping by type
- Stack traces

✅ **Performance Monitoring**
- Page load times
- API response times
- Database queries
- Custom transactions

✅ **Session Replay**
- Visual reproduction of errors
- User interaction replay
- Console logs capture

✅ **Alerting**
- Slack integration
- Email notifications
- Custom rules

### Usage

```typescript
import { reportError, addBreadcrumb } from "@/monitoring/sentry.config";

try {
  // Your code
} catch (error) {
  addBreadcrumb("Error occurred in payment flow", "payment");
  reportError(error as Error, { flow: "payment" });
}
```

---

## 2. Datadog (APM & Infrastructure)

### Setup

```bash
# Create account at https://www.datadoghq.com

# API Keys
NEXT_PUBLIC_DATADOG_APP_ID=[app-id]
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=[client-token]
NEXT_PUBLIC_DATADOG_API_KEY=[api-key]

# For server-side tracing
DD_API_KEY=[api-key]
DD_SITE=datadoghq.com
```

### Configuration Files

**Client-side:** `monitoring/datadog.config.ts`
- Real User Monitoring (RUM)
- Session replay
- Custom metrics
- Log forwarding

**Server-side:** dd-trace initialization
- Automatic HTTP tracing
- Database query tracking
- Custom instrumentations

### Key Features

✅ **Real User Monitoring**
- Page load times
- User interactions
- Resource loading
- JavaScript errors

✅ **Session Replay**
- Full session recordings
- Privacy-aware masking
- Quick replay access

✅ **Infrastructure Monitoring**
- Host metrics
- Container metrics
- Kubernetes monitoring

✅ **Log Management**
- Centralized logging
- Log correlation
- Search and analysis

### Dashboards

**Create in Datadog Dashboard:**

1. **Application Health**
   - Error rate
   - Page load time
   - API response time
   - Apdex score

2. **Infrastructure**
   - CPU usage
   - Memory usage
   - Disk I/O
   - Network throughput

3. **Business Metrics**
   - Active users
   - Lessons generated
   - Payment processing
   - Resource syncs

### Usage

```typescript
import { initDatadog, sendMetric, logEvent } from "@/monitoring/datadog.config";

initDatadog();

sendMetric({
  name: "lesson_generation_time",
  value: duration,
  tags: ["standard:RL.2.1", "format:slides"],
});

logEvent({
  level: "info",
  message: "Lesson generated successfully",
  context: { lessonId, duration },
});
```

---

## 3. New Relic (Application Performance)

### Setup

```bash
# Create account at https://newrelic.com

# Browser monitoring token
NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY=[license-key]
NEXT_PUBLIC_NEW_RELIC_APP_ID=[app-id]

# Server-side APM
NEW_RELIC_LICENSE_KEY=[license-key]
NEW_RELIC_APP_NAME=Upshift Learning Hub
```

### Configuration Files

`monitoring/newrelic.config.ts`
- Browser instrumentation
- Custom events
- Performance metrics
- User tracking

### Key Features

✅ **APM (Application Performance Monitoring)**
- Transaction tracing
- Error tracking
- Performance insights

✅ **Synthetic Monitoring**
- Uptime checks
- Transaction monitoring
- API testing

✅ **Alerts**
- NRQL-based alerts
- Notification channels
- Custom incident management

### Usage

```typescript
import { recordNewRelicEvent, recordNewRelicMetric } from "@/monitoring/newrelic.config";

recordNewRelicEvent({
  eventType: "LessonGeneration",
  userId: "user123",
  standard: "RL.2.1",
  format: "slides",
});

recordNewRelicMetric({
  name: "payment_processing_time",
  value: duration,
  unit: "ms",
});
```

---

## 4. Custom Metrics & Analytics

### Metrics Collector

`monitoring/metrics.config.ts` provides:
- Time-series data collection
- Percentile calculation
- Statistical analysis
- Export functionality

### Key Metrics to Track

**Performance Metrics**
```
- Page Load Time (p50, p95, p99)
- API Response Time
- Database Query Time
- Error Rate (%)
- 5xx Error Count
- 4xx Error Count
```

**Business Metrics**
```
- Daily Active Users (DAU)
- Monthly Active Users (MAU)
- Paid Users
- Free to Paid Conversion Rate
- Lesson Generation Count
- Resource Save Count
- Payment Processing Count
```

**Infrastructure Metrics**
```
- CPU Usage (%)
- Memory Usage (%)
- Database Connections
- API Request Queue Depth
- Cache Hit Rate
- Uptime (%)
```

### Analytics Events

Track these events in all 3 platforms:

```typescript
// User events
USER_SIGNUP
USER_LOGIN
USER_LOGOUT

// Payment events
SUBSCRIPTION_CREATED
SUBSCRIPTION_CANCELLED
PAYMENT_FAILED

// Content events
STANDARD_SEARCHED
RESOURCE_VIEWED
LESSON_GENERATED
LESSON_DOWNLOADED

// Integration events
GOOGLE_SHEETS_SYNCED
SUBSTACK_ARTICLE_INGESTED
CLAUDE_GENERATION_COMPLETED

// Error events
API_ERROR
DATABASE_ERROR
EXTERNAL_API_ERROR
```

---

## 5. Alerting Rules

### Critical Alerts (Page Immediately)

```
Error Rate > 5%
API Response Time P95 > 3 seconds
Database Connection Pool Exhausted
5xx Errors > 10 per minute
Payment Processing Failure
Database Down
API Key Invalid/Expired
```

### Warning Alerts (Notify in Slack)

```
Error Rate > 1%
API Response Time P95 > 1 second
Memory Usage > 85%
CPU Usage > 80%
Queue Depth > 50
Payment Processing Slow (> 10 seconds)
External API Timeout
```

### Info Alerts (Dashboard Only)

```
Daily Active Users Below Threshold
Lesson Generation Count Below Threshold
Google Sheets Sync Failed (Retry Available)
Cache Hit Rate Below 80%
```

---

## 6. Slack Integration

### Setup

```bash
# Create Slack app at https://api.slack.com/apps

# Webhook for alerts
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/[your-webhook]

# Bot token for more advanced features
SLACK_BOT_TOKEN=[bot-token]
```

### Alert Channels

**#alerts-critical**
- Sentry errors (>20 per minute)
- API errors (>10 per minute)
- Database down
- Payment failures

**#alerts-warnings**
- High error rate
- Slow API responses
- Failed integrations
- Resource exhaustion

**#deployments**
- Deployment started
- Deployment succeeded
- Deployment failed
- Rollback initiated

### Example Slack Message

```
🚨 Critical Alert
Error Rate: 5.2% (threshold: 1%)
Status: Active
Duration: 8 minutes

Affected Endpoints:
- POST /api/generate-lesson (24 errors)
- POST /api/stripe/webhooks (5 errors)

[View in Sentry] [View in Datadog] [Acknowledge]
```

---

## 7. Logging & Log Aggregation

### Log Levels

```
DEBUG   - Development information
INFO    - Normal application flow
WARN    - Potentially problematic situations
ERROR   - Error conditions
FATAL   - Fatal application failures
```

### Structured Logging

Log all events with context:

```typescript
logger.info("Payment processed", {
  userId: "user123",
  amount: 999,
  currency: "USD",
  paymentId: "pay_123",
  duration: 234,
  status: "completed",
});
```

### Log Retention

- **Sentry:** 90 days
- **Datadog:** 30 days (with 15-day retention option)
- **New Relic:** 30 days
- **Cloud Storage:** Archive older logs

---

## 8. Dashboards & Reports

### Real-Time Dashboards

**Sentry Dashboard**
- Release health
- Error count and trends
- Performance metrics
- User feedback

**Datadog Dashboard**
- Service health
- User experience metrics
- Infrastructure status
- Business KPIs

**New Relic Dashboard**
- Application overview
- Transaction performance
- Error tracking
- Alert violations

### Weekly Reports

```
Period: [Date Range]
Status: [Healthy/Warning/Critical]

Uptime: 99.95%
Error Rate: 0.3%
P95 Response Time: 425ms
Page Load Time: 1.2s

Top Issues:
1. [Issue 1] - 45 occurrences
2. [Issue 2] - 32 occurrences

Business Metrics:
- DAU: 342
- Lessons Generated: 127
- Revenue: $4,250
```

---

## 9. Monitoring Setup Checklist

### Pre-Production Setup

- [ ] Create Sentry project
- [ ] Create Datadog account
- [ ] Create New Relic account
- [ ] Generate API keys
- [ ] Configure GitHub secrets
- [ ] Set up Slack integration
- [ ] Create dashboards
- [ ] Configure alert rules
- [ ] Test alert notifications
- [ ] Document runbook

### Post-Deployment Verification

- [ ] Verify error tracking works
- [ ] Verify performance monitoring
- [ ] Verify custom events tracking
- [ ] Test Slack alerts
- [ ] Verify dashboard data
- [ ] Check log aggregation
- [ ] Validate metrics collection

---

## 10. Incident Response

### When Alert Fires

1. **Immediate (0-2 min)**
   - Check Sentry/Datadog for details
   - Look at recent deployments
   - Check infrastructure status

2. **Short-term (2-5 min)**
   - Identify impact scope
   - Review error logs
   - Check external service status

3. **Communication (5+ min)**
   - Update status page
   - Notify team
   - Begin investigation
   - Start incident log

4. **Resolution**
   - Apply fix or rollback
   - Verify resolution
   - Update status page
   - Post-mortem

---

## 11. Cost Optimization

### Estimated Monthly Costs

```
Sentry:
  - Free tier up to 5k errors/mo
  - Pro: $29-999/mo depending on events

Datadog:
  - Infrastructure: $15/host
  - APM: $0.10 per trace ingested
  - Logs: $0.10/GB

New Relic:
  - Free tier: up to 100GB/day
  - Pro: $0.50-0.80/GB

Total Estimated: $500-2,000/month
```

### Cost Reduction Tips

- Use sampling for high-traffic endpoints
- Archive old logs
- Use free tiers when possible
- Implement log retention policies
- Use alerts instead of always-on dashboards

---

## 12. Monitoring & Observability Files Created

| File | Purpose | Size |
|------|---------|------|
| `monitoring/sentry.config.ts` | Error tracking & APM | 300+ lines |
| `monitoring/metrics.config.ts` | Custom metrics collection | 400+ lines |
| `monitoring/datadog.config.ts` | Datadog integration | 350+ lines |
| `monitoring/newrelic.config.ts` | New Relic integration | 350+ lines |
| `MONITORING_SETUP.md` | Complete setup guide | This file |
| **Total** | **Complete observability** | **1,400+ lines** |

---

## Quick Start

### 1. Install Dependencies
```bash
bun add @sentry/nextjs
# Datadog and New Relic are loaded via CDN
```

### 2. Add Environment Variables
```bash
NEXT_PUBLIC_SENTRY_DSN=https://...
NEXT_PUBLIC_DATADOG_APP_ID=...
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=...
NEXT_PUBLIC_NEW_RELIC_LICENSE_KEY=...
```

### 3. Initialize in app/layout.tsx
```typescript
import { initSentry } from "@/monitoring/sentry.config";
import { initDatadog } from "@/monitoring/datadog.config";
import { initNewRelicBrowser } from "@/monitoring/newrelic.config";

export default function RootLayout() {
  useEffect(() => {
    initSentry();
    initDatadog();
    initNewRelicBrowser();
  }, []);
  
  // ...
}
```

### 4. Add Alert Webhooks
- Sentry → Slack
- Datadog → Slack
- New Relic → Slack

### 5. Create Dashboards
- Review each platform's dashboard templates
- Customize with your metrics
- Share with team

---

## Resources

- **Sentry Docs:** https://docs.sentry.io/
- **Datadog Docs:** https://docs.datadoghq.com/
- **New Relic Docs:** https://docs.newrelic.com/
- **Monitoring Best Practices:** https://en.wikipedia.org/wiki/Application_performance_management

---

**Status:** Complete Monitoring Infrastructure ✅
**Ready for:** Production deployment
