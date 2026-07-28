/**
 * Escala tipográfica de la cartelería.
 *
 * El lienzo mide 1920×1080 y se ve en un televisor a 2–4 metros. La regla
 * práctica de señalización es ~1 px de altura de texto por cada centímetro de
 * distancia de lectura: a 3 m nada por debajo de ~28 px se lee con comodidad.
 *
 * Además del mínimo legible, la cartelería necesita CONTRASTE de escala: si
 * todo mide parecido, la pantalla se lee como un documento y no engancha a
 * quien pasa. De ahí el salto deliberado entre `body` (28) y `poster` (150).
 */
export const T = {
  /** Antetítulos y etiquetas en versalitas. */
  eyebrow: 22,
  /** Texto secundario: metadatos, pies, notas. */
  meta: 24,
  /** Cuerpo de lectura. */
  body: 28,
  /** Cuerpo destacado. */
  bodyLg: 34,
  /** Título de tarjeta o bloque. */
  cardTitle: 44,
  /** Nombre de programa, fila de listado. */
  itemTitle: 36,
  /** Titular de pantalla. */
  headline: 62,
  /** Titular de máximo impacto. */
  hero: 88,
  /**
   * Titular a sangre, el que se lee desde el fondo del pasillo.
   *
   * La zona central del lienzo mide ~666 px de alto una vez descontados
   * cabecera, rótulo y pie; a 124 px caben dos líneas de titular más el
   * subtítulo y el QR sin que nada se corte.
   */
  poster: 124,
  /** Cifras y datos protagonistas. */
  stat: 72,
  /** Cifra gigante usada como elemento gráfico. */
  statHero: 150,
} as const;

/**
 * Ajusta el tamaño de un titular a su longitud.
 *
 * El administrador escribe títulos de longitud imprevisible: «Bienvenidos» y
 * «Suspensión temporal de atención administrativa por trabajos eléctricos»
 * comparten plantilla. Con un tamaño fijo, el segundo desborda el lienzo y se
 * corta —el televisor no tiene barra de desplazamiento—. Aquí el cuerpo baja
 * de forma progresiva (raíz cuadrada, no lineal) para que un texto el doble de
 * largo no quede a la mitad de tamaño, y nunca por debajo de `min`.
 *
 * @param text        Titular a medir.
 * @param max         Cuerpo ideal cuando el texto es corto.
 * @param min         Cuerpo mínimo legible en esa posición.
 * @param comfortable Nº de caracteres que caben cómodos a tamaño `max`.
 */
export function autoSize(
  text: string,
  max: number,
  min: number,
  comfortable: number,
): number {
  const length = text.trim().length;
  if (length <= comfortable) return max;
  return Math.max(min, Math.round(max * Math.sqrt(comfortable / length)));
}

/**
 * Densidad de las filas de un índice según cuántas haya.
 *
 * Cinco actividades en la zona central (≈666 px) no pueden ocupar lo mismo que
 * dos: se reparte el alto disponible en lugar de dejar que la última fila se
 * salga por debajo del rótulo.
 */
export function rowScale(count: number): { title: number; padY: number } {
  if (count <= 2) return { title: 46, padY: 26 };
  if (count === 3) return { title: 40, padY: 18 };
  if (count === 4) return { title: 36, padY: 14 };
  return { title: 32, padY: 11 };
}

/** Interlineados por tamaño: cuanto más grande, más apretado. */
export const LH = {
  poster: 0.92,
  hero: 1.0,
  headline: 1.08,
  title: 1.18,
  body: 1.4,
} as const;
