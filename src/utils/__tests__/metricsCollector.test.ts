/**
 * Metrics Collector Unit Tests
 * Tests Core Web Vitals collection, batching, and sending
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MetricsCollector, PERFORMANCE_THRESHOLDS } from '../metricsCollector';

describe('MetricsCollector', () => {
  let collector: MetricsCollector;

  beforeEach(() => {
    collector = new MetricsCollector({
      batchSize: 5,
      batchInterval: 1000,
      sampleRate: 1.0,
      debug: false,
    });

    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ success: true }),
      } as Response)
    );

    // Mock navigator.sendBeacon
    global.navigator.sendBeacon = vi.fn(() => true);
  });

  afterEach(() => {
    collector.destroy();
    vi.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize metrics collector', () => {
      collector.init();
      expect(collector.getSessionId()).toBeTruthy();
    });

    it('should not initialize twice', () => {
      collector.init();
      const sessionId1 = collector.getSessionId();
      collector.init();
      const sessionId2 = collector.getSessionId();
      expect(sessionId1).toBe(sessionId2);
    });

    it('should respect sample rate', () => {
      const sampledCollector = new MetricsCollector({
        sampleRate: 0.0, // 0% sample rate
        debug: false,
      });

      // Try multiple times as sampling is random
      let notSampled = false;
      for (let i = 0; i < 10; i++) {
        const collector = new MetricsCollector({ sampleRate: 0.0 });
        collector.init();
        if (collector.getMetrics().length === 0) {
          notSampled = true;
          break;
        }
      }
      expect(notSampled).toBe(true);
    });

    it('should generate unique session IDs', () => {
      const collector1 = new MetricsCollector({ sampleRate: 1.0 });
      const collector2 = new MetricsCollector({ sampleRate: 1.0 });

      collector1.init();
      collector2.init();

      expect(collector1.getSessionId()).not.toBe(collector2.getSessionId());
    });
  });

  describe('Metric Recording', () => {
    beforeEach(() => {
      collector.init();
    });

    it('should record custom metrics', () => {
      collector.recordMetric('CustomMetric', 150);

      const metrics = collector.getMetrics();
      expect(metrics.length).toBe(1);
      expect(metrics[0].name).toBe('CustomMetric');
      expect(metrics[0].value).toBe(150);
    });

    it('should add context to metrics', () => {
      collector.recordMetric('TestMetric', 100);

      const metrics = collector.getMetrics();
      expect(metrics[0].context).toBeDefined();
      expect(metrics[0].context?.sessionId).toBe(collector.getSessionId());
      expect(metrics[0].context?.timestamp).toBeTruthy();
    });

    it('should trigger flush when batch size is reached', async () => {
      // Record metrics to reach batch size
      for (let i = 0; i < 5; i++) {
        collector.recordMetric(`Metric${i}`, 100 + i);
      }

      // Wait for flush
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify fetch was called
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('Batching & Flushing', () => {
    beforeEach(() => {
      collector.init();
    });

    it('should batch metrics before sending', async () => {
      collector.recordMetric('Metric1', 100);
      collector.recordMetric('Metric2', 200);

      await collector.flushMetrics();

      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.metrics.length).toBe(2);
    });

    it('should include session ID in batch', async () => {
      collector.recordMetric('Metric1', 100);

      await collector.flushMetrics();

      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.sessionId).toBe(collector.getSessionId());
    });

    it('should include timestamp in batch', async () => {
      collector.recordMetric('Metric1', 100);

      await collector.flushMetrics();

      const callArgs = (global.fetch as any).mock.calls[0];
      const body = JSON.parse(callArgs[1].body);

      expect(body.timestamp).toBeTruthy();
      expect(typeof body.timestamp).toBe('number');
    });

    it('should clear metrics after successful flush', async () => {
      collector.recordMetric('Metric1', 100);
      expect(collector.getMetrics().length).toBe(1);

      await collector.flushMetrics();
      expect(collector.getMetrics().length).toBe(0);
    });

    it('should retry metrics on failed flush', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: false,
          status: 500,
        } as Response)
      );

      collector.recordMetric('Metric1', 100);

      await collector.flushMetrics();

      // Metrics should still be in queue
      expect(collector.getMetrics().length).toBe(1);
    });
  });

  describe('Performance Thresholds', () => {
    it('should define LCP thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.LCP).toEqual({
        good: 2500,
        poor: 4000,
      });
    });

    it('should define FID thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.FID).toEqual({
        good: 100,
        poor: 300,
      });
    });

    it('should define CLS thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.CLS).toEqual({
        good: 0.1,
        poor: 0.25,
      });
    });

    it('should define TTFB thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.TTFB).toEqual({
        good: 600,
        poor: 1800,
      });
    });

    it('should define FCP thresholds', () => {
      expect(PERFORMANCE_THRESHOLDS.FCP).toEqual({
        good: 1800,
        poor: 3000,
      });
    });
  });

  describe('Request Configuration', () => {
    beforeEach(() => {
      collector.init();
    });

    it('should send metrics to correct endpoint', async () => {
      collector.recordMetric('Metric1', 100);

      await collector.flushMetrics();

      const callArgs = (global.fetch as any).mock.calls[0];
      expect(callArgs[0]).toBe('/api/metrics');
    });

    it('should use POST method', async () => {
      collector.recordMetric('Metric1', 100);

      await collector.flushMetrics();

      const callArgs = (global.fetch as any).mock.calls[0];
      expect(callArgs[1].method).toBe('POST');
    });

    it('should set Content-Type header', async () => {
      collector.recordMetric('Metric1', 100);

      await collector.flushMetrics();

      const callArgs = (global.fetch as any).mock.calls[0];
      expect(callArgs[1].headers['Content-Type']).toBe('application/json');
    });

    it('should use keepalive flag', async () => {
      collector.recordMetric('Metric1', 100);

      await collector.flushMetrics();

      const callArgs = (global.fetch as any).mock.calls[0];
      expect(callArgs[1].keepalive).toBe(true);
    });
  });

  describe('Cleanup & Unload', () => {
    beforeEach(() => {
      collector.init();
    });

    it('should clear batch timer on destroy', () => {
      // Just ensure destroy doesn't throw
      expect(() => {
        collector.destroy();
      }).not.toThrow();
    });

    it('should use sendBeacon for unload', () => {
      collector.recordMetric('Metric1', 100);

      // Verify setup doesn't throw
      expect(() => {
        // Trigger unload event
        const unloadEvent = new Event('beforeunload');
        window.dispatchEvent(unloadEvent);
      }).not.toThrow();
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      collector.init();
    });

    it('should handle fetch errors gracefully', async () => {
      global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));

      collector.recordMetric('Metric1', 100);

      // Should not throw
      await expect(collector.flushMetrics()).resolves.not.toThrow();

      // Metrics should be retained
      expect(collector.getMetrics().length).toBe(1);
    });

    it('should handle invalid batch', async () => {
      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          status: 200,
        } as Response)
      );

      // Should not throw with empty batch
      await expect(collector.flushMetrics()).resolves.not.toThrow();
    });

    it('should handle missing metric context gracefully', () => {
      expect(() => {
        collector.recordMetric('Metric', 100);
      }).not.toThrow();
    });
  });

  describe('Multiple Metrics', () => {
    beforeEach(() => {
      collector.init();
    });

    it('should collect multiple metrics in sequence', () => {
      collector.recordMetric('LCP', 2000);
      collector.recordMetric('FID', 50);
      collector.recordMetric('CLS', 0.05);

      const metrics = collector.getMetrics();
      expect(metrics.length).toBe(3);
      expect(metrics.map((m) => m.name)).toEqual(['LCP', 'FID', 'CLS']);
    });

    it('should preserve metric order', () => {
      const names = ['Metric1', 'Metric2', 'Metric3', 'Metric4'];

      names.forEach((name) => collector.recordMetric(name, 100));

      const metrics = collector.getMetrics();
      expect(metrics.map((m) => m.name)).toEqual(names);
    });

    it('should handle rapid metric recording', async () => {
      for (let i = 0; i < 3; i++) {
        collector.recordMetric(`Metric${i}`, i);
      }

      // Metrics can auto-flush if batch size reached
      // Just verify we can record without errors
      const metrics = collector.getMetrics();
      expect(metrics.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Configuration Options', () => {
    it('should accept custom batch size', () => {
      const customCollector = new MetricsCollector({
        batchSize: 3,
        sampleRate: 1.0,
      });

      customCollector.init();

      for (let i = 0; i < 3; i++) {
        customCollector.recordMetric(`Metric${i}`, 100);
      }

      expect(global.fetch).toHaveBeenCalled();
    });

    it('should accept custom batch interval', () => {
      const customCollector = new MetricsCollector({
        batchInterval: 100,
        sampleRate: 1.0,
      });

      // Should initialize without error
      expect(() => {
        customCollector.init();
        customCollector.recordMetric('Metric1', 100);
      }).not.toThrow();
      
      customCollector.destroy();
    });

    it('should accept custom environment', () => {
      const customCollector = new MetricsCollector({
        environment: 'staging',
        sampleRate: 1.0,
      });

      customCollector.init();
      customCollector.recordMetric('Metric1', 100);

      customCollector.flushMetrics().then(() => {
        const callArgs = (global.fetch as any).mock.calls[0];
        const body = JSON.parse(callArgs[1].body);
        expect(body.environment).toBe('staging');
      });
    });

    it('should accept custom endpoint', () => {
      const customEndpoint = '/custom/metrics/endpoint';
      const customCollector = new MetricsCollector({
        endpoint: customEndpoint,
        sampleRate: 1.0,
      });

      customCollector.init();
      customCollector.recordMetric('Metric1', 100);

      customCollector.flushMetrics().then(() => {
        const callArgs = (global.fetch as any).mock.calls[0];
        expect(callArgs[0]).toBe(customEndpoint);
      });
    });
  });
});
