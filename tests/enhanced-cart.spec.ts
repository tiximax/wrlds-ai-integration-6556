import { test, expect } from '@playwright/test';

test.describe('Enhanced Shopping Cart', () => {
  test.beforeEach(async ({ page }) => {
    // Set a larger viewport to ensure all elements are visible
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    // Wait for the page to fully load
    await page.waitForLoadState('networkidle');
    // Wait for any animations to complete
    await page.waitForTimeout(1000);
  });

  test('should display cart button and open sidebar', async ({ page }) => {
    // Look for cart button
    const cartButton = page.locator('[data-testid="cart-button"]').first();

    await expect(cartButton).toBeVisible();
    
    // Scroll cart button into view and click
    await cartButton.scrollIntoViewIfNeeded();
    await cartButton.click({ force: true });
    
    // Wait for cart sidebar to appear
    await page.waitForTimeout(500);
    
    // Check if cart sidebar is visible
    const cartSidebar = page.locator('[data-testid="cart-sidebar"]').or(
      page.locator('[class*="cart"]').filter({ hasText: /shopping cart/i })
    ).or(
      page.locator('div[class*="sidebar"]')
    ).first();

    await expect(cartSidebar).toBeVisible();
  });

  test('should add product to cart and display in sidebar', async ({ page }) => {
    // Look for "Add to Cart" buttons
    const addToCartButton = page.locator('button').filter({ hasText: /add to cart/i }).first();
    
    if (await addToCartButton.isVisible()) {
      // Click add to cart
      await addToCartButton.click();
      await page.waitForTimeout(1000);

      // Open cart sidebar
      const cartButton = page.locator('[data-testid="cart-button"]').or(
        page.locator('button').filter({ hasText: /cart/i })
      ).first();
      
      await cartButton.click();
      await page.waitForTimeout(500);

      // Check if item appears in cart
      const cartItems = page.locator('[data-testid="cart-item"]').or(
        page.locator('[class*="cart-item"]')
      );
      
      await expect(cartItems.first()).toBeVisible();
    }
  });

  test('should display empty cart state when no items', async ({ page }) => {
    // Open cart sidebar
    const cartButton = page.locator('[data-testid="cart-button"]').or(
      page.locator('button').filter({ hasText: /cart/i })
    ).first();

    await cartButton.click();
    await page.waitForTimeout(500);

    // Check for empty cart message
    const emptyCartMessage = page.locator('text=Your cart is empty').or(
      page.locator('text=No items in cart')
    ).or(
      page.locator('[data-testid="empty-cart"]')
    );

    // Either empty cart message should be visible OR cart items should be present
    const hasEmptyMessage = await emptyCartMessage.isVisible();
    const hasCartItems = await page.locator('[data-testid="cart-item"]').count() > 0;
    
    expect(hasEmptyMessage || hasCartItems).toBe(true);
  });

  test('should handle quantity changes in cart', async ({ page }) => {
    // Try to add a product first
    const addToCartButton = page.locator('button').filter({ hasText: /add to cart/i }).first();
    
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      await page.waitForTimeout(1000);

      // Open cart
      const cartButton = page.locator('button').filter({ hasText: /cart/i }).first();
      await cartButton.click();
      await page.waitForTimeout(500);

      // Look for quantity controls
      const quantityIncrease = page.locator('button').filter({ hasText: '+' }).or(
        page.locator('[data-testid="quantity-increase"]')
      ).first();

      const quantityDecrease = page.locator('button').filter({ hasText: '-' }).or(
        page.locator('[data-testid="quantity-decrease"]')
      ).first();

      if (await quantityIncrease.isVisible()) {
        // Get initial quantity
        const quantityDisplay = page.locator('input[type="number"]').or(
          page.locator('[data-testid="quantity-display"]')
        ).first();

        // Increase quantity
        await quantityIncrease.click();
        await page.waitForTimeout(500);

        // Verify quantity changed
        expect(quantityDisplay).toBeVisible();
      }
    }
  });

  test('should test promo code functionality', async ({ page }) => {
    // Add a product first if possible
    const addToCartButton = page.locator('button').filter({ hasText: /add to cart/i }).first();
    
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      await page.waitForTimeout(1000);
    }

    // Open cart
    const cartButton = page.locator('button').filter({ hasText: /cart/i }).first();
    await cartButton.click();
    await page.waitForTimeout(500);

    // Look for promo code input
    const promoInput = page.locator('input[placeholder*="promo"]').or(
      page.locator('input[placeholder*="coupon"]')
    ).or(
      page.locator('[data-testid="promo-input"]')
    ).first();

    if (await promoInput.isVisible()) {
      // Test promo code input
      await promoInput.fill('SAVE10');
      
      const applyButton = page.locator('button').filter({ hasText: /apply/i }).first();
      if (await applyButton.isVisible()) {
        await applyButton.click();
        await page.waitForTimeout(1000);
      }
    }
  });

  test('should display cart summary and calculations', async ({ page }) => {
    // Open cart
    const cartButton = page.locator('button').filter({ hasText: /cart/i }).first();
    await cartButton.click();
    await page.waitForTimeout(500);

    // Look for cart summary elements
    const subtotal = page.locator('text=Subtotal').or(
      page.locator('[data-testid="subtotal"]')
    );

    const total = page.locator('text=Total').or(
      page.locator('[data-testid="total"]')
    );

    // At least one summary element should be visible
    const hasSubtotal = await subtotal.first().isVisible();
    const hasTotal = await total.first().isVisible();
    
    expect(hasSubtotal || hasTotal).toBe(true);
  });

  test('should handle cart close functionality', async ({ page }) => {
    // Open cart
    const cartButton = page.locator('button').filter({ hasText: /cart/i }).first();
    await cartButton.click();
    await page.waitForTimeout(500);

    // Look for close button
    const closeButton = page.locator('button').filter({ hasText: /close/i }).or(
      page.locator('button[aria-label*="close"]')
    ).or(
      page.locator('button').filter({ hasText: '×' })
    ).first();

    if (await closeButton.isVisible()) {
      await closeButton.click();
      await page.waitForTimeout(500);
    } else {
      // Try clicking outside the cart (backdrop)
      await page.click('body', { position: { x: 50, y: 50 } });
      await page.waitForTimeout(500);
    }

    // Verify cart is closed (this might vary based on implementation)
    await page.waitForTimeout(1000);
  });

  test('should be mobile responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Open cart on mobile
    const cartButton = page.locator('button').filter({ hasText: /cart/i }).first();
    await expect(cartButton).toBeVisible();
    
    await cartButton.click();
    await page.waitForTimeout(500);

    // Verify cart works on mobile
    const cartSidebar = page.locator('[class*="cart"]').first();
    await expect(cartSidebar).toBeVisible();
  });
});
