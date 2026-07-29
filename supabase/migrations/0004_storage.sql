-- ============================================================================
-- SICD UABJB POSGRADO — Migración 0004: almacenamiento (Fase 2)
-- ----------------------------------------------------------------------------
-- Bucket de biblioteca multimedia. Lectura pública para que los reproductores
-- descarguen los archivos sin sesión; escritura restringida al personal por
-- rol. La opción endurecida (URLs firmadas) puede activarse haciendo el bucket
-- privado y generando URLs firmadas en el servidor (sección 29).
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Lectura pública de los archivos del bucket 'media'.
create policy "media: lectura pública"
  on storage.objects for select
  using (bucket_id = 'media');

-- Subida restringida al personal (editores en adelante).
create policy "media: subir staff"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and public.is_staff ());

-- Actualización (reemplazo) por personal.
create policy "media: actualizar staff"
  on storage.objects for update to authenticated
  using (bucket_id = 'media' and public.is_staff ())
  with check (bucket_id = 'media' and public.is_staff ());

-- Borrado solo por quien puede publicar.
create policy "media: borrar publish"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media' and public.can_publish ());
