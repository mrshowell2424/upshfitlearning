/**
 * Datadog Monitoring Integration
 * Comprehensive APM, infrastructure, and log monitoring
 */

import { datadogRum } from "@datadog/browser-rum";
import { datadogLogs } from "@datadog/browser-logs";

export function initDatadog() {
  if (typeof window === "undefined") return;

  // Initialize RUM (Real User Monitoring)
  datadogRum.init({
    applicationId: process.env.NEXT_PUBLIC_DATADOG_APP_ID || "",
    clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || "",
    site: "datadoghq.com",
    service: "upshift-learning-hub",
    env: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "production",
    version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
    sessionSampleRate: 100,
    sessionReplaySampleRate: 20,
    trackUserInteractions: true,
    trackResources: true,
    trackLongTasks: true,
    defaultPrivacyLevel: "mask-user-input",
  });

  // Start RUM
  datadogRum.startSessionReplayRecording();

  // Initialize Logs
  datadogLogs.init({
    clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN || "",
    site: "datadoghq.com",
    service: "upshift-learning-hub",
    env: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "production",
    sessionSampleRate: 100,
  });

  datadogLogs.logger.setLevel("info");
}

/**
 * Custom metrics for Datadog
 */
export interface DatadogMetric {
  name: string;
  value: number;
  timestamp?: number;
  tags?: string[];
}

export function sendMetric(metric: DatadogMetric) {
  if (typeof window === "undefined") return;

  fetch("https://api.datadoghq.com/api/v1/series", {
    method: "POST",
    headers: {
      "DD-API-KEY": process.env.NEXT_PUBLIC_DATADOG_API_KEY || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      series: [
        {
          metric: `upshift.${metric.name}`,
          points: [[metric.timestamp || Math.floor(Date.now() / 1000), metric.value]],
          type: "gauge",
          tags: metric.tags || [],
        },
      ],
    }),
  }).catch((error) => {
    console.error("Failed to send Datadog metric:", error);
  });
}

/**
 * RUM Events
 */
export enum RumEventType {
  // User interactions
  CLICK = "click",
  SUBMIT = "submit",
  SCROLL = "scroll",
  INPUT = "input",

  // Page navigation
  PAGE_VIEW = "page_view",
  PAGE_CHANGE = "page_change",

  // Performance
  LONG_TASK = "long_task",
  SLOW_API = "slow_api",

  // Errors
  ERROR = "error",
  CRASH = "crash",
}

export interface RumEvent {
  type: RumEventType;
  name: string;
  properties?: Record<string, unknown>;
  duration?: number;
}

export function recordRumEvent(event: RumEvent) {
  datadogRum.addUserAction(event.name, "custom", {
    type: event.type,
    ...event.properties,
    duration: event.duration,
  });
}

/**
 * Log Events
 */
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogEvent {
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: Error;
}

export function logEvent(event: LogEvent) {
  const logger = datadogLogs.logger;

  const logData = {
    service: "upshift-learning-hub",
    env: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
    ...event.context,
  };

  if (event.error) {
    logData["error"] = {
      message: event.error.message,
      stack: event.error.stack,
    };
  }

  switch (event.level) {
    case LogLevel.DEBUG:
      logger.debug(event.message, logData);
      break;
    case LogLevel.INFO:
      logger.info(event.message, logData);
      break;
    case LogLevel.WARN:
      logger.warn(event.message, logData);
      break;
    case LogLevel.ERROR:
      logger.error(event.message, logData);
      break;
  }
}

/**
 * Server-side Datadog Agent Setup
 * Configure via environment variables or dd-trace initialization
 */
export function initServerDatadog() {
  if (process.env.NODE_ENV !== "production") return;

  try {
    const tracer = require("dd-trace").default;

    tracer.init({
      service: "upshift-learning-hub",
      env: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || "production",
      version: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
      logInjection: true,
      analytics: true,
    });

    // Patch HTTP module for automatic tracing
    tracer.use("pg", {
      service: "postgres",
    });

    tracer.use("http", {
      service: "http",
    });
  } catch (error) {
    console.warn("Failed to initialize Datadog server tracing:", error);
  }
}

/**
 * APM Tracing
 */
export function startTrace(name: string, resource: string = name) {
  if (typeof window === "undefined") return null;

  return datadogRum.startResource(resource, "xhr", {});
}

export function endTrace(traceId: any) {
  if (!traceId) return;

  datadogRum.stopResource(traceId);
}

/**
 * User Tracking
 */
export function setDatadogUser(
  userId: string,
  email: string,
  tier: string,
  additionalData?: Record<string, unknown>
) {
  datadogRum.setUser({
    id: userId,
    email,
    name: email.split("@")[0],
    tier,
    ...additionalData,
  });
}

export function clearDatadogUser() {
  datadogRum.clearUser();
}

/**
 * Error Tracking
 */
export function captureDatadogError(error: Error, context?: Record<string, unknown>) {
  datadogRum.addError(error, {
    context: context || {},
  });

  logEvent({
    level: LogLevel.ERROR,
    message: error.message,
    error,
    context,
  });
}

export default {
  initDatadog,
  initServerDatadog,
  sendMetric,
  recordRumEvent,
  logEvent,
  startTrace,
  endTrace,
  setDatadogUser,
  clearDatadogUser,
  captureDatadogError,
};
