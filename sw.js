const CACHE_NAME = 'interactive-edu-pwa-v2.1.0';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './curriculum_data.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-icon-512.png',
  './icons/icon.svg'
];

// تثبيت Service Worker وتخزين الموارد الأساسية
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching core PWA assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// تفعيل وإزالة الكاش القديم عند التحديث
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// استراتيجية التعامل مع الطلبات (Cache-First مع تحديث ذكي)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // إذا كان طلب API للخادم المحلي
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        // في حال انقطاع الخادم، استرجع من الكاش إن وجد
        return caches.match(event.request);
      })
    );
    return;
  }

  // الموارد الثابتة (HTML, JS, CSS, Icons)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // جلب نسخة محدثة في الخلفية (Stale-While-Revalidate)
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse);
            });
          }
        }).catch(() => {/* Offline */});
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return networkResponse;
      });
    }).catch(() => {
      // العودة لصفحة البداية إذا فشل كل شيء
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
