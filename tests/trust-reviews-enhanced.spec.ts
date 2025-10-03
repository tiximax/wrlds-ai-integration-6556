import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: Enhanced CustomerReviews - sort & filter photos

test.describe('Trust - CustomerReviews Enhanced', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('can filter by photos and sort by highest rating', async ({ page }) => {
    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    const section = page.getByTestId('customer-reviews');
    await expect(section).toBeVisible({ timeout: 10000 });

    // Filter with photos
    const filterPhotos = section.getByTestId('review-filter-photos');
    await filterPhotos.check();
    // Expect at least one photo in first visible review
    const firstWithPhoto = section.getByTestId('review-photo').first();
    await expect(firstWithPhoto).toBeVisible();

    // Sort by highest
    const sortSelect = section.getByTestId('review-sort');
    await sortSelect.selectOption('highest');

    // Check first review has highest rating (data-rating=5)
    const firstReview = section.getByTestId('review-item').first();
    await expect(firstReview).toHaveAttribute('data-rating', /5/);
  });
});
