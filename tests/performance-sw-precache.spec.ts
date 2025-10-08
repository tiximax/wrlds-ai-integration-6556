import { test, expect } from '@playwright/test';
import { removeSilktide } from './helpers';

// E2E: Service Worker pre-cache routes at install

test.describe('Performance - Service Worker Precache', () => {
  test('pre-caches /products and /search on install', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Wait for install/activate
    await page.waitForTimeout(1500);

    const result = await page.evaluate(async () => {
      try {
        const cache = await caches.open('wrlds-cache-v1');
        const res1 = await cache.match('/products');
        const res2 = await cache.match('/search');
        return Boolean(res1) && Boolean(res2);
      } catch { return false; }
    });

    expect(result).toBeTruthy();
  });
});
