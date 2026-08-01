"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

interface VerticalPagerProps {
  items: ReactNode[];
  /** Cantidad de filas que caben de forma legible en una pantalla 1920x1080. */
  pageSize: number;
  seconds?: number;
  className?: string;
  pageClassName?: string;
}

/**
 * Pagina listas extensas con una transición vertical tipo teleprompter.
 * Solo monta la página visible: evita que videos ocultos sigan sonando y
 * garantiza que cada elemento agregado llegue a pantalla.
 */
export function VerticalPager({
  items,
  pageSize,
  seconds = 7,
  className = "",
  pageClassName = "flex-col",
}: VerticalPagerProps) {
  const pages = useMemo(() => {
    const safeSize = Math.max(1, pageSize);
    const result: ReactNode[][] = [];
    for (let index = 0; index < items.length; index += safeSize) {
      result.push(items.slice(index, index + safeSize));
    }
    return result;
  }, [items, pageSize]);
  const [page, setPage] = useState(0);
  const [moving, setMoving] = useState(false);

  const visiblePage = page < pages.length ? page : 0;

  useEffect(() => {
    if (pages.length <= 1) return;
    const delay = Math.max(3, seconds) * 1000;
    const timer = window.setTimeout(() => setMoving(true), delay - 520);
    return () => window.clearTimeout(timer);
  }, [page, pages.length, seconds]);

  useEffect(() => {
    if (!moving) return;
    const timer = window.setTimeout(() => {
      setPage((current) => (current + 1) % pages.length);
      setMoving(false);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [moving, pages.length]);

  if (pages.length === 0) return null;

  return (
    <div className={`relative flex min-h-0 flex-1 flex-col overflow-hidden ${className}`}>
      <div
        key={visiblePage}
        className={`flex min-h-0 flex-1 will-change-transform ${pageClassName}`}
        style={{
          opacity: moving ? 0 : 1,
          transform: moving ? "translateY(-42px)" : "translateY(0)",
          transition: "transform 500ms cubic-bezier(.4,0,.2,1), opacity 420ms ease",
        }}
      >
        {pages[visiblePage]}
      </div>

      {pages.length > 1 && (
        <div className="mt-4 flex shrink-0 items-center justify-between gap-4">
          <span className="font-mono text-[15px] font-bold uppercase tracking-[.12em] text-sig-text-faint">
            {String(visiblePage + 1).padStart(2, "0")} / {String(pages.length).padStart(2, "0")}
          </span>
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-sig-rule">
            <div
              className="h-full bg-sig-red transition-[width] duration-500"
              style={{ width: `${((visiblePage + 1) / pages.length) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
