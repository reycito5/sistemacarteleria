"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

interface FitBoxProps {
  children: ReactNode;
  /**
   * Reducción máxima. Por debajo de esto se prefiere recortar antes que dejar
   * el texto ilegible en el televisor.
   */
  min?: number;
  /**
   * Clases del bloque de contenido (relleno, alineación, separaciones). Van
   * dentro para que también se reduzcan y la composición no se descuadre.
   */
  className?: string;
  /** Estilos del contenedor exterior: posición en la rejilla, anchos… */
  style?: CSSProperties;
}

/**
 * Encaja su contenido en el alto disponible.
 *
 * Un televisor no tiene barra de desplazamiento: lo que no cabe, no existe. Y
 * el contenido lo escribe el administrador, así que su alto es imprevisible —
 * una agenda de dos actividades y otra de cinco usan la misma plantilla—.
 *
 * En lugar de adivinar tamaños en tiempo de diseño, aquí se mide lo que ocupa
 * de verdad y, si se pasa, se reduce en bloque con una transformación. Al ser
 * proporcional, la jerarquía tipográfica se conserva intacta: todo se ve algo
 * más pequeño, pero nada se corta ni se solapa.
 *
 * El ancho interno se compensa (`100 / k`) para que, tras la reducción, el
 * bloque siga ocupando el ancho completo y no deje una franja a la derecha.
 */
export function FitBox({
  children,
  min = 0.62,
  className = "",
  style,
}: FitBoxProps) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(1);

  useEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const measure = () => {
      const available = outer.clientHeight;
      // Se mide el contenido a escala 1: `scrollHeight` ya descuenta la
      // transformación, de modo que el cálculo no se realimenta.
      const needed = inner.scrollHeight;
      if (available <= 0 || needed <= 0) return;

      const next = needed > available ? Math.max(min, available / needed) : 1;
      setK((prev) => (Math.abs(prev - next) < 0.004 ? prev : next));
    };

    // El observador dispara una primera vez al empezar a observar, así que no
    // hace falta medir de forma síncrona dentro del efecto.
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    observer.observe(inner);
    return () => observer.disconnect();
  }, [min]);

  return (
    <div
      ref={outerRef}
      className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      style={style}
    >
      <div
        ref={innerRef}
        className={`flex min-h-0 min-w-0 flex-1 flex-col ${className}`}
        style={
          k < 1
            ? {
                transform: `scale(${k})`,
                transformOrigin: "top center",
                width: `${100 / k}%`,
                marginLeft: `${(100 / k - 100) / -2}%`,
                // Alto natural: así `scrollHeight` sigue midiendo el contenido
                // y no el hueco, y la medida no se realimenta con la escala.
                flex: "none",
              }
            : undefined
        }
      >
        {children}
      </div>
    </div>
  );
}
