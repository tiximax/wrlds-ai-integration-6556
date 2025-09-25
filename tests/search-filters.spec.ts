import { test, expect } from '@playwright/test';
import { disableOverlaysForTest } from './helpers';

// Verify filter chips removal updates URL and UI

test.describe('Search Filters Chips', () => {
  test('remove origin chip updates URL and chips', async ({ page }) => {
    // Navigate to /search via navbar link for SPA routing
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await disableOverlaysForTest(page);
    await page.getByRole('link', { name: 'Search' }).click();
    await expect(page).toHaveURL(/\/search$/, { timeout: 10000 });

    // Append desired params
    await page.evaluate(() => {
      history.replaceState({}, '', '/search?origin=japan&status=available');
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    await expect(page).toHaveURL(/\/search\?origin=japan/, { timeout: 10000 });

    // Wait for filters UI to load (narrow by role to avoid strict mode violation)
    const filterHeading = page.getByRole('heading', { name: 'Bộ lọc' }).first();
    await expect(filterHeading).toBeVisible({ timeout: 10000 });

    // Chips visible
    await expect(page.getByTestId('chip-origin-japan')).toBeVisible();
    await expect(page.getByTestId('chip-status-available')).toBeVisible();

    // Remove origin (ensure in view, then click with fallback)
    const removeOrigin = page.getByTestId('chip-remove-origin-japan');
    await removeOrigin.scrollIntoViewIfNeeded();
    try {
      await removeOrigin.click();
    } catch {
      await removeOrigin.click({ force: true });
    }

    // Origin chip disappears
    await expect(page.getByTestId('chip-origin-japan')).toHaveCount(0);

    // URL should not contain origin=japan
    await expect(page).not.toHaveURL(/origin=japan/);

    // Status chip remains
    await expect(page.getByTestId('chip-status-available')).toBeVisible();
  });
});
