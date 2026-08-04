# Advanced Analytics & Reporting Guide

Complete analytics infrastructure for custom reports, cohort analysis, funnel tracking, and business intelligence.

---

## Overview

Advanced analytics system providing:
- **Custom Report Builder** - Drag-and-drop report creation
- **Cohort Analysis** - User behavior segmentation
- **Funnel Analysis** - Conversion tracking
- **Retention Analytics** - User lifecycle analysis
- **Revenue Analytics** - Payment & subscription tracking
- **Automated Reports** - Daily/weekly/monthly generation
- **Data Export** - CSV, JSON, PDF exports
- **AI Insights** - Claude-powered analysis generation

---

## 1. Analytics Architecture

### Data Collection Pipeline

```
User Events → Event Queue → Analytics DB → Reports → Dashboards
     ↓
  Tracking         ↓          ↓
  - Views      Aggregate   Cohort
  - Clicks     Funnel      Retention
  - Searches   Revenue     Trends
  - Saves      Custom
  - Generates
```

### Database Schema

```sql
-- Events table (raw data)
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  event_type VARCHAR(50),           -- view, click, search, generate, save, subscribe
  event_category VARCHAR(50),       -- lesson, resource, standard, payment
  event_data JSONB,                 -- Custom event properties
  timestamp TIMESTAMP,
  session_id UUID,
  properties JSONB                  -- User agent, geo, etc.
);

-- Cohorts table (user groupings)
CREATE TABLE analytics_cohorts (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  definition JSONB,                 -- Cohort rules
  created_at TIMESTAMP,
  created_by UUID REFERENCES users(id),
  user_count INT
);

-- Funnels table (conversion tracking)
CREATE TABLE analytics_funnels (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  steps JSONB,                      -- Array of steps: [search, view, generate, download]
  created_at TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Reports table (saved reports)
CREATE TABLE analytics_reports (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  report_type VARCHAR(50),          -- custom, cohort, funnel, revenue
  config JSONB,                     -- Report configuration
  scheduled BOOLEAN DEFAULT false,
  schedule CRON,                    -- Daily: '0 8 * * *'
  recipients TEXT[],                -- Email addresses
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

-- Insights table (AI-generated insights)
CREATE TABLE analytics_insights (
  id UUID PRIMARY KEY,
  insight_type VARCHAR(50),         -- growth, churn, conversion, anomaly
  title VARCHAR(255),
  description TEXT,
  metric_name VARCHAR(100),
  metric_value FLOAT,
  metric_change FLOAT,              -- % change
  confidence FLOAT,                 -- 0-1
  created_at TIMESTAMP,
  expires_at TIMESTAMP              -- When insight is no longer relevant
);
```

---

## 2. Event Tracking System

### Event Types

```typescript
enum EventType {
  // Engagement
  PAGE_VIEW = 'page_view',
  SEARCH = 'search',
  FILTER = 'filter',
  VIEW_STANDARD = 'view_standard',
  VIEW_RESOURCE = 'view_resource',
  DOWNLOAD_RESOURCE = 'download_resource',
  
  // Lesson Generation
  START_GENERATION = 'start_generation',
  COMPLETE_GENERATION = 'complete_generation',
  DOWNLOAD_LESSON = 'download_lesson',
  CUSTOMIZE_LESSON = 'customize_lesson',
  
  // Resources
  SAVE_RESOURCE = 'save_resource',
  UNSAVE_RESOURCE = 'unsave_resource',
  RATE_RESOURCE = 'rate_resource',
  
  // Payments
  SUBSCRIBE = 'subscribe',
  UPGRADE = 'upgrade',
  CANCEL = 'cancel',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  
  // Auth
  SIGNUP = 'signup',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

enum EventCategory {
  ENGAGEMENT = 'engagement',
  LESSON = 'lesson',
  RESOURCE = 'resource',
  PAYMENT = 'payment',
  AUTH = 'auth',
}
```

### Event Tracking Implementation

```typescript
// lib/analytics.ts
import { db } from '@/lib/db';
import { analytics_events } from '@/lib/db/schema';

interface EventPayload {
  type: EventType;
  category: EventCategory;
  userId?: string;
  sessionId: string;
  data?: Record<string, any>;
  properties?: {
    userAgent?: string;
    referer?: string;
    geoLocation?: string;
  };
}

export async function trackEvent(payload: EventPayload) {
  try {
    await db.insert(analytics_events).values({
      event_type: payload.type,
      event_category: payload.category,
      user_id: payload.userId,
      session_id: payload.sessionId,
      event_data: payload.data,
      properties: payload.properties,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
    // Don't throw - event tracking should never break user experience
  }
}

// Frontend tracking
export function useAnalytics() {
  const trackEvent = async (type: EventType, category: EventCategory, data?: any) => {
    await fetch('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        type,
        category,
        data,
        timestamp: new Date().toISOString(),
      }),
    });
  };

  return { trackEvent };
}
```

---

## 3. Cohort Analysis

### Pre-defined Cohorts

```typescript
// Cohort definitions
const COHORTS = {
  signupDateWeek: {
    name: 'Signup Week',
    groupBy: (event: Event) => {
      const date = new Date(event.timestamp);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      return weekStart.toISOString().split('T')[0];
    },
  },

  pricingTier: {
    name: 'Pricing Tier',
    groupBy: (user: User) => user.subscriptionTier, // free, pro, school
  },

  lessonGeneration: {
    name: 'Lesson Generators',
    filter: (user: User) => user.lessonsGenerated > 0,
  },

  resourceSavers: {
    name: 'Resource Savers',
    filter: (user: User) => user.resourcesSaved > 0,
  },

  retentionWeek2: {
    name: 'Week 2 Retention',
    filter: (user: User) => {
      const signupDate = new Date(user.createdAt);
      const week2Start = new Date(signupDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const today = new Date();
      return today > week2Start && user.lastActive >= week2Start;
    },
  },
};

// Cohort analysis API
export async function analyzeCohort(cohortId: string) {
  const cohort = await db.query.analytics_cohorts.findFirst({
    where: (c) => eq(c.id, cohortId),
  });

  if (!cohort) throw new Error('Cohort not found');

  const users = await db.query.users.findMany({
    where: (u) => sql`${u.id} IN (${buildCohortQuery(cohort.definition)})`,
  });

  return {
    cohortName: cohort.name,
    userCount: users.length,
    metrics: {
      avgLessonsGenerated: avg(users, u => u.lessonsGenerated),
      avgResourcesSaved: avg(users, u => u.resourcesSaved),
      paymentConversion: (users.filter(u => u.paidTier).length / users.length) * 100,
      avgLifetime: avg(users, u => u.activeMonths),
      churnRate: calculateChurnRate(users),
    },
    trends: {
      lessonGenerationTrend: calculateTrend(users, 'lessonsGenerated'),
      engagementTrend: calculateTrend(users, 'lastActive'),
    },
  };
}
```

---

## 4. Funnel Analysis

### Conversion Funnels

```typescript
enum FunnelStep {
  VISIT_HOMEPAGE = 'visit_homepage',
  SEARCH_STANDARD = 'search_standard',
  VIEW_STANDARD = 'view_standard',
  GENERATE_LESSON = 'generate_lesson',
  DOWNLOAD_LESSON = 'download_lesson',
  SUBSCRIBE = 'subscribe',
}

interface FunnelAnalysis {
  name: string;
  steps: FunnelStep[];
  totalUsers: number;
  stepConversions: Array<{
    step: FunnelStep;
    users: number;
    conversionRate: number; // from previous step
    cumulativeRate: number; // from first step
  }>;
  dropoffPoints: Array<{
    from: FunnelStep;
    to: FunnelStep;
    dropoffRate: number;
    estimatedUsers: number;
  }>;
  avgTimeInFunnel: number; // milliseconds
  avgTimePerStep: number[]; // per step
}

export async function analyzeFunnel(funnelId: string): Promise<FunnelAnalysis> {
  const funnel = await db.query.analytics_funnels.findFirst({
    where: (f) => eq(f.id, funnelId),
  });

  const steps = funnel.steps as FunnelStep[];

  // Get user events for funnel
  const events = await db.query.analytics_events.findMany({
    where: (e) => 
      inArray(e.event_type, steps) && 
      gte(e.timestamp, new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)), // Last 30 days
  });

  // Build user paths
  const userPaths = new Map<string, FunnelStep[]>();
  events.forEach(event => {
    const path = userPaths.get(event.user_id) || [];
    if (!path.includes(event.event_type)) {
      path.push(event.event_type);
    }
    userPaths.set(event.user_id, path);
  });

  // Calculate conversion rates
  const stepConversions = steps.map((step, index) => {
    const usersInStep = Array.from(userPaths.values()).filter(path =>
      path.includes(step)
    ).length;

    const usersInPreviousStep = index === 0 
      ? Array.from(userPaths.keys()).length
      : Array.from(userPaths.values()).filter(path =>
          path.includes(steps[index - 1])
        ).length;

    return {
      step,
      users: usersInStep,
      conversionRate: (usersInStep / usersInPreviousStep) * 100,
      cumulativeRate: (usersInStep / Array.from(userPaths.keys()).length) * 100,
    };
  });

  return {
    name: funnel.name,
    steps,
    totalUsers: userPaths.size,
    stepConversions,
    dropoffPoints: calculateDropoffPoints(stepConversions),
    avgTimeInFunnel: calculateAvgTimeInFunnel(events),
    avgTimePerStep: steps.map((step, index) => 
      calculateAvgTimePerStep(events, step, steps[index + 1])
    ),
  };
}
```

---

## 5. Retention Analytics

### Retention Cohorts

```typescript
interface RetentionAnalysis {
  cohort: string; // e.g., "2026-07"
  size: number;
  retention: Array<{
    day: number;
    activeUsers: number;
    retentionRate: number;
  }>;
  churnRate: number;
  avgLifetime: number;
}

export async function analyzeRetention(
  cohortStartDate: Date,
  cohortEndDate: Date
): Promise<RetentionAnalysis[]> {
  // Get users who signed up in this period
  const cohortUsers = await db.query.users.findMany({
    where: (u) =>
      gte(u.createdAt, cohortStartDate) &&
      lte(u.createdAt, cohortEndDate),
  });

  const cohortLabel = `${cohortStartDate.getFullYear()}-${String(cohortStartDate.getMonth() + 1).padStart(2, '0')}`;

  // For each user, check activity on day 1, 7, 14, 30, etc.
  const retentionDays = [1, 7, 14, 30, 60, 90];
  const retention = [];

  for (const day of retentionDays) {
    const targetDate = new Date(cohortStartDate.getTime() + day * 24 * 60 * 60 * 1000);
    const activeUsers = cohortUsers.filter(user => {
      return user.lastActive >= targetDate && 
             user.lastActive < new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);
    }).length;

    retention.push({
      day,
      activeUsers,
      retentionRate: (activeUsers / cohortUsers.length) * 100,
    });
  }

  const churnRate = 100 - retention[retention.length - 1].retentionRate;
  const avgLifetime = retention.reduce((sum, r) => sum + r.day, 0) / retention.length;

  return [{
    cohort: cohortLabel,
    size: cohortUsers.length,
    retention,
    churnRate,
    avgLifetime,
  }];
}
```

---

## 6. Revenue Analytics

### Revenue Metrics

```typescript
interface RevenueAnalysis {
  period: {
    startDate: Date;
    endDate: Date;
  };
  totalRevenue: number;
  subscriptions: {
    free: number;
    pro: number;
    school: number;
  };
  metrics: {
    mrr: number; // Monthly Recurring Revenue
    arr: number; // Annual Recurring Revenue
    arpu: number; // Average Revenue Per User
    conversionRate: number;
    churnRate: number;
    lifetimeValue: number;
  };
  breakdown: {
    byTier: Record<string, number>;
    byMonth: Array<{ month: string; revenue: number }>;
    byPaymentMethod: Record<string, number>;
  };
}

export async function analyzeRevenue(
  startDate: Date,
  endDate: Date
): Promise<RevenueAnalysis> {
  // Get subscriptions in period
  const subscriptions = await db.query.subscriptions.findMany({
    where: (s) =>
      gte(s.createdAt, startDate) &&
      lte(s.createdAt, endDate),
  });

  // Calculate metrics
  const totalRevenue = subscriptions.reduce((sum, s) => sum + (s.amount || 0), 0);
  const activeUsers = await countActiveUsers(startDate, endDate);
  
  const tiers = {
    free: subscriptions.filter(s => s.tier === 'free').length,
    pro: subscriptions.filter(s => s.tier === 'pro').length,
    school: subscriptions.filter(s => s.tier === 'school').length,
  };

  const pricingTiers = {
    free: 0,
    pro: 999, // Annual
    school: 2999, // Annual
  };

  const mrr = (subscriptions.filter(s => s.tier === 'pro').length * 999 / 12) +
              (subscriptions.filter(s => s.tier === 'school').length * 2999 / 12);

  return {
    period: { startDate, endDate },
    totalRevenue,
    subscriptions: tiers,
    metrics: {
      mrr,
      arr: mrr * 12,
      arpu: totalRevenue / activeUsers,
      conversionRate: (subscriptions.filter(s => s.tier !== 'free').length / activeUsers) * 100,
      churnRate: calculateChurnRate(subscriptions),
      lifetimeValue: calculateLifetimeValue(subscriptions),
    },
    breakdown: {
      byTier: {
        free: pricingTiers.free * tiers.free,
        pro: pricingTiers.pro * tiers.pro,
        school: pricingTiers.school * tiers.school,
      },
      byMonth: aggregateByMonth(subscriptions, startDate, endDate),
      byPaymentMethod: aggregateByPaymentMethod(subscriptions),
    },
  };
}
```

---

## 7. Automated Report Generation

### Report Types

```typescript
enum ReportType {
  DAILY_SUMMARY = 'daily_summary',
  WEEKLY_PERFORMANCE = 'weekly_performance',
  MONTHLY_EXECUTIVE = 'monthly_executive',
  COHORT_ANALYSIS = 'cohort_analysis',
  FUNNEL_ANALYSIS = 'funnel_analysis',
  REVENUE_REPORT = 'revenue_report',
  CUSTOM = 'custom',
}

interface ReportConfig {
  type: ReportType;
  metrics: string[]; // metric names to include
  groupBy?: string[]; // dimensions to group by
  filters?: Record<string, any>; // filter conditions
  format: 'html' | 'pdf' | 'csv' | 'json';
  schedule?: string; // cron expression
  recipients?: string[]; // email addresses
}

// Generate report
export async function generateReport(config: ReportConfig): Promise<string> {
  const reportData = await collectReportData(config);
  
  switch (config.format) {
    case 'html':
      return generateHTMLReport(reportData);
    case 'pdf':
      return generatePDFReport(reportData);
    case 'csv':
      return generateCSVReport(reportData);
    case 'json':
      return JSON.stringify(reportData, null, 2);
  }
}

// Daily summary report
async function generateDailySummaryReport() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const metrics = {
    activeUsers: await countActiveUsers(yesterday, new Date()),
    newSignups: await countNewSignups(yesterday, new Date()),
    lessonsGenerated: await countLessonsGenerated(yesterday, new Date()),
    resourcesSaved: await countResourcesSaved(yesterday, new Date()),
    paidConversions: await countPaidConversions(yesterday, new Date()),
    revenue: await calculateRevenue(yesterday, new Date()),
    paymentFailures: await countPaymentFailures(yesterday, new Date()),
  };

  return {
    date: yesterday.toISOString().split('T')[0],
    metrics,
    previousDay: await getMetricsForDate(new Date(yesterday.getTime() - 24 * 60 * 60 * 1000)),
    changes: calculateChanges(metrics, previousMetrics),
  };
}

// Weekly performance report
async function generateWeeklyPerformanceReport() {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const lastWeek = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

  return {
    period: `${lastWeek.toISOString().split('T')[0]} to ${weekAgo.toISOString().split('T')[0]}`,
    metrics: await analyzeWeeklyMetrics(weekAgo, new Date()),
    topResources: await getTopResources(weekAgo, new Date()),
    topStandards: await getTopStandards(weekAgo, new Date()),
    userGrowth: await analyzeUserGrowth(lastWeek, new Date()),
    engagement: await analyzeEngagement(weekAgo, new Date()),
  };
}

// Monthly executive report
async function generateMonthlyExecutiveReport() {
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const lastMonth = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  return {
    period: new Date().toISOString().split('T')[0],
    summary: {
      dau: await countDAU(monthAgo, new Date()),
      mau: await countMAU(monthAgo, new Date()),
      revenue: await calculateRevenue(monthAgo, new Date()),
      arpu: await calculateARPU(monthAgo, new Date()),
    },
    growth: {
      dau: calculateGrowth(
        await countDAU(lastMonth, monthAgo),
        await countDAU(monthAgo, new Date())
      ),
      revenue: calculateGrowth(
        await calculateRevenue(lastMonth, monthAgo),
        await calculateRevenue(monthAgo, new Date())
      ),
    },
    cohorts: await analyzeCohortRetention(),
    funnels: await analyzeFunnelConversions(),
    topInsights: await generateAIInsights(),
  };
}
```

---

## 8. Automated Insights with Claude AI

### Insight Generation

```typescript
interface Insight {
  type: 'growth' | 'churn' | 'conversion' | 'anomaly' | 'opportunity';
  title: string;
  description: string;
  metric: string;
  value: number;
  change: number; // percentage change
  confidence: number; // 0-1
  recommendation: string;
}

export async function generateAIInsights(): Promise<Insight[]> {
  // Collect current metrics
  const metrics = await collectCurrentMetrics();
  const historicalData = await collectHistoricalData();

  // Prepare prompt for Claude
  const prompt = `
Analyze the following product metrics and identify key insights:

Current Metrics:
${JSON.stringify(metrics, null, 2)}

Historical Trends (last 30 days):
${JSON.stringify(historicalData, null, 2)}

Identify 3-5 key insights about:
1. Growth opportunities
2. Potential churn risks
3. Conversion bottlenecks
4. Anomalies or unusual patterns
5. Actionable recommendations

Format as JSON with fields: type, title, description, metric, value, change, confidence, recommendation
`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const insights = JSON.parse(message.content[0].text);

  // Store insights in database
  for (const insight of insights) {
    await db.insert(analytics_insights).values({
      ...insight,
      created_at: new Date(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    });
  }

  return insights;
}
```

---

## 9. Custom Report Builder

### Report Builder UI

```typescript
// app/admin/analytics/report-builder.tsx
export default function ReportBuilder() {
  const [reportConfig, setReportConfig] = useState<ReportConfig>({
    name: '',
    type: ReportType.CUSTOM,
    metrics: [],
    filters: {},
    format: 'html',
  });

  const metrics = [
    { id: 'dau', label: 'Daily Active Users', category: 'user' },
    { id: 'mau', label: 'Monthly Active Users', category: 'user' },
    { id: 'revenue', label: 'Revenue', category: 'financial' },
    { id: 'mrr', label: 'MRR', category: 'financial' },
    { id: 'conversionRate', label: 'Conversion Rate', category: 'conversion' },
    { id: 'churnRate', label: 'Churn Rate', category: 'retention' },
    { id: 'lessonsGenerated', label: 'Lessons Generated', category: 'engagement' },
    { id: 'resourcesSaved', label: 'Resources Saved', category: 'engagement' },
  ];

  const dimensions = [
    { id: 'date', label: 'Date' },
    { id: 'tier', label: 'Subscription Tier' },
    { id: 'standard', label: 'Standard Code' },
    { id: 'resource', label: 'Resource' },
    { id: 'cohort', label: 'User Cohort' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Report Builder</h1>
        <p className="text-gray-600">Create custom analytics reports</p>
      </div>

      {/* Metrics Selection */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Select Metrics</h2>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map(metric => (
            <label key={metric.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={reportConfig.metrics.includes(metric.id)}
                onChange={(e) => {
                  setReportConfig({
                    ...reportConfig,
                    metrics: e.target.checked
                      ? [...reportConfig.metrics, metric.id]
                      : reportConfig.metrics.filter(m => m !== metric.id),
                  });
                }}
              />
              <span>{metric.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Dimensions Selection */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Group By</h2>
        <div className="space-y-2">
          {dimensions.map(dim => (
            <label key={dim.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={reportConfig.groupBy?.includes(dim.id) || false}
                onChange={(e) => {
                  setReportConfig({
                    ...reportConfig,
                    groupBy: e.target.checked
                      ? [...(reportConfig.groupBy || []), dim.id]
                      : (reportConfig.groupBy || []).filter(d => d !== dim.id),
                  });
                }}
              />
              <span>{dim.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Format Selection */}
      <div className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Report Format</h2>
        <div className="space-y-2">
          {['html', 'pdf', 'csv', 'json'].map(format => (
            <label key={format} className="flex items-center space-x-2">
              <input
                type="radio"
                name="format"
                value={format}
                checked={reportConfig.format === format}
                onChange={(e) => setReportConfig({ ...reportConfig, format: e.target.value as any })}
              />
              <span className="capitalize">{format}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Generate Report Button */}
      <button
        onClick={() => generateAndDownloadReport(reportConfig)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
      >
        Generate Report
      </button>
    </div>
  );
}
```

---

## 10. Analytics API Endpoints

### REST API

```typescript
// app/api/analytics/track
export async function POST(request: NextRequest) {
  const body = await request.json();
  
  await trackEvent({
    type: body.type,
    category: body.category,
    userId: body.userId,
    sessionId: body.sessionId,
    data: body.data,
  });

  return NextResponse.json({ success: true });
}

// app/api/analytics/reports
export async function GET(request: NextRequest) {
  const reports = await db.query.analytics_reports.findMany();
  return NextResponse.json(reports);
}

export async function POST(request: NextRequest) {
  const config = await request.json();
  const report = await generateReport(config);
  
  const saved = await db.insert(analytics_reports).values({
    ...config,
    created_at: new Date(),
  });

  return NextResponse.json(saved);
}

// app/api/analytics/cohorts/:id
export async function GET(request: NextRequest, { params }: any) {
  const analysis = await analyzeCohort(params.id);
  return NextResponse.json(analysis);
}

// app/api/analytics/funnels/:id
export async function GET(request: NextRequest, { params }: any) {
  const analysis = await analyzeFunnel(params.id);
  return NextResponse.json(analysis);
}

// app/api/analytics/retention
export async function GET(request: NextRequest) {
  const startDate = new Date(request.nextUrl.searchParams.get('startDate') || '');
  const endDate = new Date(request.nextUrl.searchParams.get('endDate') || '');
  
  const analysis = await analyzeRetention(startDate, endDate);
  return NextResponse.json(analysis);
}

// app/api/analytics/revenue
export async function GET(request: NextRequest) {
  const startDate = new Date(request.nextUrl.searchParams.get('startDate') || '');
  const endDate = new Date(request.nextUrl.searchParams.get('endDate') || '');
  
  const analysis = await analyzeRevenue(startDate, endDate);
  return NextResponse.json(analysis);
}

// app/api/analytics/insights
export async function GET(request: NextRequest) {
  const insights = await db.query.analytics_insights.findMany({
    where: (i) => gt(i.expiresAt, new Date()),
  });
  
  return NextResponse.json(insights);
}
```

---

## 11. Event-Driven Analytics

### Real-Time Event Processing

```typescript
// Process events in real-time for dashboards
export async function processAnalyticsEvent(event: AnalyticsEvent) {
  // Update real-time metrics
  await updateRealtimeMetrics(event);

  // Check for anomalies
  const isAnomaly = await detectAnomaly(event);
  if (isAnomaly) {
    await createAlert(`Anomaly detected: ${event.type}`);
  }

  // Update user segments
  await updateUserSegments(event.userId);

  // Check funnel progression
  await updateFunnelProgression(event);

  // Update cohort data
  await updateCohortData(event.userId);
}

// Anomaly detection using statistical methods
async function detectAnomaly(event: AnalyticsEvent): Promise<boolean> {
  const historical = await getHistoricalEvents(event.type, 30); // Last 30 days

  const mean = historical.length / 30; // Daily average
  const stdDev = calculateStdDev(historical, mean);

  const today = await countEventsToday(event.type);
  const zScore = (today - mean) / stdDev;

  // Flag if more than 3 standard deviations from mean
  return Math.abs(zScore) > 3;
}
```

---

## 12. Data Export

### Export Formats

```typescript
export async function exportAnalytics(
  format: 'csv' | 'json' | 'xlsx',
  query: AnalyticsQuery
): Promise<Buffer> {
  const data = await executeQuery(query);

  switch (format) {
    case 'csv':
      return convertToCSV(data);
    case 'json':
      return Buffer.from(JSON.stringify(data, null, 2));
    case 'xlsx':
      return convertToXLSX(data);
  }
}

function convertToCSV(data: any[]): Buffer {
  if (data.length === 0) return Buffer.from('');

  const headers = Object.keys(data[0]);
  const rows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes
      return `"${String(value).replace(/"/g, '""')}"`;
    }).join(',')
  );

  const csv = [headers.join(','), ...rows].join('\n');
  return Buffer.from(csv);
}

function convertToXLSX(data: any[]): Buffer {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
  
  const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
  return buffer;
}
```

---

## Implementation Checklist

- [ ] Create `analytics_events` table and indices
- [ ] Create `analytics_cohorts` table
- [ ] Create `analytics_funnels` table
- [ ] Create `analytics_reports` table
- [ ] Create `analytics_insights` table
- [ ] Implement event tracking system
- [ ] Add tracking calls throughout app
- [ ] Build cohort analysis engine
- [ ] Build funnel analysis engine
- [ ] Build retention analysis
- [ ] Implement revenue analytics
- [ ] Build report generator
- [ ] Integrate Claude AI insights
- [ ] Create report builder UI
- [ ] Build analytics API endpoints
- [ ] Implement event-driven processing
- [ ] Add data export functionality
- [ ] Set up scheduled reports
- [ ] Create analytics dashboards
- [ ] Add alerting system

---

## Performance Considerations

### Event Storage
- Batch events before writing to DB (100 events/batch)
- Archive events older than 90 days
- Create indices on user_id, event_type, timestamp

### Query Optimization
- Pre-calculate common metrics hourly
- Cache cohort calculations for 6 hours
- Use materialized views for reports

### Scaling
- Use event queue (Redis/Kafka) for high volume
- Shard analytics data by date
- Use read replicas for reporting queries

---

## Security & Privacy

### Data Protection
- Anonymize PII in analytics data
- Encrypt sensitive fields (user emails, IPs)
- Implement GDPR right-to-be-forgotten

### Access Control
- Role-based report access
- Audit all report access
- Restrict cohort definitions to admins

### Compliance
- PII data retention: 12 months max
- Right to data deletion
- Data residency compliance

---

**Status:** Complete Advanced Analytics Infrastructure ✅

Ready for comprehensive business intelligence and reporting!
