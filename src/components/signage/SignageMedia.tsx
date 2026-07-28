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

  useEffect(() => {
    if (!video) return;
    const el = videoRef.current;
    if (!el) return;
    const attempt = () => el.play().catch(() => undefined);
    attempt();
    const id = setTimeout(attempt, 400);
    return () => clearTimeout(id);
  }, [video, src]);

  const showFallback = !src || broken;
  // El audio sólo suena si el contenido lo pide expresamente. Por defecto la
  // cartelería va silenciada: son cuatro televisores en zonas de paso.
  const muted = media?.muted !== false;

  return (
    <div className={`absolute inset-0 ${className}`}>
      {showFallback ? (
        <div className="grid h-full w-full place-items-center bg-sig-ink-deep">
          <span className="font-serif text-[26px] font-semibold tracking-wide text-white/35">
            {fallbackLabel}
          </span>
        </div>
      ) : video ? (
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          src={src}
          poster={media?.poster}
          onError={() => setBroken(true)}
          autoPlay
          muted={muted}
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
