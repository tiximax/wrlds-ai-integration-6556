import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: Virtual Scroll demo renders limited DOM nodes and updates on scroll

test.describe('Performance - Virtual Scroll Demo', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await clearStorage(page);
  });

  test('renders small number of rows and loads more on scroll', async ({ page }) => {
    await page.goto('/search');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    const demo = page.getByTestId('virtual-scroll-demo');
    await expect(demo).toBeVisible({ timeout: 10000 });

    // Count vs-item elements; should be significantly less than total (500)
    const initialCount = await demo.getByTestId('vs-item').count();
    expect(initialCount).toBeLessThan(60);

    // Scroll to near bottom
    await demo.evaluate((el) => { el.scrollTop = el.scrollHeight; });

    // After scrolling, ensure the last item appears in text
    await expect(demo.getByText('Row #500')).toBeVisible();
  });
});
