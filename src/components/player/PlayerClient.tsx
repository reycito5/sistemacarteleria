"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { ViewRenderer, screenModeFor } from "@/components/views/ViewRenderer";
import { EmergenciaView } from "@/components/views/EmergenciaView";
import { SincronizacionView } from "@/components/views/SincronizacionView";
import { computePosition, type SyncItem } from "@/lib/player/sync";
import { loadCachedManifest, saveManifest } from "@/lib/player/cache";
import {
  collectMediaUrls,
  precacheMedia,
  registerPlayerServiceWorker,
} from "@/lib/player/serviceWorker";
import type { PlayerManifest } from "@/lib/player/manifest";
import { DEFAULT_IDENTITY } from "@/lib/institution/identity";

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
 *  - Alineación inicial por hora oficial y avance por final real de contenido.
 *  - Prioridad absoluta de emergencia (sección 16).
 *  - Heartbeats periódicos (sección 27). Nunca deja la pantalla en negro.
 */
export function PlayerClient({ screenCode }: PlayerClientProps) {
  const [manifest, setManifest] = useState<PlayerManifest | null>(null);
  const [index, setIndex] = useState(0);
  // Distingue cada reproducción aunque la playlist vuelva al mismo índice.
  // Es imprescindible cuando existe una sola plantilla: 0 -> 0 también debe
  // desmontar la vista y reiniciar su cola interna.
  const [playbackCycle, setPlaybackCycle] = useState(0);
  const [online, setOnline] = useState(true);
  const manifestRef = useRef<PlayerManifest | null>(null);
  const indexRef = useRef(0);
  const manifestKeyRef = useRef("");

  // Identidad de la pantalla: prop de la URL o la guardada al activarse.
  const [resolvedCode] = useState<string | undefined>(() => {
    if (screenCode) return screenCode;
    if (typeof window === "undefined") return undefined;
    try {
      return window.localStorage.getItem("sicd.screen.code") ?? undefined;
    } catch {
      return undefined;
    }
  });

  // Credencial individual del dispositivo (se envía en cada latido).
  const [deviceToken] = useState<string | undefined>(() => {
    if (typeof window === "undefined") return undefined;
    try {
      return window.localStorage.getItem("sicd.screen.token") ?? undefined;
    } catch {
      return undefined;
    }
  });

  // Offline-first: parte de la caché local y refresca el manifiesto de red.
  useEffect(() => {
    let cancelled = false;

    const applyManifest = (next: PlayerManifest) => {
      if (cancelled) return;
      manifestRef.current = next;
      setManifest(next);
      const key = `${next.playlistId}:${next.version}`;
      if (manifestKeyRef.current !== key && next.items.length > 0) {
        const syncItems: SyncItem[] = next.items.map((item) => ({
          id: item.id,
          durationSeconds: item.durationSeconds,
        }));
        const initial = computePosition(
          syncItems,
          next.officialStartAt,
          Date.now(),
        );
        const initialIndex = initial?.index ?? 0;
        indexRef.current = initialIndex;
        setIndex(initialIndex);
        manifestKeyRef.current = key;
      }
    };

    const fetchManifest = async () => {
      try {
        const res = await fetch("/api/player/manifest", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const next = (await res.json()) as PlayerManifest;
        applyManifest(next);
        setOnline(true);
        saveManifest(next);
        precacheMedia(collectMediaUrls(next)); // descarga anticipada (offline)
      } catch {
        if (!cancelled) setOnline(false); // sigue reproduciendo desde caché
      }
    };

    const start = async () => {
      registerPlayerServiceWorker();
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

  const advance = useCallback(() => {
    const currentManifest = manifestRef.current;
    if (!currentManifest || currentManifest.items.length === 0) return;
    const next = (indexRef.current + 1) % currentManifest.items.length;
    indexRef.current = next;
    setIndex(next);
    setPlaybackCycle((cycle) => cycle + 1);
  }, []);

  // Heartbeats de estado (sección 27).
  const sendHeartbeat = useCallback(async () => {
    if (!resolvedCode) return;
    const m = manifestRef.current;
    const current = m?.items[indexRef.current];
    try {
      await fetch("/api/heartbeat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          screenCode: resolvedCode,
          deviceToken: deviceToken ?? null,
          currentContentId: current?.contentItemId ?? null,
          currentPositionSeconds: 0,
          playlistVersion: m?.version ?? null,
          connectionStatus: online ? "online" : "offline",
        }),
      });
    } catch {
      // La pérdida de red no debe afectar la reproducción.
    }
  }, [resolvedCode, deviceToken, online]);

  useEffect(() => {
    if (!resolvedCode) return;
    sendHeartbeat();
    const id = setInterval(sendHeartbeat, HEARTBEAT_MS);
    return () => clearInterval(id);
  }, [resolvedCode, sendHeartbeat]);

  const currentItem = manifest?.items[Math.min(index, manifest.items.length - 1)];
  const controlsOwnCompletion =
    currentItem?.content.kind === "noticias" ||
    currentItem?.content.kind === "programacion_general";

  useEffect(() => {
    indexRef.current = index;
    if (!currentItem || controlsOwnCompletion) return;
    const timer = window.setTimeout(
      advance,
      Math.max(1, currentItem.durationSeconds) * 1000,
    );
    return () => window.clearTimeout(timer);
  }, [advance, controlsOwnCompletion, currentItem, index]);

  // Identidad institucional: llega en el manifiesto (también desde la caché).
  const identity = manifest?.identity ?? DEFAULT_IDENTITY;

  // --- Render -------------------------------------------------------------
  // 1) Emergencia: prioridad absoluta.
  if (manifest?.emergency) {
    return (
      <div className="kiosk-root">
        <ScreenFrame identity={identity} bare emergency>
          <EmergenciaView content={manifest.emergency} />
        </ScreenFrame>
      </div>
    );
  }

  // 2) Sin manifiesto todavía: vista de sincronización (nunca negro).
  if (!manifest || manifest.items.length === 0) {
    return (
      <div className="kiosk-root">
        <ScreenFrame identity={identity}>
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
  const item = currentItem ?? manifest.items[0];
  const mode = screenModeFor(item.content);

  return (
    <div className="kiosk-root">
      <ScreenFrame identity={identity} {...mode}>
        {/* Una pieza nueva desmonta por completo la anterior: ningún video
            oculto puede continuar reproduciéndose o conservando audio. */}
        <ViewRenderer
          key={`${item.id}:${manifest.version}:${playbackCycle}`}
          content={item.content}
          onComplete={advance}
        />
      </ScreenFrame>
      {!online && (
        <div className="pointer-events-none absolute right-3 top-3 rounded bg-black/60 px-3 py-1 text-xs font-bold text-white">
          Sin conexión · reproduciendo local
        </div>
      )}
    </div>
  );
}
