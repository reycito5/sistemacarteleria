/**
 * Escala tipográfica de la cartelería.
 *
 * El lienzo mide 1920×1080 y se ve en un televisor a 2–4 metros. La regla
 * práctica de señalización es ~1 px de altura de texto por cada centímetro de
 * distancia de lectura: a 3 m, nada por debajo de ~28 px se lee con comodidad,
 * y los titulares deben rondar los 60–90 px.
 *
 * Todo el sistema tira de estos valores para que ningún componente vuelva a
 * inventarse un tamaño demasiado pequeño.
 */
export const T = {
  /** Antetítulos y etiquetas en versalitas. */
  eyebrow: 22,
  /** Texto secundario: metadatos, pies, notas. */
  meta: 24,
  /** Cuerpo de lectura. */
  body: 26,
  /** Cuerpo destacado. */
  bodyLg: 30,
  /** Título de tarjeta. */
  cardTitle: 38,
  /** Nombre de programa, fila de listado. */
  itemTitle: 31,
  /** Titular de pantalla. */
  headline: 58,
  /** Titular de máximo impacto (comunicado, emergencia). */
  hero: 76,
  /** Cifras y datos protagonistas. */
  stat: 64,
} as const;

/** Grosores tipográficos usados en la cartelería. */
export const W = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  black: 900,
} as const;
