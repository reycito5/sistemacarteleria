import {
  STATUS_LABEL,
  type PortalProgram,
  type ProgramStatus,
} from "@/lib/integration/portal";
import { DATO, ROTULO, TITULAR_S } from "./editorial";

/**
 * Reseña de un programa de posgrado.
 *
 * Deliberadamente no es una tarjeta: no hay caja, ni sombra, ni botón
 * flotante. La portada se apoya sobre un filete y debajo se compone la ficha
 * como en un catálogo académico —área, nombre en serif, lema y datos duros en
 * monoespaciada—. El nombre es el único enlace real; la superficie completa se
 * vuelve pulsable con un pseudoelemento, de modo que el lector de pantalla
 * anuncia un solo destino en lugar de una caja entera.
 */

/** Sólo la inscripción abierta merece el rojo institucional. */
const ESTADO_TONO: Record<ProgramStatus, string> = {
  abierta: "text-brand-red",
  cerrada: "text-sig-text-soft",
  ejecucion: "text-sig-text-soft",
  proximo: "text-sig-text-soft",
};

export function ProgramCard({ program }: { program: PortalProgram }) {
  const href = program.enrollmentUrl ?? undefined;

  // Los datos duros se componen en una sola línea separada por filetes; los
  // campos vacíos se descartan antes para no dejar separadores huérfanos.
  const datos = [
    program.level,
    program.modality,
    program.durationMonths ? `${program.durationMonths} meses` : "",
    program.credits ? `${program.credits} créditos` : "",
    program.hours ? `${program.hours} horas` : "",
    program.startDate ? `Inicio ${program.startDate}` : "",
  ].filter(Boolean);

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-brand-ink-deep">
        {program.imageUrl ? (
          // Las portadas llegan del portal de oferta como URL externa
          // arbitraria, fuera del alcance del optimizador de imágenes.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={program.imageUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          // Sin fotografía, la inicial del programa hace de portada: mejor una
          // composición tipográfica que un icono genérico repetido.
          <div className="grid h-full w-full place-items-center">
            <span
              aria-hidden
              className="font-serif text-[7rem] font-semibold leading-none text-white/12"
            >
              {program.name.trim().charAt(0).toUpperCase()}
            </span>
          </div>
        )}
        <span
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-brand-red transition-transform duration-300 group-hover:scale-x-100"
        />
      </div>

      <div className="mt-6 flex flex-1 flex-col border-t border-sig-rule pt-5">
        {/* Altura mínima de dos renglones: con áreas largas el rótulo salta de
            línea y, sin ella, los nombres de la rejilla dejarían de alinearse. */}
        <div className="flex min-h-[2.1rem] flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          {program.area ? (
            <p className={`${ROTULO} text-brand-red`}>{program.area}</p>
          ) : (
            <span />
          )}
          <p className={`${ROTULO} ${ESTADO_TONO[program.status]}`}>
            {STATUS_LABEL[program.status]}
          </p>
        </div>

        <h3 className={`mt-4 text-pretty text-brand-ink ${TITULAR_S}`}>
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="transition-colors after:absolute after:inset-0 hover:text-brand-red"
            >
              {program.name}
              <span className="sr-only"> (se abre en una pestaña nueva)</span>
            </a>
          ) : (
            program.name
          )}
        </h3>

        {program.slogan && (
          <p className="mt-3 max-w-[42ch] font-serif text-[15px] italic leading-[1.6] text-sig-text-soft">
            {program.slogan}
          </p>
        )}

        {datos.length > 0 && (
          <ul className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 pt-6">
            {datos.map((dato, i) => (
              <li
                key={dato}
                className={`${DATO} flex items-center gap-3 text-[11px] uppercase tracking-[0.1em] text-sig-text-soft`}
              >
                {i > 0 && (
                  <span aria-hidden className="h-3 w-px bg-sig-rule" />
                )}
                {dato}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}
