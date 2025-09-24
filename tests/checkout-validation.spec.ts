import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: Checkout validation using zod + react-hook-form

test.describe('Checkout Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('shows errors for empty address and requires payment selection', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Step 1: submit empty
    await expect(page.getByTestId('step-address')).toBeVisible();
    await page.getByTestId('address-continue').click();
    await expect(page.getByTestId('error-fullName')).toBeVisible();
    await expect(page.getByTestId('error-phone')).toBeVisible();
    await expect(page.getByTestId('error-address')).toBeVisible();

    // Fill invalid phone
    await page.getByTestId('fullName').fill('An');
    await page.getByTestId('phone').fill('123');
    await page.getByTestId('address').fill('Short');
    await page.getByTestId('address-continue').click();
    await expect(page.getByTestId('error-phone')).toBeVisible();
    await expect(page.getByTestId('error-address')).toBeVisible();

    // Correct values
    await page.getByTestId('fullName').fill('Nguyen Van A');
    await page.getByTestId('phone').fill('0901234567');
    await page.getByTestId('address').fill('123 Duong ABC, Quan XYZ, Ha Noi');
    await page.getByTestId('address-continue').click();

    // Step 2: payment required
    await expect(page.getByTestId('step-payment')).toBeVisible();
    await page.getByTestId('payment-continue').click();
    await expect(page.getByTestId('error-method')).toBeVisible();

    // Select and continue
    await page.getByTestId('payment-cod').check();
    await page.getByTestId('payment-continue').click();

    // Step 3 visible
    await expect(page.getByTestId('step-review')).toBeVisible();
  });
});
