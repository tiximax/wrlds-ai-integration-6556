import { test, expect } from '@playwright/test';
import { removeSilktide } from './helpers';

// E2E: Prefetch route hints exist on homepage

test.describe('Performance - Prefetch Routes', () => {
  test('home has prefetch links for /products or /search', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    const prefetchHrefs = await page.evaluate(() => Array.from(document.querySelectorAll('link[rel="prefetch"]')).map(l => (l as HTMLLinkElement).href));
    // At least one prefetch for products or search
    const matched = prefetchHrefs.filter(h => h.includes('/products') || h.includes('/search'));
    expect(matched.length).toBeGreaterThan(0);
  });
});
