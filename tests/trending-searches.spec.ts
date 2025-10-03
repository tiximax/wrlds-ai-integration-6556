import { test, expect } from '@playwright/test';
import { disableOverlaysForTest } from './helpers';

// E2E: Trending searches section appears at top, shows items with counts, and clicking navigates

test.describe('Enhanced Search - Trending Searches', () => {
  test('shows trending items with counts and navigates on click', async ({ page }) => {
    await page.goto('/');
    await disableOverlaysForTest(page);

    const searchInput = page.getByPlaceholder(/Search products/i);
    await expect(searchInput).toBeVisible();

    // Focus input to open dropdown
    await searchInput.click();

    // Trending header appears
    await expect(page.getByText('Trending Searches').first()).toBeVisible({ timeout: 10000 });

    // There should be at least one trending item with a count badge
    const firstTrending = page.getByTestId('trending-search').first();
    await expect(firstTrending).toBeVisible();
    await expect(firstTrending.getByTestId('trending-search-count')).toBeVisible();

    // Click it and expect navigation to /products?search=
    await firstTrending.click();
    await expect(page).toHaveURL(/\/products\?search=/i);
  });
});
