// Lightweight subscription service for newsletter/contact forms
// Avoids exposing secrets on the client. If VITE_SUBSCRIBE_ENDPOINT is set,
// it will POST to that endpoint; otherwise it will simulate success locally.

import { logger } from '@/utils/logger';

export interface SubscribeResult {
  ok: boolean;
  status?: number;
}

export async function subscribeEmail(email: string): Promise<SubscribeResult> {
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
      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        if (res.ok) {
          logger.info('Email subscription successful', { email });
        } else {
          logger.warn('Email subscription failed with non-ok status', { email, status: res.status });
        }

        return { ok: res.ok, status: res.status };
      } catch (fetchError) {
        logger.error('Fetch error during email subscription', { email, error: String(fetchError) });
        return { ok: false, status: 500 };
      }
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
