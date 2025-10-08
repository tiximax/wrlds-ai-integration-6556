import { test, expect } from '@playwright/test';
import { removeSilktide } from './helpers';

// E2E: Preload image link present on homepage head

test.describe('Performance - Preload LCP Image', () => {
  test('home has preload link for featured image', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    const hasPreload = await page.evaluate(() => !!document.querySelector('link[rel="preload"][as="image"]'));
    expect(hasPreload).toBeTruthy();
  });
});
