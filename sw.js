// Inside sw.js
self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  return self.clients.claim();
});

// CRITICAL: Chrome requires this block to allow direct native installation
self.addEventListener('fetch', (e) => {
  // Keeps the app functional online/offline
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
