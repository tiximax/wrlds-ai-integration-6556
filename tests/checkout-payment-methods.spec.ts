import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: Checkout payment methods (Card / PayPal)

test.describe('Checkout Payment Methods', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('Card path requires valid fields and shows summary with last4', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Address
    await page.getByTestId('fullName').fill('Card User');
    await page.getByTestId('phone').fill('0901111222');
    await page.getByTestId('address').fill('789 Card Street, City');
    await page.getByTestId('address-continue').click();

    // Payment - Card invalid first
    await page.getByTestId('payment-card').check();
    await page.getByTestId('payment-continue').click();
    await expect(page.getByTestId('error-cardNumber')).toBeVisible();

    // Fill valid card
    await page.getByTestId('cardNumber').fill('4111111111111234');
    await page.getByTestId('cardName').fill('CARD USER');
    await page.getByTestId('cardExpiry').fill('12/30');
    await page.getByTestId('cardCvv').fill('123');
    await page.getByTestId('payment-continue').click();

    await expect(page.getByTestId('step-review')).toBeVisible();
    await expect(page.getByTestId('review-summary')).toContainText('1234');
  });

  test('PayPal path proceeds to review', async ({ page }) => {
    await page.goto('/checkout');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Address
    await page.getByTestId('fullName').fill('PayPal User');
    await page.getByTestId('phone').fill('0903333444');
    await page.getByTestId('address').fill('012 PayPal Lane');
    await page.getByTestId('address-continue').click();

    // Payment - PayPal
    await page.getByTestId('payment-paypal').check();
    await page.getByTestId('payment-continue').click();

    await expect(page.getByTestId('step-review')).toBeVisible();
  });
});
