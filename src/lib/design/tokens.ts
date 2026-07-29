/**
 * Línea gráfica institucional V12 — tokens de identidad.
 *
 * Fuente única de verdad del sistema visual. Los colores viven en
 * `globals.css` (`--color-sig-*` para el televisor, `--color-brand-*` para la
 * interfaz de gestión); aquí quedan los datos de identidad y las medidas del
 * lienzo.
 */

export const INSTITUTION = {
  university: 'Universidad Autónoma del Beni "José Ballivián"',
  vicerrectorate: "Vicerrectorado de Posgrado",
  commercialName: "UABJB Posgrado Digital",
  systemName: "Cartelería Digital",
  generalGroup: "Pantallas generales Posgrado",
} as const;

/**
 * Contactos institucionales por defecto. Son sólo el respaldo: los reales se
 * editan en «Identidad institucional» y se guardan en la base de datos.
 */
export const INSTITUTIONAL_CONTACTS = {
  phones: ["61948267", "72814772"],
  enrollmentLabel: "Inscripciones abiertas",
} as const;

/** Lienzo institucional base: siempre 1920x1080 (16:9, Full HD). */
export const CANVAS = {
  width: 1920,
  height: 1080,
  aspectRatio: 16 / 9,
} as const;
