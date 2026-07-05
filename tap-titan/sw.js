const CACHE = "tap-titan-v7";
const ASSETS = [
    "./",
    "./index.html",
    "./css/style.css",
    "./js/content.js",
    "./js/game.js",
    "./js/sprites.js",
    "./manifest.json"
];

self.addEventListener("install", function (e) {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE).then(function (cache) {
        return cache.addAll(ASSETS);
    }));
});

self.addEventListener("activate", function (e) {
    e.waitUntil(
        caches.keys().then(function (keys) {
            return Promise.all(
                keys.filter(function (k) { return k !== CACHE; }).map(function (k) {
                    return caches.delete(k);
                })
            );
        }).then(function () {
            return self.clients.claim();
        })
    );
});

self.addEventListener("fetch", function (e) {
    if (e.request.method !== "GET") return;

    var url = new URL(e.request.url);
    var isGameAsset = url.pathname.includes("/tap-titan/") &&
        (/\.(js|css|html)$/.test(url.pathname) || url.pathname.endsWith("/tap-titan/"));

    if (isGameAsset) {
        e.respondWith(
            fetch(e.request).then(function (response) {
                var clone = response.clone();
                caches.open(CACHE).then(function (cache) {
                    cache.put(e.request, clone);
                });
                return response;
            }).catch(function () {
                return caches.match(e.request);
            })
        );
    }
});
