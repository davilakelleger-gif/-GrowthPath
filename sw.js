const CACHE_NAME = 'growthpath-v2';
const ASSETS = [
  '/Habit/',
  '/Habit/index.html',
  '/Habit/dashboard/',
  '/Habit/css/design-system.css',
  '/Habit/css/style.css',
  '/Habit/css/dashboard.css',
  '/Habit/css/auth.css',
  '/Habit/js/main.js',
  '/Habit/js/dashboard.js',
  '/Habit/js/charts.js',
  '/Habit/js/i18n.js',
  '/Habit/js/app.js',
  '/Habit/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          if (event.request.method === 'GET') {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      }).catch(() => {
        return caches.match('/Habit/index.html');
      });
    })
  );
});
