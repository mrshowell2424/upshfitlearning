/**
 * Application Metrics and Performance Monitoring
 * Tracks key business and technical metrics
 */

export interface AppMetrics {
  // Performance
  pageLoadTime: number;
  apiResponseTime: number;
  databaseQueryTime: number;
  errorRate: number;

  // Business
  activeUsers: number;
  paidUsers: number;
  resourcesGenerated: number;
  lessonsCreated: number;

  // Infrastructure
  cpuUsage: number;
  memoryUsage: number;
  databaseConnections: number;
  queueDepth: number;

  // User Experience
  pageLoadErrors: number;
  apiErrors: number;
  timeoutErrors: number;
  authErrors: number;
}

/**
 * Thresholds for alerting
 */
export const ALERT_THRESHOLDS = {
  // Performance thresholds
  pageLoadTimeMs: 3000, // 3 seconds
  apiResponseTimeMs: 1000, // 1 second
  databaseQueryTimeMs: 500, // 500ms
  errorRatePercent: 1, // 1% error rate

  // Infrastructure thresholds
  cpuUsagePercent: 80,
  memoryUsagePercent: 85,
  databaseConnectionsMax: 50,
  queueDepthMax: 100,

  // Business thresholds
  minActiveUsersDaily: 10,
  minResourcesGeneratedDaily: 5,
};

/**
 * Metric Collection
 */
export class MetricsCollector {
  private metrics: Map<string, number[]> = new Map();
  private windowSize = 60; // Keep last 60 data points

  record(metricName: string, value: number, timestamp: number = Date.now()) {
    if (!this.metrics.has(metricName)) {
      this.metrics.set(metricName, []);
    }

    const values = this.metrics.get(metricName)!;
    values.push(value);

    // Keep only recent data
    if (values.length > this.windowSize) {
      values.shift();
    }
  }

  getMetric(metricName: string): number | null {
    const values = this.metrics.get(metricName);
    if (!values || values.length === 0) return null;

    return values[values.length - 1];
  }

  getAverage(metricName: string): number | null {
    const values = this.metrics.get(metricName);
    if (!values || values.length === 0) return null;

    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }

  getMax(metricName: string): number | null {
    const values = this.metrics.get(metricName);
    if (!values || values.length === 0) return null;

    return Math.max(...values);
  }

  getMin(metricName: string): number | null {
    const values = this.metrics.get(metricName);
    if (!values || values.length === 0) return null;

    return Math.min(...values);
  }

  getPercentile(metricName: string, percentile: number): number | null {
    const values = this.metrics.get(metricName);
    if (!values || values.length === 0) return null;

    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;

    return sorted[Math.max(0, index)];
  }

  exportMetrics(): Record<string, any> {
    const exported: Record<string, any> = {};

    for (const [name, values] of this.metrics) {
      exported[name] = {
        current: values[values.length - 1],
        average: this.getAverage(name),
        min: this.getMin(name),
        max: this.getMax(name),
        p95: this.getPercentile(name, 95),
        p99: this.getPercentile(name, 99),
        count: values.length,
      };
    }

    return exported;
  }

  reset() {
    this.metrics.clear();
  }
}

/**
 * Event Types for Custom Analytics
 */
export enum EventType {
  // User events
  USER_SIGNUP = "user_signup",
  USER_LOGIN = "user_login",
  USER_LOGOUT = "user_logout",

  // Payment events
  SUBSCRIPTION_CREATED = "subscription_created",
  SUBSCRIPTION_CANCELLED = "subscription_cancelled",
  PAYMENT_FAILED = "payment_failed",

  // Content events
  STANDARD_SEARCHED = "standard_searched",
  RESOURCE_VIEWED = "resource_viewed",
  RESOURCE_SAVED = "resource_saved",
  LESSON_GENERATED = "lesson_generated",
  LESSON_DOWNLOADED = "lesson_downloaded",

  // Integration events
  GOOGLE_SHEETS_SYNCED = "google_sheets_synced",
  SUBSTACK_ARTICLE_INGESTED = "substack_article_ingested",
  CLAUDE_GENERATION_COMPLETED = "claude_generation_completed",

  // Error events
  API_ERROR = "api_error",
  DATABASE_ERROR = "database_error",
  EXTERNAL_API_ERROR = "external_api_error",

  // Performance events
  PAGE_SLOW_LOAD = "page_slow_load",
  API_SLOW_RESPONSE = "api_slow_response",
}

export interface TrackingEvent {
  type: EventType;
  userId?: string;
  email?: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

/**
 * Analytics Tracking
 */
export class AnalyticsTracker {
  private events: TrackingEvent[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds

  constructor(private onFlush?: (events: TrackingEvent[]) => Promise<void>) {
    // Auto-flush periodically
    if (typeof window !== "undefined") {
      setInterval(() => this.flush(), this.flushInterval);
    }
  }

  track(event: TrackingEvent) {
    event.timestamp = event.timestamp || Date.now();
    this.events.push(event);

    if (this.events.length >= this.batchSize) {
      this.flush();
    }
  }

  async flush() {
    if (this.events.length === 0) return;

    const eventsToFlush = [...this.events];
    this.events = [];

    if (this.onFlush) {
      try {
        await this.onFlush(eventsToFlush);
      } catch (error) {
        console.error("Failed to flush analytics events:", error);
        // Re-add events on failure
        this.events.unshift(...eventsToFlush);
      }
    }
  }

  getQueueSize(): number {
    return this.events.length;
  }
}

/**
 * Performance Observer
 */
export class PerformanceObserver {
  private entries: PerformanceEntry[] = [];

  observe() {
    if (typeof window === "undefined") return;

    // Observe long tasks
    if ("PerformanceObserver" in window) {
      try {
        const observer = new window.PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            this.entries.push(entry);

            if (
              entry.duration > ALERT_THRESHOLDS.pageLoadTimeMs &&
              entry.entryType === "longtask"
            ) {
              console.warn(`Long task detected: ${entry.duration}ms`);
            }
          }
        });

        observer.observe({ entryTypes: ["longtask", "measure", "navigation"] });
      } catch (e) {
        // Long tasks not supported
      }
    }
  }

  getMetrics() {
    if (typeof window === "undefined") {
      return null;
    }

    const navigation = performance.getEntriesByType("navigation")[0] as
      | PerformanceNavigationTiming
      | undefined;

    if (!navigation) return null;

    return {
      dnsDuration: navigation.domainLookupEnd - navigation.domainLookupStart,
      tcpDuration: navigation.connectEnd - navigation.connectStart,
      tlsDuration: navigation.secureConnectionStart
        ? navigation.connectEnd - navigation.secureConnectionStart
        : 0,
      requestDuration: navigation.responseStart - navigation.requestStart,
      responseDuration: navigation.responseEnd - navigation.responseStart,
      domInteractiveDuration:
        navigation.domInteractive - navigation.responseEnd,
      domCompleteDuration: navigation.domComplete - navigation.domInteractive,
      loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
      totalTime: navigation.loadEventEnd - navigation.fetchStart,
    };
  }

  clear() {
    this.entries = [];
  }
}

export default {
  ALERT_THRESHOLDS,
  MetricsCollector,
  EventType,
  AnalyticsTracker,
  PerformanceObserver,
};
