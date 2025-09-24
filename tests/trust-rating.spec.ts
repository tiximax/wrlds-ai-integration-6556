import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: Trust - Rating distribution and verified badges on PDP

test.describe('Trust - Rating Distribution & Verified', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('shows rating distribution and verified badges on product detail', async ({ page }) => {
    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    await expect(page.getByTestId('rating-distribution')).toBeVisible();
    await expect(page.getByTestId('customer-reviews')).toBeVisible();
    await expect(page.getByTestId('customer-reviews').getByTestId('verified-badge').first()).toBeVisible();
  });
});
