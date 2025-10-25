/**
 * Metrics Collection API Endpoint
 * Receives performance metrics from frontend and stores/processes them
 */

import type { VercelRequest, VercelResponse } from '@vercel/functions';
import { logger } from '@/utils/logger';

/**
 * Metrics aggregation for analytics
 */
interface MetricsPayload {
  metrics: Array<{
    name: string;
    value: number;
    rating?: 'good' | 'needs-improvement' | 'poor';
    delta?: number;
    id?: string;
    context?: Record<string, any>;
  }>;
  timestamp: number;
  sessionId: string;
  environment: string;
}

/**
 * In-memory metrics store (in production, use a database)
 * This is just for demonstration
 */
const metricsStore: MetricsPayload[] = [];
const SESSION_METRICS: Map<string, any> = new Map();

/**
 * Calculate average metric value
 */
function calculateAverageMetric(
  metricName: string,
  sessionIds?: string[]
): number | null {
  let sum = 0;
  let count = 0;

  metricsStore.forEach((payload) => {
    if (sessionIds && !sessionIds.includes(payload.sessionId)) return;

    payload.metrics.forEach((metric) => {
      if (metric.name === metricName) {
        sum += metric.value;
        count++;
      }
    });
  });

  return count > 0 ? sum / count : null;
}

/**
 * Get metric distribution
 */
function getMetricDistribution(metricName: string) {
  const distribution = {
    good: 0,
    'needs-improvement': 0,
    poor: 0,
    total: 0,
  };

  metricsStore.forEach((payload) => {
    payload.metrics.forEach((metric) => {
      if (metric.name === metricName) {
        if (metric.rating && metric.rating in distribution) {
          distribution[metric.rating as keyof typeof distribution]++;
        }
        distribution.total++;
      }
    });
  });

  return distribution;
}

/**
 * POST /api/metrics
 * Receive metrics batch from frontend
 */
export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body as MetricsPayload;

    // Validate payload structure
    if (!payload) {
      return res.status(400).json({ error: 'Empty request body' });
    }

    if (!payload.metrics || !Array.isArray(payload.metrics)) {
      return res.status(400).json({ error: 'Invalid or missing metrics array' });
    }

    if (!payload.sessionId || typeof payload.sessionId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing sessionId' });
    }

    if (!payload.timestamp || typeof payload.timestamp !== 'number') {
      return res.status(400).json({ error: 'Invalid or missing timestamp' });
    }

    // Validate each metric
    const validMetrics = payload.metrics.every(
      (m: any) =>
        m && typeof m === 'object' && typeof m.name === 'string' && typeof m.value === 'number'
    );

    if (!validMetrics) {
      return res.status(400).json({ error: 'Invalid metric format in array' });
    }

    // Limit metrics per request to prevent abuse
    if (payload.metrics.length > 100) {
      return res.status(413).json({ error: 'Too many metrics (max 100 per request)' });
    }

    // Store metrics (in production: save to database)
    metricsStore.push(payload);

    // Update session metrics
    if (!SESSION_METRICS.has(payload.sessionId)) {
      SESSION_METRICS.set(payload.sessionId, {
        sessionId: payload.sessionId,
        environment: payload.environment,
        startTime: payload.timestamp,
        metrics: [],
      });
    }

    const sessionData = SESSION_METRICS.get(payload.sessionId);
    sessionData.metrics.push(...payload.metrics);
    sessionData.endTime = payload.timestamp;

    logger.info('Metrics received', {
      sessionId: payload.sessionId,
      count: payload.metrics.length,
      environment: payload.environment,
    });

    // Log any poor metrics
    payload.metrics.forEach((metric) => {
      if (metric.rating === 'poor') {
        logger.warn('Poor performance metric detected', {
          sessionId: payload.sessionId,
          metric: metric.name,
          value: metric.value,
          context: metric.context,
        });
      }
    });

    // Respond success
    res.status(200).json({
      success: true,
      metricsProcessed: payload.metrics.length,
      sessionId: payload.sessionId,
    });
  } catch (error) {
    logger.error('Error processing metrics', {
      error: String(error),
      method: req.method,
      url: req.url,
    });

    res.status(500).json({
      error: 'Failed to process metrics',
      message: String(error),
    });
  }
}

/**
 * GET /api/metrics (optional)
 * Retrieve metrics analytics and reports
 */
export async function handleMetricsGet(req: VercelRequest, res: VercelResponse) {
  try {
    const { metric, sessionId } = req.query;

    if (metric) {
      // Get specific metric stats
      const avg = calculateAverageMetric(metric as string);
      const distribution = getMetricDistribution(metric as string);

      return res.status(200).json({
        metric,
        average: avg,
        distribution,
        dataPoints: metricsStore.length,
      });
    }

    if (sessionId) {
      // Get specific session metrics
      const session = SESSION_METRICS.get(sessionId as string);
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }

      return res.status(200).json(session);
    }

    // Return general stats
    res.status(200).json({
      totalSessions: SESSION_METRICS.size,
      totalDataPoints: metricsStore.length,
      metricsCollected: Array.from(
        new Set(metricsStore.flatMap((p) => p.metrics.map((m) => m.name)))
      ),
    });
  } catch (error) {
    logger.error('Error retrieving metrics', {
      error: String(error),
    });

    res.status(500).json({
      error: 'Failed to retrieve metrics',
    });
  }
}

/**
 * Export for direct usage
 */
export {
  calculateAverageMetric,
  getMetricDistribution,
  SESSION_METRICS,
  metricsStore,
};
