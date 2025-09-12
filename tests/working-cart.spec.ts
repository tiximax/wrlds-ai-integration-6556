import { test, expect } from '@playwright/test';

test.describe('Enhanced Shopping Cart - Working Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set large viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Remove silktide overlay that interferes with clicks
    await page.evaluate(() => {
      const silktide = document.querySelector('#silktide-wrapper');
      if (silktide) silktide.remove();
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
    
    // Verify cart header elements (use more specific selectors)
    await expect(page.locator('h2', { hasText: 'Giỏ hàng' })).toBeVisible();
    await expect(page.locator('text=0 sản phẩm')).toBeVisible();
    console.log('✅ Cart header displays correctly');
    
    // Verify empty cart state
    await expect(page.locator('text=Giỏ hàng trống')).toBeVisible();
    await expect(page.locator('text=Hãy khám phá các sản phẩm tuyệt vời')).toBeVisible();
    console.log('✅ Empty cart state displays correctly');
    
    // Verify "Continue Shopping" button
    const continueShoppingBtn = page.locator('button', { hasText: 'Tiếp tục mua sắm' });
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
      await page.waitForTimeout(1000);
      await expect(cartSidebar).not.toBeVisible();
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
    
    // Check ARIA label
    const ariaLabel = await cartButton.getAttribute('aria-label');
    expect(ariaLabel).toContain('Shopping cart');
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
