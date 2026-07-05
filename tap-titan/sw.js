const CACHE = "tap-titan-v3";
const ASSETS = ["./", "./index.html", "./css/style.css", "./js/game.js", "./manifest.json"];

self.addEventListener("install", function (e) {
    e.waitUntil(caches.open(CACHE).then(function (cache) {
        return cache.addAll(ASSETS);
    }));
});

self.addEventListener("fetch", function (e) {
    e.respondWith(
        caches.match(e.request).then(function (cached) {
            return cached || fetch(e.request);
        })
    );
});
