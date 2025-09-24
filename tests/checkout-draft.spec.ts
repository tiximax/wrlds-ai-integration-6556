import { test, expect } from '@playwright/test';
import { disableOverlaysForTest, clearStorage } from './helpers';

// E2E: Checkout draft persistence (localStorage)

test.describe('Checkout Draft Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('restores address and payment after reload', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('domcontentloaded');
    await disableOverlaysForTest(page);

    // Fill address and go to payment
    await page.getByTestId('fullName').fill('Tester Persist');
    await page.getByTestId('phone').fill('0909999999');
    await page.getByTestId('address').fill('456 Persist Street, Ward 1');
    await page.getByTestId('address-continue').click();

    // Select COD and persist
    await expect(page.getByTestId('step-payment')).toBeVisible();
    await page.getByTestId('payment-cod').check();

    // Reload page and verify restored values
    await page.reload();
    await disableOverlaysForTest(page);

    // Step 1 should have restored address values
    await expect(page.getByTestId('fullName')).toHaveValue('Tester Persist');
    await expect(page.getByTestId('phone')).toHaveValue('0909999999');
    await expect(page.getByTestId('address')).toHaveValue('456 Persist Street, Ward 1');

    // Continue to Step 2 and verify payment method restored
    await page.getByTestId('address-continue').click();
    await expect(page.getByTestId('step-payment')).toBeVisible();
    await expect(page.getByTestId('payment-cod')).toBeChecked();
  });
});
