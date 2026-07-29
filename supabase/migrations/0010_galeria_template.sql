-- ============================================================================
-- SICD UABJB POSGRADO — Migración 0010: plantilla «Galería institucional»
-- ----------------------------------------------------------------------------
-- Nueva vista 17: álbum curado de imágenes a pantalla completa con efectos
-- cinematográficos (Ken Burns + fundido cruzado). Se registra como plantilla
-- para poder crear contenido de este tipo desde el panel y añadirlo a la
-- playlist.
-- ============================================================================

insert into templates (view_number, name, category, schema)
values (17, 'Galería institucional', 'galeria', '{}')
on conflict (view_number) do nothing;
