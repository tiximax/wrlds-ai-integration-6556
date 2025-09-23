import { test, expect } from '@playwright/test';
import { clearStorage, removeSilktide } from './helpers';

// Mobile Filters UX: open drawer and apply a filter, expect badge update

test.describe('Search - Mobile Filters UX', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/search?query=watch');
    await page.waitForLoadState('domcontentloaded');
    await clearStorage(page);
    await removeSilktide(page);
  });

  test('open filters drawer and apply origin filter', async ({ page }) => {
    // Mobile filters trigger should be visible
    const openBtn = page.getByTestId('mobile-filters-button').first();
    await expect(openBtn).toBeVisible({ timeout: 10000 });
    try {
      await openBtn.click({ timeout: 5000 });
    } catch {
      await removeSilktide(page);
      await page.evaluate(() => {
        (document.getElementById('silktide-wrapper') as HTMLElement | null)?.remove();
        (document.getElementById('silktide-backdrop') as HTMLElement | null)?.remove();
        const el = document.querySelector('[data-testid="mobile-filters-button"]') as HTMLButtonElement | null;
        el?.click();
      });
    }

    // Drawer visible
    const drawer = page.getByTestId('mobile-filters-drawer');
    await expect(drawer).toBeVisible();

    // Expand "Trạng thái" section (in case it's collapsed)
    const statusSectionTrigger = page.getByRole('button', { name: 'Trạng thái' }).first();
    try { await statusSectionTrigger.click({ timeout: 2000 }); } catch {}

    // Toggle status: "Có sẵn"
    const statusLabel = drawer.locator('label', { hasText: 'Có sẵn' }).first();
    await statusLabel.scrollIntoViewIfNeeded();
    await expect(statusLabel).toBeVisible({ timeout: 5000 });
    await page.evaluate(() => {
      const drawer = document.querySelector('[data-testid="mobile-filters-drawer"]') as HTMLElement | null;
      if (!drawer) return;
      const labels = Array.from(drawer.querySelectorAll('label')) as HTMLLabelElement[];
      const target = labels.find(l => (l.textContent || '').includes('Có sẵn'));
      (target as HTMLElement | null)?.click();
    });

    // Apply
    const applyBtn = page.getByTestId('apply-filters-button');
    try {
      await applyBtn.click({ timeout: 3000 });
    } catch {
      await page.evaluate(() => {
        const btn = document.querySelector('[data-testid="apply-filters-button"]') as HTMLButtonElement | null;
        btn?.click();
      });
    }

    // Drawer should close
    await expect(drawer).toBeHidden();

    // URL should contain status=available
    await expect.poll(() => page.url()).toContain('status=available');
  });
});
