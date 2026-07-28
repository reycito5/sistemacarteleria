/**
 * Tipos de la base de datos institucional.
 *
 * Escritos a mano para reflejar las migraciones de `supabase/migrations`.
 * Cuando exista un proyecto Supabase real puede regenerarse con:
 *   supabase gen types typescript --project-id <id> > src/lib/supabase/database.types.ts
 */

export type UserRole =
  | "superadmin"
  | "admin_comunicacion"
  | "editor"
  | "operador_tecnico"
  | "observador";

export type MediaType = "video" | "image";

export type ContentStatus =
  | "borrador"
  | "en_revision"
  | "aprobado"
  | "programado"
  | "publicado"
  | "finalizado"
  | "archivado";

export type MediaStatus = "pendiente" | "validado" | "rechazado" | "archivado";
export type PlaylistStatus = "borrador" | "activa" | "archivada";

export type ScreenStatus =
  | "en_linea"
  | "desconectada"
  | "sincronizando"
  | "reproduciendo"
  | "mantenimiento"
  | "error"
  | "offline";

export type ConnectionStatus = "online" | "offline" | "sincronizando";
export type ScreenOrientation = "horizontal" | "vertical";
export type EmergencySeverity = "alerta" | "urgente" | "critico";
export type PlaybackEventType =
  | "inicio"
  | "fin"
  | "error"
  | "omitido"
  | "emergencia";

type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

interface TableConfig<Row, Insert, Update> {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
}

export type ProfileRow = {
  id: string;
  full_name: string;
  role: UserRole;
  active: boolean;
  created_at: string;
}

export type ScreenGroupRow = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created_at: string;
}

export type ScreenRow = {
  id: string;
  name: string;
  code: string;
  location: string;
  resolution: string;
  orientation: ScreenOrientation;
  status: ScreenStatus;
  last_seen_at: string | null;
  player_version: string | null;
  playlist_version: number | null;
  current_content_id: string | null;
  storage_available: number | null;
  activation_code: string | null;
  activation_expires_at: string | null;
  device_token_hash: string | null;
  activated_at: string | null;
  created_at: string;
}

export type MediaAssetRow = {
  id: string;
  title: string;
  description: string;
  type: MediaType;
  storage_path: string;
  thumbnail_path: string | null;
  subtitle_path: string | null;
  mime_type: string | null;
  file_size: number | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  checksum: string | null;
  status: MediaStatus;
  created_by: string | null;
  created_at: string;
}

export type InstitutionSettingsRow = {
  singleton: boolean;
  university_name: string;
  vicerrectorate_name: string;
  logo_primary_path: string | null;
  logo_secondary_path: string | null;
  phones: string[];
  email: string;
  location: string;
  social: string[];
  ticker_label: string;
  ticker_text: string;
  updated_at: string;
  updated_by: string | null;
}

export type TemplateRow = {
  id: string;
  name: string;
  view_number: number;
  category: string;
  schema: Json;
  active: boolean;
  created_at: string;
}

export type ContentItemRow = {
  id: string;
  template_id: string;
  title: string;
  content_data: Json;
  media_asset_id: string | null;
  status: ContentStatus;
  priority: number;
  created_by: string | null;
  approved_by: string | null;
  created_at: string;
  approved_at: string | null;
}

export type PlaylistRow = {
  id: string;
  name: string;
  description: string;
  status: PlaylistStatus;
  version: number;
  total_duration: number;
  official_start_at: string | null;
  created_by: string | null;
  created_at: string;
}

export type PlaylistItemRow = {
  id: string;
  playlist_id: string;
  content_item_id: string;
  position: number;
  duration_seconds: number;
  muted: boolean;
  transition: string;
}

export type ScheduleRow = {
  id: string;
  playlist_id: string;
  screen_group_id: string;
  start_at: string | null;
  end_at: string | null;
  days_of_week: number[];
  daily_start_time: string | null;
  daily_end_time: string | null;
  priority: number;
  active: boolean;
  created_at: string;
}

export type EmergencyMessageRow = {
  id: string;
  title: string;
  message: string;
  instructions: string;
  severity: EmergencySeverity;
  start_at: string;
  end_at: string | null;
  active: boolean;
  created_by: string | null;
  created_at: string;
}

export type PlayerManifestRow = {
  id: string;
  playlist_id: string;
  version: number;
  manifest_data: Json;
  checksum: string | null;
  created_at: string;
}

export type ScreenHeartbeatRow = {
  id: string;
  screen_id: string;
  current_content_id: string | null;
  current_position_seconds: number;
  playlist_version: number | null;
  connection_status: ConnectionStatus;
  reported_at: string;
}

export type PlaybackEventRow = {
  id: string;
  screen_id: string;
  content_item_id: string | null;
  event_type: PlaybackEventType;
  started_at: string | null;
  ended_at: string | null;
  error_code: string | null;
  created_at: string;
}

export type AuditLogRow = {
  id: string;
  user_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  previous_data: Json | null;
  new_data: Json | null;
  created_at: string;
}

type Insertable<Row, Required extends keyof Row, Auto extends keyof Row> = Omit<
  Partial<Row>,
  Required | Auto
> &
  Pick<Row, Required> &
  Partial<Pick<Row, Auto>>;

export interface Database {
  public: {
    Tables: {
      profiles: TableConfig<
        ProfileRow,
        Insertable<ProfileRow, "id", "created_at" | "full_name" | "role" | "active">,
        Partial<ProfileRow>
      >;
      screen_groups: TableConfig<
        ScreenGroupRow,
        Insertable<ScreenGroupRow, "name", "id" | "created_at" | "description" | "active">,
        Partial<ScreenGroupRow>
      >;
      screens: TableConfig<
        ScreenRow,
        Insertable<ScreenRow, "name" | "code", "id" | "created_at">,
        Partial<ScreenRow>
      >;
      screen_group_members: TableConfig<
        { screen_id: string; group_id: string },
        { screen_id: string; group_id: string },
        Partial<{ screen_id: string; group_id: string }>
      >;
      media_assets: TableConfig<
        MediaAssetRow,
        Insertable<MediaAssetRow, "title" | "type" | "storage_path", "id" | "created_at">,
        Partial<MediaAssetRow>
      >;
      institution_settings: TableConfig<
        InstitutionSettingsRow,
        Insertable<InstitutionSettingsRow, never, "singleton" | "updated_at">,
        Partial<InstitutionSettingsRow>
      >;
      templates: TableConfig<
        TemplateRow,
        Insertable<TemplateRow, "name" | "view_number", "id" | "created_at">,
        Partial<TemplateRow>
      >;
      content_items: TableConfig<
        ContentItemRow,
        Insertable<ContentItemRow, "template_id" | "title", "id" | "created_at">,
        Partial<ContentItemRow>
      >;
      playlists: TableConfig<
        PlaylistRow,
        Insertable<PlaylistRow, "name", "id" | "created_at">,
        Partial<PlaylistRow>
      >;
      playlist_items: TableConfig<
        PlaylistItemRow,
        Insertable<PlaylistItemRow, "playlist_id" | "content_item_id" | "position", "id">,
        Partial<PlaylistItemRow>
      >;
      schedules: TableConfig<
        ScheduleRow,
        Insertable<ScheduleRow, "playlist_id" | "screen_group_id", "id" | "created_at">,
        Partial<ScheduleRow>
      >;
      emergency_messages: TableConfig<
        EmergencyMessageRow,
        Insertable<EmergencyMessageRow, "title" | "message", "id" | "created_at" | "start_at">,
        Partial<EmergencyMessageRow>
      >;
      player_manifests: TableConfig<
        PlayerManifestRow,
        Insertable<PlayerManifestRow, "playlist_id" | "version", "id" | "created_at">,
        Partial<PlayerManifestRow>
      >;
      screen_heartbeats: TableConfig<
        ScreenHeartbeatRow,
        Insertable<ScreenHeartbeatRow, "screen_id", "id" | "reported_at">,
        Partial<ScreenHeartbeatRow>
      >;
      playback_events: TableConfig<
        PlaybackEventRow,
        Insertable<PlaybackEventRow, "screen_id" | "event_type", "id" | "created_at">,
        Partial<PlaybackEventRow>
      >;
      audit_logs: TableConfig<
        AuditLogRow,
        Insertable<AuditLogRow, "action" | "entity_type", "id" | "created_at">,
        Partial<AuditLogRow>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: UserRole;
      media_type: MediaType;
      content_status: ContentStatus;
      media_status: MediaStatus;
      playlist_status: PlaylistStatus;
      screen_status: ScreenStatus;
      connection_status: ConnectionStatus;
      screen_orientation: ScreenOrientation;
      emergency_severity: EmergencySeverity;
      playback_event_type: PlaybackEventType;
    };
  };
}
