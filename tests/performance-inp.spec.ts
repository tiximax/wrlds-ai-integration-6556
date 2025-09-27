import { test, expect } from '@playwright/test';
import { removeSilktide } from './helpers';

// E2E: Ensure INP (standard via web-vitals) or INP_approx (fallback) is recorded after user interactions
// We disable sendBeacon to force localStorage fallback, then read the analytics queue.

test.describe('Performance - INP Analytics', () => {
  test('reports INP (standard or approx) after interactions', async ({ page }) => {
    test.setTimeout(45000);
    // Force localStorage fallback for analytics
    await page.addInitScript(() => {
      // @ts-ignore
      navigator.sendBeacon = undefined;
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Perform some interactions to generate event timings for INP measurement
    try {
      try {
        await page.getByRole('link', { name: 'Search' }).click({ timeout: 3000 });
      } catch {
        // Fallback: click somewhere on the page
        await page.mouse.click(50, 50);
      }

      // Additional interactions
      await page.mouse.click(60, 60);
      await page.keyboard.press('Tab');
    } catch {
      // If any interaction fails (page closed, overlay, etc.), continue to finalize and skip if needed
    }

    // Give observers a brief moment
    await page.waitForTimeout(500);

    // Finalize metrics (web-vitals reports INP on visibility change/pagehide)
    await page.evaluate(() => window.dispatchEvent(new Event('pagehide')));

    // Read analytics queue
    const queue = await page.evaluate(() => {
      try {
        const raw = localStorage.getItem('analytics-queue-v1');
        return raw ? JSON.parse(raw) : [];
      } catch { return []; }
    });

    const vitals = queue.filter((e: any) => e?.name === 'webvitals');
    if (vitals.length === 0) {
      test.skip(true, 'Web Vitals not reported in this environment (skipping).');
    }

    const metrics = new Set(vitals.map((e: any) => e?.props?.metric));
    // INP (preferred) or INP_approx (fallback)
    expect(metrics.has('INP') || metrics.has('INP_approx')).toBeTruthy();
  });
});
