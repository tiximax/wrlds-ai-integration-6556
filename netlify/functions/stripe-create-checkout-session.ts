// Netlify function: /.netlify/functions/stripe-create-checkout-session
// Creates a Stripe Checkout Session when live mode is enabled, otherwise returns a demo payload
// Env: STRIPE_SECRET_KEY, FRONTEND_URL, ENABLE_LIVE_PAYMENTS=true | PAYMENTS_MODE=live

import type { Handler } from '@netlify/functions';

function json(statusCode: number, data: unknown) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  const live = (process.env.ENABLE_LIVE_PAYMENTS === 'true') || (process.env.PAYMENTS_MODE === 'live');
  const frontend = process.env.FRONTEND_URL || 'http://localhost:8888';

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const items = Array.isArray(body.items) ? body.items : [];

    // Demo mode: always return a stubbed session for quick verification
    if (!live) {
      const demoId = `cs_test_demo_${Date.now()}`;
      return json(200, {
        ok: true,
        mode: 'demo',
        session: {
          id: demoId,
          url: `${frontend}/checkout/preview?session_id=${demoId}`
        }
      });
    }

    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return json(400, { ok: false, error: 'Missing STRIPE_SECRET_KEY' });

    // Require priceId for live calls to Stripe
    const lineItems = items
      .map((it: any) => ({ price: it.priceId || it.price || it.id, quantity: Number(it.quantity) || 1 }))
      .filter((li: any) => typeof li.price === 'string' && li.price.startsWith('price_'));

    if (!lineItems.length) {
      return json(400, { ok: false, error: 'Provide items with valid Stripe priceId (e.g., price_*) for live mode' });
    }

    // Build x-www-form-urlencoded body
    const params: Record<string, string> = {
      'mode': 'payment',
      'payment_method_types[0]': 'card',
      'success_url': `${frontend}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      'cancel_url': `${frontend}/checkout/cancel`
    };
    lineItems.forEach((li: any, idx: number) => {
      params[`line_items[${idx}][price]`] = li.price;
      params[`line_items[${idx}][quantity]`] = String(li.quantity || 1);
    });

    const resp = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${secret}`,
        'content-type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(params).toString()
    });

    const data = await resp.json();
    if (!resp.ok) {
      return json(resp.status, { ok: false, error: 'Stripe error', details: data });
    }

    return json(200, { ok: true, mode: 'live', session: { id: data.id, url: data.url } });
  } catch (err: any) {
    return json(500, { ok: false, error: 'Internal Server Error', message: err?.message });
  }
};