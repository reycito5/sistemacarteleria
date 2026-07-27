"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { MonitorCheck } from "lucide-react";
import { activateScreen } from "@/lib/actions/screen";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";

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
    <div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Código" htmlFor="act-code" required>
          <Input
            id="act-code"
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            maxLength={6}
            placeholder="000000"
            className="ui-tnum text-center text-lg font-bold tracking-[0.3em]"
          />
        </Field>

        <Field label="Nombre" htmlFor="act-name">
          <Input
            id="act-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pantalla 1"
          />
        </Field>

        <Field label="Ubicación" htmlFor="act-location">
          <Input
            id="act-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Recepción"
          />
        </Field>
      </div>

      {error && (
        <Alert tone="danger" className="mt-4" title="No se pudo activar">
          {error}
        </Alert>
      )}
      {ok && (
        <Alert tone="ok" className="mt-4" title="Pantalla activada">
          Ya forma parte del grupo general y empezará a recibir la programación
          publicada.
        </Alert>
      )}

      <Button
        className="mt-5"
        onClick={submit}
        disabled={pending || activationCode.length < 6}
        size="lg"
      >
        <MonitorCheck size={17} aria-hidden />
        {pending ? "Activando…" : "Activar y asignar"}
      </Button>
    </div>
  );
}
