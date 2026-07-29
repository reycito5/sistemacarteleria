import type { PlayerManifest } from "./manifest";

/**
 * Utilidades de Service Worker del reproductor (Fase 7). Registran el SW y le
 * piden precargar los medios de la programación para funcionar sin Internet.
 */

export function registerPlayerServiceWorker(): void {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;
  navigator.serviceWorker.register("/sw.js").catch(() => {
    // Sin SW el reproductor sigue funcionando (degradación elegante).
  });
}

const URL_RE = /\.(mp4|webm|m4v|jpg|jpeg|png|webp)(\?|$)/i;

/** Extrae, de forma recursiva, todas las URLs de medios del manifiesto. */
export function collectMediaUrls(manifest: PlayerManifest): string[] {
  const urls = new Set<string>();
  const visit = (value: unknown) => {
    if (typeof value === "string") {
      if (
        value.startsWith("http") &&
        (URL_RE.test(value) || value.includes("/storage/v1/object/public/media/"))
      ) {
        urls.add(value);
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (value && typeof value === "object") {
      Object.values(value as Record<string, unknown>).forEach(visit);
    }
  };
  visit(manifest.items);
  return [...urls];
}

/** Pide al Service Worker que precargue una lista de medios. */
export function precacheMedia(urls: string[]): void {
  if (urls.length === 0) return;
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  navigator.serviceWorker.ready
    .then((reg) => reg.active?.postMessage({ type: "PRECACHE_MEDIA", urls }))
    .catch(() => {
      /* precarga best-effort */
    });
}
