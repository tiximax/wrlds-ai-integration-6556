// Lightweight subscription service for newsletter/contact forms
// Avoids exposing secrets on the client. If VITE_SUBSCRIBE_ENDPOINT is set,
// it will POST to that endpoint; otherwise it will simulate success locally.

import { logger } from '@/utils/logger';

export interface SubscribeResult {
  ok: boolean;
  status?: number;
  retries?: number;
}

/**
 * Retry configuration for email subscription
 */
interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelayMs: 500,
  maxDelayMs: 5000,
  backoffMultiplier: 2
};

/**
 * Calculate exponential backoff delay with jitter
 */
function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  const exponentialDelay = Math.min(
    config.initialDelayMs * Math.pow(config.backoffMultiplier, attempt),
    config.maxDelayMs
  );
  // Add jitter (±20%) to prevent thundering herd
  const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5);
  return Math.max(100, exponentialDelay + jitter);
}

/**
 * Fetch with timeout
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeout?: number } = {}
): Promise<Response> {
  const { timeout = 10000, ...fetchOptions } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Retry subscription with exponential backoff
 */
async function subscribeWithRetry(
  endpoint: string,
  email: string,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<SubscribeResult> {
  let lastError: Error | null = null;
  let attempt = 0;

  for (attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      logger.debug('Attempting email subscription', { email, attempt: attempt + 1, maxRetries: config.maxRetries });

      const res = await fetchWithTimeout(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        timeout: 10000
      });

      if (res.ok) {
        logger.info('Email subscription successful', { email, attempts: attempt + 1 });
        return { ok: true, status: res.status, retries: attempt };
      }

      // Check if error is retryable
      const isRetryable = res.status >= 500 || res.status === 408 || res.status === 429;
      if (!isRetryable) {
        logger.warn('Email subscription failed with non-retryable error', {
          email,
          status: res.status,
          statusText: res.statusText
        });
        return { ok: false, status: res.status, retries: attempt };
      }

      if (attempt < config.maxRetries) {
        const delay = calculateBackoffDelay(attempt, config);
        logger.warn('Email subscription attempt failed, retrying', {
          email,
          attempt: attempt + 1,
          status: res.status,
          nextRetryDelayMs: Math.round(delay)
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      lastError = error as Error;
      const isNetworkError = error instanceof TypeError && error.name === 'AbortError';
      const errorType = isNetworkError ? 'timeout' : 'network';

      if (attempt < config.maxRetries) {
        const delay = calculateBackoffDelay(attempt, config);
        logger.warn(`Email subscription ${errorType} error, retrying`, {
          email,
          attempt: attempt + 1,
          error: String(error),
          nextRetryDelayMs: Math.round(delay)
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        logger.error(`Email subscription ${errorType} error - max retries exceeded`, {
          email,
          attempts: attempt + 1,
          error: String(error)
        });
      }
    }
  }

  // All retries exhausted
  logger.error('Email subscription failed after all retries', {
    email,
    totalAttempts: attempt,
    lastError: lastError ? String(lastError) : 'unknown'
  });
  return { ok: false, status: 500, retries: attempt };
}

export async function subscribeEmail(email: string, retryConfig?: Partial<RetryConfig>): Promise<SubscribeResult> {
  const mode = import.meta.env.MODE;
  const isTest = mode === 'test';

  let endpoint = import.meta.env.VITE_SUBSCRIBE_ENDPOINT as string | undefined;
  if (!endpoint) {
    // Try common defaults depending on host (avoid forcing network in test)
    if (typeof window !== 'undefined' && !isTest) {
      // Vercel/Netlify default proxy
      endpoint = '/api/subscribe';
    }
  }

  // Basic validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    logger.warn('Invalid email format in subscription attempt', { email });
    return { ok: false, status: 400 };
  }

  try {
    if (endpoint) {
      // Use retry logic for network requests
      const config = { ...DEFAULT_RETRY_CONFIG, ...retryConfig };
      return await subscribeWithRetry(endpoint, email, config);
    }

    // Fallback: simulate success (dev mode or tests)
    await new Promise((r) => setTimeout(r, 50));
    logger.debug('Email subscription in fallback mode (dev/test)', { email });
    return { ok: true, status: 200 };
  } catch (error) {
    logger.error('Unexpected error during email subscription', { email, error: String(error) });
    return { ok: false, status: 500 };
  }
}
