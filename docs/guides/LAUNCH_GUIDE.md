# Upshift Learning Hub - Launch Guide

Complete step-by-step guide to deploy your application to production.

---

## Quick Start (30 minutes)

### Prerequisites

Before launching, ensure you have:
- ✅ GitHub account (repo already set up)
- ✅ Vercel account (free or pro)
- ✅ Supabase project created
- ✅ Domain name (optional but recommended)
- ✅ All API keys collected

### Step 1: Prepare Your Environment (5 minutes)

**Collect all required environment variables:**

```bash
# Create .env.production file
cat > .env.production << 'EOF'
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/postgres
NEXT_PUBLIC_SUPABASE_URL=https://[project].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[anon-key]
SUPABASE_SERVICE_ROLE_KEY=[service-role-key]

# Authentication
NEXTAUTH_SECRET=[generate-with: openssl rand -base64 32]
NEXTAUTH_URL=https://yourdomain.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[publishable-key]
STRIPE_SECRET_KEY=[secret-key]
STRIPE_WEBHOOK_SECRET=[webhook-secret]

# Claude AI
ANTHROPIC_API_KEY=[api-key]

# Google Sheets
GOOGLE_SHEETS_ID=1dVlowQJxditueoFpI42NOnZrlJ1sArKPRqfPQwFAqrc
GOOGLE_SERVICE_ACCOUNT_EMAIL=[email]
GOOGLE_SERVICE_ACCOUNT_KEY=[base64-encoded-key]

# Substack
SUBSTACK_WEBHOOK_SECRET=[webhook-secret]

# Monitoring
SENTRY_DSN=[sentry-dsn]
NEXT_PUBLIC_DATADOG_APPLICATION_ID=[app-id]
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=[client-token]
NEWRELIC_LICENSE_KEY=[license-key]

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_MONITORING=true
EOF
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
# Output: [32-character secret]
```

### Step 2: Deploy to Vercel (10 minutes)

#### Option A: Deploy from GitHub (Easiest)

1. **Connect Vercel to GitHub:**
   ```
   1. Go to https://vercel.com/import
   2. Click "From Git Repository"
   3. Select your GitHub repo
   4. Click "Import"
   ```

2. **Configure Environment:**
   ```
   1. Go to Vercel Dashboard → Your Project
   2. Settings → Environment Variables
   3. Paste all variables from .env.production
   4. Make sure to add for: Production only
   ```

3. **Deploy:**
   ```
   1. Vercel automatically deploys from main branch
   2. Wait for build to complete (5-10 minutes)
   3. Check: https://[project].vercel.app
   ```

#### Option B: Deploy from CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Follow prompts:
# - Set project name: upshift-learning-hub
# - Set directory: ./
# - Include source maps: No
```

### Step 3: Set Up Database (5 minutes)

**If you haven't already:**

1. **Create Supabase Project:**
   ```
   1. Go to https://supabase.com
   2. Create new project
   3. Wait for database to initialize
   4. Copy connection details to .env
   ```

2. **Run Migrations:**
   ```bash
   # From your local machine
   npm run migrate:prod
   
   # Or from Vercel dashboard:
   vercel env pull  # Download env vars
   npm run migrate:prod
   ```

3. **Seed Initial Data:**
   ```bash
   npm run seed:prod
   ```

### Step 4: Configure Domain (5 minutes) - Optional

**If you have a custom domain:**

```
1. Go to Vercel Dashboard → Settings → Domains
2. Enter your domain: upshiftlearning.org
3. Update your DNS provider with Vercel's nameservers
4. Wait for DNS propagation (5-10 minutes)
5. Enable automatic HTTPS (automatic)
```

**If using Vercel subdomain:**
- Your app is automatically available at: `[project].vercel.app`
- HTTPS enabled automatically ✓

### Step 5: Health Check (5 minutes)

**Verify everything is working:**

```bash
# Check application loads
curl https://upshiftlearning.org
# Should return: HTML page

# Check API endpoint
curl https://upshiftlearning.org/api/health
# Should return: {"status": "healthy"}

# Check database
curl https://upshiftlearning.org/api/metrics
# Should return: metrics data

# Check monitoring
curl https://upshiftlearning.org/admin/dashboards/metrics
# Should show: live metrics
```

**Manual Testing:**
1. Open https://upshiftlearning.org in browser
2. Homepage loads ✓
3. Search works ✓
4. Can view standard details ✓
5. Stripe test checkout works ✓

---

## Detailed Deployment Steps

### Part 1: Pre-Launch Checklist

**Code & Tests**
- [ ] All tests passing: `npm run test`
- [ ] E2E tests passing: `npm run test:e2e`
- [ ] Type checking passes: `npm run type-check`
- [ ] Build succeeds locally: `npm run build`
- [ ] No console errors or warnings
- [ ] Git repo clean: `git status`

**Configuration**
- [ ] All environment variables set
- [ ] Database migrations prepared
- [ ] API keys for all services ready
- [ ] Webhooks configured for:
  - [ ] Stripe
  - [ ] Substack
  - [ ] GitHub (optional)

**Data**
- [ ] Database backed up
- [ ] Initial resources seeded
- [ ] Standards data loaded
- [ ] Sample users created for testing

**Monitoring**
- [ ] Sentry project created
- [ ] Datadog account ready
- [ ] New Relic license key obtained
- [ ] Slack integration configured
- [ ] Email alerts set up

### Part 2: Vercel Setup

#### 1. Create Vercel Project

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Initialize project
vercel --prod --name=upshift-learning-hub
```

**Or via web dashboard:**
```
1. Visit https://vercel.com/new
2. Import your GitHub repository
3. Select project root directory: ./
4. Framework: Next.js
5. Build command: npm run build
6. Install command: npm ci
7. Output directory: .next
```

#### 2. Configure Environment Variables

**Via Vercel Dashboard:**

```
Settings → Environment Variables

Add for Production:
- DATABASE_URL
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXTAUTH_SECRET
- NEXTAUTH_URL
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- ANTHROPIC_API_KEY
- GOOGLE_SHEETS_ID
- GOOGLE_SERVICE_ACCOUNT_EMAIL
- GOOGLE_SERVICE_ACCOUNT_KEY
- SUBSTACK_WEBHOOK_SECRET
- SENTRY_DSN
- NEXT_PUBLIC_DATADOG_APPLICATION_ID
- NEXT_PUBLIC_DATADOG_CLIENT_TOKEN
- NEWRELIC_LICENSE_KEY
```

**Or via CLI:**

```bash
# Create .env.production.local
vercel env pull .env.production.local

# Edit to add your variables
# Then push to Vercel
vercel env push
```

#### 3. Configure Build Settings

```
Settings → Build & Development Settings

Build Command: npm run build
Install Command: npm ci
Output Directory: .next

Functions:
- Memory: 3008 MB (increase for large requests)
- Timeout: 60 seconds (increase for long-running functions)

Web Analytics: Enabled
Speed Insights: Enabled
```

### Part 3: Database Setup

#### 1. Create Supabase Project

```
1. Go to https://supabase.com/dashboard
2. Create new organization
3. Create new project
   - Name: upshift-learning-hub
   - Database password: [strong-password]
   - Region: us-west-2 (or closest to users)
4. Wait for initialization (2-5 minutes)
```

#### 2. Get Connection Details

```
1. Go to Project Settings → Database
2. Copy:
   - Hostname: db.[random].supabase.co
   - Port: 5432
   - Database: postgres
   - User: postgres
   - Password: [your-password]

3. Copy:
   - Direct URL: postgresql://...
   - Transaction Pooler URL: postgresql://...pgbouncer.supabase.co
   
4. Use Pooler URL for serverless (Vercel functions)
```

#### 3. Run Migrations

```bash
# Set local database URL
export DATABASE_URL="postgresql://postgres:[password]@db.[random].supabase.co:5432/postgres"

# Or use Supabase connection string
export DATABASE_URL="[supabase-direct-url]"

# Run migrations
npm run migrate:prod

# Verify tables created
psql $DATABASE_URL -c "\dt"
# Should list: resources, standards, users, subscriptions, etc.
```

#### 4. Seed Initial Data

```bash
# Seed standards (teaching standards)
npm run seed:standards

# Seed sample resources
npm run seed:resources

# Verify data
npm run seed:verify
```

### Part 4: API Keys & Services

#### Stripe Setup

```
1. Go to https://stripe.com/dashboard
2. Activate account if needed
3. Copy keys:
   - Publishable Key (starts with pk_live_)
   - Secret Key (starts with sk_live_)

4. Create Webhook Endpoint:
   - URL: https://upshiftlearning.org/api/stripe/webhooks
   - Events: 
     * checkout.session.completed
     * customer.subscription.updated
     * customer.subscription.deleted

5. Copy Webhook Secret (starts with whsec_)

6. Add to Vercel environment variables
```

#### Claude API Setup

```
1. Go to https://console.anthropic.com
2. Create API key
3. Set spending limit (optional but recommended)
   - Start with $50/month during launch
   - Can increase after launch
4. Add ANTHROPIC_API_KEY to Vercel
```

#### Google Sheets Setup

```
1. Create service account:
   - Go to Google Cloud Console
   - Create new project: "Upshift Learning"
   - Enable Google Sheets API
   - Create Service Account
   - Create JSON key

2. Download JSON key and encode:
   cat [service-account-key].json | base64 -w 0

3. Add to Vercel:
   - GOOGLE_SERVICE_ACCOUNT_EMAIL: [email-from-json]
   - GOOGLE_SERVICE_ACCOUNT_KEY: [base64-encoded-key]

4. Share Google Sheet with service account email
```

#### Sentry Setup

```
1. Go to https://sentry.io
2. Create organization or sign in
3. Create new project:
   - Platform: Next.js
   - Alert Settings: Default
   
4. Copy DSN (starts with https://...@sentry.io/...)

5. Add SENTRY_DSN to Vercel

6. Configure alerts:
   - Settings → Alerts
   - Create alert for:
     * Error rate > 1%
     * New issue
     * Critical errors
```

### Part 5: Domain Setup

#### Using Custom Domain

```
1. Register domain (e.g., upshiftlearning.org)
   - GoDaddy, Namecheap, Route53, etc.

2. In Vercel Dashboard:
   - Settings → Domains
   - Add domain: upshiftlearning.org
   - Also add: www.upshiftlearning.org

3. Vercel shows nameservers:
   - ns1.vercel-dns.com
   - ns2.vercel-dns.com
   
4. Update DNS provider:
   - Go to domain registrar
   - Update nameservers to Vercel's
   - Save changes

5. Wait for DNS propagation (5-10 minutes)

6. Verify: dig upshiftlearning.org
   Should show Vercel's IP addresses
```

#### Using Vercel Domain

```
1. Vercel assigns subdomain: upshift-learning-hub.vercel.app
2. SSL certificate automatic
3. No additional setup needed
4. Works immediately after deployment
```

### Part 6: Post-Deployment Verification

#### Website Checks

```bash
# 1. Load homepage
curl -I https://upshiftlearning.org
# Expected: 200 OK

# 2. Check SSL certificate
openssl s_client -connect upshiftlearning.org:443
# Expected: certificate valid

# 3. Test API
curl https://upshiftlearning.org/api/health
# Expected: {"status":"healthy"}

# 4. Check performance
curl -w "@curl-format.txt" -o /dev/null -s https://upshiftlearning.org
# Expected: response time < 2s
```

#### Functional Tests

```
1. Open https://upshiftlearning.org
2. Test flows:
   ✓ Homepage loads
   ✓ Search standards works
   ✓ View standard details
   ✓ View resources
   ✓ Try lesson generation
   ✓ View pricing
   ✓ Sign up (test user)
   ✓ Try test payment in Stripe test mode

3. Check browser console:
   ✓ No red errors
   ✓ No 404s
   ✓ Analytics firing
   ✓ Sentry initializing
```

#### Monitoring Checks

```bash
# 1. Sentry
   - Go to https://sentry.io
   - Project should show 0 issues (initially)
   - Events should start appearing

# 2. Datadog
   - Go to https://app.datadoghq.com
   - Infrastructure should show healthy
   - Metrics streaming in

# 3. New Relic
   - Go to https://one.newrelic.com
   - Application showing transactions
   - No errors detected

# 4. Vercel
   - Go to Vercel dashboard
   - Deployments section shows green checkmark
   - Logs show: "ready - started server on 0.0.0.0:3000"
   - Function executions showing
```

### Part 7: Launch Announcement

**Send launch email to stakeholders:**

```
Subject: 🚀 Upshift Learning Hub is Live!

Hi Team,

The Upshift Learning Hub is now live at: https://upshiftlearning.org

✅ What's Available:
- 150+ teaching standards searchable
- 2,688+ educational resources
- AI-powered lesson generation (4 formats)
- Real-time resource syncing
- Payment processing ready

🔗 Key Links:
- Homepage: https://upshiftlearning.org
- Admin Metrics: https://upshiftlearning.org/admin/dashboards/metrics
- Status Page: https://upshiftlearning.org/status

📊 Monitoring:
- Sentry: https://sentry.io
- Datadog: https://app.datadoghq.com
- New Relic: https://one.newrelic.com

🐛 Report Issues:
- Create GitHub issue: [repo-url]
- Or email: support@upshiftlearning.org

Thank you!
```

**Social Media Announcement (Optional):**

```
🎓 Exciting news! Upshift Learning Hub is now live!

Teachers can now:
✨ Search 150+ teaching standards
📚 Browse 2,688+ educational resources
🤖 Generate lesson plans with AI in 4 formats
💰 Affordable subscription options

Launch: https://upshiftlearning.org
#EdTech #Teachers #LessonPlanning
```

---

## Troubleshooting Common Issues

### Build Fails

```
Error: Cannot find module '@/lib/db'

Solution:
1. Check imports use @ alias
2. Verify vercel.json includes path mapping
3. Check tsconfig.json has compilerOptions.paths
4. Rebuild locally: npm run build
```

### Database Connection Fails

```
Error: connect ECONNREFUSED 127.0.0.1:5432

Solution:
1. Verify DATABASE_URL is set in Vercel
2. Use transaction pooler URL (not direct URL)
3. Check IP whitelist in Supabase:
   - Project Settings → Database → Allowed connections
   - Add Vercel IPs to whitelist
4. Test locally with: psql $DATABASE_URL
```

### Environment Variables Not Available

```
Error: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is undefined

Solution:
1. Restart Vercel deployment after adding vars
2. Ensure NEXT_PUBLIC_ prefix for client vars
3. Check Environment Variables tab in Vercel
4. Redeploy: git push (or vercel --prod)
```

### Stripe Webhooks Not Working

```
Error: Webhook signature verification failed

Solution:
1. Verify webhook endpoint in Vercel logs
2. Check STRIPE_WEBHOOK_SECRET is set correctly
3. Verify webhook URL in Stripe dashboard:
   https://[your-domain]/api/stripe/webhooks
4. Test webhook from Stripe dashboard → Webhooks
```

### Slow Performance

```
Issue: Website loading slowly

Solution:
1. Check Vercel function execution time
2. Optimize database queries:
   - Add indices to frequently queried columns
   - Use EXPLAIN ANALYZE
3. Enable caching:
   - Static pages with revalidate
   - API responses with Cache-Control
4. Check Datadog for bottlenecks
```

---

## Monitoring After Launch

### First 24 Hours

- [ ] Monitor error rate (should be < 0.1%)
- [ ] Check response times (should be < 500ms P95)
- [ ] Verify all integrations working
- [ ] Monitor database performance
- [ ] Check payment processing

### First Week

- [ ] Daily metrics review
- [ ] Performance optimization if needed
- [ ] User feedback collection
- [ ] Bug fixes and minor improvements
- [ ] Cost monitoring

### Ongoing

- [ ] Daily alerting on critical metrics
- [ ] Weekly cost reports
- [ ] Monthly performance review
- [ ] Quarterly architecture review
- [ ] Continuous optimization

---

## Support Resources

**Documentation:**
- DEPLOYMENT_GUIDE.md - Detailed setup
- DEPLOYMENT_PLAYBOOK.md - Operations procedures
- DASHBOARDS_GUIDE.md - Monitoring setup
- MONITORING_SETUP.md - Observability

**External Resources:**
- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Stripe Docs: https://stripe.com/docs
- Anthropic Docs: https://docs.anthropic.com

**Emergency Contacts:**
- Vercel Support: https://vercel.com/support
- Supabase Support: support@supabase.io
- Stripe Support: https://support.stripe.com
- Anthropic: support@anthropic.com

---

**Status:** 🚀 Ready to Launch

Your Upshift Learning Hub is production-ready. Follow this guide and you'll be live in under an hour!

For questions or issues, refer to DEPLOYMENT_PLAYBOOK.md for detailed procedures.

Good luck! 🎉
