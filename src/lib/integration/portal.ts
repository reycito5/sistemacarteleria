import { z } from "zod";
import {
  programaDestacadoSchema,
  programacionGeneralSchema,
  type ProgramaDestacadoContent,
  type ProgramacionGeneralContent,
} from "@/lib/views/schemas";

/**
 * Integración con el Portal de Oferta Académica (sección 23).
 *
 * El portal es la fuente principal de programas, modalidad, inicio, duración,
 * créditos, horas y contactos. Aquí se define el contrato normalizado y los
 * adaptadores que convierten un programa del portal en contenido institucional,
 * de modo que no haya que reescribir la información en la cartelería.
 */

/**
 * Estado de un programa tal como lo publica el portal.
 *
 *  - `abierta`   — inscripción abierta
 *  - `cerrada`   — inscripción cerrada
 *  - `ejecucion` — ya está en marcha
 *  - `proximo`   — anunciado, sin fecha de inscripción todavía
 */
export const PROGRAM_STATUSES = [
  "abierta",
  "cerrada",
  "ejecucion",
  "proximo",
] as const;
export type ProgramStatus = (typeof PROGRAM_STATUSES)[number];

export const portalProgramSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  /** Diplomado, Maestría, Especialidad, Doctorado… */
  level: z.string().default(""),
  /** Área de conocimiento: Educación, Ciencias Económicas… */
  area: z.string().default(""),
  modality: z.string().default(""),
  startDate: z.string().default(""),
  durationMonths: z.number().int().positive().nullish(),
  credits: z.number().int().positive().nullish(),
  hours: z.number().int().positive().nullish(),
  slogan: z.string().default(""),
  /** Imagen de portada del programa en el portal. */
  imageUrl: z.string().url().nullish(),
  enrollmentUrl: z.string().url().nullish(),
  status: z.enum(PROGRAM_STATUSES).default("abierta"),
  enrollmentOpen: z.boolean().default(true),
});

export type PortalProgram = z.infer<typeof portalProgramSchema>;

export const portalResponseSchema = z.object({
  programs: z.array(portalProgramSchema),
});

/* ==========================================================================
 * Normalización flexible
 * --------------------------------------------------------------------------
 * El portal puede publicar sus programas con nombres de campo distintos
 * (español o inglés) y devolver la lista suelta o envuelta. En lugar de exigir
 * un formato exacto, se aceptan las variantes habituales.
 * ======================================================================== */

/** Claves alternativas admitidas para cada campo del programa. */
const FIELD_ALIASES = {
  id: ["id", "slug", "codigo", "code", "_id"],
  name: ["name", "nombre", "titulo", "title", "programa", "program"],
  modality: ["modality", "modalidad", "mode"],
  startDate: [
    "startDate",
    "start_date",
    "inicio",
    "fechaInicio",
    "fecha_inicio",
    "start",
  ],
  durationMonths: [
    "durationMonths",
    "duration_months",
    "duracionMeses",
    "duracion_meses",
    "duracion",
    "duration",
    "meses",
  ],
  credits: ["credits", "creditos", "créditos"],
  hours: ["hours", "horas", "carga_horaria", "cargaHoraria"],
  slogan: ["slogan", "lema", "descripcion", "description", "resumen", "summary"],
  enrollmentUrl: [
    "enrollmentUrl",
    "enrollment_url",
    "inscripcionUrl",
    "urlInscripcion",
    "url",
    "link",
    "href",
  ],
  enrollmentOpen: [
    "enrollmentOpen",
    "enrollment_open",
    "inscripcionesAbiertas",
    "abierto",
    "activo",
    "active",
  ],
  level: ["level", "nivel", "tipo", "type", "grado", "categoria"],
  area: ["area", "área", "areaConocimiento", "facultad", "unidad", "category"],
  status: ["status", "estado", "situacion", "situación", "state"],
  imageUrl: ["imageUrl", "image", "imagen", "portada", "cover", "foto", "thumbnail"],
} as const;

type RawRecord = Record<string, unknown>;

function pick(raw: RawRecord, keys: readonly string[]): unknown {
  for (const key of keys) {
    const value = raw[key];
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return undefined;
}

function asText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

/** Extrae el primer número de un valor («18 meses» → 18). */
function asPositiveInt(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    const n = Math.trunc(value);
    return n > 0 ? n : null;
  }
  if (typeof value === "string") {
    const match = value.match(/\d+/);
    if (match) {
      const n = Number.parseInt(match[0], 10);
      return n > 0 ? n : null;
    }
  }
  return null;
}

function asBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (["true", "sí", "si", "abierto", "1", "activo"].includes(v)) return true;
    if (["false", "no", "cerrado", "0", "inactivo"].includes(v)) return false;
  }
  return fallback;
}

/**
 * Interpreta el estado del programa a partir del texto del portal
 * («Inscripción abierta», «En ejecución», «Inscripción cerrada»…).
 */
function asStatus(value: unknown, enrollmentOpen: boolean): ProgramStatus {
  const text = asText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

  if (text) {
    if (text.includes("ejecucion") || text.includes("curso")) return "ejecucion";
    if (text.includes("proxim")) return "proximo";
    if (text.includes("cerrad")) return "cerrada";
    if (text.includes("abiert")) return "abierta";
  }
  // Sin estado explícito, se deduce del indicador de inscripciones.
  return enrollmentOpen ? "abierta" : "cerrada";
}

function asAbsoluteUrl(value: unknown, base?: string): string | null {
  const text = asText(value);
  if (!text) return null;
  try {
    return new URL(text, base).toString();
  } catch {
    return null;
  }
}

/**
 * Convierte un registro cualquiera del portal en un `PortalProgram`.
 * Devuelve `null` si no tiene, al menos, un nombre reconocible.
 */
export function normalizeProgram(
  raw: unknown,
  index = 0,
  baseUrl?: string,
): PortalProgram | null {
  if (typeof raw !== "object" || raw === null) return null;
  const record = raw as RawRecord;

  const name = asText(pick(record, FIELD_ALIASES.name));
  if (!name) return null;

  const id =
    asText(pick(record, FIELD_ALIASES.id)) ||
    `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${index}`;

  const enrollmentOpen = asBoolean(
    pick(record, FIELD_ALIASES.enrollmentOpen),
    true,
  );
  const status = asStatus(pick(record, FIELD_ALIASES.status), enrollmentOpen);

  return {
    id,
    name,
    level: asText(pick(record, FIELD_ALIASES.level)),
    area: asText(pick(record, FIELD_ALIASES.area)),
    modality: asText(pick(record, FIELD_ALIASES.modality)),
    startDate: asText(pick(record, FIELD_ALIASES.startDate)),
    durationMonths: asPositiveInt(pick(record, FIELD_ALIASES.durationMonths)),
    credits: asPositiveInt(pick(record, FIELD_ALIASES.credits)),
    hours: asPositiveInt(pick(record, FIELD_ALIASES.hours)),
    slogan: asText(pick(record, FIELD_ALIASES.slogan)).slice(0, 160),
    imageUrl: asAbsoluteUrl(pick(record, FIELD_ALIASES.imageUrl), baseUrl),
    enrollmentUrl: asAbsoluteUrl(pick(record, FIELD_ALIASES.enrollmentUrl), baseUrl),
    status,
    // El estado explícito manda sobre el indicador suelto de inscripciones.
    enrollmentOpen: status === "abierta",
  };
}

/**
 * Localiza la lista de programas dentro de una respuesta JSON, sea cual sea su
 * envoltorio: array suelto, `{programs}`, `{data}`, `{items}`, `{results}` o
 * `{oferta}`.
 */
export function extractProgramList(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== "object" || payload === null) return null;

  const record = payload as RawRecord;
  const WRAPPERS = [
    "programs",
    "programas",
    "data",
    "items",
    "results",
    "oferta",
    "ofertas",
  ];
  for (const key of WRAPPERS) {
    const value = record[key];
    if (Array.isArray(value)) return value;
    // Envoltorio anidado: { data: { programs: [...] } }
    if (value && typeof value === "object") {
      const nested = extractProgramList(value);
      if (nested) return nested;
    }
  }
  return null;
}

/** Normaliza una respuesta completa del portal. */
export function normalizePortalPayload(
  payload: unknown,
  baseUrl?: string,
): PortalProgram[] {
  const list = extractProgramList(payload);
  if (!list) return [];
  return list
    .map((item, i) => normalizeProgram(item, i, baseUrl))
    .filter((p): p is PortalProgram => p !== null);
}

/**
 * Oferta de ejemplo (respaldo cuando no hay portal configurado).
 * Refleja la estructura real del portal de oferta académica.
 */
export const SAMPLE_PORTAL_PROGRAMS: PortalProgram[] = [
  {
    id: "dip-auditoria",
    name: "Diplomado en Auditoría y Control Gubernamental",
    level: "Diplomado",
    area: "Ciencias Económicas",
    modality: "Virtual",
    startDate: "1 de septiembre de 2025",
    durationMonths: 4,
    credits: null,
    hours: null,
    slogan: "",
    imageUrl: null,
    enrollmentUrl: null,
    status: "ejecucion",
    enrollmentOpen: false,
  },
  {
    id: "dip-tic-educacion",
    name: "Diplomado en TIC en la Educación Superior",
    level: "Diplomado",
    area: "Tecnología Educativa",
    modality: "Virtual",
    startDate: "10 de agosto de 2026",
    durationMonths: 4,
    credits: null,
    hours: null,
    slogan: "",
    imageUrl: null,
    enrollmentUrl: null,
    status: "cerrada",
    enrollmentOpen: false,
  },
  {
    id: "mae-edu-sup",
    name: "Maestría en Educación Superior",
    level: "Maestría",
    area: "Educación",
    modality: "Virtual",
    startDate: "17 de agosto de 2026",
    durationMonths: 18,
    credits: 80,
    hours: 3200,
    slogan: "Forma a los formadores del Beni",
    imageUrl: null,
    enrollmentUrl: null,
    status: "abierta",
    enrollmentOpen: true,
  },
  {
    id: "esp-gestion-universitaria",
    name: "Especialidad en Gestión Universitaria",
    level: "Especialidad",
    area: "Educación",
    modality: "Semipresencial",
    startDate: "24 de agosto de 2026",
    durationMonths: 10,
    credits: null,
    hours: null,
    slogan: "",
    imageUrl: null,
    enrollmentUrl: null,
    status: "abierta",
    enrollmentOpen: true,
  },
];

/** Etiqueta legible de cada estado, tal como se muestra en el portal. */
export const STATUS_LABEL: Record<ProgramStatus, string> = {
  abierta: "Inscripción abierta",
  cerrada: "Inscripción cerrada",
  ejecucion: "En ejecución",
  proximo: "Próximamente",
};

/** Convierte un programa del portal en la vista «Programa destacado». */
export function programToDestacado(
  program: PortalProgram,
): ProgramaDestacadoContent {
  const specs: { label: string; value: string }[] = [];
  if (program.modality) specs.push({ label: "Modalidad", value: program.modality });
  if (program.durationMonths)
    specs.push({ label: "Duración", value: `${program.durationMonths} meses` });
  if (program.credits)
    specs.push({ label: "Créditos", value: `${program.credits} créditos` });
  if (program.hours) specs.push({ label: "Horas", value: `${program.hours} horas` });
  if (program.startDate) specs.push({ label: "Inicio", value: program.startDate });
  if (program.area) specs.push({ label: "Área", value: program.area });

  return programaDestacadoSchema.parse({
    kind: "programa_destacado",
    // El nivel del programa encabeza la vista cuando el portal lo publica.
    badge: (program.level || "Programa destacado").toUpperCase(),
    programName: program.name,
    level: program.level,
    description: program.slogan,
    startDate: program.startDate,
    modality: program.modality,
    duration: program.durationMonths ? `${program.durationMonths} meses` : "",
    credits: program.credits ? `${program.credits} créditos` : "",
    hours: program.hours ? `${program.hours} horas académicas` : "",
    enrollmentOpen: program.enrollmentOpen,
    specs: specs.slice(0, 8),
    quote: program.slogan,
    qrCaption: program.enrollmentOpen ? "INSCRÍBETE AQUÍ" : "CONOCE EL PROGRAMA",
    strapline: "Programas de Posgrado para profesionales que lideran el cambio",
  });
}

/** Construye la vista «Programación general» con la oferta del portal. */
export function programsToOfertaGeneral(
  programs: readonly PortalProgram[],
): ProgramacionGeneralContent {
  return programacionGeneralSchema.parse({
    kind: "programacion_general",
    sectionTitle: "Oferta académica",
    headline: "Impulsa tu carrera profesional con un posgrado de la UABJB",
    programs: programs.slice(0, 4).map((p) => ({
      name: p.name,
      type: p.level,
      modality: p.modality,
      duration: p.durationMonths ? `${p.durationMonths} meses` : "",
      credits: p.credits ? `${p.credits} créditos` : "",
      dateShort: p.startDate,
      status: p.enrollmentOpen ? ("open" as const) : ("soon" as const),
    })),
    offers: programs.slice(0, 4).map((p) => ({
      title: p.name,
      modality: p.modality,
      start: p.startDate,
    })),
    strapline: "Conocimiento que transforma el desarrollo del Beni",
  });
}
