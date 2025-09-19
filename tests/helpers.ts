import type { Page } from '@playwright/test';

export async function removeSilktide(page: Page) {
  await page.evaluate(() => {
    const wrapper = document.querySelector('#silktide-wrapper');
    if (wrapper) (wrapper as HTMLElement).remove();
    const backdrop = document.querySelector('#silktide-backdrop');
    if (backdrop) (backdrop as HTMLElement).remove();
  });
}

export async function clearStorage(page: Page) {
  await page.evaluate(() => {
    try {
      localStorage.removeItem('wishlist_items');
      localStorage.removeItem('simple-cart');
    } catch {}
  });
}

export async function openCartFromNavbar(page: Page) {
  const cartButton = page.locator('[data-testid="cart-button"]').first();
  await cartButton.scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollTo(0, 0));
  await removeSilktide(page);
  // Use DOM click to avoid overlay/pointer issues
  await page.evaluate(() => (document.querySelector('[data-testid="cart-button"]') as HTMLButtonElement)?.click());
}