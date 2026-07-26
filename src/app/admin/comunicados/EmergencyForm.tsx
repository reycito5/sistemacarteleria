"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  activateEmergency,
  deactivateEmergency,
} from "@/lib/actions/emergency";

export interface ActiveEmergency {
  id: string;
  title: string;
  severity: string;
}

export function EmergencyForm({ active }: { active: ActiveEmergency | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [instructions, setInstructions] = useState("");
  const [severity, setSeverity] = useState<"alerta" | "urgente" | "critico">("urgente");

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await activateEmergency({ title, message, instructions, severity });
      if (!res.ok) setError(res.error);
      else {
        setTitle("");
        setMessage("");
        setInstructions("");
        setConfirm(false);
        router.refresh();
      }
    });
  };

  const deactivate = (id: string) => {
    setError(null);
    startTransition(async () => {
      const res = await deactivateEmergency(id);
      if (!res.ok) setError(res.error);
      else router.refresh();
    });
  };

  if (active) {
    return (
      <div
        className="rounded-md border-l-4 bg-white p-5"
        style={{ borderColor: "var(--color-inst-red)" }}
      >
        <p className="text-sm font-bold text-inst-red">
          ⚠ Emergencia activa en las cuatro pantallas
        </p>
        <p className="mt-1 text-lg font-extrabold text-inst-blue-top">{active.title}</p>
        <p className="text-xs text-panel-muted">Severidad: {active.severity}</p>
        {error && <p className="mt-2 text-sm text-inst-red">{error}</p>}
        <button
          onClick={() => deactivate(active.id)}
          disabled={pending}
          className="mt-4 rounded px-4 py-2 text-sm font-bold text-inst-white disabled:opacity-60"
          style={{ background: "var(--color-inst-blue-bottom)" }}
        >
          Desactivar y volver a la programación
        </button>
      </div>
    );
  }

  return (
    <div
      className="max-w-xl rounded-md border bg-white p-5"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      <div className="space-y-3">
        <Field label="Título del aviso">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border px-3 py-2 text-sm"
            style={{ borderColor: "var(--color-panel-border)" }}
          />
        </Field>
        <Field label="Mensaje">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            className="w-full rounded border px-3 py-2 text-sm"
            style={{ borderColor: "var(--color-panel-border)" }}
          />
        </Field>
        <Field label="Instrucciones">
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={2}
            className="w-full rounded border px-3 py-2 text-sm"
            style={{ borderColor: "var(--color-panel-border)" }}
          />
        </Field>
        <Field label="Severidad">
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as typeof severity)}
            className="w-full rounded border px-3 py-2 text-sm"
            style={{ borderColor: "var(--color-panel-border)" }}
          >
            <option value="alerta">Alerta</option>
            <option value="urgente">Urgente</option>
            <option value="critico">Crítico</option>
          </select>
        </Field>
      </div>

      {error && <p className="mt-3 text-sm text-inst-red">{error}</p>}

      <label className="mt-4 flex items-center gap-2 text-sm text-panel-ink">
        <input
          type="checkbox"
          checked={confirm}
          onChange={(e) => setConfirm(e.target.checked)}
        />
        Confirmo que deseo interrumpir las cuatro pantallas con este aviso.
      </label>

      <button
        onClick={submit}
        disabled={pending || !confirm || title.trim().length < 3}
        className="mt-4 rounded px-5 py-2.5 text-sm font-bold text-inst-white disabled:opacity-50"
        style={{ background: "var(--color-inst-red)" }}
      >
        Activar emergencia
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-panel-ink">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
