# Deployment Playbook

Complete runbook for deploying Upshift Learning Hub to production with safety checks, monitoring, and rollback procedures.

---

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Deployment Procedure](#deployment-procedure)
3. [Staging Deployment](#staging-deployment)
4. [Production Deployment](#production-deployment)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Rollback Procedure](#rollback-procedure)
7. [Monitoring During Deployment](#monitoring-during-deployment)
8. [Communication Template](#communication-template)
9. [Incident Response](#incident-response)
10. [Team Responsibilities](#team-responsibilities)

---

## Pre-Deployment Checklist

### 48 Hours Before Deployment

- [ ] Notify stakeholders via email
- [ ] Schedule Slack channel notification
- [ ] Create backup of production database
- [ ] Review change summary
- [ ] Verify all tests passing
- [ ] Check feature flags ready
- [ ] Document rollback procedure
- [ ] Alert on-call team

### 24 Hours Before Deployment

- [ ] Final code review completed
- [ ] Security scan passed
- [ ] Performance tests passed
- [ ] Database migration tested
- [ ] API contracts verified
- [ ] External service integrations tested
- [ ] Monitoring alerts configured
- [ ] Team notified of deployment window

### 2 Hours Before Deployment

- [ ] Verify CI/CD pipeline passing
- [ ] Check dashboard accessible
- [ ] Verify Slack alerts working
- [ ] Ensure database backups complete
- [ ] Confirm team availability
- [ ] Check external service status
- [ ] Verify on-call rotation
- [ ] Confirm no urgent bugs filed

### Deployment Day Checklist

- [ ] All team members available
- [ ] Database connection verified
- [ ] Monitoring dashboards open
- [ ] Slack channels active
- [ ] Rollback procedure documented
- [ ] Customer support briefed
- [ ] Status page updated
- [ ] Runbooks printed/accessible

---

## Deployment Procedure

### Deployment Phases

```
Phase 1: Staging Deployment (1-2 hours before prod)
  ├─ Deploy to staging environment
  ├─ Run smoke tests
  ├─ Verify all integrations
  ├─ Load test critical paths
  └─ Team approval to proceed to production

Phase 2: Production Deployment (during maintenance window)
  ├─ Run database migrations (if any)
  ├─ Deploy to production
  ├─ Monitor error rates
  ├─ Monitor performance metrics
  └─ Complete post-deployment verification

Phase 3: Post-Deployment (2-4 hours after)
  ├─ Monitor all critical metrics
  ├─ Verify user flows
  ├─ Check external integrations
  ├─ Review error logs
  └─ Confirm system stability
```

### Standard Deployment Window

**Day:** Tuesday-Thursday  
**Time:** 2-4 AM UTC (low-traffic period)  
**Duration:** 30-60 minutes  
**Participants:** 2 engineers (primary + backup), 1 manager, support on-call

---

## Staging Deployment

### Step 1: Deploy to Staging

```bash
# Trigger staging deployment
git push origin main

# GitHub Actions automatically:
# 1. Runs all tests
# 2. Deploys to staging
# 3. Runs smoke tests
# 4. Notifies team in Slack
```

### Step 2: Verify Staging Environment

```bash
# Check deployment status
vercel projects list --scope [ORG]

# Verify staging URL
curl -I https://staging-upshift.vercel.app

# Check health endpoints
curl https://staging-upshift.vercel.app/api/health
# Expected: {"status": "healthy"}
```

### Step 3: Run Smoke Tests on Staging

```bash
# Execute smoke tests against staging
npm run test:e2e -- --grep "@smoke"

# Tests to verify:
# ✅ Homepage loads
# ✅ Search works
# ✅ Standard detail page loads
# ✅ Resource library loads
# ✅ Pricing page loads
# ✅ Stripe integration works (test mode)
# ✅ Authentication works
```

### Step 4: Verify Integrations on Staging

```bash
# Test Google Sheets sync
curl -X POST https://staging-upshift.vercel.app/api/sync/sheets \
  -H "Authorization: Bearer [admin-token]"

# Test Substack webhook
curl -X POST https://staging-upshift.vercel.app/api/webhooks/substack \
  -H "Content-Type: application/json" \
  -d '{"type":"post.published",...}'

# Test Claude generation (test API key)
curl -X POST https://staging-upshift.vercel.app/api/generate-lesson \
  -H "Authorization: Bearer [user-token]" \
  -d '{"standard":"RL.2.1","format":"slides"}'

# Test Stripe webhook
curl -X POST https://staging-upshift.vercel.app/api/stripe/webhooks \
  -H "stripe-signature: $(generate-stripe-sig)" \
  -d '{"type":"checkout.session.completed",...}'
```

### Step 5: Load Test on Staging

```bash
# Run load test (simulate 100 concurrent users)
npm run load-test -- --staging --duration 10m --ramp 100

# Monitor metrics:
# - Response time should stay < 1 second
# - Error rate should be < 0.1%
# - Database connections should stay < 30
# - Memory usage should be < 60%
```

### Step 6: Team Sign-Off

```
Team Lead Checklist:
✅ All smoke tests passed
✅ All integrations verified
✅ Load test completed successfully
✅ No errors in Sentry
✅ Dashboard metrics normal
✅ Team ready to proceed

Slack: "✅ Staging deployment successful. Ready for production."
```

---

## Production Deployment

### Step 1: Database Backups

```bash
# Supabase automatic backup runs
# Verify backup exists in Supabase Dashboard
# ✅ Backup Status: Complete
# ✅ Backup Time: [timestamp]
```

### Step 2: Deploy to Production

```bash
# Automated via GitHub Actions:
# 1. Manual approval required
# 2. Deploy production build
# 3. Notify team in Slack

# Manual verification:
vercel projects list --scope [ORG]
# Check: Production URL active
```

### Step 3: Database Migrations

```bash
# If migrations needed
bun run migrate:prod

# Output should show:
# ✅ [migration_name] completed
# ✅ Database schema updated
# ✅ All tables accessible
```

### Step 4: Monitor Deployment

```bash
# Open monitoring dashboards in new terminal windows:
1. Dashboard 1: Grafana (http://localhost:3001)
2. Dashboard 2: Sentry (https://sentry.io)
3. Dashboard 3: Datadog (https://app.datadoghq.com)
4. Dashboard 4: New Relic (https://one.newrelic.com)

# Watch for:
- Error rate stays < 1%
- Response time stays < 500ms
- Database connections normal
- No new errors in Sentry
- Payment processing working
- No Slack alerts firing
```

### Step 5: Smoke Test Production

```bash
# Run critical user flows
npm run test:e2e -- --grep "@smoke" --baseUrl https://upshiftlearning.org

# Manual verification:
1. Visit homepage - should load
2. Search for standard - should work
3. View standard detail - all tabs present
4. Visit resource library - resources load
5. Try lesson generation - UI appears
6. Check pricing page - correct pricing
7. Verify integrations working
```

### Step 6: Announce Deployment

```bash
# Slack notification (automated via GitHub Actions)
@channel 🚀 Production deployment successful

✅ Version: [release-number]
✅ Commit: [git-sha]
✅ Deployment Time: [timestamp]
✅ Status: All systems healthy

For details: https://github.com/...
```

---

## Post-Deployment Verification

### Immediate (0-15 minutes after)

```bash
# Check error rates
curl https://api.sentry.io/api/0/organizations/upshift-learning/stats/ \
  -H "Authorization: Bearer $SENTRY_AUTH_TOKEN"

# Expected: error_rate < 1%

# Check performance
curl https://monitoring.upshift.org/api/metrics

# Expected:
# - API response time P95: < 500ms
# - Database query time: < 200ms
# - Uptime: 100%

# Check integrations
1. Google Sheets: Last sync timestamp should be recent
2. Substack: Last article ingestion timestamp recent
3. Claude: Test generation request succeeds
4. Stripe: Webhooks being processed
```

### Short-term (15 minutes to 2 hours after)

```bash
# Monitor key business metrics
1. DAU (Daily Active Users) - normal level
2. Lesson generation count - normal rate
3. Payment processing - no failures
4. Resource syncing - no errors

# Review error patterns
1. Check Sentry for new errors
2. Review database slow queries
3. Monitor API errors
4. Check for memory leaks

# Load monitoring
1. Database connections: should be < 30
2. Memory usage: should be < 70%
3. CPU usage: should be < 60%
4. Request queue: should be < 10
```

### Extended (2-24 hours after)

```bash
# Run full test suite on production-like data
npm run test:e2e -- --baseUrl https://upshiftlearning.org

# Verify all user flows
1. User signup/login flow
2. Resource search and viewing
3. Standard detail navigation
4. Lesson generation
5. Payment processing
6. Integration webhooks

# Analyze performance trends
1. Check P50, P95, P99 response times
2. Review error rate trends
3. Monitor database performance
4. Check external API integrations
```

---

## Rollback Procedure

### When to Rollback

**Immediate Rollback Trigger:**
- Critical error (500s) rate > 5%
- Database connection failures
- Payment processing failures
- Authentication failures
- External service integration failures
- Security vulnerability discovered

**Consider Rollback If:**
- Performance P95 > 3 seconds (sustained > 5 min)
- Error rate > 1% (sustained > 10 min)
- Memory leak detected
- CPU consistently > 90%

### Rollback Steps

### Step 1: Decision & Communication

```bash
# Send immediate Slack message
@channel 🚨 INITIATING ROLLBACK

Reason: [specific reason]
Estimated Duration: 10-15 minutes
Impact: [brief impact statement]

https://sentry.io/organizations/upshift-learning/issues/
```

### Step 2: Execute Rollback

```bash
# Option A: Vercel Console (fastest)
1. Go to Vercel Dashboard
2. Deployments tab
3. Click on previous stable deployment
4. Click "Promote to Production"
5. Confirm rollback

# Option B: CLI
vercel rollback --prod --name upshift-hub

# Expected output:
# ✅ Rollback started
# ✅ Previous version: [version]
# ✅ Rollback time: 2-5 minutes
```

### Step 3: Verify Rollback

```bash
# Check version
curl https://upshiftlearning.org/api/version
# Should return previous version

# Run smoke tests
npm run test:e2e -- --grep "@smoke"

# Monitor metrics
# - Error rate should drop to < 0.5%
# - Response time should normalize
# - No new Sentry errors
```

### Step 4: Announce Rollback

```bash
# Update Slack
@channel ✅ Rollback completed

Previous version restored: [version]
Rollback time: [X minutes]
Status: All systems healthy

Investigation: [brief summary]
Next steps: [plan to fix and redeploy]
```

### Step 5: Post-Incident

```bash
# Create GitHub issue
Title: "Rollback: [brief description]"
Labels: incident, deployment

# Schedule post-mortem
Within 24 hours of rollback

# Document:
1. What went wrong
2. Root cause
3. Fix implemented
4. Prevention measures
5. Deployment date for fix
```

---

## Monitoring During Deployment

### Real-Time Monitoring Dashboard

**Open in parallel during deployment:**

```
Terminal 1: Grafana Dashboard
http://localhost:3001/d/app-health

Terminal 2: Sentry Console
https://sentry.io/organizations/upshift-learning/issues/

Terminal 3: Datadog Dashboard
https://app.datadoghq.com/dashboard/overview

Terminal 4: New Relic Dashboard
https://one.newrelic.com/nr1-core/overview
```

### Key Metrics to Watch

**Every 30 seconds during first 5 minutes:**

```
Error Rate
  ✅ Target: < 0.5%
  ⚠️  Warning: 0.5-1%
  🚨 Critical: > 1%

API Response Time (P95)
  ✅ Target: < 500ms
  ⚠️  Warning: 500-1000ms
  🚨 Critical: > 1000ms

Database Connections
  ✅ Target: < 30
  ⚠️  Warning: 30-45
  🚨 Critical: > 50

Memory Usage
  ✅ Target: < 60%
  ⚠️  Warning: 60-80%
  🚨 Critical: > 85%

Payment Processing
  ✅ Target: 100% success
  ⚠️  Warning: 95-99%
  🚨 Critical: < 95%
```

### Alert Channels

**If alert fires during deployment:**

1. **Slack #alerts-critical**
   - Immediate page to on-call
   - Notify team lead
   - Prepare rollback

2. **PagerDuty**
   - Incident automatically created
   - On-call notified via phone
   - Escalation if not acknowledged

3. **Email**
   - Manager notified
   - Support team notified
   - Executive summary

---

## Communication Template

### Pre-Deployment (48 hours before)

```
Subject: 🚀 Upcoming Deployment - [DATE] @ [TIME] UTC

Hi Team,

We're planning to deploy a new version to production:

📝 Changes:
- [Brief summary of major changes]
- [Number of PRs merged]
- [Key features/fixes]

⏰ Deployment Window:
Date: [DAY], [DATE]
Time: [TIME] - [TIME] UTC
Duration: ~30-60 minutes

⚠️  Possible Impact:
- Brief service interruption possible
- All functionality will be available
- Payment processing may be briefly unavailable

📊 Confidence Level: [High/Medium]
Tests Passed: [Number of tests]

Action Required:
- Please test any critical workflows before deployment
- Flag any urgent bugs NOW
- Be available in #deployments channel during deployment

Questions? Slack @tech-lead

—Tech Team
```

### Deployment In Progress (start of deployment)

```
🟡 DEPLOYMENT IN PROGRESS

Version: [VERSION]
Start Time: [TIME]
Expected End: [TIME + 30min]

Updates will be posted in this thread every 5 minutes.

Status Page: https://status.upshiftlearning.org
Dashboard: https://grafana.upshift.org

Do not deploy anything else during this window.
```

### Deployment Successful

```
✅ DEPLOYMENT SUCCESSFUL

Version: [VERSION]
Duration: [TIME]
Start: [TIME] UTC
End: [TIME] UTC

✅ All smoke tests passed
✅ Error rate: [VALUE]%
✅ Performance: Normal
✅ Integrations: All working

Changes are now live for all users.

Next: Full monitoring for 24 hours.
```

### Deployment Failed / Rollback

```
🚨 ROLLBACK INITIATED

Previous Version: [VERSION]
Reason: [REASON]
Expected Completion: [TIME]

Status updates posted in this thread.

Incident channel: #incident-[DATE]
Post-mortem scheduled: [DATE] [TIME]
```

---

## Incident Response

### During Incident

```
1. Acknowledge incident
   - Log into PagerDuty
   - Create incident channel
   - Gather team

2. Assess impact
   - Check error logs
   - Monitor metrics
   - Check user reports

3. Contain incident
   - Prepare rollback if needed
   - Notify external teams
   - Update status page

4. Resolve incident
   - Execute rollback OR fix deployed
   - Verify resolution
   - Announce recovery

5. Post-incident
   - Root cause analysis
   - Action items
   - Prevention measures
```

### Escalation Path

```
Level 1 (0-5 min): On-call engineer
  → Investigate
  → Decide: fix or rollback?

Level 2 (5-15 min): On-call manager
  → Join incident call
  → Approve rollback if needed
  → Notify stakeholders

Level 3 (15+ min): VP Engineering
  → Join call
  → Executive decisions
  → Customer communications
```

### Incident Timeline Template

```
[TIME] Incident detected
[TIME] Alert firing
[TIME] Team notified
[TIME] Investigation started
[TIME] Root cause identified
[TIME] Rollback decision made
[TIME] Rollback initiated
[TIME] Rollback complete
[TIME] Services recovered
[TIME] All-clear given
[TIME] Post-mortem scheduled
```

---

## Team Responsibilities

### Deployment Lead (Primary Engineer)

**Before Deployment:**
- [ ] Verify all tests passing
- [ ] Review change summary
- [ ] Document rollback procedure
- [ ] Brief team on changes

**During Deployment:**
- [ ] Execute deployment steps
- [ ] Monitor metrics in real-time
- [ ] Make go/no-go decisions
- [ ] Communicate status updates

**After Deployment:**
- [ ] Verify all smoke tests
- [ ] Monitor for 2 hours
- [ ] File any issues found
- [ ] Schedule post-mortem if needed

### Backup Engineer

**Before Deployment:**
- [ ] Understand changes
- [ ] Know rollback procedure
- [ ] Have runbooks available

**During Deployment:**
- [ ] Monitor dashboards
- [ ] Alert if metrics abnormal
- [ ] Be ready to take over

**After Deployment:**
- [ ] Continue monitoring
- [ ] Help with any issues

### Manager

**Before Deployment:**
- [ ] Approve deployment
- [ ] Notify stakeholders
- [ ] Brief support team

**During Deployment:**
- [ ] Monitor from side
- [ ] Ready to escalate
- [ ] Communicate with leadership

**After Deployment:**
- [ ] Confirm success with team
- [ ] Notify stakeholders

### Support Team

**Before Deployment:**
- [ ] Know what's changing
- [ ] Prepare FAQ
- [ ] Brief customer-facing docs

**During Deployment:**
- [ ] Monitor support channels
- [ ] Collect user reports
- [ ] Pass critical issues to engineering

**After Deployment:**
- [ ] Monitor customer feedback
- [ ] Report issues found

---

## SLAs During Deployment

### Deployment SLA

| Metric | Target | Alert |
|--------|--------|-------|
| Deployment Duration | < 30 min | > 45 min |
| Smoke Test Pass Rate | 100% | < 100% |
| Error Rate Post-Deploy | < 0.5% | > 1% |
| Response Time P95 | < 500ms | > 1000ms |
| Critical Issues | 0 | ≥ 1 |

### Uptime SLA

During deployment window:
- Target: 99%
- Warning: < 99.5%
- Critical: < 99%

After deployment (24 hours):
- Target: 99.9%
- Warning: < 99.95%
- Critical: < 99.9%

---

## Rollback Decision Tree

```
ERROR_RATE > 5% ?
├─ YES → IMMEDIATE ROLLBACK
├─ NO → Continue

DB_UNAVAILABLE ?
├─ YES → IMMEDIATE ROLLBACK
├─ NO → Continue

PAYMENTS_FAILING ?
├─ YES → IMMEDIATE ROLLBACK
├─ NO → Continue

AUTH_BROKEN ?
├─ YES → IMMEDIATE ROLLBACK
├─ NO → Continue

ERROR_RATE > 1% (sustained > 5 min) ?
├─ YES → MANAGER DECISION (rollback or fix)
├─ NO → Continue

PERFORMANCE_DEGRADED (P95 > 1s, sustained > 10 min) ?
├─ YES → MANAGER DECISION
├─ NO → Continue monitoring

✅ SAFE TO PROCEED with extended monitoring
```

---

## Post-Mortem Template

```
# Post-Mortem: [Incident Name]

**Date:** [DATE]
**Duration:** [START] - [END] UTC
**Severity:** [Critical/High/Medium/Low]

## Timeline

| Time | Event |
|------|-------|
| [TIME] | [Event description] |
| ... | ... |

## Impact

- Users Affected: [NUMBER]
- Features Down: [LIST]
- Duration: [LENGTH]
- Customer Reports: [COUNT]

## Root Cause

[Detailed explanation of what went wrong]

## Contributing Factors

- [Factor 1]
- [Factor 2]
- [Factor 3]

## Resolution

[What was done to fix it]

## Action Items

| Item | Owner | Due Date | Status |
|------|-------|----------|--------|
| [ ] Implement fix | [NAME] | [DATE] | |
| [ ] Deploy fix | [NAME] | [DATE] | |
| [ ] Add test coverage | [NAME] | [DATE] | |
| [ ] Update runbook | [NAME] | [DATE] | |

## Prevention

[How to prevent this in the future]

## Lessons Learned

[Key takeaways]
```

---

## Quick Reference

### Deploy Command
```bash
git push origin main
# GitHub Actions handles the rest
```

### Rollback Command
```bash
vercel rollback --prod
```

### Health Check
```bash
curl https://upshiftlearning.org/api/health
```

### Emergency Contacts
```
On-Call Engineer: [SLACK MENTION]
On-Call Manager: [SLACK MENTION]
VP Engineering: [SLACK MENTION]
Support Lead: [SLACK MENTION]
```

### Critical Dashboards
```
Grafana: https://grafana.upshift.org
Sentry: https://sentry.io/organizations/upshift-learning
Datadog: https://app.datadoghq.com
New Relic: https://one.newrelic.com
```

---

**Version:** 1.0  
**Last Updated:** July 30, 2026  
**Approved By:** VP Engineering  
**Next Review:** Quarterly
