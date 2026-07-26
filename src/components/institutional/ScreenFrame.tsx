"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CANVAS } from "@/lib/design/tokens";
import { InstitutionalHeader } from "./InstitutionalHeader";
import { InstitutionalFooter } from "./InstitutionalFooter";

interface ScreenFrameProps {
  children: ReactNode;
  callToAction?: string;
  showQr?: boolean;
  /** Oculta cabecera/pie (vistas técnicas a sangre completa como emergencia) */
  bare?: boolean;
}

/**
 * Lienzo institucional. Compone siempre 1920x1080 (16:9) y lo escala de forma
 * proporcional para llenar el televisor manteniendo la relación de aspecto.
 * Garantiza que la línea gráfica se vea idéntica en cualquier pantalla.
 */
export function ScreenFrame({
  children,
  callToAction,
  showQr,
  bare = false,
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
    <div ref={hostRef} className="grid h-full w-full place-items-center bg-black">
      <div
        style={{
          width: CANVAS.width,
          height: CANVAS.height,
          transform: `scale(${scale})`,
          transformOrigin: "center",
        }}
        className="relative flex flex-col overflow-hidden bg-inst-white"
      >
        {!bare && <InstitutionalHeader />}
        <main className="relative flex-1 overflow-hidden">{children}</main>
        {!bare && (
          <InstitutionalFooter callToAction={callToAction} showQr={showQr} />
        )}
      </div>
    </div>
  );
}
