import "server-only";
import {
  SAMPLE_PORTAL_PROGRAMS,
  portalResponseSchema,
  type PortalProgram,
} from "./portal";

export interface PortalResult {
  programs: PortalProgram[];
  /** Origen de los datos: el portal real o la muestra de respaldo. */
  source: "portal" | "muestra";
}

/**
 * Obtiene los programas del Portal de Oferta. Si `OFERTA_PORTAL_URL` está
 * configurada, los descarga y valida; ante cualquier fallo (o si no está
 * configurada) devuelve la oferta de muestra para no bloquear la cartelería.
 */
export async function fetchPortalPrograms(): Promise<PortalResult> {
  const url = process.env.OFERTA_PORTAL_URL;
  if (!url) return { programs: SAMPLE_PORTAL_PROGRAMS, source: "muestra" };

  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) throw new Error(String(res.status));
    const parsed = portalResponseSchema.safeParse(await res.json());
    if (!parsed.success) throw new Error("respuesta inválida");
    return { programs: parsed.data.programs, source: "portal" };
  } catch {
    return { programs: SAMPLE_PORTAL_PROGRAMS, source: "muestra" };
  }
}
