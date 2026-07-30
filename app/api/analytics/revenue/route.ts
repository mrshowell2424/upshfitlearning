/**
 * Revenue Analytics API
 * Analyze revenue metrics and trends
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeRevenue } from '@/lib/analytics-engine';

export async function GET(request: NextRequest) {
  try {
    const startDate = request.nextUrl.searchParams.get('startDate');
    const endDate = request.nextUrl.searchParams.get('endDate');

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required query params: startDate, endDate' },
        { status: 400 }
      );
    }

    const revenue = await analyzeRevenue(new Date(startDate), new Date(endDate));

    return NextResponse.json({
      period: {
        startDate,
        endDate,
      },
      ...revenue,
    });
  } catch (error) {
    console.error('Revenue analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze revenue' }, { status: 500 });
  }
}
