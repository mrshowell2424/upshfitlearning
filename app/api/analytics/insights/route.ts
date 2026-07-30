/**
 * AI Insights API
 * Generate AI-powered business insights
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateAIInsights, getCurrentMetrics } from '@/lib/analytics-engine';

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const authHeader = request.headers.get('authorization');
    const isAdmin = authHeader?.includes('Bearer') || false;

    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const insights = await generateAIInsights();

    return NextResponse.json({
      insights,
      generatedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  } catch (error) {
    console.error('Insights generation error:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}

// Get current metrics for dashboard
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { metricsOnly } = body;

    if (metricsOnly) {
      const metrics = await getCurrentMetrics();
      return NextResponse.json({ metrics });
    }

    const insights = await generateAIInsights();
    const metrics = await getCurrentMetrics();

    return NextResponse.json({
      metrics,
      insights,
      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Metrics/insights error:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
