"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CANVAS } from "@/lib/design/tokens";
import {
  DEFAULT_IDENTITY,
  type InstitutionIdentity,
} from "@/lib/institution/identity";
import { ScreenFooter, ScreenHeader, ScreenTicker } from "./ScreenChrome";

interface ScreenFrameProps {
  children: ReactNode;
  /** Identidad institucional; sin ella se usan los valores por defecto. */
  identity?: InstitutionIdentity;
  /** Vistas a sangre completa (emergencia): sin ticker ni rejilla central. */
  bare?: boolean;
  /** Paleta de emergencia en cabecera y pie. */
  emergency?: boolean;
}

/**
 * Lienzo institucional. Compone siempre 1920×1080 (16:9) y lo escala de forma
 * proporcional para llenar el televisor manteniendo la relación de aspecto,
 * de modo que la línea gráfica se vea idéntica en cualquier pantalla.
 *
 * La estructura —cabecera con logos y reloj, zona central de 12 columnas,
 * rótulo y pie— es común a todas las plantillas.
 */
export function ScreenFrame({
  children,
  identity = DEFAULT_IDENTITY,
  bare = false,
  emergency = false,
}: ScreenFrameProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const recompute = () => {
      const { clientWidth, clientHeight } = host;
      setScale(
        Math.min(clientWidth / CANVAS.width, clientHeight / CANVAS.height),
      );
    };

    recompute();
    const observer = new ResizeObserver(recompute);
    observer.observe(host);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={hostRef} className="absolute inset-0 overflow-hidden bg-black">
      <div
        style={{
          width: CANVAS.width,
          height: CANVAS.height,
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center",
        }}
        className="flex flex-col overflow-hidden bg-sig-paper"
      >
        <ScreenHeader identity={identity} emergency={emergency} />

        <main
          className={`min-h-0 flex-1 ${
            bare
              ? "flex bg-sig-paper"
              : "grid grid-cols-12 gap-7 bg-sig-paper px-[52px] pb-[34px] pt-[40px]"
          } ${emergency ? "!bg-sig-red-deep" : ""}`}
        >
          {children}
        </main>

        {!bare && !emergency && <ScreenTicker identity={identity} />}
        <ScreenFooter identity={identity} emergency={emergency} />
      </div>
    </div>
  );
}
