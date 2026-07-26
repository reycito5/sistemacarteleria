import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  isActivationExpired,
  isValidActivationCode,
} from "@/lib/player/activation";

/**
 * Consulta el estado de una activación (sección 22, paso 8). El reproductor
 * hace polling con su código temporal; cuando el administrador lo confirma,
 * devuelve el código permanente de la pantalla para iniciar la reproducción.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code")?.trim() ?? "";
  if (!isValidActivationCode(code)) {
    return NextResponse.json({ error: "Código inválido" }, { status: 422 });
  }

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Servidor no configurado (Supabase)." },
      { status: 503 },
    );
  }

  // Pantalla ya activada con ese código de activación.
  const { data: activated } = await supabase
    .from("screens")
    .select("code, name, location, activated_at")
    .eq("activation_code", code)
    .not("activated_at", "is", null)
    .maybeSingle();

  if (activated) {
    return NextResponse.json(
      {
        status: "activated",
        screen: {
          code: activated.code,
          name: activated.name,
          location: activated.location,
        },
      },
      { headers: { "cache-control": "no-store" } },
    );
  }

  // Aún pendiente: comprobar vigencia.
  const { data: pending } = await supabase
    .from("screens")
    .select("activation_expires_at")
    .eq("activation_code", code)
    .maybeSingle();

  if (!pending) {
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }

  const status = isActivationExpired(pending.activation_expires_at)
    ? "expired"
    : "pending";

  return NextResponse.json(
    { status },
    { headers: { "cache-control": "no-store" } },
  );
}
