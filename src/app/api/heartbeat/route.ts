import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyToken } from "@/lib/player/deviceToken";

/**
 * Route Handler de latidos (Fase 8). Cada reproductor reporta periódicamente su
 * estado: contenido actual, posición y conexión. Se ejecuta con clave de
 * servicio (sin sesión de usuario). En producción debe autenticarse con el
 * token individual de la pantalla (sección 22).
 */

export const runtime = "nodejs";

const heartbeatSchema = z.object({
  screenCode: z.string().min(1),
  deviceToken: z.string().nullish(),
  currentContentId: z.string().uuid().nullish(),
  currentPositionSeconds: z.number().min(0).default(0),
  playlistVersion: z.number().int().nullish(),
  connectionStatus: z.enum(["online", "offline", "sincronizando"]).default("online"),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const parsed = heartbeatSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos inválidos", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const data = parsed.data;

  let supabase;
  try {
    supabase = createAdminClient();
  } catch {
    return NextResponse.json(
      { error: "Servidor no configurado (Supabase)." },
      { status: 503 },
    );
  }

  const { data: screen, error: screenError } = await supabase
    .from("screens")
    .select("id, device_token_hash")
    .eq("code", data.screenCode)
    .maybeSingle();

  if (screenError) {
    return NextResponse.json({ error: screenError.message }, { status: 500 });
  }
  if (!screen) {
    return NextResponse.json({ error: "Pantalla no encontrada" }, { status: 404 });
  }

  // Verificación de credencial: si la pantalla tiene token (fue activada),
  // exige uno válido. Las pantallas sembradas sin token se aceptan (compat).
  if (screen.device_token_hash) {
    if (!data.deviceToken || !verifyToken(data.deviceToken, screen.device_token_hash)) {
      return NextResponse.json(
        { error: "Credencial de pantalla inválida" },
        { status: 401 },
      );
    }
  }

  const now = new Date().toISOString();

  const { error: hbError } = await supabase.from("screen_heartbeats").insert({
    screen_id: screen.id,
    current_content_id: data.currentContentId ?? null,
    current_position_seconds: data.currentPositionSeconds,
    playlist_version: data.playlistVersion ?? null,
    connection_status: data.connectionStatus,
  });

  if (hbError) {
    return NextResponse.json({ error: hbError.message }, { status: 500 });
  }

  await supabase
    .from("screens")
    .update({
      last_seen_at: now,
      status: data.connectionStatus === "online" ? "reproduciendo" : "offline",
      current_content_id: data.currentContentId ?? null,
      playlist_version: data.playlistVersion ?? null,
    })
    .eq("id", screen.id);

  return NextResponse.json({ ok: true, receivedAt: now });
}
