import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/database.types";
import {
  buildManifest,
  type PlayerManifest,
  type PlaylistItemLike,
} from "@/lib/player/manifest";
import { signMediaPaths } from "@/lib/media/storage";
import { collectStoredMediaRefs } from "@/lib/media/walkMedia";
import { emergenciaSchema, type EmergenciaContent } from "@/lib/views/schemas";

type Client = SupabaseClient<Database>;

/**
 * Obtiene la emergencia activa con mayor prioridad y la adapta al contenido de
 * la vista de emergencia. Devuelve null si no hay ninguna vigente.
 */
async function fetchActiveEmergency(
  supabase: Client,
  nowIso: string,
): Promise<EmergenciaContent | null> {
  const { data } = await supabase
    .from("emergency_messages")
    .select("title, message, instructions, end_at, start_at")
    .eq("active", true)
    .lte("start_at", nowIso)
    .order("created_at", { ascending: false })
    .limit(5);

  const vigente = (data ?? []).find(
    (e) => !e.end_at || Date.parse(e.end_at) > Date.parse(nowIso),
  );
  if (!vigente) return null;

  return emergenciaSchema.parse({
    kind: "emergencia",
    title: vigente.title,
    message: vigente.message,
    instructions: vigente.instructions,
  });
}

/**
 * Construye el manifiesto del reproductor a partir de la playlist institucional
 * activa. Devuelve null si no hay ninguna publicada (el llamador usará el
 * respaldo). Ejecuta consultas simples (sin joins anidados) para máxima
 * compatibilidad de tipos.
 */
export async function getActiveManifest(
  supabase: Client,
): Promise<PlayerManifest | null> {
  const nowIso = new Date().toISOString();

  const { data: playlist } = await supabase
    .from("playlists")
    .select("id, version, official_start_at")
    .eq("status", "activa")
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!playlist) return null;

  const { data: rows } = await supabase
    .from("playlist_items")
    .select("id, content_item_id, duration_seconds, muted, position")
    .eq("playlist_id", playlist.id)
    .order("position", { ascending: true });

  const items = rows ?? [];
  const contentIds = items.map((r) => r.content_item_id);

  const contentById = new Map<string, unknown>();
  if (contentIds.length > 0) {
    const { data: contents } = await supabase
      .from("content_items")
      .select("id, content_data")
      .in("id", contentIds);
    for (const c of contents ?? []) {
      contentById.set(c.id, c.content_data);
    }
  }

  const rawItems: PlaylistItemLike[] = items.map((r) => ({
    id: r.id,
    content_item_id: r.content_item_id,
    duration_seconds: r.duration_seconds,
    muted: r.muted,
    content_data: contentById.get(r.content_item_id),
  }));

  const emergency = await fetchActiveEmergency(supabase, nowIso);
  const manifest = buildManifest(playlist, rawItems, emergency);

  // Firma las rutas de medios (bucket privado) para que las pantallas puedan
  // descargarlos sin exponer el bucket. Las URLs firmadas se re-generan en cada
  // construcción; el Service Worker cachea por ruta, ignorando el token.
  await signManifestMedia(supabase, manifest);
  return manifest;
}

/** Sustituye media.path por una URL firmada en cada elemento del manifiesto. */
async function signManifestMedia(
  supabase: Client,
  manifest: PlayerManifest,
): Promise<void> {
  const paths = new Set<string>();
  for (const item of manifest.items) {
    for (const media of collectStoredMediaRefs(item.content)) {
      if (media.path) paths.add(media.path);
      if (media.subtitlePath) paths.add(media.subtitlePath);
    }
  }
  if (paths.size === 0) return;

  const signed = await signMediaPaths(supabase, [...paths]);
  for (const item of manifest.items) {
    for (const media of collectStoredMediaRefs(item.content)) {
      if (media.path) {
        const url = signed.get(media.path);
        if (url) media.src = url;
      }
      if (media.subtitlePath) {
        const url = signed.get(media.subtitlePath);
        if (url) media.subtitleSrc = url;
      }
    }
  }
}
