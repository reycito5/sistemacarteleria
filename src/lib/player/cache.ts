import type { PlayerManifest } from "./manifest";

/**
 * Caché local del manifiesto (Fase 7 — funcionamiento sin Internet).
 *
 * Guarda el manifiesto activo y conserva el anterior como respaldo, siguiendo
 * las reglas de seguridad de la sección 17: no dejar nunca la pantalla sin
 * contenido y mantener una versión anterior funcional.
 */
const ACTIVE_KEY = "sicd.manifest.active";
const PREVIOUS_KEY = "sicd.manifest.previous";

export function saveManifest(manifest: PlayerManifest): void {
  if (typeof window === "undefined") return;
  try {
    const current = window.localStorage.getItem(ACTIVE_KEY);
    if (current) window.localStorage.setItem(PREVIOUS_KEY, current);
    window.localStorage.setItem(ACTIVE_KEY, JSON.stringify(manifest));
  } catch {
    // Almacenamiento lleno o no disponible: se ignora de forma segura.
  }
}

export function loadCachedManifest(): PlayerManifest | null {
  if (typeof window === "undefined") return null;
  for (const key of [ACTIVE_KEY, PREVIOUS_KEY]) {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as PlayerManifest;
    } catch {
      // Continúa con el respaldo anterior.
    }
  }
  return null;
}
