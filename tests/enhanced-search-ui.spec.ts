import { test, expect } from '@playwright/test';

// UI checks for Enhanced Search dropdown: highlight (<mark>) exists for matched part

test.describe('Enhanced Search UI', () => {
  test('should render highlight mark in suggestions', async ({ page }) => {
    await page.goto('/');
    await page.addStyleTag({ content: '#silktide-backdrop, #silktide-wrapper { display: none !important; }' });

    const searchInput = page.getByPlaceholder(/Search products/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill('jap');

    const suggestion = page.getByRole('button', { name: /Premium Japanese Sneakers/i });
    await expect(suggestion).toBeVisible();

    // verify highlight exists
    await expect(suggestion.locator('mark')).toBeVisible();
  });
});
