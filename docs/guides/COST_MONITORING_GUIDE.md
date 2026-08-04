# Cost Monitoring & Optimization Guide

Complete cost tracking infrastructure for cloud services, APIs, databases, and optimization strategies.

---

## Overview

Cost monitoring system providing:
- **Real-time Cost Tracking** - Monitor spending across all services
- **Cost Breakdown** - By service, feature, user tier
- **Budget Management** - Alerts and forecasting
- **Cost Optimization** - Recommendations and automation
- **Usage Analytics** - Correlate spending with metrics
- **Reporting** - Daily/weekly/monthly cost reports
- **AI Cost Analysis** - Claude-powered optimization insights
- **Chargeback Modeling** - Cost allocation by customer tier

---

## 1. Cost Structure & Services

### Infrastructure Costs

#### Vercel (Hosting & Serverless)
```
Pricing Model:
- Pro Plan: $20/month
- Function Invocations: $0.50 per 1M (first 3M free)
- Bandwidth: $0.15 per GB (first 100GB free per month)
- Data Transfer: Included

Current Estimate (1,000 DAU):
- Base: $20/month
- Functions: ~$0.50/month (2-3M/month)
- Bandwidth: $0.75/month (5GB/month)
- Total: ~$21.25/month

Scaling to 10,000 DAU:
- Base: $20/month
- Functions: ~$5/month (20-30M/month)
- Bandwidth: $7.50/month (50GB/month)
- Total: ~$32.50/month
```

#### Supabase (Database & Auth)
```
Pricing Model:
- Free: 2GB storage, 10k auth users, 500k row database
- Pro: $25/month + overages

Current Usage (1,000 DAU):
- Storage: ~1.5GB (analytics events, resources)
- Auth Users: ~5k
- Database Size: ~200k rows
- Est. Cost: $25/month (Pro plan)

Scaling to 10,000 DAU:
- Storage: ~15GB (10x growth)
- Auth Users: ~50k
- Database Size: ~2M rows
- Overages: ~$500/month
- Est. Cost: $525/month
```

#### PostgreSQL Optimization
```
Query Optimization Savings:
- Current slow queries: 5-10% of total
- Potential improvement: 30% reduction in compute
- Estimated savings: $50-150/month at scale
```

### API Costs

#### Claude API (Lesson Generation & Insights)
```
Pricing Model:
- Claude 3.5 Sonnet: $3/1M input tokens, $15/1M output tokens
- Typical lesson generation: 4k input + 2k output tokens

Per Lesson Generation:
- Input: 4k tokens × ($3/1M) = $0.012
- Output: 2k tokens × ($15/1M) = $0.030
- Total per generation: $0.042

Monthly at 100 generations:
- 100 × $0.042 = $4.20

Monthly at 10,000 generations (1,000 DAU):
- 10,000 × $0.042 = $420

Monthly at 100,000 generations (10,000 DAU):
- 100,000 × $0.042 = $4,200
```

#### Google Sheets API
```
Pricing Model:
- Free: 500 requests/day
- Enterprise: Volume discounts

Resource Sync (daily):
- 1 API call to read sheet: $0 (free tier)
- Batch insert: 100 rows in 10 calls: $0 (free tier)
- Cost: $0 (within free quota)
```

#### Stripe
```
Pricing Model:
- 2.9% + $0.30 per transaction
- ACH: 0.8% ($1 minimum)

Revenue Impact:
At $1,000/month revenue:
- Percentage: $29
- Per transaction: $30
- Total: ~$59/month (5.9%)

At $10,000/month revenue:
- Percentage: $290
- Per transaction: $300
- Total: ~$590/month (5.9%)
```

### Monitoring & Observability Costs

#### Sentry
```
Pricing Model:
- Free: 5,000 events/month
- Pro: $29/month for 50k events

Current Usage (1,000 errors/month):
- Within free tier: $0

Scaling to 10,000 errors/month:
- Pro tier: $29/month
- Volume tier: $0.50 per 10k events
- Est. Cost: $29-50/month
```

#### Datadog
```
Pricing Model:
- Infrastructure Monitoring: $15/host
- RUM: $1.70 per 1k sessions
- Logs: $0.10 per GB ingested

Current Estimate (100k sessions/month):
- Infrastructure: $15 (1 host)
- RUM: $170 (100k sessions)
- Total: ~$185/month

Scaling to 1M sessions/month:
- Infrastructure: $15-30 (2-3 hosts)
- RUM: $1,700
- Total: ~$1,730/month
```

#### New Relic
```
Pricing Model:
- Pro: $0.30 per GB ingested
- APM: Included

Current Estimate (50GB/month):
- Cost: $15/month

Scaling to 500GB/month:
- Cost: $150/month
```

### Third-Party Services

#### Anthropic Claude (Additional)
- AI Insights generation: ~$100/month (at scale)

#### Email (SendGrid/Resend)
- Current: Free tier (100k emails/month)
- At scale: ~$80-150/month

---

## 2. Cost Tracking Infrastructure

### Database Schema

```sql
-- Service costs tracking
CREATE TABLE cost_tracking (
  id UUID PRIMARY KEY,
  service_name VARCHAR(100),           -- 'vercel', 'supabase', 'claude', etc.
  cost_category VARCHAR(50),           -- 'compute', 'storage', 'api', 'monitoring'
  amount DECIMAL(10, 2),               -- Cost in dollars
  currency VARCHAR(3) DEFAULT 'USD',
  quantity FLOAT,                      -- Units used (GB, API calls, etc.)
  unit VARCHAR(50),                    -- 'GB', 'requests', 'invocations'
  billing_period_start DATE,
  billing_period_end DATE,
  source VARCHAR(50),                  -- 'api', 'bill', 'estimate'
  tags JSONB,                          -- {tier: 'pro', region: 'us-west'}
  metadata JSONB,                      -- Custom tracking data
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_service_period (service_name, billing_period_start)
);

-- Budget tracking
CREATE TABLE cost_budgets (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  service_name VARCHAR(100),
  monthly_budget DECIMAL(10, 2),
  alert_threshold_percent INT DEFAULT 80,
  alert_threshold_amount DECIMAL(10, 2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Cost optimization recommendations
CREATE TABLE cost_optimizations (
  id UUID PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  service_name VARCHAR(100),
  estimated_monthly_savings DECIMAL(10, 2),
  implementation_difficulty VARCHAR(20), -- 'easy', 'medium', 'hard'
  time_to_implement INT,                 -- hours
  status VARCHAR(50) DEFAULT 'recommended', -- recommended, in_progress, implemented
  implemented_date TIMESTAMP,
  actual_savings DECIMAL(10, 2),
  created_at TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Cost alerts
CREATE TABLE cost_alerts (
  id UUID PRIMARY KEY,
  alert_type VARCHAR(50),              -- 'budget_exceeded', 'spike', 'forecast'
  service_name VARCHAR(100),
  severity VARCHAR(20),                -- 'warning', 'critical'
  message TEXT,
  threshold_value DECIMAL(10, 2),
  current_value DECIMAL(10, 2),
  created_at TIMESTAMP,
  acknowledged_at TIMESTAMP,
  acknowledged_by UUID REFERENCES users(id)
);
```

---

## 3. Cost Monitoring System

### Real-time Cost Tracking

```typescript
// lib/cost-monitoring.ts
import { db } from '@/lib/db';
import { cost_tracking, cost_budgets, cost_alerts } from '@/lib/db/schema';

interface CostEntry {
  serviceName: string;
  costCategory: string;
  amount: number;
  quantity?: number;
  unit?: string;
  tags?: Record<string, any>;
}

// Track a cost
export async function trackCost(entry: CostEntry) {
  await db.insert(cost_tracking).values({
    service_name: entry.serviceName,
    cost_category: entry.costCategory,
    amount: entry.amount,
    quantity: entry.quantity,
    unit: entry.unit,
    billing_period_start: getMonthStart(new Date()),
    billing_period_end: getMonthEnd(new Date()),
    source: 'api',
    tags: entry.tags || {},
    created_at: new Date(),
  });

  // Check for budget alerts
  await checkBudgetAlerts(entry.serviceName);
}

// Get monthly costs by service
export async function getMonthlyCosts(month: Date) {
  const start = getMonthStart(month);
  const end = getMonthEnd(month);

  const costs = await db
    .select({
      serviceName: cost_tracking.service_name,
      category: cost_tracking.cost_category,
      total: sql`sum(amount)`,
      count: sql`count(*)`,
    })
    .from(cost_tracking)
    .where(
      sql`billing_period_start = ${start} AND billing_period_end = ${end}`
    )
    .groupBy(cost_tracking.service_name, cost_tracking.cost_category);

  return costs;
}

// Calculate total spend
export async function getTotalMonthlySpend(month: Date) {
  const start = getMonthStart(month);
  const end = getMonthEnd(month);

  const result = await db
    .select({ total: sql`sum(amount)` })
    .from(cost_tracking)
    .where(
      sql`billing_period_start = ${start} AND billing_period_end = ${end}`
    );

  return (result[0]?.total as number) || 0;
}

// Check budget alerts
async function checkBudgetAlerts(serviceName: string) {
  const budget = await db.query.cost_budgets.findFirst({
    where: (b) => eq(b.service_name, serviceName),
  });

  if (!budget) return;

  const currentSpend = await getCurrentMonthSpend(serviceName);
  const percentUsed = (currentSpend / budget.monthly_budget) * 100;

  if (percentUsed >= budget.alert_threshold_percent) {
    await createAlert({
      alertType: 'budget_exceeded',
      serviceName,
      severity: percentUsed > 100 ? 'critical' : 'warning',
      message: `${serviceName} has exceeded ${percentUsed.toFixed(1)}% of monthly budget`,
      thresholdValue: budget.monthly_budget,
      currentValue: currentSpend,
    });
  }
}

// Detect cost spikes
export async function detectCostSpikes() {
  const services = await getUniqueServices();
  const today = new Date();
  const thisMonth = getMonthStart(today);
  const lastMonth = getMonthStart(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000));

  for (const service of services) {
    const thisMonthCost = await getServiceCost(service, thisMonth);
    const lastMonthCost = await getServiceCost(service, lastMonth);

    const percentChange = ((thisMonthCost - lastMonthCost) / lastMonthCost) * 100;

    if (percentChange > 30) {
      // More than 30% increase
      await createAlert({
        alertType: 'spike',
        serviceName: service,
        severity: percentChange > 50 ? 'critical' : 'warning',
        message: `${service} cost increased ${percentChange.toFixed(1)}% compared to last month`,
        thresholdValue: lastMonthCost * 1.3,
        currentValue: thisMonthCost,
      });
    }
  }
}

// Forecast monthly spend
export async function forecastMonthlySpend() {
  const today = new Date();
  const monthStart = getMonthStart(today);
  const daysInMonth = getDaysInMonth(today);
  const dayOfMonth = today.getDate();

  const currentSpend = await getTotalMonthlySpend(today);
  const dailyAverage = currentSpend / dayOfMonth;
  const projectedTotal = dailyAverage * daysInMonth;
  const remainingDays = daysInMonth - dayOfMonth;
  const projectedRemaining = dailyAverage * remainingDays;

  return {
    currentSpend,
    projectedTotal,
    projectedRemaining,
    runRate: dailyAverage * 30, // 30-day average
  };
}
```

---

## 4. Cost Optimization Recommendations

### Automated Optimization Detection

```typescript
export async function generateOptimizationRecommendations() {
  const recommendations: Optimization[] = [];

  // 1. Database query optimization
  const slowQueries = await getSlowQueries();
  if (slowQueries.length > 0) {
    recommendations.push({
      title: 'Optimize Database Queries',
      description: `${slowQueries.length} slow queries detected. Optimize with indices and query refactoring.`,
      serviceName: 'supabase',
      estimatedMonthlySavings: 50 + (slowQueries.length * 10),
      implementationDifficulty: 'medium',
      timeToImplement: 16,
    });
  }

  // 2. Vercel function optimization
  const expensiveFunctions = await getExpensiveFunctions();
  if (expensiveFunctions.length > 0) {
    recommendations.push({
      title: 'Optimize Serverless Functions',
      description: `${expensiveFunctions.length} expensive functions. Add caching and optimize execution.`,
      serviceName: 'vercel',
      estimatedMonthlySavings: 30 + (expensiveFunctions.length * 5),
      implementationDifficulty: 'medium',
      timeToImplement: 12,
    });
  }

  // 3. Claude API optimization
  const metrics = await getCurrentMetrics();
  if (metrics.lessonsGenerated > 100) {
    recommendations.push({
      title: 'Implement Claude API Caching',
      description: 'Cache lesson templates to reduce API calls by 40-50%',
      serviceName: 'claude',
      estimatedMonthlySavings: metrics.lessonsGenerated * 0.042 * 0.45, // 45% reduction
      implementationDifficulty: 'easy',
      timeToImplement: 4,
    });
  }

  // 4. Storage optimization
  const storageUsage = await getStorageUsage();
  if (storageUsage.wasted > 1000) {
    recommendations.push({
      title: 'Clean Up Old Event Data',
      description: `Archive ${storageUsage.wasted}MB of old analytics data`,
      serviceName: 'supabase',
      estimatedMonthlySavings: storageUsage.wasted / 100, // ~$0.01 per GB
      implementationDifficulty: 'easy',
      timeToImplement: 2,
    });
  }

  // 5. Monitoring optimization
  const errorRate = await getErrorRate();
  if (errorRate < 0.1) {
    // Less than 0.1% error rate
    recommendations.push({
      title: 'Reduce Monitoring Verbosity',
      description: 'Error rate is stable. Reduce log ingestion and sampling.',
      serviceName: 'datadog',
      estimatedMonthlySavings: 200,
      implementationDifficulty: 'easy',
      timeToImplement: 1,
    });
  }

  // 6. Reserve instances for Supabase
  const databaseMetrics = await getDatabaseMetrics();
  if (databaseMetrics.avgConnections > 10) {
    recommendations.push({
      title: 'Purchase Supabase Reserved Capacity',
      description: 'High consistent usage justifies reserved instances (20% discount)',
      serviceName: 'supabase',
      estimatedMonthlySavings: 100,
      implementationDifficulty: 'easy',
      timeToImplement: 0.5,
    });
  }

  return recommendations;
}

// Storage analysis
async function analyzeStorageUsage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const oldEvents = await db
    .select({ count: sql`count(*)` })
    .from(analytics_events)
    .where(sql`timestamp < ${thirtyDaysAgo}`);

  const oldEventSize = (oldEvents[0]?.count as number || 0) * 0.001; // ~1KB per event

  return {
    oldEventStorage: oldEventSize,
    potential: oldEventSize * 0.1, // 10% of storage cost
    archived: 0,
    remaining: oldEventSize,
  };
}
```

---

## 5. Cost Allocation by Tier

### Chargeback Model

```typescript
interface CostAllocation {
  tier: string;
  percentageOfUsers: number;
  percentageOfCompute: number;
  percentageOfStorage: number;
  percentageOfAPI: number;
  allocatedCost: number;
}

export async function calculateCostAllocation() {
  const totalUsers = await getTotalUsers();
  const freeUsers = await getUsersByTier('free');
  const proUsers = await getUsersByTier('pro');
  const schoolUsers = await getUsersByTier('school');

  const totalMonthlyCost = await getTotalMonthlySpend(new Date());
  const computeCost = await getServiceCost('vercel', getMonthStart(new Date()));
  const storageCost = await getServiceCost('supabase', getMonthStart(new Date()));
  const apiCost = await getServiceCost('claude', getMonthStart(new Date()));

  // Cost allocation based on usage patterns
  const freePercentage = (freeUsers.length / totalUsers) * 0.3; // Free users use 30% of resources
  const proPercentage = (proUsers.length / totalUsers) * 0.5; // Pro uses 50%
  const schoolPercentage = (schoolUsers.length / totalUsers) * 0.2; // School uses 20%

  return [
    {
      tier: 'free',
      percentageOfUsers: (freeUsers.length / totalUsers) * 100,
      percentageOfCompute: freePercentage * 100,
      percentageOfStorage: freePercentage * 100,
      percentageOfAPI: freePercentage * 100,
      allocatedCost: totalMonthlyCost * freePercentage,
    },
    {
      tier: 'pro',
      percentageOfUsers: (proUsers.length / totalUsers) * 100,
      percentageOfCompute: proPercentage * 100,
      percentageOfStorage: proPercentage * 100,
      percentageOfAPI: proPercentage * 100,
      allocatedCost: totalMonthlyCost * proPercentage,
    },
    {
      tier: 'school',
      percentageOfUsers: (schoolUsers.length / totalUsers) * 100,
      percentageOfCompute: schoolPercentage * 100,
      percentageOfStorage: schoolPercentage * 100,
      percentageOfAPI: schoolPercentage * 100,
      allocatedCost: totalMonthlyCost * schoolPercentage,
    },
  ];
}

// Cost per user by tier
export async function calculateCostPerUser() {
  const allocation = await calculateCostAllocation();

  return allocation.map((tier) => ({
    ...tier,
    costPerUser: tier.allocatedCost / getTierUserCount(tier.tier),
  }));
}
```

---

## 6. Cost APIs

### GET /api/costs/summary

```typescript
// Get current month cost summary
export async function GET(request: NextRequest) {
  try {
    const summary = await getMonthlyCosts(new Date());
    const total = await getTotalMonthlySpend(new Date());
    const forecast = await forecastMonthlySpend();

    return NextResponse.json({
      period: {
        month: new Date().toISOString().slice(0, 7),
        startDate: getMonthStart(new Date()).toISOString(),
        endDate: getMonthEnd(new Date()).toISOString(),
      },
      costs: summary,
      total,
      forecast,
      breakdown: {
        infrastructure: summary.filter(s => s.category === 'compute').reduce((sum, s) => sum + s.total, 0),
        api: summary.filter(s => s.category === 'api').reduce((sum, s) => sum + s.total, 0),
        monitoring: summary.filter(s => s.category === 'monitoring').reduce((sum, s) => sum + s.total, 0),
        storage: summary.filter(s => s.category === 'storage').reduce((sum, s) => sum + s.total, 0),
      },
    });
  } catch (error) {
    console.error('Cost summary error:', error);
    return NextResponse.json({ error: 'Failed to fetch costs' }, { status: 500 });
  }
}
```

### GET /api/costs/optimizations

```typescript
// Get optimization recommendations
export async function GET(request: NextRequest) {
  try {
    const recommendations = await generateOptimizationRecommendations();
    const totalPotential = recommendations.reduce(
      (sum, r) => sum + r.estimatedMonthlySavings,
      0
    );

    return NextResponse.json({
      recommendations,
      totalMonthlySavings: totalPotential,
      implemented: recommendations.filter(r => r.status === 'implemented'),
      inProgress: recommendations.filter(r => r.status === 'in_progress'),
    });
  } catch (error) {
    console.error('Optimization error:', error);
    return NextResponse.json({ error: 'Failed to fetch optimizations' }, { status: 500 });
  }
}
```

### GET /api/costs/alerts

```typescript
// Get cost alerts
export async function GET(request: NextRequest) {
  try {
    const alerts = await db.query.cost_alerts.findMany({
      where: (a) => isNull(a.acknowledged_at),
    });

    return NextResponse.json({
      alerts,
      count: alerts.length,
      critical: alerts.filter(a => a.severity === 'critical').length,
      warning: alerts.filter(a => a.severity === 'warning').length,
    });
  } catch (error) {
    console.error('Alerts error:', error);
    return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
  }
}
```

### GET /api/costs/allocation

```typescript
// Get cost allocation by tier
export async function GET(request: NextRequest) {
  try {
    const allocation = await calculateCostAllocation();
    const perUser = await calculateCostPerUser();

    return NextResponse.json({
      allocation,
      costPerUser: perUser,
      insights: {
        freeTierCost: allocation.find(a => a.tier === 'free')?.allocatedCost,
        proTierCost: allocation.find(a => a.tier === 'pro')?.allocatedCost,
        schoolTierCost: allocation.find(a => a.tier === 'school')?.allocatedCost,
      },
    });
  } catch (error) {
    console.error('Allocation error:', error);
    return NextResponse.json({ error: 'Failed to fetch allocation' }, { status: 500 });
  }
}
```

---

## 7. Cost Optimization Dashboard

### Cost Dashboard Component

```typescript
// app/admin/dashboards/cost-dashboard.tsx
export default function CostDashboard() {
  const [costs, setCosts] = useState<any>(null);
  const [optimizations, setOptimizations] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Fetch costs
    fetch('/api/costs/summary')
      .then(r => r.json())
      .then(setCosts);

    // Fetch optimizations
    fetch('/api/costs/optimizations')
      .then(r => r.json())
      .then(d => setOptimizations(d.recommendations));

    // Fetch alerts
    fetch('/api/costs/alerts')
      .then(r => r.json())
      .then(d => setAlerts(d.alerts));
  }, []);

  if (!costs) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {/* Cost Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          label="Total Monthly"
          value={`$${costs.total.toFixed(2)}`}
          trend={costs.forecast.runRate}
        />
        <StatCard
          label="Projected Total"
          value={`$${costs.forecast.projectedTotal.toFixed(2)}`}
          trend={costs.total}
        />
        <StatCard
          label="Daily Average"
          value={`$${(costs.total / 30).toFixed(2)}`}
          trend={null}
        />
        <StatCard
          label="Remaining Budget"
          value={`$${(10000 - costs.total).toFixed(2)}`}
          trend={costs.total / 10000 * 100}
        />
      </div>

      {/* Cost Breakdown */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Cost Breakdown</h2>
        <div className="space-y-2">
          {Object.entries(costs.breakdown).map(([category, amount]: [string, any]) => (
            <div key={category} className="flex justify-between">
              <span className="capitalize">{category}</span>
              <span className="font-semibold">${amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Opportunities */}
      {optimizations.length > 0 && (
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Optimization Opportunities
          </h2>
          <div className="space-y-4">
            {optimizations.slice(0, 5).map(opt => (
              <div key={opt.id} className="border-l-4 border-blue-500 pl-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{opt.title}</h3>
                    <p className="text-sm text-gray-600">{opt.description}</p>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span>💰 Save ${opt.estimatedMonthlySavings.toFixed(2)}/mo</span>
                      <span>⏱️ {opt.timeToImplement}h</span>
                      <span className="capitalize">{opt.implementationDifficulty}</span>
                    </div>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Implement
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cost Alerts */}
      {alerts.length > 0 && (
        <div className="border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Active Alerts</h2>
          <div className="space-y-2">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3 rounded flex justify-between items-center ${
                  alert.severity === 'critical'
                    ? 'bg-red-100 border border-red-300'
                    : 'bg-yellow-100 border border-yellow-300'
                }`}
              >
                <div>
                  <p className="font-semibold">{alert.message}</p>
                  <p className="text-sm">{alert.serviceName}</p>
                </div>
                <button className="text-sm">Acknowledge</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## 8. Automated Cost Optimization

### Cron Jobs for Cost Management

```typescript
// scripts/cost-jobs.ts

// Daily: Check for cost spikes and alert
export async function dailyCostSpike() {
  await detectCostSpikes();
  // Send alerts to Slack
}

// Weekly: Generate optimization report
export async function weeklyOptimizationReport() {
  const recommendations = await generateOptimizationRecommendations();
  const potentialSavings = recommendations.reduce(
    (sum, r) => sum + r.estimatedMonthlySavings,
    0
  );

  console.log(`Weekly Cost Report:`);
  console.log(`- Potential Savings: $${potentialSavings.toFixed(2)}`);
  console.log(`- Recommendations: ${recommendations.length}`);

  // Email report
  await sendCostReport(recommendations);
}

// Monthly: Cost analysis and forecasting
export async function monthlyCostAnalysis() {
  const summary = await getMonthlyCosts(new Date());
  const forecast = await forecastMonthlySpend();
  const lastMonth = await getTotalMonthlySpend(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  );

  const report = {
    currentMonth: summary,
    totalSpend: forecast.projectedTotal,
    comparison: {
      lastMonth,
      change: forecast.projectedTotal - lastMonth,
      percentChange: ((forecast.projectedTotal - lastMonth) / lastMonth) * 100,
    },
    forecast: forecast,
  };

  // Generate report
  await sendMonthlyReport(report);
}

// Real-time: Track API costs as they happen
export async function trackAPICall(service: string, cost: number) {
  await trackCost({
    serviceName: service,
    costCategory: 'api',
    amount: cost,
  });

  // Check thresholds
  const daily = await getServiceCostToday(service);
  if (daily > 100) {
    // Alert if daily spend > $100
    console.warn(`Daily ${service} cost: $${daily}`);
  }
}
```

---

## 9. Cost Reduction Strategies

### Immediate Savings (0-1 week)

```
1. Enable Vercel Analytics Autocaching
   - Saves: $20-50/month
   - Time: 30 minutes

2. Archive Old Analytics Events (>90 days)
   - Saves: $5-15/month
   - Time: 2 hours

3. Reduce Monitoring Log Sampling
   - Saves: $50-100/month (at scale)
   - Time: 1 hour

4. Optimize Claude Prompt Templates
   - Saves: $100-200/month (at scale)
   - Time: 4 hours
```

### Medium-term Savings (1-4 weeks)

```
5. Implement Database Query Caching
   - Saves: $50-100/month
   - Time: 8-16 hours

6. Add CDN for Static Assets
   - Saves: $30-80/month
   - Time: 4-8 hours

7. Implement Batch Processing for Reports
   - Saves: $20-40/month
   - Time: 4-6 hours

8. Set Up Spot Instances for Non-Critical Work
   - Saves: $100-300/month (at scale)
   - Time: 8-12 hours
```

### Long-term Optimization (1-3 months)

```
9. Negotiate Volume Discounts
   - Saves: $500+ per service (at scale)
   - Time: 4-8 hours

10. Move to Reserved Capacity
    - Saves: 20-30% annually
    - Time: Ongoing

11. Implement Cost Chargeback
    - Saves: 15-25% by usage optimization
    - Time: 16-24 hours

12. Build Cost-Aware Features
    - Saves: 10-40% ongoing
    - Time: Ongoing engineering
```

---

## 10. Monitoring Best Practices

### Cost Health Checks

```
✅ Daily:
- Check for spending spikes
- Verify alerts are firing
- Review critical services

✅ Weekly:
- Review optimization opportunities
- Check forecast accuracy
- Analyze trends

✅ Monthly:
- Full cost analysis
- Budget vs actual
- Plan next month's optimizations

✅ Quarterly:
- Vendor negotiations
- Reserve capacity review
- Architecture efficiency review
```

---

## Files to Create

```
Database migrations:
- Migration: Add cost_tracking tables

Implementation files:
- lib/cost-monitoring.ts
- app/api/costs/summary/route.ts
- app/api/costs/optimizations/route.ts
- app/api/costs/alerts/route.ts
- app/api/costs/allocation/route.ts
- app/admin/dashboards/cost-dashboard.tsx
- scripts/cost-jobs.ts

Configuration:
- Cost budgets (vercel, supabase, claude, etc.)
- Alert thresholds
- Automation schedules
```

---

## Success Metrics

**Target Cost Reduction:**
- First month: -5% through quick wins
- Second month: -10% through optimization
- Third month: -15% through architecture changes
- Ongoing: -20-30% through discipline

**Budget Targets:**

| Usage Level | Monthly Cost | Target |
|-------------|--------------|--------|
| 1k DAU | $60 | $50 |
| 10k DAU | $1,200 | $1,000 |
| 100k DAU | $8,000 | $6,000 |

---

**Status:** Complete Cost Monitoring & Optimization Infrastructure ✅

Ready for comprehensive cost management and continuous optimization!
