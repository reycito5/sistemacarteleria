import qrcode from "qrcode-generator";

interface QrCodeProps {
  /** Contenido del código: normalmente una URL de inscripción o ficha. */
  value: string;
  /** Lado del código en píxeles del lienzo. */
  size?: number;
  className?: string;
}

/**
 * Código QR real, generado a partir del contenido que se escribe en el panel.
 *
 * Se dibuja como SVG (nítido a cualquier escala del televisor) y de forma
 * síncrona, para que funcione igual en el servidor —galería y vista previa—
 * que en el reproductor.
 *
 * Corrección de errores alta (H): un QR de cartelería tiene que leerse aunque
 * la cámara lo capte torcido, con reflejos o a contraluz.
 */
export function QrCode({ value, size = 200, className = "" }: QrCodeProps) {
  const content = value.trim();
  if (!content) return null;

  // Tipo 0 = la librería elige la versión mínima que admita el contenido.
  const qr = qrcode(0, "H");
  qr.addData(content);
  qr.make();

  const count = qr.getModuleCount();
  // Margen de silencio: sin él muchos lectores no reconocen el código.
  const quiet = 2;
  const total = count + quiet * 2;

  const cells: string[] = [];
  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if (qr.isDark(row, col)) {
        cells.push(`M${col + quiet},${row + quiet}h1v1h-1z`);
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${total} ${total}`}
      width={size}
      height={size}
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Código QR: ${content}`}
      className={className}
    >
      <rect width={total} height={total} fill="#ffffff" />
      <path d={cells.join("")} fill="#0a1440" />
    </svg>
  );
}
