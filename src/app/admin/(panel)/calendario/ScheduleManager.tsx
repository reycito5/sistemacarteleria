"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, ListChecks, Power, Trash2 } from "lucide-react";
import {
  createSchedule,
  deleteSchedule,
  toggleSchedule,
} from "@/lib/actions/schedule";
import type { ScheduleView } from "@/lib/data/admin";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

const DAYS = [
  { n: 1, label: "Lun" },
  { n: 2, label: "Mar" },
  { n: 3, label: "Mié" },
  { n: 4, label: "Jue" },
  { n: 5, label: "Vie" },
  { n: 6, label: "Sáb" },
  { n: 0, label: "Dom" },
];

const PRIORITIES = [
  { v: 30, label: "30 · Comunicado importante" },
  { v: 40, label: "40 · Campaña especial" },
  { v: 50, label: "50 · Programación general" },
  { v: 90, label: "90 · Contenido de respaldo" },
];

interface Props {
  playlists: { id: string; name: string; status: string }[];
  schedules: ScheduleView[];
}

function dayLabels(days: number[]): string {
  const map: Record<number, string> = {
    0: "Dom",
    1: "Lun",
    2: "Mar",
    3: "Mié",
    4: "Jue",
    5: "Vie",
    6: "Sáb",
  };
  return days.map((d) => map[d]).join(" · ");
}

export function ScheduleManager({ playlists, schedules }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [playlistId, setPlaylistId] = useState(playlists[0]?.id ?? "");
  const [priority, setPriority] = useState(50);
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [startAt, setStartAt] = useState("");
  const [endAt, setEndAt] = useState("");
  const [dailyStart, setDailyStart] = useState("");
  const [dailyEnd, setDailyEnd] = useState("");

  const toggleDay = (n: number) =>
    setDays((d) => (d.includes(n) ? d.filter((x) => x !== n) : [...d, n]));

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) => {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (!res.ok) setError(res.error ?? "Error");
      else router.refresh();
    });
  };

  const submit = () => {
    if (!playlistId) {
      setError("Seleccione una playlist.");
      return;
    }
    run(() =>
      createSchedule({
        playlistId,
        priority,
        daysOfWeek: days,
        startAt: startAt || null,
        endAt: endAt || null,
        dailyStart: dailyStart || null,
        dailyEnd: dailyEnd || null,
      }),
    );
  };

  return (
    <div className="space-y-6">
      {error && (
        <Alert tone="danger" title="No se pudo completar la operación">
          {error}
        </Alert>
      )}

      {/* Nueva programación */}
      <Card>
        <CardHeader
          icon={<CalendarPlus size={18} />}
          title="Nueva programación"
          description="Deje las fechas y horas en blanco para que se emita siempre en los días marcados."
        />

        {playlists.length === 0 ? (
          <Alert tone="warn" className="mt-5">
            No hay ninguna playlist todavía. Créela primero en{" "}
            <strong>Playlist general</strong>.
          </Alert>
        ) : (
          <div className="mt-6 space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Playlist" htmlFor="sch-playlist" required>
                <Select
                  id="sch-playlist"
                  value={playlistId}
                  onChange={(e) => setPlaylistId(e.target.value)}
                >
                  {playlists.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.status})
                    </option>
                  ))}
                </Select>
              </Field>

              <Field
                label="Prioridad"
                htmlFor="sch-priority"
                hint="Número más bajo, mayor prioridad ante coincidencias."
              >
                <Select
                  id="sch-priority"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p.v} value={p.v}>
                      {p.label}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>

            <Field
              label="Días de la semana"
              hint="Pulse para activar o desactivar cada día."
            >
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => {
                  const on = days.includes(d.n);
                  return (
                    <button
                      key={d.n}
                      type="button"
                      onClick={() => toggleDay(d.n)}
                      aria-pressed={on}
                      className={[
                        "h-9 w-14 rounded-[10px] text-sm font-bold transition",
                        on
                          ? "bg-brand-ink-deep text-brand-white shadow-[var(--shadow-ui-sm)]"
                          : "border border-ui-border-strong text-ui-muted hover:border-brand-ink-soft/40 hover:text-ui-ink",
                      ].join(" ")}
                    >
                      {d.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Hora de inicio (diaria)" htmlFor="sch-dstart">
                <Input
                  id="sch-dstart"
                  type="time"
                  value={dailyStart}
                  onChange={(e) => setDailyStart(e.target.value)}
                />
              </Field>
              <Field label="Hora de fin (diaria)" htmlFor="sch-dend">
                <Input
                  id="sch-dend"
                  type="time"
                  value={dailyEnd}
                  onChange={(e) => setDailyEnd(e.target.value)}
                />
              </Field>
              <Field label="Vigente desde" htmlFor="sch-start">
                <Input
                  id="sch-start"
                  type="date"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                />
              </Field>
              <Field label="Vigente hasta" htmlFor="sch-end">
                <Input
                  id="sch-end"
                  type="date"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                />
              </Field>
            </div>

            <Button onClick={submit} disabled={pending} size="lg">
              <CalendarPlus size={17} aria-hidden />
              {pending ? "Programando…" : "Programar"}
            </Button>
          </div>
        )}
      </Card>

      {/* Programaciones existentes */}
      <Card flush>
        <div className="border-b border-ui-border p-5 sm:p-6">
          <CardHeader
            icon={<ListChecks size={18} />}
            title={`Programaciones (${schedules.length})`}
            description="Sólo las activas se tienen en cuenta al decidir qué se emite."
          />
        </div>

        <div className="p-5 sm:p-6">
          {schedules.length === 0 ? (
            <EmptyState
              icon={<ListChecks size={26} />}
              title="Sin programaciones"
              description="Mientras no exista ninguna, los televisores emiten la playlist publicada durante todo el día."
            />
          ) : (
            <ul className="divide-y divide-ui-border rounded-[12px] border border-ui-border">
              {schedules.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center gap-4 p-4 transition hover:bg-ui-raised"
                >
                  <div className="min-w-[200px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-extrabold text-brand-ink">
                        {s.playlistName}
                      </p>
                      <Badge tone="neutral">Prioridad {s.priority}</Badge>
                      <Badge tone={s.active ? "ok" : "neutral"} dot>
                        {s.active ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-ui-muted">
                      {s.daysOfWeek.length
                        ? dayLabels(s.daysOfWeek)
                        : "Todos los días"}
                      {s.dailyStart && ` · ${s.dailyStart}–${s.dailyEnd ?? ""}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => run(() => toggleSchedule(s.id, !s.active))}
                      disabled={pending}
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-ui-border-strong px-2.5 py-1 text-xs font-bold text-brand-ink transition hover:border-brand-ink-soft/45 hover:bg-info-soft disabled:opacity-50"
                    >
                      <Power size={13} aria-hidden />
                      {s.active ? "Desactivar" : "Activar"}
                    </button>
                    <button
                      type="button"
                      onClick={() => run(() => deleteSchedule(s.id))}
                      disabled={pending}
                      className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-xs font-bold text-brand-red transition hover:bg-danger-soft disabled:opacity-50"
                    >
                      <Trash2 size={13} aria-hidden />
                      Eliminar
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}
