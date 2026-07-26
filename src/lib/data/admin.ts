import "server-only";
import { createClient } from "@/lib/supabase/server";
import { publicEnv } from "@/lib/env";
import type {
  ContentItemRow,
  MediaAssetRow,
  PlaylistRow,
  PlaylistItemRow,
} from "@/lib/supabase/database.types";

/** URL pública de un archivo del bucket 'media'. */
export function publicMediaUrl(storagePath: string): string {
  const base = publicEnv.NEXT_PUBLIC_SUPABASE_URL;
  return `${base}/storage/v1/object/public/media/${storagePath}`;
}

export interface MediaAssetSummary {
  id: string;
  title: string;
  type: MediaAssetRow["type"];
  status: MediaAssetRow["status"];
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
  durationSeconds: number | null;
  fileSize: number | null;
}

/** Biblioteca multimedia, más reciente primero. */
export async function listMediaAssets(): Promise<MediaAssetSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media_assets")
    .select(
      "id, title, type, status, storage_path, thumbnail_path, width, height, duration_seconds, file_size",
    )
    .order("created_at", { ascending: false });

  return (data ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    type: a.type,
    status: a.status,
    url: publicMediaUrl(a.storage_path),
    thumbnailUrl: a.thumbnail_path ? publicMediaUrl(a.thumbnail_path) : null,
    width: a.width,
    height: a.height,
    durationSeconds: a.duration_seconds,
    fileSize: a.file_size,
  }));
}

export interface ContentItemSummary {
  id: string;
  title: string;
  status: ContentItemRow["status"];
  templateName: string;
  viewNumber: number;
  kind: string;
}

export interface PlaylistItemDetail extends PlaylistItemRow {
  contentTitle: string;
}

export interface WorkingPlaylist {
  playlist: PlaylistRow;
  items: PlaylistItemDetail[];
}

/** Contenidos disponibles para añadir a la playlist. */
export async function listContentItems(): Promise<ContentItemSummary[]> {
  const supabase = await createClient();
  const { data: contents } = await supabase
    .from("content_items")
    .select("id, title, status, template_id, content_data")
    .order("created_at", { ascending: false });

  if (!contents || contents.length === 0) return [];

  const templateIds = [...new Set(contents.map((c) => c.template_id))];
  const { data: templates } = await supabase
    .from("templates")
    .select("id, name, view_number")
    .in("id", templateIds);

  const tById = new Map((templates ?? []).map((t) => [t.id, t]));

  return contents.map((c) => {
    const t = tById.get(c.template_id);
    const data = c.content_data as { kind?: string } | null;
    return {
      id: c.id,
      title: c.title,
      status: c.status,
      templateName: t?.name ?? "—",
      viewNumber: t?.view_number ?? 0,
      kind: data?.kind ?? "—",
    };
  });
}

export interface ContentItemFull {
  id: string;
  title: string;
  kind: string;
  contentData: Record<string, unknown>;
}

/** Un contenido para edición, con su content_data completo. */
export async function getContentItem(id: string): Promise<ContentItemFull | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("content_items")
    .select("id, title, content_data")
    .eq("id", id)
    .maybeSingle();
  if (!data) return null;
  const cd = (data.content_data ?? {}) as Record<string, unknown>;
  return {
    id: data.id,
    title: data.title,
    kind: (cd.kind as string) ?? "",
    contentData: cd,
  };
}

/** Opciones de la biblioteca para el selector de medios (id, título, url, tipo). */
export interface MediaOption {
  id: string;
  title: string;
  url: string;
  type: MediaAssetRow["type"];
}

export async function listMediaOptions(): Promise<MediaOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media_assets")
    .select("id, title, type, storage_path")
    .order("created_at", { ascending: false });
  return (data ?? []).map((a) => ({
    id: a.id,
    title: a.title,
    type: a.type,
    url: publicMediaUrl(a.storage_path),
  }));
}

/** Todas las playlists, más reciente primero. */
export async function listPlaylists(): Promise<PlaylistRow[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("playlists")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

/**
 * Playlist de trabajo: la más reciente que no esté archivada. Si no existe
 * ninguna, devuelve null (el UI ofrece crearla).
 */
export async function getWorkingPlaylist(): Promise<WorkingPlaylist | null> {
  const supabase = await createClient();
  const { data: playlist } = await supabase
    .from("playlists")
    .select("*")
    .neq("status", "archivada")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!playlist) return null;

  const { data: items } = await supabase
    .from("playlist_items")
    .select("*")
    .eq("playlist_id", playlist.id)
    .order("position", { ascending: true });

  const rows = items ?? [];
  const contentIds = rows.map((r) => r.content_item_id);
  const titleById = new Map<string, string>();
  if (contentIds.length > 0) {
    const { data: contents } = await supabase
      .from("content_items")
      .select("id, title")
      .in("id", contentIds);
    for (const c of contents ?? []) titleById.set(c.id, c.title);
  }

  return {
    playlist,
    items: rows.map((r) => ({
      ...r,
      contentTitle: titleById.get(r.content_item_id) ?? "—",
    })),
  };
}

/** Emergencia activa vigente, si existe. */
export async function getActiveEmergency() {
  const supabase = await createClient();
  const nowIso = new Date().toISOString();
  const { data } = await supabase
    .from("emergency_messages")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })
    .limit(5);
  return (
    (data ?? []).find((e) => !e.end_at || Date.parse(e.end_at) > Date.parse(nowIso)) ??
    null
  );
}
