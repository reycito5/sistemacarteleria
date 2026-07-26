"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { activateScreen } from "@/lib/actions/screen";

/** Formulario de confirmación de activación de una pantalla (sección 22). */
export function ActivateScreenForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [activationCode, setActivationCode] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const submit = () => {
    setError(null);
    setOk(false);
    startTransition(async () => {
      const res = await activateScreen({ activationCode, name, location });
      if (!res.ok) setError(res.error);
      else {
        setOk(true);
        setActivationCode("");
        setName("");
        setLocation("");
        router.refresh();
      }
    });
  };

  return (
    <div
      className="rounded-md border bg-white p-5"
      style={{ borderColor: "var(--color-panel-border)" }}
    >
      <h2 className="text-sm font-bold text-panel-ink">Activar una pantalla</h2>
      <p className="mt-1 text-xs text-panel-muted">
        Introduzca el código de 6 dígitos que muestra el reproductor y asígnele nombre
        y ubicación.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <input
          value={activationCode}
          onChange={(e) => setActivationCode(e.target.value)}
          inputMode="numeric"
          maxLength={6}
          placeholder="Código (000000)"
          className="rounded border px-3 py-2 text-sm tabular-nums"
          style={{ borderColor: "var(--color-panel-border)" }}
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre (p. ej. Pantalla 1 — Recepción)"
          className="rounded border px-3 py-2 text-sm"
          style={{ borderColor: "var(--color-panel-border)" }}
        />
        <input
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ubicación"
          className="rounded border px-3 py-2 text-sm"
          style={{ borderColor: "var(--color-panel-border)" }}
        />
      </div>
      {error && <p className="mt-3 text-sm text-inst-red">{error}</p>}
      {ok && <p className="mt-3 text-sm text-green-700">Pantalla activada y añadida al grupo general.</p>}
      <button
        onClick={submit}
        disabled={pending}
        className="mt-4 rounded px-5 py-2.5 text-sm font-bold text-inst-white disabled:opacity-60"
        style={{ background: "var(--color-inst-blue-bottom)" }}
      >
        {pending ? "Activando…" : "Activar y asignar"}
      </button>
    </div>
  );
}
