"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import type { PortalProgram } from "@/lib/integration/portal";
import { ProgramCard } from "@/components/portal/ProgramCard";
import { EmptyState } from "@/components/ui/EmptyState";

/** Grupo de botones de filtro con recuento. */
function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; count: number }[];
  value: string;
  onChange: (v: string) => void;
}) {
  if (options.length <= 1) return null;
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[11px] font-bold uppercase tracking-[0.12em] text-ui-faint">
        {label}
      </span>
      {options.map((o) => {
        const active = value === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={[
              "rounded-full px-3.5 py-1.5 text-[12px] font-bold transition",
              active
                ? "bg-inst-blue-bottom text-inst-white"
                : "border border-ui-border-strong text-ui-muted hover:border-inst-blue/40 hover:text-inst-blue-top",
            ].join(" ")}
          >
            {o.value}
            <span className={active ? "ml-1.5 text-white/60" : "ml-1.5 text-ui-faint"}>
              {o.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/** Cuenta cuántos programas hay por cada valor de un campo. */
function tally(
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

const ALL = "Todos";

export function OfertaFilters({ programs }: { programs: PortalProgram[] }) {
  const [level, setLevel] = useState(ALL);
  const [area, setArea] = useState(ALL);

  const levels = useMemo(
    () => [{ value: ALL, count: programs.length }, ...tally(programs, "level")],
    [programs],
  );
  const areas = useMemo(
    () => [{ value: ALL, count: programs.length }, ...tally(programs, "area")],
    [programs],
  );

  const visible = programs.filter(
    (p) =>
      (level === ALL || p.level === level) && (area === ALL || p.area === area),
  );

  const hasFilters = levels.length > 1 || areas.length > 1;

  return (
    <div>
      {hasFilters && (
        <div className="mb-8 space-y-3 rounded-[16px] border border-ui-border bg-ui-surface p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-inst-blue-top">
            <SlidersHorizontal size={15} aria-hidden />
            Filtrar la oferta
          </p>
          <FilterRow
            label="Nivel"
            options={levels}
            value={level}
            onChange={setLevel}
          />
          <FilterRow label="Área" options={areas} value={area} onChange={setArea} />
        </div>
      )}

      <p className="mb-5 text-sm text-ui-muted">
        Mostrando <strong className="text-ui-ink">{visible.length}</strong> de{" "}
        {programs.length} programa{programs.length === 1 ? "" : "s"}.
      </p>

      {visible.length === 0 ? (
        <EmptyState
          title="Ningún programa coincide con el filtro"
          description="Pruebe con otro nivel o área de conocimiento."
        />
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => (
            <li key={p.id}>
              <ProgramCard program={p} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
