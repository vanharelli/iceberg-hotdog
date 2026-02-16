const VERSION_HASH = 'iceberg-v1';
const CACHE_PREFIX = 'iceberg-pwa-';
const CACHE_NAME = `${CACHE_PREFIX}${VERSION_HASH}`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          }),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const responseClone = response.clone();
        caches
          .open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseClone).catch(() => {});
          })
          .catch(() => {});
        return response;
      })
      .catch(() =>
        caches.match(event.request).then((cached) => cached || fetch(event.request)),
      ),
  );
});

