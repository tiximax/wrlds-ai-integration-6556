import { test, expect } from '@playwright/test';
import { disableOverlaysForTest } from './helpers';

// E2E: Visual Search - upload image file name becomes query and navigates to results

test.describe('Enhanced Search - Visual Search', () => {
  test('uploading an image triggers navigation to search results', async ({ page }) => {
    await page.goto('/');
    await disableOverlaysForTest(page);

    // Upload a file with a name that maps to an existing product (can set on hidden input)
    const visualInput = page.getByTestId('search-visual-input');
    await visualInput.setInputFiles('tests/assets/japanese-sneakers.png');

    // Should navigate to products search page
    await expect(page).toHaveURL(/\/products\?search=/i);

    // The Japanese Sneakers product should be visible in results
    await expect(page.getByText(/Premium Japanese Sneakers/i).first()).toBeVisible();
  });
});
