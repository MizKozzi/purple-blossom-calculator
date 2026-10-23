const CACHE_NAME ="purple=blossom-v1";

const FILES_TO_CACHE = [
  "./PurpleBlossomCal.html",
  "./PurpleBlossomCal.css",
  "./PurpleBlossomCal.js",
  "./manifest.json",
  "./icons/Icon-192.png",
  "./icons/Icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
        .filter((name) => name !==CACHE_NAME)
        .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method!=="GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});