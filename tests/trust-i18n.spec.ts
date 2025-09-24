import { test, expect } from '@playwright/test';
import { removeSilktide, clearStorage } from './helpers';

// E2E: i18n for Trust components (AssurancePolicies + LiveActivityFeed)

test.describe('Trust i18n (EN/VI)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await clearStorage(page);
  });

  test('renders English strings when i18nextLng=en', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('i18nextLng', 'en'));

    // Homepage - LiveActivityFeed + Footer badges
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    // LiveActivityFeed heading
    await expect(page.getByRole('heading', { name: /Live Activity/i })).toBeVisible();

    // PDP - AssurancePolicies English + RatingDistribution
    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    const ap = page.getByTestId('assurance-policies');
    await expect(ap).toBeVisible();
    await expect(ap.getByText('30-day Returns')).toBeVisible();
    await expect(ap.getByText('Secure Checkout')).toBeVisible();
    await expect(ap.getByText('24/7 Support')).toBeVisible();

    await expect(page.getByTestId('rating-distribution')).toBeVisible();
    await expect(page.getByText(/Ratings breakdown/i)).toBeVisible();
  });

  test('renders Vietnamese strings when i18nextLng=vi', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('i18nextLng', 'vi'));

    // Homepage
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    await expect(page.getByRole('heading', { name: /Hoạt động trực tiếp/i })).toBeVisible();

    // PDP
    await page.goto('/products/premium-japanese-sneakers');
    await page.waitForLoadState('domcontentloaded');
    await removeSilktide(page);

    const ap = page.getByTestId('assurance-policies');
    await expect(ap).toBeVisible();
    await expect(ap.getByText('Đổi trả 30 ngày')).toBeVisible();
    await expect(ap.getByText('Thanh toán an toàn')).toBeVisible();
    await expect(ap.getByText('Hỗ trợ 24/7')).toBeVisible();

    await expect(page.getByTestId('rating-distribution')).toBeVisible();
    await expect(page.getByText(/Phân bố đánh giá/i)).toBeVisible();
  });
});
