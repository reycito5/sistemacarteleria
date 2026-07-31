"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaRef } from "@/lib/views/schemas";
import {
  claimExclusivePlayback,
  registerMediaElement,
  releaseMediaElement,
} from "@/lib/player/mediaCoordinator";
import { isVideoRef } from "./mediaKind";

// Persiste durante toda la sesión del reproductor. Tras el primer gesto
// aceptado, los siguientes videos pueden intentar arrancar con sonido sin
// volver a pedir interacción.
let soundUnlocked = false;

interface SignageMediaProps {
  media?: MediaRef;
  className?: string;
  /** Texto del respaldo cuando no hay medio asignado. */
  fallbackLabel?: string;
  /**
   * Hay texto superpuesto: se oscurece el borde inferior lo justo para que se
   * lea. Sin texto encima, el medio se muestra sin ningún velo.
   */
  overlayText?: boolean;
  /** Sólo el medio visible puede reproducirse. Las miniaturas usan `false`. */
  active?: boolean;
  /** Los videos editoriales avanzan al terminar; los fondos pueden repetir. */
  loop?: boolean;
  onEnded?: () => void;
  onPlaybackError?: () => void;
  fit?: "cover" | "contain";
}

/**
 * Medio de una pantalla institucional: **acepta indistintamente video o
 * imagen** y los trata igual.
 *
 *  - Video: se reproduce de verdad, en bucle, con reintento de autoplay (los
 *    navegadores lo bloquean en el primer intento tras recargar). El sonido se
 *    activa por contenido; con audio, el navegador puede exigir que el kiosco
 *    arranque con `--autoplay-policy=no-user-gesture-required`.
 *  - Imagen: se muestra a sangre, con sus colores reales.
 *  - Sin medio o archivo roto: respaldo institucional sólido. Nunca queda un
 *    hueco negro en el televisor.
 */
export function SignageMedia({
  media,
  className = "",
  fallbackLabel = "UABJB · POSGRADO",
  overlayText = false,
  active = true,
  loop = true,
  onEnded,
  onPlaybackError,
  fit = "cover",
}: SignageMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [brokenSrc, setBrokenSrc] = useState<string | undefined>();
  // El sonido está pedido pero el navegador lo bloquea hasta un gesto: se
  // muestra un aviso para tocar y activarlo (garantía en cualquier navegador).
  const [soundBlocked, setSoundBlocked] = useState(false);

  const src = media?.src;
  const video = isVideoRef(media);
  // La cartelería reproduce CON sonido por defecto. Un video sólo va en
  // silencio si el contenido lo pide de forma explícita (`muted: true` marcado
  // a mano en el editor). Nota: el valor histórico por defecto era `true`, así
  // que aquí el sonido se considera deseado salvo que se marque `silent`.
  const wantsSound = media?.silent !== true;

  useEffect(() => {
    if (!video) return;
    const el = videoRef.current;
    if (!el) return;

    const unregister = registerMediaElement(el);

    if (!active) {
      releaseMediaElement(el);
      return unregister;
    }

    let cancelled = false;

    // 1) Arranca SIEMPRE reproduciéndose: primero en silencio, porque así el
    //    navegador nunca bloquea el autoplay (el video jamás se queda
    //    congelado). Si el contenido no pide sonido, aquí termina.
    // 2) Si el contenido pide sonido, se intenta quitar el silencio de
    //    inmediato. En un kiosco (Chrome con --autoplay-policy=
    //    no-user-gesture-required) o en escritorio con permiso, suena ya.
    // 3) Si el navegador lo rechaza —política de móviles: sonido sólo tras un
    //    gesto—, se queda a la espera del PRIMER toque/click/tecla en la
    //    página y en ese instante activa el sonido. Un solo gesto basta para
    //    todos los videos que vengan después.
    const tryUnmute = async () => {
      if (cancelled || !wantsSound || document.hidden) return false;
      claimExclusivePlayback(el, true);
      el.muted = false;
      el.volume = 1;
      try {
        await el.play();
        soundUnlocked = true;
        return !el.muted;
      } catch {
        el.muted = true;
        return false;
      }
    };

    const startMuted = async () => {
      if (document.hidden) return;
      claimExclusivePlayback(el, false);
      el.muted = true;
      try {
        await el.play();
      } catch {
        /* se reintenta abajo */
      }
    };

    const onGesture = async () => {
      const ok = await tryUnmute();
      if (ok) {
        setSoundBlocked(false);
        removeGestureListeners();
      }
    };

    const events = ["pointerdown", "touchstart", "keydown", "click"] as const;
    function removeGestureListeners() {
      events.forEach((ev) =>
        window.removeEventListener(ev, onGesture as EventListener),
      );
    }

    (async () => {
      if (soundUnlocked && wantsSound) {
        const resumedWithSound = await tryUnmute();
        if (resumedWithSound || cancelled) {
          setSoundBlocked(false);
          return;
        }
      }

      await startMuted();
      if (!wantsSound || cancelled || document.hidden) return;
      const unmuted = await tryUnmute();
      if (unmuted) {
        setSoundBlocked(false);
      } else {
        // El navegador exige gesto: se activará al primer toque en la página
        // (o con el aviso «tocar para activar sonido»).
        setSoundBlocked(true);
        events.forEach((ev) =>
          window.addEventListener(ev, onGesture as EventListener, {
            passive: true,
          }),
        );
      }
    })();

    // Reintento del propio autoplay por si el primer play() se perdió.
    const id = setTimeout(() => {
      if (!cancelled) el.play().catch(() => {});
    }, 400);
    const onVisibilityChange = () => {
      if (document.hidden) {
        el.pause();
        el.muted = true;
      } else {
        startMuted().then(() => tryUnmute());
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      cancelled = true;
      clearTimeout(id);
      removeGestureListeners();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      unregister();
    };
  }, [active, video, src, wantsSound]);

  const showFallback = !src || brokenSrc === src;

  // Activación manual del sonido: cualquier navegador/celular puede activarlo
  // tocando el aviso, aunque bloquee el sonido automático.
  const enableSound = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = false;
    el.volume = 1;
    el.play().then(
      () => {
        soundUnlocked = !el.muted;
        setSoundBlocked(el.muted);
      },
      () => {
        el.muted = true;
        setSoundBlocked(true);
      },
    );
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {showFallback ? (
        <div
          className="relative grid h-full w-full place-items-center overflow-hidden"
          style={{
            background:
              "radial-gradient(ellipse 90% 80% at 50% 30%, #1b2c78 0%, #0a1440 70%)",
          }}
        >
          {/* Monograma institucional grande y tenue: el vacío se ve intencional. */}
          <span
            aria-hidden
            className="pointer-events-none absolute font-serif font-black leading-none text-white/[0.05]"
            style={{ fontSize: 360 }}
          >
            UAB
          </span>
          <span aria-hidden className="absolute bottom-0 left-0 h-[6px] w-full bg-sig-red/70" />
          {fallbackLabel && (
            <span className="relative font-serif text-[30px] font-semibold tracking-[0.2em] text-white/55">
              {fallbackLabel}
            </span>
          )}
        </div>
      ) : video ? (
        <video
          key={src}
          ref={videoRef}
          className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
          src={src}
          poster={media?.poster}
          onError={() => {
            setBrokenSrc(src);
            onPlaybackError?.();
          }}
          onEnded={onEnded}
          onPlay={(event) =>
            claimExclusivePlayback(event.currentTarget, !event.currentTarget.muted)
          }
          autoPlay={active}
          muted
          loop={loop}
          playsInline
          preload="auto"
          crossOrigin="anonymous"
        >
          {media?.subtitleSrc && (
            <track
              default
              kind="subtitles"
              srcLang="es"
              label="Español"
              src={media.subtitleSrc}
            />
          )}
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={`h-full w-full ${fit === "contain" ? "object-contain" : "object-cover"}`}
          src={src}
          onError={() => setBrokenSrc(src)}
          alt=""
        />
      )}

      {/* Aviso para activar el sonido cuando el navegador lo bloquea sin gesto.
          Se activa igualmente al primer toque en cualquier parte de la página;
          este botón es la garantía visible en móvil y navegadores estrictos. */}
      {video && !showFallback && soundBlocked && (
        <button
          type="button"
          onClick={enableSound}
          className="absolute bottom-4 right-4 z-[3] inline-flex items-center gap-2 rounded-full bg-sig-red px-4 py-2.5 font-bold text-white shadow-lg ring-1 ring-white/25 transition hover:brightness-110"
          style={{ fontSize: 18 }}
        >
          <span aria-hidden style={{ fontSize: 20 }}>
            🔊
          </span>
          Toca para activar sonido
        </button>
      )}

      {/* Sin velos de color: la foto y el video se ven tal cual. Sólo se
          oscurece el borde inferior, y únicamente si hay texto encima. */}
      {overlayText && !showFallback && (
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background:
              "linear-gradient(0deg, rgba(10,20,64,.85) 0%, rgba(10,20,64,.35) 45%, transparent 100%)",
          }}
        />
      )}
    </div>
  );
}
