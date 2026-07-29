-- ============================================================================
-- SICD UABJB POSGRADO — Migración 0003: datos iniciales institucionales
-- ----------------------------------------------------------------------------
-- Grupo general, las 16 plantillas del catálogo y las 4 pantallas base.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Grupo institucional único
-- ---------------------------------------------------------------------------
insert into screen_groups (name, description)
values (
  'PANTALLAS GENERALES POSGRADO',
  'Grupo institucional único. Las cuatro pantallas comparten la misma programación.'
)
on conflict (name) do nothing;

-- ---------------------------------------------------------------------------
-- Las 16 vistas como plantillas institucionales (secciones 10 y 11)
-- ---------------------------------------------------------------------------
insert into templates (view_number, name, category, schema) values
  (1,  'Programación general',        'programacion', '{}'),
  (2,  'Agenda académica',            'agenda',       '{}'),
  (3,  'Programa destacado',          'programa',     '{}'),
  (4,  'Noticias y logros',           'noticias',     '{}'),
  (5,  'Comunicado importante',       'comunicado',   '{}'),
  (6,  'Próximos inicios',            'programacion', '{}'),
  (7,  'Bienvenida y orientación',    'institucional','{}'),
  (8,  'Actividades del día',         'agenda',       '{}'),
  (9,  'Reconocimientos',             'noticias',     '{}'),
  (10, 'Transmisión o evento en vivo','evento',       '{}'),
  (11, 'Testimonios',                 'testimonio',   '{}'),
  (12, 'Mensaje institucional',       'institucional','{}'),
  (13, 'Sin conexión',                'tecnica',      '{}'),
  (14, 'Sincronización',              'tecnica',      '{}'),
  (15, 'Mantenimiento',               'tecnica',      '{}'),
  (16, 'Emergencia institucional',    'emergencia',   '{}')
on conflict (view_number) do nothing;

-- ---------------------------------------------------------------------------
-- Cuatro pantallas base, asignadas al grupo general
-- ---------------------------------------------------------------------------
insert into screens (name, code, location) values
  ('Pantalla 1 — Recepción',      'REC-01', 'Recepción'),
  ('Pantalla 2 — Pasillo principal','PAS-01', 'Pasillo principal'),
  ('Pantalla 3 — Auditorio',      'AUD-01', 'Auditorio / Sala académica'),
  ('Pantalla 4 — Administración', 'ADM-01', 'Área administrativa')
on conflict (code) do nothing;

-- Vincular las cuatro pantallas al grupo general
insert into screen_group_members (screen_id, group_id)
select s.id, g.id
from screens s
cross join screen_groups g
where g.name = 'PANTALLAS GENERALES POSGRADO'
  and s.code in ('REC-01', 'PAS-01', 'AUD-01', 'ADM-01')
on conflict do nothing;
