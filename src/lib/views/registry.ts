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
  { kind: "proximos_inicios", viewNumber: 6, label: "Próximos inicios" },
  { kind: "bienvenida", viewNumber: 7, label: "Bienvenida y orientación" },
  { kind: "reconocimientos", viewNumber: 9, label: "Reconocimientos" },
  { kind: "evento_vivo", viewNumber: 10, label: "Transmisión o evento en vivo" },
  { kind: "testimonio", viewNumber: 11, label: "Testimonios" },
  { kind: "mensaje", viewNumber: 12, label: "Mensaje institucional" },
  { kind: "sin_conexion", viewNumber: 13, label: "Sin conexión" },
  { kind: "sincronizacion", viewNumber: 14, label: "Sincronización" },
  { kind: "mantenimiento", viewNumber: 15, label: "Mantenimiento" },
  { kind: "emergencia", viewNumber: 16, label: "Emergencia institucional" },
  { kind: "galeria", viewNumber: 17, label: "Galería institucional" },
  { kind: "homenaje", viewNumber: 18, label: "Fecha especial u homenaje" },
];

export function viewNumberForKind(kind: ViewContent["kind"]): number | null {
  return VIEW_REGISTRY.find((v) => v.kind === kind)?.viewNumber ?? null;
}

export function labelForKind(kind: ViewContent["kind"]): string {
  return VIEW_REGISTRY.find((v) => v.kind === kind)?.label ?? kind;
}
