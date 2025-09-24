import type { Page } from '@playwright/test';

/**
 * Disable/neutralize cookie/consent overlays that can intercept pointer events during E2E.
 * Only used in tests. It adds a strong CSS override and also removes any existing nodes if present.
 */
export async function disableOverlaysForTest(page: Page) {
  // Strong CSS override to keep overlays hidden even if injected later
  await page.addStyleTag({
    content: `
      #silktide-backdrop, #silktide-wrapper, #silktide-banner,
      .silktide-consent, .silktide, [data-silktide] {
        display: none !important;
        visibility: hidden !important;
        pointer-events: none !important;
        opacity: 0 !important;
      }
    `,
  });

  // Remove if already attached
  await page.evaluate(() => {
    const ids = ['silktide-wrapper', 'silktide-backdrop', 'silktide-banner'];
    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) el.remove();
    }
    // Best-effort: remove common classes/attrs
    document.querySelectorAll('.silktide-consent, .silktide, [data-silktide]').forEach((n) => n.remove());

    // Hint consent state to avoid re-injection loops (best-effort, non-breaking)
    try {
      localStorage.setItem('silktideCookieChoice_necessary', 'true');
      localStorage.setItem('silktideCookieChoice_analytics', 'true');
      localStorage.setItem('silktideCookieChoice_marketing', 'true');
    } catch {}
  });
}

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
  await disableOverlaysForTest(page);
  // Use DOM click to avoid overlay/pointer issues
  await page.evaluate(() => (document.querySelector('[data-testid="cart-button"]') as HTMLButtonElement)?.click());
}
