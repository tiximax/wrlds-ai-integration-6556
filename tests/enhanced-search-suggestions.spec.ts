import { test, expect } from '@playwright/test';

// E2E: Enhanced Search suggestions should handle typos via fuzzy match
// Flow: Home -> type 'japn' -> see suggestion 'Premium Japanese Sneakers' -> click -> land on /products?search=... -> product appears

test.describe('Enhanced Search Suggestions (Fuzzy)', () => {
  test('should suggest product on typo and navigate to results', async ({ page }) => {
    // Open home and hide Silktide overlay to avoid click interception
    await page.goto('/');
    await page.addStyleTag({ content: '#silktide-backdrop, #silktide-wrapper { display: none !important; }' });

    // Focus search input
    const searchInput = page.getByPlaceholder(/Search products/i);
    await expect(searchInput).toBeVisible();

    // Type a typo query
    await searchInput.fill('japn');

    // Expect suggestions dropdown to show the target product
    const suggestion = page.getByRole('button', { name: /Premium Japanese Sneakers/i });
    await expect(suggestion).toBeVisible();

    // Click the suggestion -> should navigate to products listing filtered
    await suggestion.click();

    // Expect URL to be /products?search=...
    await expect(page).toHaveURL(/\/products\?search=/i);

    // Assert product card visible
    await expect(page.getByText(/Premium Japanese Sneakers/i).first()).toBeVisible();
  });
});
