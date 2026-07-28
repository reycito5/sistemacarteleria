/**
 * Iconos de redes sociales para el pie de las pantallas.
 *
 * Se dibujan a mano en SVG en lugar de tirar de una librería de iconos: las
 * marcas comerciales no están en los paquetes genéricos, y así el pie se ve
 * igual sin depender de una fuente externa que el televisor podría no cargar.
 *
 * El nombre se reconoce por texto, de modo que en «Identidad institucional»
 * basta con escribir «Facebook, Instagram, YouTube» para que aparezcan.
 */
const PATHS: Record<string, string> = {
  facebook:
    "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z",
  instagram:
    "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07Zm0 6.19a3.65 3.65 0 1 0 0 7.3 3.65 3.65 0 0 0 0-7.3Zm0 6.02a2.37 2.37 0 1 1 0-4.74 2.37 2.37 0 0 1 0 4.74Zm4.65-6.16a.85.85 0 1 1-1.7 0 .85.85 0 0 1 1.7 0Z",
  youtube:
    "M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .42 4.81 2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.42-4.81ZM10 15.02V8.98L15.2 12 10 15.02Z",
  tiktok:
    "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5 2.59 2.59 0 1 1 .77-5.06V9.7a5.68 5.68 0 0 0-.77-.05A5.65 5.65 0 1 0 15.54 15.3V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.24-1.48Z",
  x: "M17.53 3h3.2l-6.99 7.99L22 21h-6.44l-5.05-6.6L4.73 21H1.53l7.48-8.55L1.5 3h6.6l4.56 6.03L17.53 3Zm-1.12 16.06h1.77L7.68 4.85H5.78l10.63 14.21Z",
  twitter:
    "M17.53 3h3.2l-6.99 7.99L22 21h-6.44l-5.05-6.6L4.73 21H1.53l7.48-8.55L1.5 3h6.6l4.56 6.03L17.53 3Zm-1.12 16.06h1.77L7.68 4.85H5.78l10.63 14.21Z",
  linkedin:
    "M6.94 5.5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.2 8.9h3.6V21H3.2V8.9Zm5.86 0h3.45v1.65h.05c.48-.9 1.65-1.85 3.4-1.85 3.64 0 4.31 2.34 4.31 5.38V21h-3.6v-5.9c0-1.41-.02-3.22-1.98-3.22-1.98 0-2.28 1.53-2.28 3.11V21H9.06V8.9Z",
  whatsapp:
    "M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.82 9.82 0 0 0 4.68 1.19h.01c5.43 0 9.84-4.4 9.84-9.84 0-2.63-1.02-5.1-2.88-6.96A9.78 9.78 0 0 0 12.04 2Zm5.74 14.05c-.24.68-1.42 1.31-1.95 1.36-.5.05-.96.23-3.24-.67-2.73-1.08-4.46-3.87-4.6-4.05-.13-.18-1.1-1.46-1.1-2.78 0-1.33.7-1.98.94-2.25.25-.27.54-.34.72-.34h.52c.17 0 .4-.06.62.48.24.57.8 1.98.87 2.12.07.14.12.3.02.49-.1.18-.14.3-.28.46l-.42.49c-.14.14-.28.29-.12.57.16.27.71 1.17 1.53 1.9 1.05.93 1.93 1.22 2.2 1.36.27.14.43.12.59-.07.16-.18.68-.79.86-1.06.18-.27.36-.23.6-.14.25.09 1.57.74 1.84.87.27.14.45.2.51.32.07.11.07.64-.17 1.32Z",
};

const ALIASES: Record<string, string> = {
  fb: "facebook",
  ig: "instagram",
  yt: "youtube",
  "twitter/x": "x",
  wa: "whatsapp",
};

/** Normaliza el nombre escrito por el usuario a una clave de icono. */
function keyFor(name: string): string | null {
  const clean = name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
  const resolved = ALIASES[clean] ?? clean;
  return PATHS[resolved] ? resolved : null;
}

export function SocialIcon({
  name,
  size = 34,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const key = keyFor(name);
  if (!key) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      role="img"
      aria-label={name}
      className={className}
    >
      <path d={PATHS[key]} />
    </svg>
  );
}

/** ¿Se reconoce esta red y por tanto se puede dibujar su icono? */
export function hasSocialIcon(name: string): boolean {
  return keyFor(name) !== null;
}
