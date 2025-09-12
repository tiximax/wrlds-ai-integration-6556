import { test, expect } from '@playwright/test';

test.describe('Debug Cart Structure', () => {
  test('should inspect page structure and cart button location', async ({ page }) => {
    // Set large viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshot for debugging
    await page.screenshot({ path: 'test-results/debug-homepage.png' });

    // Look for all buttons on page
    const allButtons = await page.locator('button').count();
    console.log(`Total buttons found: ${allButtons}`);

    // Find cart button specifically
    const cartButtons = page.locator('[data-testid="cart-button"]');
    const cartButtonCount = await cartButtons.count();
    console.log(`Cart buttons found: ${cartButtonCount}`);

    if (cartButtonCount > 0) {
      const cartButton = cartButtons.first();
      
      // Check if visible
      const isVisible = await cartButton.isVisible();
      console.log(`Cart button is visible: ${isVisible}`);
      
      // Get bounding box
      const boundingBox = await cartButton.boundingBox();
      console.log('Cart button bounding box:', boundingBox);
      
      // Check if in viewport
      const viewport = page.viewportSize();
      console.log('Viewport size:', viewport);
      
      if (boundingBox && viewport) {
        const inViewport = boundingBox.x >= 0 && 
                          boundingBox.y >= 0 && 
                          boundingBox.x + boundingBox.width <= viewport.width &&
                          boundingBox.y + boundingBox.height <= viewport.height;
        console.log(`Cart button in viewport: ${inViewport}`);
      }

      // Get cart button text and attributes
      const buttonText = await cartButton.textContent();
      const ariaLabel = await cartButton.getAttribute('aria-label');
      console.log(`Cart button text: "${buttonText}"`);
      console.log(`Cart button aria-label: "${ariaLabel}"`);
    }

    // Look for navbar
    const navbar = page.locator('nav').first();
    const navbarVisible = await navbar.isVisible();
    console.log(`Navbar visible: ${navbarVisible}`);

    // Look for any shopping-related elements
    const shoppingElements = await page.locator('*[class*="cart"], *[class*="shopping"], *[aria-label*="cart"], *[aria-label*="shopping"]').count();
    console.log(`Shopping-related elements found: ${shoppingElements}`);

    // Get page title to confirm we're on right page
    const title = await page.title();
    console.log(`Page title: ${title}`);
  });

  test('should try clicking cart button with different strategies', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    const cartButton = page.locator('[data-testid="cart-button"]').first();
    
    if (await cartButton.count() > 0) {
      // Try different click strategies
      try {
        console.log('Attempting standard click...');
        await cartButton.click({ timeout: 5000 });
        console.log('Standard click successful');
      } catch (error) {
        console.log('Standard click failed:', error.message);
        
        try {
          console.log('Attempting force click...');
          await cartButton.click({ force: true, timeout: 5000 });
          console.log('Force click successful');
        } catch (error2) {
          console.log('Force click failed:', error2.message);
          
          try {
            console.log('Attempting JS click...');
            await cartButton.evaluate((el) => (el as HTMLElement).click());
            console.log('JS click successful');
          } catch (error3) {
            console.log('JS click failed:', error3.message);
          }
        }
      }

      // Check if cart sidebar appeared after any click attempt
      await page.waitForTimeout(1000);
      const cartSidebar = page.locator('[data-testid="cart-sidebar"]');
      const sidebarVisible = await cartSidebar.isVisible();
      console.log(`Cart sidebar visible after click attempts: ${sidebarVisible}`);
      
      if (sidebarVisible) {
        await page.screenshot({ path: 'test-results/debug-cart-open.png' });
      }
    }
  });
});
