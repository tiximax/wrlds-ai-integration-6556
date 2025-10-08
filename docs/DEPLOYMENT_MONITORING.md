# 📊 Deployment Monitoring Setup

## 🎯 Mục đích
Thiết lập monitoring và tracking để theo dõi Phase 1 deployment hiệu quả.

---

## 1. Error Tracking Setup

### Option A: Sentry (Khuyến nghị)
```bash
npm install @sentry/react @sentry/vite-plugin
```

**Setup Code:**
```typescript
// src/lib/monitoring.ts
import * as Sentry from "@sentry/react";

export function initMonitoring() {
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      environment: import.meta.env.MODE,
      tracesSampleRate: 0.1,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
    });
  }
}
```

**Sử dụng:**
```typescript
// src/main.tsx
import { initMonitoring } from './lib/monitoring';

initMonitoring();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

---

### Option B: Simple Error Logger (Quick)
```typescript
// src/lib/error-logger.ts
export function setupErrorLogging() {
  window.addEventListener('error', (event) => {
    console.error('Global Error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
      timestamp: new Date().toISOString(),
    });
    
    // Optional: Send to backend
    if (import.meta.env.PROD) {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'error',
          message: event.message,
          stack: event.error?.stack,
          url: window.location.href,
        }),
      }).catch(console.error);
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
  });
}
```

---

## 2. Performance Monitoring

### Web Vitals Tracking
```bash
npm install web-vitals
```

**Setup:**
```typescript
// src/lib/performance.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

export function setupPerformanceMonitoring() {
  function sendToAnalytics(metric: any) {
    console.log('Performance Metric:', metric);
    
    // Optional: Send to analytics service
    if (import.meta.env.PROD) {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'web-vital',
          name: metric.name,
          value: metric.value,
          rating: metric.rating,
          url: window.location.href,
          timestamp: Date.now(),
        }),
      }).catch(console.error);
    }
  }

  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

---

## 3. Accessibility Monitoring

### Runtime Accessibility Checks
```typescript
// src/lib/a11y-monitor.ts
export function setupA11yMonitoring() {
  if (import.meta.env.DEV) {
    import('react-axe').then((axe) => {
      axe.default(React, ReactDOM, 1000);
    });
  }

  // Track ARIA violations
  const observer = new MutationObserver(() => {
    const elementsWithoutAlt = document.querySelectorAll('img:not([alt])');
    const buttonsWithoutLabel = document.querySelectorAll('button:not([aria-label]):empty');
    
    if (elementsWithoutAlt.length > 0 || buttonsWithoutLabel.length > 0) {
      console.warn('Accessibility Issues:', {
        imagesWithoutAlt: elementsWithoutAlt.length,
        buttonsWithoutLabel: buttonsWithoutLabel.length,
      });
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}
```

---

## 4. User Analytics (Optional)

### Google Analytics 4
```html
<!-- index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX', {
    page_path: window.location.pathname,
  });
</script>
```

**React Router Integration:**
```typescript
// src/App.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function Analytics() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag !== 'undefined') {
      window.gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
}
```

---

## 5. Deployment Checklist

### Pre-Deployment
- [ ] All monitoring scripts integrated
- [ ] Environment variables set (SENTRY_DSN, GA_ID, etc.)
- [ ] Error boundaries in place
- [ ] Performance thresholds defined

### Post-Deployment (24-48h)
- [ ] Check error rates (target: <0.1%)
- [ ] Monitor Core Web Vitals:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1
- [ ] Review accessibility violations (target: 0 critical)
- [ ] Track user engagement metrics
- [ ] Monitor bundle load times

---

## 6. Dashboard Setup

### Key Metrics to Track
| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| **Errors/day** | <10 | TBD | 🟡 |
| **LCP** | <2.5s | TBD | 🟡 |
| **FID** | <100ms | TBD | 🟡 |
| **CLS** | <0.1 | TBD | 🟡 |
| **Accessibility Score** | >90 | TBD | 🟡 |
| **Bounce Rate** | <40% | TBD | 🟡 |

---

## 7. Alert Configuration

### Critical Alerts (Immediate Action)
- Error rate spike (>50 errors/hour)
- Performance degradation (LCP >5s)
- Complete service outage

### Warning Alerts (Monitor)
- Error rate increase (>20 errors/hour)
- Performance slowdown (LCP >3s)
- Accessibility violations detected

---

## 8. Rollback Plan

### Quick Rollback Steps
```bash
# If critical issues detected:
git revert HEAD
git push origin main --force

# Or revert PR merge:
gh pr reopen [PR_NUMBER]
gh pr close [PR_NUMBER]
git reset --hard HEAD~1
git push origin main --force
```

### Emergency Contact
- **Tech Lead:** [Contact]
- **DevOps:** [Contact]
- **On-call Engineer:** [Contact]

---

## 📚 Resources
- [Sentry Docs](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Web Vitals](https://web.dev/vitals/)
- [Google Analytics 4](https://developers.google.com/analytics/devguides/collection/ga4)

---

**Created:** 2025-10-03  
**Last Updated:** 2025-10-03  
**Status:** ✅ Ready for deployment
