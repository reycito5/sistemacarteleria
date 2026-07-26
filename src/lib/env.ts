import { z } from "zod";

/**
 * Validación de variables de entorno.
 *
 * Reglas de seguridad (sección 29 del prompt maestro):
 *  - Solo las variables NEXT_PUBLIC_* llegan al navegador / reproductores.
 *  - SUPABASE_SERVICE_ROLE_KEY es exclusivamente de servidor y NUNCA debe
 *    exponerse a los reproductores ni al cliente.
 */

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
});

/**
 * Variables públicas. Se referencian de forma estática para que Next.js las
 * inyecte en el bundle del cliente.
 */
export const publicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  NEXT_PUBLIC_SUPABASE_ANON_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
};

/**
 * Valida las variables públicas en el momento de uso (no en import) para no
 * romper el build en entornos donde aún no están configuradas.
 */
export function assertPublicEnv() {
  const parsed = publicSchema.safeParse(publicEnv);
  if (!parsed.success) {
    throw new Error(
      "Faltan variables de entorno públicas de Supabase. Configure " +
        "NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
        parsed.error.issues.map((i) => i.path.join(".")).join(", "),
    );
  }
  return parsed.data;
}

/** Clave de servicio, solo servidor. Nunca se importa desde código de cliente. */
export function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY (variable privada de servidor).",
    );
  }
  return key;
}
