// Vercel serverless function: /api/subscribe
// This endpoint accepts POST { email } and returns { ok: boolean }
// Real logic: optional webhook forward using SUBSCRIBE_WEBHOOK_URL (+ SUBSCRIBE_API_KEY)

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method Not Allowed' });
    return;
  }

  try {
    const { email } = req.body || {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ ok: false, error: 'Invalid email' });
      return;
    }

    const webhookUrl = process.env.SUBSCRIBE_WEBHOOK_URL;
    const apiKey = process.env.SUBSCRIBE_API_KEY;

    if (webhookUrl) {
      try {
        const headers: Record<string, string> = {
          'content-type': 'application/json'
        };
        if (apiKey) headers['authorization'] = `Bearer ${apiKey}`;

        const payload = {
          email,
          source: 'vercel',
          userAgent: req.headers?.['user-agent'],
          ip: (req.headers?.['x-forwarded-for'] as string | undefined)?.split(',')[0] || undefined,
          timestamp: new Date().toISOString()
        };

        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });

        if (!resp.ok) {
          res.status(502).json({ ok: false, error: 'Upstream subscription failed', upstreamStatus: resp.status });
          return;
        }

        res.status(200).json({ ok: true });
        return;
      } catch (e) {
        res.status(502).json({ ok: false, error: 'Webhook request failed' });
        return;
      }
    }

    // Fallback: success without external provider
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
}
