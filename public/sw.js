const CACHE_NAME = "site-radar-v1";

const STATIC_ASSETS = [
    "/",
    "/buscar",
    "/endereco",
    "/proximo",
    "/mapa",
    "/sobre",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
];

// Install — faz cache do shell do app
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
    );
    self.skipWaiting();
});

// Activate — remove caches antigos
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// Fetch — Network First (tenta rede, cai no cache se offline)
self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") return;

    // Supabase sempre direto na rede (dados em tempo real)
    if (event.request.url.includes("supabase.co")) return;

    // Tiles do mapa sempre da rede
    if (event.request.url.includes("tile.openstreetmap.org")) return;

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response.ok) {
                    const clone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
                }
                return response;
            })
            .catch(() =>
                caches.match(event.request).then((cached) => cached || caches.match("/"))
            )
    );
});
