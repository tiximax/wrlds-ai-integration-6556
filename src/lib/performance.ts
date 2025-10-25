/**
 * 📈 Web Vitals Performance Monitoring
 * 
 * Track Core Web Vitals metrics để optimize UX và SEO.
 * 
 * Core Web Vitals:
 * - LCP (Largest Contentful Paint): Loading performance
 * - FID (First Input Delay): Interactivity
 * - CLS (Cumulative Layout Shift): Visual stability
 * 
 * Additional Metrics:
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 * - INP (Interaction to Next Paint) - New metric replacing FID
 */

import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP, type Metric } from 'web-vitals';
import metricsCollector from '@/utils/metricsCollector';

/**
 * Performance thresholds theo Google recommendations
 */
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // ms
  FID: { good: 100, poor: 300 }, // ms
  CLS: { good: 0.1, poor: 0.25 }, // score
  FCP: { good: 1800, poor: 3000 }, // ms
  TTFB: { good: 800, poor: 1800 }, // ms
  INP: { good: 200, poor: 500 }, // ms
};

/**
 * Get metric rating
 */
function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Send metric to analytics
 */
function sendToAnalytics(metric: Metric) {
  const rating = getRating(metric.name, metric.value);
  
  // Console log trong dev mode
  if (import.meta.env.DEV) {
    const emoji = rating === 'good' ? '✅' : rating === 'needs-improvement' ? '⚠️' : '❌';
    console.log(`${emoji} ${metric.name}:`, {
      value: metric.value.toFixed(2),
      rating,
      id: metric.id,
    });
  }
  
  // Send to Sentry trong production
  if (import.meta.env.PROD) {
    // Integration with Sentry (nếu đã setup)
    try {
      const Sentry = (window as any).Sentry;
      if (Sentry) {
        Sentry.addBreadcrumb({
          category: 'web-vitals',
          message: `${metric.name}: ${metric.value.toFixed(2)}`,
          level: rating === 'poor' ? 'warning' : 'info',
          data: {
            name: metric.name,
            value: metric.value,
            rating,
            id: metric.id,
            navigationType: metric.navigationType,
          },
        });
      }
    } catch (error) {
      // Ignore Sentry errors
    }
  }
  
  // Send to Google Analytics (nếu có)
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
      metric_rating: rating,
    });
  }
  
  // Optional: Send to custom analytics endpoint
  if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
    fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'web-vital',
        name: metric.name,
        value: metric.value,
        rating,
        id: metric.id,
        url: window.location.href,
        timestamp: Date.now(),
      }),
    }).catch(() => {
      // Fail silently - không crash app nếu analytics fail
    });
  }
}

/**
 * Initialize Web Vitals monitoring
 * 
 * Gọi hàm này trong main.tsx để start tracking
 */
export function initPerformanceMonitoring() {
  // Initialize metrics collector for Core Web Vitals
  const isProduction = import.meta.env.PROD;
  const sampleRate = isProduction ? 0.1 : 1.0; // Sample 10% of production traffic
  
  metricsCollector['config'] = {
    sampleRate,
    debug: import.meta.env.DEV,
    environment: isProduction ? 'production' : 'development',
    endpoint: '/api/metrics',
  };
  metricsCollector.init();
  
  // Track all Core Web Vitals
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  
  // Track additional metrics
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
  
  // Track INP (new metric replacing FID)
  if (onINP) {
    onINP(sendToAnalytics);
  }
  
  if (import.meta.env.DEV) {
    console.log('📊 Performance monitoring initialized');
    console.log('🎯 Metrics collector session:', metricsCollector.getSessionId());
  }
}

/**
 * Manual performance measurement
 * 
 * Usage:
 * ```ts
 * const measure = startMeasure('api-call');
 * await fetchData();
 * const duration = measure.end();
 * console.log(`API call took ${duration}ms`);
 * ```
 */
export function startMeasure(name: string) {
  const startTime = performance.now();
  const startMark = `${name}-start`;
  
  try {
    performance.mark(startMark);
  } catch (error) {
    // Ignore performance API errors
  }
  
  return {
    end: () => {
      const duration = performance.now() - startTime;
      const endMark = `${name}-end`;
      
      try {
        performance.mark(endMark);
        performance.measure(name, startMark, endMark);
      } catch (error) {
        // Ignore performance API errors
      }
      
      if (import.meta.env.DEV) {
        console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
      }
      
      return duration;
    },
  };
}

/**
 * Get current performance metrics
 * 
 * Usage:
 * ```ts
 * const metrics = getPerformanceMetrics();
 * console.log('Page load time:', metrics.loadTime);
 * ```
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined' || !window.performance) {
    return null;
  }
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  
  if (!navigation) return null;
  
  return {
    // Load times
    loadTime: navigation.loadEventEnd - navigation.fetchStart,
    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
    
    // Network times
    dnsTime: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcpTime: navigation.connectEnd - navigation.connectStart,
    requestTime: navigation.responseStart - navigation.requestStart,
    responseTime: navigation.responseEnd - navigation.responseStart,
    
    // Rendering times
    domProcessingTime: navigation.domComplete - navigation.domInteractive,
    renderTime: navigation.loadEventEnd - navigation.responseEnd,
  };
}
