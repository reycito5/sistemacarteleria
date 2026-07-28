"use client";

import { useMemo, useState } from "react";
import type { PortalProgram } from "@/lib/integration/portal";
import { ProgramCard } from "@/components/portal/ProgramCard";
import { DATO, ROTULO, TITULAR_S } from "@/components/portal/editorial";

/**
 * Filtros de la oferta.
 *
 * Se componen como el sumario de un catálogo —una hilera de rótulos con su
 * recuento— y no como una botonera: el filtro activo se marca con el filete
 * rojo institucional, el mismo recurso que señala la sección activa en la
 * cabecera.
 */
function HileraFiltro({
  etiqueta,
  opciones,
  valor,
  onCambio,
}: {
  etiqueta: string;
  opciones: { value: string; count: number }[];
  valor: string;
  onCambio: (v: string) => void;
}) {
  if (opciones.length <= 1) return null;
  return (
    <div className="flex flex-wrap items-baseline gap-x-7 gap-y-3">
      <span className={`${ROTULO} w-16 shrink-0 text-sig-text-soft`}>
        {etiqueta}
      </span>
      {opciones.map((opcion) => {
        const activa = valor === opcion.value;
        return (
          <button
            key={opcion.value}
            type="button"
            onClick={() => onCambio(opcion.value)}
            aria-pressed={activa}
            className={`group inline-flex items-baseline gap-1.5 border-b-2 pb-1 text-[13px] font-medium transition-colors ${
              activa
                ? "border-brand-red text-brand-ink"
                : "border-transparent text-sig-text-soft hover:border-sig-rule hover:text-brand-ink"
            }`}
          >
            {opcion.value}
            <span
              className={`${DATO} text-[10px] ${
                activa ? "text-brand-red" : "text-sig-text-soft"
              }`}
            >
              {opcion.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Cuenta cuántos programas hay por cada valor de un campo. */
function contar(
  programs: readonly PortalProgram[],
  field: "level" | "area",
): { value: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of programs) {
    const key = p[field];
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value, "es"));
}

const TODOS = "Todos";

export function OfertaFilters({ programs }: { programs: PortalProgram[] }) {
  const [nivel, setNivel] = useState(TODOS);
  const [area, setArea] = useState(TODOS);

  const niveles = useMemo(
    () => [{ value: TODOS, count: programs.length }, ...contar(programs, "level")],
    [programs],
  );
  const areas = useMemo(
    () => [{ value: TODOS, count: programs.length }, ...contar(programs, "area")],
    [programs],
  );

  // El resultado se deriva en el render a partir del estado de los filtros: no
  // hay estado espejo que sincronizar con un efecto.
  const visibles = programs.filter(
    (p) =>
      (nivel === TODOS || p.level === nivel) && (area === TODOS || p.area === area),
  );

  const hayFiltros = niveles.length > 1 || areas.length > 1;

  return (
    <div>
      {hayFiltros && (
        <div className="space-y-5 border-y border-sig-rule py-7">
          <HileraFiltro
            etiqueta="Nivel"
            opciones={niveles}
            valor={nivel}
            onCambio={setNivel}
          />
          <HileraFiltro
            etiqueta="Área"
            opciones={areas}
            valor={area}
            onCambio={setArea}
          />
        </div>
      )}

      <p
        className={`${ROTULO} mt-7 text-sig-text-soft`}
        aria-live="polite"
      >
        {visibles.length} de {programs.length} programa
        {programs.length === 1 ? "" : "s"}
      </p>

      {visibles.length === 0 ? (
        <div className="mt-14 border-t border-sig-rule pt-14">
          <p className={`text-brand-ink ${TITULAR_S}`}>
            Ningún programa coincide con esta combinación.
          </p>
          <p className="mt-3 max-w-[48ch] text-[15px] leading-relaxed text-sig-text-soft">
            Pruebe con otro nivel o con otra área de conocimiento, o consulte la
            oferta completa.
          </p>
        </div>
      ) : (
        <ul className="mt-12 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {visibles.map((programa) => (
            <li key={programa.id}>
              <ProgramCard program={programa} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
