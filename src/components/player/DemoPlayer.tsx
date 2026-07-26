"use client";

import { useEffect, useState } from "react";
import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { ViewRenderer, isBareView } from "@/components/views/ViewRenderer";
import { SAMPLE_VIEWS } from "@/lib/views/samples";
import { computePosition, type SyncItem } from "@/lib/player/sync";

/** Duración por vista en la playlist de demostración (segundos). */
const ITEM_SECONDS = 12;

/**
 * Reproductor de demostración. Recorre las plantillas de ejemplo calculando la
 * posición con el motor de sincronización por hora oficial: dos pantallas
 * abiertas en momentos distintos muestran el mismo contenido.
 *
 * La hora oficial se ancla al inicio del día UTC para que sea idéntica en todos
 * los dispositivos sin depender de un backend.
 */
const SYNC_ITEMS: SyncItem[] = SAMPLE_VIEWS.map((_, i) => ({
  id: String(i),
  durationSeconds: ITEM_SECONDS,
}));

function officialStartOfDay(): number {
  const now = new Date();
  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

export function DemoPlayer() {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    const officialStart = officialStartOfDay();
    const tick = () => {
      const position = computePosition(SYNC_ITEMS, officialStart, Date.now());
      setIndex(position ? position.index : 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Antes de la hidratación mostramos la primera vista para evitar pantalla negra.
  const content = SAMPLE_VIEWS[index ?? 0];
  const bare = isBareView(content);

  return (
    <div className="kiosk-root">
      <ScreenFrame bare={bare}>
        <ViewRenderer content={content} />
      </ScreenFrame>
    </div>
  );
}
