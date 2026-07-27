-- ============================================================================
-- SICD UABJB POSGRADO — Migración 0006: endurecer Storage con URLs firmadas
-- ----------------------------------------------------------------------------
-- Hace privado el bucket de medios (sección 29). El acceso se hace mediante
-- URLs firmadas generadas en el servidor: los reproductores usan clave de
-- servicio; el panel firma con la sesión del personal.
-- ============================================================================

update storage.buckets set public = false where id = 'media';

-- Retira la lectura pública.
drop policy if exists "media: lectura pública" on storage.objects;

-- Permite que el personal (con sesión) genere URLs firmadas / previsualice.
create policy "media: lectura staff"
  on storage.objects for select to authenticated
  using (bucket_id = 'media' and public.is_staff ());
