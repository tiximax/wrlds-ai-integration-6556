import { test, expect } from '@playwright/test';

// E2E for SecurityBadges in footer and checkout

test.describe('Trust: Security Badges', () => {
  test('should render security badges in footer and checkout', async ({ page }) => {
    // Footer badges on home
    await page.goto('/');
    await page.addStyleTag({ content: '#silktide-backdrop, #silktide-wrapper { display: none !important; }' });
    await expect(page.getByTestId('security-badges-footer')).toBeVisible();
    // Logos visible in footer
    const footer = page.getByTestId('security-badges-footer');
    await expect(footer.getByTestId('payment-logos')).toBeVisible();
    await expect(footer.getByAltText('Visa')).toHaveAttribute('src', /\/payment\/visa\.svg$/);
    await expect(footer.getByAltText('Mastercard')).toHaveAttribute('src', /\/payment\/mastercard\.svg$/);
    await expect(footer.getByAltText('PayPal')).toHaveAttribute('src', /\/payment\/paypal\.svg$/);
    await expect(footer.getByAltText('MoMo')).toHaveAttribute('src', /\/payment\/momo\.svg$/);
    await expect(footer.getByAltText('SSL Secured')).toHaveAttribute('src', /\/payment\/ssl-secured\.svg$/);

    // Seed cart and go to checkout to see badges there
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

    // Reload to ensure init script ran
    await page.reload();

    // Navigate directly to checkout
    await page.goto('/checkout');
    await page.addStyleTag({ content: '#silktide-backdrop, #silktide-wrapper { display: none !important; }' });

    // Check badges on checkout page
    const checkoutBadges = page.getByTestId('security-badges-checkout');
    await expect(checkoutBadges).toBeVisible({ timeout: 10000 });
    await expect(checkoutBadges.getByTestId('payment-logos')).toBeVisible();
    await expect(checkoutBadges.getByAltText('Visa')).toHaveAttribute('src', /\/payment\/visa\.svg$/);
    await expect(checkoutBadges.getByAltText('Mastercard')).toHaveAttribute('src', /\/payment\/mastercard\.svg$/);
    await expect(checkoutBadges.getByAltText('PayPal')).toHaveAttribute('src', /\/payment\/paypal\.svg$/);
    await expect(checkoutBadges.getByAltText('MoMo')).toHaveAttribute('src', /\/payment\/momo\.svg$/);
    await expect(checkoutBadges.getByAltText('SSL Secured')).toHaveAttribute('src', /\/payment\/ssl-secured\.svg$/);
  });
});