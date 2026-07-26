/**
 * Utilidades de activación de pantallas (sección 22 del prompt maestro).
 *
 * Cada reproductor obtiene una identidad propia mediante un código temporal que
 * el administrador confirma en el panel. Funciones puras y testables.
 */

/** Código humano de activación: 6 dígitos, fácil de teclear en el panel. */
export function generateActivationCode(
  random: () => number = Math.random,
): string {
  return Math.floor(100000 + random() * 900000).toString();
}

/** Código permanente e único de la pantalla (identidad para heartbeats). */
export function generateScreenCode(now: number = Date.now()): string {
  const stamp = now.toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `SCR-${stamp}-${rand}`;
}

/** Valida el formato del código de activación (exactamente 6 dígitos). */
export function isValidActivationCode(code: string): boolean {
  return /^\d{6}$/.test(code.trim());
}

/** Minutos de validez del código de activación. */
export const ACTIVATION_TTL_MINUTES = 15;

export function activationExpiry(now: number = Date.now()): string {
  return new Date(now + ACTIVATION_TTL_MINUTES * 60_000).toISOString();
}

export function isActivationExpired(
  expiresAt: string | null,
  now: number = Date.now(),
): boolean {
  if (!expiresAt) return true;
  return Date.parse(expiresAt) <= now;
}
