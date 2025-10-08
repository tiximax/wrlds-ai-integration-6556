import { test, expect } from '@playwright/test';
import { removeSilktide } from './helpers';

// E2E: Service Worker smoke - cache created and SW active on homepage

test.describe('Performance - Service Worker', () => {
  test('registers service worker and creates cache', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Wait briefly for SW install + activate
    await page.waitForTimeout(1500);

    // Check caches keys for our cache name
    const hasCache = await page.evaluate(async () => {
      try {
        const keys = await caches.keys();
        return keys.includes('wrlds-cache-v1');
      } catch {
        return false;
      }
    });

    expect(hasCache).toBeTruthy();
  });
});
