-- ============================================================================
-- SICD UABJB POSGRADO — Migración 0008: endurecer las funciones del esquema
-- ----------------------------------------------------------------------------
-- Corrige los avisos del linter de seguridad de Supabase sobre las funciones
-- de `public`. Ninguna de estas correcciones cambia el comportamiento de la
-- aplicación: sólo cierra superficie de ataque.
--
--  1. `search_path` fijo en las funciones que usan las políticas RLS. Sin él,
--     quien invoca la consulta podría anteponer un esquema propio y hacer que
--     `profiles` resuelva a otra tabla, alterando el resultado de los permisos.
--
--  2. Se retira `EXECUTE` al rol `anon`. OJO: Postgres concede estas funciones
--     a través del rol PUBLIC, del que `anon` hereda, así que revocar sólo a
--     `anon` NO surte efecto. Hay que retirar el privilegio a PUBLIC y volver
--     a concederlo a los roles que sí lo necesitan.
--
--  3. `handle_new_user()` es una función de disparador con SECURITY DEFINER y
--     estaba expuesta en la API REST (`/rest/v1/rpc/handle_new_user`). El
--     disparador sigue funcionando: se ejecuta como propietario de la tabla,
--     no a través de los permisos del llamante.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. search_path explícito
-- ---------------------------------------------------------------------------
alter function public.is_staff () set search_path = public;
alter function public.can_publish () set search_path = public;
alter function public.is_superadmin () set search_path = public;

-- ---------------------------------------------------------------------------
-- 2. Retirar el acceso anónimo a las funciones de permisos
-- ---------------------------------------------------------------------------
-- Las políticas RLS que las usan son `to authenticated`, de modo que ese rol
-- conserva EXECUTE y todo el panel sigue operando igual. Se comprobó que
-- ninguna política aplicable a `anon` las utiliza.
revoke execute on function public.auth_role () from public;
revoke execute on function public.is_staff () from public;
revoke execute on function public.can_publish () from public;
revoke execute on function public.is_superadmin () from public;

grant execute on function public.auth_role () to authenticated, service_role;
grant execute on function public.is_staff () to authenticated, service_role;
grant execute on function public.can_publish () to authenticated, service_role;
grant execute on function public.is_superadmin () to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- 3. Sacar la función de disparador de la API pública
-- ---------------------------------------------------------------------------
revoke execute on function public.handle_new_user () from public;

-- ---------------------------------------------------------------------------
-- Notas sobre lo que queda deliberadamente abierto
-- ---------------------------------------------------------------------------
-- · `auth_role()` sigue siendo invocable por `authenticated`, y el linter lo
--   señala. Es intencional: las políticas RLS la evalúan con el rol de quien
--   consulta, así que retirársela rompería el panel. Sólo devuelve el rol del
--   propio llamante, de modo que no expone información ajena.
--
-- · La protección contra contraseñas filtradas (HaveIBeenPwned) no se
--   configura por SQL. Se activa en el panel de Supabase:
--     Authentication → Providers → Email → Leaked password protection.
-- ---------------------------------------------------------------------------
