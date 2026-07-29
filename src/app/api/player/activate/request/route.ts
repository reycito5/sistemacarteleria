import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  activationExpiry,
  generateActivationCode,
  generateScreenCode,
} from "@/lib/player/activation";

/**
 * Solicitud de activación de una pantalla (sección 22, paso 3).
 *
 * Crea una fila de pantalla pendiente con un código de activación temporal y lo
 * devuelve para mostrarlo en el reproductor. El administrador lo confirma en el
 * panel. Ejecuta con clave de servicio (el reproductor no tiene sesión).
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Servidor no configurado (Supabase)." },
      { status: 503 },
    );
  }

  const activationCode = generateActivationCode();
  const screenCode = generateScreenCode();

  const { error } = await supabase.from("screens").insert({
    name: "Pantalla sin asignar",
    code: screenCode,
    location: "",
    status: "desconectada",
    activation_code: activationCode,
    activation_expires_at: activationExpiry(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { activationCode, expiresInMinutes: 15 },
    { headers: { "cache-control": "no-store" } },
  );
}
