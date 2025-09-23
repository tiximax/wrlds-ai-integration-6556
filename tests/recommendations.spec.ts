import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// Product Recommendations: section appears on product page and contains items

test.describe('Product Recommendations - Product Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('shows recommended products', async ({ page }) => {
    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    const rec = page.getByTestId('product-recommendations');
    await expect(rec).toBeVisible({ timeout: 10000 });

    // Should contain at least one product card link
    const anyLink = rec.locator('a[href^="/products/"]').first();
    await expect(anyLink).toBeVisible();
  });
});
