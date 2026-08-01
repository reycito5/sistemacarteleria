-- ---------------------------------------------------------------------------
-- 0011 — Borrado de contenido sin bloqueos de clave foránea
-- ---------------------------------------------------------------------------
-- Hasta ahora, eliminar un content_item fallaba si estaba referenciado desde
-- playlist_items, screen_heartbeats o playback_events (las tres FKs nacían
-- con NO ACTION). Se ajusta el comportamiento de borrado:
--
--   · playlist_items.content_item_id   -> ON DELETE CASCADE
--       Si el contenido desaparece, su entrada en la lista de reproducción
--       carece de sentido; se retira con él.
--   · screen_heartbeats.current_content_id -> ON DELETE SET NULL
--   · playback_events.content_item_id      -> ON DELETE SET NULL
--       Son bitácoras: se conservan, pero la referencia se anula.
--
-- (screens.current_content_id ya nace como ON DELETE SET NULL en 0001.)
-- ---------------------------------------------------------------------------

-- playlist_items: la entrada se elimina con el contenido.
alter table playlist_items
  drop constraint playlist_items_content_item_id_fkey;
alter table playlist_items
  add constraint playlist_items_content_item_id_fkey
  foreign key (content_item_id) references content_items (id) on delete cascade;

-- screen_heartbeats: bitácora de estado; se anula la referencia.
alter table screen_heartbeats
  drop constraint screen_heartbeats_current_content_id_fkey;
alter table screen_heartbeats
  add constraint screen_heartbeats_current_content_id_fkey
  foreign key (current_content_id) references content_items (id) on delete set null;

-- playback_events: bitácora de reproducción; se anula la referencia.
alter table playback_events
  drop constraint playback_events_content_item_id_fkey;
alter table playback_events
  add constraint playback_events_content_item_id_fkey
  foreign key (content_item_id) references content_items (id) on delete set null;
