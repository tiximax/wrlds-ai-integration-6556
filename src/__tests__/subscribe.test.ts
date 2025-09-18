import { describe, it, expect } from 'vitest';
import { subscribeEmail } from '@/services/subscribe';

describe('subscribeEmail service', () => {
  it('should reject invalid emails', async () => {
    const res = await subscribeEmail('not-an-email');
    expect(res.ok).toBe(false);
    expect(res.status).toBe(400);
  });

  it('should succeed in fallback mode when endpoint is not configured', async () => {
    const res = await subscribeEmail('user@example.com');
    expect(res.ok).toBe(true);
    expect(res.status).toBe(200);
  });
});
