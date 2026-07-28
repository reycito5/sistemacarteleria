"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  Check,
  Clock,
  Download,
  GraduationCap,
  Layers,
  RefreshCw,
} from "lucide-react";
import { importProgramAsDestacado } from "@/lib/actions/portal";
import type { PortalProgram } from "@/lib/integration/portal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { EmptyState } from "@/components/ui/EmptyState";

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
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setDone((d) => ({ ...d, [program.id]: true }));
      router.refresh();
    });
  };

  if (programs.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap size={26} />}
        title="El portal no devolvió programas"
        description="Revise arriba el detalle de los intentos de conexión para saber qué ruta falló."
      />
    );
  }

  return (
    <div>
      {error && (
        <Alert tone="danger" className="mb-4" title="No se pudo importar">
          {error}
        </Alert>
      )}

      <ul className="grid gap-3 md:grid-cols-2">
        {programs.map((p) => {
          const busy = pending && busyId === p.id;
          const imported = done[p.id];
          return (
            <li
              key={p.id}
              className="flex flex-col rounded-[14px] border border-ui-border bg-ui-surface p-4 transition hover:border-brand-ink-soft/30"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-extrabold leading-snug text-brand-ink">
                  {p.name}
                </h3>
                {imported && (
                  <Badge tone="ok">
                    <Check size={11} aria-hidden />
                    Importado
                  </Badge>
                )}
              </div>

              {p.slogan && (
                <p className="mt-1.5 text-xs italic leading-relaxed text-ui-muted">
                  “{p.slogan}”
                </p>
              )}

              <dl className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-ui-muted">
                {p.modality && (
                  <div className="flex items-center gap-1.5">
                    <Layers size={13} aria-hidden />
                    <span>{p.modality}</span>
                  </div>
                )}
                {p.startDate && (
                  <div className="flex items-center gap-1.5">
                    <CalendarDays size={13} aria-hidden />
                    <span>Inicio {p.startDate}</span>
                  </div>
                )}
                {p.durationMonths && (
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} aria-hidden />
                    <span>{p.durationMonths} meses</span>
                  </div>
                )}
                {p.credits && (
                  <div className="flex items-center gap-1.5">
                    <GraduationCap size={13} aria-hidden />
                    <span>{p.credits} créditos</span>
                  </div>
                )}
              </dl>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-ui-border pt-3">
                <Badge tone={p.enrollmentOpen ? "ok" : "neutral"} dot>
                  {p.enrollmentOpen ? "Inscripciones abiertas" : "Inscripciones cerradas"}
                </Badge>
                <Button
                  size="sm"
                  variant={imported ? "secondary" : "primary"}
                  onClick={() => importOne(p)}
                  disabled={busy}
                >
                  {busy ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" aria-hidden />
                      Importando…
                    </>
                  ) : imported ? (
                    <>
                      <RefreshCw size={14} aria-hidden />
                      Actualizar
                    </>
                  ) : (
                    <>
                      <Download size={14} aria-hidden />
                      Importar
                    </>
                  )}
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
