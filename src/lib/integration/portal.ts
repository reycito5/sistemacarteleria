import { z } from "zod";
import type {
  ProgramaDestacadoContent,
  ProgramacionGeneralContent,
} from "@/lib/views/schemas";

/**
 * Integración con el Portal de Oferta Académica (sección 23).
 *
 * El portal es la fuente principal de programas, modalidad, inicio, duración,
 * créditos, horas y contactos. Aquí se define el contrato normalizado y los
 * adaptadores que convierten un programa del portal en contenido institucional,
 * de modo que no haya que reescribir la información en la cartelería.
 */

export const portalProgramSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  modality: z.string().default(""),
  startDate: z.string().default(""),
  durationMonths: z.number().int().positive().nullish(),
  credits: z.number().int().positive().nullish(),
  hours: z.number().int().positive().nullish(),
  slogan: z.string().default(""),
  enrollmentUrl: z.string().url().nullish(),
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

  return {
    id,
    name,
    modality: asText(pick(record, FIELD_ALIASES.modality)),
    startDate: asText(pick(record, FIELD_ALIASES.startDate)),
    durationMonths: asPositiveInt(pick(record, FIELD_ALIASES.durationMonths)),
    credits: asPositiveInt(pick(record, FIELD_ALIASES.credits)),
    hours: asPositiveInt(pick(record, FIELD_ALIASES.hours)),
    slogan: asText(pick(record, FIELD_ALIASES.slogan)).slice(0, 160),
    enrollmentUrl: asAbsoluteUrl(pick(record, FIELD_ALIASES.enrollmentUrl), baseUrl),
    enrollmentOpen: asBoolean(pick(record, FIELD_ALIASES.enrollmentOpen), true),
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

/** Oferta de ejemplo (respaldo cuando no hay portal configurado). */
export const SAMPLE_PORTAL_PROGRAMS: PortalProgram[] = [
  {
    id: "mae-edu-sup",
    name: "Maestría en Educación Superior",
    modality: "Virtual",
    startDate: "31/07/2026",
    durationMonths: 18,
    credits: 80,
    hours: 3200,
    slogan: "Forma a los formadores del Beni",
    enrollmentUrl: "https://posgrado.uabjb.edu.bo/inscripcion",
    enrollmentOpen: true,
  },
  {
    id: "dip-ia",
    name: "Diplomado en Inteligencia Artificial",
    modality: "Virtual",
    startDate: "10/08/2026",
    durationMonths: 5,
    credits: 20,
    hours: 800,
    slogan: "Transforma datos en decisiones inteligentes",
    enrollmentUrl: "https://posgrado.uabjb.edu.bo/inscripcion",
    enrollmentOpen: true,
  },
  {
    id: "dip-plataformas",
    name: "Diplomado en Manejo y Administración de Plataformas Virtuales",
    modality: "Virtual",
    startDate: "28/08/2026",
    durationMonths: 5,
    credits: 20,
    hours: 800,
    slogan: "Lidera la educación digital",
    enrollmentUrl: "https://posgrado.uabjb.edu.bo/inscripcion",
    enrollmentOpen: true,
  },
];

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

  return {
    kind: "programa_destacado",
    badge: "PROGRAMA DESTACADO",
    programName: program.name,
    specs: specs.slice(0, 6),
    quote: program.slogan,
    qrCaption: program.enrollmentOpen ? "INSCRÍBETE AQUÍ" : "CONOCE EL PROGRAMA",
    strapline: "Programas de Posgrado para profesionales que lideran el cambio",
  };
}

/** Construye la vista «Programación general» con la oferta del portal. */
export function programsToOfertaGeneral(
  programs: readonly PortalProgram[],
): ProgramacionGeneralContent {
  return {
    kind: "programacion_general",
    sectionTitle: "OFERTA ACADÉMICA",
    offers: programs.slice(0, 4).map((p) => ({
      title: p.name,
      modality: p.modality,
      start: p.startDate,
    })),
    nextLabel: "A CONTINUACIÓN",
    strapline: "Conocimiento que transforma el desarrollo del Beni",
  };
}
