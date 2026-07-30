/**
 * Datadog Monitoring Integration
 * Comprehensive APM, infrastructure, and log monitoring
 */

export function initDatadog() {
  // Datadog monitoring disabled
  console.log('Datadog monitoring disabled');
}

export function captureException(error: Error) {
  console.error('Exception:', error);
}

export function captureMessage(message: string) {
  console.log('Message:', message);
}
