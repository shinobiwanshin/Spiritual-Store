/**
 * Sentry Error Utilities
 *
 * Helper functions for capturing errors and adding context to Sentry.
 * Use these in API routes and server components for better error tracking.
 */

import * as Sentry from "@sentry/nextjs";

/**
 * Capture an API error with additional context
 *
 * Use this in catch blocks of API routes to send errors to Sentry
 * with request context like route, method, and user info.
 */
export function captureApiError(
  error: unknown,
  context?: {
    route?: string;
    method?: string;
    userId?: string;
    extra?: Record<string, unknown>;
  },
) {
  Sentry.withScope((scope) => {
    if (context?.route) {
      scope.setTag("api.route", context.route);
    }
    if (context?.method) {
      scope.setTag("api.method", context.method);
    }
    if (context?.userId) {
      scope.setUser({ id: context.userId });
    }
    if (context?.extra) {
      scope.setExtras(context.extra);
    }

    Sentry.captureException(error);
  });
}

/**
 * Set the current user for Sentry tracking
 *
 * Call this after authentication to associate errors with users.
 */
export function setSentryUser(user: {
  id: string;
  email?: string;
  username?: string;
}) {
  Sentry.setUser(user);
}

/**
 * Clear the current user (on logout)
 */
export function clearSentryUser() {
  Sentry.setUser(null);
}

/**
 * Add a breadcrumb for debugging
 *
 * Breadcrumbs are trail of events leading up to an error.
 */
export function addBreadcrumb(
  message: string,
  category: string = "custom",
  level: Sentry.SeverityLevel = "info",
  data?: Record<string, unknown>,
) {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
}

/**
 * Wrap an async function with Sentry error capturing
 *
 * Useful for wrapping API handlers or server actions.
 */
export function withSentryCapture<
  T extends (...args: unknown[]) => Promise<unknown>,
>(fn: T, context?: { operation: string }): T {
  return (async (...args: unknown[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      Sentry.withScope((scope) => {
        if (context?.operation) {
          scope.setTag("operation", context.operation);
        }
        Sentry.captureException(error);
      });
      throw error;
    }
  }) as T;
}
