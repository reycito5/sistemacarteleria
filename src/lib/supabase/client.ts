import { createBrowserClient } from "@supabase/ssr";
import { assertPublicEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Cliente Supabase para componentes de cliente (navegador).
 * Usa exclusivamente la clave anónima; la seguridad real la aplica RLS.
 */
export function createClient() {
  const env = assertPublicEnv();
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
