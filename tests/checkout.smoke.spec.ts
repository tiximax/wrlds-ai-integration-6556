import { test, expect } from '@playwright/test';

// Kiểm thử smoke cho luồng Checkout tối thiểu, chỉ Chromium theo rule
// Mục tiêu: đảm bảo người dùng có thể thêm sản phẩm, mở giỏ, vào /checkout và đi qua 3 bước đến hoàn tất

test.describe('Checkout Smoke', () => {
  test('should navigate from cart to checkout and complete minimal steps', async ({ page }) => {
    // Seed localStorage để có sẵn 1 item trong giỏ (ổn định cho smoke)
    const seededCart = {
      items: [
        {
          id: 'seed-1',
          product: {
            id: 'seed-p1',
            name: 'Seeded Test Product',
            slug: 'seeded-test-product',
            description: 'Seeded product for checkout smoke test',
            sellingPrice: 123000,
            currency: 'VND',
            stock: 1,
            images: [{ id: 'img', url: '/placeholder.svg', alt: 'Seed', isPrimary: true, order: 1 }],
            category: { id: 'cat-seed', name: 'Test', slug: 'test', isActive: true, createdAt: new Date(), updatedAt: new Date() },
            origin: 'usa',
            status: 'available',
            rating: { average: 4.5, count: 1 },
            type: 'ready_stock',
            tags: ['seed'],
            featured: false,
            trending: false,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          quantity: 1,
          finalPrice: 123000,
          addedAt: new Date()
        }
      ],
      totalItems: 1,
      totalPrice: 123000,
      isLoading: false
    };
    await page.addInitScript((cart) => {
      // @ts-ignore
      window.localStorage.setItem('simple-cart', JSON.stringify(cart));
    }, seededCart as any);

    // Mở trang chủ để app mount với localStorage đã seed
    await page.goto('/');
    // Ẩn overlay cookie (Silktide) nếu xuất hiện để tránh chặn click
    await page.addStyleTag({ content: '#silktide-backdrop, #silktide-wrapper { display: none !important; }' });

    // Mở giỏ hàng bằng custom event (ổn định, tránh thay đổi giao diện)
    await page.evaluate(() => {
      window.dispatchEvent(new Event('wrlds:open-cart'));
    });

    // Nhảy sang Checkout từ sidebar
    const goCheckout = page.getByTestId('go-checkout');
    await expect(goCheckout).toBeVisible();
    await goCheckout.click();

    // Trên trang Checkout
    await expect(page.getByTestId('checkout-page')).toBeVisible();

    // B1: Địa chỉ -> tiếp tục
    await expect(page.getByTestId('step-address')).toBeVisible();
    await page.getByTestId('address-continue').click();

    // B2: Thanh toán -> tiếp tục
    await expect(page.getByTestId('step-payment')).toBeVisible();
    await page.getByTestId('payment-continue').click();

    // B3: Xem lại -> Đặt hàng
    await expect(page.getByTestId('step-review')).toBeVisible();
    await page.getByTestId('place-order').click();

    // Hoàn tất
    await expect(page.getByTestId('order-confirmation')).toBeVisible();
  });
});
