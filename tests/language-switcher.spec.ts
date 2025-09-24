import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: Language Switcher (Navbar)

test.describe('Language Switcher', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('switches between EN and VI and updates UI', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Set Vietnamese via localStorage and reload
    await page.evaluate(() => localStorage.setItem('i18nextLng', 'vi'));
    await page.reload();
    await removeSilktide(page);
    await expect(page.getByRole('heading', { name: /Hoạt động trực tiếp/i })).toBeVisible({ timeout: 10000 });

    // Set English via localStorage and reload
    await page.evaluate(() => localStorage.setItem('i18nextLng', 'en'));
    await page.reload();
    await removeSilktide(page);
    await expect(page.getByRole('heading', { name: /Live Activity/i })).toBeVisible({ timeout: 10000 });
  });
});
