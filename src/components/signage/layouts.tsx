import type { ReactNode } from "react";
import type { MediaRef } from "@/lib/views/schemas";
import { SignageMedia } from "./SignageMedia";
import { QrCode } from "./QrCode";
import { FitBox } from "./FitBox";
import { T, LH, autoSize } from "./scale";

/* ==========================================================================
 * Arquetipos de composición de la cartelería V12.
 *
 * Antes las doce plantillas repetían la misma retícula 7/5 con una tarjeta al
 * lado: leído desde lejos, todo parecía la misma pantalla. Aquí se definen
 * CUATRO maneras distintas de ocupar el lienzo, y cada plantilla elige la que
 * corresponde a su intención comunicativa:
 *
 *   Poster  — el medio ocupa todo y el texto va encima. Máximo impacto.
 *   Split   — bloque de color macizo contra el medio. Para una ficha densa.
 *   Indice  — listados con la numeración como elemento gráfico.
 *   Editorial — el titular manda y el resto lo acompaña.
 *
 * Todas comparten la misma tipografía y paleta, así que el conjunto sigue
 * viéndose de la misma familia sin que las pantallas se confundan entre sí.
 * ======================================================================== */

/**
 * Programa mostrado en un listado. Es la forma mínima que necesitan las
 * plantillas: acepta tanto una ficha completa (`programEntrySchema`) como el
 * formato simple y antiguo de `offers`.
 */
export interface ProgramLike {
  type?: string;
  name: string;
  version?: string;
  modality?: string;
  duration?: string;
  credits?: string;
  dateShort?: string;
  status?: "open" | "soon";
  media?: MediaRef;
}

/* --- Distintivos --------------------------------------------------------- */

export type BadgeKind =
  | "neutral"
  | "onlight"
  | "onlight-open"
  | "onlight-soon"
  | "onlight-live";

const BADGE_STYLES: Record<BadgeKind, string> = {
  neutral: "bg-[#EEEBE1] text-sig-text-soft",
  onlight: "bg-sig-paper-2 text-sig-ink",
  "onlight-open": "bg-[#E7F5EC] text-[#1C8A4E]",
  "onlight-soon": "bg-[#FDF0E1] text-[#B45A05]",
  "onlight-live": "bg-[#FBE5E6] text-sig-red",
};

const BADGE_DOT: BadgeKind[] = ["onlight-open", "onlight-live"];

/** Distintivo de estado sobre fondo claro. */
export function SigBadge({
  children,
  kind = "neutral",
}: {
  children: ReactNode;
  kind?: BadgeKind;
}) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 whitespace-nowrap rounded-[3px] px-5 py-2.5 font-bold uppercase tracking-[.06em] ${BADGE_STYLES[kind]}`}
      style={{ fontSize: T.eyebrow }}
    >
      {BADGE_DOT.includes(kind) && (
        <span
          aria-hidden
          className={`text-[14px] leading-none ${
            kind === "onlight-live" ? "ui-pulse" : ""
          }`}
        >
          ●
        </span>
      )}
      {children}
    </span>
  );
}

/** Etiqueta pequeña en versalitas, sobre fondo claro u oscuro. */
export function Kicker({
  children,
  onDark = false,
}: {
  children: ReactNode;
  onDark?: boolean;
}) {
  return (
    <p
      className={`font-mono font-bold uppercase tracking-[.2em] ${
        onDark ? "text-[#FF9DA0]" : "text-sig-red"
      }`}
      style={{ fontSize: T.eyebrow }}
    >
      {children}
    </p>
  );
}

/** Banda roja maciza: el recurso de mayor contraste del sistema. */
export function RedBar({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-block bg-sig-red px-7 py-3 font-bold uppercase tracking-[.12em] text-white"
      style={{ fontSize: T.eyebrow }}
    >
      {children}
    </span>
  );
}

/* --------------------------------------------------------------------------
 * Arquetipo 1 — Poster
 * ------------------------------------------------------------------------ */

interface PosterProps {
  media?: MediaRef;
  kicker?: string;
  /** Titular a sangre. Es el elemento que se lee desde el fondo del pasillo. */
  title: string;
  sub?: string;
  badge?: ReactNode;
  /** Columna derecha opcional: datos, agenda, cita… */
  aside?: ReactNode;
  /** Ancho de la columna derecha en columnas de 12. */
  asideSpan?: number;
  qrUrl?: string;
  qrLabel?: string;
  children?: ReactNode;
}

/**
 * El medio ocupa TODO el lienzo y el texto va encima, alineado abajo a la
 * izquierda. Sin marcos ni tarjetas: es la composición de mayor impacto y la
 * que mejor aprovecha una foto o un video buenos.
 */
export function PosterLayout({
  media,
  kicker,
  title,
  sub,
  badge,
  aside,
  asideSpan = 4,
  qrUrl,
  qrLabel,
  children,
}: PosterProps) {
  return (
    <div className="col-span-12 relative flex min-h-0 flex-1 overflow-hidden rounded-[4px] bg-sig-ink-deep">
      <SignageMedia media={media} overlayText />

      {/* Velo lateral: garantiza contraste del texto sobre cualquier imagen. */}
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(10,20,64,.92) 0%, rgba(10,20,64,.72) 38%, rgba(10,20,64,.12) 68%, transparent 100%)",
        }}
      />

      <div className="relative z-[2] flex w-full min-w-0">
        <FitBox className="justify-end p-[56px]">
          {badge && <div className="mb-5">{badge}</div>}
          {kicker && <Kicker onDark>{kicker}</Kicker>}
          <h2
            className="mt-4 max-w-[94%] font-serif font-black text-white"
            style={{
              // El cuerpo se adapta a la longitud: un titular de cinco líneas
              // se saldría del lienzo y el televisor no puede desplazarse.
              fontSize: autoSize(title, T.poster, 58, aside ? 24 : 30),
              lineHeight: LH.poster,
              textShadow: "0 4px 40px rgba(0,0,0,.5)",
            }}
          >
            {title}
          </h2>
          {sub && (
            <p
              className="mt-6 line-clamp-3 max-w-[80%] font-medium text-white/85"
              style={{ fontSize: T.bodyLg, lineHeight: LH.body }}
            >
              {sub}
            </p>
          )}
          {children}

          {qrUrl && (
            <div className="mt-8 flex items-center gap-6">
              <div className="rounded-[4px] bg-white p-3">
                <QrCode value={qrUrl} size={118} />
              </div>
              {qrLabel && (
                <p
                  className="max-w-[420px] font-serif font-bold leading-tight text-white"
                  style={{ fontSize: T.itemTitle }}
                >
                  {qrLabel}
                </p>
              )}
            </div>
          )}
        </FitBox>

        {aside && (
          <aside
            className="flex shrink-0 flex-col border-l border-white/20 bg-black/40 backdrop-blur-md"
            style={{ width: `${(asideSpan / 12) * 100}%` }}
          >
            <FitBox className="justify-center gap-7 p-[44px]">{aside}</FitBox>
          </aside>
        )}
      </div>
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Arquetipo 2 — Split
 * ------------------------------------------------------------------------ */

interface SplitProps {
  media?: MediaRef;
  /** Lado del medio. El bloque de color va al contrario. */
  mediaSide?: "left" | "right";
  mediaSpan?: number;
  /** Contenido sobre el medio (nombre del programa, distintivos…). */
  mediaOverlay?: ReactNode;
  children: ReactNode;
  /** Bloque de color macizo en lugar de fondo papel. */
  solid?: boolean;
  /** El contenido ocupa todo el alto en vez de centrarse (listados). */
  stretch?: boolean;
}

/**
 * Medio a un lado y bloque macizo al otro, sin bordes ni tarjeta flotante.
 * Pensado para fichas densas —un programa con ocho datos— donde hace falta
 * superficie ordenada pero sin perder presencia visual.
 */
export function SplitLayout({
  media,
  mediaSide = "left",
  mediaSpan = 5,
  mediaOverlay,
  children,
  solid = false,
  stretch = false,
}: SplitProps) {
  const mediaBlock = (
    <div
      className="relative overflow-hidden bg-sig-ink-deep"
      style={{ gridColumn: `span ${mediaSpan}` }}
    >
      <SignageMedia media={media} overlayText={Boolean(mediaOverlay)} />
      {mediaOverlay && (
        <div className="relative z-[2] flex h-full flex-col justify-end p-[52px]">
          {mediaOverlay}
        </div>
      )}
    </div>
  );

  const contentBlock = (
    <div
      className={`flex min-w-0 flex-col overflow-hidden ${
        solid ? "bg-sig-ink text-white" : "bg-sig-card"
      }`}
      style={{ gridColumn: `span ${12 - mediaSpan}` }}
    >
      <FitBox className={stretch ? "" : "justify-center"}>{children}</FitBox>
    </div>
  );

  return (
    <div className="col-span-12 grid grid-cols-12 overflow-hidden rounded-[4px]">
      {mediaSide === "left" ? (
        <>
          {mediaBlock}
          {contentBlock}
        </>
      ) : (
        <>
          {contentBlock}
          {mediaBlock}
        </>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Arquetipo 3 — Índice
 * ------------------------------------------------------------------------ */

/**
 * Listado con cabecera propia. La numeración se usa como elemento gráfico y
 * las filas respiran, de modo que un listado de cuatro programas se lee de un
 * vistazo desde lejos en lugar de exigir lectura línea a línea.
 */
export function IndexLayout({
  kicker,
  title,
  right,
  children,
  footer,
}: {
  kicker?: string;
  title: string;
  right?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="col-span-12 flex min-h-0 flex-col overflow-hidden rounded-[4px] bg-sig-card">
      <header className="flex shrink-0 items-end justify-between gap-10 border-b-[6px] border-sig-ink px-[56px] pb-4 pt-[24px]">
        <div className="min-w-0">
          {kicker && <Kicker>{kicker}</Kicker>}
          <h2
            className="mt-2.5 font-serif font-black text-sig-ink"
            style={{
              fontSize: autoSize(title, 66, 44, right ? 24 : 32),
              lineHeight: LH.hero,
            }}
          >
            {title}
          </h2>
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </header>

      <FitBox className="px-[56px] py-4">{children}</FitBox>

      {footer}
    </div>
  );
}

/** Fila numerada de un índice: el número es el ancla visual. */
export function IndexRow({
  index,
  lead,
  title,
  meta,
  right,
  accent = false,
  size = 44,
  padY = 28,
}: {
  index: number;
  /** Sustituye al número: una hora, una fecha corta. */
  lead?: string;
  title: string;
  meta?: string;
  right?: ReactNode;
  /** Destaca la fila (elemento en curso o inminente). */
  accent?: boolean;
  /** Cuerpo del título; lo calcula `rowScale()` a partir del nº de filas. */
  size?: number;
  /** Relleno vertical; lo calcula `rowScale()`. */
  padY?: number;
}) {
  return (
    <div
      className={`flex shrink-0 items-center gap-8 border-b border-sig-rule last:border-b-0 ${
        accent ? "-mx-6 rounded-[4px] bg-sig-paper-2 px-6" : ""
      }`}
      style={{ paddingTop: padY, paddingBottom: padY }}
    >
      {lead ? (
        <span
          // Sin `nowrap`, «17 AGO 2026» se parte en tres líneas y triplica el
          // alto de la fila; el mínimo mantiene alineadas las horas cortas.
          className="shrink-0 whitespace-nowrap font-mono font-bold tabular-nums leading-none text-sig-red"
          style={{ fontSize: size, minWidth: size * 3.2 }}
        >
          {lead}
        </span>
      ) : (
        <span
          className="shrink-0 font-mono font-bold tabular-nums"
          style={{
            fontSize: size * 1.6,
            width: size * 2,
            lineHeight: 1,
            color: accent ? "var(--color-sig-red)" : "var(--color-sig-rule)",
          }}
        >
          {String(index).padStart(2, "0")}
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p
          className="line-clamp-2 font-serif font-bold text-sig-ink"
          style={{ fontSize: size, lineHeight: LH.title }}
        >
          {title}
        </p>
        {meta && (
          <p
            className="mt-1.5 truncate text-sig-text-soft"
            style={{ fontSize: Math.max(22, size - 12) }}
          >
            {meta}
          </p>
        )}
      </div>

      {right && <div className="shrink-0 text-right">{right}</div>}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Arquetipo 4 — Editorial
 * ------------------------------------------------------------------------ */

/**
 * El titular ocupa la mayor parte del lienzo y el resto lo acompaña. Para
 * mensajes de una sola idea —un comunicado, una cita— donde la foto es
 * secundaria o directamente no existe.
 */
export function EditorialLayout({
  kicker,
  title,
  lead,
  highlight,
  media,
  mediaSpan = 4,
  mediaOverlay,
  children,
  footer,
}: {
  kicker?: ReactNode;
  title: string;
  lead?: string;
  /** Dato protagonista: fecha límite, cifra, hora. */
  highlight?: string;
  media?: MediaRef;
  mediaSpan?: number;
  /** Pie de texto sobre el medio (rótulo institucional, autoría…). */
  mediaOverlay?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
}) {
  const hasMedia = Boolean(media?.src);
  const textSpan = hasMedia ? 12 - mediaSpan : 12;

  return (
    <div className="col-span-12 grid min-h-0 grid-cols-12 overflow-hidden rounded-[4px] bg-sig-card">
      <FitBox
        className="justify-center px-[60px] py-[44px]"
        style={{ gridColumn: `span ${textSpan}` }}
      >
        {kicker && <div className="mb-5">{kicker}</div>}

        <h2
          className="font-serif font-black text-sig-ink"
          style={{
            fontSize: autoSize(title, T.hero, 52, hasMedia ? 34 : 44),
            lineHeight: LH.hero,
          }}
        >
          {title}
        </h2>

        {lead && (
          <p
            className="mt-6 line-clamp-3 max-w-[1200px] font-medium text-sig-ink-soft"
            style={{ fontSize: T.bodyLg, lineHeight: LH.body }}
          >
            {lead}
          </p>
        )}

        {highlight && (
          <p
            className="mt-7 font-serif font-black text-sig-red"
            style={{
              fontSize: autoSize(highlight, T.statHero, 64, 10),
              lineHeight: 0.9,
            }}
          >
            {highlight}
          </p>
        )}

        {children}
        {footer}
      </FitBox>

      {hasMedia && (
        <div
          className="relative flex flex-col justify-end overflow-hidden bg-sig-ink-deep"
          style={{ gridColumn: `span ${mediaSpan}` }}
        >
          <SignageMedia media={media} overlayText={Boolean(mediaOverlay)} />
          {mediaOverlay && (
            <div className="relative z-[2] p-[44px]">{mediaOverlay}</div>
          )}
        </div>
      )}
    </div>
  );
}

/* --------------------------------------------------------------------------
 * Bloques de apoyo
 * ------------------------------------------------------------------------ */

/** Dato suelto grande: se usa dentro de las columnas laterales del poster. */
export function DataPoint({
  label,
  value,
  onDark = false,
  size = T.itemTitle,
}: {
  label: string;
  value: string;
  onDark?: boolean;
  /** Cuerpo del valor; se baja cuando la ficha tiene muchos campos. */
  size?: number;
}) {
  return (
    <div className="min-w-0">
      <p
        className={`truncate font-bold uppercase tracking-[.16em] ${
          onDark ? "text-white/55" : "text-sig-text-faint"
        }`}
        style={{ fontSize: 20 }}
      >
        {label}
      </p>
      <p
        className={`mt-1 line-clamp-2 font-serif font-bold leading-tight ${
          onDark ? "text-white" : "text-sig-ink"
        }`}
        style={{ fontSize: size }}
      >
        {value}
      </p>
    </div>
  );
}

/**
 * Banda inferior maciza con el QR. Es el cierre de las pantallas que llaman a
 * una acción: va a sangre, en azul institucional, con el código lo bastante
 * grande para escanearse desde metro y medio.
 */
export function QrFooter({
  url,
  label,
  note,
}: {
  url?: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="mt-auto flex shrink-0 items-center gap-7 bg-sig-ink px-[56px] py-[16px]">
      {url && (
        <div className="shrink-0 rounded-[4px] bg-white p-2.5">
          <QrCode value={url} size={94} />
        </div>
      )}
      <div className="min-w-0">
        <p
          className="font-mono font-bold uppercase tracking-[.2em] text-[#FF9DA0]"
          style={{ fontSize: T.eyebrow }}
        >
          {url ? "Escanea el código" : "Información"}
        </p>
        <p
          className="mt-1 truncate font-serif font-black leading-tight text-white"
          style={{ fontSize: 32 }}
        >
          {label}
        </p>
        {note && (
          <p
            className="mt-1 truncate text-white/70"
            style={{ fontSize: T.meta }}
          >
            {note}
          </p>
        )}
      </div>
    </div>
  );
}

/** Banda de cifras a sangre bajo un índice o una editorial. */
export function StatBand({
  stats,
  onDark = false,
}: {
  stats: { value: string; label: string }[];
  onDark?: boolean;
}) {
  if (stats.length === 0) return null;
  return (
    <div
      className={`mt-auto grid gap-px ${onDark ? "bg-white/15" : "bg-sig-rule"}`}
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0,1fr))` }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          className={`px-[56px] py-8 ${onDark ? "bg-sig-ink" : "bg-sig-paper-2"}`}
        >
          <p
            className={`font-serif font-black leading-none ${
              onDark ? "text-white" : "text-sig-ink"
            }`}
            style={{ fontSize: T.stat }}
          >
            {s.value}
          </p>
          <p
            className={`mt-3 font-bold uppercase tracking-[.12em] ${
              onDark ? "text-white/60" : "text-sig-text-soft"
            }`}
            style={{ fontSize: T.meta }}
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/**
 * Pantalla técnica: sincronización, sin conexión, mantenimiento y respaldo.
 *
 * No lleva foto ni tarjeta. Una franja roja, un titular enorme y el resto en
 * gris: se distingue al instante de una pantalla de contenido, que es
 * justamente lo que se busca cuando algo va mal.
 */
export function StatusLayout({
  kicker,
  title,
  sub,
  children,
  tone = "ink",
}: {
  kicker: string;
  title: string;
  sub?: string;
  children?: ReactNode;
  tone?: "ink" | "red";
}) {
  return (
    <div className="col-span-12 flex min-h-0 flex-col overflow-hidden rounded-[4px] bg-sig-card">
      <FitBox className="justify-center px-[110px] py-[40px]">
        <span
          aria-hidden
          className={`h-[14px] w-[220px] shrink-0 ${
            tone === "red" ? "bg-sig-red" : "bg-sig-ink"
          }`}
        />
        <p
          className={`mt-9 font-mono font-bold uppercase tracking-[.24em] ${
            tone === "red" ? "text-sig-red" : "text-sig-text-faint"
          }`}
          style={{ fontSize: T.meta }}
        >
          {kicker}
        </p>
        <h2
          className="mt-6 max-w-[1500px] font-serif font-black text-sig-ink"
          style={{
            fontSize: autoSize(title, T.hero, 56, 38),
            lineHeight: LH.hero,
          }}
        >
          {title}
        </h2>
        {sub && (
          <p
            className="mt-7 max-w-[1300px] font-medium text-sig-text-soft"
            style={{ fontSize: T.bodyLg, lineHeight: LH.body }}
          >
            {sub}
          </p>
        )}
        {children}
      </FitBox>
    </div>
  );
}

/** Cifra gigante con su rótulo. Elemento gráfico, no sólo información. */
export function BigStat({
  value,
  label,
  onDark = false,
}: {
  value: string;
  label: string;
  onDark?: boolean;
}) {
  return (
    <div>
      <p
        className={`font-serif font-black leading-none ${
          onDark ? "text-white" : "text-sig-ink"
        }`}
        style={{ fontSize: T.statHero }}
      >
        {value}
      </p>
      <p
        className={`mt-3 font-bold uppercase tracking-[.14em] ${
          onDark ? "text-white/60" : "text-sig-text-soft"
        }`}
        style={{ fontSize: T.meta }}
      >
        {label}
      </p>
    </div>
  );
}
