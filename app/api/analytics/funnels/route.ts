/**
 * Funnel Analysis API
 * Analyze conversion funnels
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeFunnel } from '@/lib/analytics-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, steps, startDate, endDate } = body;

    if (!name || !steps || !Array.isArray(steps) || steps.length < 2) {
      return NextResponse.json(
        { error: 'Missing or invalid required fields: name, steps (array of 2+)' },
        { status: 400 }
      );
    }

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: startDate, endDate' },
        { status: 400 }
      );
    }

    const analysis = await analyzeFunnel(steps, new Date(startDate), new Date(endDate));

    return NextResponse.json({
      name,
      steps: analysis,
      totalSteps: steps.length,
    });
  } catch (error) {
    console.error('Funnel analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze funnel' }, { status: 500 });
  }
}
