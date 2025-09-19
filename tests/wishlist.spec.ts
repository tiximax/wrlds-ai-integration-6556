import { test, expect } from '@playwright/test';

// E2E for Wishlist basic flows
// Notes:
// - Clears wishlist/cart storage before each test
// - Uses aria-labels and data-testids added to Wishlist page/components

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  // Navigate to site origin and clear storage once per test
  await page.goto('/');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => {
    try {
      localStorage.removeItem('wishlist_items');
      localStorage.removeItem('simple-cart');
    } catch {}
    // Remove silktide overlay if it appears
    const silktide = document.querySelector('#silktide-wrapper');
    if (silktide) (silktide as HTMLElement).remove();
  });
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

  // Remove silktide overlay if present
  await page.evaluate(() => {
    const silktide = document.querySelector('#silktide-wrapper');
    if (silktide) (silktide as HTMLElement).remove();
  });
  // Click the first Add to wishlist button
  const addToWishlistBtn = page.locator('button[aria-label="Add to wishlist"]').first();
  await expect(addToWishlistBtn).toBeVisible();
  await addToWishlistBtn.click();
  // Wait for toggle state to reflect
  await expect(page.locator('button[aria-label="Remove from wishlist"]').first()).toBeVisible();

  // Navigate to wishlist page and verify item exists
  await page.goto('/wishlist');
  await page.waitForLoadState('domcontentloaded');
  await page.evaluate(() => {
    const silktide = document.querySelector('#silktide-wrapper');
    if (silktide) (silktide as HTMLElement).remove();
  });

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

test('adding to cart from wishlist updates cart sidebar', async ({ page }) => {
  // Prepare: add an item to wishlist
  await page.goto('/products');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('button[aria-label="Add to wishlist"]', { timeout: 10000 });
  await page.evaluate(() => {
    const silktide = document.querySelector('#silktide-wrapper');
    if (silktide) (silktide as HTMLElement).remove();
  });
  const addToWishlistBtn = page.locator('button[aria-label="Add to wishlist"]').first();
  await addToWishlistBtn.click();
  await expect(page.locator('button[aria-label="Remove from wishlist"]').first()).toBeVisible();

  // Go to wishlist and add that item to cart
  await page.goto('/wishlist');
  await page.evaluate(() => {
    const silktide = document.querySelector('#silktide-wrapper');
    if (silktide) (silktide as HTMLElement).remove();
  });
  const addToCartInWishlist = page.locator('[data-testid="wishlist-add-to-cart"]').first();
  await addToCartInWishlist.click();

  // Open the cart sidebar from navbar
  const cartButton = page.locator('[data-testid=\"cart-button\"]').first();
  await cartButton.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    window.scrollTo(0, 0);
    const silktide = document.querySelector('#silktide-wrapper');
    if (silktide) (silktide as HTMLElement).remove();
    const backdrop = document.querySelector('#silktide-backdrop');
    if (backdrop) (backdrop as HTMLElement).remove();
    (document.querySelector('[data-testid=\"cart-button\"]') as HTMLButtonElement)?.click();
  });

  // Verify the cart sidebar is visible
  const cartSidebar = page.locator('[data-testid="cart-sidebar"]');
  await expect(cartSidebar).toBeVisible();

  // Header should contain "Cart (" indicating there is a count
  await expect(cartSidebar.locator('h2')).toContainText('Cart (');
});
