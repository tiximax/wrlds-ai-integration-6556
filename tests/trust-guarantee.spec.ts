import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: Guarantee badges should be visible on product detail page

test.describe('Trust - Guarantee Badges', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('shows guarantee badges on product detail page', async ({ page }) => {
    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    const gb = page.getByTestId('guarantee-badges');
    await expect(gb).toBeVisible({ timeout: 10000 });
    await expect(gb.getByText(/Bảo hành chính hãng/i)).toBeVisible();
    await expect(gb.getByText(/Hoàn tiền 7 ngày/i)).toBeVisible();
  });
});
