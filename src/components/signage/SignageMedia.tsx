"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaRef } from "@/lib/views/schemas";
import { isVideoRef } from "./mediaKind";

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
}: SignageMediaProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [broken, setBroken] = useState(false);

  const src = media?.src;
  const video = isVideoRef(media);
  // El contenido puede pedir sonido (muted === false). Por defecto la cartelería
  // va silenciada: son cuatro televisores en zonas de paso.
  const wantsSound = media?.muted === false;

  useEffect(() => {
    if (!video) return;
    const el = videoRef.current;
    if (!el) return;

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
      if (cancelled || !wantsSound) return false;
      el.muted = false;
      el.volume = 1;
      try {
        await el.play();
        return !el.muted;
      } catch {
        el.muted = true;
        return false;
      }
    };

    const startMuted = async () => {
      el.muted = true;
      try {
        await el.play();
      } catch {
        /* se reintenta abajo */
      }
    };

    const onGesture = async () => {
      const ok = await tryUnmute();
      if (ok) removeGestureListeners();
    };

    const events = ["pointerdown", "touchstart", "keydown", "click"] as const;
    function removeGestureListeners() {
      events.forEach((ev) =>
        window.removeEventListener(ev, onGesture as EventListener),
      );
    }

    (async () => {
      await startMuted();
      if (!wantsSound || cancelled) return;
      const unmuted = await tryUnmute();
      if (!unmuted) {
        // El navegador exige gesto: se activará al primer toque en la página.
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

    return () => {
      cancelled = true;
      clearTimeout(id);
      removeGestureListeners();
    };
  }, [video, src, wantsSound]);

  const showFallback = !src || broken;

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
          ref={videoRef}
          className="h-full w-full object-cover"
          src={src}
          poster={media?.poster}
          onError={() => setBroken(true)}
          autoPlay
          muted
          loop
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
          className="h-full w-full object-cover"
          src={src}
          onError={() => setBroken(true)}
          alt=""
        />
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
