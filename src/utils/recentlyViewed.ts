export const RECENTLY_VIEWED_KEY = 'recently-viewed';

export function getRecentlyViewedIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENTLY_VIEWED_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(productId: string, limit = 10): void {
  try {
    const current = getRecentlyViewedIds().filter(id => id !== productId);
    current.unshift(productId);
    const next = current.slice(0, limit);
    localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(next));
    try { window.dispatchEvent(new CustomEvent('rv:update', { detail: { ids: next } })); } catch {}
  } catch {
    // ignore
  }
}
