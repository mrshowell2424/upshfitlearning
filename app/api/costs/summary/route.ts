/**
 * Cost Summary API
 * Get current month cost breakdown and forecasting
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  getMonthlyCosts,
  getTotalMonthlySpend,
  forecastMonthlySpend,
  getCostSummary,
} from '@/lib/cost-monitoring';

export async function GET(request: NextRequest) {
  try {
    const now = new Date();
    const costs = await getMonthlyCosts(now);
    const total = await getTotalMonthlySpend(now);
    const forecast = await forecastMonthlySpend();
    const summary = await getCostSummary(now);

    return NextResponse.json({
      period: {
        month: now.toISOString().slice(0, 7),
        startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString(),
      },
      costs,
      total,
      forecast,
      breakdown: {
        infrastructure: summary.infrastructure,
        api: summary.api,
        monitoring: summary.monitoring,
        storage: summary.storage,
      },
      budgetUtilization: {
        used: total,
        budget: 1000, // Example: $1000/month budget
        percentUsed: (total / 1000) * 100,
      },
    });
  } catch (error) {
    console.error('Cost summary error:', error);
    return NextResponse.json({ error: 'Failed to fetch costs' }, { status: 500 });
  }
}
