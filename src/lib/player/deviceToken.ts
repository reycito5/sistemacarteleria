import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

/**
 * Credencial individual de cada pantalla (sección 22/29). El token en claro se
 * entrega al reproductor una sola vez; el servidor guarda solo su hash y lo
 * verifica en cada latido. Nunca se almacena el token en claro.
 */

/** Genera un token de dispositivo aleatorio (hex de 256 bits). */
export function generateDeviceToken(): string {
  return randomBytes(32).toString("hex");
}

/** Hash SHA-256 (hex) del token, para almacenar y comparar. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Comparación en tiempo constante entre un token y un hash almacenado. */
export function verifyToken(token: string, storedHash: string): boolean {
  const a = Buffer.from(hashToken(token), "hex");
  const b = Buffer.from(storedHash, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
