import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { assertPublicEnv, getServiceRoleKey } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Cliente Supabase con clave de servicio. SOLO SERVIDOR.
 *
 * Se usa exclusivamente en Route Handlers para la telemetría de los
 * reproductores (heartbeats, eventos de reproducción), que no tienen sesión de
 * usuario. La clave de servicio NUNCA debe llegar a los reproductores ni al
 * cliente (`import "server-only"` lo impide en tiempo de compilación).
 */
export function createAdminClient() {
  const env = assertPublicEnv();
  return createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    getServiceRoleKey(),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
