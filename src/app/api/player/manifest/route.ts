import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveManifest } from "@/lib/data/player";
import { manifestFromViews } from "@/lib/player/manifest";
import { SAMPLE_VIEWS } from "@/lib/views/samples";
import { getInstitutionIdentity } from "@/lib/data/institution";

/**
 * Manifiesto del reproductor para las pantallas (Fases 4/7/8).
 *
 * Sirve la playlist institucional activa ya resuelta. Si no hay proyecto
 * Supabase configurado o no existe una playlist publicada, devuelve un
 * manifiesto de respaldo con las plantillas de ejemplo: el reproductor consume
 * siempre la misma forma y NUNCA se queda sin contenido (sección 28).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // La identidad viaja siempre con el manifiesto: así el reproductor conserva
  // logos, contactos y rótulo en su caché aunque después pierda la red.
  const identity = await getInstitutionIdentity();

  try {
    const supabase = createAdminClient();
    const manifest = await getActiveManifest(supabase);
    if (manifest && manifest.items.length > 0) {
      return NextResponse.json(
        { ...manifest, identity },
        { headers: { "cache-control": "no-store" } },
      );
    }
  } catch {
    // Sin configuración o error transitorio: se usa el respaldo.
  }

  return NextResponse.json(
    { ...manifestFromViews(SAMPLE_VIEWS), identity },
    { headers: { "cache-control": "no-store" } },
  );
}
