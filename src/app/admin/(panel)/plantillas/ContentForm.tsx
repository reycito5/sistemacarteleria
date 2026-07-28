"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  Monitor,
  Save,
} from "lucide-react";
import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { ViewRenderer, screenModeFor } from "@/components/views/ViewRenderer";
import { viewContentSchema } from "@/lib/views/schemas";
import { FORM_SCHEMAS, fieldsOf, type EditableKind } from "@/lib/views/formSchema";
import { createContentItem, updateContentItem } from "@/lib/actions/content";
import type { MediaOption } from "@/lib/data/admin";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { FieldRenderer } from "./FieldRenderer";

interface ContentFormProps {
  kind: EditableKind;
  mediaOptions: MediaOption[];
  /** Datos iniciales (modo edición). */
  initial?: Record<string, unknown>;
  /** Id del contenido (modo edición). */
  contentId?: string;
}

type Values = Record<string, unknown>;

/** Valores iniciales vacíos coherentes con el tipo de cada campo. */
function defaultsFor(kind: EditableKind): Values {
  const values: Values = {};
  for (const f of fieldsOf(kind)) {
    if (f.type === "list") values[f.key] = [];
    else if (f.type === "media") values[f.key] = undefined;
    else if (f.type === "boolean") values[f.key] = true;
    else if (f.type === "select") values[f.key] = f.options[0]?.value ?? "";
    else values[f.key] = "";
  }
  return values;
}

/**
 * Asistente de contenido.
 *
 * Recorre los pasos declarados por la plantilla —portada, datos, cierre…— con
 * la vista previa del televisor siempre a la vista, y remata con un paso de
 * revisión antes de guardar. Los pasos salen del descriptor de la plantilla,
 * así que añadir un campo allí lo hace editable aquí sin tocar este archivo.
 */
export function ContentForm({
  kind,
  mediaOptions,
  initial,
  contentId,
}: ContentFormProps) {
  const router = useRouter();
  const schema = FORM_SCHEMAS[kind];

  const [values, setValues] = useState<Values>({
    ...defaultsFor(kind),
    ...(initial ?? {}),
  });
  const [stepIndex, setStepIndex] = useState(0);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const setField = (key: string, value: unknown) =>
    setValues((v) => ({ ...v, [key]: value }));

  // Vista previa en vivo: si el contenido aún no es válido se avisa, no rompe.
  const preview = useMemo(
    () => viewContentSchema.safeParse({ ...values, kind }),
    [values, kind],
  );

  const steps = schema.steps;
  const reviewIndex = steps.length;
  const isReview = stepIndex === reviewIndex;
  const current = steps[stepIndex];
  const totalSteps = steps.length + 1;

  const submit = () => {
    setError(null);
    startTransition(async () => {
      const res = contentId
        ? await updateContentItem(contentId, kind, values)
        : await createContentItem(kind, values);
      if (!res.ok) setError(res.error);
      else router.push("/admin/plantillas");
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ---------------- Asistente ---------------- */}
      <div>
        {/* Barra de pasos */}
        <ol className="mb-5 flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {[...steps.map((s) => s.title), "Revisar"].map((title, i) => {
            const done = i < stepIndex;
            const active = i === stepIndex;
            return (
              <li key={title} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setStepIndex(i)}
                  aria-current={active ? "step" : undefined}
                  className={[
                    "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition",
                    active
                      ? "bg-inst-blue-bottom text-inst-white"
                      : done
                        ? "bg-ok-soft text-ok hover:bg-ok/15"
                        : "border border-ui-border-strong text-ui-muted hover:text-ui-ink",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "grid h-4 w-4 place-items-center rounded-full text-[10px]",
                      active
                        ? "bg-white/25"
                        : done
                          ? "bg-ok text-white"
                          : "bg-ui-border text-ui-muted",
                    ].join(" ")}
                  >
                    {done ? <Check size={10} strokeWidth={3} /> : i + 1}
                  </span>
                  {title}
                </button>
                {i < totalSteps - 1 && (
                  <span aria-hidden className="text-ui-border-strong">
                    ·
                  </span>
                )}
              </li>
            );
          })}
        </ol>

        <Card>
          {isReview ? (
            <>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-inst-gold">
                Paso {totalSteps} de {totalSteps}
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-inst-blue-top">
                Revisar y guardar
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ui-muted">
                Compruebe la vista previa de la derecha: así se verá en los
                cuatro televisores.
              </p>

              <dl className="mt-5 divide-y divide-ui-border rounded-[12px] border border-ui-border">
                {steps.map((s) => {
                  const filled = s.fields.filter((f) => {
                    const v = values[f.key];
                    if (Array.isArray(v)) return v.length > 0;
                    if (typeof v === "boolean") return true;
                    return Boolean(v);
                  }).length;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <dt className="text-sm font-semibold text-ui-ink">
                        {s.title}
                      </dt>
                      <dd className="text-xs text-ui-muted">
                        {filled} de {s.fields.length} campos
                      </dd>
                    </div>
                  );
                })}
              </dl>

              {!preview.success && (
                <Alert tone="warn" className="mt-5" title="Falta información">
                  Vuelva a los pasos marcados y complete los campos
                  imprescindibles para poder guardar.
                </Alert>
              )}

              {error && (
                <Alert tone="danger" className="mt-5" title="No se pudo guardar">
                  {error}
                </Alert>
              )}

              <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ui-muted">
                <Monitor size={13} className="mt-0.5 shrink-0" aria-hidden />
                Al guardar, el contenido queda en <strong>borrador</strong>.
                Todavía no se ve en los televisores: hay que aprobarlo y
                añadirlo a la playlist.
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-inst-gold">
                Paso {stepIndex + 1} de {totalSteps}
              </p>
              <h2 className="mt-1 text-lg font-extrabold text-inst-blue-top">
                {current.title}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ui-muted">
                {current.description}
              </p>

              <div className="mt-6 space-y-5">
                {current.fields.map((f) => (
                  <FieldRenderer
                    key={f.key}
                    field={f}
                    values={values}
                    mediaOptions={mediaOptions}
                    onChange={setField}
                  />
                ))}
              </div>
            </>
          )}

          {/* Navegación */}
          <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-ui-border pt-5">
            {stepIndex > 0 && (
              <Button
                variant="secondary"
                onClick={() => setStepIndex((i) => i - 1)}
                disabled={pending}
              >
                <ArrowLeft size={16} aria-hidden />
                Anterior
              </Button>
            )}

            {isReview ? (
              <Button
                onClick={submit}
                disabled={pending || !preview.success}
                size="lg"
              >
                <Save size={17} aria-hidden />
                {pending
                  ? "Guardando…"
                  : contentId
                    ? "Guardar cambios"
                    : "Crear contenido"}
              </Button>
            ) : (
              <Button onClick={() => setStepIndex((i) => i + 1)} size="lg">
                Siguiente
                <ArrowRight size={17} aria-hidden />
              </Button>
            )}

            <Button
              variant="ghost"
              onClick={() => router.push("/admin/plantillas")}
              disabled={pending}
            >
              Cancelar
            </Button>
          </div>
        </Card>
      </div>

      {/* ---------------- Vista previa ---------------- */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <Card>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-info-soft text-inst-blue-top">
              <Eye size={18} aria-hidden />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-inst-blue-top">
                Vista previa en vivo
              </h2>
              <p className="text-xs text-ui-muted">
                Así se verá en los televisores (1920×1080).
              </p>
            </div>
          </div>

          <div className="relative mt-4 aspect-video w-full overflow-hidden rounded-[12px] border border-ui-border bg-black shadow-[var(--shadow-ui)]">
            {preview.success ? (
              <ScreenFrame {...screenModeFor(preview.data)}>
                <ViewRenderer content={preview.data} />
              </ScreenFrame>
            ) : (
              <div className="absolute inset-0 grid place-items-center bg-ui-canvas px-6 text-center">
                <div>
                  <Eye size={28} className="mx-auto text-ui-faint" aria-hidden />
                  <p className="mt-2 text-sm font-semibold text-ui-ink">
                    Falta información
                  </p>
                  <p className="mt-1 text-xs text-ui-muted">
                    Complete los campos del paso actual para ver la pantalla.
                  </p>
                </div>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs leading-relaxed text-ui-muted">
            La cabecera, el rótulo y el pie son institucionales: se editan una
            sola vez en «Identidad institucional», no en cada plantilla.
          </p>
        </Card>
      </div>
    </div>
  );
}
