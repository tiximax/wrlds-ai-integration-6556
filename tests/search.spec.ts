import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// Basic E2E for /search page

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await clearStorage(page);
  await removeSilktide(page);
});

test('search results show for query watch', async ({ page }) => {
  await page.goto('/search?query=watch');
  await page.waitForLoadState('domcontentloaded');
  await removeSilktide(page);

  await expect(page.locator('h1', { hasText: 'Search Results' })).toBeVisible();
  // European Fashion Watch exists in simpleProducts
  await expect(page.locator('h3', { hasText: 'European Fashion Watch' })).toBeVisible();
});