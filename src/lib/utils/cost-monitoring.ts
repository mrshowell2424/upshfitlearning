/**
 * Cost Monitoring System
 * Real-time cost tracking, budgeting, and optimization
 */

import { db } from '@/lib/db';

interface CostEntry {
  serviceName: string;
  costCategory: string;
  amount: number;
  quantity?: number;
  unit?: string;
  tags?: Record<string, any>;
}

interface ServiceCost {
  serviceName: string;
  category: string;
  total: number;
}

interface MonthlyForecast {
  currentSpend: number;
  projectedTotal: number;
  projectedRemaining: number;
  runRate: number;
}

interface Optimization {
  title: string;
  description: string;
  serviceName: string;
  estimatedMonthlySavings: number;
  implementationDifficulty: 'easy' | 'medium' | 'hard';
  timeToImplement: number;
}

// Helper functions
function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getDaysInMonth(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

// Track a cost
export async function trackCost(entry: CostEntry) {
  try {
    const now = new Date();
    const monthStart = getMonthStart(now);
    const monthEnd = getMonthEnd(now);

    // Insert cost entry
    // In production: await db.insert(cost_tracking).values({...})

    // Check budget alerts
    await checkBudgetAlerts(entry.serviceName);
  } catch (error) {
    console.error('Failed to track cost:', error);
  }
}

// Get monthly costs by service
export async function getMonthlyCosts(month: Date): Promise<ServiceCost[]> {
  const start = getMonthStart(month);
  const end = getMonthEnd(month);

  // In production: Real database query
  // const costs = await db.select(...).from(cost_tracking).groupBy(...)

  // Placeholder data
  return [
    { serviceName: 'vercel', category: 'compute', total: 25 },
    { serviceName: 'supabase', category: 'storage', total: 50 },
    { serviceName: 'claude', category: 'api', total: 150 },
    { serviceName: 'sentry', category: 'monitoring', total: 29 },
    { serviceName: 'datadog', category: 'monitoring', total: 185 },
  ];
}

// Get total monthly spend
export async function getTotalMonthlySpend(month: Date): Promise<number> {
  const costs = await getMonthlyCosts(month);
  return costs.reduce((sum, c) => sum + c.total, 0);
}

// Get service-specific cost
export async function getServiceCost(serviceName: string, month: Date): Promise<number> {
  const costs = await getMonthlyCosts(month);
  const service = costs.find((c) => c.serviceName === serviceName);
  return service?.total || 0;
}

// Get current month spend
async function getCurrentMonthSpend(serviceName: string): Promise<number> {
  return getServiceCost(serviceName, new Date());
}

// Check budget alerts
async function checkBudgetAlerts(serviceName: string) {
  // In production: fetch budget from database
  const budgets: Record<string, number> = {
    vercel: 50,
    supabase: 100,
    claude: 500,
    sentry: 100,
    datadog: 500,
  };

  const budget = budgets[serviceName];
  if (!budget) return;

  const currentSpend = await getCurrentMonthSpend(serviceName);
  const percentUsed = (currentSpend / budget) * 100;

  if (percentUsed >= 80) {
    console.warn(`Warning: ${serviceName} has used ${percentUsed.toFixed(1)}% of budget`);
  }
}

// Detect cost spikes
export async function detectCostSpikes(): Promise<
  Array<{
    service: string;
    percentChange: number;
    thisMonth: number;
    lastMonth: number;
  }>
> {
  const today = new Date();
  const thisMonth = getMonthStart(today);
  const lastMonth = getMonthStart(new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000));

  const thisMonthCosts = await getMonthlyCosts(thisMonth);
  const lastMonthCosts = await getMonthlyCosts(lastMonth);

  const spikes = [];

  for (const cost of thisMonthCosts) {
    const lastMonthCost = lastMonthCosts.find((c) => c.serviceName === cost.serviceName);
    const lastAmount = lastMonthCost?.total || cost.total;

    const percentChange = ((cost.total - lastAmount) / lastAmount) * 100;

    if (percentChange > 30) {
      spikes.push({
        service: cost.serviceName,
        percentChange,
        thisMonth: cost.total,
        lastMonth: lastAmount,
      });
    }
  }

  return spikes;
}

// Forecast monthly spend
export async function forecastMonthlySpend(): Promise<MonthlyForecast> {
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
    runRate: dailyAverage * 30,
  };
}

// Generate optimization recommendations
export async function generateOptimizationRecommendations(): Promise<Optimization[]> {
  const recommendations: Optimization[] = [];

  // 1. Database optimization
  recommendations.push({
    title: 'Optimize Database Queries',
    description: 'Add indices to slow queries and refactor N+1 queries',
    serviceName: 'supabase',
    estimatedMonthlySavings: 25,
    implementationDifficulty: 'medium',
    timeToImplement: 12,
  });

  // 2. Function optimization
  recommendations.push({
    title: 'Cache API Responses',
    description: 'Add caching to frequently called endpoints',
    serviceName: 'vercel',
    estimatedMonthlySavings: 10,
    implementationDifficulty: 'easy',
    timeToImplement: 4,
  });

  // 3. Claude optimization
  const forecast = await forecastMonthlySpend();
  if (forecast.projectedTotal > 200) {
    recommendations.push({
      title: 'Implement Prompt Caching',
      description: 'Cache lesson templates to reduce API calls',
      serviceName: 'claude',
      estimatedMonthlySavings: Math.min(50, forecast.projectedTotal * 0.2),
      implementationDifficulty: 'easy',
      timeToImplement: 6,
    });
  }

  // 4. Storage optimization
  recommendations.push({
    title: 'Archive Old Analytics Data',
    description: 'Move analytics events older than 90 days to cold storage',
    serviceName: 'supabase',
    estimatedMonthlySavings: 15,
    implementationDifficulty: 'easy',
    timeToImplement: 3,
  });

  // 5. Monitoring optimization
  recommendations.push({
    title: 'Reduce Log Sampling',
    description: 'Error rate is stable, reduce logging verbosity',
    serviceName: 'datadog',
    estimatedMonthlySavings: 80,
    implementationDifficulty: 'easy',
    timeToImplement: 2,
  });

  return recommendations;
}

// Calculate cost allocation by tier
export async function calculateCostAllocation(): Promise<
  Array<{
    tier: string;
    userPercentage: number;
    allocatedCost: number;
    costPerUser: number;
  }>
> {
  const totalMonthlySpend = await getTotalMonthlySpend(new Date());

  // Placeholder allocation based on usage patterns
  return [
    {
      tier: 'free',
      userPercentage: 70,
      allocatedCost: totalMonthlySpend * 0.3, // Free users: 30% of cost
      costPerUser: (totalMonthlySpend * 0.3) / 700, // 70% of users
    },
    {
      tier: 'pro',
      userPercentage: 25,
      allocatedCost: totalMonthlySpend * 0.5, // Pro users: 50% of cost
      costPerUser: (totalMonthlySpend * 0.5) / 250, // 25% of users
    },
    {
      tier: 'school',
      userPercentage: 5,
      allocatedCost: totalMonthlySpend * 0.2, // School: 20% of cost
      costPerUser: (totalMonthlySpend * 0.2) / 50, // 5% of users
    },
  ];
}

// Get cost summary by category
export async function getCostSummary(month: Date): Promise<{
  infrastructure: number;
  api: number;
  monitoring: number;
  storage: number;
  total: number;
}> {
  const costs = await getMonthlyCosts(month);

  return {
    infrastructure: costs
      .filter((c) => c.category === 'compute')
      .reduce((sum, c) => sum + c.total, 0),
    api: costs.filter((c) => c.category === 'api').reduce((sum, c) => sum + c.total, 0),
    monitoring: costs
      .filter((c) => c.category === 'monitoring')
      .reduce((sum, c) => sum + c.total, 0),
    storage: costs.filter((c) => c.category === 'storage').reduce((sum, c) => sum + c.total, 0),
    total: costs.reduce((sum, c) => sum + c.total, 0),
  };
}

// Estimate costs for feature
export function estimateFeatureCost(feature: string): number {
  const costMap: Record<string, number> = {
    lesson_generation: 0.042, // Claude API per generation
    resource_sync: 0.001, // Google Sheets per sync
    payment_processing: 0.059, // Stripe 5.9%
    user_authentication: 0.01, // Per auth event
    event_tracking: 0.0001, // Per event
    report_generation: 0.01, // Claude per report
  };

  return costMap[feature] || 0;
}
