"use client";

import { useEffect, useRef, useState } from "react";
import type { MediaRef } from "@/lib/views/schemas";

export interface GalleryImage {
  media?: MediaRef;
  caption?: string;
}

interface CinematicGalleryProps {
  images: GalleryImage[];
  /** Segundos que permanece cada imagen. */
  seconds?: number;
}

const KB = ["sig-kb-1", "sig-kb-2", "sig-kb-3", "sig-kb-4"];

// Fondos de respaldo cuando una diapositiva no tiene imagen: así el efecto
// (fundido + Ken Burns) se aprecia incluso sin foto real.
const FALLBACKS = [
  "linear-gradient(135deg, #0a1440 0%, #121f5c 60%, #1b2c78 100%)",
  "linear-gradient(135deg, #9c0f14 0%, #d4181f 55%, #7a0c10 100%)",
  "linear-gradient(135deg, #121f5c 0%, #0a1440 50%, #060c2a 100%)",
  "linear-gradient(135deg, #1b2c78 0%, #0a1440 55%, #121f5c 100%)",
];

/**
 * Galería a pantalla completa con estética de reel: cada imagen se muestra con
 * un lento zoom/paneo (Ken Burns) y las transiciones son fundidos cruzados. El
 * cambio se calcula desde el reloj, de modo que las cuatro pantallas del grupo
 * pasan de imagen a la vez.
 */
export function CinematicGallery({ images, seconds = 7 }: CinematicGalleryProps) {
  const [index, setIndex] = useState(0);
  const indexRef = useRef(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const tick = () => {
      const next = Math.floor(Date.now() / (seconds * 1000)) % images.length;
      if (next !== indexRef.current) {
        indexRef.current = next;
        setIndex(next);
      }
    };
    tick();
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [images.length, seconds]);

  if (images.length === 0) {
    return (
      <div
        className="grid h-full w-full place-items-center"
        style={{ background: FALLBACKS[0] }}
      >
        <span className="font-serif text-[30px] font-semibold text-white/40">
          UABJB · POSGRADO
        </span>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-sig-ink-deep">
      {images.map((img, i) => {
        const active = i === index;
        const src = img.media?.src;
        return (
          <div
            key={i}
            aria-hidden={!active}
            className="absolute inset-0 transition-opacity duration-[1100ms] ease-in-out"
            style={{ opacity: active ? 1 : 0 }}
          >
            <div className={`h-full w-full ${KB[i % KB.length]}`}>
              {src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div
                  className="h-full w-full"
                  style={{ background: FALLBACKS[i % FALLBACKS.length] }}
                />
              )}
            </div>

            {img.caption && (
              <>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/5"
                  style={{
                    background:
                      "linear-gradient(0deg, rgba(10,20,64,.9) 0%, transparent 100%)",
                  }}
                />
                <p className="absolute inset-x-0 bottom-0 px-[64px] pb-[52px] font-serif text-[44px] font-bold leading-tight text-white">
                  {img.caption}
                </p>
              </>
            )}
          </div>
        );
      })}

      {/* Puntos de progreso */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-[2] flex -translate-x-1/2 items-center gap-2.5">
          {images.map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={`h-2.5 rounded-full transition-all duration-500 ${
                i === index ? "w-10 bg-white" : "w-2.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
