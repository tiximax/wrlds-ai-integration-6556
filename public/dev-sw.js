/* Simple runtime cache for static assets and images (Dev SW) */
const CACHE_NAME = 'wrlds-cache-v1';

self.addEventListener('install', (event) => {
  // Activate immediately
  // @ts-ignore
  self.skipWaiting();
  // Precache some critical routes/documents
  const PRECACHE = ['/', '/products', '/search'];
  // @ts-ignore
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE)).catch(() => {}));
});

self.addEventListener('activate', (event) => {
  // @ts-ignore
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Chỉ xử lý same-origin để tránh lỗi cross-origin (fonts.gstatic, unsplash,...)
  try {
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;
  } catch {
    return;
  }

  const dest = req.destination;
  const shouldCache = dest === 'image' || dest === 'style' || dest === 'script' || dest === 'font' || dest === 'document';
  if (!shouldCache) return;

  event.respondWith((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) {
        // Update in background (ignore errors)
        fetch(req).then((res) => {
          try { if (res && res.status === 200) cache.put(req, res.clone()); } catch {}
        }).catch(() => {});
        return cached;
      }
      const res = await fetch(req).catch(() => null);
      if (res && res.status === 200) {
        try { await cache.put(req, res.clone()); } catch {}
        return res;
      }
      // Try cache fallback
      const fallback = await cache.match(req);
      if (fallback) return fallback;
      return res || new Response('', { status: 502 });
    } catch (e) {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(req);
        if (cached) return cached;
      } catch {}
      return new Response('', { status: 502 });
    }
  })());
});
