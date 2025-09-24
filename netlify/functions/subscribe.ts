// Netlify function: /.netlify/functions/subscribe
// Accepts POST { email } and returns { ok }
// Real logic: optional webhook forward using SUBSCRIBE_WEBHOOK_URL (+ SUBSCRIBE_API_KEY)

import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed' })
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const email = body.email as string | undefined;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'Invalid email' }) };
    }

    const webhookUrl = process.env.SUBSCRIBE_WEBHOOK_URL;
    const apiKey = process.env.SUBSCRIBE_API_KEY;

    // If a webhook is configured, forward to it (e.g., Mailchimp/Zapier/Make/custom API)
    if (webhookUrl) {
      try {
        const headers: Record<string, string> = {
          'content-type': 'application/json'
        };
        if (apiKey) headers['authorization'] = `Bearer ${apiKey}`;

        const payload = {
          email,
          source: 'netlify',
          userAgent: event.headers?.['user-agent'],
          ip: (event.headers?.['x-forwarded-for'] || '').split(',')[0] || undefined,
          timestamp: new Date().toISOString()
        };

        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (!resp.ok) {
          return {
            statusCode: 502,
            body: JSON.stringify({ ok: false, error: 'Upstream subscription failed', upstreamStatus: resp.status })
          };
        }

        return { statusCode: 200, body: JSON.stringify({ ok: true }) };
      } catch {
        return { statusCode: 502, body: JSON.stringify({ ok: false, error: 'Webhook request failed' }) };
      }
    }

    // Fallback: success without external provider
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Internal Server Error' }) };
  }
};
