import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';
import { configureRetriesForCI, skipFlakyInCI } from './ci-flaky-control';

// Recently Viewed: visiting two product pages should show the first in the second page's recently viewed list

test.describe('Recently Viewed - Product Detail', () => {
  // Phase 2: allow unskip via env flag; keep one retry in CI
  configureRetriesForCI(test, 1);
  skipFlakyInCI(test, 'UNSKIP_RECENTLY_VIEWED', 'Recently viewed still under hardening');

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('shows previously viewed product', async ({ page, browserName }) => {
    // Visit first product
    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Visit second product
    await page.goto('/products/korean-beauty-set');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Chờ localStorage có dữ liệu recentlyViewed trước khi assert UI
    await page.waitForFunction(() => {
      try {
        const rv = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
        return Array.isArray(rv) && rv.length > 0;
      } catch (e) {
        return false;
      }
    }, { timeout: 15000 });

    // Recently viewed section should appear
    const rv = page.getByTestId('recently-viewed');
    await expect(rv).toBeVisible({ timeout: 15000 });

    // Should contain the first product title
    await expect(rv.locator('a', { hasText: 'Premium Japanese Sneakers' }).first()).toBeVisible();
  });
});
