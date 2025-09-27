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

  const dest = req.destination;
  const shouldCache = dest === 'image' || dest === 'style' || dest === 'script' || dest === 'font';
  if (!shouldCache) return;

  event.respondWith((async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(req);
      if (cached) {
        // Update in background
        fetch(req).then((res) => {
          if (res && res.status === 200) cache.put(req, res.clone());
        }).catch(() => {});
        return cached;
      }
      const res = await fetch(req);
      if (res && res.status === 200) await cache.put(req, res.clone());
      return res;
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
