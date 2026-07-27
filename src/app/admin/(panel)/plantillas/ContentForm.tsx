"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Monitor, Plus, Save, Trash2 } from "lucide-react";
import { ScreenFrame } from "@/components/institutional/ScreenFrame";
import { ViewRenderer, isBareView } from "@/components/views/ViewRenderer";
import { viewContentSchema } from "@/lib/views/schemas";
import { FORM_SCHEMAS, type EditableKind } from "@/lib/views/formSchema";
import { createContentItem, updateContentItem } from "@/lib/actions/content";
import type { MediaOption } from "@/lib/data/admin";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Alert } from "@/components/ui/Alert";
import { Card } from "@/components/ui/Card";
import { MediaPicker, type SelectedMedia } from "./MediaPicker";

interface ContentFormProps {
  kind: EditableKind;
  mediaOptions: MediaOption[];
  /** Datos iniciales (modo edición) */
  initial?: Record<string, unknown>;
  /** Id del contenido (modo edición) */
  contentId?: string;
}

type Values = Record<string, unknown>;

function defaultsFor(kind: EditableKind): Values {
  const values: Values = {};
  for (const f of FORM_SCHEMAS[kind].fields) {
    if (f.type === "list") values[f.key] = [];
    else if (f.type === "media") values[f.key] = undefined;
    else values[f.key] = "";
  }
  return values;
}

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
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const setField = (key: string, value: unknown) =>
    setValues((v) => ({ ...v, [key]: value }));

  const setListItem = (
    key: string,
    idx: number,
    itemKey: string,
    value: string,
  ) =>
    setValues((v) => {
      const list = [...((v[key] as Record<string, string>[]) ?? [])];
      list[idx] = { ...list[idx], [itemKey]: value };
      return { ...v, [key]: list };
    });

  const addListItem = (key: string) =>
    setValues((v) => {
      const list = [...((v[key] as Record<string, string>[]) ?? [])];
      list.push({});
      return { ...v, [key]: list };
    });

  const removeListItem = (key: string, idx: number) =>
    setValues((v) => {
      const list = [...((v[key] as Record<string, string>[]) ?? [])];
      list.splice(idx, 1);
      return { ...v, [key]: list };
    });

  // Vista previa en vivo (nunca rompe: si es inválida, muestra aviso).
  const preview = useMemo(
    () => viewContentSchema.safeParse({ ...values, kind }),
    [values, kind],
  );

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
      {/* Editor */}
      <Card>
        <h2 className="text-base font-extrabold text-inst-blue-top">
          Contenido editable
        </h2>
        <p className="mt-1 text-sm text-ui-muted">
          Sólo textos, fechas y medios. La cabecera, el pie, los colores y la
          tipografía institucionales son fijos.
        </p>

        <div className="mt-6 space-y-5">
          {schema.fields.map((f) => {
            if (f.type === "text") {
              return (
                <Field key={f.key} label={f.label} htmlFor={`f-${f.key}`}>
                  <Input
                    id={`f-${f.key}`}
                    value={(values[f.key] as string) ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                </Field>
              );
            }

            if (f.type === "textarea") {
              return (
                <Field key={f.key} label={f.label} htmlFor={`f-${f.key}`}>
                  <Textarea
                    id={`f-${f.key}`}
                    rows={3}
                    value={(values[f.key] as string) ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                  />
                </Field>
              );
            }

            if (f.type === "media") {
              const current = values[f.key] as { assetId?: string } | undefined;
              return (
                <Field
                  key={f.key}
                  label={f.label}
                  hint="Elija un archivo ya subido a la biblioteca. Pulse sobre la miniatura seleccionada para quitarla."
                >
                  <MediaPicker
                    options={mediaOptions}
                    value={current}
                    onChange={(media: SelectedMedia | undefined) =>
                      setField(f.key, media)
                    }
                  />
                </Field>
              );
            }

            if (f.type !== "list") return null;

            const list = (values[f.key] as Record<string, string>[]) ?? [];
            return (
              <div key={f.key}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-ui-ink">
                    {f.label}
                  </span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => addListItem(f.key)}
                    disabled={list.length >= f.max}
                  >
                    <Plus size={14} aria-hidden />
                    Añadir ({list.length}/{f.max})
                  </Button>
                </div>

                {list.length === 0 ? (
                  <p className="mt-2 rounded-[10px] border border-dashed border-ui-border-strong bg-ui-raised px-3 py-3 text-xs text-ui-muted">
                    Sin elementos. Pulse «Añadir» para crear el primero.
                  </p>
                ) : (
                  <div className="mt-3 space-y-3">
                    {list.map((item, idx) => (
                      <div
                        key={idx}
                        className="rounded-[12px] border border-ui-border bg-ui-raised p-3.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="grid h-6 w-6 place-items-center rounded-full bg-info-soft text-[11px] font-black text-inst-blue-top">
                            {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeListItem(f.key, idx)}
                            className="inline-flex items-center gap-1.5 rounded-[8px] px-2 py-1 text-xs font-bold text-inst-red transition hover:bg-danger-soft"
                          >
                            <Trash2 size={12} aria-hidden />
                            Quitar
                          </button>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {f.itemFields.map((itf) => (
                            <Field
                              key={itf.key}
                              label={itf.label}
                              htmlFor={`f-${f.key}-${idx}-${itf.key}`}
                            >
                              <Input
                                id={`f-${f.key}-${idx}-${itf.key}`}
                                value={item[itf.key] ?? ""}
                                onChange={(e) =>
                                  setListItem(f.key, idx, itf.key, e.target.value)
                                }
                              />
                            </Field>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {error && (
          <Alert tone="danger" className="mt-5" title="No se pudo guardar">
            {error}
          </Alert>
        )}

        {!preview.success && (
          <Alert tone="info" className="mt-5">
            Complete los campos necesarios para habilitar el guardado. A la
            derecha verá la pantalla armándose en tiempo real.
          </Alert>
        )}

        <div className="mt-6 flex flex-wrap gap-2 border-t border-ui-border pt-5">
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
          <Button
            variant="ghost"
            size="lg"
            onClick={() => router.push("/admin/plantillas")}
            disabled={pending}
          >
            Cancelar
          </Button>
        </div>

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-ui-muted">
          <Monitor size={13} className="mt-0.5 shrink-0" aria-hidden />
          Al guardar, el contenido queda en <strong>borrador</strong>. Todavía no
          se ve en los televisores: hay que aprobarlo y añadirlo a la playlist.
        </p>
      </Card>

      {/* Vista previa en vivo */}
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
              <ScreenFrame bare={isBareView(preview.data)}>
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
                    Complete los campos de la izquierda para ver la pantalla.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
