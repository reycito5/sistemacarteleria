/**
 * Motor de sincronización por hora oficial (sección 14 del prompt maestro).
 *
 * Todas las pantallas calculan su posición en la playlist a partir de una única
 * hora oficial de inicio y la hora del servidor, no del momento de encendido.
 * Esto garantiza una diferencia máxima de 1–3 s entre pantallas sin necesidad
 * de sincronización de milisegundos.
 *
 * Funciones puras y deterministas: fáciles de probar y sin efectos colaterales.
 */

export interface SyncItem {
  /** Identificador del elemento de playlist */
  id: string;
  /** Duración en segundos (para imágenes y contenidos con tiempo fijo) */
  durationSeconds: number;
}

export interface SyncPosition {
  /** Índice del elemento actual dentro de la playlist */
  index: number;
  /** Segundo exacto dentro del contenido actual */
  offsetSeconds: number;
  /** Segundos totales transcurridos desde la hora oficial (módulo ciclo) */
  cycleElapsedSeconds: number;
  /** Duración total del ciclo de la playlist */
  cycleDurationSeconds: number;
  /** Número de ciclo completo actual (0 = primer ciclo) */
  cycleCount: number;
}

/** Suma de duraciones de la playlist (duración de un ciclo completo). */
export function totalDuration(items: readonly SyncItem[]): number {
  return items.reduce((acc, item) => acc + Math.max(0, item.durationSeconds), 0);
}

/**
 * Calcula en qué elemento y segundo debería estar una pantalla ahora mismo.
 *
 * @param items          Elementos de la playlist con sus duraciones.
 * @param officialStart  Hora oficial de inicio (epoch ms).
 * @param now            Hora actual del servidor (epoch ms).
 * @returns              Posición sincronizada, o null si la playlist está vacía
 *                       o aún no ha comenzado.
 */
export function computePosition(
  items: readonly SyncItem[],
  officialStart: number,
  now: number,
): SyncPosition | null {
  const cycleDurationSeconds = totalDuration(items);
  if (items.length === 0 || cycleDurationSeconds <= 0) return null;
  if (now < officialStart) return null;

  const elapsedSeconds = (now - officialStart) / 1000;
  const cycleCount = Math.floor(elapsedSeconds / cycleDurationSeconds);
  const cycleElapsedSeconds = elapsedSeconds % cycleDurationSeconds;

  let acc = 0;
  for (let index = 0; index < items.length; index++) {
    const duration = Math.max(0, items[index].durationSeconds);
    if (cycleElapsedSeconds < acc + duration) {
      return {
        index,
        offsetSeconds: cycleElapsedSeconds - acc,
        cycleElapsedSeconds,
        cycleDurationSeconds,
        cycleCount,
      };
    }
    acc += duration;
  }

  // Salvaguarda por redondeo: último elemento.
  const last = items.length - 1;
  return {
    index: last,
    offsetSeconds: Math.max(0, items[last].durationSeconds),
    cycleElapsedSeconds,
    cycleDurationSeconds,
    cycleCount,
  };
}

/**
 * Determina si una pantalla está desincronizada respecto a la posición oficial.
 * Umbral por defecto: 3 segundos (nivel esperado, sección 14).
 */
export function isDrifting(
  localOffsetSeconds: number,
  officialOffsetSeconds: number,
  toleranceSeconds = 3,
): boolean {
  return Math.abs(localOffsetSeconds - officialOffsetSeconds) > toleranceSeconds;
}
