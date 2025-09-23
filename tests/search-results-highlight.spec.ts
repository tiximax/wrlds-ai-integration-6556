import { test, expect } from '@playwright/test';

// Verify SearchResults grid renders <mark> inside product cards based on query

test.describe('Search Results Highlight', () => {
  test('should show highlighted tokens in product cards', async ({ page }) => {
    // Navigate to /search via navbar for SPA routing
    await page.goto('/');
    await page.addStyleTag({ content: '#silktide-backdrop, #silktide-wrapper { display: none !important; }' });
    await page.getByRole('link', { name: 'Search' }).click();
    await expect(page).toHaveURL(/\/search$/, { timeout: 10000 });

    // Set query via history to avoid typing complexity
    await page.evaluate(() => {
      history.replaceState({}, '', '/search?query=Japanese');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await expect(page).toHaveURL(/query=Japanese/, { timeout: 10000 });

    // Wait for SearchResults heading
    await expect(page.getByTestId('search-results-heading')).toBeVisible({ timeout: 10000 });

    // Expect at least one <mark> inside the results grid
    const grid = page.getByTestId('search-results-grid');
    await expect(grid).toBeVisible();
    const mark = grid.locator('mark');
    await expect(mark.first()).toBeVisible();
  });
});
