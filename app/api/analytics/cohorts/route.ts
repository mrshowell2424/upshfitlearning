/**
 * Cohort Analysis API
 * Analyze user cohorts and their behaviors
 */

import { NextRequest, NextResponse } from 'next/server';
import { analyzeCohort } from '@/lib/analytics-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, startDate, endDate } = body;

    if (!name || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: name, startDate, endDate' },
        { status: 400 }
      );
    }

    const cohortDefinition = {
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    };

    const analysis = await analyzeCohort(cohortDefinition);

    return NextResponse.json(analysis);
  } catch (error) {
    console.error('Cohort analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze cohort' }, { status: 500 });
  }
}
