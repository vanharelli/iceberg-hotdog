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

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((clients) => {
        for (const client of clients) {
          if ('focus' in client) {
            return client.focus();
          }
        }
        if (self.clients.openWindow) {
          return self.clients.openWindow('/');
        }
        return undefined;
      })
      .catch(() => {}),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') {
    return;
  }

  if (event.request.mode === 'navigate') {
    event.waitUntil(
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys.map((key) => {
              if (key !== CACHE_NAME && key.startsWith(CACHE_PREFIX)) {
                return caches.delete(key);
              }
            }),
          ),
        )
        .catch(() => {}),
    );
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
