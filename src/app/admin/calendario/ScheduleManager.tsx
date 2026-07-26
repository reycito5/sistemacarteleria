"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createSchedule,
  deleteSchedule,
  toggleSchedule,
} from "@/lib/actions/schedule";
import type { ScheduleView } from "@/lib/data/admin";

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
    <div className="space-y-8">
      {error && <p className="text-sm text-inst-red">{error}</p>}

      {/* Formulario */}
      <section
        className="max-w-2xl rounded-md border bg-white p-5"
        style={{ borderColor: "var(--color-panel-border)" }}
      >
        <h2 className="text-sm font-bold text-panel-ink">Nueva programación</h2>

        {playlists.length === 0 ? (
          <p className="mt-3 text-sm text-panel-muted">
            No hay playlists. Cree una en «Playlist general» primero.
          </p>
        ) : (
          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="block text-sm font-semibold text-panel-ink">Playlist</span>
              <select
                value={playlistId}
                onChange={(e) => setPlaylistId(e.target.value)}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                style={{ borderColor: "var(--color-panel-border)" }}
              >
                {playlists.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.status})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="block text-sm font-semibold text-panel-ink">Prioridad</span>
              <select
                value={priority}
                onChange={(e) => setPriority(Number(e.target.value))}
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                style={{ borderColor: "var(--color-panel-border)" }}
              >
                {PRIORITIES.map((p) => (
                  <option key={p.v} value={p.v}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="block text-sm font-semibold text-panel-ink">Días</span>
              <div className="mt-2 flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <button
                    key={d.n}
                    type="button"
                    onClick={() => toggleDay(d.n)}
                    className="rounded px-3 py-1.5 text-sm font-semibold"
                    style={
                      days.includes(d.n)
                        ? { background: "var(--color-inst-blue-bottom)", color: "#fff" }
                        : { border: "1px solid var(--color-panel-border)", color: "#1b1f2a" }
                    }
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <TimeField label="Hora diaria inicio" value={dailyStart} onChange={setDailyStart} />
              <TimeField label="Hora diaria fin" value={dailyEnd} onChange={setDailyEnd} />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <DateField label="Vigente desde" value={startAt} onChange={setStartAt} />
              <DateField label="Vigente hasta" value={endAt} onChange={setEndAt} />
            </div>

            <button
              onClick={submit}
              disabled={pending}
              className="rounded px-5 py-2.5 text-sm font-bold text-inst-white disabled:opacity-60"
              style={{ background: "var(--color-inst-blue-bottom)" }}
            >
              Programar
            </button>
          </div>
        )}
      </section>

      {/* Listado */}
      <section>
        <h2 className="text-sm font-bold text-panel-ink">Programaciones</h2>
        {schedules.length === 0 ? (
          <p className="mt-3 text-sm text-panel-muted">Aún no hay programaciones.</p>
        ) : (
          <ul
            className="mt-3 divide-y rounded-md border bg-white"
            style={{ borderColor: "var(--color-panel-border)" }}
          >
            {schedules.map((s) => (
              <li key={s.id} className="flex flex-wrap items-center gap-4 px-4 py-3">
                <div className="flex-1">
                  <p className="text-sm font-bold text-inst-blue-top">
                    {s.playlistName}{" "}
                    <span className="text-xs font-normal text-panel-muted">
                      · prioridad {s.priority}
                    </span>
                  </p>
                  <p className="text-xs text-panel-muted">
                    {s.daysOfWeek.length ? dayLabels(s.daysOfWeek) : "Todos los días"}
                    {s.dailyStart && ` · ${s.dailyStart}–${s.dailyEnd ?? ""}`}
                  </p>
                </div>
                <span
                  className="text-xs font-bold"
                  style={{ color: s.active ? "#137333" : "#5b6172" }}
                >
                  {s.active ? "Activa" : "Inactiva"}
                </span>
                <button
                  onClick={() => run(() => toggleSchedule(s.id, !s.active))}
                  disabled={pending}
                  className="text-xs font-bold text-inst-blue-top"
                >
                  {s.active ? "Desactivar" : "Activar"}
                </button>
                <button
                  onClick={() => run(() => deleteSchedule(s.id))}
                  disabled={pending}
                  className="text-xs font-bold text-inst-red"
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function dayLabels(days: number[]): string {
  const map: Record<number, string> = { 0: "Dom", 1: "Lun", 2: "Mar", 3: "Mié", 4: "Jue", 5: "Vie", 6: "Sáb" };
  return days.map((d) => map[d]).join(" ");
}

function TimeField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-panel-ink">{label}</span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border px-3 py-2 text-sm"
        style={{ borderColor: "var(--color-panel-border)" }}
      />
    </label>
  );
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-panel-ink">{label}</span>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded border px-3 py-2 text-sm"
        style={{ borderColor: "var(--color-panel-border)" }}
      />
    </label>
  );
}
