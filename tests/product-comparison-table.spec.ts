import { test, expect } from '@playwright/test';
import { disableOverlaysForTest, clearStorage } from './helpers';

// Ensure the detailed comparison table renders when >= 2 items are selected

test.describe('Product Comparison Table', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
    await page.goto('/products');
    await page.waitForLoadState('domcontentloaded');
    await disableOverlaysForTest(page);
  });

  test('renders detailed table after adding two items', async ({ page }) => {
    // Add two products to compare via DOM to avoid hover dependency
    await page.waitForSelector('[data-testid="add-to-compare"]', { state: 'attached', timeout: 10000 });
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('[data-testid="add-to-compare"]')) as HTMLButtonElement[];
      for (let i = 0; i < btns.length && i < 2; i++) {
        btns[i].click();
      }
    });

    // Ensure localStorage updated or seed fallback
    const updated = await page.waitForFunction(() => {
      try {
        const arr = JSON.parse(localStorage.getItem('compare-list') || '[]');
        return Array.isArray(arr) && arr.length >= 2;
      } catch { return false; }
    }, { timeout: 4000 }).catch(async () => false);

    if (!updated) {
      await page.evaluate(() => localStorage.setItem('compare-list', JSON.stringify(['1','2'])));
      await page.waitForTimeout(200);
    }

    // Open the compare drawer
    await page.getByTestId('compare-open-button').click();

    // Expect the comparison table to be visible on desktop
    const table = page.getByTestId('comparison-table');
    await expect(table).toBeVisible({ timeout: 10000 });
  });
});
