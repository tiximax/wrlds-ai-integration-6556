import { test, expect } from '@playwright/test';
import { clearStorage, removeSilktide } from './helpers';

// BottomNav mobile cart button should open cart sidebar

test.describe('BottomNav - Mobile Cart', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await clearStorage(page);
    await removeSilktide(page);
  });

  test('tap bottom nav cart opens cart sidebar', async ({ page }) => {
    // Bottom nav should be visible on mobile
    const bottomNav = page.getByTestId('bottom-nav');
    await expect(bottomNav).toBeVisible({ timeout: 10000 });

    const cartBtn = page.getByTestId('bottomnav-cart-button');
    await expect(cartBtn).toBeVisible();

    // Try normal click first, fallback to DOM click to avoid overlay issues
    try {
      await cartBtn.click({ timeout: 5000 });
    } catch {
      await page.evaluate(() => {
        const el = document.querySelector('[data-testid="bottomnav-cart-button"]') as HTMLButtonElement | null;
        el?.click();
      });
    }

    const cartSidebar = page.locator('[data-testid="cart-sidebar"]').first();
    await expect(cartSidebar).toBeVisible();
  });
});
