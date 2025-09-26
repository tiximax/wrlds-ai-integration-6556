// Netlify function: /.netlify/functions/paypal-create-order
// Creates a PayPal order in sandbox/live when enabled, otherwise returns a demo payload
// Env: PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_ENV=sandbox|live, FRONTEND_URL, ENABLE_LIVE_PAYMENTS|PAYMENTS_MODE

import type { Handler } from '@netlify/functions';

function json(statusCode: number, data: unknown) {
  return {
    statusCode,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(data)
  };
}

async function getPayPalAccessToken(env: 'sandbox' | 'live', clientId: string, clientSecret: string) {
  const base = env === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
  const resp = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await resp.json();
  if (!resp.ok) throw new Error(data?.error_description || 'Failed to get PayPal token');
  return { token: data.access_token as string, base };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method Not Allowed' });
  }

  const live = (process.env.ENABLE_LIVE_PAYMENTS === 'true') || (process.env.PAYMENTS_MODE === 'live');
  const env = (process.env.PAYPAL_ENV === 'live' ? 'live' : 'sandbox') as 'sandbox' | 'live';
  const frontend = process.env.FRONTEND_URL || 'http://localhost:8888';

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const amount = Number(body.amount || 0);
    const currency = (body.currency || 'USD').toString();

    if (!live) {
      const id = `PAYPAL_DEMO_${Date.now()}`;
      const approveUrl = `https://www.sandbox.paypal.com/checkoutnow?token=${id}`;
      return json(200, { ok: true, mode: 'demo', id, approveUrl });
    }

    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return json(400, { ok: false, error: 'Missing PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET' });
    }
    if (!amount || amount <= 0) {
      return json(400, { ok: false, error: 'Invalid amount' });
    }

    const { token, base } = await getPayPalAccessToken(env, clientId, clientSecret);
    const orderResp = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { currency_code: currency, value: amount.toFixed(2) }
          }
        ],
        application_context: {
          return_url: `${frontend}/paypal/return`,
          cancel_url: `${frontend}/paypal/cancel`
        }
      })
    });

    const data = await orderResp.json();
    if (!orderResp.ok) {
      return json(orderResp.status, { ok: false, error: 'PayPal error', details: data });
    }

    const approveLink = (data.links || []).find((l: any) => l.rel === 'approve')?.href;
    return json(200, { ok: true, mode: env, id: data.id, approveUrl: approveLink });
  } catch (err: any) {
    return json(500, { ok: false, error: 'Internal Server Error', message: err?.message });
  }
};