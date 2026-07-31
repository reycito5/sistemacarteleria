export const MEDIA_CATEGORIES = [
  { id: "general", label: "Uso general" },
  { id: "programacion_general", label: "Programación general" },
  { id: "programa_destacado", label: "Programas destacados · afiches 4:5" },
  { id: "proximos_inicios", label: "Próximos inicios" },
  { id: "noticias", label: "Noticias y videos informativos" },
  { id: "agenda", label: "Agenda académica" },
  { id: "comunicado", label: "Comunicados" },
  { id: "bienvenida", label: "Bienvenida y orientación" },
  { id: "reconocimientos", label: "Reconocimientos" },
  { id: "evento_vivo", label: "Eventos y transmisiones" },
  { id: "testimonio", label: "Testimonios" },
  { id: "mensaje", label: "Mensajes institucionales" },
  { id: "homenaje", label: "Fechas especiales y homenajes" },
  { id: "galeria", label: "Galería institucional" },
] as const;

export type MediaCategory = (typeof MEDIA_CATEGORIES)[number]["id"];

const valid = new Set<string>(MEDIA_CATEGORIES.map((category) => category.id));

export function normalizeMediaCategory(value?: string | null): MediaCategory {
  return value && valid.has(value) ? (value as MediaCategory) : "general";
}

export function categoryFromStoragePath(path: string): MediaCategory {
  const match = /^plantillas\/([^/]+)\//.exec(path);
  return normalizeMediaCategory(match?.[1]);
}

export function categoryLabel(category: MediaCategory): string {
  return MEDIA_CATEGORIES.find((item) => item.id === category)?.label ?? "Uso general";
}
