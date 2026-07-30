/**
 * Sentry Error Tracking Configuration
 * Captures errors, performance issues, and custom events
 */

import * as Sentry from "@sentry/nextjs";

export function initSentry() {
  if (typeof window !== "undefined") {
    // Client-side Sentry configuration
    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "production",
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
      denyUrls: [
        // Browser extensions
        /extensions\//i,
        /^chrome:\/\//i,
        // Remove Sentry's own scripts from error reporting
        /sentry_key/i,
      ],
      integrations: [
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
          maskAllInputs: true,
        }),
      ],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      beforeSend(event, hint) {
        // Filter out errors from development tools
        if (event.request?.url?.includes("localhost")) {
          return null;
        }

        // Ignore certain error types
        if (hint.originalException) {
          const error = hint.originalException as Error;
          if (error.message?.includes("Script error")) {
            return null;
          }
        }

        return event;
      },
      release: process.env.NEXT_PUBLIC_APP_VERSION,
    });
  }
}

export function initServerSentry() {
  // Server-side Sentry configuration
  if (process.env.NODE_ENV === "production") {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "production",
      tracesSampleRate: 0.1,
      serverName: process.env.VERCEL_ENV || "production",
      integrations: [
        new Sentry.Integrations.Http({ tracing: true }),
        new Sentry.Integrations.OnUncaughtException(),
        new Sentry.Integrations.OnUnhandledRejection(),
      ],
      release: process.env.NEXT_PUBLIC_APP_VERSION,
      beforeSend(event) {
        // Filter sensitive data
        if (event.request?.cookies) {
          delete event.request.cookies;
        }
        if (event.request?.headers?.authorization) {
          event.request.headers.authorization = "[REDACTED]";
        }
        return event;
      },
    });
  }
}

/**
 * Custom Error Reporting
 */
export function reportError(
  error: Error,
  context?: Record<string, unknown>,
  level: "fatal" | "error" | "warning" | "info" = "error"
) {
  Sentry.captureException(error, {
    level,
    contexts: {
      custom: context,
    },
  });
}

/**
 * Performance Monitoring
 */
export function startTransaction(
  name: string,
  op: string = "http.request"
): ReturnType<typeof Sentry.startTransaction> {
  return Sentry.startTransaction({
    name,
    op,
    sampled: process.env.NODE_ENV === "production",
  });
}

/**
 * Custom Metrics
 */
export interface CustomMetric {
  name: string;
  value: number;
  unit?: string;
  tags?: Record<string, string>;
}

export function captureMetric(metric: CustomMetric) {
  Sentry.captureMessage(
    `Metric: ${metric.name} = ${metric.value}${metric.unit ? ` ${metric.unit}` : ""}`,
    "info",
    {
      tags: {
        metric: metric.name,
        ...metric.tags,
      },
      extra: {
        value: metric.value,
        unit: metric.unit,
      },
    }
  );
}

/**
 * User Context
 */
export function setUserContext(userId: string, email: string, tier: string) {
  Sentry.setUser({
    id: userId,
    email,
    ip_address: "{{auto}}",
    tier,
  });
}

export function clearUserContext() {
  Sentry.setUser(null);
}

/**
 * Breadcrumbs for tracking user actions
 */
export function addBreadcrumb(
  message: string,
  category: string = "user-action",
  level: "fatal" | "error" | "warning" | "info" | "debug" = "info",
  data?: Record<string, unknown>
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
    timestamp: Date.now() / 1000,
  });
}

/**
 * Performance Timing
 */
export async function measurePerformance<T>(
  fn: () => Promise<T>,
  operationName: string
): Promise<T> {
  const startTime = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - startTime;

    captureMetric({
      name: operationName,
      value: duration,
      unit: "ms",
    });

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    reportError(error as Error, {
      operation: operationName,
      duration,
    });
    throw error;
  }
}

/**
 * Release Tracking
 */
export function recordRelease(version: string, environment: string) {
  Sentry.captureMessage(`Release ${version} deployed to ${environment}`, "info");
}

export default {
  initSentry,
  initServerSentry,
  reportError,
  startTransaction,
  captureMetric,
  setUserContext,
  clearUserContext,
  addBreadcrumb,
  measurePerformance,
  recordRelease,
};
