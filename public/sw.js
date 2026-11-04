/*
 * Chop service worker: makes the app installable and usable offline.
 * - Pages: network first, then the cached copy (pages you've opened work offline).
 * - Build files (/_next/static) and icons: cache first; they never change.
 * - Other same-site files: served from cache and refreshed in the background.
 * - Other sites (map tiles, shop search) are never cached here.
 * Bump VERSION to drop old caches after a big change.
 */
const VERSION = "chop-v1";
const PAGES = `${VERSION}-pages`;
const ASSETS = `${VERSION}-assets`;
const PRECACHE = ["/en", "/fr", "/en/planner", "/fr/planner"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => undefined))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

const offlinePage = (lang) =>
  new Response(
    `<!doctype html><html lang="${lang}"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Chop</title><body style="margin:0;font-family:system-ui;background:#FFF8EE;color:#2A1A12;display:grid;place-items:center;min-height:100vh;text-align:center;padding:24px">
<div><h1 style="color:#E4572E">Chop</h1><p>${
      lang === "fr"
        ? "Vous êtes hors ligne. Les pages déjà ouvertes restent disponibles."
        : "You're offline. Pages you've already opened are still available."
    }</p><p><a href="/${lang}" style="color:#E4572E">${lang === "fr" ? "Accueil" : "Home"}</a></p></div></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate") {
    const lang = url.pathname.startsWith("/fr") ? "fr" : "en";
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(PAGES).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(async () => (await caches.match(req)) || (await caches.match(`/${lang}`)) || offlinePage(lang)),
    );
    return;
  }

  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            if (res.ok) {
              const copy = res.clone();
              caches.open(ASSETS).then((c) => c.put(req, copy));
            }
            return res;
          }),
      ),
    );
    return;
  }

  // Everything else on this site (page data for client navigation, images…): stale-while-revalidate.
  event.respondWith(
    caches.open(ASSETS).then(async (cache) => {
      const hit = await cache.match(req);
      const network = fetch(req)
        .then((res) => {
          if (res.ok && res.type === "basic") cache.put(req, res.clone());
          return res;
        })
        .catch(() => hit);
      return hit || network;
    }),
  );
});
