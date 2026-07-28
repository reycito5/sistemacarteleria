import type { ReactNode } from "react";
import type { MediaRef } from "@/lib/views/schemas";
import { SignageMedia } from "./SignageMedia";
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
  // Sólo se superpone el degradado y el texto cuando realmente hay rótulo.
  // Un afiche o un video sin rótulo se ve limpio, sin texto encima.
  const hasOverlay = Boolean(badge || eyebrow || title || sub || children);

  return (
    <div
      className="relative flex flex-col justify-end overflow-hidden rounded-[2px] bg-sig-ink-deep"
      style={{ gridColumn: `span ${span}` }}
    >
      <SignageMedia media={media} overlayText={hasOverlay} />

      {flag && (
        <span
          aria-hidden
          className="absolute right-0 top-0 z-[3] h-[170px] w-[170px] bg-sig-red"
          style={{ clipPath: "polygon(100% 0, 100% 100%, 0 0)" }}
        />
      )}

      {showMediaKind && isVideoRef(media) && (
        <span
          className="absolute left-[44px] top-[40px] z-[3] inline-flex items-center gap-2.5 rounded-[3px] bg-black/60 px-4 py-2 font-bold uppercase tracking-[.08em] text-white backdrop-blur-sm"
          style={{ fontSize: T.eyebrow }}
        >
          <span aria-hidden>▶</span>
          Video
        </span>
      )}

      {hasOverlay && (
        <div className="relative z-[2] px-[44px] py-[40px]">
          {badge && <div className="mb-4">{badge}</div>}
          {eyebrow && <Eyebrow tone="light">{eyebrow}</Eyebrow>}
          {title && (
            <h4
              className="mt-3 font-serif font-bold leading-[1.1] text-white"
              style={{
                fontSize: T.headline,
                textShadow: "0 2px 24px rgba(0,0,0,.55)",
              }}
            >
              {title}
            </h4>
          )}
          {sub && (
            <p
              className="mt-4 max-w-[92%] font-medium leading-[1.4] text-white/85"
              style={{
                fontSize: T.body,
                textShadow: "0 1px 12px rgba(0,0,0,.5)",
              }}
            >
              {sub}
            </p>
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
  return (
    <div className="flex items-start justify-between gap-6 px-[38px] pb-2 pt-[34px]">
      <div className="min-w-0">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <SerifTitle className="mt-2.5">{title}</SerifTitle>
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
  return (
    <div
      className="grid gap-px border-y border-sig-rule bg-sig-rule"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))` }}
    >
      {fields.map((f, i) => (
        <div
          key={`${f.label}-${i}`}
          className="flex min-w-0 flex-col gap-2 bg-sig-card px-[24px] pb-[24px] pt-[20px]"
        >
          <span
            className="font-mono font-bold tracking-[.12em] text-sig-red"
            style={{ fontSize: 18 }}
          >
            {String(i + 1).padStart(2, "0")}
          </span>
          <span
            className="font-bold uppercase tracking-[.08em] text-sig-text-faint"
            style={{ fontSize: 19 }}
          >
            {f.label}
          </span>
          <span
            className="break-words font-serif font-bold leading-[1.25] text-sig-ink"
            style={{ fontSize: T.meta }}
          >
            {f.value}
          </span>
        </div>
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
    <div className="mt-auto flex items-center gap-6 bg-sig-ink px-[38px] py-[26px]">
      {url && (
        <div className="shrink-0 rounded-[4px] bg-white p-2.5">
          <QrCode value={url} size={124} />
        </div>
      )}
      <div className="min-w-0">
        <p
          className="font-bold uppercase tracking-[.14em] text-white/60"
          style={{ fontSize: 19 }}
        >
          Escanea el código
        </p>
        <p
          className="mt-1 font-serif font-bold leading-tight text-white"
          style={{ fontSize: T.itemTitle }}
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
            className="font-semibold text-sig-text-soft"
            style={{ fontSize: T.meta }}
          >
            {r.label}
          </span>
          <span
            className="text-right font-bold text-sig-ink"
            style={{ fontSize: T.body }}
          >
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
    <div className="flex items-start gap-7 border-b border-sig-rule py-[22px] last:border-b-0">
      <span
        className="w-[110px] shrink-0 font-mono font-bold leading-tight text-sig-red"
        style={{ fontSize: T.itemTitle }}
      >
        {time}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className="font-serif font-bold leading-[1.2] text-sig-ink"
          style={{ fontSize: T.itemTitle }}
        >
          {title}
        </p>
        {meta && (
          <p
            className="mt-1.5 text-sig-text-soft"
            style={{ fontSize: T.meta }}
          >
            {meta}
          </p>
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
          className="flex items-start gap-4 leading-[1.45] text-sig-text-soft"
          style={{ fontSize: T.body }}
        >
          <span className="shrink-0 pt-1 font-mono text-[22px] font-bold text-sig-red">
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
    <div className="flex items-center gap-6 border-b border-sig-rule py-[22px] last:border-b-0">
      <div className="relative w-[104px] shrink-0 overflow-hidden rounded-[3px] bg-sig-ink-deep [aspect-ratio:4/5]">
        <SignageMedia media={program.media} fallbackLabel="" />
      </div>
      <div className="min-w-0 flex-1">
        {program.type && (
          <p
            className="font-bold uppercase tracking-[.1em] text-sig-red"
            style={{ fontSize: 20 }}
          >
            {program.type}
            {program.version ? ` · ${program.version}` : ""}
          </p>
        )}
        <p
          className="mt-1 line-clamp-2 font-serif font-bold leading-[1.2] text-sig-ink"
          style={{ fontSize: T.itemTitle }}
        >
          {program.name}
        </p>
        <p className="mt-2 text-sig-text-soft" style={{ fontSize: T.meta }}>
          {[program.modality, program.duration, program.credits]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </div>
      <div className="w-[230px] shrink-0 text-right">
        <SigBadge kind={open ? "onlight-open" : "onlight-soon"}>
          {open ? "Inscripción abierta" : "Próximamente"}
        </SigBadge>
        {program.dateShort && (
          <p
            className="mt-3 whitespace-nowrap font-mono font-bold text-sig-ink"
            style={{ fontSize: T.meta }}
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
      <div className="relative max-h-[300px] shrink-0 overflow-hidden [aspect-ratio:4/5]">
        <SignageMedia media={program.media} fallbackLabel="" />
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
        <p
          className="font-serif font-bold leading-[1.2] text-sig-ink"
          style={{ fontSize: 30 }}
        >
          {program.name}
        </p>
        <p className="text-sig-text-soft" style={{ fontSize: 22 }}>
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
    <div className="flex gap-6 border-b border-sig-rule py-6 last:border-b-0">
      <div className="relative h-[124px] w-[124px] shrink-0 overflow-hidden rounded-[3px] bg-sig-ink-deep">
        <SignageMedia media={media} fallbackLabel="" />
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
      <div className="min-w-0">
        <p
          className="font-bold uppercase tracking-[.1em] text-sig-red"
          style={{ fontSize: 19 }}
        >
          {video ? "Video" : "Noticia"}
        </p>
        <p
          className="mt-1.5 font-serif font-bold leading-[1.2] text-sig-ink"
          style={{ fontSize: T.itemTitle }}
        >
          {title}
        </p>
        {meta && (
          <p className="mt-2 text-sig-text-soft" style={{ fontSize: T.meta }}>
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
