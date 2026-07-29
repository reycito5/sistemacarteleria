-- ============================================================================
-- SICD UABJB POSGRADO — Migración 0005: Realtime del monitoreo
-- ----------------------------------------------------------------------------
-- Publica en Realtime las tablas de telemetría para que el Centro de pantallas
-- se actualice por push (sin sondeo). Idempotente: ignora si ya están añadidas.
-- ============================================================================

do $$
begin
  begin
    alter publication supabase_realtime add table screens;
  exception
    when duplicate_object then null;
    when others then null;
  end;

  begin
    alter publication supabase_realtime add table screen_heartbeats;
  exception
    when duplicate_object then null;
    when others then null;
  end;
end $$;
