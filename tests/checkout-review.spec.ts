import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: Checkout review summary edit

test.describe('Checkout Review Summary', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('edit buttons navigate back to steps', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Fill address & go to payment
    await page.getByTestId('fullName').fill('Edit User');
    await page.getByTestId('phone').fill('0905555666');
    await page.getByTestId('address').fill('999 Edit Road');
    await page.getByTestId('address-continue').click();

    // Choose COD and continue to review
    await page.getByTestId('payment-cod').check();
    await page.getByTestId('payment-continue').click();
    await expect(page.getByTestId('step-review')).toBeVisible();

    // Edit payment
    await page.getByTestId('edit-payment').click();
    await expect(page.getByTestId('step-payment')).toBeVisible();

    // Continue to review again
    await page.getByTestId('payment-continue').click();
    await expect(page.getByTestId('step-review')).toBeVisible();

    // Edit address
    await page.getByTestId('edit-address').click();
    await expect(page.getByTestId('step-address')).toBeVisible();
  });
});
