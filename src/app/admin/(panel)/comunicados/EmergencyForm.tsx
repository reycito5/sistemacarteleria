"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Siren } from "lucide-react";
import {
  activateEmergency,
  deactivateEmergency,
} from "@/lib/actions/emergency";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Badge } from "@/components/ui/Badge";

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
  const [severity, setSeverity] = useState<"alerta" | "urgente" | "critico">(
    "urgente",
  );

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = await activateEmergency({
        title,
        message,
        instructions,
        severity,
      });
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
      <Card className="border-danger/30">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[12px] bg-brand-red text-brand-white">
            <Siren size={20} aria-hidden />
          </span>
          <div className="min-w-0">
            <Badge tone="danger" dot>
              Emitiendo ahora en las 4 pantallas
            </Badge>
            <h2 className="mt-2 text-xl font-black leading-tight text-brand-ink">
              {active.title}
            </h2>
            <p className="mt-1 text-sm capitalize text-ui-muted">
              Severidad: {active.severity}
            </p>
          </div>
        </div>

        {error && (
          <Alert tone="danger" className="mt-4">
            {error}
          </Alert>
        )}

        <Button
          className="mt-5"
          size="lg"
          onClick={() => deactivate(active.id)}
          disabled={pending}
        >
          <CheckCircle2 size={17} aria-hidden />
          {pending ? "Desactivando…" : "Desactivar y volver a la programación"}
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader
        icon={<Siren size={18} />}
        title="Redactar un comunicado urgente"
        description="Al activarlo, este aviso tapa la programación de las cuatro pantallas de inmediato."
      />

      <div className="mt-6 space-y-5">
        <Field
          label="Título del aviso"
          htmlFor="em-title"
          required
          hint="Es el texto grande que se lee desde lejos. Sea breve y directo."
        >
          <Input
            id="em-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej.: Suspensión de actividades"
          />
        </Field>

        <Field
          label="Mensaje"
          htmlFor="em-message"
          hint="Explique la situación en una o dos frases."
        >
          <Textarea
            id="em-message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </Field>

        <Field
          label="Instrucciones"
          htmlFor="em-instructions"
          hint="Qué debe hacer quien lee el aviso."
        >
          <Textarea
            id="em-instructions"
            rows={3}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
          />
        </Field>

        <Field
          label="Severidad"
          htmlFor="em-severity"
          hint="Determina el color y el énfasis del aviso en pantalla."
        >
          <Select
            id="em-severity"
            value={severity}
            onChange={(e) => setSeverity(e.target.value as typeof severity)}
          >
            <option value="alerta">Alerta — informativo</option>
            <option value="urgente">Urgente — requiere atención</option>
            <option value="critico">Crítico — riesgo inmediato</option>
          </Select>
        </Field>
      </div>

      {error && (
        <Alert tone="danger" className="mt-5" title="No se pudo activar">
          {error}
        </Alert>
      )}

      <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-[12px] border border-danger/25 bg-danger-soft p-4">
        <input
          type="checkbox"
          checked={confirm}
          onChange={(e) => setConfirm(e.target.checked)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--color-brand-red)]"
        />
        <span className="text-sm font-semibold leading-relaxed text-danger">
          Confirmo que deseo interrumpir la programación de las cuatro pantallas
          con este aviso.
        </span>
      </label>

      <Button
        variant="danger"
        size="lg"
        className="mt-5"
        onClick={submit}
        disabled={pending || !confirm || title.trim().length < 3}
      >
        <Siren size={17} aria-hidden />
        {pending ? "Activando…" : "Activar comunicado urgente"}
      </Button>
    </Card>
  );
}
