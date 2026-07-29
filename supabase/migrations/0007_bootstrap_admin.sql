-- ============================================================================
-- SICD UABJB POSGRADO — Migración 0007: arranque del primer administrador
-- ----------------------------------------------------------------------------
-- Antes, todo usuario nuevo recibía el rol 'observador' (solo lectura), por lo
-- que un despliegue recién creado no tenía ningún administrador y el panel se
-- veía vacío / sin permisos. Esta migración resuelve el arranque:
--
--   1. El PRIMER usuario que se registra (cuando aún no existe ningún perfil)
--      se convierte automáticamente en 'superadmin'. Los siguientes usuarios
--      siguen entrando como 'observador'.
--   2. Se añade el ayudante promote_to_superadmin(email) para elevar a otros
--      usuarios desde el editor SQL de Supabase con una sola llamada.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Crear perfil al registrarse; el primer usuario del sistema es superadmin.
-- ---------------------------------------------------------------------------
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  assigned_role user_role;
begin
  -- Si todavía no existe ningún perfil, este es el administrador fundador.
  if not exists (select 1 from public.profiles) then
    assigned_role := 'superadmin';
  else
    assigned_role := 'observador';
  end if;

  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    assigned_role
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- El trigger on_auth_user_created ya apunta a esta función (migración 0002);
-- basta con reemplazar el cuerpo de la función.

-- ---------------------------------------------------------------------------
-- Ayudante: promover un usuario existente a superadmin por su correo.
-- Uso (editor SQL de Supabase):  select promote_to_superadmin('correo@dominio');
-- ---------------------------------------------------------------------------
create or replace function promote_to_superadmin(user_email text)
returns text
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  target_id uuid;
begin
  select id into target_id from auth.users where email = lower(user_email);

  if target_id is null then
    return 'No existe ningún usuario con el correo ' || user_email;
  end if;

  insert into public.profiles (id, role, active)
  values (target_id, 'superadmin', true)
  on conflict (id) do update
    set role = 'superadmin', active = true;

  return 'Usuario ' || user_email || ' promovido a superadmin.';
end;
$$;

revoke all on function promote_to_superadmin(text) from public, anon, authenticated;
