// Netlify function: /.netlify/functions/easypost-rates
// Returns shipping rates via EasyPost when enabled, otherwise returns demo rates
// Env: EASYPOST_API_KEY, ENABLE_LIVE_PAYMENTS|PAYMENTS_MODE, FRONTEND_URL (optional)

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

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const from = body.from || {};
    const to = body.to || {};
    const parcel = body.parcel || {};

    if (!live) {
      return json(200, {
        ok: true,
        mode: 'demo',
        rates: [
          { carrier: 'USPS', service: 'Priority', rate: '8.50', currency: 'USD', est_delivery_days: 3 },
          { carrier: 'UPS', service: 'Ground', rate: '10.25', currency: 'USD', est_delivery_days: 5 },
          { carrier: 'FedEx', service: 'Express Saver', rate: '14.90', currency: 'USD', est_delivery_days: 3 }
        ]
      });
    }

    const apiKey = process.env.EASYPOST_API_KEY;
    if (!apiKey) return json(400, { ok: false, error: 'Missing EASYPOST_API_KEY' });

    // Minimal addresses and parcel for EasyPost
    const payload = {
      to_address: {
        zip: to.zip || '94016',
        country: to.country || 'US'
      },
      from_address: {
        zip: from.zip || '94105',
        country: from.country || 'US'
      },
      parcel: {
        weight: parcel.weight || 16
      }
    };

    const resp = await fetch('https://api.easypost.com/v2/shipments', {
      method: 'POST',
      headers: {
        'authorization': 'Basic ' + Buffer.from(apiKey + ':').toString('base64'),
        'content-type': 'application/json'
      },
      body: JSON.stringify({ shipment: payload })
    });

    const data = await resp.json();
    if (!resp.ok) {
      return json(resp.status, { ok: false, error: 'EasyPost error', details: data });
    }

    // EasyPost returns shipment with rates[]
    const rates = data?.rates || data?.shipment?.rates || [];
    return json(200, { ok: true, mode: 'live', rates });
  } catch (err: any) {
    return json(500, { ok: false, error: 'Internal Server Error', message: err?.message });
  }
};