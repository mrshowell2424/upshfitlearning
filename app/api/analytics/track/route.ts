/**
 * Analytics Event Tracking API
 * Handles event ingestion from frontend and backend
 */

import { NextRequest, NextResponse } from 'next/server';
import { trackEvent, EventType, EventCategory } from '@/lib/analytics-engine';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { type, category, userId, sessionId, data, properties } = body;

    // Validate required fields
    if (!type || !category || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, category, sessionId' },
        { status: 400 }
      );
    }

    // Validate enum values
    if (!Object.values(EventType).includes(type)) {
      return NextResponse.json({ error: `Invalid event type: ${type}` }, { status: 400 });
    }

    if (!Object.values(EventCategory).includes(category)) {
      return NextResponse.json({ error: `Invalid event category: ${category}` }, { status: 400 });
    }

    // Track the event
    await trackEvent({
      type: type as EventType,
      category: category as EventCategory,
      userId,
      sessionId,
      data,
      properties,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Event tracking error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}
