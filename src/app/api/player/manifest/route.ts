import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getActiveManifest } from "@/lib/data/player";
import { manifestFromViews } from "@/lib/player/manifest";
import { SAMPLE_VIEWS } from "@/lib/views/samples";

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
  try {
    const supabase = createAdminClient();
    const manifest = await getActiveManifest(supabase);
    if (manifest && manifest.items.length > 0) {
      return NextResponse.json(manifest, {
        headers: { "cache-control": "no-store" },
      });
    }
  } catch {
    // Sin configuración o error transitorio: se usa el respaldo.
  }

  return NextResponse.json(manifestFromViews(SAMPLE_VIEWS), {
    headers: { "cache-control": "no-store" },
  });
}
