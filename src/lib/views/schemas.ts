import { z } from "zod";

/**
 * Esquemas de contenido editable por vista (Zod).
 *
 * Definen QUÉ puede editar el administrador dentro de cada plantilla (títulos,
 * textos, fechas, listas, QR...). La línea gráfica (cabecera, pie, colores,
 * tipografía) NO forma parte de estos esquemas: está bloqueada.
 */

export const mediaRefSchema = z.object({
  assetId: z.string().uuid().optional(),
  /** Ruta en Storage; se firma en el servidor al construir el manifiesto */
  path: z.string().optional(),
  /** URL directa o firmada, resuelta en tiempo de render */
  src: z.string().optional(),
  poster: z.string().optional(),
  /** Ruta y URL firmada de los subtítulos (VTT) */
  subtitlePath: z.string().optional(),
  subtitleSrc: z.string().optional(),
  /**
   * Silenciado. Campo histórico: por defecto `true`. Se conserva por
   * compatibilidad con el contenido ya guardado, pero la cartelería ahora
   * reproduce con sonido salvo que se marque `silent`.
   */
  muted: z.boolean().default(true),
  /**
   * Silencio explícito del contenido. Si es `true`, este video se reproduce
   * sin sonido aunque la cartelería vaya con audio por defecto.
   */
  silent: z.boolean().optional(),
});
export type MediaRef = z.infer<typeof mediaRefSchema>;

function secondsSchema(defaultSeconds: number, min = 4, max = 120) {
  return z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().min(min).max(max).default(defaultSeconds),
  );
}

const displaySecondsSchema = (defaultSeconds: number) =>
  secondsSchema(defaultSeconds);

export const offerItemSchema = z.object({
  title: z.string().min(1),
  modality: z.string().default(""),
  start: z.string().default(""),
});

export const agendaItemSchema = z.object({
  title: z.string().min(1),
  date: z.string().default(""),
  time: z.string().default(""),
  place: z.string().default(""),
  /** Estado de la actividad; pinta el distintivo de la derecha. */
  status: z.enum(["proxima", "en_curso", "finalizada"]).default("proxima"),
  imageSrc: z.string().optional(),
});

export const newsItemSchema = z.object({
  date: z.string().default(""),
  tag: z.string().default(""),
  headline: z.string().min(1),
});

export const specSchema = z.object({
  label: z.string(),
  value: z.string(),
});

/** Métrica destacada de un bloque de estadísticas. */
export const statSchema = z.object({
  value: z.string().min(1),
  label: z.string().default(""),
});

/**
 * Programa mostrado dentro de un listado o rejilla. Cada uno admite su propio
 * video o imagen, de modo que la miniatura no tiene por qué ser una foto.
 */
export const programEntrySchema = z.object({
  name: z.string().min(1),
  type: z.string().default(""),
  version: z.string().default(""),
  modality: z.string().default(""),
  duration: z.string().default(""),
  credits: z.string().default(""),
  dateShort: z.string().default(""),
  status: z.enum(["open", "soon"]).default("open"),
  displaySeconds: displaySecondsSchema(10),
  media: mediaRefSchema.optional(),
});

/** Elemento de noticias: artículo o video, con su propia portada. */
export const newsEntrySchema = z.object({
  title: z.string().min(1),
  meta: z.string().default(""),
  kind: z.enum(["noticia", "video"]).default("noticia"),
  duration: z.string().default(""),
  /** Tiempo visible para una noticia con imagen; un video usa su fin real. */
  displaySeconds: displaySecondsSchema(12),
  /** Respaldo si el navegador o el archivo nunca notifican el final real. */
  maxVideoSeconds: secondsSchema(900, 15, 7200),
  media: mediaRefSchema.optional(),
});

/** Vista 1 — Programación general */
export const programacionGeneralSchema = z.object({
  kind: z.literal("programacion_general"),
  sectionTitle: z.string().default("Oferta académica"),
  cardEyebrow: z.string().default("Vicerrectorado"),
  /** Titular sobre el panel de video o imagen. */
  headline: z.string().default(""),
  headlineEyebrow: z.string().default("Oferta de posgrado"),
  subheadline: z.string().default(""),
  media: mediaRefSchema.optional(),
  /** Fichas completas (con su propio medio). Es la vía recomendada. */
  programs: z.array(programEntrySchema).max(12).default([]),
  /** Formato antiguo y simple; se usa si `programs` está vacío. */
  offers: z.array(offerItemSchema).max(12).default([]),
  nextLabel: z.string().default(""),
  nextThumb: z.string().optional(),
  qrCaption: z.string().default("Explorar oferta completa"),
  /** Dirección que codifica el QR. Vacío: no se dibuja el código. */
  qrUrl: z.string().default(""),
  strapline: z.string().default(""),
});

/** Vista 2 / 8 — Agenda académica / Actividades del día */
export const agendaSchema = z.object({
  kind: z.literal("agenda"),
  sectionTitle: z.string().default("Agenda de la semana"),
  badge: z.string().default("Actividades"),
  headline: z.string().default("Actividades y defensas de esta semana"),
  headlineEyebrow: z.string().default("Semana académica"),
  subheadline: z.string().default(""),
  media: mediaRefSchema.optional(),
  items: z.array(agendaItemSchema).max(12).default([]),
  nextLabel: z.string().default(""),
  strapline: z.string().default(""),
});

/** Vista 3 — Programa destacado */
export const programaDestacadoSchema = z.object({
  kind: z.literal("programa_destacado"),
  badge: z.string().default("PROGRAMA DESTACADO"),
  programName: z.string().min(1),
  /** Nivel: Maestría, Especialidad, Diplomado, Doctorado… */
  level: z.string().default(""),
  version: z.string().default(""),
  parallel: z.string().default(""),
  description: z.string().default(""),
  media: mediaRefSchema.optional(),
  /* Ficha del programa: cada campo alimenta una casilla de la rejilla. */
  startDate: z.string().default(""),
  modality: z.string().default(""),
  duration: z.string().default(""),
  credits: z.string().default(""),
  hours: z.string().default(""),
  phones: z.string().default(""),
  audience: z.string().default(""),
  address: z.string().default(""),
  enrollmentOpen: z.boolean().default(true),
  /** Formato antiguo; se usa si no se llenó ningún campo de la ficha. */
  specs: z.array(specSchema).max(8).default([]),
  quote: z.string().default(""),
  qrCaption: z.string().default("Ver ficha completa e inscribirse"),
  /** Dirección que codifica el QR. Vacío: no se dibuja el código. */
  qrUrl: z.string().default(""),
  strapline: z.string().default(""),
});

/** Vista 4 / 9 — Noticias y logros / Reconocimientos */
export const noticiasSchema = z.object({
  kind: z.literal("noticias"),
  title: z.string().default("Noticias y logros"),
  badge: z.string().default("Institucional"),
  headline: z.string().default(""),
  headlineEyebrow: z.string().default("Titular institucional"),
  subheadline: z.string().default(""),
  media: mediaRefSchema.optional(),
  /** Entradas con portada propia; admiten artículo o video. */
  entries: z.array(newsEntrySchema).max(12).default([]),
  /** Formato antiguo; se usa si `entries` está vacío. */
  items: z.array(newsItemSchema).max(12).default([]),
  stats: z.array(statSchema).max(2).default([]),
  bigStat: z.string().default(""),
  bigStatLabel: z.string().default(""),
  strapline: z.string().default(""),
});

/** Vista 5 — Comunicado importante */
export const comunicadoSchema = z.object({
  kind: z.literal("comunicado"),
  badge: z.string().default("Comunicado importante"),
  title: z.string().min(1),
  subtitle: z.string().default(""),
  /** Cuerpo explicativo del comunicado. */
  body: z.string().default(""),
  highlight: z.string().default(""),
  media: mediaRefSchema.optional(),
  mediaEyebrow: z.string().default("Vicerrectorado"),
  mediaTitle: z.string().default(""),
  mediaSub: z.string().default(""),
  /** Filas de datos: fecha, horario, área responsable, contacto… */
  specs: z.array(specSchema).max(6).default([]),
  qrCaption: z.string().default(""),
  /** Dirección que codifica el QR. Vacío: no se dibuja el código. */
  qrUrl: z.string().default(""),
  imageSrc: z.string().optional(),
});

/** Vista 7 — Bienvenida y orientación */
export const bienvenidaSchema = z.object({
  kind: z.literal("bienvenida"),
  title: z.string().default("BIENVENIDOS AL POSGRADO"),
  subtitle: z.string().default(""),
  media: mediaRefSchema.optional(),
  locations: z
    .array(z.object({ label: z.string(), place: z.string().default("") }))
    .max(12)
    .default([]),
  qrCaption: z.string().default("Mapa del edificio"),
  qrUrl: z.string().default(""),
  strapline: z.string().default(""),
});

/** Vista 9 — Reconocimientos */
export const reconocimientosSchema = z.object({
  kind: z.literal("reconocimientos"),
  title: z.string().default("RECONOCIMIENTOS"),
  badge: z.string().default("ORGULLO INSTITUCIONAL"),
  media: mediaRefSchema.optional(),
  items: z
    .array(
      z.object({
        name: z.string().min(1),
        role: z.string().default(""),
        detail: z.string().default(""),
      }),
    )
    .max(12)
    .default([]),
  strapline: z.string().default(""),
});

/** Vista 10 — Transmisión o evento en vivo */
export const eventoVivoSchema = z.object({
  kind: z.literal("evento_vivo"),
  badge: z.string().default("EN VIVO"),
  title: z.string().min(1),
  eventType: z.string().default("Transmisión institucional"),
  speaker: z.string().default(""),
  dateLabel: z.string().default(""),
  timeLabel: z.string().default(""),
  place: z.string().default(""),
  /** YouTube Live, YouTube, Vimeo o un archivo MP4/WebM directo. */
  streamUrl: z.string().default(""),
  media: mediaRefSchema.optional(),
  schedule: z
    .array(z.object({ time: z.string().default(""), label: z.string() }))
    .max(12)
    .default([]),
  qrCaption: z.string().default("SÍGUELO EN LÍNEA"),
  /** Dirección que codifica el QR. Vacío: no se dibuja el código. */
  qrUrl: z.string().default(""),
});

/** Vista 11 — Testimonios */
export const testimonioSchema = z.object({
  kind: z.literal("testimonio"),
  media: mediaRefSchema.optional(),
  name: z.string().min(1),
  program: z.string().default(""),
  quote: z.string().default(""),
  result: z.string().default(""),
  strapline: z.string().default(""),
});

/** Vista 12 — Mensaje institucional */
export const mensajeSchema = z.object({
  kind: z.literal("mensaje"),
  authority: z.string().default("Vicerrectorado de Posgrado"),
  name: z.string().min(1),
  media: mediaRefSchema.optional(),
  message: z.string().default(""),
  quote: z.string().default(""),
  qrCaption: z.string().default("Conoce el mensaje completo"),
  qrUrl: z.string().default(""),
});

/** Vista 18 — Fechas especiales, homenajes y saludos institucionales. */
export const homenajeSchema = z.object({
  kind: z.literal("homenaje"),
  occasion: z.string().default("Fecha especial"),
  title: z.string().min(1),
  message: z.string().default(""),
  authority: z.string().default("Vicerrectorado de Posgrado"),
  name: z.string().default(""),
  media: mediaRefSchema.optional(),
  badge: z.string().default("Homenaje institucional"),
  quote: z.string().default(""),
  qrCaption: z.string().default(""),
  qrUrl: z.string().default(""),
});

/** Vista 6 — Próximos inicios de gestión */
export const proximosIniciosSchema = z.object({
  kind: z.literal("proximos_inicios"),
  sectionTitle: z.string().default("Próximos inicios de gestión"),
  eyebrow: z.string().default("Calendario académico"),
  programs: z.array(programEntrySchema).max(12).default([]),
  qrTitle: z.string().default("Inscríbete ahora"),
  qrCaption: z.string().default("Inscripciones"),
  /** Dirección que codifica el QR. Vacío: no se dibuja el código. */
  qrUrl: z.string().default(""),
  qrNote: z.string().default(""),
});

/** Vista 15 — Mantenimiento programado (técnica, pero con datos editables) */
export const mantenimientoSchema = z.object({
  kind: z.literal("mantenimiento"),
  title: z.string().default("Mantenimiento programado"),
  message: z
    .string()
    .default(
      "El sistema de cartelería digital se actualizará en el horario indicado. La programación se reanudará automáticamente al finalizar.",
    ),
  startAt: z.string().default(""),
  duration: z.string().default(""),
  scope: z.string().default(""),
  supportContact: z.string().default(""),
});

/** Vista 13 — Sin conexión (técnica) */
export const sinConexionSchema = z.object({
  kind: z.literal("sin_conexion"),
  lastSync: z.string().default(""),
});

/** Vista 14 — Sincronización (técnica) */
export const sincronizacionSchema = z.object({
  kind: z.literal("sincronizacion"),
  steps: z
    .array(z.string())
    .default([
      "Descargando contenidos",
      "Verificando videos",
      "Actualizando agenda",
      "Sincronizando programación",
    ]),
});

/** Vista 16 — Emergencia institucional */
export const emergenciaSchema = z.object({
  kind: z.literal("emergencia"),
  title: z.string().min(1),
  message: z.string().default(""),
  instructions: z.string().default(""),
});

/** Vista — Galería institucional (álbum curado con efectos cinematográficos). */
export const galeriaImageSchema = z.object({
  media: mediaRefSchema.optional(),
  caption: z.string().default(""),
});

export const galeriaSchema = z.object({
  kind: z.literal("galeria"),
  title: z.string().default("Galería institucional"),
  images: z.array(galeriaImageSchema).max(12).default([]),
  /** Segundos por imagen. */
  seconds: z.number().min(3).max(20).default(7),
});

export const viewContentSchema = z.discriminatedUnion("kind", [
  programacionGeneralSchema,
  galeriaSchema,
  agendaSchema,
  programaDestacadoSchema,
  noticiasSchema,
  comunicadoSchema,
  proximosIniciosSchema,
  bienvenidaSchema,
  reconocimientosSchema,
  eventoVivoSchema,
  testimonioSchema,
  mensajeSchema,
  homenajeSchema,
  sincronizacionSchema,
  sinConexionSchema,
  mantenimientoSchema,
  emergenciaSchema,
]);

export type ViewContent = z.infer<typeof viewContentSchema>;

/**
 * Contenido tal como se ESCRIBE (antes de aplicar los valores por defecto).
 * Es el tipo que deben usar los literales del código —ejemplos, adaptadores,
 * pruebas— para no tener que repetir cada campo opcional.
 */
export type ViewContentInput = z.input<typeof viewContentSchema>;
export type ProgramacionGeneralContent = z.infer<
  typeof programacionGeneralSchema
>;
export type AgendaContent = z.infer<typeof agendaSchema>;
export type ProgramaDestacadoContent = z.infer<typeof programaDestacadoSchema>;
export type NoticiasContent = z.infer<typeof noticiasSchema>;
export type ComunicadoContent = z.infer<typeof comunicadoSchema>;
export type BienvenidaContent = z.infer<typeof bienvenidaSchema>;
export type ReconocimientosContent = z.infer<typeof reconocimientosSchema>;
export type EventoVivoContent = z.infer<typeof eventoVivoSchema>;
export type TestimonioContent = z.infer<typeof testimonioSchema>;
export type MensajeContent = z.infer<typeof mensajeSchema>;
export type HomenajeContent = z.infer<typeof homenajeSchema>;
export type ProximosIniciosContent = z.infer<typeof proximosIniciosSchema>;
export type MantenimientoContent = z.infer<typeof mantenimientoSchema>;
export type GaleriaContent = z.infer<typeof galeriaSchema>;
export type SinConexionContent = z.infer<typeof sinConexionSchema>;
export type SincronizacionContent = z.infer<typeof sincronizacionSchema>;
export type EmergenciaContent = z.infer<typeof emergenciaSchema>;
