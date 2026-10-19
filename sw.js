/*
  Taxi Sharm — the service worker that makes the portal installable.

  It keeps NO copy of anything. The page is asked for with cache: 'no-cache': the browser
  checks with GitHub every time and is answered "not modified" in a few bytes when nothing
  changed, so the app opens fast and a new version shows the next time it is opened. Figures
  never pass through here — they come from Apps Script.
*/
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' })
      .catch(function () { return fetch(req); }));
    return;
  }
  e.respondWith(fetch(req));
});
