import { test, expect } from '@playwright/test';

test.describe('Debug Console and Cart Functionality', () => {
  test('should check console errors and cart state', async ({ page }) => {
    const consoleMessages: string[] = [];
    
    // Listen to console events
    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
      console.log(`Console ${msg.type()}: ${msg.text()}`);
    });
    
    // Listen to page errors
    page.on('pageerror', error => {
      console.log(`Page error: ${error.message}`);
    });

    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    console.log('\n=== CONSOLE MESSAGES ===');
    consoleMessages.forEach(msg => console.log(msg));

    // Check if cart context is working
    const cartContextWorking = await page.evaluate(() => {
      // Check if there are any React components mounted
      const reactRoot = document.querySelector('#root');
      return !!reactRoot;
    });
    console.log(`React app mounted: ${cartContextWorking}`);

    // Try to directly invoke cart functionality
    const cartButton = page.locator('[data-testid="cart-button"]').first();
    
    if (await cartButton.count() > 0) {
      // Get cart button's onClick handler
      const hasOnClick = await cartButton.evaluate(el => {
        return !!(el as any).onclick || el.getAttribute('onclick');
      });
      console.log(`Cart button has onClick: ${hasOnClick}`);

      // Try clicking via JavaScript
      await cartButton.evaluate((el) => {
        console.log('Attempting JS click on cart button');
        (el as HTMLElement).click();
      });

      // Wait and check for sidebar
      await page.waitForTimeout(2000);
      
      // Check all possible cart sidebar selectors
      const sidebarSelectors = [
        '[data-testid="cart-sidebar"]',
        '[class*="cart-sidebar"]', 
        '[class*="sidebar"]',
        'aside',
        '[role="dialog"]'
      ];
      
      for (const selector of sidebarSelectors) {
        const element = page.locator(selector);
        const count = await element.count();
        const visible = count > 0 ? await element.first().isVisible() : false;
        console.log(`Selector "${selector}": ${count} found, visible: ${visible}`);
      }

      // Check for any motion/animation elements
      const motionElements = await page.locator('[class*="motion"], [style*="transform"]').count();
      console.log(`Motion elements found: ${motionElements}`);

      // Take final screenshot
      await page.screenshot({ path: 'test-results/debug-after-click.png' });
    }
  });

  test('should test cart opening with different approaches', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Approach 1: Remove silktide overlay first
    await page.evaluate(() => {
      const silktide = document.querySelector('#silktide-wrapper');
      if (silktide) {
        silktide.remove();
        console.log('Removed silktide wrapper');
      }
    });

    await page.waitForTimeout(500);

    // Approach 2: Try clicking now
    const cartButton = page.locator('[data-testid="cart-button"]').first();
    
    if (await cartButton.count() > 0) {
      console.log('Attempting click after removing overlay...');
      try {
        await cartButton.click({ timeout: 3000 });
        console.log('Click successful!');
        
        // Check for sidebar
        await page.waitForTimeout(1000);
        const sidebar = page.locator('[data-testid="cart-sidebar"]');
        const sidebarVisible = await sidebar.isVisible();
        console.log(`Sidebar visible: ${sidebarVisible}`);
        
        if (sidebarVisible) {
          console.log('SUCCESS: Cart sidebar opened!');
          await page.screenshot({ path: 'test-results/success-cart-open.png' });
          
          // Test closing
          const closeButton = page.locator('button').filter({ hasText: /close/i }).or(
            page.locator('button[aria-label*="close"]')
          ).first();
          
          if (await closeButton.count() > 0) {
            await closeButton.click();
            await page.waitForTimeout(500);
            const sidebarClosed = !(await sidebar.isVisible());
            console.log(`Sidebar closed: ${sidebarClosed}`);
          }
        }
      } catch (error) {
        console.log('Click still failed:', error.message);
      }
    }
  });
});
