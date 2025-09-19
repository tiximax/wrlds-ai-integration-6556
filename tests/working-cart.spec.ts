import { test, expect } from '@playwright/test';

test.describe('Enhanced Shopping Cart - Working Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set large viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    // Chờ nút cart sẵn sàng thay vì networkidle
    await page.getByTestId('cart-button').first().waitFor({ state: 'visible', timeout: 10000 });
    
    // Remove silktide overlay that interferes with clicks
    // Remove Silktide overlay for stable clicks
    await page.evaluate(() => {
      const silktide = document.querySelector('#silktide-wrapper');
      if (silktide) (silktide as HTMLElement).remove();
      const backdrop = document.querySelector('#silktide-backdrop');
      if (backdrop) (backdrop as HTMLElement).remove();
    });
  });

  test('should successfully open and close enhanced cart', async ({ page }) => {
    const cartButton = page.locator('[data-testid="cart-button"]').first();
    
    // Verify cart button exists
    await expect(cartButton).toBeVisible();
    console.log('✅ Cart button is visible');
    
    // Click to open cart
    await cartButton.click();
    await page.waitForTimeout(1000);
    
    // Verify cart sidebar opens
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]');
    await expect(cartSidebar).toBeVisible();
    console.log('✅ Cart sidebar opened successfully');
    
    // Take screenshot of open cart
    await page.screenshot({ path: 'test-results/enhanced-cart-opened.png' });
    
    // Verify cart header elements (SimpleCart shows "Cart (0 items)")
    await expect(cartSidebar.locator('h2')).toBeVisible();
    await expect(cartSidebar.locator('h2').filter({ hasText: /^Cart\b/i })).toBeVisible();
    console.log('✅ Cart header displays correctly');
    
    // Verify empty cart state (EN or VI)
    const emptyEn = cartSidebar.locator('text=Your cart is empty');
    const emptyVi = cartSidebar.locator('text=Giỏ hàng trống');
    await expect(emptyEn.or(emptyVi)).toBeVisible();
    console.log('✅ Empty cart state displays correctly');
    
    // Verify "Continue Shopping" button (EN or VI)
    const continueShoppingBtn = cartSidebar.locator('button', { hasText: /Continue Shopping|Tiếp tục mua sắm/i });
    await expect(continueShoppingBtn).toBeVisible();
    console.log('✅ Continue shopping button is visible');
    
    // Test closing cart
    const closeButton = page.locator('button').filter({ hasText: /close|×/i }).first();
    if (await closeButton.count() > 0) {
      await closeButton.click();
      await page.waitForTimeout(1000);
      await expect(cartSidebar).not.toBeVisible();
      console.log('✅ Cart closed successfully via close button');
    } else {
      // Alternative: close via continue shopping button
      await continueShoppingBtn.click();
      // Chờ animation đóng (transform translate-x-full)
      await expect(cartSidebar).toHaveClass(/translate-x-full/);
      await expect(cartSidebar).not.toHaveClass(/translate-x-0/);
      console.log('✅ Cart closed successfully via continue shopping');
    }
  });

  test('should display cart functionality elements', async ({ page }) => {
    const cartButton = page.locator('[data-testid="cart-button"]').first();
    await cartButton.click();
    await page.waitForTimeout(1000);
    
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]');
    await expect(cartSidebar).toBeVisible();
    
    // Check for various cart elements that should be present
    // (even in empty state, these elements should exist)
    
    // Header elements
    expect(await page.locator('.text-lg.font-semibold').count()).toBeGreaterThan(0);
    console.log('✅ Cart title elements found');
    
    // Animation elements (motion components)
    const motionElements = await page.locator('[style*="transform"], [class*="motion"]').count();
    expect(motionElements).toBeGreaterThan(0);
    console.log(`✅ Found ${motionElements} animated elements`);
    
    // Take final screenshot
    await page.screenshot({ path: 'test-results/enhanced-cart-elements.png' });
    
    console.log('🎉 All cart functionality tests passed!');
  });

  test('should have proper cart accessibility', async ({ page }) => {
    const cartButton = page.locator('[data-testid="cart-button"]').first();
    
    // Check ARIA label (contains 'cart')
    const ariaLabel = await cartButton.getAttribute('aria-label');
    expect(ariaLabel?.toLowerCase()).toContain('cart');
    console.log(`✅ Cart button has proper ARIA label: "${ariaLabel}"`);
    
    // Click and check sidebar accessibility
    await cartButton.click();
    await page.waitForTimeout(1000);
    
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]');
    await expect(cartSidebar).toBeVisible();
    
    // Verify keyboard navigation could work (elements are focusable)
    const focusableElements = await page.locator('button, input, [tabindex]').count();
    expect(focusableElements).toBeGreaterThan(0);
    console.log(`✅ Found ${focusableElements} focusable elements for keyboard navigation`);
  });
});
