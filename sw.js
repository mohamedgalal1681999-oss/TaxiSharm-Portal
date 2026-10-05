/*
  Taxi Sharm — the service worker that makes the portal installable, and does nothing else.

  It caches NOTHING. Every request goes to the network, so a new deployment shows up the next
  time the app opens — there is no stored copy to go stale. It only ever sees this site's own
  files (the frame around the portal and its icons); the portal itself and every figure come
  from script.google.com, which it never touches.

  The page itself is asked for with cache: 'no-store', so even the browser's ten-minute HTTP
  cache on GitHub Pages cannot hand back yesterday's frame. (A navigation request cannot be
  passed to fetch() together with options, hence fetching it by URL.)
*/
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('activate', function (e) { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req.url, { cache: 'no-store', credentials: 'same-origin' })
      .catch(function () { return fetch(req); }));
    return;
  }
  e.respondWith(fetch(req));
});
