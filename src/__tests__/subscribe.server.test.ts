import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import vercelHandler from '../../api/subscribe';
import { handler as netlifyHandler } from '../../netlify/functions/subscribe';

// Helper to mock res object for Vercel handler
function createRes() {
  const result: { statusCode?: number; jsonBody?: any } = {};
  const res = {
    status(code: number) {
      result.statusCode = code;
      return {
        json(body: any) {
          result.jsonBody = body;
        }
      };
    }
  } as any;
  return { res, result };
}

const OLD_ENV = { ...process.env };

describe('Serverless subscribe endpoints', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.resetAllMocks();
    // Reset env and mock fetch fresh for each test
    for (const k of ['SUBSCRIBE_WEBHOOK_URL', 'SUBSCRIBE_API_KEY']) {
      // @ts-ignore
      delete process.env[k];
    }
  });

  afterEach(() => {
    // Restore env
    process.env = { ...OLD_ENV };
  });

  describe('Vercel /api/subscribe', () => {
    it('returns 405 for non-POST', async () => {
      const { res, result } = createRes();
      await vercelHandler({ method: 'GET' } as any, res);
      expect(result.statusCode).toBe(405);
      expect(result.jsonBody).toEqual({ ok: false, error: 'Method Not Allowed' });
    });

    it('returns 400 for invalid email', async () => {
      const { res, result } = createRes();
      await vercelHandler({ method: 'POST', body: { email: 'bad' } } as any, res);
      expect(result.statusCode).toBe(400);
      expect(result.jsonBody).toEqual({ ok: false, error: 'Invalid email' });
    });

    it('forwards to webhook with Authorization when configured', async () => {
      process.env.SUBSCRIBE_WEBHOOK_URL = 'https://example.com/webhook';
      process.env.SUBSCRIBE_API_KEY = 'secret-token';

      const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
      // @ts-ignore
      globalThis.fetch = fetchMock;

      const { res, result } = createRes();
      await vercelHandler({ method: 'POST', body: { email: 'user@example.com' }, headers: { 'user-agent': 'vitest', 'x-forwarded-for': '1.2.3.4' } } as any, res);

      expect(result.statusCode).toBe(200);
      expect(result.jsonBody).toEqual({ ok: true });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe('https://example.com/webhook');
      expect(options.method).toBe('POST');
      expect(options.headers['content-type']).toBe('application/json');
      expect(options.headers['authorization']).toBe('Bearer secret-token');
      expect(() => JSON.parse(options.body)).not.toThrow();
    });

    it('returns 502 when upstream webhook fails', async () => {
      process.env.SUBSCRIBE_WEBHOOK_URL = 'https://example.com/webhook';
      const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
      // @ts-ignore
      globalThis.fetch = fetchMock;

      const { res, result } = createRes();
      await vercelHandler({ method: 'POST', body: { email: 'user@example.com' } } as any, res);
      expect(result.statusCode).toBe(502);
      expect(result.jsonBody.ok).toBe(false);
      expect(result.jsonBody.error).toBe('Upstream subscription failed');
      expect(result.jsonBody.upstreamStatus).toBe(500);
    });

    it('falls back to 200 when no webhook configured', async () => {
      const { res, result } = createRes();
      await vercelHandler({ method: 'POST', body: { email: 'user@example.com' } } as any, res);
      expect(result.statusCode).toBe(200);
      expect(result.jsonBody).toEqual({ ok: true });
    });
  });

  describe('Netlify /.netlify/functions/subscribe', () => {
    it('returns 405 for non-POST', async () => {
      const resp = await netlifyHandler({ httpMethod: 'GET' } as any);
      expect(resp.statusCode).toBe(405);
    });

    it('returns 400 for invalid email', async () => {
      const resp = await netlifyHandler({ httpMethod: 'POST', body: JSON.stringify({ email: 'bad' }) } as any);
      expect(resp.statusCode).toBe(400);
      expect(JSON.parse(resp.body)).toEqual({ ok: false, error: 'Invalid email' });
    });

    it('forwards to webhook and returns 200 when ok', async () => {
      process.env.SUBSCRIBE_WEBHOOK_URL = 'https://example.netlify/hook';
      process.env.SUBSCRIBE_API_KEY = 'netlify-token';
      const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
      // @ts-ignore
      globalThis.fetch = fetchMock;

      const resp = await netlifyHandler({
        httpMethod: 'POST',
        body: JSON.stringify({ email: 'user@example.com' }),
        headers: { 'user-agent': 'vitest', 'x-forwarded-for': '5.6.7.8' }
      } as any);

      expect(resp.statusCode).toBe(200);
      expect(JSON.parse(resp.body)).toEqual({ ok: true });

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];
      expect(url).toBe('https://example.netlify/hook');
      expect(options.headers['authorization']).toBe('Bearer netlify-token');
    });

    it('returns 502 when upstream webhook fails', async () => {
      process.env.SUBSCRIBE_WEBHOOK_URL = 'https://example.netlify/hook';
      const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503 });
      // @ts-ignore
      globalThis.fetch = fetchMock;

      const resp = await netlifyHandler({ httpMethod: 'POST', body: JSON.stringify({ email: 'user@example.com' }) } as any);
      expect(resp.statusCode).toBe(502);
      const parsed = JSON.parse(resp.body);
      expect(parsed.ok).toBe(false);
      expect(parsed.error).toBe('Upstream subscription failed');
      expect(parsed.upstreamStatus).toBe(503);
    });

    it('falls back to 200 when no webhook configured', async () => {
      const resp = await netlifyHandler({ httpMethod: 'POST', body: JSON.stringify({ email: 'user@example.com' }) } as any);
      expect(resp.statusCode).toBe(200);
      expect(JSON.parse(resp.body)).toEqual({ ok: true });
    });
  });
});