import { test, expect } from '@playwright/test';
import { removeSilktide } from './helpers';

// PWA Preview Smoke: Only meaningful when running in preview build with vite-plugin-pwa enabled
// Run with: npm run test:e2e:preview -- tests/pwa-preview-smoke.spec.ts --reporter=line

test.describe('PWA Preview Smoke (Workbox)', () => {
  test('registers Workbox service worker and creates precache', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Wait a moment for SW registration
    await page.waitForTimeout(2000);

    // Detect Workbox SW registration
    const hasWorkboxSW = await page.evaluate(async () => {
      try {
        if (!('serviceWorker' in navigator)) return false;
        const regs = await navigator.serviceWorker.getRegistrations();
        return regs.some(r => r.active && r.active.scriptURL.includes('pwa-sw'));
      } catch { return false; }
    });

    if (!hasWorkboxSW) {
      test.skip(true, 'No Workbox SW detected (likely not running preview build with PWA enabled).');
    }

    // Check for Workbox precache cache key
    const hasPrecache = await page.evaluate(async () => {
      try {
        const keys = await caches.keys();
        return keys.some(k => k.toLowerCase().includes('workbox') || k.toLowerCase().includes('precache'));
      } catch { return false; }
    });

    expect(hasPrecache).toBeTruthy();
  });
});
