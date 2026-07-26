import type { ViewContent } from "@/lib/views/schemas";

/**
 * Registro que relaciona cada tipo de contenido de vista con su plantilla
 * institucional (view_number) y una etiqueta legible. Fuente única para el
 * panel y la creación de contenidos.
 */
export interface ViewKindMeta {
  kind: ViewContent["kind"];
  viewNumber: number;
  label: string;
}

export const VIEW_REGISTRY: readonly ViewKindMeta[] = [
  { kind: "programacion_general", viewNumber: 1, label: "Programación general" },
  { kind: "agenda", viewNumber: 2, label: "Agenda académica" },
  { kind: "programa_destacado", viewNumber: 3, label: "Programa destacado" },
  { kind: "noticias", viewNumber: 4, label: "Noticias y logros" },
  { kind: "comunicado", viewNumber: 5, label: "Comunicado importante" },
  { kind: "sincronizacion", viewNumber: 14, label: "Sincronización" },
  { kind: "emergencia", viewNumber: 16, label: "Emergencia institucional" },
];

export function viewNumberForKind(kind: ViewContent["kind"]): number | null {
  return VIEW_REGISTRY.find((v) => v.kind === kind)?.viewNumber ?? null;
}

export function labelForKind(kind: ViewContent["kind"]): string {
  return VIEW_REGISTRY.find((v) => v.kind === kind)?.label ?? kind;
}
