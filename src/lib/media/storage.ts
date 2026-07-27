import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";

/** Validez de las URLs firmadas (7 días): amplia para tolerar cortes de red. */
export const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

type Client = SupabaseClient<Database>;

/** Firma una ruta del bucket 'media'. Devuelve null si falla. */
export async function signMediaPath(
  supabase: Client,
  path: string,
  expiresIn: number = SIGNED_URL_TTL_SECONDS,
): Promise<string | null> {
  const { data } = await supabase.storage
    .from("media")
    .createSignedUrl(path, expiresIn);
  return data?.signedUrl ?? null;
}

/** Firma varias rutas en un solo lote (más eficiente para la biblioteca). */
export async function signMediaPaths(
  supabase: Client,
  paths: string[],
  expiresIn: number = SIGNED_URL_TTL_SECONDS,
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  if (paths.length === 0) return result;
  const { data } = await supabase.storage
    .from("media")
    .createSignedUrls(paths, expiresIn);
  for (const item of data ?? []) {
    if (item.signedUrl && item.path) result.set(item.path, item.signedUrl);
  }
  return result;
}
