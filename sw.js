// IUPPITER Service Worker v2 — Web Push reali
const VAPID_PUBLIC_KEY = 'BNtuePHDQcXHkdxzYJplRVQArnaRLDkur5T2CjMsVQZfGEIO7b47reg30dd9sCLznzEDq_B7c-dvRt7gtDRadKQ';

self.addEventListener('install', function(e) { self.skipWaiting(); });
self.addEventListener('activate', function(e) { e.waitUntil(clients.claim()); });

// Push ricevuta dal server (app CHIUSA)
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch(err) {}
  var title = data.title || '🚀 Nuovo segnale IUPPITER';
  var options = {
    body: data.body || '',
    icon: '/iuppiter-icon.png',
    badge: '/iuppiter-icon.png',
    tag: data.tag || 'iuppiter-signal',
    renotify: true,
    data: { url: data.url || '/' }
  };
  e.waitUntil(self.registration.showNotification(title, options));
});

// Tap sulla notifica → apre l'app
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if ('focus' in list[i]) { list[i].focus(); list[i].navigate(url); return; }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
