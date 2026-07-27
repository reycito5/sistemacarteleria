import "server-only";
import { createClient } from "@/lib/supabase/server";
import { signMediaPaths } from "@/lib/media/storage";
import type {
  ContentItemRow,
  MediaAssetRow,
  PlaylistRow,
  PlaylistItemRow,
} from "@/lib/supabase/database.types";

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

  const rows = data ?? [];
  const paths = rows.flatMap((a) =>
    [a.storage_path, a.thumbnail_path].filter((p): p is string => Boolean(p)),
  );
  const signed = await signMediaPaths(supabase, paths);

  return rows.map((a) => ({
    id: a.id,
    title: a.title,
    type: a.type,
    status: a.status,
    url: signed.get(a.storage_path) ?? "",
    thumbnailUrl: a.thumbnail_path ? signed.get(a.thumbnail_path) ?? null : null,
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

/** Opciones de la biblioteca para el selector de medios. */
export interface MediaOption {
  id: string;
  title: string;
  /** Ruta en Storage que se guarda en el contenido (se firma al reproducir). */
  path: string;
  /** URL firmada para la vista previa del panel. */
  url: string;
  type: MediaAssetRow["type"];
}

export async function listMediaOptions(): Promise<MediaOption[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media_assets")
    .select("id, title, type, storage_path")
    .order("created_at", { ascending: false });
  const rows = data ?? [];
  const signed = await signMediaPaths(
    supabase,
    rows.map((a) => a.storage_path),
  );
  return rows.map((a) => ({
    id: a.id,
    title: a.title,
    type: a.type,
    path: a.storage_path,
    url: signed.get(a.storage_path) ?? "",
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

/** Umbral (segundos) para considerar una pantalla en línea. */
export const ONLINE_THRESHOLD_SECONDS = 60;

export interface ScreenStatusView {
  id: string;
  name: string;
  code: string;
  location: string;
  online: boolean;
  status: string;
  lastSeenAt: string | null;
  currentContentTitle: string | null;
  currentPositionSeconds: number | null;
  playlistVersion: number | null;
}

/**
 * Estado en vivo de las pantallas (Fase 8). Combina la fila de la pantalla con
 * su último latido y calcula si está en línea según la recencia del heartbeat.
 */
export async function listScreensStatus(): Promise<ScreenStatusView[]> {
  const supabase = await createClient();
  const now = Date.now();

  const { data: screens } = await supabase
    .from("screens")
    .select(
      "id, name, code, location, status, last_seen_at, current_content_id, playlist_version",
    )
    .order("code", { ascending: true });

  if (!screens || screens.length === 0) return [];

  // Título del contenido actual.
  const contentIds = screens
    .map((s) => s.current_content_id)
    .filter((v): v is string => Boolean(v));
  const titleById = new Map<string, string>();
  if (contentIds.length > 0) {
    const { data: contents } = await supabase
      .from("content_items")
      .select("id, title")
      .in("id", contentIds);
    for (const c of contents ?? []) titleById.set(c.id, c.title);
  }

  // Último latido por pantalla (posición actual).
  const positionByScreen = new Map<string, number>();
  const { data: beats } = await supabase
    .from("screen_heartbeats")
    .select("screen_id, current_position_seconds, reported_at")
    .order("reported_at", { ascending: false })
    .limit(200);
  for (const b of beats ?? []) {
    if (!positionByScreen.has(b.screen_id)) {
      positionByScreen.set(b.screen_id, b.current_position_seconds);
    }
  }

  return screens.map((s) => {
    const online = s.last_seen_at
      ? now - Date.parse(s.last_seen_at) <= ONLINE_THRESHOLD_SECONDS * 1000
      : false;
    return {
      id: s.id,
      name: s.name,
      code: s.code,
      location: s.location,
      online,
      status: online ? s.status : "desconectada",
      lastSeenAt: s.last_seen_at,
      currentContentTitle: s.current_content_id
        ? titleById.get(s.current_content_id) ?? null
        : null,
      currentPositionSeconds: positionByScreen.get(s.id) ?? null,
      playlistVersion: s.playlist_version,
    };
  });
}

/** Id del grupo institucional general (una sola fila). */
export async function getGeneralGroupId(): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("screen_groups")
    .select("id")
    .eq("name", "PANTALLAS GENERALES POSGRADO")
    .maybeSingle();
  return data?.id ?? null;
}

export interface ScheduleView {
  id: string;
  playlistName: string;
  priority: number;
  active: boolean;
  startAt: string | null;
  endAt: string | null;
  daysOfWeek: number[];
  dailyStart: string | null;
  dailyEnd: string | null;
}

/** Programaciones del calendario con el nombre de su playlist. */
export async function listSchedules(): Promise<ScheduleView[]> {
  const supabase = await createClient();
  const { data: schedules } = await supabase
    .from("schedules")
    .select(
      "id, playlist_id, priority, active, start_at, end_at, days_of_week, daily_start_time, daily_end_time",
    )
    .order("priority", { ascending: true });

  if (!schedules || schedules.length === 0) return [];

  const playlistIds = [...new Set(schedules.map((s) => s.playlist_id))];
  const { data: playlists } = await supabase
    .from("playlists")
    .select("id, name")
    .in("id", playlistIds);
  const nameById = new Map((playlists ?? []).map((p) => [p.id, p.name]));

  return schedules.map((s) => ({
    id: s.id,
    playlistName: nameById.get(s.playlist_id) ?? "—",
    priority: s.priority,
    active: s.active,
    startAt: s.start_at,
    endAt: s.end_at,
    daysOfWeek: s.days_of_week,
    dailyStart: s.daily_start_time,
    dailyEnd: s.daily_end_time,
  }));
}

/** Playlists seleccionables para programar (no archivadas). */
export async function listSchedulablePlaylists(): Promise<
  { id: string; name: string; status: string }[]
> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("playlists")
    .select("id, name, status")
    .neq("status", "archivada")
    .order("created_at", { ascending: false });
  return data ?? [];
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
