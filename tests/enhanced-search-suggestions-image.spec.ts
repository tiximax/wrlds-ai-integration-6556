import { test, expect } from '@playwright/test';
import { disableOverlaysForTest } from './helpers';

// E2E: Enhanced Search suggestions should show product thumbnail images for product-type suggestions

test.describe('Enhanced Search Suggestions - Images', () => {
  test('product suggestions render with image thumbnails', async ({ page }) => {
    await page.goto('/');
    await disableOverlaysForTest(page);

    const searchInput = page.getByPlaceholder(/Search products/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill('japn');

    // target suggestion should have an image thumbnail
    const suggestion = page.getByRole('button', { name: /Premium Japanese Sneakers/i });
    await expect(suggestion).toBeVisible({ timeout: 10000 });

    const img = suggestion.getByTestId('search-suggestion-image');
    await expect(img).toBeVisible();
  });
});
