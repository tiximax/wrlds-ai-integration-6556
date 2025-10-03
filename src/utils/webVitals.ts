import { trackEvent } from '@/utils/analytics';

let lcpValue = 0;
let clsValue = 0;
let fidValue = 0;
let inpMax = 0;
let lcpFinal = false;
let inpReported = false;

export function initWebVitals() {
  if (typeof window === 'undefined' || typeof PerformanceObserver === 'undefined') return;

  try {
    // Prefer official INP metric when available (web-vitals), fallback to approx below
    // Dynamic import to avoid affecting initial bundle
    import('web-vitals').then((mod: any) => {
      const onINP = (mod && (mod as any).onINP) as undefined | ((cb: (m: any) => void) => void);
      if (onINP) {
        try {
          onINP((metric: any) => {
            inpReported = true;
            trackEvent('webvitals', {
              metric: 'INP',
              value: Math.round(metric?.value ?? 0),
              rating: metric?.rating,
              id: metric?.id,
            });
          });
        } catch {}
      }
      // Optionally, you could also use onFCP/onTTFB from web-vitals; we already report via PerformanceObserver below.
    }).catch(() => {});
    // LCP
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries() as any[];
      const last = entries[entries.length - 1];
      if (last) {
        lcpValue = last.startTime || last.renderTime || 0;
      }
    });
    // buffered to get entries before observer start
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true } as PerformanceObserverInit);

    // CLS
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value || 0;
        }
      }
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true } as PerformanceObserverInit);

    // FID (first-input)
    const fidObserver = new PerformanceObserver((entryList) => {
      const first = entryList.getEntries()[0] as any;
      if (first && !fidValue) {
        fidValue = (first.processingStart || first.startTime) - first.startTime;
        trackEvent('webvitals', { metric: 'FID', value: Math.round(fidValue) });
        fidObserver.disconnect();
      }
    });
    fidObserver.observe({ type: 'first-input', buffered: true } as PerformanceObserverInit);

    // FCP via 'paint' entry
    try {
      const paintObserver = new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries() as any[]) {
          if (entry.name === 'first-contentful-paint') {
            trackEvent('webvitals', { metric: 'FCP', value: Math.round(entry.startTime || 0) });
          }
        }
      });
      paintObserver.observe({ type: 'paint', buffered: true } as PerformanceObserverInit);
    } catch {}

    // TTFB via navigation timing
    try {
      const navEntries = performance.getEntriesByType('navigation') as any[];
      const nav = navEntries && navEntries[0];
      if (nav) {
        const ttfb = Math.max(0, (nav.responseStart || 0) - (nav.requestStart || 0));
        if (ttfb) trackEvent('webvitals', { metric: 'TTFB', value: Math.round(ttfb) });
      }
    } catch {}

    // Approximate INP via PerformanceEventTiming ('event')
    try {
      const eventObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          // Filter common interactions; include only if interactionId available when supported
          const name: string = (entry.name || '').toLowerCase();
          if (name.includes('click') || name.includes('pointer') || name.includes('keydown') || name.includes('tap')) {
            const dur = entry.duration || 0;
            if (dur > inpMax) inpMax = dur;
          }
        }
      });
      // Some browsers require 'event' type and allowBuffered
      // @ts-ignore
      eventObserver.observe({ type: 'event', buffered: true, durationThreshold: 16 } as PerformanceObserverInit);
    } catch {}

    const finalize = () => {
      if (!lcpFinal) {
        trackEvent('webvitals', { metric: 'LCP', value: Math.round(lcpValue) });
        trackEvent('webvitals', { metric: 'CLS', value: Number(clsValue.toFixed(3)) });
        if (inpMax && !inpReported) trackEvent('webvitals', { metric: 'INP_approx', value: Math.round(inpMax) });
        lcpFinal = true;
        lcpObserver.disconnect();
        clsObserver.disconnect();
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') finalize();
    });
    window.addEventListener('pagehide', finalize);
  } catch {
    // ignore
  }
}
