import { test, expect } from '@playwright/test';
import { removeSilktide } from './helpers';

const readQueue = async (page) => {
  return await page.evaluate(() => {
    try {
      const raw = localStorage.getItem('analytics-queue-v1');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });
};

test.describe('Analytics Events', () => {
  test('product_view on product detail', async ({ page }) => {
    await page.addInitScript(() => { /* @ts-ignore */ navigator.sendBeacon = undefined; });

    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);
    await page.waitForTimeout(500);

    const queue = await readQueue(page);
    const productViews = queue.filter((e: any) => e?.name === 'product_view');
    expect(productViews.length).toBeGreaterThan(0);
  });

  test('search event when searching from homepage', async ({ page }) => {
    await page.addInitScript(() => { /* @ts-ignore */ navigator.sendBeacon = undefined; });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    const input = page.getByPlaceholder(/Search products/i);
    await input.click();
    await input.fill('japan');
    await input.press('Enter');

    // allow navigation & tracking
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);

    const queue = await readQueue(page);
    const searches = queue.filter((e: any) => e?.name === 'search');
    expect(searches.length).toBeGreaterThan(0);
    // optional: verify payload contains query
    const hasJapan = searches.some((e: any) => (e.props?.query || '').toLowerCase().includes('japan'));
    expect(hasJapan).toBeTruthy();
  });

  test('checkout_step when moving through checkout', async ({ page }) => {
    await page.addInitScript(() => { /* @ts-ignore */ navigator.sendBeacon = undefined; });

    await page.goto('/checkout');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // Step 1: fill minimal valid and continue
    await page.getByTestId('fullName').fill('Nguyen Van A');
    await page.getByTestId('phone').fill('0901234567');
    await page.getByTestId('address').fill('123 Duong ABC, Quan XYZ, HN');
    await page.getByTestId('address-continue').click();

    // Step 2: pick COD and continue
    await page.getByTestId('payment-cod').check();
    await page.getByTestId('payment-continue').click();

    await page.waitForTimeout(500);
    const queue = await readQueue(page);
    const steps = queue.filter((e: any) => e?.name === 'checkout_step');
    expect(steps.length).toBeGreaterThanOrEqual(2);
    const stepValues = new Set(steps.map((e: any) => e.props?.step));
    expect(stepValues.has(1)).toBeTruthy();
    expect(stepValues.has(2)).toBeTruthy();
    // Step 3 presence is likely, but not strictly required for stability
  });
});
