import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// Lens Zoom: ensure lens container exists and becomes active on hover (desktop)

test.describe('Lens Zoom - Product Detail', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await clearStorage(page);
  });

  test('lens activates on hover over main image', async ({ page }) => {
    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    const lens = page.getByTestId('lens-zoom').first();
    await expect(lens).toBeVisible({ timeout: 10000 });

    const box = await lens.boundingBox();
    if (box) {
      await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    }

    await expect(lens).toHaveAttribute('data-active', 'true');
  });
});
