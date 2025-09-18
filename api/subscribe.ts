// Vercel serverless function: /api/subscribe
// This endpoint accepts POST { email } and returns { ok: boolean }
// Configure environment as needed. Do not expose secrets in client.

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

    // TODO: Implement real subscription logic (e.g., store to DB or send via provider)
    // Example: use process.env.SUBSCRIBE_API_KEY securely here.

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: 'Internal Server Error' });
  }
}
