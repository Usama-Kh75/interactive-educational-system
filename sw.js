const CACHE_NAME = 'interactive-edu-pwa-v2.6.0';
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

// تثبيت Service Worker وتخزين الموارد الأساسية فوراً
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching core PWA assets v2.6.0');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// رسائل الصفحة لعامل الخدمة: التحديث اللحظي وتجاوز الانتظار
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  if (event.data === 'refresh-shell' && event.ports && event.ports[0]) {
    event.waitUntil((async () => {
      let ok = false;
      try {
        const res = await fetch('./index.html', { cache: 'reload' });
        if (res.ok) {
          const c = await caches.open(CACHE_NAME);
          await c.put('./index.html', res.clone());
          await c.put('./', res);
          ok = true;
        }
      } catch { }
      event.ports[0].postMessage(ok);
    })());
  }
});

// تفعيل وإزالة الكاش القديم فوراً دون انتظار إغلاق التبويبات
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // المخازن مشتركة بين كل تطبيقات usama-kh75.github.io: يُحذف القديم من مخازن هذا التطبيق وحده
          if (cache.startsWith('interactive-edu-pwa-') && cache !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// استراتيجية التعامل مع الطلبات
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // ملف version.json يُجلب دائماً من الشبكة بدون تخزين مؤقت لضمان كشف التحديثات فوراً
  if (url.pathname.endsWith('/version.json') || url.pathname.endsWith('version.json')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' }).catch(() => caches.match(event.request))
    );
    return;
  }

  // إذا كان طلب API للخادم المحلي
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // لصفحات HTML والتنقل: Network-First لضمان وصول التحديثات فوراً وعدم بقاء النسخ القديمة
  if (event.request.mode === 'navigate' || event.request.destination === 'document' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        return caches.match(event.request).then((cached) => cached || caches.match('./index.html'));
      })
    );
    return;
  }

  // لباقي الموارد الثابتة (الصور والخطوط): Cache-First مع تحديث بالخلفية
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
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
      if (event.request.mode === 'navigate') {
        return caches.match('./index.html');
      }
    })
  );
});
