/**
 * Línea Gráfica Institucional V11.6 — tokens bloqueados.
 *
 * Fuente única de verdad para el sistema visual. Estos valores NO pueden ser
 * modificados desde el panel ni desde plantillas: cabecera, pie, colores y
 * tipografía son inmutables por requisito institucional (secciones 8 y 34 del
 * prompt maestro).
 *
 * `as const` garantiza inmutabilidad a nivel de tipos.
 */

export const INSTITUTIONAL_COLORS = {
  blue: "#1D4ED8",
  blueTop: "#10205F",
  blueBottom: "#0A1440",
  red: "#C8102E",
  redStrong: "#E11D38",
  // Dorado retirado: se mantienen las claves como alias del acento rojo para
  // no romper referencias heredadas mientras se migran las vistas.
  gold: "#C8102E",
  goldStrong: "#E11D38",
  white: "#FFFFFF",
} as const;

export const INSTITUTION = {
  university: 'UNIVERSIDAD AUTÓNOMA DEL BENI "JOSÉ BALLIVIÁN"',
  vicerrectorate: "VICERRECTORADO DE POSGRADO",
  commercialName: "UABJB Posgrado Digital",
  systemName: "SICD UABJB POSGRADO",
  generalGroup: "PANTALLAS GENERALES POSGRADO",
} as const;

/**
 * Contactos institucionales por defecto (editables por plantilla, no por línea
 * gráfica). Se muestran en el pie de las vistas.
 */
export const INSTITUTIONAL_CONTACTS = {
  phones: ["61948267", "72814772"],
  enrollmentLabel: "INSCRIPCIONES ABIERTAS",
} as const;

/** Lienzo institucional base: siempre 1920x1080 (16:9, Full HD). */
export const CANVAS = {
  width: 1920,
  height: 1080,
  aspectRatio: 16 / 9,
} as const;

export type InstitutionalColor = keyof typeof INSTITUTIONAL_COLORS;
