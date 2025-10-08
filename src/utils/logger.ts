/**
 * Type-safe logger utility
 * Replaces console.log/error/warn with structured logging
 * Automatically sends errors to Sentry in production
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDev = import.meta.env.DEV;
  private isTest = import.meta.env.MODE === 'test';

  /**
   * Internal logging method with timestamp and level formatting
   */
  private log(level: LogLevel, message: string, context?: LogContext): void {
    // Skip all logs in test environment unless explicitly enabled
    if (this.isTest && !import.meta.env.VITE_ENABLE_TEST_LOGS) {
      return;
    }

    // Skip debug logs in production
    if (!this.isDev && level === 'debug') {
      return;
    }

    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    const args = context ? [prefix, message, context] : [prefix, message];

    switch (level) {
      case 'debug':
      case 'info':
        console.log(...args);
        break;
      case 'warn':
        console.warn(...args);
        break;
      case 'error':
        console.error(...args);
        // Send to Sentry in production
        if (!this.isDev && typeof window !== 'undefined') {
          try {
            // Dynamically import Sentry to avoid issues if not configured
            import('@sentry/react').then(({ captureException, captureMessage }) => {
              if (context?.error instanceof Error) {
                captureException(context.error, {
                  extra: { message, ...context }
                });
              } else {
                captureMessage(message, {
                  level: 'error',
                  extra: context
                });
              }
            }).catch(() => {
              // Sentry not available, fail silently
            });
          } catch {
            // Fail silently if Sentry is not available
          }
        }
        break;
    }
  }

  /**
   * Debug level logging (development only)
   * Use for verbose logging during development
   * 
   * @example
   * logger.debug('User clicked button', { userId: '123', buttonId: 'submit' });
   */
  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  /**
   * Info level logging
   * Use for general informational messages
   * 
   * @example
   * logger.info('User logged in', { userId: '123' });
   */
  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  /**
   * Warning level logging
   * Use for potentially problematic situations
   * 
   * @example
   * logger.warn('API response slow', { duration: 5000, endpoint: '/api/users' });
   */
  warn(message: string, context?: LogContext): void {
    this.log('warn', message, context);
  }

  /**
   * Error level logging
   * Use for error conditions, automatically sent to Sentry in production
   * 
   * @example
   * logger.error('Failed to fetch user data', { error, userId: '123' });
   */
  error(message: string, context?: LogContext): void {
    this.log('error', message, context);
  }

  /**
   * Group multiple log messages together (development only)
   * Useful for debugging complex operations
   * 
   * @example
   * logger.group('User Registration Flow', () => {
   *   logger.debug('Validating form...');
   *   logger.debug('Creating user...');
   *   logger.debug('Sending welcome email...');
   * });
   */
  group(label: string, callback: () => void): void {
    if (!this.isDev) return;
    
    console.group(label);
    try {
      callback();
    } finally {
      console.groupEnd();
    }
  }

  /**
   * Create a scoped logger with a prefix
   * Useful for component-specific logging
   * 
   * @example
   * const componentLogger = logger.createScope('ProductCard');
   * componentLogger.debug('Rendering', { productId: '123' });
   * // Output: [2025-10-08...] [DEBUG] [ProductCard] Rendering { productId: '123' }
   */
  createScope(scope: string) {
    return {
      debug: (message: string, context?: LogContext) => 
        this.debug(`[${scope}] ${message}`, context),
      info: (message: string, context?: LogContext) => 
        this.info(`[${scope}] ${message}`, context),
      warn: (message: string, context?: LogContext) => 
        this.warn(`[${scope}] ${message}`, context),
      error: (message: string, context?: LogContext) => 
        this.error(`[${scope}] ${message}`, context),
    };
  }
}

/**
 * Global logger instance
 * Use this throughout the application instead of console.log/error/warn
 * 
 * @example
 * import { logger } from '@/utils/logger';
 * 
 * // Basic usage
 * logger.debug('Something happened');
 * logger.info('User action', { userId: '123' });
 * logger.warn('Deprecated API used', { api: '/old-endpoint' });
 * logger.error('Request failed', { error, endpoint: '/api/users' });
 * 
 * // Scoped logging
 * const log = logger.createScope('MyComponent');
 * log.debug('Component mounted');
 */
export const logger = new Logger();

/**
 * Type guard to check if an error is an Error instance
 */
export const isError = (error: unknown): error is Error => {
  return error instanceof Error;
};

/**
 * Format error for logging
 */
export const formatError = (error: unknown): LogContext => {
  if (isError(error)) {
    return {
      error,
      message: error.message,
      stack: error.stack,
      name: error.name,
    };
  }
  return { error: String(error) };
};
