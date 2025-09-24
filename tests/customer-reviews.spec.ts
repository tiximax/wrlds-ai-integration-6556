import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: CustomerReviews stub should render in ProductDetail

test.describe('CustomerReviews (Trust)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);

    // Instrumentation: capture console logs, page errors, and network failures
    page.on('console', (msg) => {
      // eslint-disable-next-line no-console
      console.log(`[console:${msg.type()}]`, msg.text());
    });
    page.on('pageerror', (err) => {
      // eslint-disable-next-line no-console
      console.log(`[pageerror]`, err.message);
    });
    page.on('requestfailed', (req) => {
      // eslint-disable-next-line no-console
      console.log(`[requestfailed]`, req.url(), '-', req.failure()?.errorText);
    });
    page.on('response', async (res) => {
      if (!res.ok()) {
        // eslint-disable-next-line no-console
        console.log(`[response ${res.status()}]`, res.url());
      }
    });
  });

  test('should render customer reviews on product detail (deep link)', async ({ page }) => {
    try {
      // Navigate directly to the product detail (consistent with other product tests)
      await page.goto('/products/premium-japanese-sneakers', { waitUntil: 'domcontentloaded' });
      await removeSilktide(page);

      // Scroll to bottom to ensure sections mount/animate into view
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

      // Check customer reviews section by test id or fallback by heading text
      const reviews = page.getByTestId('customer-reviews');
      try {
        await expect(reviews).toBeVisible({ timeout: 15000 });
      } catch {
        await expect(page.getByRole('heading', { name: /Customer Reviews/i })).toBeVisible({ timeout: 15000 });
      }
    } catch (err) {
      // Attach screenshot and basic diagnostics
      try {
        const shot = await page.screenshot({ fullPage: true });
        await test.info().attach('screenshot', { body: shot, contentType: 'image/png' });
      } catch {}
      try {
        // eslint-disable-next-line no-console
        console.log('[diagnostic:url]', page.url());
      } catch {}
      throw err;
    }
  });
});
