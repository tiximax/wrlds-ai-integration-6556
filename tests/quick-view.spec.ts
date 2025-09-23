import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// Verify Quick View opens from Product Grid and can be closed

test.describe('Quick View - Product Grid', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');
    await clearStorage(page);
    await removeSilktide(page);
  });

  test('open and close quick view from first product', async ({ page }) => {
    // Ensure grid loaded
    const firstQuickBtn = page.getByTestId('quick-view-button').first();
    await firstQuickBtn.scrollIntoViewIfNeeded();

    // Hover to reveal if needed, then click
    try {
      await firstQuickBtn.click({ timeout: 5000 });
    } catch {
      // fallback: attempt DOM click
      await page.evaluate(() => {
        const btn = document.querySelector('[data-testid="quick-view-button"]') as HTMLButtonElement | null;
        btn?.click();
      });
    }

    // Dialog should be visible
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 10000 });

    // Expect some product info is present (title or price)
    const anyTitle = dialog.locator('h2, h3, [data-dialog-title]');
    await expect(anyTitle.first()).toBeVisible();

    // Close by pressing Escape or clicking close button
    try {
      await page.keyboard.press('Escape');
    } catch {
      const closeBtn = dialog.locator('button').filter({ hasText: /×|close|đóng/i }).first();
      if (await closeBtn.count()) await closeBtn.click();
    }

    await expect(dialog).toBeHidden();
  });
});
