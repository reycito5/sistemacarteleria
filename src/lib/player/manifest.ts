import {
  viewContentSchema,
  type EmergenciaContent,
  type ViewContent,
} from "@/lib/views/schemas";

/**
 * Manifiesto del reproductor (Fase 7).
 *
 * Es el ÚNICO contrato entre el servidor y las pantallas. Contiene todo lo
 * necesario para reproducir la programación institucional de forma autónoma:
 * elementos resueltos, duraciones, hora oficial de inicio y, si procede, la
 * emergencia activa (prioridad absoluta). Se cachea localmente para funcionar
 * sin Internet.
 */

export interface PlayerManifestItem {
  /** Identificador del elemento de playlist */
  id: string;
  contentItemId: string;
  durationSeconds: number;
  muted: boolean;
  /** Contenido ya resuelto y listo para render */
  content: ViewContent;
}

export interface PlayerManifest {
  playlistId: string;
  version: number;
  /** Hora oficial de inicio (epoch ms) para el cálculo de sincronización */
  officialStartAt: number;
  items: PlayerManifestItem[];
  /** Emergencia activa con prioridad absoluta, o null */
  emergency: EmergenciaContent | null;
  /** Momento de generación del manifiesto (epoch ms) */
  generatedAt: number;
}

/** Fila mínima de playlist necesaria para construir el manifiesto. */
export interface PlaylistLike {
  id: string;
  version: number;
  official_start_at: string | null;
}

/** Fila mínima de un item de playlist con su contenido embebido. */
export interface PlaylistItemLike {
  id: string;
  content_item_id: string;
  duration_seconds: number;
  muted: boolean;
  content_data: unknown;
}

/**
 * Construye un manifiesto a partir de los datos crudos de la base. Descarta de
 * forma segura los items cuyo contenido no supere la validación (nunca rompe la
 * programación completa por un elemento dañado).
 */
export function buildManifest(
  playlist: PlaylistLike,
  rawItems: readonly PlaylistItemLike[],
  emergency: EmergenciaContent | null = null,
  now: number = Date.now(),
): PlayerManifest {
  const items: PlayerManifestItem[] = [];

  for (const raw of rawItems) {
    const parsed = viewContentSchema.safeParse(raw.content_data);
    if (!parsed.success) continue; // salta contenido inválido
    items.push({
      id: raw.id,
      contentItemId: raw.content_item_id,
      durationSeconds: Math.max(1, Math.round(raw.duration_seconds)),
      muted: raw.muted,
      content: parsed.data,
    });
  }

  const officialStartAt = playlist.official_start_at
    ? Date.parse(playlist.official_start_at)
    : startOfUtcDay(now);

  return {
    playlistId: playlist.id,
    version: playlist.version,
    officialStartAt,
    items,
    emergency,
    generatedAt: now,
  };
}

/**
 * Construye un manifiesto sintético a partir de contenidos ya resueltos. Se usa
 * como respaldo (sección 28) y para la demostración cuando aún no hay una
 * playlist publicada, de modo que el reproductor consume siempre la misma forma.
 */
export function manifestFromViews(
  views: readonly ViewContent[],
  itemSeconds = 12,
  now: number = Date.now(),
): PlayerManifest {
  return {
    playlistId: "demo",
    version: 0,
    officialStartAt: startOfUtcDay(now),
    items: views.map((content, i) => ({
      id: `demo-${i}`,
      contentItemId: `demo-${i}`,
      durationSeconds: itemSeconds,
      muted: true,
      content,
    })),
    emergency: null,
    generatedAt: now,
  };
}

/** Inicio del día UTC: hora oficial estable e idéntica en todos los equipos. */
export function startOfUtcDay(now: number): number {
  const d = new Date(now);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
