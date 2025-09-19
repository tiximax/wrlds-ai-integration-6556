import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// Basic E2E for /category pages

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await clearStorage(page);
  await removeSilktide(page);
});

test('electronics category shows breadcrumbs and products', async ({ page }) => {
  await page.goto('/category/electronics');
  await page.waitForLoadState('domcontentloaded');
  await removeSilktide(page);

  await expect(page.locator('nav[aria-label="breadcrumb"]')).toBeVisible();
  await expect(page.locator('h1', { hasText: 'Electronics' })).toBeVisible();

  // Should have at least one product card linking to /products/<slug>
  const productLinks = page.locator('a[href^="/products/"]');
  await expect(productLinks.first()).toBeVisible();
});