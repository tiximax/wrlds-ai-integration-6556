export type AnalyticsEvent = {
  name: string;
  props?: Record<string, any>;
};

const QUEUE_KEY = 'analytics-queue-v1';

export function trackEvent(name: string, props?: Record<string, any>) {
  try {
    const evt: AnalyticsEvent = { name, props: { ...props, ts: Date.now() } };
    // Attempt sendBeacon (no-op endpoint)
    const endpoint = '/api/analytics';
    const payload = JSON.stringify(evt);
    // @ts-ignore
    const ok = typeof navigator !== 'undefined' && navigator.sendBeacon && navigator.sendBeacon(endpoint, payload);
    if (!ok) {
      // Fallback: enqueue in localStorage
      const raw = localStorage.getItem(QUEUE_KEY);
      const arr = raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
      arr.push(evt);
      localStorage.setItem(QUEUE_KEY, JSON.stringify(arr.slice(-1000)));
    }
    // Also log to console in dev
    // eslint-disable-next-line no-console
    console.debug('[analytics]', name, props || {});
  } catch {
    // ignore
  }
}

export function flushQueue() {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    if (!raw) return;
    const arr = JSON.parse(raw) as AnalyticsEvent[];
    arr.forEach((evt) => trackEvent(evt.name, evt.props));
    localStorage.removeItem(QUEUE_KEY);
  } catch {}
}