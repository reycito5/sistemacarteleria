import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { signMediaPaths } from "@/lib/media/storage";
import {
  DEFAULT_IDENTITY,
  type InstitutionIdentity,
} from "@/lib/institution/identity";

export { DEFAULT_IDENTITY };
export type { InstitutionIdentity };

/**
 * Identidad institucional que se pinta en la cabecera y el pie de TODAS las
 * pantallas: logos, nombre de la institución, contactos, redes y rótulo.
 *
 * Se edita desde el panel («Identidad institucional»). Si la tabla todavía no
 * existe o el entorno no está configurado, se devuelven los valores por
 * defecto: la cartelería nunca se queda sin cabecera ni pie.
 */
export async function getInstitutionIdentity(): Promise<InstitutionIdentity> {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return DEFAULT_IDENTITY;
  }

  try {
    const { data, error } = await supabase
      .from("institution_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error || !data) return DEFAULT_IDENTITY;

    // Los logos viven en el bucket privado: hay que firmarlos para mostrarlos.
    const paths = [data.logo_primary_path, data.logo_secondary_path].filter(
      (p): p is string => Boolean(p),
    );
    const signed = await signMediaPaths(supabase, paths);

    return {
      universityName: data.university_name,
      vicerrectorateName: data.vicerrectorate_name,
      logoPrimaryPath: data.logo_primary_path,
      logoSecondaryPath: data.logo_secondary_path,
      logoPrimaryUrl: data.logo_primary_path
        ? (signed.get(data.logo_primary_path) ?? null)
        : null,
      logoSecondaryUrl: data.logo_secondary_path
        ? (signed.get(data.logo_secondary_path) ?? null)
        : null,
      phones: data.phones?.length ? data.phones : DEFAULT_IDENTITY.phones,
      email: data.email || DEFAULT_IDENTITY.email,
      location: data.location || DEFAULT_IDENTITY.location,
      social: data.social?.length ? data.social : DEFAULT_IDENTITY.social,
      tickerLabel: data.ticker_label || DEFAULT_IDENTITY.tickerLabel,
      tickerText: data.ticker_text || DEFAULT_IDENTITY.tickerText,
    };
  } catch {
    return DEFAULT_IDENTITY;
  }
}
