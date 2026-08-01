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
    "M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07Z",
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
  "tik tok": "tiktok",
  "tik-tok": "tiktok",
};

/**
 * Fondo de marca de cada red para el badge redondeado. Instagram lleva su
 * degradado característico; el resto, su color sólido oficial.
 */
const BRAND_BG: Record<string, string> = {
  facebook: "#1877F2",
  instagram:
    "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
  tiktok: "#010101",
  youtube: "#FF0000",
  x: "#010101",
  twitter: "#010101",
  linkedin: "#0A66C2",
  whatsapp: "#25D366",
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
  variant = "badge",
}: {
  name: string;
  size?: number;
  className?: string;
  /** `badge`: sello redondeado con el color de la marca. `glyph`: sólo trazo. */
  variant?: "badge" | "glyph";
}) {
  const key = keyFor(name);
  if (!key) return null;

  const glyph = (
    <svg
      viewBox="0 0 24 24"
      width={variant === "badge" ? Math.round(size * 0.6) : size}
      height={variant === "badge" ? Math.round(size * 0.6) : size}
      fill="currentColor"
      role="img"
      aria-label={name}
      className={variant === "badge" ? "" : className}
    >
      <path d={PATHS[key]} />
    </svg>
  );

  if (variant === "glyph") return glyph;

  return (
    <span
      aria-label={name}
      role="img"
      className={`inline-grid shrink-0 place-items-center rounded-[26%] text-white ring-1 ring-white/15 ${className}`}
      style={{
        width: size,
        height: size,
        background: BRAND_BG[key] ?? "#334155",
      }}
    >
      {glyph}
    </span>
  );
}

/** ¿Se reconoce esta red y por tanto se puede dibujar su icono? */
export function hasSocialIcon(name: string): boolean {
  return keyFor(name) !== null;
}
