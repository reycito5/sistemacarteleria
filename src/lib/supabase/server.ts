import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { assertPublicEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Cliente Supabase para Server Components, Server Actions y Route Handlers.
 * Mantiene la sesión sincronizada mediante cookies. La seguridad la aplica RLS.
 */
export async function createClient() {
  const env = assertPublicEnv();
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Invocado desde un Server Component: la escritura de cookies se
            // gestiona en el middleware. Se ignora de forma segura.
          }
        },
      },
    },
  );
}
