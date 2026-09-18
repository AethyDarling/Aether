/* The Aether Codex service worker: the whole Codex readable offline.
   index.html is fetched network-first so a deploy shows up on the next
   load; if the network is away, the last good copy is served. Fonts are
   cache-first (they never change without a rename). API calls are never
   cached here. */
const VERSION = "aether-sw-v2";
const SHELL = ["/", "/index.html", "/manifest.webmanifest",
  "/fonts/SourceSerif4-400-normal-latin.woff2", "/fonts/SourceSerif4-600-normal-latin.woff2",
  "/fonts/SourceSerif4-400-italic-latin.woff2", "/fonts/SourceSerif4-600-italic-latin.woff2",
  "/fonts/JetBrainsMono-400-normal-latin.woff2", "/fonts/JetBrainsMono-500-normal-latin.woff2"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/")) return;
  if (url.pathname.startsWith("/fonts/")) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => { const copy = res.clone(); caches.open(VERSION).then((c) => c.put(e.request, copy)); return res; })));
    return;
  }
  // the page: network first, cache fallback
  e.respondWith(fetch(e.request).then((res) => { if (res.ok) { const copy = res.clone(); caches.open(VERSION).then((c) => c.put("/index.html", copy)); } return res; }).catch(() => caches.match("/index.html")));
});
