import { test, expect } from '@playwright/test';
import { clearStorage, disableOverlaysForTest } from './helpers';

// Verify double-click zoom toggles scale on ProductImageGallery dialog

test.describe('ProductImageGallery - Pinch/Zoom (double-click)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await clearStorage(page);
    await disableOverlaysForTest(page);
  });

  test('double-click to zoom in and out', async ({ page }) => {
    // Open zoom dialog by clicking main image
    const mainImage = page.locator('img').first();
    await mainImage.click();

    const zoomContainer = page.getByTestId('pinch-zoom');
    await expect(zoomContainer).toBeVisible({ timeout: 10000 });

    const getScale = async () => {
      const el = await zoomContainer.elementHandle();
      const val = await el?.getAttribute('data-scale');
      return val ? parseFloat(val) : 1;
    };

    const initialScale = await getScale();
    expect(initialScale).toBeCloseTo(1, 1);

    // Double tap (simulate by two quick clicks) to zoom in
    await zoomContainer.click();
    await page.waitForTimeout(80);
    await zoomContainer.click();
    const zoomedScale = await getScale();
    expect(zoomedScale).toBeGreaterThan(1.4); // default doubleTapScale is 2

    // Double tap again to zoom out
    await zoomContainer.click();
    await page.waitForTimeout(80);
    await zoomContainer.click();
    const resetScale = await getScale();
    expect(resetScale).toBeLessThan(1.2);
  });
});
