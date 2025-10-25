/**
 * 🛡️ Error Boundary Component
 * 
 * Catches React component rendering errors and displays user-friendly fallback UI.
 * Automatically sends errors to Sentry for monitoring and debugging.
 * 
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 * 
 * Features:
 * - ✅ Catches render errors in child components
 * - ✅ Sends errors to Sentry with full context
 * - ✅ Displays user-friendly error UI
 * - ✅ Provides recovery options (reload, go home)
 * - ✅ Logs detailed error info for debugging
 * - ✅ Supports error boundary nesting
 * - ✅ Production-ready with fallbacks
 */

import React, { ReactNode, ErrorInfo } from 'react';
import { AlertCircle, Home, RotateCcw } from 'lucide-react';
import * as Sentry from '@sentry/react';
import { logger } from '@/utils/logger';

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'page' | 'section' | 'component';
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * 🛡️ Error Boundary Component
 * 
 * Catches unhandled React component errors and provides graceful error handling.
 * Integrates with Sentry for production monitoring.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  /**
   * Update state when an error is caught
   * Called during render phase (synchronous)
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error
    };
  }

  /**
   * Log error details when an error is caught
   * Called after render phase (can be async)
   */
  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Update state with error info
    this.setState({
      errorInfo,
      errorId
    });

    // Log detailed error information
    logger.error('React component error caught by ErrorBoundary', {
      errorId,
      errorMessage: error.message,
      errorStack: error.stack,
      componentStack: errorInfo.componentStack,
      level: this.props.level || 'component',
      url: typeof window !== 'undefined' ? window.location.href : 'unknown',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
    });

    // Send to Sentry with full context
    if (typeof window !== 'undefined' && Sentry) {
      Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          },
          error_boundary: {
            errorId,
            level: this.props.level || 'component',
            timestamp: new Date().toISOString()
          }
        },
        tags: {
          error_boundary: true,
          level: this.props.level || 'component'
        }
      });
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      try {
        this.props.onError(error, errorInfo);
      } catch (handlerError) {
        logger.error('Error in custom ErrorBoundary handler', {
          error: String(handlerError)
        });
      }
    }

    // Auto-reset after 10 seconds (prevents infinite loops)
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
    this.resetTimeoutId = setTimeout(() => {
      this.resetError();
    }, 10000);
  }

  /**
   * Cleanup timeout on unmount
   */
  componentWillUnmount(): void {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  /**
   * Reset error state and retry rendering
   */
  resetError = (): void => {
    logger.info('Attempting to recover from error', {
      errorId: this.state.errorId
    });
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  /**
   * Navigate to home page
   */
  goHome = (): void => {
    logger.info('User navigated home from error boundary', {
      errorId: this.state.errorId
    });
    
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  /**
   * Reload the page
   */
  reloadPage = (): void => {
    logger.info('User reloaded page from error boundary', {
      errorId: this.state.errorId
    });
    
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback && this.state.error && this.state.errorInfo) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.resetError);
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-8">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-100 rounded-full p-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
              Oops! Something Went Wrong
            </h1>

            {/* Error Description */}
            <p className="text-center text-gray-600 mb-4">
              We encountered an unexpected error. Don't worry, we've logged this and our team has been notified.
            </p>

            {/* Error ID */}
            <div className="bg-gray-50 rounded p-3 mb-6">
              <p className="text-xs text-gray-500 font-mono text-center break-all">
                Error ID: {this.state.errorId}
              </p>
            </div>

            {/* Error Message (Development Only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 p-3 bg-gray-50 rounded border border-gray-200">
                <summary className="cursor-pointer font-semibold text-sm text-gray-700">
                  Error Details (Dev Only)
                </summary>
                <div className="mt-3 text-xs text-gray-600 font-mono overflow-auto max-h-40 bg-gray-100 p-2 rounded">
                  <p className="font-bold mb-2 text-red-600">Error Message:</p>
                  <p className="mb-3">{this.state.error.message}</p>
                  
                  {this.state.errorInfo && (
                    <>
                      <p className="font-bold mb-2 text-red-600">Component Stack:</p>
                      <pre className="whitespace-pre-wrap break-words">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {/* Retry Button */}
              <button
                onClick={this.resetError}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
                aria-label="Try again"
              >
                <RotateCcw className="w-4 h-4" />
                Try Again
              </button>

              {/* Go Home Button */}
              <button
                onClick={this.goHome}
                className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
                aria-label="Go to home page"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>

              {/* Reload Page Button */}
              <button
                onClick={this.reloadPage}
                className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
                aria-label="Reload page"
              >
                <RotateCcw className="w-4 h-4" />
                Reload Page
              </button>
            </div>

            {/* Support Message */}
            <p className="text-center text-xs text-gray-500 mt-6">
              If this problem persists, please{' '}
              <a
                href="mailto:support@example.com"
                className="text-blue-600 hover:underline font-semibold"
              >
                contact support
              </a>
              {' '}with your error ID.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * HOC to wrap a component with ErrorBoundary
 * 
 * Usage:
 * ```tsx
 * export default withErrorBoundary(MyComponent);
 * ```
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    fallback?: (error: Error, errorInfo: ErrorInfo, retry: () => void) => ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
    level?: 'page' | 'section' | 'component';
  }
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary
      fallback={options?.fallback}
      onError={options?.onError}
      level={options?.level}
    >
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}

export default ErrorBoundary;
