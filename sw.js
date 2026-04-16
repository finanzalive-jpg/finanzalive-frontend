// IUPPITER Service Worker — Push Notifications
const CACHE_NAME = 'iuppiter-v1';

self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

// Gestione push in background (quando il browser è chiuso)
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data ? e.data.json() : {}; } catch(err) {}

  var title = data.title || '🚀 Nuovo segnale IUPPITER';
  var options = {
    body: data.body || 'Clicca per vedere il segnale',
    icon: data.icon || '/gold logo.jpg',
    badge: '/gold logo.jpg',
    tag: 'iuppiter-signal',
    renotify: true,
    requireInteraction: false,
    data: { url: data.url || '/' }
  };

  e.waitUntil(self.registration.showNotification(title, options));
});

// Tap sulla notifica → apre/focussa la tab
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  var targetUrl = (e.notification.data && e.notification.data.url) || '/';

  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
