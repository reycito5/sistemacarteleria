-- ============================================================================
-- SICD UABJB POSGRADO — Migración 0002: Row Level Security y funciones
-- ----------------------------------------------------------------------------
-- RLS activa desde el inicio (secciones 29 y 34). Roles según sección 19.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Funciones auxiliares de autorización
-- ---------------------------------------------------------------------------
create or replace function auth_role()
returns user_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles where id = auth.uid () and active = true;
$$;

create or replace function is_staff()
returns boolean
language sql
stable
as $$
  select auth_role () in (
    'superadmin', 'admin_comunicacion', 'editor', 'operador_tecnico'
  );
$$;

-- Puede publicar / aprobar contenido
create or replace function can_publish()
returns boolean
language sql
stable
as $$
  select auth_role () in ('superadmin', 'admin_comunicacion');
$$;

create or replace function is_superadmin()
returns boolean
language sql
stable
as $$
  select auth_role () = 'superadmin';
$$;

-- ---------------------------------------------------------------------------
-- Crear perfil automáticamente al registrarse un usuario
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    'observador'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user ();

-- ---------------------------------------------------------------------------
-- Activar RLS en todas las tablas
-- ---------------------------------------------------------------------------
alter table profiles enable row level security;
alter table screen_groups enable row level security;
alter table screens enable row level security;
alter table screen_group_members enable row level security;
alter table media_assets enable row level security;
alter table templates enable row level security;
alter table content_items enable row level security;
alter table playlists enable row level security;
alter table playlist_items enable row level security;
alter table schedules enable row level security;
alter table emergency_messages enable row level security;
alter table player_manifests enable row level security;
alter table screen_heartbeats enable row level security;
alter table playback_events enable row level security;
alter table audit_logs enable row level security;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create policy "profiles: leer propio o staff"
  on profiles for select to authenticated
  using (id = auth.uid () or is_staff ());

create policy "profiles: superadmin gestiona"
  on profiles for all to authenticated
  using (is_superadmin ()) with check (is_superadmin ());

-- ---------------------------------------------------------------------------
-- Catálogo de lectura para personal autenticado
-- ---------------------------------------------------------------------------
create policy "screen_groups: lectura staff"
  on screen_groups for select to authenticated using (is_staff ());
create policy "screen_groups: gestion publish"
  on screen_groups for all to authenticated
  using (can_publish ()) with check (can_publish ());

create policy "screens: lectura staff"
  on screens for select to authenticated using (is_staff ());
create policy "screens: gestion tecnica"
  on screens for all to authenticated
  using (auth_role () in ('superadmin', 'operador_tecnico'))
  with check (auth_role () in ('superadmin', 'operador_tecnico'));

create policy "screen_group_members: lectura staff"
  on screen_group_members for select to authenticated using (is_staff ());
create policy "screen_group_members: gestion"
  on screen_group_members for all to authenticated
  using (auth_role () in ('superadmin', 'operador_tecnico', 'admin_comunicacion'))
  with check (auth_role () in ('superadmin', 'operador_tecnico', 'admin_comunicacion'));

-- ---------------------------------------------------------------------------
-- media_assets: staff lee; editores+ crean; publish gestiona
-- ---------------------------------------------------------------------------
create policy "media: lectura staff"
  on media_assets for select to authenticated using (is_staff ());
create policy "media: crear staff"
  on media_assets for insert to authenticated with check (is_staff ());
create policy "media: actualizar publish o autor"
  on media_assets for update to authenticated
  using (can_publish () or created_by = auth.uid ())
  with check (can_publish () or created_by = auth.uid ());
create policy "media: borrar publish"
  on media_assets for delete to authenticated using (can_publish ());

-- ---------------------------------------------------------------------------
-- templates: lectura staff; solo superadmin modifica (línea gráfica bloqueada)
-- ---------------------------------------------------------------------------
create policy "templates: lectura staff"
  on templates for select to authenticated using (is_staff ());
create policy "templates: gestion superadmin"
  on templates for all to authenticated
  using (is_superadmin ()) with check (is_superadmin ());

-- ---------------------------------------------------------------------------
-- content_items: editores crean/editan borradores; publish aprueba/publica
-- ---------------------------------------------------------------------------
create policy "content: lectura staff"
  on content_items for select to authenticated using (is_staff ());
create policy "content: crear staff"
  on content_items for insert to authenticated
  with check (is_staff () and created_by = auth.uid ());
create policy "content: editar borrador autor o publish"
  on content_items for update to authenticated
  using (
    can_publish ()
    or (created_by = auth.uid () and status in ('borrador', 'en_revision'))
  )
  with check (
    can_publish ()
    or (created_by = auth.uid () and status in ('borrador', 'en_revision'))
  );
create policy "content: borrar publish"
  on content_items for delete to authenticated using (can_publish ());

-- ---------------------------------------------------------------------------
-- playlists / playlist_items: publish gestiona; staff lee
-- ---------------------------------------------------------------------------
create policy "playlists: lectura staff"
  on playlists for select to authenticated using (is_staff ());
create policy "playlists: gestion publish"
  on playlists for all to authenticated
  using (can_publish ()) with check (can_publish ());

create policy "playlist_items: lectura staff"
  on playlist_items for select to authenticated using (is_staff ());
create policy "playlist_items: gestion publish"
  on playlist_items for all to authenticated
  using (can_publish ()) with check (can_publish ());

-- ---------------------------------------------------------------------------
-- schedules: publish gestiona
-- ---------------------------------------------------------------------------
create policy "schedules: lectura staff"
  on schedules for select to authenticated using (is_staff ());
create policy "schedules: gestion publish"
  on schedules for all to authenticated
  using (can_publish ()) with check (can_publish ());

-- ---------------------------------------------------------------------------
-- emergency_messages: solo superadmin y admin_comunicacion (confirmación
-- especial). Staff puede leer las activas.
-- ---------------------------------------------------------------------------
create policy "emergencias: lectura staff"
  on emergency_messages for select to authenticated using (is_staff ());
create policy "emergencias: gestion publish"
  on emergency_messages for all to authenticated
  using (can_publish ()) with check (can_publish ());

-- ---------------------------------------------------------------------------
-- player_manifests: publish genera; staff lee
-- ---------------------------------------------------------------------------
create policy "manifests: lectura staff"
  on player_manifests for select to authenticated using (is_staff ());
create policy "manifests: gestion publish"
  on player_manifests for all to authenticated
  using (can_publish ()) with check (can_publish ());

-- ---------------------------------------------------------------------------
-- Telemetría de pantallas: staff lee. La escritura de reproductores se hace
-- vía Route Handler con service role (no clientes con RLS).
-- ---------------------------------------------------------------------------
create policy "heartbeats: lectura staff"
  on screen_heartbeats for select to authenticated using (is_staff ());
create policy "playback_events: lectura staff"
  on playback_events for select to authenticated using (is_staff ());

-- ---------------------------------------------------------------------------
-- audit_logs: solo lectura para superadmin. La escritura es por triggers /
-- service role (security definer), no directa.
-- ---------------------------------------------------------------------------
create policy "audit: lectura superadmin"
  on audit_logs for select to authenticated using (is_superadmin ());
