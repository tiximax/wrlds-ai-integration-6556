import { test, expect } from '@playwright/test';

// Verify filter chips removal updates URL and UI

test.describe('Search Filters Chips', () => {
  test('remove origin chip updates URL and chips', async ({ page }) => {
    // Navigate to /search via navbar link for SPA routing
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.addStyleTag({ content: '#silktide-backdrop, #silktide-wrapper { display: none !important; }' });
    await page.getByRole('link', { name: 'Search' }).click();
    await expect(page).toHaveURL(/\/search$/, { timeout: 10000 });

    // Append desired params
    await page.evaluate(() => {
      history.replaceState({}, '', '/search?origin=japan&status=available');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await expect(page).toHaveURL(/\/search\?origin=japan/, { timeout: 10000 });

    // Wait for filters UI to load
    await expect(page.getByText('Bộ lọc', { exact: true })).toBeVisible({ timeout: 10000 });

    // Chips visible
    await expect(page.getByTestId('chip-origin-japan')).toBeVisible();
    await expect(page.getByTestId('chip-status-available')).toBeVisible();

    // Remove origin
    await page.getByTestId('chip-remove-origin-japan').click();

    // Origin chip disappears
    await expect(page.getByTestId('chip-origin-japan')).toHaveCount(0);

    // URL should not contain origin=japan
    await expect(page).not.toHaveURL(/origin=japan/);

    // Status chip remains
    await expect(page.getByTestId('chip-status-available')).toBeVisible();
  });
});
