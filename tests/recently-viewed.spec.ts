import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// Recently Viewed: visiting two product pages should show the first in the second page's recently viewed list

test.describe('Recently Viewed - Product Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('shows previously viewed product', async ({ page }) => {
    // Visit first product
    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Visit second product
    await page.goto('/products/korean-beauty-set');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Recently viewed section should appear
    const rv = page.getByTestId('recently-viewed');
    await expect(rv).toBeVisible({ timeout: 10000 });

    // Should contain the first product title
    await expect(rv.locator('a', { hasText: 'Premium Japanese Sneakers' }).first()).toBeVisible();
  });
});
