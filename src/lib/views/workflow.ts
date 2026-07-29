import type { ContentStatus } from "@/lib/supabase/database.types";

/**
 * Flujo de aprobación de contenidos (sección 20 del prompt maestro):
 *
 *   BORRADOR → EN REVISIÓN → APROBADO → (PROGRAMADO → PUBLICADO → FINALIZADO)
 *                                     ↘ ARCHIVADO
 *
 * Aquí se definen, de forma pura, las transiciones permitidas y sus etiquetas.
 * Los permisos por rol los aplica RLS: un editor solo mueve borrador/en_revisión;
 * aprobar/archivar requiere rol de publicación.
 */

export interface StatusTransition {
  to: ContentStatus;
  label: string;
  /** Sugerencia de énfasis visual (no de seguridad). */
  emphasis?: "primary" | "danger";
}

const TRANSITIONS: Record<ContentStatus, StatusTransition[]> = {
  borrador: [{ to: "en_revision", label: "Enviar a revisión", emphasis: "primary" }],
  en_revision: [
    { to: "aprobado", label: "Aprobar", emphasis: "primary" },
    { to: "borrador", label: "Devolver a borrador" },
  ],
  aprobado: [
    { to: "en_revision", label: "Regresar a revisión" },
    { to: "archivado", label: "Archivar", emphasis: "danger" },
  ],
  programado: [{ to: "archivado", label: "Archivar", emphasis: "danger" }],
  publicado: [{ to: "finalizado", label: "Finalizar" }],
  finalizado: [{ to: "archivado", label: "Archivar", emphasis: "danger" }],
  archivado: [{ to: "borrador", label: "Restaurar a borrador" }],
};

/** Transiciones disponibles desde un estado. */
export function nextStatuses(current: ContentStatus): StatusTransition[] {
  return TRANSITIONS[current] ?? [];
}

/** Indica si una transición está permitida. */
export function canTransition(from: ContentStatus, to: ContentStatus): boolean {
  return nextStatuses(from).some((t) => t.to === to);
}

/** Estados cuyo contenido puede entrar en la playlist institucional. */
export const PLAYABLE_STATUSES: ContentStatus[] = ["aprobado", "publicado"];

const STATUS_LABELS: Record<ContentStatus, string> = {
  borrador: "Borrador",
  en_revision: "En revisión",
  aprobado: "Aprobado",
  programado: "Programado",
  publicado: "Publicado",
  finalizado: "Finalizado",
  archivado: "Archivado",
};

export function statusLabel(status: ContentStatus): string {
  return STATUS_LABELS[status] ?? status;
}
