"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaRef } from "@/lib/views/schemas";
import { isVideoRef } from "./mediaKind";

interface SignageMediaProps {
  media?: MediaRef;
  /**
   * Tratamiento duotono institucional (escala de grises + velo azul/rojo).
   * Se desactiva cuando la imagen debe verse con sus colores reales.
   */
  duotone?: boolean;
  className?: string;
  /** Texto del respaldo cuando no hay medio asignado. */
  fallbackLabel?: string;
}

/**
 * Medio de una pantalla institucional: **acepta indistintamente video o
 * imagen** y los trata igual.
 *
 *  - Video: se reproduce de verdad, silenciado y en bucle, con reintento de
 *    autoplay (los navegadores lo bloquean en el primer intento tras recargar).
 *  - Imagen: se muestra a sangre, sin ningún control encima.
 *  - Sin medio o archivo roto: respaldo institucional sólido. Nunca queda un
 *    hueco negro en el televisor.
 */
export function SignageMedia({
  media,
  duotone = true,
  className = "",
  fallbackLabel = "UABJB · POSGRADO",
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
  const filter = duotone
    ? "grayscale(1) contrast(1.15) brightness(.85)"
    : undefined;

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
          style={{ filter, mixBlendMode: duotone ? "luminosity" : undefined }}
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
          style={{ filter, mixBlendMode: duotone ? "luminosity" : undefined }}
          src={src}
          onError={() => setBroken(true)}
          alt=""
        />
      )}

      {/* Velos del duotono institucional. */}
      {duotone && !showFallback && (
        <>
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(18,31,92,.94) 0%, rgba(18,31,92,.55) 42%, rgba(212,24,31,.28) 100%)",
              mixBlendMode: "multiply",
            }}
          />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(0deg, rgba(10,20,64,.92) 0%, rgba(10,20,64,.15) 55%, transparent 75%)",
            }}
          />
        </>
      )}
    </div>
  );
}
