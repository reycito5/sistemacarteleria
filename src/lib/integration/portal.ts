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
