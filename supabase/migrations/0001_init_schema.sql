-- ============================================================================
-- SICD UABJB POSGRADO — Migración 0001: esquema institucional
-- ----------------------------------------------------------------------------
-- Modelo de datos completo (sección 21 del prompt maestro). Una sola playlist
-- institucional activa; cuatro pantallas en un único grupo general.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Tipos enumerados
-- ---------------------------------------------------------------------------
create type user_role as enum (
  'superadmin',
  'admin_comunicacion',
  'editor',
  'operador_tecnico',
  'observador'
);

create type media_type as enum ('video', 'image');

-- Flujo de aprobación (sección 20)
create type content_status as enum (
  'borrador',
  'en_revision',
  'aprobado',
  'programado',
  'publicado',
  'finalizado',
  'archivado'
);

create type media_status as enum ('pendiente', 'validado', 'rechazado', 'archivado');

create type playlist_status as enum ('borrador', 'activa', 'archivada');

-- Estados de pantalla (sección 27)
create type screen_status as enum (
  'en_linea',
  'desconectada',
  'sincronizando',
  'reproduciendo',
  'mantenimiento',
  'error',
  'offline'
);

create type connection_status as enum ('online', 'offline', 'sincronizando');

create type screen_orientation as enum ('horizontal', 'vertical');

create type emergency_severity as enum ('alerta', 'urgente', 'critico');

create type playback_event_type as enum (
  'inicio',
  'fin',
  'error',
  'omitido',
  'emergencia'
);

-- ---------------------------------------------------------------------------
-- profiles: extiende auth.users con rol institucional
-- ---------------------------------------------------------------------------
create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  role user_role not null default 'observador',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- screen_groups + pertenencia
-- ---------------------------------------------------------------------------
create table screen_groups (
  id uuid primary key default gen_random_uuid (),
  name text not null unique,
  description text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table screens (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  code text not null unique,
  location text not null default '',
  resolution text not null default '1920x1080',
  orientation screen_orientation not null default 'horizontal',
  status screen_status not null default 'desconectada',
  last_seen_at timestamptz,
  player_version text,
  playlist_version integer,
  current_content_id uuid,
  storage_available bigint,
  -- Token de activación / credencial individual del reproductor (sección 22)
  activation_code text,
  activation_expires_at timestamptz,
  device_token_hash text,
  activated_at timestamptz,
  created_at timestamptz not null default now()
);

create table screen_group_members (
  screen_id uuid not null references screens (id) on delete cascade,
  group_id uuid not null references screen_groups (id) on delete cascade,
  primary key (screen_id, group_id)
);

-- ---------------------------------------------------------------------------
-- media_assets: biblioteca multimedia
-- ---------------------------------------------------------------------------
create table media_assets (
  id uuid primary key default gen_random_uuid (),
  title text not null,
  description text not null default '',
  type media_type not null,
  storage_path text not null,
  thumbnail_path text,
  subtitle_path text,
  mime_type text,
  file_size bigint,
  width integer,
  height integer,
  duration_seconds numeric(10, 2),
  checksum text,
  status media_status not null default 'pendiente',
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- templates: las 16 vistas como plantillas institucionales
-- ---------------------------------------------------------------------------
create table templates (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  view_number integer not null unique,
  category text not null default '',
  -- Campos editables por el administrador (títulos, textos, fechas, QR...)
  schema jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- content_items: instancias de contenido sobre una plantilla
-- ---------------------------------------------------------------------------
create table content_items (
  id uuid primary key default gen_random_uuid (),
  template_id uuid not null references templates (id),
  title text not null,
  content_data jsonb not null default '{}'::jsonb,
  media_asset_id uuid references media_assets (id),
  status content_status not null default 'borrador',
  priority integer not null default 50,
  created_by uuid references profiles (id),
  approved_by uuid references profiles (id),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

-- ---------------------------------------------------------------------------
-- playlists + items (una sola playlist institucional activa)
-- ---------------------------------------------------------------------------
create table playlists (
  id uuid primary key default gen_random_uuid (),
  name text not null,
  description text not null default '',
  status playlist_status not null default 'borrador',
  version integer not null default 1,
  total_duration integer not null default 0,
  -- Hora oficial de inicio para el cálculo de sincronización (sección 14)
  official_start_at timestamptz,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

create table playlist_items (
  id uuid primary key default gen_random_uuid (),
  playlist_id uuid not null references playlists (id) on delete cascade,
  content_item_id uuid not null references content_items (id),
  position integer not null,
  duration_seconds integer not null default 15,
  muted boolean not null default true,
  transition text not null default 'corte',
  unique (playlist_id, position)
);

-- ---------------------------------------------------------------------------
-- schedules: calendario de programación por grupo
-- ---------------------------------------------------------------------------
create table schedules (
  id uuid primary key default gen_random_uuid (),
  playlist_id uuid not null references playlists (id) on delete cascade,
  screen_group_id uuid not null references screen_groups (id) on delete cascade,
  start_at timestamptz,
  end_at timestamptz,
  days_of_week smallint[] not null default '{}',
  daily_start_time time,
  daily_end_time time,
  priority integer not null default 50,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- emergency_messages: prioridad absoluta (sección 16)
-- ---------------------------------------------------------------------------
create table emergency_messages (
  id uuid primary key default gen_random_uuid (),
  title text not null,
  message text not null,
  instructions text not null default '',
  severity emergency_severity not null default 'urgente',
  start_at timestamptz not null default now(),
  end_at timestamptz,
  active boolean not null default false,
  created_by uuid references profiles (id),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- player_manifests: manifiesto de archivos para funcionamiento offline
-- ---------------------------------------------------------------------------
create table player_manifests (
  id uuid primary key default gen_random_uuid (),
  playlist_id uuid not null references playlists (id) on delete cascade,
  version integer not null,
  manifest_data jsonb not null default '{}'::jsonb,
  checksum text,
  created_at timestamptz not null default now(),
  unique (playlist_id, version)
);

-- ---------------------------------------------------------------------------
-- screen_heartbeats: latidos de estado de cada pantalla (sección 27)
-- ---------------------------------------------------------------------------
create table screen_heartbeats (
  id uuid primary key default gen_random_uuid (),
  screen_id uuid not null references screens (id) on delete cascade,
  current_content_id uuid references content_items (id),
  current_position_seconds numeric(10, 2) not null default 0,
  playlist_version integer,
  connection_status connection_status not null default 'online',
  reported_at timestamptz not null default now()
);

create index screen_heartbeats_screen_time_idx
  on screen_heartbeats (screen_id, reported_at desc);

-- ---------------------------------------------------------------------------
-- playback_events: registro de reproducciones y errores (sección 28)
-- ---------------------------------------------------------------------------
create table playback_events (
  id uuid primary key default gen_random_uuid (),
  screen_id uuid not null references screens (id) on delete cascade,
  content_item_id uuid references content_items (id),
  event_type playback_event_type not null,
  started_at timestamptz,
  ended_at timestamptz,
  error_code text,
  created_at timestamptz not null default now()
);

create index playback_events_screen_time_idx
  on playback_events (screen_id, created_at desc);

-- ---------------------------------------------------------------------------
-- audit_logs: auditoría (sección 29)
-- ---------------------------------------------------------------------------
create table audit_logs (
  id uuid primary key default gen_random_uuid (),
  user_id uuid references profiles (id),
  action text not null,
  entity_type text not null,
  entity_id uuid,
  previous_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

create index audit_logs_entity_idx on audit_logs (entity_type, entity_id);

-- FK diferida: current_content_id de screens apunta a content_items
alter table screens
  add constraint screens_current_content_fk
  foreign key (current_content_id) references content_items (id)
  on delete set null;
