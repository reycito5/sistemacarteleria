import type { ReactNode } from "react";
import type { MediaRef } from "@/lib/views/schemas";
import { SignageMedia } from "./SignageMedia";
import { AutoFitText } from "./AutoFitText";
import { isVideoRef } from "./mediaKind";
import { QrCode } from "./QrCode";
import { T } from "./scale";

/* ==========================================================================
 * Primitivas de la línea gráfica de cartelería V12.
 *
 * Todo lo que compone una pantalla del televisor sale de aquí, de modo que
 * las doce plantillas comparten exactamente el mismo lenguaje visual y una
 * corrección se aplica a todas a la vez.
 *
 * Las medidas están en píxeles del lienzo 1920×1080; `ScreenFrame` lo escala.
 * ======================================================================== */

/* --- Tipografía ---------------------------------------------------------- */

export function Eyebrow({
  children,
  tone = "red",
  className = "",
}: {
  children: ReactNode;
  tone?: "red" | "light" | "faint";
  className?: string;
}) {
  const color =
    tone === "red"
      ? "text-sig-red"
      : tone === "light"
        ? "text-[#FF9DA0]"
        : "text-sig-text-faint";
  return (
    <p
      className={`font-mono font-bold uppercase tracking-[.14em] ${color} ${className}`}
      style={{ fontSize: T.eyebrow }}
    >
      {children}
    </p>
  );
}

export function SerifTitle({
  children,
  size = T.cardTitle,
  className = "",
}: {
  children: ReactNode;
  size?: number;
  className?: string;
}) {
  return (
    <h3
      className={`font-serif font-semibold leading-[1.2] tracking-[.1px] text-sig-ink ${className}`}
      style={{ fontSize: size }}
    >
      {children}
    </h3>
  );
}

/* --- Distintivos --------------------------------------------------------- */

export type BadgeKind =
  | "open"
  | "soon"
  | "live"
  | "info"
  | "neutral"
  | "onlight"
  | "onlight-open"
  | "onlight-soon"
  | "onlight-live";

const BADGE_STYLES: Record<BadgeKind, string> = {
  open: "bg-[#123B27] text-[#8FE3B4]",
  soon: "bg-[#3B2A0E] text-[#F0C275]",
  live: "bg-sig-red text-white",
  info: "bg-white/15 text-white",
  neutral: "bg-[#EEEBE1] text-sig-text-soft",
  onlight: "bg-sig-paper-2 text-sig-ink",
  "onlight-open": "bg-[#E7F5EC] text-[#1C8A4E]",
  "onlight-soon": "bg-[#FDF0E1] text-[#B45A05]",
  "onlight-live": "bg-[#FBE5E6] text-sig-red",
};

const BADGE_DOT: BadgeKind[] = ["open", "live", "onlight-open", "onlight-live"];

export function SigBadge({
  children,
  kind = "info",
}: {
  children: ReactNode;
  kind?: BadgeKind;
}) {
  const pulses = kind === "live" || kind === "onlight-live";
  return (
    <span
      className={`inline-flex items-center gap-2.5 rounded-[3px] px-5 py-2.5 font-bold uppercase tracking-[.06em] ${BADGE_STYLES[kind]}`}
      style={{ fontSize: T.eyebrow }}
    >
      {BADGE_DOT.includes(kind) && (
        <span
          aria-hidden
          className={`text-[14px] leading-none ${pulses ? "ui-pulse" : ""}`}
        >
          ●
        </span>
      )}
      {children}
    </span>
  );
}

/* --- Panel de foto o video ----------------------------------------------- */

interface PhotoPanelProps {
  media?: MediaRef;
  span: number;
  eyebrow?: string;
  title?: string;
  sub?: string;
  badge?: ReactNode;
  /** Esquina roja diagonal superior derecha. */
  flag?: boolean;
  /** Distintivo «Video» cuando el medio es un video (se calcula solo). */
  showMediaKind?: boolean;
  children?: ReactNode;
  /** Control de reproducción para secuencias editoriales. */
  mediaActive?: boolean;
  mediaLoop?: boolean;
  onMediaEnded?: () => void;
  onMediaError?: () => void;
  /** Conserva afiches verticales 4:5 completos dentro de un marco editorial. */
  posterFrame?: boolean;
}

/**
 * Panel principal de imagen o video, con el duotono institucional y el pie de
 * texto sobre el degradado. Es el bloque más reutilizado de las plantillas.
 */
export function PhotoPanel({
  media,
  span,
  eyebrow,
  title,
  sub,
  badge,
  children,
  mediaActive = true,
  mediaLoop = true,
  onMediaEnded,
  onMediaError,
  posterFrame = false,
}: PhotoPanelProps) {
  // Regla de arquitectura: el texto NUNCA va encima del medio. El medio ocupa
  // su propia área limpia (arriba) y, si hay rótulo, éste va en un bloque
  // sólido separado debajo. Cada cosa tiene su lado.
  const hasCaption = Boolean(badge || eyebrow || title || sub || children);

  return (
    <div
      className="flex flex-col overflow-hidden rounded-[2px] bg-sig-ink-deep"
      style={{ gridColumn: `span ${span}` }}
    >
      {/* Área del medio: foto o video, TOTALMENTE limpia, sin NADA encima. */}
      <div
        className={`relative min-h-0 flex-1 overflow-hidden ${
          posterFrame ? "bg-[#eef0f5] p-[26px]" : ""
        }`}
      >
        <SignageMedia
          media={media}
          overlayText={false}
          active={mediaActive}
          loop={mediaLoop}
          onEnded={onMediaEnded}
          onPlaybackError={onMediaError}
          fit={posterFrame ? "contain" : "cover"}
          className={
            posterFrame
              ? "!inset-[26px] rounded-[8px] bg-white shadow-[0_18px_45px_rgba(7,19,66,.18)] ring-2 ring-white"
              : ""
          }
        />
      </div>

      {/* Bloque de texto: sólido, separado del medio (nunca superpuesto). */}
      {hasCaption && (
        <div className="max-h-[26%] shrink-0 overflow-hidden bg-sig-ink px-[34px] py-[16px]">
          {badge && <div className="mb-1.5">{badge}</div>}
          {eyebrow && (
            <p
              className="font-semibold uppercase tracking-[.16em] text-sig-red"
              style={{ fontSize: 15 }}
            >
              {eyebrow}
            </p>
          )}
          {title && (
            <AutoFitText
              as="h4"
              className="mt-0.5 font-serif font-semibold leading-[1.08] text-white"
              maxSize={26}
              minSize={17}
              maxHeight={58}
            >
              {title}
            </AutoFitText>
          )}
          {sub && (
            <AutoFitText
              className="mt-1 max-w-[96%] font-medium leading-[1.2] text-white/65"
              maxSize={18}
              minSize={13}
              maxHeight={44}
            >
              {sub}
            </AutoFitText>
          )}
          {children}
        </div>
      )}
    </div>
  );
}

/* --- Tarjeta editorial --------------------------------------------------- */

export function SigCard({
  span,
  children,
  className = "",
  center = false,
}: {
  span: number;
  children: ReactNode;
  className?: string;
  center?: boolean;
}) {
  return (
    <section
      className={`relative flex flex-col overflow-hidden rounded-[2px] border border-sig-rule bg-sig-card ${
        center ? "justify-center" : ""
      } ${className}`}
      style={{ gridColumn: `span ${span}` }}
    >
      {children}
    </section>
  );
}

export function CardHead({
  eyebrow,
  title,
  right,
}: {
  eyebrow?: string;
  title: ReactNode;
  right?: ReactNode;
}) {
  const titleSize =
    typeof title === "string" && title.length > 72
      ? 31
      : typeof title === "string" && title.length > 42
        ? 34
        : T.cardTitle;

  return (
    <div className="flex shrink-0 items-start justify-between gap-6 px-[38px] pb-2 pt-[30px]">
      <div className="min-w-0 flex-1">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        {typeof title === "string" ? (
          <AutoFitText
            as="h3"
            className="mt-2 font-serif font-bold leading-[1.08] text-sig-ink"
            maxSize={titleSize}
            minSize={22}
            maxHeight={112}
          >
            {title}
          </AutoFitText>
        ) : (
          <SerifTitle size={titleSize} className="mt-2">
            {title}
          </SerifTitle>
        )}
      </div>
      {right && <div className="max-w-[240px] shrink-0">{right}</div>}
    </div>
  );
}

export function CardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex min-h-0 flex-1 flex-col overflow-hidden px-[38px] pb-[34px] pt-[22px] ${className}`}
    >
      {children}
    </div>
  );
}

/* --- Rejilla de campos («01 Inicio», «02 Modalidad»…) -------------------- */

export interface FieldEntry {
  label: string;
  value: string;
}

export function FieldGrid({
  fields,
  columns = 4,
}: {
  fields: FieldEntry[];
  columns?: 2 | 3 | 4;
}) {
  if (fields.length === 0) return null;
  // Rellena la última fila para que no quede una celda vacía con el color del
  // filete: las celdas de relleno usan el fondo de la tarjeta.
  const remainder = (columns - (fields.length % columns)) % columns;
  return (
    <div
      className="grid gap-px border-y border-sig-rule bg-sig-rule"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
    >
      {fields.map((f, i) => (
        <div
          key={`${f.label}-${i}`}
          className="flex min-w-0 flex-col gap-[7px] bg-sig-card px-[22px] pb-[17px] pt-[16px]"
        >
          {/* Número y etiqueta en una sola línea: gana altura y se lee como ficha. */}
          <span className="flex min-w-0 items-baseline gap-2">
            <span
              className="shrink-0 font-mono font-bold tracking-[.1em] text-sig-red"
              style={{ fontSize: 15 }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              className="truncate font-semibold uppercase tracking-[.1em] text-sig-text-faint"
              style={{ fontSize: 16 }}
            >
              {f.label}
            </span>
          </span>
          <AutoFitText
            as="span"
            className="break-words font-serif font-bold leading-[1.18] text-sig-ink"
            maxSize={23}
            minSize={15}
            maxHeight={58}
          >
            {f.value}
          </AutoFitText>
        </div>
      ))}
      {Array.from({ length: remainder }).map((_, i) => (
        <div key={`filler-${i}`} aria-hidden className="bg-sig-card" />
      ))}
    </div>
  );
}

/* --- Bandas inferiores --------------------------------------------------- */

export function QrStrip({
  label,
  url,
}: {
  label: string;
  /** Contenido del código. Sin él no se dibuja el QR, sólo el texto. */
  url?: string;
}) {
  return (
    <div className="mt-auto flex items-center gap-6 bg-sig-ink px-[38px] py-[22px]">
      {url && (
        <div className="shrink-0 rounded-[4px] bg-white p-2.5">
          <QrCode value={url} size={108} />
        </div>
      )}
      <div className="min-w-0">
        <p
          className="font-semibold uppercase tracking-[.16em] text-white/55"
          style={{ fontSize: 17 }}
        >
          Escanea el código
        </p>
        <p
          className="mt-1 line-clamp-2 font-serif font-bold leading-[1.15] text-white"
          style={{ fontSize: 30 }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

export function NextStrip({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between gap-6 border-t border-sig-rule px-[38px] py-[22px]">
      <div className="min-w-0">
        <p
          className="font-bold uppercase tracking-[.14em] text-sig-text-faint"
          style={{ fontSize: 19 }}
        >
          A continuación
        </p>
        <p
          className="mt-1 truncate font-semibold text-sig-ink"
          style={{ fontSize: T.meta }}
        >
          {label}
        </p>
      </div>
      <span aria-hidden className="text-[34px] leading-none text-sig-red">
        →
      </span>
    </div>
  );
}

export function StatRow({
  stats,
}: {
  stats: { value: string; label: string }[];
}) {
  if (stats.length === 0) return null;
  return (
    <div
      className="mt-auto grid gap-px bg-sig-rule"
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0,1fr))` }}
    >
      {stats.map((s, i) => (
        <div key={i} className="bg-sig-card px-8 py-7">
          <p
            className="font-serif font-bold leading-none text-sig-ink"
            style={{ fontSize: T.stat }}
          >
            {s.value}
          </p>
          <p
            className="mt-2 font-semibold text-sig-text-soft"
            style={{ fontSize: T.meta }}
          >
            {s.label}
          </p>
        </div>
      ))}
    </div>
  );
}

/* --- Listas -------------------------------------------------------------- */

export function InfoList({ rows }: { rows: FieldEntry[] }) {
  return (
    <div className="flex flex-col">
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-baseline justify-between gap-6 border-b border-sig-rule py-[20px] last:border-b-0"
        >
          <span
            className="shrink-0 font-semibold text-sig-text-soft"
            style={{ fontSize: T.meta }}
          >
            {r.label}
          </span>
          <AutoFitText
            as="span"
            className="text-right font-bold leading-[1.2] text-sig-ink"
            maxSize={T.body}
            minSize={15}
            maxHeight={58}
          >
            {r.value}
          </AutoFitText>
        </div>
      ))}
    </div>
  );
}

export function AgendaRow({
  time,
  title,
  meta,
  badge,
}: {
  time: string;
  title: string;
  meta?: string;
  badge?: ReactNode;
}) {
  return (
    <div className="flex items-start gap-7 border-b border-sig-rule py-[22px] last:border-b-0">
      <span
        className="w-[110px] shrink-0 font-mono font-bold leading-tight text-sig-red"
        style={{ fontSize: T.itemTitle }}
      >
        {time}
      </span>
      <div className="min-w-0 flex-1">
        <AutoFitText
          className="font-serif font-bold leading-[1.18] text-sig-ink"
          maxSize={T.itemTitle}
          minSize={18}
          maxHeight={68}
        >
          {title}
        </AutoFitText>
        {meta && (
          <AutoFitText
            className="mt-1.5 leading-[1.2] text-sig-text-soft"
            maxSize={T.meta}
            minSize={14}
            maxHeight={42}
          >
            {meta}
          </AutoFitText>
        )}
      </div>
      {badge}
    </div>
  );
}

export function PullQuote({
  children,
  size = T.bodyLg,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <blockquote
      className="relative pl-[30px] font-serif font-medium italic leading-[1.35] text-sig-ink"
      style={{ fontSize: size }}
    >
      <span
        aria-hidden
        className="absolute bottom-1 left-0 top-1 w-[6px] bg-sig-red"
      />
      {children}
    </blockquote>
  );
}

export function LogroList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-[18px]">
      {items.map((text, i) => (
        <li
          key={i}
          className="flex items-start gap-4 leading-[1.4] text-sig-text-soft"
          style={{ fontSize: T.body }}
        >
          <span className="shrink-0 pt-1 font-mono text-[22px] font-bold text-sig-red">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="line-clamp-2">{text}</span>
        </li>
      ))}
    </ul>
  );
}

/* --- Fichas de programa -------------------------------------------------- */

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

/** Fila compacta con miniatura vertical: listados de oferta. */
export function ProgramTicket({ program }: { program: ProgramLike }) {
  const open = program.status !== "soon";
  return (
    <div className="flex items-center gap-5 border-b border-sig-rule py-[18px] last:border-b-0">
      <div className="relative w-[92px] shrink-0 overflow-hidden rounded-[5px] border border-sig-rule bg-white p-1 [aspect-ratio:4/5]">
        <SignageMedia media={program.media} fallbackLabel="" active={false} fit="contain" className="!inset-1" />
      </div>
      <div className="min-w-0 flex-1">
        {program.type && (
          <p
            className="truncate font-semibold uppercase tracking-[.1em] text-sig-red"
            style={{ fontSize: 18 }}
          >
            {program.type}
            {program.version ? ` · ${program.version}` : ""}
          </p>
        )}
        <AutoFitText
          className="mt-1 font-serif font-bold leading-[1.15] text-sig-ink"
          maxSize={30}
          minSize={19}
          maxHeight={72}
        >
          {program.name}
        </AutoFitText>
        <p
          className="mt-1.5 line-clamp-1 text-sig-text-soft"
          style={{ fontSize: 21 }}
        >
          {[program.modality, program.duration, program.credits]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <div className="w-[212px] shrink-0 text-right">
        <SigBadge kind={open ? "onlight-open" : "onlight-soon"}>
          {open ? "Inscripción abierta" : "Próximamente"}
        </SigBadge>
        {program.dateShort && (
          <p
            className="mt-2.5 whitespace-nowrap font-mono font-bold text-sig-ink"
            style={{ fontSize: 21 }}
          >
            {program.dateShort}
          </p>
        )}
      </div>
    </div>
  );
}

/** Tarjeta vertical con la fecha sobre la imagen: rejillas de próximos inicios. */
export function ProgramMini({ program }: { program: ProgramLike }) {
  const [day, ...rest] = (program.dateShort ?? "").split(" ");
  const open = program.status !== "soon";
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <div className="relative max-h-[300px] shrink-0 overflow-hidden border-b border-sig-rule bg-white p-3 [aspect-ratio:4/5]">
        <SignageMedia media={program.media} fallbackLabel="" active={false} fit="contain" className="!inset-3" />
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent"
        />
        {day && (
          <div className="absolute bottom-5 left-6 z-[2] text-white">
            <p className="font-serif text-[64px] font-bold leading-none">
              {day}
            </p>
            <p
              className="mt-1 font-bold uppercase tracking-[.12em] text-[#FF9DA0]"
              style={{ fontSize: 20 }}
            >
              {rest.join(" ")}
            </p>
          </div>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 px-[24px] pb-[24px] pt-5">
        {program.type && (
          <p
            className="font-bold uppercase tracking-[.1em] text-sig-red"
            style={{ fontSize: 19 }}
          >
            {program.type}
          </p>
        )}
        <AutoFitText
          className="font-serif font-bold leading-[1.15] text-sig-ink"
          maxSize={29}
          minSize={17}
          maxHeight={102}
        >
          {program.name}
        </AutoFitText>
        <p
          className="line-clamp-2 text-sig-text-soft"
          style={{ fontSize: 21 }}
        >
          {[program.modality, program.duration, program.credits]
            .filter(Boolean)
            .join(" · ")}
        </p>
        <div className="mt-auto">
          <SigBadge kind={open ? "onlight-live" : "onlight-soon"}>
            {open ? "Inicio próximo" : "Próximamente"}
          </SigBadge>
        </div>
      </div>
    </div>
  );
}

/* --- Noticias (artículo o video) ----------------------------------------- */

export function NewsRow({
  title,
  meta,
  media,
  isVideo,
  duration,
}: {
  title: string;
  meta?: string;
  media?: MediaRef;
  isVideo?: boolean;
  duration?: string;
}) {
  const video = isVideo ?? isVideoRef(media);
  return (
    <div className="flex min-h-0 flex-1 gap-6 overflow-hidden border-b border-sig-rule py-5 last:border-b-0">
      <div className="relative h-[124px] w-[124px] shrink-0 overflow-hidden rounded-[3px] bg-sig-ink-deep">
        <SignageMedia media={media} fallbackLabel="" active={false} />
        {video && (
          <>
            <span className="absolute inset-0 z-[2] grid place-items-center text-[30px] text-white drop-shadow">
              ▶
            </span>
            {duration && (
              <span className="absolute bottom-1.5 right-1.5 z-[2] bg-black/75 px-2 py-0.5 font-mono text-[16px] font-bold text-white">
                {duration}
              </span>
            )}
          </>
        )}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <p
          className="font-bold uppercase tracking-[.1em] text-sig-red"
          style={{ fontSize: 19 }}
        >
          {video ? "Video" : "Noticia"}
        </p>
        <p
          className="mt-1.5 line-clamp-5 break-words font-serif font-bold leading-[1.18] text-sig-ink"
          style={{ fontSize: T.itemTitle }}
        >
          {title}
        </p>
        {meta && (
          <p className="mt-2 line-clamp-2 text-sig-text-soft" style={{ fontSize: T.meta }}>
            {meta}
          </p>
        )}
      </div>
    </div>
  );
}

/* --- Pantallas técnicas -------------------------------------------------- */

export function TechScreen({
  glyph,
  title,
  sub,
  tone = "ink",
  children,
}: {
  glyph: string;
  title: string;
  sub?: string;
  tone?: "ink" | "red";
  children?: ReactNode;
}) {
  return (
    <div
      className="col-span-full flex flex-col items-center justify-center gap-5 p-10 text-center"
      style={{ gridColumn: "1 / -1" }}
    >
      <div
        className={`grid h-[150px] w-[150px] place-items-center rounded-full border-2 border-sig-rule text-[64px] ${
          tone === "red" ? "text-sig-red" : "text-sig-ink"
        }`}
      >
        {glyph}
      </div>
      <h2
        className="font-serif font-bold leading-tight text-sig-ink"
        style={{ fontSize: T.headline }}
      >
        {title}
      </h2>
      {sub && (
        <p
          className="max-w-[1200px] font-medium leading-[1.45] text-sig-text-soft"
          style={{ fontSize: T.bodyLg }}
        >
          {sub}
        </p>
      )}
      {children}
    </div>
  );
}
