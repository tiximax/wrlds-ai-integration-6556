import { test, expect } from '@playwright/test';

// Verify SimpleProducts page renders <mark> in product cards when ?search= is provided

test.describe('Products Highlight', () => {
  test('should render highlights in /products grid', async ({ page }) => {
    await page.goto('/products?search=Japanese');
    await page.addStyleTag({ content: '#silktide-backdrop, #silktide-wrapper { display: none !important; }' });

    // Wait for URL
    await expect(page).toHaveURL(/\/products\?search=/, { timeout: 10000 });

    // Expect at least one mark in the page (grid renders SimpleProductCard with marks)
    const mark = page.locator('mark');
    await expect(mark.first()).toBeVisible({ timeout: 10000 });
  });
});
