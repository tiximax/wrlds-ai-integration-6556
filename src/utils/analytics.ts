export type AnalyticsEvent = {
  name: string;
  props?: Record<string, any>;
};

const QUEUE_KEY = 'analytics-queue-v1';

function enqueueLS(evt: AnalyticsEvent) {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const arr = raw ? (JSON.parse(raw) as AnalyticsEvent[]) : [];
    arr.push(evt);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(arr.slice(-1000)));
  } catch {}
}

export function trackEvent(name: string, props?: Record<string, any>) {
  try {
    const evt: AnalyticsEvent = { name, props: { ...props, ts: Date.now() } };

    // Luôn mirror vào localStorage để test có thể đọc được hàng đợi một cách ổn định
    enqueueLS(evt);

    // Thử gửi beacon (sẽ 404 trong dev, chấp nhận)
    try {
      const endpoint = '/api/analytics';
      const payload = JSON.stringify(evt);
      // @ts-ignore
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        // @ts-ignore
        navigator.sendBeacon(endpoint, payload);
      }
    } catch {}

    // Log ra console để debug
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
