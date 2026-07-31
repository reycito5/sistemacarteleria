"use client";

import { useLayoutEffect, useRef, type CSSProperties } from "react";

interface AutoFitTextProps {
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span";
  children: string;
  className?: string;
  maxSize: number;
  minSize?: number;
  maxHeight?: number;
  style?: CSSProperties;
}

/** Reduce la tipografía sólo lo necesario para que ningún texto quede cortado. */
export function AutoFitText({
  as = "p",
  children,
  className,
  maxSize,
  minSize = 16,
  maxHeight,
  style,
}: AutoFitTextProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    const fit = () => {
      let low = minSize;
      let high = maxSize;
      let best = minSize;
      for (let attempt = 0; attempt < 8; attempt += 1) {
        const size = (low + high) / 2;
        element.style.fontSize = `${size}px`;
        const fitsHeight = maxHeight
          ? element.scrollHeight <= maxHeight + 1
          : element.scrollHeight <= element.clientHeight + 1;
        const fitsWidth = element.scrollWidth <= element.clientWidth + 1;
        if (fitsHeight && fitsWidth) {
          best = size;
          low = size;
        } else {
          high = size;
        }
      }
      element.style.fontSize = `${Math.floor(best)}px`;
    };

    fit();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(fit);
    observer.observe(element);
    return () => observer.disconnect();
  }, [children, maxHeight, maxSize, minSize]);

  const headingLevel = as.startsWith("h") ? Number(as.slice(1)) : undefined;
  return (
    <div
      ref={ref}
      role={headingLevel ? "heading" : undefined}
      aria-level={headingLevel}
      className={className}
      style={{
        ...style,
        fontSize: maxSize,
        maxHeight,
        overflow: "hidden",
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </div>
  );
}
