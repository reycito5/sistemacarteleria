/*
 * Service Worker del reproductor SICD UABJB POSGRADO (Fase 7).
 * ---------------------------------------------------------------------------
 * Permite el funcionamiento sin Internet (sección 17): cachea el app shell, el
 * manifiesto y los archivos multimedia. Reglas de seguridad: nunca deja la
 * pantalla sin contenido; conserva la última versión funcional.
 *
 * JavaScript plano (no pasa por el bundler). Mantener sin dependencias.
 */

const VERSION = "v1";
const SHELL_CACHE = `sicd-shell-${VERSION}`;
const MANIFEST_CACHE = `sicd-manifest-${VERSION}`;
const MEDIA_CACHE = `sicd-media-${VERSION}`;
const KNOWN_CACHES = [SHELL_CACHE, MANIFEST_CACHE, MEDIA_CACHE];

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter((n) => n.startsWith("sicd-") && !KNOWN_CACHES.includes(n))
          .map((n) => caches.delete(n)),
      );
      await self.clients.claim();
    })(),
  );
});

/** Precarga anticipada de medios solicitada por el reproductor. */
self.addEventListener("message", (event) => {
  const data = event.data;
  if (!data || data.type !== "PRECACHE_MEDIA" || !Array.isArray(data.urls)) return;
  event.waitUntil(precacheMedia(data.urls));
});

async function precacheMedia(urls) {
  const cache = await caches.open(MEDIA_CACHE);
  await Promise.all(
    urls.map(async (url) => {
      try {
        const match = await cache.match(url);
        if (match) return; // ya está en caché
        const res = await fetch(url, { mode: "cors" });
        if (res.ok) await cache.put(url, res.clone());
      } catch {
        // Un archivo que no se pudo precargar no debe romper el resto.
      }
    }),
  );
}

function isMedia(url) {
  return (
    url.pathname.includes("/storage/v1/object/public/media/") ||
    /\.(mp4|webm|m4v|jpg|jpeg|png|webp)$/i.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // 1) Medios: cache-first (se sirven aunque no haya red).
  if (isMedia(url)) {
    event.respondWith(cacheFirst(req, MEDIA_CACHE));
    return;
  }

  // 2) Manifiesto: red primero, con respaldo de la última copia.
  if (url.pathname === "/api/player/manifest") {
    event.respondWith(networkFirst(req, MANIFEST_CACHE));
    return;
  }

  // 3) Recursos estáticos de la app: cache-first con revalidación.
  if (url.origin === self.location.origin && url.pathname.startsWith("/_next/")) {
    event.respondWith(cacheFirst(req, SHELL_CACHE));
    return;
  }

  // 4) Navegaciones (HTML): red primero, respaldo de la misma URL cacheada.
  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, SHELL_CACHE));
    return;
  }
});

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    if (cached) return cached;
    throw err;
  }
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    if (res.ok) cache.put(req, res.clone());
    return res;
  } catch (err) {
    const cached = await cache.match(req);
    if (cached) return cached;
    throw err;
  }
}
