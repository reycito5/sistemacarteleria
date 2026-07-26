"use server";

import { revalidatePath } from "next/cache";
import { getContext, writeAudit, type ActionResult } from "./helpers";
import { SAMPLE_VIEWS } from "@/lib/views/samples";
import { viewNumberForKind, labelForKind } from "@/lib/views/registry";

function revalidate() {
  revalidatePath("/admin/playlist");
  revalidatePath("/admin");
}

/** Crea una playlist de trabajo (borrador) si el administrador aún no tiene una. */
export async function createWorkingPlaylist(): Promise<ActionResult<string>> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase, userId } = ctx.data;

  const { data, error } = await supabase
    .from("playlists")
    .insert({
      name: "Programación institucional",
      description: "Playlist general del grupo PANTALLAS GENERALES POSGRADO.",
      status: "borrador",
      created_by: userId,
    })
    .select("id")
    .single();

  if (error) return { ok: false, error: error.message };
  await writeAudit(ctx.data, "crear", "playlist", data.id);
  revalidate();
  return { ok: true, data: data.id };
}

/**
 * Crea contenidos de ejemplo a partir de las plantillas (para poder armar una
 * playlist de inmediato). Idempotente por título.
 */
export async function seedSampleContent(): Promise<ActionResult<number>> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase, userId } = ctx.data;

  const { data: templates } = await supabase
    .from("templates")
    .select("id, view_number");
  const templateByView = new Map(
    (templates ?? []).map((t) => [t.view_number, t.id]),
  );

  let created = 0;
  for (const content of SAMPLE_VIEWS) {
    const viewNumber = viewNumberForKind(content.kind);
    if (viewNumber === null) continue;
    const templateId = templateByView.get(viewNumber);
    if (!templateId) continue;

    const title = labelForKind(content.kind);
    const { data: exists } = await supabase
      .from("content_items")
      .select("id")
      .eq("title", title)
      .limit(1)
      .maybeSingle();
    if (exists) continue;

    const { error } = await supabase.from("content_items").insert({
      template_id: templateId,
      title,
      content_data: content as never,
      status: "aprobado",
      created_by: userId,
    });
    if (!error) created++;
  }

  await writeAudit(ctx.data, "seed", "content_item", null, { created });
  revalidate();
  return { ok: true, data: created };
}

/** Añade un contenido al final de la playlist. */
export async function addPlaylistItem(
  playlistId: string,
  contentItemId: string,
): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase } = ctx.data;

  const { data: last } = await supabase
    .from("playlist_items")
    .select("position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: false })
    .limit(1)
    .maybeSingle();

  const position = (last?.position ?? -1) + 1;

  const { error } = await supabase.from("playlist_items").insert({
    playlist_id: playlistId,
    content_item_id: contentItemId,
    position,
    duration_seconds: 15,
    muted: true,
  });
  if (error) return { ok: false, error: error.message };
  revalidate();
  return { ok: true, data: undefined };
}

/** Elimina un elemento de la playlist. */
export async function removePlaylistItem(itemId: string): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { error } = await ctx.data.supabase
    .from("playlist_items")
    .delete()
    .eq("id", itemId);
  if (error) return { ok: false, error: error.message };
  revalidate();
  return { ok: true, data: undefined };
}

/** Ajusta la duración (segundos) de un elemento. */
export async function updatePlaylistItemDuration(
  itemId: string,
  seconds: number,
): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const value = Math.max(1, Math.round(seconds));
  const { error } = await ctx.data.supabase
    .from("playlist_items")
    .update({ duration_seconds: value })
    .eq("id", itemId);
  if (error) return { ok: false, error: error.message };
  revalidate();
  return { ok: true, data: undefined };
}

/**
 * Intercambia la posición de dos elementos (mover arriba/abajo). Se hace en dos
 * pasos con una posición temporal para respetar la restricción unique.
 */
export async function movePlaylistItem(
  playlistId: string,
  itemId: string,
  direction: "up" | "down",
): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase } = ctx.data;

  const { data: items } = await supabase
    .from("playlist_items")
    .select("id, position")
    .eq("playlist_id", playlistId)
    .order("position", { ascending: true });

  if (!items) return { ok: false, error: "No se pudo leer la playlist." };
  const idx = items.findIndex((i) => i.id === itemId);
  if (idx === -1) return { ok: false, error: "Elemento no encontrado." };
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= items.length) return { ok: true, data: undefined };

  const a = items[idx];
  const b = items[swapIdx];
  const temp = -1;

  // Posición temporal para evitar colisión con la restricción unique.
  await supabase.from("playlist_items").update({ position: temp }).eq("id", a.id);
  await supabase.from("playlist_items").update({ position: a.position }).eq("id", b.id);
  await supabase.from("playlist_items").update({ position: b.position }).eq("id", a.id);

  revalidate();
  return { ok: true, data: undefined };
}

/**
 * Publica la playlist en las cuatro pantallas (sección 12/33): la marca activa,
 * fija la hora oficial de inicio, incrementa la versión, archiva cualquier otra
 * activa y genera el manifiesto de versión.
 */
export async function publishPlaylist(
  playlistId: string,
): Promise<ActionResult> {
  const ctx = await getContext();
  if (!ctx.ok) return ctx;
  const { supabase } = ctx.data;

  const { data: items } = await supabase
    .from("playlist_items")
    .select("duration_seconds")
    .eq("playlist_id", playlistId);
  if (!items || items.length === 0) {
    return { ok: false, error: "La playlist no tiene contenidos." };
  }
  const totalDuration = items.reduce((a, i) => a + i.duration_seconds, 0);

  // Archiva otras playlists activas (una sola activa a la vez).
  await supabase
    .from("playlists")
    .update({ status: "archivada" })
    .eq("status", "activa")
    .neq("id", playlistId);

  const { data: current } = await supabase
    .from("playlists")
    .select("version")
    .eq("id", playlistId)
    .single();
  const nextVersion = (current?.version ?? 1) + 1;
  const nowIso = new Date().toISOString();

  const { error } = await supabase
    .from("playlists")
    .update({
      status: "activa",
      version: nextVersion,
      total_duration: totalDuration,
      official_start_at: nowIso,
    })
    .eq("id", playlistId);
  if (error) return { ok: false, error: error.message };

  await supabase.from("player_manifests").insert({
    playlist_id: playlistId,
    version: nextVersion,
    manifest_data: { publishedAt: nowIso, totalDuration } as never,
  });

  await writeAudit(ctx.data, "publicar", "playlist", playlistId, {
    version: nextVersion,
  });
  revalidate();
  return { ok: true, data: undefined };
}
