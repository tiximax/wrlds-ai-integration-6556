import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: Trust Signals - Assurance Policies on PDP and Checkout

test.describe('Trust - Assurance Policies', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('shows assurance policies on product detail page', async ({ page }) => {
    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    await expect(page.getByTestId('assurance-policies')).toBeVisible({ timeout: 10000 });
  });

  test('shows assurance policies on checkout page', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    await expect(page.getByTestId('assurance-policies-checkout')).toBeVisible({ timeout: 10000 });
  });
});