self.addEventListener('install', function(e) {
    console.log('🔧 Service Worker instaliran');
    self.skipWaiting();
});

self.addEventListener('activate', function(e) {
    console.log('✅ Service Worker aktiviran');
    e.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', function(e) {
    console.log('🔔 Kliknuto na notifikaciju', e.notification);
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(function(clientList) {
                for (var i = 0; i < clientList.length; i++) {
                    var client = clientList[i];
                    if (client.url && 'focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow('/');
                }
            })
    );
});

self.addEventListener('push', function(e) {
    var data = e.data ? e.data.json() : {};
    var title = data.title || 'Moj Planer';
    var options = {
        body: data.body || '',
        icon: '/favicon.ico',
        tag: data.tag || 'mp_' + Date.now(),
        renotify: true,
        requireInteraction: true,
        badge: '/favicon.ico'
    };
    e.waitUntil(
        self.registration.showNotification(title, options)
    );
});
