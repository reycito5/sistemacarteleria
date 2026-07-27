"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { importProgramAsDestacado } from "@/lib/actions/portal";
import type { PortalProgram } from "@/lib/integration/portal";

export function ImportPortalList({ programs }: { programs: PortalProgram[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const importOne = (program: PortalProgram) => {
    setError(null);
    setBusyId(program.id);
    startTransition(async () => {
      const res = await importProgramAsDestacado(program);
      setBusyId(null);
      if (!res.ok) setError(res.error);
      else {
        setDone((d) => ({ ...d, [program.id]: true }));
        router.refresh();
      }
    });
  };

  if (programs.length === 0) {
    return <p className="text-sm text-panel-muted">El portal no devolvió programas.</p>;
  }

  return (
    <div>
      {error && <p className="mb-3 text-sm text-inst-red">{error}</p>}
      <ul
        className="divide-y rounded-md border bg-white"
        style={{ borderColor: "var(--color-panel-border)" }}
      >
        {programs.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center gap-4 px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-bold text-inst-blue-top">{p.name}</p>
              <p className="text-xs text-panel-muted">
                {[p.modality, p.startDate && `Inicio ${p.startDate}`, p.credits && `${p.credits} créditos`]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
            </div>
            {done[p.id] && (
              <span className="text-xs font-bold text-green-700">Importado ✓</span>
            )}
            <button
              onClick={() => importOne(p)}
              disabled={pending && busyId === p.id}
              className="rounded px-3 py-1.5 text-xs font-bold text-inst-white disabled:opacity-60"
              style={{ background: "var(--color-inst-blue-bottom)" }}
            >
              {busyId === p.id ? "Importando…" : done[p.id] ? "Actualizar" : "Importar"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
