"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

interface RotatorProps {
  /** Elementos a mostrar de uno en uno. */
  items: ReactNode[];
  /** Segundos que permanece cada elemento en pantalla. */
  seconds?: number;
  /** `false` cuando el medio activo avanzará mediante su evento `ended`. */
  autoAdvance?: boolean;
  className?: string;
}

/** Devuelve el siguiente elemento, envolviendo al inicio al terminar. */
export function nextRotatorIndex(index: number, itemCount: number): number {
  if (itemCount <= 0) return 0;
  const normalized = Math.max(0, Math.trunc(index)) % itemCount;
  return (normalized + 1) % itemCount;
}

/**
 * Secuenciador reutilizable para contenidos. A diferencia del antiguo cálculo
 * absoluto por reloj, no retrocede después de que un video solicite avanzar al
 * finalizar. El temporizador se reinicia para cada elemento.
 */
export function useSequentialRotator(
  itemCount: number,
  seconds = 8,
  autoAdvance: boolean | ((index: number) => boolean) = true,
) {
  const [index, setIndex] = useState(0);
  const safeIndex =
    itemCount > 0 ? ((index % itemCount) + itemCount) % itemCount : 0;

  const advance = useCallback(() => {
    setIndex((current) => nextRotatorIndex(current, itemCount));
  }, [itemCount]);

  const shouldAutoAdvance =
    typeof autoAdvance === "function" ? autoAdvance(safeIndex) : autoAdvance;

  useEffect(() => {
    if (itemCount <= 1) return;
    if (!shouldAutoAdvance) return;
    const id = window.setTimeout(advance, Math.max(1, seconds) * 1000);
    return () => window.clearTimeout(id);
  }, [advance, itemCount, safeIndex, seconds, shouldAutoAdvance]);

  return { index: safeIndex, advance };
}

/** Muestra cada elemento completo en secuencia, sin mantener medios ocultos. */
export function Rotator({
  items,
  seconds = 8,
  autoAdvance = true,
  className = "",
}: RotatorProps) {
  const { index } = useSequentialRotator(items.length, seconds, autoAdvance);

  if (items.length === 0) return null;

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${className}`}>
      <div className="flex min-h-0 flex-1 flex-col ui-fade-in" key={index}>
        {items[Math.min(index, items.length - 1)]}
      </div>

      {items.length > 1 && (
        <div className="mt-6 flex shrink-0 items-center gap-2.5">
          {items.map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === index ? "w-12 bg-sig-red" : "w-2.5 bg-sig-rule"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
