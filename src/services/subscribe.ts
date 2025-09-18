// Lightweight subscription service for newsletter/contact forms
// Avoids exposing secrets on the client. If VITE_SUBSCRIBE_ENDPOINT is set,
// it will POST to that endpoint; otherwise it will simulate success locally.

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
    return { ok: false, status: 400 };
  }

  try {
    if (endpoint) {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      return { ok: res.ok, status: res.status };
    }

    // Fallback: simulate success (dev mode or tests)
    await new Promise((r) => setTimeout(r, 50));
    return { ok: true, status: 200 };
  } catch {
    return { ok: false, status: 500 };
  }
}
