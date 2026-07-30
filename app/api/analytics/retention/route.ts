/**
 * Retention Analysis API
 * Analyze user retention and churn
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeRetention } from '@/lib/analytics-engine';

export async function GET(request: NextRequest) {
  try {
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');
    const daysParam = request.nextUrl.searchParams.get('days');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required query params: startDate, endDate' },
        { status: 400 }
      );
    }

    const days = daysParam ? JSON.parse(daysParam) : [1, 7, 14, 30, 60, 90];

    const retention = await analyzeRetention(new Date(startDate), new Date(endDate), days);

    return NextResponse.json({
      period: {
        startDate,
        endDate,
      },
      retention,
      avgRetention:
        retention.reduce((sum, r) => sum + r.retentionRate, 0) / retention.length,
      churnRate: 100 - retention[retention.length - 1].retentionRate,
    });
  } catch (error) {
    console.error('Retention analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze retention' }, { status: 500 });
  }
}
