/* sw.js — offline support.
 *
 * Cache-first for the app shell: once installed, the app opens with no network
 * at all. Bump CACHE when any shell file changes, or the old copy is served.
 */
const CACHE = 'verbes-v1';
const SHELL = [
  './',
  './index.html',
  './engine.js',
  './data.js',
  './frequency.js',
  './manifest.json',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(SHELL); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
                             .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(function (hit) {
      if (hit) return hit;
      return fetch(e.request).then(function (res) {
        // A redirected response (e.g. an auth check on the way to the page)
        // can't be handed to a navigation request as-is -- Safari throws
        // "Response served by service worker has redirections" and the load
        // fails outright. Rebuilding a plain Response from the same body
        // strips that flag, so it's safe to serve and cache either way.
        if (res && res.redirected) {
          res = new Response(res.body, {
            status: res.status, statusText: res.statusText, headers: res.headers
          });
        }
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        }
        return res;
      }).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});
