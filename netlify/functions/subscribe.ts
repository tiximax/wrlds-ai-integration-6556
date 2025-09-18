// Netlify function: /.netlify/functions/subscribe
// Accepts POST { email } and returns { ok }

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

    // TODO: Implement real subscription logic here (DB/email provider)

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: 'Internal Server Error' }) };
  }
};
