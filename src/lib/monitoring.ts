/**
 * 📊 Monitoring & Error Tracking Setup
 * 
 * Tích hợp Sentry để theo dõi lỗi và performance trong production.
 * Chỉ hoạt động khi PROD mode để tránh noise trong development.
 */

import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry error tracking
 * 
 * Cấu hình:
 * - DSN: Lấy từ env variable VITE_SENTRY_DSN
 * - Environment: production, staging, hoặc development
 * - Trace sampling: 10% requests để giảm cost
 * - Session replay: Capture 10% sessions, 100% errors
 */
export function initMonitoring() {
  // Chỉ init trong production để tránh spam development errors
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE || 'production',
      
      // Performance Monitoring
      tracesSampleRate: 0.1, // Capture 10% of transactions (giảm cost)
      
      // Integrations will be added automatically by Sentry v10+
      // (BrowserTracing and Replay are auto-enabled)
      integrations: [],
      
      // Session Replay sampling rates
      replaysSessionSampleRate: 0.1, // Capture 10% sessions bình thường
      replaysOnErrorSampleRate: 1.0, // Capture 100% sessions có lỗi
      
      // Error filtering - ignore common non-critical errors
      beforeSend(event, hint) {
        // Ignore errors from browser extensions
        if (event.exception?.values?.[0]?.stacktrace?.frames?.some(
          frame => frame.filename?.includes('extensions/')
        )) {
          return null;
        }
        
        // Ignore network errors (thường do user network issues)
        if (event.message?.includes('NetworkError')) {
          return null;
        }
        
        return event;
      },
    });
    
    console.log('✅ Sentry monitoring initialized');
  } else {
    console.log('ℹ️ Sentry monitoring disabled (dev mode or no DSN)');
  }
}

/**
 * Manual error logging helper
 * 
 * Usage:
 * ```ts
 * try {
 *   riskyOperation();
 * } catch (error) {
 *   logError(error, { context: 'checkout', userId: '123' });
 * }
 * ```
 */
export function logError(error: unknown, context?: Record<string, any>) {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  } else {
    console.error('Error:', error, context);
  }
}

/**
 * Set user context for error tracking
 * 
 * Usage:
 * ```ts
 * setUser({ id: '123', email: 'user@example.com' });
 * ```
 */
export function setUser(user: { id?: string; email?: string; username?: string } | null) {
  if (import.meta.env.PROD) {
    Sentry.setUser(user);
  }
}

/**
 * Add breadcrumb for debugging context
 * 
 * Usage:
 * ```ts
 * addBreadcrumb('User clicked checkout button', { cartItems: 3 });
 * ```
 */
export function addBreadcrumb(message: string, data?: Record<string, any>) {
  if (import.meta.env.PROD) {
    Sentry.addBreadcrumb({
      message,
      data,
      level: 'info',
    });
  }
}

/**
 * Performance measurement helper
 * 
 * Usage:
 * ```ts
 * const transaction = startTransaction('checkout-flow');
 * // ... do work ...
 * transaction.finish();
 * ```
 */
export function startTransaction(name: string, op?: string) {
  if (import.meta.env.PROD) {
    return Sentry.startTransaction({ name, op: op || 'function' });
  }
  return {
    finish: () => {},
    setStatus: () => {},
  };
}
