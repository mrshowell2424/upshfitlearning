/**
 * Admin Metrics API
 * Provides aggregated metrics for dashboard visualization
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users, subscriptions, generated_materials } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';

interface MetricsResponse {
  current: {
    errorRate: number;
    apiResponseTime: number;
    databaseQueryTime: number;
    activeUsers: number;
    lessonsGenerated: number;
    paymentsProcessed: number;
    resourcesSaved: number;
    uptime: number;
  };
  timeSeries: Record<string, any[]>;
  alerts: Array<{
    severity: 'critical' | 'warning' | 'info';
    message: string;
    timestamp: number;
  }>;
}

// Store for time-series data (in production, use a real time-series DB)
const timeSeriesData: Map<string, any[]> = new Map();

export async function GET(request: NextRequest) {
  try {
    // Check admin authorization
    const authHeader = request.headers.get('authorization');
    const isAdmin = authHeader?.includes('Bearer admin_token'); // Replace with real auth

    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch current metrics from database
    const userCount = await db
      .select({ count: sql`count(*)` })
      .from(users);

    const paidUsersCount = await db
      .select({ count: sql`count(*)` })
      .from(subscriptions)
      .where(sql`status = 'active'`);

    const lessonsCount = await db
      .select({ count: sql`count(*)` })
      .from(generated_materials);

    // Calculate metrics (these would come from monitoring in production)
    const errorRate = Math.random() * 0.5; // Simulated for demo
    const apiResponseTime = 150 + Math.random() * 350; // 150-500ms
    const databaseQueryTime = 50 + Math.random() * 150; // 50-200ms
    const activeUsers = Math.floor((userCount[0]?.count as any) * 0.3); // 30% of total users
    const lessonsGenerated = (lessonsCount[0]?.count as any) || 0;
    const paymentsProcessed = (paidUsersCount[0]?.count as any) || 0;
    const resourcesSaved = Math.floor(activeUsers * 2); // Avg 2 saves per active user
    const uptime = 99.95;

    // Update time-series data
    const timestamp = Date.now();
    updateTimeSeries('errorRate', { timestamp, value: errorRate });
    updateTimeSeries('apiResponseTime', { timestamp, value: apiResponseTime });
    updateTimeSeries('databaseQueryTime', { timestamp, value: databaseQueryTime });
    updateTimeSeries('lessonsGenerated', { timestamp, value: lessonsGenerated });

    // Determine alerts
    const alerts = [];
    if (errorRate > 1) {
      alerts.push({
        severity: 'critical' as const,
        message: `High error rate: ${errorRate.toFixed(2)}%`,
        timestamp,
      });
    }
    if (apiResponseTime > 1000) {
      alerts.push({
        severity: 'warning' as const,
        message: `Slow API response: ${apiResponseTime.toFixed(0)}ms`,
        timestamp,
      });
    }
    if (databaseQueryTime > 500) {
      alerts.push({
        severity: 'warning' as const,
        message: `Slow database queries: ${databaseQueryTime.toFixed(0)}ms`,
        timestamp,
      });
    }

    const response: MetricsResponse = {
      current: {
        errorRate,
        apiResponseTime,
        databaseQueryTime,
        activeUsers,
        lessonsGenerated,
        paymentsProcessed,
        resourcesSaved,
        uptime,
      },
      timeSeries: Object.fromEntries(timeSeriesData),
      alerts,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Failed to fetch metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

function updateTimeSeries(
  metricName: string,
  dataPoint: { timestamp: number; value: number }
) {
  if (!timeSeriesData.has(metricName)) {
    timeSeriesData.set(metricName, []);
  }

  const series = timeSeriesData.get(metricName)!;
  series.push({
    timestamp: dataPoint.timestamp,
    value: dataPoint.value,
    average: series.reduce((sum, d) => sum + d.value, dataPoint.value) / (series.length + 1),
    min: Math.min(...series.map(d => d.value), dataPoint.value),
    max: Math.max(...series.map(d => d.value), dataPoint.value),
  });

  // Keep only last 1000 data points (for memory efficiency)
  if (series.length > 1000) {
    series.shift();
  }
}
