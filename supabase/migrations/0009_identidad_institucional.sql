-- ============================================================================
-- SICD UABJB POSGRADO — Migración 0009: identidad institucional editable
-- ----------------------------------------------------------------------------
-- Hasta ahora la cabecera y el pie de las pantallas estaban escritos en el
-- código. Esta tabla los saca al panel: logos, nombre de la institución,
-- contactos, redes y el texto del rótulo inferior se editan desde
-- «Identidad institucional» sin tocar el repositorio.
--
-- Es una tabla de fila única: `singleton` está forzado a true y es la clave
-- primaria, de modo que la base de datos impide que existan dos identidades.
-- ============================================================================

create table institution_settings (
  singleton boolean primary key default true,
  constraint institution_settings_una_fila check (singleton),

  -- Identidad
  university_name text not null default 'Universidad Autónoma del Beni "José Ballivián"',
  vicerrectorate_name text not null default 'Vicerrectorado de Posgrado',

  -- Logos: rutas dentro del bucket `media`. Nulo = se dibuja el monograma.
  logo_primary_path text,
  logo_secondary_path text,

  -- Pie de las pantallas
  phones text[] not null default array['61948267', '72814772'],
  email text not null default 'escuelaposgrado@uabjb.edu.bo',
  location text not null default 'Zona Virgen de Loreto, Trinidad',
  social text[] not null default array['Facebook', 'Instagram', 'YouTube'],

  -- Rótulo inferior desplazable
  ticker_label text not null default 'Posgrado UABJB',
  ticker_text text not null default 'Formar posgraduados con pertinencia amazónica es nuestro compromiso.',

  updated_at timestamptz not null default now(),
  updated_by uuid references profiles (id)
);

-- Fila única inicial con los valores por defecto.
insert into institution_settings (singleton) values (true)
on conflict (singleton) do nothing;

-- ---------------------------------------------------------------------------
-- RLS: lectura para cualquiera (los reproductores la necesitan sin sesión),
-- escritura sólo para quien puede publicar.
-- ---------------------------------------------------------------------------
alter table institution_settings enable row level security;

create policy "identidad: lectura pública"
  on institution_settings for select
  using (true);

create policy "identidad: editar publish"
  on institution_settings for update to authenticated
  using (public.can_publish ())
  with check (public.can_publish ());
