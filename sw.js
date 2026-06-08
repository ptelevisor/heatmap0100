const CACHE_NAME = 'heatmap-v1';
const urlsToCache = [
  'index.html',
  'manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            if (response) return response;
            if (event.request.mode === 'navigate') {
              return caches.match('index.html');
            }
            return new Response('Offline', { status: 404 });
          });
      })
  );
});
