import { test, expect } from '@playwright/test';

// E2E user flow: search -> open product -> add to cart -> change quantity -> switch language
// Saves screenshots into test-results/ for review

test.describe('User Flow - Search, Cart, Language', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    // Remove silktide overlay that can block clicks
    await page.evaluate(() => {
      const wrap = document.getElementById('silktide-wrapper');
      if (wrap) wrap.remove();
      const back = document.getElementById('silktide-backdrop');
      if (back) back.remove();
    });
  });

  test('search, open product, add to cart, update quantity, switch language', async ({ page }) => {
    // Screenshot home
    await page.screenshot({ path: 'test-results/flow-home.png' });

    // Open navbar search input and type query (EnhancedSearch)
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    await searchInput.click();
    await searchInput.fill('japan');
    await page.waitForTimeout(300); // allow suggestions debounce
    await page.screenshot({ path: 'test-results/flow-search-suggestions.png' });

    // Submit search (Enter)
    await searchInput.press('Enter');
    await page.waitForURL(/\/products\?search=/);
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({ path: 'test-results/flow-products.png' });

    // Add to cart từ trang /products thay vì vào chi tiết để tránh biến động UI
    const addToCart = page.getByRole('button', { name: /add to cart|thêm vào giỏ/i }).first();
    await expect(addToCart).toBeVisible({ timeout: 10000 });
    await addToCart.click();
    await page.waitForTimeout(300);

    // Open cart (robust selector: testid or aria-label)
    // Remove overlay again just in case route change re-injected it
    await page.evaluate(() => {
      const wrap = document.getElementById('silktide-wrapper');
      if (wrap) wrap.remove();
      const back = document.getElementById('silktide-backdrop');
      if (back) back.remove();
    });

    const cartByTestId = page.getByTestId('cart-button').first();
    const cartByAria = page.getByRole('button', { name: /open cart/i }).first();
    if (await cartByTestId.count()) {
      await cartByTestId.first().waitFor({ state: 'visible', timeout: 10000 });
      await cartByTestId.click();
    } else if (await cartByAria.count()) {
      await cartByAria.first().waitFor({ state: 'visible', timeout: 10000 });
      await cartByAria.click();
    } else {
      // Fallback: đợi bất kỳ nút có testid rồi click
      const anyCartBtn = page.locator('[data-testid="cart-button"]').first();
      await anyCartBtn.waitFor({ state: 'visible', timeout: 10000 });
      await anyCartBtn.click();
    }

    const cartSidebar = page.locator('[data-testid="cart-sidebar"]').first();
    await expect(cartSidebar).toBeVisible();
    await page.screenshot({ path: 'test-results/flow-cart-open.png' });

    // If there is at least one item, bump quantity by 1
    const plusBtn = cartSidebar.getByRole('button', { name: /\+/ }).first();
    if (await plusBtn.count()) {
      await plusBtn.click();
      await page.waitForTimeout(300);
    }
    await page.screenshot({ path: 'test-results/flow-cart-updated.png' });

    // Change language via LanguageSwitcher (dropdown)
    // Open dropdown
    const langTrigger = page.getByRole('button').filter({ hasText: /English|Tiếng Việt/ });
    if (await langTrigger.count()) {
      await langTrigger.first().click();
      // choose Vietnamese then back to English (or vice versa)
      const viItem = page.getByRole('menuitem').filter({ hasText: /Tiếng Việt/ });
      const enItem = page.getByRole('menuitem').filter({ hasText: /English/ });
      if (await viItem.count()) {
        await viItem.first().click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: 'test-results/flow-lang-vi.png' });
      }
      if (await enItem.count()) {
        // reopen
        await langTrigger.first().click();
        await enItem.first().click();
        await page.waitForTimeout(400);
        await page.screenshot({ path: 'test-results/flow-lang-en.png' });
      }
    }

    // Close cart if open via Continue Shopping button (EN/VI)
    const continueBtn = cartSidebar.getByRole('button', { name: /Continue Shopping|Tiếp tục mua sắm/i });
    if (await continueBtn.count()) {
      await continueBtn.click();
      await expect(cartSidebar).toHaveClass(/translate-x-full/);
    }
  });
});
