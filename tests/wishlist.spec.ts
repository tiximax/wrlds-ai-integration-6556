import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage, openCartFromNavbar } from './helpers';
import { configureRetriesForCI, skipFlakyInCI } from './ci-flaky-control';

// E2E for Wishlist basic flows
// Notes:
// - Clears wishlist/cart storage before each test
// - Uses aria-labels and data-testids added to Wishlist page/components

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  // Navigate to site origin and clear storage once per test
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await clearStorage(page);
  await removeSilktide(page);
});

test('wishlist shows empty state initially', async ({ page }) => {
  await page.goto('/wishlist');
  await page.waitForLoadState('domcontentloaded');

  await expect(page.locator('text=Danh sách yêu thích của bạn đang trống.')).toBeVisible();
});

test('can add product to wishlist from home and see it on wishlist page, then remove it', async ({ page }) => {
  // Go home and add first product to wishlist via overlay button
  await page.goto('/products');
  await page.waitForLoadState('domcontentloaded');
  // Wait until product grid likely rendered (look for any product card action)

  await removeSilktide(page);
  // Click the first Add to wishlist button
  const addToWishlistBtn = page.locator('button[aria-label="Add to wishlist"]').first();
  await expect(addToWishlistBtn).toBeVisible();
  try {
    await addToWishlistBtn.click({ timeout: 5000 });
  } catch {
    await page.evaluate(() => {
      document.getElementById('silktide-wrapper')?.remove();
      document.getElementById('silktide-backdrop')?.remove();
      const btn = document.querySelector('button[aria-label=\"Add to wishlist\"]') as HTMLButtonElement | null;
      btn?.click();
    });
  }
  // Wait for toggle state to reflect
  await expect(page.locator('button[aria-label="Remove from wishlist"]').first()).toBeVisible();

  // Navigate to wishlist page and verify item exists
  await page.goto('/wishlist');
  await page.waitForLoadState('domcontentloaded');
  await removeSilktide(page);

  // There should be at least one Add to cart button in wishlist
  const addToCartInWishlist = page.locator('[data-testid="wishlist-add-to-cart"]').first();
  await expect(addToCartInWishlist).toBeVisible();

  // Remove the item
  const removeBtn = page.locator('[data-testid=\"wishlist-remove\"]').first();
  await expect(removeBtn).toBeVisible();
  await page.evaluate(() => {
    const silktide = document.querySelector('#silktide-wrapper');
    if (silktide) (silktide as HTMLElement).remove();
    const backdrop = document.querySelector('#silktide-backdrop');
    if (backdrop) (backdrop as HTMLElement).remove();
  });
  await removeBtn.click();

  // Verify empty state
  await expect(page.locator('text=Danh sách yêu thích của bạn đang trống.')).toBeVisible();
});

test.describe('Wishlist add-to-cart (CI gate)', () => {
  // Phase 2: allow unskip via env flag; keep one retry in CI
  configureRetriesForCI(test, 1);
  skipFlakyInCI(test, 'UNSKIP_WISHLIST_ATC', 'Wishlist add-to-cart still under hardening');

  test('adding to cart from wishlist updates cart sidebar', async ({ page, browserName }) => {
  // Prepare: add an item to wishlist
  await page.goto('/products');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('button[aria-label="Add to wishlist"]', { timeout: 10000 });
  await removeSilktide(page);
  const addToWishlistBtn = page.locator('button[aria-label="Add to wishlist"]').first();
  await addToWishlistBtn.click();
  await expect(page.locator('button[aria-label="Remove from wishlist"]').first()).toBeVisible();

  // Go to wishlist and add that item to cart
  await page.goto('/wishlist');
  await removeSilktide(page);
  const addToCartInWishlist = page.locator('[data-testid=\"wishlist-add-to-cart\"]').first();
  // Use DOM click to avoid overlay/pointer issues on Mobile Safari
  await page.evaluate(() => {
    const btn = document.querySelector('[data-testid=\"wishlist-add-to-cart\"]') as HTMLButtonElement | null;
    if (btn) btn.click();
  });

  // Đợi cart state được cập nhật trước khi mở sidebar
  await page.waitForFunction(() => {
    try {
      const cart = JSON.parse(localStorage.getItem('simple-cart') || '{}');
      return Array.isArray(cart.items) && cart.items.length > 0;
    } catch (e) {
      return false;
    }
  }, { timeout: 10000 });

  // Open the cart sidebar from navbar
  await openCartFromNavbar(page);

  // Verify the cart sidebar is visible (fallback thử mở lại 1 lần nếu chưa thấy)
  const cartSidebar = page.locator('[data-testid="cart-sidebar"]');
  try {
    await expect(cartSidebar).toBeVisible({ timeout: 5000 });
  } catch {
    await openCartFromNavbar(page);
    await expect(cartSidebar).toBeVisible({ timeout: 5000 });
  }

  // Header should contain "Cart (" indicating there is a count
  await expect(cartSidebar.locator('h2')).toContainText('Cart (');
  });
});
