"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { ViewRenderer, isBareView } from "@/components/views/ViewRenderer";
import { EmergenciaView } from "@/components/views/EmergenciaView";
import { SincronizacionView } from "@/components/views/SincronizacionView";
import { computePosition, type SyncItem } from "@/lib/player/sync";
import { loadCachedManifest, saveManifest } from "@/lib/player/cache";
import type { PlayerManifest } from "@/lib/player/manifest";

const MANIFEST_REFRESH_MS = 60_000;
const HEARTBEAT_MS = 20_000;

interface PlayerClientProps {
  /** Código de la pantalla (para telemetría). Ej: REC-01 */
  screenCode?: string;
}

/**
 * Reproductor institucional (Fases 5/6/7/8).
 *
 *  - Offline-first: arranca desde la caché local y refresca el manifiesto.
 *  - Sincronización por hora oficial: todas las pantallas coinciden (1–3 s).
 *  - Prioridad absoluta de emergencia (sección 16).
 *  - Heartbeats periódicos (sección 27). Nunca deja la pantalla en negro.
 */
export function PlayerClient({ screenCode }: PlayerClientProps) {
  const [manifest, setManifest] = useState<PlayerManifest | null>(null);
  const [index, setIndex] = useState(0);
  const [online, setOnline] = useState(true);
  const manifestRef = useRef<PlayerManifest | null>(null);
  const indexRef = useRef(0);

  // Offline-first: parte de la caché local y refresca el manifiesto de red.
  useEffect(() => {
    let cancelled = false;

    const applyManifest = (next: PlayerManifest) => {
      if (cancelled) return;
      manifestRef.current = next;
      setManifest(next);
    };

    const fetchManifest = async () => {
      try {
        const res = await fetch("/api/player/manifest", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const next = (await res.json()) as PlayerManifest;
        applyManifest(next);
        setOnline(true);
        saveManifest(next);
      } catch {
        if (!cancelled) setOnline(false); // sigue reproduciendo desde caché
      }
    };

    const start = async () => {
      const cached = loadCachedManifest();
      if (cached) applyManifest(cached); // evita pantalla negra al arrancar
      await fetchManifest();
    };

    start();
    const id = setInterval(fetchManifest, MANIFEST_REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Bucle de sincronización (1 s).
  useEffect(() => {
    const tick = () => {
      const m = manifestRef.current;
      if (!m || m.items.length === 0) return;
      const syncItems: SyncItem[] = m.items.map((it) => ({
        id: it.id,
        durationSeconds: it.durationSeconds,
      }));
      const pos = computePosition(syncItems, m.officialStartAt, Date.now());
      const next = pos ? pos.index : 0;
      indexRef.current = next;
      setIndex(next);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Heartbeats de estado (sección 27).
  const sendHeartbeat = useCallback(async () => {
    if (!screenCode) return;
    const m = manifestRef.current;
    const current = m?.items[indexRef.current];
    try {
      await fetch("/api/heartbeat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          screenCode,
          currentContentId: current?.contentItemId ?? null,
          currentPositionSeconds: 0,
          playlistVersion: m?.version ?? null,
          connectionStatus: online ? "online" : "offline",
        }),
      });
    } catch {
      // La pérdida de red no debe afectar la reproducción.
    }
  }, [screenCode, online]);

  useEffect(() => {
    if (!screenCode) return;
    sendHeartbeat();
    const id = setInterval(sendHeartbeat, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [screenCode, sendHeartbeat]);

  // --- Render -------------------------------------------------------------
  // 1) Emergencia: prioridad absoluta.
  if (manifest?.emergency) {
    return (
      <div className="kiosk-root">
        <ScreenFrame bare>
          <EmergenciaView content={manifest.emergency} />
        </ScreenFrame>
      </div>
    );
  }

  // 2) Sin manifiesto todavía: vista de sincronización (nunca negro).
  if (!manifest || manifest.items.length === 0) {
    return (
      <div className="kiosk-root">
        <ScreenFrame bare>
          <SincronizacionView
            content={{
              kind: "sincronizacion",
              steps: [
                "Descargando contenidos",
                "Verificando videos",
                "Actualizando agenda",
                "Sincronizando programación",
              ],
            }}
          />
        </ScreenFrame>
      </div>
    );
  }

  // 3) Programación normal.
  const item = manifest.items[Math.min(index, manifest.items.length - 1)];
  const bare = isBareView(item.content);

  return (
    <div className="kiosk-root">
      <ScreenFrame bare={bare}>
        <ViewRenderer content={item.content} />
      </ScreenFrame>
      {!online && (
        <div className="pointer-events-none absolute right-3 top-3 rounded bg-black/60 px-3 py-1 text-xs font-bold text-white">
          Sin conexión · reproduciendo local
        </div>
      )}
    </div>
  );
}
