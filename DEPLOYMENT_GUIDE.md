# Production Deployment Guide

## Overview

Complete guide to deploying Upshift Learning Hub to production with CI/CD automation, monitoring, and rollback capabilities.

---

## Pre-Deployment Checklist

### Infrastructure Setup
- [ ] Vercel account created and project imported
- [ ] Supabase project created (PostgreSQL database)
- [ ] Stripe account with test and live keys
- [ ] Claude AI API key obtained
- [ ] GitHub repository connected
- [ ] Environment variables documented

### Application Requirements
- [ ] All tests passing locally (`npm run test && npm run test:e2e`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Type checking passes (`npm run type-check`)
- [ ] No console errors or warnings
- [ ] Git branch clean and up-to-date

### Documentation & Access
- [ ] Deployment playbook reviewed
- [ ] Rollback procedures understood
- [ ] On-call rotation established
- [ ] Stakeholders notified
- [ ] Marketing/support team briefed

---

## Step 1: Infrastructure Setup

### 1.1 Supabase Database

```bash
# Create project at https://supabase.com/dashboard

# Get connection details
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_ANON_KEY=[from settings]
SUPABASE_SERVICE_ROLE_KEY=[from settings]
DATABASE_URL=postgresql://postgres:[password]@db.[id].supabase.co:5432/postgres
DATABASE_POOL_URL=postgresql://postgres:[password]@[region].pooler.supabase.com:6543/postgres
```

**Security:**
- Enable Row Level Security (RLS) on all tables
- Create service account for migrations
- Use connection pooler for serverless
- Enable database backups

### 1.2 Stripe Configuration

```bash
# Go to https://dashboard.stripe.com

# API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[key]
STRIPE_SECRET_KEY=sk_live_[key]

# Webhook Setup
# Endpoint: https://upshiftlearning.org/api/stripe/webhooks
# Events: checkout.session.completed, customer.subscription.updated, customer.subscription.deleted
STRIPE_WEBHOOK_SECRET=whsec_[secret]
```

**Testing:**
```bash
# Use Stripe test mode first
stripe listen --forward-to localhost:3000/api/stripe/webhooks
stripe trigger payment_intent.succeeded
```

### 1.3 Claude API

```bash
# Get key from https://console.anthropic.com
ANTHROPIC_API_KEY=sk_[key]

# Verify access
curl https://api.anthropic.com/v1/models \
  -H "x-api-key: $ANTHROPIC_API_KEY"
```

### 1.4 Google Sheets & Substack

**Google Sheets:**
```bash
# Create service account in Google Cloud Console
# Share spreadsheet with service account email
GOOGLE_SHEETS_ID=1dVlowQJxditueoFpI42NOnZrlJ1sArKPRqfPQwFAqrc
GOOGLE_SERVICE_ACCOUNT_KEY=/path/to/service-account.json
```

**Substack:**
```bash
# Configure webhook in Substack settings
# Endpoint: https://upshiftlearning.org/api/webhooks/substack
SUBSTACK_WEBHOOK_SECRET=whsec_[from substack]
```

---

## Step 2: GitHub Secrets Configuration

```bash
# In GitHub repository settings > Secrets and variables > Actions
# Add production secrets:

VERCEL_ORG_ID=                    # From Vercel
VERCEL_PROJECT_ID_STAGING=        # Staging project
VERCEL_PROJECT_ID_PROD=           # Production project
VERCEL_TOKEN=                     # Personal access token

NEXT_PUBLIC_SUPABASE_URL=         # https://[id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=    # Public anon key
SUPABASE_SERVICE_ROLE_KEY=        # Service role (secret!)
DATABASE_URL_PROD=                # postgresql://...

NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_[key]
STRIPE_SECRET_KEY=                # sk_live_[key] - SECRET!
STRIPE_WEBHOOK_SECRET=            # whsec_[secret] - SECRET!

ANTHROPIC_API_KEY=                # sk_[key] - SECRET!
SUBSTACK_WEBHOOK_SECRET=          # SECRET!

SENTRY_AUTH_TOKEN=                # For error tracking
SENTRY_DSN=                       # Sentry project DSN

SLACK_WEBHOOK_URL=                # For notifications
```

**⚠️ Security:**
- Use GitHub's encryption for all secrets
- Rotate sensitive keys quarterly
- Use service-specific tokens (not personal)
- Enable environment protection rules

---

## Step 3: Environment Variables

### Create `.env.local` (development)
```bash
cp .env.production.example .env.local

# Update with development values
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[key]
NODE_ENV=development
```

### Vercel Environment Configuration

**In Vercel Dashboard:**
1. Project Settings → Environment Variables
2. Add all variables from `.env.production.example`
3. Set availability:
   - **Preview:** All except sensitive keys
   - **Production:** Full set
   - **Development:** None needed (use local)

---

## Step 4: Database Migrations

### Initial Setup

```bash
# Run migration script
bun run migrate:prod

# Output should show:
# ✅ Resources table created
# ✅ Standards table created
# ✅ Indices created
# ✅ Initial standards seeded
```

### Backup Before Migration

```bash
# Supabase Dashboard → Database → Backups
# Create manual backup before running migrations

# Or via CLI:
supabase db pull --secure  # Download schema
```

### Verify Database

```bash
# Connect to database
psql $DATABASE_URL

# Check tables
\dt

# Check record counts
SELECT count(*) FROM resources;
SELECT count(*) FROM standards;
```

---

## Step 5: Deploy to Staging

### Manual Staging Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to staging
vercel --prod --env preview

# Visit: https://staging-upshift.vercel.app
```

### Run Smoke Tests

```bash
# Test core functionality
npx playwright test --grep "@smoke"

# Check specific endpoints
curl https://staging-upshift.vercel.app/
curl https://staging-upshift.vercel.app/match
curl https://staging-upshift.vercel.app/resources
```

### Verify Integrations

```bash
# Test Stripe webhook
curl -X POST https://staging-upshift.vercel.app/api/stripe/webhooks \
  -H "Content-Type: application/json" \
  -H "stripe-signature: $(bun run generate-stripe-signature)" \
  -d '{"type":"checkout.session.completed",...}'

# Test Google Sheets sync
bun run sync:sheets --env staging

# Test Substack webhook
curl -X POST https://staging-upshift.vercel.app/api/webhooks/substack \
  -H "Content-Type: application/json" \
  -d '{"type":"post.published",...}'
```

---

## Step 6: Production Deployment

### Automated Deployment (Recommended)

```bash
# All deployments happen automatically via GitHub Actions
# 1. Push to main branch
# 2. Tests run automatically (.github/workflows/test.yml)
# 3. Staging deployment (.github/workflows/deploy.yml)
# 4. After staging smoke tests pass, production deploys
# 5. Automatic rollback if production tests fail
```

### Manual Production Deployment

```bash
# Only if CI/CD needs bypass
vercel --prod \
  --env NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL \
  --env NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_KEY

# Verify deployment
curl https://upshiftlearning.org/
```

---

## Step 7: Monitoring & Alerts

### Sentry Setup (Error Tracking)

```bash
# Create Sentry account at https://sentry.io

# Add to environment
SENTRY_DSN=https://[key]@sentry.io/[project-id]
SENTRY_AUTH_TOKEN=[token]

# Verify
curl https://sentry.io/api/0/organizations/[org]/releases/ \
  -H "Authorization: Bearer $SENTRY_AUTH_TOKEN"
```

**Configure:**
- Alert on new errors
- Slack integration for critical issues
- Source map upload for JavaScript errors

### Slack Notifications

```bash
# Create webhook at https://api.slack.com/apps

SLACK_WEBHOOK_URL=https://hooks.slack.com/services/[your-webhook]

# Test
curl -X POST $SLACK_WEBHOOK_URL \
  -H 'Content-Type: application/json' \
  -d '{"text":"✅ Deployment test successful"}'
```

### Application Monitoring

```bash
# Monitor key metrics
- Page load times
- API response times
- Error rates
- Resource usage
- Database queries
```

---

## Step 8: Post-Deployment

### Verification Checklist

- [ ] Site loads at https://upshiftlearning.org
- [ ] All pages accessible
- [ ] Stripe payments test
- [ ] Google Sheets sync works
- [ ] Substack webhook test
- [ ] Claude generation works
- [ ] Database queries responding
- [ ] No errors in Sentry
- [ ] All monitoring active

### Test User Flows

```bash
# 1. Signup flow
# 2. Stripe payment
# 3. Free trial
# 4. Lesson generation
# 5. Resource search
# 6. Standard detail page
```

### Notify Stakeholders

- [ ] Email product team
- [ ] Update status page
- [ ] Post release notes
- [ ] Monitor support channels

---

## Rollback Procedure

### Automatic Rollback

If production deployment fails:
```
1. Smoke tests fail
2. GitHub Actions automatically triggers rollback
3. Previous version restored
4. GitHub issue created for manual review
5. Slack notification sent
```

### Manual Rollback

```bash
# Via Vercel CLI
vercel rollback --prod

# Via Vercel Dashboard
# Deployments → [select previous] → Promote to Production
```

### Database Rollback

```bash
# If database migration failed
# Restore from backup in Supabase Dashboard

# Or manually:
psql $DATABASE_URL < backup.sql
```

---

## Disaster Recovery

### Data Backup Schedule

- **Daily:** Automatic Supabase backups
- **Weekly:** Manual backups to external storage
- **Monthly:** Full database export

### Backup Verification

```bash
# Weekly test restore
supabase db pull --secure
pg_restore -d test_db backup.dump
```

### Incident Response

**If production is down:**

1. **Immediate (0-5 min)**
   - Notify team via Slack
   - Check Sentry for errors
   - Check Vercel status

2. **Short-term (5-30 min)**
   - Review last deployment changes
   - Check database connectivity
   - Monitor error rates

3. **Recovery (30+ min)**
   - Rollback if necessary
   - Deploy hotfix if possible
   - Communicate status to users

---

## Maintenance & Updates

### Dependency Updates

```bash
# Weekly dependency checks
bun update

# Review outdated packages
bun outdated

# Update package.json
bun install --latest

# Run tests
npm run test
npm run test:e2e

# Create PR with changes
```

### Regular Maintenance

- **Daily:** Monitor logs and errors
- **Weekly:** Review uptime and performance
- **Monthly:** Update dependencies, review security
- **Quarterly:** Rotate API keys, review access logs

### Scheduled Maintenance Windows

```
Maintenance: Every 2nd Sunday 2-4 AM UTC
Status: https://status.upshiftlearning.org
```

---

## Performance Monitoring

### Key Metrics

```
Response Time: < 500ms
Error Rate: < 0.1%
Uptime: > 99.9%
Database Queries: < 100ms
```

### Tools

- **Uptime Monitoring:** Pingdom, StatusPage
- **Performance:** Vercel Analytics, Web Vitals
- **Error Tracking:** Sentry
- **Logs:** Vercel Logs, Supabase Logs

---

## Security Checklist

- [ ] HTTPS enabled
- [ ] Secrets encrypted
- [ ] RLS policies enabled
- [ ] API rate limiting configured
- [ ] CORS headers correct
- [ ] SQL injection prevented
- [ ] XSS protection enabled
- [ ] CSRF tokens validated
- [ ] Regular security audits
- [ ] Dependency vulnerability scans

---

## Troubleshooting

### Common Issues

**Build Fails**
```bash
# Clear cache and rebuild
vercel projects list
vercel env pull
bun run build
```

**Database Connection Error**
```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"

# Check pooler
psql $DATABASE_POOL_URL -c "SELECT 1"
```

**Stripe Webhooks Not Received**
```bash
# Check endpoint in Stripe Dashboard
# Verify signature secret matches
# Check firewall/CORS settings
stripe logs list
```

**Claude API Errors**
```bash
# Check API key format
# Verify rate limits
# Check request format
curl https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY"
```

---

## Support & Resources

- **Vercel Docs:** https://vercel.com/docs
- **Supabase Docs:** https://supabase.com/docs
- **Stripe Docs:** https://stripe.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **GitHub Actions:** https://docs.github.com/en/actions

---

**Last Updated:** July 30, 2026  
**Status:** Production Ready ✅
