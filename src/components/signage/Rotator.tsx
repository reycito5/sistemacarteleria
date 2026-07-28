"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

interface RotatorProps {
  /** Elementos a mostrar de uno en uno. */
  items: ReactNode[];
  /** Segundos que permanece cada elemento en pantalla. */
  seconds?: number;
  className?: string;
}

/**
 * Muestra los elementos **uno a uno**, no todos apilados.
 *
 * En cartelería una lista de cuatro noticias en pequeño no se lee desde lejos:
 * es mejor dar a cada una la pantalla entera durante unos segundos. El paso de
 * una a otra se hace con un fundido corto y se indica con puntos de progreso.
 *
 * La rotación arranca desde la hora del reloj (no desde el montaje), de modo
 * que las cuatro pantallas del grupo muestran la misma noticia a la vez.
 */
export function Rotator({ items, seconds = 8, className = "" }: RotatorProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const indexRef = useRef(0);

  useEffect(() => {
    if (items.length <= 1) return;

    let swapTimer: ReturnType<typeof setTimeout> | undefined;

    const tick = () => {
      // Posición derivada del reloj: sincroniza todos los televisores.
      const next = Math.floor(Date.now() / (seconds * 1000)) % items.length;
      if (next === indexRef.current) return;

      // Primero se desvanece; el contenido sólo cambia cuando ya es invisible,
      // así el paso es un fundido cruzado limpio y no un salto/tembleque.
      setVisible(false);
      clearTimeout(swapTimer);
      swapTimer = setTimeout(() => {
        indexRef.current = next;
        setIndex(next);
        setVisible(true);
      }, 300);
    };

    tick();
    const id = setInterval(tick, 500);
    return () => {
      clearInterval(id);
      clearTimeout(swapTimer);
    };
  }, [items.length, seconds]);

  if (items.length === 0) return null;

  return (
    <div className={`flex min-h-0 flex-1 flex-col ${className}`}>
      <div
        className="flex min-h-0 flex-1 flex-col transition-opacity duration-250"
        style={{ opacity: visible ? 1 : 0 }}
      >
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
