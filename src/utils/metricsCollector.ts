/**
 * Core Web Vitals & Performance Metrics Collector
 * Collects and reports LCP, FID, CLS, TTFB, and custom metrics
 * Integrates with Sentry for centralized monitoring
 */

import {
  getCLS,
  getFID,
  getFCP,
  getLCP,
  getTTFB,
  Metric,
  ReportHandler,
} from 'web-vitals';
import { logger } from './logger';

/**
 * Extended metric interface with additional context
 */
export interface ExtendedMetric extends Metric {
  context?: {
    url?: string;
    timestamp?: number;
    userAgent?: string;
    sessionId?: string;
    userId?: string;
    environment?: string;
  };
}

/**
 * Performance thresholds (WCAG AAA standards)
 * Good = green, Needs Improvement = yellow, Poor = red
 */
const PERFORMANCE_THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, poor: 300 }, // First Input Delay (ms)
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift (unitless)
  TTFB: { good: 600, poor: 1800 }, // Time to First Byte (ms)
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
};

/**
 * Metric ratings
 */
type MetricRating = 'good' | 'needs-improvement' | 'poor';

/**
 * Get rating based on metric value and threshold
 */
function getMetricRating(
  metricName: keyof typeof PERFORMANCE_THRESHOLDS,
  value: number
): MetricRating {
  const threshold = PERFORMANCE_THRESHOLDS[metricName];
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Metrics collector configuration
 */
interface MetricsConfig {
  batchSize?: number;
  batchInterval?: number;
  sampleRate?: number; // 0-1, percentage of sessions to track
  debug?: boolean;
  sessionId?: string;
  userId?: string;
  environment?: string;
  endpoint?: string; // Custom endpoint for sending metrics
}

/**
 * Core Metrics Collector Class
 */
class MetricsCollector {
  private config: Required<MetricsConfig>;
  private metrics: ExtendedMetric[] = [];
  private batchTimer: NodeJS.Timeout | null = null;
  private isInitialized = false;
  private unloadHandler: (() => void) | null = null;

  constructor(config: MetricsConfig = {}) {
    this.config = {
      batchSize: config.batchSize ?? 10,
      batchInterval: config.batchInterval ?? 10000, // 10 seconds
      sampleRate: config.sampleRate ?? 1.0,
      debug: config.debug ?? false,
      sessionId: config.sessionId ?? this.generateSessionId(),
      userId: config.userId ?? '',
      environment: config.environment ?? 'production',
      endpoint: config.endpoint ?? '/api/metrics',
    };
  }

  /**
   * Initialize metrics collection
   */
  public init(): void {
    if (this.isInitialized) {
      logger.warn('MetricsCollector already initialized');
      return;
    }

    // Check if we should sample this session
    if (Math.random() > this.config.sampleRate) {
      logger.debug('Session not sampled for metrics collection');
      this.isInitialized = false; // Mark as not initialized if not sampled
      return;
    }

    this.isInitialized = true;

    try {
      // Collect Core Web Vitals
      this.collectWebVitals();

      // Collect Navigation Timing metrics
      this.collectNavigationMetrics();

      // Monitor for layout shifts
      this.monitorLayoutShifts();

      // Monitor long tasks
      this.monitorLongTasks();

      // Setup automatic batch sending
      this.startBatchTimer();

      // Send metrics on page unload
      this.setupUnloadHandler();

      logger.info('Metrics collector initialized', {
        sessionId: this.config.sessionId,
        sampleRate: this.config.sampleRate,
      });
    } catch (error) {
      logger.error('Failed to initialize metrics collector', {
        error: String(error),
      });
    }
  }

  /**
   * Collect Core Web Vitals (LCP, FID, CLS, TTFB, FCP)
   */
  private collectWebVitals(): void {
    // Largest Contentful Paint
    getLCP((metric) => this.handleMetric('LCP', metric));

    // First Input Delay
    getFID((metric) => this.handleMetric('FID', metric));

    // Cumulative Layout Shift
    getCLS((metric) => this.handleMetric('CLS', metric));

    // Time to First Byte
    getTTFB((metric) => this.handleMetric('TTFB', metric));

    // First Contentful Paint
    getFCP((metric) => this.handleMetric('FCP', metric));
  }

  /**
   * Collect Navigation Timing metrics (DNS, TCP, request, response, rendering)
   */
  private collectNavigationMetrics(): void {
    if (!performance.getEntriesByType) {
      logger.debug('Navigation Timing API not available');
      return;
    }

    try {
      const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (!navigationTiming) return;

      const metrics = {
        DNS: navigationTiming.domainLookupEnd - navigationTiming.domainLookupStart,
        TCP: navigationTiming.connectEnd - navigationTiming.connectStart,
        Request: navigationTiming.responseStart - navigationTiming.requestStart,
        Response: navigationTiming.responseEnd - navigationTiming.responseStart,
        DOM: navigationTiming.domContentLoadedEventEnd - navigationTiming.domContentLoadedEventStart,
        Load: navigationTiming.loadEventEnd - navigationTiming.loadEventStart,
        Interactive: navigationTiming.domInteractive - navigationTiming.fetchStart,
      };

      // Log navigation metrics
      if (this.config.debug) {
        logger.debug('Navigation timing metrics', metrics);
      }

      // Add to batch
      Object.entries(metrics).forEach(([name, value]) => {
        if (value > 0) {
          this.addMetric({
            name,
            value,
            rating: getMetricRating('TTFB', value),
            delta: value,
            id: `${name}-${Date.now()}`,
          } as any);
        }
      });
    } catch (error) {
      logger.warn('Failed to collect navigation timing', {
        error: String(error),
      });
    }
  }

  /**
   * Monitor cumulative layout shifts in real-time
   */
  private monitorLayoutShifts(): void {
    if (!window.PerformanceObserver) {
      logger.debug('PerformanceObserver not available for layout shift monitoring');
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const layoutShiftEntry = entry as PerformanceEntry & { hadRecentInput?: boolean };
          if (!layoutShiftEntry.hadRecentInput) {
            if (this.config.debug) {
              logger.debug('Layout shift detected', {
                value: (entry as any).value,
              });
            }
          }
        }
      });

      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (error) {
      logger.debug('Layout shift monitoring not available', {
        error: String(error),
      });
    }
  }

  /**
   * Monitor long tasks (> 50ms)
   */
  private monitorLongTasks(): void {
    if (!window.PerformanceObserver) {
      logger.debug('PerformanceObserver not available for long task monitoring');
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = (entry as any).duration;
          if (duration > 50) {
            this.addMetric({
              name: 'LongTask',
              value: duration,
              rating: 'poor',
              delta: duration,
              id: `long-task-${Date.now()}`,
            } as any);

            logger.warn('Long task detected', {
              duration,
              name: entry.name,
            });
          }
        }
      });

      observer.observe({ type: 'longtask', buffered: true });
    } catch (error) {
      logger.debug('Long task monitoring not available', {
        error: String(error),
      });
    }
  }

  /**
   * Handle metric collection
   */
  private handleMetric(name: string, metric: Metric): void {
    const rating = getMetricRating(
      name as keyof typeof PERFORMANCE_THRESHOLDS,
      metric.value
    );

    const extendedMetric: ExtendedMetric = {
      ...metric,
      context: {
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.config.sessionId,
        userId: this.config.userId,
        environment: this.config.environment,
      },
    };

    this.addMetric(extendedMetric);

    // Log significant metrics
    if (rating !== 'good' || this.config.debug) {
      logger.info(`Metric collected: ${name}`, {
        value: metric.value,
        rating,
        id: metric.id,
        delta: metric.delta,
      });
    }

    // Send immediately for critical metrics
    if (rating === 'poor') {
      logger.warn(`Poor metric detected: ${name}`, {
        value: metric.value,
        threshold: PERFORMANCE_THRESHOLDS[name as keyof typeof PERFORMANCE_THRESHOLDS]?.poor,
      });

      // Could trigger immediate send
      if (this.metrics.length >= this.config.batchSize / 2) {
        this.flushMetrics();
      }
    }
  }

  /**
   * Add metric to batch
   */
  private addMetric(metric: ExtendedMetric): void {
    this.metrics.push(metric);

    // Auto-flush if batch is full
    if (this.metrics.length >= this.config.batchSize) {
      this.flushMetrics();
    }
  }

  /**
   * Start automatic batch timer
   */
  private startBatchTimer(): void {
    this.batchTimer = setInterval(() => {
      if (this.metrics.length > 0) {
        this.flushMetrics();
      }
    }, this.config.batchInterval);
  }

  /**
   * Send metrics batch
   */
  public async flushMetrics(): Promise<void> {
    if (this.metrics.length === 0) return;

    const metricsToSend = [...this.metrics];
    this.metrics = [];

    try {
      const response = await fetch(this.config.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: metricsToSend,
          timestamp: Date.now(),
          sessionId: this.config.sessionId,
          environment: this.config.environment,
        }),
        keepalive: true, // Ensure request completes even if page unloads
      });

      if (!response.ok) {
        logger.warn('Failed to send metrics', {
          status: response.status,
          statusText: response.statusText,
        });
        // Re-add metrics if failed
        this.metrics = [...metricsToSend, ...this.metrics];
      } else {
        if (this.config.debug) {
          logger.debug(`Sent ${metricsToSend.length} metrics`);
        }
      }
    } catch (error) {
      logger.warn('Error sending metrics', {
        error: String(error),
      });
      // Re-add metrics if failed
      this.metrics = [...metricsToSend, ...this.metrics];
    }
  }

  /**
   * Setup unload handler to send remaining metrics
   */
  private setupUnloadHandler(): void {
    // Use beforeunload or unload to send metrics before page closes
    const sendBeforeUnload = () => {
      // Use sendBeacon for reliability on page unload
      if (navigator.sendBeacon && this.metrics.length > 0) {
        try {
          const payload = JSON.stringify({
            metrics: this.metrics,
            timestamp: Date.now(),
            sessionId: this.config.sessionId,
            environment: this.config.environment,
          });

          navigator.sendBeacon(this.config.endpoint, payload);
        } catch (error) {
          logger.warn('Error sending metrics on unload', {
            error: String(error),
          });
        }
      }
    };

    // Store handler for cleanup
    this.unloadHandler = sendBeforeUnload;

    if (window.addEventListener) {
      window.addEventListener('beforeunload', sendBeforeUnload, { capture: true });
      window.addEventListener('pagehide', sendBeforeUnload, { capture: true });
    }
  }

  /**
   * Record custom metric
   */
  /**
   * Record custom metric
   * Only records if initialized
   */
  public recordMetric(name: string, value: number, tags?: Record<string, string>): void {
    if (!this.isInitialized) {
      return; // Silent return if not initialized (sampling or not started)
    }

    this.addMetric({
      name,
      value,
      rating: 'good',
      delta: value,
      id: `${name}-${Date.now()}`,
      context: {
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.config.sessionId,
        userId: this.config.userId,
        environment: this.config.environment,
      },
    } as any);
  }

  /**
   * Get current metrics
   */
  public getMetrics(): ExtendedMetric[] {
    return [...this.metrics];
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get session ID
   */
  public getSessionId(): string {
    return this.config.sessionId;
  }

  /**
   * Cleanup - remove all listeners and timers
   */
  public destroy(): void {
    // Clear batch timer
    if (this.batchTimer) {
      clearInterval(this.batchTimer);
      this.batchTimer = null;
    }

    // Remove unload event listeners
    if (this.unloadHandler && window.removeEventListener) {
      window.removeEventListener('beforeunload', this.unloadHandler, { capture: true });
      window.removeEventListener('pagehide', this.unloadHandler, { capture: true });
    }

    // Flush remaining metrics
    if (this.metrics.length > 0) {
      this.flushMetrics();
    }

    this.isInitialized = false;
  }
}

// Create singleton instance
const metricsCollector = new MetricsCollector();

export default metricsCollector;
export { MetricsCollector, PERFORMANCE_THRESHOLDS };
