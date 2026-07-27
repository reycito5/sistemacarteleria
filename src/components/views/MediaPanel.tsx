"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaRef } from "@/lib/views/schemas";

interface MediaPanelProps {
  media?: MediaRef;
  /**
   * Barra de reproductor DECORATIVA, parte del diseño gráfico de la vista
   * «Testimonios». Sólo se dibuja sobre VIDEO, nunca sobre una imagen, y no
   * pretende ser interactiva: en el televisor no hay ratón ni teclado.
   *
   * Para un reproductor con controles reales (panel de administración), use
   * `components/media/VideoPlayer`.
   */
  decorativeControls?: boolean;
  className?: string;
}

const VIDEO_EXT = /\.(mp4|webm|m4v|mov)(\?|$)/i;

/**
 * Panel de medios institucional.
 *
 *  - Video: se reproduce de verdad (silenciado, en bucle, autoplay), como
 *    exige el modo kiosco. Si el navegador bloquea el autoplay, se reintenta.
 *  - Imagen: se muestra limpia, SIN ninguna barra de reproductor encima.
 *  - Sin medio: respaldo institucional sólido, nunca un panel negro
 *    (sección 28).
 */
export function MediaPanel({
  media,
  decorativeControls = false,
  className = "",
}: MediaPanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [broken, setBroken] = useState(false);

  const src = media?.src;
  const isVideo = Boolean(src && VIDEO_EXT.test(src));

  // Autoplay silencioso: algunos navegadores lo rechazan en el primer intento
  // (p. ej. tras recargar el kiosco), así que se reintenta al montar.
  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    if (!video) return;
    const attempt = () => video.play().catch(() => undefined);
    attempt();
    const id = setTimeout(attempt, 400);
    return () => clearTimeout(id);
  }, [isVideo, src]);

  const showFallback = !src || broken;

  return (
    <div
      className={`relative h-full w-full overflow-hidden bg-inst-blue-bottom ${className}`}
    >
      {showFallback ? (
        <div className="grid h-full w-full place-items-center bg-gradient-to-br from-inst-blue-bottom to-inst-blue-top">
          <span className="text-[28px] font-bold tracking-wide text-inst-white/70">
            UABJB · POSGRADO
          </span>
        </div>
      ) : isVideo ? (
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

      {/* Decoración exclusiva de la vista Testimonios, sólo sobre video. */}
      {decorativeControls && isVideo && !broken && (
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 flex items-center gap-4 bg-black/45 px-6 py-3"
        >
          <span className="text-[20px] text-inst-white">▶</span>
          <div className="relative h-1.5 flex-1 rounded-full bg-white/35">
            <div className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-inst-red" />
            <div className="absolute left-1/3 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-inst-red" />
          </div>
          <span className="text-[18px] text-inst-white">🔊</span>
        </div>
      )}
    </div>
  );
}
