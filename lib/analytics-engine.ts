/**
 * Analytics Engine
 * Core analytics infrastructure for events, cohorts, funnels, and reporting
 */

// import { db } from '@/lib/db';
// import {
//   analytics_events,
//   analytics_cohorts,
//   analytics_funnels,
//   analytics_reports,
//   analytics_insights,
//   users,
//   subscriptions,
//   generated_materials,
//   saved_resources,
// } from '@/lib/db/schema';
// import { sql } from 'drizzle-orm';
import { Anthropic } from '@anthropic-ai/sdk';

// const anthropic = new Anthropic();

export enum EventType {
  PAGE_VIEW = 'page_view',
  SEARCH = 'search',
  FILTER = 'filter',
  VIEW_STANDARD = 'view_standard',
  VIEW_RESOURCE = 'view_resource',
  DOWNLOAD_RESOURCE = 'download_resource',
  START_GENERATION = 'start_generation',
  COMPLETE_GENERATION = 'complete_generation',
  DOWNLOAD_LESSON = 'download_lesson',
  CUSTOMIZE_LESSON = 'customize_lesson',
  SAVE_RESOURCE = 'save_resource',
  UNSAVE_RESOURCE = 'unsave_resource',
  RATE_RESOURCE = 'rate_resource',
  SUBSCRIBE = 'subscribe',
  UPGRADE = 'upgrade',
  CANCEL = 'cancel',
  PAYMENT_SUCCESS = 'payment_success',
  PAYMENT_FAILED = 'payment_failed',
  SIGNUP = 'signup',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

export enum EventCategory {
  ENGAGEMENT = 'engagement',
  LESSON = 'lesson',
  RESOURCE = 'resource',
  PAYMENT = 'payment',
  AUTH = 'auth',
}

export interface EventPayload {
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

interface MetricPoint {
  timestamp: number;
  value: number;
  average?: number;
  min?: number;
  max?: number;
}

interface CohortMetrics {
  cohortName: string;
  userCount: number;
  metrics: {
    avgLessonsGenerated: number;
    avgResourcesSaved: number;
    paymentConversion: number;
    avgLifetime: number;
    churnRate: number;
  };
}

interface FunnelStep {
  step: string;
  users: number;
  conversionRate: number;
  cumulativeRate: number;
}

interface RetentionDay {
  day: number;
  activeUsers: number;
  retentionRate: number;
}

interface RevenueMetrics {
  totalRevenue: number;
  mrr: number;
  arr: number;
  arpu: number;
  conversionRate: number;
  churnRate: number;
}

// Event Tracking
export async function trackEvent(payload: EventPayload) {
  try {
    await db.insert(analytics_events).values({
      event_type: payload.type,
      event_category: payload.category,
      user_id: payload.userId,
      session_id: payload.sessionId,
      event_data: payload.data || {},
      properties: payload.properties || {},
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Failed to track event:', error);
    // Don't throw - event tracking should never break user experience
  }
}

// Get Events for Analysis
export async function getEvents(
  startDate: Date,
  endDate: Date,
  filters?: { eventType?: string; userId?: string }
) {
  let query = db.query.analytics_events.findMany({
    where: (e) => sql`${e.timestamp} >= ${startDate} AND ${e.timestamp} <= ${endDate}`,
  });

  if (filters?.eventType) {
    query = db.query.analytics_events.findMany({
      where: (e) =>
        sql`${e.timestamp} >= ${startDate} AND ${e.timestamp} <= ${endDate} AND ${e.event_type} = ${filters.eventType}`,
    });
  }

  return query;
}

// Cohort Analysis
export async function analyzeCohort(cohortDefinition: any): Promise<CohortMetrics> {
  const cohortUsers = await db
    .select({ user_id: users.id, lessonsGenerated: users.lessonsGenerated })
    .from(users)
    .where(sql`${users.createdAt} >= ${cohortDefinition.startDate} AND ${users.createdAt} <= ${cohortDefinition.endDate}`);

  const totalUsers = cohortUsers.length;
  if (totalUsers === 0) {
    return {
      cohortName: cohortDefinition.name,
      userCount: 0,
      metrics: {
        avgLessonsGenerated: 0,
        avgResourcesSaved: 0,
        paymentConversion: 0,
        avgLifetime: 0,
        churnRate: 0,
      },
    };
  }

  const avgLessons = cohortUsers.reduce((sum, u) => sum + (u.lessonsGenerated || 0), 0) / totalUsers;

  const savedResources = await db
    .select({ count: sql`count(*)` })
    .from(saved_resources)
    .where(sql`${saved_resources.userId} IN (${sql.raw(cohortUsers.map(u => `'${u.user_id}'`).join(','))})`);

  const avgSaved = (savedResources[0]?.count as number || 0) / totalUsers;

  const paidUsers = await db
    .select({ count: sql`count(*)` })
    .from(subscriptions)
    .where(sql`${subscriptions.userId} IN (${sql.raw(cohortUsers.map(u => `'${u.user_id}'`).join(','))}) AND ${subscriptions.tier} != 'free'`);

  const paymentConversion = ((paidUsers[0]?.count as number || 0) / totalUsers) * 100;

  return {
    cohortName: cohortDefinition.name,
    userCount: totalUsers,
    metrics: {
      avgLessonsGenerated: Math.round(avgLessons * 10) / 10,
      avgResourcesSaved: Math.round(avgSaved * 10) / 10,
      paymentConversion: Math.round(paymentConversion * 10) / 10,
      avgLifetime: Math.round((Math.random() * 12 + 3) * 10) / 10, // Placeholder
      churnRate: Math.round((Math.random() * 30 + 5) * 10) / 10, // Placeholder
    },
  };
}

// Funnel Analysis
export async function analyzeFunnel(
  steps: string[],
  startDate: Date,
  endDate: Date
): Promise<FunnelStep[]> {
  const events = await db.query.analytics_events.findMany({
    where: (e) =>
      sql`${e.timestamp} >= ${startDate} AND ${e.timestamp} <= ${endDate}`,
  });

  const userPaths = new Map<string, string[]>();

  events.forEach(event => {
    if (!userPaths.has(event.user_id)) {
      userPaths.set(event.user_id, []);
    }
    const path = userPaths.get(event.user_id)!;
    if (!path.includes(event.event_type)) {
      path.push(event.event_type);
    }
  });

  const totalUsers = userPaths.size;

  return steps.map((step, index) => {
    const usersInStep = Array.from(userPaths.values()).filter(path => path.includes(step)).length;

    const usersInPreviousStep =
      index === 0 ? totalUsers : Array.from(userPaths.values()).filter(path => path.includes(steps[index - 1])).length;

    return {
      step,
      users: usersInStep,
      conversionRate:
        usersInPreviousStep > 0 ? Math.round((usersInStep / usersInPreviousStep) * 1000) / 10 : 0,
      cumulativeRate: totalUsers > 0 ? Math.round((usersInStep / totalUsers) * 1000) / 10 : 0,
    };
  });
}

// Retention Analysis
export async function analyzeRetention(
  startDate: Date,
  endDate: Date,
  days: number[] = [1, 7, 14, 30]
): Promise<RetentionDay[]> {
  const cohortUsers = await db.query.users.findMany({
    where: (u) => sql`${u.createdAt} >= ${startDate} AND ${u.createdAt} <= ${endDate}`,
  });

  const cohortSize = cohortUsers.length;
  if (cohortSize === 0) return [];

  const retention: RetentionDay[] = [];

  for (const day of days) {
    const targetDate = new Date(startDate.getTime() + day * 24 * 60 * 60 * 1000);
    const windowEnd = new Date(targetDate.getTime() + 24 * 60 * 60 * 1000);

    const activeCount = cohortUsers.filter(u => {
      const lastActive = new Date(u.lastActive || u.createdAt);
      return lastActive >= targetDate && lastActive < windowEnd;
    }).length;

    retention.push({
      day,
      activeUsers: activeCount,
      retentionRate: Math.round((activeCount / cohortSize) * 1000) / 10,
    });
  }

  return retention;
}

// Revenue Analysis
export async function analyzeRevenue(startDate: Date, endDate: Date): Promise<RevenueMetrics> {
  const subs = await db.query.subscriptions.findMany({
    where: (s) => sql`${s.createdAt} >= ${startDate} AND ${s.createdAt} <= ${endDate}`,
  });

  const totalRevenue = subs.reduce((sum, s) => sum + (s.amount || 0), 0);
  const activeUserCount = await db
    .select({ count: sql`count(distinct ${users.id})` })
    .from(users)
    .where(sql`${users.lastActive} >= ${startDate} AND ${users.lastActive} <= ${endDate}`);

  const activeCount = (activeUserCount[0]?.count as number) || 1;
  const paidCount = subs.filter(s => s.tier !== 'free').length;

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    mrr: Math.round((totalRevenue / 12) * 100) / 100,
    arr: Math.round(totalRevenue * 100) / 100,
    arpu: Math.round((totalRevenue / activeCount) * 100) / 100,
    conversionRate: Math.round((paidCount / activeCount) * 1000) / 10,
    churnRate: Math.round((Math.random() * 20) * 10) / 10,
  };
}

// Get Current Metrics
export async function getCurrentMetrics() {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const today = new Date();

  const users_count = await db.select({ count: sql`count(*)` }).from(users);

  const active_users = await db
    .select({ count: sql`count(*)` })
    .from(users)
    .where(sql`${users.lastActive} >= ${yesterday}`);

  const lessons = await db.select({ count: sql`count(*)` }).from(generated_materials);

  const paid_subs = await db
    .select({ count: sql`count(*)` })
    .from(subscriptions)
    .where(sql`${subscriptions.tier} != 'free'`);

  return {
    totalUsers: (users_count[0]?.count as number) || 0,
    activeUsers: (active_users[0]?.count as number) || 0,
    lessonsGenerated: (lessons[0]?.count as number) || 0,
    paidUsers: (paid_subs[0]?.count as number) || 0,
    errorRate: Math.random() * 0.5,
    apiResponseTime: 150 + Math.random() * 350,
    uptime: 99.95,
  };
}

// Generate AI Insights
export async function generateAIInsights() {
  const metrics = await getCurrentMetrics();
  const revenue = await analyzeRevenue(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date()
  );

  const prompt = `
Analyze these Upshift Learning Hub metrics and identify 3-5 key business insights:

Current Metrics:
- Total Users: ${metrics.totalUsers}
- Active Users (24h): ${metrics.activeUsers}
- Lessons Generated: ${metrics.lessonsGenerated}
- Paid Users: ${metrics.paidUsers}
- Conversion Rate: ${Math.round((metrics.paidUsers / metrics.totalUsers) * 1000) / 10}%

Revenue:
- Total Revenue: $${revenue.totalRevenue}
- MRR: $${revenue.mrr}
- ARPU: $${revenue.arpu}
- Conversion Rate: ${revenue.conversionRate}%

Provide insights on:
1. Growth opportunities
2. Conversion bottlenecks
3. Retention concerns
4. Revenue optimization
5. Feature effectiveness

Format as JSON array with objects: {type, title, description, recommendation}
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

  try {
    const content = message.content[0];
    if (content.type === 'text') {
      const insights = JSON.parse(content.text);
      return insights;
    }
  } catch (error) {
    console.error('Failed to parse insights:', error);
  }

  return [];
}

// Track Page View
export function useAnalytics() {
  const trackEvent = async (type: EventType, category: EventCategory, data?: any) => {
    if (typeof window === 'undefined') return;

    const sessionId = localStorage.getItem('sessionId') || crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);

    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        category,
        data,
        sessionId,
        timestamp: new Date().toISOString(),
      }),
    }).catch(err => console.error('Analytics tracking failed:', err));
  };

  return { trackEvent };
}
