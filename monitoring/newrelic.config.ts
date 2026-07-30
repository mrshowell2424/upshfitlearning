/**
 * New Relic Monitoring Integration
 * APM, infrastructure, and log monitoring
 */

// Client-side (browser) monitoring
export function initNewRelicBrowser() {
  if (typeof window === "undefined") return;

  // New Relic browser monitoring script
  // Add to HTML head:
  // <script src="https://js-agent.newrelic.com/nr-loader-full.min.js"></script>

  if ((window as any).newrelic) {
    const newrelic = (window as any).newrelic;

    // Set custom attributes
    newrelic.setCustomAttribute("environment", process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT);
    newrelic.setCustomAttribute("version", process.env.NEXT_PUBLIC_APP_VERSION);
    newrelic.setCustomAttribute("service", "upshift-learning-hub");
  }
}

/**
 * New Relic Custom Events
 */
export interface NewRelicEvent {
  eventType: string;
  userId?: string;
  email?: string;
  [key: string]: any;
}

export function recordNewRelicEvent(event: NewRelicEvent) {
  if (typeof window === "undefined") return;

  if ((window as any).newrelic) {
    (window as any).newrelic.recordCustomEvent(event.eventType, {
      timestamp: Date.now(),
      service: "upshift-learning-hub",
      ...event,
    });
  }
}

/**
 * Custom Metrics
 */
export interface NewRelicMetric {
  name: string;
  value: number;
  unit?: string;
  attributes?: Record<string, string | number>;
}

export function recordNewRelicMetric(metric: NewRelicMetric) {
  if (typeof window === "undefined") return;

  if ((window as any).newrelic) {
    (window as any).newrelic.recordMetric(
      metric.name,
      metric.value,
      metric.unit
    );
  }
}

/**
 * Page View Tracking
 */
export function trackPageView(
  pageName: string,
  attributes?: Record<string, unknown>
) {
  recordNewRelicEvent({
    eventType: "PageView",
    pageName,
    ...attributes,
  });
}

/**
 * User Identification
 */
export function setNewRelicUser(
  userId: string,
  email: string,
  tier: string
) {
  if (typeof window === "undefined") return;

  if ((window as any).newrelic) {
    (window as any).newrelic.setCustomAttribute("userId", userId);
    (window as any).newrelic.setCustomAttribute("email", email);
    (window as any).newrelic.setCustomAttribute("tier", tier);
  }
}

/**
 * Error Tracking
 */
export function noticeNewRelicError(
  error: Error,
  context?: Record<string, unknown>
) {
  if (typeof window === "undefined") return;

  if ((window as any).newrelic) {
    (window as any).newrelic.noticeError(error, context);
  }

  recordNewRelicEvent({
    eventType: "Error",
    errorMessage: error.message,
    errorStack: error.stack,
    ...context,
  });
}

/**
 * Performance Monitoring
 */
export class NewRelicPerformanceMonitor {
  private marks: Map<string, number> = new Map();

  startMeasure(name: string) {
    performance.mark(`${name}-start`);
    this.marks.set(name, performance.now());
  }

  endMeasure(name: string) {
    performance.mark(`${name}-end`);

    try {
      performance.measure(name, `${name}-start`, `${name}-end`);

      const measure = performance.getEntriesByName(name)[0] as PerformanceMeasure;
      if (measure) {
        recordNewRelicMetric({
          name: `Custom/${name}`,
          value: measure.duration,
          unit: "ms",
        });
      }
    } catch (e) {
      // Measurement failed
    }

    this.marks.delete(name);
  }

  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>
  ): Promise<T> {
    this.startMeasure(name);
    try {
      return await fn();
    } finally {
      this.endMeasure(name);
    }
  }
}

/**
 * Application Performance Index (Apdex)
 */
export function trackApdex(
  transactionName: string,
  duration: number,
  satisfiedThreshold: number = 0.5 // 500ms
) {
  recordNewRelicEvent({
    eventType: "Apdex",
    transactionName,
    duration,
    satisfied: duration <= satisfiedThreshold * 1000,
    tolerating: duration <= satisfiedThreshold * 4 * 1000,
  });
}

/**
 * Server-side APM (Node.js)
 */
export function initNewRelicServer() {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  if (process.env.NEW_RELIC_LICENSE_KEY) {
    try {
      require("newrelic");
    } catch (e) {
      console.warn("New Relic not available on server");
    }
  }
}

/**
 * Database Query Monitoring
 */
export interface DatabaseQueryMetrics {
  query: string;
  duration: number;
  rows?: number;
  error?: Error;
}

export function recordDatabaseMetrics(metrics: DatabaseQueryMetrics) {
  recordNewRelicEvent({
    eventType: "DatabaseQuery",
    query: metrics.query.substring(0, 100), // Truncate long queries
    duration: metrics.duration,
    rows: metrics.rows,
    hasError: !!metrics.error,
  });

  recordNewRelicMetric({
    name: "Database/QueryTime",
    value: metrics.duration,
    unit: "ms",
    attributes: {
      queryType: metrics.query.split(" ")[0],
    },
  });
}

/**
 * External API Call Monitoring
 */
export interface ExternalApiMetrics {
  service: string;
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  error?: Error;
}

export function recordExternalApiMetrics(metrics: ExternalApiMetrics) {
  recordNewRelicEvent({
    eventType: "ExternalApi",
    service: metrics.service,
    endpoint: metrics.endpoint,
    method: metrics.method,
    statusCode: metrics.statusCode,
    duration: metrics.duration,
    hasError: !!metrics.error,
  });

  recordNewRelicMetric({
    name: `ExternalApi/${metrics.service}/ResponseTime`,
    value: metrics.duration,
    unit: "ms",
  });
}

/**
 * Business Metrics
 */
export interface BusinessMetrics {
  event: string;
  userId?: string;
  value?: number;
  currency?: string;
}

export function recordBusinessMetrics(metrics: BusinessMetrics) {
  recordNewRelicEvent({
    eventType: "Business",
    event: metrics.event,
    userId: metrics.userId,
    value: metrics.value,
    currency: metrics.currency || "USD",
  });
}

export default {
  initNewRelicBrowser,
  initNewRelicServer,
  recordNewRelicEvent,
  recordNewRelicMetric,
  trackPageView,
  setNewRelicUser,
  noticeNewRelicError,
  NewRelicPerformanceMonitor,
  trackApdex,
  recordDatabaseMetrics,
  recordExternalApiMetrics,
  recordBusinessMetrics,
};
