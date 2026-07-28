/**
 * ============================================================================
 * PARA COPIAR AL PROYECTO DEL PORTAL DE OFERTA, NO A ESTE REPOSITORIO
 * ----------------------------------------------------------------------------
 * Destino: `app/api/programas/route.ts` del portal (ofertaposgrado).
 *
 * Publica la oferta académica en JSON para que el sistema de cartelería la lea
 * sin depender del maquetado de la página. Una vez desplegada, basta con que
 * la cartelería tenga configurado:
 *
 *     OFERTA_PORTAL_URL=https://ofertaposgrado.vercel.app
 *
 * Guía completa: docs/portal-oferta.md
 * ============================================================================
 */

import { NextResponse } from "next/server";

/** Un programa tal como lo espera la cartelería. Sólo `nombre` es obligatorio. */
interface ProgramaPublicado {
  id: string;
  nombre: string;
  /** Diplomado, Maestría, Especialidad, Doctorado… */
  nivel?: string;
  /** Área de conocimiento: Educación, Ciencias Económicas… */
  area?: string;
  /** Virtual, Presencial, Semipresencial. */
  modalidad?: string;
  /** «Inscripción abierta», «Inscripción cerrada», «En ejecución», «Próximamente». */
  estado?: string;
  /** Texto libre: se muestra tal cual. Ej: «17 de agosto de 2026». */
  inicio?: string;
  /** Número de meses. Admite texto: «18 meses» también se entiende. */
  duracion?: number | string;
  creditos?: number;
  horas?: number;
  descripcion?: string;
  /** Portada del programa. Admite ruta relativa. */
  imagen?: string;
  /** Ficha o inscripción. Admite ruta relativa. */
  url?: string;
}

// TODO: sustituir por la consulta real a la base de datos o al CMS del portal.
const PROGRAMAS: ProgramaPublicado[] = [
  {
    id: "dip-auditoria",
    nombre: "Diplomado en Auditoría y Control Gubernamental",
    nivel: "Diplomado",
    area: "Ciencias Económicas",
    modalidad: "Virtual",
    estado: "En ejecución",
    inicio: "1 de septiembre de 2025",
    duracion: 4,
    imagen: "/img/programas/auditoria.jpg",
    url: "/oferta/diplomado-en-auditoria",
  },
  {
    id: "dip-tic-educacion",
    nombre: "Diplomado en TIC en la Educación Superior",
    nivel: "Diplomado",
    area: "Tecnología Educativa",
    modalidad: "Virtual",
    estado: "Inscripción cerrada",
    inicio: "10 de agosto de 2026",
    duracion: 4,
    imagen: "/img/programas/tic.jpg",
    url: "/oferta/diplomado-en-tic",
  },
  {
    id: "mae-edu-sup",
    nombre: "Maestría en Educación Superior",
    nivel: "Maestría",
    area: "Educación",
    modalidad: "Virtual",
    estado: "Inscripción abierta",
    inicio: "17 de agosto de 2026",
    duracion: 18,
    creditos: 80,
    horas: 3200,
    descripcion: "Forma a los formadores del Beni",
    imagen: "/img/programas/maestria-educacion.jpg",
    url: "/oferta/maestria-en-educacion-superior",
  },
  {
    id: "esp-gestion-universitaria",
    nombre: "Especialidad en Gestión Universitaria",
    nivel: "Especialidad",
    area: "Educación",
    modalidad: "Semipresencial",
    estado: "Inscripción abierta",
    inicio: "24 de agosto de 2026",
    duracion: 10,
    imagen: "/img/programas/gestion-universitaria.jpg",
    url: "/oferta/especialidad-en-gestion-universitaria",
  },
];

export async function GET() {
  return NextResponse.json(
    { programas: PROGRAMAS },
    {
      headers: {
        // La cartelería vive en otro dominio y lee esta ruta desde el servidor.
        "access-control-allow-origin": "*",
        // Sin caché: el panel consulta la oferta en cada carga.
        "cache-control": "no-store",
      },
    },
  );
}
