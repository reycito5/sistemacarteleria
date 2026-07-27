import { ArrowUpRight, CalendarDays, Clock, GraduationCap } from "lucide-react";
import {
  STATUS_LABEL,
  type PortalProgram,
  type ProgramStatus,
} from "@/lib/integration/portal";

/** Color de la etiqueta de estado, igual que en el portal de oferta. */
const STATUS_STYLE: Record<ProgramStatus, string> = {
  abierta: "bg-inst-red text-inst-white",
  cerrada: "bg-inst-blue-bottom/85 text-inst-white",
  ejecucion: "bg-inst-blue-bottom/85 text-inst-white",
  proximo: "bg-inst-gold text-inst-blue-bottom",
};

/**
 * Tarjeta de programa del portal público.
 *
 * Sigue la estructura del portal de oferta académica: imagen de portada con
 * el nivel y el estado superpuestos, la modalidad en la esquina, y debajo el
 * área, el nombre en serif y la ficha breve.
 */
export function ProgramCard({ program }: { program: PortalProgram }) {
  const href = program.enrollmentUrl ?? undefined;
  const Wrapper = href ? "a" : "div";

  return (
    <Wrapper
      {...(href ? { href, target: "_blank", rel: "noreferrer" } : {})}
      className="group flex h-full w-full flex-col overflow-hidden rounded-[18px] border border-ui-border bg-ui-surface shadow-[var(--shadow-ui-sm)] transition hover:-translate-y-1 hover:border-inst-blue/30 hover:shadow-[var(--shadow-ui-lg)]"
    >
      {/* Portada */}
      <div className="relative aspect-[4/3] overflow-hidden bg-inst-blue-bottom">
        {program.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={program.imageUrl}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="ui-gradient-inst-mesh grid h-full w-full place-items-center">
            <GraduationCap
              size={44}
              className="text-inst-gold/50"
              aria-hidden
            />
          </div>
        )}

        {/* Degradado para que las etiquetas se lean sobre cualquier foto. */}
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/45"
        />

        {/* Una sola fila para que las dos etiquetas nunca se solapen: el nivel
            cede espacio y el estado se mantiene siempre legible. */}
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {program.level ? (
            <span className="min-w-0 truncate rounded-full bg-inst-blue-bottom/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.06em] text-inst-white backdrop-blur-sm">
              {program.level}
            </span>
          ) : (
            <span />
          )}

          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase backdrop-blur-sm ${
              STATUS_STYLE[program.status]
            }`}
          >
            {STATUS_LABEL[program.status]}
          </span>
        </div>

        {program.modality && (
          <span className="absolute bottom-3 left-3 rounded-full bg-black/45 px-3 py-1 text-[11px] font-semibold text-inst-white backdrop-blur-sm">
            {program.modality}
          </span>
        )}

        {href && (
          <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-inst-white/95 text-inst-blue-bottom transition group-hover:bg-inst-gold">
            <ArrowUpRight size={17} aria-hidden />
          </span>
        )}
      </div>

      {/* Ficha */}
      <div className="flex flex-1 flex-col p-5">
        {program.area && (
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-ui-faint">
            {program.area}
          </p>
        )}

        <span className="mt-2 self-start rounded-md bg-info-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-inst-blue-top">
          Programa del Vicerrectorado
        </span>

        <h3 className="mt-3 font-serif text-[19px] font-semibold leading-snug text-inst-blue-top">
          {program.name}
        </h3>

        {program.slogan && (
          <p className="mt-2 text-sm italic leading-relaxed text-ui-muted">
            “{program.slogan}”
          </p>
        )}

        <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ui-border pt-3.5 text-xs text-ui-muted">
          {program.durationMonths && (
            <div className="flex items-center gap-1.5">
              <Clock size={13} className="text-inst-gold" aria-hidden />
              <dt className="sr-only">Duración</dt>
              <dd>{program.durationMonths} meses</dd>
            </div>
          )}
          {program.startDate && (
            <div className="flex items-center gap-1.5">
              <CalendarDays size={13} className="text-inst-gold" aria-hidden />
              <dt className="sr-only">Inicio</dt>
              <dd>{program.startDate}</dd>
            </div>
          )}
          {program.credits && (
            <div className="flex items-center gap-1.5">
              <GraduationCap size={13} className="text-inst-gold" aria-hidden />
              <dt className="sr-only">Créditos</dt>
              <dd>{program.credits} créditos</dd>
            </div>
          )}
        </dl>
      </div>
    </Wrapper>
  );
}
