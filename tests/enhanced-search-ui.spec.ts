import { test, expect } from '@playwright/test';
import { disableOverlaysForTest } from './helpers';

// UI checks for Enhanced Search dropdown: highlight (<mark>) exists for matched part

test.describe('Enhanced Search UI', () => {
  test('should render highlight mark in suggestions', async ({ page }) => {
    await page.goto('/');
    await disableOverlaysForTest(page);

    const searchInput = page.getByPlaceholder(/Search products/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill('jap');

    const suggestion = page.getByRole('button', { name: /Premium Japanese Sneakers/i });
    await expect(suggestion).toBeVisible();

    // verify highlight exists
    await expect(suggestion.locator('mark')).toBeVisible();
  });
});
