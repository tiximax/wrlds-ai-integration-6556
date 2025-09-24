import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: Trust Signals - LiveActivityFeed on homepage

test.describe('Trust - Live Activity Feed', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('shows live activity feed on homepage', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    const feed = page.getByTestId('live-activity-feed');
    await expect(feed).toBeVisible({ timeout: 10000 });

    const firstItem = feed.getByTestId('live-activity-item').first();
    await expect(firstItem).toBeVisible({ timeout: 10000 });
  });
});