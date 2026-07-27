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
  muted: z.boolean().default(true),
});
export type MediaRef = z.infer<typeof mediaRefSchema>;

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

/** Vista 1 — Programación general */
export const programacionGeneralSchema = z.object({
  kind: z.literal("programacion_general"),
  sectionTitle: z.string().default("OFERTA ACADÉMICA"),
  media: mediaRefSchema.optional(),
  offers: z.array(offerItemSchema).max(4).default([]),
  nextLabel: z.string().default("A CONTINUACIÓN"),
  nextThumb: z.string().optional(),
  strapline: z.string().default(""),
});

/** Vista 2 / 8 — Agenda académica / Actividades del día */
export const agendaSchema = z.object({
  kind: z.literal("agenda"),
  sectionTitle: z.string().default("AGENDA ACADÉMICA"),
  badge: z.string().default("ACTIVIDADES DE ESTA SEMANA"),
  media: mediaRefSchema.optional(),
  items: z.array(agendaItemSchema).max(3).default([]),
  strapline: z.string().default(""),
});

/** Vista 3 — Programa destacado */
export const programaDestacadoSchema = z.object({
  kind: z.literal("programa_destacado"),
  badge: z.string().default("PROGRAMA DESTACADO"),
  programName: z.string().min(1),
  media: mediaRefSchema.optional(),
  specs: z.array(specSchema).max(6).default([]),
  quote: z.string().default(""),
  qrCaption: z.string().default("CONOCE EL PROGRAMA"),
  strapline: z.string().default(""),
});

/** Vista 4 / 9 — Noticias y logros / Reconocimientos */
export const noticiasSchema = z.object({
  kind: z.literal("noticias"),
  title: z.string().default("NOTICIAS Y LOGROS DE POSGRADO"),
  badge: z.string().default("ACREDITACIÓN INTERNACIONAL"),
  media: mediaRefSchema.optional(),
  items: z.array(newsItemSchema).max(3).default([]),
  bigStat: z.string().default(""),
  bigStatLabel: z.string().default(""),
  strapline: z.string().default(""),
});

/** Vista 5 — Comunicado importante */
export const comunicadoSchema = z.object({
  kind: z.literal("comunicado"),
  badge: z.string().default("COMUNICADO IMPORTANTE"),
  title: z.string().min(1),
  subtitle: z.string().default(""),
  highlight: z.string().default(""),
  specs: z.array(specSchema).max(3).default([]),
  qrCaption: z.string().default("INSCRÍBETE AQUÍ"),
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
    .max(6)
    .default([]),
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
    .max(4)
    .default([]),
  strapline: z.string().default(""),
});

/** Vista 10 — Transmisión o evento en vivo */
export const eventoVivoSchema = z.object({
  kind: z.literal("evento_vivo"),
  badge: z.string().default("EN VIVO"),
  title: z.string().min(1),
  speaker: z.string().default(""),
  media: mediaRefSchema.optional(),
  schedule: z
    .array(z.object({ time: z.string().default(""), label: z.string() }))
    .max(4)
    .default([]),
  qrCaption: z.string().default("SÍGUELO EN LÍNEA"),
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

export const viewContentSchema = z.discriminatedUnion("kind", [
  programacionGeneralSchema,
  agendaSchema,
  programaDestacadoSchema,
  noticiasSchema,
  comunicadoSchema,
  bienvenidaSchema,
  reconocimientosSchema,
  eventoVivoSchema,
  testimonioSchema,
  mensajeSchema,
  sincronizacionSchema,
  emergenciaSchema,
]);

export type ViewContent = z.infer<typeof viewContentSchema>;
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
export type SincronizacionContent = z.infer<typeof sincronizacionSchema>;
export type EmergenciaContent = z.infer<typeof emergenciaSchema>;
