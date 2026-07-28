import type { ReactNode } from "react";
import type { MediaRef } from "@/lib/views/schemas";
import { SignageMedia } from "./SignageMedia";
import { isVideoRef } from "./mediaKind";

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
      className={`font-mono text-[10.5px] font-bold uppercase tracking-[1.8px] ${color} ${className}`}
    >
      {children}
    </p>
  );
}

export function SerifTitle({
  children,
  size = 24,
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
      className={`inline-flex items-center gap-1.5 rounded-[2px] px-[13px] py-[6px] text-[11px] font-bold uppercase tracking-[.5px] ${BADGE_STYLES[kind]}`}
    >
      {BADGE_DOT.includes(kind) && (
        <span
          aria-hidden
          className={`text-[8px] leading-none ${pulses ? "ui-pulse" : ""}`}
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
  flag = true,
  showMediaKind = true,
  children,
}: PhotoPanelProps) {
  return (
    <div
      className="relative flex flex-col justify-end overflow-hidden rounded-[2px] bg-sig-ink-deep"
      style={{ gridColumn: `span ${span}` }}
    >
      <SignageMedia media={media} />

      {flag && (
        <span
          aria-hidden
          className="absolute right-0 top-0 z-[3] h-[130px] w-[130px] bg-sig-red"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
        />
      )}

      {showMediaKind && isVideoRef(media) && (
        <span className="absolute left-[36px] top-[32px] z-[3] inline-flex items-center gap-2 rounded-[2px] bg-black/55 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[.6px] text-white backdrop-blur-sm">
          <span aria-hidden className="text-[9px]">
            ▶
          </span>
          Video
        </span>
      )}

      <div className="relative z-[2] px-[36px] py-[32px]">
        {badge && <div className="mb-3.5">{badge}</div>}
        {eyebrow && <Eyebrow tone="light">{eyebrow}</Eyebrow>}
        {title && (
          <h4 className="mt-2 font-serif text-[34px] font-semibold leading-[1.16] tracking-[.1px] text-white">
            {title}
          </h4>
        )}
        {sub && (
          <p className="mt-2.5 max-w-[90%] text-[14.5px] font-medium text-white/70">
            {sub}
          </p>
        )}
        {children}
      </div>
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
  return (
    <div className="flex items-start justify-between px-[30px] pb-1 pt-[26px]">
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <SerifTitle className="mt-2">{title}</SerifTitle>
      </div>
      {right}
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
      className={`flex min-h-0 flex-1 flex-col px-[30px] pb-[28px] pt-[18px] ${className}`}
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
  return (
    <div
      className="grid gap-px border-y border-sig-rule bg-sig-rule"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
    >
      {fields.map((f, i) => (
        <div
          key={`${f.label}-${i}`}
          className="flex min-w-0 flex-col gap-1.5 bg-sig-card px-[18px] pb-[17px] pt-[15px]"
        >
          <span className="font-mono text-[9.5px] font-bold tracking-[1.2px] text-sig-red">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="text-[9.5px] font-bold uppercase tracking-[.9px] text-sig-text-faint">
            {f.label}
          </span>
          <span className="break-words font-serif text-[14px] font-bold leading-[1.3] text-sig-ink">
            {f.value}
          </span>
        </div>
      ))}
    </div>
  );
}

/* --- Bandas inferiores --------------------------------------------------- */

/** Cuadrícula QR decorativa, estable y legible a distancia. */
function QrGlyph() {
  const cells = [
    [9, 1], [12, 1], [9, 4], [15, 9], [9, 9], [12, 12], [18, 12], [21, 15],
    [9, 15], [15, 18], [18, 21], [9, 21], [24, 9], [12, 24], [21, 24],
    [15, 24], [24, 18],
  ];
  return (
    <svg viewBox="0 0 29 29" className="h-full w-full" fill="#121F5C">
      <rect width="29" height="29" fill="#fff" />
      {[
        [0, 0],
        [22, 0],
        [0, 22],
      ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x} y={y} width="7" height="7" />
          <rect x={x + 1.5} y={y + 1.5} width="4" height="4" fill="#fff" />
          <rect x={x + 2.5} y={y + 2.5} width="2" height="2" />
        </g>
      ))}
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" />
      ))}
    </svg>
  );
}

export function QrStrip({ label }: { label: string }) {
  return (
    <div className="mt-auto flex items-center gap-4 bg-sig-ink px-[30px] py-[18px]">
      <div className="h-[62px] w-[62px] shrink-0 rounded-[2px] bg-white p-[5px]">
        <QrGlyph />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[1.2px] text-white/55">
          Código QR
        </p>
        <p className="mt-0.5 font-serif text-[15px] font-semibold text-white">
          {label}
        </p>
      </div>
    </div>
  );
}

export function NextStrip({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-t border-sig-rule px-[30px] py-3.5">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[1.2px] text-sig-text-faint">
          Próximo contenido
        </p>
        <p className="mt-0.5 text-[13.5px] font-semibold text-sig-ink">{label}</p>
      </div>
      <span aria-hidden className="text-[18px] text-sig-red">
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
        <div key={i} className="bg-sig-card px-6 py-5">
          <p className="font-serif text-[36px] font-semibold leading-none text-sig-ink">
            {s.value}
          </p>
          <p className="mt-1 text-[11.5px] font-semibold text-sig-text-soft">
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
          className="flex items-baseline justify-between border-b border-sig-rule py-[13px] last:border-b-0"
        >
          <span className="text-[12.5px] font-semibold text-sig-text-soft">
            {r.label}
          </span>
          <span className="text-right text-[14.5px] font-bold text-sig-ink">
            {r.value}
          </span>
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
    <div className="flex items-start gap-5 border-b border-sig-rule py-[15px] last:border-b-0">
      <span className="w-[56px] shrink-0 pt-0.5 font-mono text-[15px] font-bold text-sig-red">
        {time}
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-serif text-[16px] font-bold text-sig-ink">{title}</p>
        {meta && (
          <p className="mt-0.5 text-[12px] text-sig-text-soft">{meta}</p>
        )}
      </div>
      {badge}
    </div>
  );
}

export function PullQuote({
  children,
  size = 21,
}: {
  children: ReactNode;
  size?: number;
}) {
  return (
    <blockquote
      className="relative pl-[22px] font-serif font-medium italic leading-[1.42] text-sig-ink"
      style={{ fontSize: size }}
    >
      <span
        aria-hidden
        className="absolute bottom-1 left-0 top-1 w-[3px] bg-sig-red"
      />
      {children}
    </blockquote>
  );
}

export function LogroList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-col gap-[11px]">
      {items.map((text, i) => (
        <li
          key={i}
          className="flex items-start gap-3 text-[13.5px] leading-[1.55] text-sig-text-soft"
        >
          <span className="shrink-0 pt-0.5 font-mono text-[11px] font-bold text-sig-red">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{text}</span>
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
    <div className="flex items-center gap-4 border-b border-sig-rule py-3.5 last:border-b-0">
      <div className="relative w-[60px] shrink-0 overflow-hidden rounded-[2px] bg-sig-ink-deep [aspect-ratio:4/5]">
        <SignageMedia media={program.media} fallbackLabel="" />
      </div>
      <div className="min-w-0 flex-1">
        {program.type && (
          <p className="text-[10px] font-bold uppercase tracking-[.9px] text-sig-red">
            {program.type}
            {program.version ? ` · ${program.version}` : ""}
          </p>
        )}
        <p className="mt-0.5 line-clamp-2 font-serif text-[16.5px] font-semibold leading-[1.25] text-sig-ink">
          {program.name}
        </p>
        <p className="mt-1 text-[11.5px] text-sig-text-soft">
          {[program.modality, program.duration, program.credits]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <div className="w-[112px] shrink-0 text-right">
        <SigBadge kind={open ? "onlight-open" : "onlight-soon"}>
          {open ? "Inscripción abierta" : "Próximamente"}
        </SigBadge>
        {program.dateShort && (
          <p className="mt-2 whitespace-nowrap font-mono text-[11.5px] font-bold text-sig-ink">
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
      <div className="relative max-h-[210px] shrink-0 overflow-hidden [aspect-ratio:4/5]">
        <SignageMedia media={program.media} fallbackLabel="" />
        {day && (
          <div className="absolute bottom-3 left-4 z-[2] text-white">
            <p className="font-serif text-[28px] font-bold leading-none">{day}</p>
            <p className="mt-0.5 text-[10px] font-bold uppercase tracking-[1px] text-[#FF9DA0]">
              {rest.join(" ")}
            </p>
          </div>
        )}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 px-[18px] pb-[18px] pt-4">
        {program.type && (
          <p className="text-[9.5px] font-bold uppercase tracking-[1px] text-sig-red">
            {program.type}
          </p>
        )}
        <p className="font-serif text-[15.5px] font-semibold leading-[1.28] text-sig-ink">
          {program.name}
        </p>
        <p className="text-[11px] text-sig-text-soft">
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
    <div className="flex gap-4 border-b border-sig-rule py-4 last:border-b-0">
      <div className="relative h-[70px] w-[70px] shrink-0 overflow-hidden rounded-[2px] bg-sig-ink-deep">
        <SignageMedia media={media} fallbackLabel="" />
        {video && (
          <>
            <span className="absolute inset-0 z-[2] grid place-items-center text-[13px] text-white">
              ▶
            </span>
            {duration && (
              <span className="absolute bottom-1 right-1 z-[2] bg-black/70 px-1 py-px font-mono text-[8px] font-bold tracking-[.3px] text-white">
                {duration}
              </span>
            )}
          </>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[9.5px] font-bold uppercase tracking-[.9px] text-sig-red">
          {video ? "Video" : "Noticia"}
        </p>
        <p className="mt-0.5 font-serif text-[14.5px] font-bold leading-[1.35] text-sig-ink">
          {title}
        </p>
        {meta && (
          <p className="mt-1 text-[11.5px] text-sig-text-soft">{meta}</p>
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
        className={`grid h-[88px] w-[88px] place-items-center rounded-full border border-sig-rule text-[34px] ${
          tone === "red" ? "text-sig-red" : "text-sig-ink"
        }`}
      >
        {glyph}
      </div>
      <h2 className="font-serif text-[36px] font-semibold tracking-[.2px] text-sig-ink">
        {title}
      </h2>
      {sub && (
        <p className="max-w-[740px] text-[16px] font-medium leading-[1.6] text-sig-text-soft">
          {sub}
        </p>
      )}
      {children}
    </div>
  );
}
